/** Half ground tricks while idle. House neighborly Platyhelminthes / Turbellaria Tiger Planarian life — ciliaryglide / lightflee / preywrap / regensplit / dugesia personality (ciliaryglide ventral cilia mucus-sheet glide without naming glide or crawl or mucus or cilia or slide or swim or sheet alone as wait, lightflee photonegative turn from light without naming light or flee or photonegative or shade or turn or eye or spot alone as wait, preywrap mucus prey wrap without naming wrap or prey or mucus or trap or feed or sip or suck or pharynx, regensplit regenerate fission cue desk-safe without naming grow or fission or split or bud or regenerate or wait alone as wait, long dugesia Girardia Dugesia tigrina tiger planarian hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or cryptotun or clawamble or mosssip or waterbearroll or eutardigrada or denstun or inktun or densclaw or furculaflick or antennawalk or moistclingsoil or foldtuck or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or tunstate or clawgrip or mossfilm or styletprobe or hypsibius or ciliaryglide or lightflee or preywrap or regensplit or dugesia; window-play and Call Half leave planarian alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun own their tricks; guest slug Half / key planarian — accept "planarian" and "half" (roster slug half; campaign Half); do NOT confuse with Tun the Tardigrade (key tardigrade / slug tun) or denstun thank-you; do NOT confuse with Hop the Springtail (key springtail / slug hop) or denshop thank-you; do NOT confuse with Jet the Velvet Worm (key velvet_worm / slug jet) or densjet thank-you; do NOT confuse with Cast the Earthworm (key earthworm / slug cast) or denscast thank-you; do NOT confuse with Armor the Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT name a trick planarian or half or tardigrade or tun or springtail or hop or velvet_worm or jet or earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste or nematode or thread. Thank-yous denshalf / inkhalf / denscilia. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web planarian-tricks.ts. Window-play unchanged. True Tiger Planarian Dugesia Girardia tigrina desk life — ventral cilia glide, photonegative lightflee, mucus prey wrap, and regenerate fission cue; not Eutardigrada tardigrade/Tardigrada clones (cryptotun/clawamble/mosssip/waterbearroll), not Orchesella springtail/Collembola clones (furculaflick/antennawalk/moistclingsoil/foldtuck), not Peripatus velvet worm/Onychophora clones, not Lumbricus earthworm/Annelida clones (peristalse) — true flatworm ciliary glide distinct from water-bear claw/tun and worm peristalsis. Next house-order guest after Half still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "planarian";
  const TRICKS = ["ciliaryglide", "lightflee", "preywrap", "regensplit", "dugesia"];
  const HAPPY = ["denshalf", "inkhalf", "denscilia"];
  const HAPPY_DUR = { denshalf: 2.56, inkhalf: 2.72, denscilia: 2.46 };
  const DUGESIA_HOLD = 24.30;
  const RELEASE_S = 2.14;
  const DUR = { dugesia: DUGESIA_HOLD + RELEASE_S, ciliaryglide: 4.68, lightflee: 4.44, preywrap: 4.58, regensplit: 4.36 };

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
      if (kind === "dugesia") return 160 + roll * 14;
  if (kind === "ciliaryglide") return 26.4 + roll * 4.3;
  if (kind === "lightflee") return 25.6 + roll * 4.0;
  if (kind === "preywrap") return 26.0 + roll * 4.1;
  if (kind === "regensplit") return 25.0 + roll * 3.8;
  return justFinished ? 18.8 + roll * 2.7 : 14.0 + roll * 2.3;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "dugesia";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "dugesia") {
      if (roll < 0.26) return "ciliaryglide";
      if (roll < 0.5) return "lightflee";
      if (roll < 0.74) return "preywrap";
      return "regensplit";
    }
    if (lastKind === "ciliaryglide") {
      if (roll < 0.26) return "dugesia";
      if (roll < 0.5) return "lightflee";
      if (roll < 0.74) return "preywrap";
      return "regensplit";
    }
    if (lastKind === "lightflee") {
      if (roll < 0.22) return "dugesia";
      if (roll < 0.44) return "ciliaryglide";
      if (roll < 0.68) return "preywrap";
      return "regensplit";
    }
    if (roll < 0.2) return "dugesia";
    if (roll < 0.4) return "ciliaryglide";
    if (roll < 0.6) return "lightflee";
    if (roll < 0.8) return "preywrap";
    return "regensplit";
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
    return key === TRICK_KEY || key === "half";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denshalf";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denshalf" ? "sit" : name === "inkhalf" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denshalfPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshalf));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0034, rot: s * 0.26, anim: "sit" };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 1.9);
      return { lift: 0.0034 + bob * 0.0015, rot: 0.26 + bob * 0.20, anim: "sit" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0034 * (1 - s), rot: 0.26 * (1 - s), anim: "idle" };
  }
  function inkhalfPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhalf));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0040, rot: s * -0.34, anim: "talk" };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.3);
      return { lift: 0.0040 + Math.abs(pulse) * 0.0015, rot: -0.34 + pulse * 0.28, anim: "talk" };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0040 * (1 - s), rot: -0.34 * (1 - s), anim: "idle" };
  }
  function densciliaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscilia));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0030, rot: s * 0.22, anim: "play" };
    }
    if (u < 0.78) {
      const cilia = Math.sin((u - 0.12) / 0.66 * Math.PI * 2.6);
      return { lift: 0.0030 + Math.abs(cilia) * 0.0013, rot: 0.22 + cilia * 0.18, anim: "play" };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0030 * (1 - s), rot: 0.22 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
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
      const pose = densciliaPose(next.t);
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
      kind === "dugesia"
        ? "sit"
        : kind === "ciliaryglide"
          ? "play"
          : kind === "lightflee"
            ? "play"
            : kind === "preywrap"
              ? "sit"
              : kind === "regensplit"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "dugesia" ? "hold" : "go",
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


                      function dugesiaPose(t) {
    const breath = Math.sin(t * 0.0036) + 0.0015 * Math.sin(t * 0.0102);
    const hush = Math.abs(Math.sin(t * 0.0022));
    return { lift: 0.00020 + hush * 0.00038, rot: -0.005 + breath * 0.012 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00020 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.005 * (1 - u) };
  }

  function ciliaryglidePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ciliaryglide));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00034, lift: s * 0.0007, rot: s * 0.05 * face, anim: "play" };
    }
    if (u < 0.88) {
      const glide = Math.sin((u - 0.10) / 0.78 * Math.PI * 4.6);
      const cilia = Math.sin(t * 0.72) + 0.026 * Math.sin(t * 1.44);
      return { x: fromX + face * (0.00034 + (u - 0.10) / 0.78 * 0.0056 + glide * 0.00030 + cilia * 0.00005), lift: 0.0006 + Math.abs(glide) * 0.0008 + Math.abs(cilia) * 0.00035, rot: (0.05 + glide * 0.12 + cilia * 0.04) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0056 * (1 - s), lift: 0.00035 * (1 - s), rot: 0.008 * (1 - s) * face, anim: "idle" };
  }
  function lightfleePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lightflee));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00016, lift: s * 0.0012, rot: s * -0.18 * face, anim: "play" };
    }
    if (u < 0.86) {
      const flee = Math.sin((u - 0.12) / 0.74 * Math.PI * 3.4);
      const shade = Math.sin(t * 0.64) + 0.030 * Math.sin(t * 1.28);
      return { x: fromX + face * (0.00016 - (u - 0.12) / 0.74 * 0.0042 + flee * 0.00034 + shade * 0.00005), lift: 0.0012 + Math.abs(flee) * 0.0011 + Math.abs(shade) * 0.00045, rot: (-0.18 + flee * 0.28 + shade * 0.06) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * (-0.0042) * (1 - s), lift: 0.0012 * (1 - s) + s * 0.00028, rot: -0.010 * (1 - s) * face, anim: "idle" };
  }
  function preywrapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.preywrap));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00042, lift: s * 0.0028, rot: s * 0.20 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const wrap = Math.sin((u - 0.12) / 0.74 * Math.PI * 5.0);
      const mucus = Math.sin(t * 0.84) + 0.038 * Math.sin(t * 1.68);
      return { x: fromX + face * (0.00042 + wrap * 0.00040 + mucus * 0.00006), lift: 0.0028 + Math.abs(wrap) * 0.0013 + Math.abs(mucus) * 0.0005, rot: (0.20 + wrap * 0.18 + mucus * 0.07) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00026 * (1 - s), lift: 0.0010 * (1 - s) + s * 0.00026, rot: 0.012 * (1 - s) * face, anim: "idle" };
  }
  function regensplitPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.regensplit));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00030, lift: s * 0.0026, rot: s * 0.16 * face, anim: "sit" };
    }
    if (u < 0.48) {
      const bud = smoothstep((u - 0.14) / 0.34);
      return { x: fromX + face * (0.00030 + bud * 0.00020), lift: 0.0026 + bud * 0.0020, rot: (0.16 + bud * 0.14) * face, anim: "sit" };
    }
    if (u < 0.84) {
      const pulse = Math.sin((u - 0.48) / 0.36 * Math.PI * 2.2);
      const grow = Math.sin(t * 0.56) + 0.032 * Math.sin(t * 1.12);
      return { x: fromX + face * (0.00050 + pulse * 0.00014 + grow * 0.00004), lift: 0.0046 + Math.abs(pulse) * 0.0009 + Math.abs(grow) * 0.0004, rot: (0.30 + pulse * 0.10 + grow * 0.04) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00050 * (1 - s), lift: 0.0046 * (1 - s) + s * 0.00026, rot: 0.30 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "ciliaryglide" && trick.kind !== "lightflee" && trick.kind !== "preywrap" && trick.kind !== "regensplit") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "dugesia") {
      if (next.t < DUGESIA_HOLD) {
        const pose = dugesiaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DUGESIA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DUGESIA_HOLD);
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
    if (next.kind === "ciliaryglide") {
      const pose = ciliaryglidePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lightflee") {
      const pose = lightfleePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "preywrap") {
      const pose = preywrapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = regensplitPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    DUGESIA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    dugesiaPose,
    releasePose,
    ciliaryglidePose,
    lightfleePose,
    preywrapPose,
    regensplitPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denshalfPose,
    inkhalfPose,
    densciliaPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPlanarianTricks = api;
})(typeof window !== "undefined" ? window : globalThis);