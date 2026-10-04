"use client";

import { useEffect, useState } from "react";

/**
 * prefers-reduced-motion, read after mount so the first client render matches the
 * server HTML (motion's own hook reads the media query during render and causes a
 * hydration mismatch for users who have it on).
 */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}
