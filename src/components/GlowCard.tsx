"use client";

import { useRef, type ReactNode } from "react";

/** Card whose light and slight tilt follow the pointer. CSS variables only. */
export function GlowCard({
  children,
  className = "",
  tilt = 3,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--py", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--rx", `${((0.5 - py) * tilt).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * tilt).toFixed(2)}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`glow-card glass ${className}`}
    >
      {children}
    </div>
  );
}
