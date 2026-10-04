import type { Content } from "@/content/types";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { Section } from "./Section";

export function Skills({ c }: { c: Content }) {
  const { stack, services } = c;
  return (
    <Section id="stack" index="03" title={stack.title}>
      <Stagger className="divide-y divide-line border-y border-line" step={0.06}>
        {stack.rows.map((row, i) => (
          <StaggerItem key={row.area}>
            <div className="grid gap-4 py-6 sm:grid-cols-[14rem_1fr] sm:items-center sm:gap-8">
              <h3 className="flex items-baseline gap-3">
                <span className="font-pixel text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-2xl">{row.area}</span>
              </h3>
              <ul className="flex flex-wrap gap-2">
                {row.items.map((item) => (
                  <li key={item}>
                    <span className="chip" title={`${row.area}: ${item}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-8">
        <p className="font-display text-2xl italic text-lavender">{stack.studying}</p>
      </Reveal>

      <Reveal className="mt-10">
        <details className="group glass rounded-[var(--radius)] p-5 sm:p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-ink">
            <span>{stack.rolesTitle}</span>
            <span aria-hidden="true" className="font-pixel text-lavender transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <ul className="mt-5 flex flex-wrap gap-2">
            {stack.roleSkills.map((s) => (
              <li key={s}>
                <span className="chip">{s}</span>
              </li>
            ))}
          </ul>
        </details>
      </Reveal>

      <Reveal className="mt-20">
        <h3 className="eyebrow mb-5">{services.title}</h3>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 font-display text-2xl sm:text-3xl">
          {services.items.map((s, i) => (
            <li key={s} className="flex items-center gap-8">
              {s}
              {i < services.items.length - 1 && (
                <span aria-hidden="true" className="hidden text-violet sm:inline">
                  ✦
                </span>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
