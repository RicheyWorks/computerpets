/** Ion ground tricks while idle — ultra-polish pass. House neighborly Haze Dragon ion_dragon desk life (ion_dragon / Ion) — paleionhazecling / outlinehazedrift / chargehazeclaim / mistperchsettle / hazeveil / ionbloom / ionhush personality (paleionhazecling pale ion-haze cling without naming pale or ion or haze or cling alone as wait — pale ion-haze cling tell; outlinehazedrift outline haze drift without naming outline or haze or drift alone as wait — outline haze drift tell; chargehazeclaim charge-haze claim without naming charge or haze or claim alone as wait — charge-haze claim tell (distinct from Vesper claim); mistperchsettle mist-perch settle without naming mist or perch or settle alone as wait — mist-perch settle tell; hazeveil haze-veil without naming haze or veil alone as wait — haze veil tell (distinct from Lionfish veil alias); ionbloom ion-bloom without naming ion or bloom alone as wait — ion bloom tell; ionhush ion hush hold (THE ionhush sit_hold tell) — never named wait or crouch or sit or still or ion_dragon or ion or haze as bare ethogram-only trick kinds; Spark spark_dragon owns paleionhazecling? NO — Spark owns crackpointskitter/snoutcrackpop/clawtipcrackle/tailpointperch/fissureflash/tipscorch/sparkhush — do NOT reuse; Flux flux_dragon owns heatfieldclaimwalk/fieldlineshimmer/hideheatbloom/treatyfieldsettle/fieldripple/boundaryglow/fluxhush — do NOT reuse; Trace trace_dragon owns outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/pathglow/waypointskip/tracehush — do NOT reuse; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT reuse; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse; Firefly owns spark alias — do NOT reuse bare spark; Hide grouper owns cavernambushsettle/gulargulpinhale/colorpatternflush/slowcaudalhover/jawsnap/stripeband/epinephelushush — do NOT reuse; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Fuse owns fuse life — do NOT reuse; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse claim; Fuse fuse_dragon next — do NOT start (Relay cooking); guest slug Ion / key ion_dragon only for wantsThankYou matching — accept "ion_dragon" and "ion"; do NOT name a trick "ion_dragon" or "ion" or "haze" or "spark_dragon" or "spark" or "crackle" or "flux_dragon" or "flux" or "trace_dragon" or "trace" or "volt_dragon" or "volt" or "cyber_dragon" or "arc" or "grouper" or "hide" or "relay" or "fuse" or "dragon" or "vesper" or "firefly" or "gauss" or "veil"; not Spark Crack Dragon life, not Flux Field Dragon life, not Trace Path Dragon life, not Volt Coil Dragon life, not Arc Grid Dragon life, not Firefly life, not Hide Epinephelus life, not Relay click/latch life, not Fuse life, not Vesper dragon life, not Gauss life, not Rui. Paleionhazecling / outlinehazedrift / chargehazeclaim / mistperchsettle / hazeveil / ionbloom / ionhush; dension / inkion / densiondragon thank-yous. Same map as web ion_dragon-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names haze/still/watch/wait/ion_dragon as bare ethogram-only trick kinds. True Haze Dragon ion_dragon desk life only — pale ion-haze cling, outline haze drift, charge-haze claim, mist-perch settle, haze veil, ion bloom, ion hush. Next house-order ultra: Fuse / fuse_dragon (Relay cooking). No cry inventing — ion_dragon.wav EXISTS so prefersHouseCry adds ion_dragon after spark_dragon. Amplitudes raised toward Rui richness; denser waits/weights; IONHUSH_HOLD=11.2 RELEASE_S=1.18 (not 37.68/2.74). Catalog 221. */
(function (root) {

  const TRICK_KEY = "ion_dragon";
  const TRICKS = ["paleionhazecling", "outlinehazedrift", "chargehazeclaim", "mistperchsettle", "hazeveil", "ionbloom", "ionhush"];
  const HAPPY = ["dension", "inkion", "densiondragon"];

  const HAPPY_DUR = { dension: 1.70, inkion: 1.84, densiondragon: 1.76 };
  const IONHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    ionhush: IONHUSH_HOLD + RELEASE_S,
    paleionhazecling: 2.48,
    outlinehazedrift: 2.42,
    chargehazeclaim: 2.40,
    mistperchsettle: 2.44,
    hazeveil: 2.38,
    ionbloom: 2.56,
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
    if (kind === "ionhush") return 40 + roll * 26;
    if (kind === "hazeveil" || kind === "paleionhazecling" || kind === "ionbloom") return 12.8 + roll * 9.4;
    if (kind === "chargehazeclaim" || kind === "outlinehazedrift" || kind === "mistperchsettle") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "ionhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "ionhush") {
      if (roll < 0.17) return "paleionhazecling";
      if (roll < 0.33) return "outlinehazedrift";
      if (roll < 0.49) return "chargehazeclaim";
      if (roll < 0.65) return "mistperchsettle";
      if (roll < 0.83) return "hazeveil";
      return "ionbloom";
    }
    if (lastKind === "paleionhazecling") {
      if (roll < 0.16) return "ionhush";
      if (roll < 0.32) return "outlinehazedrift";
      if (roll < 0.48) return "chargehazeclaim";
      if (roll < 0.64) return "mistperchsettle";
      if (roll < 0.82) return "hazeveil";
      return "ionbloom";
    }
    if (lastKind === "outlinehazedrift") {
      if (roll < 0.14) return "ionhush";
      if (roll < 0.3) return "paleionhazecling";
      if (roll < 0.46) return "chargehazeclaim";
      if (roll < 0.62) return "mistperchsettle";
      if (roll < 0.8) return "hazeveil";
      return "ionbloom";
    }
    if (lastKind === "chargehazeclaim") {
      if (roll < 0.15) return "ionhush";
      if (roll < 0.31) return "paleionhazecling";
      if (roll < 0.47) return "outlinehazedrift";
      if (roll < 0.63) return "mistperchsettle";
      if (roll < 0.81) return "hazeveil";
      return "ionbloom";
    }
    if (lastKind === "mistperchsettle") {
      if (roll < 0.16) return "ionhush";
      if (roll < 0.32) return "paleionhazecling";
      if (roll < 0.48) return "outlinehazedrift";
      if (roll < 0.64) return "chargehazeclaim";
      if (roll < 0.82) return "hazeveil";
      return "ionbloom";
    }
    if (lastKind === "hazeveil") {
      if (roll < 0.15) return "ionhush";
      if (roll < 0.31) return "paleionhazecling";
      if (roll < 0.47) return "outlinehazedrift";
      if (roll < 0.63) return "chargehazeclaim";
      if (roll < 0.81) return "mistperchsettle";
      return "ionbloom";
    }
    if (lastKind === "ionbloom") {
      if (roll < 0.16) return "ionhush";
      if (roll < 0.32) return "paleionhazecling";
      if (roll < 0.48) return "outlinehazedrift";
      if (roll < 0.64) return "chargehazeclaim";
      if (roll < 0.82) return "mistperchsettle";
      return "hazeveil";
    }
    if (roll < 0.14) return "ionhush";
    if (roll < 0.28) return "paleionhazecling";
    if (roll < 0.42) return "outlinehazedrift";
    if (roll < 0.56) return "chargehazeclaim";
    if (roll < 0.7) return "mistperchsettle";
    if (roll < 0.85) return "hazeveil";
    return "ionbloom";
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
    return key === TRICK_KEY || key === "ion";
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
    const name = (HAPPY).includes(kind) ? (kind) : "dension";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "dension" ? "sit" : name === "inkion" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densionPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dension));
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

  function inkionPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkion));
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

  function densiondragonPose(t) {
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
    if (next.kind === "dension") {
      const pose = densionPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkion") {
      const pose = inkionPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densiondragonPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "ionhush";
    const anim =
      k === "ionhush"
        ? "sit"
        : k === "paleionhazecling"
          ? "play"
          : k === "ionbloom"
            ? "talk"
            : k === "outlinehazedrift"
              ? "walk"
              : k === "chargehazeclaim"
                ? "sit"
                : k === "mistperchsettle"
                  ? "sit"
                  : k === "hazeveil"
                    ? "walk"
                    : "sit";
    return {
      kind: k,
      phase: k === "ionhush" ? "hold" : "go",
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

  function ionhushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function paleionhazeclingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.paleionhazecling));
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

  function outlinehazedriftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.outlinehazedrift));
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

  function ionbloomPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ionbloom));
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

  function mistperchsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mistperchsettle));
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

  function chargehazeclaimPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chargehazeclaim));
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

  function hazeveilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hazeveil));
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
      trick.kind !== "paleionhazecling" &&
      trick.kind !== "outlinehazedrift" &&
      trick.kind !== "chargehazeclaim" &&
      trick.kind !== "mistperchsettle" &&
      trick.kind !== "hazeveil" &&
      trick.kind !== "ionbloom"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "ionhush") {
      if (next.t < IONHUSH_HOLD) {
        const pose = ionhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < IONHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - IONHUSH_HOLD);
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
    if (next.kind === "paleionhazecling") {
      const pose = paleionhazeclingPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "outlinehazedrift") {
      const pose = outlinehazedriftPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "chargehazeclaim") {
      const pose = chargehazeclaimPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mistperchsettle") {
      const pose = mistperchsettlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hazeveil") {
      const pose = hazeveilPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = ionbloomPose(next.t, fromX, trick.facing);
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
    IONHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    ionhushPose,
    releasePose,
    paleionhazeclingPose,
    outlinehazedriftPose,
    ionbloomPose,
    mistperchsettlePose,
    chargehazeclaimPose,
    hazeveilPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densionPose,
    inkionPose,
    densiondragonPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetIonDragonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);