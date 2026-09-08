/** Hop ground tricks while idle. House neighborly Collembola / Orchesella Springtail furcula life — furculaflick / antennawalk / moistclingsoil / foldtuck / orchesella personality (furculaflick furcula jump launch without naming jump or leap or spring or hop or bounce or flick or launch or vault alone as wait, antennawalk feeler walk without naming walk or crawl or march or feel or antenna or tap or probe or scan or sniff, moistclingsoil damp litter soil cling without naming cling or moist or damp or soil or litter or grip or stick or hold or wet, foldtuck furcula tuck rest without naming tuck or fold or rest or crouch or curl or sit or hush or wait alone, long orchesella Orchesella Collembola springtail hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or slimejet or lobopod or antennawhip or preyharpoon or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass; window-play and Call Hop leave springtail alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet own their tricks; guest slug Hop / key springtail — accept "springtail" and "hop" (roster slug hop; campaign Hop); do NOT confuse with Jet the Velvet Worm (key velvet_worm / slug jet) or densjet thank-you; do NOT confuse with Cast the Earthworm (key earthworm / slug cast) or denscast thank-you; do NOT confuse with Armor the Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT name a trick springtail or hop or velvet_worm or jet or earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste. Thank-yous denshop / inkhop / densfurcula. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web springtail-tricks.ts. Window-play unchanged. True Springtail Orchesella Collembola desk life — furcula jump launch with feeler walk, damp litter cling, and furcula tuck rest; not Peripatus velvet worm/Onychophora clones (slimejet/lobopod/antennawhip/preyharpoon), not Lumbricus earthworm/Annelida clones (peristalse/castheap/surfacerise/soilanchor), not Armadillidium pillbug/Isopoda clones (conglobate/volvation/antennafeel/detritusnip), not Narceus millipede/Diplopoda clones — true collembolan furcula distinct from worm peristalsis and pillbug ball-roll. Next house-order guest after Hop still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "springtail";
  const TRICKS = ["furculaflick", "antennawalk", "moistclingsoil", "foldtuck", "orchesella"];
  const HAPPY = ["denshop", "inkhop", "densfurcula"];
  const HAPPY_DUR = { denshop: 2.48, inkhop: 2.64, densfurcula: 2.38 };
  const ORCHESELLA_HOLD = 23.90;
  const RELEASE_S = 2.04;
  const DUR = { orchesella: ORCHESELLA_HOLD + RELEASE_S, furculaflick: 4.48, antennawalk: 4.35, moistclingsoil: 4.05, foldtuck: 4.28 };

  function canStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function shouldAbort(state) {
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

  function nextTrickWait(justFinished, rand, kind) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "orchesella") return 154 + roll * 14;
  if (kind === "furculaflick") return 25.0 + roll * 4.0;
  if (kind === "antennawalk") return 25.6 + roll * 4.0;
  if (kind === "moistclingsoil") return 24.0 + roll * 3.6;
  if (kind === "foldtuck") return 24.8 + roll * 3.8;
  return justFinished ? 18.2 + roll * 2.5 : 13.4 + roll * 2.1;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "orchesella";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "orchesella") {
      if (roll < 0.26) return "furculaflick";
      if (roll < 0.5) return "antennawalk";
      if (roll < 0.74) return "moistclingsoil";
      return "foldtuck";
    }
    if (lastKind === "furculaflick") {
      if (roll < 0.26) return "orchesella";
      if (roll < 0.5) return "antennawalk";
      if (roll < 0.74) return "moistclingsoil";
      return "foldtuck";
    }
    if (lastKind === "antennawalk") {
      if (roll < 0.22) return "orchesella";
      if (roll < 0.44) return "furculaflick";
      if (roll < 0.68) return "moistclingsoil";
      return "foldtuck";
    }
    if (roll < 0.2) return "orchesella";
    if (roll < 0.4) return "furculaflick";
    if (roll < 0.6) return "antennawalk";
    if (roll < 0.8) return "moistclingsoil";
    return "foldtuck";
  }

  function happyCanStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function happyShouldAbort(state) {
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

  function wantsThankYou(key) {
    return key === TRICK_KEY || key === "hop";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denshop";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denshop" ? "sit" : name === "inkhop" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denshopPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshop));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0055, rot: s * 0.48, anim: "sit" };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.6);
      return { lift: 0.0055 + bob * 0.0024, rot: 0.48 + bob * 0.36, anim: "sit" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0055 * (1 - s), rot: 0.48 * (1 - s), anim: "idle" };
  }
  function inkhopPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhop));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0060, rot: s * -0.52, anim: "talk" };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 3.0);
      return { lift: 0.0060 + Math.abs(pulse) * 0.0022, rot: -0.52 + pulse * 0.44, anim: "talk" };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0060 * (1 - s), rot: -0.52 * (1 - s), anim: "idle" };
  }
  function densfurculaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densfurcula));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0042, rot: s * 0.36, anim: "play" };
    }
    if (u < 0.78) {
      const spring = Math.sin((u - 0.12) / 0.66 * Math.PI * 3.4);
      return { lift: 0.0042 + Math.abs(spring) * 0.0020, rot: 0.36 + spring * 0.30, anim: "play" };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0042 * (1 - s), rot: 0.36 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denshop") {
      const pose = denshopPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkhop") {
      const pose = inkhopPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densfurculaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "orchesella"
        ? "sit"
        : kind === "furculaflick"
          ? "play"
          : kind === "antennawalk"
            ? "play"
            : kind === "moistclingsoil"
              ? "sit"
              : kind === "foldtuck"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "orchesella" ? "hold" : "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: anim,
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }


                      function orchesellaPose(t) {
    const breath = Math.sin(t * 0.0055) + 0.0020 * Math.sin(t * 0.0142);
    const hush = Math.abs(Math.sin(t * 0.0030));
    return { lift: 0.00040 + hush * 0.00064, rot: -0.010 + breath * 0.026 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00040 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.010 * (1 - u) };
  }

  function furculaflickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.furculaflick));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00035, lift: s * 0.0042, rot: s * -0.42 * face, anim: "play" };
    }
    if (u < 0.36) {
      const cock = smoothstep((u - 0.14) / 0.22);
      return { x: fromX + face * (0.00022 + cock * 0.00018), lift: 0.0028 + cock * 0.0042, rot: (-0.32 + cock * -0.28) * face, anim: "play" };
    }
    if (u < 0.52) {
      const snap = smoothstep((u - 0.36) / 0.16);
      return { x: fromX + face * (0.00040 + snap * 0.0028), lift: 0.0070 + snap * 0.0065, rot: (-0.60 + snap * 0.72) * face, anim: "play" };
    }
    if (u < 0.84) {
      const settle = Math.sin((u - 0.52) / 0.32 * Math.PI * 1.7);
      const twitch = Math.sin(t * 1.18) + 0.05 * Math.sin(t * 2.36);
      return { x: fromX + face * (0.0024 + settle * 0.00055 + twitch * 0.00007), lift: 0.0048 + Math.abs(settle) * 0.0018 + Math.abs(twitch) * 0.0008, rot: (0.12 + settle * 0.26 + twitch * 0.09) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0024 * (1 - s), lift: 0.0007 * (1 - s), rot: 0.018 * (1 - s) * face, anim: "idle" };
  }
  function antennawalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennawalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0014, rot: s * 0.14 * face, anim: "play" };
    }
    if (u < 0.88) {
      const stride = Math.sin((u - 0.10) / 0.78 * Math.PI * 6.4);
      const feel = Math.sin(t * 1.05) + 0.05 * Math.sin(t * 2.1);
      return { x: fromX + face * (0.00028 + (u - 0.10) / 0.78 * 0.0064 + stride * 0.00055 + feel * 0.00008), lift: 0.0012 + Math.abs(stride) * 0.0016 + Math.abs(feel) * 0.0007, rot: (0.14 + stride * 0.22 + feel * 0.12) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0064 * (1 - s), lift: 0.0006 * (1 - s), rot: 0.016 * (1 - s) * face, anim: "idle" };
  }
  function moistclingsoilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.moistclingsoil));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00016, lift: s * 0.0009, rot: s * -0.08 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const cling = Math.sin((u - 0.12) / 0.74 * Math.PI * 4.6);
      const damp = Math.sin(t * 0.82) + 0.04 * Math.sin(t * 1.64);
      return { x: fromX + face * (0.00016 + cling * 0.00028 + damp * 0.00005), lift: 0.0015 + Math.abs(cling) * 0.0018 + Math.abs(damp) * 0.0008, rot: (-0.08 + cling * 0.18 + damp * 0.08) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00016 * (1 - s), lift: 0.0008 * (1 - s) + s * 0.0003, rot: -0.012 * (1 - s) * face, anim: "idle" };
  }
  function foldtuckPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.foldtuck));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00045, lift: s * 0.0032, rot: s * 0.34 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const tuck = Math.sin((u - 0.16) / 0.62 * Math.PI * 2.8);
      const hush = Math.sin(t * 0.72) + 0.035 * Math.sin(t * 1.44);
      return { x: fromX + face * (0.00045 + tuck * 0.00035 + hush * 0.00006), lift: 0.0028 + Math.abs(tuck) * 0.0016 + Math.abs(hush) * 0.0007, rot: (0.34 + tuck * 0.22 + hush * 0.08) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.00045 * (1 - s), lift: 0.0028 * (1 - s), rot: 0.34 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "furculaflick" && trick.kind !== "antennawalk" && trick.kind !== "moistclingsoil" && trick.kind !== "foldtuck") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "orchesella") {
      if (next.t < ORCHESELLA_HOLD) {
        const pose = orchesellaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ORCHESELLA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ORCHESELLA_HOLD);
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
    if (next.kind === "furculaflick") {
      const pose = furculaflickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennawalk") {
      const pose = antennawalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "moistclingsoil") {
      const pose = moistclingsoilPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = foldtuckPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    ORCHESELLA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    orchesellaPose,
    releasePose,
    furculaflickPose,
    antennawalkPose,
    moistclingsoilPose,
    foldtuckPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denshopPose,
    inkhopPose,
    densfurculaPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSpringtailTricks = api;
})(typeof window !== "undefined" ? window : globalThis);