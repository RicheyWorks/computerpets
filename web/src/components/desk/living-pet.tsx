import { useEffect, useRef } from "react";
import { ANIM_FPS, ONCE_ANIMS, RED_PANDA_SPRITES, type PetAnim } from "@/lib/pets/red-panda";
import type { SpritePack } from "@/lib/pets/living";
import { playDeskSound } from "@/lib/pets/desk-audio";
import {
  actPose,
  afterSettleWait,
  nextActWait,
  pickAct,
  tongueFlick,
  type ActMotion,
} from "@/lib/pets/ethogram";
import { dayPart } from "@/lib/pets/hours";
import { traitFor } from "@/lib/pets/traits";
import { afterPlace, arriveFinish, pointerUp, walkLand } from "@/lib/pets/arrive";
import { carePointer, tapPxFor } from "@/lib/pets/mac-desk";
import {
  BREATHE_IDLE,
  BREATHE_SLEEP,
  HIGH_HOP,
  LAND_DECAY,
  PERCH_STEP_PX,
  POSE_HOLD_S,
  SETTLE_S,
  STEP_S,
  STEP_S_QUICK,
  SWAY_PX,
  WALK_HOP_PX,
  isCrawlKey,
  isHighWalk,
  isLowWalk,
  overshootPx,
  settleOffset,
  turnHoldS,
  walkSpeed,
  wanderPauseS,
} from "@/lib/pets/gait";

export type PetCommand = PetAnim | "wander" | "leave" | "enter" | "seek" | "none";

type Gait = {
  walk: number;
  hop: number;
  scale: number;
  perch?: boolean;
  aquatic?: boolean;
};

type LivingPetProps = {
  command: PetCommand;
  orderId: number;
  speech: string | null;
  sprites?: SpritePack;
  fps?: Record<PetAnim, number>;
  once?: ReadonlySet<PetAnim>;
  gait?: Gait;
  kind?: string;
  startX?: number;
  /** Extra rise off the floor. Bees sit on Wax with this. */
  lift?: number;
  hidden?: boolean;
  unwell?: boolean;
  dull?: boolean;
  stage?: "hatchling" | "grown" | "elder";
  seekX?: number;
  onArrived?: () => void;
  onTap?: () => void;
};

type Dust = { x: number; y: number; vx: number; vy: number; life: number; size: number };

type Sim = {
  x: number;
  facing: 1 | -1;
  anim: PetAnim;
  frame: number;
  acc: number;
  target: number | null;
  hop: number;
  land: number;
  walkAge: number;
  dragging: boolean;
  dragDx: number;
  pointerStart: { x: number; y: number } | null;
  cursorX: number | null;
  dust: Dust[];
  stepAcc: number;
  turnHold: number;
  pendingFacing: 1 | -1 | null;
  waypoints: number[];
  pause: number;
  settle: number;
  settleDir: 1 | -1;
  overshoot: number;
  poseHold: number;
  pendingPose: PetAnim | null;
  shift: number;
  shiftAge: number;
  arrivedPending: boolean;
  leaving: boolean;
  act: string | null;
  actMotion: ActMotion | null;
  actT: number;
  actHold: number;
  actWait: number;
  actWalk: boolean;
};

const WALK_SPEED = 98;
const PAD = 20;
const SPRITE = 176;
const BUBBLE_W = 220;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function floorY(h: number) {
  return h * 0.27;
}

export function LivingPet({
  command,
  orderId,
  speech,
  sprites = RED_PANDA_SPRITES,
  fps = ANIM_FPS,
  once = ONCE_ANIMS,
  gait,
  kind,
  startX = 120,
  lift = 0,
  hidden = false,
  unwell = false,
  dull = false,
  stage = "grown",
  seekX,
  onArrived,
  onTap,
}: LivingPetProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const tongueRef = useRef<SVGSVGElement>(null);
  const sim = useRef<Sim>({
    x: startX,
    facing: 1,
    anim: "idle",
    frame: 0,
    acc: 0,
    target: null,
    hop: 0,
    land: 0,
    walkAge: 0,
    dragging: false,
    dragDx: 0,
    pointerStart: null,
    cursorX: null,
    dust: [],
    stepAcc: 0,
    turnHold: 0,
    pendingFacing: null,
    waypoints: [],
    pause: 0,
    settle: 0,
    settleDir: 1,
    overshoot: 0,
    poseHold: 0,
    pendingPose: null,
    shift: 0,
    shiftAge: 0,
    arrivedPending: false,
    leaving: false,
    act: null,
    actMotion: null,
    actT: 0,
    actHold: 0,
    actWait: 10 + Math.random() * 8,
    actWalk: false,
  });
  const cmdRef = useRef(command);
  const orderRef = useRef(orderId);
  const lastOrder = useRef(-1);
  const arrivedRef = useRef(onArrived);
  const tapRef = useRef(onTap);
  const spritesRef = useRef(sprites);
  const fpsRef = useRef(fps);
  const onceRef = useRef(once);
  const gaitRef = useRef(gait);
  const stageRef = useRef(stage);
  const kindRef = useRef(kind);
  const liftRef = useRef(lift);
  gaitRef.current = gait;
  stageRef.current = stage;
  kindRef.current = kind;
  liftRef.current = lift;
  const seekRef = useRef(seekX);
  seekRef.current = seekX;
  spritesRef.current = sprites;
  fpsRef.current = fps;
  onceRef.current = once;
  cmdRef.current = command;
  orderRef.current = orderId;
  arrivedRef.current = onArrived;
  tapRef.current = onTap;

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const s = sim.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();
    let raf = 0;

    const stageBox = () => root.parentElement?.getBoundingClientRect();

    const profile = () => {
      const g = gaitRef.current;
      const crawl = isCrawlKey(kindRef.current);
      return {
        walk: g?.walk ?? WALK_SPEED,
        hop: g?.hop ?? 26,
        perch: !!g?.perch,
        aquatic: !!g?.aquatic,
        crawl,
        low: isLowWalk(g?.hop ?? 26, g?.walk ?? WALK_SPEED),
        high: isHighWalk(g?.walk ?? WALK_SPEED),
      };
    };

    const puff = (x: number, y: number, n = 4) => {
      for (let i = 0; i < n; i++) {
        s.dust.push({
          x: x + 60 + (Math.random() - 0.5) * 36,
          y: y + 8,
          vx: (Math.random() - 0.5) * 36,
          vy: -12 - Math.random() * 22,
          life: 0.45 + Math.random() * 0.25,
          size: 3 + Math.random() * 4,
        });
      }
      if (s.dust.length > 18) s.dust.splice(0, s.dust.length - 18);
    };

    const aimAt = (next: number) => {
      const p = profile();
      s.target = next;
      s.walkAge = 0;
      s.pause = 0;
      s.settle = 0;
      s.arrivedPending = false;
      const desired: 1 | -1 = next >= s.x ? 1 : -1;
      if (!reduced && desired !== s.facing) {
        s.turnHold = turnHoldS({ crawl: p.crawl, hop: p.hop, walk: p.walk });
        s.pendingFacing = desired;
        s.anim = "idle";
        s.frame = 0;
        return;
      }
      s.turnHold = 0;
      s.pendingFacing = null;
      s.facing = desired;
      s.anim = "walk";
      s.frame = 0;
    };

    const finishArrive = () => {
      if (arriveFinish(s.leaving) === "now") {
        s.x = s.target ?? s.x;
        s.target = null;
        s.anim = "idle";
        s.frame = 0;
        arrivedRef.current?.();
        return;
      }
      const p = profile();
      const dir: 1 | -1 = s.target != null && s.target >= s.x ? 1 : s.facing;
      s.x = s.target ?? s.x;
      s.target = null;
      s.settle = 1;
      s.settleDir = dir;
      s.overshoot = overshootPx({ crawl: p.crawl, hop: p.hop, walk: p.walk });
      s.land = 1;
      s.anim = "idle";
      s.frame = 0;
      s.arrivedPending = true;
      s.actWait = afterSettleWait(traitFor(kindRef.current ?? "red_panda").wander);
    };

    const clearAct = () => {
      s.act = null;
      s.actMotion = null;
      s.actT = 0;
      s.actHold = 0;
      s.actWalk = false;
    };

    const startAct = (act: NonNullable<ReturnType<typeof pickAct>>) => {
      s.act = act.name;
      s.actMotion = act.motion;
      s.actT = 0;
      s.actHold = act.hold;
      s.target = null;
      s.waypoints = [];
      if (act.anim) {
        s.anim = act.anim;
        s.frame = 0;
        s.acc = 0;
      }
      if (act.motion === "hop") {
        s.hop = 1;
        s.anim = "play";
        s.frame = 0;
        playDeskSound("hop");
      }
      if (act.anim === "talk") playDeskSound("chirp");
      if (act.anim === "eat") playDeskSound("munch");
      if (act.motion === "dart" || act.motion === "circle") {
        const box = stageBox();
        const max = Math.max(PAD, (box?.width ?? 400) - SPRITE - PAD);
        const dist = act.motion === "circle" ? 36 : 44 + Math.random() * 28;
        s.actWalk = true;
        aimAt(clamp(s.x + s.facing * dist, PAD, max));
      }
    };

    const applyCommand = (cmd: PetCommand, order: number) => {
      if (s.dragging) return;
      if (order === lastOrder.current || cmd === "none") return;
      if (s.act && (cmd === "wander" || cmd === "idle")) {
        lastOrder.current = order;
        return;
      }
      lastOrder.current = order;
      clearAct();
      s.poseHold = 0;
      s.pendingPose = null;
      if (cmd === "wander") {
        const box = stageBox();
        const max = (box?.width ?? 400) - SPRITE - PAD;
        const span = Math.max(48, max - PAD);
        const p = profile();
        let next = PAD + Math.random() * span;
        if (Math.abs(next - s.x) < 50) next = clamp(s.x + (s.facing * 90 || 90), PAD, max);
        s.leaving = false;
        s.waypoints = [];
        const twoBeat = Math.random() < (p.low || p.crawl ? 0.7 : 0.42);
        if (twoBeat) {
          let second = PAD + Math.random() * span;
          if (Math.abs(second - next) < 40) second = clamp(next + s.facing * 80, PAD, max);
          s.waypoints = [second];
        }
        aimAt(next);
        return;
      }
      if (cmd === "seek") {
        const box = stageBox();
        const width = box?.width ?? 400;
        const max = width - SPRITE - PAD;
        const px = ((seekRef.current ?? 50) / 100) * width - SPRITE * 0.45;
        s.leaving = false;
        s.waypoints = [];
        aimAt(clamp(px, PAD, Math.max(PAD, max)));
        return;
      }
      if (cmd === "leave") {
        const box = stageBox();
        const width = box?.width ?? 800;
        s.leaving = true;
        s.waypoints = [];
        aimAt(s.x + SPRITE / 2 < width / 2 ? -SPRITE - 24 : width + 12);
        return;
      }
      if (cmd === "enter") {
        const box = stageBox();
        const max = (box?.width ?? 400) - SPRITE - PAD;
        s.leaving = false;
        s.waypoints = [];
        s.x = Math.random() < 0.5 ? -SPRITE : max + SPRITE;
        aimAt(clamp(80 + Math.random() * Math.max(40, max - 80), PAD, max));
        return;
      }
      if (cmd === "play") {
        s.hop = 1;
        s.anim = "play";
        s.target = null;
        s.waypoints = [];
        s.turnHold = 0;
        s.pendingFacing = null;
        s.frame = 0;
        s.acc = 0;
        playDeskSound("hop");
        return;
      }
      if (cmd === "eat" || cmd === "talk" || cmd === "idle" || cmd === "sit" || cmd === "sleep") {
        s.target = null;
        s.waypoints = [];
        s.turnHold = 0;
        s.pendingFacing = null;
        s.frame = 0;
        s.acc = 0;
        if (!reduced && (cmd === "sit" || cmd === "sleep")) {
          s.poseHold = POSE_HOLD_S;
          s.pendingPose = cmd;
          s.anim = "idle";
        } else {
          s.anim = cmd;
        }
        if (cmd === "eat") playDeskSound("munch");
        if (cmd === "talk") playDeskSound("chirp");
      }
    };

    const tick = (now: number) => {
      try {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const box = stageBox();
      const width = box?.width ?? 800;
      const height = box?.height ?? 500;
      const maxX = Math.max(PAD, width - SPRITE - PAD);
      const p = profile();

      if (s.hop > 0) {
        const prev = s.hop;
        s.hop = Math.max(0, s.hop - dt * 2.15);
        if (prev > 0 && s.hop === 0) {
          s.land = 1;
          puff(s.x, 0, 5);
        }
      }
      if (s.land > 0) s.land = Math.max(0, s.land - dt * LAND_DECAY);
      if (s.settle > 0 && !s.dragging) {
        s.settle = Math.max(0, s.settle - dt / SETTLE_S);
        if (s.settle === 0 && s.arrivedPending) {
          s.arrivedPending = false;
          arrivedRef.current?.();
        }
      }

      if (!s.dragging) {
        applyCommand(cmdRef.current, orderRef.current);

        if (s.poseHold > 0) {
          s.poseHold = Math.max(0, s.poseHold - dt);
          if (s.poseHold === 0 && s.pendingPose) {
            s.anim = s.pendingPose;
            s.pendingPose = null;
            s.frame = 0;
            s.acc = 0;
          }
        }

        if (s.turnHold > 0 && !reduced) {
          s.turnHold = Math.max(0, s.turnHold - dt);
          if (s.turnHold === 0 && s.pendingFacing) {
            s.facing = s.pendingFacing;
            s.pendingFacing = null;
            s.anim = "walk";
            s.frame = 0;
            s.walkAge = 0;
          }
        } else if (s.pause > 0 && !reduced) {
          s.pause = Math.max(0, s.pause - dt);
          s.anim = "idle";
          if (s.pause === 0 && s.waypoints.length) {
            const next = s.waypoints.shift()!;
            aimAt(next);
          }
        } else if (s.anim === "walk" && s.target != null && !reduced && s.turnHold <= 0) {
          const remaining = Math.abs(s.target - s.x);
          const dir: 1 | -1 = s.target >= s.x ? 1 : -1;
          s.walkAge += dt;
          const stageMul = stageRef.current === "hatchling" ? 0.88 : stageRef.current === "elder" ? 0.78 : 1;
          s.x += dir * walkSpeed(remaining, s.walkAge, p.walk * stageMul) * dt;
          s.stepAcc += dt;
          const stepEvery = p.high ? STEP_S_QUICK : p.crawl ? 0.32 : STEP_S;
          if (s.stepAcc > stepEvery) {
            s.stepAcc = 0;
            playDeskSound("step");
            if (Math.random() < 0.45) puff(s.x, 4, 2);
          }
          if ((dir === 1 && s.x >= s.target) || (dir === -1 && s.x <= s.target)) {
            s.x = s.target;
            const land = walkLand(s.actWalk, s.waypoints.length);
            if (land === "act") {
              s.target = null;
              s.actWalk = false;
              s.anim = s.actMotion === "circle" ? "sit" : "idle";
              s.frame = 0;
              s.land = 0.4;
            } else if (land === "pause") {
              s.target = null;
              s.pause = wanderPauseS();
              s.anim = "idle";
              s.frame = 0;
            } else {
              finishArrive();
            }
          }
        } else if (
          !s.act &&
          (s.anim === "idle" || s.anim === "sit") &&
          s.cursorX != null &&
          Math.abs(s.cursorX - (s.x + SPRITE / 2)) > 36
        ) {
          s.facing = s.cursorX >= s.x + SPRITE / 2 ? 1 : -1;
        }
        s.x = s.leaving ? s.x : clamp(s.x, PAD, maxX);

        if (s.act) {
          s.actT += dt;
          if (s.actMotion === "stretch" && s.actHold > 0 && s.actT / s.actHold > 0.55 && s.anim === "sit") {
            s.anim = "idle";
          }
          if (s.actT >= s.actHold && !s.actWalk) {
            clearAct();
            s.anim = "idle";
            s.frame = 0;
          }
        } else if (
          !reduced &&
          !s.leaving &&
          s.target == null &&
          s.turnHold <= 0 &&
          s.pause <= 0 &&
          s.settle <= 0 &&
          (s.anim === "idle" || s.anim === "sit")
        ) {
          s.actWait -= dt;
          if (s.actWait <= 0) {
            const next = pickAct(kindRef.current);
            const trait = traitFor(kindRef.current ?? "red_panda");
            if (next) startAct(next);
            s.actWait = nextActWait(trait.wander, trait.nocturnal, dayPart() === "night");
          }
        }

        if (
          (s.anim === "idle" || s.anim === "sit") &&
          s.shiftAge <= 0 &&
          !reduced &&
          s.actMotion !== "freeze" &&
          Math.random() < dt * 0.45
        ) {
          s.shift = (1 + Math.random() * 2) * (Math.random() < 0.5 ? 1 : -1);
          s.shiftAge = 0.85;
        }
        if (s.shiftAge > 0) s.shiftAge = Math.max(0, s.shiftAge - dt);

        const fpsNow = reduced ? 0 : fpsRef.current[s.anim];
        if (fpsNow > 0) {
          s.acc += dt;
          const step = 1 / fpsNow;
          while (s.acc >= step) {
            s.acc -= step;
            const frames = spritesRef.current[s.anim];
            const len = frames.length;
            if (s.anim === "sit") {
              s.frame = Math.min(len - 1, s.frame + 1);
            } else if (onceRef.current.has(s.anim)) {
              if (s.frame + 1 >= len) {
                s.anim = "idle";
                s.frame = 0;
                if (!s.act) arrivedRef.current?.();
              } else {
                s.frame += 1;
                if (s.anim === "eat" && s.frame === 1) playDeskSound("munch");
              }
            } else {
              s.frame = (s.frame + 1) % len;
            }
          }
        }
      }

      for (const d of s.dust) {
        d.life -= dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vy += 28 * dt;
      }
      s.dust = s.dust.filter((d) => d.life > 0);

      const frames = spritesRef.current[s.anim];
      const src = frames[Math.min(s.frame, frames.length - 1)]!;
      const gaitNow = gaitRef.current;
      const hopPx = s.hop > 0 ? Math.sin(s.hop * Math.PI) * (gaitNow?.hop ?? 26) : 0;
      const walkBob =
        s.anim === "walk" && !reduced
          ? p.crawl
            ? 0
            : p.perch
              ? Math.abs(Math.sin(s.walkAge * 8)) * PERCH_STEP_PX
              : (gaitNow?.hop ?? 0) > HIGH_HOP
                ? Math.abs(Math.sin(s.walkAge * 10)) * WALK_HOP_PX
                : 0
          : 0;
      const water = gaitNow?.aquatic ? Math.sin(now * 0.004) * 6 : 0;
      const perch = gaitNow?.perch ? 18 : 0;
      const stageNow = stageRef.current;
      const ageScale = stageNow === "hatchling" ? 0.82 : stageNow === "elder" ? 1.08 : 1;
      const scale = (gaitNow?.scale ?? 1) * ageScale;
      const y = floorY(height) + hopPx + walkBob + water + perch + liftRef.current;
      const breathe =
        s.anim === "idle" || s.anim === "sit" || s.anim === "sleep"
          ? 1 + Math.sin(now * (s.anim === "sleep" ? 0.0032 : 0.0046)) * (s.anim === "sleep" ? BREATHE_SLEEP : BREATHE_IDLE)
          : 1;
      const pose = !reduced && s.act ? actPose(s.actMotion, s.actT, s.actHold) : { dx: 0, dy: 0, rot: 0, stretch: 1, squat: 1 };
      const stretch =
        s.hop > 0
          ? 1 + Math.sin(s.hop * Math.PI) * 0.09
          : s.land > 0
            ? 1 - Math.sin(s.land * Math.PI) * 0.08
            : s.act
              ? breathe * pose.stretch
              : breathe;
      const squat = s.act && pose.squat !== 1 ? pose.squat : 2 - stretch;
      const sway = s.anim === "walk" && p.crawl && !reduced ? Math.sin(s.walkAge * 5.5) * SWAY_PX : 0;
      const shiftX = s.shiftAge > 0 && !reduced ? s.shift * Math.sin((1 - s.shiftAge / 0.85) * Math.PI) : 0;
      const settleX = s.settle > 0 && !reduced ? settleOffset(s.settle, s.settleDir, s.overshoot) : 0;
      const drawX = s.x + sway + shiftX + settleX + pose.dx;
      const drawY = y + pose.dy;

      if (imgRef.current) {
        if (imgRef.current.src !== new URL(src, window.location.origin).href) {
          imgRef.current.src = src;
        }
        imgRef.current.style.transform = `translate3d(${drawX}px, ${-drawY}px, 0) rotate(${pose.rot}deg) scale(${s.facing * squat * scale}, ${stretch * scale})`;
      }
      if (shadowRef.current) {
        const shrink = 1 - hopPx / 90;
        shadowRef.current.style.transform = `translate3d(${drawX + 34}px, ${8}px, 0) scale(${shrink}, ${shrink})`;
        shadowRef.current.style.opacity = String(0.32 - hopPx / 90);
      }
      if (bubbleRef.current) {
        const bx = clamp(drawX + SPRITE * 0.5 - BUBBLE_W * 0.5, 10, Math.max(10, width - BUBBLE_W - 10));
        bubbleRef.current.style.transform = `translate3d(${bx}px, ${-drawY - 18}px, 0)`;
      }
      if (tongueRef.current) {
        const flick = p.crawl && s.actMotion === "tongue" && !reduced ? tongueFlick(s.actT, s.actHold) : 0;
        tongueRef.current.style.opacity = String(flick);
        tongueRef.current.style.transform = `translate3d(${drawX + SPRITE * 0.5 + s.facing * 36 - 2}px, ${-(drawY + 48)}px, 0) scale(${s.facing}, 1)`;
      }
      if (dustRef.current) {
        const nodes = dustRef.current.children;
        for (let i = 0; i < nodes.length; i++) {
          const el = nodes[i] as HTMLElement;
          const d = s.dust[i];
          if (!d) {
            el.style.opacity = "0";
            continue;
          }
          el.style.opacity = String(Math.max(0, d.life * 1.4));
          el.style.width = `${d.size}px`;
          el.style.height = `${d.size}px`;
          el.style.transform = `translate3d(${d.x}px, ${-floorY(height) + d.y}px, 0)`;
        }
      }

      raf = requestAnimationFrame(tick);
      } catch {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-pet]")) return;
      if (carePointer(e)) return;
      s.dragging = true;
      s.pointerStart = { x: e.clientX, y: e.clientY };
      s.dragDx = e.clientX - s.x;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const box = stageBox();
      s.cursorX = e.clientX - (box?.left ?? 0);
      if (!s.dragging) return;
      const maxX = Math.max(PAD, (box?.width ?? 800) - SPRITE - PAD);
      s.x = clamp(e.clientX - s.dragDx, PAD, maxX);
      if (s.pointerStart && Math.abs(e.clientX - s.pointerStart.x) > 10) {
        s.facing = e.clientX >= s.pointerStart.x ? 1 : -1;
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!s.dragging) return;
      const start = s.pointerStart;
      s.dragging = false;
      s.pointerStart = null;
      const dx = start ? e.clientX - start.x : 0;
      const dy = start ? e.clientY - start.y : 0;
      const lift = pointerUp(dx, dy, tapPxFor(navigator.platform));
      if (lift.kind === "tap") {
        tapRef.current?.();
        return;
      }
      s.land = 0.55;
      puff(s.x, 4, 3);
      s.arrivedPending = false;
      s.settle = 0;
      if (afterPlace(s.target != null) === "resume" && s.target != null) {
        aimAt(s.target);
      } else {
        s.anim = "idle";
      }
    };

    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={shadowRef}
        className="absolute bottom-0 left-0 h-3.5 w-24 rounded-[100%] bg-bg/55 blur-[4px]"
        style={{ willChange: "transform" }}
      />
      <div ref={dustRef} className="absolute bottom-0 left-0">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="absolute bottom-0 left-0 rounded-full bg-primary/50"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          />
        ))}
      </div>
      <div
        ref={bubbleRef}
        className="absolute bottom-[214px] left-0 z-10 w-[min(220px,70vw)] pointer-events-none transition-opacity duration-200"
        style={{ willChange: "transform", opacity: speech ? 1 : 0 }}
      >
        <p className="rounded-[var(--radius-md)] border border-border bg-surface/95 px-3 py-2 text-sm leading-snug text-fg shadow-lg">
          {speech ?? "\u00a0"}
        </p>
      </div>
      <svg
        ref={tongueRef}
        className="pointer-events-none absolute bottom-0 left-0 overflow-visible"
        width="36"
        height="20"
        viewBox="0 0 36 20"
        aria-hidden
        style={{ opacity: 0, willChange: "transform, opacity", transformOrigin: "2px 10px" }}
      >
        <path
          d="M2 10 L16 10 M16 10 L28 5 M16 10 L28 15"
          fill="none"
          stroke="rgba(214,92,108,0.94)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
      <img
        ref={imgRef}
        data-pet
        src={sprites.idle[0]}
        alt=""
        draggable={false}
        className="pointer-events-auto absolute bottom-0 left-0 h-44 w-44 cursor-grab object-contain object-bottom active:cursor-grabbing select-none touch-none"
        style={{
          willChange: "transform",
          transformOrigin: "center bottom",
          opacity: hidden ? 0 : 1,
          filter: dull ? "saturate(0.42) brightness(0.82) contrast(0.92)" : unwell ? "saturate(0.5) brightness(0.88)" : undefined,
          pointerEvents: hidden ? "none" : "auto",
          transition: "opacity 280ms ease, filter 280ms ease",
        }}
      />
    </div>
  );
}
