"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Content } from "@/content/types";
import { asset } from "@/lib/asset";
import { SCENE, place } from "@/lib/scene";
import { Bubu } from "./Bubu";
import { PokeBubu } from "./BubuEgg";
import { useGate } from "./gate/LanguageGate";
import { Dudu } from "./Dudu";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** One line of type revealed from below through a mask (no blur filter). */
function Line({
  children,
  delay,
  reduce,
  ready,
}: {
  children: React.ReactNode;
  delay: number;
  reduce: boolean;
  ready: boolean;
}) {
  return (
    <span className="-mb-[0.16em] block overflow-hidden pb-[0.16em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: "108%" }}
        animate={{ y: ready ? 0 : "108%" }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const BASE = asset(SCENE.src.full);
const BASE_SET = `${asset(SCENE.src.small)} 1000w, ${asset(SCENE.src.full)} 1600w`;

export function Hero({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const baseRef = useRef<HTMLImageElement>(null);
  const duduRef = useRef<HTMLDivElement>(null);
  const bubuRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { ready } = useGate();
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
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: reduce ? { duration: 0 } : { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

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
          <PokeBubu label={c.easter.pokeLabel} style={place(SCENE.sprites.bubuHead)} />

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
              "linear-gradient(to top, #06051a 0%, rgb(6 5 26 / 0.84) 14%, rgb(6 5 26 / 0.5) 27%, rgb(6 5 26 / 0.1) 42%, transparent 54%), linear-gradient(to bottom, rgb(6 5 26 / 0.65), transparent 18%)",
          }}
        />

        {/* opening: the room lights up (opacity only) */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#06051a]"
            initial={{ opacity: 1 }}
            animate={{ opacity: ready ? 0 : 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </motion.div>

      <motion.div
        className="pointer-events-none relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-5 sm:px-6 sm:pb-7"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div>
            <h1 className="font-display leading-[0.86] tracking-[-0.025em]">
              <Line delay={0.35} reduce={reduce} ready={ready}>
                <span className="bg-gradient-to-b from-white via-[#f1ecff] to-[#b9a6ff] bg-clip-text text-[clamp(4rem,9vw,7rem)] text-transparent">
                  {hero.name}
                </span>
              </Line>
            </h1>
            <p className="mt-1 font-display text-2xl italic text-lavender sm:text-[1.75rem]">
              <Line delay={0.5} reduce={reduce} ready={ready}>
                {hero.handle}
              </Line>
            </p>

            <motion.ul
              className="mt-4 flex max-w-[46rem] flex-wrap font-mono text-[0.68rem] leading-[1.9] text-muted sm:text-xs"
              aria-label="Headline"
              {...fade(0.7)}
            >
              {hero.headline.map((h, i) => (
                <li key={h} className="whitespace-nowrap">
                  {h}
                  {i < hero.headline.length - 1 && (
                    <span aria-hidden="true" className="mx-2 text-violet/70">
                      |
                    </span>
                  )}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            className="pointer-events-auto flex flex-col items-start gap-3 lg:items-end"
            {...fade(0.85)}
          >
            <div className="flex flex-wrap gap-2.5">
              <a
                href={hero.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid !px-5 !py-2.5"
              >
                LinkedIn
                <span aria-hidden="true">↗</span>
              </a>
              <a href={hero.followers} target="_blank" rel="noopener noreferrer" className="btn !px-5 !py-2.5">
                GitHub
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p className="text-xs text-faint lg:text-right">{hero.network}</p>
          </motion.div>
        </div>

        <motion.ul
          className="mt-5 flex flex-wrap gap-x-6 gap-y-1 border-t border-transparent pt-3 font-pixel text-[0.66rem] uppercase tracking-[0.2em] text-faint sm:mt-6 sm:text-[0.7rem]"
          style={{ borderImage: "linear-gradient(90deg, rgb(201 184 255 / 0.4), transparent 70%) 1" }}
          {...fade(1)}
        >
          <li>{hero.location}</li>
          <li>{hero.school}</li>
          <li>{hero.profileLang}</li>
        </motion.ul>
      </motion.div>
    </section>
  );
}
