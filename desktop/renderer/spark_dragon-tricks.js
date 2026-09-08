/** Spark ground tricks while idle. House neighborly Crack Dragon (spark_dragon / Spark) desk life -- crack-point skitter / snout-crack pop / claw-tip crackle / tail-point perch / long spark hush; NOT Flux flux_dragon (esp. not heatfieldclaimwalk/fieldlineshimmer/hideheatbloom/treatyfieldsettle/longfluxhush/densflux/inkflux/densfluxdragon); NOT Trace trace_dragon (esp. not outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/longtracehush/denstrace/inktrace/denstracedragon); NOT Volt volt_dragon; NOT Arc cyber_dragon; NOT Firefly (alias spark); NOT Hide grouper; NOT Soar; NOT Vesper; NOT Relay; NOT Fuse; NOT Rui; guest slug Spark / key spark_dragon -- accept spark_dragon and crackle (NOT spark — Firefly owns spark); Thank-yous densspark / inkspark / denssparkdragon. Sleep, hide, leave, rest, card, ribbon still win. Same map as web spark_dragon-tricks.ts. Next: Ion / ion_dragon. Catalog 218. */
(function (root) {
  const TRICK_KEY = "spark_dragon";
  const TRICKS = ["crackpointskitter", "snoutcrackpop", "clawtipcrackle", "tailpointperch", "longsparkhush"];
  const HAPPY = ["densspark", "inkspark", "denssparkdragon"];
  const HAPPY_DUR = { densspark: 3.21, inkspark: 2.88, denssparkdragon: 3.08 };
  const LONGSPARKHUSH_HOLD = 37.55;
  const RELEASE_S = 2.68;
  const DUR = { longsparkhush: LONGSPARKHUSH_HOLD + RELEASE_S, crackpointskitter: 6.49, snoutcrackpop: 5.91, clawtipcrackle: 5.66, tailpointperch: 5.79 };

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
    if (kind === "longsparkhush") return 229 + roll * 37;
    if (kind === "snoutcrackpop") return 29.1 + roll * 3.4;
    if (kind === "tailpointperch") return 27.0 + roll * 3.1;
    if (kind === "crackpointskitter") return 27.9 + roll * 3.3;
    if (kind === "clawtipcrackle") return 26.2 + roll * 3.2;
    return justFinished ? 20.4 + roll * 3.3 : 15.5 + roll * 2.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longsparkhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longsparkhush") {
      if (roll < 0.26) return "snoutcrackpop";
      if (roll < 0.5) return "tailpointperch";
      if (roll < 0.74) return "crackpointskitter";
      return "clawtipcrackle";
    }
    if (lastKind === "snoutcrackpop") {
      if (roll < 0.26) return "longsparkhush";
      if (roll < 0.5) return "tailpointperch";
      if (roll < 0.74) return "crackpointskitter";
      return "clawtipcrackle";
    }
    if (lastKind === "tailpointperch") {
      if (roll < 0.22) return "longsparkhush";
      if (roll < 0.44) return "snoutcrackpop";
      if (roll < 0.68) return "crackpointskitter";
      return "clawtipcrackle";
    }
    if (roll < 0.2) return "longsparkhush";
    if (roll < 0.4) return "snoutcrackpop";
    if (roll < 0.6) return "tailpointperch";
    if (roll < 0.8) return "crackpointskitter";
    return "clawtipcrackle";
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
    return key === TRICK_KEY || key === "crackle";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densspark";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densspark" ? "sit" : name === "inkspark" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }







  function denssparkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densspark));
    if (u < 0.105) {
      const s = u / 0.105;
      return { lift: s * 0.0053, rot: s * -0.33, anim: "sit" };
    }
    if (u < 0.48) {
      const sway = Math.sin(((u - 0.105) / 0.375) * Math.PI * 3.2);
      const crack = Math.sin(((u - 0.105) / 0.375) * Math.PI * 6.1);
      return { lift: 0.0053 + Math.abs(sway) * 0.0018 + Math.abs(crack) * 0.0007, rot: -0.33 + sway * 0.25 + crack * 0.07, anim: "sit" };
    }
    if (u < 0.86) {
      const sway = Math.sin(((u - 0.48) / 0.38) * Math.PI * 2.55);
      return { lift: 0.0053 + Math.abs(sway) * 0.0013, rot: -0.27 + sway * 0.17, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0053 * (1 - s), rot: -0.27 * (1 - s), anim: "idle" };
  }
  function inksparkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspark));
    if (u < 0.095) {
      const s = u / 0.095;
      return { lift: s * 0.0063, rot: s * 0.43, anim: "play" };
    }
    if (u < 0.5) {
      const bob = Math.sin(((u - 0.095) / 0.405) * Math.PI * 3.4);
      const pop = Math.sin(((u - 0.095) / 0.405) * Math.PI * 7.2);
      return { lift: 0.0063 + Math.abs(bob) * 0.0022 + Math.abs(pop) * 0.0008, rot: 0.43 + bob * 0.24 + pop * 0.06, anim: "play" };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.5) / 0.36) * Math.PI * 2.6);
      return { lift: 0.0063 + Math.abs(bob) * 0.0015, rot: 0.37 + bob * 0.16, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0063 * (1 - s), rot: 0.37 * (1 - s), anim: "idle" };
  }
  function denssparkdragonPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssparkdragon));
    if (u < 0.115) {
      const s = u / 0.115;
      return { lift: s * 0.0046, rot: s * -0.25, anim: "play" };
    }
    if (u < 0.54) {
      const hush = Math.sin(((u - 0.115) / 0.425) * Math.PI * 2.4);
      const crack = Math.sin(((u - 0.115) / 0.425) * Math.PI * 5.0);
      return { lift: 0.0046 + Math.abs(hush) * 0.0016 + Math.abs(crack) * 0.0006, rot: -0.25 + hush * 0.19 + crack * 0.055, anim: "play" };
    }
    if (u < 0.86) {
      const hush = Math.sin(((u - 0.54) / 0.32) * Math.PI * 2.0);
      return { lift: 0.0046 + Math.abs(hush) * 0.0012, rot: -0.21 + hush * 0.13, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0046 * (1 - s), rot: -0.21 * (1 - s), anim: "idle" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densspark") {
      const pose = denssparkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkspark") {
      const pose = inksparkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denssparkdragonPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longsparkhush";
    const anim =
      k === "longsparkhush"
        ? "sit"
        : k === "snoutcrackpop"
          ? "sit"
          : k === "tailpointperch"
            ? "sit"
            : k === "clawtipcrackle"
              ? "play"
              : k === "crackpointskitter"
                ? "walk"
                : "sit";
    return {
      kind: k,
      phase: k === "longsparkhush" ? "hold" : "go",
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







  function longsparkhushPose(t) {
    const breath = Math.sin(t * 0.00029) + 0.00016 * Math.sin(t * 0.00099) + 0.00008 * Math.sin(t * 0.00185);
    const crack = Math.abs(Math.sin(t * 0.00023)) + 0.28 * Math.abs(Math.sin(t * 0.00061));
    return { lift: -0.00014 + crack * 0.00016, rot: 0.0012 + breath * 0.0023 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    const ease = Math.sin(u * Math.PI * 0.5);
    return { lift: -0.00014 * (1 - ease), rot: 0.0032 * (1 - u) + 0.0005 * Math.sin(u * Math.PI * 2.4) };
  }

  function snoutcrackpopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snoutcrackpop));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00014, lift: s * 0.0022, rot: s * 0.08 * face, anim: "sit" };
    }
    if (u < 0.38) {
      const pop = Math.sin(((u - 0.11) / 0.27) * Math.PI * 7.8);
      const snout = Math.sin(((u - 0.11) / 0.27) * Math.PI * 3.6);
      return {
        x: fromX + face * (0.00014 + (u - 0.11) / 0.27 * 0.00042 + pop * 0.00005),
        lift: 0.0022 + Math.abs(pop) * 0.0031 + Math.abs(snout) * 0.0011,
        rot: (0.08 + pop * 0.18 + snout * 0.07) * face,
        anim: "sit",
      };
    }
    if (u < 0.76) {
      const crack = Math.sin(((u - 0.38) / 0.38) * Math.PI * 9.4);
      const point = Math.sin(((u - 0.38) / 0.38) * Math.PI * 4.2);
      const on = crack > 0 ? 1 : 0.2;
      return {
        x: fromX + face * (0.00056 + (u - 0.38) / 0.38 * 0.00078 + point * 0.00006),
        lift: 0.0034 * on + Math.abs(point) * 0.0018 + Math.abs(crack) * 0.0012,
        rot: (0.1 + crack * 0.14 + point * 0.08) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return { x: fromX + face * (0.00134 * (1 - s) + 0.00014 * s), lift: 0.0024 * (1 - s), rot: 0.1 * (1 - s) * face, anim: "idle" };
  }
  function tailpointperchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tailpointperch));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.00007, lift: s * 0.0039, rot: s * -0.11 * face, anim: "sit" };
    }
    if (u < 0.34) {
      const s = smoothstep((u - 0.13) / 0.21);
      return { x: fromX + face * (0.00007 + s * 0.00041), lift: 0.0039 + s * 0.0071, rot: (-0.11 + s * 0.24) * face, anim: "sit" };
    }
    if (u < 0.6) {
      const tail = Math.sin(((u - 0.34) / 0.26) * Math.PI * 4.6);
      const point = Math.sin(((u - 0.34) / 0.26) * Math.PI * 2.3);
      return {
        x: fromX + face * (0.00048 + tail * 0.00009),
        lift: 0.011 - ((u - 0.34) / 0.26) * 0.003 + Math.abs(point) * 0.0015,
        rot: (0.13 + tail * 0.17 + point * 0.07) * face,
        anim: "sit",
      };
    }
    if (u < 0.84) {
      const perch = Math.sin(((u - 0.6) / 0.24) * Math.PI * 3.0);
      return {
        x: fromX + face * (0.00048 + perch * 0.00005),
        lift: 0.008 - ((u - 0.6) / 0.24) * 0.0029 + Math.abs(perch) * 0.001,
        rot: (0.15 + perch * 0.11) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00048 * (1 - s), lift: 0.0051 * (1 - s), rot: 0.15 * (1 - s) * face, anim: "idle" };
  }
  function crackpointskitterPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.crackpointskitter));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0026, rot: s * 0.075 * face, anim: "walk" };
    }
    if (u < 0.4) {
      const skitter = Math.sin(((u - 0.11) / 0.29) * Math.PI * 8.2);
      const point = Math.sin(((u - 0.11) / 0.29) * Math.PI * 3.8);
      const path = (u - 0.11) / 0.29;
      return {
        x: fromX + face * (0.00028 + path * 0.00105 + skitter * 0.00011),
        lift: 0.0026 + Math.abs(skitter) * 0.0024 + Math.abs(point) * 0.0009,
        rot: (0.075 + skitter * 0.13 + point * 0.05) * face,
        anim: "walk",
      };
    }
    if (u < 0.74) {
      const crack = Math.sin(((u - 0.4) / 0.34) * Math.PI * 6.4);
      const hop = Math.sin(((u - 0.4) / 0.34) * Math.PI * 2.7);
      const path = (u - 0.4) / 0.34;
      return {
        x: fromX + face * (0.00133 + path * 0.00108 + crack * 0.0001),
        lift: 0.003 + Math.abs(crack) * 0.002 + Math.abs(hop) * 0.0014,
        rot: (0.1 + crack * 0.12 + hop * 0.07) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return { x: fromX + face * (0.00241 * (1 - s) + 0.00028 * s), lift: 0.0028 * (1 - s), rot: 0.1 * (1 - s) * face, anim: "idle" };
  }
  function clawtipcracklePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.clawtipcrackle));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.00005, lift: s * 0.0031, rot: s * 0.16 * face, anim: "play" };
    }
    if (u < 0.35) {
      const s = smoothstep((u - 0.13) / 0.22);
      return { x: fromX + face * (0.00005 + s * 0.00031), lift: 0.0031 + s * 0.0054, rot: (0.16 + s * 0.52) * face, anim: "play" };
    }
    if (u < 0.64) {
      const claw = Math.sin(((u - 0.35) / 0.29) * Math.PI * 10.2);
      const tip = Math.sin(((u - 0.35) / 0.29) * Math.PI * 4.0);
      return {
        x: fromX + face * (0.00036 + claw * 0.00008),
        lift: 0.0085 + Math.abs(claw) * 0.0025 + Math.abs(tip) * 0.0011,
        rot: (0.68 + claw * 0.28 + tip * 0.1) * face,
        anim: "play",
      };
    }
    if (u < 0.84) {
      const crackle = Math.sin(((u - 0.64) / 0.2) * Math.PI * 5.5);
      return {
        x: fromX + face * (0.00036 + crackle * 0.00006),
        lift: 0.0072 - ((u - 0.64) / 0.2) * 0.0024 + Math.abs(crackle) * 0.0014,
        rot: (0.72 + crackle * 0.2) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00036 * (1 - s), lift: 0.0048 * (1 - s), rot: 0.72 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "snoutcrackpop" && trick.kind !== "tailpointperch" && trick.kind !== "crackpointskitter" && trick.kind !== "clawtipcrackle") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longsparkhush") {
      if (next.t < LONGSPARKHUSH_HOLD) {
        const pose = longsparkhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGSPARKHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGSPARKHUSH_HOLD);
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
    if (next.kind === "snoutcrackpop") {
      const pose = snoutcrackpopPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tailpointperch") {
      const pose = tailpointperchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "crackpointskitter") {
      const pose = crackpointskitterPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = clawtipcracklePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGSPARKHUSH_HOLD,
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
    denssparkPose,
    inksparkPose,
    denssparkdragonPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longsparkhushPose,
    releasePose,
    snoutcrackpopPose,
    tailpointperchPose,
    crackpointskitterPose,
    clawtipcracklePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSparkDragonTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
