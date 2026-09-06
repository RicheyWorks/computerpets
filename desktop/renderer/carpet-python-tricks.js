/** Atlas ground tricks while idle. House carpet python — legend / rung / contour / runner / bearing personality (map/carpet climb desk life; chart-shelf cartographer, not Nori ball-bun or Jade lamp-arm jewelry or Blush desert pebble). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `carpet-python-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play CHART unchanged — never names `chart`. Nori owns orb/taste/unroll; Jade owns bracelet/jewel/bough; Blush owns pebble/mesa; Sol owns flick; Ember owns settle; Saffron owns scribble/comma; Bandit owns stripe/verdict; Bluff owns hood/gape/encore; Sash owns seam/moss/lap; Lula owns pour/oxbow/bank; Coral owns rhyme/tile; budgie owns mimic; parrot owns flash; Burr owns root; turtle owns tuck; Coin owns flare; Thimble owns dig; Fox window owns scent; rosy_boa window owns stone; carpet_python window owns chart. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "carpet_python";
  const TRICKS = ["legend", "rung", "contour", "runner", "bearing"];
  const HAPPY = ["survey", "gazette", "shelf"];
  const HAPPY_DUR = { survey: 1.22, gazette: 1.28, shelf: 1.34 };
  const LEGEND_HOLD = 10.4;
  const RELEASE_S = 0.6;
  const DUR = { legend: LEGEND_HOLD + RELEASE_S, rung: 1.44, contour: 1.48, runner: 1.56, bearing: 1.3 };

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
    if (kind === "legend") return 48 + roll * 28;
    if (kind === "rung") return 16 + roll * 11;
    if (kind === "contour") return 15 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "legend";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "legend") {
      if (roll < 0.28) return "rung";
      if (roll < 0.5) return "contour";
      if (roll < 0.72) return "runner";
      return "bearing";
    }
    if (lastKind === "rung") {
      if (roll < 0.3) return "legend";
      if (roll < 0.52) return "contour";
      if (roll < 0.74) return "runner";
      return "bearing";
    }
    if (lastKind === "contour") {
      if (roll < 0.24) return "legend";
      if (roll < 0.46) return "rung";
      if (roll < 0.68) return "runner";
      return "bearing";
    }
    if (roll < 0.22) return "legend";
    if (roll < 0.42) return "rung";
    if (roll < 0.6) return "contour";
    if (roll < 0.8) return "runner";
    return "bearing";
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
    return key === TRICK_KEY || key === "atlas";
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "survey";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "survey" ? "sit" : name === "gazette" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function surveyPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.survey));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 1.2, rot: s * -4.5, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const scan = Math.abs(Math.sin(t * 2.6));
      return {
        lift: 1.2 - scan * 0.35,
        rot: -4.5 + scan * 4,
        dx: Math.sin(t * 1.15) * 0.16,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.9 * (1 - s), rot: -2.5 * (1 - s), dx: 0, anim: "idle" };
  }

  function gazettePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gazette));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 1.45, rot: s * 6.5, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      const nod = Math.sin(t * 2.35);
      return {
        lift: 1.45 + Math.abs(nod) * 0.3,
        rot: 6.5 + nod * 5,
        dx: nod * 0.2,
        anim: "sit",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 1.45 * (1 - s), rot: 6.5 * (1 - s), dx: 0, anim: "sit" };
  }

  function shelfPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 1.65)) * 0.85 + 1.0,
      rot: -3.5 + Math.sin(t * 2.05) * 5.4,
      dx: Math.sin(t * 1.25) * 0.26,
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
    if (next.kind === "survey") {
      const pose = surveyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gazette") {
      const pose = gazettePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = shelfPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame() {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "legend"
        ? "sit"
        : kind === "rung"
          ? "walk"
          : kind === "contour"
            ? "walk"
            : kind === "runner"
              ? "walk"
              : kind === "bearing"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "legend" ? "hold" : "go",
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

  function legendPose(t) {
    const beat = Math.sin(t * 0.92) + 0.32 * Math.sin(t * 2.55);
    return {
      lift: 0.52 + Math.abs(Math.sin(t * 0.68)) * 0.15,
      rot: -2.8 + beat * 3.0,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.52 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -2.8 * (1 - u) };
  }

  function rungPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rung));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 0.6, lift: s * 0.7, rot: s * 8 * facing, anim: "walk" };
    }
    if (u < 0.42) {
      const s = (u - 0.12) / 0.3;
      return {
        x: fromX + facing * (0.6 + smoothstep(s) * 0.4),
        lift: 0.7 + smoothstep(s) * 2.4,
        rot: facing * (8 - s * 6),
        anim: "play",
      };
    }
    if (u < 0.72) {
      const s = (u - 0.42) / 0.3;
      const sway = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * (1.0 + sway * 0.18),
        lift: 3.1 + Math.abs(sway) * 0.2,
        rot: facing * (2 + sway * 5),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * (1.0 * (1 - s)),
      lift: 3.1 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "walk",
    };
  }

  function contourPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.contour));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 0.8, lift: s * 0.55, rot: s * 7 * facing, anim: "walk" };
    }
    if (u < 0.7) {
      const s = (u - 0.12) / 0.58;
      const wave = Math.sin(s * Math.PI * 2.6);
      return {
        x: fromX + facing * (0.8 + s * 3.6),
        lift: 0.55 + Math.abs(wave) * 0.55,
        rot: facing * (7 + wave * 11),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX + facing * (4.4 * (1 - s)),
      lift: 0.7 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }

  function runnerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.runner));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 1.1, lift: s * 0.5, rot: s * 5 * facing, anim: "walk" };
    }
    if (u < 0.48) {
      const s = (u - 0.12) / 0.36;
      const step = Math.floor(s * 3);
      const local = (s * 3) % 1;
      return {
        x: fromX + facing * (1.1 + step * 1.35 + smoothstep(local) * 1.35),
        lift: 0.5 + Math.sin(local * Math.PI) * 0.35,
        rot: facing * (5 + Math.sin(local * Math.PI) * 7),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const nap = Math.abs(Math.sin(s * Math.PI * 1.8));
      return {
        x: fromX + facing * 5.15,
        lift: 0.22 + nap * 0.12,
        rot: facing * (-3 + nap * 2.5),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * (5.15 * (1 - s)),
      lift: 0.3 * (1 - s),
      rot: facing * (-1.5 * (1 - s)),
      anim: "idle",
    };
  }

  function bearingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bearing));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 1.4, rot: s * 12 * facing, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.14) / 0.58;
      const tick = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * tick * 0.22,
        lift: 1.4 - s * 0.35 + Math.abs(tick) * 0.18,
        rot: facing * (12 - s * 16 + tick * 3.5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 1.1 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "runner" && trick.kind !== "rung" && trick.kind !== "contour") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "legend") {
      if (next.t < LEGEND_HOLD) {
        const pose = legendPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LEGEND_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LEGEND_HOLD);
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
    if (next.kind === "rung") {
      const pose = rungPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "contour") {
      const pose = contourPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "runner") {
      const pose = runnerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bearingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LEGEND_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    legendPose,
    releasePose,
    rungPose,
    contourPose,
    runnerPose,
    bearingPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    surveyPose,
    gazettePose,
    shelfPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCarpetPythonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
