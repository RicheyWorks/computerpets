/** Stripe ground tricks while idle. House neighborly Mephitidae / Mephitis mephitis striped-skunk ink-dish desk life — footstomp / duffgrub / handwarn / plumeaim / mephitis personality (footstomp plantigrade warn-stomp without naming stomp or stamp or foot or plant or dance or drum or thud or pound or warn or threat or kick, duffgrub duff-grub fossick without naming dig or bury or scratch or scrape or rake or fossick or litter or dirt or soil or hole or grub or forage, handwarn rear-handstand warn without naming stand or rear or upright or biped or rise or stretch or tall or handstand or hand or warn or threat or spray, plumeaim U-plume aim posture without naming spray or plume or aim or scent or musk or tail or flag or arch or threat or warn or stomp, long mephitis Mephitis mephitis freeze-alert ink hold — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover; window-play RUN and Call Stripe leave skunk alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash own their tricks; guest slug Stripe / key skunk — accept "skunk" and "stripe" (roster slug stripe; campaign Stripe); do NOT name a trick skunk or stripe or polecat or ferret or weasel or mink or otter or raccoon or coati or kinkajou). Thank-yous duffden / inkstripe / denscent. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop skunk-tricks.js. Window-play RUN unchanged. True striped-skunk Mephitidae desk life — not raccoon/otter/squirrel/bat/deer/solifuge/fox/rabbit/rui/ferret clones. Grin owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "skunk";
export const TRICKS = ["footstomp", "duffgrub", "handwarn", "plumeaim", "mephitis"] as const;
export const HAPPY = ["duffden", "inkstripe", "denscent"] as const;
export type SkunkTrickKind = (typeof TRICKS)[number];
export type SkunkHappyKind = (typeof HAPPY)[number];
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

export type SkunkTrick = {
  kind: SkunkTrickKind;
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

export type SkunkHappy = {
  kind: SkunkHappyKind;
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

export const HAPPY_DUR = { duffden: 1.92, inkstripe: 2.06, denscent: 1.98 } as const;
export const MEPHITIS_HOLD = 20.16;
export const RELEASE_S = 1.42;
export const DUR = { mephitis: MEPHITIS_HOLD + RELEASE_S, footstomp: 2.86, duffgrub: 2.80, handwarn: 3.02, plumeaim: 2.94 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SkunkTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "mephitis") return 110 + roll * 16;
  if (kind === "footstomp") return 18.4 + roll * 7.8;
  if (kind === "duffgrub") return 19.6 + roll * 8.4;
  if (kind === "plumeaim") return 21.0 + roll * 9.0;
  return justFinished ? 17.0 + roll * 7.4 : 11.0 + roll * 6.6;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SkunkTrickKind | string | null) {
    if (musicOn) return "mephitis";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "mephitis") {
      if (roll < 0.26) return "footstomp";
      if (roll < 0.5) return "duffgrub";
      if (roll < 0.74) return "handwarn";
      return "plumeaim";
    }
    if (lastKind === "footstomp") {
      if (roll < 0.26) return "mephitis";
      if (roll < 0.5) return "duffgrub";
      if (roll < 0.74) return "handwarn";
      return "plumeaim";
    }
    if (lastKind === "duffgrub") {
      if (roll < 0.22) return "mephitis";
      if (roll < 0.44) return "footstomp";
      if (roll < 0.68) return "handwarn";
      return "plumeaim";
    }
    if (roll < 0.2) return "mephitis";
    if (roll < 0.4) return "footstomp";
    if (roll < 0.6) return "duffgrub";
    if (roll < 0.8) return "handwarn";
    return "plumeaim";
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
    return key === TRICK_KEY || key === "stripe";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: SkunkHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: SkunkHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: SkunkHappyKind | string, x: number, facing: 1 | -1): SkunkHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "duffden";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "duffden" ? "sit" : name === "inkstripe" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function duffdenPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.duffden));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.020, rot: s * 2.20, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 3.6) + 0.15 * Math.sin(t * 7.2);
      return { lift: 0.020 + Math.abs(flash) * 0.011, rot: 2.20 + flash * 1.22, dx: flash * 0.00068, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.004 * (1 - s), rot: 0.28 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkstripePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkstripe));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.038, rot: s * -2.80, dx: s * 0.00138, anim: "play" as TrickAnim };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.0) + 0.15 * Math.sin(t * 6.0);
      return { lift: 0.038 + Math.abs(spring) * 0.016, rot: -2.80 + spring * 2.20, dx: spring * 0.00176, anim: "play" as TrickAnim };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.008 * (1 - s), rot: -0.36 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function denscentPose(t: number) {
    return { lift: 0.0080 + Math.abs(Math.sin(t * 0.148)) * 0.0122, rot: Math.sin(t * 0.148) * 1.06, dx: Math.sin(t * 0.112) * 0.00072, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: SkunkHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "duffden") {
      const pose = duffdenPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkstripe") {
      const pose = inkstripePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscentPose(next.t);
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
export function beginTrick(kind: SkunkTrickKind, x: number, facing: 1 | -1): SkunkTrick {
    const anim: TrickAnim =
      kind === "mephitis"
        ? "sit"
        : kind === "footstomp"
          ? "play"
          : kind === "duffgrub"
            ? "play"
            : kind === "handwarn"
              ? "talk"
              : kind === "plumeaim"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "mephitis" ? "hold" : "go",
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
export function mephitisPose(t: number) {
    const breath = Math.sin(t * 0.044) + 0.034 * Math.sin(t * 0.132);
    const hush = Math.abs(Math.sin(t * 0.052));
    return { lift: 0.006 + hush * 0.010, rot: 0.28 + breath * 0.46 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0036 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.14 * (1 - u) };
  }
export function footstompPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.footstomp));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0016, lift: s * 0.018, rot: s * -2.8 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const stomp = Math.sin((u - 0.10) / 0.76 * Math.PI * 5.0);
      const plant = Math.sin(t * 7.4) + 0.16 * Math.sin(t * 14.8);
      return { x: fromX + face * (0.0016 + stomp * 0.0011 + plant * 0.00028), lift: 0.010 + Math.abs(stomp) * 0.022 + Math.abs(plant) * 0.007, rot: (-2.8 + stomp * 3.6 + plant * 1.8) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0016 * (1 - s), lift: 0.004 * (1 - s), rot: -0.5 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function duffgrubPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.duffgrub));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0012, lift: s * -0.018, rot: s * -4.0 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const dig = Math.sin((u - 0.09) / 0.79 * Math.PI * 4.0);
      const grub = Math.sin(t * 6.6) + 0.18 * Math.sin(t * 13.2);
      return { x: fromX + face * (0.0012 + dig * 0.0015 + grub * 0.00032), lift: -0.014 + Math.abs(dig) * 0.016 + Math.abs(grub) * 0.006, rot: (-4.0 + dig * 4.0 + grub * 2.1) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0012 * (1 - s), lift: -0.003 * (1 - s), rot: -0.55 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function handwarnPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.handwarn));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.0006, lift: s * 0.058, rot: s * 6.4 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const sway = Math.sin((u - 0.13) / 0.71 * Math.PI * 2.4);
      const tip = Math.sin(t * 4.2) + 0.14 * Math.sin(t * 8.4);
      return { x: fromX + face * (0.0006 + sway * 0.0008 + tip * 0.00024), lift: 0.056 + Math.abs(sway) * 0.012 + Math.abs(tip) * 0.006, rot: (6.4 + sway * 2.2 + tip * 1.5) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.010 * (1 - s), rot: 0.8 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function plumeaimPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.plumeaim));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * -0.0018, lift: s * 0.028, rot: s * -5.2 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.86) {
      const aim = Math.sin((u - 0.11) / 0.75 * Math.PI * 3.2);
      const plume = Math.sin(t * 5.6) + 0.16 * Math.sin(t * 11.2);
      return { x: fromX + face * (-0.0018 + aim * 0.0012 + plume * 0.00030), lift: 0.026 + Math.abs(aim) * 0.011 + Math.abs(plume) * 0.005, rot: (-5.2 + aim * 2.8 + plume * 1.9) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * -0.0018 * (1 - s), lift: 0.004 * (1 - s), rot: -0.6 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: SkunkTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "footstomp" && trick.kind !== "duffgrub" && trick.kind !== "handwarn" && trick.kind !== "plumeaim") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "mephitis") {
      if (next.t < MEPHITIS_HOLD) {
        const pose = mephitisPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MEPHITIS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MEPHITIS_HOLD);
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
    if (next.kind === "footstomp") {
      const pose = footstompPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "duffgrub") {
      const pose = duffgrubPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "handwarn") {
      const pose = handwarnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = plumeaimPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }