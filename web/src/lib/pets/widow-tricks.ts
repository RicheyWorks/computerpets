/** Hour ground tricks while idle. House neighborly Theridiidae / Latrodectus southern black-widow desk life — hourglass / tangle / wrap / gumfoot / latrodectus personality (hourglass ventral red-hourglass abdomen tip without naming flash or belly or mark or show or display or glass or red or warn, tangle messy irregular cobweb weave without naming web or silk or spin or nest or nestguard or mesh or lace or snare or radiate or stabilimentum or swathe or strum, wrap sticky prey-wrap wind without naming bite or kill or eat or prey or coil or wind alone as play or bind, gumfoot sticky gumfoot trap-line drop without naming trap or line or glue or sticky or foot or drop or hang or pendant or fall, long latrodectus Latrodectus mactans dark-corner tangle perch — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or urticate or threat or cork or ecdysis or aphonopelma or oil or dab or tip or drum or sip or hover; window-play CARRY and Call Hour leave widow alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet own their tricks; guest slug Hour / key widow — accept "widow" and "hour"; do NOT name a trick widow or hour or flash or silk or web or bite or venom or gaze). Thank-yous mactans / hesperus / geometricus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop widow-tricks.js. Window-play CARRY unchanged. True theridiid black-widow desk life — not tarantula/wolf-spider/jumping-spider/orb-weaver/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Stem owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "widow";
export const TRICKS = ["hourglass", "tangle", "wrap", "gumfoot", "latrodectus"] as const;
export const HAPPY = ["mactans", "hesperus", "geometricus"] as const;
export type WidowTrickKind = (typeof TRICKS)[number];
export type WidowHappyKind = (typeof HAPPY)[number];
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

export type WidowTrick = {
  kind: WidowTrickKind;
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

export type WidowHappy = {
  kind: WidowHappyKind;
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

export const HAPPY_DUR = { mactans: 1.70, hesperus: 1.84, geometricus: 1.76 } as const;
export const LATRODECTUS_HOLD = 19.60;
export const RELEASE_S = 1.20;
export const DUR = { latrodectus: LATRODECTUS_HOLD + RELEASE_S, hourglass: 2.58, tangle: 2.52, wrap: 2.74, gumfoot: 2.66 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: WidowTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "latrodectus") return 88 + roll * 38;
  if (kind === "hourglass") return 14.8 + roll * 11.4;
  if (kind === "tangle") return 16.0 + roll * 12.0;
  if (kind === "gumfoot") return 17.8 + roll * 12.2;
  return justFinished ? 14.8 + roll * 9.6 : 8.8 + roll * 8.8;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: WidowTrickKind | string | null) {
    if (musicOn) return "latrodectus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "latrodectus") {
      if (roll < 0.26) return "hourglass";
      if (roll < 0.5) return "tangle";
      if (roll < 0.74) return "wrap";
      return "gumfoot";
    }
    if (lastKind === "hourglass") {
      if (roll < 0.26) return "latrodectus";
      if (roll < 0.5) return "tangle";
      if (roll < 0.74) return "wrap";
      return "gumfoot";
    }
    if (lastKind === "tangle") {
      if (roll < 0.22) return "latrodectus";
      if (roll < 0.44) return "hourglass";
      if (roll < 0.68) return "wrap";
      return "gumfoot";
    }
    if (roll < 0.2) return "latrodectus";
    if (roll < 0.4) return "hourglass";
    if (roll < 0.6) return "tangle";
    if (roll < 0.8) return "wrap";
    return "gumfoot";
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
    return key === TRICK_KEY || key === "hour";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: WidowHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: WidowHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: WidowHappyKind | string, x: number, facing: 1 | -1): WidowHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "mactans";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "mactans" ? "sit" : name === "hesperus" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function mactansPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mactans));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.020, rot: s * 2.15, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 5.2) + 0.18 * Math.sin(t * 10.4);
      return { lift: 0.020 + Math.abs(flash) * 0.012, rot: 2.15 + flash * 1.60, dx: flash * 0.0008, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.006 * (1 - s), rot: 0.34 * (1 - s), dx: 0, anim: "idle" };
  }
export function hesperusPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hesperus));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.036, rot: s * -2.70, dx: s * 0.0015, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.8) + 0.20 * Math.sin(t * 7.6);
      return { lift: 0.036 + Math.abs(spring) * 0.017, rot: -2.70 + spring * 2.35, dx: spring * 0.0019, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.011 * (1 - s), rot: -0.42 * (1 - s), dx: 0, anim: "sit" };
  }
export function geometricusPose(t: number) {
    return { lift: 0.011 + Math.abs(Math.sin(t * 0.24)) * 0.013, rot: Math.sin(t * 0.24) * 1.18, dx: Math.sin(t * 0.18) * 0.0008, anim: "sit" };
  }
export function stepHappy(happy: WidowHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "mactans") {
      const pose = mactansPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hesperus") {
      const pose = hesperusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = geometricusPose(next.t);
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
export function beginTrick(kind: WidowTrickKind, x: number, facing: 1 | -1): WidowTrick {
    const anim: TrickAnim =
      kind === "latrodectus"
        ? "sit"
        : kind === "hourglass"
          ? "sit"
          : kind === "tangle"
            ? "talk"
            : kind === "wrap"
              ? "play"
              : kind === "gumfoot"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "latrodectus" ? "hold" : "go",
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
export function latrodectusPose(t: number) {
    const breath = Math.sin(t * 0.08) + 0.05 * Math.sin(t * 0.24);
    const hang = Math.abs(Math.sin(t * 0.11));
    return { lift: 0.012 + hang * 0.009, rot: -0.55 + breath * 0.48 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.006 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.22 * (1 - u) };
  }
export function hourglassPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.hourglass));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.018, rot: s * 16.8 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.80) {
      const tip = Math.sin((u - 0.12) / 0.68 * Math.PI);
      const gleam = Math.sin(t * 3.2) + 0.14 * Math.sin(t * 6.4);
      return { x: fromX + face * gleam * 0.0004, lift: 0.016 + tip * 0.010 + Math.abs(gleam) * 0.004, rot: (16.8 + tip * 2.8 + gleam * 1.4) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.80) / 0.20);
    return { x: fromX, lift: 0.006 * (1 - s), rot: 2.4 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function tanglePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.tangle));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0020, lift: s * 0.014, rot: s * 4.2 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.86) {
      const mess = Math.sin((u - 0.10) / 0.76 * Math.PI * 5.2);
      const weave = Math.sin(t * 4.4) + 0.22 * Math.sin(t * 8.8);
      return { x: fromX + face * (0.0020 + mess * 0.0028 + weave * 0.0007), lift: 0.012 + Math.abs(mess) * 0.011 + Math.abs(weave) * 0.006, rot: (4.2 + mess * 4.6 + weave * 2.0) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0020 * (1 - s), lift: 0.005 * (1 - s), rot: 0.8 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function wrapPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.wrap));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0014, lift: s * 0.028, rot: s * -5.6 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.84) {
      const wind = Math.sin((u - 0.11) / 0.73 * Math.PI * 4.4);
      const spin = Math.sin(t * 7.6) * 0.40;
      return { x: fromX + face * (0.0014 + Math.abs(wind) * 0.0024), lift: 0.024 + Math.abs(wind) * 0.014 + Math.abs(spin) * 0.007, rot: (-5.6 + wind * 8.8 + spin * 3.0) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0014 * (1 - s), lift: 0.008 * (1 - s), rot: -1.0 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function gumfootPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.gumfoot));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX - face * s * 0.0012, lift: s * 0.008, rot: s * -3.8 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.85) {
      const drop = Math.sin((u - 0.13) / 0.72 * Math.PI * 3.2);
      const tack = Math.sin(t * 2.8) + 0.16 * Math.sin(t * 5.6);
      return { x: fromX - face * (0.0012 + Math.abs(drop) * 0.0018 + tack * 0.0004), lift: 0.006 + Math.abs(drop) * 0.012 + Math.abs(tack) * 0.005, rot: (-3.8 + drop * 4.4 + tack * 1.6) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX - face * 0.0012 * (1 - s), lift: 0.004 * (1 - s), rot: -0.7 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: WidowTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "hourglass" && trick.kind !== "tangle" && trick.kind !== "wrap" && trick.kind !== "gumfoot") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "latrodectus") {
      if (next.t < LATRODECTUS_HOLD) {
        const pose = latrodectusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LATRODECTUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LATRODECTUS_HOLD);
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
    if (next.kind === "hourglass") {
      const pose = hourglassPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tangle") {
      const pose = tanglePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "wrap") {
      const pose = wrapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gumfootPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }