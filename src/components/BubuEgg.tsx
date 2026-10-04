"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Content } from "@/content/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Crop } from "./Crop";

const EVENT = "bubu-poke";
const STORAGE_KEY = "nuwget-egg-bubu";

/** Invisible hit area over Bubu's head and nose. Click or tap wakes her up. */
export function PokeBubu({
  label,
  className = "",
  style,
}: {
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-cursor
      className={`absolute z-10 cursor-pointer rounded-[45%] bg-transparent outline-offset-2 ${className}`}
      style={{ ...style, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
      onClick={() => window.dispatchEvent(new Event(EVENT))}
    />
  );
}

function readUnlocked(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveUnlocked() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* storage can be blocked; the egg still works for this visit */
  }
}

/** The modal and the achievement toast. Mounted once per page. */
export function BubuEgg({ c }: { c: Content }) {
  const { easter } = c;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<null | "new" | "again">(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const onPoke = useCallback(() => {
    opener.current = document.activeElement;
    const already = readUnlocked();
    if (!already) saveUnlocked();
    setOpen(true);
    window.clearTimeout(toastTimer.current);
    window.setTimeout(() => setToast(already ? "again" : "new"), reduce ? 0 : 700);
    toastTimer.current = window.setTimeout(() => setToast(null), 5600);
  }, [reduce]);

  const close = useCallback(() => {
    setOpen(false);
    (opener.current as HTMLElement | null)?.focus?.();
  }, []);

  useEffect(() => {
    window.addEventListener(EVENT, onPoke);
    return () => window.removeEventListener(EVENT, onPoke);
  }, [onPoke]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        e.preventDefault(); // one focusable control: keep focus inside the dialog
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const pop = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 0.8, y: 24, rotate: -2 },
        animate: { opacity: 1, scale: 1, y: 0, rotate: 0 },
        exit: { opacity: 0, scale: 0.92, y: 12 },
        transition: { type: "spring" as const, stiffness: 380, damping: 22 },
      };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-[#04031a]/80 p-5"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={easter.modal}
              className="glass relative w-full max-w-sm overflow-hidden rounded-3xl p-6 text-center sm:max-w-md sm:p-8"
              onClick={(e) => e.stopPropagation()}
              {...pop}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(circle,rgb(232_121_200/0.35),transparent_70%)]"
              />
              <Crop x={76} y={39} w={20} h={22} label="" className="mx-auto mb-5 w-36 sm:w-44" />
              <p className="font-pixel text-xl leading-snug tracking-wide text-ink sm:text-2xl">
                {easter.modal}
              </p>
              <button ref={closeRef} type="button" className="btn btn-solid mt-7" onClick={close}>
                {easter.close}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[90] flex justify-center px-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:justify-end"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              initial={reduce ? false : { opacity: 0, y: -24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              className="glass flex items-center gap-4 rounded-2xl px-5 py-4 shadow-[0_20px_60px_-20px_rgb(139_109_240/0.7)]"
            >
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ffd48f] to-[#e879c8] text-xl"
              >
                🏆
              </span>
              <span className="text-left">
                <span className="block font-pixel text-xs uppercase tracking-[0.16em] text-warm">
                  {easter.toastTitle}
                </span>
                <span className="mt-0.5 block text-sm text-ink">
                  {toast === "new" ? easter.toastText : easter.toastAgain}
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
