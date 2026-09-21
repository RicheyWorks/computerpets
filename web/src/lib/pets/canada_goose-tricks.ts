/** Vee ground tricks while idle — ultra-polish pass. House neighborly Anatidae / Branta canada goose desk life — graze / hiss / nestguard / honk / triumph / chinstrap / branta personality (graze terrestrial blotter-lawn graze without naming dabble or tip or upend or forage-bill, hiss threat-hiss neck-forward without naming snore or cronk or keeyer or softcrouch, nestguard brood-territory plant without naming brood or nest or softcrouch or hangup or cache, honk chin-strap neck-stretch call without naming gruntwhistle or carol or feebee or sing or cry or call or song, triumph triumph-ceremony wing-half and neck-bob without naming kettle or stoop or bind or fan or strut or tumble, chinstrap white-cheek chin-strap flash without naming capflash or speculum or rufous or flash-of-hawk, long branta Branta canadensis chin-strap desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid or kettle or stoop or bind or keeyer or patagial or tower or buteo or feebee or gargle or hangup or cache or capflash or seedhammer or poecile or runstop or listen or carol or tug or rufous or tailcock or turdus or dabble or upend or headshake or gruntwhistle or speculum or nodswim or anas or oil or dab or tip; window-play leaves goose alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake own their tricks; guest slug Vee / key canada_goose — accept "canada_goose" and "vee"; do NOT name a trick canada_goose or vee or goose or dabble or tip or hop or soar or mantle). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous canadensis / maxima / interior. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop canada_goose-tricks.js. Window-play unchanged. True Canada goose desk life — not mallard/robin/chickadee/hawk/owl/crow/raven clones. Drum owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via canada_goose.wav. Amplitudes raised toward Rui richness; denser waits/weights (BRANTA_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names canada_goose/vee/honk/loaf as bare ethogram-only trick kinds. Window-play unchanged. Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; Frill now Rue-dense; Cap now Rue-dense; next leftover Lattice / morel. Catalog 221. Never retouch Rui sprites. */
export const TRICK_KEY = "canada_goose";
export const TRICKS = ["graze", "hiss", "nestguard", "honk", "triumph", "chinstrap", "branta"] as const;
export const HAPPY = ["canadensis", "maxima", "interior"] as const;
export type CanadaGooseTrickKind = (typeof TRICKS)[number];
export type CanadaGooseHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "hold" | "release" | "done";
export type HappyPhase = "go" | "done";
export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  windowPlay?: boolean;
  card?: boolean;
  cmd?: string;
};
export type HappyFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
};
export type CanadaGooseTrick = {
  kind: string;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};
export type CanadaGooseHappy = {
  kind: string;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  dx?: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};
export const HAPPY_DUR: Record<CanadaGooseHappyKind, number> = { canadensis: 1.69, maxima: 1.84, interior: 1.75 };
export const BRANTA_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<CanadaGooseTrickKind, number> = {
  branta: BRANTA_HOLD + RELEASE_S,
  graze: 2.54,
  hiss: 2.48,
  nestguard: 2.56,
  honk: 2.60,
  triumph: 2.42,
  chinstrap: 2.38,
};

export function canStart(state: TrickFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: TrickFlags | null | undefined) {
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CanadaGooseTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "branta") return 40 + roll * 26;
  if (kind === "graze" || kind === "hiss" || kind === "nestguard" || kind === "honk" || kind === "triumph" || kind === "chinstrap") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CanadaGooseTrickKind | string | null) {
  if (musicOn) return "branta";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) => (k === "branta" ? 0.72 : k === "graze" || k === "honk" ? 1.28 : k === "hiss" || k === "triumph" ? 1.18 : 1.08));
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "graze";
}

export function happyCanStart(state: HappyFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function happyShouldAbort(state: HappyFlags | null | undefined) {
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

export function wantsThankYou(key: string | null | undefined) {
  return key === TRICK_KEY || key === "vee";
}

export function startThankYou(
  key: string | null | undefined,
  lastKind: CanadaGooseHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: HappyFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CanadaGooseHappyKind | null);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CanadaGooseHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CanadaGooseHappyKind | string, x: number, facing: 1 | -1): CanadaGooseHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CanadaGooseHappyKind) : "canadensis";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "maxima" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function canadensisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.canadensis));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 7.2, rot: s * 14.4, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 5.5) + 0.26 * Math.sin(t * 11.2);
    return { lift: 7.2 + Math.abs(flash) * 6, rot: 14.4 + flash * 9.6, dx: flash * 2.64, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function maximaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.maxima));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 16.8, rot: s * -14.4, dx: s * 3.6, anim: "play" as TrickAnim };
  }
  if (u < 0.85) {
    const wriggle = Math.sin(t * 4.2) + 0.25 * Math.sin(t * 7.6);
    return { lift: 14.4 + Math.abs(wriggle) * 12, rot: -12 + wriggle * 16.8, dx: wriggle * 4.8, anim: "play" as TrickAnim };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function interiorPose(t: number) {
  return {
    lift: 3.6 + Math.abs(Math.sin(t * 4.0)) * 8.4,
    rot: Math.sin(t * 3.4) * 10.8,
    dx: Math.sin(t * 2.6) * 3.6,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: CanadaGooseHappy | null | undefined, dt: number, flags?: HappyFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done" as HappyPhase, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind as CanadaGooseHappyKind];
  const pose =
    next.kind === "canadensis"
      ? canadensisPose(next.t)
      : next.kind === "maxima"
        ? maximaPose(next.t)
        : interiorPose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (next.t >= hold) return Object.assign({}, next, { phase: "done" as HappyPhase, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: CanadaGooseTrickKind, x: number, facing: 1 | -1): CanadaGooseTrick {
  const anim: TrickAnim =
    kind === "branta" || kind === "nestguard" || kind === "chinstrap"
      ? "sit"
      : kind === "graze" || kind === "hiss" || kind === "triumph"
        ? "play"
        : kind === "honk"
          ? "talk"
          : "sit";
  return {
    kind,
    phase: kind === "branta" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function brantaPose(t: number) {
  const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
  const soft = Math.abs(Math.sin(t * 0.9));
  return { lift: 2.4 + soft * 4.8 + Math.abs(breath) * 1.8, rot: -2.4 + breath * 4.8 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
}

export function grazePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.graze));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * -9.6, rot: s * 21.6 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const nibble = Math.sin(t * 3.4) + 0.22 * Math.sin(t * 6.8);
    return {
      x: fromX + face * nibble * 3.6,
      lift: -9.6 + Math.abs(nibble) * 7.2,
      rot: (21.6 + nibble * 6) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: -3.6 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function hissPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hiss));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 4.8, lift: s * -7.2, rot: s * -19.2 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const flare = Math.sin(t * 6.2) + 0.28 * Math.sin(t * 12.4);
    return {
      x: fromX + face * (4.8 + flare * 3.6),
      lift: -7.2 + Math.abs(flare) * 6,
      rot: (-19.2 + flare * 9.6) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 4.8 * (1 - s), lift: -2.4 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function nestguardPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nestguard));
  const face = facing == null ? 1 : facing;
  if (u < 0.11) {
    const s = smoothstep(u / 0.11);
    return { x: fromX, lift: s * 9.6, rot: s * 12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const watch = Math.sin(t * 1.15) + 0.18 * Math.sin(t * 2.4);
    return {
      x: fromX + face * watch * 3,
      lift: 9.6 + Math.abs(watch) * 4.8,
      rot: (12 + watch * 7.2) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3.6 * (1 - s), rot: 3.6 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function honkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.honk));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 12, rot: s * -14.4 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.10) / 0.76;
    const phrase = Math.sin(s * Math.PI * 3.0);
    const settle = Math.abs(Math.sin(s * Math.PI * 6.0));
    return {
      x: fromX + face * (4 * s + phrase * 3.6),
      lift: 10.8 + settle * 6,
      rot: (-14.4 + phrase * 12) * face,
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 4 * (1 - s), lift: 4.8 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function chinstrapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chinstrap));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 8.4, rot: s * 16.8 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const flash = Math.sin(t * 5.2) + 0.28 * Math.sin(t * 10.4);
    return {
      x: fromX + face * flash * 3.6,
      lift: 7.2 + Math.abs(flash) * 6,
      rot: (16.8 + flash * 12) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: 3.6 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function triumphPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.triumph));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 14.4, rot: s * -7.2 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const bob = Math.sin(t * 4.8) + 0.3 * Math.sin(t * 9.6);
    return {
      x: fromX + face * bob * 4.2,
      lift: 13.2 + Math.abs(bob) * 8.4,
      rot: (-7.2 + bob * 14.4) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: 4.8 * (1 - s), rot: -2.4 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: CanadaGooseTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  const short =
    trick.kind === "graze" ||
    trick.kind === "hiss" ||
    trick.kind === "nestguard" ||
    trick.kind === "honk" ||
    trick.kind === "chinstrap" ||
    trick.kind === "triumph";
  if (shouldAbort(flags) && !short) {
    return Object.assign({}, trick, { phase: "done" as TrickPhase, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "branta") {
    if (next.t < BRANTA_HOLD) {
      const pose = brantaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BRANTA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BRANTA_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return Object.assign({}, next, { phase: "done" as TrickPhase, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  const hold = DUR[next.kind as CanadaGooseTrickKind];
  const u = next.t / hold;
  const from = trick.fromX != null ? trick.fromX : trick.x;
  const poseFn: Record<string, (t: number, fromX: number, facing: 1 | -1) => { x: number; lift: number; rot: number; anim: TrickAnim }> = {
    graze: grazePose,
    hiss: hissPose,
    nestguard: nestguardPose,
    honk: honkPose,
    chinstrap: chinstrapPose,
    triumph: triumphPose,
  };
  const fn = poseFn[next.kind] || grazePose;
  const pose = fn(next.t, from, trick.facing as 1 | -1);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return Object.assign({}, next, { phase: "done" as TrickPhase, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}
