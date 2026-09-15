/** Paint ground tricks while idle — ultra-polish pass. House neighborly Ocellaris Clownfish Amphiprion ocellaris / Pomacentridae anemonefish desk life (clownfish / Paint) — wiggledancehostcue / darthideinanemone / stripeflashturn / peckcleanhost / hostnestle / orangebarflash / amphiprionhush personality (wiggledancehostcue host-cue wiggle dance without naming wiggle or dance or host alone as wait; darthideinanemone dart-hide in anemone without naming dart or hide or anemone alone as wait — desk-safe shelter tell distinct from Wreath retractintocolumn; stripeflashturn white-bar stripe flash turn without naming stripe or flash or turn alone as wait; peckcleanhost peck-clean host without naming peck or clean or host alone as wait — mutualism tell; hostnestle host-anemone nestle without naming nestle or nest or sit alone as wait — Amphiprion nestle tell; orangebarflash orange-bar flash without naming orange or bar or flash alone as wait — ocellaris color tell; long amphiprionhush Amphiprion hush hold (THE amphiprionhush sit_hold tell) — never named wait or crouch or sit or still or clownfish or paint or dart as bare ethogram-only trick kinds; Wreath anemone owns oraldiskwreathsway/nematocysttuck/actiniahush — do NOT reuse; Ridge brain_coral owns meandroidridgepulse/polyptentaclewave/diploriahush — do NOT reuse; goldfish Coin owns drift/gulp/flare — do NOT reuse; Scrape parrotfish comes next — do NOT start; guest slug Paint / key clownfish only for wantsThankYou matching — accept "clownfish" and "paint"; do NOT name a trick "clownfish" or "paint" or "anemone" or "wreath" or "brain_coral" or "ridge" or "coral" or "goldfish" or "coin"; not Wreath Actiniaria life, not Ridge Diploria life, not Coin Carassius life, not Rui. Wiggledancehostcue / darthideinanemone / stripeflashturn / peckcleanhost / hostnestle / orangebarflash / amphiprionhush; denspaint / inkpaint / densamphiprion thank-yous. Same map as desktop clownfish-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names dart/nestle/still/walk/sit/wait/clownfish/paint as bare ethogram-only trick kinds. True Ocellaris Clownfish Amphiprion ocellaris desk life only — host-cue wiggle, dart-hide in anemone, stripe flash turn, peck-clean host, host nestle, orange-bar flash, Amphiprion hush. Next house-order ultra: Scrape / parrotfish. No cry inventing — clownfish.wav EXISTS so prefersHouseCry adds clownfish after anemone. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "clownfish";
export const TRICKS = ["wiggledancehostcue", "darthideinanemone", "stripeflashturn", "peckcleanhost", "hostnestle", "orangebarflash", "amphiprionhush"] as const;
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

export const HAPPY_DUR = { denspaint: 1.70, inkpaint: 1.84, densamphiprion: 1.76 } as const;
export const AMPHIPRIONHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  amphiprionhush: AMPHIPRIONHUSH_HOLD + RELEASE_S,
  wiggledancehostcue: 2.48,
  darthideinanemone: 2.42,
  stripeflashturn: 2.40,
  peckcleanhost: 2.44,
  hostnestle: 2.38,
  orangebarflash: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ClownfishTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "amphiprionhush") return 40 + roll * 26;
  if (kind === "hostnestle" || kind === "orangebarflash" || kind === "wiggledancehostcue") return 12.8 + roll * 9.4;
  if (kind === "stripeflashturn" || kind === "darthideinanemone" || kind === "peckcleanhost") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ClownfishTrickKind | string | null) {
  if (musicOn) return "amphiprionhush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "amphiprionhush") {
    if (roll < 0.17) return "wiggledancehostcue" as const;
    if (roll < 0.33) return "darthideinanemone" as const;
    if (roll < 0.49) return "stripeflashturn" as const;
    if (roll < 0.65) return "peckcleanhost" as const;
    if (roll < 0.83) return "hostnestle" as const;
    return "orangebarflash" as const;
  }
  if (lastKind === "wiggledancehostcue") {
    if (roll < 0.16) return "amphiprionhush" as const;
    if (roll < 0.32) return "darthideinanemone" as const;
    if (roll < 0.48) return "stripeflashturn" as const;
    if (roll < 0.64) return "peckcleanhost" as const;
    if (roll < 0.82) return "hostnestle" as const;
    return "orangebarflash" as const;
  }
  if (lastKind === "darthideinanemone") {
    if (roll < 0.14) return "amphiprionhush" as const;
    if (roll < 0.3) return "wiggledancehostcue" as const;
    if (roll < 0.46) return "stripeflashturn" as const;
    if (roll < 0.62) return "peckcleanhost" as const;
    if (roll < 0.8) return "hostnestle" as const;
    return "orangebarflash" as const;
  }
  if (lastKind === "stripeflashturn") {
    if (roll < 0.15) return "amphiprionhush" as const;
    if (roll < 0.31) return "wiggledancehostcue" as const;
    if (roll < 0.47) return "darthideinanemone" as const;
    if (roll < 0.63) return "peckcleanhost" as const;
    if (roll < 0.81) return "hostnestle" as const;
    return "orangebarflash" as const;
  }
  if (lastKind === "peckcleanhost") {
    if (roll < 0.16) return "amphiprionhush" as const;
    if (roll < 0.32) return "wiggledancehostcue" as const;
    if (roll < 0.48) return "darthideinanemone" as const;
    if (roll < 0.64) return "stripeflashturn" as const;
    if (roll < 0.82) return "hostnestle" as const;
    return "orangebarflash" as const;
  }
  if (lastKind === "hostnestle") {
    if (roll < 0.15) return "amphiprionhush" as const;
    if (roll < 0.31) return "wiggledancehostcue" as const;
    if (roll < 0.47) return "darthideinanemone" as const;
    if (roll < 0.63) return "stripeflashturn" as const;
    if (roll < 0.81) return "peckcleanhost" as const;
    return "orangebarflash" as const;
  }
  if (lastKind === "orangebarflash") {
    if (roll < 0.16) return "amphiprionhush" as const;
    if (roll < 0.32) return "wiggledancehostcue" as const;
    if (roll < 0.48) return "darthideinanemone" as const;
    if (roll < 0.64) return "stripeflashturn" as const;
    if (roll < 0.82) return "peckcleanhost" as const;
    return "hostnestle" as const;
  }
  if (roll < 0.14) return "amphiprionhush" as const;
  if (roll < 0.28) return "wiggledancehostcue" as const;
  if (roll < 0.42) return "darthideinanemone" as const;
  if (roll < 0.56) return "stripeflashturn" as const;
  if (roll < 0.7) return "peckcleanhost" as const;
  if (roll < 0.85) return "hostnestle" as const;
  return "orangebarflash" as const;
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
  lastKind: ClownfishHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ClownfishHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: ClownfishHappyKind | string, x: number, facing: 1 | -1): ClownfishHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as ClownfishHappyKind) : "denspaint";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denspaint" ? "sit" : name === "inkpaint" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denspaintPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspaint));
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

export function inkpaintPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkpaint));
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

export function densamphiprionPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: ClownfishHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
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
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: ClownfishTrickKind | string, x: number, facing: 1 | -1): ClownfishTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as ClownfishTrickKind) : "amphiprionhush";
  const anim: TrickAnim =
    k === "amphiprionhush"
      ? "sit"
      : k === "wiggledancehostcue"
        ? "sit"
        : k === "orangebarflash"
          ? "talk"
          : k === "darthideinanemone"
            ? "play"
            : k === "stripeflashturn"
              ? "sit"
              : k === "peckcleanhost"
                ? "sit"
                : k === "hostnestle"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "amphiprionhush" ? "hold" : "go",
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

export function amphiprionhushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function wiggledancehostcuePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.wiggledancehostcue));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const bar = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + bar * 0.16),
      lift: 2.8 + Math.abs(bar) * 1.5,
      rot: face * (-12 + bar * 10),
      anim: "sit" as TrickAnim,
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

export function darthideinanemonePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.darthideinanemone));
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

export function stripeflashturnPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stripeflashturn));
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

export function peckcleanhostPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.peckcleanhost));
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

export function hostnestlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hostnestle));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "walk" as TrickAnim,
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

export function orangebarflashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.orangebarflash));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const cloud = Math.sin(t * 3.0);
    return {
      x: fromX + face * (0.6 + cloud * 0.18),
      lift: 3.0 + Math.abs(cloud) * 1.8,
      rot: face * (14 + cloud * 12),
      anim: "talk" as TrickAnim,
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

export function stepTrick(trick: ClownfishTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "wiggledancehostcue" &&
    trick.kind !== "darthideinanemone" &&
    trick.kind !== "stripeflashturn" &&
    trick.kind !== "peckcleanhost" &&
    trick.kind !== "hostnestle" &&
    trick.kind !== "orangebarflash"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
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
    return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "wiggledancehostcue") {
    const pose = wiggledancehostcuePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "darthideinanemone") {
    const pose = darthideinanemonePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "stripeflashturn") {
    const pose = stripeflashturnPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "peckcleanhost") {
    const pose = peckcleanhostPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hostnestle") {
    const pose = hostnestlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = orangebarflashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
