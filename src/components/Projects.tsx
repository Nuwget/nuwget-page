import type { Content } from "@/content/types";
import { GlowCard } from "./GlowCard";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Projects({ c }: { c: Content }) {
  const { projects } = c;
  return (
    <Section id="projetos" index="05" title={projects.title}>
      <div className="space-y-8 sm:space-y-12">
        {projects.list.map((p, i) => (
          <Reveal key={p.name}>
            <GlowCard className="overflow-hidden p-6 sm:p-12" tilt={2}>
              <div className="grid gap-8 lg:grid-cols-[9rem_1fr] lg:gap-14">
                <span
                  aria-hidden="true"
                  className="font-pixel text-7xl leading-none text-violet/30 sm:text-8xl lg:text-9xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="eyebrow">{p.tagline}</p>
                  <h3 className="mt-3 font-display text-5xl leading-none sm:text-7xl">{p.name}</h3>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{p.description}</p>

                  {p.highlights && (
                    <ul className="mt-8 flex flex-wrap gap-2">
                      {p.highlights.map((h) => (
                        <li key={h}>
                          <span className="chip">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {p.tech.length > 0 && (
                    <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 font-mono text-sm text-lavender">
                      {p.tech.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
