/** Hop ground tricks while idle. House neighborly Collembola / Orchesella Springtail furcula life — furcula / collophore / springleap / duffgraze / orchesella personality (furcula furcula jump launch without naming jump or leap or spring or hop or bounce or flick or launch or vault alone as wait, collophore feeler walk without naming walk or crawl or march or feel or antenna or tap or probe or scan or sniff, springleap damp litter soil cling without naming cling or moist or damp or soil or litter or grip or stick or hold or wet, duffgraze furcula tuck rest without naming tuck or fold or rest or crouch or curl or sit or hush or wait alone, long orchesella Orchesella Collembola springtail hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or slimejet or lobopod or antennawhip or preyharpoon or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass; window-play and Call Hop leave springtail alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet own their tricks; guest slug Hop / key springtail — accept "springtail" and "hop" (roster slug hop; campaign Hop); do NOT confuse with Jet the Velvet Worm (key velvet_worm / slug jet) or densjet thank-you; do NOT confuse with Cast the Earthworm (key earthworm / slug cast) or denscast thank-you; do NOT confuse with Armor the Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT name a trick springtail or hop or velvet_worm or jet or earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste. Thank-yous denshop / inkhop / densfurc. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop springtail-tricks.js. Window-play unchanged. True Springtail Orchesella Collembola desk life — furcula jump launch with feeler walk, damp litter cling, and furcula tuck rest; not Peripatus velvet worm/Onychophora clones (slimejet/lobopod/antennawhip/preyharpoon), not Lumbricus earthworm/Annelida clones (peristalse/castheap/surfacerise/soilanchor), not Armadillidium pillbug/Isopoda clones (conglobate/volvation/antennafeel/detritusnip), not Narceus millipede/Diplopoda clones — true collembolan furcula distinct from worm peristalsis and pillbug ball-roll. Next house-order guest after Hop still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "springtail";
export const TRICKS = ["furcula", "collophore", "springleap", "duffgraze", "orchesella"] as const;
export const HAPPY = ["denshop", "inkhop", "densfurc"] as const;
export type SpringtailTrickKind = (typeof TRICKS)[number];
export type SpringtailHappyKind = (typeof HAPPY)[number];
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

export type SpringtailTrick = {
  kind: SpringtailTrickKind;
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

export type SpringtailHappy = {
  kind: SpringtailHappyKind;
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

export const HAPPY_DUR = { denshop: 2.48, inkhop: 2.72, densfurc: 2.52 } as const;
export const ORCHESELLA_HOLD = 23.90;
export const RELEASE_S = 2.04;
export const DUR = { orchesella: ORCHESELLA_HOLD + RELEASE_S, furcula: 4.15, collophore: 4.55, springleap: 4.85, duffgraze: 4.35 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SpringtailTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "orchesella") return 154 + roll * 14;
  if (kind === "furcula") return 25.0 + roll * 4.0;
  if (kind === "collophore") return 25.6 + roll * 4.0;
  if (kind === "springleap") return 24.0 + roll * 3.6;
  if (kind === "duffgraze") return 24.8 + roll * 3.8;
  return justFinished ? 18.2 + roll * 2.5 : 13.4 + roll * 2.1;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SpringtailTrickKind | string | null) {
    if (musicOn) return "orchesella";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "orchesella") {
      if (roll < 0.26) return "furcula";
      if (roll < 0.5) return "collophore";
      if (roll < 0.74) return "springleap";
      return "duffgraze";
    }
    if (lastKind === "furcula") {
      if (roll < 0.26) return "orchesella";
      if (roll < 0.5) return "collophore";
      if (roll < 0.74) return "springleap";
      return "duffgraze";
    }
    if (lastKind === "collophore") {
      if (roll < 0.22) return "orchesella";
      if (roll < 0.44) return "furcula";
      if (roll < 0.68) return "springleap";
      return "duffgraze";
    }
    if (roll < 0.2) return "orchesella";
    if (roll < 0.4) return "furcula";
    if (roll < 0.6) return "collophore";
    if (roll < 0.8) return "springleap";
    return "duffgraze";
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
    return key === TRICK_KEY || key === "hop";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: SpringtailHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: SpringtailHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: SpringtailHappyKind | string, x: number, facing: 1 | -1): SpringtailHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denshop";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denshop" ? "sit" : name === "inkhop" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denshopPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshop));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0055, rot: s * 0.48, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.6);
      return { lift: 0.0055 + bob * 0.0024, rot: 0.48 + bob * 0.36, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0055 * (1 - s), rot: 0.48 * (1 - s), anim: "idle" as TrickAnim };
  }
export function inkhopPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhop));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0060, rot: s * -0.52, anim: "talk" as TrickAnim };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 3.0);
      return { lift: 0.0060 + Math.abs(pulse) * 0.0022, rot: -0.52 + pulse * 0.44, anim: "talk" as TrickAnim };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0060 * (1 - s), rot: -0.52 * (1 - s), anim: "idle" as TrickAnim };
  }
export function densfurcPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densfurc));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0042, rot: s * 0.36, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const spring = Math.sin((u - 0.12) / 0.66 * Math.PI * 3.4);
      return { lift: 0.0042 + Math.abs(spring) * 0.0020, rot: 0.36 + spring * 0.30, anim: "play" as TrickAnim };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0042 * (1 - s), rot: 0.36 * (1 - s), anim: "idle" as TrickAnim };
  }
export function stepHappy(happy: SpringtailHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denshop") {
      const pose = denshopPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkhop") {
      const pose = inkhopPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densfurcPose(next.t);
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
export function beginTrick(kind: SpringtailTrickKind, x: number, facing: 1 | -1): SpringtailTrick {
    const anim: TrickAnim =
      kind === "orchesella"
        ? "sit"
        : kind === "furcula"
          ? "sit"
          : kind === "collophore"
            ? "sit"
            : kind === "springleap"
              ? "play"
              : kind === "duffgraze"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "orchesella" ? "hold" : "go",
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
export function orchesellaPose(t: number) {
    const breath = Math.sin(t * 0.0058) + 0.0022 * Math.sin(t * 0.0148);
    const hush = Math.abs(Math.sin(t * 0.0032));
    return { lift: 0.00042 + hush * 0.00068, rot: -0.011 + breath * 0.028 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00042 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.011 * (1 - u) };
  }
export function furculaPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.furcula));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00022, lift: s * 0.0028, rot: s * -0.32 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.36) {
      const cock = smoothstep((u - 0.14) / 0.22);
      return { x: fromX + face * (0.00022 + cock * 0.00018), lift: 0.0028 + cock * 0.0042, rot: (-0.32 + cock * -0.28) * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.52) {
      const snap = smoothstep((u - 0.36) / 0.16);
      return { x: fromX + face * (0.00040 + snap * 0.0028), lift: 0.0070 + snap * 0.0065, rot: (-0.60 + snap * 0.72) * face, anim: "play" as TrickAnim };
    }
    if (u < 0.84) {
      const settle = Math.sin((u - 0.52) / 0.32 * Math.PI * 1.7);
      const twitch = Math.sin(t * 1.18) + 0.05 * Math.sin(t * 2.36);
      return { x: fromX + face * (0.0024 + settle * 0.00055 + twitch * 0.00007), lift: 0.0048 + Math.abs(settle) * 0.0018 + Math.abs(twitch) * 0.0008, rot: (0.12 + settle * 0.26 + twitch * 0.09) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0024 * (1 - s), lift: 0.0007 * (1 - s), rot: 0.018 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function collophorePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.collophore));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00018, lift: s * 0.0016, rot: s * 0.12 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const tap = Math.sin((u - 0.12) / 0.74 * Math.PI * 5.2);
      const moisture = Math.sin(t * 0.88) + 0.045 * Math.sin(t * 1.76);
      return { x: fromX + face * (0.00018 + tap * 0.00042 + moisture * 0.00006), lift: 0.0014 + Math.abs(tap) * 0.0018 + Math.abs(moisture) * 0.0009, rot: (0.12 + tap * 0.28 + moisture * 0.10) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00018 * (1 - s), lift: 0.0014 * (1 - s) + s * 0.0004, rot: 0.016 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function springleapPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.springleap));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0034, rot: s * -0.38 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.22) {
      const coil = smoothstep((u - 0.10) / 0.12);
      return { x: fromX + face * (0.00028 + coil * 0.00022), lift: 0.0034 + coil * 0.0055, rot: (-0.38 + coil * -0.22) * face, anim: "play" as TrickAnim };
    }
    if (u < 0.42) {
      const leap = smoothstep((u - 0.22) / 0.20);
      return { x: fromX + face * (0.00050 + leap * 0.0115), lift: 0.0089 + leap * 0.0145, rot: (-0.60 + leap * 0.95) * face, anim: "play" as TrickAnim };
    }
    if (u < 0.72) {
      const arc = Math.sin((u - 0.42) / 0.30 * Math.PI);
      const tumble = Math.sin(t * 1.55) + 0.06 * Math.sin(t * 3.1);
      return { x: fromX + face * (0.0120 + arc * 0.0022 + tumble * 0.00014), lift: 0.0160 + Math.abs(arc) * 0.0065 + Math.abs(tumble) * 0.0012, rot: (0.35 + arc * 0.42 + tumble * 0.16) * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.88) {
      const land = smoothstep((u - 0.72) / 0.16);
      return { x: fromX + face * (0.0120 - land * 0.0038), lift: 0.0160 * (1 - land) + land * 0.0022, rot: (0.35 - land * 0.28) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0082 * (1 - s), lift: 0.0022 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function duffgrazePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.duffgraze));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00035, lift: s * 0.0012, rot: s * 0.10 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const nibble = Math.sin((u - 0.10) / 0.78 * Math.PI * 7.2);
      const litter = Math.sin(t * 0.96) + 0.04 * Math.sin(t * 1.92);
      return { x: fromX + face * (0.00035 + (u - 0.10) / 0.78 * 0.0058 + nibble * 0.00072 + litter * 0.00008), lift: 0.0010 + Math.abs(nibble) * 0.0014 + Math.abs(litter) * 0.0006, rot: (0.10 + nibble * 0.24 + litter * 0.08) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0058 * (1 - s), lift: 0.0005 * (1 - s), rot: 0.014 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: SpringtailTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "furcula" && trick.kind !== "collophore" && trick.kind !== "springleap" && trick.kind !== "duffgraze") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "orchesella") {
      if (next.t < ORCHESELLA_HOLD) {
        const pose = orchesellaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ORCHESELLA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ORCHESELLA_HOLD);
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
    if (next.kind === "furcula") {
      const pose = furculaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "collophore") {
      const pose = collophorePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "springleap") {
      const pose = springleapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = duffgrazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }