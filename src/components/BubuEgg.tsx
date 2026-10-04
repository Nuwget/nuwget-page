"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import type { Content } from "@/content/types";
import { asset } from "@/lib/asset";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BubuAngry, DuduAngry } from "./AngryMarks";
import { Crop } from "./Crop";

const EVENT = "bubu-poke";
const STAGE_KEY = "nuwget-bubu-stage";
const GOOGLE = "https://www.google.com/";
const FAMILY_SRC = "/audio/family.mp3"; // the "oooo family" line, 3.4 s

/** Invisible hit area over Bubu's head and nose. Click or tap pokes her. */
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

/** 0 = asleep, 1 = Bubu angry, 2 = Dudu angry too. Kept for the browser session. */
function readStage(): number {
  try {
    return Number(sessionStorage.getItem(STAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}
function writeStage(n: number) {
  try {
    sessionStorage.setItem(STAGE_KEY, String(n));
  } catch {
    /* storage can be blocked; the egg still works for this visit */
  }
}
function applyMood(stage: number) {
  const d = document.documentElement;
  if (stage >= 1) d.dataset.bubu = "angry";
  else delete d.dataset.bubu;
  if (stage >= 2) d.dataset.dudu = "angry";
  else delete d.dataset.dudu;
}

type Scene = null | "wake" | "warn";
type Toast = null | "wake" | "warn" | "forgiven";
type Farewell = null | { phase: "bye" | "count" | "boom"; n: number };

const DUDU_BOX = { x: 22, y: 24, w: 36, h: 44 };
const BUBU_BOX = { x: 76, y: 39, w: 20, h: 22 };

function Characters({ angry, big = false, shake = false }: { angry: boolean; big?: boolean; shake?: boolean }) {
  return (
    <div
      data-angry={angry ? "true" : undefined}
      className="mx-auto mb-5 flex items-end justify-center gap-3"
    >
      {angry && (
        <div className={shake ? "mood-shake" : undefined}>
          <Crop
            {...DUDU_BOX}
            label="Dudu"
            className={big ? "w-36 sm:w-52" : "w-32 sm:w-40"}
          >
            <DuduAngry viewBox="352 256 576 469.5" />
          </Crop>
        </div>
      )}
      <div className={angry && shake ? "mood-shake" : undefined} style={{ animationDelay: "0.1s" }}>
        <Crop {...BUBU_BOX} label="Bubu" className={angry ? (big ? "w-32 sm:w-44" : "w-28 sm:w-36") : "w-36 sm:w-44"}>
          <BubuAngry parent={BUBU_BOX} />
        </Crop>
      </div>
    </div>
  );
}

/** Pixel debris for the final blast. */
function Debris() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const colors = ["#ffffff", "#c9b8ff", "#8b6df0", "#e879c8", "#ffc98a", "#ff5a73"];
    const parts = Array.from({ length: 220 }, () => {
      const a = Math.random() * Math.PI * 2;
      const v = 3 + Math.random() * 15;
      return {
        x: w / 2,
        y: h / 2,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 2,
        s: 4 + Math.floor(Math.random() * 3) * 4,
        c: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      };
    });
    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38;
        p.vx *= 0.985;
        p.life -= 0.012;
        if (p.life <= 0) continue;
        alive = true;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      }
      if (alive) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

function useTypewriter(text: string, run: boolean, speed = 55) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const id = window.setInterval(() => setN((v) => Math.min(text.length, v + 1)), speed);
    return () => window.clearInterval(id);
  }, [text, run, speed]);
  return run ? text.slice(0, n) : "";
}

