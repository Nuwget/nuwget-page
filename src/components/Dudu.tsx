import { SCENE } from "@/lib/scene";
import { ImageRegion, SceneImage } from "./SceneImage";

/** Dudu: his own layer, so he can breathe, sway, blink and move with the pointer. */
export function Dudu() {
  const { left, right } = SCENE.eyes;
  return (
    <div className="scene-layer dudu-mask" aria-hidden="true">
      <div className="scene-layer px" style={{ ["--k" as string]: 7 }}>
        <div className="scene-layer anim-sway">
          <div className="scene-layer anim-breathe">
            <SceneImage />
            {[left, right].map((eye, i) => (
              <div key={i} className="anim-blink" style={{ animationDelay: i ? "0s" : "0s" }}>
                <ImageRegion x={eye.x} y={eye.y} w={eye.w} h={eye.h} dy={eye.dy}>
                  <span
                    style={{
                      position: "absolute",
                      left: "8%",
                      right: "8%",
                      top: "34%",
                      height: "34%",
                      borderBottom: "calc(var(--w) * 0.0032) solid #2a1245",
                      borderRadius: "0 0 50% 50% / 0 0 100% 100%",
                    }}
                  />
                </ImageRegion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
