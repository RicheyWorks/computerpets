/** Ember ground tricks while idle — ultra-polish pass. House phoenix — cinder / blaze / shed / lift / return / reignite / hearth personality (ash-and-return firebird desk life). Window-play KINDLE unchanged — never names `kindle`. Floss owns ash; Vesper owns sprawl/smolder/glow; Sol owns sun; Axolotl owns plume. Amplitudes raised toward Rui richness; denser timing; house cry preferred. Thank-yous shine / dip / settle. Same map as web `phoenix-tricks.ts`. Bird ultra-polish line complete after this pass (Soot→Ember). No cry inventing — thank-yous are silent desk motion only. */

(function (root) {
  const TRICK_KEY = "phoenix";
  const TRICKS = ["cinder", "blaze", "shed", "lift", "return", "reignite", "hearth"];
  const HAPPY = ["shine", "dip", "settle"];
  const HAPPY_DUR = { shine: 1.58, dip: 1.66, settle: 1.72 };
  const CINDER_HOLD = 14.4;
  const RELEASE_S = 1.02;
  const DUR = {
    cinder: CINDER_HOLD + RELEASE_S,
    blaze: 2.36,
    shed: 2.28,
    lift: 2.44,
    return: 2.32,
    reignite: 2.4,
    hearth: 2.34,
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
    if (kind === "cinder") return 42 + roll * 28;
    if (kind === "blaze" || kind === "reignite") return 12 + roll * 9;
    if (kind === "shed" || kind === "hearth") return 11 + roll * 8;
    if (kind === "lift" || kind === "return") return 10 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "cinder";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "cinder" ? 0.55 : k === "blaze" || k === "shed" || k === "reignite" ? 1.15 : 1
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "blaze";
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
    return key === TRICK_KEY || key === "ember";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "shine";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "shine" ? "sit" : name === "dip" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function shinePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shine));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 5, rot: s * 14, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const snap = Math.sin(t * 14) + 0.24 * Math.sin(t * 26);
      return {
        lift: 5 + Math.abs(snap) * 3.5,
        rot: 14 + snap * 12,
        dx: snap * 1.4,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 3.5 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "idle" };
  }

  function dipPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dip));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 6, rot: -s * 14, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const cry = Math.sin(t * 9) + 0.26 * Math.sin(t * 16);
      return {
        lift: 6 + Math.abs(cry) * 4,
        rot: -14 + cry * 9,
        dx: cry * 1.8,
        anim: "sit",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 4 * (1 - s), rot: -8 * (1 - s), dx: 0, anim: "sit" };
  }

  function settlePose(t) {
    return {
      lift: 4 + Math.abs(Math.sin(t * 7)) * 5,
      rot: -6 + Math.sin(t * 10) * 14,
      dx: Math.sin(t * 6) * 2.2,
      anim: "talk",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    const pose =
      next.kind === "shine" ? shinePose(next.t) : next.kind === "dip" ? dipPose(next.t) : settlePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.dx = pose.dx;
    next.anim = pose.anim;
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "cinder"
        ? "sit"
        : kind === "blaze" || kind === "hearth"
          ? "sit"
          : kind === "shed" || kind === "lift" || kind === "reignite"
            ? "play"
            : kind === "return"
              ? "sit"
              : "sit";
    return {
      kind: kind,
      phase: kind === "cinder" ? "hold" : "go",
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

  function cinderPose(t) {
    const soft = Math.sin(t * 1.6);
    const breath = Math.sin(t * 2.6);
    return { lift: 4.5 + soft * 3.2 + Math.abs(breath) * 1.6, rot: 26 + breath * 5 + Math.sin(t * 4.8) * 5 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 4.5 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 26 * (1 - u) };
  }

  function blazePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.blaze));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 5.5, rot: s * 18 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.12) / 0.74;
      const flare = Math.abs(Math.sin(s * Math.PI * 2.8));
      return {
        x: fromX + face * Math.sin(s * Math.PI) * 2.2,
        lift: 5.5 + flare * 5.5,
        rot: face * (18 + flare * 14),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 4 * (1 - s) * 0.25,
      rot: face * 8 * (1 - s),
      anim: "sit",
    };
  }

  function shedPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.shed));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 4.5, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const shake = Math.sin(s * Math.PI * 5.5);
      return {
        x: fromX + face * shake * 2.4,
        lift: 4.5 + Math.abs(shake) * 6.5,
        rot: face * (-12 + shake * 22),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 3.5 * (1 - s),
      rot: face * -4 * (1 - s),
      anim: "sit",
    };
  }

  function liftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lift));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 6.5, rot: -s * 18 * face, anim: "play" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const wing = Math.abs(Math.sin(s * Math.PI * 2.4));
      return {
        x: fromX + face * Math.sin(s * Math.PI) * 2.6,
        lift: 6.5 + wing * 5.5,
        rot: face * (-18 + wing * 16),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.8,
      lift: 5 * (1 - s) * 0.3,
      rot: face * -6 * (1 - s),
      anim: "sit",
    };
  }

  function returnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.return));
    const face = facing == null ? 1 : facing;
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX + face * s * 8, lift: s * 5, rot: s * 14 * face, anim: "play" };
    }
    if (u < 0.7) {
      const s = (u - 0.2) / 0.5;
      const home = smoothstep(s);
      return {
        x: fromX + face * (8 * (1 - home)),
        lift: 5 * (1 - home * 0.35) + Math.sin(s * Math.PI) * 2.4,
        rot: face * (14 - home * 20),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 5 * 0.55 * (1 - s),
      rot: face * -6 * (1 - s),
      anim: "sit",
    };
  }

  function reignitePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.reignite));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 2.2, rot: s * -8 * face, anim: "sit" };
    }
    if (u < 0.42) {
      const s = (u - 0.18) / 0.24;
      return {
        x: fromX + face * Math.sin(s * Math.PI) * 0.8,
        lift: 2.2 * (1 - s * 0.7),
        rot: face * (-8 + s * 6),
        anim: "sit",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.42) / 0.46;
      const burst = Math.abs(Math.sin(s * Math.PI * 3.2));
      return {
        x: fromX + face * Math.sin(s * Math.PI * 2) * 2.4,
        lift: 3.5 + burst * 7,
        rot: face * (10 + burst * 18),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 4 * (1 - s),
      rot: face * 6 * (1 - s),
      anim: "sit",
    };
  }

  function hearthPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hearth));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4, rot: s * 22 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      const warm = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + face * Math.sin(s * Math.PI) * 1.6,
        lift: 4 + Math.abs(warm) * 3.5 + Math.sin(t * 3.4) * 1.2,
        rot: face * (22 + warm * 10 + Math.sin(t * 5.2) * 6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 3.2 * (1 - s),
      rot: face * 10 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lift" && trick.kind !== "return" && trick.kind !== "reignite") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "cinder") {
      if (next.t < CINDER_HOLD) {
        const pose = cinderPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CINDER_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CINDER_HOLD);
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
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "blaze") {
      const pose = blazePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "shed") {
      const pose = shedPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lift") {
      const pose = liftPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "return") {
      const pose = returnPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "reignite") {
      const pose = reignitePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = hearthPose(next.t, fromX, trick.facing);
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
    DUR,
    CINDER_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    cinderPose,
    releasePose,
    blazePose,
    shedPose,
    liftPose,
    returnPose,
    reignitePose,
    hearthPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    shinePose,
    dipPose,
    settlePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPhoenixTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
