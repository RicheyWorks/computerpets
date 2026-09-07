/** Peak ground tricks while idle. House neighborly Rhynchocephalia / Sphenodon punctatus Tuatara island-crest desk life — parietalgaze / nuchalrise / burrowsit / eggseize / punctatus personality (parietalgaze parietal third-eye bask gaze without naming parietal or third or eye or gaze or bask or sun or sky or stare or watch or look or monocle or turret or loft or tip or peer or scan, nuchalrise spiny nuchal crest raise without naming crest or flare or spine or raise or spike or bristle or fan or display or threat or puff or lift or ridge or sail or comb, burrowsit cool burrow-mouth sit without naming burrow or sit or dens or hole or tunnel or mouth or nest or cave or cool or shade or rest or lounge or crouch or wait or hide, eggseize bird-egg invertebrate seize without naming egg or seize or snap or bite or strike or lunge or hunt or prey or grub or insect or ambush or gape or lock or crunch or feed, long punctatus Sphenodon punctatus cool-island sit-and-wait hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or hingeshut or berryforage or shellsoak or nestscrape or carolinae or denslid or inklid or densdome or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Peak leave tuatara alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid own their tricks; guest slug Peak / key tuatara — accept "tuatara" and "peak" (roster slug peak; campaign Peak); do NOT name a trick tuatara or peak or box_turtle or lid or snapper or beak or crocodile or jaw or alligator or levee or turtle or ink or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or denslevee or inklevee or densscute or densjaw or inkjaw or denskeel or densbeak or inkbeak or densplastron or denslid or inklid or densdome or Horn or Bank or mining or lizard). Thank-yous denspeak / inkpeak / densisle. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop tuatara-tricks.js. Window-play FLASH unchanged. True Tuatara Rhynchocephalia Sphenodon desk life — not box turtle/Emydidae, not snapper/Chelydra, not lizard/rui clones. Next house-order guest after Peak still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "tuatara";
export const TRICKS = ["parietalgaze", "nuchalrise", "burrowsit", "eggseize", "punctatus"] as const;
export const HAPPY = ["denspeak", "inkpeak", "densisle"] as const;
export type TuataraTrickKind = (typeof TRICKS)[number];
export type TuataraHappyKind = (typeof HAPPY)[number];
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

export type TuataraTrick = {
  kind: TuataraTrickKind;
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

export type TuataraHappy = {
  kind: TuataraHappyKind;
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

export const HAPPY_DUR = { denspeak: 2.22, inkpeak: 2.36, densisle: 2.28 } as const;
export const PUNCTATUS_HOLD = 20.80;
export const RELEASE_S = 1.74;
export const DUR = { punctatus: PUNCTATUS_HOLD + RELEASE_S, parietalgaze: 3.18, nuchalrise: 3.12, burrowsit: 3.34, eggseize: 3.26 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TuataraTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "punctatus") return 140 + roll * 12;
  if (kind === "parietalgaze") return 21.6 + roll * 4.8;
  if (kind === "nuchalrise") return 22.8 + roll * 5.4;
  if (kind === "burrowsit") return 22.6 + roll * 6.4;
  if (kind === "eggseize") return 24.2 + roll * 6.0;
  return justFinished ? 20.0 + roll * 4.4 : 14.0 + roll * 3.6;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: TuataraTrickKind | string | null) {
    if (musicOn) return "punctatus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "punctatus") {
      if (roll < 0.26) return "parietalgaze";
      if (roll < 0.5) return "nuchalrise";
      if (roll < 0.74) return "burrowsit";
      return "eggseize";
    }
    if (lastKind === "parietalgaze") {
      if (roll < 0.26) return "punctatus";
      if (roll < 0.5) return "nuchalrise";
      if (roll < 0.74) return "burrowsit";
      return "eggseize";
    }
    if (lastKind === "nuchalrise") {
      if (roll < 0.22) return "punctatus";
      if (roll < 0.44) return "parietalgaze";
      if (roll < 0.68) return "burrowsit";
      return "eggseize";
    }
    if (roll < 0.2) return "punctatus";
    if (roll < 0.4) return "parietalgaze";
    if (roll < 0.6) return "nuchalrise";
    if (roll < 0.8) return "burrowsit";
    return "eggseize";
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
    return key === TRICK_KEY || key === "peak";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: TuataraHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: TuataraHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: TuataraHappyKind | string, x: number, facing: 1 | -1): TuataraHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denspeak";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denspeak" ? "sit" : name === "inkpeak" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denspeakPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspeak));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.012, rot: s * 1.35, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.85) {
      const crest = Math.sin(t * 2.1) + 0.09 * Math.sin(t * 4.2);
      return { lift: 0.012 + Math.abs(crest) * 0.0064, rot: 1.35 + crest * 0.84, dx: crest * 0.00038, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.002 * (1 - s), rot: 0.16 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkpeakPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkpeak));
    if (u < 0.10) {
      const s = u / 0.10;
      return { lift: s * 0.044, rot: s * -2.70, dx: s * 0.00130, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const roll = Math.sin(t * 2.9) + 0.13 * Math.sin(t * 5.8);
      return { lift: 0.044 + Math.abs(roll) * 0.015, rot: -2.70 + roll * 2.15, dx: roll * 0.00150, anim: "play" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.005 * (1 - s), rot: -0.34 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function densislePose(t: number) {
    return { lift: 0.0052 + Math.abs(Math.sin(t * 0.098)) * 0.0082, rot: Math.sin(t * 0.098) * 0.76, dx: Math.sin(t * 0.070) * 0.00042, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: TuataraHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denspeak") {
      const pose = denspeakPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkpeak") {
      const pose = inkpeakPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densislePose(next.t);
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
export function beginTrick(kind: TuataraTrickKind, x: number, facing: 1 | -1): TuataraTrick {
    const anim: TrickAnim =
      kind === "punctatus"
        ? "sit"
        : kind === "parietalgaze"
          ? "talk"
          : kind === "nuchalrise"
            ? "play"
            : kind === "burrowsit"
              ? "sit"
              : kind === "eggseize"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "punctatus" ? "hold" : "go",
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
export function punctatusPose(t: number) {
    const breath = Math.sin(t * 0.018) + 0.011 * Math.sin(t * 0.062);
    const cool = Math.abs(Math.sin(t * 0.021));
    return { lift: 0.0022 + cool * 0.0064, rot: 0.05 + breath * 0.26 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.05 * (1 - u) };
  }
export function parietalgazePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.parietalgaze));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0003, lift: s * 0.018, rot: s * -1.4 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.88) {
      const gaze = Math.sin((u - 0.14) / 0.74 * Math.PI * 1.6);
      const third = Math.sin(t * 1.15) + 0.07 * Math.sin(t * 2.3);
      return { x: fromX + face * (0.0003 + gaze * 0.00035 + third * 0.00010), lift: 0.016 + Math.abs(gaze) * 0.006 + Math.abs(third) * 0.002, rot: (-1.4 + gaze * 0.85 + third * 0.40) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0003 * (1 - s), lift: 0.002 * (1 - s), rot: -0.16 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function nuchalrisePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.nuchalrise));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0012, lift: s * 0.034, rot: s * 2.6 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.84) {
      const flare = Math.sin((u - 0.10) / 0.74 * Math.PI * 3.4);
      const spine = Math.sin(t * 3.6) + 0.11 * Math.sin(t * 7.2);
      return { x: fromX + face * (0.0012 + flare * 0.0016 + spine * 0.00024), lift: 0.028 + Math.abs(flare) * 0.016 + Math.abs(spine) * 0.005, rot: (2.6 + flare * 2.0 + spine * 1.1) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.004 * (1 - s), rot: 0.24 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function burrowsitPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.burrowsit));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.0006, lift: s * 0.006, rot: s * 0.9 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.87) {
      const burrow = Math.sin((u - 0.13) / 0.74 * Math.PI * 2.1);
      const mouth = Math.sin(t * 1.8) + 0.08 * Math.sin(t * 3.6);
      return { x: fromX + face * (0.0006 + burrow * 0.0008 + mouth * 0.00016), lift: 0.004 + Math.abs(burrow) * 0.008 + Math.abs(mouth) * 0.002, rot: (0.9 + burrow * 1.2 + mouth * 0.70) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.001 * (1 - s), rot: 0.10 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function eggseizePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.eggseize));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0024, lift: s * 0.042, rot: s * -3.1 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.82) {
      const seize = Math.sin((u - 0.09) / 0.73 * Math.PI * 4.6);
      const snap = Math.sin(t * 5.2) + 0.14 * Math.sin(t * 10.4);
      return { x: fromX + face * (0.0024 + seize * 0.0030 + snap * 0.00038), lift: 0.036 + Math.abs(seize) * 0.018 + Math.abs(snap) * 0.007, rot: (-3.1 + seize * 3.0 + snap * 1.6) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.0024 * (1 - s), lift: 0.005 * (1 - s), rot: -0.34 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: TuataraTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "parietalgaze" && trick.kind !== "nuchalrise" && trick.kind !== "burrowsit" && trick.kind !== "eggseize") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "punctatus") {
      if (next.t < PUNCTATUS_HOLD) {
        const pose = punctatusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PUNCTATUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PUNCTATUS_HOLD);
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
    if (next.kind === "parietalgaze") {
      const pose = parietalgazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nuchalrise") {
      const pose = nuchalrisePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "burrowsit") {
      const pose = burrowsitPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = eggseizePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }