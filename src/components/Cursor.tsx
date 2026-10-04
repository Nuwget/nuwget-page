"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// A soft violet glow that trails the pointer and swells over interactive elements.
// The native cursor stays visible. Only mounted for fine pointers (no touch).
export function Cursor() {
  const glow = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const g = glow.current;
    const d = dot.current;
    if (!g || !d) return;

    let tx = -100;
    let ty = -100;
    let gx = tx;
    let gy = ty;
    let scale = 1;
    let target = 1;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      d.style.opacity = "1";
      g.style.opacity = "1";
      const el = e.target as Element | null;
      target = el?.closest("a, button, summary, [data-cursor]") ? 2.2 : 1;
    };
    const onLeave = () => {
      d.style.opacity = "0";
      g.style.opacity = "0";
    };

    const frame = () => {
      gx += (tx - gx) * 0.14;
      gy += (ty - gy) * 0.14;
      scale += (target - scale) * 0.16;
      g.style.transform = `translate3d(${gx - 160}px, ${gy - 160}px, 0) scale(${scale})`;
      d.style.transform = `translate3d(${tx - 3}px, ${ty - 3}px, 0)`;
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <div className="pointer-fine-only" aria-hidden="true">
      <div
        ref={glow}
        className="pointer-events-none fixed left-0 top-0 z-[55] h-80 w-80 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, rgb(139 109 240 / 0.20) 0%, rgb(139 109 240 / 0.07) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[56] h-1.5 w-1.5 rounded-full bg-lavender opacity-0 shadow-[0_0_10px_2px_rgb(201_184_255/0.7)] transition-opacity duration-300"
      />
      <style>{`@media (hover: none), (pointer: coarse) { .pointer-fine-only { display: none; } }`}</style>
    </div>
  );
}
