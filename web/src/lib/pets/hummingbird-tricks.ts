/** Sip ground tricks while idle — ultra-polish pass. House neighborly Trochilidae / Archilochus ruby-throated hummingbird desk life — nectary / shuttle / gorget / chip / trapline / gnatsnap / archilochus personality (nectary flower-nectar bill-dip without naming sip or hover or probe or dart or drink or siphon or nectar or bloomfeed, shuttle courtship shuttle-dive without naming dive or stoop or soar or hover or pendulum or kettle or bind, gorget iridescent throat-flash without naming flash or flare or crest or hackles or fan or strut or jewel, chip chip-call chin-bob without naming cry or call or song or sing or feebee or carol or honk or kuk or zeet, trapline sequential blotter-bloom circuit without naming sip or hover or nectar or dart or probe, gnatsnap aerial insect-snap without naming dart or hover or soar or stoop or bind or kettle, long archilochus Archilochus colubris ruby-throat desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid or kettle or stoop or bind or keeyer or patagial or tower or buteo or feebee or gargle or hangup or cache or capflash or seedhammer or poecile or runstop or listen or carol or tug or rufous or tailcock or turdus or dabble or upend or headshake or gruntwhistle or speculum or nodswim or anas or graze or hiss or nestguard or honk or triumph or chinstrap or branta or excavate or hitch or crestflare or kuk or tongueprobe or chipcast or dryocopus or oil or dab or tip or drum or sip or hover; window-play SIP and bird-fly Call Sip leave hummingbird alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own their tricks; guest slug Sip / key hummingbird — accept "hummingbird" and "sip"; do NOT name a trick hummingbird or sip or hover or nectar or dive or flash or chipcall or mantle). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous colubris / alexandri / calliope. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop hummingbird-tricks.js. Window-play SIP and bird-fly unchanged. True ruby-throated hummingbird desk life — not woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Echo owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via hummingbird.wav. Amplitudes raised toward Rui richness; denser waits/weights (ARCHILOCHUS_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names hummingbird/sip/hover/perch as bare ethogram-only trick kinds. Window-play SIP and bird-fly unchanged. Echo now Rue-dense; Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; Frill now Rue-dense; next leftover Cap / fly_agaric. Catalog 221. Never retouch Rui sprites. */
export const TRICK_KEY = "hummingbird";
export const TRICKS = ["nectary", "shuttle", "gorget", "chip", "trapline", "gnatsnap", "archilochus"] as const;
export const HAPPY = ["colubris", "alexandri", "calliope"] as const;
export type HummingbirdTrickKind = (typeof TRICKS)[number];
export type HummingbirdHappyKind = (typeof HAPPY)[number];
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
export type HummingbirdTrick = {
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
export type HummingbirdHappy = {
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
export const HAPPY_DUR: Record<HummingbirdHappyKind, number> = { colubris: 1.64, alexandri: 1.78, calliope: 1.70 };
export const ARCHILOCHUS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<HummingbirdTrickKind, number> = {
  archilochus: ARCHILOCHUS_HOLD + RELEASE_S,
  nectary: 2.52,
  shuttle: 2.60,
  gorget: 2.34,
  chip: 2.48,
  trapline: 2.54,
  gnatsnap: 2.40,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HummingbirdTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "archilochus") return 40 + roll * 26;
  if (kind === "nectary" || kind === "shuttle" || kind === "gorget" || kind === "chip" || kind === "trapline" || kind === "gnatsnap") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HummingbirdTrickKind | string | null) {
  if (musicOn) return "archilochus";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "archilochus" ? 0.72 : k === "nectary" || k === "chip" ? 1.28 : k === "shuttle" || k === "gnatsnap" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "nectary";
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

export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "sip";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: HummingbirdHappyKind | null | undefined,
  x: number,
  facing: number,
  flags?: HappyFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HummingbirdHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: HummingbirdHappyKind | string, x: number, facing: number): HummingbirdHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? kind : "colubris";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "colubris" ? "sit" : name === "alexandri" ? "play" : "sit") as TrickAnim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function colubrisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.colubris));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 7.2, rot: s * 14.4, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 5.5) + 0.26 * Math.sin(t * 11.2);
    return { lift: 7.2 + Math.abs(flash) * 6, rot: 14.4 + flash * 9.6, dx: flash * 2.64, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function alexandriPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.alexandri));
  if (u < 0.11) {
    const s = u / 0.11;
    return { lift: s * 16.8, rot: s * -14.4, dx: s * 3.6, anim: "play" as TrickAnim };
  }
  if (u < 0.85) {
    const wriggle = Math.sin(t * 4.2) + 0.25 * Math.sin(t * 7.6);
    return { lift: 14.4 + Math.abs(wriggle) * 12, rot: -12 + wriggle * 16.8, dx: wriggle * 4.8, anim: "play" as TrickAnim };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function calliopePose(t: number) {
  return {
    lift: 3.6 + Math.abs(Math.sin(t * 4.0)) * 8.4,
    rot: Math.sin(t * 3.4) * 10.8,
    dx: Math.sin(t * 2.6) * 3.6,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: HummingbirdHappy | null | undefined, dt: number, flags?: HappyFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind as HummingbirdHappyKind];
  const pose =
    next.kind === "colubris" ? colubrisPose(next.t) : next.kind === "alexandri" ? alexandriPose(next.t) : calliopePose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.dx = pose.dx;
  next.anim = pose.anim;
  if (next.t >= hold) return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: HummingbirdTrickKind | string, x: number, facing: number): HummingbirdTrick {
  const anim: TrickAnim =
    kind === "archilochus" || kind === "gorget"
      ? "sit"
      : kind === "nectary" || kind === "shuttle" || kind === "trapline" || kind === "gnatsnap"
        ? "play"
        : kind === "chip"
          ? "talk"
          : "sit";
  return {
    kind,
    phase: kind === "archilochus" ? "hold" : "go",
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

export function archilochusPose(t: number) {
  const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
  const soft = Math.abs(Math.sin(t * 0.9));
  return { lift: 2.4 + soft * 4.8 + Math.abs(breath) * 1.8, rot: -2.4 + breath * 4.8 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
}

export function nectaryPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.nectary));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 12, rot: s * 21.6 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.88) {
    const sip = Math.sin(t * 22.0) + 0.28 * Math.sin(t * 44.0);
    return {
      x: fromX + face * sip * 3.6,
      lift: 10.8 + Math.abs(sip) * 6,
      rot: (21.6 + sip * 7.2) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3.6 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function shuttlePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.shuttle));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 4.8, lift: s * 16.8, rot: s * -14.4 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const arc = Math.sin(((u - 0.14) / 0.72) * Math.PI);
    const wobble = Math.sin(t * 6.2) + 0.2 * Math.sin(t * 12.4);
    return {
      x: fromX + face * (4.8 + arc * 7.2 + wobble * 3),
      lift: 14.4 + arc * 9.6 + Math.abs(wobble) * 4.8,
      rot: (-14.4 + arc * 24 + wobble * 6) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 4.8 * (1 - s), lift: 4.8 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function gorgetPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.gorget));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 9.6, rot: s * -12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const gleam = Math.sin(t * 3.1) + 0.22 * Math.sin(t * 6.2);
    return {
      x: fromX + face * gleam * 3,
      lift: 9.6 + Math.abs(gleam) * 6,
      rot: (-12 + gleam * 8.4) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3.6 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function chipPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.chip));
  const face = facing == null ? 1 : facing;
  if (u < 0.09) {
    const s = smoothstep(u / 0.09);
    return { x: fromX, lift: s * 12, rot: s * 16.8 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.09) / 0.77;
    const phrase = Math.sin(s * Math.PI * 5.4);
    const settle = Math.abs(Math.sin(s * Math.PI * 10.8));
    return {
      x: fromX + face * (3 * s + phrase * 3.6),
      lift: 10.8 + settle * 6,
      rot: (16.8 + phrase * 9.6) * face,
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 3 * (1 - s), lift: 4.8 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function traplinePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.trapline));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 6, lift: s * 13.2, rot: s * -9.6 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const circuit = Math.sin(t * 4.8) + 0.28 * Math.sin(t * 9.6);
    const station = Math.abs(Math.sin(t * 2.4));
    return {
      x: fromX + face * (6 + circuit * 4.8 + station * 2.4),
      lift: 12 + Math.abs(circuit) * 7.2 + station * 3.6,
      rot: (-9.6 + circuit * 12) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 6 * (1 - s), lift: 3.6 * (1 - s), rot: -2.4 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function gnatsnapPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.gnatsnap));
  const face = facing == null ? 1 : facing;
  if (u < 0.11) {
    const s = smoothstep(u / 0.11);
    return { x: fromX, lift: s * 15.6, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const snap = Math.sin(t * 9.5) + 0.3 * Math.sin(t * 19.0);
    return {
      x: fromX + face * snap * 4.2,
      lift: 14.4 + Math.abs(snap) * 8.4,
      rot: (12 + snap * 10.8) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: 4.8 * (1 - s), rot: 3.6 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: HummingbirdTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  const short =
    trick.kind === "nectary" ||
    trick.kind === "shuttle" ||
    trick.kind === "gorget" ||
    trick.kind === "chip" ||
    trick.kind === "trapline" ||
    trick.kind === "gnatsnap";
  if (shouldAbort(flags) && !short) {
    return Object.assign({}, trick, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "archilochus") {
    if (next.t < ARCHILOCHUS_HOLD) {
      const pose = archilochusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ARCHILOCHUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ARCHILOCHUS_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  const hold = DUR[next.kind as HummingbirdTrickKind];
  const u = next.t / hold;
  const from = trick.fromX != null ? trick.fromX : trick.x;
  const poseFn: Record<string, (t: number, fromX: number, facing: number) => { x: number; lift: number; rot: number; anim: TrickAnim }> = {
    nectary: nectaryPose,
    shuttle: shuttlePose,
    gorget: gorgetPose,
    chip: chipPose,
    trapline: traplinePose,
    gnatsnap: gnatsnapPose,
  };
  const fn = poseFn[next.kind] || nectaryPose;
  const pose = fn(next.t, from, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}
