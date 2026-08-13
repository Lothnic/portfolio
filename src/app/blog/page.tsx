import Link from "next/link";
import { posts } from "@/data/posts";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ThemeRoot, ThemeToggle } from "@/components/theme";
import { ThemedHeroCanvas } from "@/components/ThemedHeroCanvas";

export default function BlogIndex() {
  return (
    <ThemeRoot className="min-h-[100dvh] bg-[var(--hw-bg)]">
      <ThemedHeroCanvas />
      <main className="relative z-2 mx-auto max-w-[980px] px-[var(--hw-gutter)] py-[calc(60*var(--u))]">
        {/* Blog Header Navigation */}
        <header className="flex items-center justify-between border-b border-[var(--hw-fg)]/10 pb-[calc(20*var(--u))] mb-[calc(60*var(--u))]">
          <Link
            href="/"
            className="hw-mono text-[var(--hw-text-eyebrow)] tracking-wider hover:text-[var(--hw-accent)] transition-colors normal-case"
          >
            [← home]
          </Link>
          <ThemeToggle />
        </header>

        {/* Title Section */}
        <div className="flex flex-col gap-[calc(8*var(--u))] mb-[calc(60*var(--u))]">
          <h1 className="font-fraunces font-medium text-[clamp(2rem,calc(60*var(--u)),3.5rem)] leading-none text-[var(--hw-fg)] tracking-[-0.015em] normal-case">
            notes
          </h1>
          <p className="font-roboto-mono text-[clamp(0.85rem,calc(18*var(--u)),1.05rem)] text-[var(--hw-fg)] opacity-70 tracking-wide normal-case">
            writing about language models, CUDA, and systems engineering
          </p>
        </div>

        {/* Dedicated Posts Timeline */}
        <div className="flex flex-col gap-[calc(40*var(--u))]">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col md:grid md:grid-cols-4 items-baseline py-[calc(20*var(--u))] border-b border-[var(--hw-fg)]/5 hover:border-[var(--hw-accent)]/30 transition-colors gap-[calc(8*var(--u))] md:gap-0"
            >
              {/* Year & Category */}
              <div className="flex flex-row md:flex-col gap-2 md:gap-[calc(4*var(--u))] hw-mono text-[var(--hw-text-eyebrow)] opacity-60 group-hover:opacity-100 group-hover:text-[var(--hw-accent)] transition-all">
                <span>{post.year}</span>
                <span className="md:hidden opacity-40">·</span>
                <span className="lowercase">{post.category}</span>
              </div>

              {/* Title & Excerpt */}
              <div className="md:col-span-3 flex flex-col gap-[calc(10*var(--u))]">
                <h2 className="font-fraunces font-medium text-[clamp(1.2rem,calc(36*var(--u)),1.9rem)] leading-tight text-[var(--hw-fg)] group-hover:text-[var(--hw-accent)] transition-colors normal-case">
                  {post.title}
                </h2>
                <p className="font-roboto-mono text-[clamp(0.75rem,calc(16*var(--u)),0.92rem)] text-[var(--hw-fg)] opacity-65 group-hover:opacity-85 transition-opacity normal-case leading-relaxed">
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
