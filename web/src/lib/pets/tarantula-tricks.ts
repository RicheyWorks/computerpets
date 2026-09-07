/** Velvet ground tricks while idle. House neighborly Theraphosidae / Aphonopelma desert-blonde desk life — urticate / threat / cork / ecdysis / aphonopelma personality (urticate urticating-setae abdomen kick without naming flick or kick or brush or hair or sting or spray or defense or attack, threat threat-rear pedipalp raise without naming rear or stand or scare or display or warn or charge or rise or tower, cork burrow-mouth silk plug without naming plug or seal or burrow or nest or silk or web or door or lid or cork alone as wait, ecdysis molt soft-back posture without naming molt or shed or flip or soft or belly or roll or ecdysis alone as sleep, long aphonopelma Aphonopelma chalcodes desert-blonde burrow-mouth perch — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or oil or dab or tip or drum or sip or hover; window-play CARRY and Call Velvet leave tarantula alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl own their tricks; guest slug Velvet / key tarantula — accept "tarantula" and "velvet"; do NOT name a trick tarantula or velvet or flick or kick or burrow or molt or silk or web or gaze). Thank-yous chalcodes / hentzi / iodius. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop tarantula-tricks.js. Window-play CARRY unchanged. True desert-blonde theraphosid desk life — not wolf-spider/jumping-spider/orb-weaver/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Hour owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "tarantula";
export const TRICKS = ["urticate", "threat", "cork", "ecdysis", "aphonopelma"] as const;
export const HAPPY = ["chalcodes", "hentzi", "iodius"] as const;
export type TarantulaTrickKind = (typeof TRICKS)[number];
export type TarantulaHappyKind = (typeof HAPPY)[number];
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

export type TarantulaTrick = {
  kind: TarantulaTrickKind;
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

export type TarantulaHappy = {
  kind: TarantulaHappyKind;
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

export const HAPPY_DUR = { chalcodes: 1.68, hentzi: 1.82, iodius: 1.74 } as const;
export const APHONOPELMA_HOLD = 19.56;
export const RELEASE_S = 1.18;
export const DUR = { aphonopelma: APHONOPELMA_HOLD + RELEASE_S, urticate: 2.56, threat: 2.48, cork: 2.70, ecdysis: 2.62 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TarantulaTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "aphonopelma") return 86 + roll * 40;
  if (kind === "urticate") return 14.4 + roll * 11.8;
  if (kind === "threat") return 15.6 + roll * 12.4;
  if (kind === "ecdysis") return 18.2 + roll * 11.6;
  return justFinished ? 14.6 + roll * 9.8 : 8.6 + roll * 9.0;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: TarantulaTrickKind | string | null) {
    if (musicOn) return "aphonopelma";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "aphonopelma") {
      if (roll < 0.26) return "urticate";
      if (roll < 0.5) return "threat";
      if (roll < 0.74) return "cork";
      return "ecdysis";
    }
    if (lastKind === "urticate") {
      if (roll < 0.26) return "aphonopelma";
      if (roll < 0.5) return "threat";
      if (roll < 0.74) return "cork";
      return "ecdysis";
    }
    if (lastKind === "threat") {
      if (roll < 0.22) return "aphonopelma";
      if (roll < 0.44) return "urticate";
      if (roll < 0.68) return "cork";
      return "ecdysis";
    }
    if (roll < 0.2) return "aphonopelma";
    if (roll < 0.4) return "urticate";
    if (roll < 0.6) return "threat";
    if (roll < 0.8) return "cork";
    return "ecdysis";
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
    return key === TRICK_KEY || key === "velvet";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: TarantulaHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: TarantulaHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: TarantulaHappyKind | string, x: number, facing: 1 | -1): TarantulaHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "chalcodes";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "chalcodes" ? "sit" : name === "hentzi" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function chalcodesPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chalcodes));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.022, rot: s * 2.05, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 5.4) + 0.18 * Math.sin(t * 10.8);
      return { lift: 0.022 + Math.abs(flash) * 0.013, rot: 2.05 + flash * 1.55, dx: flash * 0.0009, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.007 * (1 - s), rot: 0.36 * (1 - s), dx: 0, anim: "idle" };
  }
export function hentziPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hentzi));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.038, rot: s * -2.60, dx: s * 0.0016, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 4.0) + 0.20 * Math.sin(t * 8.0);
      return { lift: 0.038 + Math.abs(spring) * 0.018, rot: -2.60 + spring * 2.40, dx: spring * 0.0020, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.012 * (1 - s), rot: -0.44 * (1 - s), dx: 0, anim: "sit" };
  }
export function iodiusPose(t: number) {
    return { lift: 0.010 + Math.abs(Math.sin(t * 0.26)) * 0.014, rot: Math.sin(t * 0.26) * 1.14, dx: Math.sin(t * 0.20) * 0.0009, anim: "sit" };
  }
export function stepHappy(happy: TarantulaHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "chalcodes") {
      const pose = chalcodesPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hentzi") {
      const pose = hentziPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = iodiusPose(next.t);
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
export function beginTrick(kind: TarantulaTrickKind, x: number, facing: 1 | -1): TarantulaTrick {
    const anim: TrickAnim =
      kind === "aphonopelma"
        ? "sit"
        : kind === "urticate"
          ? "play"
          : kind === "threat"
            ? "sit"
            : kind === "cork"
              ? "talk"
              : kind === "ecdysis"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "aphonopelma" ? "hold" : "go",
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
export function aphonopelmaPose(t: number) {
    const breath = Math.sin(t * 0.09) + 0.04 * Math.sin(t * 0.27);
    const sure = Math.abs(Math.sin(t * 0.13));
    return { lift: 0.008 + sure * 0.010, rot: 0.18 + breath * 0.42 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.12 * (1 - u) };
  }
export function urticatePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.urticate));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX - face * s * 0.0024, lift: s * 0.022, rot: s * -7.2 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const kick = Math.sin((u - 0.10) / 0.68 * Math.PI * 3.6);
      const flick = Math.sin(t * 10.2) * 0.35;
      return { x: fromX - face * (0.0024 + Math.abs(kick) * 0.0036), lift: 0.020 + Math.abs(kick) * 0.016 + Math.abs(flick) * 0.008, rot: (-7.2 + kick * 9.4 + flick * 2.4) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX - face * 0.0024 * (1 - s), lift: 0.008 * (1 - s), rot: -1.1 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function threatPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.threat));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.046, rot: s * -9.8 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const tower = Math.sin((u - 0.14) / 0.72 * Math.PI);
      const pulse = Math.sin(t * 2.4) + 0.16 * Math.sin(t * 4.8);
      return { x: fromX + face * pulse * 0.0005, lift: 0.044 + tower * 0.012 + Math.abs(pulse) * 0.006, rot: (-9.8 + tower * 2.6 + pulse * 1.8) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 0.014 * (1 - s), rot: -1.6 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function corkPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.cork));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0018, lift: s * 0.012, rot: s * 3.4 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.88) {
      const tamp = Math.sin((u - 0.12) / 0.76 * Math.PI * 4.8);
      const silk = Math.sin(t * 3.6) + 0.18 * Math.sin(t * 7.2);
      return { x: fromX + face * (0.0018 + tamp * 0.0022 + silk * 0.0005), lift: 0.010 + Math.abs(tamp) * 0.009 + Math.abs(silk) * 0.005, rot: (3.4 + tamp * 3.2 + silk * 1.6) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0018 * (1 - s), lift: 0.005 * (1 - s), rot: 0.7 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function ecdysisPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.ecdysis));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.006, rot: s * 14.0 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const soft = Math.sin((u - 0.16) / 0.68 * Math.PI * 2.2);
      const flex = Math.sin(t * 1.6) * 0.30;
      return { x: fromX + face * soft * 0.0004, lift: 0.004 + Math.abs(soft) * 0.008, rot: (14.0 + soft * 2.4 + flex * 1.2) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: 0.003 * (1 - s), rot: 2.2 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: TarantulaTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "urticate" && trick.kind !== "threat" && trick.kind !== "cork" && trick.kind !== "ecdysis") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "aphonopelma") {
      if (next.t < APHONOPELMA_HOLD) {
        const pose = aphonopelmaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < APHONOPELMA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - APHONOPELMA_HOLD);
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
    if (next.kind === "urticate") {
      const pose = urticatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "threat") {
      const pose = threatPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cork") {
      const pose = corkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = ecdysisPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }