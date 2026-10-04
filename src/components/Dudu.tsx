import { SCENE, place } from "@/lib/scene";
import { Sprite } from "./Sprite";

const { sprites, src } = SCENE;

/**
 * Dudu is a small pre-cut sprite. The wrapper is moved by pointer parallax (JS,
 * transform only); the inner element breathes and sways; the eyelids are tiny
 * sprites whose opacity flickers for a blink.
 */
export function Dudu({ wrapRef }: { wrapRef: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={wrapRef} className="layer" style={place(sprites.dudu)} aria-hidden="true">
      <div className="anim-idle absolute inset-0">
        <Sprite src={src.dudu} small={src.duduSmall} widths={[400, 640]} className="absolute inset-0 h-full w-full" />
        <Sprite
          src={src.eyeLeft}
          className="anim-blink"
          style={place(sprites.eyeLeft, sprites.dudu)}
        />
        <Sprite
          src={src.eyeRight}
          className="anim-blink"
          style={place(sprites.eyeRight, sprites.dudu)}
        />
      </div>
    </div>
  );
}
