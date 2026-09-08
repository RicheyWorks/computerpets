/** Half ground tricks while idle. House neighborly Platyhelminthes / Turbellaria Tiger Planarian life — regrow / pharynxsip / glidesheet / eyespotsweep / tigripalud personality (regrow regeneration bud pulse without naming grow or fission or split or bud or regenerate alone as wait, pharynxsip extendable pharynx sip feed without naming sip or suck or pharynx or feed or drink or probe or mouth, glidesheet ciliary mucus-sheet glide without naming glide or crawl or mucus or cilia or slide or swim or sheet, eyespotsweep eyespot light sweep without naming eye or spot or light or sweep or look or scan alone as wait, long tigripalud Girardia Dugesia tigrina tiger planarian hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or tunstate or clawgrip or mossfilm or styletprobe or hypsibius or denstun or inktun or densclaw or furculaflick or antennawalk or moistclingsoil or foldtuck or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or cryptotun or clawamble or mosssip or waterbearroll or eutardigrada or regrow or pharynxsip or glidesheet or eyespotsweep or tigripalud; window-play and Call Half leave planarian alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun own their tricks; guest slug Half / key planarian — accept "planarian" and "half" (roster slug half; campaign Half); do NOT confuse with Tun the Tardigrade (key tardigrade / slug tun) or denstun thank-you; do NOT confuse with Hop the Springtail (key springtail / slug hop) or denshop thank-you; do NOT confuse with Jet the Velvet Worm (key velvet_worm / slug jet) or densjet thank-you; do NOT confuse with Cast the Earthworm (key earthworm / slug cast) or denscast thank-you; do NOT confuse with Armor the Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT name a trick planarian or half or tardigrade or tun or springtail or hop or velvet_worm or jet or earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste or nematode or thread. Thank-yous denshalf / inkhalf / denspharyn. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop planarian-tricks.js. Window-play unchanged. True Tiger Planarian Dugesia Girardia tigrina desk life — regeneration bud, pharynx sip, ciliary mucus-sheet glide, and eyespot light sweep; not Hypsibius tardigrade/Tardigrada clones (tunstate/clawgrip/mossfilm/styletprobe), not Orchesella springtail/Collembola clones (furculaflick/antennawalk/moistclingsoil/foldtuck), not Peripatus velvet worm/Onychophora clones, not Lumbricus earthworm/Annelida clones (peristalse) — true flatworm ciliary glide distinct from water-bear claw/tun and worm peristalsis. Next house-order guest after Half still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "planarian";
export const TRICKS = ["regrow", "pharynxsip", "glidesheet", "eyespotsweep", "tigripalud"] as const;
export const HAPPY = ["denshalf", "inkhalf", "denspharyn"] as const;
export type PlanarianTrickKind = (typeof TRICKS)[number];
export type PlanarianHappyKind = (typeof HAPPY)[number];
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

export type PlanarianTrick = {
  kind: PlanarianTrickKind;
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

export type PlanarianHappy = {
  kind: PlanarianHappyKind;
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

export const HAPPY_DUR = { denshalf: 2.48, inkhalf: 2.64, denspharyn: 2.38 } as const;
export const TIGRIPALUD_HOLD = 24.30;
export const RELEASE_S = 2.14;
export const DUR = { tigripalud: TIGRIPALUD_HOLD + RELEASE_S, regrow: 4.48, pharynxsip: 4.35, glidesheet: 4.05, eyespotsweep: 4.28 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PlanarianTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "tigripalud") return 160 + roll * 14;
  if (kind === "regrow") return 26.6 + roll * 4.3;
  if (kind === "pharynxsip") return 25.6 + roll * 4.0;
  if (kind === "glidesheet") return 26.0 + roll * 4.1;
  if (kind === "eyespotsweep") return 25.0 + roll * 3.8;
  return justFinished ? 18.8 + roll * 2.7 : 14.0 + roll * 2.3;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: PlanarianTrickKind | string | null) {
    if (musicOn) return "tigripalud";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tigripalud") {
      if (roll < 0.26) return "regrow";
      if (roll < 0.5) return "pharynxsip";
      if (roll < 0.74) return "glidesheet";
      return "eyespotsweep";
    }
    if (lastKind === "regrow") {
      if (roll < 0.26) return "tigripalud";
      if (roll < 0.5) return "pharynxsip";
      if (roll < 0.74) return "glidesheet";
      return "eyespotsweep";
    }
    if (lastKind === "pharynxsip") {
      if (roll < 0.22) return "tigripalud";
      if (roll < 0.44) return "regrow";
      if (roll < 0.68) return "glidesheet";
      return "eyespotsweep";
    }
    if (roll < 0.2) return "tigripalud";
    if (roll < 0.4) return "regrow";
    if (roll < 0.6) return "pharynxsip";
    if (roll < 0.8) return "glidesheet";
    return "eyespotsweep";
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
    return key === TRICK_KEY || key === "half";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: PlanarianHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: PlanarianHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: PlanarianHappyKind | string, x: number, facing: 1 | -1): PlanarianHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denshalf";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "denshalf" ? "sit" : name === "inkhalf" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function denshalfPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshalf));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0036, rot: s * 0.28, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.0);
      return { lift: 0.0036 + bob * 0.0016, rot: 0.28 + bob * 0.22, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0036 * (1 - s), rot: 0.28 * (1 - s), anim: "idle" as TrickAnim };
  }
export function inkhalfPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhalf));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0042, rot: s * -0.36, anim: "talk" as TrickAnim };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.4);
      return { lift: 0.0042 + Math.abs(pulse) * 0.0016, rot: -0.36 + pulse * 0.30, anim: "talk" as TrickAnim };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0042 * (1 - s), rot: -0.36 * (1 - s), anim: "idle" as TrickAnim };
  }
export function denspharynPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspharyn));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0032, rot: s * 0.24, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const sip = Math.sin((u - 0.12) / 0.66 * Math.PI * 2.8);
      return { lift: 0.0032 + Math.abs(sip) * 0.0014, rot: 0.24 + sip * 0.20, anim: "play" as TrickAnim };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0032 * (1 - s), rot: 0.24 * (1 - s), anim: "idle" as TrickAnim };
  }
export function stepHappy(happy: PlanarianHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denshalf") {
      const pose = denshalfPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkhalf") {
      const pose = inkhalfPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denspharynPose(next.t);
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
export function beginTrick(kind: PlanarianTrickKind, x: number, facing: 1 | -1): PlanarianTrick {
    const anim: TrickAnim =
      kind === "tigripalud"
        ? "sit"
        : kind === "regrow"
          ? "sit"
          : kind === "pharynxsip"
            ? "sit"
            : kind === "glidesheet"
              ? "play"
              : kind === "eyespotsweep"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "tigripalud" ? "hold" : "go",
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
export function tigripaludPose(t: number) {
    const breath = Math.sin(t * 0.0038) + 0.0016 * Math.sin(t * 0.0108);
    const hush = Math.abs(Math.sin(t * 0.0024));
    return { lift: 0.00022 + hush * 0.00042, rot: -0.006 + breath * 0.014 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.006 * (1 - u) };
  }
export function regrowPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.regrow));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00032, lift: s * 0.0028, rot: s * 0.18 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.48) {
      const bud = smoothstep((u - 0.14) / 0.34);
      return { x: fromX + face * (0.00032 + bud * 0.00022), lift: 0.0028 + bud * 0.0022, rot: (0.18 + bud * 0.16) * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const pulse = Math.sin((u - 0.48) / 0.36 * Math.PI * 2.4);
      const grow = Math.sin(t * 0.58) + 0.035 * Math.sin(t * 1.16);
      return { x: fromX + face * (0.00054 + pulse * 0.00016 + grow * 0.00004), lift: 0.0050 + Math.abs(pulse) * 0.0010 + Math.abs(grow) * 0.00045, rot: (0.34 + pulse * 0.12 + grow * 0.05) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00054 * (1 - s), lift: 0.0050 * (1 - s) + s * 0.00028, rot: 0.34 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function pharynxsipPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.pharynxsip));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00048, lift: s * 0.0032, rot: s * 0.22 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const sip = Math.sin((u - 0.12) / 0.74 * Math.PI * 5.2);
      const feed = Math.sin(t * 0.88) + 0.04 * Math.sin(t * 1.76);
      return { x: fromX + face * (0.00048 + sip * 0.00042 + feed * 0.00006), lift: 0.0032 + Math.abs(sip) * 0.0014 + Math.abs(feed) * 0.00055, rot: (0.22 + sip * 0.20 + feed * 0.08) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00028 * (1 - s), lift: 0.0012 * (1 - s) + s * 0.00028, rot: 0.014 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function glidesheetPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.glidesheet));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00036, lift: s * 0.0008, rot: s * 0.06 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const glide = Math.sin((u - 0.10) / 0.78 * Math.PI * 4.8);
      const cilia = Math.sin(t * 0.76) + 0.028 * Math.sin(t * 1.52);
      return { x: fromX + face * (0.00036 + (u - 0.10) / 0.78 * 0.0052 + glide * 0.00032 + cilia * 0.00005), lift: 0.0007 + Math.abs(glide) * 0.0009 + Math.abs(cilia) * 0.0004, rot: (0.06 + glide * 0.14 + cilia * 0.05) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0052 * (1 - s), lift: 0.0004 * (1 - s), rot: 0.010 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function eyespotsweepPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.eyespotsweep));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00048, lift: s * 0.0032, rot: s * -0.28 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const sweep = Math.sin((u - 0.12) / 0.74 * Math.PI * 3.6);
      const light = Math.sin(t * 0.68) + 0.032 * Math.sin(t * 1.36);
      return { x: fromX + face * (0.00048 + sweep * 0.00055 + light * 0.00008), lift: 0.0032 + Math.abs(sweep) * 0.0018 + Math.abs(light) * 0.0007, rot: (-0.28 + sweep * 0.34 + light * 0.09) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00048 * (1 - s), lift: 0.0032 * (1 - s) + s * 0.0003, rot: -0.014 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: PlanarianTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "regrow" && trick.kind !== "pharynxsip" && trick.kind !== "glidesheet" && trick.kind !== "eyespotsweep") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "tigripalud") {
      if (next.t < TIGRIPALUD_HOLD) {
        const pose = tigripaludPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TIGRIPALUD_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TIGRIPALUD_HOLD);
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
    if (next.kind === "regrow") {
      const pose = regrowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pharynxsip") {
      const pose = pharynxsipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "glidesheet") {
      const pose = glidesheetPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = eyespotsweepPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }