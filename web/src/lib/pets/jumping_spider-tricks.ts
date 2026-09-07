/** Leap ground tricks while idle. House neighborly Salticidae / Phidippus bold jumper desk life — orient / saccade / palp / dragline / phidippus personality (orient prey-target body-turn without naming stalk or hunt or aim or turn or face or lock or track or gaze, saccade AME gaze-flick without naming look or stare or eye or gaze or track or scan or watch or nod, palp pedipalp courtship raise without naming wave or dance or court or display or semaphore or strut or fan, dragline safety-line settle without naming silk or web or abseil or belay or tether or jump or leap or pounce or hop, long phidippus Phidippus audax bold-jumper blotter perch — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or oil or dab or tip or drum or sip or hover; window-play POUNCE and Call Leap leave jumping_spider alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom own their tricks; guest slug Leap / key jumping_spider — accept "jumping_spider" and "leap"; do NOT name a trick jumping_spider or leap or hop or pounce or stalk or look or silk or web or wave or gaze). Thank-yous audax / johnsoni / regius. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop jumping_spider-tricks.js. Window-play POUNCE unchanged. True bold jumper desk life — not orb-weaver/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Prowl owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "jumping_spider";
export const TRICKS = ["orient", "saccade", "palp", "dragline", "phidippus"] as const;
export const HAPPY = ["audax", "johnsoni", "regius"] as const;
export type JumpingSpiderTrickKind = (typeof TRICKS)[number];
export type JumpingSpiderHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "hold" | "release" | "done";
export type HappyPhase = "go" | "done";

export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
  windowPlay?: boolean;
  card?: boolean;
};

export type JumpingSpiderTrick = {
  kind: JumpingSpiderTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export type JumpingSpiderHappy = {
  kind: JumpingSpiderHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export const HAPPY_DUR = { audax: 1.64, johnsoni: 1.78, regius: 1.70 } as const;
export const PHIDIPPUS_HOLD = 19.48;
export const RELEASE_S = 1.14;
export const DUR = { phidippus: PHIDIPPUS_HOLD + RELEASE_S, orient: 2.48, saccade: 2.36, palp: 2.58, dragline: 2.62 } as const;

export function canStart(state: TrickFlags | undefined) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }
export function shouldAbort(state: TrickFlags | undefined) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return true;
    const cmd = String(state.cmd || "");
    return (
      cmd === "sleep" ||
      cmd === "leave" ||
      cmd === "hide" ||
      cmd === "rest" ||
      cmd === "seek" ||
      cmd === "eat" ||
      cmd === "play" ||
      cmd === "talk" ||
      cmd === "enter"
    );
  }
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: JumpingSpiderTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "phidippus") return 86 + roll * 40;
  if (kind === "orient") return 13.8 + roll * 12.6;
  if (kind === "saccade") return 15.2 + roll * 11.8;
  if (kind === "dragline") return 18.0 + roll * 11.6;
  return justFinished ? 13.8 + roll * 10.6 : 7.6 + roll * 9.8;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: JumpingSpiderTrickKind | string | null) {
    if (musicOn) return "phidippus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "phidippus") {
      if (roll < 0.26) return "orient";
      if (roll < 0.5) return "saccade";
      if (roll < 0.74) return "palp";
      return "dragline";
    }
    if (lastKind === "orient") {
      if (roll < 0.26) return "phidippus";
      if (roll < 0.5) return "saccade";
      if (roll < 0.74) return "palp";
      return "dragline";
    }
    if (lastKind === "saccade") {
      if (roll < 0.22) return "phidippus";
      if (roll < 0.44) return "orient";
      if (roll < 0.68) return "palp";
      return "dragline";
    }
    if (roll < 0.2) return "phidippus";
    if (roll < 0.4) return "orient";
    if (roll < 0.6) return "saccade";
    if (roll < 0.8) return "palp";
    return "dragline";
  }
export function happyCanStart(state: TrickFlags | undefined) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }
export function happyShouldAbort(state: TrickFlags | undefined) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving) return true;
    const cmd = String(state.cmd || "");
    return (
      cmd === "sleep" ||
      cmd === "leave" ||
      cmd === "hide" ||
      cmd === "rest" ||
      cmd === "seek" ||
      cmd === "play" ||
      cmd === "talk" ||
      cmd === "enter"
    );
  }
export function wantsThankYou(key: string | undefined | null) {
    return key === TRICK_KEY || key === "leap";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: JumpingSpiderHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: JumpingSpiderHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: JumpingSpiderHappyKind | string, x: number, facing: 1 | -1): JumpingSpiderHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "audax";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "audax" ? "sit" : name === "johnsoni" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function audaxPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.audax));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.022, rot: s * 2.35, dx: 0, anim: "sit" };
    }
    if (u < 0.83) {
      const flash = Math.sin(t * 6.2) + 0.22 * Math.sin(t * 12.4);
      return { lift: 0.022 + Math.abs(flash) * 0.015, rot: 2.35 + flash * 1.75, dx: flash * 0.0011, anim: "sit" };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: 0.009 * (1 - s), rot: 0.45 * (1 - s), dx: 0, anim: "idle" };
  }
export function johnsoniPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.johnsoni));
    if (u < 0.10) {
      const s = u / 0.10;
      return { lift: s * 0.038, rot: s * -2.55, dx: s * 0.0016, anim: "play" };
    }
    if (u < 0.86) {
      const spring = Math.sin(t * 4.6) + 0.21 * Math.sin(t * 9.2);
      return { lift: 0.038 + Math.abs(spring) * 0.022, rot: -2.55 + spring * 2.65, dx: spring * 0.0024, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.012 * (1 - s), rot: -0.42 * (1 - s), dx: 0, anim: "sit" };
  }
export function regiusPose(t: number) {
    return { lift: 0.010 + Math.abs(Math.sin(t * 0.30)) * 0.016, rot: Math.sin(t * 0.30) * 1.28, dx: Math.sin(t * 0.24) * 0.0011, anim: "sit" };
  }
export function stepHappy(happy: JumpingSpiderHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "audax") {
      const pose = audaxPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "johnsoni") {
      const pose = johnsoniPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = regiusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }
export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
    return null;
  }
export function beginTrick(kind: JumpingSpiderTrickKind, x: number, facing: 1 | -1): JumpingSpiderTrick {
    const anim: TrickAnim =
      kind === "phidippus"
        ? "sit"
        : kind === "orient"
          ? "play"
          : kind === "saccade"
            ? "play"
            : kind === "palp"
              ? "sit"
              : kind === "dragline"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "phidippus" ? "hold" : "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: anim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
function smoothstep(t: number) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }
export function phidippusPose(t: number) {
    const breath = Math.sin(t * 0.11) + 0.05 * Math.sin(t * 0.31);
    const keen = Math.abs(Math.sin(t * 0.17));
    return { lift: 0.010 + keen * 0.012, rot: 0.28 + breath * 0.52 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.006 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.16 * (1 - u) };
  }
export function orientPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.orient));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.002, lift: s * 0.024, rot: s * 14.8 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const lock = Math.sin(t * 2.2) + 0.16 * Math.sin(t * 6.6);
      const hold = Math.sin((u - 0.14) / 0.72 * Math.PI);
      return { x: fromX + face * (0.002 + lock * 0.0007), lift: 0.022 + Math.abs(lock) * 0.008 + hold * 0.006, rot: (14.8 + lock * 2.8) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.002 * (1 - s), lift: 0.008 * (1 - s), rot: 2.2 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function saccadePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.saccade));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 0.018, rot: s * -3.6 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.88) {
      const flick = Math.sin((u - 0.10) / 0.78 * Math.PI * 6.5);
      const micro = Math.sin(t * 11.2) * 0.35;
      return { x: fromX + face * (flick * 0.0024 + micro * 0.0006), lift: 0.016 + Math.abs(flick) * 0.010, rot: (-3.6 + flick * 8.8 + micro * 1.8) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.006 * (1 - s), rot: -0.9 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function palpPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.palp));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.030, rot: s * 7.2 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.87) {
      const raise = Math.sin((u - 0.12) / 0.75 * Math.PI * 3.2);
      const bob = Math.sin(t * 5.6) + 0.20 * Math.sin(t * 11.2);
      return { x: fromX + face * bob * 0.0008, lift: 0.028 + Math.abs(raise) * 0.016 + Math.abs(bob) * 0.007, rot: (7.2 + raise * 6.4 + bob * 2.0) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return { x: fromX, lift: 0.010 * (1 - s), rot: 1.4 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function draglinePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.dragline));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * 0.036, rot: s * -5.2 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.85) {
      const settle = Math.sin((u - 0.11) / 0.74 * Math.PI);
      const drip = Math.sin(t * 3.4) + 0.18 * Math.sin(t * 6.8);
      return { x: fromX + face * drip * 0.0011, lift: 0.034 - settle * 0.012 + Math.abs(drip) * 0.008, rot: (-5.2 + settle * 4.6 + drip * 2.4) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX, lift: 0.012 * (1 - s), rot: -1.0 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: JumpingSpiderTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "orient" && trick.kind !== "saccade" && trick.kind !== "palp" && trick.kind !== "dragline") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "phidippus") {
      if (next.t < PHIDIPPUS_HOLD) {
        const pose = phidippusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PHIDIPPUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PHIDIPPUS_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "orient") {
      const pose = orientPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "saccade") {
      const pose = saccadePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "palp") {
      const pose = palpPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = draglinePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }