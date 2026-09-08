/** Boot ground tricks while idle. House neighborly Slipper Paramecium (paramecium / Boot) desk life -- cilia-beat row / slipper glide / oral-groove feed / contract-vacuole / long boot hush; NOT Gauss gauss_dragon; NOT Ion; NOT Spark; NOT Flux; NOT Trace; NOT Volt; NOT Arc; NOT Stentor; NOT Amoeba; NOT Relay; NOT Fuse; NOT Rui; guest slug Boot / key paramecium -- accept paramecium and boot; Thank-yous densboot / inkboot / densparamecium. Sleep, hide, leave, rest, card, ribbon still win. Same map as web paramecium-tricks.ts. Next: Reach / amoeba. Catalog 215. */
(function (root) {
  const TRICK_KEY = "paramecium";
  const TRICKS = ["ciliabeatrow", "slippergilde", "oralgroovefeed", "contractvacuole", "longboothush"];
  const HAPPY = ["densboot", "inkboot", "densparamecium"];
  const HAPPY_DUR = { densboot: 3.37, inkboot: 3.05, densparamecium: 3.22 };
  const LONGBOOTHUSH_HOLD = 37.94;
  const RELEASE_S = 2.8;
  const DUR = { longboothush: LONGBOOTHUSH_HOLD + RELEASE_S, ciliabeatrow: 6.78, slippergilde: 6.21, oralgroovefeed: 5.96, contractvacuole: 6.09 };

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
    if (kind === "longboothush") return 235 + roll * 41;
    if (kind === "slippergilde") return 30.0 + roll * 3.7;
    if (kind === "contractvacuole") return 27.9 + roll * 3.4;
    if (kind === "ciliabeatrow") return 28.8 + roll * 3.6;
    if (kind === "oralgroovefeed") return 27.1 + roll * 3.5;
    return justFinished ? 21.3 + roll * 3.6 : 16.4 + roll * 3.1;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longboothush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longboothush") {
      if (roll < 0.26) return "slippergilde";
      if (roll < 0.58) return "contractvacuole";
      if (roll < 0.76) return "ciliabeatrow";
      return "oralgroovefeed";
    }
    if (lastKind === "slippergilde") {
      if (roll < 0.26) return "longboothush";
      if (roll < 0.5) return "contractvacuole";
      if (roll < 0.74) return "ciliabeatrow";
      return "oralgroovefeed";
    }
    if (lastKind === "contractvacuole") {
      if (roll < 0.22) return "longboothush";
      if (roll < 0.44) return "slippergilde";
      if (roll < 0.74) return "ciliabeatrow";
      return "oralgroovefeed";
    }
    if (roll < 0.2) return "longboothush";
    if (roll < 0.4) return "slippergilde";
    if (roll < 0.6) return "contractvacuole";
    if (roll < 0.8) return "ciliabeatrow";
    return "oralgroovefeed";
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
    return key === TRICK_KEY || key === "boot";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densboot";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densboot" ? "sit" : name === "inkboot" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }








  function densbootPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densboot));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.005, rot: s * -0.36, anim: "sit" };
    }
    if (u < 0.5) {
      const sway = Math.sin(((u - 0.11) / 0.39) * Math.PI * 3.0);
      const haze = Math.sin(((u - 0.11) / 0.39) * Math.PI * 5.7);
      return { lift: 0.005 + Math.abs(sway) * 0.0016 + Math.abs(haze) * 0.00055, rot: -0.32 + sway * 0.23 + haze * 0.055, anim: "sit" };
    }
    if (u < 0.86) {
      const sway = Math.sin(((u - 0.5) / 0.36) * Math.PI * 2.3);
      return { lift: 0.005 + Math.abs(sway) * 0.0013, rot: -0.27 + sway * 0.17, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.005 * (1 - s), rot: -0.27 * (1 - s), anim: "idle" };
  }
  function inkbootPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkboot));
    if (u < 0.1) {
      const s = u / 0.1;
      return { lift: s * 0.0059, rot: s * 0.44, anim: "play" };
    }
    if (u < 0.49) {
      const bob = Math.sin(((u - 0.1) / 0.39) * Math.PI * 3.2);
      const ion = Math.sin(((u - 0.1) / 0.39) * Math.PI * 6.2);
      return { lift: 0.0059 + Math.abs(bob) * 0.002 + Math.abs(ion) * 0.00065, rot: 0.4 + bob * 0.22 + ion * 0.05, anim: "play" };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.49) / 0.37) * Math.PI * 2.45);
      return { lift: 0.0059 + Math.abs(bob) * 0.0015, rot: 0.35 + bob * 0.16, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0059 * (1 - s), rot: 0.35 * (1 - s), anim: "idle" };
  }
  function densparameciumPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densparamecium));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0043, rot: s * -0.265, anim: "play" };
    }
    if (u < 0.53) {
      const hush = Math.sin(((u - 0.12) / 0.41) * Math.PI * 2.35);
      const haze = Math.sin(((u - 0.12) / 0.41) * Math.PI * 4.8);
      return { lift: 0.0043 + Math.abs(hush) * 0.0014 + Math.abs(haze) * 0.0005, rot: -0.24 + hush * 0.17 + haze * 0.05, anim: "play" };
    }
    if (u < 0.86) {
      const hush = Math.sin(((u - 0.53) / 0.33) * Math.PI * 1.85);
      return { lift: 0.0043 + Math.abs(hush) * 0.0011, rot: -0.2 + hush * 0.13, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0043 * (1 - s), rot: -0.2 * (1 - s), anim: "idle" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densboot") {
      const pose = densbootPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkboot") {
      const pose = inkbootPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densparameciumPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longboothush";
    const anim =
      k === "longboothush"
        ? "sit"
        : k === "slippergilde"
          ? "sit"
          : k === "contractvacuole"
            ? "sit"
            : k === "oralgroovefeed"
              ? "play"
              : k === "ciliabeatrow"
                ? "walk"
                : "sit";
    return {
      kind: k,
      phase: k === "longboothush" ? "hold" : "go",
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








  function longboothushPose(t) {
    const breath = Math.sin(t * 0.00024) + 0.00018 * Math.sin(t * 0.00081) + 0.00009 * Math.sin(t * 0.00148);
    const haze = Math.abs(Math.sin(t * 0.00019)) + 0.42 * Math.abs(Math.sin(t * 0.00041)) + 0.18 * Math.abs(Math.sin(t * 0.00069));
    return { lift: -0.00017 + haze * 0.00018, rot: 0.0014 + breath * 0.0027 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    const ease = Math.sin(u * Math.PI * 0.5);
    return { lift: -0.00016 * (1 - ease), rot: 0.0038 * (1 - u) + 0.00050 * Math.sin(u * Math.PI * 2.1) };
  }

  function slippergildePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.slippergilde));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 0.00016, lift: s * 0.0020, rot: s * 0.06 * face, anim: "sit" };
    }
    if (u < 0.36) {
      const drift = Math.sin(((u - 0.1) / 0.26) * Math.PI * 6.5);
      const outline = Math.sin(((u - 0.1) / 0.26) * Math.PI * 11.0);
      return {
        x: fromX + face * (0.00016 + (u - 0.1) / 0.26 * 0.00062 + outline * 0.00004),
        lift: 0.0017 + Math.abs(drift) * 0.0027 + Math.abs(outline) * 0.001,
        rot: (0.05 + drift * 0.13 + outline * 0.045) * face,
        anim: "sit",
      };
    }
    if (u < 0.78) {
      const haze = Math.sin(((u - 0.36) / 0.42) * Math.PI * 8.1);
      const pale = Math.sin(((u - 0.36) / 0.42) * Math.PI * 3.6);
      const on = haze > -0.15 ? 1 : 0.20;
      return {
        x: fromX + face * (0.00078 + (u - 0.36) / 0.42 * 0.00088 + pale * 0.00007),
        lift: 0.0027 * on + Math.abs(pale) * 0.0016 + Math.abs(haze) * 0.0012,
        rot: (0.07 + haze * 0.11 + pale * 0.06) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * (0.00166 * (1 - s) + 0.00016 * s), lift: 0.0021 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" };
  }
  function contractvacuolePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.contractvacuole));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00005, lift: s * 0.0039, rot: s * -0.11 * face, anim: "sit" };
    }
    if (u < 0.33) {
      const s = smoothstep((u - 0.12) / 0.21);
      return { x: fromX + face * (0.00005 + s * 0.000366), lift: 0.0034 + s * 0.0080, rot: (-0.09 + s * 0.2) * face, anim: "sit" };
    }
    if (u < 0.58) {
      const mist = Math.sin(((u - 0.33) / 0.25) * Math.PI * 4.6);
      const settle = Math.sin(((u - 0.33) / 0.25) * Math.PI * 2.3);
      return {
        x: fromX + face * (0.00041 + mist * 0.00008),
        lift: 0.011 - ((u - 0.33) / 0.25) * 0.0026 + Math.abs(settle) * 0.0013,
        rot: (0.11 + mist * 0.15 + settle * 0.05) * face,
        anim: "sit",
      };
    }
    if (u < 0.83) {
      const soft = Math.sin(((u - 0.58) / 0.25) * Math.PI * 2.9);
      return {
        x: fromX + face * (0.00041 + soft * 0.00004),
        lift: 0.0084 - ((u - 0.58) / 0.25) * 0.0032 + Math.abs(soft) * 0.0008,
        rot: (0.13 + soft * 0.09) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.83) / 0.17);
    return { x: fromX + face * 0.00041 * (1 - s), lift: 0.0052 * (1 - s), rot: 0.13 * (1 - s) * face, anim: "idle" };
  }
  function ciliabeatrowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ciliabeatrow));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0003, lift: s * 0.0025, rot: s * 0.06 * face, anim: "walk" };
    }
    if (u < 0.44) {
      const cling = Math.sin(((u - 0.12) / 0.32) * Math.PI * 5.3);
      const pale = Math.sin(((u - 0.12) / 0.32) * Math.PI * 9.0);
      const path = (u - 0.12) / 0.32;
      return {
        x: fromX + face * (0.0003 + path * 0.00098 + cling * 0.0001),
        lift: 0.0022 + Math.abs(cling) * 0.002 + Math.abs(pale) * 0.0008,
        rot: (0.06 + cling * 0.1 + pale * 0.04) * face,
        anim: "walk",
      };
    }
    if (u < 0.76) {
      const haze = Math.sin(((u - 0.44) / 0.32) * Math.PI * 6.1);
      const ion = Math.sin(((u - 0.44) / 0.32) * Math.PI * 2.6);
      const path = (u - 0.44) / 0.32;
      return {
        x: fromX + face * (0.00128 + path * 0.00112 + haze * 0.00011),
        lift: 0.0027 + Math.abs(haze) * 0.0018 + Math.abs(ion) * 0.0011,
        rot: (0.085 + haze * 0.12 + ion * 0.055) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return { x: fromX + face * (0.0024 * (1 - s) + 0.0003 * s), lift: 0.0025 * (1 - s), rot: 0.085 * (1 - s) * face, anim: "idle" };
  }
  function oralgroovefeedPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.oralgroovefeed));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00004, lift: s * 0.0032, rot: s * 0.16 * face, anim: "play" };
    }
    if (u < 0.37) {
      const s = smoothstep((u - 0.14) / 0.23);
      return { x: fromX + face * (0.00004 + s * 0.00027), lift: 0.0029 + s * 0.0059, rot: (0.13 + s * 0.5) * face, anim: "play" };
    }
    if (u < 0.70) {
      const charge = Math.sin(((u - 0.37) / 0.26) * Math.PI * 4.5);
      const haze = Math.sin(((u - 0.37) / 0.26) * Math.PI * 8.4);
      return {
        x: fromX + face * (0.00031 + charge * 0.00009),
        lift: 0.0090 + Math.abs(charge) * 0.0021 + Math.abs(haze) * 0.001,
        rot: (0.63 + charge * 0.3 + haze * 0.11) * face,
        anim: "play",
      };
    }
    if (u < 0.84) {
      const claim = Math.sin(((u - 0.63) / 0.21) * Math.PI * 3.0);
      return {
        x: fromX + face * (0.00031 + claim * 0.00005),
        lift: 0.0075 - ((u - 0.63) / 0.21) * 0.0027 + Math.abs(claim) * 0.0012,
        rot: (0.68 + claim * 0.17) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00031 * (1 - s), lift: 0.0048 * (1 - s), rot: 0.68 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "slippergilde" && trick.kind !== "contractvacuole" && trick.kind !== "ciliabeatrow" && trick.kind !== "oralgroovefeed") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longboothush") {
      if (next.t < LONGBOOTHUSH_HOLD) {
        const pose = longboothushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGBOOTHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGBOOTHUSH_HOLD);
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
    if (next.kind === "slippergilde") {
      const pose = slippergildePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "contractvacuole") {
      const pose = contractvacuolePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ciliabeatrow") {
      const pose = ciliabeatrowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = oralgroovefeedPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGBOOTHUSH_HOLD,
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
    densbootPose,
    inkbootPose,
    densparameciumPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longboothushPose,
    releasePose,
    slippergildePose,
    contractvacuolePose,
    ciliabeatrowPose,
    oralgroovefeedPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetParameciumTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
