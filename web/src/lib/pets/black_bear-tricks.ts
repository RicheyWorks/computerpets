/** Coal ground tricks while idle. House neighborly Ursidae / Ursus americanus American-black-bear oak-denside desk life — bipedrise / clawscar / berrypluck / denscrape / ursus personality (bipedrise bipedal upright denside scan without naming stand or rear or biped or upright or rise or tall or scan or alert or look or peer or watch, clawscar bole-claw scar mark without naming claw or scar or mark or rake or etch or scratch or scrape or tree or bole or trunk or bark or rub, berrypluck berry mast forage without naming berry or mast or forage or pluck or nibble or browse or eat or fruit or acorn or oak or reach or mouth, denscrape denside rub-scrape without naming den or scrape or rub or scratch or flank or shoulder or mark or scent or itch or lean, long ursus Ursus americanus surface-huff denside hush hold — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play RUN and Call Coal leave black_bear alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine own their tricks; guest slug Coal / key black_bear — accept "black_bear" and "coal" (roster slug coal; campaign Coal); do NOT name a trick black_bear or coal or bear or ursid or panda or red_panda or rui or porcupine or hedgehog or beaver or otter or raccoon or skunk or opossum or ferret or weasel or Bank or mining). Thank-yous denscoal / inkcoal / densberry. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop black_bear-tricks.js. Window-play RUN unchanged. True American-black-bear Ursidae desk life — not porcupine/beaver/opossum/skunk/raccoon/otter/squirrel/bat/deer/hedgehog/rui/ferret clones. Capybara owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "black_bear";
export const TRICKS = ["bipedrise", "clawscar", "berrypluck", "denscrape", "ursus"] as const;
export const HAPPY = ["denscoal", "inkcoal", "densberry"] as const;
export type BlackBearTrickKind = (typeof TRICKS)[number];
export type BlackBearHappyKind = (typeof HAPPY)[number];
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

export type BlackBearTrick = {
  kind: BlackBearTrickKind;
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

export type BlackBearHappy = {
  kind: BlackBearHappyKind;
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

export const HAPPY_DUR = { denscoal: 2.00, inkcoal: 2.14, densberry: 2.06 } as const;
export const URSUS_HOLD = 20.32;
export const RELEASE_S = 1.50;
export const DUR = { ursus: URSUS_HOLD + RELEASE_S, bipedrise: 2.94, clawscar: 2.88, berrypluck: 3.10, denscrape: 3.02 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BlackBearTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "ursus") return 118 + roll * 12;
  if (kind === "bipedrise") return 19.2 + roll * 7.0;
  if (kind === "clawscar") return 20.4 + roll * 7.6;
  if (kind === "denscrape") return 21.8 + roll * 8.2;
  return justFinished ? 17.8 + roll * 6.6 : 11.8 + roll * 5.8;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BlackBearTrickKind | string | null) {
    if (musicOn) return "ursus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "ursus") {
      if (roll < 0.26) return "bipedrise";
      if (roll < 0.5) return "clawscar";
      if (roll < 0.74) return "berrypluck";
      return "denscrape";
    }
    if (lastKind === "bipedrise") {
      if (roll < 0.26) return "ursus";
      if (roll < 0.5) return "clawscar";
      if (roll < 0.74) return "berrypluck";
      return "denscrape";
    }
    if (lastKind === "clawscar") {
      if (roll < 0.22) return "ursus";
      if (roll < 0.44) return "bipedrise";
      if (roll < 0.68) return "berrypluck";
      return "denscrape";
    }
    if (roll < 0.2) return "ursus";
    if (roll < 0.4) return "bipedrise";
    if (roll < 0.6) return "clawscar";
    if (roll < 0.8) return "berrypluck";
    return "denscrape";
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
    return key === TRICK_KEY || key === "coal";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: BlackBearHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: BlackBearHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: BlackBearHappyKind | string, x: number, facing: 1 | -1): BlackBearHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denscoal";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denscoal" ? "sit" : name === "inkcoal" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denscoalPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscoal));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.018, rot: s * 2.05, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 3.0) + 0.13 * Math.sin(t * 6.0);
      return { lift: 0.018 + Math.abs(flash) * 0.009, rot: 2.05 + flash * 1.15, dx: flash * 0.00060, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.26 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkcoalPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkcoal));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.042, rot: s * -2.60, dx: s * 0.00130, anim: "play" as TrickAnim };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 2.6) + 0.14 * Math.sin(t * 5.2);
      return { lift: 0.042 + Math.abs(spring) * 0.014, rot: -2.60 + spring * 2.10, dx: spring * 0.00158, anim: "play" as TrickAnim };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.007 * (1 - s), rot: -0.34 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function densberryPose(t: number) {
    return { lift: 0.0076 + Math.abs(Math.sin(t * 0.128)) * 0.0114, rot: Math.sin(t * 0.128) * 1.02, dx: Math.sin(t * 0.094) * 0.00064, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: BlackBearHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denscoal") {
      const pose = denscoalPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkcoal") {
      const pose = inkcoalPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densberryPose(next.t);
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
export function beginTrick(kind: BlackBearTrickKind, x: number, facing: 1 | -1): BlackBearTrick {
    const anim: TrickAnim =
      kind === "ursus"
        ? "sit"
        : kind === "bipedrise"
          ? "talk"
          : kind === "clawscar"
            ? "play"
            : kind === "berrypluck"
              ? "play"
              : kind === "denscrape"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "ursus" ? "hold" : "go",
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
export function ursusPose(t: number) {
    const breath = Math.sin(t * 0.036) + 0.030 * Math.sin(t * 0.108);
    const hush = Math.abs(Math.sin(t * 0.042));
    return { lift: 0.006 + hush * 0.012, rot: 0.18 + breath * 0.52 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0036 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.14 * (1 - u) };
  }
export function bipedrisePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.bipedrise));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0010, lift: s * 0.072, rot: s * -2.8 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const sway = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.4);
      const scan = Math.sin(t * 3.8) + 0.16 * Math.sin(t * 7.6);
      return { x: fromX + face * (0.0010 + sway * 0.0009 + scan * 0.00026), lift: 0.068 + Math.abs(sway) * 0.012 + Math.abs(scan) * 0.005, rot: (-2.8 + sway * 2.2 + scan * 1.3) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0010 * (1 - s), lift: 0.010 * (1 - s), rot: -0.42 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function clawscarPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.clawscar));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0024, lift: s * 0.028, rot: s * -5.2 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const rake = Math.sin((u - 0.10) / 0.76 * Math.PI * 5.0);
      const etch = Math.sin(t * 6.4) + 0.15 * Math.sin(t * 12.8);
      return { x: fromX + face * (0.0024 + rake * 0.0014 + etch * 0.00030), lift: 0.024 + Math.abs(rake) * 0.014 + Math.abs(etch) * 0.006, rot: (-5.2 + rake * 3.4 + etch * 1.8) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0024 * (1 - s), lift: 0.005 * (1 - s), rot: -0.55 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function berrypluckPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.berrypluck));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0016, lift: s * -0.022, rot: s * 4.4 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const pluck = Math.sin((u - 0.11) / 0.75 * Math.PI * 4.8);
      const nibble = Math.sin(t * 7.2) + 0.14 * Math.sin(t * 14.4);
      return { x: fromX + face * (0.0016 + pluck * 0.0011 + nibble * 0.00024), lift: -0.018 + Math.abs(pluck) * 0.015 + Math.abs(nibble) * 0.005, rot: (4.4 + pluck * 2.8 + nibble * 1.5) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0016 * (1 - s), lift: -0.004 * (1 - s), rot: 0.48 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function denscrapePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.denscrape));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * -0.0012, lift: s * 0.018, rot: s * 6.2 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.86) {
      const rub = Math.sin((u - 0.10) / 0.76 * Math.PI * 3.6);
      const scrape = Math.sin(t * 5.6) + 0.16 * Math.sin(t * 11.2);
      return { x: fromX + face * (-0.0012 + rub * 0.0015 + scrape * 0.00028), lift: 0.016 + Math.abs(rub) * 0.012 + Math.abs(scrape) * 0.005, rot: (6.2 + rub * 2.4 + scrape * 1.6) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * -0.0012 * (1 - s), lift: 0.004 * (1 - s), rot: 0.58 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: BlackBearTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "bipedrise" && trick.kind !== "clawscar" && trick.kind !== "berrypluck" && trick.kind !== "denscrape") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "ursus") {
      if (next.t < URSUS_HOLD) {
        const pose = ursusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < URSUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - URSUS_HOLD);
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
    if (next.kind === "bipedrise") {
      const pose = bipedrisePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "clawscar") {
      const pose = clawscarPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "berrypluck") {
      const pose = berrypluckPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscrapePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }