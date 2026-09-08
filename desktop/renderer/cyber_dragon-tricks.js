/** Arc ground tricks while idle. House neighborly Grid Dragon (cyber_dragon / Arc) desk life -- arc-spark coil / circuit-ridge walk / data-breath shimmer / perch-scan blink / long cyber hush; NOT Hide grouper (esp. not arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/longcyberhush); NOT Soar eagle ray; NOT Gate giant clam; NOT Veil lionfish; NOT Vesper dragon (sprawl/guard/smolder/claim/fold); NOT Relay (click/latch/arc/buzz/switch — idle ids stay off bare arc); NOT Fuse; NOT Volt window coil; NOT Rui; guest slug Arc / key cyber_dragon -- accept cyber_dragon and arc; Thank-yous densarc / inkarc / denscyber. Sleep, hide, leave, rest, card, ribbon still win. Same map as web cyber_dragon-tricks.ts. Next: Volt / volt_dragon. Catalog 220. */
(function (root) {
  const TRICK_KEY = "cyber_dragon";
  const TRICKS = ["arcsparkcoil", "circuitridgewalk", "databreathshimmer", "perchscanblink", "longcyberhush"];
  const HAPPY = ["densarc", "inkarc", "denscyber"];
  const HAPPY_DUR = { densarc: 3.04, inkarc: 2.98, denscyber: 2.89 };
  const LONGCYBERHUSH_HOLD = 35.18;
  const RELEASE_S = 2.67;
  const DUR = { longcyberhush: LONGCYBERHUSH_HOLD + RELEASE_S, arcsparkcoil: 6.08, circuitridgewalk: 5.84, databreathshimmer: 5.91, perchscanblink: 5.96 };

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
    if (kind === "longcyberhush") return 217 + roll * 32;
    if (kind === "circuitridgewalk") return 27.0 + roll * 3.6;
    if (kind === "perchscanblink") return 26.2 + roll * 3.4;
    if (kind === "arcsparkcoil") return 25.5 + roll * 3.5;
    if (kind === "databreathshimmer") return 26.5 + roll * 3.2;
    return justFinished ? 19.1 + roll * 3.2 : 14.3 + roll * 2.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longcyberhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longcyberhush") {
      if (roll < 0.26) return "circuitridgewalk";
      if (roll < 0.5) return "perchscanblink";
      if (roll < 0.74) return "arcsparkcoil";
      return "databreathshimmer";
    }
    if (lastKind === "circuitridgewalk") {
      if (roll < 0.26) return "longcyberhush";
      if (roll < 0.5) return "perchscanblink";
      if (roll < 0.74) return "arcsparkcoil";
      return "databreathshimmer";
    }
    if (lastKind === "perchscanblink") {
      if (roll < 0.22) return "longcyberhush";
      if (roll < 0.44) return "circuitridgewalk";
      if (roll < 0.68) return "arcsparkcoil";
      return "databreathshimmer";
    }
    if (roll < 0.2) return "longcyberhush";
    if (roll < 0.4) return "circuitridgewalk";
    if (roll < 0.6) return "perchscanblink";
    if (roll < 0.8) return "arcsparkcoil";
    return "databreathshimmer";
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
    return key === TRICK_KEY || key === "arc";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densarc";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densarc" ? "sit" : name === "inkarc" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }



  function densarcPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densarc));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0049, rot: s * -0.31, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.14) / 0.7) * Math.PI * 2.62);
      return { lift: 0.0049 + Math.abs(sway) * 0.0015, rot: -0.31 + sway * 0.22, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0049 * (1 - s), rot: -0.31 * (1 - s), anim: "idle" };
  }
  function inkarcPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkarc));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.0056, rot: s * 0.38, anim: "play" };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.11) / 0.75) * Math.PI * 2.3);
      return { lift: 0.0056 + Math.abs(bob) * 0.0018, rot: 0.38 + bob * 0.2, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0056 * (1 - s), rot: 0.38 * (1 - s), anim: "idle" };
  }
  function denscyberPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscyber));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0041, rot: s * -0.22, anim: "play" };
    }
    if (u < 0.86) {
      const hush = Math.sin(((u - 0.13) / 0.73) * Math.PI * 1.95);
      return { lift: 0.0041 + Math.abs(hush) * 0.0012, rot: -0.22 + hush * 0.16, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0041 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
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
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longcyberhush";
    const anim =
      k === "longcyberhush"
        ? "sit"
        : k === "circuitridgewalk"
          ? "walk"
          : k === "perchscanblink"
            ? "sit"
            : k === "databreathshimmer"
              ? "sit"
              : k === "arcsparkcoil"
                ? "play"
                : "sit";
    return {
      kind: k,
      phase: k === "longcyberhush" ? "hold" : "go",
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



  function longcyberhushPose(t) {
    const breath = Math.sin(t * 0.00031) + 0.00014 * Math.sin(t * 0.00103);
    const hush = Math.abs(Math.sin(t * 0.00021));
    return { lift: -0.00011 + hush * 0.00013, rot: 0.0009 + breath * 0.0019 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00011 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0027 * (1 - u) };
  }

  function circuitridgewalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.circuitridgewalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00042, lift: s * 0.0031, rot: s * 0.07 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const step = Math.sin(((u - 0.16) / 0.62) * Math.PI * 3.4);
      return {
        x: fromX + face * (0.00042 + (u - 0.16) / 0.62 * 0.0011 + step * 0.00006),
        lift: 0.0031 + Math.abs(step) * 0.0024,
        rot: (0.07 + step * 0.11) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * (0.00152 * (1 - s) + 0.00042 * s), lift: 0.0031 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" };
  }
  function perchscanblinkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.perchscanblink));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00007, lift: s * 0.0054, rot: s * -0.09 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const blink = Math.sin(((u - 0.14) / 0.72) * Math.PI * 4.2);
      const scan = Math.sin(((u - 0.14) / 0.72) * Math.PI * 1.6);
      return {
        x: fromX + face * (0.00007 + scan * 0.00014),
        lift: 0.0054 + Math.abs(blink) * 0.0011,
        rot: (-0.09 + scan * 0.16 + blink * 0.05) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00007 * (1 - s), lift: 0.0054 * (1 - s), rot: -0.09 * (1 - s) * face, anim: "idle" };
  }
  function arcsparkcoilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.arcsparkcoil));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * -0.00006, lift: s * -0.0048, rot: s * 0.28 * face, anim: "play" };
    }
    if (u < 0.8) {
      const spark = Math.sin(((u - 0.18) / 0.62) * Math.PI * 5.1);
      const coil = Math.sin(((u - 0.18) / 0.62) * Math.PI * 2.2);
      return {
        x: fromX + face * (-0.00006 + spark * 0.00005),
        lift: -0.0048 + Math.abs(coil) * 0.0032 + Math.abs(spark) * 0.0014,
        rot: (0.28 + coil * 0.34 + spark * 0.12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return { x: fromX + face * -0.00006 * (1 - s), lift: -0.0048 * (1 - s), rot: 0.28 * (1 - s) * face, anim: "idle" };
  }
  function databreathshimmerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.databreathshimmer));
    const face = facing == null ? 1 : facing;
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX + face * s * 0.00004, lift: s * 0.0042, rot: s * 0.14 * face, anim: "sit" };
    }
    if (u < 0.82) {
      const shimmer = Math.sin(((u - 0.2) / 0.62) * Math.PI * 6.4);
      const breath = Math.sin(((u - 0.2) / 0.62) * Math.PI * 1.7);
      return {
        x: fromX + face * (0.00004 + shimmer * 0.00003),
        lift: 0.0042 + breath * 0.0026 + Math.abs(shimmer) * 0.0009,
        rot: (0.14 + shimmer * 0.18 + breath * 0.06) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.00004 * (1 - s), lift: 0.0042 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "circuitridgewalk" && trick.kind !== "perchscanblink" && trick.kind !== "arcsparkcoil" && trick.kind !== "databreathshimmer") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longcyberhush") {
      if (next.t < LONGCYBERHUSH_HOLD) {
        const pose = longcyberhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGCYBERHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGCYBERHUSH_HOLD);
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
    if (next.kind === "circuitridgewalk") {
      const pose = circuitridgewalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "perchscanblink") {
      const pose = perchscanblinkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "arcsparkcoil") {
      const pose = arcsparkcoilPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = databreathshimmerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGCYBERHUSH_HOLD,
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
    densarcPose,
    inkarcPose,
    denscyberPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longcyberhushPose,
    releasePose,
    circuitridgewalkPose,
    perchscanblinkPose,
    arcsparkcoilPose,
    databreathshimmerPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCyberDragonTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
