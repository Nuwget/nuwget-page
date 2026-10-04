import type { ReactNode } from "react";
import { Geist, Geist_Mono, Instrument_Serif, Pixelify_Sans } from "next/font/google";
import "@/app/globals.css";
import type { Lang } from "@/content/types";
import { Background } from "./Background";
import { AmbientEffects } from "./AmbientEffects";
import { Cursor } from "./Cursor";

const sans = Geist({ variable: "--f-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--f-mono", subsets: ["latin"] });
const display = Instrument_Serif({
  variable: "--f-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const pixel = Pixelify_Sans({ variable: "--f-pixel", subsets: ["latin"] });

export function Document({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  return (
    <html
      lang={lang === "pt" ? "pt-BR" : "en"}
      className={`${sans.variable} ${mono.variable} ${display.variable} ${pixel.variable}`}
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Decide before first paint whether to show the language gate or the reveal veil. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var g=sessionStorage.getItem("nuwget-gate");document.documentElement.dataset.gate=g==="reveal"?"reveal":"show";sessionStorage.removeItem("nuwget-gate")}catch(e){document.documentElement.dataset.gate="show"}`,
          }}
        />
        <noscript>
          <style>{`.gate{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <Background />
        <AmbientEffects />
        <Cursor />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
