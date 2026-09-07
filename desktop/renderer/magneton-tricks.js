/** Beacon ground tricks while idle. House neighborly alien field-swimmer magnet desk life — lodestone / flux / azimuth / dipole / remanence personality (magnetic pull, compass-bearing spin without naming compass or north or align, alien field desk life — never named align or still or north or field or orbit or beacon or magneton or current or frost or salt or brine as trick kinds; window-play ALIGN + ethogram align/still/north own those words; Fuse already owns trick name current; guest slug Beacon / key magneton only for isKey matching — accept "magneton" and "beacon"; do NOT name a trick "magneton" or "beacon" or "align" or "still" or "north" or "field" or "orbit" or "current") — not Brine halite/salina/rime/bittern/deliquesce salt-brine, not Knot plexus/splice/braid/weft/mesh junction-weave, not Dusk belt/penumbra/eclipse/limb/limitor twilight-belt, not Shard cleavage/twinning/inclusion/grit/crescit living-crystal, not Drift waft/billow/cirrus/virga/stratus methane-cloud, not Choir polyphony/partial/timbre/resonance/harmonia chord-body, not Gleam photon/wavelength/lumen/glass/photovore lamp-drinker, not Fuse seat/current/blow/reseat dragon, not Ground lug/earth/heave/bed dragon, not Drown peristome/cistern/brine/operculum/urn pitcher, not Pulse bell/oral/lucent/trail/medusa jelly, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/rosette/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/band/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/veil/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift, not Door hinge/pharynx/knot/lurk/jamb moray, not Sheen lustre/tumulus/salt/commune/agapostemon; never named align (window-play ALIGN + ethogram — never a trick kind) / still (ethogram) / north (ethogram) / field (window-play forbidden word — never a trick kind) / orbit (window-play forbidden) / beacon (guest slug — never a trick kind) / magneton (guest key — never a trick kind) / current (Fuse/fuse_dragon trick — never reuse) / halite / salina / rime / bittern / deliquesce / natron / trona / aureole / plexus / splice / braid / weft / mesh / accord / quorum / entente / belt / penumbra / eclipse / limb / limitor / crepuscule / gloaming / eventide / cleavage / twinning / inclusion / grit / crescit / euhedral / vitreous / adamantine / facet / silica / shard / glass / stone / float / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle / photon / wavelength / lumen / actinic / lux / candela / polyphony / partial / timbre / resonance / harmonia / diapason / motet / canticle / cloud / mist / fog / haze / puff / dust / rain / chord / thirst / drink / drone / pulse / gleam / shine / glint / sheen / dig / nest / bank / buzz / dance / plaque / share / bloom / loaf / hinge / pharynx / lurk / jamb / rim / edge / trail / terminator / dusk / treaty / peristome / cistern / operculum / urn / lustre / tumulus / commune / agapostemon / many / count / ripple / name / nexus / knot / brine / salt / frost / halo / seat / blow / reseat / lug / earth / heave / bed / warm / snap / hum / bow — Echo/Quill are birds with sound — do not copy their tricks. lodestone soft magnetic pull toward metal flecks across the blotter, flux swim along an invisible field line, azimuth compass-bearing spin without naming compass or north, dipole polarity-flip tumble, remanence long soft residual-field hold that keeps a quiet magnetism while the axis stays the blood (not Brine salt colony, not Gleam lamp-drinker, not Fuse dragon current, not Ground dragon bed, not Knot weave) with ferrite / oersted / gauss cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play ALIGN do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop magneton-tricks.js. Window-play ALIGN unchanged — never names align. Ethogram align/still/north unchanged — never names align or still or north as trick kinds. True alien field-swimmer magnet desk life only — magnetic pull without naming pull; compass spin without naming compass or north. Hush owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "magneton";
  const TRICKS = ["lodestone", "flux", "azimuth", "dipole", "remanence"];
  const HAPPY = ["ferrite", "oersted", "gauss"];
  const HAPPY_DUR = { ferrite: 1.52, oersted: 1.69, gauss: 1.64 };
  const REMANENCE_HOLD = 17.12;
  const RELEASE_S = 1.07;
  const DUR = { remanence: REMANENCE_HOLD + RELEASE_S, lodestone: 2.24, flux: 2.31, azimuth: 2.17, dipole: 2.26 };

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
      if (kind === "remanence") return 71 + roll * 39;
  if (kind === "lodestone") return 16.1 + roll * 14.1;
  if (kind === "flux") return 22.0 + roll * 13.2;
  if (kind === "dipole") return 19.1 + roll * 14.6;
  return justFinished ? 13.6 + roll * 9.9 : 7.3 + roll * 9.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "remanence";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "remanence") {
      if (roll < 0.26) return "lodestone";
      if (roll < 0.5) return "flux";
      if (roll < 0.74) return "azimuth";
      return "dipole";
    }
    if (lastKind === "lodestone") {
      if (roll < 0.26) return "remanence";
      if (roll < 0.5) return "flux";
      if (roll < 0.74) return "azimuth";
      return "dipole";
    }
    if (lastKind === "flux") {
      if (roll < 0.22) return "remanence";
      if (roll < 0.44) return "lodestone";
      if (roll < 0.68) return "azimuth";
      return "dipole";
    }
    if (roll < 0.2) return "remanence";
    if (roll < 0.4) return "lodestone";
    if (roll < 0.6) return "flux";
    if (roll < 0.8) return "azimuth";
    return "dipole";
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
    return key === TRICK_KEY || key === "beacon";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "ferrite";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "ferrite" ? "talk" : name === "oersted" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

            function ferritePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ferrite));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.039, rot: s * 2.55, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      const tick = Math.sin(t * 12.1) + 0.21 * Math.sin(t * 22.4);
      return {
        lift: 0.039 + Math.abs(tick) * 0.018,
        rot: 2.55 + tick * 1.85,
        dx: tick * 0.0015,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.014 * (1 - s), rot: 0.72 * (1 - s), dx: 0, anim: "idle" };
  }
  function oerstedPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.oersted));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.066, rot: s * -3.45, dx: s * 0.0022, anim: "play" };
    }
    if (u < 0.83) {
      const flash = Math.sin(t * 6.1) + 0.25 * Math.sin(t * 11.3);
      return {
        lift: 0.066 + Math.abs(flash) * 0.033,
        rot: -3.45 + flash * 4.15,
        dx: flash * 0.0036,
        anim: "play",
      };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: 0.018 * (1 - s), rot: -1.05 * (1 - s), dx: 0, anim: "sit" };
  }
  function gaussPose(t) {
    return {
      lift: 0.012 + Math.abs(Math.sin(t * 0.44)) * 0.016,
      rot: Math.sin(t * 0.51) * 1.35,
      dx: Math.sin(t * 0.31) * 0.0016,
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
    if (next.kind === "ferrite") {
      const pose = ferritePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "oersted") {
      const pose = oerstedPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gaussPose(next.t);
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
      kind === "remanence"
    ? "sit"
    : kind === "lodestone"
      ? "walk"
      : kind === "flux"
        ? "talk"
        : kind === "azimuth"
          ? "sleep"
          : kind === "dipole"
            ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "remanence" ? "hold" : "go",
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


            function remanencePose(t) {
    const breath = Math.sin(t * 0.19) + 0.068 * Math.sin(t * 0.53);
    const soft = Math.abs(Math.sin(t * 0.27));
    return {
      lift: 0.013 + soft * 0.021,
      rot: -0.42 + breath * 1.05,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.012 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.41 * (1 - u) };
  }

  function lodestonePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lodestone));
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX, lift: s * -0.018, rot: s * 1.85 * facing, anim: "walk" };
    }
    if (u < 0.7) {
      const s = (u - 0.13) / 0.57;
      const tug = Math.sin(s * Math.PI * 3.55);
      const pull = smoothstep(s);
      return {
        x: fromX + facing * pull * 0.034,
        lift: -0.024 - Math.abs(tug) * 0.019 - pull * 0.011,
        rot: facing * (1.95 + tug * 2.15),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX + facing * 0.014 * (1 - s),
      lift: -0.012 * (1 - s),
      rot: facing * (0.62 * (1 - s)),
      anim: "sit",
    };
  }
  function fluxPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.flux));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.041, rot: s * -1.65 * facing, anim: "talk" };
    }
    if (u < 0.64) {
      const s = (u - 0.12) / 0.52;
      const line = Math.sin(s * Math.PI * 2.65);
      const swim = smoothstep(s);
      return {
        x: fromX + facing * (0.022 + line * 0.028),
        lift: 0.044 + Math.abs(line) * 0.024 - swim * 0.012,
        rot: facing * (-1.95 + line * 3.85),
        anim: "talk",
      };
    }
    if (u < 0.87) {
      const s = (u - 0.64) / 0.23;
      const settle = smoothstep(s);
      return {
        x: fromX + facing * 0.031 * (1 - settle * 0.4),
        lift: 0.026 - settle * 0.031,
        rot: facing * (1.55 - settle * 2.85),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return {
      x: fromX + facing * 0.011 * (1 - s),
      lift: -0.005 * (1 - s),
      rot: facing * (0.42 * (1 - s)),
      anim: "sit",
    };
  }
  function azimuthPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.azimuth));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: 0.018 + s * 0.012, rot: s * 2.85 * facing, anim: "sleep" };
    }
    if (u < 0.76) {
      const s = (u - 0.15) / 0.61;
      const spin = Math.sin(s * Math.PI * 4.15);
      const bearing = smoothstep(s);
      return {
        x: fromX + facing * spin * 0.0035,
        lift: 0.028 + Math.abs(spin) * 0.016 + bearing * 0.008,
        rot: facing * (spin * 8.5 + bearing * 1.25),
        anim: "sleep",
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return {
      x: fromX,
      lift: 0.018 * (1 - s),
      rot: facing * (0.85 * (1 - s)),
      anim: "sit",
    };
  }
  function dipolePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dipole));
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX, lift: s * 0.052, rot: s * -2.65 * facing, anim: "talk" };
    }
    if (u < 0.78) {
      const s = (u - 0.13) / 0.65;
      const flip = Math.sin(s * Math.PI * 2.15);
      const pole = Math.sin(s * Math.PI * 5.15) * 0.32;
      return {
        x: fromX + facing * flip * -0.007,
        lift: 0.055 + Math.abs(flip) * 0.038 + Math.abs(pole) * 0.016,
        rot: facing * (-3.25 + flip * 6.85 + pole * 2.1),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.016 * (1 - s),
      rot: facing * (-0.58 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lodestone" && trick.kind !== "flux" && trick.kind !== "azimuth" && trick.kind !== "dipole") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "remanence") {
      if (next.t < REMANENCE_HOLD) {
        const pose = remanencePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < REMANENCE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - REMANENCE_HOLD);
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
    if (next.kind === "lodestone") {
      const pose = lodestonePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "flux") {
      const pose = fluxPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "azimuth") {
      const pose = azimuthPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dipolePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    REMANENCE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    remanencePose,
    releasePose,
    lodestonePose,
    fluxPose,
    azimuthPose,
    dipolePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    ferritePose,
    oerstedPose,
    gaussPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMagnetonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
