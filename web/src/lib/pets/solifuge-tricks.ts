/** Gale ground tricks while idle. House neighborly Solifugae / Eremobates pallipes camel-spider windscorpion desk life — malleoli / suctorial / chelicrush / sprintburst / eremobates personality (malleoli racquet-organ vibration-sense without naming sense or feel or probe or tip or wave or bob or haller or antennule or palp or flagellum or acetic or pedipalp or metasoma, suctorial pedipalp-sucker blotter-reach without naming sucker or suck or cling or latch or grip or clasp or pinch or palpcrush or adhesive or climb or tip or wave, chelicrush huge-chelicerae prey-mill without naming bite or chew or crush or seize or hold or chelate or snap or eat or feed or jaw or fang or venom, sprintburst wind-sprint blotter-dash without naming run or dart or dash or sprint or chase or hunt or leap or hop or pounce or cursor or cursorial or gale or wind, long eremobates Eremobates pallipes blotter-dish hold — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or urticate or threat or cork or ecdysis or aphonopelma or hourglass or tangle or wrap or gumfoot or latrodectus or legwave or oscillate or autotomy or gregarious or phalangium or pedipalp or metasoma or fluoresce or sanddig or centruroides or flagellum or acetic or palpcrush or trayburrow or mastigoproctus or quest or haller or hypostome or engorge or ixodes or promenade or oil or dab or tip or drum or sip or hover; window-play RUN and Call Gale leave solifuge alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp own their tricks; guest slug Gale / key solifuge — accept "solifuge" and "gale"; do NOT name a trick solifuge or gale or camel or wind or spider or scorpion or tick or mite or insect or silk or web or venom or gaze). Thank-yous pallipes / durangonus / dishrun. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop solifuge-tricks.js. Window-play RUN unchanged. True solifuge camel-spider windscorpion desk life — not tick/vinegaroon/scorpion/harvestman/widow/tarantula/wolf-spider/jumping-spider/orb-weaver/crayfish/octopus clones. Flag owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "solifuge";
export const TRICKS = ["malleoli", "suctorial", "chelicrush", "sprintburst", "eremobates"] as const;
export const HAPPY = ["pallipes", "durangonus", "dishrun"] as const;
export type SolifugeTrickKind = (typeof TRICKS)[number];
export type SolifugeHappyKind = (typeof HAPPY)[number];
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

export type SolifugeTrick = {
  kind: SolifugeTrickKind;
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

export type SolifugeHappy = {
  kind: SolifugeHappyKind;
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

export const HAPPY_DUR = { pallipes: 1.80, durangonus: 1.94, dishrun: 1.86 } as const;
export const EREMOBATES_HOLD = 19.92;
export const RELEASE_S = 1.30;
export const DUR = { eremobates: EREMOBATES_HOLD + RELEASE_S, malleoli: 2.74, suctorial: 2.68, chelicrush: 2.90, sprintburst: 2.82 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SolifugeTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "eremobates") return 98 + roll * 28;
  if (kind === "malleoli") return 16.6 + roll * 9.6;
  if (kind === "suctorial") return 17.8 + roll * 10.2;
  if (kind === "sprintburst") return 19.2 + roll * 10.8;
  return justFinished ? 15.8 + roll * 8.6 : 9.8 + roll * 7.8;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SolifugeTrickKind | string | null) {
    if (musicOn) return "eremobates";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "eremobates") {
      if (roll < 0.26) return "malleoli";
      if (roll < 0.5) return "suctorial";
      if (roll < 0.74) return "chelicrush";
      return "sprintburst";
    }
    if (lastKind === "malleoli") {
      if (roll < 0.26) return "eremobates";
      if (roll < 0.5) return "suctorial";
      if (roll < 0.74) return "chelicrush";
      return "sprintburst";
    }
    if (lastKind === "suctorial") {
      if (roll < 0.22) return "eremobates";
      if (roll < 0.44) return "malleoli";
      if (roll < 0.68) return "chelicrush";
      return "sprintburst";
    }
    if (roll < 0.2) return "eremobates";
    if (roll < 0.4) return "malleoli";
    if (roll < 0.6) return "suctorial";
    if (roll < 0.8) return "chelicrush";
    return "sprintburst";
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
    return key === TRICK_KEY || key === "gale";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: SolifugeHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: SolifugeHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: SolifugeHappyKind | string, x: number, facing: 1 | -1): SolifugeHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "pallipes";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "pallipes" ? "sit" : name === "durangonus" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function pallipesPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pallipes));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.018, rot: s * 2.40, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.2) + 0.14 * Math.sin(t * 8.4);
      return { lift: 0.018 + Math.abs(flash) * 0.012, rot: 2.40 + flash * 1.40, dx: flash * 0.00075, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.005 * (1 - s), rot: 0.30 * (1 - s), dx: 0, anim: "idle" };
  }
export function durangonusPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.durangonus));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.036, rot: s * -3.00, dx: s * 0.0016, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.1) + 0.16 * Math.sin(t * 6.2);
      return { lift: 0.036 + Math.abs(spring) * 0.018, rot: -3.00 + spring * 2.30, dx: spring * 0.0020, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.011 * (1 - s), rot: -0.40 * (1 - s), dx: 0, anim: "sit" };
  }
export function dishrunPose(t: number) {
    return { lift: 0.009 + Math.abs(Math.sin(t * 0.18)) * 0.014, rot: Math.sin(t * 0.18) * 1.20, dx: Math.sin(t * 0.14) * 0.00080, anim: "sit" };
  }
export function stepHappy(happy: SolifugeHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "pallipes") {
      const pose = pallipesPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "durangonus") {
      const pose = durangonusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dishrunPose(next.t);
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
export function beginTrick(kind: SolifugeTrickKind, x: number, facing: 1 | -1): SolifugeTrick {
    const anim: TrickAnim =
      kind === "eremobates"
        ? "sit"
        : kind === "malleoli"
          ? "talk"
          : kind === "suctorial"
            ? "talk"
            : kind === "chelicrush"
              ? "play"
              : kind === "sprintburst"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "eremobates" ? "hold" : "go",
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
export function eremobatesPose(t: number) {
    const breath = Math.sin(t * 0.052) + 0.038 * Math.sin(t * 0.15);
    const hush = Math.abs(Math.sin(t * 0.068));
    return { lift: 0.007 + hush * 0.007, rot: 0.32 + breath * 0.42 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0040 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.16 * (1 - u) };
  }
export function malleoliPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.malleoli));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0009, lift: s * 0.018, rot: s * 5.4 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.88) {
      const racquet = Math.sin((u - 0.10) / 0.78 * Math.PI * 6.2);
      const sense = Math.sin(t * 9.4) + 0.22 * Math.sin(t * 18.8);
      return { x: fromX + face * (0.0009 + racquet * 0.0016 + sense * 0.00040), lift: 0.014 + Math.abs(racquet) * 0.012 + Math.abs(sense) * 0.005, rot: (5.4 + racquet * 3.6 + sense * 2.4) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0009 * (1 - s), lift: 0.004 * (1 - s), rot: 0.8 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function suctorialPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.suctorial));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0022, lift: s * 0.032, rot: s * -6.8 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const reach = Math.sin((u - 0.12) / 0.72 * Math.PI * 3.6);
      const suck = Math.sin(t * 5.4) + 0.18 * Math.sin(t * 10.8);
      return { x: fromX + face * (0.0022 + reach * 0.0012 + suck * 0.00035), lift: 0.028 + Math.abs(reach) * 0.014 + Math.abs(suck) * 0.006, rot: (-6.8 + reach * 2.8 + suck * 1.6) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0022 * (1 - s), lift: 0.008 * (1 - s), rot: -1.0 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function chelicrushPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.chelicrush));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0010, lift: s * -0.014, rot: s * 7.2 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const jaw = Math.sin((u - 0.11) / 0.75 * Math.PI * 5.0);
      const grind = Math.sin(t * 7.2) + 0.20 * Math.sin(t * 14.4);
      return { x: fromX + face * (0.0010 + jaw * 0.0008 + grind * 0.00030), lift: -0.012 + Math.abs(jaw) * 0.016 + Math.abs(grind) * 0.006, rot: (7.2 + jaw * 3.0 + grind * 2.0) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0010 * (1 - s), lift: -0.003 * (1 - s), rot: 1.1 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function sprintburstPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.sprintburst));
    const face = facing == null ? 1 : facing;
    if (u < 0.08) {
      const s = smoothstep(u / 0.08);
      return { x: fromX + face * s * 0.0040, lift: s * 0.022, rot: s * -4.2 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.55) {
      const dash = smoothstep((u - 0.08) / 0.47);
      const skitter = Math.sin(t * 14.0) + 0.14 * Math.sin(t * 28.0);
      return { x: fromX + face * (0.0040 + dash * 0.018 + skitter * 0.00055), lift: 0.018 + Math.abs(skitter) * 0.010, rot: (-4.2 + dash * 2.4 + skitter * 1.8) * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const brake = Math.sin((u - 0.55) / 0.33 * Math.PI);
      return { x: fromX + face * (0.022 - brake * 0.0030), lift: 0.012 + Math.abs(brake) * 0.008, rot: (-1.2 + brake * 2.0) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.019 * (1 - s), lift: 0.004 * (1 - s), rot: -0.4 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: SolifugeTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "malleoli" && trick.kind !== "suctorial" && trick.kind !== "chelicrush" && trick.kind !== "sprintburst") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "eremobates") {
      if (next.t < EREMOBATES_HOLD) {
        const pose = eremobatesPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < EREMOBATES_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - EREMOBATES_HOLD);
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
    if (next.kind === "malleoli") {
      const pose = malleoliPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "suctorial") {
      const pose = suctorialPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "chelicrush") {
      const pose = chelicrushPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sprintburstPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }