"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// Deterministic PRNG so server and client render the same skyline.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Building = { x: number; w: number; h: number; tone: number };
type Win = { x: number; y: number; c: number; blink: boolean };

const W = 640;
const H = 64;

function buildSkyline() {
  const rnd = mulberry32(2026);
  const buildings: Building[] = [];
  const windows: Win[] = [];
  let x = 0;
  while (x < W) {
    const w = 10 + Math.floor(rnd() * 16);
    const h = 14 + Math.floor(rnd() * 44);
    const tone = Math.floor(rnd() * 3);
    buildings.push({ x, w, h, tone });
    for (let wy = H - h + 4; wy < H - 3; wy += 4) {
      for (let wx = x + 2; wx < x + w - 2; wx += 4) {
        if (rnd() > 0.62) {
          windows.push({
            x: wx,
            y: wy,
            c: rnd() > 0.7 ? 1 : 0,
            blink: rnd() > 0.93,
          });
        }
      }
    }
    x += w + (rnd() > 0.7 ? 2 : 0);
  }
  return { buildings, windows };
}

const SKYLINE = buildSkyline();
const TONES = ["#120e33", "#171141", "#0e0b2a"];
const LIGHTS = ["#ffc98a", "#a98bff"];

export function Background() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Three gradient layers cross-fade (opacity only) as the story moves from
  // deep night to a soft violet dusk to a warm quiet close.
  const dusk = useTransform(scrollYProgress, [0.1, 0.5, 0.85], [0, 1, 0.55]);
  const dawn = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const moonY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const moonOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0.5, 0.3, 0.1]);
  const skylineY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 70% -10%, #17123f 0%, #0a0824 45%, #06051a 100%)",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: reduce ? 0 : dusk,
          background:
            "radial-gradient(110% 70% at 20% 100%, #3a1f6e 0%, rgb(58 31 110 / 0) 60%), radial-gradient(90% 60% at 90% 0%, #271a63 0%, rgb(39 26 99 / 0) 70%)",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: reduce ? 0 : dawn,
          background:
            "radial-gradient(100% 60% at 50% 110%, rgb(255 168 120 / 0.32) 0%, rgb(232 121 200 / 0.12) 40%, rgb(0 0 0 / 0) 75%)",
        }}
      />

      <motion.div
        className="absolute right-[7%] top-[11%] h-14 w-14 rounded-full sm:h-[4.5rem] sm:w-[4.5rem]"
        style={{
          y: reduce ? 0 : moonY,
          opacity: moonOpacity,
          background:
            "radial-gradient(circle at 38% 36%, #fbf7ff 0%, #d9ccff 45%, #a893ee 100%)",
          boxShadow:
            "0 0 40px 12px rgb(169 139 255 / 0.2), 0 0 120px 40px rgb(139 109 240 / 0.1)",
        }}
      />

      <motion.svg
        className="absolute inset-x-0 bottom-0 h-[20vh] min-h-32 w-full opacity-45"
        style={{ y: reduce ? 0 : skylineY }}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
      >
        {SKYLINE.buildings.map((b, i) => (
          <rect key={i} x={b.x} y={H - b.h} width={b.w} height={b.h} fill={TONES[b.tone]} />
        ))}
        {SKYLINE.windows.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width={2}
            height={2}
            fill={LIGHTS[w.c]}
            opacity={0.6}
            className={w.blink ? "window-blink" : undefined}
          />
        ))}
      </motion.svg>
      <style>{`
        @keyframes window-blink { 0%, 100% { opacity: .6 } 50% { opacity: .08 } }
        .window-blink { animation: window-blink 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
