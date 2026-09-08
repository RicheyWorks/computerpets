/** Bell ground tricks while idle. House neighborly Blue Stentor (stentor / Bell) desk life -- trumpet flare / myoneme contract / ciliary vortex / blue settle / long bell hush; NOT Spin chlamydomonas; NOT Hold; NOT Pane; NOT Orb; NOT Spot; NOT Reach; NOT Boot; NOT Gauss; NOT Ion; NOT Coli; NOT Relay; NOT Fuse; NOT Rui; guest slug Bell / key stentor -- accept stentor and bell; Thank-yous densbell / inkbell / densstentor. Sleep, hide, leave, rest, card, ribbon still win. Same map as web stentor-tricks.ts. Next: Rod / coli. Catalog 208. */
(function (root) {
  const TRICK_KEY = "stentor";
  const TRICKS = ["trumpetflare", "myonemecontract", "ciliaryvortex", "bluesettle", "longbellhush"];
  const HAPPY = ["densbell", "inkbell", "densstentor"];
  const HAPPY_DUR = { densbell: 3.59, inkbell: 3.27, densstentor: 3.44 };
  const LONGBELLHUSH_HOLD = 39.21;
  const RELEASE_S = 2.8;
  const DUR = { longbellhush: LONGBELLHUSH_HOLD + RELEASE_S, trumpetflare: 7.21, myonemecontract: 6.63, ciliaryvortex: 6.38, bluesettle: 6.51 };

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
    if (kind === "longbellhush") return 249 + roll * 48;
    if (kind === "myonemecontract") return 32.1 + roll * 4.4;
    if (kind === "bluesettle") return 30.0 + roll * 4.1;
    if (kind === "trumpetflare") return 30.9 + roll * 4.3;
    if (kind === "ciliaryvortex") return 29.2 + roll * 4.2;
    return justFinished ? 23.4 + roll * 4.3 : 18.5 + roll * 3.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longbellhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longbellhush") {
      if (roll < 0.26) return "myonemecontract";
      if (roll < 0.62) return "bluesettle";
      if (roll < 0.79) return "trumpetflare";
      return "ciliaryvortex";
    }
    if (lastKind === "myonemecontract") {
      if (roll < 0.26) return "longbellhush";
      if (roll < 0.5) return "bluesettle";
      if (roll < 0.74) return "trumpetflare";
      return "ciliaryvortex";
    }
    if (lastKind === "bluesettle") {
      if (roll < 0.22) return "longbellhush";
      if (roll < 0.44) return "myonemecontract";
      if (roll < 0.74) return "trumpetflare";
      return "ciliaryvortex";
    }
    if (roll < 0.2) return "longbellhush";
    if (roll < 0.4) return "myonemecontract";
    if (roll < 0.6) return "bluesettle";
    if (roll < 0.8) return "trumpetflare";
    return "ciliaryvortex";
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
    return key === TRICK_KEY || key === "bell";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densbell";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densbell" ? "sit" : name === "inkbell" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }








  function densspinPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbell));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.005, rot: s * -0.38, anim: "sit" };
    }
    if (u < 0.5) {
      const sway = Math.sin(((u - 0.11) / 0.39) * Math.PI * 3.25);
      const haze = Math.sin(((u - 0.11) / 0.39) * Math.PI * 6.1);
      return { lift: 0.005 + Math.abs(sway) * 0.0016 + Math.abs(haze) * 0.00055, rot: -0.32 + sway * 0.23 + haze * 0.055, anim: "sit" };
    }
    if (u < 0.86) {
      const sway = Math.sin(((u - 0.5) / 0.36) * Math.PI * 2.5);
      return { lift: 0.005 + Math.abs(sway) * 0.0013, rot: -0.27 + sway * 0.17, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.005 * (1 - s), rot: -0.27 * (1 - s), anim: "idle" };
  }
  function inkspinPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkbell));
    if (u < 0.1) {
      const s = u / 0.1;
      return { lift: s * 0.0063, rot: s * 0.47, anim: "play" };
    }
    if (u < 0.49) {
      const bob = Math.sin(((u - 0.1) / 0.39) * Math.PI * 3.45);
      const ion = Math.sin(((u - 0.1) / 0.39) * Math.PI * 6.6);
      return { lift: 0.0059 + Math.abs(bob) * 0.002 + Math.abs(ion) * 0.00065, rot: 0.4 + bob * 0.22 + ion * 0.05, anim: "play" };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.49) / 0.37) * Math.PI * 2.55);
      return { lift: 0.0059 + Math.abs(bob) * 0.0015, rot: 0.35 + bob * 0.16, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0059 * (1 - s), rot: 0.35 * (1 - s), anim: "idle" };
  }
  function denschlamydomonasPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densstentor));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0043, rot: s * -0.285, anim: "play" };
    }
    if (u < 0.53) {
      const hush = Math.sin(((u - 0.12) / 0.41) * Math.PI * 2.55);
      const haze = Math.sin(((u - 0.12) / 0.41) * Math.PI * 5.2);
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
    if (next.kind === "densbell") {
      const pose = densspinPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkbell") {
      const pose = inkspinPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denschlamydomonasPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longbellhush";
    const anim =
      k === "longbellhush"
        ? "sit"
        : k === "myonemecontract"
          ? "sit"
          : k === "bluesettle"
            ? "sit"
            : k === "ciliaryvortex"
              ? "play"
              : k === "trumpetflare"
                ? "walk"
                : "sit";
    return {
      kind: k,
      phase: k === "longbellhush" ? "hold" : "go",
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








  function longspinhushPose(t) {
    const breath = Math.sin(t * 0.00022) + 0.00020 * Math.sin(t * 0.00076) + 0.00009 * Math.sin(t * 0.00149);
    const haze = Math.abs(Math.sin(t * 0.00020)) + 0.42 * Math.abs(Math.sin(t * 0.00037)) + 0.18 * Math.abs(Math.sin(t * 0.00065));
    return { lift: -0.00017 + haze * 0.00018, rot: 0.0014 + breath * 0.0030 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    const ease = Math.sin(u * Math.PI * 0.5);
    return { lift: -0.00016 * (1 - ease), rot: 0.0042 * (1 - u) + 0.00050 * Math.sin(u * Math.PI * 2.1) };
  }

  function cupchloroplastPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.myonemecontract));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 0.00016, lift: s * 0.0020, rot: s * 0.06 * face, anim: "sit" };
    }
    if (u < 0.36) {
      const drift = Math.sin(((u - 0.1) / 0.26) * Math.PI * 6.9);
      const outline = Math.sin(((u - 0.1) / 0.26) * Math.PI * 11.6);
      return {
        x: fromX + face * (0.00016 + (u - 0.1) / 0.26 * 0.00062 + outline * 0.00004),
        lift: 0.0017 + Math.abs(drift) * 0.0030 + Math.abs(outline) * 0.001,
        rot: (0.05 + drift * 0.13 + outline * 0.045) * face,
        anim: "sit",
      };
    }
    if (u < 0.79) {
      const haze = Math.sin(((u - 0.36) / 0.42) * Math.PI * 9.0);
      const pale = Math.sin(((u - 0.36) / 0.42) * Math.PI * 4.0);
      const on = haze > -0.15 ? 1 : 0.20;
      return {
        x: fromX + face * (0.00076 + (u - 0.36) / 0.42 * 0.00088 + pale * 0.00007),
        lift: 0.0027 * on + Math.abs(pale) * 0.0016 + Math.abs(haze) * 0.0012,
        rot: (0.07 + haze * 0.11 + pale * 0.06) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.79) / 0.22);
    return { x: fromX + face * (0.00166 * (1 - s) + 0.00016 * s), lift: 0.0021 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" };
  }
  function wetplateswimPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bluesettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00005, lift: s * 0.0041, rot: s * -0.13 * face, anim: "sit" };
    }
    if (u < 0.33) {
      const s = smoothstep((u - 0.12) / 0.21);
      return { x: fromX + face * (0.00005 + s * 0.000406), lift: 0.0035 + s * 0.0084, rot: (-0.09 + s * 0.2) * face, anim: "sit" };
    }
    if (u < 0.58) {
      const mist = Math.sin(((u - 0.33) / 0.25) * Math.PI * 5.1);
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
        lift: 0.0084 - ((u - 0.58) / 0.25) * 0.0035 + Math.abs(soft) * 0.0008,
        rot: (0.13 + soft * 0.09) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.83) / 0.17);
    return { x: fromX + face * 0.00041 * (1 - s), lift: 0.0052 * (1 - s), rot: 0.13 * (1 - s) * face, anim: "idle" };
  }
  function flagellaspinPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.trumpetflare));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0003, lift: s * 0.0025, rot: s * 0.06 * face, anim: "walk" };
    }
    if (u < 0.44) {
      const cling = Math.sin(((u - 0.12) / 0.32) * Math.PI * 5.7);
      const pale = Math.sin(((u - 0.12) / 0.32) * Math.PI * 9.5);
      const path = (u - 0.12) / 0.32;
      return {
        x: fromX + face * (0.0003 + path * 0.00098 + cling * 0.0001),
        lift: 0.0022 + Math.abs(cling) * 0.002 + Math.abs(pale) * 0.0008,
        rot: (0.06 + cling * 0.1 + pale * 0.04) * face,
        anim: "walk",
      };
    }
    if (u < 0.76) {
      const haze = Math.sin(((u - 0.44) / 0.32) * Math.PI * 6.5);
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
  function eyespotglancePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ciliaryvortex));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00004, lift: s * 0.0032, rot: s * 0.18 * face, anim: "play" };
    }
    if (u < 0.37) {
      const s = smoothstep((u - 0.14) / 0.23);
      return { x: fromX + face * (0.00004 + s * 0.00027), lift: 0.0030 + s * 0.0059, rot: (0.13 + s * 0.5) * face, anim: "play" };
    }
    if (u < 0.70) {
      const charge = Math.sin(((u - 0.37) / 0.26) * Math.PI * 5.1);
      const haze = Math.sin(((u - 0.37) / 0.26) * Math.PI * 8.6);
      return {
        x: fromX + face * (0.00031 + charge * 0.00009),
        lift: 0.0095 + Math.abs(charge) * 0.0021 + Math.abs(haze) * 0.001,
        rot: (0.63 + charge * 0.3 + haze * 0.11) * face,
        anim: "play",
      };
    }
    if (u < 0.84) {
      const claim = Math.sin(((u - 0.63) / 0.21) * Math.PI * 3.2);
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
    if (shouldAbort(flags) && trick.kind !== "myonemecontract" && trick.kind !== "bluesettle" && trick.kind !== "trumpetflare" && trick.kind !== "ciliaryvortex") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longbellhush") {
      if (next.t < LONGBELLHUSH_HOLD) {
        const pose = longspinhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGBELLHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGBELLHUSH_HOLD);
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
    if (next.kind === "myonemecontract") {
      const pose = cupchloroplastPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bluesettle") {
      const pose = wetplateswimPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "trumpetflare") {
      const pose = flagellaspinPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = eyespotglancePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGBELLHUSH_HOLD,
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
    densspinPose,
    inkspinPose,
    denschlamydomonasPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longspinhushPose,
    releasePose,
    cupchloroplastPose,
    wetplateswimPose,
    flagellaspinPose,
    eyespotglancePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetStentorTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
