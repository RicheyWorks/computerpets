/** Relay ground tricks while idle — ultra-polish pass. House neighborly Click Dragon relay_dragon desk life (relay_dragon / Relay) — contactclick / latchseat / arcflick / coilbuzz / poleswitch / armaturetap / relayhush personality (contactclick contact-click without naming click alone as wait — contact click tell; latchseat latch-seat without naming latch or seat alone as wait — latch seat tell; arcflick arc-flick without naming arc or flick alone as wait — arc flick tell (NOT Arc cyber_dragon arcsparkcoil); coilbuzz coil-buzz without naming coil or buzz alone as wait — coil buzz tell (NOT Volt coiledgecharge); poleswitch pole-switch without naming pole or switch alone as wait — pole switch tell; armaturetap armature-tap without naming armature or tap alone as wait — armature tap tell; relayhush relay hush hold (THE relayhush sit_hold tell) — never named wait or crouch or sit or still or relay_dragon or relay or click as bare ethogram-only trick kinds; click_beetle owns clickjack/eyespotflash/clickfreeze/tickwalk/feelertick/rightingclick/elaterhush — do NOT reuse; Gauss gauss_dragon owns filinglinesbandwalk/ironfilingsstand/fieldlinealign/magneticperchsettle/filingsweep/bandclamp/gausshush — do NOT reuse; Ion ion_dragon owns paleionhazecling/outlinehazedrift/chargehazeclaim/mistperchsettle/hazeveil/ionbloom/ionhush — do NOT reuse; Spark spark_dragon owns crackpointskitter/snoutcrackpop/clawtipcrackle/tailpointperch/fissureflash/tipscorch/sparkhush — do NOT reuse HAPPY spark; Flux flux_dragon owns heatfieldclaimwalk/fieldlineshimmer/hideheatbloom/treatyfieldsettle/fieldripple/boundaryglow/fluxhush — do NOT reuse; Trace trace_dragon owns outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/pathglow/waypointskip/tracehush — do NOT reuse; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT reuse; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse bare arc; Fuse owns fuse life — do NOT reuse; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse claim; Ground ground_dragon next — do NOT start (Fuse cooking); guest slug Relay / key relay_dragon only for wantsThankYou matching — accept "relay_dragon" and "relay"; do NOT name a trick "relay_dragon" or "relay" or "click" or "latch" or "arc" or "buzz" or "switch" or "spark" or "gauss_dragon" or "gauss" or "ion_dragon" or "spark_dragon" or "flux_dragon" or "trace_dragon" or "volt_dragon" or "cyber_dragon" or "fuse" or "dragon" or "vesper" or "click_beetle" or "elater"; not click_beetle life, not Gauss Filing Dragon life, not Ion Haze Dragon life, not Spark Crack Dragon life, not Flux Field Dragon life, not Trace Path Dragon life, not Volt Coil Dragon life, not Arc Grid Dragon life, not Fuse life, not Vesper dragon life, not Rui. Contactclick / latchseat / arcflick / coilbuzz / poleswitch / armaturetap / relayhush; densrelay / inkrelay / densrelaydragon thank-yous (never bare HAPPY spark — collides with Spark/spark_dragon). Same map as web relay-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names relay/still/watch/wait/relay_dragon as bare ethogram-only trick kinds. True Click Dragon relay_dragon desk life only — contact click, latch seat, arc flick, coil buzz, pole switch, armature tap, relay hush. Next house-order ultra: Ground / ground_dragon (Fuse cooking). No cry inventing — relay_dragon.wav EXISTS so prefersHouseCry adds relay_dragon after gauss_dragon. Amplitudes raised toward Rui richness; denser waits/weights; RELAYHUSH_HOLD=11.2 RELEASE_S=1.18 (not LATCH_HOLD=10 hop-only). Catalog 221. */
(function (root) {

  const TRICK_KEY = "relay_dragon";
  const TRICKS = ["contactclick", "latchseat", "arcflick", "coilbuzz", "poleswitch", "armaturetap", "relayhush"];
  const HAPPY = ["densrelay", "inkrelay", "densrelaydragon"];

  const HAPPY_DUR = { densrelay: 1.70, inkrelay: 1.84, densrelaydragon: 1.76 };
  const RELAYHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    relayhush: RELAYHUSH_HOLD + RELEASE_S,
    contactclick: 2.48,
    latchseat: 2.42,
    arcflick: 2.40,
    coilbuzz: 2.44,
    poleswitch: 2.38,
    armaturetap: 2.56,
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
    if (kind === "relayhush") return 40 + roll * 26;
    if (kind === "poleswitch" || kind === "contactclick" || kind === "armaturetap") return 12.8 + roll * 9.4;
    if (kind === "arcflick" || kind === "latchseat" || kind === "coilbuzz") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "relayhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "relayhush") {
      if (roll < 0.17) return "contactclick";
      if (roll < 0.33) return "latchseat";
      if (roll < 0.49) return "arcflick";
      if (roll < 0.65) return "coilbuzz";
      if (roll < 0.83) return "poleswitch";
      return "armaturetap";
    }
    if (lastKind === "contactclick") {
      if (roll < 0.16) return "relayhush";
      if (roll < 0.32) return "latchseat";
      if (roll < 0.48) return "arcflick";
      if (roll < 0.64) return "coilbuzz";
      if (roll < 0.82) return "poleswitch";
      return "armaturetap";
    }
    if (lastKind === "latchseat") {
      if (roll < 0.14) return "relayhush";
      if (roll < 0.3) return "contactclick";
      if (roll < 0.46) return "arcflick";
      if (roll < 0.62) return "coilbuzz";
      if (roll < 0.8) return "poleswitch";
      return "armaturetap";
    }
    if (lastKind === "arcflick") {
      if (roll < 0.15) return "relayhush";
      if (roll < 0.31) return "contactclick";
      if (roll < 0.47) return "latchseat";
      if (roll < 0.63) return "coilbuzz";
      if (roll < 0.81) return "poleswitch";
      return "armaturetap";
    }
    if (lastKind === "coilbuzz") {
      if (roll < 0.16) return "relayhush";
      if (roll < 0.32) return "contactclick";
      if (roll < 0.48) return "latchseat";
      if (roll < 0.64) return "arcflick";
      if (roll < 0.82) return "poleswitch";
      return "armaturetap";
    }
    if (lastKind === "poleswitch") {
      if (roll < 0.15) return "relayhush";
      if (roll < 0.31) return "contactclick";
      if (roll < 0.47) return "latchseat";
      if (roll < 0.63) return "arcflick";
      if (roll < 0.81) return "coilbuzz";
      return "armaturetap";
    }
    if (lastKind === "armaturetap") {
      if (roll < 0.16) return "relayhush";
      if (roll < 0.32) return "contactclick";
      if (roll < 0.48) return "latchseat";
      if (roll < 0.64) return "arcflick";
      if (roll < 0.82) return "coilbuzz";
      return "poleswitch";
    }
    if (roll < 0.14) return "relayhush";
    if (roll < 0.28) return "contactclick";
    if (roll < 0.42) return "latchseat";
    if (roll < 0.56) return "arcflick";
    if (roll < 0.7) return "coilbuzz";
    if (roll < 0.85) return "poleswitch";
    return "armaturetap";
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
    return key === TRICK_KEY || key === "relay";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densrelay";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densrelay" ? "sit" : name === "inkrelay" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densrelayPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densrelay));
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

  function inkrelayPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkrelay));
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

  function densrelaydragonPose(t) {
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
    if (next.kind === "densrelay") {
      const pose = densrelayPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkrelay") {
      const pose = inkrelayPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densrelaydragonPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "relayhush";
    const anim =
      k === "relayhush"
        ? "sit"
        : k === "contactclick"
          ? "play"
          : k === "armaturetap"
            ? "talk"
            : k === "latchseat"
              ? "walk"
              : k === "arcflick"
                ? "sit"
                : k === "coilbuzz"
                  ? "sit"
                  : k === "poleswitch"
                    ? "walk"
                    : "sit";
    return {
      kind: k,
      phase: k === "relayhush" ? "hold" : "go",
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

  function relayhushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function contactclickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.contactclick));
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

  function latchseatPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.latchseat));
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

  function armaturetapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.armaturetap));
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

  function coilbuzzPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.coilbuzz));
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

  function arcflickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.arcflick));
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

  function poleswitchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.poleswitch));
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
      trick.kind !== "contactclick" &&
      trick.kind !== "latchseat" &&
      trick.kind !== "arcflick" &&
      trick.kind !== "coilbuzz" &&
      trick.kind !== "poleswitch" &&
      trick.kind !== "armaturetap"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "relayhush") {
      if (next.t < RELAYHUSH_HOLD) {
        const pose = relayhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < RELAYHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - RELAYHUSH_HOLD);
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
    if (next.kind === "contactclick") {
      const pose = contactclickPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "latchseat") {
      const pose = latchseatPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "arcflick") {
      const pose = arcflickPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "coilbuzz") {
      const pose = coilbuzzPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "poleswitch") {
      const pose = poleswitchPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = armaturetapPose(next.t, fromX, trick.facing);
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
    RELAYHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    relayhushPose,
    releasePose,
    contactclickPose,
    latchseatPose,
    armaturetapPose,
    coilbuzzPose,
    arcflickPose,
    poleswitchPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densrelayPose,
    inkrelayPose,
    densrelaydragonPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRelayTricks = api;
})(typeof window !== "undefined" ? window : globalThis);