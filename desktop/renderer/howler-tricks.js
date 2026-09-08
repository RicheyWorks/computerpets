/** Boom ground tricks while idle. House neighborly mantled howler (Alouatta palliata / Atelidae Alouattinae) desk life -- hyoidboom / tailbrace / canopylounge / leafchew / alouattahush personality (hyoidboom silent hyoid-boom roar cue posture distinct from Swing whoopduet and Crow hopwalk; tailbrace prehensile-tail desk brace distinct from Sun ringtailcurl and Hang hangsway; canopylounge canopy lounge sprawl distinct from Sun bellybask and Hang hangsway; leafchew leaf-browse graze distinct from Grasshopper mandiblegraze and Deer freeze; long alouattahush Alouatta palliata hush -- never named wait; NOT Glide flying squirrel; NOT Sail colugo; NOT Swing gibbon; NOT Sun lemur; NOT Rui red panda; guest slug Boom / key howler -- accept howler and boom; Thank-yous densboom / inkboom / densalouatta. Sleep, hide, leave, rest, card, ribbon still win. Same map as web howler-tricks.ts. Next: Gaze / tarsier. Catalog 220. */
(function (root) {
  const TRICK_KEY = "howler";
  const TRICKS = ["hyoidboom", "tailbrace", "canopylounge", "leafchew", "alouattahush"];
  const HAPPY = ["densboom", "inkboom", "densalouatta"];
  const HAPPY_DUR = { densboom: 2.62, inkboom: 2.79, densalouatta: 2.51 };
  const ALOUATTAHUSH_HOLD = 31.48;
  const RELEASE_S = 2.34;
  const DUR = { alouattahush: ALOUATTAHUSH_HOLD + RELEASE_S, hyoidboom: 5.44, tailbrace: 5.18, canopylounge: 5.31, leafchew: 5.04 };

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
    if (kind === "alouattahush") return 201 + roll * 22;
    if (kind === "hyoidboom") return 24.6 + roll * 3.7;
    if (kind === "tailbrace") return 23.9 + roll * 3.4;
    if (kind === "canopylounge") return 26.1 + roll * 3.6;
    if (kind === "leafchew") return 22.8 + roll * 3.5;
    return justFinished ? 18.6 + roll * 2.9 : 13.9 + roll * 2.5;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "alouattahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "alouattahush") {
      if (roll < 0.26) return "hyoidboom";
      if (roll < 0.5) return "tailbrace";
      if (roll < 0.74) return "canopylounge";
      return "leafchew";
    }
    if (lastKind === "hyoidboom") {
      if (roll < 0.26) return "alouattahush";
      if (roll < 0.5) return "tailbrace";
      if (roll < 0.74) return "canopylounge";
      return "leafchew";
    }
    if (lastKind === "tailbrace") {
      if (roll < 0.22) return "alouattahush";
      if (roll < 0.44) return "hyoidboom";
      if (roll < 0.68) return "canopylounge";
      return "leafchew";
    }
    if (roll < 0.2) return "alouattahush";
    if (roll < 0.4) return "hyoidboom";
    if (roll < 0.6) return "tailbrace";
    if (roll < 0.8) return "canopylounge";
    return "leafchew";
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
    return key === TRICK_KEY || key === "boom";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densboom";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densboom" ? "sit" : name === "inkboom" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densboomPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densboom));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0041, rot: s * -0.15, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.08);
      return { lift: 0.0041 + Math.abs(sway) * 0.0013, rot: -0.15 + sway * 0.16, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0041 * (1 - s), rot: -0.15 * (1 - s), anim: "idle" };
  }
  function inkboomPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkboom));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0033, rot: s * 0.24, anim: "play" };
    }
    if (u < 0.82) {
      const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.05);
      return { lift: 0.0033 + Math.abs(arc) * 0.0019, rot: 0.24 + arc * 0.26, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0033 * (1 - s), rot: 0.24 * (1 - s), anim: "idle" };
  }
  function densalouattaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densalouatta));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0015, rot: s * 0.16, anim: "play" };
    }
    if (u < 0.83) {
      const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.08);
      return { lift: -0.0015 + Math.abs(hush) * 0.0011, rot: 0.16 + hush * 0.15, anim: "play" };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: -0.0015 * (1 - s), rot: 0.16 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densboom") {
      const pose = densboomPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkboom") {
      const pose = inkboomPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densalouattaPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "alouattahush";
    const anim =
      k === "alouattahush"
        ? "sit"
        : k === "hyoidboom"
          ? "sit"
          : k === "tailbrace"
            ? "sit"
            : k === "leafchew"
              ? "sit"
              : k === "canopylounge"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "alouattahush" ? "hold" : "go",
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

  function alouattahushPose(t) {
    const breath = Math.sin(t * 0.00058) + 0.00021 * Math.sin(t * 0.00164);
    const hush = Math.abs(Math.sin(t * 0.00029));
    return { lift: -0.00022 + hush * 0.00006, rot: 0.0021 + breath * 0.0015 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.0002 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0034 * (1 - u) };
  }

  function hyoidboomPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hyoidboom));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.0003, lift: s * 0.0038, rot: s * -0.22 * face, anim: "sit" };
    }
    if (u < 0.42) {
      const s = smoothstep((u - 0.18) / 0.24);
      return { x: fromX + face * (0.0003 + s * 0.0004), lift: 0.0038 + s * 0.0046, rot: (-0.22 - s * 0.18) * face, anim: "play" };
    }
    if (u < 0.78) {
      const boom = Math.sin(((u - 0.42) / 0.36) * Math.PI * 2.15);
      return {
        x: fromX + face * (0.0007 + Math.abs(boom) * 0.00035),
        lift: 0.0084 + Math.abs(boom) * 0.0016,
        rot: (-0.4 + boom * 0.08) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.0084 * (1 - s), rot: -0.4 * (1 - s) * face, anim: "idle" };
  }
  function tailbracePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tailbrace));
    const face = facing == null ? 1 : facing;
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX + face * s * -0.0006, lift: s * -0.0032, rot: s * 0.32 * face, anim: "sit" };
    }
    if (u < 0.72) {
      const wrap = Math.sin(((u - 0.2) / 0.52) * Math.PI * 1.9);
      return {
        x: fromX + face * (-0.0006 + wrap * 0.0005),
        lift: -0.0032 + Math.abs(wrap) * 0.0014,
        rot: (0.32 + wrap * 0.14) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { x: fromX + face * -0.0006 * (1 - s), lift: -0.0032 * (1 - s), rot: 0.32 * (1 - s) * face, anim: "idle" };
  }
  function canopyloungePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.canopylounge));
    const face = facing == null ? 1 : facing;
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX + face * s * 0.0005, lift: s * -0.0068, rot: s * 0.18 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const sprawl = Math.sin(((u - 0.22) / 0.58) * Math.PI * 1.35);
      return {
        x: fromX + face * (0.0005 + Math.abs(sprawl) * 0.0003),
        lift: -0.0068 + Math.abs(sprawl) * 0.0009,
        rot: (0.18 + sprawl * 0.09) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return { x: fromX + face * 0.0005 * (1 - s), lift: -0.0068 * (1 - s), rot: 0.18 * (1 - s) * face, anim: "idle" };
  }
  function leafchewPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.leafchew));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0009, lift: s * 0.0016, rot: s * 0.12 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const chew = Math.sin(((u - 0.14) / 0.72) * Math.PI * 4.4);
      return {
        x: fromX + face * (0.0009 + Math.abs(chew) * 0.00055),
        lift: 0.0016 + Math.abs(chew) * 0.0011,
        rot: (0.12 + chew * 0.11) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0011 * (1 - s), lift: 0.0016 * (1 - s), rot: 0.12 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "hyoidboom" && trick.kind !== "tailbrace" && trick.kind !== "canopylounge" && trick.kind !== "leafchew") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "alouattahush") {
      if (next.t < ALOUATTAHUSH_HOLD) {
        const pose = alouattahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ALOUATTAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ALOUATTAHUSH_HOLD);
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
    if (next.kind === "hyoidboom") {
      const pose = hyoidboomPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tailbrace") {
      const pose = tailbracePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "canopylounge") {
      const pose = canopyloungePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = leafchewPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ALOUATTAHUSH_HOLD,
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
    densboomPose,
    inkboomPose,
    densalouattaPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    alouattahushPose,
    releasePose,
    hyoidboomPose,
    tailbracePose,
    canopyloungePose,
    leafchewPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHowlerTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
