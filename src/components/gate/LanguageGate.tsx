"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import type { Lang } from "@/content/types";
import { asset } from "@/lib/asset";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DuduAvatar } from "../DuduAvatar";
import { GateScenery } from "./GateScenery";
import { GateShader } from "./GateShader";
import { GateSky } from "./GateSky";
import { PixelWipe, type WipeHandle } from "./PixelWipe";

/**
 * choose      the choice screen is up
 * picking     a card was picked; the pixel wipe is covering the screen
 * navigating  other language: the wipe is done and the new page is loading
 * opening     same language: the gate is gone and the wipe dissolves over the page
 * revealing   arrived from the other language: the wipe dissolves over the new page
 */
type Phase = "choose" | "picking" | "navigating" | "opening" | "revealing" | "done";

const GateCtx = createContext<{ ready: boolean }>({ ready: true });
/** `ready` turns true as the gate opens, so entrance animations wait for it. */
export const useGate = () => useContext(GateCtx);

export const GATE_KEY = "nuwget-gate";

const CHOICES: { lang: Lang; code: string; key: string; name: string; cta: string; href: string }[] = [
  { lang: "pt", code: "PT-BR", key: "P", name: "Português", cta: "Continuar em português", href: "/" },
  { lang: "en", code: "EN", key: "E", name: "English", cta: "Continue in English", href: "/en/" },
];

const COVER_MS = 680;
const UNCOVER_MS = 950;

export function GateProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  // Set by the inline script in <head> before first paint: "reveal" when arriving
  // from the other language, "show" on a fresh visit. The server snapshot is "show".
  const mode = useSyncExternalStore(
    () => () => {},
    () => document.documentElement.dataset.gate ?? "show",
    () => "show",
  );
  const [chosen, setPhase] = useState<Phase | null>(null);
  const [picked, setPicked] = useState<{ lang: Lang; x: number; y: number } | null>(null);
  const [covered, setCovered] = useState(false);
  const phase: Phase = chosen ?? (mode === "reveal" ? "revealing" : "choose");
  const pageRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const wipe = useRef<WipeHandle>(null);

  const ready = phase === "opening" || phase === "revealing" || phase === "done";
  const locked = phase === "choose" || phase === "picking" || phase === "navigating";

  useEffect(() => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    if (pageRef.current) pageRef.current.inert = locked;
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [locked]);

  // Arrived from the other language: the CSS veil is up; swap it for the canvas and dissolve.
  useEffect(() => {
    if (phase !== "revealing") return;
    const safety = window.setTimeout(() => setPhase("done"), reduce ? 700 : 3000);
    if (!reduce && wipe.current) {
      wipe.current.fill();
      setCovered(true);
      wipe.current.uncover([0.5, 0.5], UNCOVER_MS).then(() => setPhase("done"));
    }
    return () => window.clearTimeout(safety);
  }, [phase, reduce]);

  // Warm the cache for the other language so the switch is quick.
  useEffect(() => {
    if (phase !== "choose") return;
    const other = CHOICES.find((c) => c.lang !== lang)!;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = asset(other.href);
    document.head.appendChild(link);
    return () => link.remove();
  }, [phase, lang]);

  // Pointer parallax for moon, clouds and skyline.
  useEffect(() => {
    if (phase !== "choose" || reduce) return;
    const el = gateRef.current;
    if (!el) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const onMove = (e: PointerEvent) => {
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--px", nx.toFixed(3));
          el.style.setProperty("--py", ny.toFixed(3));
        });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [phase, reduce]);

  const choose = useCallback(
    (next: Lang, x: number, y: number) => {
      if (phase !== "choose") return;
      setPicked({ lang: next, x, y });
      setPhase("picking");
      const same = next === lang;
      const origin: [number, number] = [x / window.innerWidth, y / window.innerHeight];
      const target = CHOICES.find((c) => c.lang === next)!.href;

      if (!same) {
        try {
          sessionStorage.setItem(GATE_KEY, "reveal");
        } catch {
          /* storage blocked: the other page simply shows its own gate */
        }
      }
      if (reduce || !wipe.current) {
        if (same) setPhase("done");
        else window.location.assign(asset(target));
        return;
      }
      if (!same) {
        // start loading while the wipe is still closing
        window.setTimeout(() => window.location.assign(asset(target)), COVER_MS * 0.72);
      }
      wipe.current.cover(origin, COVER_MS).then(() => {
        if (same) {
          setPhase("opening");
          wipe.current?.uncover(origin, UNCOVER_MS).then(() => setPhase("done"));
        } else {
          setPhase("navigating");
        }
      });
    },
    [phase, lang, reduce],
  );

  const showGate = phase === "choose" || phase === "picking" || phase === "navigating" || phase === "revealing";

  return (
    <GateCtx.Provider value={{ ready }}>
      {showGate && (
        <div
          ref={gateRef}
          className="gate"
          data-phase={phase}
          data-picked={picked?.lang}
          data-covered={covered ? "true" : undefined}
          data-reduce={reduce ? "true" : undefined}
          role={phase === "choose" || phase === "picking" ? "dialog" : undefined}
          aria-modal={phase === "choose" || phase === "picking" ? true : undefined}
          aria-label="Escolha o idioma / Choose your language"
        >
          <div className="gate-ui" aria-hidden={phase !== "choose" ? true : undefined}>
            <div aria-hidden="true" className="gate-smoke">
              <i />
              <i />
              <i />
            </div>
            <GateShader key={reduce ? "still" : "live"} active={phase === "choose" || phase === "picking"} still={reduce} />
            {!reduce && <GateSky active={phase === "choose" || phase === "picking"} />}
            <GateScenery />
            <GateContent current={lang} phase={phase} onPick={choose} reduce={reduce} />
            {picked && phase === "picking" && !reduce && (
              <span aria-hidden="true" className="gate-ring" style={{ left: picked.x, top: picked.y }} />
            )}
          </div>
          <div className="gate-veil" />
        </div>
      )}
      <PixelWipe ref={wipe} />
      <div ref={pageRef} id="page-root">
        {children}
      </div>
    </GateCtx.Provider>
  );
}

