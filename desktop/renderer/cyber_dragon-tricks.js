/** Arc ground tricks while idle — ultra-polish pass. House neighborly Grid Dragon cyber_dragon desk life (cyber_dragon / Arc) — arcsparkcoil / circuitridgewalk / databreathshimmer / perchscanblink / gridpulse / packetflick / cyberhush personality (arcsparkcoil arc-spark coil without naming arc or spark or coil alone as wait — ridge-spark coil tell (distinct from Relay bare arc and Volt coiledgecharge); circuitridgewalk circuit-ridge walk without naming circuit or ridge or walk alone as wait — desk-ridge circuit pace tell; databreathshimmer data-breath shimmer without naming data or breath or shimmer alone as wait — packet-breath shimmer tell; perchscanblink perch-scan blink without naming perch or scan or blink alone as wait — perch optic scan tell; gridpulse grid-pulse without naming grid or pulse alone as wait — chassis grid pulse tell; packetflick packet-flick without naming packet or flick alone as wait — data-packet flick tell; cyberhush cyber hush hold (THE cyberhush sit_hold tell) — never named wait or crouch or sit or still or cyber_dragon or arc as bare ethogram-only trick kinds; Hide grouper owns cavernambushsettle/gulargulpinhale/colorpatternflush/slowcaudalhover/jawsnap/stripeband/epinephelushush — do NOT reuse; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT start; guest slug Arc / key cyber_dragon only for wantsThankYou matching — accept "cyber_dragon" and "arc"; do NOT name a trick "cyber_dragon" or "arc" or "grouper" or "hide" or "volt_dragon" or "volt" or "relay" or "dragon" or "vesper"; not Hide Epinephelus life, not Relay click/latch life, not Vesper dragon life, not Volt volt_dragon life, not Rui. Arcsparkcoil / circuitridgewalk / databreathshimmer / perchscanblink / gridpulse / packetflick / cyberhush; densarc / inkarc / denscyber thank-yous. Same map as web cyber_dragon-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names arc/still/watch/wait/cyber_dragon as bare ethogram-only trick kinds (Relay owns bare arc). True Grid Dragon cyber_dragon desk life only — arc-spark coil, circuit-ridge walk, data-breath shimmer, perch-scan blink, grid pulse, packet flick, cyber hush. Next house-order ultra: Spark / spark_dragon (Flux landed). No cry inventing — cyber_dragon.wav EXISTS so prefersHouseCry adds cyber_dragon after grouper. Amplitudes raised toward Rui richness; denser waits/weights; CYBERHUSH_HOLD=11.2 RELEASE_S=1.18 (not 35.18/2.67). Catalog 221. */
(function (root) {

  const TRICK_KEY = "cyber_dragon";
  const TRICKS = ["arcsparkcoil", "circuitridgewalk", "databreathshimmer", "perchscanblink", "gridpulse", "packetflick", "cyberhush"];
  const HAPPY = ["densarc", "inkarc", "denscyber"];

  const HAPPY_DUR = { densarc: 1.70, inkarc: 1.84, denscyber: 1.76 };
  const CYBERHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    cyberhush: CYBERHUSH_HOLD + RELEASE_S,
    arcsparkcoil: 2.48,
    circuitridgewalk: 2.42,
    databreathshimmer: 2.40,
    perchscanblink: 2.44,
    gridpulse: 2.38,
    packetflick: 2.56,
  };

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
    if (kind === "cyberhush") return 40 + roll * 26;
    if (kind === "gridpulse" || kind === "arcsparkcoil" || kind === "packetflick") return 12.8 + roll * 9.4;
    if (kind === "databreathshimmer" || kind === "circuitridgewalk" || kind === "perchscanblink") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "cyberhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "cyberhush") {
      if (roll < 0.17) return "arcsparkcoil";
      if (roll < 0.33) return "circuitridgewalk";
      if (roll < 0.49) return "databreathshimmer";
      if (roll < 0.65) return "perchscanblink";
      if (roll < 0.83) return "gridpulse";
      return "packetflick";
    }
    if (lastKind === "arcsparkcoil") {
      if (roll < 0.16) return "cyberhush";
      if (roll < 0.32) return "circuitridgewalk";
      if (roll < 0.48) return "databreathshimmer";
      if (roll < 0.64) return "perchscanblink";
      if (roll < 0.82) return "gridpulse";
      return "packetflick";
    }
    if (lastKind === "circuitridgewalk") {
      if (roll < 0.14) return "cyberhush";
      if (roll < 0.3) return "arcsparkcoil";
      if (roll < 0.46) return "databreathshimmer";
      if (roll < 0.62) return "perchscanblink";
      if (roll < 0.8) return "gridpulse";
      return "packetflick";
    }
    if (lastKind === "databreathshimmer") {
      if (roll < 0.15) return "cyberhush";
      if (roll < 0.31) return "arcsparkcoil";
      if (roll < 0.47) return "circuitridgewalk";
      if (roll < 0.63) return "perchscanblink";
      if (roll < 0.81) return "gridpulse";
      return "packetflick";
    }
    if (lastKind === "perchscanblink") {
      if (roll < 0.16) return "cyberhush";
      if (roll < 0.32) return "arcsparkcoil";
      if (roll < 0.48) return "circuitridgewalk";
      if (roll < 0.64) return "databreathshimmer";
      if (roll < 0.82) return "gridpulse";
      return "packetflick";
    }
    if (lastKind === "gridpulse") {
      if (roll < 0.15) return "cyberhush";
      if (roll < 0.31) return "arcsparkcoil";
      if (roll < 0.47) return "circuitridgewalk";
      if (roll < 0.63) return "databreathshimmer";
      if (roll < 0.81) return "perchscanblink";
      return "packetflick";
    }
    if (lastKind === "packetflick") {
      if (roll < 0.16) return "cyberhush";
      if (roll < 0.32) return "arcsparkcoil";
      if (roll < 0.48) return "circuitridgewalk";
      if (roll < 0.64) return "databreathshimmer";
      if (roll < 0.82) return "perchscanblink";
      return "gridpulse";
    }
    if (roll < 0.14) return "cyberhush";
    if (roll < 0.28) return "arcsparkcoil";
    if (roll < 0.42) return "circuitridgewalk";
    if (roll < 0.56) return "databreathshimmer";
    if (roll < 0.7) return "perchscanblink";
    if (roll < 0.85) return "gridpulse";
    return "packetflick";
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

  function wantsThankYou(key  ) {
    return key === TRICK_KEY || key === "arc";
  }

  function startThankYou(
    key  ,
    lastKind,
    x,
    facing,
    flags
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = (HAPPY).includes(kind) ? (kind) : "densarc";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densarc" ? "sit" : name === "inkarc" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densarcPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densarc));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const flash = Math.sin(t * 2.2);
      return {
        lift: 2.8 + Math.abs(flash) * 1.4,
        rot: 12 + flash * 8,
        dx: flash * 0.08,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function inkarcPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkarc));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" };
    }
    if (u < 0.8) {
      const wriggle = Math.sin(t * 2.6);
      return {
        lift: 3.4 + Math.abs(wriggle) * 1.6,
        rot: -14 + wriggle * 10,
        dx: wriggle * 0.12,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function denscyberPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.58) * 8,
      dx: Math.sin(t * 0.4) * 0.06,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densarc") {
      const pose = densarcPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkarc") {
      const pose = inkarcPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscyberPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "cyberhush";
    const anim =
      k === "cyberhush"
        ? "sit"
        : k === "arcsparkcoil"
          ? "play"
          : k === "packetflick"
            ? "talk"
            : k === "circuitridgewalk"
              ? "walk"
              : k === "databreathshimmer"
                ? "sit"
                : k === "perchscanblink"
                  ? "sit"
                  : k === "gridpulse"
                    ? "walk"
                    : "sit";
    return {
      kind: k,
      phase: k === "cyberhush" ? "hold" : "go",
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

  function cyberhushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function arcsparkcoilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.arcsparkcoil));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.78) {
      const bar = Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.8 + bar * 0.16),
        lift: 2.8 + Math.abs(bar) * 1.5,
        rot: face * (-12 + bar * 10),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (-4 * (1 - s)),
      anim: "idle",
    };
  }

  function circuitridgewalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.circuitridgewalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function packetflickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.packetflick));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" };
    }
    if (u < 0.8) {
      const cloud = Math.sin(t * 3.0);
      return {
        x: fromX + face * (0.6 + cloud * 0.18),
        lift: 3.0 + Math.abs(cloud) * 1.8,
        rot: face * (14 + cloud * 12),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.5 * (1 - s),
      rot: face * (5 * (1 - s)),
      anim: "idle",
    };
  }

  function perchscanblinkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.perchscanblink));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 1.0 * (1 - s),
      lift: 1.6 * (1 - s),
      rot: face * (6 * (1 - s)),
      anim: "idle",
    };
  }

  function databreathshimmerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.databreathshimmer));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const hang = Math.sin(t * 2.0);
      return {
        x: fromX + face * (0.5 + hang * 0.1),
        lift: 2.8 + Math.abs(hang) * 1.2,
        rot: face * (11 + hang * 8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.5 * (1 - s),
      lift: 1.3 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function gridpulsePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gridpulse));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (4 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "arcsparkcoil" &&
      trick.kind !== "circuitridgewalk" &&
      trick.kind !== "databreathshimmer" &&
      trick.kind !== "perchscanblink" &&
      trick.kind !== "gridpulse" &&
      trick.kind !== "packetflick"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "cyberhush") {
      if (next.t < CYBERHUSH_HOLD) {
        const pose = cyberhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CYBERHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CYBERHUSH_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "arcsparkcoil") {
      const pose = arcsparkcoilPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "circuitridgewalk") {
      const pose = circuitridgewalkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "databreathshimmer") {
      const pose = databreathshimmerPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "perchscanblink") {
      const pose = perchscanblinkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gridpulse") {
      const pose = gridpulsePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = packetflickPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }



  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    CYBERHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    cyberhushPose,
    releasePose,
    arcsparkcoilPose,
    circuitridgewalkPose,
    packetflickPose,
    perchscanblinkPose,
    databreathshimmerPose,
    gridpulsePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densarcPose,
    inkarcPose,
    denscyberPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCyberDragonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);