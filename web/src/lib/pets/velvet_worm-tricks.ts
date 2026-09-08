/** Jet ground tricks while idle. House neighborly Onychophora / Peripatus Velvet Worm slime-jet life — slimejet / lobopod / antennawhip / preyharpoon / peripatus personality (slimejet oral-papilla slime jet squirt without naming squirt or spit or spray or shoot or glue or slime or jet or ink or blast or harpoon alone as wait, lobopod lobopod stubby-leg ripple gait without naming walk or crawl or ripple or gait or leg or march or undulate or peristalsis or wriggle or slither, antennawhip antenna whip sense without naming whip or sense or feel or probe or antenna or tap or scan or sniff or search, preyharpoon glue-harpoon prey lunge without naming lunge or strike or prey or hunt or attack or catch or grab or bite or eat or feed, long peripatus Peripatus Onychophora velvet worm hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass; window-play and Call Jet leave velvet_worm alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast own their tricks; guest slug Jet / key velvet_worm — accept "velvet_worm" and "jet" (roster slug jet; campaign Jet); do NOT confuse with Velvet the Tarantula (key tarantula / slug velvet) or densvelvet thank-you; do NOT confuse with Cast the Earthworm (key earthworm / slug cast) or denscast thank-you; do NOT confuse slug jet with Octopus trick jet or Cicada trick cast; do NOT name a trick velvet_worm or jet or earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste or american_eel or silver. Thank-yous densjet / inkjet / denslobo. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop velvet_worm-tricks.js. Window-play unchanged. True Velvet Worm Peripatus Onychophora desk life — slime-jet predator with lobopod legs, antenna whip, and oral-papillae glue harpoon; not Lumbricus earthworm/Annelida clones (peristalse/castheap/surfacerise/soilanchor), not Armadillidium pillbug/Isopoda clones (conglobate/volvation/antennafeel/detritusnip), not Narceus millipede/Diplopoda clones, not Scutigera house centipede/Chilopoda clones — true onychophoran slime-jet distinct from worm peristalsis and pillbug ball-roll. Next house-order guest after Jet still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "velvet_worm";
export const TRICKS = ["slimejet", "lobopod", "antennawhip", "preyharpoon", "peripatus"] as const;
export const HAPPY = ["densjet", "inkjet", "denslobo"] as const;
export type VelvetWormTrickKind = (typeof TRICKS)[number];
export type VelvetWormHappyKind = (typeof HAPPY)[number];
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

export type VelvetWormTrick = {
  kind: VelvetWormTrickKind;
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

export type VelvetWormHappy = {
  kind: VelvetWormHappyKind;
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

export const HAPPY_DUR = { densjet: 2.48, inkjet: 2.72, denslobo: 2.52 } as const;
export const PERIPATUS_HOLD = 24.20;
export const RELEASE_S = 2.08;
export const DUR = { peripatus: PERIPATUS_HOLD + RELEASE_S, slimejet: 4.15, lobopod: 4.55, antennawhip: 4.85, preyharpoon: 4.35 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: VelvetWormTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "peripatus") return 156 + roll * 14;
  if (kind === "slimejet") return 25.4 + roll * 4.1;
  if (kind === "lobopod") return 26.0 + roll * 4.2;
  if (kind === "antennawhip") return 23.8 + roll * 3.7;
  if (kind === "preyharpoon") return 25.2 + roll * 3.9;
  return justFinished ? 18.4 + roll * 2.6 : 13.6 + roll * 2.2;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: VelvetWormTrickKind | string | null) {
    if (musicOn) return "peripatus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "peripatus") {
      if (roll < 0.26) return "slimejet";
      if (roll < 0.5) return "lobopod";
      if (roll < 0.74) return "antennawhip";
      return "preyharpoon";
    }
    if (lastKind === "slimejet") {
      if (roll < 0.26) return "peripatus";
      if (roll < 0.5) return "lobopod";
      if (roll < 0.74) return "antennawhip";
      return "preyharpoon";
    }
    if (lastKind === "lobopod") {
      if (roll < 0.22) return "peripatus";
      if (roll < 0.44) return "slimejet";
      if (roll < 0.68) return "antennawhip";
      return "preyharpoon";
    }
    if (roll < 0.2) return "peripatus";
    if (roll < 0.4) return "slimejet";
    if (roll < 0.6) return "lobopod";
    if (roll < 0.8) return "antennawhip";
    return "preyharpoon";
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
    return key === TRICK_KEY || key === "jet";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: VelvetWormHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: VelvetWormHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: VelvetWormHappyKind | string, x: number, facing: 1 | -1): VelvetWormHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densjet";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "densjet" ? "sit" : name === "inkjet" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function densjetPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densjet));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0048, rot: s * 0.55, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.4);
      return { lift: 0.0048 + bob * 0.0022, rot: 0.55 + bob * 0.38, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0048 * (1 - s), rot: 0.55 * (1 - s), anim: "idle" as TrickAnim };
  }
export function inkjetPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkjet));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0052, rot: s * -0.48, anim: "talk" as TrickAnim };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.8);
      return { lift: 0.0052 + Math.abs(pulse) * 0.0020, rot: -0.48 + pulse * 0.42, anim: "talk" as TrickAnim };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0052 * (1 - s), rot: -0.48 * (1 - s), anim: "idle" as TrickAnim };
  }
export function densloboPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslobo));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0038, rot: s * 0.32, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const ripple = Math.sin((u - 0.12) / 0.66 * Math.PI * 3.2);
      return { lift: 0.0038 + Math.abs(ripple) * 0.0018, rot: 0.32 + ripple * 0.28, anim: "play" as TrickAnim };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0038 * (1 - s), rot: 0.32 * (1 - s), anim: "idle" as TrickAnim };
  }
export function stepHappy(happy: VelvetWormHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densjet") {
      const pose = densjetPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkjet") {
      const pose = inkjetPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densloboPose(next.t);
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
export function beginTrick(kind: VelvetWormTrickKind, x: number, facing: 1 | -1): VelvetWormTrick {
    const anim: TrickAnim =
      kind === "peripatus"
        ? "sit"
        : kind === "slimejet"
          ? "talk"
          : kind === "lobopod"
            ? "play"
            : kind === "antennawhip"
              ? "sit"
              : kind === "preyharpoon"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "peripatus" ? "hold" : "go",
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
export function peripatusPose(t: number) {
    const breath = Math.sin(t * 0.0062) + 0.0024 * Math.sin(t * 0.0155);
    const hush = Math.abs(Math.sin(t * 0.0036));
    return { lift: 0.00038 + hush * 0.00072, rot: -0.009 + breath * 0.032 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00038 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.009 * (1 - u) };
  }
export function slimejetPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.slimejet));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00042, lift: s * 0.0036, rot: s * 0.22 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.34) {
      const charge = smoothstep((u - 0.12) / 0.22);
      return { x: fromX + face * (0.00042 + charge * 0.00055), lift: 0.0036 + charge * 0.0028, rot: (0.22 + charge * -0.18) * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.58) {
      const jet = Math.sin((u - 0.34) / 0.24 * Math.PI);
      const squirt = Math.sin(t * 1.45) + 0.06 * Math.sin(t * 2.9);
      return { x: fromX + face * (0.00097 + jet * 0.0038 + squirt * 0.00018), lift: 0.0058 + Math.abs(jet) * 0.0022 + Math.abs(squirt) * 0.0010, rot: (0.04 + jet * 0.38 + squirt * 0.14) * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.86) {
      const settle = Math.sin((u - 0.58) / 0.28 * Math.PI * 1.6);
      const drip = Math.sin(t * 0.92) + 0.04 * Math.sin(t * 1.84);
      return { x: fromX + face * (0.0024 + settle * 0.00085 + drip * 0.00008), lift: 0.0032 + Math.abs(settle) * 0.0016 + Math.abs(drip) * 0.0007, rot: (0.12 + settle * 0.22 + drip * 0.08) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0024 * (1 - s), lift: 0.0006 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function lobopodPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.lobopod));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00048, lift: s * 0.0022, rot: s * 0.14 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const ripple = Math.sin((u - 0.10) / 0.78 * Math.PI * 6.4);
      const stub = Math.sin(t * 1.22) + 0.05 * Math.sin(t * 2.44);
      return { x: fromX + face * (0.00048 + (u - 0.10) / 0.78 * 0.0072 + ripple * 0.00115 + stub * 0.00011), lift: 0.0020 + Math.abs(ripple) * 0.0024 + Math.abs(stub) * 0.0010, rot: (0.14 + ripple * 0.36 + stub * 0.11) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0072 * (1 - s), lift: 0.00055 * (1 - s), rot: 0.022 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function antennawhipPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.antennawhip));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0030, rot: s * -0.26 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const whip = Math.sin((u - 0.12) / 0.72 * Math.PI * 4.2);
      const sense = Math.sin(t * 1.08) + 0.05 * Math.sin(t * 2.16);
      return { x: fromX + face * (0.00028 + whip * 0.00088 + sense * 0.00009), lift: 0.0030 + Math.abs(whip) * 0.0028 + Math.abs(sense) * 0.0012, rot: (-0.26 + whip * 0.52 + sense * 0.14) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00028 * (1 - s), lift: 0.0030 * (1 - s) + s * 0.00045, rot: -0.02 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function preyharpoonPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.preyharpoon));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00032, lift: s * 0.0024, rot: s * 0.16 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.28) {
      const brace = smoothstep((u - 0.10) / 0.18);
      return { x: fromX + face * (0.00032 + brace * 0.00045), lift: 0.0024 + brace * 0.0032, rot: (0.16 + brace * -0.42) * face, anim: "play" as TrickAnim };
    }
    if (u < 0.48) {
      const lunge = smoothstep((u - 0.28) / 0.20);
      return { x: fromX + face * (0.00077 + lunge * 0.0046), lift: 0.0056 + lunge * 0.0018, rot: (-0.26 + lunge * 0.48) * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.86) {
      const hold = Math.sin((u - 0.48) / 0.38 * Math.PI * 1.8);
      const glue = Math.sin(t * 0.95) + 0.045 * Math.sin(t * 1.90);
      return { x: fromX + face * (0.00537 + hold * 0.00068 + glue * 0.00007), lift: 0.0042 + Math.abs(hold) * 0.0016 + Math.abs(glue) * 0.0008, rot: (0.22 + hold * 0.24 + glue * 0.09) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00537 * (1 - s), lift: 0.00065 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: VelvetWormTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "slimejet" && trick.kind !== "lobopod" && trick.kind !== "antennawhip" && trick.kind !== "preyharpoon") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "peripatus") {
      if (next.t < PERIPATUS_HOLD) {
        const pose = peripatusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PERIPATUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PERIPATUS_HOLD);
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
    if (next.kind === "slimejet") {
      const pose = slimejetPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lobopod") {
      const pose = lobopodPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennawhip") {
      const pose = antennawhipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = preyharpoonPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }