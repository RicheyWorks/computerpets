import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { ANIM_FPS, ONCE_ANIMS, RED_PANDA_SPRITES, type PetAnim } from "@/lib/pets/red-panda";
import type { SpritePack } from "@/lib/pets/living";
import { playDeskSound, playStep } from "@/lib/pets/desk-audio";
import {
  beginPickedTrick,
  nextGroundTrickWait,
  sleepHoldFrame,
  stepGroundHappy,
  stepGroundTrick,
  startThankYou,
  tricksFor,
  type GroundHappy,
  type GroundHappyKind,
  type GroundTrick,
  type GroundTrickKind,
} from "@/lib/pets/ground-tricks";
import { paintDemoFrame } from "@/lib/pets/desk-sprite-surface";
import { guardedLoop, makeGuard, musicMayDance, safeIdle } from "@/lib/pets/frame-guard";
import {
  actPose,
  afterSettleWait,
  nextActWait,
  pickAct,
  tongueFlick,
  type ActMotion,
} from "@/lib/pets/ethogram";
import { dayPart } from "@/lib/pets/hours";
import { isTapKey } from "@/lib/pets/keeper";
import { traitFor } from "@/lib/pets/traits";
import { afterPlace, arriveFinish, pointerUp, walkLand } from "@/lib/pets/arrive";
import { carePointer } from "@/lib/pets/mac-desk";
import { HOLD_MS, isPhone, isTablet, readSit, tabletLift } from "@/lib/pets/tablet-desk";
import { bubbleDodge, bubbleLift, bubbleRoom, followHover, tapPxFor, type BubbleBox } from "@/lib/pets/phone-desk";
import {
  beginPlay,
  canStart,
  nextPlayWait,
  pickTarget,
  playFor,
  shouldAbort,
  stepPlay,
  type WindowPlay,
} from "@/lib/pets/window-play";
import type { DeskWindow } from "@/lib/pets/windows";
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
  enterSit,
  enterSpawn,
  hideTuckClear,
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
  /** A click on the speech bubble closes it. Without this the bubble lets clicks through. */
  onSpeechClose?: () => void;
  sprites?: SpritePack;
  fps?: Record<PetAnim, number>;
  once?: ReadonlySet<PetAnim>;
  gait?: Gait;
  kind?: string;
  startX?: number;
  /** Extra rise off the floor. Bees sit on Wax with this. */
  lift?: number;
  hidden?: boolean;
  /** Rest or night put them down. Wander must not stand them back up. */
  asleep?: boolean;
  unwell?: boolean;
  dull?: boolean;
  stage?: "hatchling" | "grown" | "elder";
  seekX?: number;
  onArrived?: () => void;
  /** A click, touch, or (with a tapLabel) Enter or Space on the focused pet; `keys` says it came from the keyboard. */
  onTap?: (how?: { keys?: boolean }) => void;
  /** A long-press tends. A tablet has no right-click. A phone has no right-click. */
  onTend?: () => void;
  /** Overlay: real window rects. /demo: a drawn plate. */
  windows?: DeskWindow[];
  /** House loop or radio is on. Rui may dance. */
  musicOn?: boolean;
  /** Expanded keeper card. The host stands still so verbs stay hittable. */
  cardOpen?: boolean;
  onPose?: (x: number, facing: 1 | -1) => void;
  /** Rui's closed-eye lie hold (not the stretch / backflip). */
  onLieHold?: (on: boolean) => void;
  /** The art's accessible name (lib/pets/keeper.ts petArtLabel). Empty keeps it decorative. */
  label?: string;
  /** With onTap: the hit area is a keyboard button with this name (lib/pets/keeper.ts petTapLabel). */
  tapLabel?: string;
  /** False keeps the button out of Tab order (a roving group moves focus to it with the arrow keys). */
  tabStop?: boolean;
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
  play: WindowPlay | null;
  playWait: number;
  trick: GroundTrick | null;
  trickWait: number;
  brokeWait: number;
  lastTrick: GroundTrickKind | null;
  happy: GroundHappy | null;
  lastHappy: GroundHappyKind | null;
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
  onSpeechClose,
  sprites = RED_PANDA_SPRITES,
  fps = ANIM_FPS,
  once = ONCE_ANIMS,
  gait,
  kind,
  startX = 120,
  lift = 0,
  hidden = false,
  asleep = false,
  unwell = false,
  dull = false,
  stage = "grown",
  seekX,
  onArrived,
  onTap,
  onTend,
  windows = [],
  musicOn = false,
  cardOpen = false,
  onPose,
  onLieHold,
  label = "",
  tapLabel = "",
  tabStop = true,
}: LivingPetProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bindCanvas = useCallback((node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    if (!node) return;
    if (node.dataset && !node.dataset.surface) node.dataset.surface = "pending";
    const first = sprites.idle[0];
    if (first && node.dataset && !node.dataset.frame) paintDemoFrame(node, first);
  }, [sprites]);
  const bubbleRef = useRef<HTMLDivElement>(null);
  /* How far the bubble may rise and still end below the site header (bubbleRoom); read on open and on resize, not per frame. */
  const bubbleRoomRef = useRef(Number.POSITIVE_INFINITY);
  /* Where the frame loop last put the bubble (x and lift), so a line that opens taller can be capped before it paints. */
  const bubbleAtRef = useRef<{ x: number; lift: number } | null>(null);
  /* While a line shows: the bubble's resting top and size and the plates it steps around (bubbleDodge), in the
     bubble's own frame; read when the line opens, on resize and every 400 ms (a plate can be dragged or opened). */
  const bubblePlatesRef = useRef<{ restTop: number; w: number; h: number; floor: number; plates: BubbleBox[] } | null>(null);
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
    play: null,
    playWait: 6 + Math.random() * 5,
    trick: null,
    trickWait: 3 + Math.random() * 3,
    brokeWait: 0,
    lastTrick: null,
    happy: null,
    lastHappy: null,
  });
  const cmdRef = useRef(command);
  const orderRef = useRef(orderId);
  const lastOrder = useRef(-1);
  const arrivedRef = useRef(onArrived);
  const tapRef = useRef(onTap);
  const tendRef = useRef(onTend);
  const spritesRef = useRef(sprites);
  const fpsRef = useRef(fps);
  const onceRef = useRef(once);
  const gaitRef = useRef(gait);
  const stageRef = useRef(stage);
  const kindRef = useRef(kind);
  const liftRef = useRef(lift);
  const asleepRef = useRef(asleep);
  const hiddenRef = useRef(hidden);
  const windowsRef = useRef(windows);
  const musicRef = useRef(musicOn);
  const cardRef = useRef(cardOpen);
  const poseRef = useRef(onPose);
  const lieHoldRef = useRef(onLieHold);
  asleepRef.current = asleep;
  hiddenRef.current = hidden;
  cardRef.current = cardOpen;
  windowsRef.current = windows;
  musicRef.current = musicOn;
  poseRef.current = onPose;
  lieHoldRef.current = onLieHold;
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
  tendRef.current = onTend;

  // The bubble never rises over the site header (a landscape phone is short): its room under the header is read
  // when a line opens and on resize; the frame loop only caps the lift (bubbleLift). A layout effect, so a new line
  // (taller than the blank bubble, so its resting top is higher) is measured and capped before it first paints.
  useLayoutEffect(() => {
    const el = bubbleRef.current;
    if (!el || typeof window === "undefined") return;
    const read = () => {
      const parent = el.offsetParent as HTMLElement | null;
      const head = document.querySelector("[data-site-header]");
      if (!parent || !head) {
        bubbleRoomRef.current = Number.POSITIVE_INFINITY;
        return;
      }
      const restTop = parent.getBoundingClientRect().top + parent.clientTop + el.offsetTop;
      bubbleRoomRef.current = bubbleRoom(restTop, head.getBoundingClientRect().bottom);
    };
    // The weather, news and market plates (floating on a desktop, docked in the panel on a phone): the part of each
    // that shows, in the bubble's frame. The bubble never crosses one (bubbleDodge in the frame loop). On a phone on
    // its side the panel's own kicker and name are marked data-bubble-avoid and kept clear the same way.
    const readPlates = () => {
      const parent = el.offsetParent as HTMLElement | null;
      if (!parent || !speech) {
        bubblePlatesRef.current = null;
        return;
      }
      const pb = parent.getBoundingClientRect();
      const plates: BubbleBox[] = [];
      for (const plate of document.querySelectorAll<HTMLElement>("[data-desk-plate], [data-bubble-avoid]")) {
        const r = plate.getBoundingClientRect();
        let b = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
        for (let up = plate.parentElement; up && up !== document.body; up = up.parentElement) {
          const cs = getComputedStyle(up);
          if (/(auto|scroll|hidden|clip)/.test(cs.overflowY) || /(auto|scroll|hidden|clip)/.test(cs.overflowX)) {
            const u = up.getBoundingClientRect();
            b = { left: Math.max(b.left, u.left), top: Math.max(b.top, u.top), right: Math.min(b.right, u.right), bottom: Math.min(b.bottom, u.bottom) };
          }
        }
        if (b.right - b.left < 1 || b.bottom - b.top < 1) continue;
        const dx = pb.left + parent.clientLeft;
        const dy = pb.top + parent.clientTop;
        plates.push({ left: b.left - dx, top: b.top - dy, right: b.right - dx, bottom: b.bottom - dy });
      }
      bubblePlatesRef.current = { restTop: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, floor: parent.clientHeight, plates };
    };
    const both = () => {
      read();
      readPlates();
    };
    // The frame loop may have set this frame's lift with the old room: cap it now, before the paint.
    const refresh = () => {
      both();
      const at = bubbleAtRef.current;
      if (at && at.lift > bubbleRoomRef.current) {
        el.style.transform = `translate3d(${at.x}px, ${-bubbleRoomRef.current}px, 0)`;
      }
    };
    refresh();
    window.addEventListener("resize", refresh);
    // The room under the header is re-read on the same tick as the plates (the header can settle late).
    const every = speech ? window.setInterval(refresh, 400) : 0;
    // A longer line (or a late web font) makes the bubble taller, and its resting top higher. The stage it rests in
    // shrinks to the phone's height after hydration with no window resize; a room read before that let the first
    // line rise over the header on a landscape phone (the phone-desk-layout flake, "hello up").
    const grow = typeof ResizeObserver === "function" ? new ResizeObserver(refresh) : null;
    grow?.observe(el);
    const stage = el.offsetParent;
    if (stage) grow?.observe(stage);
    return () => {
      window.removeEventListener("resize", refresh);
      if (every) window.clearInterval(every);
      grow?.disconnect();
    };
  }, [speech]);

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
      if (s.happy && (cmd === "wander" || cmd === "idle")) {
        lastOrder.current = order;
        return;
      }
      if (s.play && (cmd === "wander" || cmd === "idle")) {
        lastOrder.current = order;
        return;
      }
      if ((cmd === "wander" || cmd === "idle") && (s.anim === "eat" || cmdRef.current === "eat" || cmdRef.current === "seek")) {
        lastOrder.current = order;
        return;
      }
      if (s.play && shouldAbort({ asleep: asleepRef.current, hidden: hiddenRef.current, leaving: s.leaving, cmd })) {
        s.play = stepPlay(s.play, 0, { x: s.x, lift: s.play.lift }, windowsRef.current, { width: 800, height: 500, floorLift: 0 }, SPRITE, { asleep: asleepRef.current, hidden: hiddenRef.current, leaving: s.leaving, cmd });
      }
      {
        const GT = tricksFor(kindRef.current);
        if (s.trick && GT && GT.shouldAbort({ asleep: asleepRef.current, hidden: hiddenRef.current, leaving: s.leaving, cmd, windowPlay: !!s.play })) {
          s.trick = stepGroundTrick(GT, s.trick, 0, { asleep: asleepRef.current, hidden: hiddenRef.current, leaving: s.leaving, cmd, windowPlay: !!s.play });
        }
        if (s.happy && GT && GT.happyShouldAbort({ asleep: false, hidden: hiddenRef.current, leaving: s.leaving, cmd })) {
          s.happy = stepGroundHappy(GT, s.happy, 0, { asleep: false, hidden: hiddenRef.current, leaving: s.leaving, cmd });
        }
      }
      if (asleepRef.current && cmd !== "talk" && cmd !== "play" && cmd !== "eat" && cmd !== "seek" && cmd !== "leave" && cmd !== "enter") {
        s.anim = "sleep";
        s.target = null;
        s.waypoints = [];
        s.pendingPose = null;
        s.poseHold = 0;
        s.pause = 0;
        const hold = sleepHoldFrame(kindRef.current, spritesRef.current.sleep.length);
        if (hold != null) s.frame = hold;
        return;
      }
      if (cardRef.current && (cmd === "wander" || cmd === "idle")) {
        s.anim = asleepRef.current ? "sleep" : "idle";
        s.target = null;
        s.waypoints = [];
        s.pause = 0;
        lastOrder.current = order;
        return;
      }
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
        // The room's panel and rail beside the pet's height: the tuck steps out from behind them (hideTuckClear).
        const pet = hitRef.current?.getBoundingClientRect();
        const blocks: { left: number; right: number }[] = [];
        if (box && pet) {
          for (const el of document.querySelectorAll<HTMLElement>("[data-desk-aside], [data-desk-rail]")) {
            const r = el.getBoundingClientRect();
            if (r.width < 1 || r.bottom <= pet.top || r.top >= pet.bottom) continue;
            blocks.push({ left: r.left - box.left, right: r.right - box.left });
          }
        }
        aimAt(hideTuckClear(s.x, width, blocks, SPRITE, PAD));
        return;
      }
      if (cmd === "enter") {
        const box = stageBox();
        const width = box?.width ?? 400;
        s.leaving = false;
        s.waypoints = [];
        s.x = enterSpawn(width, SPRITE, PAD);
        aimAt(enterSit(width, SPRITE, PAD));
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
        if (cmd === "sleep") {
          s.anim = "sleep";
          const hold = sleepHoldFrame(kindRef.current, spritesRef.current.sleep.length);
          if (hold != null) s.frame = hold;
        } else if (!reduced && cmd === "sit") {
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

    // One broken frame (a trick module that throws, a bad pose) is logged once per error and pet,
    // sends this pet back to a safe idle, and the next frame runs as usual.
    const frameGuard = makeGuard({
      reset: () => {
        safeIdle(s);
        clearAct();
      },
    });

    const frame = (now: number) => {
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
        const work = { width, height, floorLift: floorY(height) };
        const playFlags = {
          asleep: asleepRef.current,
          hidden: hiddenRef.current,
          leaving: s.leaving,
          cmd: cmdRef.current,
          card: !!cardRef.current,
        };
        const GT = tricksFor(kindRef.current);
        if (s.happy && GT) {
          s.happy = stepGroundHappy(GT, s.happy, dt, {
            asleep: false,
            hidden: hiddenRef.current,
            leaving: s.leaving,
            cmd: cmdRef.current,
          });
          s.x = s.happy.x;
          if (!asleepRef.current) s.anim = s.happy.anim;
          if (s.happy.phase === "done") {
            s.lastHappy = s.happy.kind as GroundHappyKind;
            s.happy = null;
            s.land = 1;
            s.anim = asleepRef.current ? "sleep" : "idle";
          }
        } else if (s.play) {
          s.play = stepPlay(s.play, dt, { x: s.x, lift: s.play.lift }, windowsRef.current, work, SPRITE, playFlags);
          s.x = s.play.x;
          s.facing = s.play.facing;
          if (!asleepRef.current) s.anim = s.play.anim;
          if (s.play.phase === "done") {
            s.play = null;
            s.land = 1;
            s.anim = asleepRef.current ? "sleep" : "idle";
            s.playWait = nextPlayWait(true);
            s.trickWait = GT ? GT.nextTrickWait(true) : 9 + Math.random() * 8;
          }
        } else if (s.trick && GT) {
          s.trick = stepGroundTrick(GT, s.trick, dt, {
            asleep: asleepRef.current,
            hidden: hiddenRef.current,
            leaving: s.leaving,
            cmd: cmdRef.current,
            windowPlay: false,
            card: !!cardRef.current,
          });
          s.x = s.trick.x;
          if (!asleepRef.current) s.anim = s.trick.anim;
          if (s.trick.phase === "done") {
            s.lastTrick = s.trick.kind as GroundTrickKind;
            s.trick = null;
            s.land = 1;
            s.anim = asleepRef.current ? "sleep" : "idle";
            s.trickWait = nextGroundTrickWait(GT, true, undefined, s.lastTrick);
          }
        } else if (
          !reduced &&
          !s.act &&
          !s.happy &&
          !s.leaving &&
          canStart(playFlags) &&
          playFor(kindRef.current) !== "ignore" &&
          windowsRef.current.length
        ) {
          s.playWait -= dt;
          if (s.playWait <= 0) {
            const target = pickTarget(windowsRef.current, s.x, kindRef.current ?? "red_panda", work, SPRITE);
            s.play = beginPlay(target, s.x);
            if (s.play) {
              clearAct();
              s.target = null;
              s.waypoints = [];
            }
            s.playWait = nextPlayWait(false);
          }
        } else if (
          GT &&
          !reduced &&
          !s.act &&
          !s.happy &&
          !s.leaving &&
          GT.canStart({
            asleep: asleepRef.current,
            hidden: hiddenRef.current,
            leaving: s.leaving,
            cmd: cmdRef.current,
            windowPlay: !!s.play,
            card: !!cardRef.current,
          })
        ) {
          s.trickWait -= dt;
          const musicWantsDance = musicMayDance(s, dt) && musicRef.current && !s.trick && !s.happy;
          if (s.trickWait <= 0 || musicWantsDance) {
            s.trick = beginPickedTrick(GT, musicRef.current, s.lastTrick, s.x, s.facing);
            if (s.trick) {
              clearAct();
              s.target = null;
              s.waypoints = [];
            }
            s.trickWait = GT.nextTrickWait(false);
          }
        }

        if (s.poseHold > 0) {
          s.poseHold = Math.max(0, s.poseHold - dt);
          if (s.poseHold === 0 && s.pendingPose) {
            s.anim = s.pendingPose;
            s.pendingPose = null;
            s.frame = 0;
            s.acc = 0;
          }
        }

        if (s.play || s.trick || s.happy) {
          /* window play or a ground trick owns the walk */
        } else if (s.turnHold > 0 && !reduced) {
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
          if (asleepRef.current) s.anim = "sleep";
          else s.anim = "idle";
          if (s.pause === 0 && s.waypoints.length && !asleepRef.current) {
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
            if (!s.play && !s.trick && !asleepRef.current) playStep(kindRef.current ?? "red_panda");
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
          followHover(readSit(window)) &&
          Math.abs(s.cursorX - (s.x + SPRITE / 2)) > 36
        ) {
          s.facing = s.cursorX >= s.x + SPRITE / 2 ? 1 : -1;
        }
        s.x = s.leaving || s.play || s.trick || s.happy ? s.x : clamp(s.x, PAD, maxX);

        if (s.play || s.trick || s.happy) {
          /* window play or a ground trick owns the pose */
        } else if (s.act) {
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
          !s.play &&
          !s.trick &&
          !s.leaving &&
          !asleepRef.current &&
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
            if (s.anim === "sleep") {
              const hold = sleepHoldFrame(kindRef.current, len);
              s.frame = hold == null ? (s.frame + 1) % len : hold;
            } else if (s.anim === "sit") {
              s.frame = Math.min(len - 1, s.frame + 1);
            } else if (onceRef.current.has(s.anim)) {
              if (s.frame + 1 >= len) {
                const wasEat = s.anim === "eat";
                s.anim = "idle";
                s.frame = 0;
                if (wasEat) {
                  const thanks = startThankYou(kindRef.current, s.lastHappy, s.x, s.facing, {
                    asleep: false,
                    hidden: hiddenRef.current,
                    leaving: s.leaving,
                    cmd: "idle",
                  });
                  if (thanks) {
                    s.play = null;
                    s.trick = null;
                    s.happy = thanks.happy;
                    s.lastHappy = thanks.kind;
                  }
                }
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
      const climbLift = s.play ? s.play.lift : s.happy ? s.happy.lift : s.trick ? s.trick.lift : 0;
      const climbRot = s.play ? s.play.rot : s.happy ? s.happy.rot : s.trick ? s.trick.rot : 0;
      const y = floorY(height) + hopPx + walkBob + water + perch + liftRef.current + climbLift;
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
      poseRef.current?.(s.x, s.facing);
      lieHoldRef.current?.(!!(s.trick && s.trick.kind === "lie" && s.trick.phase === "lie"));

      const walkXform = `translate3d(${drawX}px, ${-drawY}px, 0) rotate(${pose.rot + climbRot}deg) scale(${s.facing * squat * scale}, ${stretch * scale})`;
      if (hitRef.current) {
        hitRef.current.style.transform = walkXform;
        hitRef.current.style.transformOrigin =
          s.play && (s.play.phase === "dive" || s.play.phase === "leap" || s.play.phase === "ridge-leap" || s.play.phase === "ridge-off" || s.play.phase === "coil-on" || s.play.phase === "coil-off" || s.play.phase === "path-on" || s.play.phase === "path-off" || s.play.phase === "field-on" || s.play.phase === "field-off" || s.play.phase === "crackle-on" || s.play.phase === "crackle-hop" || s.play.phase === "crackle-off" || s.play.phase === "charge-on" || s.play.phase === "charge-bolt" || s.play.phase === "charge-off" || s.play.phase === "orbit-on" || s.play.phase === "orbit-off" || s.play.phase === "click-on" || s.play.phase === "click-hop" || s.play.phase === "click-off" || s.play.phase === "hold-on" || s.play.phase === "hold-off" || s.play.phase === "earth-on" || s.play.phase === "earth-off" || s.play.phase === "ledge-on" || s.play.phase === "ledge-off" || s.play.phase === "circle-on" || s.play.phase === "circle-off")
            ? "center center"
            : "center bottom";
      }
      /* Every walker draws the catalog frame on the shared canvas. A refused canvas stays blank. */
      paintDemoFrame(canvasRef.current, src);
      if (shadowRef.current) {
        const shrink = 1 - hopPx / 90;
        shadowRef.current.style.transform = `translate3d(${drawX + 34}px, ${8}px, 0) scale(${shrink}, ${shrink})`;
        shadowRef.current.style.opacity = String(0.32 - hopPx / 90);
      }
      if (bubbleRef.current) {
        let bx = clamp(drawX + SPRITE * 0.5 - BUBBLE_W * 0.5, 10, Math.max(10, width - BUBBLE_W - 10));
        let lift = bubbleLift(drawY + 18, bubbleRoomRef.current);
        // A line never crosses a plate: beside, above or below the plates instead (bubbleDodge).
        const dodge = bubblePlatesRef.current;
        if (dodge && dodge.plates.length) {
          const room = bubbleRoomRef.current;
          const at = bubbleDodge({
            x: bx,
            top: dodge.restTop - lift,
            w: dodge.w,
            h: dodge.h,
            plates: dodge.plates,
            width,
            minTop: Number.isFinite(room) ? dodge.restTop - room : undefined,
            maxTop: dodge.floor - dodge.h - 8,
          });
          bx = at.x;
          lift = dodge.restTop - at.top;
        }
        bubbleRef.current.style.transform = `translate3d(${bx}px, ${-lift}px, 0)`;
        bubbleAtRef.current = { x: bx, lift };
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
    };

    const tick = guardedLoop(
      frame,
      (next) => {
        raf = requestAnimationFrame(next);
      },
      frameGuard,
      () => kindRef.current ?? "red_panda",
    );

    raf = requestAnimationFrame(tick);

    const sitOf = () => readSit(window);
    let holdTimer = 0;
    let holdAt = 0;
    let tended = false;
    const clearHold = () => {
      if (holdTimer) window.clearTimeout(holdTimer);
      holdTimer = 0;
    };
    const tendNow = () => {
      tended = true;
      s.dragging = false;
      s.pointerStart = null;
      clearHold();
      tendRef.current?.();
    };

    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-pet]")) return;
      if (carePointer(e)) return;
      const sit = sitOf();
      s.dragging = true;
      s.pointerStart = { x: e.clientX, y: e.clientY };
      s.dragDx = e.clientX - s.x;
      holdAt = performance.now();
      tended = false;
      clearHold();
      if (isTablet(sit) || isPhone(sit)) {
        holdTimer = window.setTimeout(() => {
          if (!s.dragging || !s.pointerStart) return;
          tendNow();
        }, HOLD_MS);
      }
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const box = stageBox();
      const sit = sitOf();
      const slop = tapPxFor(navigator.platform, sit);
      if (followHover(sit) || s.dragging) {
        s.cursorX = e.clientX - (box?.left ?? 0);
      }
      if (!s.dragging || tended) return;
      if (s.pointerStart && Math.hypot(e.clientX - s.pointerStart.x, e.clientY - s.pointerStart.y) >= slop) {
        clearHold();
      }
      const maxX = Math.max(PAD, (box?.width ?? 800) - SPRITE - PAD);
      s.x = clamp(e.clientX - s.dragDx, PAD, maxX);
      if (s.pointerStart && Math.abs(e.clientX - s.pointerStart.x) > slop) {
        s.facing = e.clientX >= s.pointerStart.x ? 1 : -1;
      }
    };
    const onUp = (e: PointerEvent) => {
      clearHold();
      if (tended) {
        tended = false;
        return;
      }
      if (!s.dragging) return;
      const start = s.pointerStart;
      s.dragging = false;
      s.pointerStart = null;
      const dx = start ? e.clientX - start.x : 0;
      const dy = start ? e.clientY - start.y : 0;
      const sit = sitOf();
      const slop = tapPxFor(navigator.platform, sit);
      const heldMs = holdAt ? performance.now() - holdAt : 0;
      const kind = isTablet(sit) || isPhone(sit) ? tabletLift(heldMs, dx, dy, slop) : pointerUp(dx, dy, slop).kind;
      if (kind === "tend") {
        tendRef.current?.();
        return;
      }
      if (kind === "tap") {
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
    const onMenu = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.("[data-pet]")) e.preventDefault();
    };

    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("contextmenu", onMenu);

    return () => {
      cancelAnimationFrame(raf);
      clearHold();
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("contextmenu", onMenu);
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
        data-speech={speech ? "open" : "closed"}
        className={`absolute bottom-[214px] left-0 z-30 w-[min(220px,70vw)] transition-opacity duration-200 ${speech && onSpeechClose ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ willChange: "transform", opacity: speech ? 1 : 0 }}
      >
        {speech && onSpeechClose ? (
          <button
            type="button"
            data-speech-close
            title="Click to close"
            onClick={onSpeechClose}
            className="block w-full cursor-pointer rounded-[var(--radius-md)] border border-border bg-surface/95 px-3 py-2 text-left text-sm leading-snug text-fg shadow-lg"
          >
            {speech}
          </button>
        ) : (
          <p className="rounded-[var(--radius-md)] border border-border bg-surface/95 px-3 py-2 text-sm leading-snug text-fg shadow-lg">
            {speech ?? "\u00a0"}
          </p>
        )}
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
      <div
        ref={hitRef}
        data-pet
        data-pet-hit
        role={onTap && tapLabel ? "button" : undefined}
        tabIndex={onTap && tapLabel ? (tabStop ? 0 : -1) : undefined}
        aria-label={onTap && tapLabel ? tapLabel : undefined}
        onKeyDown={
          onTap && tapLabel
            ? (e) => {
                if (e.target !== e.currentTarget || !isTapKey(e.key, e.repeat)) return;
                e.preventDefault();
                tapRef.current?.({ keys: true });
              }
            : undefined
        }
        className="pointer-events-auto absolute bottom-0 left-0 cursor-grab active:cursor-grabbing select-none touch-none"
        style={{
          willChange: "transform",
          transformOrigin: "center bottom",
          background: "transparent",
          pointerEvents: "auto",
        }}
      >
        <canvas
          ref={bindCanvas}
          data-pet-art
          role="img"
          aria-label={label}
          aria-hidden={label ? undefined : true}
          className="pointer-events-none block h-44 w-44 bg-transparent"
          style={{
            background: "transparent",
            padding: 0,
            border: 0,
            opacity: hidden ? 0.22 : 1,
            filter: dull ? "saturate(0.42) brightness(0.82) contrast(0.92)" : unwell ? "saturate(0.5) brightness(0.88)" : undefined,
            transition: "opacity 280ms ease, filter 280ms ease",
          }}
        />
      </div>
    </div>
  );
}
