/** Silver ground tricks while idle — ultra-polish pass. House neighborly Anguilliformes / Anguilla rostrata American Eel catadromous mucus-coated desk life (american_eel / Silver) — glasscrawl / mucuscoat / nightmigrate / gravelhide / sargasso / yellowphase / rostrata personality (glasscrawl wet land glass-eel crawl pulse without naming glass or crawl or land or wet or pulse or walk or eel or slip or slide or mud or shore or bank alone, mucuscoat mucus slime settle coat without naming mucus or coat or slime or gloss or oil or grease or skin or wet or slick or polish or slip alone, nightmigrate nocturnal migrate undulation without naming night or migrate or undul or wave or swim or cruise or ocean or sea or travel or journey or streak alone, gravelhide gravel substrate hide tuck without naming gravel or hide or tuck or substrate or bury or dig or nest or stone or sand or silt or rest or sleep or sit alone, sargasso Sargasso-sea spawn-bound run tell without naming sargasso or spawn or sea or ocean or gyre or atlantic or natal or home or travel alone, yellowphase yellow-eel freshwater grow phase tell without naming yellow or phase or grow or freshwater or river or creek or pigment or olive alone, long rostrata Anguilla rostrata Anguilliformes American eel hush hold (THE rostrata sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or oralclamp or keratinrasp or undulglide or stonenest or anadromous or sevengill or marinus or densround or inkround or densdisk or densdisc or rostrumscan or filterram or rivercruise or eggcast or ampullae or cartilaginous or spathula or densspoon or inkspoon or densrostrum or tapetumglow or duskcruise or gravelspawn or softfinhover or canine or glassy or vitreus or densnight or inknight or densglow or weedambush or scurve or toothclamp or torpedoglide or duckbill or lateral or lucius or denslance or inklance or denstorpedo or tigerbar or schoolhover or duskrise or ribbonspawn or flavescens or densbar or inkbar or denstiger or platehover or colonyfan or insectpeck or gillflare or macrochirus or denspenny or inkpenny or densplate or barbelprobe or cavitynest or mudcloud or caudalthrash or ictalurus or denswhisk or inkwhisk or densbarbel or mudhush or driftfeed or insectrise or reddscrape or vermicflash or fontinalis or densspeck or inkspeck or densredd or coverstrike or bedfan or surboil or latline or salmoides or denslunge or inklunge or densgape or densslide or denslid or denspeak or densbeak or densjaw or denslevee or denspike or denshift or denswink or densdash or house_centipede or hastebare or american_eelbare or silverbare as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play STRIKE unchanged if already fine; Round owns oralclamp/keratinrasp/undulglide/stonenest/anadromous/sevengill/marinus — do NOT reuse undulglide/anadromous; Night owns densnight themes — nightmigrate ok; Door moray is reef peer; Slick owns denslide; Whisk owns mudhush — do NOT reuse; guest slug Silver / key american_eel only for isKey matching — accept "american_eel" and "silver"; do NOT name a trick "american_eel" or "silver" or "lamprey" or "round" or "eel" or "swim" or "still" or "mudhush" or "undulglide" or "anadromous" or "house_centipede" or "haste") — not Round Petromyzon sea-lamprey/Petromyzontiformes life, not Door Gymnothorax moray life, not Spoon Polyodon paddlefish life, not Night Sander walleye life, not Lance Esox pike life, not Whisk Ictalurus mudhush life, not Haste house_centipede next, not creek fish clones, not Rui red_panda life. Glasscrawl land-crawl without naming crawl alone, mucuscoat mucus without naming slime alone, nightmigrate night-run without naming migrate alone, gravelhide gravel without naming hide alone, sargasso Sargasso without naming spawn alone, yellowphase yellow-eel without naming yellow alone, rostrata long sit_hold on the Anguilla hush (THE rostrata sit_hold tell); denssilver / inksilver / densglass thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop american_eel-tricks.js. Window-play STRIKE unchanged. Ethogram softs + freeze — never names swim/silver/still/wait/sit/american_eel as bare ethogram-only trick kinds. True American Eel Anguilla rostrata Anguilliformes desk life only — catadromous bony eel distinct from Round agnathan oral-disk, Door moray reef, Whisk mudhush, Slick denslide, Haste house_centipede next, creek peers, Ink, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Haste / house_centipede ultra done (forcipule/wallrace/antennaflick/fleetlegs/compound/fifteenpair/scutigera). Next house-order ultra: Link / millipede. No cry inventing — thank-yous are silent desk motion only; american_eel.wav EXISTS so prefersHouseCry adds american_eel after lamprey. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "american_eel";
  const TRICKS = ["glasscrawl", "mucuscoat", "nightmigrate", "gravelhide", "sargasso", "yellowphase", "rostrata"];
  const HAPPY = ["denssilver", "inksilver", "densglass"];

  const HAPPY_DUR = { denssilver: 1.70, inksilver: 1.84, densglass: 1.76 };
  const ROSTRATA_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    rostrata: ROSTRATA_HOLD + RELEASE_S,
    glasscrawl: 2.48,
    mucuscoat: 2.56,
    nightmigrate: 2.42,
    gravelhide: 2.38,
    sargasso: 2.40,
    yellowphase: 2.44,
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
    if (kind === "rostrata") return 40 + roll * 26;
    if (kind === "sargasso" || kind === "gravelhide" || kind === "glasscrawl") return 12.8 + roll * 9.4;
    if (kind === "mucuscoat" || kind === "nightmigrate" || kind === "yellowphase") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "rostrata";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "rostrata") {
      if (roll < 0.17) return "glasscrawl";
      if (roll < 0.33) return "mucuscoat";
      if (roll < 0.49) return "nightmigrate";
      if (roll < 0.65) return "gravelhide";
      if (roll < 0.83) return "sargasso";
      return "yellowphase";
    }
    if (lastKind === "glasscrawl") {
      if (roll < 0.16) return "rostrata";
      if (roll < 0.32) return "mucuscoat";
      if (roll < 0.48) return "nightmigrate";
      if (roll < 0.64) return "gravelhide";
      if (roll < 0.82) return "sargasso";
      return "yellowphase";
    }
    if (lastKind === "mucuscoat") {
      if (roll < 0.14) return "rostrata";
      if (roll < 0.3) return "glasscrawl";
      if (roll < 0.46) return "nightmigrate";
      if (roll < 0.62) return "gravelhide";
      if (roll < 0.8) return "sargasso";
      return "yellowphase";
    }
    if (lastKind === "nightmigrate") {
      if (roll < 0.15) return "rostrata";
      if (roll < 0.31) return "glasscrawl";
      if (roll < 0.47) return "mucuscoat";
      if (roll < 0.63) return "gravelhide";
      if (roll < 0.81) return "sargasso";
      return "yellowphase";
    }
    if (lastKind === "gravelhide") {
      if (roll < 0.16) return "rostrata";
      if (roll < 0.32) return "glasscrawl";
      if (roll < 0.48) return "mucuscoat";
      if (roll < 0.64) return "nightmigrate";
      if (roll < 0.82) return "sargasso";
      return "yellowphase";
    }
    if (lastKind === "sargasso") {
      if (roll < 0.15) return "rostrata";
      if (roll < 0.31) return "glasscrawl";
      if (roll < 0.47) return "mucuscoat";
      if (roll < 0.63) return "nightmigrate";
      if (roll < 0.81) return "gravelhide";
      return "yellowphase";
    }
    if (lastKind === "yellowphase") {
      if (roll < 0.16) return "rostrata";
      if (roll < 0.32) return "glasscrawl";
      if (roll < 0.48) return "mucuscoat";
      if (roll < 0.64) return "nightmigrate";
      if (roll < 0.82) return "gravelhide";
      return "sargasso";
    }
    if (roll < 0.14) return "rostrata";
    if (roll < 0.28) return "glasscrawl";
    if (roll < 0.42) return "mucuscoat";
    if (roll < 0.56) return "nightmigrate";
    if (roll < 0.7) return "gravelhide";
    if (roll < 0.85) return "sargasso";
    return "yellowphase";
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
    return key === TRICK_KEY || key === "silver";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denssilver";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denssilver" ? "sit" : name === "inksilver" ? "play" : "sit"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denssilverPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssilver));
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

  function inksilverPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksilver));
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

  function densglassPose(t) {
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
    if (next.kind === "denssilver") {
      const pose = denssilverPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inksilver") {
      const pose = inksilverPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densglassPose(next.t);
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
      kind === "rostrata"
        ? "sit"
        : kind === "glasscrawl"
          ? "talk"
          : kind === "mucuscoat"
            ? "play"
            : kind === "nightmigrate"
              ? "sit"
              : kind === "gravelhide"
                ? "play"
                : kind === "sargasso"
                  ? "talk"
                  : kind === "yellowphase"
                    ? "sit"
                    : "sit";
    return {
      kind,
      phase: kind === "rostrata" ? "hold" : "go",
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

  function rostrataPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function glasscrawlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.glasscrawl));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "talk" };
    }
    if (u < 0.78) {
      const bar = Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.8 + bar * 0.16),
        lift: 2.8 + Math.abs(bar) * 1.5,
        rot: face * (-12 + bar * 10),
        anim: "talk",
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

  function nightmigratePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nightmigrate));
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

  function mucuscoatPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mucuscoat));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "play" };
    }
    if (u < 0.8) {
      const cloud = Math.sin(t * 3.0);
      return {
        x: fromX + face * (0.6 + cloud * 0.18),
        lift: 3.0 + Math.abs(cloud) * 1.8,
        rot: face * (14 + cloud * 12),
        anim: "play",
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

  function yellowphasePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.yellowphase));
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

  function sargassoPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sargasso));
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

  function gravelhidePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gravelhide));
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
      trick.kind !== "glasscrawl" &&
      trick.kind !== "mucuscoat" &&
      trick.kind !== "nightmigrate" &&
      trick.kind !== "gravelhide" &&
      trick.kind !== "sargasso" &&
      trick.kind !== "yellowphase"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "rostrata") {
      if (next.t < ROSTRATA_HOLD) {
        const pose = rostrataPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ROSTRATA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ROSTRATA_HOLD);
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
    if (next.kind === "glasscrawl") {
      const pose = glasscrawlPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mucuscoat") {
      const pose = mucuscoatPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nightmigrate") {
      const pose = nightmigratePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gravelhide") {
      const pose = gravelhidePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sargasso") {
      const pose = sargassoPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = yellowphasePose(next.t, fromX, trick.facing);
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
    ROSTRATA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    rostrataPose,
    releasePose,
    glasscrawlPose,
    nightmigratePose,
    mucuscoatPose,
    yellowphasePose,
    sargassoPose,
    gravelhidePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denssilverPose,
    inksilverPose,
    densglassPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAmericanEelTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
