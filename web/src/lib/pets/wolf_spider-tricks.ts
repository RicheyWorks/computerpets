/** Prowl ground tricks while idle. House neighborly Lycosidae / Tigrosa wetland wolf desk life — cursor / eggsac / spiderling / eyeshine / tigrosa personality (cursor cursorial litter-walk without naming prowl or hunt or chase or stalk or patrol or track or run or gallop, eggsac spinneret egg-sac carry without naming brood or egg or sac or clutch or bundle or wrap or silk or web, spiderling dorsum ride without naming brood or carry or piggyback or hitch or mount or ride or young or baby, eyeshine tapetum night-glint without naming look or stare or eye or gaze or glow or flash or shine or lamp or watch, long tigrosa Tigrosa helluo wetland-wolf litter perch — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or oil or dab or tip or drum or sip or hover; window-play CARRY and Call Prowl leave wolf_spider alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap own their tricks; guest slug Prowl / key wolf_spider — accept "wolf_spider" and "prowl"; do NOT name a trick wolf_spider or prowl or hunt or patrol or carry or brood or leap or hop or silk or web or gaze). Thank-yous helluo / carolinensis / rabida. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop wolf_spider-tricks.js. Window-play CARRY unchanged. True wetland wolf desk life — not jumping-spider/orb-weaver/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Velvet owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "wolf_spider";
export const TRICKS = ["cursor", "eggsac", "spiderling", "eyeshine", "tigrosa"] as const;
export const HAPPY = ["helluo", "carolinensis", "rabida"] as const;
export type WolfSpiderTrickKind = (typeof TRICKS)[number];
export type WolfSpiderHappyKind = (typeof HAPPY)[number];
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

export type WolfSpiderTrick = {
  kind: WolfSpiderTrickKind;
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

export type WolfSpiderHappy = {
  kind: WolfSpiderHappyKind;
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

export const HAPPY_DUR = { helluo: 1.66, carolinensis: 1.80, rabida: 1.72 } as const;
export const TIGROSA_HOLD = 19.52;
export const RELEASE_S = 1.16;
export const DUR = { tigrosa: TIGROSA_HOLD + RELEASE_S, cursor: 2.52, eggsac: 2.44, spiderling: 2.66, eyeshine: 2.58 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: WolfSpiderTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "tigrosa") return 84 + roll * 42;
  if (kind === "cursor") return 14.0 + roll * 12.2;
  if (kind === "eggsac") return 16.0 + roll * 12.0;
  if (kind === "eyeshine") return 17.4 + roll * 12.4;
  return justFinished ? 14.2 + roll * 10.2 : 8.2 + roll * 9.4;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: WolfSpiderTrickKind | string | null) {
    if (musicOn) return "tigrosa";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tigrosa") {
      if (roll < 0.26) return "cursor";
      if (roll < 0.5) return "eggsac";
      if (roll < 0.74) return "spiderling";
      return "eyeshine";
    }
    if (lastKind === "cursor") {
      if (roll < 0.26) return "tigrosa";
      if (roll < 0.5) return "eggsac";
      if (roll < 0.74) return "spiderling";
      return "eyeshine";
    }
    if (lastKind === "eggsac") {
      if (roll < 0.22) return "tigrosa";
      if (roll < 0.44) return "cursor";
      if (roll < 0.68) return "spiderling";
      return "eyeshine";
    }
    if (roll < 0.2) return "tigrosa";
    if (roll < 0.4) return "cursor";
    if (roll < 0.6) return "eggsac";
    if (roll < 0.8) return "spiderling";
    return "eyeshine";
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
    return key === TRICK_KEY || key === "prowl";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: WolfSpiderHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: WolfSpiderHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: WolfSpiderHappyKind | string, x: number, facing: 1 | -1): WolfSpiderHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "helluo";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "helluo" ? "sit" : name === "carolinensis" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function helluoPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.helluo));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.024, rot: s * 2.15, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 5.8) + 0.20 * Math.sin(t * 11.6);
      return { lift: 0.024 + Math.abs(flash) * 0.014, rot: 2.15 + flash * 1.65, dx: flash * 0.0010, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.008 * (1 - s), rot: 0.40 * (1 - s), dx: 0, anim: "idle" };
  }
export function carolinensisPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.carolinensis));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.040, rot: s * -2.75, dx: s * 0.0018, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 4.2) + 0.22 * Math.sin(t * 8.4);
      return { lift: 0.040 + Math.abs(spring) * 0.020, rot: -2.75 + spring * 2.55, dx: spring * 0.0022, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.013 * (1 - s), rot: -0.48 * (1 - s), dx: 0, anim: "sit" };
  }
export function rabidaPose(t: number) {
    return { lift: 0.011 + Math.abs(Math.sin(t * 0.28)) * 0.015, rot: Math.sin(t * 0.28) * 1.22, dx: Math.sin(t * 0.22) * 0.0010, anim: "sit" };
  }
export function stepHappy(happy: WolfSpiderHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "helluo") {
      const pose = helluoPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "carolinensis") {
      const pose = carolinensisPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = rabidaPose(next.t);
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
export function beginTrick(kind: WolfSpiderTrickKind, x: number, facing: 1 | -1): WolfSpiderTrick {
    const anim: TrickAnim =
      kind === "tigrosa"
        ? "sit"
        : kind === "cursor"
          ? "play"
          : kind === "eggsac"
            ? "sit"
            : kind === "spiderling"
              ? "talk"
              : kind === "eyeshine"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "tigrosa" ? "hold" : "go",
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
export function tigrosaPose(t: number) {
    const breath = Math.sin(t * 0.10) + 0.05 * Math.sin(t * 0.29);
    const sure = Math.abs(Math.sin(t * 0.15));
    return { lift: 0.009 + sure * 0.011, rot: 0.22 + breath * 0.48 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.005 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.14 * (1 - u) };
  }
export function cursorPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.cursor));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0032, lift: s * 0.016, rot: s * 4.8 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const step = Math.sin((u - 0.12) / 0.76 * Math.PI * 4.2);
      const pause = Math.sin(t * 1.8) * 0.25;
      return { x: fromX + face * (0.0032 + step * 0.0048 + pause * 0.0006), lift: 0.014 + Math.abs(step) * 0.010, rot: (4.8 + step * 3.6 + pause * 1.4) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0032 * (1 - s), lift: 0.006 * (1 - s), rot: 0.9 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function eggsacPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.eggsac));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.028, rot: s * -6.4 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const hitch = Math.sin((u - 0.14) / 0.72 * Math.PI);
      const sway = Math.sin(t * 2.8) + 0.18 * Math.sin(t * 5.6);
      return { x: fromX + face * sway * 0.0007, lift: 0.026 + hitch * 0.010 + Math.abs(sway) * 0.006, rot: (-6.4 + hitch * 3.8 + sway * 2.2) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 0.010 * (1 - s), rot: -1.2 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function spiderlingPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.spiderling));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * 0.034, rot: s * 5.6 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.87) {
      const ripple = Math.sin((u - 0.11) / 0.76 * Math.PI * 5.5);
      const nestle = Math.sin(t * 4.4) + 0.20 * Math.sin(t * 8.8);
      return { x: fromX + face * nestle * 0.0009, lift: 0.032 + Math.abs(ripple) * 0.012 + Math.abs(nestle) * 0.007, rot: (5.6 + ripple * 4.2 + nestle * 1.8) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return { x: fromX, lift: 0.011 * (1 - s), rot: 1.1 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function eyeshinePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.eyeshine));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 0.020, rot: s * -2.8 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const glint = Math.sin((u - 0.10) / 0.78 * Math.PI * 7.2);
      const lamp = Math.sin(t * 9.6) * 0.40;
      return { x: fromX + face * (glint * 0.0014 + lamp * 0.0004), lift: 0.018 + Math.abs(glint) * 0.011, rot: (-2.8 + glint * 7.6 + lamp * 1.6) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.007 * (1 - s), rot: -0.7 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: WolfSpiderTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "cursor" && trick.kind !== "eggsac" && trick.kind !== "spiderling" && trick.kind !== "eyeshine") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "tigrosa") {
      if (next.t < TIGROSA_HOLD) {
        const pose = tigrosaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TIGROSA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TIGROSA_HOLD);
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
    if (next.kind === "cursor") {
      const pose = cursorPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "eggsac") {
      const pose = eggsacPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "spiderling") {
      const pose = spiderlingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = eyeshinePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }