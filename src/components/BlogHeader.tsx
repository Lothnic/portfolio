"use client";

import Link from "next/link";
import { useTheme } from "./theme";

/**
 * Minimal essay-style blog header, inspired by a sparse reading layout:
 * `- blog` on the left, `home` + a `( dark`/`( light` pill toggle on the right.
 */
export function BlogHeader() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="flex items-center justify-between py-[calc(22*var(--u))]">
      <Link
        href="/blog"
        className="font-inter text-[clamp(0.95rem,calc(19*var(--u)),1.1rem)] text-[var(--hw-fg)] opacity-70 transition-opacity hover:opacity-100"
      >
        - blog
      </Link>
      <div className="flex items-center gap-[calc(20*var(--u))]">
        <Link
          href="/"
          className="font-inter text-[clamp(0.95rem,calc(19*var(--u)),1.1rem)] text-[var(--hw-fg)] opacity-70 transition-opacity hover:opacity-100"
        >
          home
        </Link>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="cursor-pointer rounded-full border border-[var(--hw-fg)]/25 px-[calc(14*var(--u))] py-[calc(5*var(--u))] font-inter text-[clamp(0.8rem,calc(16*var(--u)),0.9rem)] text-[var(--hw-fg)] opacity-60 transition-opacity hover:opacity-100"
        >
          ( {theme === "dark" ? "light" : "dark"} )
        </button>
      </div>
    </header>
  );
}
