/** Penny ground tricks while idle. House neighborly Centrarchidae / Lepomis macrochirus Bluegill plate-body dock life — platehover / colonyfan / insectpeck / gillflare / macrochirus personality (platehover plate shade-hover without naming plate or shade or hover or disk or round or body or sill or idle or quiet or cruise or glide or swim or hold or float, colonyfan colony nest bed-fan without naming colony or nest or bed or fan or scrape or gravel or male or egg or fry or dens or wash or dig or spawn or hole or brood or guard, insectpeck insect surface peck without naming insect or surface or peck or sip or rise or boil or flash or feed or forage or snatch or gulp or mouth or lip, gillflare gill-flare threat without naming gill or flare or threat or opercle or flash or flare or fight or chase or dash or bolt or surge or slap or whip, round macrochirus Lepomis macrochirus Centrarchidae bluegill hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or barbelprobe or cavitynest or mudcloud or caudalthrash or ictalurus or denswhisk or inkwhisk or densbarbel or driftfeed or insectrise or reddscrape or vermicflash or fontinalis or densspeck or inkspeck or densredd or coverstrike or bedfan or surboil or latline or salmoides or denslunge or inklunge or densgape or parietalgaze or nuchalrise or burrowsit or eggseize or punctatus or denspeak or inkpeak or densisle or hingeshut or berryforage or shellsoak or nestscrape or carolinae or denslid or inklid or densdome or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLARE and Call Penny leave bluegill alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk own their tricks; guest slug Penny / key bluegill — accept "bluegill" and "penny" (roster slug penny; campaign Penny); do NOT name a trick bluegill or penny or catfish or whisk or brook_trout or speck or bass or lunge or tuatara or peak or box_turtle or lid or snapper or beak or crocodile or jaw or alligator or levee or turtle or ink or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or denslevee or inklevee or densscute or densjaw or inkjaw or denskeel or densbeak or inkbeak or densplastron or denslid or inklid or densdome or denspeak or inkpeak or densisle or denslunge or inklunge or densgape or densspeck or inkspeck or densredd or denswhisk or inkwhisk or densbarbel or Horn or Bank or mining or lizard or reef or coral or salt). Thank-yous denspenny / inkpenny / densplate. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop bluegill-tricks.js. Window-play FLARE unchanged. True Bluegill Lepomis macrochirus Centrarchidae desk life — not Ictalurus channel catfish/Ictaluridae, not Salvelinus brook trout/Salmonidae, not Micropterus bass/Centrarchidae clones (coverstrike/bedfan/surboil/latline), not tuatara/Rhynchocephalia, not reef fish clones. Next house-order guest after Penny still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "bluegill";
export const TRICKS = ["platehover", "colonyfan", "insectpeck", "gillflare", "macrochirus"] as const;
export const HAPPY = ["denspenny", "inkpenny", "densplate"] as const;
export type BluegillTrickKind = (typeof TRICKS)[number];
export type BluegillHappyKind = (typeof HAPPY)[number];
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

export type BluegillTrick = {
  kind: BluegillTrickKind;
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

export type BluegillHappy = {
  kind: BluegillHappyKind;
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

export const HAPPY_DUR = { denspenny: 2.30, inkpenny: 2.48, densplate: 2.36 } as const;
export const MACROCHIRUS_HOLD = 21.22;
export const RELEASE_S = 1.94;
export const DUR = { macrochirus: MACROCHIRUS_HOLD + RELEASE_S, platehover: 3.40, colonyfan: 3.32, insectpeck: 3.54, gillflare: 3.46 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BluegillTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "macrochirus") return 148 + roll * 12;
  if (kind === "platehover") return 23.2 + roll * 4.0;
  if (kind === "colonyfan") return 24.4 + roll * 4.6;
  if (kind === "insectpeck") return 23.8 + roll * 5.8;
  if (kind === "gillflare") return 25.8 + roll * 5.2;
  return justFinished ? 20.8 + roll * 3.6 : 14.8 + roll * 2.8;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BluegillTrickKind | string | null) {
    if (musicOn) return "macrochirus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "macrochirus") {
      if (roll < 0.26) return "platehover";
      if (roll < 0.5) return "colonyfan";
      if (roll < 0.74) return "insectpeck";
      return "gillflare";
    }
    if (lastKind === "platehover") {
      if (roll < 0.26) return "macrochirus";
      if (roll < 0.5) return "colonyfan";
      if (roll < 0.74) return "insectpeck";
      return "gillflare";
    }
    if (lastKind === "colonyfan") {
      if (roll < 0.22) return "macrochirus";
      if (roll < 0.44) return "platehover";
      if (roll < 0.68) return "insectpeck";
      return "gillflare";
    }
    if (roll < 0.2) return "macrochirus";
    if (roll < 0.4) return "platehover";
    if (roll < 0.6) return "colonyfan";
    if (roll < 0.8) return "insectpeck";
    return "gillflare";
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
    return key === TRICK_KEY || key === "penny";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: BluegillHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: BluegillHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: BluegillHappyKind | string, x: number, facing: 1 | -1): BluegillHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denspenny";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denspenny" ? "sit" : name === "inkpenny" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denspennyPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspenny));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.012, rot: s * 1.22, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.87) {
      const hold = Math.sin(t * 1.88) + 0.09 * Math.sin(t * 3.76);
      return { lift: 0.012 + Math.abs(hold) * 0.0056, rot: 1.22 + hold * 0.72, dx: hold * 0.00030, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.87) / 0.13;
    return { lift: 0.0020 * (1 - s), rot: 0.12 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkpennyPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkpenny));
    if (u < 0.10) {
      const s = u / 0.10;
      return { lift: s * 0.052, rot: s * -2.55, dx: s * 0.00140, anim: "play" as TrickAnim };
    }
    if (u < 0.84) {
      const roll = Math.sin(t * 2.90) + 0.12 * Math.sin(t * 5.8);
      return { lift: 0.052 + Math.abs(roll) * 0.014, rot: -2.55 + roll * 2.25, dx: roll * 0.00160, anim: "play" as TrickAnim };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0048 * (1 - s), rot: -0.28 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function densplatePose(t: number) {
    return { lift: 0.0050 + Math.abs(Math.sin(t * 0.088)) * 0.0078, rot: Math.sin(t * 0.088) * 0.72, dx: Math.sin(t * 0.058) * 0.00036, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: BluegillHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denspenny") {
      const pose = denspennyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkpenny") {
      const pose = inkpennyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densplatePose(next.t);
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
export function beginTrick(kind: BluegillTrickKind, x: number, facing: 1 | -1): BluegillTrick {
    const anim: TrickAnim =
      kind === "macrochirus"
        ? "sit"
        : kind === "platehover"
          ? "sit"
          : kind === "colonyfan"
            ? "sit"
            : kind === "insectpeck"
              ? "talk"
              : kind === "gillflare"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "macrochirus" ? "hold" : "go",
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
export function macrochirusPose(t: number) {
    const breath = Math.sin(t * 0.015) + 0.011 * Math.sin(t * 0.048);
    const hover = Math.abs(Math.sin(t * 0.019));
    return { lift: 0.0031 + hover * 0.0064, rot: 0.05 + breath * 0.28 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0024 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.05 * (1 - u) };
  }
export function platehoverPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.platehover));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.0008, lift: s * 0.010, rot: s * -0.72 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.87) {
      const plate = Math.sin((u - 0.13) / 0.74 * Math.PI * 2.2);
      const shade = Math.sin(t * 1.18) + 0.08 * Math.sin(t * 2.4);
      return { x: fromX + face * (0.0008 + plate * 0.0016 + shade * 0.00014), lift: 0.009 + Math.abs(plate) * 0.006 + Math.abs(shade) * 0.0022, rot: (-0.72 + plate * 0.78 + shade * 0.42) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.0014 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function colonyfanPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.colonyfan));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0005, lift: s * 0.006, rot: s * 1.35 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const fan = Math.sin((u - 0.12) / 0.74 * Math.PI * 3.4);
      const bed = Math.sin(t * 2.55) + 0.09 * Math.sin(t * 5.1);
      return { x: fromX + face * (0.0005 + fan * 0.0014 + bed * 0.00018), lift: 0.005 + Math.abs(fan) * 0.009 + Math.abs(bed) * 0.0030, rot: (1.35 + fan * 1.55 + bed * 0.80) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.0010 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function insectpeckPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.insectpeck));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0012, lift: s * 0.028, rot: s * -1.45 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const peck = Math.sin((u - 0.11) / 0.73 * Math.PI * 4.6);
      const sip = Math.sin(t * 3.4) + 0.11 * Math.sin(t * 6.8);
      return { x: fromX + face * (0.0012 + peck * 0.0022 + sip * 0.00028), lift: 0.026 + Math.abs(peck) * 0.014 + Math.abs(sip) * 0.005, rot: (-1.45 + peck * 2.1 + sip * 0.95) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.0028 * (1 - s), rot: -0.16 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function gillflarePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.gillflare));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0016, lift: s * 0.040, rot: s * 2.35 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.83) {
      const flare = Math.sin((u - 0.10) / 0.73 * Math.PI * 3.6);
      const operc = Math.sin(t * 3.7) + 0.13 * Math.sin(t * 7.4);
      return { x: fromX + face * (0.0016 + flare * 0.0028 + operc * 0.00030), lift: 0.036 + Math.abs(flare) * 0.018 + Math.abs(operc) * 0.007, rot: (2.35 + flare * 2.0 + operc * 1.25) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.83) / 0.17);
    return { x: fromX + face * 0.0016 * (1 - s), lift: 0.0038 * (1 - s), rot: 0.22 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: BluegillTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "platehover" && trick.kind !== "colonyfan" && trick.kind !== "insectpeck" && trick.kind !== "gillflare") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "macrochirus") {
      if (next.t < MACROCHIRUS_HOLD) {
        const pose = macrochirusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MACROCHIRUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MACROCHIRUS_HOLD);
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
    if (next.kind === "platehover") {
      const pose = platehoverPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "colonyfan") {
      const pose = colonyfanPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "insectpeck") {
      const pose = insectpeckPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gillflarePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }