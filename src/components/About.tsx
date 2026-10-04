import type { Content } from "@/content/types";
import { BubuAngry } from "./AngryMarks";
import { PokeBubu } from "./BubuEgg";
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
          >
            <BubuAngry parent={{ x: 68, y: 34, w: 28, h: 32 }} />
            <PokeBubu
              label={c.easter.pokeLabel}
              style={{ left: "46.8%", top: "23.4%", width: "38.6%", height: "36.3%" }}
            />
          </Crop>
          <p className="mt-6 font-display text-2xl italic leading-snug text-lavender sm:text-3xl">
            {about.intro}
          </p>
          <blockquote className="mt-5 border-l-2 border-violet pl-4 text-muted">{about.quote}</blockquote>
        </Reveal>

        <div>
          <Stagger className="space-y-6" step={0.09}>
            <StaggerItem>
              <p className="font-display text-3xl leading-[1.15] tracking-[-0.01em] text-ink sm:text-[2.6rem]">
                {about.paragraphs[0]}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="space-y-5">
                {about.paragraphs.slice(1).map((p, i) => (
                  <p key={i} className="max-w-[62ch] text-[1.0625rem] leading-[1.8] text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </StaggerItem>
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
