/** Paint ground tricks while idle. House neighborly ocellaris clownfish (Amphiprion ocellaris / Pomacentridae anemonefish) desk life -- wiggle-dance host cue / desk-safe dart-hide in anemone / stripe flash turn / peck-clean host / long amphiprion hush; NOT Wreath anemone (esp. not oraldiskwreathsway/nematocysttuck/actiniahush); NOT Ridge brain_coral; NOT Gum; NOT goldfish Coin; NOT other reef fish if present; NOT Rui; guest slug Paint / key clownfish -- accept clownfish and paint; Thank-yous denspaint / inkpaint / densamphiprion. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop clownfish-tricks.js. Next: Scrape / parrotfish. Catalog 220. */
export const TRICK_KEY = "clownfish";
export const TRICKS = ["wiggledancehostcue", "darthideinanemone", "stripeflashturn", "peckcleanhost", "amphiprionhush"] as const;
export const HAPPY = ["denspaint", "inkpaint", "densamphiprion"] as const;
export type ClownfishTrickKind = (typeof TRICKS)[number];
export type ClownfishHappyKind = (typeof HAPPY)[number];
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

export type ClownfishTrick = {
  kind: ClownfishTrickKind;
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

export type ClownfishHappy = {
  kind: ClownfishHappyKind;
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

export const HAPPY_DUR = { denspaint: 2.71, inkpaint: 2.88, densamphiprion: 2.69 } as const;
export const AMPHIPRIONHUSH_HOLD = 32.96;
export const RELEASE_S = 2.48;
export const DUR = { amphiprionhush: AMPHIPRIONHUSH_HOLD + RELEASE_S, wiggledancehostcue: 5.56, darthideinanemone: 5.22, stripeflashturn: 5.72, peckcleanhost: 5.48 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ClownfishTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "amphiprionhush") return 208 + roll * 22;
  if (kind === "darthideinanemone") return 25.7 + roll * 3.1;
  if (kind === "peckcleanhost") return 24.6 + roll * 3.2;
  if (kind === "wiggledancehostcue") return 24.1 + roll * 3.3;
  if (kind === "stripeflashturn") return 25.3 + roll * 3.4;
  return justFinished ? 19.1 + roll * 3.0 : 14.2 + roll * 2.6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ClownfishTrickKind | string) {
  if (musicOn) return "amphiprionhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "amphiprionhush") {
    if (roll < 0.26) return "darthideinanemone";
    if (roll < 0.5) return "peckcleanhost";
    if (roll < 0.74) return "wiggledancehostcue";
    return "stripeflashturn";
  }
  if (lastKind === "darthideinanemone") {
    if (roll < 0.26) return "amphiprionhush";
    if (roll < 0.5) return "peckcleanhost";
    if (roll < 0.74) return "wiggledancehostcue";
    return "stripeflashturn";
  }
  if (lastKind === "peckcleanhost") {
    if (roll < 0.22) return "amphiprionhush";
    if (roll < 0.44) return "darthideinanemone";
    if (roll < 0.68) return "wiggledancehostcue";
    return "stripeflashturn";
  }
  if (roll < 0.2) return "amphiprionhush";
  if (roll < 0.4) return "darthideinanemone";
  if (roll < 0.6) return "peckcleanhost";
  if (roll < 0.8) return "wiggledancehostcue";
  return "stripeflashturn";
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
  return key === TRICK_KEY || key === "paint";
}
export function startThankYou(
  key: string | undefined | null,
  lastKind: ClownfishHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: ClownfishHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: ClownfishHappyKind | string, x: number, facing?: 1 | -1): ClownfishHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as ClownfishHappyKind) : "denspaint";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "denspaint" ? "sit" : name === "inkpaint" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function denspaintPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspaint));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0034, rot: s * -0.22, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.35);
    return { lift: 0.0034 + Math.abs(sway) * 0.0009, rot: -0.22 + sway * 0.16, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0034 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkpaintPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkpaint));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0035, rot: s * 0.26, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 2.95);
    return { lift: 0.0035 + Math.abs(arc) * 0.0020, rot: 0.26 + arc * 0.28, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0035 * (1 - s), rot: 0.26 * (1 - s), anim: "idle" as TrickAnim };
}
export function densamphiprionPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densamphiprion));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0016, rot: s * 0.17, anim: "play" as TrickAnim };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.18);
    return { lift: -0.0016 + Math.abs(hush) * 0.0010, rot: 0.17 + hush * 0.16, anim: "play" as TrickAnim };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0016 * (1 - s), rot: 0.17 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: ClownfishHappy, dt: number, flags?: TrickFlags): ClownfishHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denspaint") {
    const pose = denspaintPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkpaint") {
    const pose = inkpaintPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densamphiprionPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}
export function beginTrick(kind: ClownfishTrickKind | string, x: number, facing?: 1 | -1): ClownfishTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as ClownfishTrickKind) : "amphiprionhush";
  const anim: TrickAnim =
    k === "amphiprionhush"
      ? "sit"
      : k === "darthideinanemone"
        ? "play"
        : k === "peckcleanhost"
            ? "sit"
          : k === "stripeflashturn"
              ? "sit"
            : k === "wiggledancehostcue"
                ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "amphiprionhush" ? "hold" : "go",
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

export function amphiprionhushPose(t: number) {
  const breath = Math.sin(t * 0.00037) + 0.00011 * Math.sin(t * 0.00105);
  const hush = Math.abs(Math.sin(t * 0.00021));
  return { lift: -0.00018 + hush * 0.00006, rot: 0.0014 + breath * 0.0011 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
}

export function darthideinanemonePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.darthideinanemone));
  const face = facing == null ? 1 : facing;
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { x: fromX + face * s * -0.00004, lift: s * -0.0042, rot: s * 0.07 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const tuck = Math.sin(((u - 0.22) / 0.5) * Math.PI * 2.1);
    return {
      x: fromX + face * (-0.00004 + tuck * 0.00005),
      lift: -0.0042 + Math.abs(tuck) * 0.0008,
      rot: (0.07 + tuck * 0.05) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { x: fromX + face * -0.00004 * (1 - s), lift: -0.0042 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function peckcleanhostPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.peckcleanhost));
  const face = facing == null ? 1 : facing;
  if (u < 0.3) {
    const s = smoothstep(u / 0.3);
    return { x: fromX + face * s * 0.00006, lift: s * -0.0074, rot: s * 0.03 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.68) {
    const hold = Math.sin(((u - 0.3) / 0.38) * Math.PI);
    return {
      x: fromX + face * 0.00006,
      lift: -0.0074 + hold * 0.0005,
      rot: (0.03 + hold * 0.015) * face,
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.9) {
    const c = smoothstep((u - 0.68) / 0.22);
    return {
      x: fromX + face * 0.00006 * (1 - c * 0.35),
      lift: -0.0074 * (1 - c) + 0.0018 * c,
      rot: (0.03 * (1 - c) + 0.06 * c) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return { x: fromX + face * 0.00004 * (1 - s), lift: 0.0018 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function wiggledancehostcuePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.wiggledancehostcue));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.00009, lift: s * 0.0026, rot: s * 0.14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const sway = Math.sin(((u - 0.14) / 0.74) * Math.PI * 2.85);
    return {
      x: fromX + face * (0.00009 + sway * 0.00022),
      lift: 0.0026 + Math.abs(sway) * 0.0019,
      rot: (0.14 + sway * 0.22) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 0.00009 * (1 - s), lift: 0.0026 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stripeflashturnPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stripeflashturn));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00042, lift: s * 0.0009, rot: s * 0.05 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const creep = Math.sin(((u - 0.18) / 0.64) * Math.PI * 1.8);
    return {
      x: fromX + face * (0.00042 + creep * 0.00028),
      lift: 0.0009 + Math.abs(creep) * 0.0007,
      rot: (0.05 + creep * 0.06) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * 0.0007 * (1 - s * 0.3), lift: 0.0009 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: ClownfishTrick, dt: number, flags?: TrickFlags): ClownfishTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "darthideinanemone" && trick.kind !== "peckcleanhost" && trick.kind !== "wiggledancehostcue" && trick.kind !== "stripeflashturn") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "amphiprionhush") {
    if (next.t < AMPHIPRIONHUSH_HOLD) {
      const pose = amphiprionhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < AMPHIPRIONHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - AMPHIPRIONHUSH_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "darthideinanemone") {
    const pose = darthideinanemonePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "peckcleanhost") {
    const pose = peckcleanhostPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "stripeflashturn") {
    const pose = stripeflashturnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = wiggledancehostcuePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
