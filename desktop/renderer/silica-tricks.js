/** Shard ground tricks while idle. House neighborly alien mineral desk life — cleavage / twinning / inclusion / grit / crescit personality (crystal facet, glass grit, Silica crescit inkstone life — never named facet or still or shed or silica or shard or glass or stone as trick kinds; window-play FACET + ethogram facet/still/shed own those words; guest slug Shard / key silica only for isKey matching — accept "silica" and "shard"; do NOT name a trick "silica" or "shard" or "facet") — not Drift waft/billow/cirrus/virga/stratus methane-cloud, not Choir polyphony/partial/timbre/resonance/harmonia chord-body, not Gleam photon/wavelength/lumen/glass/photovore lamp-drinker, not Pulse bell/oral/lucent/trail/medusa jelly, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/rosette/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/band/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/veil/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift; never named facet (window-play FACET + ethogram — never a trick kind) / still (ethogram) / shed (ethogram) / silica (guest key — never a trick kind) / shard (guest name — never a trick kind) / glass (Gleam trick) / stone (Pact trick) / float (Drift window) / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle / photon / wavelength / lumen / actinic / lux / candela / polyphony / partial / timbre / resonance / harmonia / diapason / motet / canticle / cloud / mist / fog / haze / puff / dust / rain / chord / thirst / drink / drone / pulse / gleam / shine / glint / sheen / dig / nest / bank / buzz / dance / plaque / share / bloom / loaf — Echo/Quill are birds with sound — do not copy their tricks. cleavage clean plane split across the blotter, twinning mirrored crystal flip, inclusion trapped grit swirl, grit glass-grit desk scrape, crescit long Silica-crescit hold desk life as living mineral (not Drift methane floater, not Choir chord-body, not Gleam lamp-drinker, not Pact plaque) with euhedral / vitreous / adamantine cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play FACET do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop silica-tricks.js. Window-play FACET unchanged — never names facet. Ethogram facet/still/shed unchanged — never names facet or still or shed as trick kinds. True alien mineral desk grit only — crystal life without naming facet. Dusk owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "silica";
  const TRICKS = ["cleavage", "twinning", "inclusion", "grit", "crescit"];
  const HAPPY = ["euhedral", "vitreous", "adamantine"];
  const HAPPY_DUR = { euhedral: 1.58, vitreous: 1.71, adamantine: 1.69 };
  const CRESCIT_HOLD = 17.12;
  const RELEASE_S = 0.97;
  const DUR = { crescit: CRESCIT_HOLD + RELEASE_S, cleavage: 2.11, twinning: 2.33, inclusion: 1.98, grit: 2.08 };

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
      if (kind === "crescit") return 67 + roll * 39;
  if (kind === "cleavage") return 16.4 + roll * 13.1;
  if (kind === "twinning") return 22.1 + roll * 12.9;
  if (kind === "grit") return 19.0 + roll * 13.6;
  return justFinished ? 13.1 + roll * 9.8 : 7.6 + roll * 8.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "crescit";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "crescit") {
      if (roll < 0.26) return "cleavage";
      if (roll < 0.5) return "twinning";
      if (roll < 0.74) return "inclusion";
      return "grit";
    }
    if (lastKind === "cleavage") {
      if (roll < 0.26) return "crescit";
      if (roll < 0.5) return "twinning";
      if (roll < 0.74) return "inclusion";
      return "grit";
    }
    if (lastKind === "twinning") {
      if (roll < 0.22) return "crescit";
      if (roll < 0.44) return "cleavage";
      if (roll < 0.68) return "inclusion";
      return "grit";
    }
    if (roll < 0.2) return "crescit";
    if (roll < 0.4) return "cleavage";
    if (roll < 0.6) return "twinning";
    if (roll < 0.8) return "inclusion";
    return "grit";
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
    return key === TRICK_KEY || key === "shard";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "euhedral";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "euhedral" ? "talk" : name === "vitreous" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

    function euhedralPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.euhedral));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.052, rot: s * 3.25, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
      const tick = Math.sin(t * 14.2) + 0.29 * Math.sin(t * 26.4);
      return {
        lift: 0.052 + Math.abs(tick) * 0.025,
        rot: 3.25 + tick * 2.48,
        dx: tick * 0.0022,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.02 * (1 - s), rot: 1.05 * (1 - s), dx: 0, anim: "idle" };
  }
  function vitreousPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.vitreous));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.068, rot: s * -4.05, dx: s * 0.0028, anim: "play" };
    }
    if (u < 0.81) {
      const flash = Math.sin(t * 7.1) + 0.28 * Math.sin(t * 12.6);
      return {
        lift: 0.068 + Math.abs(flash) * 0.033,
        rot: -4.05 + flash * 4.85,
        dx: flash * 0.0045,
        anim: "play",
      };
    }
    const s = (u - 0.81) / 0.19;
    return { lift: 0.022 * (1 - s), rot: -1.25 * (1 - s), dx: 0, anim: "sit" };
  }
  function adamantinePose(t) {
    return {
      lift: 0.012 + Math.abs(Math.sin(t * 0.51)) * 0.015,
      rot: Math.sin(t * 0.58) * 1.35,
      dx: Math.sin(t * 0.38) * 0.0021,
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
    if (next.kind === "euhedral") {
      const pose = euhedralPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "vitreous") {
      const pose = vitreousPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = adamantinePose(next.t);
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
      kind === "crescit"
    ? "sit"
    : kind === "cleavage"
      ? "play"
      : kind === "twinning"
        ? "talk"
        : kind === "inclusion"
          ? "talk"
          : kind === "grit"
            ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "crescit" ? "hold" : "go",
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


    function crescitPose(t) {
    const breath = Math.sin(t * 0.19) + 0.064 * Math.sin(t * 0.53);
    const grit = Math.abs(Math.sin(t * 0.27));
    return {
      lift: 0.022 + grit * 0.019,
      rot: -0.55 + breath * 0.63,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.015 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.52 * (1 - u) };
  }

  function cleavagePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cleavage));
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX, lift: s * -0.022, rot: s * 1.55 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.13) / 0.57;
      const bite = Math.sin(s * Math.PI * 5.15);
      const deepen = smoothstep(s);
      return {
        x: fromX + facing * deepen * 0.031,
        lift: -0.036 - Math.abs(bite) * 0.019 - deepen * 0.016,
        rot: facing * (1.85 + bite * 2.55),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX + facing * 0.012 * (1 - s),
      lift: -0.02 * (1 - s),
      rot: facing * (0.75 * (1 - s)),
      anim: "sit",
    };
  }
  function twinningPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.twinning));
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX, lift: s * 0.058, rot: s * -2.85 * facing, anim: "talk" };
    }
    if (u < 0.56) {
      const s = (u - 0.13) / 0.43;
      const pack = Math.sin(s * Math.PI * 4.85);
      return {
        x: fromX + facing * (0.018 + Math.abs(pack) * 0.014),
        lift: 0.068 + Math.abs(pack) * 0.041,
        rot: facing * (-3.85 + pack * 5.95),
        anim: "play",
      };
    }
    if (u < 0.87) {
      const s = (u - 0.56) / 0.31;
      const press = smoothstep(s);
      return {
        x: fromX + facing * 0.026,
        lift: 0.032 - press * 0.038,
        rot: facing * (2.45 - press * 4.25),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return {
      x: fromX + facing * 0.014 * (1 - s),
      lift: -0.009 * (1 - s),
      rot: facing * (0.55 * (1 - s)),
      anim: "sit",
    };
  }
  function inclusionPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.inclusion));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: 0.038 + s * -0.014, rot: s * 1.35 * facing, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.2) / 0.52;
      const liftUp = smoothstep(s);
      const shake = Math.sin(s * Math.PI * 3.55);
      return {
        x: fromX + facing * shake * 0.007,
        lift: 0.035 - liftUp * 0.088,
        rot: facing * (1.15 + shake * 2.65 + liftUp * 2.15),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.075 * (1 - s),
      rot: facing * (1.25 * (1 - s)),
      anim: "sit",
    };
  }
  function gritPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.grit));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.029, rot: s * -1.95 * facing, anim: "talk" };
    }
    if (u < 0.82) {
      const s = (u - 0.15) / 0.67;
      const glance = Math.sin(s * Math.PI * 2.75);
      const velour = Math.sin(s * Math.PI * 6.1) * 0.34;
      return {
        x: fromX + facing * glance * 0.005,
        lift: 0.028 + Math.abs(velour) * 0.011,
        rot: facing * (-2.65 + glance * 4.45 + velour),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.009 * (1 - s),
      rot: facing * (-0.7 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "cleavage" && trick.kind !== "twinning" && trick.kind !== "inclusion" && trick.kind !== "grit") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "crescit") {
      if (next.t < CRESCIT_HOLD) {
        const pose = crescitPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CRESCIT_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CRESCIT_HOLD);
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
    if (next.kind === "cleavage") {
      const pose = cleavagePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "twinning") {
      const pose = twinningPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inclusion") {
      const pose = inclusionPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gritPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CRESCIT_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    crescitPose,
    releasePose,
    cleavagePose,
    twinningPose,
    inclusionPose,
    gritPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    euhedralPose,
    vitreousPose,
    adamantinePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSilicaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
