/** Jaw ground tricks while idle. House neighborly Crocodylidae / Crocodylus acutus American Crocodile brackish-dish desk life — toothlock / highwalk / salttear / nestpit / acutus personality (toothlock interlocking fourth-tooth show without naming tooth or lock or dent or ivy or snaggle or grin or smile or fang or bite or jaw or mouth or gape or open or close, highwalk high-walk gait without naming high or walk or gait or stride or stilts or pedestal or digit or erect or legs or march or trek or hike or climb, salttear lingual salt-gland brine tear without naming salt or tear or brine or gland or weep or cry or drip or ocean or marine or osmotic or ion or nasal, nestpit hole-nest scrape without naming nest or pit or hole or dig or scrape or sand or brood or egg or mound or bank or berm or pack or bury, long acutus Crocodylus acutus brackish-calm keel hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Jaw leave crocodile alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee own their tricks; guest slug Jaw / key crocodile — accept "crocodile" and "jaw" (roster slug jaw; campaign Jaw); do NOT name a trick crocodile or jaw or alligator or levee or alligatoridae or mississippiensis or deathroll or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or denslevee or inklevee or densscute or Horn or Bank or mining). Thank-yous densjaw / inkjaw / denskeel. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop crocodile-tricks.js. Window-play FLASH unchanged. True American Crocodile Crocodylidae desk life — not alligator/horned-lizard/chameleon/skink/anole/gecko/salamander/iguana/newt/frog/rui clones. Beak owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "crocodile";
export const TRICKS = ["toothlock", "highwalk", "salttear", "nestpit", "acutus"] as const;
export const HAPPY = ["densjaw", "inkjaw", "denskeel"] as const;
export type CrocodileTrickKind = (typeof TRICKS)[number];
export type CrocodileHappyKind = (typeof HAPPY)[number];
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

export type CrocodileTrick = {
  kind: CrocodileTrickKind;
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

export type CrocodileHappy = {
  kind: CrocodileHappyKind;
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

export const HAPPY_DUR = { densjaw: 2.16, inkjaw: 2.30, denskeel: 2.22 } as const;
export const ACUTUS_HOLD = 20.64;
export const RELEASE_S = 1.66;
export const DUR = { acutus: ACUTUS_HOLD + RELEASE_S, toothlock: 3.10, highwalk: 3.04, salttear: 3.26, nestpit: 3.18 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CrocodileTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "acutus") return 134 + roll * 12;
  if (kind === "toothlock") return 20.8 + roll * 5.4;
  if (kind === "highwalk") return 22.0 + roll * 6.0;
  if (kind === "salttear") return 22.6 + roll * 6.4;
  if (kind === "nestpit") return 23.4 + roll * 6.6;
  return justFinished ? 19.4 + roll * 5.0 : 13.4 + roll * 4.2;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CrocodileTrickKind | string | null) {
    if (musicOn) return "acutus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "acutus") {
      if (roll < 0.26) return "toothlock";
      if (roll < 0.5) return "highwalk";
      if (roll < 0.74) return "salttear";
      return "nestpit";
    }
    if (lastKind === "toothlock") {
      if (roll < 0.26) return "acutus";
      if (roll < 0.5) return "highwalk";
      if (roll < 0.74) return "salttear";
      return "nestpit";
    }
    if (lastKind === "highwalk") {
      if (roll < 0.22) return "acutus";
      if (roll < 0.44) return "toothlock";
      if (roll < 0.68) return "salttear";
      return "nestpit";
    }
    if (roll < 0.2) return "acutus";
    if (roll < 0.4) return "toothlock";
    if (roll < 0.6) return "highwalk";
    if (roll < 0.8) return "salttear";
    return "nestpit";
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
    return key === TRICK_KEY || key === "jaw";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: CrocodileHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: CrocodileHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: CrocodileHappyKind | string, x: number, facing: 1 | -1): CrocodileHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densjaw";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "densjaw" ? "sit" : name === "inkjaw" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function densjawPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densjaw));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.016, rot: s * 1.80, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const bank = Math.sin(t * 2.6) + 0.10 * Math.sin(t * 5.2);
      return { lift: 0.016 + Math.abs(bank) * 0.0078, rot: 1.80 + bank * 1.02, dx: bank * 0.00050, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.22 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkjawPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkjaw));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.046, rot: s * -2.85, dx: s * 0.00138, anim: "play" as TrickAnim };
    }
    if (u < 0.85) {
      const roll = Math.sin(t * 2.9) + 0.12 * Math.sin(t * 5.8);
      return { lift: 0.046 + Math.abs(roll) * 0.016, rot: -2.85 + roll * 2.30, dx: roll * 0.00160, anim: "play" as TrickAnim };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.005 * (1 - s), rot: -0.38 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function denskeelPose(t: number) {
    return { lift: 0.0066 + Math.abs(Math.sin(t * 0.118)) * 0.0098, rot: Math.sin(t * 0.118) * 0.92, dx: Math.sin(t * 0.086) * 0.00054, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: CrocodileHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densjaw") {
      const pose = densjawPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkjaw") {
      const pose = inkjawPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denskeelPose(next.t);
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
export function beginTrick(kind: CrocodileTrickKind, x: number, facing: 1 | -1): CrocodileTrick {
    const anim: TrickAnim =
      kind === "acutus"
        ? "sit"
        : kind === "toothlock"
          ? "talk"
          : kind === "highwalk"
            ? "play"
            : kind === "salttear"
              ? "sit"
              : kind === "nestpit"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "acutus" ? "hold" : "go",
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
export function acutusPose(t: number) {
    const breath = Math.sin(t * 0.028) + 0.018 * Math.sin(t * 0.086);
    const settle = Math.abs(Math.sin(t * 0.030));
    return { lift: 0.0034 + settle * 0.0088, rot: 0.10 + breath * 0.38 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0028 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.09 * (1 - u) };
  }
export function toothlockPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.toothlock));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0006, lift: s * 0.020, rot: s * -3.1 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.85) {
      const lock = Math.sin((u - 0.11) / 0.74 * Math.PI * 3.8);
      const tooth = Math.sin(t * 4.8) + 0.12 * Math.sin(t * 9.6);
      return { x: fromX + face * (0.0006 + lock * 0.0009 + tooth * 0.00020), lift: 0.016 + Math.abs(lock) * 0.012 + Math.abs(tooth) * 0.004, rot: (-3.1 + lock * 2.6 + tooth * 1.4) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.003 * (1 - s), rot: -0.32 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function highwalkPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.highwalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0030, lift: s * 0.052, rot: s * 2.2 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const stride = Math.sin((u - 0.10) / 0.78 * Math.PI * 5.2);
      const high = Math.sin(t * 6.4) + 0.14 * Math.sin(t * 12.8);
      return { x: fromX + face * (0.0030 + stride * 0.0028 + high * 0.00040), lift: 0.046 + Math.abs(stride) * 0.016 + Math.abs(high) * 0.006, rot: (2.2 + stride * 2.8 + high * 1.5) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0030 * (1 - s), lift: 0.006 * (1 - s), rot: 0.28 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function salttearPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.salttear));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.0004, lift: s * 0.014, rot: s * 1.8 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const tear = Math.sin((u - 0.13) / 0.71 * Math.PI * 2.4);
      const salt = Math.sin(t * 2.2) + 0.09 * Math.sin(t * 4.4);
      return { x: fromX + face * (0.0004 + tear * 0.0005 + salt * 0.00014), lift: 0.012 + Math.abs(tear) * 0.008 + Math.abs(salt) * 0.003, rot: (1.8 + tear * 1.0 + salt * 0.55) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0004 * (1 - s), lift: 0.003 * (1 - s), rot: 0.16 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function nestpitPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.nestpit));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0014, lift: s * 0.028, rot: s * -2.4 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const dig = Math.sin((u - 0.12) / 0.74 * Math.PI * 4.2);
      const pit = Math.sin(t * 5.0) + 0.11 * Math.sin(t * 10.0);
      return { x: fromX + face * (0.0014 + dig * 0.0016 + pit * 0.00028), lift: 0.022 + Math.abs(dig) * 0.014 + Math.abs(pit) * 0.005, rot: (-2.4 + dig * 2.2 + pit * 1.2) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0014 * (1 - s), lift: 0.004 * (1 - s), rot: -0.22 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: CrocodileTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "toothlock" && trick.kind !== "highwalk" && trick.kind !== "salttear" && trick.kind !== "nestpit") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "acutus") {
      if (next.t < ACUTUS_HOLD) {
        const pose = acutusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ACUTUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ACUTUS_HOLD);
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
    if (next.kind === "toothlock") {
      const pose = toothlockPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "highwalk") {
      const pose = highwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "salttear") {
      const pose = salttearPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = nestpitPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }