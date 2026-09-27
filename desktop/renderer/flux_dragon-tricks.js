/** Flux ground tricks while idle — ultra-polish pass. House neighborly Field Dragon flux_dragon desk life (flux_dragon / Flux) — heatfieldclaimwalk / fieldlineshimmer / hideheatbloom / treatyfieldsettle / fieldripple / boundaryglow / fluxhush personality (heatfieldclaimwalk heat-field claim walk without naming heat or field or claim or walk alone as wait — heat-field claim walk tell; fieldlineshimmer field-line shimmer without naming field or line or shimmer alone as wait — field-line shimmer tell; hideheatbloom hide-heat bloom without naming hide or heat or bloom alone as wait — hide-heat bloom tell; treatyfieldsettle treaty-field settle without naming treaty or field or settle alone as wait — treaty-field settle tell; fieldripple field-ripple without naming field or ripple alone as wait — field ripple tell (distinct from Trace pathglow); boundaryglow boundary-glow without naming boundary or glow alone as wait — boundary glow tell; fluxhush flux hush hold (THE fluxhush sit_hold tell) — never named wait or crouch or sit or still or flux_dragon or flux as bare ethogram-only trick kinds; Trace trace_dragon owns heatfieldclaimwalk? NO — Trace owns outlinetracepathwalk/fieldlineshimmer? NO — Trace owns outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/pathglow/waypointskip/tracehush — do NOT reuse; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT reuse; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse; Hide grouper owns cavernambushsettle/gulargulpinhale/colorpatternflush/slowcaudalhover/jawsnap/stripeband/epinephelushush — do NOT reuse; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Fuse owns fuse life — do NOT reuse; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse; Fuse fuse_dragon next — do NOT start (Relay cooking); guest slug Flux / key flux_dragon only for wantsThankYou matching — accept "flux_dragon" and "flux"; do NOT name a trick "flux_dragon" or "flux" or "trace_dragon" or "trace" or "volt_dragon" or "volt" or "cyber_dragon" or "arc" or "grouper" or "hide" or "relay" or "fuse" or "dragon" or "vesper" or "spark"; not Trace Path Dragon life, not Volt Coil Dragon life, not Arc Grid Dragon life, not Hide Epinephelus life, not Relay click/latch life, not Fuse life, not Vesper dragon life, not Spark life, not Rui. Heatfieldclaimwalk / fieldlineshimmer / hideheatbloom / treatyfieldsettle / fieldripple / boundaryglow / fluxhush; densflux / inkflux / densfluxdragon thank-yous. Same map as web flux_dragon-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names field/still/watch/wait/flux_dragon as bare ethogram-only trick kinds. True Field Dragon flux_dragon desk life only — heat-field claim walk, field-line shimmer, hide-heat bloom, treaty-field settle, field ripple, boundary glow, flux hush. Next house-order ultra: Fuse / fuse_dragon (Relay cooking). No cry inventing — flux_dragon.wav EXISTS so prefersHouseCry adds flux_dragon after trace_dragon. Amplitudes raised toward Rui richness; denser waits/weights; FLUXHUSH_HOLD=11.2 RELEASE_S=1.18 (not 37.42/2.71). Catalog 221. */
(function (root) {

  const TRICK_KEY = "flux_dragon";
  const TRICKS = ["heatfieldclaimwalk", "fieldlineshimmer", "hideheatbloom", "treatyfieldsettle", "fieldripple", "boundaryglow", "fluxhush"];
  const HAPPY = ["densflux", "inkflux", "densfluxdragon"];

  const HAPPY_DUR = { densflux: 1.70, inkflux: 1.84, densfluxdragon: 1.76 };
  const FLUXHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    fluxhush: FLUXHUSH_HOLD + RELEASE_S,
    heatfieldclaimwalk: 2.48,
    fieldlineshimmer: 2.42,
    hideheatbloom: 2.40,
    treatyfieldsettle: 2.44,
    fieldripple: 2.38,
    boundaryglow: 2.56,
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
    if (kind === "fluxhush") return 40 + roll * 26;
    if (kind === "fieldripple" || kind === "heatfieldclaimwalk" || kind === "boundaryglow") return 12.8 + roll * 9.4;
    if (kind === "hideheatbloom" || kind === "fieldlineshimmer" || kind === "treatyfieldsettle") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "fluxhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "fluxhush") {
      if (roll < 0.17) return "heatfieldclaimwalk";
      if (roll < 0.33) return "fieldlineshimmer";
      if (roll < 0.49) return "hideheatbloom";
      if (roll < 0.65) return "treatyfieldsettle";
      if (roll < 0.83) return "fieldripple";
      return "boundaryglow";
    }
    if (lastKind === "heatfieldclaimwalk") {
      if (roll < 0.16) return "fluxhush";
      if (roll < 0.32) return "fieldlineshimmer";
      if (roll < 0.48) return "hideheatbloom";
      if (roll < 0.64) return "treatyfieldsettle";
      if (roll < 0.82) return "fieldripple";
      return "boundaryglow";
    }
    if (lastKind === "fieldlineshimmer") {
      if (roll < 0.14) return "fluxhush";
      if (roll < 0.3) return "heatfieldclaimwalk";
      if (roll < 0.46) return "hideheatbloom";
      if (roll < 0.62) return "treatyfieldsettle";
      if (roll < 0.8) return "fieldripple";
      return "boundaryglow";
    }
    if (lastKind === "hideheatbloom") {
      if (roll < 0.15) return "fluxhush";
      if (roll < 0.31) return "heatfieldclaimwalk";
      if (roll < 0.47) return "fieldlineshimmer";
      if (roll < 0.63) return "treatyfieldsettle";
      if (roll < 0.81) return "fieldripple";
      return "boundaryglow";
    }
    if (lastKind === "treatyfieldsettle") {
      if (roll < 0.16) return "fluxhush";
      if (roll < 0.32) return "heatfieldclaimwalk";
      if (roll < 0.48) return "fieldlineshimmer";
      if (roll < 0.64) return "hideheatbloom";
      if (roll < 0.82) return "fieldripple";
      return "boundaryglow";
    }
    if (lastKind === "fieldripple") {
      if (roll < 0.15) return "fluxhush";
      if (roll < 0.31) return "heatfieldclaimwalk";
      if (roll < 0.47) return "fieldlineshimmer";
      if (roll < 0.63) return "hideheatbloom";
      if (roll < 0.81) return "treatyfieldsettle";
      return "boundaryglow";
    }
    if (lastKind === "boundaryglow") {
      if (roll < 0.16) return "fluxhush";
      if (roll < 0.32) return "heatfieldclaimwalk";
      if (roll < 0.48) return "fieldlineshimmer";
      if (roll < 0.64) return "hideheatbloom";
      if (roll < 0.82) return "treatyfieldsettle";
      return "fieldripple";
    }
    if (roll < 0.14) return "fluxhush";
    if (roll < 0.28) return "heatfieldclaimwalk";
    if (roll < 0.42) return "fieldlineshimmer";
    if (roll < 0.56) return "hideheatbloom";
    if (roll < 0.7) return "treatyfieldsettle";
    if (roll < 0.85) return "fieldripple";
    return "boundaryglow";
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
    return key === TRICK_KEY || key === "flux";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densflux";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densflux" ? "sit" : name === "inkflux" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densfluxPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densflux));
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

  function inkfluxPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkflux));
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

  function densfluxdragonPose(t) {
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
    if (next.kind === "densflux") {
      const pose = densfluxPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkflux") {
      const pose = inkfluxPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densfluxdragonPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "fluxhush";
    const anim =
      k === "fluxhush"
        ? "sit"
        : k === "heatfieldclaimwalk"
          ? "play"
          : k === "boundaryglow"
            ? "talk"
            : k === "fieldlineshimmer"
              ? "walk"
              : k === "hideheatbloom"
                ? "sit"
                : k === "treatyfieldsettle"
                  ? "sit"
                  : k === "fieldripple"
                    ? "walk"
                    : "sit";
    return {
      kind: k,
      phase: k === "fluxhush" ? "hold" : "go",
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

  function fluxhushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function heatfieldclaimwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.heatfieldclaimwalk));
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

  function fieldlineshimmerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fieldlineshimmer));
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

  function boundaryglowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.boundaryglow));
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

  function treatyfieldsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.treatyfieldsettle));
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

  function hideheatbloomPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hideheatbloom));
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

  function fieldripplePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fieldripple));
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
      trick.kind !== "heatfieldclaimwalk" &&
      trick.kind !== "fieldlineshimmer" &&
      trick.kind !== "hideheatbloom" &&
      trick.kind !== "treatyfieldsettle" &&
      trick.kind !== "fieldripple" &&
      trick.kind !== "boundaryglow"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "fluxhush") {
      if (next.t < FLUXHUSH_HOLD) {
        const pose = fluxhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < FLUXHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - FLUXHUSH_HOLD);
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
    if (next.kind === "heatfieldclaimwalk") {
      const pose = heatfieldclaimwalkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fieldlineshimmer") {
      const pose = fieldlineshimmerPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hideheatbloom") {
      const pose = hideheatbloomPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "treatyfieldsettle") {
      const pose = treatyfieldsettlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fieldripple") {
      const pose = fieldripplePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = boundaryglowPose(next.t, fromX, trick.facing);
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
    FLUXHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    fluxhushPose,
    releasePose,
    heatfieldclaimwalkPose,
    fieldlineshimmerPose,
    boundaryglowPose,
    treatyfieldsettlePose,
    hideheatbloomPose,
    fieldripplePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densfluxPose,
    inkfluxPose,
    densfluxdragonPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFluxDragonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);