import { asset } from "@/lib/asset";
import { SCENE } from "@/lib/scene";
import type { CSSProperties } from "react";

const src = asset(SCENE.src.full);
const srcSet = `${asset(SCENE.src.small)} 1000w, ${asset(SCENE.src.full)} 1600w`;

/** Full-frame copy of the hero illustration; every scene layer is built from this one URL. */
export function SceneImage({
  priority = false,
  style,
}: {
  priority?: boolean;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="scene-layer pixelated"
      src={src}
      srcSet={srcSet}
      sizes="(max-width: 1000px) 1000px, 1600px"
      alt=""
      draggable={false}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      style={style}
    />
  );
}

/**
 * A rectangular window onto the illustration, optionally showing the pixels `dy`
 * (percent of image height) above it. Used for eyelids: the fur above an eye is
 * slid down over it, which reads as a closed lid without any new artwork.
 */
export function ImageRegion({
  x,
  y,
  w,
  h,
  dy = 0,
  className,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  dy?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
        overflow: "hidden",
        borderRadius: "50%",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="pixelated"
        src={src}
        alt=""
        draggable={false}
        decoding="async"
        style={{
          position: "absolute",
          maxWidth: "none",
          width: `${(100 / w) * 100}%`,
          left: `${(-x / w) * 100}%`,
          top: `${(-(y - dy) / h) * 100}%`,
        }}
      />
      {children}
    </div>
  );
}
