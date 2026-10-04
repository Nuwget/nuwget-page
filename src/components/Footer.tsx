"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Content } from "@/content/types";
import { asset } from "@/lib/asset";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FULL = asset("/images/dudu-closing-989.webp");
const SMALL = asset("/images/dudu-closing-640.webp");

// Positions of the lights inside the closing illustration (989 × 824), in percent.
const LIGHTS = [
  { x: 60, y: 72, w: 60, c: "110 120 255", a: 0.2, d: "7s", cls: "anim-glow" },
  { x: 86, y: 40, w: 22, c: "255 190 120", a: 0.3, d: "3.6s", cls: "anim-flicker" },
  { x: 90.5, y: 9.5, w: 22, c: "190 170 255", a: 0.32, d: "8s", cls: "anim-glow" },
];

export function Footer({ c }: { c: Content }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const dim = useTransform(scrollYProgress, [0.5, 1], [0, 0.35]);
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.9], [0, 1]);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, transparent 0, #06051a 200px)" }}
    >
      <div className="relative mx-auto h-[78svh] min-h-[460px] w-full max-w-[1500px]">
        <motion.div
          className="absolute inset-0"
          style={{
            scale: reduce ? 1 : scale,
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
          }}
        >
          <div className="absolute left-1/2 top-1/2 aspect-[989/824] w-[max(100%,calc(78svh*1.2))] -translate-x-1/2 -translate-y-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FULL}
              srcSet={`${SMALL} 640w, ${FULL} 989w`}
              sizes="100vw"
              alt={c.ui.closingAlt}
              loading="lazy"
              decoding="async"
              className="pixelated h-full w-full max-w-none"
            />
            <div aria-hidden="true" className="absolute inset-0">
              {LIGHTS.map((l, i) => (
                <span
                  key={i}
                  className={`glow ${l.cls}`}
                  style={{
                    left: `${l.x}%`,
                    top: `${l.y}%`,
                    width: `${l.w}%`,
                    aspectRatio: "1",
                    animationDuration: l.d,
                    background: `radial-gradient(circle, rgb(${l.c} / ${l.a}), transparent 65%)`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[#06051a]"
          style={{ opacity: reduce ? 0.2 : dim }}
        />
      </div>

      <motion.p
        className="relative mx-auto -mt-24 max-w-2xl px-6 pb-20 text-center font-display text-2xl italic leading-snug text-lavender sm:text-3xl"
        style={{ opacity: reduce ? 1 : textOpacity }}
      >
        {c.footer}
      </motion.p>
    </footer>
  );
}
