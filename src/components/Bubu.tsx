import { SCENE, place } from "@/lib/scene";
import { BubuAngry } from "./AngryMarks";
import { Sprite } from "./Sprite";

const { sprites, src } = SCENE;

/** Bubu: a quiet sprite on the sofa. She only breathes, slowly. */
export function Bubu({ wrapRef }: { wrapRef: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={wrapRef} className="layer" style={place(sprites.bubu)} aria-hidden="true">
      <div className="anim-breathe-slow absolute inset-0">
        <div className="bubu-tremble absolute inset-0">
          <Sprite src={src.bubu} small={src.bubuSmall} widths={[160, 256]} className="absolute inset-0 h-full w-full" />
          <BubuAngry />
        </div>
      </div>
    </div>
  );
}
