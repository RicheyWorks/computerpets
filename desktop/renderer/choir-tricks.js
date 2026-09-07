/** Choir ground tricks while idle. House neighborly alien chord-body CHORD life — polyphony / partial / timbre / resonance / harmonia personality (many-notes-in-one-body settle on blotter air — never named chord or choir or overtone or pulse or drone as trick kinds; window-play CHORD + ethogram chord-pulse/chord/still/overtone/pulse + trait talk Chord own those words; Hum window owns DRONE — never name drone; Pulse is also the moon_jelly guest — never name a trick pulse; guest slug Choir only for isKey matching — accept "choir"; do NOT name a trick "choir") — not Gleam photon/wavelength/lumen/glass/photovore lamp-drinker, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/rosette/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/band/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/veil/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern; never named chord (window-play CHORD — never a trick kind) / choir (guest slug + TRICK_KEY only — do NOT name a trick choir) / overtone (ethogram — never a trick kind) / pulse (ethogram + Pulse guest — never a trick kind) / drone (Hum window DRONE — never a trick kind) / still (ethogram) / thirst (Gleam window) / drink (Gleam ethogram) / hover (ethogram + Sepia) / gleam (Ground happy + Gleam guest) / shine (Ember) / glint (Coin) / sheen (Sheen + Disk) / dig (Thimble) / nest (Clip) / bank (Lula + Bank) / buzz (Relay) / dance (Rui) / plaque (Pact) / share (Pact) / bloom (Starter) / loaf / photon / wavelength / lumen / glass / actinic / lux / candela — Echo/Quill are birds with sound — do not copy their tricks. polyphony many-notes-in-one-body settle on blotter air, partial harmonic partial tip, timbre timbre-body color settle, resonance resonate hush across the blotter, harmonia long hold desk life as chord body (not Gleam lamp-drinker, not Pulse jelly) with diapason / motet / canticle cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play CHORD do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop choir-tricks.js. Window-play CHORD unchanged — never names chord. Ethogram chord-pulse/chord/still/overtone/pulse unchanged — never names overtone or pulse as trick kinds. True alien chord-body blotter-air desk life only — one animal, many notes. Drift owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "choir";
  const TRICKS = ["polyphony", "partial", "timbre", "resonance", "harmonia"];
  const HAPPY = ["diapason", "motet", "canticle"];
  const HAPPY_DUR = { diapason: 1.59, motet: 1.65, canticle: 1.71 };
  const HARMONIA_HOLD = 16.71;
  const RELEASE_S = 0.98;
  const DUR = { harmonia: HARMONIA_HOLD + RELEASE_S, polyphony: 2.11, partial: 2.23, timbre: 1.87, resonance: 1.99 };

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
      if (kind === "harmonia") return 65 + roll * 41;
  if (kind === "polyphony") return 17.2 + roll * 12.8;
  if (kind === "partial") return 21.3 + roll * 13.8;
  if (kind === "timbre") return 18.2 + roll * 14.9;
  return justFinished ? 12.8 + roll * 10.1 : 7.3 + roll * 8.7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "harmonia";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "harmonia") {
      if (roll < 0.26) return "polyphony";
      if (roll < 0.5) return "partial";
      if (roll < 0.74) return "resonance";
      return "timbre";
    }
    if (lastKind === "polyphony") {
      if (roll < 0.26) return "harmonia";
      if (roll < 0.5) return "partial";
      if (roll < 0.74) return "resonance";
      return "timbre";
    }
    if (lastKind === "partial") {
      if (roll < 0.22) return "harmonia";
      if (roll < 0.44) return "polyphony";
      if (roll < 0.68) return "resonance";
      return "timbre";
    }
    if (roll < 0.2) return "harmonia";
    if (roll < 0.4) return "polyphony";
    if (roll < 0.6) return "partial";
    if (roll < 0.8) return "resonance";
    return "timbre";
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
    return key === TRICK_KEY;
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "diapason";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "diapason" ? "talk" : name === "motet" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function diapasonPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.diapason));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.055, rot: s * 3.45, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 13.8) + 0.32 * Math.sin(t * 27.2);
      return {
        lift: 0.055 + Math.abs(tick) * 0.023,
        rot: 3.45 + tick * 2.38,
        dx: tick * 0.0024,
        anim: "talk",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.022 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "idle" };
  }
  function motetPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.motet));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.071, rot: s * -4.25, dx: s * 0.003, anim: "play" };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 6.8) + 0.30 * Math.sin(t * 13.0);
      return {
        lift: 0.071 + Math.abs(flash) * 0.031,
        rot: -4.25 + flash * 5.05,
        dx: flash * 0.0048,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.024 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "sit" };
  }
  function canticlePose(t) {
    return {
      lift: 0.014 + Math.abs(Math.sin(t * 0.46)) * 0.013,
      rot: Math.sin(t * 0.54) * 1.20,
      dx: Math.sin(t * 0.34) * 0.0023,
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
    if (next.kind === "diapason") {
      const pose = diapasonPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "motet") {
      const pose = motetPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = canticlePose(next.t);
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
      kind === "harmonia"
    ? "sit"
    : kind === "polyphony"
      ? "play"
      : kind === "partial"
        ? "talk"
        : kind === "resonance"
          ? "talk"
          : kind === "timbre"
            ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "harmonia" ? "hold" : "go",
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


  function harmoniaPose(t) {
    const breath = Math.sin(t * 0.21) + 0.063 * Math.sin(t * 0.56);
    const grit = Math.abs(Math.sin(t * 0.29));
    return {
      lift: 0.021 + grit * 0.018,
      rot: -0.53 + breath * 0.63,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.017 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.48 * (1 - u) };
  }

  function polyphonyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.polyphony));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -0.029, rot: s * 1.85 * facing, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const bite = Math.sin(s * Math.PI * 4.9);
      const deepen = smoothstep(s);
      return {
        x: fromX + facing * deepen * 0.014,
        lift: -0.043 - Math.abs(bite) * 0.031 - deepen * 0.022,
        rot: facing * (2.35 + bite * 3.75),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: -0.018 * (1 - s),
      rot: facing * (0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function partialPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.partial));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.049, rot: s * -3.25 * facing, anim: "talk" };
    }
    if (u < 0.58) {
      const s = (u - 0.14) / 0.44;
      const pack = Math.sin(s * Math.PI * 4.5);
      return {
        x: fromX + facing * (0.02 + Math.abs(pack) * 0.012),
        lift: 0.058 + Math.abs(pack) * 0.048,
        rot: facing * (-3.55 + pack * 5.65),
        anim: "play",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.58) / 0.3;
      const press = smoothstep(s);
      return {
        x: fromX + facing * 0.028,
        lift: 0.035 - press * 0.04,
        rot: facing * (2.2 - press * 4.0),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 0.016 * (1 - s),
      lift: -0.008 * (1 - s),
      rot: facing * (0.6 * (1 - s)),
      anim: "sit",
    };
  }
  function resonancePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.resonance));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: -0.051 + s * 0.021, rot: s * 1.22 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.22) / 0.48;
      const liftUp = smoothstep(s);
      const shake = Math.sin(s * Math.PI * 3.25);
      return {
        x: fromX + facing * shake * 0.006,
        lift: -0.033 + liftUp * 0.126,
        rot: facing * (1.02 + shake * 2.85 + liftUp * 2.05),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 0.08 * (1 - s),
      rot: facing * (1.4 * (1 - s)),
      anim: "sit",
    };
  }
  function timbrePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.timbre));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.021, rot: s * -3.45 * facing, anim: "talk" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const glance = Math.sin(s * Math.PI * 2.45);
      const velour = Math.sin(s * Math.PI * 5.7) * 0.31;
      return {
        x: fromX + facing * glance * 0.004,
        lift: 0.019 + Math.abs(velour) * 0.011,
        rot: facing * (-2.95 + glance * 4.75 + velour),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.01 * (1 - s),
      rot: facing * (-0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "polyphony" && trick.kind !== "partial" && trick.kind !== "resonance" && trick.kind !== "timbre") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "harmonia") {
      if (next.t < HARMONIA_HOLD) {
        const pose = harmoniaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HARMONIA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HARMONIA_HOLD);
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
    if (next.kind === "polyphony") {
      const pose = polyphonyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "partial") {
      const pose = partialPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "resonance") {
      const pose = resonancePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = timbrePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    HARMONIA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    harmoniaPose,
    releasePose,
    polyphonyPose,
    partialPose,
    resonancePose,
    timbrePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    diapasonPose,
    motetPose,
    canticlePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetChoirTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
