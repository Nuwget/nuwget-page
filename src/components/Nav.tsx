"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Content } from "@/content/types";
import { DuduAvatar } from "./DuduAvatar";

export function Nav({ c }: { c: Content }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = c.ui.nav
      .map((n) => document.getElementById(n.id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [c.ui.nav]);

  return (
    <motion.header
      initial={reduce ? false : { y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-violet focus:px-4 focus:py-2 focus:text-bg"
      >
        {c.ui.skip}
      </a>
      <nav
        aria-label={c.lang === "pt" ? "Principal" : "Main"}
        className={`mx-auto mt-3 flex max-w-[1320px] items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-500 sm:mt-4 sm:px-4 ${
          scrolled || open ? "glass glass-blur !bg-[rgb(9_7_32/0.82)]" : "border border-transparent"
        } mx-3 sm:mx-auto`}
      >
        <a href="#inicio" className="flex items-center gap-2.5 pr-2" aria-label={c.hero.name}>
          <DuduAvatar size={34} />
          <span className="font-display text-xl leading-none">{c.hero.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {c.ui.nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active === n.id ? "true" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors hover:text-ink ${
                  active === n.id ? "bg-violet/20 text-ink" : "text-muted"
                }`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href={c.ui.switchTo.href}
            hrefLang={c.lang === "pt" ? "en" : "pt-BR"}
            aria-label={c.ui.switchTo.aria}
            className="rounded-full border border-line px-3 py-1.5 font-pixel text-xs tracking-widest text-lavender transition hover:border-lavender/60 hover:bg-violet/15"
          >
            {c.ui.switchTo.label}
          </Link>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-4 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-4 bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <ul id="menu-mobile" className="glass glass-blur !bg-[rgb(9_7_32/0.92)] mx-3 mt-2 flex flex-col rounded-3xl p-2 md:hidden">
          {c.ui.nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-ink hover:bg-violet/15"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </motion.header>
  );
}
