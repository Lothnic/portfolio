---
slug: vllmini_architecture
title: "vllmini: Building a Minimal LLM Inference Engine in PyTorch"
date: "2026-04-01"
category: "systems"
excerpt: "A from-scratch PyTorch inference engine for Llama, Qwen, and Mistral — covering meta-device weight loading, FlashAttention, KV caching, streaming generation, and 4-bit NF4 quantization."
---

**vllmini** is my take on the  implementation of a vLLM-style inference engine,  which is built from scratch in PyTorch to help me understand what actually happens inside a modern LLM serving stack at the basic level. It currently supports Llama 2/3 and derivatives, Qwen 2/3, and Mistral with FlashAttention, KV caching, streaming output, a stateless sampler, and optional 4-bit NF4 quantization.

The whole engine is a few hundred lines of Python. There's no `transformers` model class underneath and the decoder is written by hand.

### The layering

The project splits into three layers that mirror how production engines are organized:

```
vllmini/
├── main.py                  # CLI chat loop (multi-turn, streaming, argparse)
├── benchmark.py             # Performance harness (TTFT, ITL, tok/s, VRAM)
├── engine/
│   ├── generator.py         # Single-sequence generation loop (yield-based)
│   ├── sampler.py           # Stateless sampler (temperature, top-k, top-p and greedy)
│   └── sampling_params.py   # SamplingParams dataclass - config travels with the request
└── models/
    ├── base.py              # CausalLM ABC - the engine never looks inside the model
    ├── attention.py         # Attention + FlashAttention (SDPA) + RoPE utilities
    ├── llama.py             # LlamaConfig, RMSNorm, RotaryEmbedding, MLP, TransformerBlock, LlamaForCausalLM
    ├── qwen3.py             # QwenAttention (+ QK-norm), QwenTransformerBlock, QwenForCausalLM
    └── weight_loader.py     # HF download, config parse, meta-device init, weight mapping, model registry
```

The key interface is the `CausalLM` ABC in `models/base.py`. It defines one `forward(input_ids, position_ids, past_key_values) -> (logits, present_key_values)` contract, and everything above it such as generator, sampler, CLI treats the model as a black box. Adding a new architecture means writing a new model class and registering it in the loader; the engine stays the same.

### Loading weights without blowing up memory

#### Small Glossary on weights of models
Almost everything (parameters, gradients, activations optimizer states) are stored as floating point numbers. Majorly these are used during LLM training and inference : 

- FP32 - Full precision with 32 bits (4 Bytes) per value/number
- FP16 - half precision with 16 bits (2 Bytes) per value/number
- BF16 - **Brain Floating Point 16**, 16 bits (2 bytes) per value. 

<details>
<summary>More Info About BF16</summary>

Developed by Google Brain. It keeps the same 8-bit exponent as FP32 (so the same dynamic range) but truncates the mantissa to 7 bits (vs. FP16's 10 bits). The tradeoff: slightly lower precision for individual values, but far fewer numerical stability issues. BF16 is often "free" on modern NVIDIA GPUs (Ampere and newer) and AMD MI200+ because the hardware converts on-the-fly. For inference, it's usually indistinguishable from FP32 in output quality while giving you the full 2× memory savings.

</details>

- INT8 - 8 bits (1 Byte) per value/number

Memory usage can be calculated as

```
get_memory_usage(parameters) = parameters * Bytes_per_number
```

Sp loading a 7B model naively means holding a CPU copy of the FP32 checkpoint while also allocating the GPU copy which doubles the peak memory, which OOMs an 8GB card as 7B\*4 bytes = 28 GB of VRAM . The loader fixes this in two steps:

1. **Meta-device init** : the model is instantiated inside `torch.device("meta")`, so the full graph exists (correct shapes, dtypes) but the memory allocated is zero.

2. **Sharded safetensors load with `assign=True`** : shards are streamed one at a time and written directly into the meta tensors with `load_state_dict(assign=True)`, which skips the intermediate copy.

```python
with torch.device("meta"):
    model = model_class(config)          # zero-alloc graph

state_dict = {}
for shard in shard_paths:                # one shard at a time
    state_dict.update(safetensors.torch.load_file(shard))
model.load_state_dict(state_dict, assign=True)  # direct write, no extra copy
```

A `MODEL_REGISTRY` is used to map HF `model_type` strings ("llama", "qwen3", "mistral") to model classes, and a key-remapping step translates HF checkpoint names (`model.layers.0.self_attn.q_proj.weight`) into the engine's internal names (`layers.0.attn.q_proj.weight`).
### Attention and the KV cache

Attention is where the real serving magic lives. The `FlashAttention` class is a thin subclass of `Attention` that overrides only the core scoring step with `F.scaled_dot_product_attention` which is the PyTorch's fused attention that dispatches to FlashAttention-2 kernels on CUDA. I did write Attention just like GPT2 but the very significant gains forced me to use this directly.

The RoPE buffers (`cos_cached`/`sin_cached`) are computed once in a single `RotaryEmbedding` instance and **shared across all layers**, so 32+ layers don't each hold their own copy.

The KV cache is a plain list of per-layer `(k, v)` tuples threaded through the forward pass. On the first call the whole prompt is prefilled; every later call passes only the last token plus the cache:

```python
if past_key_values is None:
    logits, past_key_values = self.model(input_ids, position_ids=None)
else:
    logits, past_key_values = self.model(input_ids[:, -1:], position_ids=None, past_key_values=past_key_values)
```

Qwen3 was the interesting one to add: it's structurally Llama but with QK-norm i.e RMSNorm applied to the Q and K heads *before* RoPE, so `QwenAttention` use the Llama attention as the parent class and just inserts the two norm layers.

### Streaming generation with `yield`

This wasn't necessarily needed but it just looks better when the response is streamed instead of printing the whole output at once.

The generator is a Python generator: `generate()` which lazily produces one token at a time and suspends between tokens, so the caller gets real-time streaming for free, the same mechanism production servers use for SSE.

```python
full_text = self.tokenizer.decode(input_ids[0, prompt_len:], skip_special_tokens=True)
new_text = full_text[len(prev_text):]
prev_text = full_text
if new_text:
    yield new_text
```

### A stateless sampler

When the neural network completes a forward pass, it returns a score (logit) for every word/token in the vocabulary. The sampler processes these logits using sampling strategies to pick the next token ID.

The sampler used to hold `temperature`/`top_p`/`top_k` as constructor arguments. That breaks under continuous batching, where different requests in the same batch need different sampling configs. The sampler object holds no internal configuration state. Instead, parameters are encapsulated in a `SamplingParams` dataclass that travels with each request, `Sampler.sample(logits, params)` takes the config at call time. One shared sampler instance, per-request config:

```python
@dataclass
class SamplingParams:
    temperature: float = 1.0
    top_p: float = 1.0
    top_k: int = 0
```

### 4-bit NF4 quantization

To run 7B models on an 8GB GPU, `--quantize` swaps every attention and MLP projection from `nn.Linear` to `bitsandbytes.nn.Linear4bit` via a factory in `models/base.py`:

```python
def get_linear_layer(in_features, out_features, bias, quantize=False):
    if quantize:
        import bitsandbytes as bnb
        return bnb.nn.Linear4bit(
            in_features, out_features, bias=bias,
            compute_dtype=torch.bfloat16, quant_type="nf4",
        )
    return nn.Linear(in_features, out_features, bias=bias)
```

The key insight: 4-bit isn't truncation. It is actually  a compressed encoding. Each weight is stored as a 4-bit index into a per-block codebook, and dequantized on the fly during matmuls (`dequantized = codebook[index] × scale + zero_point`). Weights are *stored* in 4-bit, but  the computations has to be performed in BF16. The quantized path also loads shard-by-shard with aggressive cleanup (`del` + `gc.collect()` + `cuda.empty_cache()`) because per-parameter quantization on a 7B model is tight on 8GB. Embeddings, RMSNorm, and the LM head stay full precision which is standard practice, since the bulk of parameters live in the projections.
### Benchmarking it

`benchmark.py` measures what actually matters for serving:

- **TTFT** — time to first token (the prefill forward pass)
- **Avg ITL** — inter-token latency across the decode loop
- **Throughput** — tokens/sec end to end
- **Peak VRAM** — `torch.cuda.max_memory_allocated()`

It runs a short warmup generation first to JIT the SDPA kernels, then times a greedy run for consistency.

### What's next

The engine is single-sequence for now, continuous batching with a scheduler and  then **PagedAttention** which is the block-based KV cache with a block table that's vLLM's signature innovation, then an OpenAI-compatible HTTP API. Maybe even speculative decoding, and tensor parallelism. 

The interesting part of this project is that it's the same architecture as production vLLM which is just small enough to read in an afternoon.
