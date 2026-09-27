/** Jet ground tricks while idle — ultra-polish pass. House neighborly Onychophora / Peripatus Velvet Worm slime-jet desk life (velvet_worm / Jet) — slimejet / lobopod / antennawhip / preyharpoon / oralpapilla / onychophore / peripatus personality (slimejet oral-papilla slime jet squirt without naming squirt or spit or spray or shoot or glue or slime or jet or ink or blast or harpoon alone as wait, lobopod lobopod stubby-leg ripple gait without naming walk or crawl or ripple or gait or leg or march or undulate or peristalsis or wriggle or slither, antennawhip antenna whip sense without naming whip or sense or feel or probe or antenna or tap or scan or sniff or search — Haste owns antennaflick, antennawhip ok, preyharpoon glue-harpoon prey lunge without naming lunge or strike or prey or hunt or attack or catch or grab or bite or eat or feed, oralpapilla oral papillae tell without naming papilla or mouth or oral or lip or tip or nozzle alone, onychophore Onychophora claw-bearing soft-pad tell without naming claw or pad or onycho or velvet or worm alone, long peripatus Peripatus Onychophora velvet worm hush hold (THE peripatus sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or peristalse or castheap or surfacerise or soilanchor or clitellum or setaebrace or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or leafhush or cast or crawl or still or roll or walk or sit or earthworm or pillbug or armor or millipede or link or house_centipede or haste or velvet_worm or jet as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Cast owns peristalse/castheap/surfacerise/soilanchor/clitellum/setaebrace/terrestris — do NOT reuse; Lid owns leafhush — do NOT reuse; Haste owns antennaflick — antennawhip ok; Octopus owns bare jet; Cicada owns bare cast; Velvet tarantula is key tarantula / slug velvet — do NOT confuse; header forbids velvet_worm/jet/cast/crawl/still/roll/walk/sit/leafhush; guest slug Jet / key velvet_worm only for isKey matching — accept "velvet_worm" and "jet"; do NOT name a trick "velvet_worm" or "jet" or "earthworm" or "cast" or "pillbug" or "armor" or "millipede" or "link" or "house_centipede" or "haste" or "tarantula" or "velvet") — not Cast Lumbricus earthworm/Annelida life, not Armor Armadillidium pillbug/Isopoda life, not Link Narceus millipede/Diplopoda life, not Haste Scutigera house-centipede/Chilopoda life, not Velvet Theraphosidae tarantula life, not Hop springtail (done), not Rui red_panda life. Slimejet without naming jet alone, lobopod without naming walk alone, antennawhip without naming antennaflick alone, preyharpoon without naming strike alone, oralpapilla without naming mouth alone, onychophore without naming velvet alone, peripatus long sit_hold on the Peripatus hush (THE peripatus sit_hold tell); densjet / inkjet / denslobo thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop velvet_worm-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names jet/walk/still/wait/sit/velvet_worm as bare ethogram-only trick kinds. True Velvet Worm Peripatus Onychophora desk life only — soft slime-jet predator with lobopod legs, antenna whip, oral-papillae glue harpoon, and onychophoran hush; distinct from Cast earthworm/Annelida peristalsis, Armor pillbug/Isopoda ball-roll, Link millipede/Diplopoda spiral, Haste house centipede/Chilopoda predator, Velvet tarantula, Hop springtail done, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Hop / springtail ultra done (furculaflick/antennawalk/moistclingsoil/foldtuck/collophore/denspring/orchesella or anhydro or styletpierce). Next house-order ultra: Tun / tardigrade. No cry inventing — thank-yous are silent desk motion only; velvet_worm.wav EXISTS so prefersHouseCry adds velvet_worm after earthworm. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "velvet_worm";
  const TRICKS = ["slimejet", "lobopod", "antennawhip", "preyharpoon", "oralpapilla", "onychophore", "peripatus"];
  const HAPPY = ["densjet", "inkjet", "denslobo"];

  const HAPPY_DUR = { densjet: 1.70, inkjet: 1.84, denslobo: 1.76 };
  const PERIPATUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    peripatus: PERIPATUS_HOLD + RELEASE_S,
    slimejet: 2.48,
    preyharpoon: 2.56,
    lobopod: 2.42,
    antennawhip: 2.38,
    oralpapilla: 2.40,
    onychophore: 2.44,
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
    if (kind === "peripatus") return 40 + roll * 26;
    if (kind === "oralpapilla" || kind === "antennawhip" || kind === "slimejet") return 12.8 + roll * 9.4;
    if (kind === "preyharpoon" || kind === "lobopod" || kind === "onychophore") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "peripatus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "peripatus") {
      if (roll < 0.17) return "slimejet";
      if (roll < 0.33) return "preyharpoon";
      if (roll < 0.49) return "lobopod";
      if (roll < 0.65) return "antennawhip";
      if (roll < 0.83) return "oralpapilla";
      return "onychophore";
    }
    if (lastKind === "slimejet") {
      if (roll < 0.16) return "peripatus";
      if (roll < 0.32) return "preyharpoon";
      if (roll < 0.48) return "lobopod";
      if (roll < 0.64) return "antennawhip";
      if (roll < 0.82) return "oralpapilla";
      return "onychophore";
    }
    if (lastKind === "preyharpoon") {
      if (roll < 0.14) return "peripatus";
      if (roll < 0.3) return "slimejet";
      if (roll < 0.46) return "lobopod";
      if (roll < 0.62) return "antennawhip";
      if (roll < 0.8) return "oralpapilla";
      return "onychophore";
    }
    if (lastKind === "lobopod") {
      if (roll < 0.15) return "peripatus";
      if (roll < 0.31) return "slimejet";
      if (roll < 0.47) return "preyharpoon";
      if (roll < 0.63) return "antennawhip";
      if (roll < 0.81) return "oralpapilla";
      return "onychophore";
    }
    if (lastKind === "antennawhip") {
      if (roll < 0.16) return "peripatus";
      if (roll < 0.32) return "slimejet";
      if (roll < 0.48) return "preyharpoon";
      if (roll < 0.64) return "lobopod";
      if (roll < 0.82) return "oralpapilla";
      return "onychophore";
    }
    if (lastKind === "oralpapilla") {
      if (roll < 0.15) return "peripatus";
      if (roll < 0.31) return "slimejet";
      if (roll < 0.47) return "preyharpoon";
      if (roll < 0.63) return "lobopod";
      if (roll < 0.81) return "antennawhip";
      return "onychophore";
    }
    if (lastKind === "onychophore") {
      if (roll < 0.16) return "peripatus";
      if (roll < 0.32) return "slimejet";
      if (roll < 0.48) return "preyharpoon";
      if (roll < 0.64) return "lobopod";
      if (roll < 0.82) return "antennawhip";
      return "oralpapilla";
    }
    if (roll < 0.14) return "peripatus";
    if (roll < 0.28) return "slimejet";
    if (roll < 0.42) return "lobopod";
    if (roll < 0.56) return "antennawhip";
    if (roll < 0.7) return "preyharpoon";
    if (roll < 0.85) return "oralpapilla";
    return "onychophore";
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
    return key === TRICK_KEY || key === "jet";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densjet";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densjet" ? "sit" : name === "inkjet" ? "play" : "sit"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densjetPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densjet));
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

  function inkjetPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkjet));
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

  function densloboPose(t) {
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
    if (next.kind === "densjet") {
      const pose = densjetPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkjet") {
      const pose = inkjetPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densloboPose(next.t);
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
    kind === "peripatus"
      ? "sit"
      : kind === "slimejet"
        ? "play"
        : kind === "preyharpoon"
          ? "talk"
          : kind === "lobopod"
            ? "play"
            : kind === "antennawhip"
              ? "talk"
              : kind === "oralpapilla"
                ? "talk"
                : kind === "onychophore"
                  ? "sit"
                  : "sit";
    return {
      kind,
      phase: kind === "peripatus" ? "hold" : "go",
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

  function peripatusPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function slimejetPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.slimejet));
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

  function lobopodPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lobopod));
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

  function preyharpoonPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.preyharpoon));
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

  function onychophorePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.onychophore));
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

  function oralpapillaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.oralpapilla));
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

  function antennawhipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennawhip));
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
      trick.kind !== "slimejet" &&
      trick.kind !== "preyharpoon" &&
      trick.kind !== "lobopod" &&
      trick.kind !== "antennawhip" &&
      trick.kind !== "oralpapilla" &&
      trick.kind !== "onychophore"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "peripatus") {
      if (next.t < PERIPATUS_HOLD) {
        const pose = peripatusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PERIPATUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PERIPATUS_HOLD);
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
    if (next.kind === "slimejet") {
      const pose = slimejetPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "preyharpoon") {
      const pose = preyharpoonPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lobopod") {
      const pose = lobopodPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennawhip") {
      const pose = antennawhipPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "oralpapilla") {
      const pose = oralpapillaPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = onychophorePose(next.t, fromX, trick.facing);
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
    PERIPATUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    peripatusPose,
    releasePose,
    slimejetPose,
    lobopodPose,
    preyharpoonPose,
    onychophorePose,
    oralpapillaPose,
    antennawhipPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densjetPose,
    inkjetPose,
    densloboPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetVelvetWormTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
