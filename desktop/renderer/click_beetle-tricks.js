/** Click ground tricks while idle. House neighborly Elateridae / Alaus oculatus eyed click beetle desk life -- clickjack / rightingclick / tickwalk / clickfreeze / elaterhush personality (clickjack prosternal-spine snap jack-jump distinct from Vault hindleap and Haste fleetlegs; rightingclick upside-down righting click distinct from Armor conglobate/volvation and Cling righting; tickwalk antenna-tick desk walk distinct from Forceps nightscuttle, Snout snoutwalk, and Haste fleetlegs; clickfreeze freeze-thanatosis distinct from Snout dropthanatosis and Armor conglobate; long elaterhush Elateridae hush -- never named wait; NOT Snout acorn weevil; NOT Forceps earwig; NOT Lace; NOT Seven ladybird; NOT Spark firefly; NOT Vault grasshopper; guest slug Click / key click_beetle -- accept click_beetle and click; Thank-yous densclick / inkclick / denselater. Sleep, hide, leave, rest, card, ribbon still win. Same map as web click_beetle-tricks.ts. Next: Rob / robber_fly. Catalog 220. */
(function (root) {
  const TRICK_KEY = "click_beetle";
  const TRICKS = ["clickjack", "rightingclick", "tickwalk", "clickfreeze", "elaterhush"];
  const HAPPY = ["densclick", "inkclick", "denselater"];
  const HAPPY_DUR = { densclick: 2.54, inkclick: 2.66, denselater: 2.42 };
  const ELATERHUSH_HOLD = 29.40;
  const RELEASE_S = 2.12;
  const DUR = { elaterhush: ELATERHUSH_HOLD + RELEASE_S, clickjack: 4.18, rightingclick: 4.56, tickwalk: 4.68, clickfreeze: 4.08 };

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
    if (kind === "elaterhush") return 194 + roll * 18;
    if (kind === "clickjack") return 20.8 + roll * 3.2;
    if (kind === "rightingclick") return 24.0 + roll * 3.5;
    if (kind === "tickwalk") return 25.6 + roll * 3.8;
    if (kind === "clickfreeze") return 23.8 + roll * 3.4;
    return justFinished ? 18.2 + roll * 2.8 : 13.6 + roll * 2.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "elaterhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "elaterhush") {
      if (roll < 0.26) return "clickjack";
      if (roll < 0.5) return "rightingclick";
      if (roll < 0.74) return "tickwalk";
      return "clickfreeze";
    }
    if (lastKind === "clickjack") {
      if (roll < 0.26) return "elaterhush";
      if (roll < 0.5) return "rightingclick";
      if (roll < 0.74) return "tickwalk";
      return "clickfreeze";
    }
    if (lastKind === "rightingclick") {
      if (roll < 0.22) return "elaterhush";
      if (roll < 0.44) return "clickjack";
      if (roll < 0.68) return "tickwalk";
      return "clickfreeze";
    }
    if (roll < 0.2) return "elaterhush";
    if (roll < 0.4) return "clickjack";
    if (roll < 0.6) return "rightingclick";
    if (roll < 0.8) return "tickwalk";
    return "clickfreeze";
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
    return key === TRICK_KEY || key === "click";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densclick";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densclick" ? "sit" : name === "inkclick" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densclickPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densclick));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0024, rot: s * 0.11, anim: "sit" };
    }
    if (u < 0.86) {
      const cerci = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.42);
      return { lift: -0.0024 + Math.abs(cerci) * 0.00135, rot: 0.11 + cerci * 0.16, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: -0.0024 * (1 - s), rot: 0.11 * (1 - s), anim: "idle" };
  }
  function inkclickPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkclick));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0038, rot: s * -0.22, anim: "play" };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.18);
      return { lift: 0.0038 + Math.abs(pulse) * 0.00185, rot: -0.22 + pulse * 0.26, anim: "play" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0038 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }
  function denselaterPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denselater));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0016, rot: s * 0.14, anim: "play" };
    }
    if (u < 0.82) {
      const flash = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.28);
      return { lift: 0.0016 + Math.abs(flash) * 0.00112, rot: 0.14 + flash * 0.15, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0016 * (1 - s), rot: 0.14 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densclick") {
      const pose = densclickPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkclick") {
      const pose = inkclickPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denselaterPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "elaterhush";
    const anim =
      k === "elaterhush"
        ? "sit"
        : k === "clickjack"
          ? "play"
          : k === "rightingclick"
            ? "play"
            : k === "clickfreeze"
              ? "sit"
              : k === "tickwalk"
                ? "walk"
                : "sit";
    return {
      kind: k,
      phase: k === "elaterhush" ? "hold" : "go",
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

  function elaterhushPose(t) {
    const breath = Math.sin(t * 0.00088) + 0.0003 * Math.sin(t * 0.0025);
    const hush = Math.abs(Math.sin(t * 0.00034));
    return { lift: -0.0002 + hush * 0.00005, rot: 0.005 + breath * 0.0022 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.006 * (1 - u) };
  }

  function clickjackPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.clickjack));
    const face = facing == null ? 1 : facing;
    // prosternal spine cock → snap jack-jump → soft land
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00002, lift: s * -0.0034, rot: s * 0.22 * face, anim: "play" };
    }
    if (u < 0.32) {
      const s = smoothstep((u - 0.18) / 0.14);
      return { x: fromX + face * (0.00002 + s * 0.0004), lift: -0.0034 + s * 0.028, rot: (0.22 - s * 0.48) * face, anim: "play" };
    }
    if (u < 0.72) {
      const air = (u - 0.32) / 0.4;
      const arc = Math.sin(air * Math.PI);
      const tumble = Math.sin(air * Math.PI * 2.4);
      return {
        x: fromX + face * (0.00042 + air * 0.006 + tumble * 0.0002),
        lift: 0.0246 * arc,
        rot: (-0.26 + tumble * 0.55) * face,
        anim: "play",
      };
    }
    if (u < 0.88) {
      const s = smoothstep((u - 0.72) / 0.16);
      return { x: fromX + face * 0.00642, lift: 0.0042 * (1 - s), rot: (0.12 - s * 0.1) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00642 * (1 - s * 0.02), lift: 0.0008 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" };
  }

  function rightingclickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rightingclick));
    const face = facing == null ? 1 : facing;
    // on back → click snap → roll upright
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00003, lift: s * 0.0012, rot: (s * 2.85) * face, anim: "play" };
    }
    if (u < 0.38) {
      const s = smoothstep((u - 0.16) / 0.22);
      const snap = Math.sin(s * Math.PI);
      return {
        x: fromX + face * (0.00003 + snap * 0.00035),
        lift: 0.0012 + snap * 0.014,
        rot: (2.85 - s * 3.4) * face,
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.38) / 0.4;
      const settle = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + face * (0.0002 + settle * 0.00015),
        lift: 0.008 * (1 - s) + Math.abs(settle) * 0.001,
        rot: (-0.55 + s * 0.48 + settle * 0.12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.0002 * (1 - s), lift: 0.0012 * (1 - s), rot: (-0.07 * (1 - s)) * face, anim: "idle" };
  }

  function tickwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tickwalk));
    const face = facing == null ? 1 : facing;
    // antenna tick + measured elater walk
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00015, lift: s * 0.00055, rot: s * -0.06 * face, anim: "walk" };
    }
    if (u < 0.88) {
      const dash = (u - 0.10) / 0.78;
      const stride = Math.sin(dash * Math.PI * 5.6);
      const tick = Math.sin(dash * Math.PI * 11.2);
      const bob = Math.abs(Math.sin(dash * Math.PI * 4.8));
      return {
        x: fromX + face * (0.00015 + dash * 0.016 + stride * 0.00035),
        lift: 0.00055 + bob * 0.00095,
        rot: (-0.06 + stride * 0.09 + tick * 0.07) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.026 * (1 - s * 0.012), lift: 0.00055 * (1 - s), rot: (-0.015 + 0.01 * s) * face, anim: "idle" };
  }

  function clickfreezePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.clickfreeze));
    const face = facing == null ? 1 : facing;
    // sudden freeze-thanatosis — drop into a locked still, hold, then thaw (distinct from Snout drop-curl)
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00002, lift: s * -0.0036, rot: s * 0.11 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const hold = (u - 0.12) / 0.72;
      const breath = Math.sin(hold * Math.PI * 0.7) * 0.00008;
      return {
        x: fromX + face * (0.00002 + breath),
        lift: -0.0036 + breath,
        rot: (0.11 + breath * 12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00002 * (1 - s), lift: -0.0036 * (1 - s), rot: 0.11 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "clickjack" && trick.kind !== "rightingclick" && trick.kind !== "clickfreeze" && trick.kind !== "tickwalk") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "elaterhush") {
      if (next.t < ELATERHUSH_HOLD) {
        const pose = elaterhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ELATERHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ELATERHUSH_HOLD);
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
    if (next.kind === "clickjack") {
      const pose = clickjackPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rightingclick") {
      const pose = rightingclickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tickwalk") {
      const pose = tickwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = clickfreezePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ELATERHUSH_HOLD,
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
    densclickPose,
    inkclickPose,
    denselaterPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    elaterhushPose,
    releasePose,
    clickjackPose,
    rightingclickPose,
    tickwalkPose,
    clickfreezePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetClickBeetleTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
