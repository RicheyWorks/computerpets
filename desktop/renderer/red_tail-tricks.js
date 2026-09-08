/** Hook ground tricks while idle — ultra-polish pass. House neighborly Accipitridae / Buteoninae red-tailed hawk desk life — kettle / stoop / bind / keeyer / patagial / tower / buteo personality (kettle thermal-circle wing-set without naming soar or dihedral, stoop dive-coil without naming softcrouch or plunge, bind talon-bind without naming mantle, keeyer kee-eer stance without naming soar-cry or cronk or snore, patagial wing-mark flash without naming flash or fan or strut, tower rising spiral without naming soar or kettle-cry, long buteo Buteo jamaicensis fencepost perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid; window-play SOAR owns soar; Soot/Wedge/Heart own their tricks; guest slug Hook / key red_tail — accept "red_tail" and "hook"; do NOT name a trick red_tail or hook or soar or mantle). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous borealis / calurus / harlani. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop red_tail-tricks.js. Window-play SOAR unchanged. True red-tailed hawk desk life — not owl/crow/raven clones. Dee owns the next seat. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "red_tail";
  const TRICKS = ["kettle", "stoop", "bind", "keeyer", "patagial", "tower", "buteo"];
  const HAPPY = ["borealis", "calurus", "harlani"];
  const HAPPY_DUR = { borealis: 1.58, calurus: 1.72, harlani: 1.65 };
  const BUTEO_HOLD = 14.8;
  const RELEASE_S = 1.08;
  const DUR = {
    buteo: BUTEO_HOLD + RELEASE_S,
    kettle: 2.48,
    stoop: 2.36,
    bind: 2.42,
    keeyer: 2.28,
    patagial: 2.34,
    tower: 2.52,
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
    if (kind === "buteo") return 44 + roll * 30;
    if (kind === "keeyer" || kind === "tower") return 13 + roll * 9;
    if (kind === "stoop" || kind === "bind") return 12 + roll * 9;
    if (kind === "kettle" || kind === "patagial") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "buteo";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) => (k === "buteo" ? 0.55 : k === "keeyer" || k === "kettle" ? 1.15 : 1));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "kettle";
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
    return key === TRICK_KEY || key === "hook";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "borealis";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "calurus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function borealisPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.borealis));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 6, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
      return { lift: 6 + Math.abs(flash) * 5, rot: 12 + flash * 8, dx: flash * 2.2, anim: "sit" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 4 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "idle" };
  }

  function calurusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.calurus));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 14, rot: s * -12, dx: s * 3, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
      return { lift: 12 + Math.abs(wriggle) * 10, rot: -10 + wriggle * 14, dx: wriggle * 4, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 5 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" };
  }

  function harlaniPose(t) {
    return {
      lift: 3 + Math.abs(Math.sin(t * 4.0)) * 7,
      rot: Math.sin(t * 3.4) * 9,
      dx: Math.sin(t * 2.6) * 3,
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
    const pose =
      next.kind === "borealis" ? borealisPose(next.t) : next.kind === "calurus" ? calurusPose(next.t) : harlaniPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "buteo" || kind === "kettle" || kind === "stoop" || kind === "patagial"
        ? "sit"
        : kind === "bind" || kind === "tower"
          ? "play"
          : kind === "keeyer"
            ? "talk"
            : "sit";
    return {
      kind: kind,
      phase: kind === "buteo" ? "hold" : "go",
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

  function buteoPose(t) {
    const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
    const soft = Math.abs(Math.sin(t * 0.9));
    return { lift: 2 + soft * 4 + Math.abs(breath) * 1.5, rot: -2 + breath * 4 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3 * (1 - u) };
  }

  function kettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.kettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 10, rot: s * -8 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.10) / 0.78;
      const circle = Math.sin(s * Math.PI * 2);
      const liftWave = Math.abs(Math.sin(s * Math.PI * 3));
      return {
        x: fromX + face * circle * 12,
        lift: 8 + liftWave * 10,
        rot: (-6 + circle * 10) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 5 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" };
  }

  function stoopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stoop));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 16, rot: s * -14 * face, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      return {
        x: fromX + face * s * 8,
        lift: 16 - s * 18,
        rot: (-14 - s * 8) * face,
        anim: "sit",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.55) / 0.33;
      const settle = Math.sin(s * Math.PI);
      return {
        x: fromX + face * 8,
        lift: -2 + settle * 4,
        rot: (-10 + settle * 6) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 8 * (1 - s), lift: 2 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" };
  }

  function bindPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bind));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 8, rot: s * 10 * face, anim: "play" };
    }
    if (u < 0.86) {
      const clamp = Math.sin(t * 4.2) + 0.22 * Math.sin(t * 8.4);
      return {
        x: fromX + face * clamp * 2.5,
        lift: 6 + Math.abs(clamp) * 5,
        rot: (10 + clamp * 7) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 3 * (1 - s), rot: 3 * (1 - s) * face, anim: "idle" };
  }

  function keeyerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.keeyer));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 6, rot: s * 14 * face, anim: "talk" };
    }
    if (u < 0.88) {
      const pulse = Math.sin(t * 3.6) + 0.26 * Math.sin(t * 7.2);
      return {
        x: fromX + face * pulse * 2.6,
        lift: 5 + Math.abs(pulse) * 5,
        rot: (14 + pulse * 7) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 3 * (1 - s), rot: 4 * (1 - s) * face, anim: "idle" };
  }

  function patagialPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.patagial));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 7, rot: s * -12 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const flash = Math.sin(t * 5.1) + 0.3 * Math.sin(t * 10.2);
      return {
        x: fromX + face * flash * 3,
        lift: 6 + Math.abs(flash) * 6,
        rot: (-12 + flash * 10) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 3 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" };
  }

  function towerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tower));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 6, rot: s * -6 * face, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const spiral = Math.sin(s * Math.PI * 2.5);
      return {
        x: fromX + face * spiral * 8,
        lift: 6 + s * 16 + Math.abs(spiral) * 4,
        rot: (-6 + spiral * 9) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 8 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    const short =
      trick.kind === "kettle" ||
      trick.kind === "stoop" ||
      trick.kind === "bind" ||
      trick.kind === "keeyer" ||
      trick.kind === "patagial" ||
      trick.kind === "tower";
    if (shouldAbort(flags) && !short) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "buteo") {
      if (next.t < BUTEO_HOLD) {
        const pose = buteoPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BUTEO_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BUTEO_HOLD);
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
    const from = trick.fromX != null ? trick.fromX : trick.x;
    const poseFn = {
      kettle: kettlePose,
      stoop: stoopPose,
      bind: bindPose,
      keeyer: keeyerPose,
      patagial: patagialPose,
      tower: towerPose,
    }[next.kind];
    const pose = poseFn(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    BUTEO_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    buteoPose,
    releasePose,
    kettlePose,
    stoopPose,
    bindPose,
    keeyerPose,
    patagialPose,
    towerPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    borealisPose,
    calurusPose,
    harlaniPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRedTailTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
