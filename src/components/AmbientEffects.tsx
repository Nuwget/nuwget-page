"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type P = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  phase: number;
  speed: number;
  warm: boolean;
  star: boolean;
};

// One fixed, low-cost canvas: twinkling stars plus slow warm/lavender motes.
export function AmbientEffects() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let particles: P[] = [];

    const make = (): P[] => {
      const small = window.innerWidth < 768;
      const stars = small ? 34 : 70;
      const motes = small ? 14 : 30;
      const list: P[] = [];
      for (let i = 0; i < stars + motes; i++) {
        const star = i < stars;
        list.push({
          x: Math.random() * w,
          y: Math.random() * h * (star ? 0.7 : 1),
          r: star ? 0.5 + Math.random() * 1.1 : 1 + Math.random() * 2,
          vy: star ? 0 : -(0.06 + Math.random() * 0.16),
          vx: star ? 0 : (Math.random() - 0.5) * 0.12,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.2,
          warm: Math.random() > 0.55,
          star,
        });
      }
      return list;
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = make();
    };

    const frame = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;
      for (const p of particles) {
        if (!p.star) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
        }
        const tw = 0.5 + 0.5 * Math.sin(time * p.speed + p.phase);
        if (p.star) {
          ctx.fillStyle = `rgba(226,218,255,${0.15 + tw * 0.6})`;
          ctx.fillRect(p.x, p.y, p.r, p.r);
        } else {
          const a = 0.1 + tw * 0.35;
          const color = p.warm ? "255,201,138" : "201,184,255";
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, `rgba(${color},${a})`);
          g.addColorStop(1, `rgba(${color},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(p.x - p.r * 4, p.y - p.r * 4, p.r * 8, p.r * 8);
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
