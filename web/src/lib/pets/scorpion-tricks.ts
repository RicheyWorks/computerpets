/** Barb ground tricks while idle. House neighborly Buthidae / Centruroides striped-bark-scorpion desk life — pedipalp / metasoma / fluoresce / sanddig / centruroides personality (pedipalp chela grasp-wave without naming chelate or grasp or pincer or claw or hold or seize or pinch or feel or pat or probe or bob or palp or dragline or saccade or orient, metasoma telson arch-raise without naming telson or arch or sting or stinger or tail or raise or threat or warn or strike or coil, fluoresce UV-glow shimmer without naming glow or flash or shine or uv or light or bloom or spark or firefly or lamp, sanddig substrate sand-scrape without naming dig or burrow or fossor or scratch or scrape or rake or shovel or nest or nestguard, long centruroides Centruroides vittatus bark-tray blotter hold — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or urticate or threat or cork or ecdysis or aphonopelma or hourglass or tangle or wrap or gumfoot or latrodectus or legwave or oscillate or autotomy or gregarious or phalangium or promenade or oil or dab or tip or drum or sip or hover; window-play CARRY and Call Barb leave scorpion alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem own their tricks; guest slug Barb / key scorpion — accept "scorpion" and "barb"; do NOT name a trick scorpion or barb or sting or venom or spider or silk or web or gaze). Thank-yous vittatus / sculpturatus / gracilis. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop scorpion-tricks.js. Window-play CARRY unchanged. True buthid striped-bark-scorpion desk life — not harvestman/widow/tarantula/wolf-spider/jumping-spider/orb-weaver/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Whip owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "scorpion";
export const TRICKS = ["pedipalp", "metasoma", "fluoresce", "sanddig", "centruroides"] as const;
export const HAPPY = ["vittatus", "sculpturatus", "gracilis"] as const;
export type ScorpionTrickKind = (typeof TRICKS)[number];
export type ScorpionHappyKind = (typeof HAPPY)[number];
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

export type ScorpionTrick = {
  kind: ScorpionTrickKind;
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

export type ScorpionHappy = {
  kind: ScorpionHappyKind;
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

export const HAPPY_DUR = { vittatus: 1.74, sculpturatus: 1.88, gracilis: 1.80 } as const;
export const CENTRUROIDES_HOLD = 19.72;
export const RELEASE_S = 1.24;
export const DUR = { centruroides: CENTRUROIDES_HOLD + RELEASE_S, pedipalp: 2.64, metasoma: 2.58, fluoresce: 2.80, sanddig: 2.72 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ScorpionTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "centruroides") return 92 + roll * 34;
  if (kind === "pedipalp") return 15.4 + roll * 10.8;
  if (kind === "metasoma") return 16.6 + roll * 11.4;
  if (kind === "sanddig") return 18.0 + roll * 12.0;
  return justFinished ? 15.2 + roll * 9.2 : 9.2 + roll * 8.4;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ScorpionTrickKind | string | null) {
    if (musicOn) return "centruroides";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "centruroides") {
      if (roll < 0.26) return "pedipalp";
      if (roll < 0.5) return "metasoma";
      if (roll < 0.74) return "fluoresce";
      return "sanddig";
    }
    if (lastKind === "pedipalp") {
      if (roll < 0.26) return "centruroides";
      if (roll < 0.5) return "metasoma";
      if (roll < 0.74) return "fluoresce";
      return "sanddig";
    }
    if (lastKind === "metasoma") {
      if (roll < 0.22) return "centruroides";
      if (roll < 0.44) return "pedipalp";
      if (roll < 0.68) return "fluoresce";
      return "sanddig";
    }
    if (roll < 0.2) return "centruroides";
    if (roll < 0.4) return "pedipalp";
    if (roll < 0.6) return "metasoma";
    if (roll < 0.8) return "fluoresce";
    return "sanddig";
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
    return key === TRICK_KEY || key === "barb";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: ScorpionHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: ScorpionHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: ScorpionHappyKind | string, x: number, facing: 1 | -1): ScorpionHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "vittatus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "vittatus" ? "sit" : name === "sculpturatus" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function vittatusPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.vittatus));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.019, rot: s * 2.55, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.6) + 0.17 * Math.sin(t * 9.2);
      return { lift: 0.019 + Math.abs(flash) * 0.012, rot: 2.55 + flash * 1.50, dx: flash * 0.00075, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.005 * (1 - s), rot: 0.32 * (1 - s), dx: 0, anim: "idle" };
  }
export function sculpturatusPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sculpturatus));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.038, rot: s * -3.10, dx: s * 0.0016, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.4) + 0.19 * Math.sin(t * 6.8);
      return { lift: 0.038 + Math.abs(spring) * 0.017, rot: -3.10 + spring * 2.40, dx: spring * 0.0020, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.011 * (1 - s), rot: -0.40 * (1 - s), dx: 0, anim: "sit" };
  }
export function gracilisPose(t: number) {
    return { lift: 0.009 + Math.abs(Math.sin(t * 0.20)) * 0.013, rot: Math.sin(t * 0.20) * 1.22, dx: Math.sin(t * 0.15) * 0.00075, anim: "sit" };
  }
export function stepHappy(happy: ScorpionHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "vittatus") {
      const pose = vittatusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sculpturatus") {
      const pose = sculpturatusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gracilisPose(next.t);
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
export function beginTrick(kind: ScorpionTrickKind, x: number, facing: 1 | -1): ScorpionTrick {
    const anim: TrickAnim =
      kind === "centruroides"
        ? "sit"
        : kind === "pedipalp"
          ? "talk"
          : kind === "metasoma"
            ? "play"
            : kind === "fluoresce"
              ? "sit"
              : kind === "sanddig"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "centruroides" ? "hold" : "go",
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
export function centruroidesPose(t: number) {
    const breath = Math.sin(t * 0.06) + 0.05 * Math.sin(t * 0.18);
    const hang = Math.abs(Math.sin(t * 0.09));
    return { lift: 0.009 + hang * 0.007, rot: 0.38 + breath * 0.46 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.16 * (1 - u) };
  }
export function pedipalpPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.pedipalp));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0022, lift: s * 0.014, rot: s * 6.8 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const wave = Math.sin((u - 0.11) / 0.73 * Math.PI * 4.2);
      const pinch = Math.sin(t * 6.4) + 0.20 * Math.sin(t * 12.8);
      return { x: fromX + face * (0.0022 + wave * 0.0020 + pinch * 0.0006), lift: 0.012 + Math.abs(wave) * 0.009 + Math.abs(pinch) * 0.005, rot: (6.8 + wave * 3.2 + pinch * 2.4) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0022 * (1 - s), lift: 0.004 * (1 - s), rot: 1.0 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function metasomaPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.metasoma));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX - face * s * 0.0008, lift: s * 0.034, rot: s * -12.4 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.82) {
      const arch = Math.sin((u - 0.12) / 0.70 * Math.PI);
      const tip = Math.sin(t * 2.6) + 0.14 * Math.sin(t * 5.2);
      return { x: fromX - face * (0.0008 + arch * 0.0014), lift: 0.030 + arch * 0.014 + Math.abs(tip) * 0.005, rot: (-12.4 - arch * 4.8 + tip * 1.6) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX - face * 0.0008 * (1 - s), lift: 0.008 * (1 - s), rot: -2.0 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function fluorescePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.fluoresce));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 0.016, rot: s * 1.8 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.88) {
      const shimmer = Math.sin((u - 0.10) / 0.78 * Math.PI * 5.6);
      const pulse = Math.sin(t * 4.1) + 0.22 * Math.sin(t * 8.2);
      return { x: fromX + face * pulse * 0.00035, lift: 0.014 + Math.abs(shimmer) * 0.012 + Math.abs(pulse) * 0.006, rot: (1.8 + shimmer * 2.2 + pulse * 1.1) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.005 * (1 - s), rot: 0.4 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function sanddigPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.sanddig));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.0018, lift: s * -0.004, rot: s * 3.4 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const rake = Math.sin((u - 0.13) / 0.73 * Math.PI * 4.6);
      const grit = Math.sin(t * 5.8) + 0.16 * Math.sin(t * 11.6);
      return { x: fromX + face * (0.0018 + rake * 0.0024 + grit * 0.0005), lift: -0.002 + Math.abs(rake) * 0.010 + Math.abs(grit) * 0.004, rot: (3.4 + rake * 3.6 + grit * 1.5) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0018 * (1 - s), lift: 0.002 * (1 - s), rot: 0.6 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: ScorpionTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "pedipalp" && trick.kind !== "metasoma" && trick.kind !== "fluoresce" && trick.kind !== "sanddig") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "centruroides") {
      if (next.t < CENTRUROIDES_HOLD) {
        const pose = centruroidesPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CENTRUROIDES_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CENTRUROIDES_HOLD);
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
    if (next.kind === "pedipalp") {
      const pose = pedipalpPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "metasoma") {
      const pose = metasomaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fluoresce") {
      const pose = fluorescePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sanddigPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }