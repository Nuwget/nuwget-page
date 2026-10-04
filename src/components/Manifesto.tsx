"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { Content } from "@/content/types";
import { DuduAvatar } from "./DuduAvatar";

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {word}
    </motion.span>
  );
}

export function Manifesto({ c }: { c: Content }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const { manifesto } = c;
  const words = manifesto.lead.split(" ");
  const bodyWords = manifesto.body.split(" ");
  const all = words.length + bodyWords.length;

  const wordsOf = (list: string[], from: number) =>
    list.map((w, i) => {
      const a = (from + i) / all;
      const b = (from + i + 1) / all;
      return reduce ? (
        <span key={i} className="mr-[0.26em] inline-block">
          {w}
        </span>
      ) : (
        <Word key={i} word={w} progress={scrollYProgress} range={[a * 0.9, b * 0.9 + 0.1]} />
      );
    });

  return (
    <section ref={ref} aria-label="Manifesto" className="relative mx-auto max-w-5xl px-4 py-28 sm:px-6 sm:py-44">
      <p className="eyebrow mb-8">02</p>
      <h2 className="font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
        {wordsOf(words, 0)}
      </h2>
      <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted sm:text-2xl">
        {wordsOf(bodyWords, words.length)}
      </p>

      <div className="mt-16 grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-8">
          <p className="max-w-2xl border-l-2 border-violet pl-5 text-lg leading-relaxed text-ink/90">
            {manifesto.ai}
          </p>
          <p className="font-display text-3xl italic leading-tight text-lavender sm:text-4xl">
            {manifesto.closing}
          </p>
        </div>
        <motion.div
          aria-hidden="true"
          className="hidden sm:block"
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <DuduAvatar size={96} />
        </motion.div>
      </div>
    </section>
  );
}
