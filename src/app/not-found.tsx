import Link from "next/link";
import { GrainOverlay } from "@/components/GrainOverlay";
import { HeroCanvas } from "@/components/HeroCanvas";

export default function NotFound() {
  return (
    <div className="portfolio-web dark min-h-[100dvh] bg-[var(--hw-bg)]">
      <HeroCanvas theme="dark" quiet />
      <main className="relative z-2 flex min-h-[100dvh] items-center justify-center px-[var(--hw-gutter)] py-[calc(80*var(--u))] text-center">
        <section className="flex max-w-[760px] flex-col items-center gap-[calc(22*var(--u))]">
          <p className="hw-mono text-[var(--hw-text-eyebrow)] tracking-[0.18em] text-[var(--hw-accent)]">
            404 / not found
          </p>
          <h1 className="font-fraunces text-[clamp(2.6rem,calc(92*var(--u)),5.6rem)] font-medium leading-none tracking-[0] text-[var(--hw-fg)] normal-case">
            This page slipped out of context.
          </h1>
          <p className="font-roboto-mono max-w-[56ch] text-[clamp(0.86rem,calc(18*var(--u)),1.05rem)] leading-relaxed text-[var(--hw-fg)] opacity-70 normal-case">
            The route you opened does not exist, or it has moved while the site was being rebuilt.
          </p>
          <Link
            href="/"
            className="hw-mono mt-[calc(18*var(--u))] inline-flex items-center border border-[var(--hw-fg)] px-[calc(24*var(--u))] py-[calc(16*var(--u))] text-[var(--hw-text-body)] text-[var(--hw-fg)] transition-colors hover:border-[var(--hw-accent)] hover:bg-[var(--hw-accent)] hover:text-[var(--hw-bg)]"
          >
            return to main website
          </Link>
        </section>
      </main>
      <GrainOverlay />
      <div className="hw-frame" aria-hidden="true" />
    </div>
  );
}
