/** Cone ground tricks while idle. House neighborly Patellidae / Patella vulgata Common Limpet desk life — clampseal / radialgraze / circumhome / shelltilt / patellahush personality (clampseal clamp-down suction hold without naming clamp or seal or suction or hold or press or grip alone as wait, radialgraze radial graze/rasp over desk film without naming graze or rasp or radial or film or radula or scrape alone as wait, circumhome slow circum-home trek without naming home or trek or circ or orbit or scar or return alone as wait, shelltilt shell-tilt weather cue without naming tilt or shell or weather or cue or tip or lean alone as wait, long patellahush Patella limpet hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or sprintdash or stalkeyescan or burrowplunge or freezecamo or ocypodehush or denspale or inkpale or densghost or clawwave or burrowdig or sandfeed or lateralsidestep or pugilator or denswave or inkwave or densmajor or sideswim or gnathopod or detritusclutch or pairguard or gammarus or densscud or inkscud or densgnath or densclaw or radula or pedal or pneumostome or ommatophore or lymnaeid or stagnalis or physa or radix or lamella or imbricate or lasso or margin or pleurotus or adductor or protractor or inhalant or ctenidium or unionid or spiral or siphuncle or nacre or pinhole or fringe or chamber or pearl or quiet or clampseal or radialgraze or circumhome or shelltilt or patellahush; window-play and Call Cone leave limpet alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun/Half/Thread/Scud/Wave/Pale own their tricks; guest slug Cone / key limpet — accept "limpet" and "cone" (roster slug cone; campaign Cone); do NOT accept bare "cone" as a trick id; do NOT confuse with Chamber the Nautilus (key nautilus / slug chamber) or chamber thank-you; do NOT confuse with Pale the Ghost Crab (key ghost_crab / slug pale) or denspale thank-you; do NOT confuse with Wave the Fiddler Crab or Scud the Amphipod; do NOT confuse with Whorl the Pond Snail (key pond_snail) radula/pneumostome gape; do NOT confuse with Cement the Acorn Barnacle (key barnacle / slug cement) — do not start Cement in parallel; do NOT confuse with Frill the Oyster or Hinge the Mussel; do NOT name a trick limpet or cone or barnacle or cement or ghost_crab or pale or denspale or densclaw or chamber. Thank-yous denscone / inkcone / denspatella. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop limpet-tricks.js. Window-play unchanged. True common limpet desk life — clamp-down suction, radial film graze, slow circum-home trek, and shell-tilt weather cue; not Ocypode ghost-crab clones (sprintdash/stalkeyescan/burrowplunge/freezecamo), not Uca fiddler clones, not Gammarus amphipod clones, not Lymnaea pond-snail gape (radula/pneumostome), not oyster/mussel bivalve clones, not barnacle Cement (next guest) — true Patella limpet life. Next house-order guest after Cone still lacking tricks owns the next seat (Cement / barnacle). No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "limpet";
export const TRICKS = ["clampseal", "radialgraze", "circumhome", "shelltilt", "patellahush"] as const;
export const HAPPY = ["denscone", "inkcone", "denspatella"] as const;
export type LimpetTrickKind = (typeof TRICKS)[number];
export type LimpetHappyKind = (typeof HAPPY)[number];
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

export type LimpetTrick = {
  kind: LimpetTrickKind;
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

export type LimpetHappy = {
  kind: LimpetHappyKind;
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

export const HAPPY_DUR = { denscone: 2.66, inkcone: 2.82, denspatella: 2.56 } as const;
export const PATELLAHUSH_HOLD = 25.10;
export const RELEASE_S = 2.25;
export const DUR = { patellahush: PATELLAHUSH_HOLD + RELEASE_S, clampseal: 4.72, radialgraze: 4.88, circumhome: 5.10, shelltilt: 4.64 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: LimpetTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "patellahush") return 170 + roll * 14;
  if (kind === "clampseal") return 26.2 + roll * 4.3;
  if (kind === "radialgraze") return 27.0 + roll * 4.6;
  if (kind === "circumhome") return 27.6 + roll * 4.8;
  if (kind === "shelltilt") return 26.0 + roll * 4.2;
  return justFinished ? 19.6 + roll * 2.9 : 14.8 + roll * 2.5;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LimpetTrickKind | string) {
  if (musicOn) return "patellahush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "patellahush") {
    if (roll < 0.26) return "clampseal";
    if (roll < 0.5) return "radialgraze";
    if (roll < 0.74) return "circumhome";
    return "shelltilt";
  }
  if (lastKind === "clampseal") {
    if (roll < 0.26) return "patellahush";
    if (roll < 0.5) return "radialgraze";
    if (roll < 0.74) return "circumhome";
    return "shelltilt";
  }
  if (lastKind === "radialgraze") {
    if (roll < 0.22) return "patellahush";
    if (roll < 0.44) return "clampseal";
    if (roll < 0.68) return "circumhome";
    return "shelltilt";
  }
  if (roll < 0.2) return "patellahush";
  if (roll < 0.4) return "clampseal";
  if (roll < 0.6) return "radialgraze";
  if (roll < 0.8) return "circumhome";
  return "shelltilt";
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
    return key === TRICK_KEY || key === "cone";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: LimpetHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: LimpetHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: LimpetHappyKind | string, x: number, facing: 1 | -1): LimpetHappy {
    const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as LimpetHappyKind) : "denscone";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denscone" ? "sit" : name === "inkcone" ? "play" : "play") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function densconePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscone));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0028, rot: s * -0.18, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.2);
    return { lift: -0.0028 + bob * 0.0009, rot: -0.18 + bob * 0.10, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: -0.0028 * (1 - s), rot: -0.18 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkconePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkcone));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 0.0032, rot: s * 0.28, anim: "talk" as TrickAnim };
  }
  if (u < 0.70) {
    const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.6);
    return { lift: 0.0032 + Math.abs(pulse) * 0.0012, rot: 0.28 + pulse * 0.18, anim: "talk" as TrickAnim };
  }
  const s = (u - 0.70) / 0.30;
  return { lift: 0.0032 * (1 - s), rot: 0.28 * (1 - s), anim: "idle" as TrickAnim };
}
export function denspatellaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspatella));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0026, rot: s * -0.16, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const pulse = Math.sin((u - 0.12) / 0.66 * Math.PI * 2.8);
    return { lift: 0.0026 + Math.abs(pulse) * 0.0010, rot: -0.16 + pulse * 0.14, anim: "play" as TrickAnim };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.0026 * (1 - s), rot: -0.16 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: LimpetHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denscone") {
      const pose = densconePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkcone") {
      const pose = inkconePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denspatellaPose(next.t);
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
export function beginTrick(kind: LimpetTrickKind | string, x: number, facing: 1 | -1): LimpetTrick {
  const anim: TrickAnim =
    kind === "patellahush"
      ? "sit"
      : kind === "clampseal"
        ? "sit"
        : kind === "radialgraze"
          ? "play"
          : kind === "circumhome"
            ? "walk"
            : kind === "shelltilt"
              ? "sit"
              : "sit";
  return {
    kind: (TRICKS as readonly string[]).includes(kind) ? (kind as LimpetTrickKind) : "clampseal",
    phase: kind === "patellahush" ? "hold" : "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
function smoothstep(t: number) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }
export function patellahushPose(t: number) {
  const breath = Math.sin(t * 0.0022) + 0.0010 * Math.sin(t * 0.0074);
  const hush = Math.abs(Math.sin(t * 0.0013));
  return { lift: -0.00022 + hush * 0.00018, rot: -0.010 + breath * 0.007 };
}
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.012 * (1 - u) };
  }
export function clampsealPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clampseal));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * -0.0046, rot: s * -0.12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const seal = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.4);
    const press = Math.sin(t * 0.28) * 0.00018;
    return { x: fromX + face * seal * 0.00008, lift: -0.0046 + press + Math.abs(seal) * 0.00035, rot: (-0.12 + seal * 0.06) * face, anim: "sit" as TrickAnim };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX, lift: -0.0046 * (1 - s), rot: -0.012 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function radialgrazePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.radialgraze));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.00022, lift: s * 0.0028, rot: s * 0.20 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const ang = (u - 0.12) / 0.74 * Math.PI * 2.0;
    const rasp = Math.sin(t * 1.15) + 0.035 * Math.sin(t * 2.3);
    const rad = 0.0018 + Math.abs(rasp) * 0.00025;
    return { x: fromX + face * Math.cos(ang) * rad, lift: 0.0028 + Math.sin(ang) * 0.00055 + Math.abs(rasp) * 0.00040, rot: (0.20 + Math.sin(ang) * 0.28 + rasp * 0.08) * face, anim: "play" as TrickAnim };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 0.00022 * (1 - s), lift: 0.0012 * (1 - s), rot: 0.020 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function circumhomePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.circumhome));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX + face * s * 0.00040, lift: s * 0.0016, rot: s * 0.10 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.88) {
    const trek = (u - 0.10) / 0.78;
    const arc = Math.sin(trek * Math.PI);
    const step = Math.sin(t * 0.85) + 0.030 * Math.sin(t * 1.7);
    return { x: fromX + face * (0.00040 + trek * 0.014 + arc * 0.0012 + step * 0.00010), lift: 0.0016 + Math.abs(step) * 0.00055 + arc * 0.00035, rot: (0.10 + step * 0.08 + arc * 0.12) * face, anim: "walk" as TrickAnim };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 0.014 * (1 - s), lift: 0.0008 * (1 - s), rot: 0.016 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function shelltiltPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.shelltilt));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.0012, rot: s * 0.42 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const cue = Math.sin((u - 0.14) / 0.68 * Math.PI * 2.2);
    const weather = Math.sin(t * 0.35) * 0.00015;
    return { x: fromX + face * cue * 0.00012, lift: 0.0012 + weather + Math.abs(cue) * 0.00040, rot: (0.42 + cue * 0.16) * face, anim: "sit" as TrickAnim };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX, lift: 0.0012 * (1 - s), rot: 0.42 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: LimpetTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "clampseal" && trick.kind !== "circumhome" && trick.kind !== "radialgraze" && trick.kind !== "shelltilt") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "patellahush") {
      if (next.t < PATELLAHUSH_HOLD) {
        const pose = patellahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PATELLAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PATELLAHUSH_HOLD);
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
    if (next.kind === "clampseal") {
      const pose = clampsealPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "circumhome") {
      const pose = circumhomePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "radialgraze") {
      const pose = radialgrazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = shelltiltPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }
