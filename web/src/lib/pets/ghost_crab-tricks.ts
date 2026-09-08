/** Pale ground tricks while idle. House neighborly Ocypodidae / Ocypode quadrata Atlantic ghost crab life — sprintdash / stalkeyescan / burrowplunge / freezecamo / ocypodehush personality (sprintdash sprint dash across desk without naming sprint or dash or run or race or flee or bolt alone as wait, stalkeyescan stalk-eye scan without naming stalk or eye or scan or peer or look or monocle alone as wait, burrowplunge burrow plunge drop without naming burrow or plunge or dig or dive or tunnel or plug alone as wait, freezecamo freeze-still camouflage without naming freeze or camo or still or hide or blend or crouch alone as wait, long ocypodehush Ocypode ghost-crab hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or clawwave or burrowdig or sandfeed or lateralsidestep or pugilator or denswave or inkwave or densmajor or sideswim or gnathopod or detritusclutch or pairguard or gammarus or densscud or inkscud or densgnath or densclaw or swap or antenna or scuttle or withdraw or vacancy or scrap or fit or lease or carapace or bookgill or telson or furrow or fossil or blue or page or tray or chelate or caridoid or chimney or antennule or astacid or clasp or marl or chitin or sprintdash or stalkeyescan or burrowplunge or freezecamo or ocypodehush; window-play and Call Pale leave ghost_crab alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun/Half/Thread/Scud/Wave own their tricks; guest slug Pale / key ghost_crab — accept "ghost_crab" and "pale" (roster slug pale; campaign Pale); do NOT accept bare "ghost" (Luna); do NOT confuse with Wave the Fiddler Crab (key fiddler_crab / slug wave) or denswave thank-you; do NOT confuse with Scud the Amphipod (key amphipod / slug scud) or densscud thank-you; do NOT confuse with Cone the Limpet (key limpet / slug cone) — do not start Cone in parallel; do NOT confuse with hermit_crab scrap/swap/scuttle or horseshoe_crab carapace/telson or crayfish chelate/caridoid or Tun densclaw thank-you; do NOT name a trick ghost_crab or pale or fiddler_crab or wave or amphipod or scud or hermit_crab or horseshoe_crab or limpet or cone or denswave or densclaw. Thank-yous denspale / inkpale / densghost. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop ghost_crab-tricks.js. Window-play unchanged. True Atlantic ghost crab desk life — sprint dash, stalk-eye scan, burrow plunge, and freeze-still camouflage; not Uca fiddler/Ocypodidae clones (clawwave/burrowdig/sandfeed/lateralsidestep), not Gammarus amphipod/Amphipoda clones (sideswim/gnathopod/detritusclutch/pairguard), not hermit crab Paguroidea clones (swap/scuttle/withdraw), not horseshoe Limulus clones (carapace/telson/furrow), not Astacus crayfish clones (chelate/caridoid) — true Ocypode ghost crab life distinct from fiddler claw-wave and amphipod side-swim. Next house-order guest after Pale still lacking tricks owns the next seat (Cone / limpet). No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "ghost_crab";
export const TRICKS = ["sprintdash", "stalkeyescan", "burrowplunge", "freezecamo", "ocypodehush"] as const;
export const HAPPY = ["denspale", "inkpale", "densghost"] as const;
export type GhostCrabTrickKind = (typeof TRICKS)[number];
export type GhostCrabHappyKind = (typeof HAPPY)[number];
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

export type GhostCrabTrick = {
  kind: GhostCrabTrickKind;
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

export type GhostCrabHappy = {
  kind: GhostCrabHappyKind;
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

export const HAPPY_DUR = { denspale: 2.64, inkpale: 2.80, densghost: 2.54 } as const;
export const OCYPODEHUSH_HOLD = 24.70;
export const RELEASE_S = 2.20;
export const DUR = { ocypodehush: OCYPODEHUSH_HOLD + RELEASE_S, sprintdash: 4.58, stalkeyescan: 4.70, burrowplunge: 4.66, freezecamo: 4.80 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GhostCrabTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "ocypodehush") return 168 + roll * 14;
  if (kind === "sprintdash") return 25.4 + roll * 4.2;
  if (kind === "stalkeyescan") return 26.8 + roll * 4.5;
  if (kind === "burrowplunge") return 26.4 + roll * 4.4;
  if (kind === "freezecamo") return 27.2 + roll * 4.6;
  return justFinished ? 19.4 + roll * 2.9 : 14.6 + roll * 2.5;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GhostCrabTrickKind | string) {
  if (musicOn) return "ocypodehush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "ocypodehush") {
    if (roll < 0.26) return "sprintdash";
    if (roll < 0.5) return "stalkeyescan";
    if (roll < 0.74) return "burrowplunge";
    return "freezecamo";
  }
  if (lastKind === "sprintdash") {
    if (roll < 0.26) return "ocypodehush";
    if (roll < 0.5) return "stalkeyescan";
    if (roll < 0.74) return "burrowplunge";
    return "freezecamo";
  }
  if (lastKind === "stalkeyescan") {
    if (roll < 0.22) return "ocypodehush";
    if (roll < 0.44) return "sprintdash";
    if (roll < 0.68) return "burrowplunge";
    return "freezecamo";
  }
  if (roll < 0.2) return "ocypodehush";
  if (roll < 0.4) return "sprintdash";
  if (roll < 0.6) return "stalkeyescan";
  if (roll < 0.8) return "burrowplunge";
  return "freezecamo";
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
    return key === TRICK_KEY || key === "pale";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: GhostCrabHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: GhostCrabHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: GhostCrabHappyKind | string, x: number, facing: 1 | -1): GhostCrabHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denspale";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denspale" ? "sit" : name === "inkpale" ? "play" : "play") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denspalePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspale));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 0.0038, rot: s * -0.28, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.5);
    return { lift: 0.0038 + bob * 0.0015, rot: -0.28 + bob * 0.16, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 0.0038 * (1 - s), rot: -0.28 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkpalePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkpale));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 0.0044, rot: s * 0.34, anim: "talk" as TrickAnim };
  }
  if (u < 0.70) {
    const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.9);
    return { lift: 0.0044 + Math.abs(pulse) * 0.0015, rot: 0.34 + pulse * 0.24, anim: "talk" as TrickAnim };
  }
  const s = (u - 0.70) / 0.30;
  return { lift: 0.0044 * (1 - s), rot: 0.34 * (1 - s), anim: "idle" as TrickAnim };
}
export function densghostPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densghost));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0034, rot: s * -0.22, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const pulse = Math.sin((u - 0.12) / 0.66 * Math.PI * 3.1);
    return { lift: 0.0034 + Math.abs(pulse) * 0.0013, rot: -0.22 + pulse * 0.18, anim: "play" as TrickAnim };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.0034 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: GhostCrabHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denspale") {
      const pose = denspalePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkpale") {
      const pose = inkpalePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densghostPose(next.t);
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
export function beginTrick(kind: GhostCrabTrickKind | string, x: number, facing: 1 | -1): GhostCrabTrick {
  const anim: TrickAnim =
    kind === "ocypodehush"
      ? "sit"
      : kind === "sprintdash"
        ? "walk"
        : kind === "stalkeyescan"
          ? "talk"
          : kind === "burrowplunge"
            ? "sit"
            : kind === "freezecamo"
              ? "sit"
              : "sit";
  return {
    kind: (TRICKS as readonly string[]).includes(kind) ? (kind as GhostCrabTrickKind) : "sprintdash",
    phase: kind === "ocypodehush" ? "hold" : "go",
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
export function ocypodehushPose(t: number) {
  const breath = Math.sin(t * 0.0026) + 0.0012 * Math.sin(t * 0.0082);
  const hush = Math.abs(Math.sin(t * 0.0015));
  return { lift: 0.00016 + hush * 0.00028, rot: -0.014 + breath * 0.009 };
}
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00020 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.018 * (1 - u) };
  }
export function sprintdashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sprintdash));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX + face * s * 0.0012, lift: s * 0.0024, rot: s * 0.18 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.82) {
    const dash = Math.sin((u - 0.10) / 0.72 * Math.PI * 10.4);
    const stride = Math.sin(t * 1.55) + 0.042 * Math.sin(t * 3.1);
    return { x: fromX + face * (0.0012 + (u - 0.10) / 0.72 * 0.028 + dash * 0.00085 + stride * 0.00012), lift: 0.0024 + Math.abs(dash) * 0.00085 + Math.abs(stride) * 0.00040, rot: (0.18 + dash * 0.12 + stride * 0.05) * face, anim: "walk" as TrickAnim };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * 0.028 * (1 - s), lift: 0.0010 * (1 - s), rot: 0.020 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function burrowplungePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.burrowplunge));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.00035, lift: s * 0.0010, rot: s * 0.16 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.48) {
    const s = smoothstep((u - 0.12) / 0.36);
    return { x: fromX + face * (0.00035 + s * 0.00055), lift: 0.0010 - s * 0.0048, rot: (0.16 - s * 0.42) * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const dig = Math.sin((u - 0.48) / 0.30 * Math.PI * 4.2);
    return { x: fromX + face * (0.00090 + dig * 0.00025), lift: -0.0038 + Math.abs(dig) * 0.00045, rot: (-0.26 + dig * 0.10) * face, anim: "sit" as TrickAnim };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * 0.00090 * (1 - s), lift: -0.0038 * (1 - s), rot: -0.026 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stalkeyescanPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stalkeyescan));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.00018, lift: s * 0.0036, rot: s * -0.22 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.84) {
    const scan = Math.sin((u - 0.14) / 0.70 * Math.PI * 3.6);
    const stalk = Math.sin(t * 0.62) + 0.022 * Math.sin(t * 1.24);
    return { x: fromX + face * (0.00018 + scan * 0.00030 + stalk * 0.00005), lift: 0.0036 + Math.abs(scan) * 0.00055 + Math.abs(stalk) * 0.00025, rot: (-0.22 + scan * 0.38 + stalk * 0.08) * face, anim: "talk" as TrickAnim };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 0.00018 * (1 - s), lift: 0.0016 * (1 - s), rot: -0.020 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function freezecamoPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.freezecamo));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 0.00040, rot: s * -0.06 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const still = Math.sin(t * 0.0011) * 0.00008;
    const breath = Math.sin(t * 0.0020) * 0.00012;
    return { x: fromX + face * still, lift: 0.00040 + breath, rot: (-0.06 + still * 40) * face, anim: "sit" as TrickAnim };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 0.00040 * (1 - s), rot: -0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: GhostCrabTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "sprintdash" && trick.kind !== "burrowplunge" && trick.kind !== "stalkeyescan" && trick.kind !== "freezecamo") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "ocypodehush") {
      if (next.t < OCYPODEHUSH_HOLD) {
        const pose = ocypodehushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < OCYPODEHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - OCYPODEHUSH_HOLD);
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
    if (next.kind === "sprintdash") {
      const pose = sprintdashPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "burrowplunge") {
      const pose = burrowplungePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stalkeyescan") {
      const pose = stalkeyescanPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = freezecamoPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }