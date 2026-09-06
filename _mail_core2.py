from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
TS_FUNCS = r'''
export function eightPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 40;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.48;
  const rock = Math.max(86, win.height * 0.52);
  const gripY = win.y + rock;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 36, maxLift) };
}

export function eightFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function eightOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.76) * 2.55;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 4.15 * (1 - ease) + stride * 0.17,
  };
}

export function eightPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.28) {
    const s = t / 0.28;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.6, lift: ease * -3.8, rot: ease * -4.4 };
  }
  if (t < 0.72) {
    const s = (t - 0.28) / 0.44;
    const plate = Math.sin(s * Math.PI);
    return { x: 0.6 + plate * 1.8, lift: -3.8 + plate * -5.2, rot: -4.4 + plate * -7.6 };
  }
  return { x: 0.8, lift: -4.2, rot: -5.1 };
}

export function eightHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.2;
  return { x: 0.8, lift: -4.2 + hush, rot: -5.1 };
}

export function eightOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.58) * 2.2;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : -5.1) * (1 - ease),
  };
}
'''
open(ROOT / "_mail_ts_funcs.txt", "w", encoding="utf-8", newline="\n").write(TS_FUNCS)
print("wrote ts funcs")
