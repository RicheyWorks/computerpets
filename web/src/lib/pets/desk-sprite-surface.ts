import surface from "../../../../desktop/renderer/sprite-surface.js";

/** Catalog frames on the shared Chromium sprite surface. A closed canvas stays blank. */
function paintBox(canvas: HTMLCanvasElement | null, src: string, css: number) {
  if (!canvas || typeof canvas.getContext !== "function") {
    if (canvas?.dataset) {
      canvas.dataset.surface = "refused";
      delete canvas.dataset.frame;
    }
    return { ok: false, kind: "refused", reason: "no-canvas", src: src || "" };
  }
  if (!surface || typeof surface.paintHeld !== "function" || !(css > 0)) {
    canvas.dataset.surface = "refused";
    delete canvas.dataset.frame;
    return { ok: false, kind: "refused", reason: "no-surface", src };
  }
  const painted = surface.paintHeld(canvas, src, { cssSize: css });
  if (!painted || painted.ok !== true) {
    return painted ?? { ok: false, kind: "refused", reason: "paint", src };
  }
  return painted;
}

function box(kind: "host" | "sip" | "brick" | "called" | "plant") {
  const row = surface && surface.BOX ? surface.BOX : null;
  const n = row ? row[kind] : 0;
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : 0;
}

/** Every `LivingPet`: the living-desk and `/demo` room pet, the day's visitor, the house floor, the hive, and the den blotters. Host box, contain, then sit on the bottom. */
export function paintDemoFrame(canvas: HTMLCanvasElement | null, src: string) {
  return paintBox(canvas, src, box("host"));
}

/** Desk Sip. 112px box. */
export function paintSipFrame(canvas: HTMLCanvasElement | null, src: string) {
  return paintBox(canvas, src, box("sip"));
}

/** Desk Brick. 112px box. */
export function paintBrickFrame(canvas: HTMLCanvasElement | null, src: string) {
  return paintBox(canvas, src, box("brick"));
}

/** Desk called guest. 128px box. */
export function paintCalledFrame(canvas: HTMLCanvasElement | null, src: string) {
  return paintBox(canvas, src, box("called"));
}

/** Desk plant. 128px box. */
export function paintPlantFrame(canvas: HTMLCanvasElement | null, src: string) {
  return paintBox(canvas, src, box("plant"));
}
