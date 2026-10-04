import type { Content } from "@/content/types";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { Section } from "./Section";

export function Availability({ c }: { c: Content }) {
  const { availability: a } = c;
  return (
    <Section index="08" title={a.title}>
      <Reveal>
        <p className="max-w-3xl font-display text-3xl italic leading-snug text-lavender sm:text-4xl">
          {a.status}
        </p>
        <p className="mt-10 text-muted">{a.interestIntro}</p>
      </Reveal>
      <Stagger as="ul" step={0.06} className="mt-6 grid gap-3 sm:grid-cols-2">
        {a.interests.map((i) => (
          <StaggerItem as="li" key={i.text}>
            <div className="glass flex items-center gap-4 rounded-2xl px-5 py-4">
              <span aria-hidden="true" className="text-xl">
                {i.icon}
              </span>
              <span>{i.text}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
