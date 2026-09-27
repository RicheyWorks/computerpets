/** Cement ground tricks while idle — ultra-polish pass. House neighborly Balanidae / Balanus glandula Acorn Barnacle desk life (barnacle / Cement) — cirrikick / opershut / cementhold / tidereopen / cirrisweep / plateshut / balanushush personality (cirrikick cirri kick-feed sweep without naming cirri or kick or feed or sweep or filter or cast alone as wait, opershut opercular plate shut without naming opercular or plate or shut or snap or valve or seal alone as wait, cementhold cement-hold settle without naming cement or hold or settle or glue or base or sessile alone as wait, tidereopen tide-wait hush reopen without naming tide or wait or reopen or open or flood or gap alone as wait, cirrisweep cirri sweep plankton pass without naming cirri or sweep or plankton or pass or cast or filter alone as wait, plateshut plate-shut weather cue without naming plate or shut or weather or cue or valve or snap alone as wait, long balanushush Balanus acorn-barnacle hush hold (THE balanushush sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or clampseal or radialgraze or circumhome or shelltilt or homescar or radulasweep or patellahush or denscone or inkcone or denspatella or sprintdash or stalkeyescan or burrowplunge or freezecamo or nightforage or sandghost or ocypodehush or denspale or inkpale or densghost or clawwave or burrowdig or sandfeed or lateralsidestep or majorclaw or mudball or pugilator or denswave or inkwave or densmajor or sideswim or gnathopod or detritusclutch or pairguard or urosome or pleopod or gammarus or densscud or inkscud or densgnath or radula or pedal or pneumostome or ommatophore or lymnaeid or stagnalis or physa or radix or odontophore or neuston or radularasp or plateflex or girdlesettle or rockcreep or chitonhush or adductor or protractor or inhalant or ctenidium or unionid or spiral or siphuncle or nacre or pinhole or fringe or chamber or pearl or quiet or cirrikick or opershut or cementhold or tidereopen or cirrisweep or plateshut or balanushush or denscement or inkcement or densbalanus or leafhush or cast or crawl or still or dart or roll or walk or sit or hop or spring or vault or thrash or limpet or cone or barnacle or cement or ghost_crab or pale or kick as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Cone owns clampseal/radialgraze/circumhome/shelltilt/homescar/radulasweep/patellahush — do NOT reuse; Pale owns sprintdash/stalkeyescan/burrowplunge/freezecamo/nightforage/sandghost/ocypodehush — do NOT reuse; Wave owns clawwave/burrowdig/sandfeed/lateralsidestep/majorclaw/mudball/pugilator — do NOT reuse; Scud owns sideswim/gnathopod/detritusclutch/pairguard/urosome/pleopod/gammarus — do NOT reuse; Whorl pond_snail owns radula/pedal/pneumostome/ommatophore/lymnaeid — do NOT reuse; Coat/Mail chiton owns radularasp/plateflex/girdlesettle/rockcreep/chitonhush — do NOT reuse (Mail next — do not start Mail in parallel); Frill oyster / Hinge mussel own adductor etc — do NOT reuse; Chamber nautilus owns chamber — do NOT reuse; header forbids bare barnacle/cement/cirri/kick/still/sit/plate and bare limpet/cone/ghost_crab/pale; guest slug Cement / key barnacle only for wantsThankYou matching — accept "barnacle" and "cement"; do NOT accept bare "cement" as a trick id; do NOT name a trick "barnacle" or "cement" or "limpet" or "cone" or "ghost_crab" or "pale" or "kick" or "still" or "sit" or "cirri" or "plate" or "denscone" or "denspale" or "densclaw" or "chamber") — not Cone Patella limpet life, not Pale Ocypode ghost-crab life, not Wave Uca fiddler life, not Scud Gammarus amphipod life, not Whorl Lymnaea pond-snail gape, not Mail Polyplacophora chiton life, not Frill/Hinge bivalve life, not Chamber nautilus life, not Rui red_panda life. Cirrikick without naming cirri alone, opershut without naming plate alone, cementhold without naming cement alone, tidereopen without naming tide alone, cirrisweep without naming sweep alone, plateshut without naming shut alone, balanushush long sit_hold on the Balanus hush (THE balanushush sit_hold tell); denscement / inkcement / densbalanus thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web barnacle-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names barnacle/cement/kick/still/wait/sit as bare ethogram-only trick kinds. True acorn barnacle desk life only — cirri kick-feed, opercular plate shut, cement-hold settle, tide-wait reopen, cirri sweep, plate shut, and balanus hush; distinct from Cone limpet clampseal/radialgraze/circumhome/shelltilt/homescar/radulasweep/patellahush, Pale ghost-crab, Wave fiddler, Scud amphipod, Whorl pond-snail, Mail chiton next, Frill/Hinge bivalve, Chamber nautilus, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Mail / chiton. No cry inventing — thank-yous are silent desk motion only; barnacle.wav EXISTS so prefersHouseCry adds barnacle after limpet. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "barnacle";
  const TRICKS = ["cirrikick", "opershut", "cementhold", "tidereopen", "cirrisweep", "plateshut", "balanushush"];
  const HAPPY = ["denscement", "inkcement", "densbalanus"];

  const HAPPY_DUR = { denscement: 1.70, inkcement: 1.84, densbalanus: 1.76 };
  const BALANUSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    balanushush: BALANUSHUSH_HOLD + RELEASE_S,
    cirrikick: 2.48,
    opershut: 2.42,
    cementhold: 2.40,
    tidereopen: 2.44,
    cirrisweep: 2.38,
    plateshut: 2.56,
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
    if (kind === "balanushush") return 40 + roll * 26;
    if (kind === "cirrisweep" || kind === "cirrikick" || kind === "tidereopen") return 12.8 + roll * 9.4;
    if (kind === "cementhold" || kind === "opershut" || kind === "plateshut") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "balanushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "balanushush") {
      if (roll < 0.17) return "cirrikick";
      if (roll < 0.33) return "opershut";
      if (roll < 0.49) return "cementhold";
      if (roll < 0.65) return "tidereopen";
      if (roll < 0.83) return "cirrisweep";
      return "plateshut";
    }
    if (lastKind === "cirrikick") {
      if (roll < 0.16) return "balanushush";
      if (roll < 0.32) return "opershut";
      if (roll < 0.48) return "cementhold";
      if (roll < 0.64) return "tidereopen";
      if (roll < 0.82) return "cirrisweep";
      return "plateshut";
    }
    if (lastKind === "opershut") {
      if (roll < 0.14) return "balanushush";
      if (roll < 0.3) return "cirrikick";
      if (roll < 0.46) return "cementhold";
      if (roll < 0.62) return "tidereopen";
      if (roll < 0.8) return "cirrisweep";
      return "plateshut";
    }
    if (lastKind === "cementhold") {
      if (roll < 0.15) return "balanushush";
      if (roll < 0.31) return "cirrikick";
      if (roll < 0.47) return "opershut";
      if (roll < 0.63) return "tidereopen";
      if (roll < 0.81) return "cirrisweep";
      return "plateshut";
    }
    if (lastKind === "tidereopen") {
      if (roll < 0.16) return "balanushush";
      if (roll < 0.32) return "cirrikick";
      if (roll < 0.48) return "opershut";
      if (roll < 0.64) return "cementhold";
      if (roll < 0.82) return "cirrisweep";
      return "plateshut";
    }
    if (lastKind === "cirrisweep") {
      if (roll < 0.15) return "balanushush";
      if (roll < 0.31) return "cirrikick";
      if (roll < 0.47) return "opershut";
      if (roll < 0.63) return "cementhold";
      if (roll < 0.81) return "tidereopen";
      return "plateshut";
    }
    if (lastKind === "plateshut") {
      if (roll < 0.16) return "balanushush";
      if (roll < 0.32) return "cirrikick";
      if (roll < 0.48) return "opershut";
      if (roll < 0.64) return "cementhold";
      if (roll < 0.82) return "tidereopen";
      return "cirrisweep";
    }
    if (roll < 0.14) return "balanushush";
    if (roll < 0.28) return "cirrikick";
    if (roll < 0.42) return "opershut";
    if (roll < 0.56) return "cementhold";
    if (roll < 0.7) return "tidereopen";
    if (roll < 0.85) return "cirrisweep";
    return "plateshut";
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
    return key === TRICK_KEY || key === "cement";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denscement";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denscement" ? "sit" : name === "inkcement" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denscementPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscement));
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

  function inkcementPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkcement));
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

  function densbalanusPose(t) {
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
    if (next.kind === "denscement") {
      const pose = denscementPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkcement") {
      const pose = inkcementPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densbalanusPose(next.t);
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
      kind === "balanushush"
        ? "sit"
        : kind === "cirrikick"
          ? "play"
          : kind === "plateshut"
            ? "sit"
            : kind === "opershut"
              ? "sit"
              : kind === "cementhold"
                ? "sit"
                : kind === "tidereopen"
                  ? "talk"
                  : kind === "cirrisweep"
                    ? "play"
                    : "sit";
    return {
      kind,
      phase: kind === "balanushush" ? "hold" : "go",
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

  function balanushushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function cirrikickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cirrikick));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.78) {
      const bar = Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.8 + bar * 0.16),
        lift: 2.8 + Math.abs(bar) * 1.5,
        rot: face * (-12 + bar * 10),
        anim: "play",
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

  function opershutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.opershut));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "sit",
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

  function plateshutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.plateshut));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const cloud = Math.sin(t * 3.0);
      return {
        x: fromX + face * (0.6 + cloud * 0.18),
        lift: 3.0 + Math.abs(cloud) * 1.8,
        rot: face * (14 + cloud * 12),
        anim: "sit",
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

  function tidereopenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tidereopen));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "talk" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "talk",
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

  function cementholdPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cementhold));
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

  function cirrisweepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cirrisweep));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "play" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "play",
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
      trick.kind !== "cirrikick" &&
      trick.kind !== "opershut" &&
      trick.kind !== "cementhold" &&
      trick.kind !== "tidereopen" &&
      trick.kind !== "cirrisweep" &&
      trick.kind !== "plateshut"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "balanushush") {
      if (next.t < BALANUSHUSH_HOLD) {
        const pose = balanushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BALANUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BALANUSHUSH_HOLD);
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
    if (next.kind === "cirrikick") {
      const pose = cirrikickPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "opershut") {
      const pose = opershutPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cementhold") {
      const pose = cementholdPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tidereopen") {
      const pose = tidereopenPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cirrisweep") {
      const pose = cirrisweepPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = plateshutPose(next.t, fromX, trick.facing);
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
    BALANUSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    balanushushPose,
    releasePose,
    cirrikickPose,
    opershutPose,
    plateshutPose,
    tidereopenPose,
    cementholdPose,
    cirrisweepPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denscementPose,
    inkcementPose,
    densbalanusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBarnacleTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
