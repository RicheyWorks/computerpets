/** Tun ground tricks while idle. House neighborly Tardigrada / Eutardigrada Water Bear cryptobiosis life — cryptotun / clawamble / mosssip / waterbearroll / eutardigrada personality (cryptotun tun-ball cryptobiosis settle without naming tun or barrel or dry or curl or ball or roll or crypt or sleep alone as wait, clawamble stub claw walk on moss film without naming claw or walk or moss or amble or march or grip or cling or latch, mosssip stylet moss suck without naming sip or suck or stylet or moss or pierce or feed or drink or probe, waterbearroll plump roll amble without naming roll or plump or amble or tumble or ball or barrel or curl alone as wait, long eutardigrada Eutardigrada Tardigrada water bear hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or furculaflick or antennawalk or moistclingsoil or foldtuck or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or tunstate or clawgrip or mossfilm or styletprobe or hypsibius; window-play and Call Tun leave tardigrade alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop own their tricks; guest slug Tun / key tardigrade — accept "tardigrade" and "tun" (roster slug tun; campaign Tun); do NOT confuse with Hop the Springtail (key springtail / slug hop) or denshop thank-you; do NOT confuse with Jet the Velvet Worm (key velvet_worm / slug jet) or densjet thank-you; do NOT confuse with Cast the Earthworm (key earthworm / slug cast) or denscast thank-you; do NOT confuse with Armor the Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT name a trick tardigrade or tun or springtail or hop or velvet_worm or jet or earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste. Thank-yous denstun / inktun / densclaw. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop tardigrade-tricks.js. Window-play unchanged. True Water Bear Eutardigrada Tardigrada desk life — tun cryptobiosis barrel, stub claw walk, stylet moss suck, and plump roll amble; not Orchesella springtail/Collembola clones (furculaflick/antennawalk/moistclingsoil/foldtuck), not Peripatus velvet worm/Onychophora clones (slimejet/lobopod/antennawhip/preyharpoon), not Lumbricus earthworm/Annelida clones (peristalse/castheap/surfacerise/soilanchor), not Armadillidium pillbug/Isopoda clones — true tardigrade cryptobiosis distinct from springtail furcula leap and worm peristalsis. Next house-order guest after Tun still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "tardigrade";
export const TRICKS = ["cryptotun", "clawamble", "mosssip", "waterbearroll", "eutardigrada"] as const;
export const HAPPY = ["denstun", "inktun", "densclaw"] as const;
export type TardigradeTrickKind = (typeof TRICKS)[number];
export type TardigradeHappyKind = (typeof HAPPY)[number];
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

export type TardigradeTrick = {
  kind: TardigradeTrickKind;
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

export type TardigradeHappy = {
  kind: TardigradeHappyKind;
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

export const HAPPY_DUR = { denstun: 2.48, inktun: 2.64, densclaw: 2.38 } as const;
export const EUTARDIGRADA_HOLD = 24.10;
export const RELEASE_S = 2.10;
export const DUR = { eutardigrada: EUTARDIGRADA_HOLD + RELEASE_S, cryptotun: 4.48, clawamble: 4.35, mosssip: 4.05, waterbearroll: 4.28 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TardigradeTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "eutardigrada") return 158 + roll * 14;
  if (kind === "cryptotun") return 26.2 + roll * 4.2;
  if (kind === "clawamble") return 25.4 + roll * 3.9;
  if (kind === "mosssip") return 25.8 + roll * 4.0;
  if (kind === "waterbearroll") return 25.2 + roll * 3.7;
  return justFinished ? 18.6 + roll * 2.6 : 13.8 + roll * 2.2;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: TardigradeTrickKind | string | null) {
    if (musicOn) return "eutardigrada";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "eutardigrada") {
      if (roll < 0.26) return "cryptotun";
      if (roll < 0.5) return "clawamble";
      if (roll < 0.74) return "mosssip";
      return "waterbearroll";
    }
    if (lastKind === "cryptotun") {
      if (roll < 0.26) return "eutardigrada";
      if (roll < 0.5) return "clawamble";
      if (roll < 0.74) return "mosssip";
      return "waterbearroll";
    }
    if (lastKind === "clawamble") {
      if (roll < 0.22) return "eutardigrada";
      if (roll < 0.44) return "cryptotun";
      if (roll < 0.68) return "mosssip";
      return "waterbearroll";
    }
    if (roll < 0.2) return "eutardigrada";
    if (roll < 0.4) return "cryptotun";
    if (roll < 0.6) return "clawamble";
    if (roll < 0.8) return "mosssip";
    return "waterbearroll";
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
    return key === TRICK_KEY || key === "tun";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: TardigradeHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: TardigradeHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: TardigradeHappyKind | string, x: number, facing: 1 | -1): TardigradeHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denstun";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denstun" ? "sit" : name === "inktun" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denstunPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstun));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0042, rot: s * 0.36, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.2);
      return { lift: 0.0042 + bob * 0.0018, rot: 0.36 + bob * 0.28, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0042 * (1 - s), rot: 0.36 * (1 - s), anim: "idle" as TrickAnim };
  }
export function inktunPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inktun));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0048, rot: s * -0.42, anim: "talk" as TrickAnim };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.6);
      return { lift: 0.0048 + Math.abs(pulse) * 0.0018, rot: -0.42 + pulse * 0.34, anim: "talk" as TrickAnim };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0048 * (1 - s), rot: -0.42 * (1 - s), anim: "idle" as TrickAnim };
  }
export function densclawPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densclaw));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0036, rot: s * 0.28, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const grip = Math.sin((u - 0.12) / 0.66 * Math.PI * 3.0);
      return { lift: 0.0036 + Math.abs(grip) * 0.0016, rot: 0.28 + grip * 0.24, anim: "play" as TrickAnim };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0036 * (1 - s), rot: 0.28 * (1 - s), anim: "idle" as TrickAnim };
  }
export function stepHappy(happy: TardigradeHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denstun") {
      const pose = denstunPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inktun") {
      const pose = inktunPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densclawPose(next.t);
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
export function beginTrick(kind: TardigradeTrickKind, x: number, facing: 1 | -1): TardigradeTrick {
    const anim: TrickAnim =
      kind === "eutardigrada"
        ? "sit"
        : kind === "cryptotun"
          ? "sit"
          : kind === "clawamble"
            ? "play"
            : kind === "mosssip"
              ? "play"
              : kind === "waterbearroll"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "eutardigrada" ? "hold" : "go",
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
export function eutardigradaPose(t: number) {
    const breath = Math.sin(t * 0.0042) + 0.0018 * Math.sin(t * 0.0116);
    const hush = Math.abs(Math.sin(t * 0.0026));
    return { lift: 0.00028 + hush * 0.00052, rot: -0.008 + breath * 0.018 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00028 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.008 * (1 - u) };
  }
export function cryptotunPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.cryptotun));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00045, lift: s * 0.0042, rot: s * 0.42 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.42) {
      const barrel = smoothstep((u - 0.16) / 0.26);
      return { x: fromX + face * (0.00045 + barrel * 0.00028), lift: 0.0042 + barrel * 0.0028, rot: (0.42 + barrel * 0.28) * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.82) {
      const hold = Math.sin((u - 0.42) / 0.40 * Math.PI * 1.4);
      const dry = Math.sin(t * 0.62) + 0.04 * Math.sin(t * 1.24);
      return { x: fromX + face * (0.00073 + hold * 0.00018 + dry * 0.00004), lift: 0.0070 + Math.abs(hold) * 0.0009 + Math.abs(dry) * 0.0005, rot: (0.70 + hold * 0.12 + dry * 0.06) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.00073 * (1 - s), lift: 0.0070 * (1 - s) + s * 0.0003, rot: 0.70 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function clawamblePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.clawamble));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00022, lift: s * 0.0018, rot: s * -0.14 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const grip = Math.sin((u - 0.12) / 0.74 * Math.PI * 4.4);
      const moss = Math.sin(t * 0.74) + 0.035 * Math.sin(t * 1.48);
      return { x: fromX + face * (0.00022 + grip * 0.00048 + moss * 0.00005), lift: 0.0016 + Math.abs(grip) * 0.0016 + Math.abs(moss) * 0.0007, rot: (-0.14 + grip * 0.26 + moss * 0.08) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00022 * (1 - s), lift: 0.0016 * (1 - s) + s * 0.00035, rot: -0.014 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function mosssipPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.mosssip));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0010, rot: s * 0.08 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const crawl = Math.sin((u - 0.10) / 0.78 * Math.PI * 5.6);
      const film = Math.sin(t * 0.82) + 0.03 * Math.sin(t * 1.64);
      return { x: fromX + face * (0.00028 + (u - 0.10) / 0.78 * 0.0046 + crawl * 0.00038 + film * 0.00006), lift: 0.0009 + Math.abs(crawl) * 0.0011 + Math.abs(film) * 0.0005, rot: (0.08 + crawl * 0.18 + film * 0.06) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0046 * (1 - s), lift: 0.0005 * (1 - s), rot: 0.012 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function waterbearrollPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.waterbearroll));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00055, lift: s * 0.0036, rot: s * 0.28 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const probe = Math.sin((u - 0.14) / 0.70 * Math.PI * 6.0);
      const cell = Math.sin(t * 0.92) + 0.04 * Math.sin(t * 1.84);
      return { x: fromX + face * (0.00055 + probe * 0.00055 + cell * 0.00007), lift: 0.0036 + Math.abs(probe) * 0.0015 + Math.abs(cell) * 0.0006, rot: (0.28 + probe * 0.22 + cell * 0.09) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00032 * (1 - s), lift: 0.0014 * (1 - s) + s * 0.0003, rot: 0.016 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: TardigradeTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "cryptotun" && trick.kind !== "clawamble" && trick.kind !== "mosssip" && trick.kind !== "waterbearroll") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "eutardigrada") {
      if (next.t < EUTARDIGRADA_HOLD) {
        const pose = eutardigradaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < EUTARDIGRADA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - EUTARDIGRADA_HOLD);
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
    if (next.kind === "cryptotun") {
      const pose = cryptotunPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "clawamble") {
      const pose = clawamblePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mosssip") {
      const pose = mosssipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = waterbearrollPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }