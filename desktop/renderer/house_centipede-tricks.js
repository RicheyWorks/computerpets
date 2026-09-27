/** Haste ground tricks while idle — ultra-polish pass. House neighborly Chilopoda / Scutigera coleoptrata House Centipede nocturnal many-legged desk life (house_centipede / Haste) — forcipule / wallrace / antennaflick / fleetlegs / compound / fifteenpair / scutigera personality (forcipule forcipule strike clamp pulse without naming forcipule or strike or clamp or pulse or fang or bite or venom or pinch or seize or prey or hunt or kill or grab alone, wallrace rapid wall ceiling race dash without naming wall or race or ceiling or dash or climb or vertical or upside or hang or stick or glue or sprint or blur or zoom or rush alone, antennaflick long antenna sense flick without naming antenna or flick or sense or feeler or sweep or probe or touch or sniff or whisker or tap or wave alone, fleetlegs multi-leg fleet ripple run without naming fleet or legs or ripple or run or scuttle or blur or hurry or dash or sprint or zoom or rush or walk or crawl alone, compound compound-eye mosaic tell without naming compound or eye or mosaic or facet or ommatidia or vision or stare or glare alone, fifteenpair fifteen-pair leg count tell without naming fifteen or pair or leg or count or segment or trunk or body alone, long scutigera Scutigera coleoptrata Chilopoda house centipede hush hold (THE scutigera sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or glasscrawl or mucuscoat or nightmigrate or gravelhide or sargasso or yellowphase or rostrata or denssilver or inksilver or densglass or oralclamp or keratinrasp or undulglide or stonenest or anadromous or sevengill or marinus or densround or inkround or densdisk or densdisc or legwave or ultrarun or antennaprobe or wallcling or preyseize or coleoptrata or densantenna or house_centipede or hastebare or millipede or linkbare or diplopod as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play STRIKE unchanged if already fine; Silver owns glasscrawl/mucuscoat/nightmigrate/gravelhide/sargasso/yellowphase/rostrata — do NOT reuse; Stem owns legwave/antennaprobe; Gale/Clasp/Barb/Whip arachnid peers; Link millipede next — leave diplopod words free; header forbids legwave/ultrarun/antennaprobe/wallcling/preyseize/coleoptrata; guest slug Haste / key house_centipede only for isKey matching — accept "house_centipede" and "haste"; do NOT name a trick "house_centipede" or "haste" or "american_eel" or "silver" or "millipede" or "link" or "legwave" or "walk" or "still" or "hunt") — not Silver Anguilla american-eel/Anguilliformes life, not Round Petromyzon sea-lamprey life, not Stem harvestman Opiliones life, not Gale solifuge / Clasp tick / Barb scorpion / Whip vinegaroon arachnid life, not Link millipede Diplopoda next, not Rui red_panda life. Forcipule forcipule without naming strike alone, wallrace wall-race without naming climb alone, antennaflick antenna without naming probe alone, fleetlegs fleet without naming run alone, compound compound-eye without naming eye alone, fifteenpair fifteen-pair without naming leg alone, scutigera long sit_hold on the Scutigera hush (THE scutigera sit_hold tell); denshaste / inkhaste / densforcep thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop house_centipede-tricks.js. Window-play STRIKE unchanged. Ethogram softs + freeze — never names hunt/walk/still/wait/sit/house_centipede/haste as bare ethogram-only trick kinds. True House Centipede Scutigera coleoptrata Chilopoda desk life only — nocturnal many-legged wall-ceiling hunter with long antennae and forcipules distinct from Silver eel, Stem harvestman, Link millipede next, Gale/Clasp/Barb/Whip arachnids, creek peers, Ink, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Link / millipede ultra done (coilcurl/detritusgrub/slowmarch/moistseek/benzoquinone/metachronal/narceus). Armor / pillbug ultra done (conglobate/volvation/antennafeel/detritusnip/pleopods/uropodtap/vulgare). Cast / earthworm ultra done (peristalse/castheap/surfacerise/soilanchor/clitellum/setaebrace/terrestris). Jet / velvet_worm ultra done (slimejet/lobopod/antennawhip/preyharpoon/oralpapilla/onychophore/peripatus). Next house-order ultra: Hop / springtail. No cry inventing — thank-yous are silent desk motion only; house_centipede.wav EXISTS so prefersHouseCry adds house_centipede after american_eel. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "house_centipede";
  const TRICKS = ["forcipule", "wallrace", "antennaflick", "fleetlegs", "compound", "fifteenpair", "scutigera"];
  const HAPPY = ["denshaste", "inkhaste", "densforcep"];

  const HAPPY_DUR = { denshaste: 1.70, inkhaste: 1.84, densforcep: 1.76 };
  const SCUTIGERA_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    scutigera: SCUTIGERA_HOLD + RELEASE_S,
    forcipule: 2.48,
    wallrace: 2.56,
    antennaflick: 2.42,
    fleetlegs: 2.38,
    compound: 2.40,
    fifteenpair: 2.44,
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
    if (kind === "scutigera") return 40 + roll * 26;
    if (kind === "compound" || kind === "fleetlegs" || kind === "forcipule") return 12.8 + roll * 9.4;
    if (kind === "wallrace" || kind === "antennaflick" || kind === "fifteenpair") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "scutigera";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "scutigera") {
      if (roll < 0.17) return "forcipule";
      if (roll < 0.33) return "wallrace";
      if (roll < 0.49) return "antennaflick";
      if (roll < 0.65) return "fleetlegs";
      if (roll < 0.83) return "compound";
      return "fifteenpair";
    }
    if (lastKind === "forcipule") {
      if (roll < 0.16) return "scutigera";
      if (roll < 0.32) return "wallrace";
      if (roll < 0.48) return "antennaflick";
      if (roll < 0.64) return "fleetlegs";
      if (roll < 0.82) return "compound";
      return "fifteenpair";
    }
    if (lastKind === "wallrace") {
      if (roll < 0.14) return "scutigera";
      if (roll < 0.3) return "forcipule";
      if (roll < 0.46) return "antennaflick";
      if (roll < 0.62) return "fleetlegs";
      if (roll < 0.8) return "compound";
      return "fifteenpair";
    }
    if (lastKind === "antennaflick") {
      if (roll < 0.15) return "scutigera";
      if (roll < 0.31) return "forcipule";
      if (roll < 0.47) return "wallrace";
      if (roll < 0.63) return "fleetlegs";
      if (roll < 0.81) return "compound";
      return "fifteenpair";
    }
    if (lastKind === "fleetlegs") {
      if (roll < 0.16) return "scutigera";
      if (roll < 0.32) return "forcipule";
      if (roll < 0.48) return "wallrace";
      if (roll < 0.64) return "antennaflick";
      if (roll < 0.82) return "compound";
      return "fifteenpair";
    }
    if (lastKind === "compound") {
      if (roll < 0.15) return "scutigera";
      if (roll < 0.31) return "forcipule";
      if (roll < 0.47) return "wallrace";
      if (roll < 0.63) return "antennaflick";
      if (roll < 0.81) return "fleetlegs";
      return "fifteenpair";
    }
    if (lastKind === "fifteenpair") {
      if (roll < 0.16) return "scutigera";
      if (roll < 0.32) return "forcipule";
      if (roll < 0.48) return "wallrace";
      if (roll < 0.64) return "antennaflick";
      if (roll < 0.82) return "fleetlegs";
      return "compound";
    }
    if (roll < 0.14) return "scutigera";
    if (roll < 0.28) return "forcipule";
    if (roll < 0.42) return "wallrace";
    if (roll < 0.56) return "antennaflick";
    if (roll < 0.7) return "fleetlegs";
    if (roll < 0.85) return "compound";
    return "fifteenpair";
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
    return key === TRICK_KEY || key === "haste";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denshaste";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denshaste" ? "sit" : name === "inkhaste" ? "play" : "sit"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denshastePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshaste));
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

  function inkhastePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhaste));
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

  function densforcepPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.58) * 8,
      dx: Math.sin(t * 0.4) * 0.06,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denshaste") {
      const pose = denshastePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkhaste") {
      const pose = inkhastePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densforcepPose(next.t);
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
    kind === "scutigera"
      ? "sit"
      : kind === "forcipule"
        ? "play"
        : kind === "wallrace"
          ? "talk"
          : kind === "antennaflick"
            ? "play"
            : kind === "fleetlegs"
              ? "talk"
              : kind === "compound"
                ? "talk"
                : kind === "fifteenpair"
                  ? "sit"
                  : "sit";
    return {
      kind,
      phase: kind === "scutigera" ? "hold" : "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim,
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function scutigeraPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function forcipulePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.forcipule));
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

  function antennaflickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennaflick));
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

  function wallracePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wallrace));
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

  function fifteenpairPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fifteenpair));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "play" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "play",
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

  function compoundPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.compound));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "talk" };
    }
    if (u < 0.78) {
      const hang = Math.sin(t * 2.0);
      return {
        x: fromX + face * (0.5 + hang * 0.1),
        lift: 2.8 + Math.abs(hang) * 1.2,
        rot: face * (11 + hang * 8),
        anim: "talk",
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

  function fleetlegsPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fleetlegs));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "talk" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "talk",
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
      trick.kind !== "forcipule" &&
      trick.kind !== "wallrace" &&
      trick.kind !== "antennaflick" &&
      trick.kind !== "fleetlegs" &&
      trick.kind !== "compound" &&
      trick.kind !== "fifteenpair"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "scutigera") {
      if (next.t < SCUTIGERA_HOLD) {
        const pose = scutigeraPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SCUTIGERA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SCUTIGERA_HOLD);
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
    if (next.kind === "forcipule") {
      const pose = forcipulePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "wallrace") {
      const pose = wallracePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennaflick") {
      const pose = antennaflickPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fleetlegs") {
      const pose = fleetlegsPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "compound") {
      const pose = compoundPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = fifteenpairPose(next.t, fromX, trick.facing);
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
    SCUTIGERA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    scutigeraPose,
    releasePose,
    forcipulePose,
    antennaflickPose,
    wallracePose,
    fifteenpairPose,
    compoundPose,
    fleetlegsPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denshastePose,
    inkhastePose,
    densforcepPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHouseCentipedeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
