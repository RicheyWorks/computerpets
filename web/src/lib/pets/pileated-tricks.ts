/** Drum ground tricks while idle. House neighborly Picidae / Dryocopus pileated woodpecker desk life — excavate / hitch / crestflare / kuk / dryocopus personality (excavate gallery-chisel bill-strike without naming drum or drumming or tip or dabble or graze or billtap, hitch trunk-hitch climb without naming hop or hopwalk or soar or climb-cry or runstop, crestflare scarlet crest-raise without naming crest or flare or hackles or fan or strut, kuk kuk-call chin-bob without naming cry or call or song or sing or feebee or carol or honk or gruntwhistle, long dryocopus Dryocopus pileatus red-crest desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or oil or dab or tip or drum; window-play leaves pileated alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee own their tricks; guest slug Drum / key pileated — accept "pileated" and "drum"; do NOT name a trick pileated or drum or woodpecker or crest or flare or hop or soar or mantle). Thank-yous pileatus / abieticola / floridanus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop pileated-tricks.js. Window-play unchanged. True pileated woodpecker desk life — not goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Sip owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "pileated";
export const TRICKS = ["excavate", "hitch", "crestflare", "kuk", "dryocopus"] as const;
export const HAPPY = ["pileatus", "abieticola", "floridanus"] as const;
export type PileatedTrickKind = (typeof TRICKS)[number];
export type PileatedHappyKind = (typeof HAPPY)[number];
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

export type PileatedTrick = {
  kind: PileatedTrickKind;
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

export type PileatedHappy = {
  kind: PileatedHappyKind;
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

export const HAPPY_DUR = { pileatus: 1.64, abieticola: 1.78, floridanus: 1.70 } as const;
export const DRYOCOPUS_HOLD = 19.48;
export const RELEASE_S = 1.14;
export const DUR = { dryocopus: DRYOCOPUS_HOLD + RELEASE_S, excavate: 2.58, hitch: 2.44, crestflare: 2.38, kuk: 2.66 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PileatedTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "dryocopus") return 86 + roll * 42;
  if (kind === "excavate") return 14.8 + roll * 13.6;
  if (kind === "hitch") return 16.6 + roll * 12.4;
  if (kind === "kuk") return 19.8 + roll * 12.6;
  return justFinished ? 14.2 + roll * 10.6 : 8.2 + roll * 9.8;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: PileatedTrickKind | string | null) {
    if (musicOn) return "dryocopus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "dryocopus") {
      if (roll < 0.26) return "excavate";
      if (roll < 0.5) return "hitch";
      if (roll < 0.74) return "crestflare";
      return "kuk";
    }
    if (lastKind === "excavate") {
      if (roll < 0.26) return "dryocopus";
      if (roll < 0.5) return "hitch";
      if (roll < 0.74) return "crestflare";
      return "kuk";
    }
    if (lastKind === "hitch") {
      if (roll < 0.22) return "dryocopus";
      if (roll < 0.44) return "excavate";
      if (roll < 0.68) return "crestflare";
      return "kuk";
    }
    if (roll < 0.2) return "dryocopus";
    if (roll < 0.4) return "excavate";
    if (roll < 0.6) return "hitch";
    if (roll < 0.8) return "crestflare";
    return "kuk";
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
    return key === TRICK_KEY || key === "drum";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: PileatedHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: PileatedHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: PileatedHappyKind | string, x: number, facing: 1 | -1): PileatedHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "pileatus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "pileatus" ? "sit" : name === "abieticola" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function pileatusPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pileatus));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.019, rot: s * 2.15, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.25 * Math.sin(t * 11.6);
      return {
        lift: 0.019 + Math.abs(flash) * 0.014,
        rot: 2.15 + flash * 1.70,
        dx: flash * 0.0010,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.008 * (1 - s), rot: 0.55 * (1 - s), dx: 0, anim: "idle" };
  }
export function abieticolaPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.abieticola));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.032, rot: s * -2.25, dx: s * 0.0014, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.0) + 0.24 * Math.sin(t * 7.4);
      return {
        lift: 0.032 + Math.abs(wriggle) * 0.020,
        rot: -2.25 + wriggle * 2.55,
        dx: wriggle * 0.0022,
        anim: "play",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.011 * (1 - s), rot: -0.42 * (1 - s), dx: 0, anim: "sit" };
  }
export function floridanusPose(t: number) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.27)) * 0.015,
      rot: Math.sin(t * 0.27) * 1.25,
      dx: Math.sin(t * 0.22) * 0.0011,
      anim: "sit",
    };
  }
export function stepHappy(happy: PileatedHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "pileatus") {
      const pose = pileatusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "abieticola") {
      const pose = abieticolaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = floridanusPose(next.t);
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
export function beginTrick(kind: PileatedTrickKind, x: number, facing: 1 | -1): PileatedTrick {
    const anim: TrickAnim =
      kind === "dryocopus"
        ? "sit"
        : kind === "excavate"
          ? "play"
          : kind === "hitch"
            ? "play"
            : kind === "crestflare"
              ? "sit"
              : kind === "kuk"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "dryocopus" ? "hold" : "go",
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
export function dryocopusPose(t: number) {
    const breath = Math.sin(t * 0.094) + 0.06 * Math.sin(t * 0.26);
    const soft = Math.abs(Math.sin(t * 0.118));
    return {
      lift: 0.008 + soft * 0.013,
      rot: 0.64 + breath * 0.70,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.24 * (1 - u) };
  }
export function excavatePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.excavate));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      // excavate leans the bill into a gallery without naming drum
      return { x: fromX, lift: s * -0.022, rot: s * 22.0 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const chisel = Math.sin(t * 18.5) + 0.32 * Math.sin(t * 37.0);
      return {
        x: fromX + face * chisel * 0.0014,
        lift: -0.022 + Math.abs(chisel) * 0.012,
        rot: (22.0 + chisel * 4.8) * face,
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: -0.007 * (1 - s),
      rot: 3.2 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
  }
export function hitchPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.hitch));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      // hitch plants the toes for a trunk climb without naming hop
      return { x: fromX + face * s * 0.003, lift: s * 0.028, rot: s * -6.5 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const step = Math.sin(t * 4.6) + 0.22 * Math.sin(t * 9.2);
      return {
        x: fromX + face * (0.003 + step * 0.0020),
        lift: 0.024 + Math.abs(step) * 0.018,
        rot: (-6.5 + step * 3.6) * face,
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + face * 0.003 * (1 - s),
      lift: 0.008 * (1 - s),
      rot: -1.2 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
  }
export function crestflarePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.crestflare));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // crestflare lifts the scarlet without naming crest or flare alone
      return { x: fromX, lift: s * 0.022, rot: s * -3.8 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.88) {
      const rise = Math.sin(t * 2.4) + 0.2 * Math.sin(t * 4.8);
      return {
        x: fromX + face * rise * 0.0008,
        lift: 0.022 + Math.abs(rise) * 0.010,
        rot: (-3.8 + rise * 2.6) * face,
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 0.007 * (1 - s),
      rot: -0.7 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
  }
export function kukPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.kuk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // kuk bobs the chin for a silent kuk without naming cry
      return { x: fromX, lift: s * 0.026, rot: s * 7.4 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.86) {
      const s = (u - 0.10) / 0.76;
      const phrase = Math.sin(s * Math.PI * 4.2);
      const settle = Math.abs(Math.sin(s * Math.PI * 8.4));
      return {
        x: fromX + face * phrase * 0.0016,
        lift: 0.022 + settle * 0.014,
        rot: (7.4 + phrase * 5.5) * face,
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 0.009 * (1 - s),
      rot: 1.2 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
  }
export function stepTrick(trick: PileatedTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "excavate" && trick.kind !== "hitch" && trick.kind !== "crestflare" && trick.kind !== "kuk") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "dryocopus") {
      if (next.t < DRYOCOPUS_HOLD) {
        const pose = dryocopusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DRYOCOPUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DRYOCOPUS_HOLD);
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
    if (next.kind === "excavate") {
      const pose = excavatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hitch") {
      const pose = hitchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "crestflare") {
      const pose = crestflarePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = kukPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }