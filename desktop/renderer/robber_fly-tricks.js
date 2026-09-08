/** Rob ground tricks while idle. House neighborly Asilidae / robber fly desk life -- sallyhawk / beardgroom / midsnatch / stiltsstance / asilushush personality (sallyhawk perch-and-sally hawk distinct from Darner hawking/creekpatrol and Jewel creekpatrol; beardgroom bristly mystax beard groom distinct from Snout rostrumtap and Mantis wipe; midsnatch midair snatch cue desk-safe distinct from Vault hindleap, Click clickjack, and Darner hawking; stiltsstance long-legged stilts stance distinct from Stick stickstill and Haste fleetlegs; long asilushush Asilidae hush -- never named wait; NOT Click eyed click beetle; NOT Snout acorn weevil; NOT Forceps earwig; NOT Honeybee; NOT Darner; NOT housefly; guest slug Rob / key robber_fly -- accept robber_fly and rob; Thank-yous densrob / inkrob / densasilus. Sleep, hide, leave, rest, card, ribbon still win. Same map as web robber_fly-tricks.ts. Next: Hang / sloth. Catalog 220. */
(function (root) {
  const TRICK_KEY = "robber_fly";
  const TRICKS = ["sallyhawk", "beardgroom", "midsnatch", "stiltsstance", "asilushush"];
  const HAPPY = ["densrob", "inkrob", "densasilus"];
  const HAPPY_DUR = { densrob: 2.58, inkrob: 2.72, densasilus: 2.46 };
  const ASILUSHUSH_HOLD = 30.20;
  const RELEASE_S = 2.18;
  const DUR = { asilushush: ASILUSHUSH_HOLD + RELEASE_S, sallyhawk: 4.42, beardgroom: 4.28, midsnatch: 4.08, stiltsstance: 4.64 };

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
    if (kind === "asilushush") return 194 + roll * 18;
    if (kind === "sallyhawk") return 20.8 + roll * 3.2;
    if (kind === "beardgroom") return 24.0 + roll * 3.5;
    if (kind === "midsnatch") return 25.6 + roll * 3.8;
    if (kind === "stiltsstance") return 23.8 + roll * 3.4;
    return justFinished ? 18.2 + roll * 2.8 : 13.6 + roll * 2.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "asilushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "asilushush") {
      if (roll < 0.26) return "sallyhawk";
      if (roll < 0.5) return "beardgroom";
      if (roll < 0.74) return "midsnatch";
      return "stiltsstance";
    }
    if (lastKind === "sallyhawk") {
      if (roll < 0.26) return "asilushush";
      if (roll < 0.5) return "beardgroom";
      if (roll < 0.74) return "midsnatch";
      return "stiltsstance";
    }
    if (lastKind === "beardgroom") {
      if (roll < 0.22) return "asilushush";
      if (roll < 0.44) return "sallyhawk";
      if (roll < 0.68) return "midsnatch";
      return "stiltsstance";
    }
    if (roll < 0.2) return "asilushush";
    if (roll < 0.4) return "sallyhawk";
    if (roll < 0.6) return "beardgroom";
    if (roll < 0.8) return "midsnatch";
    return "stiltsstance";
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
    return key === TRICK_KEY || key === "rob";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densrob";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densrob" ? "sit" : name === "inkrob" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }


  function densrobPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densrob));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0022, rot: s * 0.13, anim: "sit" };
    }
    if (u < 0.86) {
      const beard = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.55);
      return { lift: -0.0022 + Math.abs(beard) * 0.0014, rot: 0.13 + beard * 0.17, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: -0.0022 * (1 - s), rot: 0.13 * (1 - s), anim: "idle" };
  }
  function inkrobPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkrob));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0041, rot: s * -0.24, anim: "play" };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.35);
      return { lift: 0.0041 + Math.abs(pulse) * 0.0019, rot: -0.24 + pulse * 0.28, anim: "play" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0041 * (1 - s), rot: -0.24 * (1 - s), anim: "idle" };
  }
  function densasilusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densasilus));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0018, rot: s * 0.15, anim: "play" };
    }
    if (u < 0.82) {
      const flash = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.4);
      return { lift: 0.0018 + Math.abs(flash) * 0.0012, rot: 0.15 + flash * 0.16, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0018 * (1 - s), rot: 0.15 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densrob") {
      const pose = densrobPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkrob") {
      const pose = inkrobPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densasilusPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "asilushush";
    const anim =
      k === "asilushush"
        ? "sit"
        : k === "sallyhawk"
          ? "play"
          : k === "beardgroom"
            ? "play"
            : k === "stiltsstance"
              ? "sit"
              : k === "midsnatch"
                ? "play"
                : "sit";
    return {
      kind: k,
      phase: k === "asilushush" ? "hold" : "go",
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


  function asilushushPose(t) {
    const breath = Math.sin(t * 0.00082) + 0.00028 * Math.sin(t * 0.0022);
    const hush = Math.abs(Math.sin(t * 0.00031));
    return { lift: -0.00018 + hush * 0.000045, rot: 0.004 + breath * 0.002 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.0002 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0055 * (1 - u) };
  }

  function sallyhawkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sallyhawk));
    const face = facing == null ? 1 : facing;
    // perch still → sudden sally dart → hover snatch line → return to perch
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00008, lift: s * 0.0022, rot: s * -0.12 * face, anim: "play" };
    }
    if (u < 0.34) {
      const s = smoothstep((u - 0.16) / 0.18);
      return {
        x: fromX + face * (0.00001 + s * 0.014),
        lift: 0.0004 + s * 0.018,
        rot: (-0.04 + s * 0.22) * face,
        anim: "play",
      };
    }
    if (u < 0.58) {
      const air = (u - 0.34) / 0.24;
      const hover = Math.sin(air * Math.PI * 3.2);
      return {
        x: fromX + face * (0.014 + air * 0.004 + hover * 0.00025),
        lift: 0.0184 + Math.abs(hover) * 0.0022,
        rot: (0.18 + hover * 0.12) * face,
        anim: "play",
      };
    }
    if (u < 0.84) {
      const s = smoothstep((u - 0.58) / 0.26);
      return {
        x: fromX + face * (0.018 - s * 0.0175),
        lift: 0.0184 * (1 - s) + s * 0.0005,
        rot: (0.18 - s * 0.2) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.0005 * (1 - s), rot: (-0.02 * (1 - s)) * face, anim: "idle" };
  }

  function beardgroomPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.beardgroom));
    const face = facing == null ? 1 : facing;
    // dip head into bristly mystax, scrub, lift
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00002, lift: s * -0.0028, rot: s * 0.28 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const scrub = (u - 0.14) / 0.64;
      const wipe = Math.sin(scrub * Math.PI * 5.4);
      return {
        x: fromX + face * (0.00002 + wipe * 0.00012),
        lift: -0.0028 + Math.abs(wipe) * 0.0009,
        rot: (0.28 + wipe * 0.18) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.00002 * (1 - s), lift: -0.0028 * (1 - s), rot: 0.28 * (1 - s) * face, anim: "idle" };
  }

  function midsnatchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.midsnatch));
    const face = facing == null ? 1 : facing;
    // desk-safe midair snatch cue: rear → lunge up → clasp gesture → settle (not a clickjack flip)
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX - face * s * 0.0012, lift: s * 0.001, rot: s * -0.14 * face, anim: "play" };
    }
    if (u < 0.36) {
      const s = smoothstep((u - 0.12) / 0.24);
      return {
        x: fromX + face * (-0.0012 + s * 0.008),
        lift: 0.001 + s * 0.016,
        rot: (-0.14 + s * 0.32) * face,
        anim: "play",
      };
    }
    if (u < 0.62) {
      const clasp = Math.sin(((u - 0.36) / 0.26) * Math.PI * 2.6);
      return {
        x: fromX + face * (0.0068 + clasp * 0.0002),
        lift: 0.017 + Math.abs(clasp) * 0.0014,
        rot: (0.18 + clasp * 0.1) * face,
        anim: "play",
      };
    }
    if (u < 0.86) {
      const s = smoothstep((u - 0.62) / 0.24);
      return { x: fromX + face * (0.0068 - s * 0.005), lift: 0.017 * (1 - s), rot: (0.18 - s * 0.16) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0018 * (1 - s), lift: 0.0012 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" };
  }

  function stiltsstancePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stiltsstance));
    const face = facing == null ? 1 : facing;
    // rise onto long asilid stilts, sway, settle
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00003, lift: s * 0.0042, rot: s * -0.08 * face, anim: "sit" };
    }
    if (u < 0.82) {
      const sway = (u - 0.18) / 0.64;
      const lean = Math.sin(sway * Math.PI * 2.1);
      return {
        x: fromX + face * (0.00003 + lean * 0.0004),
        lift: 0.0042 + Math.abs(lean) * 0.00055,
        rot: (-0.08 + lean * 0.11) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.00003 * (1 - s), lift: 0.0042 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "sallyhawk" && trick.kind !== "beardgroom" && trick.kind !== "midsnatch" && trick.kind !== "stiltsstance") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "asilushush") {
      if (next.t < ASILUSHUSH_HOLD) {
        const pose = asilushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ASILUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ASILUSHUSH_HOLD);
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
    if (next.kind === "sallyhawk") {
      const pose = sallyhawkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "beardgroom") {
      const pose = beardgroomPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "midsnatch") {
      const pose = midsnatchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = stiltsstancePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ASILUSHUSH_HOLD,
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
    densrobPose,
    inkrobPose,
    densasilusPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    asilushushPose,
    releasePose,
    sallyhawkPose,
    beardgroomPose,
    midsnatchPose,
    stiltsstancePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRobberFlyTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
