/** Lunge ground tricks while idle. House neighborly Centrarchidae / Micropterus salmoides Largemouth Bass freshwater-ambush desk life — coverstrike / bedfan / surboil / latline / salmoides personality (coverstrike ambush strike from cover without naming cover or strike or ambush or lunge or hunt or prey or chase or attack or rush or dart or snap or bite or jaws or mouth or weed or log or stump or shadow, bedfan male nest-bed caudal fan without naming bed or fan or nest or spawn or scrape or dig or circular or circle or gravel or male or brood or guard or sit or hover or wash or sweep or sweepings, surboil surface strike boil without naming surface or boil or splash or top or jump or leap or breach or froth or swirl or rise or burst or pop or roll or thrash or chase, latline lateral-line hover sense without naming lateral or line or hover or sense or feel or vibrate or pressure or detect or scan or watch or idle or float or hang or drift or listen or quiet, long salmoides Micropterus salmoides freshwater Centrarchidae hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or parietalgaze or nuchalrise or burrowsit or eggseize or punctatus or denspeak or inkpeak or densisle or hingeshut or berryforage or shellsoak or nestscrape or carolinae or denslid or inklid or densdome or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Lunge leave bass alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak own their tricks; guest slug Lunge / key bass — accept "bass" and "lunge" (roster slug lunge; campaign Lunge); do NOT name a trick bass or lunge or tuatara or peak or box_turtle or lid or snapper or beak or crocodile or jaw or alligator or levee or turtle or ink or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or denslevee or inklevee or densscute or densjaw or inkjaw or denskeel or densbeak or inkbeak or densplastron or denslid or inklid or densdome or denspeak or inkpeak or densisle or Horn or Bank or mining or lizard or reef or coral or salt). Thank-yous denslunge / inklunge / densgape. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop bass-tricks.js. Window-play FLASH unchanged. True Largemouth Bass Micropterus salmoides Centrarchidae desk life — not tuatara/Rhynchocephalia, not box turtle/Emydidae, not reef fish clones. Next house-order guest after Lunge still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "bass";
export const TRICKS = ["coverstrike", "bedfan", "surboil", "latline", "salmoides"] as const;
export const HAPPY = ["denslunge", "inklunge", "densgape"] as const;
export type BassTrickKind = (typeof TRICKS)[number];
export type BassHappyKind = (typeof HAPPY)[number];
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

export type BassTrick = {
  kind: BassTrickKind;
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

export type BassHappy = {
  kind: BassHappyKind;
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

export const HAPPY_DUR = { denslunge: 2.24, inklunge: 2.38, densgape: 2.30 } as const;
export const SALMOIDES_HOLD = 20.88;
export const RELEASE_S = 1.78;
export const DUR = { salmoides: SALMOIDES_HOLD + RELEASE_S, coverstrike: 3.22, bedfan: 3.16, surboil: 3.38, latline: 3.30 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BassTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "salmoides") return 142 + roll * 12;
  if (kind === "coverstrike") return 22.0 + roll * 4.6;
  if (kind === "bedfan") return 23.2 + roll * 5.2;
  if (kind === "surboil") return 22.6 + roll * 6.4;
  if (kind === "latline") return 24.6 + roll * 5.8;
  return justFinished ? 20.2 + roll * 4.2 : 14.2 + roll * 3.4;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BassTrickKind | string | null) {
    if (musicOn) return "salmoides";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "salmoides") {
      if (roll < 0.26) return "coverstrike";
      if (roll < 0.5) return "bedfan";
      if (roll < 0.74) return "surboil";
      return "latline";
    }
    if (lastKind === "coverstrike") {
      if (roll < 0.26) return "salmoides";
      if (roll < 0.5) return "bedfan";
      if (roll < 0.74) return "surboil";
      return "latline";
    }
    if (lastKind === "bedfan") {
      if (roll < 0.22) return "salmoides";
      if (roll < 0.44) return "coverstrike";
      if (roll < 0.68) return "surboil";
      return "latline";
    }
    if (roll < 0.2) return "salmoides";
    if (roll < 0.4) return "coverstrike";
    if (roll < 0.6) return "bedfan";
    if (roll < 0.8) return "surboil";
    return "latline";
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
    return key === TRICK_KEY || key === "lunge";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: BassHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: BassHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: BassHappyKind | string, x: number, facing: 1 | -1): BassHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denslunge";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denslunge" ? "sit" : name === "inklunge" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denslungePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslunge));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.014, rot: s * 1.45, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const hold = Math.sin(t * 2.3) + 0.10 * Math.sin(t * 4.6);
      return { lift: 0.014 + Math.abs(hold) * 0.0070, rot: 1.45 + hold * 0.90, dx: hold * 0.00042, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.002 * (1 - s), rot: 0.18 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inklungePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inklunge));
    if (u < 0.09) {
      const s = u / 0.09;
      return { lift: s * 0.048, rot: s * -2.90, dx: s * 0.00140, anim: "play" as TrickAnim };
    }
    if (u < 0.85) {
      const roll = Math.sin(t * 3.1) + 0.14 * Math.sin(t * 6.2);
      return { lift: 0.048 + Math.abs(roll) * 0.016, rot: -2.90 + roll * 2.25, dx: roll * 0.00160, anim: "play" as TrickAnim };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.005 * (1 - s), rot: -0.36 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function densgapePose(t: number) {
    return { lift: 0.0056 + Math.abs(Math.sin(t * 0.105)) * 0.0088, rot: Math.sin(t * 0.105) * 0.82, dx: Math.sin(t * 0.074) * 0.00046, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: BassHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denslunge") {
      const pose = denslungePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inklunge") {
      const pose = inklungePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densgapePose(next.t);
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
export function beginTrick(kind: BassTrickKind, x: number, facing: 1 | -1): BassTrick {
    const anim: TrickAnim =
      kind === "salmoides"
        ? "sit"
        : kind === "coverstrike"
          ? "play"
          : kind === "bedfan"
            ? "sit"
            : kind === "surboil"
              ? "play"
              : kind === "latline"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "salmoides" ? "hold" : "go",
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
export function salmoidesPose(t: number) {
    const breath = Math.sin(t * 0.022) + 0.013 * Math.sin(t * 0.071);
    const hover = Math.abs(Math.sin(t * 0.027));
    return { lift: 0.0026 + hover * 0.0071, rot: 0.07 + breath * 0.31 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0021 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.07 * (1 - u) };
  }
export function coverstrikePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.coverstrike));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0008, lift: s * 0.022, rot: s * -1.8 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const lunge = Math.sin((u - 0.11) / 0.67 * Math.PI * 4.2);
      const jaw = Math.sin(t * 4.8) + 0.12 * Math.sin(t * 9.6);
      return { x: fromX + face * (0.0008 + lunge * 0.0036 + jaw * 0.00032), lift: 0.024 + Math.abs(lunge) * 0.022 + Math.abs(jaw) * 0.006, rot: (-1.8 + lunge * 3.4 + jaw * 1.4) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.004 * (1 - s), rot: -0.22 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function bedfanPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.bedfan));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0005, lift: s * 0.008, rot: s * 1.1 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.88) {
      const fan = Math.sin((u - 0.12) / 0.76 * Math.PI * 2.8);
      const nest = Math.sin(t * 2.2) + 0.09 * Math.sin(t * 4.4);
      return { x: fromX + face * (0.0005 + fan * 0.0011 + nest * 0.00018), lift: 0.006 + Math.abs(fan) * 0.010 + Math.abs(nest) * 0.003, rot: (1.1 + fan * 1.5 + nest * 0.75) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.001 * (1 - s), rot: 0.12 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function surboilPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.surboil));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0016, lift: s * 0.048, rot: s * 2.9 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.80) {
      const boil = Math.sin((u - 0.09) / 0.71 * Math.PI * 5.0);
      const splash = Math.sin(t * 5.6) + 0.15 * Math.sin(t * 11.2);
      return { x: fromX + face * (0.0016 + boil * 0.0028 + splash * 0.00040), lift: 0.040 + Math.abs(boil) * 0.020 + Math.abs(splash) * 0.008, rot: (2.9 + boil * 2.4 + splash * 1.5) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.80) / 0.20);
    return { x: fromX + face * 0.0016 * (1 - s), lift: 0.005 * (1 - s), rot: 0.28 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function latlinePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.latline));
    const face = facing == null ? 1 : facing;
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX + face * s * 0.0004, lift: s * 0.014, rot: s * -0.9 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.90) {
      const hover = Math.sin((u - 0.15) / 0.75 * Math.PI * 1.8);
      const sense = Math.sin(t * 1.35) + 0.08 * Math.sin(t * 2.7);
      return { x: fromX + face * (0.0004 + hover * 0.00055 + sense * 0.00012), lift: 0.012 + Math.abs(hover) * 0.007 + Math.abs(sense) * 0.002, rot: (-0.9 + hover * 0.70 + sense * 0.35) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.0004 * (1 - s), lift: 0.002 * (1 - s), rot: -0.10 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: BassTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "coverstrike" && trick.kind !== "bedfan" && trick.kind !== "surboil" && trick.kind !== "latline") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "salmoides") {
      if (next.t < SALMOIDES_HOLD) {
        const pose = salmoidesPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SALMOIDES_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SALMOIDES_HOLD);
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
    if (next.kind === "coverstrike") {
      const pose = coverstrikePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bedfan") {
      const pose = bedfanPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "surboil") {
      const pose = surboilPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = latlinePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }