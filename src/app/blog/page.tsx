import Link from "next/link";
import { posts } from "@/data/posts";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ThemeRoot } from "@/components/theme";
import { ThemedHeroCanvas } from "@/components/ThemedHeroCanvas";
import { BlogHeader } from "@/components/BlogHeader";

export default function BlogIndex() {
  return (
    <ThemeRoot className="blog-essay min-h-[100dvh] bg-[var(--hw-bg)]">
      <ThemedHeroCanvas />
      <main className="relative z-2 mx-auto max-w-[1080px] px-[var(--hw-gutter)] py-[calc(30*var(--u))]">
        <BlogHeader />

        {/* Title Section */}
        <div className="flex flex-col gap-[calc(12*var(--u))] mt-[calc(90*var(--u))] mb-[calc(70*var(--u))]">
          <h1 className="font-fraunces font-medium text-[clamp(2.4rem,calc(72*var(--u)),4rem)] leading-none text-[var(--hw-fg)] tracking-[-0.015em] normal-case">
            notes
          </h1>
          <p className="font-fraunces italic text-[clamp(1rem,calc(22*var(--u)),1.25rem)] text-[var(--hw-fg)] opacity-60 normal-case">
            writing about language models, CUDA, and systems engineering
          </p>
        </div>

        {/* Dedicated Posts Timeline */}
        <div className="flex flex-col">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-[calc(10*var(--u))] py-[calc(28*var(--u))] border-b border-[var(--hw-fg)]/10 transition-colors"
            >
              <div className="flex items-center gap-[calc(14*var(--u))] hw-mono text-[var(--hw-text-eyebrow)] opacity-50 normal-case">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.category}</span>
              </div>

              <div className="flex flex-col gap-[calc(8*var(--u))]">
                <h2 className="font-fraunces font-medium text-[clamp(1.3rem,calc(38*var(--u)),1.9rem)] leading-tight text-[var(--hw-fg)] group-hover:text-[var(--hw-accent)] transition-colors normal-case">
                  {post.title}
                </h2>
                <p className="font-roboto-mono text-[clamp(0.85rem,calc(17*var(--u)),1rem)] leading-relaxed text-[var(--hw-fg)] opacity-75 group-hover:opacity-90 transition-opacity normal-case">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer separator line */}
        <div className="mt-[calc(100*var(--u))] border-t border-[var(--hw-fg)]/10 pt-[calc(30*var(--u))] text-center">
          <p className="hw-mono text-[var(--hw-text-eyebrow)] opacity-40 leading-none">
            ~ ~ ~ ~ ~ ~ ~
          </p>
          <p className="hw-mono text-[var(--hw-text-eyebrow)] opacity-40 mt-[calc(16*var(--u))]">
            &copy; {new Date().getFullYear()} Mayank Joshi
          </p>
        </div>
      </main>

      <GrainOverlay />
      <div className="hw-frame" aria-hidden="true" />
    </ThemeRoot>
  );
}
