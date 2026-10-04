import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Section({
  id,
  index,
  title,
  children,
  className = "",
}: {
  id?: string;
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-28 ${className}`}>
      <Reveal className="mb-12 sm:mb-16">
        <p className="eyebrow mb-3">{index}</p>
        <h2 className="font-display text-5xl leading-none tracking-tight sm:text-7xl">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}
