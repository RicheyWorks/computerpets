/** Thread ground tricks while idle. House neighborly Nematoda / Rhabditida Caenorhabditis elegans life — sinusoid / dauerrest / pharynxpump / thrashturn / elegans personality (sinusoid sinusoidal undulation crawl without naming crawl or undulate or wave or swim or glide or sinus or worm alone as wait, dauerrest dauer resting tuck without naming rest or dauer or tuck or sleep or wait or freeze or crouch alone as wait, pharynxpump pharynx pump feed without naming pump or pharynx or feed or sip or suck or gulp or eat alone as wait, thrashturn thrash omega turn without naming thrash or omega or turn or flip or coil or reverse alone as wait, long elegans Caenorhabditis elegans nematode hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or ciliaryglide or lightflee or preywrap or regensplit or dugesia or denshalf or inkhalf or denscilia or cryptotun or clawamble or mosssip or waterbearroll or eutardigrada or denstun or inktun or densclaw or furculaflick or antennawalk or moistclingsoil or foldtuck or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or tunstate or clawgrip or mossfilm or styletprobe or hypsibius or sinusoid or dauerrest or pharynxpump or thrashturn or elegans; window-play and Call Thread leave nematode alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun/Half own their tricks; guest slug Thread / key nematode — accept "nematode" and "thread" (roster slug thread; campaign Thread); do NOT confuse with Half the Planarian (key planarian / slug half) or denshalf thank-you; do NOT confuse with Tun the Tardigrade (key tardigrade / slug tun) or denstun thank-you; do NOT confuse with Hop the Springtail (key springtail / slug hop) or denshop thank-you; do NOT confuse with Jet the Velvet Worm (key velvet_worm / slug jet) or densjet thank-you; do NOT confuse with Cast the Earthworm (key earthworm / slug cast) or denscast thank-you; do NOT confuse with Armor the Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT name a trick nematode or thread or planarian or half or tardigrade or tun or springtail or hop or velvet_worm or jet or earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste or amphipod or scud. Thank-yous densthread / inkthread / densdauer. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web nematode-tricks.ts. Window-play unchanged. True Caenorhabditis elegans nematode desk life — sinusoidal undulation, dauer resting tuck, pharynx pump, and thrash/omega turn; not Dugesia planarian/Platyhelminthes clones (ciliaryglide/lightflee/preywrap/regensplit), not Eutardigrada tardigrade/Tardigrada clones (cryptotun/clawamble/mosssip/waterbearroll), not Orchesella springtail/Collembola clones, not Peripatus velvet worm/Onychophora clones, not Lumbricus earthworm/Annelida clones (peristalse) — true thin nematode undulation distinct from flatworm ciliary glide and worm peristalsis. Next house-order guest after Thread still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "nematode";
  const TRICKS = ["sinusoid", "dauerrest", "pharynxpump", "thrashturn", "elegans"];
  const HAPPY = ["densthread", "inkthread", "densdauer"];
  const HAPPY_DUR = { densthread: 2.58, inkthread: 2.74, densdauer: 2.48 };
  const ELEGANS_HOLD = 24.40;
  const RELEASE_S = 2.16;
  const DUR = { elegans: ELEGANS_HOLD + RELEASE_S, sinusoid: 4.72, dauerrest: 4.50, pharynxpump: 4.60, thrashturn: 4.40 };

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
      if (kind === "elegans") return 162 + roll * 14;
  if (kind === "sinusoid") return 26.6 + roll * 4.4;
  if (kind === "dauerrest") return 25.8 + roll * 4.1;
  if (kind === "pharynxpump") return 26.2 + roll * 4.2;
  if (kind === "thrashturn") return 25.2 + roll * 3.9;
  return justFinished ? 19.0 + roll * 2.8 : 14.2 + roll * 2.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "elegans";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "elegans") {
      if (roll < 0.26) return "sinusoid";
      if (roll < 0.5) return "dauerrest";
      if (roll < 0.74) return "pharynxpump";
      return "thrashturn";
    }
    if (lastKind === "sinusoid") {
      if (roll < 0.26) return "elegans";
      if (roll < 0.5) return "dauerrest";
      if (roll < 0.74) return "pharynxpump";
      return "thrashturn";
    }
    if (lastKind === "dauerrest") {
      if (roll < 0.22) return "elegans";
      if (roll < 0.44) return "sinusoid";
      if (roll < 0.68) return "pharynxpump";
      return "thrashturn";
    }
    if (roll < 0.2) return "elegans";
    if (roll < 0.4) return "sinusoid";
    if (roll < 0.6) return "dauerrest";
    if (roll < 0.8) return "pharynxpump";
    return "thrashturn";
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
    return key === TRICK_KEY || key === "thread";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densthread";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densthread" ? "sit" : name === "inkthread" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function densthreadPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densthread));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0032, rot: s * 0.24, anim: "sit" };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.1);
      return { lift: 0.0032 + bob * 0.0014, rot: 0.24 + bob * 0.18, anim: "sit" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0032 * (1 - s), rot: 0.24 * (1 - s), anim: "idle" };
  }
  function inkthreadPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkthread));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0038, rot: s * -0.32, anim: "talk" };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.4);
      return { lift: 0.0038 + Math.abs(pulse) * 0.0014, rot: -0.32 + pulse * 0.26, anim: "talk" };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0038 * (1 - s), rot: -0.32 * (1 - s), anim: "idle" };
  }
  function densdauerPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densdauer));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0028, rot: s * 0.20, anim: "play" };
    }
    if (u < 0.78) {
      const wave = Math.sin((u - 0.12) / 0.66 * Math.PI * 2.8);
      return { lift: 0.0028 + Math.abs(wave) * 0.0012, rot: 0.20 + wave * 0.16, anim: "play" };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0028 * (1 - s), rot: 0.20 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densthread") {
      const pose = densthreadPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkthread") {
      const pose = inkthreadPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densdauerPose(next.t);
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
      kind === "elegans"
        ? "sit"
        : kind === "sinusoid"
          ? "play"
          : kind === "dauerrest"
            ? "sit"
            : kind === "pharynxpump"
              ? "sit"
              : kind === "thrashturn"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "elegans" ? "hold" : "go",
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


                      function elegansPose(t) {
    const breath = Math.sin(t * 0.0034) + 0.0014 * Math.sin(t * 0.0098);
    const hush = Math.abs(Math.sin(t * 0.0020));
    return { lift: 0.00018 + hush * 0.00034, rot: -0.004 + breath * 0.010 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.004 * (1 - u) };
  }

  function sinusoidPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sinusoid));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00028, lift: s * 0.00055, rot: s * 0.09 * face, anim: "play" };
    }
    if (u < 0.88) {
      const wave = Math.sin((u - 0.10) / 0.78 * Math.PI * 6.2);
      const und = Math.sin(t * 0.88) + 0.030 * Math.sin(t * 1.76);
      return { x: fromX + face * (0.00028 + (u - 0.10) / 0.78 * 0.0062 + wave * 0.00042 + und * 0.00006), lift: 0.0005 + Math.abs(wave) * 0.00055 + Math.abs(und) * 0.00028, rot: (0.09 + wave * 0.22 + und * 0.05) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0062 * (1 - s), lift: 0.00030 * (1 - s), rot: 0.010 * (1 - s) * face, anim: "idle" };
  }
  function dauerrestPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dauerrest));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00022, lift: s * 0.0016, rot: s * 0.14 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const tuck = Math.sin((u - 0.14) / 0.70 * Math.PI * 2.0);
      const hush = Math.sin(t * 0.48) + 0.028 * Math.sin(t * 0.96);
      return { x: fromX + face * (0.00022 + tuck * 0.00028 + hush * 0.00005), lift: 0.0016 + Math.abs(tuck) * 0.0010 + Math.abs(hush) * 0.00035, rot: (0.14 + tuck * 0.18 + hush * 0.05) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00022 * (1 - s), lift: 0.0016 * (1 - s) + s * 0.00020, rot: 0.010 * (1 - s) * face, anim: "idle" };
  }
  function pharynxpumpPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pharynxpump));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00020, lift: s * 0.0018, rot: s * 0.12 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const pump = Math.sin((u - 0.12) / 0.74 * Math.PI * 5.6);
      const gulp = Math.sin(t * 0.96) + 0.034 * Math.sin(t * 1.92);
      return { x: fromX + face * (0.00020 + pump * 0.00018 + gulp * 0.00004), lift: 0.0018 + Math.abs(pump) * 0.0011 + Math.abs(gulp) * 0.0004, rot: (0.12 + pump * 0.10 + gulp * 0.04) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00016 * (1 - s), lift: 0.0008 * (1 - s) + s * 0.00022, rot: 0.010 * (1 - s) * face, anim: "idle" };
  }
  function thrashturnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.thrashturn));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00018, lift: s * 0.0014, rot: s * -0.22 * face, anim: "play" };
    }
    if (u < 0.50) {
      const omega = Math.sin((u - 0.12) / 0.38 * Math.PI * 2.4);
      return { x: fromX + face * (0.00018 + omega * 0.00050), lift: 0.0014 + Math.abs(omega) * 0.0012, rot: (-0.22 + omega * 0.48) * face, anim: "play" };
    }
    if (u < 0.84) {
      const thrash = Math.sin((u - 0.50) / 0.34 * Math.PI * 3.8);
      const flick = Math.sin(t * 1.08) + 0.036 * Math.sin(t * 2.16);
      return { x: fromX + face * (0.00018 - (u - 0.50) / 0.34 * 0.0036 + thrash * 0.00036 + flick * 0.00005), lift: 0.0016 + Math.abs(thrash) * 0.0010 + Math.abs(flick) * 0.0004, rot: (0.26 + thrash * 0.24 + flick * 0.06) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * (-0.0036) * (1 - s), lift: 0.0010 * (1 - s) + s * 0.00022, rot: 0.012 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "sinusoid" && trick.kind !== "dauerrest" && trick.kind !== "pharynxpump" && trick.kind !== "thrashturn") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "elegans") {
      if (next.t < ELEGANS_HOLD) {
        const pose = elegansPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ELEGANS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ELEGANS_HOLD);
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
    if (next.kind === "sinusoid") {
      const pose = sinusoidPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dauerrest") {
      const pose = dauerrestPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pharynxpump") {
      const pose = pharynxpumpPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = thrashturnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ELEGANS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    elegansPose,
    releasePose,
    sinusoidPose,
    dauerrestPose,
    pharynxpumpPose,
    thrashturnPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densthreadPose,
    inkthreadPose,
    densdauerPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetNematodeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);