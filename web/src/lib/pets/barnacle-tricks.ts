/** Cement ground tricks while idle. House neighborly Balanidae / Balanus glandula Acorn Barnacle desk life — cirrikick / opershut / cementhold / tidereopen / balanushush personality (cirrikick cirri kick-feed sweep without naming cirri or kick or feed or sweep or filter or cast alone as wait, opershut opercular plate shut without naming opercular or plate or shut or snap or valve or seal alone as wait, cementhold cement-hold settle without naming cement or hold or settle or glue or base or sessile alone as wait, tidereopen tide-wait hush reopen without naming tide or wait or reopen or open or flood or gap alone as wait, long balanushush Balanus acorn-barnacle hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or clampseal or radialgraze or circumhome or shelltilt or patellahush or denscone or inkcone or denspatella or sprintdash or stalkeyescan or burrowplunge or freezecamo or ocypodehush or denspale or inkpale or densghost or clawwave or burrowdig or sandfeed or lateralsidestep or pugilator or denswave or inkwave or densmajor or sideswim or gnathopod or detritusclutch or pairguard or gammarus or densscud or inkscud or densgnath or densclaw or radula or pedal or pneumostome or ommatophore or lymnaeid or stagnalis or physa or radix or lamella or imbricate or lasso or margin or pleurotus or adductor or protractor or inhalant or ctenidium or unionid or spiral or siphuncle or nacre or pinhole or fringe or chamber or pearl or quiet or cirrikick or opershut or cementhold or tidereopen or balanushush; window-play and Call Cement leave barnacle alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun/Half/Thread/Scud/Wave/Pale/Cone own their tricks; guest slug Cement / key barnacle — accept "barnacle" and "cement" (roster slug cement; campaign Cement); do NOT accept bare "cement" as a trick id; do NOT confuse with Cone the Limpet (key limpet / slug cone) or denscone thank-you; do NOT confuse with Pale the Ghost Crab or Wave the Fiddler Crab or Scud the Amphipod; do NOT confuse with Whorl the Pond Snail radula/pneumostome gape; do NOT confuse with Frill the Oyster or Hinge the Mussel; do NOT confuse with Mail the Chiton (key chiton / slug mail) — do not start Mail in parallel; do NOT name a trick barnacle or cement or limpet or cone or denscone or denspatella or chiton or mail or ghost_crab or pale or denspale or densclaw or chamber. Thank-yous denscement / inkcement / densbalanus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop barnacle-tricks.js. Window-play unchanged. True acorn barnacle desk life — cirri kick-feed sweep, opercular plate shut, cement-hold settle, and tide-wait hush reopen; not Patella limpet clones (clampseal/radialgraze/circumhome/shelltilt), not Ocypode ghost-crab clones, not Uca fiddler clones, not Gammarus amphipod clones, not Lymnaea pond-snail gape, not oyster/mussel bivalve clones, not chiton Mail (next guest) — true Balanus acorn barnacle life. Next house-order guest after Cement still lacking tricks owns the next seat (Mail / chiton). No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "barnacle";
export const TRICKS = ["cirrikick", "opershut", "cementhold", "tidereopen", "balanushush"] as const;
export const HAPPY = ["denscement", "inkcement", "densbalanus"] as const;
export type BarnacleTrickKind = (typeof TRICKS)[number];
export type BarnacleHappyKind = (typeof HAPPY)[number];
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

export type BarnacleTrick = {
  kind: BarnacleTrickKind;
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

export type BarnacleHappy = {
  kind: BarnacleHappyKind;
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

export const HAPPY_DUR = { denscement: 2.70, inkcement: 2.86, densbalanus: 2.60 } as const;
export const BALANUSHUSH_HOLD = 25.40;
export const RELEASE_S = 2.30;
export const DUR = { balanushush: BALANUSHUSH_HOLD + RELEASE_S, cirrikick: 4.96, opershut: 4.54, cementhold: 4.78, tidereopen: 5.02 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BarnacleTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "balanushush") return 172 + roll * 15;
  if (kind === "cirrikick") return 26.8 + roll * 4.5;
  if (kind === "opershut") return 25.6 + roll * 4.1;
  if (kind === "cementhold") return 27.2 + roll * 4.7;
  if (kind === "tidereopen") return 27.8 + roll * 4.9;
  return justFinished ? 19.8 + roll * 3.0 : 15.0 + roll * 2.6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BarnacleTrickKind | string) {
  if (musicOn) return "balanushush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "balanushush") {
    if (roll < 0.26) return "cirrikick";
    if (roll < 0.5) return "opershut";
    if (roll < 0.74) return "cementhold";
    return "tidereopen";
  }
  if (lastKind === "cirrikick") {
    if (roll < 0.26) return "balanushush";
    if (roll < 0.5) return "opershut";
    if (roll < 0.74) return "cementhold";
    return "tidereopen";
  }
  if (lastKind === "opershut") {
    if (roll < 0.22) return "balanushush";
    if (roll < 0.44) return "cirrikick";
    if (roll < 0.68) return "cementhold";
    return "tidereopen";
  }
  if (roll < 0.2) return "balanushush";
  if (roll < 0.4) return "cirrikick";
  if (roll < 0.6) return "opershut";
  if (roll < 0.8) return "cementhold";
  return "tidereopen";
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
    return key === TRICK_KEY || key === "cement";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: BarnacleHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: BarnacleHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: BarnacleHappyKind | string, x: number, facing: 1 | -1): BarnacleHappy {
    const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as BarnacleHappyKind) : "denscement";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denscement" ? "sit" : name === "inkcement" ? "play" : "play") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denscementPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscement));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * -0.0031, rot: s * -0.14, anim: "sit" };
    }
    if (u < 0.74) {
      const bob = Math.sin((u - 0.15) / 0.59 * Math.PI * 2.1);
      return { lift: -0.0031 + bob * 0.0008, rot: -0.14 + bob * 0.09, anim: "sit" };
    }
    const s = (u - 0.74) / 0.26;
    return { lift: -0.0031 * (1 - s), rot: -0.14 * (1 - s), anim: "idle" };
  }
export function inkcementPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkcement));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0036, rot: s * 0.34, anim: "talk" };
    }
    if (u < 0.72) {
      const pulse = Math.sin((u - 0.14) / 0.58 * Math.PI * 3.1);
      return { lift: 0.0036 + Math.abs(pulse) * 0.0014, rot: 0.34 + pulse * 0.22, anim: "talk" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0036 * (1 - s), rot: 0.34 * (1 - s), anim: "idle" };
  }
export function densbalanusPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbalanus));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0024, rot: s * -0.20, anim: "play" };
    }
    if (u < 0.80) {
      const wave = Math.sin((u - 0.13) / 0.67 * Math.PI * 2.5);
      return { lift: 0.0024 + Math.abs(wave) * 0.0011, rot: -0.20 + wave * 0.16, anim: "play" };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.0024 * (1 - s), rot: -0.20 * (1 - s), anim: "idle" };
  }
export function stepHappy(happy: BarnacleHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denscement") {
      const pose = denscementPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkcement") {
      const pose = inkcementPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densbalanusPose(next.t);
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
export function beginTrick(kind: BarnacleTrickKind | string, x: number, facing: 1 | -1): BarnacleTrick {
  const anim: TrickAnim =
    kind === "balanushush"
      ? "sit"
      : kind === "cirrikick"
        ? "play"
        : kind === "opershut"
          ? "sit"
          : kind === "cementhold"
            ? "sit"
            : kind === "tidereopen"
              ? "talk"
              : "sit";
  return {
    kind: (TRICKS as readonly string[]).includes(kind) ? (kind as BarnacleTrickKind) : "cirrikick",
    phase: kind === "balanushush" ? "hold" : "go",
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
export function balanushushPose(t: number): { lift: number; rot: number } {
    const breath = Math.sin(t * 0.0020) + 0.0009 * Math.sin(t * 0.0068);
    const hush = Math.abs(Math.sin(t * 0.0011));
    return { lift: -0.00028 + hush * 0.00016, rot: -0.008 + breath * 0.006 };
  }
export function releasePose(t: number): { lift: number; rot: number } {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00028 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.010 * (1 - u) };
  }
export function cirrikickPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.cirrikick));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00018, lift: s * 0.0038, rot: s * 0.48 * face, anim: "play" };
    }
    if (u < 0.88) {
      const sweep = Math.sin((u - 0.10) / 0.78 * Math.PI * 3.6);
      const kick = Math.sin(t * 1.85) + 0.045 * Math.sin(t * 3.7);
      return {
        x: fromX + face * (0.00018 + sweep * 0.0024 + kick * 0.00022),
        lift: 0.0038 + Math.abs(sweep) * 0.00070 + Math.abs(kick) * 0.00045,
        rot: (0.48 + sweep * 0.36 + kick * 0.14) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00018 * (1 - s), lift: 0.0014 * (1 - s), rot: 0.048 * (1 - s) * face, anim: "idle" };
  }
export function opershutPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.opershut));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * -0.0058, rot: s * 0.08 * face, anim: "sit" };
    }
    if (u < 0.80) {
      const shut = Math.sin((u - 0.16) / 0.64 * Math.PI * 1.6);
      const plate = Math.sin(t * 0.42) * 0.00012;
      return { x: fromX + face * shut * 0.00005, lift: -0.0058 + plate + Math.abs(shut) * 0.00022, rot: (0.08 + shut * 0.04) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.80) / 0.20);
    return { x: fromX, lift: -0.0058 * (1 - s), rot: 0.008 * (1 - s) * face, anim: "idle" };
  }
export function cementholdPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.cementhold));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * -0.0064, rot: s * -0.06 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const settle = Math.sin((u - 0.18) / 0.68 * Math.PI * 1.8);
      const glue = Math.sin(t * 0.22) * 0.00010;
      return { x: fromX + face * settle * 0.00004, lift: -0.0064 + glue + Math.abs(settle) * 0.00018, rot: (-0.06 + settle * 0.03) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: -0.0064 * (1 - s), rot: -0.006 * (1 - s) * face, anim: "idle" };
  }
export function tidereopenPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.tidereopen));
    const face = facing == null ? 1 : facing;
    if (u < 0.20) {
      const s = smoothstep(u / 0.20);
      return { x: fromX, lift: s * -0.0042, rot: s * -0.10 * face, anim: "sit" };
    }
    if (u < 0.52) {
      const wait = Math.sin((u - 0.20) / 0.32 * Math.PI);
      return { x: fromX, lift: -0.0042 + wait * 0.00020, rot: (-0.10 + wait * 0.02) * face, anim: "sit" };
    }
    if (u < 0.90) {
      const open = smoothstep((u - 0.52) / 0.38);
      const peek = Math.sin(t * 1.05) * 0.00035;
      return {
        x: fromX + face * open * 0.00030,
        lift: -0.0042 + open * 0.0056 + peek,
        rot: (-0.10 + open * 0.52) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00030 * (1 - s), lift: 0.0014 * (1 - s), rot: 0.42 * (1 - s) * face, anim: "idle" };
  }
export function stepTrick(trick: BarnacleTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "cirrikick" && trick.kind !== "cementhold" && trick.kind !== "opershut" && trick.kind !== "tidereopen") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "balanushush") {
      if (next.t < BALANUSHUSH_HOLD) {
        const pose = balanushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BALANUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BALANUSHUSH_HOLD);
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
    if (next.kind === "cirrikick") {
      const pose = cirrikickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cementhold") {
      const pose = cementholdPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "opershut") {
      const pose = opershutPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tidereopenPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }
