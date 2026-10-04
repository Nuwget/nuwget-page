import type { Content } from "@/content/types";
import { RichText } from "./RichText";
import { Stagger, StaggerItem } from "./Reveal";
import { Section } from "./Section";

export function Publications({ c }: { c: Content }) {
  const { publications } = c;
  return (
    <Section index="07" title={publications.title}>
      <Stagger as="ol" step={0.06} className="grid gap-4 md:grid-cols-2">
        {publications.list.map((p, i) => (
          <StaggerItem as="li" key={p.title}>
            <article className="panel h-full">
              <span className="panel-label">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-2xl leading-snug sm:text-[1.7rem]">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">
                <RichText text={p.text} />
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
