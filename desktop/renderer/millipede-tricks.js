/** Link ground tricks while idle — ultra-polish pass. House neighborly Diplopoda / Narceus americanus American Giant Millipede detritivore desk life (millipede / Link) — coilcurl / detritusgrub / slowmarch / moistseek / benzoquinone / metachronal / narceus personality (coilcurl defensive spiral curl without naming coil or curl or spiral or defense or roll or ball or armor or armorup or hide or tuck or sleep or sit alone, detritusgrub leaf litter detritus feed grub without naming detritus or grub or litter or leaf or feed or eat or chew or forage or nibble or mulch or compost or dirt or soil alone, slowmarch many-leg slow march without naming march or walk or crawl or scuttle or run or dash or sprint or blur or race or fleet or centipede or myriapod alone, moistseek humidity moisture hunt seek without naming moist or seek or humidity or damp or wet or water or drink or sniff or hunt or search or probe or antenna alone, benzoquinone benzoquinone ozopore defensive oil tell without naming benzoquinone or oil or quinone or ozopore or chemical or spray or scent or stink or defense or puff alone, metachronal metachronal diplopod leg-wave tell without naming metachronal or wave or ripple or leg or pair or segment or ring or trunk alone, long narceus Narceus americanus Diplopoda American giant millipede hush hold (THE narceus sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or forcipule or wallrace or antennaflick or fleetlegs or compound or fifteenpair or scutigera or denshaste or inkhaste or densforcep or densantenna or ultrarun or antennaprobe or wallcling or preyseize or coleoptrata or glasscrawl or mucuscoat or nightmigrate or gravelhide or sargasso or yellowphase or rostrata or denssilver or inksilver or densglass or oralclamp or keratinrasp or undulglide or stonenest or anadromous or sevengill or marinus or densround or inkround or densdisk or densdisc or legwave or leafhush or hingeshut or carolinae or denslid or inklid or densdome or duffgrub or roll or ball or armor or conglobate or volvation or pillbug or armorup or house_centipede or hastebare or millipede or linkbare or diplopod or walk or oil or still as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play STRIKE unchanged if already fine; Haste owns forcipule/wallrace/antennaflick/fleetlegs/compound/fifteenpair/scutigera — do NOT reuse; Lid owns leafhush; Cast earthworm may own duffgrub later — leave free; Armor pillbug next — leave roll/ball/armor/conglobate/volvation words free; header forbids leafhush/forcipule/wallrace/scutigera/duffgrub/roll/ball; guest slug Link / key millipede only for isKey matching — accept "millipede" and "link"; do NOT name a trick "millipede" or "link" or "house_centipede" or "haste" or "pillbug" or "armor" or "walk" or "oil" or "still" or "hunt") — not Haste Scutigera house-centipede/Chilopoda life, not Armor Armadillidium pillbug next, not Cast Lumbricus earthworm life, not Lid Terrapene box-turtle life, not Silver Anguilla american-eel life, not Rui red_panda life. Coilcurl spiral without naming roll alone, detritusgrub litter grub without naming eat alone, slowmarch slow march without naming walk alone, moistseek moisture seek without naming hunt alone, benzoquinone ozopore oil without naming oil alone, metachronal diplopod wave without naming wave alone, narceus long sit_hold on the Narceus hush (THE narceus sit_hold tell); denslink / inklink / denscoil thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop millipede-tricks.js. Window-play STRIKE unchanged. Ethogram softs + freeze — never names hunt/walk/oil/still/wait/sit/millipede/link as bare ethogram-only trick kinds. True American Giant Millipede Narceus americanus Diplopoda desk life only — slow many-segmented detritivore that coils in defense, grubs leaf litter, marches on many legs, seeks moisture, vents benzoquinone, and shows metachronal leg waves; distinct from Haste house centipede/Chilopoda predator, Armor pillbug next, Cast earthworm, Lid box turtle, Silver eel, creek peers, Ink, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Armor / pillbug ultra done (conglobate/volvation/antennafeel/detritusnip/pleopods/uropodtap/vulgare). Cast / earthworm ultra done (peristalse/castheap/surfacerise/soilanchor/clitellum/setaebrace/terrestris). Jet / velvet_worm ultra done (slimejet/lobopod/antennawhip/preyharpoon/oralpapilla/onychophore/peripatus). Next house-order ultra: Hop / springtail. No cry inventing — thank-yous are silent desk motion only; millipede.wav EXISTS so prefersHouseCry adds millipede after house_centipede. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "millipede";
  const TRICKS = ["coilcurl", "detritusgrub", "slowmarch", "moistseek", "benzoquinone", "metachronal", "narceus"];
  const HAPPY = ["denslink", "inklink", "denscoil"];

  const HAPPY_DUR = { denslink: 1.70, inklink: 1.84, denscoil: 1.76 };
  const NARCEUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    narceus: NARCEUS_HOLD + RELEASE_S,
    coilcurl: 2.48,
    detritusgrub: 2.56,
    slowmarch: 2.42,
    moistseek: 2.38,
    benzoquinone: 2.40,
    metachronal: 2.44,
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
    if (kind === "narceus") return 40 + roll * 26;
    if (kind === "benzoquinone" || kind === "moistseek" || kind === "coilcurl") return 12.8 + roll * 9.4;
    if (kind === "detritusgrub" || kind === "slowmarch" || kind === "metachronal") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "narceus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "narceus") {
      if (roll < 0.17) return "coilcurl";
      if (roll < 0.33) return "detritusgrub";
      if (roll < 0.49) return "slowmarch";
      if (roll < 0.65) return "moistseek";
      if (roll < 0.83) return "benzoquinone";
      return "metachronal";
    }
    if (lastKind === "coilcurl") {
      if (roll < 0.16) return "narceus";
      if (roll < 0.32) return "detritusgrub";
      if (roll < 0.48) return "slowmarch";
      if (roll < 0.64) return "moistseek";
      if (roll < 0.82) return "benzoquinone";
      return "metachronal";
    }
    if (lastKind === "detritusgrub") {
      if (roll < 0.14) return "narceus";
      if (roll < 0.3) return "coilcurl";
      if (roll < 0.46) return "slowmarch";
      if (roll < 0.62) return "moistseek";
      if (roll < 0.8) return "benzoquinone";
      return "metachronal";
    }
    if (lastKind === "slowmarch") {
      if (roll < 0.15) return "narceus";
      if (roll < 0.31) return "coilcurl";
      if (roll < 0.47) return "detritusgrub";
      if (roll < 0.63) return "moistseek";
      if (roll < 0.81) return "benzoquinone";
      return "metachronal";
    }
    if (lastKind === "moistseek") {
      if (roll < 0.16) return "narceus";
      if (roll < 0.32) return "coilcurl";
      if (roll < 0.48) return "detritusgrub";
      if (roll < 0.64) return "slowmarch";
      if (roll < 0.82) return "benzoquinone";
      return "metachronal";
    }
    if (lastKind === "benzoquinone") {
      if (roll < 0.15) return "narceus";
      if (roll < 0.31) return "coilcurl";
      if (roll < 0.47) return "detritusgrub";
      if (roll < 0.63) return "slowmarch";
      if (roll < 0.81) return "moistseek";
      return "metachronal";
    }
    if (lastKind === "metachronal") {
      if (roll < 0.16) return "narceus";
      if (roll < 0.32) return "coilcurl";
      if (roll < 0.48) return "detritusgrub";
      if (roll < 0.64) return "slowmarch";
      if (roll < 0.82) return "moistseek";
      return "benzoquinone";
    }
    if (roll < 0.14) return "narceus";
    if (roll < 0.28) return "coilcurl";
    if (roll < 0.42) return "detritusgrub";
    if (roll < 0.56) return "slowmarch";
    if (roll < 0.7) return "moistseek";
    if (roll < 0.85) return "benzoquinone";
    return "metachronal";
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
    return key === TRICK_KEY || key === "link";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denslink";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denslink" ? "sit" : name === "inklink" ? "play" : "sit"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denslinkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslink));
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

  function inklinkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inklink));
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

  function denscoilPose(t) {
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
    if (next.kind === "denslink") {
      const pose = denslinkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inklink") {
      const pose = inklinkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscoilPose(next.t);
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
    kind === "narceus"
      ? "sit"
      : kind === "coilcurl"
        ? "play"
        : kind === "detritusgrub"
          ? "talk"
          : kind === "slowmarch"
            ? "play"
            : kind === "moistseek"
              ? "talk"
              : kind === "benzoquinone"
                ? "talk"
                : kind === "metachronal"
                  ? "sit"
                  : "sit";
    return {
      kind,
      phase: kind === "narceus" ? "hold" : "go",
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

  function narceusPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function coilcurlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.coilcurl));
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

  function slowmarchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.slowmarch));
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

  function detritusgrubPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.detritusgrub));
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

  function metachronalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.metachronal));
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

  function benzoquinonePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.benzoquinone));
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

  function moistseekPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.moistseek));
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
      trick.kind !== "coilcurl" &&
      trick.kind !== "detritusgrub" &&
      trick.kind !== "slowmarch" &&
      trick.kind !== "moistseek" &&
      trick.kind !== "benzoquinone" &&
      trick.kind !== "metachronal"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "narceus") {
      if (next.t < NARCEUS_HOLD) {
        const pose = narceusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < NARCEUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - NARCEUS_HOLD);
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
    if (next.kind === "coilcurl") {
      const pose = coilcurlPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "detritusgrub") {
      const pose = detritusgrubPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "slowmarch") {
      const pose = slowmarchPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "moistseek") {
      const pose = moistseekPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "benzoquinone") {
      const pose = benzoquinonePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = metachronalPose(next.t, fromX, trick.facing);
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
    NARCEUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    narceusPose,
    releasePose,
    coilcurlPose,
    slowmarchPose,
    detritusgrubPose,
    metachronalPose,
    benzoquinonePose,
    moistseekPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denslinkPose,
    inklinkPose,
    denscoilPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMillipedeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
