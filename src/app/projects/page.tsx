import Link from "next/link";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ThemeRoot, ThemeToggle } from "@/components/theme";
import { ThemedHeroCanvas } from "@/components/ThemedHeroCanvas";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <ThemeRoot className="min-h-[100dvh] bg-[var(--hw-bg)]">
      <ThemedHeroCanvas />
      <main className="relative z-2 mx-auto flex min-h-[100dvh] max-w-[1180px] flex-col px-[var(--hw-gutter)] py-[calc(48*var(--u))]">
        <header className="flex items-center justify-between border-b border-[var(--hw-fg)]/10 pb-[calc(18*var(--u))]">
          <nav className="hw-mono flex items-center gap-[calc(24*var(--u))] text-[var(--hw-text-eyebrow)] tracking-wider">
            <Link href="/" className="hover:text-[var(--hw-accent)] transition-colors normal-case">
              [home]
            </Link>
            <Link href="/blog" className="hover:text-[var(--hw-accent)] transition-colors normal-case">
              [notes]
            </Link>
          </nav>
          <div className="flex items-center gap-[calc(24*var(--u))]">
            <p className="hw-mono text-[var(--hw-text-eyebrow)] text-[var(--hw-accent)]">
              index / {projects.length}
            </p>
            <ThemeToggle />
          </div>
        </header>

        <section className="flex flex-col gap-[calc(18*var(--u))] py-[calc(72*var(--u))]">
          <p className="hw-mono text-[var(--hw-text-eyebrow)] tracking-[0.18em] text-[var(--hw-accent)]">
            project writeups
          </p>
          <h1 className="font-fraunces text-[clamp(2.8rem,calc(104*var(--u)),6rem)] font-medium leading-none tracking-[0] text-[var(--hw-fg)] normal-case">
            Work, notes, and things learned.
          </h1>
        </section>

        <section className="flex flex-col border-t border-[var(--hw-fg)]/10">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group grid grid-cols-1 gap-[calc(26*var(--u))] border-b border-[var(--hw-fg)]/10 py-[calc(34*var(--u))] transition-colors hover:border-[var(--hw-accent)]/40 md:grid-cols-[0.18fr_0.42fr_1fr]"
            >
              <div className="hw-mono text-[var(--hw-text-eyebrow)] text-[var(--hw-accent)]">
                #{project.number}
              </div>
              <div className="hw-noise overflow-hidden bg-[var(--hw-paper)]">
                <img
                  src={project.image}
                  alt=""
                  className="block aspect-[16/10] w-full object-cover hw-project-image transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col justify-between gap-[calc(24*var(--u))]">
                <div className="flex flex-col gap-[calc(12*var(--u))]">
                  <p className="hw-mono text-[var(--hw-text-eyebrow)] tracking-[0.14em] text-[var(--hw-fg)] opacity-60">
                    {project.techStack}
                  </p>
                  <h2 className="font-fraunces text-[clamp(1.7rem,calc(48*var(--u)),2.8rem)] font-medium leading-none text-[var(--hw-fg)] transition-colors group-hover:text-[var(--hw-accent)] normal-case">
                    {project.title}
                  </h2>
                  <p className="font-roboto-mono max-w-[70ch] text-[clamp(0.8rem,calc(16*var(--u)),0.98rem)] leading-relaxed text-[var(--hw-fg)] opacity-72 normal-case">
                    {project.summary}
                  </p>
                </div>
                <span className="hw-mono text-[var(--hw-text-body)] text-[var(--hw-fg)] opacity-75 transition-colors group-hover:text-[var(--hw-accent)] group-hover:opacity-100">
                  read writeup
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <GrainOverlay />
      <div className="hw-frame" aria-hidden="true" />
    </ThemeRoot>
  );
}
