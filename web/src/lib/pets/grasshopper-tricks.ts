/** Vault ground tricks while idle. House neighborly Caelifera / Acrididae / Differential Grasshopper desk life -- hindleap / deskbask / mandiblegraze / femurrasp / caeliferahush personality (hindleap hind-leg vault launch distinct from cricket hopskip and springtail furculaflick; deskbask sun bask on desk; mandiblegraze mandible nibble graze; femurrasp femur-file rasp song distinct from cricket stridulate and katydid femurrasp; long caeliferahush Caelifera grasshopper hush -- never named wait; not Chirp gryllidae; not Blade tettigoniidae hindleap/femurrasp; not Hop collembola furcula; window-play and Call Vault leave grasshopper alone; guest slug Vault / key grasshopper -- accept "grasshopper" and "vault"; Thank-yous densvault / inkvault / denscaelifera. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop grasshopper-tricks.js. Next: Banner / swallowtail. Catalog 220. */
export const TRICK_KEY = "grasshopper";
export const TRICKS = ["hindleap", "deskbask", "mandiblegraze", "femurrasp", "caeliferahush"] as const;
export const HAPPY = ["densvault", "inkvault", "denscaelifera"] as const;
export type GrasshopperTrickKind = (typeof TRICKS)[number];
export type GrasshopperHappyKind = (typeof HAPPY)[number];
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

export type GrasshopperTrick = {
  kind: GrasshopperTrickKind;
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

export type GrasshopperHappy = {
  kind: GrasshopperHappyKind;
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

export const HAPPY_DUR = { densvault: 2.48, inkvault: 2.62, denscaelifera: 2.38 } as const;
export const CAELIFERAHUSH_HOLD = 27.80;
export const RELEASE_S = 2.08;
export const DUR = { caeliferahush: CAELIFERAHUSH_HOLD + RELEASE_S, hindleap: 3.72, deskbask: 5.15, mandiblegraze: 4.05, femurrasp: 4.48 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GrasshopperTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "caeliferahush") return 186 + roll * 18;
  if (kind === "hindleap") return 21.6 + roll * 3.5;
  if (kind === "deskbask") return 26.4 + roll * 4.4;
  if (kind === "femurrasp") return 23.8 + roll * 3.8;
  if (kind === "mandiblegraze") return 22.2 + roll * 3.6;
  return justFinished ? 18.4 + roll * 2.9 : 13.8 + roll * 2.5;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GrasshopperTrickKind | string) {
  if (musicOn) return "caeliferahush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "caeliferahush") {
    if (roll < 0.26) return "hindleap";
    if (roll < 0.5) return "deskbask";
    if (roll < 0.74) return "femurrasp";
    return "mandiblegraze";
  }
  if (lastKind === "hindleap") {
    if (roll < 0.26) return "caeliferahush";
    if (roll < 0.5) return "deskbask";
    if (roll < 0.74) return "femurrasp";
    return "mandiblegraze";
  }
  if (lastKind === "deskbask") {
    if (roll < 0.22) return "caeliferahush";
    if (roll < 0.44) return "hindleap";
    if (roll < 0.68) return "femurrasp";
    return "mandiblegraze";
  }
  if (roll < 0.2) return "caeliferahush";
  if (roll < 0.4) return "hindleap";
  if (roll < 0.6) return "deskbask";
  if (roll < 0.8) return "femurrasp";
  return "mandiblegraze";
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
  return cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest" || cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter";
}
export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "vault";
}
export function startThankYou(key: string | undefined | null, lastKind: string | undefined | null, x: number, facing: 1 | -1 | undefined, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: GrasshopperHappyKind | string, x: number, facing?: 1 | -1): GrasshopperHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as GrasshopperHappyKind) : "densvault";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densvault" ? "sit" : name === "inkvault" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
export function densvaultPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densvault));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0034, rot: s * -0.12, anim: "sit" };
    }
    if (u < 0.86) {
      const hop = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.15);
      return { lift: -0.0034 + Math.abs(hop) * 0.00145, rot: -0.12 + hop * 0.10, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: -0.0034 * (1 - s), rot: -0.12 * (1 - s), anim: "idle" };
  }
export function inkvaultPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkvault));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0048, rot: s * 0.34, anim: "play" };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.4);
      return { lift: 0.0048 + Math.abs(pulse) * 0.00215, rot: 0.34 + pulse * 0.28, anim: "play" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0048 * (1 - s), rot: 0.34 * (1 - s), anim: "idle" };
  }
export function denscaeliferaPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscaelifera));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0016, rot: s * -0.14, anim: "sit" };
    }
    if (u < 0.82) {
      const wing = Math.sin(((u - 0.13) / 0.69) * Math.PI * 1.75);
      return { lift: 0.0016 + Math.abs(wing) * 0.00075, rot: -0.14 + wing * 0.09, anim: "sit" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0016 * (1 - s), rot: -0.14 * (1 - s), anim: "idle" };
  }
export function stepHappy(happy: GrasshopperHappy, dt: number, flags?: TrickFlags): GrasshopperHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densvault") {
    const pose = densvaultPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkvault") {
    const pose = inkvaultPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denscaeliferaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}
