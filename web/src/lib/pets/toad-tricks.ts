/** Pebble ground tricks while idle — ultra-polish pass. House neighborly Bufonidae American-toad desk life — verruca / burrow / parotoid / tubercle / bufonid / unken / cranial personality (warty short-hop jolt, fossorial dig-in, parotoid gland hush, metatarsal tubercle scrape, plump dry-dish hold, unkenreflex arch, cranial-crest tip — never named wait or wake or still or hop or puff or pebble or dig or toad or frog or reed or gular or nictitate or tympanum or iliac or lentic or toepad or webbing or bank or blotter or plop or stone or crevice or rosy or mesa or arroyo as trick kinds; window-play PUFF owns puff; window-play leave pebble owns the leave word; ethogram-old hop/puff/still own those words; Blush rosy_boa owns pebble as a trick; MiningBee/window DIG own dig; Reed owns gular/nictitate/tympanum/iliac/lentic/toepad/webbing; guest slug Pebble / key toad only for isKey matching — accept "toad" and "pebble"; do NOT name a trick "toad" or "pebble" or "wait" or "wake" or "still" or "hop" or "puff" or "dig" or "frog" or "reed" or "gular" or "lentic" or "plop" or "bank" or "blotter" or "stone" or "crevice" or "unken-as-wait" or "cranial-as-hop") — not Reed gular/nictitate/tympanum/iliac/lentic/toepad/webbing Anura green-frog, not Arca lorica/tegument/ampoule/bradyzoite/cryptobiosis sealed-vault, not Bloom gill/amble/mend/smile/plume axolotl, not Ink soak/tuck/crane/plod/paddle turtle, not Hush silhouette/adumbrate/occultation/antumbra/caligo shade-umbra, not Beacon lodestone/flux/azimuth/dipole/remanence field-magnet, not Brine salt-brine, not Knot junction-weave, not Dusk twilight-belt, not Shard living-crystal, not Drift methane-cloud, not Choir chord-body, not Gleam lamp-drinker, not Blush pebble/crevice/rosy/mesa/arroyo rosy-boa; never named wait / wake / still / hop / puff / pebble / dig / toad / frog / reed / gular / nictitate / tympanum / iliac / lentic / toepad / webbing / chorus / rivulet / spring / lorica / tegument — Echo/Quill birds — do not copy. verruca warty short-hop jolt without naming hop, burrow fossorial dig-in without naming dig, parotoid parotoid-gland hush without naming puff, tubercle metatarsal-tubercle scrape-push, bufonid plump dry-dish metabolic hold, unken unkenreflex belly-arch (THE bufonid defensive-display tell), cranial cranial-crest tip (THE Anaxyrus americanus crest tell); loam / knurl / plump thank-yous. Feed-happy after eat. Card-open freeze and window-play PUFF do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop toad-tricks.js. Window-play PUFF unchanged. Ethogram softs + freeze — never names hop/puff/still as trick kinds. Hinge owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights (BUFONID_HOLD=11.2 RELEASE_S=1.18). Next leftover Latch / leech. prefersHouseCry via toad.wav. */
export const TRICK_KEY = "toad";
export const TRICKS = ["verruca", "burrow", "parotoid", "tubercle", "bufonid", "unken", "cranial"] as const;
export const HAPPY = ["loam", "knurl", "plump"] as const;
export type ToadTrickKind = (typeof TRICKS)[number];
export type ToadHappyKind = (typeof HAPPY)[number];
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

export type ToadTrick = {
  kind: ToadTrickKind;
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

export type ToadHappy = {
  kind: ToadHappyKind;
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

export const HAPPY_DUR = { loam: 1.62, knurl: 1.74, plump: 1.69 } as const;
export const BUFONID_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  bufonid: BUFONID_HOLD + RELEASE_S,
  verruca: 2.28,
  burrow: 2.42,
  parotoid: 2.34,
  tubercle: 2.38,
  unken: 2.36,
  cranial: 2.31,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ToadTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bufonid") return 40 + roll * 26;
  if (kind === "unken" || kind === "cranial") return 12.8 + roll * 9.4;
  if (kind === "verruca" || kind === "burrow" || kind === "parotoid" || kind === "tubercle") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: ToadTrickKind | string | null): ToadTrickKind {
  if (musicOn) return "bufonid";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "bufonid" ? 0.72 : k === "unken" || k === "cranial" ? 1.28 : k === "verruca" || k === "burrow" || k === "parotoid" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "verruca";
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
  return key === TRICK_KEY || key === "pebble";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: ToadHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as ToadHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ToadHappyKind | null, rand?: number) {
  const roll = rand == null ? Math.random() : rand;
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  return list[Math.floor(roll * list.length) % list.length] as ToadHappyKind;
}

export function beginHappy(kind: ToadHappyKind | string, x: number, facing: 1 | -1): ToadHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as ToadHappyKind) : "loam";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "loam" ? "sit" : name === "knurl" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function loamPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.loam));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.82) {
    const tick = Math.sin(t * 1.72);
    return {
      lift: 3.36 + Math.abs(tick) * 1.68,
      rot: 14.4 + tick * 9.6,
      dx: 0,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function knurlPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.knurl));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 4.08, rot: s * -16.8, dx: s * 0.18, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const wart = Math.sin(t * 2.1);
    return {
      lift: 4.08 + Math.abs(wart) * 1.92,
      rot: -16.8 + wart * 12,
      dx: 0.096,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 2.64 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function plumpPose(t: number) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
    rot: Math.sin(t * 0.624) * 7.2,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: ToadHappy, dt: number, flags: TrickFlags): ToadHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ToadHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "loam") {
    const pose = loamPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "knurl") {
    const pose = knurlPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = plumpPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: ToadTrickKind | string, x: number, facing: 1 | -1): ToadTrick {
  const anim: TrickAnim =
    kind === "bufonid"
      ? "sit"
      : kind === "verruca"
        ? "play"
        : kind === "burrow"
          ? "sit"
          : kind === "parotoid"
            ? "sit"
            : kind === "tubercle"
              ? "walk"
              : kind === "unken"
                ? "play"
                : kind === "cranial"
                  ? "talk"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as ToadTrickKind) : "verruca",
    phase: kind === "bufonid" ? "hold" : "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function bufonidPose(t: number) {
  return {
    lift: 2.88 + Math.abs(Math.sin(t * 0.504)) * 1.44,
    rot: -0.216 + Math.sin(t * 0.168) * 4.8,
    anim: "sit" as TrickAnim,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.216 * (1 - u) };
}

