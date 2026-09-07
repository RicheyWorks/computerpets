/** Sip ground tricks while idle. House neighborly Trochilidae / Archilochus ruby-throated hummingbird desk life — nectary / shuttle / gorget / chip / archilochus personality (nectary flower-nectar bill-dip without naming sip or hover or probe or dart or drink or siphon or nectar or bloomfeed, shuttle courtship shuttle-dive without naming dive or stoop or soar or hover or pendulum or kettle or bind, gorget iridescent throat-flash without naming flash or flare or crest or hackles or fan or strut or jewel, chip chip-call chin-bob without naming cry or call or song or sing or feebee or carol or honk or kuk or zeet, long archilochus Archilochus colubris ruby-throat desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or oil or dab or tip or drum or sip or hover; window-play SIP and bird-fly Call Sip leave hummingbird alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own their tricks; guest slug Sip / key hummingbird — accept "hummingbird" and "sip"; do NOT name a trick hummingbird or sip or hover or nectar or dive or flash or chipcall or mantle). Thank-yous colubris / alexandri / calliope. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop hummingbird-tricks.js. Window-play SIP and bird-fly unchanged. True ruby-throated hummingbird desk life — not woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Loom owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "hummingbird";
export const TRICKS = ["nectary", "shuttle", "gorget", "chip", "archilochus"] as const;
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
  cmd?: string;
  windowPlay?: boolean;
  card?: boolean;
};

export type HummingbirdTrick = {
  kind: HummingbirdTrickKind;
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

export type HummingbirdHappy = {
  kind: HummingbirdHappyKind;
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

export const HAPPY_DUR = { colubris: 1.58, alexandri: 1.72, calliope: 1.66 } as const;
export const ARCHILOCHUS_HOLD = 19.22;
export const RELEASE_S = 1.10;
export const DUR = { archilochus: ARCHILOCHUS_HOLD + RELEASE_S, nectary: 2.52, shuttle: 2.60, gorget: 2.34, chip: 2.48 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HummingbirdTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "archilochus") return 84 + roll * 40;
  if (kind === "nectary") return 13.6 + roll * 12.8;
  if (kind === "shuttle") return 15.8 + roll * 13.2;
  if (kind === "chip") return 18.4 + roll * 11.8;
  return justFinished ? 13.6 + roll * 10.2 : 7.8 + roll * 9.4;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HummingbirdTrickKind | string | null) {
    if (musicOn) return "archilochus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "archilochus") {
      if (roll < 0.26) return "nectary";
      if (roll < 0.5) return "shuttle";
      if (roll < 0.74) return "gorget";
      return "chip";
    }
    if (lastKind === "nectary") {
      if (roll < 0.26) return "archilochus";
      if (roll < 0.5) return "shuttle";
      if (roll < 0.74) return "gorget";
      return "chip";
    }
    if (lastKind === "shuttle") {
      if (roll < 0.22) return "archilochus";
      if (roll < 0.44) return "nectary";
      if (roll < 0.68) return "gorget";
      return "chip";
    }
    if (roll < 0.2) return "archilochus";
    if (roll < 0.4) return "nectary";
    if (roll < 0.6) return "shuttle";
    if (roll < 0.8) return "gorget";
    return "chip";
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
    return key === TRICK_KEY || key === "sip";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: HummingbirdHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
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
export function beginHappy(kind: HummingbirdHappyKind | string, x: number, facing: 1 | -1): HummingbirdHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "colubris";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "colubris" ? "sit" : name === "alexandri" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function colubrisPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.colubris));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.022, rot: s * 2.35, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 6.4) + 0.26 * Math.sin(t * 12.8);
      return {
        lift: 0.022 + Math.abs(flash) * 0.016,
        rot: 2.35 + flash * 1.85,
        dx: flash * 0.0011,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.009 * (1 - s), rot: 0.48 * (1 - s), dx: 0, anim: "idle" };
  }
export function alexandriPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.alexandri));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.038, rot: s * -2.55, dx: s * 0.0015, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.6) + 0.25 * Math.sin(t * 8.8);
      return {
        lift: 0.038 + Math.abs(wriggle) * 0.022,
        rot: -2.55 + wriggle * 2.75,
        dx: wriggle * 0.0024,
        anim: "play",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.012 * (1 - s), rot: -0.45 * (1 - s), dx: 0, anim: "sit" };
  }
export function calliopePose(t: number) {
    return {
      lift: 0.010 + Math.abs(Math.sin(t * 0.32)) * 0.017,
      rot: Math.sin(t * 0.32) * 1.35,
      dx: Math.sin(t * 0.26) * 0.0012,
      anim: "sit",
    };
  }
export function stepHappy(happy: HummingbirdHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "colubris") {
      const pose = colubrisPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "alexandri") {
      const pose = alexandriPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = calliopePose(next.t);
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
export function beginTrick(kind: HummingbirdTrickKind, x: number, facing: 1 | -1): HummingbirdTrick {
    const anim: TrickAnim =
      kind === "archilochus"
        ? "sit"
        : kind === "nectary"
          ? "play"
          : kind === "shuttle"
            ? "play"
            : kind === "gorget"
              ? "sit"
              : kind === "chip"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "archilochus" ? "hold" : "go",
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
export function archilochusPose(t: number) {
    const breath = Math.sin(t * 0.11) + 0.07 * Math.sin(t * 0.31);
    const hum = Math.abs(Math.sin(t * 0.42));
    return {
      lift: 0.014 + hum * 0.018,
      rot: 0.48 + breath * 0.82,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.006 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.22 * (1 - u) };
  }
export function nectaryPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.nectary));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // nectary dips the bill into a blotter bloom without naming sip or hover
      return { x: fromX, lift: s * 0.036, rot: s * 14.5 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const sip = Math.sin(t * 22.0) + 0.28 * Math.sin(t * 44.0);
      return {
        x: fromX + face * sip * 0.0011,
        lift: 0.034 + Math.abs(sip) * 0.010,
        rot: (14.5 + sip * 3.2) * face,
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 0.010 * (1 - s),
      rot: 2.4 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
  }
export function shuttlePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.shuttle));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      // shuttle climbs for a courtship arc without naming dive or stoop
      return { x: fromX + face * s * 0.004, lift: s * 0.055, rot: s * -8.2 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const arc = Math.sin((u - 0.14) / 0.72 * Math.PI);
      const wobble = Math.sin(t * 6.2) + 0.2 * Math.sin(t * 12.4);
      return {
        x: fromX + face * (0.004 + arc * 0.010 + wobble * 0.0016),
        lift: 0.050 + arc * 0.028 + Math.abs(wobble) * 0.008,
        rot: (-8.2 + arc * 16.0 + wobble * 2.8) * face,
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + face * 0.004 * (1 - s),
      lift: 0.012 * (1 - s),
      rot: -1.4 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
  }
export function gorgetPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.gorget));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // gorget tilts the ruby throat into the lamp without naming flash
      return { x: fromX, lift: s * 0.018, rot: s * -5.6 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.88) {
      const gleam = Math.sin(t * 3.1) + 0.22 * Math.sin(t * 6.2);
      return {
        x: fromX + face * gleam * 0.0007,
        lift: 0.018 + Math.abs(gleam) * 0.009,
        rot: (-5.6 + gleam * 4.4) * face,
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 0.006 * (1 - s),
      rot: -0.8 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
  }
export function chipPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.chip));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      // chip bobs the chin for a silent chip without naming cry
      return { x: fromX, lift: s * 0.024, rot: s * 6.8 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.86) {
      const s = (u - 0.09) / 0.77;
      const phrase = Math.sin(s * Math.PI * 5.4);
      const settle = Math.abs(Math.sin(s * Math.PI * 10.8));
      return {
        x: fromX + face * phrase * 0.0014,
        lift: 0.020 + settle * 0.012,
        rot: (6.8 + phrase * 4.8) * face,
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 0.008 * (1 - s),
      rot: 1.0 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
  }
export function stepTrick(trick: HummingbirdTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "nectary" && trick.kind !== "shuttle" && trick.kind !== "gorget" && trick.kind !== "chip") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
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
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "nectary") {
      const pose = nectaryPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "shuttle") {
      const pose = shuttlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gorget") {
      const pose = gorgetPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = chipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }