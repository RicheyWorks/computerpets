/** Gauss ground tricks while idle — ultra-polish pass. House neighborly Filing Dragon gauss_dragon desk life (gauss_dragon / Gauss) — filinglinesbandwalk / ironfilingsstand / fieldlinealign / magneticperchsettle / filingsweep / bandclamp / gausshush personality (filinglinesbandwalk filing-lines band walk without naming filing or lines or band or walk alone as wait — filing-lines band walk tell; ironfilingsstand iron-filings stand without naming iron or filings or stand alone as wait — iron-filings stand tell; fieldlinealign field-line align without naming field or line or align alone as wait — field-line align tell; magneticperchsettle magnetic-perch settle without naming magnetic or perch or settle alone as wait — magnetic-perch settle tell (distinct from Magneton lodestone/dipole); filingsweep filing-sweep without naming filing or sweep alone as wait — filing sweep tell; bandclamp band-clamp without naming band or clamp alone as wait — band clamp tell; gausshush gauss hush hold (THE gausshush sit_hold tell) — never named wait or crouch or sit or still or gauss_dragon or gauss or filing as bare ethogram-only trick kinds; Ion ion_dragon owns filinglinesbandwalk? NO — Ion owns paleionhazecling/outlinehazedrift/chargehazeclaim/mistperchsettle/hazeveil/ionbloom/ionhush — do NOT reuse; Spark spark_dragon owns crackpointskitter/snoutcrackpop/clawtipcrackle/tailpointperch/fissureflash/tipscorch/sparkhush — do NOT reuse; Flux flux_dragon owns heatfieldclaimwalk/fieldlineshimmer/hideheatbloom/treatyfieldsettle/fieldripple/boundaryglow/fluxhush — do NOT reuse; Trace trace_dragon owns outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/pathglow/waypointskip/tracehush — do NOT reuse; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT reuse; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse; Magneton owns lodestone/flux/azimuth/dipole/remanence/barkhausen/hysteresis — do NOT reuse bare flux or dipole; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Fuse owns fuse life — do NOT reuse; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse claim; Fuse fuse_dragon next — do NOT start (Relay cooking); guest slug Gauss / key gauss_dragon only for wantsThankYou matching — accept "gauss_dragon" and "gauss"; do NOT name a trick "gauss_dragon" or "gauss" or "filing" or "ion_dragon" or "ion" or "haze" or "spark_dragon" or "spark" or "crackle" or "flux_dragon" or "flux" or "trace_dragon" or "trace" or "volt_dragon" or "volt" or "cyber_dragon" or "arc" or "magneton" or "relay" or "fuse" or "dragon" or "vesper" or "firefly" or "veil"; not Ion Haze Dragon life, not Spark Crack Dragon life, not Flux Field Dragon life, not Trace Path Dragon life, not Volt Coil Dragon life, not Arc Grid Dragon life, not Magneton life, not Relay click/latch life, not Fuse life, not Vesper dragon life, not Rui. Filinglinesbandwalk / ironfilingsstand / fieldlinealign / magneticperchsettle / filingsweep / bandclamp / gausshush; densgauss / inkgauss / densgaussdragon thank-yous. Same map as web gauss_dragon-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names filing/still/watch/wait/gauss_dragon as bare ethogram-only trick kinds. True Filing Dragon gauss_dragon desk life only — filing-lines band walk, iron-filings stand, field-line align, magnetic-perch settle, filing sweep, band clamp, gauss hush. Next house-order ultra: Fuse / fuse_dragon (Relay cooking). No cry inventing — gauss_dragon.wav EXISTS so prefersHouseCry adds gauss_dragon after ion_dragon. Amplitudes raised toward Rui richness; denser waits/weights; GAUSSHUSH_HOLD=11.2 RELEASE_S=1.18 (not 37.81/2.77). Catalog 221. */
(function (root) {

  const TRICK_KEY = "gauss_dragon";
  const TRICKS = ["filinglinesbandwalk", "ironfilingsstand", "fieldlinealign", "magneticperchsettle", "filingsweep", "bandclamp", "gausshush"];
  const HAPPY = ["densgauss", "inkgauss", "densgaussdragon"];

  const HAPPY_DUR = { densgauss: 1.70, inkgauss: 1.84, densgaussdragon: 1.76 };
  const GAUSSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    gausshush: GAUSSHUSH_HOLD + RELEASE_S,
    filinglinesbandwalk: 2.48,
    ironfilingsstand: 2.42,
    fieldlinealign: 2.40,
    magneticperchsettle: 2.44,
    filingsweep: 2.38,
    bandclamp: 2.56,
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
    if (kind === "gausshush") return 40 + roll * 26;
    if (kind === "filingsweep" || kind === "filinglinesbandwalk" || kind === "bandclamp") return 12.8 + roll * 9.4;
    if (kind === "fieldlinealign" || kind === "ironfilingsstand" || kind === "magneticperchsettle") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "gausshush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "gausshush") {
      if (roll < 0.17) return "filinglinesbandwalk";
      if (roll < 0.33) return "ironfilingsstand";
      if (roll < 0.49) return "fieldlinealign";
      if (roll < 0.65) return "magneticperchsettle";
      if (roll < 0.83) return "filingsweep";
      return "bandclamp";
    }
    if (lastKind === "filinglinesbandwalk") {
      if (roll < 0.16) return "gausshush";
      if (roll < 0.32) return "ironfilingsstand";
      if (roll < 0.48) return "fieldlinealign";
      if (roll < 0.64) return "magneticperchsettle";
      if (roll < 0.82) return "filingsweep";
      return "bandclamp";
    }
    if (lastKind === "ironfilingsstand") {
      if (roll < 0.14) return "gausshush";
      if (roll < 0.3) return "filinglinesbandwalk";
      if (roll < 0.46) return "fieldlinealign";
      if (roll < 0.62) return "magneticperchsettle";
      if (roll < 0.8) return "filingsweep";
      return "bandclamp";
    }
    if (lastKind === "fieldlinealign") {
      if (roll < 0.15) return "gausshush";
      if (roll < 0.31) return "filinglinesbandwalk";
      if (roll < 0.47) return "ironfilingsstand";
      if (roll < 0.63) return "magneticperchsettle";
      if (roll < 0.81) return "filingsweep";
      return "bandclamp";
    }
    if (lastKind === "magneticperchsettle") {
      if (roll < 0.16) return "gausshush";
      if (roll < 0.32) return "filinglinesbandwalk";
      if (roll < 0.48) return "ironfilingsstand";
      if (roll < 0.64) return "fieldlinealign";
      if (roll < 0.82) return "filingsweep";
      return "bandclamp";
    }
    if (lastKind === "filingsweep") {
      if (roll < 0.15) return "gausshush";
      if (roll < 0.31) return "filinglinesbandwalk";
      if (roll < 0.47) return "ironfilingsstand";
      if (roll < 0.63) return "fieldlinealign";
      if (roll < 0.81) return "magneticperchsettle";
      return "bandclamp";
    }
    if (lastKind === "bandclamp") {
      if (roll < 0.16) return "gausshush";
      if (roll < 0.32) return "filinglinesbandwalk";
      if (roll < 0.48) return "ironfilingsstand";
      if (roll < 0.64) return "fieldlinealign";
      if (roll < 0.82) return "magneticperchsettle";
      return "filingsweep";
    }
    if (roll < 0.14) return "gausshush";
    if (roll < 0.28) return "filinglinesbandwalk";
    if (roll < 0.42) return "ironfilingsstand";
    if (roll < 0.56) return "fieldlinealign";
    if (roll < 0.7) return "magneticperchsettle";
    if (roll < 0.85) return "filingsweep";
    return "bandclamp";
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
    return key === TRICK_KEY || key === "gauss";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densgauss";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densgauss" ? "sit" : name === "inkgauss" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densgaussPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgauss));
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

  function inkgaussPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgauss));
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

  function densgaussdragonPose(t) {
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
    if (next.kind === "densgauss") {
      const pose = densgaussPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkgauss") {
      const pose = inkgaussPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densgaussdragonPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "gausshush";
    const anim =
      k === "gausshush"
        ? "sit"
        : k === "filinglinesbandwalk"
          ? "play"
          : k === "bandclamp"
            ? "talk"
            : k === "ironfilingsstand"
              ? "walk"
              : k === "fieldlinealign"
                ? "sit"
                : k === "magneticperchsettle"
                  ? "sit"
                  : k === "filingsweep"
                    ? "walk"
                    : "sit";
    return {
      kind: k,
      phase: k === "gausshush" ? "hold" : "go",
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

  function gausshushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function filinglinesbandwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.filinglinesbandwalk));
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

  function ironfilingsstandPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ironfilingsstand));
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

  function bandclampPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bandclamp));
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

  function magneticperchsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.magneticperchsettle));
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

  function fieldlinealignPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fieldlinealign));
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

  function filingsweepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.filingsweep));
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
      trick.kind !== "filinglinesbandwalk" &&
      trick.kind !== "ironfilingsstand" &&
      trick.kind !== "fieldlinealign" &&
      trick.kind !== "magneticperchsettle" &&
      trick.kind !== "filingsweep" &&
      trick.kind !== "bandclamp"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "gausshush") {
      if (next.t < GAUSSHUSH_HOLD) {
        const pose = gausshushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < GAUSSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - GAUSSHUSH_HOLD);
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
    if (next.kind === "filinglinesbandwalk") {
      const pose = filinglinesbandwalkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ironfilingsstand") {
      const pose = ironfilingsstandPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fieldlinealign") {
      const pose = fieldlinealignPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "magneticperchsettle") {
      const pose = magneticperchsettlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "filingsweep") {
      const pose = filingsweepPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bandclampPose(next.t, fromX, trick.facing);
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
    GAUSSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    gausshushPose,
    releasePose,
    filinglinesbandwalkPose,
    ironfilingsstandPose,
    bandclampPose,
    magneticperchsettlePose,
    fieldlinealignPose,
    filingsweepPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densgaussPose,
    inkgaussPose,
    densgaussdragonPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGaussDragonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);