function GateContent({
  current,
  phase,
  onPick,
  reduce,
}: {
  current: Lang;
  phase: Phase;
  onPick: (lang: Lang, x: number, y: number) => void;
  reduce: boolean;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (phase !== "choose") return;
    refs.current[CHOICES.findIndex((c) => c.lang === current)]?.focus({ preventScroll: true });
  }, [phase, current]);

  const pick = (lang: Lang, el: HTMLElement, e?: { clientX: number; clientY: number }) => {
    const r = el.getBoundingClientRect();
    onPick(lang, e && e.clientX ? e.clientX : r.left + r.width / 2, e && e.clientY ? e.clientY : r.top + r.height / 2);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = refs.current.findIndex((b) => b === document.activeElement);
    if (["ArrowDown", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      refs.current[(i + 1) % CHOICES.length]?.focus();
    } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      refs.current[(i - 1 + CHOICES.length) % CHOICES.length]?.focus();
    } else {
      const k = CHOICES.findIndex((c) => c.key.toLowerCase() === e.key.toLowerCase());
      if (k >= 0 && refs.current[k]) pick(CHOICES[k].lang, refs.current[k]!);
    }
  };

  // With reduced motion the content still settles in, just instantly (omitting the props
  // would leave the server-rendered opacity: 0 in place).
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div
      className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-5 py-8 text-center"
      onKeyDown={onKeyDown}
    >
      <motion.div className="flex items-end justify-center gap-4" {...rise(0.1)}>
        <div className="gate-avatar">
          <DuduAvatar size={104} />
        </div>
        <div className="gate-avatar gate-avatar-sm relative">
          <DuduAvatar size={54} focus={[0.865, 0.5]} zoom={7.5} />
          <span aria-hidden="true" className="gate-z">
            z
          </span>
          <span aria-hidden="true" className="gate-z gate-z2">
            z
          </span>
        </div>
      </motion.div>

      <motion.h1
        className="mt-7 bg-gradient-to-b from-white to-[#bfa9ff] bg-clip-text font-display text-[clamp(2.7rem,7.5vw,4.6rem)] leading-[0.95] tracking-tight text-transparent"
        {...rise(0.22)}
      >
        Escolha o idioma
      </motion.h1>
      <motion.p className="mt-3 text-lg text-[#d8d1ff]" {...rise(0.3)}>
        Choose your language
      </motion.p>

      <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
        {CHOICES.map((c, i) => (
          <motion.div key={c.lang} {...rise(0.42 + i * 0.1)}>
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              lang={c.lang === "pt" ? "pt-BR" : "en"}
              className="gate-card"
              data-lang={c.lang}
              data-current={c.lang === current ? "true" : undefined}
              onPointerMove={onCardMove}
              onPointerLeave={onCardLeave}
              onClick={(e) => pick(c.lang, e.currentTarget, e)}
            >
              <span className="gate-shine" aria-hidden="true" />
              <span className="gate-card-top">
                <span className="gate-code">{c.code}</span>
                <span className="gate-arrow" aria-hidden="true">
                  →
                </span>
              </span>
              <span className="gate-name">{c.name}</span>
              <span className="gate-card-bottom">
                <span className="gate-cta">{c.cta}</span>
                <kbd className="gate-kbd" aria-hidden="true">
                  {c.key}
                </kbd>
              </span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function onCardMove(e: React.PointerEvent<HTMLButtonElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  el.style.setProperty("--sx", `${e.clientX - r.left}px`);
  el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  el.style.setProperty("--rx", `${((0.5 - py) * 9).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${((px - 0.5) * 11).toFixed(2)}deg`);
}

function onCardLeave(e: React.PointerEvent<HTMLButtonElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}