function FarewellScreen({
  c,
  state,
  reduce,
  onCancel,
}: {
  c: Content;
  state: NonNullable<Farewell>;
  reduce: boolean;
  onCancel: () => void;
}) {
  const { easter } = c;
  const typed = useTypewriter(easter.bye, true, reduce ? 10 : 60);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => btn.current?.focus(), []);
  const boom = state.phase === "boom";
  return (
    <motion.div
      role="alertdialog"
      aria-modal="true"
      aria-label={easter.bye}
      className={`fixed inset-0 z-[95] grid place-items-center overflow-hidden p-5 ${boom ? "bg-black" : "bg-[#12030f]/95"}`}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(255_60_110/0.28),transparent_62%)]"
      />
      {!boom && (
        <div className="relative w-full max-w-xl text-center">
          <Characters angry big shake={!reduce} />
          <p className="min-h-[3.2em] font-pixel text-xl leading-snug tracking-wide text-white sm:text-3xl">
            {typed}
            <span className="gate-caret" aria-hidden="true" />
          </p>
          {state.phase === "count" && (
            <div className="mt-5" aria-live="assertive">
              <p className="font-pixel text-xs uppercase tracking-[0.25em] text-[#ff8da1] sm:text-sm">
                {easter.countdown}
              </p>
              <motion.p
                key={state.n}
                className="font-pixel text-[6.5rem] leading-none text-[#ff5a73] drop-shadow-[0_0_30px_rgb(255_60_110/0.8)] sm:text-[9rem]"
                initial={reduce ? false : { scale: 2.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
              >
                {state.n}
              </motion.p>
            </div>
          )}
          <button ref={btn} type="button" className="btn mt-6" onClick={onCancel}>
            {easter.apologize}
          </button>
        </div>
      )}
      {boom && (
        <>
          <Debris />
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-white"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}
        </>
      )}
    </motion.div>
  );
}

