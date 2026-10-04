"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import type { Content } from "@/content/types";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { Section } from "./Section";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Experience({ c }: { c: Content }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const { experience } = c;

  return (
    <Section id="experiencia" index="04" title={experience.title}>
      <div ref={ref} className="relative pl-6 sm:pl-12">
        <div aria-hidden="true" className="absolute bottom-0 left-[3px] top-2 w-px bg-line sm:left-[11px]" />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-[3px] top-2 w-px origin-top bg-gradient-to-b from-lavender via-violet to-magenta sm:left-[11px]"
          style={{ scaleY: reduce ? 1 : line }}
        />

        <div className="space-y-16 sm:space-y-24">
          {experience.roles.map((role) => (
            <Reveal key={role.company} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[26px] top-2 h-2.5 w-2.5 rounded-full bg-lavender shadow-[0_0_16px_4px_rgb(139_109_240/0.8)] sm:-left-[54px] sm:h-3 sm:w-3"
              />
              <div className="panel !p-6 sm:!p-8">
              <p className="eyebrow">
                {role.type} · {role.period}
              </p>
              <h3 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{role.title}</h3>
              <p className="mt-2 text-lg text-lavender">
                {role.company} <span className="text-faint">· {role.place}</span>
              </p>

              {role.summary && (
                <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.8] text-muted">{role.summary}</p>
              )}

              <Stagger as="ul" step={0.05} className="mt-6 grid max-w-5xl gap-3 lg:grid-cols-2 lg:gap-x-10">
                {role.bullets.map((b) => (
                  <StaggerItem as="li" key={b}>
                    <div className="flex gap-3 text-[0.97rem] leading-[1.7] text-muted">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-violet" />
                      <span>{b}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {role.skills.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
                {role.moreSkills && <span className="text-sm text-faint">{role.moreSkills}</span>}
              </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
