"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import type { Lang } from "@/content/types";
import { asset } from "@/lib/asset";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DuduAvatar } from "../DuduAvatar";
import { GateShader } from "./GateShader";

type Phase = "choose" | "covering" | "covered" | "dissolving" | "done";

const GateCtx = createContext<{ ready: boolean }>({ ready: true });
/** `ready` turns true when the gate has opened, so entrance animations wait for it. */
export const useGate = () => useContext(GateCtx);

export const GATE_KEY = "nuwget-gate";

const CHOICES: { lang: Lang; word: string; tag: string; sub: string; href: string }[] = [
  { lang: "pt", word: "Português", tag: "PT-BR", sub: "Brasil", href: "/" },
  { lang: "en", word: "English", tag: "EN", sub: "International", href: "/en/" },
];

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
  const phase: Phase = chosen ?? (mode === "reveal" ? "covered" : "choose");
  const [pick, setPick] = useState<{ x: number; y: number; r: number; lang: Lang }>({
    x: 0,
    y: 0,
    r: 0,
    lang,
  });
  const pageRef = useRef<HTMLDivElement>(null);

  const ready = phase === "dissolving" || phase === "done";
  const locked = phase === "choose" || phase === "covering" || phase === "covered";

  useEffect(() => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    if (pageRef.current) pageRef.current.inert = locked;
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [locked]);

  useEffect(() => {
    if (phase !== "covered") return;
    // Same language chosen: open straight away. Arrived by reveal: give the page a beat to settle.
    const revealed = mode === "reveal" && pick.r === 0;
    const t = window.setTimeout(() => setPhase("dissolving"), revealed ? 380 : 60);
    return () => window.clearTimeout(t);
  }, [phase, pick.r, mode]);

  const choose = useCallback(
    (next: Lang, x: number, y: number) => {
      if (phase !== "choose") return;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      setPick({ x, y, r, lang: next });
      setPhase("covering");
    },
    [phase],
  );

  const onVeilDone = () => {
    if (phase === "covering") {
      if (pick.lang === lang) {
        setPhase("covered");
      } else {
        try {
          sessionStorage.setItem(GATE_KEY, "reveal");
        } catch {
          /* storage blocked: the other page simply shows its own gate */
        }
        const target = CHOICES.find((c) => c.lang === pick.lang)!.href;
        window.location.assign(asset(target));
      }
    } else if (phase === "dissolving") {
      setPhase("done");
    }
  };

  const veil =
    phase === "covering"
      ? reduce
        ? { opacity: [0, 1] }
        : {
            opacity: 1,
            clipPath: [
              `circle(0px at ${pick.x}px ${pick.y}px)`,
              `circle(${pick.r}px at ${pick.x}px ${pick.y}px)`,
            ],
          }
      : phase === "choose"
        ? { opacity: 0 }
        : phase === "covered"
          ? { opacity: 1 }
          : phase === "dissolving"
            ? reduce
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.06 }
            : undefined;

  const veilTransition =
    phase === "covering"
      ? { duration: reduce ? 0.25 : 0.9, ease: [0.76, 0, 0.18, 1] as const }
      : phase === "dissolving"
        ? { duration: reduce ? 0.3 : 1.15, ease: [0.22, 1, 0.36, 1] as const }
        : { duration: 0 };

  return (
    <GateCtx.Provider value={{ ready }}>
      {phase !== "done" && (
        <div
          className="gate"
          data-phase={phase}
          role={phase === "choose" || phase === "covering" ? "dialog" : undefined}
          aria-modal={phase === "choose" || phase === "covering" ? true : undefined}
          aria-label="Escolha o idioma / Choose your language"
        >
          <div className="gate-ui" aria-hidden={phase !== "choose" ? true : undefined}>
            {!reduce && <GateShader active={phase === "choose" || phase === "covering"} />}
            <GateContent current={lang} phase={phase} onPick={choose} reduce={reduce} />
          </div>
          <motion.div
            className="gate-veil"
            initial={false}
            animate={veil}
            transition={veilTransition}
            onAnimationComplete={onVeilDone}
          />
        </div>
      )}
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

  const choose = (lang: Lang, el: HTMLElement, e?: { clientX: number; clientY: number }) => {
    const r = el.getBoundingClientRect();
    const x = e && e.clientX ? e.clientX : r.left + r.width / 2;
    const y = e && e.clientY ? e.clientY : r.top + r.height / 2;
    onPick(lang, x, y);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = refs.current.findIndex((b) => b === document.activeElement);
    if (["ArrowDown", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      refs.current[(i + 1) % CHOICES.length]?.focus();
    } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      refs.current[(i - 1 + CHOICES.length) % CHOICES.length]?.focus();
    } else if (e.key.toLowerCase() === "p" || e.key.toLowerCase() === "e") {
      const k = CHOICES.findIndex((c) => c.lang === (e.key.toLowerCase() === "p" ? "pt" : "en"));
      if (refs.current[k]) choose(CHOICES[k].lang, refs.current[k]!);
    }
  };

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className="relative mx-auto flex h-full max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-8" onKeyDown={onKeyDown}>
      <motion.header className="flex items-center justify-between" {...rise(0.2)}>
        <div className="flex items-center gap-3">
          <DuduAvatar size={40} />
          <span className="font-display text-2xl leading-none">Nuwget</span>
        </div>
        <div aria-hidden="true" className="flex items-center gap-2 font-pixel text-xs tracking-[0.2em] text-lavender/70">
          <span className="gate-z">z</span>
          <DuduAvatar size={34} focus={[0.865, 0.5]} zoom={7.5} />
        </div>
      </motion.header>

      <div className="flex flex-1 flex-col justify-center">
        <motion.p className="font-pixel text-xs uppercase tracking-[0.22em] text-lavender/80 sm:text-sm" {...rise(0.35)}>
          Escolha o idioma <span className="text-violet">/</span> Choose your language
          <span className="gate-caret" aria-hidden="true" />
        </motion.p>

        <div className="mt-6 sm:mt-8">
          {CHOICES.map((c, i) => (
            <Choice
              key={c.lang}
              choice={c}
              current={c.lang === current}
              reduce={reduce}
              delay={0.5 + i * 0.14}
              innerRef={(el) => {
                refs.current[i] = el;
              }}
              onChoose={(e) => choose(c.lang, e.currentTarget, e)}
            />
          ))}
        </div>
      </div>

      <motion.footer
        className="flex items-center justify-between font-pixel text-[0.65rem] uppercase tracking-[0.2em] text-faint sm:text-xs"
        {...rise(1)}
      >
        <span>Dudu &amp; Bubu</span>
        <span className="hidden sm:inline">← → · P · E · Enter</span>
      </motion.footer>
    </div>
  );
}

function Choice({
  choice,
  current,
  reduce,
  delay,
  innerRef,
  onChoose,
}: {
  choice: (typeof CHOICES)[number];
  current: boolean;
  reduce: boolean;
  delay: number;
  innerRef: (el: HTMLButtonElement | null) => void;
  onChoose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <button
      ref={innerRef}
      type="button"
      lang={choice.lang === "pt" ? "pt-BR" : "en"}
      className="gate-choice"
      data-current={current ? "true" : undefined}
      onPointerMove={onMove}
      onClick={onChoose}
    >
      <span className="gate-tag">
        {choice.tag}
        {current && <i aria-hidden="true" />}
      </span>
      <span className="gate-word" aria-label={choice.word}>
        <span className="block overflow-hidden pb-[0.14em]">
          <motion.span
            className="flex"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          >
            {[...choice.word].map((ch, i) => (
              <span key={i} aria-hidden="true" className="gate-letter" style={{ transitionDelay: `${i * 24}ms` }}>
                {ch}
              </span>
            ))}
          </motion.span>
        </span>
      </span>
      <span className="gate-sub">{choice.sub}</span>
      <span className="gate-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}
