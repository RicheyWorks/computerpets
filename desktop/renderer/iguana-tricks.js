/** Sol ground tricks while idle — ultra-polish pass. House iguana — sun / dewlap / nod / press / flick / sneeze / lash personality (Iguana iguana desk life). Sun thermoregulation sprawl without naming bask/flatten (window-play owns those); dewlap throat-fan without naming fan/frill; nod head-bob signal without naming bob thank-you or budgie bobble; press push-up display without naming zoom; flick tongue-flick chemoreception without naming sniff/gulp; sneeze salt-gland sneeze without naming huff/cough; lash tail-lash warning without naming whip/crack/switch. Window-play FLATTEN unchanged — never names a trick `flatten`. Window-play BASK stays untouched — never names `bask`. Guest slug Sol / key iguana — accept "iguana" and "sol". Amplitudes raised toward Rui richness; denser waits/weights; no house cry invent (no iguana.wav — skip prefersHouseCry). Thank-yous swell / tap / ease. Same map as web `iguana-tricks.ts`. Next guest ultra is Vesper / dragon (skip Ember if bird). Never retouch Rui sprites.  no iguana.wav so prefersHouseCry stays skipped. Amplitudes raised toward Rui richness; denser waits/weights (SUN_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */

(function (root) {
  const TRICK_KEY = "iguana";
  const TRICKS = ["sun", "dewlap", "nod", "press", "flick", "sneeze", "lash"];
  const HAPPY = ["swell", "tap", "ease"];
  const HAPPY_DUR = { swell: 1.55, tap: 1.62, ease: 1.58 };
  const SUN_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    sun: SUN_HOLD + RELEASE_S,
    dewlap: 1.82,
    nod: 1.76,
    press: 1.88,
    flick: 1.72,
    sneeze: 2.02,
    lash: 2.1,
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
    if (kind === "sun") return 40 + roll * 26;
    if (kind === "dewlap" || kind === "sneeze" || kind === "press") return 12.8 + roll * 9.4;
    if (kind === "nod" || kind === "flick" || kind === "lash") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "sun";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "sun" ? 0.72 : k === "dewlap" || k === "sneeze" || k === "press" ? 1.28 : k === "nod" || k === "flick" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "sun";
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
    return key === TRICK_KEY || key === "sol";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "swell";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "swell" ? "sit" : name === "tap" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function swellPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.swell));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 5.3, rot: s * 16.8, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      return {
        lift: 5.3 + Math.abs(Math.sin(t * 5.2)) * 3.1,
        rot: 16.8 + Math.sin(t * 4.4) * 12,
        dx: 0,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 5.3 * (1 - s), rot: 16.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function tapPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tap));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 6.7, rot: -s * 19.2, dx: 0, anim: "talk" };
    }
    if (u < 0.86) {
      return {
        lift: 6.7 + Math.abs(Math.sin(t * 10)) * 3.8,
        rot: -19.2 + Math.sin(t * 12) * 21.6,
        dx: Math.sin(t * 6) * 1.4,
        anim: "talk",
      };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 6.7 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "sit" };
  }

  function easePose(t) {
    return {
      lift: Math.abs(Math.sin(t * 3.4)) * 4.6 + 1.4,
      rot: Math.sin(t * 3.0) * 14.4,
      dx: Math.sin(t * 2.4) * 1.7,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "swell") {
      const pose = swellPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tap") {
      const pose = tapPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = easePose(next.t);
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
      kind === "sun"
        ? "sit"
        : kind === "dewlap"
          ? "sit"
          : kind === "nod"
            ? "talk"
            : kind === "press"
              ? "play"
              : kind === "flick"
                ? "sit"
                : kind === "sneeze"
                  ? "sit"
                  : kind === "lash"
                    ? "play"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "sun" ? "hold" : "go",
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

  function sunPose(t) {
    return {
      lift: 2.6 + Math.sin(t * 1.7) * 3.4 + Math.abs(Math.sin(t * 3.4)) * 1.9,
      rot: 21.6 + Math.sin(t * 2.4) * 26.4 + Math.sin(t * 4.6) * 14.4,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (2.6 + 3.4) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 21.6 * (1 - u) };
  }

  function dewlapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dewlap));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 5.5, rot: s * 21.6 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.9,
        lift: 5.5 + Math.abs(Math.sin(s * Math.PI * 2.4)) * 5.0,
        rot: facing * (21.6 + Math.sin(s * Math.PI * 2.8) * 19.2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 5.5 * (1 - s),
      rot: facing * 10.8 * (1 - s),
      anim: "sit",
    };
  }

  function nodPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nod));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 4.1, rot: -s * 16.8 * facing, anim: "talk" };
    }
    if (u < 0.9) {
      const s = (u - 0.1) / 0.8;
      const bob = Math.sin(s * Math.PI * 5.2);
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.4,
        lift: 4.1 + Math.abs(bob) * 9.0,
        rot: facing * (-16.8 + bob * 33.6),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return {
      x: fromX,
      lift: 4.1 * (1 - s),
      rot: facing * -8.4 * (1 - s),
      anim: "sit",
    };
  }

  function pressPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.press));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 5.8, rot: -s * 12 * facing, anim: "sit" };
    }
    if (u < 0.9) {
      const s = (u - 0.1) / 0.8;
      const pump = Math.abs(Math.sin(s * Math.PI * 3.8));
      return {
        x: fromX + facing * Math.sin(s * Math.PI * 1.5) * 2.6,
        lift: 5.8 + pump * 11.0,
        rot: facing * (-12 + pump * 21.6),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return {
      x: fromX,
      lift: 5.8 * (1 - s),
      rot: facing * -6 * (1 - s),
      anim: "sit",
    };
  }

  function flickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.flick));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: -s * 4.6, rot: s * 26.4 * facing, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const tick = Math.abs(Math.sin(s * Math.PI * 4.4));
      return {
        x: fromX + facing * (7.8 * smoothstep(s) + tick * 2.2),
        lift: -4.6 + tick * 6.6,
        rot: facing * (26.4 + tick * 16.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * 7.8,
      lift: -4.6 * (1 - s),
      rot: facing * 13.2 * (1 - s),
      anim: "sit",
    };
  }

  function sneezePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sneeze));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4.3, rot: -s * 14.4 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.14) / 0.74;
      const burst = Math.sin(s * Math.PI * 4.6);
      return {
        x: fromX + facing * Math.abs(burst) * 2.9,
        lift: 4.3 + Math.abs(burst) * 10.6,
        rot: facing * (-14.4 + burst * 31.2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 4.3 * (1 - s),
      rot: facing * -7.2 * (1 - s),
      anim: "sit",
    };
  }

  function lashPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lash));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.4, rot: s * 19.2 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const swing = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * swing * 10.2,
        lift: 3.4 + Math.abs(swing) * 8.6,
        rot: facing * (19.2 + swing * 38.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 3.4 * (1 - s),
      rot: facing * 9.6 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "press" && trick.kind !== "flick" && trick.kind !== "lash") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "sun") {
      if (next.t < SUN_HOLD) {
        const pose = sunPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SUN_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SUN_HOLD);
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
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    let pose;
    if (next.kind === "dewlap") pose = dewlapPose(next.t, fromX, trick.facing);
    else if (next.kind === "nod") pose = nodPose(next.t, fromX, trick.facing);
    else if (next.kind === "press") pose = pressPose(next.t, fromX, trick.facing);
    else if (next.kind === "flick") pose = flickPose(next.t, fromX, trick.facing);
    else if (next.kind === "sneeze") pose = sneezePose(next.t, fromX, trick.facing);
    else pose = lashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
    if (u >= 1) {
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    SUN_HOLD,
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
    swellPose,
    tapPose,
    easePose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    sunPose,
    releasePose,
    dewlapPose,
    nodPose,
    pressPose,
    flickPose,
    sneezePose,
    lashPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetIguanaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
