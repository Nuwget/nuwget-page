import { asset } from "@/lib/asset";
import { SCENE, place, type Box } from "@/lib/scene";

const INK = "#2b1247";
const VEIN = "#ff5a73";

/** The four-arc anger mark. Drawn around (0,0). */
function Vein({ s = 1 }: { s?: number }) {
  return (
    <g
      className="vein"
      stroke={VEIN}
      strokeWidth={3.4}
      fill="none"
      strokeLinecap="round"
      transform={`scale(${s})`}
    >
      <path d="M-10 -3.5 Q-3.5 -3.5 -3.5 -10" />
      <path d="M10 -3.5 Q3.5 -3.5 3.5 -10" />
      <path d="M-10 3.5 Q-3.5 3.5 -3.5 10" />
      <path d="M10 3.5 Q3.5 3.5 3.5 10" />
    </g>
  );
}

/**
 * Bubu's angry face: a baked overlay sprite (eyes, brows, pout, puffed cheeks)
 * plus a pulsing anger mark and steam puffs. Hidden until the page (or an
 * ancestor with data-angry="true") says she is angry.
 */
export function BubuAngry({ parent, className = "" }: { parent?: Box; className?: string }) {
  const box = SCENE.sprites.bubu;
  const style = parent
    ? place(box, parent)
    : ({ position: "absolute", inset: 0 } as const);
  return (
    <div className={`bubu-angry angry-only ${className}`} style={style} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="pixelated absolute inset-0 h-full w-full max-w-none"
        src={asset(SCENE.src.bubuAngry)}
        alt=""
        draggable={false}
        decoding="async"
      />
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 256 215">
        <g transform="translate(90 44)">
          <Vein s={1.15} />
        </g>
      </svg>
      <span className="puff" style={{ left: "30%", top: "14%" }} />
      <span className="puff" style={{ left: "42%", top: "8%", animationDelay: "0.6s" }} />
      <span className="puff" style={{ left: "24%", top: "20%", animationDelay: "1.2s" }} />
      <span className="huff">HMPF!</span>
    </div>
  );
}

/**
 * Dudu's angry brows and anger mark, in source-illustration pixel coordinates.
 * `viewBox` is the region of the 1600×1067 illustration that this overlay covers.
 */
export function DuduAngry({ viewBox, className = "" }: { viewBox: string; className?: string }) {
  return (
    <svg
      className={`dudu-angry angry-only absolute inset-0 h-full w-full ${className}`}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke={INK} strokeWidth="13" strokeLinecap="round" fill="none">
        <path d="M392 468 L486 498" />
        <path d="M606 497 L708 458" />
      </g>
      <g transform="translate(740 330)">
        <Vein s={4.4} />
      </g>
    </svg>
  );
}
