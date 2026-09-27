/** Saffron ground tricks while idle — ultra-polish pass. House corn snake — scribble / gap / comma / probe / canyon / blotter / pencil personality (mid-sentence blotter life; curious pencil-tray explorer). Scribble S-curve writing without naming write (window-play WRITE owns that); gap curious desk-gap dip without naming hide/nook; comma loose question-mark loaf without naming orb/bun/coil; probe bright tongue chemosense without naming taste/flick/sniff; canyon pencil-tray rim roam without naming inch/strike; blotter mid-sentence blotter pause/blot without naming bask/loaf/settle; pencil pencil-tray climb/peek without naming periscope/loom. Window-play WRITE unchanged — never names `write`. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press. Guest slug Saffron / key corn_snake — accept "corn_snake" and "saffron". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via corn_snake.wav. Thank-yous clause / spice / cord. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `corn-snake-tricks.ts`. True house-corn-snake desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori or *Dragon electrical (Relay/Fuse/Ground) clones. Bird ultra (Soot→Ember) + Miso→Nori done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. prefersHouseCry via corn_snake.wav. Amplitudes raised toward Rui richness; denser waits/weights (COMMA_HOLD=11.2 RELEASE_S=1.18). Bandit densified. Jade densified. Bluff densified. Sash densified. Lula densified. Coral densified. Blush densified. Atlas densified. Cup densified. Sepia densified. Chamber densified. Pulse densified. Ochre densified. Tenant densified. Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "corn_snake";
  const TRICKS = ["scribble", "gap", "comma", "probe", "canyon", "blotter", "pencil"];
  const HAPPY = ["clause", "spice", "cord"];
  const HAPPY_DUR = { clause: 1.58, spice: 1.66, cord: 1.72 };
  const COMMA_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    scribble: 2.18,
    gap: 2.12,
    comma: COMMA_HOLD + RELEASE_S,
    probe: 2.05,
    canyon: 2.18,
    blotter: 2.28,
    pencil: 2.34,
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
    if (kind === "comma") return 40 + roll * 26;
    if (kind === "gap" || kind === "probe" || kind === "blotter") return 12.8 + roll * 9.4;
    if (kind === "scribble" || kind === "canyon" || kind === "pencil") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "comma";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter(function (k) { return k !== lastKind; });
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map(function (k) {
      return k === "comma" ? 0.72 : k === "gap" || k === "blotter" || k === "probe" ? 1.28 : k === "scribble" || k === "canyon" ? 1.18 : 1.08;
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
      return { lift: s * 5.28, rot: s * 16.8, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      return {
        lift: 5.28 + Math.abs(Math.sin(t * 5.2)) * 3.12,
        rot: 16.8 + Math.sin(t * 4.4) * 12,
        dx: Math.sin(t * 2.4) * 0.96,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 5.28 * (1 - s), rot: 16.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function spicePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.spice));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 6.72, rot: -s * 19.2, dx: 0, anim: "talk" };
    }
    if (u < 0.86) {
      const flick = Math.sin(t * 10);
      return {
        lift: 6.72 + Math.abs(flick) * 3.84,
        rot: -19.2 + flick * 21.6,
        dx: Math.sin(t * 6) * 1.44,
        anim: "talk",
      };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 6.72 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "sit" };
  }

  function cordPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 3.4)) * 4.56 + 1.44,
      rot: -16.8 + Math.sin(t * 3.0) * 14.4,
      dx: Math.sin(t * 2.4) * 1.68,
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
      lift: 2.64 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
      rot: -21.6 + Math.sin(t * 2.4) * 26.4 + Math.sin(t * 4.6) * 14.4,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (2.64 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -21.6 * (1 - u) };
  }

  function scribblePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scribble));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.36, rot: s * 19.2 * facing, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const wave = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * (Math.abs(wave) * 10.2 + s * 2.64),
        lift: 3.36 + Math.abs(wave) * 8.64,
        rot: facing * (19.2 + wave * 38.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 7.2,
      lift: 3.36 * (1 - s),
      rot: facing * 9.6 * (1 - s),
      anim: "sit",
    };
  }

  function gapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gap));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 5.52, rot: s * -21.6 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      const tuck = Math.abs(Math.sin(s * Math.PI * 1.6));
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.92,
        lift: 5.52 + tuck * 5.04,
        rot: facing * (-21.6 - tuck * 19.2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 5.52 * (1 - s),
      rot: facing * -10.8 * (1 - s),
      anim: "sit",
    };
  }

  function probePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.probe));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 4.56, rot: s * 14.4 * facing, anim: "talk" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const flick = Math.sin(s * Math.PI * 6.5);
      return {
        x: fromX + facing * flick * 2.16,
        lift: 4.56 + Math.abs(flick) * 6.6,
        rot: facing * (14.4 + flick * 26.4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 4.56 * (1 - s),
      rot: facing * 7.2 * (1 - s),
      anim: "sit",
    };
  }

  function canyonPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.canyon));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 6.0, rot: -s * 16.8 * facing, anim: "play" };
    }
    if (u < 0.5) {
      const s = (u - 0.14) / 0.36;
      return {
        x: fromX + facing * smoothstep(s) * 10.2,
        lift: 6.0 + Math.sin(s * Math.PI) * 5.76,
        rot: facing * (-16.8 + s * 33.6),
        anim: "play",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.5) / 0.32;
      const home = smoothstep(s);
      return {
        x: fromX + facing * (10.2 * (1 - home)),
        lift: 6.0 * (1 - home * 0.45) + Math.sin(s * Math.PI) * 2.64,
        rot: facing * (16.8 - home * 24),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 6.0 * 0.55 * (1 - s),
      rot: facing * -4.8 * (1 - s),
      anim: "sit",
    };
  }

  function blotterPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.blotter));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 5.76, rot: s * 24 * facing, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      const blot = Math.abs(Math.sin(s * Math.PI * 2.8));
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.68,
        lift: 5.76 + blot * 6.24,
        rot: facing * (24 + blot * 21.6),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 5.76 * (1 - s),
      rot: facing * 12 * (1 - s),
      anim: "sit",
    };
  }

  function pencilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pencil));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.36, rot: s * 19.2 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const sway = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * (Math.abs(sway) * 10.2 + s * 2.64),
        lift: 3.36 + Math.abs(sway) * 8.64,
        rot: facing * (19.2 + sway * 38.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 7.2,
      lift: 3.36 * (1 - s),
      rot: facing * 9.6 * (1 - s),
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
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : /** @type {any} */ (this));
