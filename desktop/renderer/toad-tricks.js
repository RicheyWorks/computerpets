/** Pebble ground tricks while idle — ultra-polish pass. House neighborly Bufonidae American-toad desk life — verruca / burrow / parotoid / tubercle / bufonid / unken / cranial personality (warty short-hop jolt, fossorial dig-in, parotoid gland hush, metatarsal tubercle scrape, plump dry-dish hold, unkenreflex arch, cranial-crest tip — never named wait or wake or still or hop or puff or pebble or dig or toad or frog or reed or gular or nictitate or tympanum or iliac or lentic or toepad or webbing or bank or blotter or plop or stone or crevice or rosy or mesa or arroyo as trick kinds; window-play PUFF owns puff; window-play leave pebble owns the leave word; ethogram-old hop/puff/still own those words; Blush rosy_boa owns pebble as a trick; MiningBee/window DIG own dig; Reed owns gular/nictitate/tympanum/iliac/lentic/toepad/webbing; guest slug Pebble / key toad only for isKey matching — accept "toad" and "pebble"; do NOT name a trick "toad" or "pebble" or "wait" or "wake" or "still" or "hop" or "puff" or "dig" or "frog" or "reed" or "gular" or "lentic" or "plop" or "bank" or "blotter" or "stone" or "crevice" or "unken-as-wait" or "cranial-as-hop") — not Reed gular/nictitate/tympanum/iliac/lentic/toepad/webbing Anura green-frog, not Arca lorica/tegument/ampoule/bradyzoite/cryptobiosis sealed-vault, not Bloom gill/amble/mend/smile/plume axolotl, not Ink soak/tuck/crane/plod/paddle turtle, not Hush silhouette/adumbrate/occultation/antumbra/caligo shade-umbra, not Beacon lodestone/flux/azimuth/dipole/remanence field-magnet, not Brine salt-brine, not Knot junction-weave, not Dusk twilight-belt, not Shard living-crystal, not Drift methane-cloud, not Choir chord-body, not Gleam lamp-drinker, not Blush pebble/crevice/rosy/mesa/arroyo rosy-boa; never named wait / wake / still / hop / puff / pebble / dig / toad / frog / reed / gular / nictitate / tympanum / iliac / lentic / toepad / webbing / chorus / rivulet / spring / lorica / tegument — Echo/Quill birds — do not copy. verruca warty short-hop jolt without naming hop, burrow fossorial dig-in without naming dig, parotoid parotoid-gland hush without naming puff, tubercle metatarsal-tubercle scrape-push, bufonid plump dry-dish metabolic hold, unken unkenreflex belly-arch (THE bufonid defensive-display tell), cranial cranial-crest tip (THE Anaxyrus americanus crest tell); loam / knurl / plump thank-yous. Feed-happy after eat. Card-open freeze and window-play PUFF do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop toad-tricks.js. Window-play PUFF unchanged. Ethogram softs + freeze — never names hop/puff/still as trick kinds. Pinch owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via toad.wav. */
(function (root) {
  const TRICK_KEY = "toad";
  const TRICKS = ["verruca", "burrow", "parotoid", "tubercle", "bufonid", "unken", "cranial"];
  const HAPPY = ["loam", "knurl", "plump"];
  const HAPPY_DUR = { loam: 1.62, knurl: 1.74, plump: 1.69 };
  const BUFONID_HOLD = 10.8;
  const RELEASE_S = 1.14;
  const DUR = {
    bufonid: BUFONID_HOLD + RELEASE_S,
    verruca: 2.28,
    burrow: 2.42,
    parotoid: 2.34,
    tubercle: 2.38,
    unken: 2.36,
    cranial: 2.31,
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
    if (kind === "bufonid") return 38 + roll * 24;
    if (kind === "unken" || kind === "cranial" || kind === "parotoid") return 12 + roll * 9;
    if (kind === "verruca" || kind === "burrow" || kind === "tubercle") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "bufonid";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "bufonid") {
      if (roll < 0.16) return "verruca";
      if (roll < 0.32) return "burrow";
      if (roll < 0.48) return "parotoid";
      if (roll < 0.64) return "tubercle";
      if (roll < 0.82) return "unken";
      return "cranial";
    }
    if (lastKind === "verruca") {
      if (roll < 0.16) return "bufonid";
      if (roll < 0.32) return "burrow";
      if (roll < 0.48) return "parotoid";
      if (roll < 0.64) return "tubercle";
      if (roll < 0.82) return "unken";
      return "cranial";
    }
    if (lastKind === "burrow") {
      if (roll < 0.14) return "bufonid";
      if (roll < 0.3) return "verruca";
      if (roll < 0.46) return "parotoid";
      if (roll < 0.62) return "tubercle";
      if (roll < 0.8) return "unken";
      return "cranial";
    }
    if (lastKind === "unken" || lastKind === "cranial") {
      if (roll < 0.14) return "bufonid";
      if (roll < 0.3) return "verruca";
      if (roll < 0.46) return "burrow";
      if (roll < 0.62) return "parotoid";
      if (roll < 0.78) return "tubercle";
      return lastKind === "unken" ? "cranial" : "unken";
    }
    if (roll < 0.14) return "bufonid";
    if (roll < 0.28) return "verruca";
    if (roll < 0.42) return "burrow";
    if (roll < 0.56) return "parotoid";
    if (roll < 0.7) return "tubercle";
    if (roll < 0.85) return "unken";
    return "cranial";
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
    return key === TRICK_KEY || key === "pebble";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const roll = rand == null ? Math.random() : rand;
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    return list[Math.floor(roll * list.length) % list.length];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "loam";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "loam" ? "sit" : name === "knurl" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function loamPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.loam));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      const tick = Math.sin(t * 1.72);
      return {
        lift: 2.8 + Math.abs(tick) * 1.4,
        rot: 12 + tick * 8,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function knurlPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.knurl));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 3.4, rot: s * -14, dx: s * 0.15, anim: "play" };
    }
    if (u < 0.84) {
      const wart = Math.sin(t * 2.1);
      return {
        lift: 3.4 + Math.abs(wart) * 1.6,
        rot: -14 + wart * 10,
        dx: 0.08,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function plumpPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.52) * 6,
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
    if (next.kind === "loam") {
      const pose = loamPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "knurl") {
      const pose = knurlPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = plumpPose(next.t);
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
      kind === "bufonid"
        ? "sit"
        : kind === "verruca"
          ? "play"
          : kind === "burrow"
            ? "sit"
            : kind === "parotoid"
              ? "sit"
              : kind === "tubercle"
                ? "walk"
                : kind === "unken"
                  ? "play"
                  : kind === "cranial"
                    ? "talk"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? kind : "verruca",
      phase: kind === "bufonid" ? "hold" : "go",
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

  function bufonidPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.14) * 4,
      anim: "sit",
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function verrucaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.verruca));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "play" };
    }
    if (u < 0.48) {
      const s = (u - 0.16) / 0.32;
      const jolt = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * jolt * 0.35,
        lift: 3.2 + Math.abs(jolt) * 1.4,
        rot: facing * (-8 + jolt * 14),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const wart = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX,
        lift: 2.2 + Math.abs(wart) * 0.9,
        rot: facing * (4 + wart * 8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "idle",
    };
  }

  function burrowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.burrow));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 1.6, rot: s * 8 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.14) / 0.56;
      const dig = Math.sin(s * Math.PI * 3.4);
      const sink = smoothstep(s);
      return {
        x: fromX + facing * dig * 0.12,
        lift: 1.6 - sink * 2.4 + Math.abs(dig) * 0.5,
        rot: facing * (8 + dig * 10 - sink * 4),
        anim: "sit",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.7) / 0.18;
      const hold = smoothstep(s);
      return {
        x: fromX,
        lift: -0.6 + hold * 0.4,
        rot: facing * (2 - hold * 3),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: -0.2 * (1 - s),
      rot: facing * (-0.8 * (1 - s)),
      anim: "idle",
    };
  }

  function parotoidPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.parotoid));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.4, rot: s * -6 * facing, anim: "sit" };
    }
    if (u < 0.74) {
      const s = (u - 0.16) / 0.58;
      const gland = Math.sin(s * Math.PI * 1.65);
      const hush = smoothstep(Math.min(1, s * 1.2));
      return {
        x: fromX,
        lift: 2.4 + hush * 1.2 + Math.abs(gland) * 0.7,
        rot: facing * (-6 + hush * 5 + gland * 4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "idle",
    };
  }

  function tuberclePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tubercle));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const s = (u - 0.12) / 0.66;
      const scrape = Math.sin(s * Math.PI * 2.55);
      const push = Math.sin(s * Math.PI * 1.15);
      return {
        x: fromX + facing * push * 0.22,
        lift: 2.6 + Math.abs(push) * 1.3 + Math.abs(scrape) * 0.7,
        rot: facing * (10 + push * 12 + scrape * 8),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: facing * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function unkenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.unken));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.8, rot: s * 12 * facing, anim: "play" };
    }
    if (u < 0.42) {
      const s = (u - 0.16) / 0.26;
      const arch = smoothstep(s);
      return {
        x: fromX,
        lift: 2.8 + arch * 1.6,
        rot: facing * (12 + arch * 16),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.42) / 0.36;
      const hold = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX,
        lift: 4.2 + Math.abs(hold) * 0.6,
        rot: facing * (24 + hold * 4),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.0 * (1 - s),
      rot: facing * (8 * (1 - s)),
      anim: "idle",
    };
  }

  function cranialPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cranial));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.2, rot: s * -10 * facing, anim: "talk" };
    }
    if (u < 0.4) {
      const s = (u - 0.14) / 0.26;
      const tip = smoothstep(s);
      return {
        x: fromX,
        lift: 2.2 + tip * 1.2,
        rot: facing * (-10 - tip * 8),
        anim: "talk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.4) / 0.38;
      const crest = Math.sin(s * Math.PI * 3.1);
      return {
        x: fromX + facing * crest * 0.08,
        lift: 3.2 + Math.abs(crest) * 0.7,
        rot: facing * (-16 + crest * 6),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.5 * (1 - s),
      rot: facing * (-4 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (shouldAbort(flags)) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "bufonid") {
      if (next.t < BUFONID_HOLD) {
        const pose = bufonidPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < BUFONID_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BUFONID_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    if (next.kind === "verruca") {
      const pose = verrucaPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "burrow") {
      const pose = burrowPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "parotoid") {
      const pose = parotoidPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tubercle") {
      const pose = tuberclePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "unken") {
      const pose = unkenPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cranialPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX });
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    BUFONID_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    bufonidPose,
    releasePose,
    verrucaPose,
    burrowPose,
    parotoidPose,
    tuberclePose,
    unkenPose,
    cranialPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    loamPose,
    knurlPose,
    plumpPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetToadTricks = api;
})(typeof window !== "undefined" ? window : globalThis);

