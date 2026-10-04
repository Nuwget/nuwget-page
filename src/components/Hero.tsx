"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Content } from "@/content/types";
import { asset } from "@/lib/asset";
import { SCENE } from "@/lib/scene";
import { Bubu } from "./Bubu";
import { Dudu } from "./Dudu";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const BASE = asset(SCENE.src.full);
const BASE_SET = `${asset(SCENE.src.small)} 1000w, ${asset(SCENE.src.full)} 1600w`;

export function Hero({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const baseRef = useRef<HTMLImageElement>(null);
  const duduRef = useRef<HTMLDivElement>(null);
  const bubuRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { hero, ui } = c;

  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const sceneOpacity = useTransform(scrollYProgress, [0.35, 0.95], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Pause everything when the hero leaves the screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.setAttribute("data-active", String(entry.isIntersecting)),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer depth: transform-only, and the loop sleeps as soon as it has settled.
  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const layers: [HTMLElement | null, number][] = [
      [baseRef.current, 2],
      [bubuRef.current, 3],
      [duduRef.current, 7],
    ];
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const apply = () => {
      for (const [el, k] of layers) {
        if (!el) continue;
        const base = el === baseRef.current ? " scale(1.012)" : "";
        el.style.transform = `translate3d(${(x * k).toFixed(2)}px, ${(y * k * 0.7).toFixed(2)}px, 0)${base}`;
      }
    };
    const frame = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      apply();
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (root.current?.getAttribute("data-active") === "false") return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
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
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      ref={root}
      id="inicio"
      data-active="true"
      aria-label={hero.name}
      className="hero relative isolate h-[100svh] min-h-[620px] overflow-hidden"
    >
      <motion.div className="scene-wrap absolute inset-0" style={{ y: sceneY, opacity: sceneOpacity }}>
        <div
          className="scene"
          style={{ ["--fx" as string]: SCENE.focusX }}
          role="img"
          aria-label={ui.heroAlt}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={baseRef}
            className="scene-base pixelated"
            src={BASE}
            srcSet={BASE_SET}
            sizes="(max-width: 1000px) 1000px, 1600px"
            alt=""
            draggable={false}
            decoding="async"
            fetchPriority="high"
          />
          <Bubu wrapRef={bubuRef} />
          <Dudu wrapRef={duduRef} />

          {/* light: plain alpha gradients, opacity-only animation */}
          <div className="absolute inset-0" aria-hidden="true">
            <span
              className="glow anim-glow"
              style={{
                left: `${g.moon.x}%`,
                top: `${g.moon.y}%`,
                width: "16%",
                aspectRatio: "1",
                background: "radial-gradient(circle, rgb(190 170 255 / 0.3), transparent 65%)",
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
                background: "radial-gradient(ellipse, rgb(110 120 255 / 0.12), transparent 62%)",
              }}
            />
            <span
              className="glow anim-glow"
              style={{
                left: `${g.lamp.x}%`,
                top: `${g.lamp.y}%`,
                width: "14%",
                aspectRatio: "1",
                animationDuration: "3.6s",
                background: "radial-gradient(circle, rgb(255 190 120 / 0.28), transparent 66%)",
              }}
            />
            <span
              className="glow anim-glow"
              style={{
                left: `${g.candle.x}%`,
                top: `${g.candle.y}%`,
                width: "9%",
                aspectRatio: "1",
                animationDuration: "2.7s",
                background: "radial-gradient(circle, rgb(255 170 100 / 0.32), transparent 66%)",
              }}
            />
          </div>
        </div>

        {/* scrims keep the type legible and melt the scene into the page */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #06051a 0%, rgb(6 5 26 / 0.82) 20%, rgb(6 5 26 / 0.5) 34%, rgb(6 5 26 / 0.1) 50%, transparent 64%), linear-gradient(to bottom, rgb(6 5 26 / 0.65), transparent 18%)",
          }}
        />

        {/* opening: the room lights up (opacity only) */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#06051a]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </motion.div>

      <motion.div
        className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-14"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.h1
          className="font-display text-[clamp(3.8rem,10.5vw,8rem)] leading-[0.85] tracking-tight text-ink"
          {...fade(1.0)}
        >
          {hero.name}
        </motion.h1>
        <motion.p className="mt-2 font-display text-2xl italic text-lavender sm:text-3xl" {...fade(1.15)}>
          {hero.handle}
        </motion.p>

        <motion.ul
          className="mt-4 flex max-w-3xl flex-wrap font-mono text-[0.72rem] leading-relaxed text-muted sm:text-[0.82rem]"
          aria-label="Headline"
          {...fade(1.3)}
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
          {...fade(1.45)}
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
