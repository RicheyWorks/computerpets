/** Spire ground tricks while idle. House neighborly Littorinidae / Littorina littorea Common Periwinkle desk life — spiralcrawl / filmgraze / opercshut / tidehuddle / littorinahush personality (spiralcrawl spiral shell tip-up crawl without naming spiral or tip or crawl or shell or trek or inch alone as wait, filmgraze radula film graze without naming radula or film or graze or rasp or scrape or lick alone as wait, opercshut operculum seal shut without naming operculum or seal or shut or door or retract or plug alone as wait, tidehuddle tide-cluster huddle cue without naming tide or cluster or huddle or cue or nestle or pack alone as wait, long littorinahush Littorina common-periwinkle hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or spiralcrawl or filmgraze or opercshut or tidehuddle or littorinahush or densspire or inkspire or denslittorina or cirrikick or opershut or cementhold or tidereopen or balanushush or denscement or inkcement or densbalanus or clampseal or radialgraze or circumhome or shelltilt or patellahush or denscone or inkcone or denspatella or sprintdash or stalkeyescan or burrowplunge or freezecamo or ocypodehush or denspale or inkpale or densghost or clawwave or burrowdig or sandfeed or lateralsidestep or pugilator or denswave or inkwave or densmajor or sideswim or gnathopod or detritusclutch or pairguard or gammarus or densscud or inkscud or densgnath or densclaw or pedal or pneumostome or ommatophore or lymnaeid or stagnalis or physa or radix or lamella or imbricate or lasso or margin or pleurotus or adductor or protractor or inhalant or ctenidium or unionid or siphuncle or nacre or pinhole or fringe or chamber or pearl or quiet or densarmor or spiralcrawl or filmgraze or opercshut or tidehuddle or littorinahush; window-play and Call Spire leave periwinkle alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor/Cast/Jet/Hop/Tun/Half/Thread/Scud/Wave/Pale/Cone/Cement/Mail own their tricks; guest slug Spire / key periwinkle — accept "periwinkle" and "spire" (roster slug spire; campaign Spire); do NOT accept bare "spire" as a trick id; do NOT confuse with Mail the Lined Chiton (key chiton / slug mail) or densspire thank-you; do NOT confuse with Cement the Acorn Barnacle (key barnacle / slug cement) or opershut; do NOT confuse with Cone the Limpet (key limpet / slug cone) or denscone thank-you; do NOT confuse with Pale the Ghost Crab or Wave the Fiddler Crab or Scud the Amphipod; do NOT confuse with Whorl the Pond Snail radula/pneumostome gape; do NOT confuse with Frill the Oyster or Hinge the Mussel; do NOT confuse with Armor densarmor; do NOT confuse with Token the Sand Dollar (key sand_dollar / slug token) — do not start Token in parallel; do NOT name a trick periwinkle or spire or chiton or mail or barnacle or cement or limpet or cone or denscone or denspatella or denscement or densbalanus or densspire or denslittorina or ghost_crab or pale or denspale or densclaw or chamber or densarmor. Thank-yous densspire / inkspire / denslittorina. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web periwinkle-tricks.ts. Window-play unchanged. True common periwinkle desk life — spiral shell tip-up crawl, radula film graze, operculum seal shut, and tide-cluster huddle cue; not Tonicella chiton clones (spiralcrawl/filmgraze/opercshut/tidehuddle), not Balanus barnacle clones (cirrikick/opershut/cementhold/tidereopen), not Patella limpet clones (clampseal/radialgraze/circumhome/shelltilt), not Ocypode ghost-crab clones, not Uca fiddler clones, not Gammarus amphipod clones, not Lymnaea pond-snail gape, not oyster/mussel bivalve clones, not sand-dollar Token (next guest) — true Littorina common periwinkle / Littorinidae life. Next house-order guest after Spire still lacking tricks owns the next seat (Token / sand_dollar). No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "periwinkle";
  const TRICKS = ["spiralcrawl", "filmgraze", "opercshut", "tidehuddle", "littorinahush"];
  const HAPPY = ["densspire", "inkspire", "denslittorina"];
  const HAPPY_DUR = { densspire: 2.68, inkspire: 2.84, denslittorina: 2.58 };
  const LITTORINAHUSH_HOLD = 26.15;
  const RELEASE_S = 2.28;
  const DUR = { littorinahush: LITTORINAHUSH_HOLD + RELEASE_S, spiralcrawl: 5.24, filmgraze: 4.86, opercshut: 4.58, tidehuddle: 4.96 };

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
    if (kind === "littorinahush") return 176 + roll * 14;
    if (kind === "spiralcrawl") return 27.4 + roll * 4.7;
    if (kind === "filmgraze") return 26.1 + roll * 4.4;
    if (kind === "opercshut") return 25.9 + roll * 4.2;
    if (kind === "tidehuddle") return 26.6 + roll * 4.5;
    return justFinished ? 19.8 + roll * 3.0 : 15.0 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "littorinahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "littorinahush") {
      if (roll < 0.26) return "spiralcrawl";
      if (roll < 0.5) return "filmgraze";
      if (roll < 0.74) return "opercshut";
      return "tidehuddle";
    }
    if (lastKind === "spiralcrawl") {
      if (roll < 0.26) return "littorinahush";
      if (roll < 0.5) return "filmgraze";
      if (roll < 0.74) return "opercshut";
      return "tidehuddle";
    }
    if (lastKind === "filmgraze") {
      if (roll < 0.22) return "littorinahush";
      if (roll < 0.44) return "spiralcrawl";
      if (roll < 0.68) return "opercshut";
      return "tidehuddle";
    }
    if (roll < 0.2) return "littorinahush";
    if (roll < 0.4) return "spiralcrawl";
    if (roll < 0.6) return "filmgraze";
    if (roll < 0.8) return "opercshut";
    return "tidehuddle";
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
    return key === TRICK_KEY || key === "spire";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densspire";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densspire" ? "sit" : name === "inkspire" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densspirePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densspire));
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
  function inkspirePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspire));
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
  function denslittorinaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslittorina));
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
    if (next.kind === "densspire") {
      const pose = densspirePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkspire") {
      const pose = inkspirePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denslittorinaPose(next.t);
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
      kind === "littorinahush"
        ? "sit"
        : kind === "spiralcrawl"
          ? "walk"
          : kind === "filmgraze"
            ? "play"
            : kind === "opercshut"
              ? "sit"
              : kind === "tidehuddle"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "littorinahush" ? "hold" : "go",
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

  function littorinahushPose(t) {
    const breath = Math.sin(t * 0.00172) + 0.00078 * Math.sin(t * 0.0058);
    const hush = Math.abs(Math.sin(t * 0.00088));
    return { lift: -0.00038 + hush * 0.00012, rot: -0.014 + breath * 0.0048 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00034 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.014 * (1 - u) };
  }

  // Spiral shell tip-up crawl: shell apex tipped up while foot inches forward (not chiton rockcreep, not limpet circumhome).
  function spiralcrawlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spiralcrawl));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00048, lift: s * 0.0034, rot: s * 0.42 * face, anim: "walk" };
    }
    if (u < 0.90) {
      const crawl = (u - 0.11) / 0.79;
      const tip = Math.sin(crawl * Math.PI * 2.6);
      const spiral = Math.sin(t * 0.92) + 0.04 * Math.sin(t * 1.85);
      return {
        x: fromX + face * (0.00048 + crawl * 0.0076 + tip * 0.00028),
        lift: 0.0034 + Math.abs(tip) * 0.00085 + Math.abs(spiral) * 0.00022,
        rot: (0.42 + tip * 0.16 + spiral * 0.06) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.0081 * (1 - s * 0.12), lift: 0.0012 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" };
  }

  // Radula film graze: side-to-side biofilm scrape under the spiral shell (not chiton radularasp forward bite, not pond-snail radula).
  function filmgrazePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.filmgraze));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.00018, lift: s * -0.0038, rot: s * -0.22 * face, anim: "play" };
    }
    if (u < 0.88) {
      const sweep = Math.sin((u - 0.13) / 0.75 * Math.PI * 4.6);
      const rasp = Math.sin(t * 1.68) + 0.045 * Math.sin(t * 3.1);
      return {
        x: fromX + face * (0.00018 + sweep * 0.0014 + rasp * 0.00016),
        lift: -0.0038 + Math.abs(sweep) * 0.00072 + Math.abs(rasp) * 0.00032,
        rot: (-0.22 + sweep * 0.34 + rasp * 0.10) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00018 * (1 - s), lift: -0.0014 * (1 - s), rot: -0.03 * (1 - s) * face, anim: "idle" };
  }

  // Operculum seal shut: retract into spiral shell and close the trapdoor (not barnacle opershut plates, not limpet clampseal).
  function opercshutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.opercshut));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * -0.0064, rot: s * 0.08 * face, anim: "sit" };
    }
    if (u < 0.82) {
      const seal = Math.sin((u - 0.16) / 0.66 * Math.PI * 1.8);
      const door = Math.sin(t * 0.36) * 0.00010;
      return {
        x: fromX + face * seal * 0.00005,
        lift: -0.0064 + door + Math.abs(seal) * 0.00018,
        rot: (0.08 + seal * 0.035) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX, lift: -0.0064 * (1 - s), rot: 0.01 * (1 - s) * face, anim: "idle" };
  }

  // Tide-cluster huddle cue: nestle low and lean as if packing with neighbors (not chiton plateflex curl).
  function tidehuddlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tidehuddle));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00022, lift: s * -0.0024, rot: s * -0.28 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const huddle = Math.sin((u - 0.14) / 0.72 * Math.PI * 2.1);
      const pack = Math.sin(t * 0.55) * 0.00012;
      return {
        x: fromX + face * (0.00022 + huddle * 0.00055),
        lift: -0.0024 + pack + Math.abs(huddle) * 0.00045,
        rot: (-0.28 + huddle * 0.12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00022 * (1 - s), lift: -0.0024 * (1 - s), rot: -0.04 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "spiralcrawl" && trick.kind !== "filmgraze" && trick.kind !== "opercshut" && trick.kind !== "tidehuddle") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "littorinahush") {
      if (next.t < LITTORINAHUSH_HOLD) {
        const pose = littorinahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LITTORINAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LITTORINAHUSH_HOLD);
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
    if (next.kind === "spiralcrawl") {
      const pose = spiralcrawlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "filmgraze") {
      const pose = filmgrazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "opercshut") {
      const pose = opercshutPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tidehuddlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LITTORINAHUSH_HOLD,
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
    densspirePose,
    inkspirePose,
    denslittorinaPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    littorinahushPose,
    releasePose,
    spiralcrawlPose,
    filmgrazePose,
    opercshutPose,
    tidehuddlePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPeriwinkleTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
