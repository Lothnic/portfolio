"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { posts } from "@/data/posts";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ThemeRoot, ThemeToggle } from "@/components/theme";
import { ThemedHeroCanvas } from "@/components/ThemedHeroCanvas";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const textClasses =
  "font-roboto-mono text-[clamp(0.85rem,calc(17*var(--u)),0.98rem)] leading-relaxed text-[var(--hw-fg)] opacity-90 normal-case";

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className={`${textClasses} mb-5`}>{children}</p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-bold">{children}</strong>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="font-fraunces font-medium text-[clamp(1.5rem,calc(40*var(--u)),2.2rem)] leading-tight text-[var(--hw-fg)] mt-10 mb-4 normal-case">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="font-fraunces font-medium text-[clamp(1.3rem,calc(32*var(--u)),1.85rem)] leading-tight text-[var(--hw-fg)] mt-10 mb-4 normal-case">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: ReactNode }) => (
    <h4 className="font-fraunces font-medium text-[clamp(1.1rem,calc(26*var(--u)),1.5rem)] leading-tight text-[var(--hw-fg)] mt-8 mb-3 normal-case">
      {children}
    </h4>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className={`${textClasses} list-disc pl-5 my-5 flex flex-col gap-2.5`}>{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className={`${textClasses} list-decimal pl-5 my-5 flex flex-col gap-2.5`}>{children}</ol>
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
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="border-l-2 border-[var(--hw-accent)] pl-4 my-6 text-[var(--hw-fg)] opacity-80 normal-case italic">
      {children}
    </blockquote>
  ),
  pre: ({ node, children }: { node?: unknown; children?: ReactNode }) => {
    const codeNode = (node as { children?: Array<{ properties?: { className?: string | string[] } }> } | undefined)
      ?.children?.[0];
    const className = codeNode?.properties?.className;
    const joined = Array.isArray(className) ? className.join(" ") : String(className ?? "");
    const match = /language-([\w+-]+)/.exec(joined);
    const lang = match ? match[1] : "";
    return (
      <pre className="relative my-6 p-5 bg-[var(--hw-paper)] border border-[var(--hw-fg)]/10 font-mono text-[clamp(0.7rem,calc(14*var(--u)),0.88rem)] overflow-x-auto leading-relaxed select-text rounded-sm max-w-full shadow-sm normal-case">
        {lang && (
          <div className="absolute right-3 top-2 text-[10px] hw-mono opacity-50 uppercase">{lang}</div>
        )}
        {children}
      </pre>
    );
  },
  table: ({ children }: { children?: ReactNode }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse font-roboto-mono text-[0.85rem] text-[var(--hw-fg)] opacity-90 normal-case">
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
      <ThemeRoot className="min-h-[100dvh] bg-[var(--hw-bg)]">
        <main className="relative z-2 mx-auto flex min-h-[100dvh] max-w-[850px] flex-col items-center justify-center gap-4 px-[var(--hw-gutter)] text-center">
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

  return (
    <ThemeRoot className="min-h-[100dvh] bg-[var(--hw-bg)]">
      <ThemedHeroCanvas />
      <main className="relative z-2 mx-auto max-w-[850px] px-[var(--hw-gutter)] py-[calc(60*var(--u))]">
        {/* Navigation Header */}
        <header className="flex items-center justify-between border-b border-[var(--hw-fg)]/10 pb-[calc(20*var(--u))] mb-[calc(60*var(--u))]">
          <Link
            href="/blog"
            className="hw-mono text-[var(--hw-text-eyebrow)] tracking-wider hover:text-[var(--hw-accent)] transition-colors normal-case"
          >
            [← all notes]
          </Link>
          <ThemeToggle />
        </header>

        {/* Article Metadata */}
        <article className="flex flex-col">
          <div className="flex items-center gap-3 hw-mono text-[var(--hw-text-eyebrow)] opacity-60 lowercase mb-[calc(14*var(--u))]">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.category}</span>
          </div>

          <h1 className="font-fraunces font-medium text-[clamp(1.8rem,calc(54*var(--u)),3.2rem)] leading-[1.1] text-[var(--hw-fg)] tracking-[-0.015em] normal-case mb-[calc(40*var(--u))]">
            {post.title}
          </h1>

          {/* Rendered Markdown Body */}
          <div className="flex flex-col mt-[calc(10*var(--u))]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
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
