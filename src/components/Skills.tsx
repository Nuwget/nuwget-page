import type { Content } from "@/content/types";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Skills({ c }: { c: Content }) {
  const { stack, services } = c;
  return (
    <Section id="stack" index="03" title={stack.title}>
      <Reveal>
        <div className="panel !p-0">
          <ul className="divide-y divide-line">
            {stack.rows.map((row, i) => (
              <li key={row.area} className="grid gap-3 px-5 py-5 sm:grid-cols-[13rem_1fr] sm:items-center sm:gap-8 sm:px-7">
                <h3 className="flex items-baseline gap-3">
                  <span className="panel-label">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl leading-tight">{row.area}</span>
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
              </li>
            ))}
            <li className="px-5 py-5 sm:px-7">
              <p className="font-display text-2xl italic text-lavender">{stack.studying}</p>
            </li>
          </ul>
        </div>
      </Reveal>

      <Reveal className="mt-4">
        <details className="group panel !p-5 sm:!p-6">
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
        <h3 className="mb-6 font-display text-4xl leading-none sm:text-5xl">{services.title}</h3>
        <div className="panel !p-0">
          <ul className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
            {services.items.map((item, i) => (
              <li
                key={item}
                className="flex flex-col gap-3 border-line px-5 py-5 sm:border-b sm:px-6 lg:[&:nth-child(4n+1)]:border-l-0 lg:border-l"
              >
                <span className="panel-label">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[1.02rem] font-medium leading-snug text-ink">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
