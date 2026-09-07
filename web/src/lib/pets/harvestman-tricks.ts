/** Stem ground tricks while idle. House neighborly Opiliones / Phalangium common-harvestman desk life — legwave / oscillate / autotomy / gregarious / phalangium personality (legwave second-pair sensory-leg wave without naming antenna or feel or pat or sense or probe or bob or palp or dragline or saccade or orient, oscillate defensive body-bob without naming bob or jiggle or shake or bounce or rock or sway or pulse or tremble, autotomy readiness tip-cast without naming legdrop or castleg or drop or cast or shed or molt or ecdysis or cork, gregarious quiet cluster-settle without naming huddle or aggregate or clump or cluster or pile or roost or nest or nestguard, long phalangium Phalangium opilio blotter-stem walk-hold — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or urticate or threat or cork or ecdysis or aphonopelma or hourglass or tangle or wrap or gumfoot or latrodectus or oil or dab or tip or drum or sip or hover; window-play CARRY and Call Stem leave harvestman alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour own their tricks; guest slug Stem / key harvestman — accept "harvestman" and "stem"; do NOT name a trick harvestman or stem or spider or silk or web or bob or probe or huddle or venom or gaze). Thank-yous opilio / parietinus / vittatum. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop harvestman-tricks.js. Window-play CARRY unchanged. True Opiliones harvestman desk life — not spider/widow/tarantula/wolf-spider/jumping-spider/orb-weaver/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Barb owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "harvestman";
export const TRICKS = ["legwave", "oscillate", "autotomy", "gregarious", "phalangium"] as const;
export const HAPPY = ["opilio", "parietinus", "vittatum"] as const;
export type HarvestmanTrickKind = (typeof TRICKS)[number];
export type HarvestmanHappyKind = (typeof HAPPY)[number];
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

export type HarvestmanTrick = {
  kind: HarvestmanTrickKind;
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

export type HarvestmanHappy = {
  kind: HarvestmanHappyKind;
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

export const HAPPY_DUR = { opilio: 1.72, parietinus: 1.86, vittatum: 1.78 } as const;
export const PHALANGIUM_HOLD = 19.64;
export const RELEASE_S = 1.22;
export const DUR = { phalangium: PHALANGIUM_HOLD + RELEASE_S, legwave: 2.60, oscillate: 2.54, autotomy: 2.76, gregarious: 2.68 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HarvestmanTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "phalangium") return 90 + roll * 36;
  if (kind === "legwave") return 15.0 + roll * 11.2;
  if (kind === "oscillate") return 16.2 + roll * 11.8;
  if (kind === "gregarious") return 17.6 + roll * 12.4;
  return justFinished ? 15.0 + roll * 9.4 : 9.0 + roll * 8.6;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HarvestmanTrickKind | string | null) {
    if (musicOn) return "phalangium";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "phalangium") {
      if (roll < 0.26) return "legwave";
      if (roll < 0.5) return "oscillate";
      if (roll < 0.74) return "autotomy";
      return "gregarious";
    }
    if (lastKind === "legwave") {
      if (roll < 0.26) return "phalangium";
      if (roll < 0.5) return "oscillate";
      if (roll < 0.74) return "autotomy";
      return "gregarious";
    }
    if (lastKind === "oscillate") {
      if (roll < 0.22) return "phalangium";
      if (roll < 0.44) return "legwave";
      if (roll < 0.68) return "autotomy";
      return "gregarious";
    }
    if (roll < 0.2) return "phalangium";
    if (roll < 0.4) return "legwave";
    if (roll < 0.6) return "oscillate";
    if (roll < 0.8) return "autotomy";
    return "gregarious";
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
    return key === TRICK_KEY || key === "stem";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: HarvestmanHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: HarvestmanHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: HarvestmanHappyKind | string, x: number, facing: 1 | -1): HarvestmanHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "opilio";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "opilio" ? "sit" : name === "parietinus" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function opilioPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.opilio));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.018, rot: s * 2.40, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.8) + 0.16 * Math.sin(t * 9.6);
      return { lift: 0.018 + Math.abs(flash) * 0.011, rot: 2.40 + flash * 1.45, dx: flash * 0.0007, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.005 * (1 - s), rot: 0.30 * (1 - s), dx: 0, anim: "idle" };
  }
export function parietinusPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.parietinus));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.034, rot: s * -2.90, dx: s * 0.0014, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.6) + 0.18 * Math.sin(t * 7.2);
      return { lift: 0.034 + Math.abs(spring) * 0.016, rot: -2.90 + spring * 2.20, dx: spring * 0.0018, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.010 * (1 - s), rot: -0.38 * (1 - s), dx: 0, anim: "sit" };
  }
export function vittatumPose(t: number) {
    return { lift: 0.010 + Math.abs(Math.sin(t * 0.22)) * 0.012, rot: Math.sin(t * 0.22) * 1.10, dx: Math.sin(t * 0.16) * 0.0007, anim: "sit" };
  }
export function stepHappy(happy: HarvestmanHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "opilio") {
      const pose = opilioPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "parietinus") {
      const pose = parietinusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = vittatumPose(next.t);
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
export function beginTrick(kind: HarvestmanTrickKind, x: number, facing: 1 | -1): HarvestmanTrick {
    const anim: TrickAnim =
      kind === "phalangium"
        ? "sit"
        : kind === "legwave"
          ? "talk"
          : kind === "oscillate"
            ? "play"
            : kind === "autotomy"
              ? "play"
              : kind === "gregarious"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "phalangium" ? "hold" : "go",
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
export function phalangiumPose(t: number) {
    const breath = Math.sin(t * 0.07) + 0.05 * Math.sin(t * 0.21);
    const hang = Math.abs(Math.sin(t * 0.10));
    return { lift: 0.010 + hang * 0.008, rot: -0.42 + breath * 0.52 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.005 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
export function legwavePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.legwave));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0016, lift: s * 0.016, rot: s * 5.4 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const wave = Math.sin((u - 0.11) / 0.73 * Math.PI * 4.8);
      const tap = Math.sin(t * 5.6) + 0.18 * Math.sin(t * 11.2);
      return { x: fromX + face * (0.0016 + wave * 0.0022 + tap * 0.0005), lift: 0.014 + Math.abs(wave) * 0.010 + Math.abs(tap) * 0.005, rot: (5.4 + wave * 3.8 + tap * 1.8) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0016 * (1 - s), lift: 0.005 * (1 - s), rot: 0.9 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function oscillatePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.oscillate));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 0.022, rot: s * -1.6 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const bob = Math.sin((u - 0.10) / 0.76 * Math.PI * 6.4);
      const jitter = Math.sin(t * 8.2) * 0.28;
      return { x: fromX + face * jitter * 0.0003, lift: 0.018 + Math.abs(bob) * 0.016 + Math.abs(jitter) * 0.004, rot: (-1.6 + bob * 2.4 + jitter * 1.2) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 0.006 * (1 - s), rot: -0.4 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function autotomyPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.autotomy));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX - face * s * 0.0010, lift: s * 0.030, rot: s * 9.2 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const cast = Math.sin((u - 0.12) / 0.66 * Math.PI);
      const tip = Math.sin(t * 3.4) + 0.15 * Math.sin(t * 6.8);
      return { x: fromX - face * (0.0010 + cast * 0.0026), lift: 0.026 + cast * 0.012 + Math.abs(tip) * 0.006, rot: (9.2 - cast * 14.8 + tip * 2.2) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX - face * 0.0010 * (1 - s), lift: 0.008 * (1 - s), rot: -1.2 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function gregariousPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.gregarious));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0024, lift: s * 0.008, rot: s * 2.2 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const nestle = Math.sin((u - 0.14) / 0.72 * Math.PI * 2.4);
      const soft = Math.sin(t * 1.8) + 0.12 * Math.sin(t * 3.6);
      return { x: fromX + face * (0.0024 + nestle * 0.0010 + soft * 0.0003), lift: 0.006 + Math.abs(nestle) * 0.007 + Math.abs(soft) * 0.004, rot: (2.2 + nestle * 1.6 + soft * 0.9) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0024 * (1 - s), lift: 0.003 * (1 - s), rot: 0.5 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: HarvestmanTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "legwave" && trick.kind !== "oscillate" && trick.kind !== "autotomy" && trick.kind !== "gregarious") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "phalangium") {
      if (next.t < PHALANGIUM_HOLD) {
        const pose = phalangiumPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PHALANGIUM_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PHALANGIUM_HOLD);
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
    if (next.kind === "legwave") {
      const pose = legwavePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "oscillate") {
      const pose = oscillatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "autotomy") {
      const pose = autotomyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gregariousPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }