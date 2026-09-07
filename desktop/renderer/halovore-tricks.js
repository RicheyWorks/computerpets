/** Brine ground tricks while idle. House neighborly alien salt-drinker brine desk life — halite / salina / rime / bittern / deliquesce personality (salt craving, halo-feed without naming halo, alien brine desk life — never named brine or salt or frost or waste or still or halo or halovore as trick kinds; window-play FROST + ethogram frost/still/waste own those words; Drown/pitcher already owns trick name brine; Sheen/sweat_bee already owns trick name salt; Pulse/moon_jelly already owns thank-you halo; guest slug Brine / key halovore only for isKey matching — accept "halovore" and "brine"; do NOT name a trick "halovore" or "brine" or "salt" or "frost" or "waste" or "still" or "halo") — not Knot plexus/splice/braid/weft/mesh junction-weave, not Dusk belt/penumbra/eclipse/limb/limitor twilight-belt, not Shard cleavage/twinning/inclusion/grit/crescit living-crystal, not Drift waft/billow/cirrus/virga/stratus methane-cloud, not Choir polyphony/partial/timbre/resonance/harmonia chord-body, not Gleam photon/wavelength/lumen/glass/photovore lamp-drinker, not Drown peristome/cistern/brine/operculum/urn pitcher, not Pulse bell/oral/lucent/trail/medusa jelly, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/rosette/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/band/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/veil/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift, not Door hinge/pharynx/knot/lurk/jamb moray, not Sheen lustre/tumulus/salt/commune/agapostemon; never named brine (Drown/pitcher trick — never reuse) / salt (Sheen/sweat_bee trick — never reuse) / frost (window-play FROST + ethogram — never a trick kind) / waste (ethogram) / still (ethogram) / halo (Pulse thank-you — never reuse) / halovore (guest key — never a trick kind) / brine-slug-as-trick (guest name slug — never a trick kind) / plexus / splice / braid / weft / mesh / accord / quorum / entente / belt / penumbra / eclipse / limb / limitor / crepuscule / gloaming / eventide / cleavage / twinning / inclusion / grit / crescit / euhedral / vitreous / adamantine / facet / silica / shard / glass / stone / float / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle / photon / wavelength / lumen / actinic / lux / candela / polyphony / partial / timbre / resonance / harmonia / diapason / motet / canticle / cloud / mist / fog / haze / puff / dust / rain / chord / thirst / drink / drone / pulse / gleam / shine / glint / sheen / dig / nest / bank / buzz / dance / plaque / share / bloom / loaf / hinge / pharynx / lurk / jamb / rim / edge / trail / terminator / dusk / treaty / peristome / cistern / operculum / urn / lustre / tumulus / commune / agapostemon / many / count / ripple / name / nexus / knot — Echo/Quill are birds with sound — do not copy their tricks. halite soft salt-crystal craving gather across the blotter, salina evaporating salt-pan walk, rime leave a frost-of-waste film without naming frost, bittern concentrate mother-liquor draw, deliquesce long soft salt-body hold that drinks ambient humidity while brine stays the blood (not Knot weave colony, not Gleam lamp-drinker, not Drown pitcher brine, not Sheen salt lick, not Pulse jelly halo) with natron / trona / aureole cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play FROST do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop halovore-tricks.js. Window-play FROST unchanged — never names frost. Ethogram frost/still/waste unchanged — never names frost or still or waste as trick kinds. True alien salt-drinker brine desk life only — halo feed without naming halo; salt craving without naming salt or brine. Beacon owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "halovore";
  const TRICKS = ["halite", "salina", "rime", "bittern", "deliquesce"];
  const HAPPY = ["natron", "trona", "aureole"];
  const HAPPY_DUR = { natron: 1.54, trona: 1.71, aureole: 1.66 };
  const DELIQUESCE_HOLD = 16.88;
  const RELEASE_S = 1.04;
  const DUR = { deliquesce: DELIQUESCE_HOLD + RELEASE_S, halite: 2.19, salina: 2.28, rime: 2.13, bittern: 2.21 };

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
      if (kind === "deliquesce") return 69 + roll * 38;
  if (kind === "halite") return 15.7 + roll * 13.8;
  if (kind === "salina") return 21.4 + roll * 12.9;
  if (kind === "bittern") return 18.6 + roll * 14.2;
  return justFinished ? 13.3 + roll * 9.7 : 7.1 + roll * 9.2;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "deliquesce";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "deliquesce") {
      if (roll < 0.26) return "halite";
      if (roll < 0.5) return "salina";
      if (roll < 0.74) return "rime";
      return "bittern";
    }
    if (lastKind === "halite") {
      if (roll < 0.26) return "deliquesce";
      if (roll < 0.5) return "salina";
      if (roll < 0.74) return "rime";
      return "bittern";
    }
    if (lastKind === "salina") {
      if (roll < 0.22) return "deliquesce";
      if (roll < 0.44) return "halite";
      if (roll < 0.68) return "rime";
      return "bittern";
    }
    if (roll < 0.2) return "deliquesce";
    if (roll < 0.4) return "halite";
    if (roll < 0.6) return "salina";
    if (roll < 0.8) return "rime";
    return "bittern";
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
    return key === TRICK_KEY || key === "brine";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "natron";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "natron" ? "talk" : name === "trona" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

          function natronPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.natron));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.042, rot: s * 2.45, dx: 0, anim: "talk" };
    }
    if (u < 0.79) {
      const tick = Math.sin(t * 11.6) + 0.22 * Math.sin(t * 21.8);
      return {
        lift: 0.042 + Math.abs(tick) * 0.019,
        rot: 2.45 + tick * 1.95,
        dx: tick * 0.0016,
        anim: "talk",
      };
    }
    const s = (u - 0.79) / 0.21;
    return { lift: 0.015 * (1 - s), rot: 0.78 * (1 - s), dx: 0, anim: "idle" };
  }
  function tronaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.trona));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.062, rot: s * -3.25, dx: s * 0.0021, anim: "play" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.26 * Math.sin(t * 10.9);
      return {
        lift: 0.062 + Math.abs(flash) * 0.031,
        rot: -3.25 + flash * 3.95,
        dx: flash * 0.0034,
        anim: "play",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.017 * (1 - s), rot: -0.95 * (1 - s), dx: 0, anim: "sit" };
  }
  function aureolePose(t) {
    return {
      lift: 0.011 + Math.abs(Math.sin(t * 0.41)) * 0.015,
      rot: Math.sin(t * 0.47) * 1.28,
      dx: Math.sin(t * 0.29) * 0.0015,
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
    if (next.kind === "natron") {
      const pose = natronPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "trona") {
      const pose = tronaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = aureolePose(next.t);
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
      kind === "deliquesce"
    ? "sit"
    : kind === "halite"
      ? "walk"
      : kind === "salina"
        ? "talk"
        : kind === "rime"
          ? "sleep"
          : kind === "bittern"
            ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "deliquesce" ? "hold" : "go",
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


          function deliquescePose(t) {
    const breath = Math.sin(t * 0.17) + 0.071 * Math.sin(t * 0.49);
    const soft = Math.abs(Math.sin(t * 0.23));
    return {
      lift: 0.012 + soft * 0.023,
      rot: -0.36 + breath * 0.91,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.011 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.38 * (1 - u) };
  }

  function halitePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.halite));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * -0.021, rot: s * 1.55 * facing, anim: "sit" };
    }
    if (u < 0.68) {
      const s = (u - 0.14) / 0.54;
      const cube = Math.sin(s * Math.PI * 3.95);
      const crystal = smoothstep(s);
      return {
        x: fromX + facing * crystal * 0.028,
        lift: -0.028 - Math.abs(cube) * 0.022 - crystal * 0.009,
        rot: facing * (1.62 + cube * 2.35),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.68) / 0.32);
    return {
      x: fromX + facing * 0.012 * (1 - s),
      lift: -0.014 * (1 - s),
      rot: facing * (0.55 * (1 - s)),
      anim: "sit",
    };
  }
  function salinaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.salina));
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX, lift: s * 0.036, rot: s * -1.85 * facing, anim: "walk" };
    }
    if (u < 0.62) {
      const s = (u - 0.13) / 0.49;
      const pan = Math.sin(s * Math.PI * 2.85);
      const dry = smoothstep(s);
      return {
        x: fromX + facing * (0.018 + pan * 0.022),
        lift: 0.038 + Math.abs(pan) * 0.026 - dry * 0.014,
        rot: facing * (-2.15 + pan * 3.45),
        anim: "walk",
      };
    }
    if (u < 0.86) {
      const s = (u - 0.62) / 0.24;
      const shrink = smoothstep(s);
      return {
        x: fromX + facing * 0.026 * (1 - shrink * 0.35),
        lift: 0.022 - shrink * 0.028,
        rot: facing * (1.45 - shrink * 2.75),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 0.009 * (1 - s),
      lift: -0.006 * (1 - s),
      rot: facing * (0.38 * (1 - s)),
      anim: "sit",
    };
  }
  function rimePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rime));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: 0.022 + s * -0.018, rot: s * 0.95 * facing, anim: "sit" };
    }
    if (u < 0.74) {
      const s = (u - 0.16) / 0.58;
      const film = smoothstep(s);
      const shimmer = Math.sin(s * Math.PI * 3.55) * 0.32;
      return {
        x: fromX + facing * shimmer * 0.004,
        lift: 0.012 - film * 0.095,
        rot: facing * (0.78 + shimmer * 1.45 + film * 1.62),
        anim: "sleep",
      };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
      x: fromX,
      lift: 0.052 * (1 - s),
      rot: facing * (0.72 * (1 - s)),
      anim: "sit",
    };
  }
  function bitternPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bittern));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.044, rot: s * -2.25 * facing, anim: "talk" };
    }
    if (u < 0.76) {
      const s = (u - 0.14) / 0.62;
      const draw = Math.sin(s * Math.PI * 2.35);
      const liquor = Math.sin(s * Math.PI * 4.85) * 0.28;
      return {
        x: fromX + facing * draw * -0.006,
        lift: 0.048 + Math.abs(draw) * 0.042 + Math.abs(liquor) * 0.018,
        rot: facing * (-2.95 + draw * 3.55 + liquor),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return {
      x: fromX,
      lift: 0.015 * (1 - s),
      rot: facing * (-0.52 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "halite" && trick.kind !== "salina" && trick.kind !== "rime" && trick.kind !== "bittern") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "deliquesce") {
      if (next.t < DELIQUESCE_HOLD) {
        const pose = deliquescePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DELIQUESCE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DELIQUESCE_HOLD);
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
    if (next.kind === "halite") {
      const pose = halitePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "salina") {
      const pose = salinaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rime") {
      const pose = rimePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bitternPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    DELIQUESCE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    deliquescePose,
    releasePose,
    halitePose,
    salinaPose,
    rimePose,
    bitternPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    natronPose,
    tronaPose,
    aureolePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHalovoreTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