export function beginTrick(kind: GrasshopperTrickKind | string, x: number, facing?: 1 | -1): GrasshopperTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as GrasshopperTrickKind) : "caeliferahush";
  const anim: TrickAnim =
    k === "caeliferahush"
      ? "sit"
      : k === "hindleap"
        ? "play"
        : k === "deskbask"
          ? "sit"
          : k === "femurrasp"
            ? "play"
            : k === "mandiblegraze"
              ? "talk"
              : "sit";
  return {
    kind: k,
    phase: k === "caeliferahush" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}
export function caeliferahushPose(t: number): { lift: number; rot: number } {
    const breath = Math.sin(t * 0.00118) + 0.00048 * Math.sin(t * 0.0037);
    const hush = Math.abs(Math.sin(t * 0.00051));
    return { lift: -0.00028 + hush * 0.00007, rot: -0.012 + breath * 0.0028 };
  }

export function releasePose(t: number): { lift: number; rot: number } {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00026 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.012 * (1 - u) };
  }

// U-burrow cast heap: desk-safe U-shaped burrow with a cast mound at the tail end (not Cast castheap soil push).
export function hindleapPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.hindleap));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0004, lift: s * -0.0048, rot: s * -0.18 * face, anim: "sit" };
    }
    if (u < 0.42) {
      const s = smoothstep((u - 0.12) / 0.30);
      const arc = Math.sin(s * Math.PI);
      return {
        x: fromX + face * (0.0004 + s * 0.018 + arc * 0.0022),
        lift: -0.0048 + arc * 0.062,
        rot: (-0.18 + arc * 0.55) * face,
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = smoothstep((u - 0.42) / 0.36);
      const settle = Math.sin(s * Math.PI);
      return {
        x: fromX + face * (0.0184 + s * 0.010 + settle * 0.0006),
        lift: 0.008 + settle * 0.0045,
        rot: (0.22 - s * 0.28) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.0284 * (1 - s * 0.02), lift: 0.003 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" };
  }

// Peristaltic pump pulse: water-pump body wave through the U-tube (not Cast peristalse crawl, not nematode thrashturn).
export function deskbaskPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.deskbask));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00008, lift: s * -0.0046, rot: s * 0.08 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const warm = Math.sin((u - 0.14) / 0.74 * Math.PI * 1.05);
      const sun = Math.sin(t * 0.28) + 0.04 * Math.sin(t * 0.55);
      return {
        x: fromX + face * (0.00008 + warm * 0.00012 + sun * 0.00003),
        lift: -0.0046 + Math.abs(warm) * 0.00085 + Math.abs(sun) * 0.00015,
        rot: (0.08 + warm * 0.06 + sun * 0.02) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00008 * (1 - s), lift: -0.0046 * (1 - s), rot: 0.015 * (1 - s) * face, anim: "idle" };
  }

// Head-end fossick: feeding end tastes and digs the desk film (not Cast surfacerise night rise).
export function femurraspPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.femurrasp));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00022, lift: s * 0.0026, rot: s * -0.32 * face, anim: "play" };
    }
    if (u < 0.86) {
      const rasp = Math.sin((u - 0.11) / 0.75 * Math.PI * 8.6);
      const femur = Math.sin(t * 3.4) + 0.05 * Math.sin(t * 6.8);
      return {
        x: fromX + face * (0.00022 + rasp * 0.00035 + femur * 0.00006),
        lift: 0.0026 + Math.abs(rasp) * 0.00125 + Math.abs(femur) * 0.00035,
        rot: (-0.32 + rasp * 0.42 + femur * 0.14) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00022 * (1 - s), lift: 0.0006 * (1 - s), rot: -0.04 * (1 - s) * face, anim: "idle" };
  }

// Tail-cast tip: cast end tips a small coiled cast onto the desk (not Cast castheap bulk push).
export function mandiblegrazePose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.mandiblegraze));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00025, lift: s * 0.0018, rot: s * 0.12 * face, anim: "talk" };
    }
    if (u < 0.88) {
      const nibble = Math.sin((u - 0.10) / 0.78 * Math.PI * 6.4);
      const graze = (u - 0.10) / 0.78;
      return {
        x: fromX + face * (0.00025 + graze * 0.0042 + nibble * 0.00032),
        lift: 0.0018 + Math.abs(nibble) * 0.00145,
        rot: (0.12 + nibble * 0.22) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00445 * (1 - s * 0.04), lift: 0.0004 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" };
  }
export function stepTrick(trick: GrasshopperTrick, dt: number, flags?: TrickFlags): GrasshopperTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "hindleap" && trick.kind !== "deskbask" && trick.kind !== "femurrasp" && trick.kind !== "mandiblegraze") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "caeliferahush") {
    if (next.t < CAELIFERAHUSH_HOLD) {
      const pose = caeliferahushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CAELIFERAHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CAELIFERAHUSH_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "hindleap") {
    const pose = hindleapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "deskbask") {
    const pose = deskbaskPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "femurrasp") {
    const pose = femurraspPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = mandiblegrazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}