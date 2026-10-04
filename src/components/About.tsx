import type { Content } from "@/content/types";
import { Crop } from "./Crop";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { Section } from "./Section";

export function About({ c }: { c: Content }) {
  const { about } = c;
  return (
    <Section id="sobre" index="01" title={about.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Crop
            x={68}
            y={34}
            w={28}
            h={32}
            label="Bubu"
            className="shadow-[0_30px_80px_-30px_rgb(139_109_240/0.6)]"
          />
          <p className="mt-6 font-display text-2xl italic leading-snug text-lavender sm:text-3xl">
            {about.intro}
          </p>
          <blockquote className="mt-5 border-l-2 border-violet pl-4 text-muted">{about.quote}</blockquote>
        </Reveal>

        <div>
          <Stagger className="space-y-6 text-lg leading-relaxed text-muted" step={0.09}>
            {about.paragraphs.map((p, i) => (
              <StaggerItem key={i}>
                <p className={i === 0 ? "text-xl text-ink sm:text-2xl" : undefined}>{p}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Stagger className="mt-10 flex flex-wrap gap-2" as="ul" step={0.035}>
            {about.tags.map((t) => (
              <StaggerItem key={t} as="li">
                <span className="chip">{t}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
