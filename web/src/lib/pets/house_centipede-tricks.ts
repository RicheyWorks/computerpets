/** Haste ground tricks while idle. House neighborly Chilopoda / Scutigera coleoptrata House Centipede nocturnal life — ultrarun / antennaprobe / wallcling / preyseize / coleoptrata personality (ultrarun extreme speed scuttle dash without naming ultra or run or dash or burst or speed or scuttle or race or sprint or blur or zoom or rush or hurry, antennaprobe antenna feeler sweep probe without naming antenna or probe or feeler or sweep or sense or touch or sniff or whisker or tap or wave, wallcling wall ceiling grip climb without naming wall or cling or ceiling or grip or climb or vertical or upside or hang or stick or glue, preyseize prey seize venom forcipule pinch without naming prey or seize or venom or pinch or forcipule or fang or bite or strike or hunt or kill or grab, long coleoptrata Scutigera coleoptrata Chilopoda house centipede hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or oralclamp or keratinrasp or undulglide or stonenest or marinus or densround or inkround or densdisk or densdisc or serpentine or mudburrow or mucusslip or wormhunt; window-play STRIKE and Call Haste leave house_centipede alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver own their tricks; guest slug Haste / key house_centipede — accept "house_centipede" and "haste" (roster slug haste; campaign Haste); do NOT confuse with Silver the American Eel (key american_eel / slug silver) or denssilver thank-you; do NOT name a trick house_centipede or haste or american_eel or silver or lamprey or round or millipede or link). Thank-yous denshaste / inkhaste / densantenna. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop house_centipede-tricks.js. Window-play STRIKE unchanged. True House Centipede Scutigera coleoptrata Chilopoda desk life — nocturnal many-legged wall-ceiling hunter with long antennae and forcipules that ultraruns across floors; not Anguilla american eel clones (glasscrawl/mucuscoat/nightmigrate/gravelhide), not Petromyzon sea lamprey, not millipede/Link. Next house-order guest after Haste still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "house_centipede";
export const TRICKS = ["ultrarun", "antennaprobe", "wallcling", "preyseize", "coleoptrata"] as const;
export const HAPPY = ["denshaste", "inkhaste", "densantenna"] as const;
export type HouseCentipedeTrickKind = (typeof TRICKS)[number];
export type HouseCentipedeHappyKind = (typeof HAPPY)[number];
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

export type HouseCentipedeTrick = {
  kind: HouseCentipedeTrickKind;
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

export type HouseCentipedeHappy = {
  kind: HouseCentipedeHappyKind;
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

export const HAPPY_DUR = { denshaste: 2.28, inkhaste: 2.70, densantenna: 2.40 } as const;
export const COLEOPTRATA_HOLD = 21.80;
export const RELEASE_S = 1.86;
export const DUR = { coleoptrata: COLEOPTRATA_HOLD + RELEASE_S, ultrarun: 3.42, antennaprobe: 3.78, wallcling: 3.95, preyseize: 3.48 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HouseCentipedeTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "coleoptrata") return 138 + roll * 16;
  if (kind === "ultrarun") return 18.4 + roll * 3.2;
  if (kind === "antennaprobe") return 23.8 + roll * 4.4;
  if (kind === "wallcling") return 26.4 + roll * 3.8;
  if (kind === "preyseize") return 20.6 + roll * 4.6;
  return justFinished ? 17.8 + roll * 3.0 : 13.2 + roll * 2.4;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HouseCentipedeTrickKind | string | null) {
    if (musicOn) return "coleoptrata";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "coleoptrata") {
      if (roll < 0.26) return "ultrarun";
      if (roll < 0.5) return "antennaprobe";
      if (roll < 0.74) return "wallcling";
      return "preyseize";
    }
    if (lastKind === "ultrarun") {
      if (roll < 0.26) return "coleoptrata";
      if (roll < 0.5) return "antennaprobe";
      if (roll < 0.74) return "wallcling";
      return "preyseize";
    }
    if (lastKind === "antennaprobe") {
      if (roll < 0.22) return "coleoptrata";
      if (roll < 0.44) return "ultrarun";
      if (roll < 0.68) return "wallcling";
      return "preyseize";
    }
    if (roll < 0.2) return "coleoptrata";
    if (roll < 0.4) return "ultrarun";
    if (roll < 0.6) return "antennaprobe";
    if (roll < 0.8) return "wallcling";
    return "preyseize";
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
    return key === TRICK_KEY || key === "haste";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: HouseCentipedeHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: HouseCentipedeHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: HouseCentipedeHappyKind | string, x: number, facing: 1 | -1): HouseCentipedeHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denshaste";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denshaste" ? "sit" : name === "inkhaste" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denshastePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshaste));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0072, rot: s * -0.78, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.88) {
      const hold = Math.sin(t * 1.12) + 0.048 * Math.sin(t * 2.24);
      return { lift: 0.0072 + Math.abs(hold) * 0.0034, rot: -0.78 + hold * 0.38, dx: hold * 0.00018, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.88) / 0.12;
    return { lift: 0.0012 * (1 - s), rot: -0.06 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkhastePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhaste));
    if (u < 0.10) {
      const s = u / 0.10;
      return { lift: s * 0.055, rot: s * 1.95, dx: s * 0.00115, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const roll = Math.sin(t * 2.28) + 0.095 * Math.sin(t * 4.56);
      return { lift: 0.055 + Math.abs(roll) * 0.0115, rot: 1.95 + roll * 1.42, dx: roll * 0.00125, anim: "play" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0030 * (1 - s), rot: 0.12 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function densantennaPose(t: number) {
    return { lift: 0.0022 + Math.abs(Math.sin(t * 0.052)) * 0.0044, rot: Math.sin(t * 0.052) * -0.48, dx: Math.sin(t * 0.036) * 0.00024, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: HouseCentipedeHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denshaste") {
      const pose = denshastePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkhaste") {
      const pose = inkhastePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densantennaPose(next.t);
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
export function beginTrick(kind: HouseCentipedeTrickKind, x: number, facing: 1 | -1): HouseCentipedeTrick {
    const anim: TrickAnim =
      kind === "coleoptrata"
        ? "sit"
        : kind === "ultrarun"
          ? "play"
          : kind === "antennaprobe"
            ? "talk"
            : kind === "wallcling"
              ? "sit"
              : kind === "preyseize"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "coleoptrata" ? "hold" : "go",
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
export function coleoptrataPose(t: number) {
    const breath = Math.sin(t * 0.0092) + 0.0062 * Math.sin(t * 0.031);
    const hang = Math.abs(Math.sin(t * 0.0086));
    return { lift: 0.0014 + hang * 0.0024, rot: -0.028 + breath * 0.12 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0011 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.026 * (1 - u) };
  }
export function ultrarunPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.ultrarun));
    const face = facing == null ? 1 : facing;
    if (u < 0.08) {
      const s = smoothstep(u / 0.08);
      return { x: fromX + face * s * 0.0012, lift: s * 0.018, rot: s * -0.55 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.90) {
      const scuttle = Math.sin((u - 0.08) / 0.82 * Math.PI * 9.2);
      const blur = Math.sin(t * 3.40) + 0.14 * Math.sin(t * 6.80);
      return { x: fromX + face * (0.0012 + (u - 0.08) / 0.82 * 0.0185 + scuttle * 0.0036 + blur * 0.00035), lift: 0.016 + Math.abs(scuttle) * 0.0105 + Math.abs(blur) * 0.0032, rot: (-0.55 + scuttle * 1.85 + blur * 0.48) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.0197 * (1 - s), lift: 0.0020 * (1 - s), rot: -0.07 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function antennaprobePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.antennaprobe));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0004, lift: s * 0.014, rot: s * -1.05 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.42) {
      const rise = smoothstep((u - 0.12) / 0.30);
      return { x: fromX + face * (0.0004 + rise * 0.0010), lift: 0.014 + rise * 0.005, rot: (-1.05 + rise * 0.42) * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.88) {
      const sweep = Math.sin((u - 0.42) / 0.46 * Math.PI * 4.2);
      const feel = Math.sin(t * 2.15) + 0.11 * Math.sin(t * 4.30);
      return { x: fromX + face * (0.0014 + sweep * 0.0018 + feel * 0.00022), lift: 0.018 + Math.abs(sweep) * 0.0062 + Math.abs(feel) * 0.0026, rot: (-0.63 + sweep * 1.35 + feel * 0.52) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0014 * (1 - s), lift: 0.0016 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function wallclingPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.wallcling));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0006, lift: s * 0.028, rot: s * -1.35 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.88) {
      const cling = Math.sin((u - 0.14) / 0.74 * Math.PI * 3.2);
      const grip = Math.sin(t * 1.28) + 0.08 * Math.sin(t * 2.56);
      return { x: fromX + face * (0.0006 + cling * 0.0012 + grip * 0.00016), lift: 0.026 + Math.abs(cling) * 0.0085 + Math.abs(grip) * 0.0022, rot: (-1.35 + cling * 0.95 + grip * 0.32) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.0022 * (1 - s), rot: -0.09 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function preyseizePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.preyseize));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * -0.0006, lift: s * 0.012, rot: s * 0.95 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.28) {
      const coil = smoothstep((u - 0.10) / 0.18);
      return { x: fromX + face * (-0.0006 + coil * 0.0028), lift: 0.012 + coil * 0.008, rot: (0.95 - coil * 1.55) * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const pinch = Math.sin((u - 0.28) / 0.58 * Math.PI * 2.6);
      const venom = Math.sin(t * 1.72) + 0.07 * Math.sin(t * 3.44);
      return { x: fromX + face * (0.0022 + pinch * 0.0020 + venom * 0.00018), lift: 0.018 + Math.abs(pinch) * 0.0068 + Math.abs(venom) * 0.0024, rot: (-0.60 + pinch * 1.28 + venom * 0.38) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0022 * (1 - s), lift: 0.0014 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: HouseCentipedeTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "ultrarun" && trick.kind !== "antennaprobe" && trick.kind !== "wallcling" && trick.kind !== "preyseize") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "coleoptrata") {
      if (next.t < COLEOPTRATA_HOLD) {
        const pose = coleoptrataPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < COLEOPTRATA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - COLEOPTRATA_HOLD);
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
    if (next.kind === "ultrarun") {
      const pose = ultrarunPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennaprobe") {
      const pose = antennaprobePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "wallcling") {
      const pose = wallclingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = preyseizePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }