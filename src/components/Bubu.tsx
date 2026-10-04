import { SceneImage } from "./SceneImage";

/** Bubu: a quiet layer on the sofa. She only breathes, slowly. */
export function Bubu() {
  return (
    <div className="scene-layer bubu-mask" aria-hidden="true">
      <div className="scene-layer px" style={{ ["--k" as string]: 3 }}>
        <div className="scene-layer anim-breathe-slow">
          <SceneImage />
        </div>
      </div>
    </div>
  );
}
