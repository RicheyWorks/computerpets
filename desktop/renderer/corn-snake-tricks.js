/** Saffron ground tricks while idle — ultra-polish pass. House corn snake — scribble / gap / comma / probe / canyon / blotter / pencil personality (mid-sentence blotter life; curious pencil-tray explorer). Scribble S-curve writing without naming write (window-play WRITE owns that); gap curious desk-gap dip without naming hide/nook; comma loose question-mark loaf without naming orb/bun/coil; probe bright tongue chemosense without naming taste/flick/sniff; canyon pencil-tray rim roam without naming inch/strike; blotter mid-sentence blotter pause/blot without naming bask/loaf/settle; pencil pencil-tray climb/peek without naming periscope/loom. Window-play WRITE unchanged — never names `write`. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press. Guest slug Saffron / key corn_snake — accept "corn_snake" and "saffron". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via corn_snake.wav. Thank-yous clause / spice / cord. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `corn-snake-tricks.ts`. True house-corn-snake desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori or *Dragon electrical (Relay/Fuse/Ground) clones. Bird ultra (Soot→Ember) + Miso→Nori done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Bandit / kingsnake + Jade / green_tree_python ultra done; next guest ultra is Bluff / hognose. No cry inventing beyond house corn_snake.wav prefer. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "corn_snake";
  const TRICKS = ["scribble", "gap", "comma", "probe", "canyon", "blotter", "pencil"];
  const HAPPY = ["clause", "spice", "cord"];
  const HAPPY_DUR = { clause: 1.55, spice: 1.62, cord: 1.58 };
  const COMMA_HOLD = 12.8;
  const RELEASE_S = 0.88;
  const DUR = {
    scribble: 1.88,
    gap: 1.82,
    comma: COMMA_HOLD + RELEASE_S,
    probe: 1.76,
    canyon: 1.92,
    blotter: 2.02,
    pencil: 2.1,
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
    if (kind === "comma") return 38 + roll * 24;
    if (kind === "gap" || kind === "probe") return 11 + roll * 8;
    if (kind === "scribble" || kind === "canyon" || kind === "pencil") return 10 + roll * 8;
    if (kind === "blotter") return 12 + roll * 9;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "comma";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter(function (k) { return k !== lastKind; });
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map(function (k) {
      return k === "comma" ? 0.55 : k === "gap" || k === "blotter" || k === "probe" ? 1.15 : 1;
    });
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "comma";
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
    return key === TRICK_KEY || key === "saffron";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter(function (k) { return k !== lastKind; });
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "clause";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "clause" ? "sit" : name === "spice" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function clausePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.clause));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 4.4, rot: s * 14, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      return {
        lift: 4.4 + Math.abs(Math.sin(t * 5.2)) * 2.6,
        rot: 14 + Math.sin(t * 4.4) * 10,
        dx: Math.sin(t * 2.4) * 0.8,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 4.4 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "idle" };
  }

  function spicePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.spice));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 5.6, rot: -s * 16, dx: 0, anim: "talk" };
    }
    if (u < 0.86) {
      const flick = Math.sin(t * 10);
      return {
        lift: 5.6 + Math.abs(flick) * 3.2,
        rot: -16 + flick * 18,
        dx: Math.sin(t * 6) * 1.2,
        anim: "talk",
      };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 5.6 * (1 - s), rot: -16 * (1 - s), dx: 0, anim: "sit" };
  }

  function cordPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 3.4)) * 3.8 + 1.2,
      rot: -14 + Math.sin(t * 3.0) * 12,
      dx: Math.sin(t * 2.4) * 1.4,
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
    let pose;
    if (next.kind === "clause") pose = clausePose(next.t);
    else if (next.kind === "spice") pose = spicePose(next.t);
    else pose = cordPose(next.t);
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
      kind === "comma"
        ? "sit"
        : kind === "gap"
          ? "sit"
          : kind === "probe"
            ? "talk"
            : kind === "scribble"
              ? "play"
              : kind === "canyon"
                ? "play"
                : kind === "blotter"
                  ? "talk"
                  : kind === "pencil"
                    ? "play"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "comma" ? "hold" : "go",
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

  function commaPose(t) {
    return {
      lift: 2.2 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
      rot: -18 + Math.sin(t * 2.4) * 22 + Math.sin(t * 4.6) * 12,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (2.2 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -18 * (1 - u) };
  }

  function scribblePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scribble));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.8, rot: s * 16 * facing, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const wave = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * (Math.abs(wave) * 8.5 + s * 2.2),
        lift: 2.8 + Math.abs(wave) * 7.2,
        rot: facing * (16 + wave * 32),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 6.0,
      lift: 2.8 * (1 - s),
      rot: facing * 8 * (1 - s),
      anim: "sit",
    };
  }

  function gapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gap));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4.6, rot: s * -18 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      const tuck = Math.abs(Math.sin(s * Math.PI * 1.6));
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.6,
        lift: 4.6 + tuck * 4.2,
        rot: facing * (-18 - tuck * 16),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 4.6 * (1 - s),
      rot: facing * -9 * (1 - s),
      anim: "sit",
    };
  }

  function probePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.probe));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 3.8, rot: s * 12 * facing, anim: "talk" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const flick = Math.sin(s * Math.PI * 6.5);
      return {
        x: fromX + facing * flick * 1.8,
        lift: 3.8 + Math.abs(flick) * 5.5,
        rot: facing * (12 + flick * 22),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 3.8 * (1 - s),
      rot: facing * 6 * (1 - s),
      anim: "sit",
    };
  }

  function canyonPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.canyon));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 5.0, rot: -s * 14 * facing, anim: "play" };
    }
    if (u < 0.5) {
      const s = (u - 0.14) / 0.36;
      return {
        x: fromX + facing * smoothstep(s) * 8.5,
        lift: 5.0 + Math.sin(s * Math.PI) * 4.8,
        rot: facing * (-14 + s * 28),
        anim: "play",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.5) / 0.32;
      const home = smoothstep(s);
      return {
        x: fromX + facing * (8.5 * (1 - home)),
        lift: 5.0 * (1 - home * 0.45) + Math.sin(s * Math.PI) * 2.2,
        rot: facing * (14 - home * 20),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 5.0 * 0.55 * (1 - s),
      rot: facing * -4 * (1 - s),
      anim: "sit",
    };
  }

  function blotterPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.blotter));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4.8, rot: s * 20 * facing, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      const blot = Math.abs(Math.sin(s * Math.PI * 2.8));
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.4,
        lift: 4.8 + blot * 5.2,
        rot: facing * (20 + blot * 18),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 4.8 * (1 - s),
      rot: facing * 10 * (1 - s),
      anim: "sit",
    };
  }

  function pencilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pencil));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.8, rot: s * 16 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const sway = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * (Math.abs(sway) * 8.5 + s * 2.2),
        lift: 2.8 + Math.abs(sway) * 7.2,
        rot: facing * (16 + sway * 32),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 6.0,
      lift: 2.8 * (1 - s),
      rot: facing * 8 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "scribble" && trick.kind !== "canyon" && trick.kind !== "pencil") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "comma") {
      if (next.t < COMMA_HOLD) {
        const pose = commaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < COMMA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - COMMA_HOLD);
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
    let pose;
    if (next.kind === "scribble") pose = scribblePose(next.t, from, trick.facing);
    else if (next.kind === "gap") pose = gapPose(next.t, from, trick.facing);
    else if (next.kind === "probe") pose = probePose(next.t, from, trick.facing);
    else if (next.kind === "canyon") pose = canyonPose(next.t, from, trick.facing);
    else if (next.kind === "blotter") pose = blotterPose(next.t, from, trick.facing);
    else pose = pencilPose(next.t, from, trick.facing);
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
    DUR,
    COMMA_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    commaPose,
    releasePose,
    scribblePose,
    gapPose,
    probePose,
    canyonPose,
    blotterPose,
    pencilPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    clausePose,
    spicePose,
    cordPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCornSnakeTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
