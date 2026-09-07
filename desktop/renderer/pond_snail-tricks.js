/** Whorl ground tricks while idle. House neighborly Lymnaea/Physa great-pond-snail desk life — radula / pedal / pneumostome / ommatophore / lymnaeid personality (radula biofilm scrape without naming rasp or scrape or grind, pedal muscular-foot glide without naming crawl or trail or mucus, pneumostome air-lung surface rise without naming breath or surfacing or float, ommatophore eye-stalk tip probe without naming antenna or tentacular or fringe or tap, long lymnaeid Lymnaea desk hold under the film grain — never named wait or wake or still or hide or cover or wiggle or rasp or crawl or trail or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or mantle or sucker or jet or burrow or dig or flip or claw or snap or pinch or annulate or fossorial or tentacular or hydrostatic or gymnophion; window-play Rasp owns rasp; ethogram walk/still own those words; special Whorl owns whorl; Chamber owns spiral/siphuncle/nacre/pinhole/fringe; Tenant owns swap/antenna/scuttle/withdraw/vacancy; Pinch owns chelate/caridoid/chimney/antennule/astacid; Cup owns mantle; Pulse owns trail; Auger owns rasp; Slip owns tentacular/annulate/fossorial/hydrostatic/gymnophion; Pebble owns burrow; guest slug Whorl / key pond_snail only for isKey matching — accept "pond_snail" and "whorl"; do NOT name a trick "pond_snail" or "whorl" or "rasp" or "spiral" or "antenna" or "mantle" or "trail" or "crawl" or "chelate" or "chimney" or "astacid") — not Chamber nautilus shell life, not Tenant hermit shell life, not Pinch crayfish claw life. radula radular scrape on the tray film without naming rasp, pedal foot-glide without naming crawl or trail, pneumostome pulmonate air-lung rise without naming breath, ommatophore eye-stalk probe without naming antenna, lymnaeid long Lymnaea metabolic hold under the scrap film with stagnalis / physa / radix cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play Rasp do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop pond_snail-tricks.js. Window-play Rasp unchanged — never names rasp. Ethogram still/walk unchanged — never names still or walk as trick kinds. True Lymnaea/Physa great pond snail desk life only — distinct from Chamber nautilus, Tenant hermit, and Pinch crayfish. Hinge owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "pond_snail";
  const TRICKS = ["radula", "pedal", "pneumostome", "ommatophore", "lymnaeid"];
  const HAPPY = ["stagnalis", "physa", "radix"];
  const HAPPY_DUR = { stagnalis: 1.58, physa: 1.72, radix: 1.64 };
  const LYMNAEID_HOLD = 18.42;
  const RELEASE_S = 1.12;
  const DUR = { lymnaeid: LYMNAEID_HOLD + RELEASE_S, radula: 2.28, pedal: 2.36, pneumostome: 2.62, ommatophore: 2.18 };

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
      if (kind === "lymnaeid") return 76 + roll * 46;
  if (kind === "radula") return 16.4 + roll * 12.8;
  if (kind === "pedal") return 18.6 + roll * 13.2;
  if (kind === "ommatophore") return 21.8 + roll * 14.6;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "lymnaeid";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "lymnaeid") {
      if (roll < 0.26) return "radula";
      if (roll < 0.5) return "pedal";
      if (roll < 0.74) return "pneumostome";
      return "ommatophore";
    }
    if (lastKind === "radula") {
      if (roll < 0.26) return "lymnaeid";
      if (roll < 0.5) return "pedal";
      if (roll < 0.74) return "pneumostome";
      return "ommatophore";
    }
    if (lastKind === "pedal") {
      if (roll < 0.22) return "lymnaeid";
      if (roll < 0.44) return "radula";
      if (roll < 0.68) return "pneumostome";
      return "ommatophore";
    }
    if (roll < 0.2) return "lymnaeid";
    if (roll < 0.4) return "radula";
    if (roll < 0.6) return "pedal";
    if (roll < 0.8) return "pneumostome";
    return "ommatophore";
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
    return key === TRICK_KEY || key === "whorl";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "stagnalis";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "stagnalis" ? "sit" : name === "physa" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function stagnalisPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.stagnalis));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.022, rot: s * 1.15, dx: 0, anim: "sit" };
    }
    if (u < 0.80) {
      const flash = Math.sin(t * 7.4) + 0.28 * Math.sin(t * 14.8);
      return {
        lift: 0.022 + Math.abs(flash) * 0.014,
        rot: 1.15 + flash * 1.25,
        dx: flash * 0.0010,
        anim: "sit",
      };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.008 * (1 - s), rot: 0.40 * (1 - s), dx: 0, anim: "idle" };
  }
  function physaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.physa));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.028, rot: s * -1.45, dx: s * 0.0014, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 5.1) + 0.20 * Math.sin(t * 9.3);
      return {
        lift: 0.028 + Math.abs(wriggle) * 0.020,
        rot: -1.45 + wriggle * 2.65,
        dx: wriggle * 0.0024,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.010 * (1 - s), rot: -0.40 * (1 - s), dx: 0, anim: "sit" };
  }
  function radixPose(t) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.36)) * 0.015,
      rot: Math.sin(t * 0.39) * 0.92,
      dx: Math.sin(t * 0.28) * 0.0011,
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
    if (next.kind === "stagnalis") {
      const pose = stagnalisPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "physa") {
      const pose = physaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = radixPose(next.t);
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
      kind === "lymnaeid"
    ? "sit"
    : kind === "radula"
      ? "play"
      : kind === "pedal"
        ? "walk"
        : kind === "pneumostome"
          ? "sit"
          : kind === "ommatophore"
            ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "lymnaeid" ? "hold" : "go",
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


                      function lymnaeidPose(t) {
    const breath = Math.sin(t * 0.12) + 0.06 * Math.sin(t * 0.33);
    const soft = Math.abs(Math.sin(t * 0.17));
    return {
      lift: 0.003 + soft * 0.011,
      rot: -0.22 + breath * 0.48,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function radulaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.radula));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.022, rot: s * 1.8 * face, anim: "play" };
    }
    if (u < 0.78) {
      // chelate claw-snap pulses
      const snap = Math.sin(t * 8.2) + 0.30 * Math.sin(t * 16.4);
      const bite = snap > 0.35 ? 1.0 : snap < -0.35 ? -0.55 : snap * 0.4;
      return {
        x: fromX + face * bite * 0.006,
        lift: 0.022 + Math.abs(snap) * 0.016,
        rot: (1.8 + bite * 2.4) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX, lift: 0.008 * (1 - s), rot: 0.35 * (1 - s) * face, anim: "idle" };
  }
  function pedalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pedal));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.010, rot: s * 0.55 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const s = smoothstep((u - 0.12) / 0.66);
      // pedal foot glide forward on the blotter film
      const wave = Math.sin(s * Math.PI * 3.1);
      return {
        x: fromX + face * (0.02 + s * 0.11),
        lift: 0.010 + Math.abs(wave) * 0.008,
        rot: (0.55 + wave * 0.85) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.13 * (1 - s),
      lift: 0.006 * (1 - s),
      rot: 0.20 * (1 - s) * face,
      anim: "idle",
    };
  }
  function pneumostomePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pneumostome));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      // rise toward the film surface to open the pneumostome
      return { x: fromX + face * s * 0.008, lift: s * 0.062, rot: s * -0.65 * face, anim: "sit" };
    }
    if (u < 0.70) {
      const s = (u - 0.18) / 0.52;
      const sip = Math.sin(s * Math.PI * 2.2) + 0.12 * Math.sin(s * Math.PI * 4.4);
      return {
        x: fromX + face * (0.008 + sip * 0.005),
        lift: 0.062 + Math.abs(sip) * 0.012,
        rot: (-0.65 + sip * 0.75) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.70) / 0.30);
    return {
      x: fromX + face * 0.008 * (1 - s),
      lift: 0.062 * (1 - s),
      rot: -0.22 * (1 - s) * face,
      anim: s > 0.6 ? "idle" : "sit",
    };
  }
  function ommatophorePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ommatophore));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.008, rot: s * 0.95 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const tap = Math.sin(t * 6.8) + 0.22 * Math.sin(t * 13.6);
      return {
        x: fromX + face * tap * 0.0035,
        lift: 0.008 + Math.abs(tap) * 0.006,
        rot: (0.95 + tap * 1.55) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: 0.004 * (1 - s), rot: 0.25 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "radula" && trick.kind !== "pedal" && trick.kind !== "pneumostome" && trick.kind !== "ommatophore") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "lymnaeid") {
      if (next.t < LYMNAEID_HOLD) {
        const pose = lymnaeidPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LYMNAEID_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LYMNAEID_HOLD);
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
    if (next.kind === "radula") {
      const pose = radulaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pedal") {
      const pose = pedalPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pneumostome") {
      const pose = pneumostomePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = ommatophorePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LYMNAEID_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    lymnaeidPose,
    releasePose,
    radulaPose,
    pedalPose,
    pneumostomePose,
    ommatophorePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    stagnalisPose,
    physaPose,
    radixPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPondSnailTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