export function verrucaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.verruca));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.84, rot: s * -9.6 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.48) {
    const s = (u - 0.16) / 0.32;
    const jolt = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * jolt * 0.42,
      lift: 3.84 + Math.abs(jolt) * 1.68,
      rot: facing * (-9.6 + jolt * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    const wart = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX,
      lift: 2.64 + Math.abs(wart) * 1.08,
      rot: facing * (4.8 + wart * 9.6),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.68 * (1 - s),
    rot: facing * (2.4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function burrowPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.burrow));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.92, rot: s * 9.6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.14) / 0.56;
    const dig = Math.sin(s * Math.PI * 3.4);
    const sink = smoothstep(s);
    return {
      x: fromX + facing * dig * 0.144,
      lift: 1.92 - sink * 2.88 + Math.abs(dig) * 0.6,
      rot: facing * (9.6 + dig * 12 - sink * 4.8),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.7) / 0.18;
    const hold = smoothstep(s);
    return {
      x: fromX,
      lift: -0.72 + hold * 0.48,
      rot: facing * (2.4 - hold * 3.6),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: -0.24 * (1 - s),
    rot: facing * (-0.96 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function parotoidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.parotoid));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.88, rot: s * -7.2 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.74) {
    const s = (u - 0.16) / 0.58;
    const gland = Math.sin(s * Math.PI * 1.65);
    const hush = smoothstep(Math.min(1, s * 1.2));
    return {
      x: fromX,
      lift: 2.88 + hush * 1.44 + Math.abs(gland) * 0.84,
      rot: facing * (-7.2 + hush * 6 + gland * 4.8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.74) / 0.26);
  return {
    x: fromX,
    lift: 1.68 * (1 - s),
    rot: facing * (-2.4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tuberclePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tubercle));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const scrape = Math.sin(s * Math.PI * 2.55);
    const push = Math.sin(s * Math.PI * 1.15);
    return {
      x: fromX + facing * push * 0.264,
      lift: 3.12 + Math.abs(push) * 1.56 + Math.abs(scrape) * 0.84,
      rot: facing * (12 + push * 14.4 + scrape * 9.6),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.44 * (1 - s),
    rot: facing * (3.6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function unkenPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.unken));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.36, rot: s * 14.4 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.16) / 0.26;
    const arch = smoothstep(s);
    return {
      x: fromX,
      lift: 3.36 + arch * 1.92,
      rot: facing * (14.4 + arch * 19.2),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.42) / 0.36;
    const hold = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX,
      lift: 5.04 + Math.abs(hold) * 0.72,
      rot: facing * (28.8 + hold * 4.8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: facing * (9.6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function cranialPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cranial));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.64, rot: s * -12 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.4) {
    const s = (u - 0.14) / 0.26;
    const tip = smoothstep(s);
    return {
      x: fromX,
      lift: 2.64 + tip * 1.44,
      rot: facing * (-12 - tip * 9.6),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.4) / 0.38;
    const crest = Math.sin(s * Math.PI * 3.1);
    return {
      x: fromX + facing * crest * 0.096,
      lift: 3.84 + Math.abs(crest) * 0.84,
      rot: facing * (-19.2 + crest * 7.2),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: facing * (-4.8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: ToadTrick, dt: number, flags: TrickFlags): ToadTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ToadTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "bufonid") {
    if (next.t < BUFONID_HOLD) {
      const pose = bufonidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < BUFONID_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BUFONID_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "verruca") {
    const pose = verrucaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "burrow") {
    const pose = burrowPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "parotoid") {
    const pose = parotoidPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tubercle") {
    const pose = tuberclePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "unken") {
    const pose = unkenPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cranialPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}

