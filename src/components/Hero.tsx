"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Content } from "@/content/types";
import { SCENE } from "@/lib/scene";
import { Bubu } from "./Bubu";
import { Dudu } from "./Dudu";
import { SceneImage } from "./SceneImage";

export function Hero({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { hero, ui } = c;

  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const sceneOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Pointer-driven depth: write two CSS variables, no React re-render.
  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = scene.current;
    if (!el) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const frame = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce]);

  const g = SCENE.glows;
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      ref={root}
      id="inicio"
      aria-label={hero.name}
      className="relative isolate h-[100svh] min-h-[620px] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          y: sceneY,
          scale: sceneScale,
          opacity: sceneOpacity,
          maskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0, filter: "blur(18px) brightness(0.35)", scale: 1.06 }}
          animate={{ opacity: 1, filter: "blur(0px) brightness(1)", scale: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={scene}
            className="scene"
            style={{ ["--fx" as string]: SCENE.focusX }}
            role="img"
            aria-label={ui.heroAlt}
          >
            {/* background plate: slightly oversized so layer motion never shows an edge */}
            <div className="scene-layer px" style={{ ["--k" as string]: 2 }}>
              <SceneImage priority />
            </div>
            <Bubu />
            <Dudu />

            {/* foreground: desk edge drifts a touch more than the room */}
            <div className="scene-layer fg-mask" aria-hidden="true">
              <div className="scene-layer px" style={{ ["--k" as string]: 10 }}>
                <SceneImage />
              </div>
            </div>

            {/* light: all screen-blended, opacity-only animation */}
            <div className="scene-layer" aria-hidden="true">
              <span
                className="glow anim-glow"
                style={{
                  left: `${g.moon.x}%`,
                  top: `${g.moon.y}%`,
                  width: "16%",
                  aspectRatio: "1",
                  background:
                    "radial-gradient(circle, rgb(190 170 255 / 0.35), transparent 65%)",
                }}
              />
              <span
                className="glow anim-glow"
                style={{
                  left: `${g.screen.x}%`,
                  top: `${g.screen.y}%`,
                  width: "46%",
                  aspectRatio: "1.2",
                  animationDuration: "8s",
                  background:
                    "radial-gradient(ellipse, rgb(110 120 255 / 0.16), transparent 62%)",
                }}
              />
              <span
                className="glow anim-flicker"
                style={{
                  left: `${g.lamp.x}%`,
                  top: `${g.lamp.y}%`,
                  width: "14%",
                  aspectRatio: "1",
                  background:
                    "radial-gradient(circle, rgb(255 190 120 / 0.34), transparent 66%)",
                }}
              />
              <span
                className="glow anim-flicker"
                style={{
                  left: `${g.candle.x}%`,
                  top: `${g.candle.y}%`,
                  width: "9%",
                  aspectRatio: "1",
                  animationDuration: "2.7s",
                  background:
                    "radial-gradient(circle, rgb(255 170 100 / 0.38), transparent 66%)",
                }}
              />
              <span
                className="glow anim-glow"
                style={{
                  left: `${g.lantern.x}%`,
                  top: `${g.lantern.y}%`,
                  width: "13%",
                  aspectRatio: "1",
                  animationDuration: "7s",
                  background:
                    "radial-gradient(circle, rgb(255 190 120 / 0.28), transparent 66%)",
                }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* scrims keep the type legible and melt the scene into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgb(6 5 26 / 0.8) 0%, rgb(6 5 26 / 0.55) 24%, rgb(6 5 26 / 0.12) 46%, transparent 62%), linear-gradient(to bottom, rgb(6 5 26 / 0.65), transparent 18%)",
        }}
      />

      <motion.div
        className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-14"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.h1
          className="font-display text-[clamp(3.8rem,10.5vw,8rem)] leading-[0.85] tracking-tight text-ink"
          {...fade(1.2)}
        >
          {hero.name}
        </motion.h1>
        <motion.p
          className="mt-2 font-display text-2xl italic text-lavender sm:text-3xl"
          {...fade(1.35)}
        >
          {hero.handle}
        </motion.p>

        <motion.ul
          className="mt-4 flex max-w-3xl flex-wrap font-mono text-[0.72rem] leading-relaxed text-muted sm:text-[0.82rem]"
          aria-label="Headline"
          {...fade(1.5)}
        >
          {hero.headline.map((h, i) => (
            <li key={h} className="whitespace-nowrap">
              {h}
              {i < hero.headline.length - 1 && (
                <span aria-hidden="true" className="mx-2 text-violet">
                  |
                </span>
              )}
            </li>
          ))}
        </motion.ul>

        <motion.div
          className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          {...fade(1.7)}
        >
          <div className="space-y-1 text-sm text-muted">
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <span>📍 {hero.location}</span>
              <span>🎓 {hero.school}</span>
              <span>🌐 {hero.profileLang}</span>
            </p>
            <p className="text-xs text-faint">{hero.network}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href={hero.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
              LinkedIn
              <span aria-hidden="true">↗</span>
            </a>
            <a href={hero.followers} target="_blank" rel="noopener noreferrer" className="btn">
              GitHub
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
