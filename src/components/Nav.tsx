import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";

export function Nav({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  return (
    <nav
      style={{
        position: "absolute",
        insetInline: 0,
        top: "var(--hw-frame)",
        zIndex: 20,
        padding: "clamp(24px, calc(50 * var(--u)), 60px) var(--hw-gutter) 0",
      }}
      className="flex md:grid md:grid-cols-3 items-center justify-between font-display text-[clamp(0.8rem,calc(22*var(--u)),1.35rem)] font-extrabold tracking-[0.03em] uppercase text-[var(--hw-fg)]"
    >
      <div className="hidden md:flex items-center justify-start" style={{ gap: "clamp(16px, calc(32 * var(--u)), 36px)" }}>
        <Link
          href="/#downloads"
          className="hover:underline underline-offset-[0.3em] py-[calc(14*var(--u))] -my-[calc(14*var(--u))]"
        >
          Overview
        </Link>
        <Link
          href="/#projects"
          className="hover:underline underline-offset-[0.3em] py-[calc(14*var(--u))] -my-[calc(14*var(--u))]"
        >
          Projects
        </Link>
        <Link
          href="/blog"
          className="hover:underline underline-offset-[0.3em] py-[calc(14*var(--u))] -my-[calc(14*var(--u))]"
        >
          Blogs
        </Link>
      </div>

      <Link
        href="/"
        className="flex flex-row items-center justify-center whitespace-nowrap text-center font-display text-[clamp(1.1rem,calc(40*var(--u)),2.5rem)] font-extrabold tracking-[0.03em] leading-none hover:no-underline justify-self-center"
      >
        LOTH<span style={{ display: "inline-block", transform: "scaleX(-1)" }}>N</span>IC
      </Link>

      <div className="flex items-center justify-end justify-self-end" style={{ gap: "clamp(12px, calc(28 * var(--u)), 24px)" }}>
        <a
          href="https://linkedin.com/in/mayank-joshi-7a5494291"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="opacity-70 transition-opacity duration-200 ease-out hover:opacity-100 flex items-center"
        >
          <LinkedInIcon style={{ height: "calc(25 * var(--u))", width: "auto" }} />
        </a>
        <a
          href="https://github.com/lothnic"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="opacity-70 transition-opacity duration-200 ease-out hover:opacity-100 flex items-center"
        >
          <GitHubIcon style={{ height: "calc(26 * var(--u))", width: "auto" }} />
        </a>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="flex items-center justify-center opacity-70 transition-opacity duration-200 ease-out hover:opacity-100 cursor-pointer p-[calc(4*var(--u))]"
        >
          {theme === "light" ? (
            <Moon style={{ height: "calc(24 * var(--u))", width: "auto" }} />
          ) : (
            <Sun style={{ height: "calc(24 * var(--u))", width: "auto" }} />
          )}
        </button>
      </div>
    </nav>
  );
}

