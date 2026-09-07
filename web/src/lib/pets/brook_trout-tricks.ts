/** Speck ground tricks while idle. House neighborly Salmonidae / Salvelinus fontinalis Brook Trout cold-stream char desk life — driftfeed / insectrise / reddscrape / vermicflash / fontinalis personality (driftfeed cold-stream drift feed without naming drift or feed or stream or cold or current or sip or gulp or nibble or mouth or prey or insect or worm or float or hang or idle or quiet or cruise or glide or swim, insectrise worm/insect surface rise without naming insect or worm or rise or surface or jump or leap or boil or splash or snap or bite or fly or mayfly or caddis or hatch or top or burst or breach, reddscrape redd spawn scrape dig without naming redd or scrape or dig or spawn or nest or bed or gravel or fan or sweep or circle or male or brood or guard or sit or hover or wash, vermicflash vermiculate flank flash without naming vermic or vermiculate or flash or flank or spot or mark or stripe or glow or shimmer or turn or twist or roll or show or color or pattern or marble, long fontinalis Salvelinus fontinalis Salmonidae char hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or coverstrike or bedfan or surboil or latline or salmoides or denslunge or inklunge or densgape or parietalgaze or nuchalrise or burrowsit or eggseize or punctatus or denspeak or inkpeak or densisle or hingeshut or berryforage or shellsoak or nestscrape or carolinae or denslid or inklid or densdome or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Speck leave brook_trout alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge own their tricks; guest slug Speck / key brook_trout — accept "brook_trout" and "speck" (roster slug speck; campaign Speck); do NOT name a trick brook_trout or speck or bass or lunge or tuatara or peak or box_turtle or lid or snapper or beak or crocodile or jaw or alligator or levee or turtle or ink or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or denslevee or inklevee or densscute or densjaw or inkjaw or denskeel or densbeak or inkbeak or densplastron or denslid or inklid or densdome or denspeak or inkpeak or densisle or denslunge or inklunge or densgape or Horn or Bank or mining or lizard or reef or coral or salt). Thank-yous densspeck / inkspeck / densredd. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop brook_trout-tricks.js. Window-play FLASH unchanged. True Brook Trout Salvelinus fontinalis Salmonidae char desk life — not Micropterus bass/Centrarchidae, not tuatara/Rhynchocephalia, not reef fish clones. Next house-order guest after Speck still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "brook_trout";
export const TRICKS = ["driftfeed", "insectrise", "reddscrape", "vermicflash", "fontinalis"] as const;
export const HAPPY = ["densspeck", "inkspeck", "densredd"] as const;
export type BrookTroutTrickKind = (typeof TRICKS)[number];
export type BrookTroutHappyKind = (typeof HAPPY)[number];
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

export type BrookTroutTrick = {
  kind: BrookTroutTrickKind;
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

export type BrookTroutHappy = {
  kind: BrookTroutHappyKind;
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

export const HAPPY_DUR = { densspeck: 2.26, inkspeck: 2.40, densredd: 2.32 } as const;
export const FONTINALIS_HOLD = 20.96;
export const RELEASE_S = 1.82;
export const DUR = { fontinalis: FONTINALIS_HOLD + RELEASE_S, driftfeed: 3.28, insectrise: 3.20, reddscrape: 3.42, vermicflash: 3.34 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BrookTroutTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "fontinalis") return 144 + roll * 12;
  if (kind === "driftfeed") return 22.4 + roll * 4.4;
  if (kind === "insectrise") return 23.6 + roll * 5.0;
  if (kind === "reddscrape") return 23.0 + roll * 6.2;
  if (kind === "vermicflash") return 25.0 + roll * 5.6;
  return justFinished ? 20.4 + roll * 4.0 : 14.4 + roll * 3.2;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BrookTroutTrickKind | string | null) {
    if (musicOn) return "fontinalis";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "fontinalis") {
      if (roll < 0.26) return "driftfeed";
      if (roll < 0.5) return "insectrise";
      if (roll < 0.74) return "reddscrape";
      return "vermicflash";
    }
    if (lastKind === "driftfeed") {
      if (roll < 0.26) return "fontinalis";
      if (roll < 0.5) return "insectrise";
      if (roll < 0.74) return "reddscrape";
      return "vermicflash";
    }
    if (lastKind === "insectrise") {
      if (roll < 0.22) return "fontinalis";
      if (roll < 0.44) return "driftfeed";
      if (roll < 0.68) return "reddscrape";
      return "vermicflash";
    }
    if (roll < 0.2) return "fontinalis";
    if (roll < 0.4) return "driftfeed";
    if (roll < 0.6) return "insectrise";
    if (roll < 0.8) return "reddscrape";
    return "vermicflash";
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
    return key === TRICK_KEY || key === "speck";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: BrookTroutHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: BrookTroutHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: BrookTroutHappyKind | string, x: number, facing: 1 | -1): BrookTroutHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densspeck";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "densspeck" ? "sit" : name === "inkspeck" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function densspeckPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densspeck));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.012, rot: s * 1.25, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const hold = Math.sin(t * 2.1) + 0.09 * Math.sin(t * 4.2);
      return { lift: 0.012 + Math.abs(hold) * 0.0064, rot: 1.25 + hold * 0.82, dx: hold * 0.00038, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.002 * (1 - s), rot: 0.16 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkspeckPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspeck));
    if (u < 0.09) {
      const s = u / 0.09;
      return { lift: s * 0.044, rot: s * -2.60, dx: s * 0.00125, anim: "play" as TrickAnim };
    }
    if (u < 0.85) {
      const roll = Math.sin(t * 2.9) + 0.12 * Math.sin(t * 5.8);
      return { lift: 0.044 + Math.abs(roll) * 0.014, rot: -2.60 + roll * 2.05, dx: roll * 0.00145, anim: "play" as TrickAnim };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.004 * (1 - s), rot: -0.32 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function densreddPose(t: number) {
    return { lift: 0.0050 + Math.abs(Math.sin(t * 0.098)) * 0.0080, rot: Math.sin(t * 0.098) * 0.74, dx: Math.sin(t * 0.068) * 0.00042, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: BrookTroutHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densspeck") {
      const pose = densspeckPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkspeck") {
      const pose = inkspeckPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densreddPose(next.t);
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
export function beginTrick(kind: BrookTroutTrickKind, x: number, facing: 1 | -1): BrookTroutTrick {
    const anim: TrickAnim =
      kind === "fontinalis"
        ? "sit"
        : kind === "driftfeed"
          ? "talk"
          : kind === "insectrise"
            ? "play"
            : kind === "reddscrape"
              ? "sit"
              : kind === "vermicflash"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "fontinalis" ? "hold" : "go",
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
export function fontinalisPose(t: number) {
    const breath = Math.sin(t * 0.019) + 0.011 * Math.sin(t * 0.063);
    const hover = Math.abs(Math.sin(t * 0.024));
    return { lift: 0.0031 + hover * 0.0064, rot: 0.05 + breath * 0.27 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0024 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.05 * (1 - u) };
  }
export function driftfeedPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.driftfeed));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.0012, lift: s * 0.010, rot: s * -0.7 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.87) {
      const drift = Math.sin((u - 0.13) / 0.74 * Math.PI * 2.1);
      const sip = Math.sin(t * 1.55) + 0.07 * Math.sin(t * 3.1);
      return { x: fromX + face * (0.0012 + drift * 0.0024 + sip * 0.00022), lift: 0.009 + Math.abs(drift) * 0.006 + Math.abs(sip) * 0.002, rot: (-0.7 + drift * 0.85 + sip * 0.40) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.0015 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function insectrisePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.insectrise));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0006, lift: s * 0.042, rot: s * 2.4 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.82) {
      const rise = Math.sin((u - 0.10) / 0.72 * Math.PI * 3.6);
      const snap = Math.sin(t * 4.2) + 0.11 * Math.sin(t * 8.4);
      return { x: fromX + face * (0.0006 + rise * 0.0018 + snap * 0.00028), lift: 0.038 + Math.abs(rise) * 0.018 + Math.abs(snap) * 0.007, rot: (2.4 + rise * 1.9 + snap * 1.2) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.004 * (1 - s), rot: 0.22 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function reddscrapePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.reddscrape));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0003, lift: s * 0.006, rot: s * 1.3 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.88) {
      const scrape = Math.sin((u - 0.12) / 0.76 * Math.PI * 3.4);
      const gravel = Math.sin(t * 2.6) + 0.10 * Math.sin(t * 5.2);
      return { x: fromX + face * (0.0003 + scrape * 0.0014 + gravel * 0.00020), lift: 0.005 + Math.abs(scrape) * 0.009 + Math.abs(gravel) * 0.003, rot: (1.3 + scrape * 1.7 + gravel * 0.85) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0003 * (1 - s), lift: 0.001 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function vermicflashPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.vermicflash));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0009, lift: s * 0.018, rot: s * -1.5 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.84) {
      const flash = Math.sin((u - 0.11) / 0.73 * Math.PI * 4.6);
      const verm = Math.sin(t * 3.4) + 0.13 * Math.sin(t * 6.8);
      return { x: fromX + face * (0.0009 + flash * 0.0022 + verm * 0.00030), lift: 0.016 + Math.abs(flash) * 0.014 + Math.abs(verm) * 0.005, rot: (-1.5 + flash * 2.8 + verm * 1.3) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0009 * (1 - s), lift: 0.0025 * (1 - s), rot: -0.16 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: BrookTroutTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "driftfeed" && trick.kind !== "insectrise" && trick.kind !== "reddscrape" && trick.kind !== "vermicflash") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "fontinalis") {
      if (next.t < FONTINALIS_HOLD) {
        const pose = fontinalisPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < FONTINALIS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - FONTINALIS_HOLD);
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
    if (next.kind === "driftfeed") {
      const pose = driftfeedPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "insectrise") {
      const pose = insectrisePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "reddscrape") {
      const pose = reddscrapePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = vermicflashPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }