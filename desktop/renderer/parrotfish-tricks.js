/** Scrape ground tricks while idle — ultra-polish pass. House neighborly Stoplight Parrotfish Sparisoma viride / Scaridae parrotfish desk life (parrotfish / Scrape) — pectoralhover / mucuscocoonnightsettle / sandpooppuffcue / beakscrapegraze / pharyngealmill / greenphaseflash / scarushush personality (pectoralhover pectoral-fin hover without naming pectoral or hover or swim alone as wait; mucuscocoonnightsettle mucus-cocoon night settle without naming mucus or cocoon or night alone as wait — desk-safe night-shelter tell; sandpooppuffcue sand-poop reef-building puff cue without naming sand or poop or puff alone as wait — Scaridae bioerosion tell; beakscrapegraze beak scrape graze without naming beak or scrape or graze alone as wait — algal film graze; pharyngealmill pharyngeal-jaw beak grind without naming grind or jaw or chew alone as wait — Scaridae mill tell; greenphaseflash terminal-phase green flash without naming green or phase or flash alone as wait — Sparisoma viride color tell; long scarushush Scarus/Scaridae hush hold (THE scarushush sit_hold tell) — never named wait or crouch or sit or still or parrotfish or scrape or swim as bare ethogram-only trick kinds; Paint clownfish owns wiggledancehostcue/darthideinanemone/amphiprionhush — do NOT reuse; Wreath anemone owns oraldiskwreathsway/nematocysttuck/actiniahush — do NOT reuse; Ridge brain_coral owns meandroidridgepulse/polyptentaclewave/diploriahush — do NOT reuse; goldfish Coin owns drift/gulp/flare — do NOT reuse; bird Parrot guest is separate — do NOT reuse; Scrub cleaner_shrimp comes next — do NOT start; guest slug Scrape / key parrotfish only for wantsThankYou matching — accept "parrotfish" and "scrape"; do NOT name a trick "parrotfish" or "scrape" or "parrot" or "clownfish" or "paint" or "anemone" or "wreath" or "brain_coral" or "ridge" or "coral" or "goldfish" or "coin" or "cleaner_shrimp" or "scrub"; not Paint Amphiprion life, not Wreath Actiniaria life, not Ridge Diploria life, not Coin Carassius life, not Scrub cleaner-shrimp life, not Rui. Pectoralhover / mucuscocoonnightsettle / sandpooppuffcue / beakscrapegraze / pharyngealmill / greenphaseflash / scarushush; densscrape / inkscrape / densscarus thank-yous. Same map as web parrotfish-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names scrape/swim/still/walk/sit/wait/parrotfish as bare ethogram-only trick kinds. True Stoplight Parrotfish Sparisoma viride desk life only — pectoral hover, mucus cocoon night settle, sand-poop puff cue, beak scrape graze, beak grind, green-phase flash, Scarus hush. Next house-order ultra: Scrub / cleaner_shrimp. No cry inventing — parrotfish.wav EXISTS so prefersHouseCry adds parrotfish after clownfish. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "parrotfish";
  const TRICKS = ["pectoralhover", "mucuscocoonnightsettle", "sandpooppuffcue", "beakscrapegraze", "pharyngealmill", "greenphaseflash", "scarushush"];
  const HAPPY = ["densscrape", "inkscrape", "densscarus"];

  const HAPPY_DUR = { densscrape: 1.70, inkscrape: 1.84, densscarus: 1.76 };
  const SCARUSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    scarushush: SCARUSHUSH_HOLD + RELEASE_S,
    pectoralhover: 2.48,
    mucuscocoonnightsettle: 2.42,
    sandpooppuffcue: 2.40,
    beakscrapegraze: 2.44,
    pharyngealmill: 2.38,
    greenphaseflash: 2.56,
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
    if (kind === "scarushush") return 40 + roll * 26;
    if (kind === "pharyngealmill" || kind === "pectoralhover" || kind === "greenphaseflash") return 12.8 + roll * 9.4;
    if (kind === "sandpooppuffcue" || kind === "mucuscocoonnightsettle" || kind === "beakscrapegraze") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "scarushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "scarushush") {
      if (roll < 0.17) return "pectoralhover";
      if (roll < 0.33) return "mucuscocoonnightsettle";
      if (roll < 0.49) return "sandpooppuffcue";
      if (roll < 0.65) return "beakscrapegraze";
      if (roll < 0.83) return "pharyngealmill";
      return "greenphaseflash";
    }
    if (lastKind === "pectoralhover") {
      if (roll < 0.16) return "scarushush";
      if (roll < 0.32) return "mucuscocoonnightsettle";
      if (roll < 0.48) return "sandpooppuffcue";
      if (roll < 0.64) return "beakscrapegraze";
      if (roll < 0.82) return "pharyngealmill";
      return "greenphaseflash";
    }
    if (lastKind === "mucuscocoonnightsettle") {
      if (roll < 0.14) return "scarushush";
      if (roll < 0.3) return "pectoralhover";
      if (roll < 0.46) return "sandpooppuffcue";
      if (roll < 0.62) return "beakscrapegraze";
      if (roll < 0.8) return "pharyngealmill";
      return "greenphaseflash";
    }
    if (lastKind === "sandpooppuffcue") {
      if (roll < 0.15) return "scarushush";
      if (roll < 0.31) return "pectoralhover";
      if (roll < 0.47) return "mucuscocoonnightsettle";
      if (roll < 0.63) return "beakscrapegraze";
      if (roll < 0.81) return "pharyngealmill";
      return "greenphaseflash";
    }
    if (lastKind === "beakscrapegraze") {
      if (roll < 0.16) return "scarushush";
      if (roll < 0.32) return "pectoralhover";
      if (roll < 0.48) return "mucuscocoonnightsettle";
      if (roll < 0.64) return "sandpooppuffcue";
      if (roll < 0.82) return "pharyngealmill";
      return "greenphaseflash";
    }
    if (lastKind === "pharyngealmill") {
      if (roll < 0.15) return "scarushush";
      if (roll < 0.31) return "pectoralhover";
      if (roll < 0.47) return "mucuscocoonnightsettle";
      if (roll < 0.63) return "sandpooppuffcue";
      if (roll < 0.81) return "beakscrapegraze";
      return "greenphaseflash";
    }
    if (lastKind === "greenphaseflash") {
      if (roll < 0.16) return "scarushush";
      if (roll < 0.32) return "pectoralhover";
      if (roll < 0.48) return "mucuscocoonnightsettle";
      if (roll < 0.64) return "sandpooppuffcue";
      if (roll < 0.82) return "beakscrapegraze";
      return "pharyngealmill";
    }
    if (roll < 0.14) return "scarushush";
    if (roll < 0.28) return "pectoralhover";
    if (roll < 0.42) return "mucuscocoonnightsettle";
    if (roll < 0.56) return "sandpooppuffcue";
    if (roll < 0.7) return "beakscrapegraze";
    if (roll < 0.85) return "pharyngealmill";
    return "greenphaseflash";
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

  function wantsThankYou(key  ) {
    return key === TRICK_KEY || key === "scrape";
  }

  function startThankYou(
    key  ,
    lastKind,
    x,
    facing,
    flags
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = (HAPPY).includes(kind) ? (kind) : "densscrape";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densscrape" ? "sit" : name === "inkscrape" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densscrapePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densscrape));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const flash = Math.sin(t * 2.2);
      return {
        lift: 2.8 + Math.abs(flash) * 1.4,
        rot: 12 + flash * 8,
        dx: flash * 0.08,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function inkscrapePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkscrape));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" };
    }
    if (u < 0.8) {
      const wriggle = Math.sin(t * 2.6);
      return {
        lift: 3.4 + Math.abs(wriggle) * 1.6,
        rot: -14 + wriggle * 10,
        dx: wriggle * 0.12,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function densscarusPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.58) * 8,
      dx: Math.sin(t * 0.4) * 0.06,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densscrape") {
      const pose = densscrapePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkscrape") {
      const pose = inkscrapePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densscarusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "scarushush"
        ? "sit"
        : kind === "pectoralhover"
          ? "sit"
          : kind === "greenphaseflash"
            ? "talk"
            : kind === "mucuscocoonnightsettle"
              ? "play"
              : kind === "sandpooppuffcue"
                ? "sit"
                : kind === "beakscrapegraze"
                  ? "sit"
                  : kind === "pharyngealmill"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "scarushush" ? "hold" : "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim,
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function scarushushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function pectoralhoverPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pectoralhover));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const bar = Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.8 + bar * 0.16),
        lift: 2.8 + Math.abs(bar) * 1.5,
        rot: face * (-12 + bar * 10),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (-4 * (1 - s)),
      anim: "idle",
    };
  }

  function mucuscocoonnightsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mucuscocoonnightsettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "play" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function greenphaseflashPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.greenphaseflash));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" };
    }
    if (u < 0.8) {
      const cloud = Math.sin(t * 3.0);
      return {
        x: fromX + face * (0.6 + cloud * 0.18),
        lift: 3.0 + Math.abs(cloud) * 1.8,
        rot: face * (14 + cloud * 12),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.5 * (1 - s),
      rot: face * (5 * (1 - s)),
      anim: "idle",
    };
  }

  function beakscrapegrazePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.beakscrapegraze));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 1.0 * (1 - s),
      lift: 1.6 * (1 - s),
      rot: face * (6 * (1 - s)),
      anim: "idle",
    };
  }

  function sandpooppuffcuePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sandpooppuffcue));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const hang = Math.sin(t * 2.0);
      return {
        x: fromX + face * (0.5 + hang * 0.1),
        lift: 2.8 + Math.abs(hang) * 1.2,
        rot: face * (11 + hang * 8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.5 * (1 - s),
      lift: 1.3 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function pharyngealmillPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pharyngealmill));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (4 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "pectoralhover" &&
      trick.kind !== "mucuscocoonnightsettle" &&
      trick.kind !== "sandpooppuffcue" &&
      trick.kind !== "beakscrapegraze" &&
      trick.kind !== "pharyngealmill" &&
      trick.kind !== "greenphaseflash"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "scarushush") {
      if (next.t < SCARUSHUSH_HOLD) {
        const pose = scarushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SCARUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SCARUSHUSH_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "pectoralhover") {
      const pose = pectoralhoverPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mucuscocoonnightsettle") {
      const pose = mucuscocoonnightsettlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sandpooppuffcue") {
      const pose = sandpooppuffcuePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "beakscrapegraze") {
      const pose = beakscrapegrazePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pharyngealmill") {
      const pose = pharyngealmillPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = greenphaseflashPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }



  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    SCARUSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    scarushushPose,
    releasePose,
    pectoralhoverPose,
    mucuscocoonnightsettlePose,
    greenphaseflashPose,
    beakscrapegrazePose,
    sandpooppuffcuePose,
    pharyngealmillPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densscrapePose,
    inkscrapePose,
    densscarusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetClownfishTricks = api;
})(typeof window !== "undefined" ? window : globalThis);