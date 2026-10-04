import { asset } from "@/lib/asset";
import { SCENE } from "@/lib/scene";

/** Dudu's face, cropped from the hero illustration. */
export function DuduAvatar({ size = 36 }: { size?: number }) {
  const bgW = size * 2.5;
  const bgH = (bgW * SCENE.height) / SCENE.width;
  return (
    <span
      aria-hidden="true"
      className="pixelated inline-block shrink-0 rounded-full ring-1 ring-lavender/40"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${asset(SCENE.src.small)})`,
        backgroundSize: `${bgW}px ${bgH}px`,
        backgroundPosition: `${size / 2 - 0.395 * bgW}px ${size / 2 - 0.46 * bgH}px`,
      }}
    />
  );
}
