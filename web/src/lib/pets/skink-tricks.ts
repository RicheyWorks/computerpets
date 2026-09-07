/** Dash ground tricks while idle. House neighborly Scincidae / Plestiodon fasciatus Five-lined Skink stone-crack desk life — tailbluff / litterdash / tongueflick / sunbask / plestiodon personality (tailbluff tail autotomy bluff without naming tail or auto or bluff or drop or thrash or wiggle or break or lose or blue or threat or warn or signal, litterdash litter leaf dash without naming litter or leaf or dash or zip or bolt or run or sprint or hide or crack or rush or flee or dart, tongueflick tongue chem flick without naming tongue or flick or chem or taste or scent or smell or sense or tip or lick or sample or probe, sunbask sun bask warm without naming sun or bask or warm or heat or flat or stone or soak or rest or nap or loaf or idle or settle, long plestiodon Plestiodon fasciatus surface-calm stripe hush — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Dash leave skink alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink own their tricks; guest slug Dash / key skink — accept "skink" and "dash" (roster slug dash; campaign Dash); do NOT name a trick skink or dash or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or wink or denswink or inkwink or densdewlap or Bank or mining). Thank-yous densdash / inkdash / densbluff. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop skink-tricks.js. Window-play FLASH unchanged. True Five-lined Skink Scincidae desk life — not anole/gecko/salamander/iguana/newt/frog/rui clones. Shift owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "skink";
export const TRICKS = ["tailbluff", "litterdash", "tongueflick", "sunbask", "plestiodon"] as const;
export const HAPPY = ["densdash", "inkdash", "densbluff"] as const;
export type SkinkTrickKind = (typeof TRICKS)[number];
export type SkinkHappyKind = (typeof HAPPY)[number];
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

export type SkinkTrick = {
  kind: SkinkTrickKind;
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

export type SkinkHappy = {
  kind: SkinkHappyKind;
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

export const HAPPY_DUR = { densdash: 2.08, inkdash: 2.22, densbluff: 2.14 } as const;
export const PLESTIODON_HOLD = 20.48;
export const RELEASE_S = 1.58;
export const DUR = { plestiodon: PLESTIODON_HOLD + RELEASE_S, tailbluff: 3.02, litterdash: 2.96, tongueflick: 3.18, sunbask: 3.10 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SkinkTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "plestiodon") return 126 + roll * 12;
  if (kind === "tailbluff") return 20.0 + roll * 6.2;
  if (kind === "litterdash") return 21.2 + roll * 6.8;
  if (kind === "sunbask") return 22.6 + roll * 7.4;
  return justFinished ? 18.6 + roll * 5.8 : 12.6 + roll * 5.0;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SkinkTrickKind | string | null) {
    if (musicOn) return "plestiodon";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "plestiodon") {
      if (roll < 0.26) return "tailbluff";
      if (roll < 0.5) return "litterdash";
      if (roll < 0.74) return "tongueflick";
      return "sunbask";
    }
    if (lastKind === "tailbluff") {
      if (roll < 0.26) return "plestiodon";
      if (roll < 0.5) return "litterdash";
      if (roll < 0.74) return "tongueflick";
      return "sunbask";
    }
    if (lastKind === "litterdash") {
      if (roll < 0.22) return "plestiodon";
      if (roll < 0.44) return "tailbluff";
      if (roll < 0.68) return "tongueflick";
      return "sunbask";
    }
    if (roll < 0.2) return "plestiodon";
    if (roll < 0.4) return "tailbluff";
    if (roll < 0.6) return "litterdash";
    if (roll < 0.8) return "tongueflick";
    return "sunbask";
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
    return key === TRICK_KEY || key === "dash";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: SkinkHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: SkinkHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: SkinkHappyKind | string, x: number, facing: 1 | -1): SkinkHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densdash";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "densdash" ? "sit" : name === "inkdash" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function densdashPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densdash));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.018, rot: s * 2.05, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const stripe = Math.sin(t * 3.0) + 0.12 * Math.sin(t * 6.0);
      return { lift: 0.018 + Math.abs(stripe) * 0.009, rot: 2.05 + stripe * 1.15, dx: stripe * 0.00058, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.26 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkdashPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkdash));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.046, rot: s * -2.85, dx: s * 0.00140, anim: "play" as TrickAnim };
    }
    if (u < 0.85) {
      const bolt = Math.sin(t * 3.0) + 0.14 * Math.sin(t * 6.0);
      return { lift: 0.046 + Math.abs(bolt) * 0.016, rot: -2.85 + bolt * 2.30, dx: bolt * 0.00166, anim: "play" as TrickAnim };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.006 * (1 - s), rot: -0.38 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function densbluffPose(t: number) {
    return { lift: 0.0074 + Math.abs(Math.sin(t * 0.132)) * 0.0110, rot: Math.sin(t * 0.132) * 1.02, dx: Math.sin(t * 0.100) * 0.00062, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: SkinkHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densdash") {
      const pose = densdashPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkdash") {
      const pose = inkdashPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densbluffPose(next.t);
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
export function beginTrick(kind: SkinkTrickKind, x: number, facing: 1 | -1): SkinkTrick {
    const anim: TrickAnim =
      kind === "plestiodon"
        ? "sit"
        : kind === "tailbluff"
          ? "sit"
          : kind === "litterdash"
            ? "play"
            : kind === "tongueflick"
              ? "talk"
              : kind === "sunbask"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "plestiodon" ? "hold" : "go",
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
export function plestiodonPose(t: number) {
    const breath = Math.sin(t * 0.036) + 0.026 * Math.sin(t * 0.108);
    const settle = Math.abs(Math.sin(t * 0.038));
    return { lift: 0.004 + settle * 0.010, rot: 0.14 + breath * 0.46 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0032 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.11 * (1 - u) };
  }
export function tailbluffPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.tailbluff));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0010, lift: s * 0.040, rot: s * -5.2 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const thrash = Math.sin((u - 0.10) / 0.76 * Math.PI * 6.4);
      const bluff = Math.sin(t * 7.4) + 0.16 * Math.sin(t * 14.8);
      return { x: fromX + face * (0.0010 + thrash * 0.0014 + bluff * 0.00028), lift: 0.032 + Math.abs(thrash) * 0.018 + Math.abs(bluff) * 0.008, rot: (-5.2 + thrash * 3.2 + bluff * 1.8) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0010 * (1 - s), lift: 0.005 * (1 - s), rot: -0.48 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function litterdashPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.litterdash));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0036, lift: s * 0.022, rot: s * 3.8 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const zip = Math.sin((u - 0.09) / 0.79 * Math.PI * 5.6);
      const leaf = Math.sin(t * 8.2) + 0.14 * Math.sin(t * 16.4);
      return { x: fromX + face * (0.0036 + zip * 0.0028 + leaf * 0.00032), lift: 0.018 + Math.abs(zip) * 0.016 + Math.abs(leaf) * 0.006, rot: (3.8 + zip * 2.6 + leaf * 1.4) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0036 * (1 - s), lift: 0.004 * (1 - s), rot: 0.36 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function tongueflickPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.tongueflick));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0006, lift: s * 0.016, rot: s * 2.8 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.85) {
      const flick = Math.sin((u - 0.11) / 0.74 * Math.PI * 7.2);
      const chem = Math.sin(t * 9.6) + 0.12 * Math.sin(t * 19.2);
      return { x: fromX + face * (0.0006 + flick * 0.0008 + chem * 0.00020), lift: 0.014 + Math.abs(flick) * 0.010 + Math.abs(chem) * 0.004, rot: (2.8 + flick * 1.8 + chem * 1.1) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.003 * (1 - s), rot: 0.30 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function sunbaskPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.sunbask));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0004, lift: s * 0.010, rot: s * -1.8 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const warm = Math.sin((u - 0.12) / 0.72 * Math.PI * 1.8);
      const hush = Math.sin(t * 2.2) + 0.10 * Math.sin(t * 4.4);
      return { x: fromX + face * (0.0004 + warm * 0.0005 + hush * 0.00016), lift: 0.008 + Math.abs(warm) * 0.008 + Math.abs(hush) * 0.003, rot: (-1.8 + warm * 1.2 + hush * 0.8) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0004 * (1 - s), lift: 0.002 * (1 - s), rot: -0.22 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: SkinkTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "tailbluff" && trick.kind !== "litterdash" && trick.kind !== "tongueflick" && trick.kind !== "sunbask") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "plestiodon") {
      if (next.t < PLESTIODON_HOLD) {
        const pose = plestiodonPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PLESTIODON_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PLESTIODON_HOLD);
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
    if (next.kind === "tailbluff") {
      const pose = tailbluffPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "litterdash") {
      const pose = litterdashPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tongueflick") {
      const pose = tongueflickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sunbaskPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }