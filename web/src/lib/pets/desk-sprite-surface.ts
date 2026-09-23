import surface from "../../../../desktop/renderer/sprite-surface.js";

/** Desk `/demo` pet frames on the shared Chromium sprite surface. A closed canvas stays blank. */
export function paintDemoFrame(canvas: HTMLCanvasElement | null, src: string) {
  if (!canvas || typeof canvas.getContext !== "function") {
    if (canvas?.dataset) {
      canvas.dataset.surface = "refused";
      delete canvas.dataset.frame;
    }
    return { ok: false, kind: "refused", reason: "no-canvas", src: src || "" };
  }
  if (!surface || typeof surface.paintHeld !== "function" || !(surface.BOX && surface.BOX.host > 0)) {
    canvas.dataset.surface = "refused";
    delete canvas.dataset.frame;
    return { ok: false, kind: "refused", reason: "no-surface", src };
  }
  const painted = surface.paintHeld(canvas, src, { cssSize: surface.BOX.host });
  if (!painted || painted.ok !== true) {
    return painted ?? { ok: false, kind: "refused", reason: "paint", src };
  }
  return painted;
}
