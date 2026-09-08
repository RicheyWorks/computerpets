/** Scud ground tricks while idle. House neighborly Amphipoda / Gammaridae Gammarus scud life — sidescull / detfossick / amplexcue / startleflex / gammarus personality (sidescull lateral side-scull swim-kick without naming swim or kick or scull or wave or glide or crawl or worm alone as wait, detfossick detritus fossick forage without naming fossick or detritus or forage or dig or sift or eat alone as wait, amplexcue pair-guard amplexus cue without naming amplexus or pair or guard or mate or clasp or hold alone as wait, startleflex startle flex tail-flick without naming startle or flex or flick or thrash or curl or reverse alone as wait, long gammarus Gammarus amphipod hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or sinusoid or dauerrest or pharynxpump or thrashturn or elegans or densthread or inkthread or densdauer or ciliaryglide or lightflee or preywrap or regensplit or dugesia or denshalf or inkhalf or denscilia or cryptotun or clawamble or mosssip or waterbearroll or eutardigrada or denstun or inktun or densclaw or furculaflick or antennawalk or moistclingsoil or foldtuck or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or tunstate or clawgrip or mossfilm or styletprobe or hypsibius or chelate or caridoid or chimney or antennule or astacid or sidescull or detfossick or amplexcue or startleflex or gammarus; window-play and Call Scud leave amphipod alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun/Half/Thread own their tricks; guest slug Scud / key amphipod — accept "amphipod" and "scud" (roster slug scud; campaign Scud); do NOT confuse with Thread the Nematode (key nematode / slug thread) or densthread thank-you; do NOT confuse with Half the Planarian (key planarian / slug half) or denshalf thank-you; do NOT confuse with Armor the Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT confuse with Cast the Earthworm (key earthworm / slug cast) or denscast thank-you; do NOT name a trick amphipod or scud or nematode or thread or planarian or half or tardigrade or tun or springtail or hop or velvet_worm or jet or earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste or fiddler_crab or wave or ghost_crab or pale. Thank-yous densscud / inkscud / densscull. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop amphipod-tricks.js. Window-play unchanged. True Gammarus amphipod desk life — lateral side-scull swim-kick, detritus fossick, pair-guard amplexus cue, and startle flex/tail flick; not Caenorhabditis nematode/Nematoda clones (sinusoid/dauerrest/pharynxpump/thrashturn), not Dugesia planarian/Platyhelminthes clones (ciliaryglide/lightflee/preywrap/regensplit), not Armadillidium pillbug/Isopoda clones (conglobate/volvation), not Astacus crayfish clones (chelate/caridoid), not fiddler/ghost crab wave clones — true side-swimmer amphipod life distinct from pillbug roll and crab wave. Next house-order guest after Scud still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "amphipod";
export const TRICKS = ["sidescull", "detfossick", "amplexcue", "startleflex", "gammarus"] as const;
export const HAPPY = ["densscud", "inkscud", "densscull"] as const;
export type AmphipodTrickKind = (typeof TRICKS)[number];
export type AmphipodHappyKind = (typeof HAPPY)[number];
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

export type AmphipodTrick = {
  kind: AmphipodTrickKind;
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

export type AmphipodHappy = {
  kind: AmphipodHappyKind;
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

export const HAPPY_DUR = { densscud: 2.48, inkscud: 2.64, densscull: 2.38 } as const;
export const GAMMARUS_HOLD = 24.50;
export const RELEASE_S = 2.18;
export const DUR = { gammarus: GAMMARUS_HOLD + RELEASE_S, sidescull: 4.48, detfossick: 4.35, amplexcue: 4.05, startleflex: 4.28 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AmphipodTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "gammarus") return 164 + roll * 14;
  if (kind === "sidescull") return 26.8 + roll * 4.5;
  if (kind === "detfossick") return 26.0 + roll * 4.2;
  if (kind === "amplexcue") return 26.4 + roll * 4.3;
  if (kind === "startleflex") return 25.4 + roll * 4.0;
  return justFinished ? 19.2 + roll * 2.9 : 14.4 + roll * 2.5;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: AmphipodTrickKind | string | null) {
    if (musicOn) return "gammarus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "gammarus") {
      if (roll < 0.26) return "sidescull";
      if (roll < 0.5) return "detfossick";
      if (roll < 0.74) return "amplexcue";
      return "startleflex";
    }
    if (lastKind === "sidescull") {
      if (roll < 0.26) return "gammarus";
      if (roll < 0.5) return "detfossick";
      if (roll < 0.74) return "amplexcue";
      return "startleflex";
    }
    if (lastKind === "detfossick") {
      if (roll < 0.22) return "gammarus";
      if (roll < 0.44) return "sidescull";
      if (roll < 0.68) return "amplexcue";
      return "startleflex";
    }
    if (roll < 0.2) return "gammarus";
    if (roll < 0.4) return "sidescull";
    if (roll < 0.6) return "detfossick";
    if (roll < 0.8) return "amplexcue";
    return "startleflex";
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
    return key === TRICK_KEY || key === "scud";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: AmphipodHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: AmphipodHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: AmphipodHappyKind | string, x: number, facing: 1 | -1): AmphipodHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densscud";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "densscud" ? "sit" : name === "inkscud" ? "play" : "play") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function densscudPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densscud));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0034, rot: s * -0.26, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.2);
      return { lift: 0.0034 + bob * 0.0015, rot: -0.26 + bob * 0.16, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0034 * (1 - s), rot: -0.26 * (1 - s), anim: "idle" as TrickAnim };
  }
export function inkscudPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkscud));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0040, rot: s * 0.34, anim: "talk" as TrickAnim };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.6);
      return { lift: 0.0040 + Math.abs(pulse) * 0.0015, rot: 0.34 + pulse * 0.24, anim: "talk" as TrickAnim };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0040 * (1 - s), rot: 0.34 * (1 - s), anim: "idle" as TrickAnim };
  }
export function densscullPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densscull));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0030, rot: s * -0.22, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const wave = Math.sin((u - 0.12) / 0.66 * Math.PI * 3.0);
      return { lift: 0.0030 + Math.abs(wave) * 0.0013, rot: -0.22 + wave * 0.18, anim: "play" as TrickAnim };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0030 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" as TrickAnim };
  }
export function stepHappy(happy: AmphipodHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densscud") {
      const pose = densscudPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkscud") {
      const pose = inkscudPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densscullPose(next.t);
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
export function beginTrick(kind: AmphipodTrickKind, x: number, facing: 1 | -1): AmphipodTrick {
    const anim: TrickAnim =
      kind === "gammarus"
        ? "sit"
        : kind === "sidescull"
          ? "play"
          : kind === "detfossick"
            ? "sit"
            : kind === "amplexcue"
              ? "sit"
              : kind === "startleflex"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "gammarus" ? "hold" : "go",
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
export function gammarusPose(t: number) {
    const breath = Math.sin(t * 0.0032) + 0.0015 * Math.sin(t * 0.0094);
    const hush = Math.abs(Math.sin(t * 0.0019));
    return { lift: 0.00020 + hush * 0.00036, rot: -0.018 + breath * 0.012 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00020 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.018 * (1 - u) };
  }
export function sidescullPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.sidescull));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00032, lift: s * 0.00070, rot: s * -0.28 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const kick = Math.sin((u - 0.10) / 0.78 * Math.PI * 7.4);
      const scull = Math.sin(t * 1.06) + 0.034 * Math.sin(t * 2.12);
      return { x: fromX + face * (0.00032 + (u - 0.10) / 0.78 * 0.0074 + kick * 0.00048 + scull * 0.00007), lift: 0.00070 + Math.abs(kick) * 0.00062 + Math.abs(scull) * 0.00030, rot: (-0.28 + kick * 0.16 + scull * 0.05) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0074 * (1 - s), lift: 0.00034 * (1 - s), rot: -0.014 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function detfossickPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.detfossick));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00014, lift: s * 0.00028, rot: s * 0.08 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const poke = Math.sin((u - 0.14) / 0.70 * Math.PI * 4.8);
      const sift = Math.sin(t * 0.62) + 0.024 * Math.sin(t * 1.24);
      return { x: fromX + face * (0.00014 + poke * 0.00022 + sift * 0.00005), lift: 0.00028 + Math.abs(poke) * 0.00042 + Math.abs(sift) * 0.00020, rot: (0.08 + poke * 0.10 + sift * 0.04) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00014 * (1 - s), lift: 0.00028 * (1 - s) + s * 0.00020, rot: 0.008 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function amplexcuePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.amplexcue));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00018, lift: s * 0.0012, rot: s * 0.14 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const hold = Math.sin((u - 0.12) / 0.74 * Math.PI * 2.2);
      const guard = Math.sin(t * 0.48) + 0.022 * Math.sin(t * 0.96);
      return { x: fromX + face * (0.00018 + hold * 0.00012 + guard * 0.00003), lift: 0.0012 + Math.abs(hold) * 0.00055 + Math.abs(guard) * 0.00028, rot: (0.14 + hold * 0.06 + guard * 0.03) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00014 * (1 - s), lift: 0.0006 * (1 - s) + s * 0.00022, rot: 0.012 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function startleflexPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.startleflex));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00016, lift: s * 0.0016, rot: s * 0.36 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.42) {
      const flex = Math.sin((u - 0.10) / 0.32 * Math.PI * 1.8);
      return { x: fromX + face * (0.00016 - flex * 0.00070), lift: 0.0016 + Math.abs(flex) * 0.0014, rot: (0.36 + flex * 0.42) * face, anim: "play" as TrickAnim };
    }
    if (u < 0.84) {
      const flick = Math.sin((u - 0.42) / 0.42 * Math.PI * 3.4);
      const uropod = Math.sin(t * 1.18) + 0.040 * Math.sin(t * 2.36);
      return { x: fromX + face * (-0.00050 + (u - 0.42) / 0.42 * -0.0032 + flick * 0.00040 + uropod * 0.00006), lift: 0.0018 + Math.abs(flick) * 0.0011 + Math.abs(uropod) * 0.00045, rot: (0.50 + flick * 0.22 + uropod * 0.07) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * (-0.0032) * (1 - s), lift: 0.0010 * (1 - s) + s * 0.00022, rot: 0.014 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: AmphipodTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "sidescull" && trick.kind !== "detfossick" && trick.kind !== "amplexcue" && trick.kind !== "startleflex") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "gammarus") {
      if (next.t < GAMMARUS_HOLD) {
        const pose = gammarusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < GAMMARUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - GAMMARUS_HOLD);
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
    if (next.kind === "sidescull") {
      const pose = sidescullPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "detfossick") {
      const pose = detfossickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "amplexcue") {
      const pose = amplexcuePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = startleflexPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }