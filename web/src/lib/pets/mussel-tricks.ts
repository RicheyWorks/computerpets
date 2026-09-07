/** Hinge ground tricks while idle. House neighborly Unionidae Eastern-elliptio desk life — adductor / protractor / inhalant / ctenidium / unionid personality (adductor valve clap without naming clap or snap or hinge or gape, protractor muscular-foot plough without naming dig or burrow or crawl or pedal, inhalant aperture draw without naming siphon or breath or filter, ctenidium filter-gill beat without naming gill or mantle or fringe or trail, long unionid Elliptio desk hold under the silt grain — never named wait or wake or still or hide or cover or wiggle or siphon or filter or hinge or gape or dig or burrow or crawl or pedal or radula or pneumostome or ommatophore or lymnaeid or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or mantle or sucker or jet or claw or snap or pinch or annulate or fossorial or tentacular or hydrostatic or gymnophion; window-play FILTER owns filter; ethogram siphon/still own those words; special Siphon owns siphon; Door owns hinge as a trick kind; Anchor owns siphon as a trick kind; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid; Chamber owns spiral/siphuncle/nacre/pinhole/fringe; Tenant owns swap/antenna/scuttle/withdraw/vacancy; Pinch owns chelate/caridoid/chimney/antennule/astacid; Cup owns mantle; Bloom owns gill; Pulse owns trail; Bluff owns gape; Pebble owns burrow; Slip owns tentacular/annulate/fossorial/hydrostatic/gymnophion; guest slug Hinge / key mussel only for isKey matching — accept "mussel" and "hinge"; do NOT name a trick "mussel" or "hinge" or "siphon" or "filter" or "gill" or "mantle" or "nacre" or "pedal" or "radula" or "gape" or "dig" or "burrow") — not Whorl pond-snail life, not Chamber nautilus shell life, not Tenant hermit shell life, not Pinch crayfish claw life, not Door moray hinge, not Anchor seahorse siphon. adductor valve clap on the silt dish without naming snap or hinge, protractor foot-plough without naming dig or burrow, inhalant aperture draw without naming siphon or filter, ctenidium ctenidial beat without naming gill, unionid long Elliptio metabolic hold under the scrap silt with complanata / alate / elliptio cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play FILTER do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web mussel-tricks.ts. Window-play FILTER unchanged — never names filter. Ethogram siphon/still unchanged — never names siphon or still as trick kinds. True Unionidae Eastern elliptio desk life only — distinct from Whorl pond snail, Chamber nautilus, Tenant hermit, Pinch crayfish, Door moray, and Anchor seahorse. Latch owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "mussel";
export const TRICKS = ["adductor", "protractor", "inhalant", "ctenidium", "unionid"] as const;
export const HAPPY = ["complanata", "alate", "elliptio"] as const;
export type MusselTrickKind = (typeof TRICKS)[number];
export type MusselHappyKind = (typeof HAPPY)[number];
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

export type MusselTrick = {
  kind: MusselTrickKind;
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

export type MusselHappy = {
  kind: MusselHappyKind;
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

export const HAPPY_DUR = { complanata: 1.58, alate: 1.72, elliptio: 1.64 } as const;
export const UNIONID_HOLD = 18.42;
export const RELEASE_S = 1.12;
export const DUR = { unionid: UNIONID_HOLD + RELEASE_S, adductor: 2.28, protractor: 2.36, inhalant: 2.62, ctenidium: 2.18 } as const;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MusselTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
    if (kind === "unionid") return 76 + roll * 46;
  if (kind === "adductor") return 16.4 + roll * 12.8;
  if (kind === "protractor") return 18.6 + roll * 13.2;
  if (kind === "ctenidium") return 21.8 + roll * 14.6;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MusselTrickKind | string | null) {
  if (musicOn) return "unionid";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "unionid") {
    if (roll < 0.26) return "adductor";
    if (roll < 0.5) return "protractor";
    if (roll < 0.74) return "inhalant";
    return "ctenidium";
  }
  if (lastKind === "adductor") {
    if (roll < 0.26) return "unionid";
    if (roll < 0.5) return "protractor";
    if (roll < 0.74) return "inhalant";
    return "ctenidium";
  }
  if (lastKind === "protractor") {
    if (roll < 0.22) return "unionid";
    if (roll < 0.44) return "adductor";
    if (roll < 0.68) return "inhalant";
    return "ctenidium";
  }
  if (roll < 0.2) return "unionid";
  if (roll < 0.4) return "adductor";
  if (roll < 0.6) return "protractor";
  if (roll < 0.8) return "inhalant";
  return "ctenidium";
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
  return key === TRICK_KEY || key === "hinge";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MusselHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MusselHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MusselHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MusselHappyKind | string, x: number, facing: 1 | -1): MusselHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MusselHappyKind) : "complanata";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "complanata" ? "sit" : name === "alate" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

                    export function complanataPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.complanata));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.022, rot: s * 1.15, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.80) {
      const flash = Math.sin(t * 7.4) + 0.28 * Math.sin(t * 14.8);
      return {
        lift: 0.022 + Math.abs(flash) * 0.014,
        rot: 1.15 + flash * 1.25,
        dx: flash * 0.0010,
        anim: "sit" as TrickAnim,
      };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.008 * (1 - s), rot: 0.40 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
  export function alatePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.alate));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.028, rot: s * -1.45, dx: s * 0.0014, anim: "play" as TrickAnim };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 5.1) + 0.20 * Math.sin(t * 9.3);
      return {
        lift: 0.028 + Math.abs(wriggle) * 0.020,
        rot: -1.45 + wriggle * 2.65,
        dx: wriggle * 0.0024,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.010 * (1 - s), rot: -0.40 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
  export function elliptioPose(t) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.36)) * 0.015,
      rot: Math.sin(t * 0.39) * 0.92,
      dx: Math.sin(t * 0.28) * 0.0011,
      anim: "sit" as TrickAnim,
    };
  }
export function stepHappy(happy: MusselHappy, dt: number, flags: TrickFlags): MusselHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MusselHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "complanata") {
    const pose = complanataPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "alate") {
    const pose = alatePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = elliptioPose(next.t);
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

export function beginTrick(kind: MusselTrickKind, x: number, facing: 1 | -1): MusselTrick {
  const anim: TrickAnim =
    kind === "unionid"
      ? "sit"
      : kind === "adductor"
        ? "play"
        : kind === "protractor"
          ? "walk"
          : kind === "inhalant"
            ? "sit"
            : kind === "ctenidium"
              ? "sit"
              : "sit";
  return {
    kind: kind,
    phase: kind === "unionid" ? "hold" : "go",
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


                      export function unionidPose(t) {
    const breath = Math.sin(t * 0.12) + 0.06 * Math.sin(t * 0.33);
    const soft = Math.abs(Math.sin(t * 0.17));
    return {
      lift: 0.003 + soft * 0.011,
      rot: -0.22 + breath * 0.48,
    };
  }

  export function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function adductorPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.adductor));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.022, rot: s * 1.8 * face, anim: "play" };
    }
    if (u < 0.78) {
      // adductor valve-clap pulses
      const snap = Math.sin(t * 8.2) + 0.30 * Math.sin(t * 16.4);
      const bite = snap > 0.35 ? 1.0 : snap < -0.35 ? -0.55 : snap * 0.4;
      return {
        x: fromX + face * bite * 0.006,
        lift: 0.022 + Math.abs(snap) * 0.016,
        rot: (1.8 + bite * 2.4) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX, lift: 0.008 * (1 - s), rot: 0.35 * (1 - s) * face, anim: "idle" };
  }
  function protractorPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.protractor));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.010, rot: s * 0.55 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const s = smoothstep((u - 0.12) / 0.66);
      // protractor foot glide forward on the blotter film
      const wave = Math.sin(s * Math.PI * 3.1);
      return {
        x: fromX + face * (0.02 + s * 0.11),
        lift: 0.010 + Math.abs(wave) * 0.008,
        rot: (0.55 + wave * 0.85) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.13 * (1 - s),
      lift: 0.006 * (1 - s),
      rot: 0.20 * (1 - s) * face,
      anim: "idle",
    };
  }
  function inhalantPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.inhalant));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      // rise toward the film surface to open the inhalant
      return { x: fromX + face * s * 0.008, lift: s * 0.062, rot: s * -0.65 * face, anim: "sit" };
    }
    if (u < 0.70) {
      const s = (u - 0.18) / 0.52;
      const sip = Math.sin(s * Math.PI * 2.2) + 0.12 * Math.sin(s * Math.PI * 4.4);
      return {
        x: fromX + face * (0.008 + sip * 0.005),
        lift: 0.062 + Math.abs(sip) * 0.012,
        rot: (-0.65 + sip * 0.75) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.70) / 0.30);
    return {
      x: fromX + face * 0.008 * (1 - s),
      lift: 0.062 * (1 - s),
      rot: -0.22 * (1 - s) * face,
      anim: s > 0.6 ? "idle" : "sit",
    };
  }
  function ctenidiumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ctenidium));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.008, rot: s * 0.95 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const tap = Math.sin(t * 6.8) + 0.22 * Math.sin(t * 13.6);
      return {
        x: fromX + face * tap * 0.0035,
        lift: 0.008 + Math.abs(tap) * 0.006,
        rot: (0.95 + tap * 1.55) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: 0.004 * (1 - s), rot: 0.25 * (1 - s) * face, anim: "idle" };
  }
export function stepTrick(trick: MusselTrick, dt: number, flags: TrickFlags): MusselTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "adductor" && trick.kind !== "protractor" && trick.kind !== "inhalant" && trick.kind !== "ctenidium") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MusselTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "unionid") {
    if (next.t < UNIONID_HOLD) {
      const pose = unionidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < UNIONID_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - UNIONID_HOLD);
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
  if (next.kind === "adductor") {
    const pose = adductorPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "protractor") {
    const pose = protractorPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inhalant") {
    const pose = inhalantPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ctenidiumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