/** The modals, the toast and the self-destruct. Mounted once per page. */
export function BubuEgg({ c }: { c: Content }) {
  const { easter } = c;
  const reduce = useReducedMotion();
  // Overlays live on <body>: the page shakes during the self-destruct, and a
  // transformed ancestor would drag position:fixed children along with it.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [scene, setScene] = useState<Scene>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [farewell, setFarewell] = useState<Farewell>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const timers = useRef<number[]>([]);
  const familyRef = useRef<HTMLAudioElement | null>(null);

  // Load the "oooo family" line ahead of time so it starts instantly on the tap.
  useEffect(() => {
    const a = new Audio(asset(FAMILY_SRC));
    a.preload = "auto";
    a.volume = 0.9;
    familyRef.current = a;
    return () => {
      a.pause();
      familyRef.current = null;
    };
  }, []);

  const playFamily = useCallback(() => {
    const a = familyRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {
      /* autoplay blocked or no audio device: the animation carries on without sound */
    });
  }, []);

  const stopFamily = useCallback(() => familyRef.current?.pause(), []);

  // Restore the mood after a reload inside the same session.
  useEffect(() => {
    applyMood(readStage());
  }, []);

  const showToast = useCallback(
    (kind: Exclude<Toast, null>, delay = 0) => {
      window.clearTimeout(toastTimer.current);
      window.setTimeout(() => setToast(kind), reduce ? 0 : delay);
      toastTimer.current = window.setTimeout(() => setToast(null), delay + 5200);
    },
    [reduce],
  );

  const stopDoom = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    delete document.documentElement.dataset.doom;
    document.documentElement.style.removeProperty("--doom");
  }, []);

  const cancelFarewell = useCallback(() => {
    stopDoom();
    setFarewell(null);
    writeStage(0);
    applyMood(0);
    showToast("forgiven");
  }, [showToast, stopDoom]);

  const startFarewell = useCallback(() => {
    opener.current = document.activeElement;
    stopFamily();
    const root = document.documentElement;
    const doom = (v: number) => {
      if (reduce) return;
      root.dataset.doom = "";
      root.style.setProperty("--doom", String(v));
    };
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    setFarewell({ phase: "bye", n: 3 });
    doom(0.5);
    at(2600, () => {
      setFarewell({ phase: "count", n: 3 });
      doom(1);
    });
    at(3600, () => {
      setFarewell({ phase: "count", n: 2 });
      doom(1.8);
    });
    at(4600, () => {
      setFarewell({ phase: "count", n: 1 });
      doom(2.8);
    });
    at(5600, () => {
      setFarewell({ phase: "boom", n: 0 });
      doom(4);
    });
    at(7200, () => {
      stopDoom();
      writeStage(0); // coming back from Google, she is calm again
      applyMood(0);
      window.location.assign(GOOGLE);
    });
  }, [reduce, stopDoom, stopFamily]);

  const onPoke = useCallback(() => {
    if (scene || farewell) return;
    opener.current = document.activeElement;
    const stage = readStage();
    if (stage === 0) {
      setScene("wake");
      showToast("wake", 700);
      playFamily();
    } else if (stage === 1) {
      setScene("warn");
      showToast("warn", 700);
      playFamily();
    } else {
      startFarewell();
    }
  }, [scene, farewell, showToast, startFarewell, playFamily]);

  const closeScene = useCallback(() => {
    if (scene === "wake") {
      writeStage(1);
      applyMood(1);
    } else if (scene === "warn") {
      writeStage(2);
      applyMood(2);
    }
    stopFamily();
    setScene(null);
    (opener.current as HTMLElement | null)?.focus?.();
  }, [scene, stopFamily]);

  useEffect(() => {
    window.addEventListener(EVENT, onPoke);
    return () => window.removeEventListener(EVENT, onPoke);
  }, [onPoke]);

  // Coming back from Google through the back/forward cache must not leave the blast on screen.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        stopDoom();
        setFarewell(null);
        writeStage(0);
        applyMood(0);
      }
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, [stopDoom]);

  const open = scene !== null || farewell !== null;
  useEffect(() => {
    if (!open) return;
    if (scene) closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (farewell && farewell.phase !== "boom") cancelFarewell();
        else if (scene) closeScene();
      }
      if (e.key === "Tab") e.preventDefault(); // single focusable control: keep focus in the dialog
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, scene, farewell, closeScene, cancelFarewell]);

  const pop = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 0.8, y: 24, rotate: -2 },
        animate: { opacity: 1, scale: 1, y: 0, rotate: 0 },
        exit: { opacity: 0, scale: 0.92, y: 12 },
        transition: { type: "spring" as const, stiffness: 380, damping: 22 },
      };

  const toastText =
    toast === "wake" ? easter.toastWake : toast === "warn" ? easter.toastWarn : easter.toastForgiven;

  if (!mounted) return null;
  return createPortal(
    <>
      <AnimatePresence>
        {scene && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-[#04031a]/80 p-5"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeScene}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={scene === "wake" ? easter.modal : easter.warn}
              className="glass relative w-full max-w-sm overflow-hidden rounded-3xl p-6 text-center sm:max-w-md sm:p-8"
              onClick={(e) => e.stopPropagation()}
              {...pop}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(circle,rgb(232_121_200/0.35),transparent_70%)]"
              />
              <Characters angry={scene === "warn"} shake={scene === "warn" && !reduce} />
              <p
                className={`font-pixel leading-snug tracking-wide text-ink ${
                  scene === "warn" ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
                }`}
              >
                {scene === "wake" ? easter.modal : easter.warn}
              </p>
              <button ref={closeRef} type="button" className="btn btn-solid mt-7" onClick={closeScene}>
                {scene === "wake" ? easter.close : easter.warnClose}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {farewell && <FarewellScreen c={c} state={farewell} reduce={reduce} onCancel={cancelFarewell} />}
      </AnimatePresence>

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[99] flex justify-center px-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:justify-end"
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
                {toast === "forgiven" ? "💜" : "🏆"}
              </span>
              <span className="text-left">
                <span className="block font-pixel text-xs uppercase tracking-[0.16em] text-warm">
                  {toast === "forgiven" ? "Bubu" : easter.toastTitle}
                </span>
                <span className="mt-0.5 block text-sm text-ink">{toastText}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>,
    document.body,
  );
}
