/** Relay ground tricks while idle. Click Dragon — electrical-mechanical personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `relay-tricks.ts`. Not a Rui move clone. */
(function (root) {
  const TRICK_KEY = "relay_dragon";
  const TRICKS = ["click", "latch", "arc", "buzz", "switch"];
  const HAPPY = ["spark", "toggle", "chatter"];
  const HAPPY_DUR = { spark: 1.18, toggle: 1.48, chatter: 1.42 };
  const LATCH_HOLD = 10;
  const RELEASE_S = 0.48;
  const HOP_S = 0.72;
  const DUR = { click: 0.88, latch: LATCH_HOLD + RELEASE_S + HOP_S, arc: 0.78, buzz: 1.42, switch: 2.55 };

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
    if (kind === "latch") return 44 + roll * 22;
    return justFinished ? 9 + roll * 8 : 4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "switch";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "latch") {
      if (roll < 0.3) return "click";
      if (roll < 0.52) return "buzz";
      if (roll < 0.74) return "arc";
      return "switch";
    }
    if (roll < 0.22) return "click";
    if (roll < 0.3) return "latch";
    if (roll < 0.52) return "arc";
    if (roll < 0.74) return "buzz";
    return "switch";
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
    return key === TRICK_KEY || key === "relay";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY;
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "spark";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "toggle" ? "walk" : name === "chatter" ? "talk" : "play",
      facing: facing || 1,
      fromX: x,
    };
  }

  function sparkPose(t, facing) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.spark));
    return {
      lift: Math.abs(Math.sin(u * Math.PI * 2)) * 22,
      rot: facing * Math.sin(u * Math.PI * 4) * 18,
      dx: Math.sin(u * Math.PI * 4) * 3,
      anim: "play",
    };
  }

  function togglePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.toggle));
    if (u < 0.33) {
      const s = u / 0.33;
      return { x: fromX + facing * 28 * s, lift: 0, rot: 0, anim: "walk" };
    }
    if (u < 0.66) {
      const s = (u - 0.33) / 0.33;
      return { x: fromX + facing * 28 * (1 - s), lift: 0, rot: Math.sin(s * Math.PI) * 10, anim: "walk" };
    }
    return { x: fromX, lift: 1, rot: Math.sin((u - 0.66) / 0.34 * Math.PI * 6) * 12, anim: "sit" };
  }

  function chatterPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chatter));
    if (u < 0.72) {
      return {
        lift: Math.abs(Math.sin(t * 28)) * 4,
        rot: Math.sin(t * 34) * 10,
        dx: Math.sin(t * 34) * 2,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin((u - 0.72) / 0.28 * Math.PI) * 4, dx: 0, anim: "sit" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind] || HAPPY_DUR.spark;
    if (next.kind === "spark") {
      const pose = sparkPose(next.t, next.facing);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "toggle") {
      const pose = togglePose(next.t, next.fromX != null ? next.fromX : next.x, next.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = chatterPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame() {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim = kind === "latch" || kind === "click" ? "sit" : kind === "buzz" ? "talk" : "play";
    return {
      kind,
      phase: kind === "latch" ? "hold" : "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim,
      facing: facing || 1,
      fromX: x,
      hopFrom: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function arcPath(u, fromX, facing) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    return { x: fromX + facing * 64 * ease, lift: Math.sin(t * Math.PI) * 28, rot: facing * 180 * t };
  }

  function clickPose(t) {
    const pulse = Math.abs(Math.sin(t * 26));
    return { lift: pulse * 3, rot: Math.sin(t * 26) * 16, dx: Math.sin(t * 26) * 4 };
  }

  function latchPose() {
    return { lift: 0, rot: 0 };
  }

  function releasePose(t) {
    return { lift: Math.abs(Math.sin(t * 40)) * 5, rot: Math.sin(t * 40) * 14, dx: Math.sin(t * 40) * 3 };
  }

  function buzzPose(t) {
    return { lift: Math.abs(Math.sin(t * 30)) * 5, rot: Math.sin(t * 36) * 11, dx: Math.sin(t * 36) * 2 };
  }

  function switchPose(t, fromX, facing) {
    const beat = Math.sin(t * 7);
    return {
      x: fromX + facing * beat * 14,
      lift: Math.abs(Math.sin(t * 9)) * 8,
      rot: beat * 14,
      anim: Math.abs(beat) > 0.55 ? "walk" : "play",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "arc" && trick.phase !== "hop") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "latch") {
      if (next.t < LATCH_HOLD) {
        const pose = latchPose();
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LATCH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LATCH_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "talk";
        next.hopFrom = next.x;
        return next;
      }
      if (next.t < LATCH_HOLD + RELEASE_S + HOP_S) {
        const u = (next.t - LATCH_HOLD - RELEASE_S) / HOP_S;
        const from = trick.hopFrom != null ? trick.hopFrom : trick.x;
        const pose = arcPath(Math.min(1, u), from, trick.facing);
        next.phase = "hop";
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "play";
        next.hopFrom = from;
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "arc") {
      const pose = arcPath(Math.min(1, u), trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
    } else if (next.kind === "click") {
      const pose = clickPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
    } else if (next.kind === "buzz") {
      const pose = buzzPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "talk";
    } else {
      const pose = switchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    DUR,
    LATCH_HOLD,
    RELEASE_S,
    HOP_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    arcPath,
    clickPose,
    latchPose,
    releasePose,
    buzzPose,
    switchPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    sparkPose,
    togglePose,
    chatterPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRelayTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
