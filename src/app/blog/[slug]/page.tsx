"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { posts } from "@/data/posts";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ThemeRoot } from "@/components/theme";
import { ThemedHeroCanvas } from "@/components/ThemedHeroCanvas";
import { BlogHeader } from "@/components/BlogHeader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { common } from "lowlight";
import cpp from "highlight.js/lib/languages/cpp";
import "katex/dist/katex.min.css";

// "cuda" is not in highlight.js's default common subset — map it to the C++ grammar.
// Merge it with the common set: passing only { cuda: cpp } would REPLACE all
// common languages (python, bash, c, ...) instead of extending them.
const highlightLanguages = { ...common, cuda: cpp };

// --- Table of contents helpers ---------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

type TocEntry = { level: number; text: string; id: string };

function extractToc(content: string): TocEntry[] {
  return content
    .split("\n")
    .map((line) => {
      const m = line.match(/^(#{2,3})\s+(.+)$/);
      if (!m) return null;
      const level = m[1].length;
      // Strip inline markdown formatting from the heading text for display.
      const text = m[2].replace(/[*`_[\]]/g, "").trim();
      return { level, text, id: slugify(text) };
    })
    .filter((e): e is TocEntry => e !== null);
}

const textClasses =
  "font-roboto-mono text-[clamp(0.95rem,calc(19*var(--u)),1.1rem)] leading-[1.85] text-[var(--hw-fg)] opacity-90 normal-case";

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className={`${textClasses} mb-[calc(26*var(--u))]`}>{children}</p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-bold">{children}</strong>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2
      id={slugify(textOf(children))}
      className="font-fraunces font-medium italic text-[clamp(1.5rem,calc(38*var(--u)),2.1rem)] leading-tight text-[var(--hw-heading)] mt-[calc(60*var(--u))] mb-[calc(20*var(--u))] normal-case scroll-mt-[calc(60*var(--u))]"
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3
      id={slugify(textOf(children))}
      className="font-fraunces font-medium italic text-[clamp(1.25rem,calc(30*var(--u)),1.7rem)] leading-tight text-[var(--hw-heading)] mt-[calc(46*var(--u))] mb-[calc(16*var(--u))] normal-case scroll-mt-[calc(60*var(--u))]"
    >
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: ReactNode }) => (
    <h4 className="font-fraunces font-medium text-[clamp(1.1rem,calc(26*var(--u)),1.5rem)] leading-tight text-[var(--hw-fg)] mt-8 mb-3 normal-case">
      {children}
    </h4>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className={`${textClasses} list-disc pl-6 my-[calc(20*var(--u))] flex flex-col gap-[calc(10*var(--u))]`}>
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className={`${textClasses} list-decimal pl-6 my-[calc(20*var(--u))] flex flex-col gap-[calc(10*var(--u))]`}>
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => <li className="mb-0.5">{children}</li>,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      className="text-[var(--hw-accent)] underline underline-offset-4 hover:opacity-80"
    >
      {children}
    </a>
  ),
  // Inline code chips are styled globally (.portfolio-web code:not(pre code)) —
  // light tinted bg + mono, like the reference. Block code (inside <pre>) keeps
  // its hljs classes and is left to the pre wrapper.
  code: ({ node, children }: { node?: unknown; children?: ReactNode }) => {
    const props = (node as { properties?: { className?: string | string[] } } | undefined)?.properties;
    const cls = Array.isArray(props?.className) ? props.className.join(" ") : String(props?.className ?? "");
    const isBlock = /\bhljs\b|language-/.test(cls);
    if (isBlock) {
      return <code className={cls}>{children}</code>;
    }
    return <code>{children}</code>;
  },
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="border-l-2 border-[var(--hw-accent)] pl-4 my-6 text-[var(--hw-fg)] opacity-80 normal-case italic">
      {children}
    </blockquote>
  ),
  img: (props: { src?: string | Blob; alt?: string }) => {
    const src = typeof props.src === "string" ? props.src : undefined;
    return (
      <img
        src={src}
        alt={props.alt}
        className="my-[calc(30*var(--u))] w-full rounded-[14px]"
      />
    );
  },
  pre: ({ node, children }: { node?: unknown; children?: ReactNode }) => {
    const codeNode = (node as { children?: Array<{ properties?: { className?: string | string[] } }> } | undefined)
      ?.children?.[0];
    const className = codeNode?.properties?.className;
    const joined = Array.isArray(className) ? className.join(" ") : String(className ?? "");
    const match = /language-([\w+-]+)/.exec(joined);
    const lang = match ? match[1] : "";
    return (
      <pre className="relative my-[calc(26*var(--u))] p-5 bg-[var(--hw-paper)] border border-[var(--hw-fg)]/10 font-mono text-[clamp(0.7rem,calc(14*var(--u)),0.88rem)] overflow-x-auto leading-relaxed select-text rounded-md max-w-full shadow-sm normal-case">
        {lang && (
          <div className="absolute right-3 top-2 text-[10px] hw-mono opacity-50 uppercase">{lang}</div>
        )}
        {children}
      </pre>
    );
  },
  table: ({ children }: { children?: ReactNode }) => (
    <div className="my-[calc(26*var(--u))] overflow-x-auto">
      <table className="w-full border-collapse font-fraunces text-[clamp(0.85rem,calc(17*var(--u)),1rem)] text-[var(--hw-fg)] opacity-90 normal-case">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border border-[var(--hw-fg)]/10 px-3 py-2 text-left">{children}</th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border border-[var(--hw-fg)]/10 px-3 py-2">{children}</td>
  ),
  hr: () => <hr className="my-8 border-[var(--hw-fg)]/10" />,
};

export default function BlogPost() {
  const params = useParams();
  const slug = params?.slug as string;

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <ThemeRoot className="blog-essay min-h-[100dvh] bg-[var(--hw-bg)]">
        <main className="relative z-2 mx-auto flex min-h-[100dvh] max-w-[1080px] flex-col items-center justify-center gap-4 px-[var(--hw-gutter)] text-center">
          <h1 className="font-fraunces text-2xl normal-case">Note not found</h1>
          <Link href="/blog" className="hw-mono text-xs hover:underline text-[var(--hw-accent)]">
            [← back to notes]
          </Link>
        </main>
        <GrainOverlay />
        <div className="hw-frame" aria-hidden="true" />
      </ThemeRoot>
    );
  }

  const toc = extractToc(post.content);

  return (
    <ThemeRoot className="blog-essay min-h-[100dvh] bg-[var(--hw-bg)]">
      <ThemedHeroCanvas />
      <main className="relative z-2 mx-auto max-w-[1080px] px-[var(--hw-gutter)] py-[calc(30*var(--u))]">
        <BlogHeader />

        {/* Article Metadata */}
        <article className="flex flex-col mt-[calc(80*var(--u))]">
          <div className="flex items-center gap-3 hw-mono text-[var(--hw-text-eyebrow)] opacity-60 lowercase mb-[calc(16*var(--u))]">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.category}</span>
          </div>

          {/* Featured image (from frontmatter `image:` field) */}
          {post.image && (
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="mb-[calc(36*var(--u))] w-full rounded-[14px] object-cover"
            />
          )}

          <h1 className="font-fraunces font-medium text-[clamp(1.9rem,calc(56*var(--u)),3.3rem)] leading-[1.12] text-[var(--hw-fg)] tracking-[-0.015em] normal-case mb-[calc(40*var(--u))]">
            {post.title}
          </h1>

          {/* Table of Contents */}
          {toc.length > 0 && (
            <nav className="mb-[calc(50*var(--u))]">
              <p className="font-fraunces italic text-[clamp(1rem,calc(21*var(--u)),1.2rem)] text-[var(--hw-fg)] opacity-70 mb-[calc(14*var(--u))]">
                Table of Contents
              </p>
              <ol className="flex flex-col gap-[calc(8*var(--u))]">
                {toc.map((entry, i) => (
                  <li
                    key={entry.id}
                    style={{ paddingLeft: entry.level === 3 ? "calc(24*var(--u))" : undefined }}
                  >
                    <a
                      href={`#${entry.id}`}
                      className="font-roboto-mono text-[clamp(0.85rem,calc(17*var(--u)),1rem)] text-[var(--hw-fg)] underline underline-offset-4 decoration-[var(--hw-fg)]/25 hover:text-[var(--hw-accent)] hover:decoration-[var(--hw-accent)] transition-colors normal-case"
                    >
                      {i + 1}. {entry.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Rendered Markdown Body */}
          <div className="flex flex-col mt-[calc(10*var(--u))]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, [rehypeHighlight, { languages: highlightLanguages }]]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

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
