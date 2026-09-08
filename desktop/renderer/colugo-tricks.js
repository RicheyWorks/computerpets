/** Sail ground tricks while idle. House neighborly Sunda colugo (Galeopterus variegatus / Cynocephalidae) desk life -- patagiumglide / clingclimb / headdownhang / leaffoldsettle / galeopterushush personality (patagiumglide membrane sail-glide across desk distinct from Cape wingwrap and duskhang; clingclimb clawed trunk cling-climb distinct from Hang reachcrawl and Ladybird climb; headdownhang underslung head-down hang distinct from Hang hangsway and Wrist pretailhang and Swing hangreach and Cape duskhang; leaffoldsettle patagium leaf-fold settle distinct from Cape wingwrap; long galeopterushush Galeopterus variegatus hush -- never named wait; NOT Wrist kinkajou; NOT Swing gibbon; NOT Hang sloth; NOT Sun lemur; NOT Cape bat; NOT sugar glider; NOT Glide flying squirrel; guest slug Sail / key colugo -- accept colugo and sail; Thank-yous denssail / inksail / densgaleopterus. Sleep, hide, leave, rest, card, ribbon still win. Same map as web colugo-tricks.ts. Next: Glide / flying_squirrel. Catalog 220. */
(function (root) {
  const TRICK_KEY = "colugo";
  const TRICKS = ["patagiumglide", "clingclimb", "headdownhang", "leaffoldsettle", "galeopterushush"];
  const HAPPY = ["denssail", "inksail", "densgaleopterus"];
  const HAPPY_DUR = { denssail: 2.62, inksail: 2.74, densgaleopterus: 2.48 };
  const GALEOPTERUSHUSH_HOLD = 31.12;
  const RELEASE_S = 2.31;
  const DUR = { galeopterushush: GALEOPTERUSHUSH_HOLD + RELEASE_S, patagiumglide: 5.28, clingclimb: 5.14, headdownhang: 5.36, leaffoldsettle: 5.02 };

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
    if (kind === "galeopterushush") return 196 + roll * 20;
    if (kind === "patagiumglide") return 23.6 + roll * 3.5;
    if (kind === "clingclimb") return 24.2 + roll * 3.4;
    if (kind === "headdownhang") return 25.1 + roll * 3.6;
    if (kind === "leaffoldsettle") return 22.8 + roll * 3.3;
    return justFinished ? 18.6 + roll * 2.9 : 13.9 + roll * 2.5;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "galeopterushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "galeopterushush") {
      if (roll < 0.26) return "patagiumglide";
      if (roll < 0.5) return "clingclimb";
      if (roll < 0.74) return "headdownhang";
      return "leaffoldsettle";
    }
    if (lastKind === "patagiumglide") {
      if (roll < 0.26) return "galeopterushush";
      if (roll < 0.5) return "clingclimb";
      if (roll < 0.74) return "headdownhang";
      return "leaffoldsettle";
    }
    if (lastKind === "clingclimb") {
      if (roll < 0.22) return "galeopterushush";
      if (roll < 0.44) return "patagiumglide";
      if (roll < 0.68) return "headdownhang";
      return "leaffoldsettle";
    }
    if (roll < 0.2) return "galeopterushush";
    if (roll < 0.4) return "patagiumglide";
    if (roll < 0.6) return "clingclimb";
    if (roll < 0.8) return "headdownhang";
    return "leaffoldsettle";
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
    return key === TRICK_KEY || key === "sail";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denssail";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denssail" ? "sit" : name === "inksail" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function denssailPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssail));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0044, rot: s * -0.16, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.22);
      return { lift: 0.0044 + Math.abs(sway) * 0.0014, rot: -0.16 + sway * 0.17, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0044 * (1 - s), rot: -0.16 * (1 - s), anim: "idle" };
  }
  function inksailPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksail));
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
  function densgaleopterusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgaleopterus));
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
    if (next.kind === "denssail") {
      const pose = denssailPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inksail") {
      const pose = inksailPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densgaleopterusPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "galeopterushush";
    const anim =
      k === "galeopterushush"
        ? "sit"
        : k === "patagiumglide"
          ? "play"
          : k === "clingclimb"
            ? "walk"
            : k === "headdownhang"
              ? "play"
              : k === "leaffoldsettle"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "galeopterushush" ? "hold" : "go",
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

  function galeopterushushPose(t) {
    const breath = Math.sin(t * 0.00068) + 0.00021 * Math.sin(t * 0.00185);
    const hush = Math.abs(Math.sin(t * 0.00027));
    return { lift: -0.00015 + hush * 0.00004, rot: 0.0028 + breath * 0.0018 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00017 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0038 * (1 - u) };
  }

  function patagiumglidePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.patagiumglide));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0006, lift: s * 0.0078, rot: s * -0.18 * face, anim: "play" };
    }
    if (u < 0.72) {
      const glide = (u - 0.14) / 0.58;
      const sail = Math.sin(glide * Math.PI * 1.35);
      return {
        x: fromX + face * (0.0006 + glide * 0.028),
        lift: 0.0078 - glide * 0.0035 + Math.abs(sail) * 0.0012,
        rot: (-0.18 + sail * 0.1) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { x: fromX + face * (0.0286 - s * 0.0004), lift: 0.0043 * (1 - s), rot: -0.12 * (1 - s) * face, anim: "idle" };
  }

  function clingclimbPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.clingclimb));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0003, lift: s * 0.0042, rot: s * -0.08 * face, anim: "walk" };
    }
    if (u < 0.82) {
      const climb = (u - 0.12) / 0.7;
      const hitch = Math.sin(climb * Math.PI * 4.4);
      return {
        x: fromX + face * (0.0003 + Math.abs(hitch) * 0.00045),
        lift: 0.0042 + climb * 0.011 + Math.abs(hitch) * 0.0016,
        rot: (-0.08 + hitch * 0.11) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.0152 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" };
  }

  function headdownhangPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.headdownhang));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.0004, lift: s * 0.0105, rot: s * 2.85 * face, anim: "play" };
    }
    if (u < 0.72) {
      const sway = Math.sin(((u - 0.18) / 0.54) * Math.PI * 2.05);
      return {
        x: fromX + face * (0.0004 + sway * 0.0007),
        lift: 0.0105 + Math.abs(sway) * 0.0015,
        rot: (2.85 + sway * 0.14) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.0105 * (1 - s), rot: 2.85 * (1 - s) * face, anim: "idle" };
  }

  function leaffoldsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.leaffoldsettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.0005, lift: s * -0.0032, rot: s * 0.22 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const fold = Math.sin(((u - 0.16) / 0.62) * Math.PI * 1.55);
      return {
        x: fromX + face * (0.0005 + Math.abs(fold) * 0.00055),
        lift: -0.0032 + Math.abs(fold) * 0.0016,
        rot: (0.22 + fold * 0.18) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.0005 * (1 - s), lift: -0.0032 * (1 - s), rot: 0.22 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "patagiumglide" && trick.kind !== "clingclimb" && trick.kind !== "headdownhang" && trick.kind !== "leaffoldsettle") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "galeopterushush") {
      if (next.t < GALEOPTERUSHUSH_HOLD) {
        const pose = galeopterushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < GALEOPTERUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - GALEOPTERUSHUSH_HOLD);
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
    if (next.kind === "patagiumglide") {
      const pose = patagiumglidePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "clingclimb") {
      const pose = clingclimbPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "headdownhang") {
      const pose = headdownhangPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = leaffoldsettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    GALEOPTERUSHUSH_HOLD,
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
    denssailPose,
    inksailPose,
    densgaleopterusPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    galeopterushushPose,
    releasePose,
    patagiumglidePose,
    clingclimbPose,
    headdownhangPose,
    leaffoldsettlePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetColugoTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
