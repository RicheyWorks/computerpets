/** Brick ground tricks while idle. House neighborly Turdidae / Turdus American robin desk life — runstop / listen / carol / tug / turdus personality (runstop run-stop-run lawn forage without naming hop or hopwalk or soar, listen head-cock worm-listen without naming monocle or parallax or softcrouch, carol dawn-carol stance without naming sing or song or cry or call or feebee or keeyer or cronk or snore, tug turf-tug worm-pull without naming fossick or mantle or cache, long turdus Turdus migratorius brick-breast desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile; window-play leaves robin fly alone; Soot/Wedge/Heart/Hook/Dee own their tricks; guest slug Brick / key robin — accept "robin" and "brick"; do NOT name a trick robin or brick or hop or soar or mantle). Thank-yous migratorius / achrusterus / caurinus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web robin-tricks.ts. Window-play unchanged. True American robin desk life — not chickadee/hawk/owl/crow/raven clones. Drake owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "robin";
  const TRICKS = ["runstop", "listen", "carol", "tug", "turdus"];
  const HAPPY = ["migratorius", "achrusterus", "caurinus"];
  const HAPPY_DUR = { migratorius: 1.63, achrusterus: 1.78, caurinus: 1.70 };
  const TURDUS_HOLD = 19.08;
  const RELEASE_S = 1.14;
  const DUR = { turdus: TURDUS_HOLD + RELEASE_S, runstop: 2.48, listen: 2.40, carol: 2.62, tug: 2.52 };

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
      if (kind === "turdus") return 86 + roll * 42;
  if (kind === "runstop") return 15.8 + roll * 13.0;
  if (kind === "listen") return 17.8 + roll * 12.0;
  if (kind === "tug") return 20.2 + roll * 12.6;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "turdus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "turdus") {
      if (roll < 0.26) return "runstop";
      if (roll < 0.5) return "listen";
      if (roll < 0.74) return "carol";
      return "tug";
    }
    if (lastKind === "runstop") {
      if (roll < 0.26) return "turdus";
      if (roll < 0.5) return "listen";
      if (roll < 0.74) return "carol";
      return "tug";
    }
    if (lastKind === "listen") {
      if (roll < 0.22) return "turdus";
      if (roll < 0.44) return "runstop";
      if (roll < 0.68) return "carol";
      return "tug";
    }
    if (roll < 0.2) return "turdus";
    if (roll < 0.4) return "runstop";
    if (roll < 0.6) return "listen";
    if (roll < 0.8) return "carol";
    return "tug";
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
    return key === TRICK_KEY || key === "brick";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "migratorius";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "migratorius" ? "sit" : name === "achrusterus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function migratoriusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.migratorius));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.019, rot: s * 2.15, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
      return {
        lift: 0.019 + Math.abs(flash) * 0.014,
        rot: 2.15 + flash * 1.55,
        dx: flash * 0.0010,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.008 * (1 - s), rot: 0.55 * (1 - s), dx: 0, anim: "idle" };
  }
  function achrusterusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.achrusterus));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.028, rot: s * -2.05, dx: s * 0.0014, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
      return {
        lift: 0.028 + Math.abs(wriggle) * 0.020,
        rot: -2.05 + wriggle * 2.55,
        dx: wriggle * 0.0022,
        anim: "play",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.010 * (1 - s), rot: -0.38 * (1 - s), dx: 0, anim: "sit" };
  }
  function caurinusPose(t) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.29)) * 0.015,
      rot: Math.sin(t * 0.29) * 1.25,
      dx: Math.sin(t * 0.24) * 0.0011,
      anim: "sit",
    };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "migratorius") {
      const pose = migratoriusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "achrusterus") {
      const pose = achrusterusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = caurinusPose(next.t);
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
    const anim =
      kind === "turdus"
        ? "sit"
        : kind === "runstop"
          ? "play"
          : kind === "listen"
            ? "sit"
            : kind === "carol"
              ? "talk"
              : kind === "tug"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "turdus" ? "hold" : "go",
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


                      function turdusPose(t) {
    const breath = Math.sin(t * 0.09) + 0.07 * Math.sin(t * 0.25);
    const soft = Math.abs(Math.sin(t * 0.12));
    return {
      lift: 0.006 + soft * 0.013,
      rot: 0.62 + breath * 0.72,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.22 * (1 - u) };
  }

  function runstopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.runstop));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // runstop lawn-run lifts into a short dash
      return { x: fromX, lift: s * 0.016, rot: s * -3.2 * face, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.10) / 0.78;
      // stop-run pulses: dash, plant, dash again without naming hop
      const dash = Math.sin(s * Math.PI * 3.2);
      const plant = Math.abs(Math.sin(s * Math.PI * 6.4));
      return {
        x: fromX + face * (0.028 * s + dash * 0.010),
        lift: 0.012 + plant * 0.018,
        rot: (-3.2 + dash * 5.4) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + face * 0.028 * (1 - s),
      lift: 0.008 * (1 - s),
      rot: -0.8 * (1 - s) * face,
      anim: "idle",
    };
  }
  function listenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.listen));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      // listen head-cock tips toward the blotter turf
      return { x: fromX, lift: s * 0.010, rot: s * 14.5 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const hush = Math.sin(t * 1.6) + 0.22 * Math.sin(t * 3.3);
      return {
        x: fromX + face * hush * 0.0012,
        lift: 0.010 + Math.abs(hush) * 0.005,
        rot: (14.5 + hush * 2.8) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.004 * (1 - s),
      rot: 2.2 * (1 - s) * face,
      anim: "idle",
    };
  }
  function carolPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.carol));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      // carol lifts into a brick-breast song lean without naming sing
      return { x: fromX, lift: s * 0.026, rot: s * 6.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.11) / 0.75;
      const phrase = Math.sin(s * Math.PI * 2.4);
      const settle = Math.abs(Math.sin(s * Math.PI * 4.8));
      return {
        x: fromX + face * (0.004 * s + phrase * 0.0025),
        lift: 0.022 + settle * 0.014,
        rot: (6.8 + phrase * 5.2) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + face * 0.004 * (1 - s),
      lift: 0.010 * (1 - s),
      rot: 1.4 * (1 - s) * face,
      anim: "idle",
    };
  }
  function tugPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tug));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      // tug tips into the turf for a worm pull
      return { x: fromX, lift: s * -0.012, rot: s * 4.4 * face, anim: "play" };
    }
    if (u < 0.88) {
      const yank = Math.sin(t * 3.1) + 0.26 * Math.sin(t * 6.2);
      return {
        x: fromX + face * (-0.008 + yank * 0.004),
        lift: -0.012 + Math.abs(yank) * 0.016,
        rot: (4.4 + yank * 6.5) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: -0.004 * (1 - s), rot: 0.6 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "runstop" && trick.kind !== "listen" && trick.kind !== "carol" && trick.kind !== "tug") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "turdus") {
      if (next.t < TURDUS_HOLD) {
        const pose = turdusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TURDUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TURDUS_HOLD);
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
    if (next.kind === "runstop") {
      const pose = runstopPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "listen") {
      const pose = listenPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "carol") {
      const pose = carolPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tugPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    TURDUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    turdusPose,
    releasePose,
    runstopPose,
    listenPose,
    carolPose,
    tugPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    migratoriusPose,
    achrusterusPose,
    caurinusPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRobinTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
