/** Arca ground tricks while idle. House neighborly sealed vault alien encyst quiet hold desk life — lorica / tegument / ampoule / bradyzoite / cryptobiosis personality (sealed vault, alien encyst, quiet hold desk life — never named wait or wake or still or cyst or arca or seal or vault or damp or blotter or silhouette or adumbrate or occultation or antumbra or caligo as trick kinds; window-play WAIT owns wait; ethogram wake/wait/still own those words; Manta already owns vault; Cap/others own seal elsewhere; Hush owns silhouette/adumbrate/occultation/antumbra/caligo; guest slug Arca / key cyst only for isKey matching — accept "cyst" and "arca"; do NOT name a trick "cyst" or "arca" or "wait" or "wake" or "still" or "seal" or "vault" or "damp" or "blotter" or "silhouette" or "caligo") — not Hush silhouette/adumbrate/occultation/antumbra/caligo shade-umbra, not Beacon lodestone/flux/azimuth/dipole/remanence field-magnet, not Brine halite/salina/rime/bittern/deliquesce salt-brine, not Knot plexus/splice/braid/weft/mesh junction-weave, not Dusk belt/penumbra/eclipse/limb/limitor twilight-belt, not Shard cleavage/twinning/inclusion/grit/crescit living-crystal, not Drift waft/billow/cirrus/virga/stratus methane-cloud, not Choir polyphony/partial/timbre/resonance/harmonia chord-body, not Gleam photon/wavelength/lumen/glass/photovore lamp-drinker, not Fuse seat/current/blow/reseat dragon, not Ground lug/earth/heave/bed dragon, not Drown peristome/cistern/brine/operculum/urn pitcher, not Pulse bell/oral/lucent/trail/medusa jelly, not Chamber spiral/siphuncle/nacre/pinhole/fringe chambered-shell, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/rosette/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/band/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/veil/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift, not Door hinge/pharynx/knot/lurk/jamb moray, not Sheen lustre/tumulus/salt/commune/agapostemon; never named wait (window-play WAIT + ethogram — never a trick kind) / wake (ethogram) / still (ethogram) / seal (taken elsewhere — never a trick kind) / vault (Manta) / damp (taken) / blotter (window-play stage — never a trick kind) / cyst (guest key — never a trick kind) / arca (guest slug — never a trick kind) / silhouette / adumbrate / occultation / antumbra / caligo / skotos / umbriel / softfall / penumbra / eclipse / limb / limitor / belt / crepuscule / gloaming / eventide / lodestone / flux / azimuth / dipole / remanence / ferrite / oersted / gauss / halite / salina / rime / bittern / deliquesce / natron / trona / aureole / plexus / splice / braid / weft / mesh / accord / quorum / entente / cleavage / twinning / inclusion / grit / crescit / euhedral / vitreous / adamantine / facet / silica / shard / glass / stone / float / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle / photon / wavelength / lumen / actinic / lux / candela / polyphony / partial / timbre / resonance / harmonia / diapason / motet / canticle / cloud / mist / fog / haze / puff / dust / rain / chord / thirst / drink / drone / pulse / gleam / shine / glint / sheen / dig / nest / bank / buzz / dance / plaque / share / bloom / loaf / hinge / pharynx / lurk / jamb / rim / edge / trail / terminator / dusk / treaty / peristome / cistern / operculum / urn / lustre / tumulus / commune / agapostemon / many / count / ripple / name / nexus / knot / brine / salt / frost / halo / seat / blow / reseat / lug / earth / heave / bed / warm / snap / hum / bow / field / orbit / beacon / magneton / current / north / align / spiral / siphuncle / nacre / pinhole / fringe / cool / dim / shade / cast / veil / soft / umbra / shadow / hush / umbral — Echo/Quill are birds with sound — do not copy their tricks. lorica protozoan case settle on the blotter grain, tegument quiet membrane press across desk damp, ampoule sealed vial tip-hold of a fleck of lamp spill, bradyzoite dormant form tuck without naming wait, cryptobiosis long sealed metabolic hold that keeps a quiet wait while the still stays the blood (not Hush shade umbra, not Chamber nautilus shell, not Brine salt frost, not Beacon magnet field, not Dusk twilight belt) with excyst / turgor / trehalose cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play WAIT do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop cyst-tricks.js. Window-play WAIT unchanged — never names wait. Ethogram wake/wait/still unchanged — never names wake or wait or still as trick kinds. True sealed vault alien encyst quiet hold desk life only — sealed without naming seal; vault quiet without naming vault. Reed owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "cyst";
  const TRICKS = ["lorica", "tegument", "ampoule", "bradyzoite", "cryptobiosis"];
  const HAPPY = ["excyst", "turgor", "trehalose"];
  const HAPPY_DUR = { excyst: 1.61, turgor: 1.74, trehalose: 1.68 };
  const CRYPTOBIOSIS_HOLD = 18.22;
  const RELEASE_S = 1.14;
  const DUR = { cryptobiosis: CRYPTOBIOSIS_HOLD + RELEASE_S, lorica: 2.31, tegument: 2.39, ampoule: 2.24, bradyzoite: 2.36 };

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
      if (kind === "cryptobiosis") return 76 + roll * 43;
  if (kind === "lorica") return 17.6 + roll * 14.1;
  if (kind === "tegument") return 23.4 + roll * 13.2;
  if (kind === "bradyzoite") return 20.4 + roll * 14.6;
  return justFinished ? 14.4 + roll * 10.5 : 8.0 + roll * 9.3;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "cryptobiosis";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "cryptobiosis") {
      if (roll < 0.26) return "lorica";
      if (roll < 0.5) return "tegument";
      if (roll < 0.74) return "ampoule";
      return "bradyzoite";
    }
    if (lastKind === "lorica") {
      if (roll < 0.26) return "cryptobiosis";
      if (roll < 0.5) return "tegument";
      if (roll < 0.74) return "ampoule";
      return "bradyzoite";
    }
    if (lastKind === "tegument") {
      if (roll < 0.22) return "cryptobiosis";
      if (roll < 0.44) return "lorica";
      if (roll < 0.68) return "ampoule";
      return "bradyzoite";
    }
    if (roll < 0.2) return "cryptobiosis";
    if (roll < 0.4) return "lorica";
    if (roll < 0.6) return "tegument";
    if (roll < 0.8) return "ampoule";
    return "bradyzoite";
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
    return key === TRICK_KEY || key === "arca";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "excyst";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "excyst" ? "talk" : name === "turgor" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                function excystPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.excyst));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.024, rot: s * 1.55, dx: 0, anim: "talk" };
    }
    if (u < 0.80) {
      const tick = Math.sin(t * 8.6) + 0.16 * Math.sin(t * 15.8);
      return {
        lift: 0.024 + Math.abs(tick) * 0.012,
        rot: 1.55 + tick * 1.15,
        dx: tick * 0.0009,
        anim: "talk",
      };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.009 * (1 - s), rot: 0.45 * (1 - s), dx: 0, anim: "idle" };
  }
  function turgorPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.turgor));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.042, rot: s * -2.15, dx: s * 0.0013, anim: "play" };
    }
    if (u < 0.83) {
      const swell = Math.sin(t * 4.2) + 0.2 * Math.sin(t * 8.4);
      return {
        lift: 0.042 + Math.abs(swell) * 0.022,
        rot: -2.15 + swell * 2.65,
        dx: swell * 0.0022,
        anim: "play",
      };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: 0.012 * (1 - s), rot: -0.65 * (1 - s), dx: 0, anim: "sit" };
  }
  function trehalosePose(t) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.34)) * 0.010,
      rot: Math.sin(t * 0.40) * 0.82,
      dx: Math.sin(t * 0.24) * 0.0010,
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
    if (next.kind === "excyst") {
      const pose = excystPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "turgor") {
      const pose = turgorPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = trehalosePose(next.t);
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
      kind === "cryptobiosis"
    ? "sit"
    : kind === "lorica"
      ? "walk"
      : kind === "tegument"
        ? "talk"
        : kind === "ampoule"
          ? "sleep"
          : kind === "bradyzoite"
            ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "cryptobiosis" ? "hold" : "go",
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


                function cryptobiosisPose(t) {
    const breath = Math.sin(t * 0.13) + 0.045 * Math.sin(t * 0.39);
    const seal = Math.abs(Math.sin(t * 0.18));
    return {
      lift: 0.006 + seal * 0.011,
      rot: -0.18 + breath * 0.52,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.006 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function loricaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lorica));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.009, rot: s * -0.85 * facing, anim: "walk" };
    }
    if (u < 0.74) {
      const s = (u - 0.15) / 0.59;
      const caseShell = Math.sin(s * Math.PI * 1.85);
      const settle = smoothstep(s);
      return {
        x: fromX + facing * settle * 0.011,
        lift: 0.010 + Math.abs(caseShell) * 0.008 + settle * 0.004,
        rot: facing * (-0.95 + caseShell * 1.15 + settle * 0.55),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
      x: fromX + facing * 0.006 * (1 - s),
      lift: 0.006 * (1 - s),
      rot: facing * (-0.28 * (1 - s)),
      anim: "sit",
    };
  }
  function tegumentPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tegument));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -0.008, rot: s * 0.75 * facing, anim: "talk" };
    }
    if (u < 0.70) {
      const s = (u - 0.12) / 0.58;
      const press = Math.sin(s * Math.PI * 2.55);
      const membrane = smoothstep(s);
      return {
        x: fromX + facing * membrane * 0.055,
        lift: -0.026 - Math.abs(press) * 0.032 - membrane * 0.014,
        rot: facing * (1.75 + press * 2.65),
        anim: "talk",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.70) / 0.18;
      const settle = smoothstep(s);
      return {
        x: fromX + facing * 0.024 * (1 - settle * 0.4),
        lift: -0.014 + settle * 0.011,
        rot: facing * (0.72 - settle * 0.95),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 0.008 * (1 - s),
      lift: -0.003 * (1 - s),
      rot: facing * (0.22 * (1 - s)),
      anim: "sit",
    };
  }
  function ampoulePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ampoule));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.034, rot: s * 1.85 * facing, anim: "sleep" };
    }
    if (u < 0.52) {
      const s = (u - 0.14) / 0.38;
      const tip = smoothstep(s);
      return {
        x: fromX + facing * tip * 0.010,
        lift: 0.034 - tip * 0.048,
        rot: facing * (1.85 - tip * 2.85),
        anim: "sleep",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.52) / 0.32;
      const hold = Math.sin(s * Math.PI * 1.35);
      return {
        x: fromX + facing * 0.004,
        lift: -0.010 + Math.abs(hold) * 0.006,
        rot: facing * (-0.72 + hold * 0.75),
        anim: "sleep",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * 0.003 * (1 - s),
      lift: -0.005 * (1 - s),
      rot: facing * (-0.26 * (1 - s)),
      anim: "sit",
    };
  }
  function bradyzoitePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bradyzoite));
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX, lift: s * 0.028, rot: s * -1.25 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const s = (u - 0.13) / 0.65;
      const tuck = Math.sin(s * Math.PI * 1.95);
      const dormant = Math.sin(s * Math.PI * 0.95);
      return {
        x: fromX + facing * tuck * 0.014,
        lift: 0.028 + Math.abs(dormant) * 0.022 + Math.abs(tuck) * 0.012,
        rot: facing * (-1.25 + dormant * 3.35 + tuck * 1.55),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.008 * (1 - s),
      rot: facing * (-0.30 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lorica" && trick.kind !== "tegument" && trick.kind !== "ampoule" && trick.kind !== "bradyzoite") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "cryptobiosis") {
      if (next.t < CRYPTOBIOSIS_HOLD) {
        const pose = cryptobiosisPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CRYPTOBIOSIS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CRYPTOBIOSIS_HOLD);
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
    if (next.kind === "lorica") {
      const pose = loricaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tegument") {
      const pose = tegumentPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ampoule") {
      const pose = ampoulePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bradyzoitePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CRYPTOBIOSIS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    cryptobiosisPose,
    releasePose,
    loricaPose,
    tegumentPose,
    ampoulePose,
    bradyzoitePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    excystPose,
    turgorPose,
    trehalosePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCystTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
