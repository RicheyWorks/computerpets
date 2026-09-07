/** Hush ground tricks while idle. House neighborly alien shade soft umbra quiet desk life — silhouette / adumbrate / occultation / antumbra / caligo personality (shadow soft, umbra quiet, alien shade desk life — never named cool or dim or still or hush or umbral or shade or cast or veil or soft or penumbra or eclipse or limb or limitor or belt or lodestone or flux or azimuth or dipole or remanence or waft or billow or cirrus as trick kinds; window-play COOL + ethogram dim/still/cool own those words; Dusk already owns penumbra/eclipse/limb/limitor/belt; Beacon owns lodestone/flux/azimuth/dipole/remanence; Drift owns waft/billow/cirrus/virga/stratus; guest slug Hush / key umbral only for isKey matching — accept "umbral" and "hush"; do NOT name a trick "umbral" or "hush" or "cool" or "dim" or "still" or "shade" or "cast" or "veil" or "soft" or "umbra" or "shadow" or "penumbra" or "eclipse") — not Beacon lodestone/flux/azimuth/dipole/remanence field-magnet, not Brine halite/salina/rime/bittern/deliquesce salt-brine, not Knot plexus/splice/braid/weft/mesh junction-weave, not Dusk belt/penumbra/eclipse/limb/limitor twilight-belt, not Shard cleavage/twinning/inclusion/grit/crescit living-crystal, not Drift waft/billow/cirrus/virga/stratus methane-cloud, not Choir polyphony/partial/timbre/resonance/harmonia chord-body, not Gleam photon/wavelength/lumen/glass/photovore lamp-drinker, not Fuse seat/current/blow/reseat dragon, not Ground lug/earth/heave/bed dragon, not Drown peristome/cistern/brine/operculum/urn pitcher, not Pulse bell/oral/lucent/trail/medusa jelly, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/rosette/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/band/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/veil/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift, not Door hinge/pharynx/knot/lurk/jamb moray, not Sheen lustre/tumulus/salt/commune/agapostemon; never named cool (window-play COOL + ethogram — never a trick kind) / dim (ethogram) / still (ethogram) / shade (taken elsewhere — never a trick kind) / cast (taken) / veil (Cap) / soft (Flame) / hush (guest slug — never a trick kind) / umbral (guest key — never a trick kind) / umbra (too close to key) / shadow (too close to species tell as trick kind) / penumbra / eclipse / limb / limitor / belt / crepuscule / gloaming / eventide / lodestone / flux / azimuth / dipole / remanence / ferrite / oersted / gauss / halite / salina / rime / bittern / deliquesce / natron / trona / aureole / plexus / splice / braid / weft / mesh / accord / quorum / entente / cleavage / twinning / inclusion / grit / crescit / euhedral / vitreous / adamantine / facet / silica / shard / glass / stone / float / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle / photon / wavelength / lumen / actinic / lux / candela / polyphony / partial / timbre / resonance / harmonia / diapason / motet / canticle / cloud / mist / fog / haze / puff / dust / rain / chord / thirst / drink / drone / pulse / gleam / shine / glint / sheen / dig / nest / bank / buzz / dance / plaque / share / bloom / loaf / hinge / pharynx / lurk / jamb / rim / edge / trail / terminator / dusk / treaty / peristome / cistern / operculum / urn / lustre / tumulus / commune / agapostemon / many / count / ripple / name / nexus / knot / brine / salt / frost / halo / seat / blow / reseat / lug / earth / heave / bed / warm / snap / hum / bow / field / orbit / beacon / magneton / current / north / align — Echo/Quill are birds with sound — do not copy their tricks. silhouette soft lamp-edge outline settle on the blotter, adumbrate quiet foreshadow sketch across desk grain, occultation soft cover of a fleck of lamp spill, antumbra annular shade stretch without naming penumbra, caligo long soft murky shade hold that keeps a quiet cool while the dim stays the blood (not Beacon magnet field, not Dusk twilight belt, not Drift methane cloud, not Gleam lamp-drinker, not Fuse dragon current) with skotos / umbriel / softfall cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play COOL do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop umbral-tricks.js. Window-play COOL unchanged — never names cool. Ethogram dim/still/cool unchanged — never names dim or still or cool as trick kinds. True alien shade soft umbra quiet desk life only — shadow soft without naming shadow; umbra quiet without naming umbra. Arca owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "umbral";
  const TRICKS = ["silhouette", "adumbrate", "occultation", "antumbra", "caligo"];
  const HAPPY = ["skotos", "umbriel", "softfall"];
  const HAPPY_DUR = { skotos: 1.58, umbriel: 1.71, softfall: 1.66 };
  const CALIGO_HOLD = 18.04;
  const RELEASE_S = 1.11;
  const DUR = { caligo: CALIGO_HOLD + RELEASE_S, silhouette: 2.29, adumbrate: 2.36, occultation: 2.21, antumbra: 2.33 };

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
      if (kind === "caligo") return 74 + roll * 41;
  if (kind === "silhouette") return 17.2 + roll * 13.8;
  if (kind === "adumbrate") return 23.1 + roll * 12.9;
  if (kind === "antumbra") return 20.0 + roll * 14.2;
  return justFinished ? 14.1 + roll * 10.2 : 7.8 + roll * 9.1;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "caligo";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "caligo") {
      if (roll < 0.26) return "silhouette";
      if (roll < 0.5) return "adumbrate";
      if (roll < 0.74) return "occultation";
      return "antumbra";
    }
    if (lastKind === "silhouette") {
      if (roll < 0.26) return "caligo";
      if (roll < 0.5) return "adumbrate";
      if (roll < 0.74) return "occultation";
      return "antumbra";
    }
    if (lastKind === "adumbrate") {
      if (roll < 0.22) return "caligo";
      if (roll < 0.44) return "silhouette";
      if (roll < 0.68) return "occultation";
      return "antumbra";
    }
    if (roll < 0.2) return "caligo";
    if (roll < 0.4) return "silhouette";
    if (roll < 0.6) return "adumbrate";
    if (roll < 0.8) return "occultation";
    return "antumbra";
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
    return key === TRICK_KEY || key === "hush";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "skotos";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "skotos" ? "talk" : name === "umbriel" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

              function skotosPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.skotos));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.028, rot: s * 1.85, dx: 0, anim: "talk" };
    }
    if (u < 0.81) {
      const tick = Math.sin(t * 9.4) + 0.18 * Math.sin(t * 17.2);
      return {
        lift: 0.028 + Math.abs(tick) * 0.014,
        rot: 1.85 + tick * 1.35,
        dx: tick * 0.0011,
        anim: "talk",
      };
    }
    const s = (u - 0.81) / 0.19;
    return { lift: 0.011 * (1 - s), rot: 0.55 * (1 - s), dx: 0, anim: "idle" };
  }
  function umbrielPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.umbriel));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.048, rot: s * -2.55, dx: s * 0.0016, anim: "play" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.8) + 0.22 * Math.sin(t * 9.1);
      return {
        lift: 0.048 + Math.abs(flash) * 0.024,
        rot: -2.55 + flash * 3.05,
        dx: flash * 0.0026,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.014 * (1 - s), rot: -0.75 * (1 - s), dx: 0, anim: "sit" };
  }
  function softfallPose(t) {
    return {
      lift: 0.008 + Math.abs(Math.sin(t * 0.38)) * 0.012,
      rot: Math.sin(t * 0.44) * 0.95,
      dx: Math.sin(t * 0.27) * 0.0012,
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
    if (next.kind === "skotos") {
      const pose = skotosPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "umbriel") {
      const pose = umbrielPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = softfallPose(next.t);
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
      kind === "caligo"
    ? "sit"
    : kind === "silhouette"
      ? "walk"
      : kind === "adumbrate"
        ? "talk"
        : kind === "occultation"
          ? "sleep"
          : kind === "antumbra"
            ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "caligo" ? "hold" : "go",
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


              function caligoPose(t) {
    const breath = Math.sin(t * 0.16) + 0.055 * Math.sin(t * 0.47);
    const soft = Math.abs(Math.sin(t * 0.22));
    return {
      lift: 0.009 + soft * 0.014,
      rot: -0.28 + breath * 0.72,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.008 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.26 * (1 - u) };
  }

  function silhouettePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.silhouette));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.012, rot: s * -1.15 * facing, anim: "walk" };
    }
    if (u < 0.72) {
      const s = (u - 0.14) / 0.58;
      const edge = Math.sin(s * Math.PI * 2.35);
      const outline = smoothstep(s);
      return {
        x: fromX + facing * outline * 0.018,
        lift: 0.014 + Math.abs(edge) * 0.011 + outline * 0.006,
        rot: facing * (-1.25 + edge * 1.55 + outline * 0.85),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.009 * (1 - s),
      lift: 0.008 * (1 - s),
      rot: facing * (-0.35 * (1 - s)),
      anim: "sit",
    };
  }
  function adumbratePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.adumbrate));
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * -0.011, rot: s * 1.05 * facing, anim: "talk" };
    }
    if (u < 0.68) {
      const s = (u - 0.11) / 0.57;
      const sketch = Math.sin(s * Math.PI * 3.05);
      const foreshadow = smoothstep(s);
      return {
        x: fromX + facing * foreshadow * 0.062,
        lift: -0.028 - Math.abs(sketch) * 0.034 - foreshadow * 0.016,
        rot: facing * (1.85 + sketch * 2.85),
        anim: "talk",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.68) / 0.2;
      const settle = smoothstep(s);
      return {
        x: fromX + facing * 0.055 * (1 - settle * 0.35),
        lift: -0.018 + settle * 0.014,
        rot: facing * (0.95 - settle * 1.35),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 0.012 * (1 - s),
      lift: -0.004 * (1 - s),
      rot: facing * (0.28 * (1 - s)),
      anim: "sit",
    };
  }
  function occultationPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.occultation));
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX, lift: s * 0.028, rot: s * 1.45 * facing, anim: "sleep" };
    }
    if (u < 0.55) {
      const s = (u - 0.13) / 0.42;
      const cover = smoothstep(s);
      return {
        x: fromX + facing * cover * 0.008,
        lift: 0.028 - cover * 0.036,
        rot: facing * (1.45 - cover * 2.25),
        anim: "sleep",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const hold = Math.sin(s * Math.PI * 1.65);
      return {
        x: fromX + facing * 0.006,
        lift: -0.012 + Math.abs(hold) * 0.008,
        rot: facing * (-0.85 + hold * 0.95),
        anim: "sleep",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.004 * (1 - s),
      lift: -0.006 * (1 - s),
      rot: facing * (-0.32 * (1 - s)),
      anim: "sit",
    };
  }
  function antumbraPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antumbra));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.022, rot: s * -0.95 * facing, anim: "play" };
    }
    if (u < 0.76) {
      const s = (u - 0.12) / 0.64;
      const ring = Math.sin(s * Math.PI * 2.45);
      const annular = Math.sin(s * Math.PI * 1.15);
      return {
        x: fromX + facing * ring * 0.011,
        lift: 0.024 + Math.abs(annular) * 0.018 + Math.abs(ring) * 0.009,
        rot: facing * (-1.05 + annular * 3.15 + ring * 1.45),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return {
      x: fromX,
      lift: 0.011 * (1 - s),
      rot: facing * (-0.38 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "silhouette" && trick.kind !== "adumbrate" && trick.kind !== "occultation" && trick.kind !== "antumbra") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "caligo") {
      if (next.t < CALIGO_HOLD) {
        const pose = caligoPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CALIGO_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CALIGO_HOLD);
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
    if (next.kind === "silhouette") {
      const pose = silhouettePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "adumbrate") {
      const pose = adumbratePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "occultation") {
      const pose = occultationPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = antumbraPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CALIGO_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    caligoPose,
    releasePose,
    silhouettePose,
    adumbratePose,
    occultationPose,
    antumbraPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    skotosPose,
    umbrielPose,
    softfallPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetUmbralTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
