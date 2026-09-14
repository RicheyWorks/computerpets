/** Silver ground tricks while idle — ultra-polish pass. House neighborly Anguilliformes / Anguilla rostrata American Eel catadromous mucus-coated desk life (american_eel / Silver) — glasscrawl / mucuscoat / nightmigrate / gravelhide / sargasso / yellowphase / rostrata personality (glasscrawl wet land glass-eel crawl pulse without naming glass or crawl or land or wet or pulse or walk or eel or slip or slide or mud or shore or bank alone, mucuscoat mucus slime settle coat without naming mucus or coat or slime or gloss or oil or grease or skin or wet or slick or polish or slip alone, nightmigrate nocturnal migrate undulation without naming night or migrate or undul or wave or swim or cruise or ocean or sea or travel or journey or streak alone, gravelhide gravel substrate hide tuck without naming gravel or hide or tuck or substrate or bury or dig or nest or stone or sand or silt or rest or sleep or sit alone, sargasso Sargasso-sea spawn-bound run tell without naming sargasso or spawn or sea or ocean or gyre or atlantic or natal or home or travel alone, yellowphase yellow-eel freshwater grow phase tell without naming yellow or phase or grow or freshwater or river or creek or pigment or olive alone, long rostrata Anguilla rostrata Anguilliformes American eel hush hold (THE rostrata sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or oralclamp or keratinrasp or undulglide or stonenest or anadromous or sevengill or marinus or densround or inkround or densdisk or densdisc or rostrumscan or filterram or rivercruise or eggcast or ampullae or cartilaginous or spathula or densspoon or inkspoon or densrostrum or tapetumglow or duskcruise or gravelspawn or softfinhover or canine or glassy or vitreus or densnight or inknight or densglow or weedambush or scurve or toothclamp or torpedoglide or duckbill or lateral or lucius or denslance or inklance or denstorpedo or tigerbar or schoolhover or duskrise or ribbonspawn or flavescens or densbar or inkbar or denstiger or platehover or colonyfan or insectpeck or gillflare or macrochirus or denspenny or inkpenny or densplate or barbelprobe or cavitynest or mudcloud or caudalthrash or ictalurus or denswhisk or inkwhisk or densbarbel or mudhush or driftfeed or insectrise or reddscrape or vermicflash or fontinalis or densspeck or inkspeck or densredd or coverstrike or bedfan or surboil or latline or salmoides or denslunge or inklunge or densgape or densslide or denslid or denspeak or densbeak or densjaw or denslevee or denspike or denshift or denswink or densdash or house_centipede or hastebare or american_eelbare or silverbare as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play STRIKE unchanged if already fine; Round owns oralclamp/keratinrasp/undulglide/stonenest/anadromous/sevengill/marinus — do NOT reuse undulglide/anadromous; Night owns densnight themes — nightmigrate ok; Door moray is reef peer; Slick owns denslide; Whisk owns mudhush — do NOT reuse; guest slug Silver / key american_eel only for isKey matching — accept "american_eel" and "silver"; do NOT name a trick "american_eel" or "silver" or "lamprey" or "round" or "eel" or "swim" or "still" or "mudhush" or "undulglide" or "anadromous" or "house_centipede" or "haste") — not Round Petromyzon sea-lamprey/Petromyzontiformes life, not Door Gymnothorax moray life, not Spoon Polyodon paddlefish life, not Night Sander walleye life, not Lance Esox pike life, not Whisk Ictalurus mudhush life, not Haste house_centipede next, not creek fish clones, not Rui red_panda life. Glasscrawl land-crawl without naming crawl alone, mucuscoat mucus without naming slime alone, nightmigrate night-run without naming migrate alone, gravelhide gravel without naming hide alone, sargasso Sargasso without naming spawn alone, yellowphase yellow-eel without naming yellow alone, rostrata long sit_hold on the Anguilla hush (THE rostrata sit_hold tell); denssilver / inksilver / densglass thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop american_eel-tricks.js. Window-play STRIKE unchanged. Ethogram softs + freeze — never names swim/silver/still/wait/sit/american_eel as bare ethogram-only trick kinds. True American Eel Anguilla rostrata Anguilliformes desk life only — catadromous bony eel distinct from Round agnathan oral-disk, Door moray reef, Whisk mudhush, Slick denslide, Haste house_centipede next, creek peers, Ink, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Haste / house_centipede. No cry inventing — thank-yous are silent desk motion only; american_eel.wav EXISTS so prefersHouseCry adds american_eel after lamprey. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "american_eel";
export const TRICKS = ["glasscrawl", "mucuscoat", "nightmigrate", "gravelhide", "sargasso", "yellowphase", "rostrata"] as const;
export const HAPPY = ["denssilver", "inksilver", "densglass"] as const;
export type AmericanEelTrickKind = (typeof TRICKS)[number];
export type AmericanEelHappyKind = (typeof HAPPY)[number];
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

export type AmericanEelTrick = {
  kind: AmericanEelTrickKind;
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

export type AmericanEelHappy = {
  kind: AmericanEelHappyKind;
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

export const HAPPY_DUR = { denssilver: 1.70, inksilver: 1.84, densglass: 1.76 } as const;
export const ROSTRATA_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  rostrata: ROSTRATA_HOLD + RELEASE_S,
  glasscrawl: 2.48,
  mucuscoat: 2.56,
  nightmigrate: 2.42,
  gravelhide: 2.38,
  sargasso: 2.40,
  yellowphase: 2.44,
} as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AmericanEelTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "rostrata") return 40 + roll * 26;
  if (kind === "sargasso" || kind === "gravelhide" || kind === "glasscrawl") return 12.8 + roll * 9.4;
  if (kind === "mucuscoat" || kind === "nightmigrate" || kind === "yellowphase") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}


export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: AmericanEelTrickKind | string | null) {
  if (musicOn) return "rostrata" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "rostrata") {
    if (roll < 0.17) return "glasscrawl" as const;
    if (roll < 0.33) return "mucuscoat" as const;
    if (roll < 0.49) return "nightmigrate" as const;
    if (roll < 0.65) return "gravelhide" as const;
    if (roll < 0.83) return "sargasso" as const;
    return "yellowphase" as const;
  }
  if (lastKind === "glasscrawl") {
    if (roll < 0.16) return "rostrata" as const;
    if (roll < 0.32) return "mucuscoat" as const;
    if (roll < 0.48) return "nightmigrate" as const;
    if (roll < 0.64) return "gravelhide" as const;
    if (roll < 0.82) return "sargasso" as const;
    return "yellowphase" as const;
  }
  if (lastKind === "mucuscoat") {
    if (roll < 0.14) return "rostrata" as const;
    if (roll < 0.3) return "glasscrawl" as const;
    if (roll < 0.46) return "nightmigrate" as const;
    if (roll < 0.62) return "gravelhide" as const;
    if (roll < 0.8) return "sargasso" as const;
    return "yellowphase" as const;
  }
  if (lastKind === "nightmigrate") {
    if (roll < 0.15) return "rostrata" as const;
    if (roll < 0.31) return "glasscrawl" as const;
    if (roll < 0.47) return "mucuscoat" as const;
    if (roll < 0.63) return "gravelhide" as const;
    if (roll < 0.81) return "sargasso" as const;
    return "yellowphase" as const;
  }
  if (lastKind === "gravelhide") {
    if (roll < 0.16) return "rostrata" as const;
    if (roll < 0.32) return "glasscrawl" as const;
    if (roll < 0.48) return "mucuscoat" as const;
    if (roll < 0.64) return "nightmigrate" as const;
    if (roll < 0.82) return "sargasso" as const;
    return "yellowphase" as const;
  }
  if (lastKind === "sargasso") {
    if (roll < 0.15) return "rostrata" as const;
    if (roll < 0.31) return "glasscrawl" as const;
    if (roll < 0.47) return "mucuscoat" as const;
    if (roll < 0.63) return "nightmigrate" as const;
    if (roll < 0.81) return "gravelhide" as const;
    return "yellowphase" as const;
  }
  if (lastKind === "yellowphase") {
    if (roll < 0.16) return "rostrata" as const;
    if (roll < 0.32) return "glasscrawl" as const;
    if (roll < 0.48) return "mucuscoat" as const;
    if (roll < 0.64) return "nightmigrate" as const;
    if (roll < 0.82) return "gravelhide" as const;
    return "sargasso" as const;
  }
  if (roll < 0.14) return "rostrata" as const;
  if (roll < 0.28) return "glasscrawl" as const;
  if (roll < 0.42) return "mucuscoat" as const;
  if (roll < 0.56) return "nightmigrate" as const;
  if (roll < 0.7) return "gravelhide" as const;
  if (roll < 0.85) return "sargasso" as const;
  return "yellowphase" as const;
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
  return key === TRICK_KEY || key === "silver";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: AmericanEelHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: AmericanEelHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: AmericanEelHappyKind | string, x: number, facing: 1 | -1): AmericanEelHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as AmericanEelHappyKind) : "denssilver";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denssilver" ? "sit" : name === "inksilver" ? "play" : "sit") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denssilverPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssilver));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const flash = Math.sin(t * 2.2);
    return {
      lift: 2.8 + Math.abs(flash) * 1.4,
      rot: 12 + flash * 8,
      dx: flash * 0.08,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function inksilverPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksilver));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const wriggle = Math.sin(t * 2.6);
    return {
      lift: 3.4 + Math.abs(wriggle) * 1.6,
      rot: -14 + wriggle * 10,
      dx: wriggle * 0.12,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function densglassPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: AmericanEelHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denssilver") {
    const pose = denssilverPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inksilver") {
    const pose = inksilverPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densglassPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: AmericanEelTrickKind, x: number, facing: 1 | -1): AmericanEelTrick {
  const anim: TrickAnim =
    kind === "rostrata"
      ? "sit"
      : kind === "glasscrawl"
        ? "talk"
        : kind === "mucuscoat"
          ? "play"
          : kind === "nightmigrate"
            ? "sit"
            : kind === "gravelhide"
              ? "play"
              : kind === "sargasso"
                ? "talk"
                : kind === "yellowphase"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "rostrata" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function rostrataPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function glasscrawlPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.glasscrawl));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const bar = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + bar * 0.16),
      lift: 2.8 + Math.abs(bar) * 1.5,
      rot: face * (-12 + bar * 10),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function nightmigratePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nightmigrate));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function mucuscoatPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mucuscoat));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const cloud = Math.sin(t * 3.0);
    return {
      x: fromX + face * (0.6 + cloud * 0.18),
      lift: 3.0 + Math.abs(cloud) * 1.8,
      rot: face * (14 + cloud * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.5 * (1 - s),
    rot: face * (5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function yellowphasePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.yellowphase));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const thrash = Math.sin(t * 3.6);
    return {
      x: fromX + face * (1.0 + thrash * 0.22),
      lift: 3.6 + Math.abs(thrash) * 2.0,
      rot: face * (18 + thrash * 14),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 1.0 * (1 - s),
    lift: 1.6 * (1 - s),
    rot: face * (6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function sargassoPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sargasso));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const hang = Math.sin(t * 2.0);
    return {
      x: fromX + face * (0.5 + hang * 0.1),
      lift: 2.8 + Math.abs(hang) * 1.2,
      rot: face * (11 + hang * 8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.5 * (1 - s),
    lift: 1.3 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function gravelhidePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gravelhide));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: AmericanEelTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "glasscrawl" &&
    trick.kind !== "mucuscoat" &&
    trick.kind !== "nightmigrate" &&
    trick.kind !== "gravelhide" &&
    trick.kind !== "sargasso" &&
    trick.kind !== "yellowphase"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "rostrata") {
    if (next.t < ROSTRATA_HOLD) {
      const pose = rostrataPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ROSTRATA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ROSTRATA_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "glasscrawl") {
    const pose = glasscrawlPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mucuscoat") {
    const pose = mucuscoatPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nightmigrate") {
    const pose = nightmigratePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gravelhide") {
    const pose = gravelhidePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sargasso") {
    const pose = sargassoPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = yellowphasePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

