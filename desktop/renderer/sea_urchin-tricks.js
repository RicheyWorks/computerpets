/** Thorn ground tricks while idle. House neighborly Strongylocentrotus / purple sea urchin desk life — spinewalk / lanterngraze / gripcreep / spineflare / strongylhush personality (spinewalk spine walk/pivot without naming spine or walk or pivot or roll or ball alone as wait, lanterngraze Aristotle lantern graze without naming lantern or Aristotle or graze or bite or rasp alone as wait, gripcreep tube-feet grip creep without naming tube or feet or grip or creep or podia alone as wait, spineflare defense spine flare without naming flare or defense or bristle or rattle alone as wait, long strongylhush Strongylocentrotus purple-urchin hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or spinewalk or lanterngraze or gripcreep or spineflare or strongylhush or densurchin or inkthorn or densstrongyl or lunulesift or dollarright or sandfilmburrow or spinefurcreep or mellitahush or denssand or inksand or densmellita or spiralcrawl or filmgraze or opercshut or tidehuddle or littorinahush or densspire or inkspire or denslittorina or plateflex or radularasp or girdlesettle or rockcreep or chitonhush or densmail or inkmail or denspolyplaco or cirrikick or opershut or cementhold or tidereopen or balanushush or denscement or inkcement or densbalanus or clampseal or radialgraze or circumhome or shelltilt or patellahush or denscone or inkcone or denspatella or podia or righting or crawl or evert or penta or damp or press or tide or sprintdash or burrowplunge or burrowdig or sandfeed or denspale or denswave or densscud or densarmor; window-play and Call Thorn leave sea_urchin alone; Token/Spire/Mail/Cement/Cone/Pale/Wave/Scud/Cling own their tricks; guest slug Thorn / key sea_urchin — accept "sea_urchin" and "thorn" (roster slug thorn; campaign Thorn); do NOT accept bare "thorn" as a trick id; do NOT confuse with Token the Common Sand Dollar (key sand_dollar / slug token); do NOT confuse with Spire the Common Periwinkle or Mail the Lined Chiton or Cement the Acorn Barnacle or Cone the Limpet; do NOT confuse with Cling the Sea Star (key sea_star) podia/righting/crawl/evert/penta; do NOT confuse with Knurl the Knobbed Whelk (key knobbed_whelk / slug knurl) — do not start Knurl in parallel; do NOT name a trick sea_urchin or thorn or sand_dollar or token or periwinkle or spire or righting or podia or penta or evert or knurl or whelk. Thank-yous densurchin / inkthorn / densstrongyl. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web sea_urchin-tricks.ts. Window-play unchanged. True purple sea urchin desk life — spine walk/pivot, Aristotle lantern graze, tube-feet grip creep, defense spine flare, and long Strongylocentrotus hush; not Mellita sand-dollar clones, not Littorina periwinkle clones, not Tonicella chiton clones, not Balanus barnacle clones, not Patella limpet clones, not Asterias sea-star clones, not Busycon knobbed-whelk Knurl (next guest) — true Strongylocentrotus regular echinoid life. Next house-order guest after Thorn still lacking tricks owns the next seat (Knurl / knobbed_whelk). No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "sea_urchin";
  const TRICKS = ["spinewalk", "lanterngraze", "gripcreep", "spineflare", "strongylhush"];
  const HAPPY = ["densurchin", "inkthorn", "densstrongyl"];
  const HAPPY_DUR = { densurchin: 2.74, inkthorn: 2.91, densstrongyl: 2.66 };
  const STRONGYLHUSH_HOLD = 26.48;
  const RELEASE_S = 2.36;
  const DUR = { strongylhush: STRONGYLHUSH_HOLD + RELEASE_S, spinewalk: 5.24, lanterngraze: 5.36, gripcreep: 5.12, spineflare: 4.98 };

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
    if (kind === "strongylhush") return 178 + roll * 14;
    if (kind === "spinewalk") return 27.8 + roll * 4.7;
    if (kind === "lanterngraze") return 28.4 + roll * 4.9;
    if (kind === "gripcreep") return 26.6 + roll * 4.4;
    if (kind === "spineflare") return 26.2 + roll * 4.2;
    return justFinished ? 19.9 + roll * 3.0 : 15.1 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "strongylhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "strongylhush") {
      if (roll < 0.26) return "spinewalk";
      if (roll < 0.5) return "lanterngraze";
      if (roll < 0.74) return "gripcreep";
      return "spineflare";
    }
    if (lastKind === "spinewalk") {
      if (roll < 0.26) return "strongylhush";
      if (roll < 0.5) return "lanterngraze";
      if (roll < 0.74) return "gripcreep";
      return "spineflare";
    }
    if (lastKind === "lanterngraze") {
      if (roll < 0.22) return "strongylhush";
      if (roll < 0.44) return "spinewalk";
      if (roll < 0.68) return "gripcreep";
      return "spineflare";
    }
    if (roll < 0.2) return "strongylhush";
    if (roll < 0.4) return "spinewalk";
    if (roll < 0.6) return "lanterngraze";
    if (roll < 0.8) return "gripcreep";
    return "spineflare";
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
    return cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest" || cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter";
  }

  function wantsThankYou(key) {
    return key === TRICK_KEY || key === "thorn";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densurchin";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densurchin" ? "sit" : name === "inkthorn" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densurchinPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densurchin));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * -0.0038, rot: s * -0.15, anim: "sit" };
    }
    if (u < 0.74) {
      const bob = Math.sin((u - 0.15) / 0.59 * Math.PI * 2.35);
      return { lift: -0.0036 + bob * 0.00088, rot: -0.14 + bob * 0.11, anim: "sit" };
    }
    const s = (u - 0.74) / 0.26;
    return { lift: -0.0036 * (1 - s), rot: -0.14 * (1 - s), anim: "idle" };
  }
  function inkthornPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkthorn));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0041, rot: s * 0.36, anim: "talk" };
    }
    if (u < 0.72) {
      const pulse = Math.sin((u - 0.14) / 0.58 * Math.PI * 3.35);
      return { lift: 0.0041 + Math.abs(pulse) * 0.0016, rot: 0.36 + pulse * 0.26, anim: "talk" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0041 * (1 - s), rot: 0.36 * (1 - s), anim: "idle" };
  }
  function densstrongylPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densstrongyl));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0029, rot: s * -0.24, anim: "play" };
    }
    if (u < 0.80) {
      const wave = Math.sin((u - 0.13) / 0.67 * Math.PI * 2.75);
      return { lift: 0.0029 + Math.abs(wave) * 0.0013, rot: -0.24 + wave * 0.18, anim: "play" };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.0029 * (1 - s), rot: -0.24 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densurchin") {
      const pose = densurchinPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkthorn") {
      const pose = inkthornPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densstrongylPose(next.t);
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
      kind === "strongylhush"
        ? "sit"
        : kind === "spinewalk"
          ? "walk"
          : kind === "lanterngraze"
            ? "play"
            : kind === "gripcreep"
              ? "walk"
              : kind === "spineflare"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "strongylhush" ? "hold" : "go",
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

  function strongylhushPose(t) {
    const breath = Math.sin(t * 0.00172) + 0.00078 * Math.sin(t * 0.0059);
    const hush = Math.abs(Math.sin(t * 0.00088));
    return { lift: -0.00038 + hush * 0.00012, rot: -0.014 + breath * 0.0046 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00034 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.014 * (1 - u) };
  }

  // Spine walk/pivot: test spines walk while the test rotates in place (not sand-dollar spinefurcreep, not sea-star crawl).
  function spinewalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spinewalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0034, rot: s * 0.22 * face, anim: "walk" };
    }
    if (u < 0.88) {
      const pivot = Math.sin((u - 0.12) / 0.76 * Math.PI * 3.6);
      const spine = Math.sin(t * 1.28) + 0.05 * Math.sin(t * 2.55);
      const creep = (u - 0.12) / 0.76;
      return {
        x: fromX + face * (0.00028 + creep * 0.0046 + pivot * 0.00018),
        lift: 0.0034 + Math.abs(pivot) * 0.00072 + Math.abs(spine) * 0.00022,
        rot: (0.22 + pivot * 0.55 + spine * 0.08) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00488 * (1 - s * 0.1), lift: 0.0012 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" };
  }

  // Aristotle lantern graze: oral face tips to rasp algae (not sand-dollar lunulesift, not periwinkle filmgraze).
  function lanterngrazePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lanterngraze));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00014, lift: s * -0.0056, rot: s * 0.32 * face, anim: "play" };
    }
    if (u < 0.86) {
      const rasp = Math.sin((u - 0.14) / 0.72 * Math.PI * 5.2);
      const jaw = Math.sin(t * 1.72) + 0.04 * Math.sin(t * 3.1);
      return {
        x: fromX + face * (0.00014 + rasp * 0.00085 + jaw * 0.0001),
        lift: -0.0056 + Math.abs(rasp) * 0.0009 + Math.abs(jaw) * 0.00025,
        rot: (0.32 + rasp * 0.24 + jaw * 0.07) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00014 * (1 - s), lift: -0.0018 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }

  // Tube-feet grip creep: podia grip the desk and haul the test forward (not sea-star podia crawl, not sand-dollar spinefurcreep).
  function gripcreepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gripcreep));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00038, lift: s * -0.0024, rot: s * 0.08 * face, anim: "walk" };
    }
    if (u < 0.90) {
      const creep = (u - 0.11) / 0.79;
      const grip = Math.sin(creep * Math.PI * 4.6);
      const feet = Math.sin(t * 0.95) + 0.035 * Math.sin(t * 2.1);
      return {
        x: fromX + face * (0.00038 + creep * 0.0074 + grip * 0.0002),
        lift: -0.0024 + Math.abs(grip) * 0.00055 + Math.abs(feet) * 0.00016,
        rot: (0.08 + grip * 0.09 + feet * 0.04) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00778 * (1 - s * 0.12), lift: -0.0007 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" };
  }

  // Defense spine flare: primary spines bristle outward then settle (not goldfish flare, not sand-dollar dollarright).
  function spineflarePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spineflare));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00012, lift: s * 0.0064, rot: s * 0.48 * face, anim: "play" };
    }
    if (u < 0.78) {
      const flare = Math.sin((u - 0.16) / 0.62 * Math.PI * 2.8);
      const bristle = Math.sin(t * 2.05) + 0.06 * Math.sin(t * 3.4);
      return {
        x: fromX + face * (0.00012 + flare * 0.0004),
        lift: 0.0064 + Math.abs(flare) * 0.0018 + Math.abs(bristle) * 0.0004,
        rot: (0.48 + flare * 0.42 + bristle * 0.12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.00012 * (1 - s), lift: 0.0064 * (1 - s), rot: 0.08 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "spinewalk" && trick.kind !== "lanterngraze" && trick.kind !== "gripcreep" && trick.kind !== "spineflare") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "strongylhush") {
      if (next.t < STRONGYLHUSH_HOLD) {
        const pose = strongylhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < STRONGYLHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - STRONGYLHUSH_HOLD);
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
    if (next.kind === "spinewalk") {
      const pose = spinewalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lanterngraze") {
      const pose = lanterngrazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gripcreep") {
      const pose = gripcreepPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = spineflarePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    STRONGYLHUSH_HOLD,
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
    densurchinPose,
    inkthornPose,
    densstrongylPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    strongylhushPose,
    releasePose,
    spinewalkPose,
    lanterngrazePose,
    gripcreepPose,
    spineflarePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSeaUrchinTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
