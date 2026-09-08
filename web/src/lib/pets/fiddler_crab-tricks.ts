/** Wave ground tricks while idle. House neighborly Ocypodidae / Uca pugilator Atlantic fiddler crab life — clawwave / burrowdig / sandfeed / lateralsidestep / pugilator personality (clawwave major-claw wave display without naming wave or claw or display or brandish or signal or raise alone as wait, burrowdig burrow dig scrape without naming burrow or dig or scrape or scoop or tunnel or plug alone as wait, sandfeed sand-scoop mouth feed without naming sand or scoop or feed or sift or chew or eat alone as wait, lateralsidestep lateral sidestep scuttle without naming sidestep or scuttle or run or dash or crawl or side alone as wait, long pugilator Uca pugilator hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or sideswim or gnathopod or detritusclutch or pairguard or gammarus or densscud or inkscud or densgnath or densclaw or sinusoid or dauerrest or pharynxpump or thrashturn or elegans or densthread or inkthread or densdauer or ciliaryglide or lightflee or preywrap or regensplit or dugesia or denshalf or inkhalf or denscilia or cryptotun or clawamble or mosssip or waterbearroll or eutardigrada or denstun or inktun or swap or antenna or scuttle or withdraw or vacancy or scrap or fit or lease or carapace or bookgill or telson or furrow or fossil or blue or page or tray or chelate or caridoid or chimney or antennule or astacid or clasp or marl or chitin or clawwave or burrowdig or sandfeed or lateralsidestep or pugilator; window-play and Call Wave leave fiddler_crab alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun/Half/Thread/Scud own their tricks; guest slug Wave / key fiddler_crab — accept "fiddler_crab" and "wave" (roster slug wave; campaign Wave); do NOT confuse with Scud the Amphipod (key amphipod / slug scud) or densscud thank-you; do NOT confuse with Pale the Ghost Crab (key ghost_crab / slug pale) — do not start Pale in parallel; do NOT confuse with hermit_crab scrap/swap/scuttle or horseshoe_crab carapace/telson or crayfish chelate/caridoid or Tun densclaw thank-you; do NOT name a trick fiddler_crab or wave or ghost_crab or pale or amphipod or scud or hermit_crab or horseshoe_crab or densclaw. Thank-yous denswave / inkwave / densmajor. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop fiddler_crab-tricks.js. Window-play unchanged. True Atlantic fiddler crab desk life — major-claw wave display, burrow dig scrape, sand-scoop mouth feed, and lateral sidestep scuttle; not Gammarus amphipod/Amphipoda clones (sideswim/gnathopod/detritusclutch/pairguard), not hermit crab Paguroidea clones (swap/scuttle/withdraw), not horseshoe Limulus clones (carapace/telson/furrow), not Astacus crayfish clones (chelate/caridoid) — true Uca pugilator fiddler life distinct from amphipod side-swim and hermit shell-swap. Next house-order guest after Wave still lacking tricks owns the next seat (Pale / ghost_crab). No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "fiddler_crab";
export const TRICKS = ["clawwave", "burrowdig", "sandfeed", "lateralsidestep", "pugilator"] as const;
export const HAPPY = ["denswave", "inkwave", "densmajor"] as const;
export type FiddlerCrabTrickKind = (typeof TRICKS)[number];
export type FiddlerCrabHappyKind = (typeof HAPPY)[number];
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

export type FiddlerCrabTrick = {
  kind: FiddlerCrabTrickKind;
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

export type FiddlerCrabHappy = {
  kind: FiddlerCrabHappyKind;
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

export const HAPPY_DUR = { denswave: 2.62, inkwave: 2.78, densmajor: 2.52 } as const;
export const PUGILATOR_HOLD = 24.60;
export const RELEASE_S = 2.18;
export const DUR = { pugilator: PUGILATOR_HOLD + RELEASE_S, clawwave: 4.84, burrowdig: 4.62, sandfeed: 4.52, lateralsidestep: 4.72 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FiddlerCrabTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "pugilator") return 166 + roll * 14;
  if (kind === "clawwave") return 27.0 + roll * 4.6;
  if (kind === "burrowdig") return 26.2 + roll * 4.3;
  if (kind === "lateralsidestep") return 26.6 + roll * 4.4;
  if (kind === "sandfeed") return 25.6 + roll * 4.1;
  return justFinished ? 19.2 + roll * 2.9 : 14.4 + roll * 2.5;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: FiddlerCrabTrickKind | string | null) {
  if (musicOn) return "pugilator";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "pugilator") {
    if (roll < 0.26) return "clawwave";
    if (roll < 0.5) return "burrowdig";
    if (roll < 0.74) return "lateralsidestep";
    return "sandfeed";
  }
  if (lastKind === "clawwave") {
    if (roll < 0.26) return "pugilator";
    if (roll < 0.5) return "burrowdig";
    if (roll < 0.74) return "lateralsidestep";
    return "sandfeed";
  }
  if (lastKind === "burrowdig") {
    if (roll < 0.22) return "pugilator";
    if (roll < 0.44) return "clawwave";
    if (roll < 0.68) return "lateralsidestep";
    return "sandfeed";
  }
  if (roll < 0.2) return "pugilator";
  if (roll < 0.4) return "clawwave";
  if (roll < 0.6) return "burrowdig";
  if (roll < 0.8) return "lateralsidestep";
  return "sandfeed";
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
    return key === TRICK_KEY || key === "wave";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: FiddlerCrabHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: FiddlerCrabHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: FiddlerCrabHappyKind | string, x: number, facing: 1 | -1): FiddlerCrabHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denswave";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denswave" ? "sit" : name === "inkwave" ? "play" : "play") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denswavePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswave));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0036, rot: s * -0.30, anim: "sit" };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.4);
      return { lift: 0.0036 + bob * 0.0016, rot: -0.30 + bob * 0.18, anim: "sit" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0036 * (1 - s), rot: -0.30 * (1 - s), anim: "idle" };
}
export function inkwavePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwave));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0042, rot: s * 0.36, anim: "talk" };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.8);
      return { lift: 0.0042 + Math.abs(pulse) * 0.0016, rot: 0.36 + pulse * 0.26, anim: "talk" };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0042 * (1 - s), rot: 0.36 * (1 - s), anim: "idle" };
}
export function densmajorPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densmajor));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0032, rot: s * -0.24, anim: "play" };
    }
    if (u < 0.78) {
      const wave = Math.sin((u - 0.12) / 0.66 * Math.PI * 3.2);
      return { lift: 0.0032 + Math.abs(wave) * 0.0014, rot: -0.24 + wave * 0.20, anim: "play" };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0032 * (1 - s), rot: -0.24 * (1 - s), anim: "idle" };
}
export function stepHappy(happy: FiddlerCrabHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denswave") {
      const pose = denswavePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkwave") {
      const pose = inkwavePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densmajorPose(next.t);
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
export function beginTrick(kind: FiddlerCrabTrickKind | string, x: number, facing: 1 | -1): FiddlerCrabTrick {
  const anim: TrickAnim =
    kind === "pugilator"
      ? "sit"
      : kind === "clawwave"
        ? "play"
        : kind === "sandfeed"
          ? "play"
          : kind === "burrowdig"
            ? "sit"
            : kind === "lateralsidestep"
              ? "sit"
              : "sit";
  return {
    kind: (TRICKS as readonly string[]).includes(kind) ? (kind as FiddlerCrabTrickKind) : "clawwave",
    phase: kind === "pugilator" ? "hold" : "go",
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
export function pugilatorPose(t: number) {
    const breath = Math.sin(t * 0.0028) + 0.0014 * Math.sin(t * 0.0086);
    const hush = Math.abs(Math.sin(t * 0.0017));
    return { lift: 0.00018 + hush * 0.00032, rot: -0.016 + breath * 0.010 };
}
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00020 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.018 * (1 - u) };
  }
export function clawwavePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.clawwave));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00010, lift: s * 0.0024, rot: s * -0.42 * face, anim: "play" };
    }
    if (u < 0.88) {
      const wave = Math.sin((u - 0.12) / 0.76 * Math.PI * 5.6);
      const brandish = Math.sin(t * 0.92) + 0.030 * Math.sin(t * 1.84);
      return { x: fromX + face * (0.00010 + wave * 0.00018 + brandish * 0.00004), lift: 0.0024 + Math.abs(wave) * 0.0018 + Math.abs(brandish) * 0.00055, rot: (-0.42 + wave * 0.38 + brandish * 0.08) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00010 * (1 - s), lift: 0.0010 * (1 - s), rot: -0.016 * (1 - s) * face, anim: "idle" };
}
export function burrowdigPose(t: number, fromX: number, facing: 1 | -1)  {
    const u = Math.max(0, Math.min(1, t / DUR.burrowdig));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00028, lift: s * 0.00085, rot: s * 0.16 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const dig = Math.sin((u - 0.14) / 0.70 * Math.PI * 4.2);
      const scoop = Math.sin(t * 0.70) + 0.028 * Math.sin(t * 1.40);
      return { x: fromX + face * (0.00028 + dig * 0.00045 + scoop * 0.00008), lift: 0.00085 + Math.abs(dig) * 0.0014 + Math.abs(scoop) * 0.00035, rot: (0.16 + dig * 0.18 + scoop * 0.06) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00028 * (1 - s), lift: 0.00085 * (1 - s) + s * 0.00020, rot: 0.012 * (1 - s) * face, anim: "idle" };
}
export function lateralsidestepPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.lateralsidestep));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00040, lift: s * 0.0012, rot: s * 0.14 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const scuttle = Math.sin((u - 0.10) / 0.76 * Math.PI * 8.2);
      const leg = Math.sin(t * 1.24) + 0.036 * Math.sin(t * 2.48);
      return { x: fromX + face * (0.00040 + (u - 0.10) / 0.76 * 0.0115 + scuttle * 0.00055 + leg * 0.00008), lift: 0.0012 + Math.abs(scuttle) * 0.00055 + Math.abs(leg) * 0.00028, rot: (0.14 + scuttle * 0.10 + leg * 0.04) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0115 * (1 - s), lift: 0.0006 * (1 - s), rot: 0.012 * (1 - s) * face, anim: "idle" };
}
export function sandfeedPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.sandfeed));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00020, lift: s * 0.0018, rot: s * 0.28 * face, anim: "play" };
    }
    if (u < 0.84) {
      const sift = Math.sin((u - 0.12) / 0.72 * Math.PI * 5.0);
      const chew = Math.sin(t * 0.88) + 0.026 * Math.sin(t * 1.76);
      return { x: fromX + face * (0.00020 + sift * 0.00035 + chew * 0.00006), lift: 0.0018 + Math.abs(sift) * 0.0012 + Math.abs(chew) * 0.00045, rot: (0.28 + sift * 0.22 + chew * 0.08) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00020 * (1 - s), lift: 0.0010 * (1 - s) + s * 0.00020, rot: 0.014 * (1 - s) * face, anim: "idle" };
}
export function stepTrick(trick: FiddlerCrabTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "clawwave" && trick.kind !== "burrowdig" && trick.kind !== "lateralsidestep" && trick.kind !== "sandfeed") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "pugilator") {
      if (next.t < PUGILATOR_HOLD) {
        const pose = pugilatorPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PUGILATOR_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PUGILATOR_HOLD);
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
    if (next.kind === "clawwave") {
      const pose = clawwavePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "burrowdig") {
      const pose = burrowdigPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lateralsidestep") {
      const pose = lateralsidestepPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sandfeedPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }