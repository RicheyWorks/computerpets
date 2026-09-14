/** Whorl ground tricks while idle — ultra-polish pass. House neighborly Lymnaea/Physa great-pond-snail desk life — radula / pedal / pneumostome / ommatophore / lymnaeid / odontophore / neuston personality (radula biofilm scrape without naming rasp or scrape or grind, pedal muscular-foot glide without naming crawl or trail or mucus, pneumostome air-lung surface rise without naming breath or surfacing or float, ommatophore eye-stalk tip probe without naming antenna or tentacular or fringe or tap, long lymnaeid Lymnaea desk hold under the film grain, odontophore odontophore cartilage pulse without naming radula or buccal or grind, neuston inverted surface-film cling without naming crawl or float or trail — never named wait or wake or still or hide or cover or wiggle or rasp or crawl or trail or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or scaph or meral or mantle or sucker or jet or burrow or dig or flip or claw or snap or pinch or adductor or protractor or inhalant or ctenidium or unionid or annulate or fossorial or tentacular or hydrostatic or gymnophion or stegos or dualjaw as trick kinds; window-play Rasp owns rasp; ethogram softs + freeze own those words; special Whorl owns whorl; Chamber owns spiral/siphuncle/nacre/pinhole/fringe/aperture; Tenant owns swap/antenna/scuttle/withdraw/vacancy; Pinch owns chelate/caridoid/chimney/antennule/astacid/scaph/meral; Hinge owns adductor/protractor/inhalant/ctenidium/unionid; Cup owns mantle; Pulse owns trail; Auger owns rasp; Slip owns tentacular/annulate/fossorial/hydrostatic/gymnophion/stegos/dualjaw; Pebble owns burrow; guest slug Whorl / key pond_snail only for isKey matching — accept "pond_snail" and "whorl"; do NOT name a trick "pond_snail" or "whorl" or "rasp" or "spiral" or "antenna" or "mantle" or "trail" or "crawl" or "chelate" or "chimney" or "astacid" or "scaph" or "meral" or "adductor" or "unionid") — not Chamber nautilus shell life, not Tenant hermit shell life, not Pinch crayfish claw life, not Hinge mussel valve life. radula radular scrape on the tray film without naming rasp, pedal foot-glide without naming crawl or trail, pneumostome pulmonate air-lung rise without naming breath, ommatophore eye-stalk probe without naming antenna, lymnaeid long Lymnaea metabolic hold under the scrap film, odontophore odontophore cartilage pulse (THE molluscan buccal tell), neuston inverted surface-film cling (THE aquarium-glass / pond-film tell); stagnalis / physa / radix thank-yous. Feed-happy after eat. Card-open freeze and window-play Rasp do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop pond_snail-tricks.js. Window-play Rasp unchanged. Ethogram softs + freeze — never names rasp/still/wiggle as trick kinds. Hinge owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via pond_snail.wav. */
(function (root) {
  const TRICK_KEY = "pond_snail";
  const TRICKS = ["radula", "pedal", "pneumostome", "ommatophore", "lymnaeid", "odontophore", "neuston"];
  const HAPPY = ["stagnalis", "physa", "radix"];
  const HAPPY_DUR = { stagnalis: 1.64, physa: 1.76, radix: 1.71 };
  const LYMNAEID_HOLD = 10.8;
  const RELEASE_S = 1.14;
  const DUR = {
    lymnaeid: LYMNAEID_HOLD + RELEASE_S,
    radula: 2.28,
    pedal: 2.42,
    pneumostome: 2.48,
    ommatophore: 2.34,
    odontophore: 2.36,
    neuston: 2.31,
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
    if (kind === "lymnaeid") return 38 + roll * 24;
    if (kind === "odontophore" || kind === "neuston" || kind === "radula") return 12 + roll * 9;
    if (kind === "pedal" || kind === "pneumostome" || kind === "ommatophore") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "lymnaeid";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "lymnaeid") {
      if (roll < 0.16) return "radula";
      if (roll < 0.32) return "pedal";
      if (roll < 0.48) return "pneumostome";
      if (roll < 0.64) return "ommatophore";
      if (roll < 0.82) return "odontophore";
      return "neuston";
    }
    if (lastKind === "radula") {
      if (roll < 0.16) return "lymnaeid";
      if (roll < 0.32) return "pedal";
      if (roll < 0.48) return "pneumostome";
      if (roll < 0.64) return "ommatophore";
      if (roll < 0.82) return "odontophore";
      return "neuston";
    }
    if (lastKind === "pedal") {
      if (roll < 0.14) return "lymnaeid";
      if (roll < 0.3) return "radula";
      if (roll < 0.46) return "pneumostome";
      if (roll < 0.62) return "ommatophore";
      if (roll < 0.8) return "odontophore";
      return "neuston";
    }
    if (lastKind === "odontophore" || lastKind === "neuston") {
      if (roll < 0.14) return "lymnaeid";
      if (roll < 0.3) return "radula";
      if (roll < 0.46) return "pedal";
      if (roll < 0.62) return "pneumostome";
      if (roll < 0.78) return "ommatophore";
      return lastKind === "odontophore" ? "neuston" : "odontophore";
    }
    if (roll < 0.14) return "lymnaeid";
    if (roll < 0.28) return "radula";
    if (roll < 0.42) return "pedal";
    if (roll < 0.56) return "pneumostome";
    if (roll < 0.7) return "ommatophore";
    if (roll < 0.85) return "odontophore";
    return "neuston";
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
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 1.72);
      return {
        lift: 2.8 + Math.abs(flash) * 1.4,
        rot: 12 + flash * 8,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function physaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.physa));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 3.4, rot: s * -14, dx: s * 0.15, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 2.1);
      return {
        lift: 3.4 + Math.abs(wriggle) * 1.6,
        rot: -14 + wriggle * 10,
        dx: 0.08,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function radixPose(t) {
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
                : kind === "odontophore"
                  ? "play"
                  : kind === "neuston"
                    ? "walk"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? kind : "radula",
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

  function radulaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.radula));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.2, rot: s * 14 * face, anim: "play" };
    }
    if (u < 0.78) {
      const snap = Math.sin(t * 2.4);
      return {
        x: fromX + face * snap * 0.12,
        lift: 3.2 + Math.abs(snap) * 1.4,
        rot: face * (14 + snap * 10),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: face * (4 * (1 - s)),
      anim: "idle",
    };
  }

  function pedalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pedal));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.6, rot: s * -16 * face, anim: "walk" };
    }
    if (u < 0.48) {
      const s = smoothstep((u - 0.12) / 0.36);
      return {
        x: fromX - face * (2.2 + s * 4.5),
        lift: 3.6 + Math.sin(s * Math.PI) * 2.2,
        rot: face * (-16 + s * 22),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const settle = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX - face * (6.7 * (1 - s)),
        lift: 2.4 + Math.abs(settle) * 1.1,
        rot: face * (6 + settle * 8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function pneumostomePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pneumostome));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.8, lift: s * 2.2, rot: s * 8 * face, anim: "sit" };
    }
    if (u < 0.72) {
      const mud = Math.sin(t * 1.6);
      return {
        x: fromX + face * (0.8 + mud * 0.4),
        lift: 2.2 + Math.abs(mud) * 1.0,
        rot: face * (8 + mud * 10),
        anim: "idle",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: s > 0.6 ? "idle" : "sit",
    };
  }

  function ommatophorePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ommatophore));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.4, rot: s * 10 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const tap = Math.sin(t * 2.8);
      return {
        x: fromX + face * tap * 0.2,
        lift: 2.4 + Math.abs(tap) * 1.1,
        rot: face * (10 + tap * 12),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function odontophorePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.odontophore));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "play" };
    }
    if (u < 0.55) {
      const pulse = Math.sin(t * 3.2);
      return {
        x: fromX,
        lift: 2.8 + pulse * 1.6,
        rot: face * (12 + pulse * 14),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const scent = Math.sin(t * 1.1);
      return {
        x: fromX + face * scent * 0.15,
        lift: 4.0 + Math.abs(scent) * 0.6,
        rot: face * (22 + scent * 4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.0 * (1 - s),
      rot: face * (8 * (1 - s)),
      anim: "idle",
    };
  }

  function neustonPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.neuston));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "walk" };
    }
    if (u < 0.55) {
      const flash = Math.abs(Math.sin(t * 2.6));
      return {
        x: fromX + face * flash * 0.2,
        lift: 3.4 + flash * 1.4,
        rot: face * (-12 - flash * 10),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const warn = Math.sin(t * 1.4);
      return {
        x: fromX,
        lift: 4.4 + Math.abs(warn) * 0.7,
        rot: face * (-18 + warn * 6),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.8 * (1 - s),
      rot: face * (-5 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (shouldAbort(flags)) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "lymnaeid") {
      if (next.t < LYMNAEID_HOLD) {
        const pose = lymnaeidPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
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
    if (next.kind === "radula") {
      const pose = radulaPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pedal") {
      const pose = pedalPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pneumostome") {
      const pose = pneumostomePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ommatophore") {
      const pose = ommatophorePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "odontophore") {
      const pose = odontophorePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = neustonPose(next.t, fromX, trick.facing);
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
    odontophorePose,
    neustonPose,
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
