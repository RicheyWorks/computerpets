/** Tube ground tricks while idle. House neighborly Pineapple sea cucumber (Thelenota ananas / Holothuroidea sea cucumber) desk life -- tube-foot crawl / deposit-feed sift / cucumber body swell-shrink / soft retract defense cue / long holothuria hush; NOT Scrub cleaner shrimp (esp. not antennawaveadvertise/dancescrubclientcue/rockcreviceretreat/bipedalwalktick/longlysmatahush); NOT Scrape parrotfish; NOT Paint clownfish; NOT Cast earthworm; NOT sea star (podia/righting/crawl/evert/penta); NOT Rui; guest slug Tube / key sea_cucumber -- accept sea_cucumber and tube; Thank-yous denstube / inktube / densholothuria. Sleep, hide, leave, rest, card, ribbon still win. Same map as web sea_cucumber-tricks.ts. Next: Veil / lionfish. Catalog 220. */
(function (root) {
  const TRICK_KEY = "sea_cucumber";
  const TRICKS = ["tubefootcrawl", "depositfeedsift", "cucumberswellshrink", "softretractcue", "longholothuriahush"];
  const HAPPY = ["denstube", "inktube", "densholothuria"];
  const HAPPY_DUR = { denstube: 2.68, inktube: 2.76, densholothuria: 2.61 };
  const LONGHOLOTHURIAHUSH_HOLD = 34.12;
  const RELEASE_S = 2.52;
  const DUR = { longholothuriahush: LONGHOLOTHURIAHUSH_HOLD + RELEASE_S, tubefootcrawl: 5.52, depositfeedsift: 5.44, cucumberswellshrink: 5.36, softretractcue: 5.48 };

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
    if (kind === "longholothuriahush") return 212 + roll * 28;
    if (kind === "depositfeedsift") return 26.2 + roll * 3.2;
    if (kind === "softretractcue") return 25.1 + roll * 3.3;
    if (kind === "tubefootcrawl") return 24.6 + roll * 3.1;
    if (kind === "cucumberswellshrink") return 24.3 + roll * 3.5;
    return justFinished ? 19.1 + roll * 3.0 : 14.2 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longholothuriahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longholothuriahush") {
      if (roll < 0.26) return "depositfeedsift";
      if (roll < 0.5) return "softretractcue";
      if (roll < 0.74) return "tubefootcrawl";
      return "cucumberswellshrink";
    }
    if (lastKind === "depositfeedsift") {
      if (roll < 0.26) return "longholothuriahush";
      if (roll < 0.5) return "softretractcue";
      if (roll < 0.74) return "tubefootcrawl";
      return "cucumberswellshrink";
    }
    if (lastKind === "softretractcue") {
      if (roll < 0.22) return "longholothuriahush";
      if (roll < 0.44) return "depositfeedsift";
      if (roll < 0.68) return "tubefootcrawl";
      return "cucumberswellshrink";
    }
    if (roll < 0.2) return "longholothuriahush";
    if (roll < 0.4) return "depositfeedsift";
    if (roll < 0.6) return "softretractcue";
    if (roll < 0.8) return "tubefootcrawl";
    return "cucumberswellshrink";
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
    return key === TRICK_KEY || key === "tube";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denstube";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denstube" ? "sit" : name === "inktube" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function denstubePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstube));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0034, rot: s * -0.22, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.35);
      return { lift: 0.0034 + Math.abs(sway) * 0.0009, rot: -0.22 + sway * 0.16, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0034 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }
  function inktubePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inktube));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0035, rot: s * 0.26, anim: "play" };
    }
    if (u < 0.82) {
      const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 2.95);
      return { lift: 0.0035 + Math.abs(arc) * 0.0020, rot: 0.26 + arc * 0.28, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0035 * (1 - s), rot: 0.26 * (1 - s), anim: "idle" };
  }
  function densholothuriaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densholothuria));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0016, rot: s * 0.17, anim: "play" };
    }
    if (u < 0.83) {
      const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.18);
      return { lift: -0.0016 + Math.abs(hush) * 0.0012, rot: 0.17 + hush * 0.16, anim: "play" };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: -0.0016 * (1 - s), rot: 0.17 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denstube") {
      const pose = denstubePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inktube") {
      const pose = inktubePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densholothuriaPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longholothuriahush";
    const anim =
      k === "longholothuriahush"
        ? "sit"
        : k === "depositfeedsift"
          ? "play"
          : k === "softretractcue"
            ? "sit"
            : k === "cucumberswellshrink"
              ? "sit"
              : k === "tubefootcrawl"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "longholothuriahush" ? "hold" : "go",
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

  function longholothuriahushPose(t) {
    const breath = Math.sin(t * 0.00037) + 0.00011 * Math.sin(t * 0.00105);
    const hush = Math.abs(Math.sin(t * 0.00021));
    return { lift: -0.00018 + hush * 0.00006, rot: 0.0014 + breath * 0.0011 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
  }

  function depositfeedsiftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.depositfeedsift));
    const face = facing == null ? 1 : facing;
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX + face * s * -0.00004, lift: s * -0.0051, rot: s * 0.07 * face, anim: "play" };
    }
    if (u < 0.72) {
      const tuck = Math.sin(((u - 0.22) / 0.5) * Math.PI * 2.1);
      return {
        x: fromX + face * (-0.00004 + tuck * 0.00005),
        lift: -0.0051 + Math.abs(tuck) * 0.0008,
        rot: (0.07 + tuck * 0.05) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { x: fromX + face * -0.00004 * (1 - s), lift: -0.0051 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" };
  }
  function softretractcuePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.softretractcue));
    const face = facing == null ? 1 : facing;
    if (u < 0.28) {
      const s = smoothstep(u / 0.28);
      return { x: fromX + face * s * -0.00005, lift: s * -0.0064, rot: s * 0.04 * face, anim: "sit" };
    }
    if (u < 0.7) {
      const hold = Math.sin(((u - 0.28) / 0.42) * Math.PI);
      return {
        x: fromX + face * -0.00005,
        lift: -0.0064 + hold * 0.0004,
        rot: (0.04 + hold * 0.012) * face,
        anim: "sit",
      };
    }
    if (u < 0.9) {
      const c = smoothstep((u - 0.7) / 0.2);
      return {
        x: fromX + face * -0.00005 * (1 - c),
        lift: -0.0064 * (1 - c),
        rot: 0.04 * (1 - c) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return { x: fromX, lift: 0, rot: 0, anim: "idle" };
  }
  function tubefootcrawlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tubefootcrawl));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00009, lift: s * 0.0026, rot: s * 0.14 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const sway = Math.sin(((u - 0.14) / 0.74) * Math.PI * 2.85);
      return {
        x: fromX + face * (0.00009 + sway * 0.00018),
        lift: 0.0026 + Math.abs(sway) * 0.0019,
        rot: (0.14 + sway * 0.22) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00009 * (1 - s), lift: 0.0026 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" };
  }
  function cucumberswellshrinkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cucumberswellshrink));
    const face = facing == null ? 1 : facing;
    if (u < 0.42) {
      const s = smoothstep(u / 0.42);
      return { x: fromX + face * s * 0.00004, lift: s * 0.0048, rot: s * 0.02 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const s = smoothstep((u - 0.42) / 0.36);
      return {
        x: fromX + face * 0.00004,
        lift: 0.0048 * (1 - s) + (-0.0022) * s,
        rot: (0.02 * (1 - s) + (-0.03) * s) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.00004 * (1 - s), lift: -0.0022 * (1 - s), rot: -0.03 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "depositfeedsift" && trick.kind !== "softretractcue" && trick.kind !== "tubefootcrawl" && trick.kind !== "cucumberswellshrink") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longholothuriahush") {
      if (next.t < LONGHOLOTHURIAHUSH_HOLD) {
        const pose = longholothuriahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGHOLOTHURIAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGHOLOTHURIAHUSH_HOLD);
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
    if (next.kind === "depositfeedsift") {
      const pose = depositfeedsiftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "softretractcue") {
      const pose = softretractcuePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tubefootcrawl") {
      const pose = tubefootcrawlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cucumberswellshrinkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGHOLOTHURIAHUSH_HOLD,
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
    denstubePose,
    inktubePose,
    densholothuriaPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longholothuriahushPose,
    releasePose,
    depositfeedsiftPose,
    softretractcuePose,
    tubefootcrawlPose,
    cucumberswellshrinkPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSeaCucumberTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
