import Link from "next/link";
import { notFound } from "next/navigation";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ThemeRoot, ThemeToggle } from "@/components/theme";
import { ThemedHeroCanvas } from "@/components/ThemedHeroCanvas";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <ThemeRoot className="min-h-[100dvh] bg-[var(--hw-bg)]">
      <ThemedHeroCanvas />
      <main className="relative z-2 mx-auto flex min-h-[100dvh] max-w-[1200px] flex-col px-[var(--hw-gutter)] py-[calc(44*var(--u))]">
        <header className="flex items-center justify-between border-b border-[var(--hw-fg)]/10 pb-[calc(18*var(--u))]">
          <nav className="hw-mono flex items-center gap-[calc(24*var(--u))] text-[var(--hw-text-eyebrow)] tracking-wider">
            <Link href="/" className="hover:text-[var(--hw-accent)] transition-colors normal-case">
              [home]
            </Link>
            <Link href="/#projects" className="hover:text-[var(--hw-accent)] transition-colors normal-case">
              [projects]
            </Link>
            <Link href="/blog" className="hover:text-[var(--hw-accent)] transition-colors normal-case">
              [notes]
            </Link>
          </nav>
          <div className="flex items-center gap-[calc(24*var(--u))]">
            <p className="hw-mono text-[var(--hw-text-eyebrow)] text-[var(--hw-accent)]">
              #{project.number}
            </p>
            <ThemeToggle />
          </div>
        </header>

        <article className="grid flex-1 grid-cols-1 gap-[calc(72*var(--u))] py-[calc(80*var(--u))] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
          <section className="flex flex-col gap-[calc(24*var(--u))]">
            <p className="hw-mono text-[var(--hw-text-eyebrow)] tracking-[0.18em] text-[var(--hw-accent)]">
              {project.techStack}
            </p>
            <h1 className="font-fraunces text-[clamp(2.6rem,calc(96*var(--u)),5.8rem)] font-medium leading-none tracking-[0] text-[var(--hw-fg)] normal-case">
              {project.title}
            </h1>
            <p className="font-roboto-mono text-[clamp(0.88rem,calc(18*var(--u)),1.05rem)] leading-relaxed text-[var(--hw-fg)] opacity-75 normal-case">
              {project.summary}
            </p>
            <Link
              href="/#projects"
              className="hw-mono mt-[calc(12*var(--u))] inline-flex w-fit items-center border border-[var(--hw-fg)] px-[calc(22*var(--u))] py-[calc(14*var(--u))] text-[var(--hw-text-body)] text-[var(--hw-fg)] transition-colors hover:border-[var(--hw-accent)] hover:bg-[var(--hw-accent)] hover:text-[var(--hw-bg)]"
            >
              return to projects
            </Link>
          </section>

          <section className="flex flex-col gap-[calc(34*var(--u))]">
            <div className="hw-noise overflow-hidden border border-[var(--hw-fg)]/10 bg-[var(--hw-paper)]">
              <img src={project.image} alt="" className="block aspect-[16/10] w-full object-cover hw-project-image" />
            </div>

            <div className="grid grid-cols-1 gap-[calc(30*var(--u))] md:grid-cols-2">
              <div className="border-t border-[var(--hw-fg)]/10 pt-[calc(22*var(--u))]">
                <h2 className="hw-mono mb-[calc(18*var(--u))] text-[var(--hw-text-eyebrow)] tracking-[0.18em] text-[var(--hw-accent)]">
                  learned
                </h2>
                <ul className="flex flex-col gap-[calc(14*var(--u))] font-roboto-mono text-[clamp(0.78rem,calc(16*var(--u)),0.96rem)] leading-relaxed text-[var(--hw-fg)] opacity-78 normal-case">
                  {project.lessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[var(--hw-fg)]/10 pt-[calc(22*var(--u))]">
                <h2 className="hw-mono mb-[calc(18*var(--u))] text-[var(--hw-text-eyebrow)] tracking-[0.18em] text-[var(--hw-accent)]">
                  writeup queue
                </h2>
                <ul className="flex flex-col gap-[calc(14*var(--u))] font-roboto-mono text-[clamp(0.78rem,calc(16*var(--u)),0.96rem)] leading-relaxed text-[var(--hw-fg)] opacity-78 normal-case">
                  {project.nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </article>
      </main>
      <GrainOverlay />
      <div className="hw-frame" aria-hidden="true" />
    </ThemeRoot>
  );
}
