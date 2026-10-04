import type { Content } from "@/content/types";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Education({ c }: { c: Content }) {
  const { education: e, certificates, ui } = c;
  return (
    <Section id="formacao" index="06" title={e.title}>
      <Reveal>
        <p className="eyebrow">{e.period}</p>
        <h3 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{e.school}</h3>
        <p className="mt-2 text-lg text-lavender">{e.degree}</p>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <Reveal className="panel !p-6 sm:!p-7">
          <p className="mb-4 text-muted">{e.introList}</p>
          <ul className="space-y-3">
            {e.items.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-violet" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {e.skills.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
            <span className="text-sm text-faint">{e.moreSkills}</span>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="panel !p-6 sm:!p-7">
          <p className="eyebrow mb-4">{e.projectsLabel}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {e.projects.map((p) => (
              <li key={p.name}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group flex items-center justify-between gap-3 rounded-2xl px-5 py-4 font-mono text-sm transition hover:-translate-y-0.5 hover:border-lavender/50"
                >
                  {p.name}
                  <span aria-hidden="true" className="text-lavender transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="mb-8 mt-24">
        <h3 className="font-display text-4xl sm:text-5xl">{certificates.title}</h3>
      </Reveal>
      <Reveal>
        <ul className="divide-y divide-line border-y border-line">
          {certificates.list.map((cert, i) => (
            <li
              key={`${cert.name}-${i}`}
              className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.1fr)] sm:items-baseline"
            >
              <div>
                <p className="text-ink">{cert.name}</p>
                <p className="text-sm text-lavender">{cert.issuer}</p>
              </div>
              <p className="text-sm text-muted">{cert.date}</p>
              {cert.credential ? (
                <p className="break-all font-mono text-xs text-faint sm:text-right">
                  {ui.credential}: {cert.credential}
                </p>
              ) : (
                <span />
              )}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-10">
        <blockquote className="max-w-4xl border-l-2 border-violet pl-5 text-muted">
          <strong className="font-medium text-ink">{certificates.intermediateTitle}:</strong>{" "}
          {certificates.intermediate}
        </blockquote>
      </Reveal>
    </Section>
  );
}
