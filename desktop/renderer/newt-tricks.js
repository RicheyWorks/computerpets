/** Eft ground tricks while idle — ultra-polish pass. House neighborly Salamandridae Crested/smooth-newt desk life — crest / caudal / filament / costal / caudate / hedonic / aposematic personality (dorsal crest raise, caudal aquatic undulation, palmate filament tip, costal-groove land crawl, long caudate metabolic hold, hedonic-gland courtship press, aposematic TTX warning flash — never named wait or wake or still or wiggle or dart or trail or paddle or newt or eft or frog or toad or reed or pebble or gular or nictitate or tympanum or iliac or lentic or toepad or webbing or verruca or burrow or parotoid or tubercle or bufonid or unken or cranial or gill or amble or mend or smile or plume or hop or puff or dig or soak or tuck or crane or plod or warning or cirrus as trick kinds; window-play TRAIL owns trail; ethogram softs + freeze own those words; Ink turtle owns paddle; Bloom owns gill/amble/mend/smile/plume; Reed owns gular/nictitate/tympanum/iliac/lentic/toepad/webbing; Pebble owns verruca/burrow/parotoid/tubercle/bufonid/unken/cranial; Milk owns warning; Drift owns cirrus; guest slug Eft / key newt only for isKey matching — accept "newt" and "eft"; do NOT name a trick "newt" or "eft" or "wait" or "wake" or "still" or "wiggle" or "dart" or "trail" or "paddle" or "frog" or "toad" or "reed" or "pebble" or "gular" or "lentic" or "verruca" or "bufonid" or "gill" or "hop" or "puff" or "dig" or "warning" or "cirrus") — not Pebble Bufonidae American-toad, not Reed Anura green-frog, not Arca sealed-vault, not Bloom axolotl, not Ink turtle, not Hush shade-umbra, not Beacon field-magnet, not Brine salt-brine, not Knot junction-weave, not Dusk twilight-belt, not Shard living-crystal, not Drift methane-cloud, not Choir chord-body, not Gleam lamp-drinker, not Blush rosy-boa; never named wait / wake / still / wiggle / dart / trail / paddle / newt / eft / frog / toad / reed / pebble / gular / nictitate / tympanum / iliac / lentic / toepad / webbing / verruca / burrow / parotoid / tubercle / bufonid / unken / cranial / loam / knurl / plump / chorus / rivulet / spring / gill / amble / mend / smile / plume / warning / cirrus / hop / puff / dig / freeze — Echo/Quill birds — do not copy. crest dorsal crest raise without naming trail, caudal caudal-fin aquatic undulation without naming paddle or wiggle or dart, filament palmate filament tip sway without naming trail, costal costal-groove land crawl without naming dig, caudate long Caudata metabolic hold, hedonic hedonic-gland courtship press (THE salamandrid courtship tell), aposematic aposematic TTX orange-warning flash (THE Notophthalmus toxicity tell); vermilion / eftish / palmate thank-yous. Feed-happy after eat. Card-open freeze and window-play TRAIL do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop newt-tricks.js. Window-play TRAIL unchanged. Ethogram softs + freeze — never names wiggle/dart/still as trick kinds. Hinge owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights (CAUDATE_HOLD=11.2 RELEASE_S=1.18). Pane now Rue-dense; Hold now Rue-dense; Spin now Rue-dense; Bell now Rue-dense; Rod now Rue-dense; Rose now Rue-dense; Brick now Rue-dense; Drake now Rue-dense; Vee now Rue-dense; Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; Frill now Rue-dense; Cap now Rue-dense; Lattice now Rue-dense; Horn now Rue-dense; Ring now Rue-dense; Mane now Rue-dense; next leftover Puff / puffball. prefersHouseCry via newt.wav. */
(function (root) {
  const TRICK_KEY = "newt";
  const TRICKS = ["crest", "caudal", "filament", "costal", "caudate", "hedonic", "aposematic"];
  const HAPPY = ["vermilion", "eftish", "palmate"];
  const HAPPY_DUR = { vermilion: 1.62, eftish: 1.74, palmate: 1.69 };
  const CAUDATE_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    caudate: CAUDATE_HOLD + RELEASE_S,
    crest: 2.28,
    caudal: 2.42,
    filament: 2.34,
    costal: 2.38,
    hedonic: 2.36,
    aposematic: 2.31,
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
    if (kind === "caudate") return 40 + roll * 26;
    if (kind === "hedonic" || kind === "aposematic") return 12.8 + roll * 9.4;
    if (kind === "crest" || kind === "caudal" || kind === "filament" || kind === "costal") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "caudate";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "caudate" ? 0.72 : k === "hedonic" || k === "aposematic" ? 1.28 : k === "crest" || k === "caudal" || k === "filament" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "crest";
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
    return key === TRICK_KEY || key === "eft";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "vermilion";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "vermilion" ? "sit" : name === "eftish" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function vermilionPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.vermilion));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 1.72);
      return {
        lift: 3.36 + Math.abs(flash) * 1.68,
        rot: 14.4 + flash * 9.6,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "idle" };
  }

  function eftishPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.eftish));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 4.08, rot: s * -16.8, dx: s * 0.18, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 2.1);
      return {
        lift: 4.08 + Math.abs(wriggle) * 1.92,
        rot: -16.8 + wriggle * 12,
        dx: 0.096,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 2.64 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "sit" };
  }

  function palmatePose(t) {
    return {
      lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
      rot: Math.sin(t * 0.624) * 7.2,
      dx: 0,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "vermilion") {
      const pose = vermilionPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "eftish") {
      const pose = eftishPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = palmatePose(next.t);
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
      kind === "caudate"
        ? "sit"
        : kind === "crest"
          ? "play"
          : kind === "caudal"
            ? "walk"
            : kind === "filament"
              ? "sit"
              : kind === "costal"
                ? "walk"
                : kind === "hedonic"
                  ? "sit"
                  : kind === "aposematic"
                    ? "play"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? kind : "crest",
      phase: kind === "caudate" ? "hold" : "go",
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

  function caudatePose(t) {
    return {
      lift: 2.88 + Math.abs(Math.sin(t * 0.504)) * 1.44,
      rot: -0.216 + Math.sin(t * 0.168) * 4.8,
      anim: "sit",
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.216 * (1 - u) };
  }

  function crestPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.crest));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.84, rot: s * -9.6 * facing, anim: "play" };
    }
    if (u < 0.48) {
      const s = (u - 0.16) / 0.32;
      const crest = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * crest * 0.144,
        lift: 3.84 + Math.abs(crest) * 1.68,
        rot: facing * (-9.6 + crest * 16.8),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const sway = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX,
        lift: 2.64 + Math.abs(sway) * 1.08,
        rot: facing * (4.8 + sway * 9.6),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.68 * (1 - s),
      rot: facing * (2.4 * (1 - s)),
      anim: "idle",
    };
  }

  function caudalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.caudal));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "walk" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const wave = Math.sin(s * Math.PI * 3.4);
      const glide = Math.sin(s * Math.PI * 1.2);
      return {
        x: fromX + facing * wave * 0.336,
        lift: 3.12 + Math.abs(glide) * 1.56 + Math.abs(wave) * 0.84,
        rot: facing * (12 + wave * 14.4 + glide * 9.6),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.44 * (1 - s),
      rot: facing * (3.6 * (1 - s)),
      anim: "idle",
    };
  }

  function filamentPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.filament));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.88, rot: s * -7.2 * facing, anim: "sit" };
    }
    if (u < 0.74) {
      const s = (u - 0.16) / 0.58;
      const tip = Math.sin(s * Math.PI * 4.2) + 0.22 * Math.sin(s * Math.PI * 7.1);
      const hush = smoothstep(Math.min(1, s * 1.2));
      return {
        x: fromX + facing * tip * 0.12,
        lift: 2.88 + hush * 1.44 + Math.abs(tip) * 0.84,
        rot: facing * (-7.2 + hush * 6 + tip * 4.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
      x: fromX,
      lift: 1.68 * (1 - s),
      rot: facing * (-2.4 * (1 - s)),
      anim: "idle",
    };
  }

  function costalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.costal));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "walk" };
    }
    if (u < 0.78) {
      const s = (u - 0.12) / 0.66;
      const groove = Math.sin(s * Math.PI * 2.55);
      const crawl = Math.sin(s * Math.PI * 1.15);
      return {
        x: fromX + facing * crawl * 0.264,
        lift: 3.12 + Math.abs(crawl) * 1.56 + Math.abs(groove) * 0.84,
        rot: facing * (12 + crawl * 14.4 + groove * 9.6),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.44 * (1 - s),
      rot: facing * (3.6 * (1 - s)),
      anim: "idle",
    };
  }

  function hedonicPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hedonic));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.36, rot: s * 14.4 * facing, anim: "sit" };
    }
    if (u < 0.42) {
      const s = (u - 0.16) / 0.26;
      const press = smoothstep(s);
      return {
        x: fromX,
        lift: 3.36 + press * 1.92,
        rot: facing * (14.4 + press * 19.2),
        anim: "sit",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.42) / 0.36;
      const scent = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX,
        lift: 5.04 + Math.abs(scent) * 0.72,
        rot: facing * (28.8 + scent * 4.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.4 * (1 - s),
      rot: facing * (9.6 * (1 - s)),
      anim: "idle",
    };
  }

  function aposematicPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.aposematic));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.64, rot: s * -12 * facing, anim: "play" };
    }
    if (u < 0.4) {
      const s = (u - 0.14) / 0.26;
      const flash = smoothstep(s);
      return {
        x: fromX,
        lift: 2.64 + flash * 1.44,
        rot: facing * (-12 - flash * 9.6),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.4) / 0.38;
      const warn = Math.sin(s * Math.PI * 3.1);
      return {
        x: fromX + facing * warn * 0.096,
        lift: 3.84 + Math.abs(warn) * 0.84,
        rot: facing * (-19.2 + warn * 7.2),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.8 * (1 - s),
      rot: facing * (-4.8 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (shouldAbort(flags)) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "caudate") {
      if (next.t < CAUDATE_HOLD) {
        const pose = caudatePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < CAUDATE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CAUDATE_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    let pose;
    if (next.kind === "crest") pose = crestPose(next.t, fromX, trick.facing);
    else if (next.kind === "caudal") pose = caudalPose(next.t, fromX, trick.facing);
    else if (next.kind === "filament") pose = filamentPose(next.t, fromX, trick.facing);
    else if (next.kind === "costal") pose = costalPose(next.t, fromX, trick.facing);
    else if (next.kind === "hedonic") pose = hedonicPose(next.t, fromX, trick.facing);
    else pose = aposematicPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX });
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    CAUDATE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    caudatePose,
    releasePose,
    crestPose,
    caudalPose,
    filamentPose,
    costalPose,
    hedonicPose,
    aposematicPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    vermilionPose,
    eftishPose,
    palmatePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetNewtTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
