/** Scud ground tricks while idle. House neighborly Amphipoda / Gammaridae Gammarus scud life — sideswim / gnathopod / detritusclutch / pairguard / gammarus personality (sideswim lateral side-swim scud without naming swim or kick or scull or wave or glide or crawl or worm alone as wait, detritusclutch detritus clutch feed without naming fossick or detritus or forage or dig or sift or eat alone as wait, pairguard pair-guard amplexus hold without naming amplexus or pair or guard or mate or clasp or hold alone as wait, gnathopod gnathopod grasp flex without naming startle or flex or flick or thrash or curl or reverse alone as wait, long gammarus Gammarus amphipod hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or sinusoid or dauerrest or pharynxpump or thrashturn or elegans or densthread or inkthread or densdauer or ciliaryglide or lightflee or preywrap or regensplit or dugesia or denshalf or inkhalf or denscilia or cryptotun or clawamble or mosssip or waterbearroll or eutardigrada or denstun or inktun or densclaw or furculaflick or antennawalk or moistclingsoil or foldtuck or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or tunstate or clawgrip or mossfilm or styletprobe or hypsibius or chelate or caridoid or chimney or antennule or astacid or sideswim or detritusclutch or pairguard or gnathopod or gammarus; window-play and Call Scud leave amphipod alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun/Half/Thread own their tricks; guest slug Scud / key amphipod — accept "amphipod" and "scud" (roster slug scud; campaign Scud); do NOT confuse with Thread the Nematode (key nematode / slug thread) or densthread thank-you; do NOT confuse with Half the Planarian (key planarian / slug half) or denshalf thank-you; do NOT confuse with Armor the Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT confuse with Cast the Earthworm (key earthworm / slug cast) or denscast thank-you; do NOT name a trick amphipod or scud or nematode or thread or planarian or half or tardigrade or tun or springtail or hop or velvet_worm or jet or earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste or fiddler_crab or wave or ghost_crab or pale. Thank-yous densscud / inkscud / densgnath. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web amphipod-tricks.ts. Window-play unchanged. True Gammarus amphipod desk life — lateral side-swim scud, detritus fossick, pair-guard amplexus hold, and gnathopod grasp flex; not Caenorhabditis nematode/Nematoda clones (sinusoid/dauerrest/pharynxpump/thrashturn), not Dugesia planarian/Platyhelminthes clones (ciliaryglide/lightflee/preywrap/regensplit), not Armadillidium pillbug/Isopoda clones (conglobate/volvation), not Astacus crayfish clones (chelate/caridoid), not fiddler/ghost crab wave clones — true side-swimmer amphipod life distinct from pillbug roll and crab wave. Next house-order guest after Scud still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "amphipod";
  const TRICKS = ["sideswim", "gnathopod", "detritusclutch", "pairguard", "gammarus"];
  const HAPPY = ["densscud", "inkscud", "densgnath"];
  const HAPPY_DUR = { densscud: 2.60, inkscud: 2.76, densgnath: 2.50 };
  const GAMMARUS_HOLD = 24.50;
  const RELEASE_S = 2.18;
  const DUR = { gammarus: GAMMARUS_HOLD + RELEASE_S, sideswim: 4.78, gnathopod: 4.46, detritusclutch: 4.56, pairguard: 4.66 };

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
      if (kind === "gammarus") return 164 + roll * 14;
  if (kind === "sideswim") return 26.8 + roll * 4.5;
  if (kind === "detritusclutch") return 26.0 + roll * 4.2;
  if (kind === "pairguard") return 26.4 + roll * 4.3;
  if (kind === "gnathopod") return 25.4 + roll * 4.0;
  return justFinished ? 19.2 + roll * 2.9 : 14.4 + roll * 2.5;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "gammarus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "gammarus") {
      if (roll < 0.26) return "sideswim";
      if (roll < 0.5) return "detritusclutch";
      if (roll < 0.74) return "pairguard";
      return "gnathopod";
    }
    if (lastKind === "sideswim") {
      if (roll < 0.26) return "gammarus";
      if (roll < 0.5) return "detritusclutch";
      if (roll < 0.74) return "pairguard";
      return "gnathopod";
    }
    if (lastKind === "detritusclutch") {
      if (roll < 0.22) return "gammarus";
      if (roll < 0.44) return "sideswim";
      if (roll < 0.68) return "pairguard";
      return "gnathopod";
    }
    if (roll < 0.2) return "gammarus";
    if (roll < 0.4) return "sideswim";
    if (roll < 0.6) return "detritusclutch";
    if (roll < 0.8) return "pairguard";
    return "gnathopod";
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
    return key === TRICK_KEY || key === "scud";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densscud";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densscud" ? "sit" : name === "inkscud" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function densscudPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densscud));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0034, rot: s * -0.26, anim: "sit" };
    }
    if (u < 0.72) {
      const bob = Math.sin((u - 0.14) / 0.58 * Math.PI * 2.2);
      return { lift: 0.0034 + bob * 0.0015, rot: -0.26 + bob * 0.16, anim: "sit" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0034 * (1 - s), rot: -0.26 * (1 - s), anim: "idle" };
  }
  function inkscudPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkscud));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0040, rot: s * 0.34, anim: "talk" };
    }
    if (u < 0.70) {
      const pulse = Math.sin((u - 0.16) / 0.54 * Math.PI * 2.6);
      return { lift: 0.0040 + Math.abs(pulse) * 0.0015, rot: 0.34 + pulse * 0.24, anim: "talk" };
    }
    const s = (u - 0.70) / 0.30;
    return { lift: 0.0040 * (1 - s), rot: 0.34 * (1 - s), anim: "idle" };
  }
  function densgnathPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgnath));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0030, rot: s * -0.22, anim: "play" };
    }
    if (u < 0.78) {
      const wave = Math.sin((u - 0.12) / 0.66 * Math.PI * 3.0);
      return { lift: 0.0030 + Math.abs(wave) * 0.0013, rot: -0.22 + wave * 0.18, anim: "play" };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.0030 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
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
      const pose = densgnathPose(next.t);
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
      kind === "gammarus"
        ? "sit"
        : kind === "sideswim"
          ? "play"
          : kind === "gnathopod"
            ? "play"
            : kind === "detritusclutch"
              ? "sit"
              : kind === "pairguard"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "gammarus" ? "hold" : "go",
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


                      function gammarusPose(t) {
    const breath = Math.sin(t * 0.0032) + 0.0015 * Math.sin(t * 0.0094);
    const hush = Math.abs(Math.sin(t * 0.0019));
    return { lift: 0.00020 + hush * 0.00036, rot: -0.018 + breath * 0.012 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00020 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.018 * (1 - u) };
  }

  function sideswimPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sideswim));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00032, lift: s * 0.00070, rot: s * -0.28 * face, anim: "play" };
    }
    if (u < 0.88) {
      const kick = Math.sin((u - 0.10) / 0.78 * Math.PI * 7.4);
      const scull = Math.sin(t * 1.06) + 0.034 * Math.sin(t * 2.12);
      return { x: fromX + face * (0.00032 + (u - 0.10) / 0.78 * 0.0074 + kick * 0.00048 + scull * 0.00007), lift: 0.00070 + Math.abs(kick) * 0.00062 + Math.abs(scull) * 0.00030, rot: (-0.28 + kick * 0.16 + scull * 0.05) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0074 * (1 - s), lift: 0.00034 * (1 - s), rot: -0.014 * (1 - s) * face, anim: "idle" };
  }
  function detritusclutchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.detritusclutch));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00028, lift: s * 0.00090, rot: s * 0.16 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const poke = Math.sin((u - 0.14) / 0.70 * Math.PI * 4.8);
      const sift = Math.sin(t * 0.62) + 0.024 * Math.sin(t * 1.24);
      return { x: fromX + face * (0.00028 + poke * 0.00040 + sift * 0.00008), lift: 0.00090 + Math.abs(poke) * 0.00070 + Math.abs(sift) * 0.00030, rot: (0.16 + poke * 0.14 + sift * 0.05) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00020 * (1 - s), lift: 0.00050 * (1 - s) + s * 0.00020, rot: 0.010 * (1 - s) * face, anim: "idle" };
  }
  function pairguardPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pairguard));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00030, lift: s * 0.0020, rot: s * 0.28 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const hold = Math.sin((u - 0.10) / 0.76 * Math.PI * 2.2);
      const guard = Math.sin(t * 0.48) + 0.022 * Math.sin(t * 0.96);
      return { x: fromX + face * (0.00030 + hold * 0.00018 + guard * 0.00004), lift: 0.0020 + Math.abs(hold) * 0.00070 + Math.abs(guard) * 0.00032, rot: (0.28 + hold * 0.08 + guard * 0.04) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00018 * (1 - s), lift: 0.0008 * (1 - s) + s * 0.00022, rot: 0.014 * (1 - s) * face, anim: "idle" };
  }
  function gnathopodPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gnathopod));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00012, lift: s * 0.00090, rot: s * 0.22 * face, anim: "play" };
    }
    if (u < 0.82) {
      const grasp = Math.sin((u - 0.12) / 0.70 * Math.PI * 3.6);
      const flex = Math.sin(t * 0.92) + 0.028 * Math.sin(t * 1.84);
      return { x: fromX + face * (0.00012 + grasp * 0.00018 + flex * 0.00004), lift: 0.00090 + Math.abs(grasp) * 0.00070 + Math.abs(flex) * 0.00032, rot: (0.22 + grasp * 0.18 + flex * 0.06) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.00010 * (1 - s), lift: 0.00040 * (1 - s) + s * 0.00020, rot: 0.010 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "sideswim" && trick.kind !== "detritusclutch" && trick.kind !== "pairguard" && trick.kind !== "gnathopod") {
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
    if (next.kind === "sideswim") {
      const pose = sideswimPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "detritusclutch") {
      const pose = detritusclutchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pairguard") {
      const pose = pairguardPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gnathopodPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    GAMMARUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    gammarusPose,
    releasePose,
    sideswimPose,
    detritusclutchPose,
    pairguardPose,
    gnathopodPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densscudPose,
    inkscudPose,
    densgnathPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAmphipodTricks = api;
})(typeof window !== "undefined" ? window : globalThis);