/** Token ground tricks while idle. House neighborly Clypeasteroida / Mellita / Echinarachnius Common Sand Dollar desk life — lunulesift / dollarright / sandfilmburrow / spinefurcreep / mellitahush personality (lunulesift petaloid lunule sift without naming petaloid or lunule or sift or pore or ambulacra alone as wait, dollarright righting flip without naming righting or flip or recover or tip or podia alone as wait, sandfilmburrow burrow under sand film without naming burrow or sand or film or bury or plunge alone as wait, spinefurcreep spine-fur creep without naming spine or fur or creep or cilia or pedicellaria alone as wait, long mellitahush Mellita / Echinarachnius sand-dollar hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or lunulesift or dollarright or sandfilmburrow or spinefurcreep or mellitahush or denssand or inksand or densmellita or spiralcrawl or filmgraze or opercshut or tidehuddle or littorinahush or densspire or inkspire or denslittorina or plateflex or radularasp or girdlesettle or rockcreep or chitonhush or densmail or inkmail or denspolyplaco or cirrikick or opershut or cementhold or tidereopen or balanushush or denscement or inkcement or densbalanus or clampseal or radialgraze or circumhome or shelltilt or patellahush or denscone or inkcone or denspatella or podia or righting or crawl or evert or penta or damp or press or tide or sprintdash or burrowplunge or burrowdig or sandfeed or denspale or denswave or densscud or densarmor; window-play and Call Token leave sand_dollar alone; Spire/Mail/Cement/Cone/Pale/Wave/Scud/Cling own their tricks; guest slug Token / key sand_dollar — accept "sand_dollar" and "token" (roster slug token; campaign Token); do NOT accept bare "token" as a trick id; do NOT confuse with Goldfish Coin or any store token; do NOT confuse with Spire the Common Periwinkle (key periwinkle / slug spire); do NOT confuse with Mail the Lined Chiton or Cement the Acorn Barnacle or Cone the Limpet; do NOT confuse with Cling the Sea Star (key sea_star) podia/righting/crawl/evert/penta; do NOT confuse with Thorn the Purple Sea Urchin (key sea_urchin / slug thorn) — do not start Thorn in parallel; do NOT name a trick sand_dollar or token or sea_urchin or thorn or periwinkle or spire or righting or podia or penta or evert. Thank-yous denssand / inksand / densmellita. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web sand_dollar-tricks.ts. Window-play unchanged. True common sand dollar desk life — petaloid lunule sift, disk righting flip, sand-film burrow, spine-fur creep, and long Mellita hush; not Littorina periwinkle clones, not Tonicella chiton clones, not Balanus barnacle clones, not Patella limpet clones, not Asterias sea-star clones, not Strongylocentrotus sea-urchin Thorn (next guest) — true Mellita / Echinarachnius irregular echinoid life. Next house-order guest after Token still lacking tricks owns the next seat (Thorn / sea_urchin). No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "sand_dollar";
  const TRICKS = ["lunulesift", "dollarright", "sandfilmburrow", "spinefurcreep", "mellitahush"];
  const HAPPY = ["denssand", "inksand", "densmellita"];
  const HAPPY_DUR = { denssand: 2.72, inksand: 2.88, densmellita: 2.62 };
  const MELLITAHUSH_HOLD = 26.35;
  const RELEASE_S = 2.32;
  const DUR = { mellitahush: MELLITAHUSH_HOLD + RELEASE_S, lunulesift: 5.18, dollarright: 5.42, sandfilmburrow: 4.94, spinefurcreep: 5.06 };

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
    if (kind === "mellitahush") return 178 + roll * 14;
    if (kind === "lunulesift") return 27.6 + roll * 4.6;
    if (kind === "dollarright") return 28.2 + roll * 4.8;
    if (kind === "sandfilmburrow") return 26.4 + roll * 4.3;
    if (kind === "spinefurcreep") return 26.8 + roll * 4.5;
    return justFinished ? 19.9 + roll * 3.0 : 15.1 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "mellitahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "mellitahush") {
      if (roll < 0.26) return "lunulesift";
      if (roll < 0.5) return "dollarright";
      if (roll < 0.74) return "sandfilmburrow";
      return "spinefurcreep";
    }
    if (lastKind === "lunulesift") {
      if (roll < 0.26) return "mellitahush";
      if (roll < 0.5) return "dollarright";
      if (roll < 0.74) return "sandfilmburrow";
      return "spinefurcreep";
    }
    if (lastKind === "dollarright") {
      if (roll < 0.22) return "mellitahush";
      if (roll < 0.44) return "lunulesift";
      if (roll < 0.68) return "sandfilmburrow";
      return "spinefurcreep";
    }
    if (roll < 0.2) return "mellitahush";
    if (roll < 0.4) return "lunulesift";
    if (roll < 0.6) return "dollarright";
    if (roll < 0.8) return "sandfilmburrow";
    return "spinefurcreep";
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
    return key === TRICK_KEY || key === "token";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denssand";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denssand" ? "sit" : name === "inksand" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function denssandPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssand));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * -0.0036, rot: s * -0.14, anim: "sit" };
    }
    if (u < 0.74) {
      const bob = Math.sin((u - 0.15) / 0.59 * Math.PI * 2.35);
      return { lift: -0.0036 + bob * 0.00088, rot: -0.14 + bob * 0.11, anim: "sit" };
    }
    const s = (u - 0.74) / 0.26;
    return { lift: -0.0036 * (1 - s), rot: -0.14 * (1 - s), anim: "idle" };
  }
  function inksandPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksand));
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
  function densmellitaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densmellita));
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
    if (next.kind === "denssand") {
      const pose = denssandPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inksand") {
      const pose = inksandPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densmellitaPose(next.t);
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
      kind === "mellitahush"
        ? "sit"
        : kind === "lunulesift"
          ? "play"
          : kind === "dollarright"
            ? "play"
            : kind === "sandfilmburrow"
              ? "sit"
              : kind === "spinefurcreep"
                ? "walk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "mellitahush" ? "hold" : "go",
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

  function mellitahushPose(t) {
    const breath = Math.sin(t * 0.00168) + 0.00074 * Math.sin(t * 0.0056);
    const hush = Math.abs(Math.sin(t * 0.00084));
    return { lift: -0.00036 + hush * 0.00011, rot: -0.012 + breath * 0.0044 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00032 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.012 * (1 - u) };
  }

  // Petaloid lunule sift: disk settles while petaloid pores sift detritus (not sea-star evert, not periwinkle filmgraze).
  function lunulesiftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lunulesift));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00016, lift: s * -0.0042, rot: s * 0.18 * face, anim: "play" };
    }
    if (u < 0.88) {
      const sift = Math.sin((u - 0.12) / 0.76 * Math.PI * 4.8);
      const petal = Math.sin(t * 1.55) + 0.05 * Math.sin(t * 2.9);
      return {
        x: fromX + face * (0.00016 + sift * 0.0012 + petal * 0.00014),
        lift: -0.0042 + Math.abs(sift) * 0.00078 + Math.abs(petal) * 0.00028,
        rot: (0.18 + sift * 0.28 + petal * 0.09) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00016 * (1 - s), lift: -0.0015 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" };
  }

  // Righting flip: edge-up then flatten oral-side down (not Asterias podia righting, not urchin roll).
  function dollarrightPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dollarright));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00035, lift: s * 0.0078, rot: s * 1.15 * face, anim: "play" };
    }
    if (u < 0.55) {
      const flip = (u - 0.18) / 0.37;
      const arc = Math.sin(flip * Math.PI);
      return {
        x: fromX + face * (0.00035 + flip * 0.0042),
        lift: 0.0078 + arc * 0.0045,
        rot: (1.15 + flip * 1.85) * face,
        anim: "play",
      };
    }
    if (u < 0.88) {
      const settle = (u - 0.55) / 0.33;
      const wobble = Math.sin(settle * Math.PI * 2.2);
      return {
        x: fromX + face * (0.00455 + settle * 0.0011),
        lift: 0.0042 * (1 - settle) + Math.abs(wobble) * 0.00055,
        rot: (3.0 + wobble * 0.22) * (1 - settle * 0.92) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00565 * (1 - s * 0.08), lift: 0.0008 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" };
  }

  // Sand-film burrow: sink under a thin sand film (not ghost-crab burrowplunge, not fiddler burrowdig).
  function sandfilmburrowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sandfilmburrow));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00022, lift: s * -0.0072, rot: s * 0.06 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const bury = Math.sin((u - 0.16) / 0.68 * Math.PI * 1.9);
      const film = Math.sin(t * 0.42) * 0.00012;
      return {
        x: fromX + face * (0.00022 + bury * 0.00035),
        lift: -0.0072 + film + Math.abs(bury) * 0.00022,
        rot: (0.06 + bury * 0.04) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00022 * (1 - s), lift: -0.0072 * (1 - s), rot: 0.01 * (1 - s) * face, anim: "idle" };
  }

  // Spine-fur creep: short spine fur ripples while the disk creeps forward (not sea-star crawl podia).
  function spinefurcreepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spinefurcreep));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00042, lift: s * 0.0028, rot: s * 0.12 * face, anim: "walk" };
    }
    if (u < 0.90) {
      const creep = (u - 0.11) / 0.79;
      const fur = Math.sin(creep * Math.PI * 5.4);
      const spine = Math.sin(t * 1.12) + 0.04 * Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.00042 + creep * 0.0068 + fur * 0.00022),
        lift: 0.0028 + Math.abs(fur) * 0.00065 + Math.abs(spine) * 0.00018,
        rot: (0.12 + fur * 0.10 + spine * 0.05) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00722 * (1 - s * 0.12), lift: 0.0010 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lunulesift" && trick.kind !== "dollarright" && trick.kind !== "sandfilmburrow" && trick.kind !== "spinefurcreep") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "mellitahush") {
      if (next.t < MELLITAHUSH_HOLD) {
        const pose = mellitahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MELLITAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MELLITAHUSH_HOLD);
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
    if (next.kind === "lunulesift") {
      const pose = lunulesiftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dollarright") {
      const pose = dollarrightPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sandfilmburrow") {
      const pose = sandfilmburrowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = spinefurcreepPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    MELLITAHUSH_HOLD,
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
    denssandPose,
    inksandPose,
    densmellitaPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    mellitahushPose,
    releasePose,
    lunulesiftPose,
    dollarrightPose,
    sandfilmburrowPose,
    spinefurcreepPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSandDollarTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
