/**
 * Scene targets give way (reduced motion 2, September 2026). A walking pet, a room guest or a called guest that walks
 * under the controls drawn over it (the care row, a plant, a link, another guest on top), or a desk plant that a small
 * phone's care row stands over, keeps only a sliver a finger can reach; below a 24×24 px square of it the target steps
 * out of the Tab order and out of hit testing (`inert`) until it is clear again, so the keyboard is not sent to
 * something hidden behind the care buttons either. Nothing is taken from anyone: the controls over it already took those
 * taps, and the guest stays drawn. The focused target and one being held are never touched, so a keyboard or a drag
 * in progress keeps it. Measured with the page's own hit testing (what is really on top), a few times a second, only
 * for a target that another control overlaps at all.
 */

/** The smallest square of a target a pointer must be able to reach (WCAG 2.5.8, and axe's target-size). */
export const GIVE_WAY_PX = 24;
/** The sampling step: a free square is four reachable points across and down (24 px between the outer ones). */
export const GIVE_WAY_STEP = 8;
/** How often the targets are looked at. */
export const GIVE_WAY_MS = 400;

const CONTROLS = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"]';

/**
 * Whether a grid of reachable steps (rows of booleans, one per step of `step` px) holds a free square of `size` px.
 * Pure, so it is tested on its own.
 */
export function hasFreeSquare(hit: readonly (readonly boolean[])[], step = GIVE_WAY_STEP, size = GIVE_WAY_PX): boolean {
  // One step more than the square: sample points k steps apart only promise (k - 1) steps between them, so a run of
  // ceil(size / step) + 1 reachable points is what makes the whole square reachable.
  const k = Math.max(1, Math.ceil(size / step)) + 1;
  const rows = hit.length;
  const cols = rows ? hit[0]!.length : 0;
  if (rows < k || cols < k) return false;
  // Largest all-true square ending at each cell (the classic running count).
  let prev = new Array<number>(cols).fill(0);
  for (let r = 0; r < rows; r += 1) {
    const cur = new Array<number>(cols).fill(0);
    for (let c = 0; c < cols; c += 1) {
      if (!hit[r]![c]) continue;
      cur[c] = r && c ? Math.min(prev[c]!, cur[c - 1]!, prev[c - 1]!) + 1 : 1;
      if (cur[c]! >= k) return true;
    }
    prev = cur;
  }
  return false;
}

type Box = { left: number; top: number; right: number; bottom: number };

const encloses = (a: Box, b: Box) => a.left <= b.left && a.top <= b.top && a.right >= b.right && a.bottom >= b.bottom;
const overlaps = (a: Box, b: Box) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** Whether a finger can reach a free square of `el`, by the page's own hit testing. */
export function reachable(el: HTMLElement, doc: Document = el.ownerDocument): boolean {
  const box = el.getBoundingClientRect();
  const view = doc.defaultView;
  const left = Math.max(0, box.left);
  const top = Math.max(0, box.top);
  const right = Math.min(view?.innerWidth ?? box.right, box.right);
  const bottom = Math.min(view?.innerHeight ?? box.bottom, box.bottom);
  const hit: boolean[][] = [];
  for (let y = top + GIVE_WAY_STEP / 2; y < bottom; y += GIVE_WAY_STEP) {
    const row: boolean[] = [];
    for (let x = left + GIVE_WAY_STEP / 2; x < right; x += GIVE_WAY_STEP) {
      const at = doc.elementFromPoint(x, y);
      row.push(!!at && (at === el || el.contains(at)));
    }
    hit.push(row);
  }
  return hasFreeSquare(hit);
}

const targets = new Set<HTMLElement>();
const held = new WeakSet<HTMLElement>();
let timer = 0;

/** One look at every target: under the controls over it, it gives way; clear again, it comes back. */
export function giveWayNow(doc: Document = document): void {
  if (!targets.size) return;
  const active = doc.activeElement;
  const controls: { el: Element; box: Box }[] = [];
  for (const el of doc.querySelectorAll(CONTROLS)) {
    const box = el.getBoundingClientRect();
    if (box.width && box.height) controls.push({ el, box });
  }
  for (const el of targets) {
    if (!el.isConnected) {
      targets.delete(el);
      continue;
    }
    const keep = held.has(el) || (active != null && (el === active || el.contains(active)));
    // Measured as itself: an inert target is not hit by the page's hit testing, so it is let back first.
    const was = el.inert;
    if (was) el.inert = false;
    if (keep) {
      el.removeAttribute("data-giving-way");
      continue;
    }
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) continue;
    // A control that encloses the whole target (the desk floor's own "drop a treat" button) is the ground it walks
    // on, not something over it; the rest are checked only where they overlap it at all.
    const covered = controls.some(
      (c) => c.el !== el && !el.contains(c.el) && !c.el.contains(el) && overlaps(c.box, box) && !encloses(c.box, box),
    );
    const out = covered && !reachable(el, doc);
    if (out) el.inert = true;
    if (out !== was) el.toggleAttribute("data-giving-way", out);
  }
}

/**
 * Looks after a moving target while it is on the page; returns the undo. A press on it holds it (a drag keeps its
 * target) until the pointer lets go.
 */
export function giveWay(el: HTMLElement | null): () => void {
  if (!el || typeof window === "undefined") return () => {};
  targets.add(el);
  const hold = () => held.add(el);
  const letGo = () => held.delete(el);
  el.addEventListener("pointerdown", hold);
  window.addEventListener("pointerup", letGo);
  window.addEventListener("pointercancel", letGo);
  if (!timer) timer = window.setInterval(() => giveWayNow(document), GIVE_WAY_MS);
  // The first look on the next frame, once it is laid out, not a whole interval later.
  window.requestAnimationFrame(() => giveWayNow(document));
  return () => {
    targets.delete(el);
    held.delete(el);
    el.removeEventListener("pointerdown", hold);
    window.removeEventListener("pointerup", letGo);
    window.removeEventListener("pointercancel", letGo);
    if (el.inert) el.inert = false;
    el.removeAttribute("data-giving-way");
    if (!targets.size && timer) {
      window.clearInterval(timer);
      timer = 0;
    }
  };
}
