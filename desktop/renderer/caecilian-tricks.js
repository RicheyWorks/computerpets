/** Slip ground tricks while idle — ultra-polish pass. House neighborly Gymnophiona Rio-caecilian desk life — annulate / fossorial / tentacular / hydrostatic / gymnophion / stegos / dualjaw personality (ringed annulate body flex without naming ring, silt fossorial swim-burrow undulation without naming burrow or dig or fossor, chemosensory tentacular tip-sniff without naming tentacle or nasolabial, hydrostatic body push through substrate without naming heave or earth, long gymnophion limbless hold under silt, stegos stegokrotaphic solid-skull settle, dualjaw dual jaw-closing levator/interhyoideus bite press — never named wait or wake or still or hide or cover or wiggle or dart or trail or paddle or ring or slip or caecilian or salamander or dapple or newt or eft or frog or toad or reed or pebble or crest or caudal or filament or costal or caudate or hedonic or aposematic or maculate or litter or cutaneous or nasolabial or ambystomid or mental or granular or gular or nictitate or tympanum or iliac or lentic or toepad or webbing or verruca or burrow or parotoid or tubercle or bufonid or unken or cranial or gill or amble or mend or smile or plume or hop or puff or dig or soak or tuck or crane or plod or tentacle or fossor or warning or cirrus or vernal as trick kinds; window-play RING owns ring; ethogram softs + freeze own those words; Dapple owns maculate/litter/cutaneous/nasolabial/ambystomid/mental/granular; Eft owns crest/caudal/filament/costal/caudate/hedonic/aposematic; Bloom owns gill/amble/mend/smile/plume; Reed owns gular/nictitate/tympanum/iliac/lentic/toepad/webbing; Pebble owns verruca/burrow/parotoid/tubercle/bufonid/unken/cranial; Sundew owns tentacle; Bumblebee owns fossor; MiningBee owns vernal; Milk owns warning; Drift owns cirrus; guest slug Slip / key caecilian only for isKey matching — accept "caecilian" and "slip"; do NOT name a trick "caecilian" or "slip" or "wait" or "wake" or "still" or "hide" or "cover" or "wiggle" or "dart" or "trail" or "paddle" or "ring" or "salamander" or "dapple" or "newt" or "eft" or "frog" or "toad" or "reed" or "pebble" or "gular" or "lentic" or "verruca" or "bufonid" or "gill" or "hop" or "puff" or "dig" or "tentacle" or "fossor" or "warning" or "cirrus" or "vernal") — not Dapple Ambystomatidae spotted-salamander, not Eft Salamandridae Crested/smooth-newt, not Pebble Bufonidae American-toad, not Reed Anura green-frog, not Arca sealed-vault, not Bloom axolotl, not Ink turtle, not Hush shade-umbra, not Beacon field-magnet, not Brine salt-brine, not Knot junction-weave, not Dusk twilight-belt, not Shard living-crystal, not Drift methane-cloud, not Choir chord-body, not Gleam lamp-drinker, not Blush rosy-boa; never named wait / wake / still / hide / cover / wiggle / dart / trail / paddle / ring / slip / caecilian / salamander / dapple / newt / eft / frog / toad / reed / pebble / crest / caudal / filament / costal / caudate / hedonic / aposematic / maculate / litter / cutaneous / nasolabial / ambystomid / mental / granular / gular / nictitate / tympanum / iliac / lentic / toepad / webbing / verruca / burrow / parotoid / tubercle / bufonid / unken / cranial / gill / amble / mend / smile / plume / tentacle / fossor / warning / cirrus / vernal / hop / puff / dig / freeze — Echo/Quill birds — do not copy. annulate ringed body flex without naming ring or slip, fossorial silt swim-burrow undulation without naming burrow or dig or fossor, tentacular chemosensory tip-sniff without naming tentacle or nasolabial, hydrostatic body push without naming heave or earth, gymnophion long limbless metabolic hold under silt, stegos stegokrotaphic solid-skull settle (THE Gymnophiona cranial tell), dualjaw dual jaw-closing levator/interhyoideus bite press (THE caecilian jaw apparatus tell); annular / silted / glossed thank-yous. Feed-happy after eat. Card-open freeze and window-play RING do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop caecilian-tricks.js. Window-play RING unchanged. Ethogram softs + freeze — never names slip/ring/still/wiggle as trick kinds. Hinge owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights (GYMNOPHION_HOLD=11.2 RELEASE_S=1.18). Next leftover Whorl / pond_snail. prefersHouseCry via caecilian.wav. */
(function (root) {
  const TRICK_KEY = "caecilian";
  const TRICKS = ["annulate", "fossorial", "tentacular", "hydrostatic", "gymnophion", "stegos", "dualjaw"];
  const HAPPY = ["annular", "silted", "glossed"];
  const HAPPY_DUR = { annular: 1.64, silted: 1.76, glossed: 1.71 };
  const GYMNOPHION_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    gymnophion: GYMNOPHION_HOLD + RELEASE_S,
    annulate: 2.32,
    fossorial: 2.48,
    tentacular: 2.36,
    hydrostatic: 2.42,
    stegos: 2.38,
    dualjaw: 2.34,
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
    if (kind === "gymnophion") return 40 + roll * 26;
    if (kind === "stegos" || kind === "dualjaw") return 12.8 + roll * 9.4;
    if (kind === "annulate" || kind === "fossorial" || kind === "tentacular" || kind === "hydrostatic") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "gymnophion";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "gymnophion" ? 0.72 : k === "stegos" || k === "dualjaw" ? 1.28 : k === "annulate" || k === "fossorial" || k === "tentacular" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "annulate";
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
    return key === TRICK_KEY || key === "slip";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "annular";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "annular" ? "sit" : name === "silted" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function annularPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.annular));
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

  function siltedPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.silted));
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

  function glossedPose(t) {
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
    if (next.kind === "annular") {
      const pose = annularPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "silted") {
      const pose = siltedPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = glossedPose(next.t);
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
      kind === "gymnophion"
        ? "sit"
        : kind === "annulate"
          ? "play"
          : kind === "fossorial"
            ? "walk"
            : kind === "tentacular"
              ? "sit"
              : kind === "hydrostatic"
                ? "sit"
                : kind === "stegos"
                  ? "sit"
                  : kind === "dualjaw"
                    ? "play"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? kind : "annulate",
      phase: kind === "gymnophion" ? "hold" : "go",
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

  function gymnophionPose(t) {
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

  function annulatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.annulate));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.84, rot: s * -9.6 * facing, anim: "play" };
    }
    if (u < 0.48) {
      const s = (u - 0.16) / 0.32;
      const coin = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * coin * 0.144,
        lift: 3.84 + Math.abs(coin) * 1.68,
        rot: facing * (-9.6 + coin * 16.8),
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

  function fossorialPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fossorial));
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

  function tentacularPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tentacular));
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

  function hydrostaticPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hydrostatic));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.12) / 0.66;
      const groove = Math.sin(s * Math.PI * 2.55);
      const crawl = Math.sin(s * Math.PI * 1.15);
      return {
        x: fromX + facing * crawl * 0.264,
        lift: 3.12 + Math.abs(crawl) * 1.56 + Math.abs(groove) * 0.84,
        rot: facing * (12 + crawl * 14.4 + groove * 9.6),
        anim: "sit",
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

  function stegosPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stegos));
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

  function dualjawPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dualjaw));
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
    if (next.kind === "gymnophion") {
      if (next.t < GYMNOPHION_HOLD) {
        const pose = gymnophionPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < GYMNOPHION_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - GYMNOPHION_HOLD);
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
    if (next.kind === "annulate") pose = annulatePose(next.t, fromX, trick.facing);
    else if (next.kind === "fossorial") pose = fossorialPose(next.t, fromX, trick.facing);
    else if (next.kind === "tentacular") pose = tentacularPose(next.t, fromX, trick.facing);
    else if (next.kind === "hydrostatic") pose = hydrostaticPose(next.t, fromX, trick.facing);
    else if (next.kind === "stegos") pose = stegosPose(next.t, fromX, trick.facing);
    else pose = dualjawPose(next.t, fromX, trick.facing);
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
    GYMNOPHION_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    gymnophionPose,
    releasePose,
    annulatePose,
    fossorialPose,
    tentacularPose,
    hydrostaticPose,
    stegosPose,
    dualjawPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    annularPose,
    siltedPose,
    glossedPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCaecilianTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
