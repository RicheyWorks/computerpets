/** Scrape ground tricks while idle. House neighborly stoplight parrotfish (Sparisoma viride / Scaridae parrotfish) desk life -- beak scrape graze on desk film / desk-safe sand-poop puff cue / mucus-cocoon night settle / pectoral hover / long scarus hush; NOT Paint clownfish (esp. not wiggledancehostcue/darthideinanemone/stripeflashturn/peckcleanhost/amphiprionhush); NOT Wreath anemone; NOT Ridge brain_coral; NOT wrasse if present; NOT goldfish Coin; NOT Rui; guest slug Scrape / key parrotfish -- accept parrotfish and scrape; Thank-yous densscrape / inkscrape / densscarus. Sleep, hide, leave, rest, card, ribbon still win. Same map as web parrotfish-tricks.ts. Next: Scrub / cleaner_shrimp. Catalog 220. */
(function (root) {
  const TRICK_KEY = "parrotfish";
  const TRICKS = ["pectoralhover", "mucuscocoonnightsettle", "sandpooppuffcue", "beakscrapegraze", "scarushush"];
  const HAPPY = ["densscrape", "inkscrape", "densscarus"];
  const HAPPY_DUR = { densscrape: 2.71, inkscrape: 2.69, densscarus: 2.63 };
  const SCARUSHUSH_HOLD = 34.12;
  const RELEASE_S = 2.56;
  const DUR = { scarushush: SCARUSHUSH_HOLD + RELEASE_S, pectoralhover: 5.58, mucuscocoonnightsettle: 5.44, sandpooppuffcue: 5.21, beakscrapegraze: 5.52 };

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
    if (kind === "scarushush") return 214 + roll * 24;
    if (kind === "mucuscocoonnightsettle") return 26.4 + roll * 3.2;
    if (kind === "beakscrapegraze") return 25.1 + roll * 3.0;
    if (kind === "pectoralhover") return 24.8 + roll * 3.1;
    if (kind === "sandpooppuffcue") return 24.4 + roll * 3.3;
    return justFinished ? 19.1 + roll * 3.0 : 14.2 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "scarushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "scarushush") {
      if (roll < 0.26) return "mucuscocoonnightsettle";
      if (roll < 0.5) return "beakscrapegraze";
      if (roll < 0.74) return "pectoralhover";
      return "sandpooppuffcue";
    }
    if (lastKind === "mucuscocoonnightsettle") {
      if (roll < 0.26) return "scarushush";
      if (roll < 0.5) return "beakscrapegraze";
      if (roll < 0.74) return "pectoralhover";
      return "sandpooppuffcue";
    }
    if (lastKind === "beakscrapegraze") {
      if (roll < 0.22) return "scarushush";
      if (roll < 0.44) return "mucuscocoonnightsettle";
      if (roll < 0.68) return "pectoralhover";
      return "sandpooppuffcue";
    }
    if (roll < 0.2) return "scarushush";
    if (roll < 0.4) return "mucuscocoonnightsettle";
    if (roll < 0.6) return "beakscrapegraze";
    if (roll < 0.8) return "pectoralhover";
    return "sandpooppuffcue";
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
    return key === TRICK_KEY || key === "scrape";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densscrape";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densscrape" ? "sit" : name === "inkscrape" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densscrapePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densscrape));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0034, rot: s * -0.22, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.35);
      return { lift: 0.0034 + Math.abs(sway) * 0.0009, rot: -0.22 + sway * 0.16, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0034 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }
  function inkscrapePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkscrape));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0035, rot: s * 0.26, anim: "play" };
    }
    if (u < 0.82) {
      const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 2.95);
      return { lift: 0.0035 + Math.abs(arc) * 0.0020, rot: 0.26 + arc * 0.28, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0035 * (1 - s), rot: 0.26 * (1 - s), anim: "idle" };
  }
  function densscarusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densscarus));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0016, rot: s * 0.17, anim: "play" };
    }
    if (u < 0.83) {
      const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.18);
      return { lift: -0.0016 + Math.abs(hush) * 0.0012, rot: 0.17 + hush * 0.16, anim: "play" };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: -0.0016 * (1 - s), rot: 0.17 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
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
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "scarushush";
    const anim =
      k === "scarushush"
        ? "sit"
        : k === "mucuscocoonnightsettle"
          ? "play"
          : k === "beakscrapegraze"
            ? "sit"
            : k === "sandpooppuffcue"
              ? "sit"
              : k === "pectoralhover"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "scarushush" ? "hold" : "go",
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

  function scarushushPose(t) {
    const breath = Math.sin(t * 0.00037) + 0.00011 * Math.sin(t * 0.00105);
    const hush = Math.abs(Math.sin(t * 0.00021));
    return { lift: -0.00018 + hush * 0.00006, rot: 0.0014 + breath * 0.0011 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
  }

  function mucuscocoonnightsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mucuscocoonnightsettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX + face * s * -0.00004, lift: s * -0.0051, rot: s * 0.07 * face, anim: "play" };
    }
    if (u < 0.72) {
      const tuck = Math.sin(((u - 0.22) / 0.5) * Math.PI * 2.1);
      return {
        x: fromX + face * (-0.00004 + tuck * 0.00005),
        lift: -0.0051 + Math.abs(tuck) * 0.0008,
        rot: (0.07 + tuck * 0.05) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { x: fromX + face * -0.00004 * (1 - s), lift: -0.0051 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" };
  }
  function beakscrapegrazePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.beakscrapegraze));
    const face = facing == null ? 1 : facing;
    if (u < 0.3) {
      const s = smoothstep(u / 0.3);
      return { x: fromX + face * s * 0.00006, lift: s * -0.0081, rot: s * 0.03 * face, anim: "sit" };
    }
    if (u < 0.68) {
      const hold = Math.sin(((u - 0.3) / 0.38) * Math.PI);
      return {
        x: fromX + face * 0.00006,
        lift: -0.0081 + hold * 0.0005,
        rot: (0.03 + hold * 0.015) * face,
        anim: "sit",
      };
    }
    if (u < 0.9) {
      const c = smoothstep((u - 0.68) / 0.22);
      return {
        x: fromX + face * 0.00006 * (1 - c * 0.35),
        lift: -0.0081 * (1 - c) + 0.0018 * c,
        rot: (0.03 * (1 - c) + 0.06 * c) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return { x: fromX + face * 0.00004 * (1 - s), lift: 0.0018 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" };
  }
  function pectoralhoverPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pectoralhover));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00009, lift: s * 0.0026, rot: s * 0.14 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const sway = Math.sin(((u - 0.14) / 0.74) * Math.PI * 2.85);
      return {
        x: fromX + face * (0.00009 + sway * 0.00018),
        lift: 0.0026 + Math.abs(sway) * 0.0019,
        rot: (0.14 + sway * 0.22) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00009 * (1 - s), lift: 0.0026 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" };
  }
  function sandpooppuffcuePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sandpooppuffcue));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0009, rot: s * 0.05 * face, anim: "sit" };
    }
    if (u < 0.82) {
      const creep = Math.sin(((u - 0.18) / 0.64) * Math.PI * 1.8);
      return {
        x: fromX + face * (0.00028 + creep * 0.00028),
        lift: 0.0009 + Math.abs(creep) * 0.0007,
        rot: (0.05 + creep * 0.06) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.0007 * (1 - s * 0.3), lift: 0.0009 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "mucuscocoonnightsettle" && trick.kind !== "beakscrapegraze" && trick.kind !== "pectoralhover" && trick.kind !== "sandpooppuffcue") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
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
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "mucuscocoonnightsettle") {
      const pose = mucuscocoonnightsettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "beakscrapegraze") {
      const pose = beakscrapegrazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pectoralhover") {
      const pose = pectoralhoverPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sandpooppuffcuePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    SCARUSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densscrapePose,
    inkscrapePose,
    densscarusPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    scarushushPose,
    releasePose,
    mucuscocoonnightsettlePose,
    beakscrapegrazePose,
    pectoralhoverPose,
    sandpooppuffcuePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetParrotfishTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
