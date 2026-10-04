import type { Content } from "@/content/types";
import { RichText } from "./RichText";
import { Stagger, StaggerItem } from "./Reveal";
import { Section } from "./Section";

export function Publications({ c }: { c: Content }) {
  const { publications } = c;
  return (
    <Section index="07" title={publications.title}>
      <Stagger as="ol" step={0.06} className="divide-y divide-line border-y border-line">
        {publications.list.map((p, i) => (
          <StaggerItem as="li" key={p.title}>
            <article className="grid gap-3 py-7 sm:grid-cols-[4rem_1fr] sm:gap-6">
              <span className="font-pixel text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-2xl leading-snug sm:text-3xl">{p.title}</h3>
                <p className="mt-2 max-w-3xl leading-relaxed text-muted">
                  <RichText text={p.text} />
                </p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
