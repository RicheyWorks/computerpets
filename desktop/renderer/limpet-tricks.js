/** Cone ground tricks while idle — ultra-polish pass. House neighborly Patellidae / Patella vulgata Common Limpet desk life (limpet / Cone) — clampseal / radialgraze / circumhome / shelltilt / homescar / radulasweep / patellahush personality (clampseal clamp-down suction hold without naming clamp or seal or suction or hold or press or grip alone as wait, radialgraze radial graze over desk film without naming graze or rasp or radial or film or scrape alone as wait, circumhome slow circum-home trek without naming home or trek or circ or orbit or return alone as wait, shelltilt shell-tilt weather cue without naming tilt or shell or weather or cue or tip or lean alone as wait, homescar home-scar return mark without naming home or scar or mark or return or footprint or dent alone as wait, radulasweep radula sweep film pass without naming radula or sweep or film or pass or rasp or scrape alone as wait — distinct from Whorl pond_snail bare radula and Coat chiton radularasp, long patellahush Patella limpet hush hold (THE patellahush sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or sprintdash or stalkeyescan or burrowplunge or freezecamo or nightforage or sandghost or ocypodehush or denspale or inkpale or densghost or clawwave or burrowdig or sandfeed or lateralsidestep or majorclaw or mudball or pugilator or denswave or inkwave or densmajor or sideswim or gnathopod or detritusclutch or pairguard or urosome or pleopod or gammarus or densscud or inkscud or densgnath or radula or pedal or pneumostome or ommatophore or lymnaeid or stagnalis or physa or radix or odontophore or neuston or radularasp or plateflex or girdlesettle or rockcreep or chitonhush or adductor or protractor or inhalant or ctenidium or unionid or spiral or siphuncle or nacre or pinhole or fringe or chamber or pearl or quiet or clampseal or radialgraze or circumhome or shelltilt or homescar or radulasweep or patellahush or denscone or inkcone or denspatella or leafhush or cast or crawl or still or dart or roll or walk or sit or hop or spring or vault or thrash or limpet or cone or barnacle or cement or ghost_crab or pale as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Pale owns sprintdash/stalkeyescan/burrowplunge/freezecamo/nightforage/sandghost/ocypodehush — do NOT reuse; Wave owns clawwave/burrowdig/sandfeed/lateralsidestep/majorclaw/mudball/pugilator — do NOT reuse; Scud owns sideswim/gnathopod/detritusclutch/pairguard/urosome/pleopod/gammarus — do NOT reuse; Whorl pond_snail owns radula/pedal/pneumostome/ommatophore/lymnaeid — do NOT reuse bare radula (radulasweep stays distinct); Coat chiton owns radularasp/plateflex/girdlesettle/rockcreep/chitonhush — do NOT reuse; Frill oyster / Hinge mussel own adductor etc — do NOT reuse; Chamber nautilus owns chamber — do NOT reuse; Cement barnacle next — leave barnacle/cement/kick free; header forbids bare limpet/cone/clamp/rasp/still/sit/radula and bare ghost_crab/pale; guest slug Cone / key limpet only for wantsThankYou matching — accept "limpet" and "cone"; do NOT accept bare "cone" as a trick id; do NOT name a trick "limpet" or "cone" or "barnacle" or "cement" or "ghost_crab" or "pale" or "radula" or "clamp" or "rasp" or "still" or "sit" or "denspale" or "densclaw" or "chamber") — not Pale Ocypode ghost-crab life, not Wave Uca fiddler life, not Scud Gammarus amphipod life, not Whorl Lymnaea pond-snail gape, not Coat Polyplacophora chiton life, not Frill/Hinge bivalve life, not Chamber nautilus life, not Cement barnacle next, not Rui red_panda life. Clampseal without naming clamp alone, radialgraze without naming graze alone, circumhome without naming home alone, shelltilt without naming tilt alone, homescar without naming scar alone, radulasweep without naming radula alone, patellahush long sit_hold on the Patella hush (THE patellahush sit_hold tell); denscone / inkcone / denspatella thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web limpet-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names limpet/cone/clamp/rasp/still/wait/sit as bare ethogram-only trick kinds. True common limpet desk life only — clamp-down suction, radial film graze, slow circum-home trek, shell-tilt weather cue, home-scar return, radula sweep, and patella hush; distinct from Pale ghost-crab sprintdash/stalkeyescan/burrowplunge/freezecamo/nightforage/sandghost/ocypodehush, Wave fiddler, Scud amphipod, Whorl pond-snail radula/pneumostome, Coat chiton radularasp, Frill/Hinge bivalve, Chamber nautilus, Cement barnacle next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Cement / barnacle. No cry inventing — thank-yous are silent desk motion only; limpet.wav EXISTS so prefersHouseCry adds limpet after ghost_crab. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "limpet";
  const TRICKS = ["clampseal", "radialgraze", "circumhome", "shelltilt", "homescar", "radulasweep", "patellahush"];
  const HAPPY = ["denscone", "inkcone", "denspatella"];

  const HAPPY_DUR = { denscone: 1.70, inkcone: 1.84, denspatella: 1.76 };
  const PATELLAHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    patellahush: PATELLAHUSH_HOLD + RELEASE_S,
    clampseal: 2.48,
    radialgraze: 2.42,
    circumhome: 2.40,
    shelltilt: 2.44,
    homescar: 2.38,
    radulasweep: 2.56,
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
    if (kind === "patellahush") return 40 + roll * 26;
    if (kind === "homescar" || kind === "clampseal" || kind === "shelltilt") return 12.8 + roll * 9.4;
    if (kind === "circumhome" || kind === "radialgraze" || kind === "radulasweep") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "patellahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "patellahush") {
      if (roll < 0.17) return "clampseal";
      if (roll < 0.33) return "radialgraze";
      if (roll < 0.49) return "circumhome";
      if (roll < 0.65) return "shelltilt";
      if (roll < 0.83) return "homescar";
      return "radulasweep";
    }
    if (lastKind === "clampseal") {
      if (roll < 0.16) return "patellahush";
      if (roll < 0.32) return "radialgraze";
      if (roll < 0.48) return "circumhome";
      if (roll < 0.64) return "shelltilt";
      if (roll < 0.82) return "homescar";
      return "radulasweep";
    }
    if (lastKind === "radialgraze") {
      if (roll < 0.14) return "patellahush";
      if (roll < 0.3) return "clampseal";
      if (roll < 0.46) return "circumhome";
      if (roll < 0.62) return "shelltilt";
      if (roll < 0.8) return "homescar";
      return "radulasweep";
    }
    if (lastKind === "circumhome") {
      if (roll < 0.15) return "patellahush";
      if (roll < 0.31) return "clampseal";
      if (roll < 0.47) return "radialgraze";
      if (roll < 0.63) return "shelltilt";
      if (roll < 0.81) return "homescar";
      return "radulasweep";
    }
    if (lastKind === "shelltilt") {
      if (roll < 0.16) return "patellahush";
      if (roll < 0.32) return "clampseal";
      if (roll < 0.48) return "radialgraze";
      if (roll < 0.64) return "circumhome";
      if (roll < 0.82) return "homescar";
      return "radulasweep";
    }
    if (lastKind === "homescar") {
      if (roll < 0.15) return "patellahush";
      if (roll < 0.31) return "clampseal";
      if (roll < 0.47) return "radialgraze";
      if (roll < 0.63) return "circumhome";
      if (roll < 0.81) return "shelltilt";
      return "radulasweep";
    }
    if (lastKind === "radulasweep") {
      if (roll < 0.16) return "patellahush";
      if (roll < 0.32) return "clampseal";
      if (roll < 0.48) return "radialgraze";
      if (roll < 0.64) return "circumhome";
      if (roll < 0.82) return "shelltilt";
      return "homescar";
    }
    if (roll < 0.14) return "patellahush";
    if (roll < 0.28) return "clampseal";
    if (roll < 0.42) return "radialgraze";
    if (roll < 0.56) return "circumhome";
    if (roll < 0.7) return "shelltilt";
    if (roll < 0.85) return "homescar";
    return "radulasweep";
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
    return key === TRICK_KEY || key === "cone";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denscone";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denscone" ? "sit" : name === "inkcone" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densconePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscone));
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

  function inkconePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkcone));
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

  function denspatellaPose(t) {
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
    if (next.kind === "denscone") {
      const pose = densconePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkcone") {
      const pose = inkconePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denspatellaPose(next.t);
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
      kind === "patellahush"
        ? "sit"
        : kind === "clampseal"
          ? "sit"
          : kind === "radulasweep"
            ? "talk"
            : kind === "radialgraze"
              ? "play"
              : kind === "circumhome"
                ? "walk"
                : kind === "shelltilt"
                  ? "sit"
                  : kind === "homescar"
                    ? "sit"
                    : "sit";
    return {
      kind,
      phase: kind === "patellahush" ? "hold" : "go",
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

  function patellahushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function clampsealPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.clampseal));
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

  function radialgrazePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.radialgraze));
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

  function radulasweepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.radulasweep));
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

  function shelltiltPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.shelltilt));
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

  function circumhomePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.circumhome));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const hang = Math.sin(t * 2.0);
      return {
        x: fromX + face * (0.5 + hang * 0.1),
        lift: 2.8 + Math.abs(hang) * 1.2,
        rot: face * (11 + hang * 8),
        anim: "walk",
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

  function homescarPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.homescar));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "sit",
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
      trick.kind !== "clampseal" &&
      trick.kind !== "radialgraze" &&
      trick.kind !== "circumhome" &&
      trick.kind !== "shelltilt" &&
      trick.kind !== "homescar" &&
      trick.kind !== "radulasweep"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "patellahush") {
      if (next.t < PATELLAHUSH_HOLD) {
        const pose = patellahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PATELLAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PATELLAHUSH_HOLD);
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
    if (next.kind === "clampseal") {
      const pose = clampsealPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "radialgraze") {
      const pose = radialgrazePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "circumhome") {
      const pose = circumhomePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "shelltilt") {
      const pose = shelltiltPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "homescar") {
      const pose = homescarPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = radulasweepPose(next.t, fromX, trick.facing);
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
    PATELLAHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    patellahushPose,
    releasePose,
    clampsealPose,
    radialgrazePose,
    radulasweepPose,
    shelltiltPose,
    circumhomePose,
    homescarPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densconePose,
    inkconePose,
    denspatellaPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetLimpetTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
