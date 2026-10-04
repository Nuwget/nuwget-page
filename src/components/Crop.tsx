import { asset } from "@/lib/asset";
import { SCENE } from "@/lib/scene";

/** A framed crop of the hero illustration. Coordinates are percent of the image. */
export function Crop({
  x,
  y,
  w,
  h,
  label,
  className = "",
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const ratio = (w * SCENE.width) / (h * SCENE.height);
  return (
    <div
      role="img"
      aria-label={label}
      className={`pixelated relative overflow-hidden rounded-[var(--radius)] border border-line ${className}`}
      style={{
        aspectRatio: ratio,
        backgroundImage: `url(${asset(SCENE.src.full)})`,
        backgroundSize: `${(100 / w) * 100}% auto`,
        backgroundPosition: `${(x / (100 - w)) * 100}% ${(y / (100 - h)) * 100}%`,
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
}
