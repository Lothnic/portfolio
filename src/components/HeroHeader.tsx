"use client";

export function HeroHeader() {
  return (
    <header className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-20 overflow-hidden text-center">
      
      {/* Centered document column */}
      <div className="relative z-10 w-full max-w-[680px] mx-auto flex flex-col items-center gap-0">
        
        {/* Custom Cyber-Lotus ASCII Ornament */}
        <pre className="font-roboto-mono text-[11px] leading-[1.2] text-[var(--hw-accent)] opacity-85 mb-8 text-center select-none normal-case pointer-events-none">
{`*
/|\\
.-'|'-.
- -o- -
'-.|.-'
\\|/
*`}
        </pre>

        {/* Name — large display serif */}
        <h1 className="font-fraunces font-medium text-[clamp(2.2rem,calc(84*var(--u)),3.6rem)] leading-none text-[var(--hw-fg)] tracking-[-0.015em] normal-case mb-4">
          Mayank Joshi
        </h1>

        {/* Tagline */}
        <p className="font-roboto-mono text-[clamp(0.85rem,calc(18*var(--u)),1.05rem)] text-[var(--hw-fg)] opacity-95 tracking-wide normal-case mb-3">
          systems &amp; machine learning engineer
        </p>

        {/* Subtext info */}
        <p className="font-roboto-mono text-[clamp(0.75rem,calc(15*var(--u)),0.9rem)] text-[var(--hw-fg)] opacity-65 normal-case mb-10 leading-relaxed max-w-[50ch]">
          currently intern @ <a href="https://www.iitrpr.ac.in/" target="_blank" rel="noopener noreferrer" className="text-[var(--hw-fg)] hover:text-[var(--hw-accent)] font-medium border-b border-[var(--hw-fg)]/30 hover:border-[var(--hw-accent)] pb-0.5 transition-colors">iit rpr</a> · based in India <br></br> open to opportunities
        </p>

        {/* CTA Link list */}
        <div className="flex items-center justify-center gap-[clamp(1rem,calc(20*var(--u)),2rem)] font-roboto-mono text-[clamp(0.75rem,calc(15*var(--u)),0.9rem)] tracking-wider normal-case flex-wrap">
          <a
            href="#projects"
            className="text-[var(--hw-fg)] hover:text-[var(--hw-accent)] border-b border-[var(--hw-fg)]/20 hover:border-[var(--hw-accent)] pb-0.5 transition-all duration-200"
          >
            [ projects ]
          </a>
          <a
            href="#downloads"
            className="text-[var(--hw-fg)] hover:text-[var(--hw-accent)] border-b border-[var(--hw-fg)]/20 hover:border-[var(--hw-accent)] pb-0.5 transition-all duration-200"
          >
            [ resume ]
          </a>
          <a
            href="https://github.com/lothnic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--hw-fg)] hover:text-[var(--hw-accent)] border-b border-[var(--hw-fg)]/20 hover:border-[var(--hw-accent)] pb-0.5 transition-all duration-200"
          >
            [ github ]
          </a>
          <a
            href="mailto:joshimayank08012007@gmail.com"
            className="text-[var(--hw-fg)] hover:text-[var(--hw-accent)] border-b border-[var(--hw-fg)]/20 hover:border-[var(--hw-accent)] pb-0.5 transition-all duration-200"
          >
            [ email ]
          </a>
        </div>
      </div>
    </header>
  );
}