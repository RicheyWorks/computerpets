/** Flux ground tricks while idle. House neighborly Field Dragon (flux_dragon / Flux) desk life -- heat-field claim walk / field-line shimmer / hide-heat bloom / treaty-field settle / long flux hush; NOT Trace trace_dragon (esp. not outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/longtracehush/denstrace/inktrace/denstracedragon); NOT Volt volt_dragon (esp. not coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/longvolthush/densvolt/inkvolt/densvoltdragon); NOT Arc cyber_dragon (esp. not arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/longcyberhush/densarc/inkarc/denscyber); NOT Hide grouper; NOT Soar eagle ray; NOT Vesper dragon (sprawl/guard/smolder/claim/fold); NOT Relay; NOT Fuse; NOT Rui; guest slug Flux / key flux_dragon -- accept flux_dragon and flux; Thank-yous densflux / inkflux / densfluxdragon. Sleep, hide, leave, rest, card, ribbon still win. Same map as web flux_dragon-tricks.ts. Next: Spark / spark_dragon. Catalog 219. */
(function (root) {
  const TRICK_KEY = "flux_dragon";
  const TRICKS = ["heatfieldclaimwalk", "fieldlineshimmer", "hideheatbloom", "treatyfieldsettle", "longfluxhush"];
  const HAPPY = ["densflux", "inkflux", "densfluxdragon"];
  const HAPPY_DUR = { densflux: 3.26, inkflux: 2.94, densfluxdragon: 3.12 };
  const LONGFLUXHUSH_HOLD = 37.42;
  const RELEASE_S = 2.71;
  const DUR = { longfluxhush: LONGFLUXHUSH_HOLD + RELEASE_S, heatfieldclaimwalk: 6.58, fieldlineshimmer: 6.02, hideheatbloom: 5.74, treatyfieldsettle: 5.88 };

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
    if (kind === "longfluxhush") return 227 + roll * 38;
    if (kind === "fieldlineshimmer") return 28.8 + roll * 3.6;
    if (kind === "treatyfieldsettle") return 26.6 + roll * 3.3;
    if (kind === "heatfieldclaimwalk") return 27.4 + roll * 3.5;
    if (kind === "hideheatbloom") return 25.8 + roll * 3.5;
    return justFinished ? 20.1 + roll * 3.5 : 15.2 + roll * 3.0;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longfluxhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longfluxhush") {
      if (roll < 0.26) return "fieldlineshimmer";
      if (roll < 0.5) return "treatyfieldsettle";
      if (roll < 0.74) return "heatfieldclaimwalk";
      return "hideheatbloom";
    }
    if (lastKind === "fieldlineshimmer") {
      if (roll < 0.26) return "longfluxhush";
      if (roll < 0.5) return "treatyfieldsettle";
      if (roll < 0.74) return "heatfieldclaimwalk";
      return "hideheatbloom";
    }
    if (lastKind === "treatyfieldsettle") {
      if (roll < 0.22) return "longfluxhush";
      if (roll < 0.44) return "fieldlineshimmer";
      if (roll < 0.68) return "heatfieldclaimwalk";
      return "hideheatbloom";
    }
    if (roll < 0.2) return "longfluxhush";
    if (roll < 0.4) return "fieldlineshimmer";
    if (roll < 0.6) return "treatyfieldsettle";
    if (roll < 0.8) return "heatfieldclaimwalk";
    return "hideheatbloom";
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
    return key === TRICK_KEY || key === "flux";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densflux";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densflux" ? "sit" : name === "inkflux" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }






  function densfluxPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densflux));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.0051, rot: s * -0.34, anim: "sit" };
    }
    if (u < 0.5) {
      const sway = Math.sin(((u - 0.11) / 0.39) * Math.PI * 2.9);
      const field = Math.sin(((u - 0.11) / 0.39) * Math.PI * 5.2);
      return { lift: 0.0051 + Math.abs(sway) * 0.0017 + Math.abs(field) * 0.0006, rot: -0.34 + sway * 0.24 + field * 0.06, anim: "sit" };
    }
    if (u < 0.86) {
      const sway = Math.sin(((u - 0.5) / 0.36) * Math.PI * 2.4);
      return { lift: 0.0051 + Math.abs(sway) * 0.0014, rot: -0.28 + sway * 0.18, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0051 * (1 - s), rot: -0.28 * (1 - s), anim: "idle" };
  }
  function inkfluxPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkflux));
    if (u < 0.1) {
      const s = u / 0.1;
      return { lift: s * 0.0061, rot: s * 0.41, anim: "play" };
    }
    if (u < 0.48) {
      const bob = Math.sin(((u - 0.1) / 0.38) * Math.PI * 3.1);
      const heat = Math.sin(((u - 0.1) / 0.38) * Math.PI * 6.0);
      return { lift: 0.0061 + Math.abs(bob) * 0.0021 + Math.abs(heat) * 0.0007, rot: 0.41 + bob * 0.23 + heat * 0.05, anim: "play" };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.48) / 0.38) * Math.PI * 2.5);
      return { lift: 0.0061 + Math.abs(bob) * 0.0016, rot: 0.36 + bob * 0.17, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0061 * (1 - s), rot: 0.36 * (1 - s), anim: "idle" };
  }
  function densfluxdragonPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densfluxdragon));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0044, rot: s * -0.26, anim: "play" };
    }
    if (u < 0.52) {
      const hush = Math.sin(((u - 0.12) / 0.4) * Math.PI * 2.25);
      const field = Math.sin(((u - 0.12) / 0.4) * Math.PI * 4.4);
      return { lift: 0.0044 + Math.abs(hush) * 0.0015 + Math.abs(field) * 0.0005, rot: -0.26 + hush * 0.18 + field * 0.05, anim: "play" };
    }
    if (u < 0.86) {
      const hush = Math.sin(((u - 0.52) / 0.34) * Math.PI * 1.9);
      return { lift: 0.0044 + Math.abs(hush) * 0.0011, rot: -0.22 + hush * 0.14, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0044 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
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
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longfluxhush";
    const anim =
      k === "longfluxhush"
        ? "sit"
        : k === "fieldlineshimmer"
          ? "sit"
          : k === "treatyfieldsettle"
            ? "sit"
            : k === "hideheatbloom"
              ? "play"
              : k === "heatfieldclaimwalk"
                ? "walk"
                : "sit";
    return {
      kind: k,
      phase: k === "longfluxhush" ? "hold" : "go",
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






  function longfluxhushPose(t) {
    const breath = Math.sin(t * 0.00027) + 0.00018 * Math.sin(t * 0.00091) + 0.00007 * Math.sin(t * 0.0017);
    const field = Math.abs(Math.sin(t * 0.00021)) + 0.35 * Math.abs(Math.sin(t * 0.00047));
    return { lift: -0.00015 + field * 0.00017, rot: 0.0013 + breath * 0.0024 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    const ease = Math.sin(u * Math.PI * 0.5);
    return { lift: -0.00015 * (1 - ease), rot: 0.0034 * (1 - u) + 0.0004 * Math.sin(u * Math.PI * 2) };
  }

  function fieldlineshimmerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fieldlineshimmer));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 0.00018, lift: s * 0.0019, rot: s * 0.055 * face, anim: "sit" };
    }
    if (u < 0.34) {
      const line = Math.sin(((u - 0.1) / 0.24) * Math.PI * 6.4);
      const fringe = Math.sin(((u - 0.1) / 0.24) * Math.PI * 11.2);
      return {
        x: fromX + face * (0.00018 + (u - 0.1) / 0.24 * 0.00055 + fringe * 0.00004),
        lift: 0.0019 + Math.abs(line) * 0.0024 + Math.abs(fringe) * 0.0009,
        rot: (0.055 + line * 0.14 + fringe * 0.05) * face,
        anim: "sit",
      };
    }
    if (u < 0.78) {
      const shimmer = Math.sin(((u - 0.34) / 0.44) * Math.PI * 8.6);
      const heat = Math.sin(((u - 0.34) / 0.44) * Math.PI * 3.3);
      const on = shimmer > -0.2 ? 1 : 0.22;
      return {
        x: fromX + face * (0.00073 + (u - 0.34) / 0.44 * 0.00095 + heat * 0.00007),
        lift: 0.0028 * on + Math.abs(heat) * 0.0017 + Math.abs(shimmer) * 0.0011,
        rot: (0.08 + shimmer * 0.12 + heat * 0.07) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * (0.00168 * (1 - s) + 0.00018 * s), lift: 0.0022 * (1 - s), rot: 0.08 * (1 - s) * face, anim: "idle" };
  }
  function treatyfieldsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.treatyfieldsettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00006, lift: s * 0.0036, rot: s * -0.1 * face, anim: "sit" };
    }
    if (u < 0.32) {
      const s = smoothstep((u - 0.12) / 0.2);
      return { x: fromX + face * (0.00006 + s * 0.00038), lift: 0.0036 + s * 0.0074, rot: (-0.1 + s * 0.22) * face, anim: "sit" };
    }
    if (u < 0.58) {
      const treaty = Math.sin(((u - 0.32) / 0.26) * Math.PI * 4.1);
      const claim = Math.sin(((u - 0.32) / 0.26) * Math.PI * 2.15);
      return {
        x: fromX + face * (0.00044 + treaty * 0.00008),
        lift: 0.011 - ((u - 0.32) / 0.26) * 0.0028 + Math.abs(claim) * 0.0014,
        rot: (0.12 + treaty * 0.16 + claim * 0.06) * face,
        anim: "sit",
      };
    }
    if (u < 0.82) {
      const settle = Math.sin(((u - 0.58) / 0.24) * Math.PI * 2.8);
      return {
        x: fromX + face * (0.00044 + settle * 0.00005),
        lift: 0.0082 - ((u - 0.58) / 0.24) * 0.0031 + Math.abs(settle) * 0.0009,
        rot: (0.14 + settle * 0.1) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.00044 * (1 - s), lift: 0.0051 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" };
  }
  function heatfieldclaimwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.heatfieldclaimwalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00032, lift: s * 0.0024, rot: s * 0.07 * face, anim: "walk" };
    }
    if (u < 0.42) {
      const field = Math.sin(((u - 0.12) / 0.3) * Math.PI * 4.8);
      const path = (u - 0.12) / 0.3;
      return {
        x: fromX + face * (0.00032 + path * 0.00095 + field * 0.00009),
        lift: 0.0024 + Math.abs(field) * 0.0021,
        rot: (0.07 + field * 0.11) * face,
        anim: "walk",
      };
    }
    if (u < 0.76) {
      const claim = Math.sin(((u - 0.42) / 0.34) * Math.PI * 5.6);
      const heat = Math.sin(((u - 0.42) / 0.34) * Math.PI * 2.4);
      const path = (u - 0.42) / 0.34;
      return {
        x: fromX + face * (0.00127 + path * 0.00115 + claim * 0.00012),
        lift: 0.0028 + Math.abs(claim) * 0.0019 + Math.abs(heat) * 0.0012,
        rot: (0.09 + claim * 0.13 + heat * 0.06) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return { x: fromX + face * (0.00242 * (1 - s) + 0.00032 * s), lift: 0.0026 * (1 - s), rot: 0.09 * (1 - s) * face, anim: "idle" };
  }
  function hideheatbloomPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hideheatbloom));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00004, lift: s * 0.0028, rot: s * 0.14 * face, anim: "play" };
    }
    if (u < 0.36) {
      const s = smoothstep((u - 0.14) / 0.22);
      return { x: fromX + face * (0.00004 + s * 0.00028), lift: 0.0028 + s * 0.0058, rot: (0.14 + s * 0.48) * face, anim: "play" };
    }
    if (u < 0.62) {
      const bloom = Math.sin(((u - 0.36) / 0.26) * Math.PI * 3.6);
      const hide = Math.sin(((u - 0.36) / 0.26) * Math.PI * 7.1);
      return {
        x: fromX + face * (0.00032 + bloom * 0.00009),
        lift: 0.0086 + Math.abs(bloom) * 0.0022 + Math.abs(hide) * 0.001,
        rot: (0.62 + bloom * 0.32 + hide * 0.12) * face,
        anim: "play",
      };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.62) / 0.22) * Math.PI * 2.6);
      return {
        x: fromX + face * (0.00032 + pulse * 0.00006),
        lift: 0.0074 - ((u - 0.62) / 0.22) * 0.0026 + Math.abs(pulse) * 0.0013,
        rot: (0.7 + pulse * 0.18) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00032 * (1 - s), lift: 0.0048 * (1 - s), rot: 0.7 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "fieldlineshimmer" && trick.kind !== "treatyfieldsettle" && trick.kind !== "heatfieldclaimwalk" && trick.kind !== "hideheatbloom") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longfluxhush") {
      if (next.t < LONGFLUXHUSH_HOLD) {
        const pose = longfluxhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGFLUXHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGFLUXHUSH_HOLD);
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
    if (next.kind === "fieldlineshimmer") {
      const pose = fieldlineshimmerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "treatyfieldsettle") {
      const pose = treatyfieldsettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "heatfieldclaimwalk") {
      const pose = heatfieldclaimwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = hideheatbloomPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGFLUXHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densfluxPose,
    inkfluxPose,
    densfluxdragonPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longfluxhushPose,
    releasePose,
    fieldlineshimmerPose,
    treatyfieldsettlePose,
    heatfieldclaimwalkPose,
    hideheatbloomPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFluxDragonTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
