/** Mail ground tricks while idle. House neighborly Polyplacophora / Tonicella lineata Lined Chiton desk life — plateflex / radularasp / girdlesettle / rockcreep / chitonhush personality (plateflex eight-plate flex curl without naming plate or flex or curl or eight or valve or segment alone as wait, radularasp radula rasping graze without naming radula or rasp or graze or film or scrape or lick alone as wait, girdlesettle girdle clamp settle without naming girdle or clamp or settle or margin or skirt or hold alone as wait, rockcreep slow rock-creep without naming rock or creep or crawl or trek or inch or home alone as wait, long chitonhush lined-chiton Polyplacophora hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or cirrikick or opershut or cementhold or tidereopen or balanushush or denscement or inkcement or densbalanus or clampseal or radialgraze or circumhome or shelltilt or patellahush or denscone or inkcone or denspatella or sprintdash or stalkeyescan or burrowplunge or freezecamo or ocypodehush or denspale or inkpale or densghost or clawwave or burrowdig or sandfeed or lateralsidestep or pugilator or denswave or inkwave or densmajor or sideswim or gnathopod or detritusclutch or pairguard or gammarus or densscud or inkscud or densgnath or densclaw or pedal or pneumostome or ommatophore or lymnaeid or stagnalis or physa or radix or lamella or imbricate or lasso or margin or pleurotus or adductor or protractor or inhalant or ctenidium or unionid or spiral or siphuncle or nacre or pinhole or fringe or chamber or pearl or quiet or densarmor or plateflex or radularasp or girdlesettle or rockcreep or chitonhush; window-play and Call Mail leave chiton alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun/Half/Thread/Scud/Wave/Pale/Cone/Cement own their tricks; guest slug Mail / key chiton — accept "chiton" and "mail" (roster slug mail; campaign Mail); do NOT accept bare "mail" as a trick id; do NOT confuse with email; do NOT confuse with Cement the Acorn Barnacle (key barnacle / slug cement) or denscement thank-you; do NOT confuse with Cone the Limpet (key limpet / slug cone) or denscone thank-you; do NOT confuse with Pale the Ghost Crab or Wave the Fiddler Crab or Scud the Amphipod; do NOT confuse with Whorl the Pond Snail radula/pneumostome gape; do NOT confuse with Frill the Oyster or Hinge the Mussel; do NOT confuse with Armor densarmor; do NOT confuse with Spire the Periwinkle (key periwinkle / slug spire) — do not start Spire in parallel; do NOT name a trick chiton or mail or barnacle or cement or limpet or cone or denscone or denspatella or denscement or densbalanus or ghost_crab or pale or denspale or densclaw or chamber or densarmor. Thank-yous densmail / inkmail / denspolyplaco. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web chiton-tricks.ts. Window-play unchanged. True lined chiton desk life — eight-plate flex curl, radula rasping graze, girdle clamp settle, and slow rock-creep; not Balanus barnacle clones (cirrikick/opershut/cementhold/tidereopen), not Patella limpet clones (clampseal/radialgraze/circumhome/shelltilt), not Ocypode ghost-crab clones, not Uca fiddler clones, not Gammarus amphipod clones, not Lymnaea pond-snail gape, not oyster/mussel bivalve clones, not periwinkle Spire (next guest) — true Tonicella lined chiton / Polyplacophora life. Next house-order guest after Mail still lacking tricks owns the next seat (Spire / periwinkle). No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "chiton";
  const TRICKS = ["plateflex", "radularasp", "girdlesettle", "rockcreep", "chitonhush"];
  const HAPPY = ["densmail", "inkmail", "denspolyplaco"];
  const HAPPY_DUR = { densmail: 2.74, inkmail: 2.90, denspolyplaco: 2.64 };
  const CHITONHUSH_HOLD = 25.70;
  const RELEASE_S = 2.35;
  const DUR = { chitonhush: CHITONHUSH_HOLD + RELEASE_S, plateflex: 5.08, radularasp: 4.94, girdlesettle: 4.70, rockcreep: 5.22 };

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
    if (kind === "chitonhush") return 174 + roll * 15;
    if (kind === "plateflex") return 27.0 + roll * 4.6;
    if (kind === "radularasp") return 26.4 + roll * 4.3;
    if (kind === "girdlesettle") return 26.8 + roll * 4.5;
    if (kind === "rockcreep") return 28.2 + roll * 5.0;
    return justFinished ? 19.8 + roll * 3.0 : 15.0 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "chitonhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "chitonhush") {
      if (roll < 0.26) return "plateflex";
      if (roll < 0.5) return "radularasp";
      if (roll < 0.74) return "girdlesettle";
      return "rockcreep";
    }
    if (lastKind === "plateflex") {
      if (roll < 0.26) return "chitonhush";
      if (roll < 0.5) return "radularasp";
      if (roll < 0.74) return "girdlesettle";
      return "rockcreep";
    }
    if (lastKind === "radularasp") {
      if (roll < 0.22) return "chitonhush";
      if (roll < 0.44) return "plateflex";
      if (roll < 0.68) return "girdlesettle";
      return "rockcreep";
    }
    if (roll < 0.2) return "chitonhush";
    if (roll < 0.4) return "plateflex";
    if (roll < 0.6) return "radularasp";
    if (roll < 0.8) return "girdlesettle";
    return "rockcreep";
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
    return key === TRICK_KEY || key === "mail";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densmail";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densmail" ? "sit" : name === "inkmail" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densmailPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densmail));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * -0.0034, rot: s * -0.16, anim: "sit" };
    }
    if (u < 0.74) {
      const bob = Math.sin((u - 0.15) / 0.59 * Math.PI * 2.25);
      return { lift: -0.0034 + bob * 0.00085, rot: -0.16 + bob * 0.10, anim: "sit" };
    }
    const s = (u - 0.74) / 0.26;
    return { lift: -0.0034 * (1 - s), rot: -0.16 * (1 - s), anim: "idle" };
  }
  function inkmailPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkmail));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0039, rot: s * 0.38, anim: "talk" };
    }
    if (u < 0.72) {
      const pulse = Math.sin((u - 0.14) / 0.58 * Math.PI * 3.25);
      return { lift: 0.0039 + Math.abs(pulse) * 0.0015, rot: 0.38 + pulse * 0.24, anim: "talk" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.0039 * (1 - s), rot: 0.38 * (1 - s), anim: "idle" };
  }
  function denspolyplacoPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspolyplaco));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0027, rot: s * -0.22, anim: "play" };
    }
    if (u < 0.80) {
      const wave = Math.sin((u - 0.13) / 0.67 * Math.PI * 2.65);
      return { lift: 0.0027 + Math.abs(wave) * 0.0012, rot: -0.22 + wave * 0.17, anim: "play" };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.0027 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densmail") {
      const pose = densmailPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkmail") {
      const pose = inkmailPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denspolyplacoPose(next.t);
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
      kind === "chitonhush"
        ? "sit"
        : kind === "plateflex"
          ? "play"
          : kind === "radularasp"
            ? "sit"
            : kind === "girdlesettle"
              ? "sit"
              : kind === "rockcreep"
                ? "walk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "chitonhush" ? "hold" : "go",
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

  function chitonhushPose(t) {
    const breath = Math.sin(t * 0.00185) + 0.00085 * Math.sin(t * 0.0062);
    const hush = Math.abs(Math.sin(t * 0.00098));
    return { lift: -0.00032 + hush * 0.00014, rot: -0.009 + breath * 0.0055 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00028 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.010 * (1 - u) };
  }

  // Cirri kick-feed sweep: rapid lateral cirri cast (filter-feeding), not limpet radial graze.
    // Eight-plate flex curl: articulated valve undulation along the body axis (not cirri kick, not limpet seal).
  function plateflexPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.plateflex));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00012, lift: s * 0.0026, rot: s * 0.62 * face, anim: "play" };
    }
    if (u < 0.88) {
      const flex = Math.sin((u - 0.12) / 0.76 * Math.PI * 4.2);
      const plate = Math.sin(t * 1.42) + 0.038 * Math.sin(t * 2.85);
      return {
        x: fromX + face * (0.00012 + flex * 0.0016 + plate * 0.00018),
        lift: 0.0026 + Math.abs(flex) * 0.00115 + Math.abs(plate) * 0.00038,
        rot: (0.62 + flex * 0.48 + plate * 0.18) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00012 * (1 - s), lift: 0.0011 * (1 - s), rot: 0.055 * (1 - s) * face, anim: "idle" };
  }

  // Opercular plate shut: sudden plate clamp-down (not limpet suction seal).
    // Radula rasping graze: head-down forward scrape over desk film (not limpet radial orbit, not barnacle cirri).
  function radularaspPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.radularasp));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00040, lift: s * -0.0046, rot: s * 0.16 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const rasp = Math.sin((u - 0.14) / 0.72 * Math.PI * 5.4);
      const bite = Math.sin(t * 2.15) * 0.00028;
      return {
        x: fromX + face * (0.00040 + (u - 0.14) / 0.72 * 0.0028 + rasp * 0.00035),
        lift: -0.0046 + Math.abs(rasp) * 0.00055 + bite,
        rot: (0.16 + rasp * 0.11) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0032 * (1 - s), lift: -0.0046 * (1 - s), rot: 0.012 * (1 - s) * face, anim: "idle" };
  }

  // Cement-hold settle: press into cemented base, almost no travel (sessile).
    // Girdle clamp settle: soft girdle margin presses flat (not cement hold, not limpet suction clamp).
  function girdlesettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.girdlesettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * -0.0072, rot: s * -0.09 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const settle = Math.sin((u - 0.18) / 0.68 * Math.PI * 1.55);
      const skirt = Math.sin(t * 0.28) * 0.00014;
      return {
        x: fromX + face * settle * 0.00007,
        lift: -0.0072 + skirt + Math.abs(settle) * 0.00024,
        rot: (-0.09 + settle * 0.045) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: -0.0072 * (1 - s), rot: -0.008 * (1 - s) * face, anim: "idle" };
  }

  // Tide-wait hush reopen: plates lift after hold, cirri peek (not limpet shell tilt).
    // Slow rock-creep: inching foot travel across the desk (mobile chiton — not sessile barnacle reopen).
  function rockcreepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rockcreep));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00055, lift: s * 0.0014, rot: s * -0.14 * face, anim: "walk" };
    }
    if (u < 0.90) {
      const creep = (u - 0.10) / 0.80;
      const bob = Math.sin(creep * Math.PI * 3.2);
      return {
        x: fromX + face * (0.00055 + creep * 0.0088 + bob * 0.00022),
        lift: 0.0014 + Math.abs(bob) * 0.00065,
        rot: (-0.14 + bob * 0.08) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00935 * (1 - s * 0.15), lift: 0.0006 * (1 - s), rot: -0.02 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "plateflex" && trick.kind !== "radularasp" && trick.kind !== "girdlesettle" && trick.kind !== "rockcreep") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "chitonhush") {
      if (next.t < CHITONHUSH_HOLD) {
        const pose = chitonhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CHITONHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CHITONHUSH_HOLD);
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
    if (next.kind === "plateflex") {
      const pose = plateflexPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "radularasp") {
      const pose = radularaspPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "girdlesettle") {
      const pose = girdlesettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = rockcreepPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CHITONHUSH_HOLD,
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
    densmailPose,
    inkmailPose,
    denspolyplacoPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    chitonhushPose,
    releasePose,
    plateflexPose,
    radularaspPose,
    girdlesettlePose,
    rockcreepPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetChitonTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
