/** Half ground tricks while idle — ultra-polish pass. House neighborly Platyhelminthes / Turbellaria Tiger Planarian Dugesia Girardia tigrina desk life (planarian / Half) — ciliaryglide / lightflee / preywrap / regensplit / auriclesense / pharynxprobe / dugesia personality (ciliaryglide ventral cilia mucus-sheet glide without naming glide or crawl or mucus or cilia or slide or swim or sheet alone as wait, lightflee photonegative turn from light without naming light or flee or photonegative or shade or turn or eye or spot alone as wait, preywrap mucus prey wrap without naming wrap or prey or mucus or trap or feed or sip or suck or pharynx alone as wait — Thread nematode owns pharynxpump, pharynxprobe ok, regensplit regenerate fission cue desk-safe without naming grow or fission or split or bud or regenerate or wait alone as wait, auriclesense auricle head-lobe chemorecept sense without naming auricle or sense or lobe or head or chemorecept or smell or taste alone as wait — Silver/leech owns bare auricle, auriclesense ok, pharynxprobe eversible pharynx feed-probe without naming pharynx or probe or pump or feed or suck or sip or mouth alone as wait — Thread owns pharynxpump, pharynxprobe ok, long dugesia Girardia Dugesia tigrina tiger planarian hush hold (THE dugesia sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or cryptotun or clawamble or mosssip or waterbearroll or styletpierce or anhydro or eutardigrada or denstun or inktun or densclaw or furculaflick or antennawalk or moistclingsoil or foldtuck or collophore or denspring or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or oralpapilla or onychophore or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or clitellum or setaebrace or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or benzoquinone or metachronal or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or tunstate or clawgrip or mossfilm or styletprobe or hypsibius or sinusoid or dauerrest or pharynxpump or thrashturn or elegans or denshalf or inkhalf or denscilia or leafhush or cast or crawl or still or roll or walk or sit or hop or spring or vault or earthworm or pillbug or armor or millipede or link or house_centipede or haste or velvet_worm or jet or springtail or tardigrade or tun or nematode or thread or planarian or half or split or glide as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Tun owns cryptotun/clawamble/mosssip/waterbearroll/styletpierce/anhydro/eutardigrada — do NOT reuse; Hop owns furculaflick/antennawalk/moistclingsoil/foldtuck/collophore/denspring/orchesella — do NOT reuse; Jet owns slimejet/lobopod/antennawhip/preyharpoon/oralpapilla/onychophore/peripatus — do NOT reuse; Cast owns peristalse/castheap/surfacerise/soilanchor/clitellum/setaebrace/terrestris — do NOT reuse; Thread owns sinusoid/dauerrest/pharynxpump/thrashturn/elegans — do NOT reuse pharynxpump; Silver owns mucuscoat; header forbids bare planarian/half/split/glide/still and bare auricle/pharynxpump; guest slug Half / key planarian only for isKey matching — accept "planarian" and "half"; do NOT name a trick "planarian" or "half" or "tardigrade" or "tun" or "springtail" or "hop" or "velvet_worm" or "jet" or "earthworm" or "cast" or "pillbug" or "armor" or "millipede" or "link" or "house_centipede" or "haste" or "nematode" or "thread" or "split" or "glide" or "still" or "vault" or "spring") — not Tun Eutardigrada tardigrade/Tardigrada life, not Hop Orchesella springtail/Collembola life, not Jet Peripatus velvet-worm/Onychophora life, not Cast Lumbricus earthworm/Annelida life, not Thread Caenorhabditis nematode/Nematoda next, not Rui red_panda life. Ciliaryglide without naming glide alone, lightflee without naming light alone, preywrap without naming wrap alone, regensplit without naming split alone, auriclesense without naming auricle alone, pharynxprobe without naming pharynxpump alone, dugesia long sit_hold on the Dugesia hush (THE dugesia sit_hold tell); denshalf / inkhalf / denscilia thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop planarian-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names half/split/glide/still/wait/sit/planarian as bare ethogram-only trick kinds. True Tiger Planarian Dugesia Girardia tigrina desk life only — ventral cilia mucus-sheet glide, photonegative lightflee, mucus prey wrap, regenerate fission cue, auricle chemorecept sense, eversible pharynx feed-probe, and Dugesia hush; distinct from Tun water-bear/Tardigrada claw/tun, Hop springtail/Collembola furcula leap, Jet velvet worm/Onychophora slime-jet, Cast earthworm/Annelida peristalsis, Thread nematode next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Thread / nematode. No cry inventing — thank-yous are silent desk motion only; planarian.wav EXISTS so prefersHouseCry adds planarian after tardigrade. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "planarian";
export const TRICKS = ["ciliaryglide", "lightflee", "preywrap", "regensplit", "auriclesense", "pharynxprobe", "dugesia"] as const;
export const HAPPY = ["denshalf", "inkhalf", "denscilia"] as const;
export type PlanarianTrickKind = (typeof TRICKS)[number];
export type PlanarianHappyKind = (typeof HAPPY)[number];
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

export type PlanarianTrick = {
  kind: PlanarianTrickKind;
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

export type PlanarianHappy = {
  kind: PlanarianHappyKind;
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

export const HAPPY_DUR = { denshalf: 1.70, inkhalf: 1.84, denscilia: 1.76 } as const;
export const DUGESIA_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  dugesia: DUGESIA_HOLD + RELEASE_S,
  ciliaryglide: 2.48,
  lightflee: 2.42,
  preywrap: 2.40,
  regensplit: 2.44,
  auriclesense: 2.38,
  pharynxprobe: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PlanarianTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "dugesia") return 40 + roll * 26;
  if (kind === "auriclesense" || kind === "lightflee" || kind === "ciliaryglide") return 12.8 + roll * 9.4;
  if (kind === "preywrap" || kind === "regensplit" || kind === "pharynxprobe") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: PlanarianTrickKind | string | null) {
  if (musicOn) return "dugesia" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "dugesia") {
    if (roll < 0.17) return "ciliaryglide" as const;
    if (roll < 0.33) return "lightflee" as const;
    if (roll < 0.49) return "preywrap" as const;
    if (roll < 0.65) return "regensplit" as const;
    if (roll < 0.83) return "auriclesense" as const;
    return "pharynxprobe" as const;
  }
  if (lastKind === "ciliaryglide") {
    if (roll < 0.16) return "dugesia" as const;
    if (roll < 0.32) return "lightflee" as const;
    if (roll < 0.48) return "preywrap" as const;
    if (roll < 0.64) return "regensplit" as const;
    if (roll < 0.82) return "auriclesense" as const;
    return "pharynxprobe" as const;
  }
  if (lastKind === "lightflee") {
    if (roll < 0.14) return "dugesia" as const;
    if (roll < 0.3) return "ciliaryglide" as const;
    if (roll < 0.46) return "preywrap" as const;
    if (roll < 0.62) return "regensplit" as const;
    if (roll < 0.8) return "auriclesense" as const;
    return "pharynxprobe" as const;
  }
  if (lastKind === "preywrap") {
    if (roll < 0.15) return "dugesia" as const;
    if (roll < 0.31) return "ciliaryglide" as const;
    if (roll < 0.47) return "lightflee" as const;
    if (roll < 0.63) return "regensplit" as const;
    if (roll < 0.81) return "auriclesense" as const;
    return "pharynxprobe" as const;
  }
  if (lastKind === "regensplit") {
    if (roll < 0.16) return "dugesia" as const;
    if (roll < 0.32) return "ciliaryglide" as const;
    if (roll < 0.48) return "lightflee" as const;
    if (roll < 0.64) return "preywrap" as const;
    if (roll < 0.82) return "auriclesense" as const;
    return "pharynxprobe" as const;
  }
  if (lastKind === "auriclesense") {
    if (roll < 0.15) return "dugesia" as const;
    if (roll < 0.31) return "ciliaryglide" as const;
    if (roll < 0.47) return "lightflee" as const;
    if (roll < 0.63) return "preywrap" as const;
    if (roll < 0.81) return "regensplit" as const;
    return "pharynxprobe" as const;
  }
  if (lastKind === "pharynxprobe") {
    if (roll < 0.16) return "dugesia" as const;
    if (roll < 0.32) return "ciliaryglide" as const;
    if (roll < 0.48) return "lightflee" as const;
    if (roll < 0.64) return "preywrap" as const;
    if (roll < 0.82) return "regensplit" as const;
    return "auriclesense" as const;
  }
  if (roll < 0.14) return "dugesia" as const;
  if (roll < 0.28) return "ciliaryglide" as const;
  if (roll < 0.42) return "lightflee" as const;
  if (roll < 0.56) return "preywrap" as const;
  if (roll < 0.7) return "regensplit" as const;
  if (roll < 0.85) return "auriclesense" as const;
  return "pharynxprobe" as const;
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
  return key === TRICK_KEY || key === "half";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: PlanarianHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: PlanarianHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: PlanarianHappyKind | string, x: number, facing: 1 | -1): PlanarianHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as PlanarianHappyKind) : "denshalf";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denshalf" ? "sit" : name === "inkhalf" ? "play" : "sit") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denshalfPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshalf));
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

export function inkhalfPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhalf));
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

export function densciliaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: PlanarianHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denshalf") {
    const pose = denshalfPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkhalf") {
    const pose = inkhalfPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densciliaPose(next.t);
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

export function beginTrick(kind: PlanarianTrickKind, x: number, facing: 1 | -1): PlanarianTrick {
  const anim: TrickAnim =
    kind === "dugesia"
      ? "sit"
      : kind === "ciliaryglide"
        ? "play"
        : kind === "pharynxprobe"
          ? "play"
          : kind === "lightflee"
            ? "play"
            : kind === "preywrap"
              ? "sit"
              : kind === "regensplit"
                ? "sit"
                : kind === "auriclesense"
                  ? "talk"
                  : "sit";
  return {
    kind,
    phase: kind === "dugesia" ? "hold" : "go",
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

export function dugesiaPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function ciliaryglidePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ciliaryglide));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bar = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + bar * 0.16),
      lift: 2.8 + Math.abs(bar) * 1.5,
      rot: face * (-12 + bar * 10),
      anim: "play" as TrickAnim,
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

export function lightfleePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lightflee));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "play" as TrickAnim,
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

export function preywrapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.preywrap));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const hang = Math.sin(t * 2.0);
    return {
      x: fromX + face * (0.5 + hang * 0.1),
      lift: 2.8 + Math.abs(hang) * 1.2,
      rot: face * (11 + hang * 8),
      anim: "sit" as TrickAnim,
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

export function regensplitPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.regensplit));
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

export function auriclesensePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.auriclesense));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "talk" as TrickAnim,
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

export function pharynxprobePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pharynxprobe));
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

export function stepTrick(trick: PlanarianTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "ciliaryglide" &&
    trick.kind !== "lightflee" &&
    trick.kind !== "preywrap" &&
    trick.kind !== "regensplit" &&
    trick.kind !== "auriclesense" &&
    trick.kind !== "pharynxprobe"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "dugesia") {
    if (next.t < DUGESIA_HOLD) {
      const pose = dugesiaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < DUGESIA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - DUGESIA_HOLD);
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
  if (next.kind === "ciliaryglide") {
    const pose = ciliaryglidePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lightflee") {
    const pose = lightfleePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "preywrap") {
    const pose = preywrapPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "regensplit") {
    const pose = regensplitPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "auriclesense") {
    const pose = auriclesensePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pharynxprobePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
