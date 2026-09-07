/** Wash ground tricks while idle. House neighborly Procyonidae / Procyon lotor raccoon ink-dish desk life — pawdouse / litterdig / rearstand / maskpeer / procyon personality (pawdouse dish-rinse douse without naming wash or rinse or soak or douse or dip or wet or bowl or water or scrub or laundry or soap, litterdig litter-rake fossick without naming dig or bury or scratch or scrape or rake or fossick or litter or dirt or soil or hole, rearstand bipedal peer without naming stand or rear or upright or biped or rise or stretch or tall or look or scan or monocle, maskpeer bandit-mask gaze without naming mask or peer or gaze or stare or bandit or face or eye or hunt or stalk or monocle or fossick, long procyon Procyon lotor freeze-alert ink hold — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover; window-play RUN and Call Wash leave raccoon alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick own their tricks; guest slug Wash / key raccoon — accept "raccoon" and "wash" (roster slug wash; campaign Wash); do NOT name a trick raccoon or wash or coati or kinkajou or red_panda or otter or weasel or mink or ferret). Thank-yous ringden / inkmask / denscrub. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop raccoon-tricks.js. Window-play RUN unchanged. True raccoon Procyonidae desk life — not otter/squirrel/bat/deer/solifuge/fox/rabbit/rui/ferret clones. Stripe owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "raccoon";
export const TRICKS = ["pawdouse", "litterdig", "rearstand", "maskpeer", "procyon"] as const;
export const HAPPY = ["ringden", "inkmask", "denscrub"] as const;
export type RaccoonTrickKind = (typeof TRICKS)[number];
export type RaccoonHappyKind = (typeof HAPPY)[number];
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

export type RaccoonTrick = {
  kind: RaccoonTrickKind;
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

export type RaccoonHappy = {
  kind: RaccoonHappyKind;
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

export const HAPPY_DUR = { ringden: 1.90, inkmask: 2.04, denscrub: 1.96 } as const;
export const PROCYON_HOLD = 20.12;
export const RELEASE_S = 1.40;
export const DUR = { procyon: PROCYON_HOLD + RELEASE_S, pawdouse: 2.84, litterdig: 2.78, rearstand: 3.00, maskpeer: 2.92 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: RaccoonTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "procyon") return 108 + roll * 18;
  if (kind === "pawdouse") return 18.2 + roll * 8.0;
  if (kind === "litterdig") return 19.4 + roll * 8.6;
  if (kind === "maskpeer") return 20.8 + roll * 9.2;
  return justFinished ? 16.8 + roll * 7.6 : 10.8 + roll * 6.8;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: RaccoonTrickKind | string | null) {
    if (musicOn) return "procyon";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "procyon") {
      if (roll < 0.26) return "pawdouse";
      if (roll < 0.5) return "litterdig";
      if (roll < 0.74) return "rearstand";
      return "maskpeer";
    }
    if (lastKind === "pawdouse") {
      if (roll < 0.26) return "procyon";
      if (roll < 0.5) return "litterdig";
      if (roll < 0.74) return "rearstand";
      return "maskpeer";
    }
    if (lastKind === "litterdig") {
      if (roll < 0.22) return "procyon";
      if (roll < 0.44) return "pawdouse";
      if (roll < 0.68) return "rearstand";
      return "maskpeer";
    }
    if (roll < 0.2) return "procyon";
    if (roll < 0.4) return "pawdouse";
    if (roll < 0.6) return "litterdig";
    if (roll < 0.8) return "rearstand";
    return "maskpeer";
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
    return key === TRICK_KEY || key === "wash";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: RaccoonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: RaccoonHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: RaccoonHappyKind | string, x: number, facing: 1 | -1): RaccoonHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "ringden";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "ringden" ? "sit" : name === "inkmask" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function ringdenPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ringden));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.022, rot: s * 2.30, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 3.8) + 0.15 * Math.sin(t * 7.6);
      return { lift: 0.022 + Math.abs(flash) * 0.012, rot: 2.30 + flash * 1.28, dx: flash * 0.00070, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.005 * (1 - s), rot: 0.30 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkmaskPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkmask));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.036, rot: s * -2.60, dx: s * 0.00142, anim: "play" as TrickAnim };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.1) + 0.15 * Math.sin(t * 6.2);
      return { lift: 0.036 + Math.abs(spring) * 0.015, rot: -2.60 + spring * 2.10, dx: spring * 0.00180, anim: "play" as TrickAnim };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.009 * (1 - s), rot: -0.34 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function denscrubPose(t: number) {
    return { lift: 0.0084 + Math.abs(Math.sin(t * 0.155)) * 0.0126, rot: Math.sin(t * 0.155) * 1.10, dx: Math.sin(t * 0.118) * 0.00074, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: RaccoonHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "ringden") {
      const pose = ringdenPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkmask") {
      const pose = inkmaskPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscrubPose(next.t);
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
export function beginTrick(kind: RaccoonTrickKind, x: number, facing: 1 | -1): RaccoonTrick {
    const anim: TrickAnim =
      kind === "procyon"
        ? "sit"
        : kind === "pawdouse"
          ? "play"
          : kind === "litterdig"
            ? "play"
            : kind === "rearstand"
              ? "talk"
              : kind === "maskpeer"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "procyon" ? "hold" : "go",
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
export function procyonPose(t: number) {
    const breath = Math.sin(t * 0.046) + 0.036 * Math.sin(t * 0.138);
    const hush = Math.abs(Math.sin(t * 0.056));
    return { lift: 0.007 + hush * 0.009, rot: 0.30 + breath * 0.44 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0038 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.15 * (1 - u) };
  }
export function pawdousePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.pawdouse));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0022, lift: s * -0.022, rot: s * 3.8 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const rinse = Math.sin((u - 0.10) / 0.76 * Math.PI * 3.4);
      const drip = Math.sin(t * 6.0) + 0.16 * Math.sin(t * 12.0);
      return { x: fromX + face * (0.0022 + rinse * 0.0016 + drip * 0.00030), lift: -0.018 + Math.abs(rinse) * 0.013 + Math.abs(drip) * 0.006, rot: (3.8 + rinse * 2.6 + drip * 1.6) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0022 * (1 - s), lift: -0.005 * (1 - s), rot: 0.6 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function litterdigPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.litterdig));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0011, lift: s * -0.016, rot: s * -4.4 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const dig = Math.sin((u - 0.09) / 0.79 * Math.PI * 4.2);
      const rake = Math.sin(t * 7.0) + 0.18 * Math.sin(t * 14.0);
      return { x: fromX + face * (0.0011 + dig * 0.0014 + rake * 0.00030), lift: -0.012 + Math.abs(dig) * 0.015 + Math.abs(rake) * 0.006, rot: (-4.4 + dig * 4.2 + rake * 2.0) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0011 * (1 - s), lift: -0.003 * (1 - s), rot: -0.6 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function rearstandPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.rearstand));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0008, lift: s * 0.042, rot: s * 2.4 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const sway = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.8);
      const peer = Math.sin(t * 4.8) + 0.14 * Math.sin(t * 9.6);
      return { x: fromX + face * (0.0008 + sway * 0.0007 + peer * 0.00022), lift: 0.040 + Math.abs(sway) * 0.010 + Math.abs(peer) * 0.005, rot: (2.4 + sway * 1.8 + peer * 1.2) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.008 * (1 - s), rot: 0.35 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function maskpeerPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.maskpeer));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0014, lift: s * 0.014, rot: s * 3.2 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.86) {
      const peer = Math.sin((u - 0.11) / 0.75 * Math.PI * 3.8);
      const mask = Math.sin(t * 7.6) + 0.17 * Math.sin(t * 15.2);
      return { x: fromX + face * (0.0014 + peer * 0.0010 + mask * 0.00028), lift: 0.012 + Math.abs(peer) * 0.010 + Math.abs(mask) * 0.005, rot: (3.2 + peer * 2.4 + mask * 1.7) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0014 * (1 - s), lift: 0.002 * (1 - s), rot: 0.4 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: RaccoonTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "pawdouse" && trick.kind !== "litterdig" && trick.kind !== "rearstand" && trick.kind !== "maskpeer") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "procyon") {
      if (next.t < PROCYON_HOLD) {
        const pose = procyonPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PROCYON_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PROCYON_HOLD);
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
    if (next.kind === "pawdouse") {
      const pose = pawdousePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "litterdig") {
      const pose = litterdigPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rearstand") {
      const pose = rearstandPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = maskpeerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }