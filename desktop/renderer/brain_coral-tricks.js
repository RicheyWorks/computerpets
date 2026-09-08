/** Ridge ground tricks while idle. House neighborly boulder brain coral (Diploria labyrinthiformis / Mussidae) desk life -- meandroid ridge pulse / polyp tentacle wave / mucus sheet settle / day-expand night-contract / long diploria hush; NOT Gum koala; NOT Still/Gaze; NOT sea star Cling; NOT Coral milk_snake; NOT Rui; guest slug Ridge / key brain_coral -- accept brain_coral and ridge; Thank-yous densridge / inkridge / densdiploria. Sleep, hide, leave, rest, card, ribbon still win. Same map as web brain_coral-tricks.ts. Next: Wreath / anemone. Catalog 220. */
(function (root) {
  const TRICK_KEY = "brain_coral";
  const TRICKS = ["meandroidridgepulse", "polyptentaclewave", "mucussheetsettle", "dayexpandnightcontract", "diploriahush"];
  const HAPPY = ["densridge", "inkridge", "densdiploria"];
  const HAPPY_DUR = { densridge: 2.78, inkridge: 2.94, densdiploria: 2.63 };
  const DIPLORIAHUSH_HOLD = 34.22;
  const RELEASE_S = 2.61;
  const DUR = { diploriahush: DIPLORIAHUSH_HOLD + RELEASE_S, meandroidridgepulse: 5.48, polyptentaclewave: 5.64, mucussheetsettle: 5.31, dayexpandnightcontract: 5.91 };

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
    if (kind === "diploriahush") return 218 + roll * 26;
    if (kind === "polyptentaclewave") return 27.1 + roll * 3.5;
    if (kind === "dayexpandnightcontract") return 25.8 + roll * 3.6;
    if (kind === "meandroidridgepulse") return 24.2 + roll * 3.3;
    if (kind === "mucussheetsettle") return 25.4 + roll * 3.4;
    return justFinished ? 19.1 + roll * 3.0 : 14.2 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "diploriahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "diploriahush") {
      if (roll < 0.26) return "polyptentaclewave";
      if (roll < 0.5) return "dayexpandnightcontract";
      if (roll < 0.74) return "meandroidridgepulse";
      return "mucussheetsettle";
    }
    if (lastKind === "polyptentaclewave") {
      if (roll < 0.26) return "diploriahush";
      if (roll < 0.5) return "dayexpandnightcontract";
      if (roll < 0.74) return "meandroidridgepulse";
      return "mucussheetsettle";
    }
    if (lastKind === "dayexpandnightcontract") {
      if (roll < 0.22) return "diploriahush";
      if (roll < 0.44) return "polyptentaclewave";
      if (roll < 0.68) return "meandroidridgepulse";
      return "mucussheetsettle";
    }
    if (roll < 0.2) return "diploriahush";
    if (roll < 0.4) return "polyptentaclewave";
    if (roll < 0.6) return "dayexpandnightcontract";
    if (roll < 0.8) return "meandroidridgepulse";
    return "mucussheetsettle";
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
    return key === TRICK_KEY || key === "ridge";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densridge";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densridge" ? "sit" : name === "inkridge" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densridgePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densridge));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0034, rot: s * -0.22, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.22);
      return { lift: 0.0034 + Math.abs(sway) * 0.0009, rot: -0.22 + sway * 0.16, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0034 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }
  function inkridgePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkridge));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0035, rot: s * 0.26, anim: "play" };
    }
    if (u < 0.82) {
      const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.12);
      return { lift: 0.0035 + Math.abs(arc) * 0.0020, rot: 0.26 + arc * 0.28, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0035 * (1 - s), rot: 0.26 * (1 - s), anim: "idle" };
  }
  function densdiploriaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densdiploria));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0016, rot: s * 0.17, anim: "play" };
    }
    if (u < 0.83) {
      const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.05);
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
    if (next.kind === "densridge") {
      const pose = densridgePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkridge") {
      const pose = inkridgePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densdiploriaPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "diploriahush";
    const anim =
      k === "diploriahush"
        ? "sit"
        : k === "polyptentaclewave"
          ? "play"
          : k === "dayexpandnightcontract"
            ? "sit"
            : k === "mucussheetsettle"
              ? "sit"
              : k === "meandroidridgepulse"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "diploriahush" ? "hold" : "go",
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

  function diploriahushPose(t) {
    const breath = Math.sin(t * 0.00041) + 0.00014 * Math.sin(t * 0.00118);
    const hush = Math.abs(Math.sin(t * 0.00019));
    return { lift: -0.00022 + hush * 0.00005, rot: 0.0011 + breath * 0.0009 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0028 * (1 - u) };
  }

  function polyptentaclewavePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.polyptentaclewave));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00008, lift: s * 0.0022, rot: s * 0.11 * face, anim: "play" };
    }
    if (u < 0.84) {
      const wave = Math.sin(((u - 0.18) / 0.66) * Math.PI * 3.4);
      return {
        x: fromX + face * (0.00005 + wave * 0.00018),
        lift: 0.0022 + Math.abs(wave) * 0.0016,
        rot: (0.11 + wave * 0.19) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00008 * (1 - s), lift: 0.0022 * (1 - s), rot: 0.11 * (1 - s) * face, anim: "idle" };
  }
  function dayexpandnightcontractPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dayexpandnightcontract));
    const face = facing == null ? 1 : facing;
    if (u < 0.28) {
      const s = smoothstep(u / 0.28);
      return { x: fromX + face * s * 0.00012, lift: s * 0.0068, rot: s * 0.04 * face, anim: "sit" };
    }
    if (u < 0.62) {
      const hold = Math.sin(((u - 0.28) / 0.34) * Math.PI);
      return {
        x: fromX + face * 0.00012,
        lift: 0.0068 + hold * 0.0006,
        rot: (0.04 + hold * 0.02) * face,
        anim: "sit",
      };
    }
    if (u < 0.88) {
      const c = smoothstep((u - 0.62) / 0.26);
      return {
        x: fromX + face * 0.00012 * (1 - c * 0.4),
        lift: 0.0068 * (1 - c) + (-0.0024) * c,
        rot: (0.04 * (1 - c) - 0.08 * c) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00007 * (1 - s), lift: -0.0024 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" };
  }
  function meandroidridgepulsePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.meandroidridgepulse));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.0001, lift: s * 0.0018, rot: s * 0.08 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const pulse = Math.sin(((u - 0.16) / 0.7) * Math.PI * 2.6);
      return {
        x: fromX + face * (0.0001 + pulse * 0.00012),
        lift: 0.0018 + Math.abs(pulse) * 0.0024,
        rot: (0.08 + pulse * 0.09) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0001 * (1 - s), lift: 0.0018 * (1 - s), rot: 0.08 * (1 - s) * face, anim: "idle" };
  }
  function mucussheetsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mucussheetsettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX + face * s * -0.00005, lift: s * -0.0036, rot: s * 0.06 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const sheet = Math.sin(((u - 0.2) / 0.6) * Math.PI * 1.4);
      return {
        x: fromX + face * (-0.00005 + sheet * 0.00004),
        lift: -0.0036 + Math.abs(sheet) * 0.0007,
        rot: (0.06 + sheet * 0.04) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return { x: fromX + face * -0.00005 * (1 - s), lift: -0.0036 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "polyptentaclewave" && trick.kind !== "dayexpandnightcontract" && trick.kind !== "meandroidridgepulse" && trick.kind !== "mucussheetsettle") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "diploriahush") {
      if (next.t < DIPLORIAHUSH_HOLD) {
        const pose = diploriahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DIPLORIAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DIPLORIAHUSH_HOLD);
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
    if (next.kind === "polyptentaclewave") {
      const pose = polyptentaclewavePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dayexpandnightcontract") {
      const pose = dayexpandnightcontractPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "meandroidridgepulse") {
      const pose = meandroidridgepulsePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = mucussheetsettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    DIPLORIAHUSH_HOLD,
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
    densridgePose,
    inkridgePose,
    densdiploriaPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    diploriahushPose,
    releasePose,
    polyptentaclewavePose,
    dayexpandnightcontractPose,
    meandroidridgepulsePose,
    mucussheetsettlePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBrainCoralTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
