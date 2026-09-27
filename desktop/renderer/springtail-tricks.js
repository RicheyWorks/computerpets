/** Hop ground tricks while idle — ultra-polish pass. House neighborly Collembola / Orchesella Springtail furcula desk life (springtail / Hop) — furculaflick / antennawalk / moistclingsoil / foldtuck / collophore / denspring / orchesella personality (furculaflick furcula jump launch without naming jump or leap or spring or hop or bounce or flick or launch or vault alone as wait, antennawalk feeler walk without naming walk or crawl or march or feel or antenna or tap or probe or scan or sniff — Haste owns antennaflick, antennawalk ok, moistclingsoil damp litter soil cling without naming cling or moist or damp or soil or litter or grip or stick or hold or wet, foldtuck furcula tuck rest without naming tuck or fold or rest or crouch or curl or sit or hush or wait alone, collophore ventral tube drink-cling tell without naming tube or drink or wet or cling or ventral or suck or sip alone — Sip hummingbird owns bare sip, collophore ok, denspring dens furcula spring coil tell without naming dens or spring or coil or vault or hop or bounce alone, long orchesella Orchesella Collembola springtail hush hold (THE orchesella sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or furculaflick or antennawalk or collophore or denspring or moistclingsoil or foldtuck or orchesella or denshop or inkhop or densfurcula or peristalse or castheap or surfacerise or soilanchor or clitellum or setaebrace or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or leafhush or cast or crawl or still or roll or walk or sit or hop or spring or vault or earthworm or pillbug or armor or millipede or link or house_centipede or haste or springtail or jet or springtail as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Jet owns furculaflick/antennawalk/collophore/denspring/moistclingsoil/foldtuck/orchesella — do NOT reuse; Cast owns peristalse/castheap/surfacerise/soilanchor/clitellum/setaebrace/terrestris — do NOT reuse; Vault grasshopper later owns vault — do NOT reuse bare hop/spring/vault; Haste owns antennaflick — antennawalk ok; Sip owns bare sip — collophore ok; header forbids springtail/hop/vault/spring/jet/cast/crawl/still/roll/walk/sit; guest slug Hop / key springtail only for isKey matching — accept "springtail" and "hop"; do NOT name a trick "springtail" or "hop" or "springtail" or "jet" or "earthworm" or "cast" or "pillbug" or "armor" or "millipede" or "link" or "house_centipede" or "haste" or "vault" or "spring") — not Jet Peripatus velvet-worm/Onychophora life, not Cast Lumbricus earthworm/Annelida life, not Armor Armadillidium pillbug/Isopoda life, not Link Narceus millipede/Diplopoda life, not Haste Scutigera house-centipede/Chilopoda life, not Vault grasshopper Orthoptera life later, not Tun tardigrade (cryptotun/clawamble/mosssip/waterbearroll/styletpierce/anhydro/eutardigrada), not Rui red_panda life. Furculaflick without naming hop alone, antennawalk without naming antennaflick alone, moistclingsoil without naming cling alone, foldtuck without naming tuck alone, collophore without naming sip alone, denspring without naming spring alone, orchesella long sit_hold on the Orchesella hush (THE orchesella sit_hold tell); denshop / inkhop / densfurcula thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web springtail-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names hop/walk/still/wait/sit/springtail as bare ethogram-only trick kinds. True Springtail Orchesella Collembola desk life only — furcula jump launch with feeler walk, damp litter cling, furcula tuck, ventral collophore drink-cling, dens spring coil, and Orchesella hush; distinct from Jet velvet worm/Onychophora slime-jet, Cast earthworm/Annelida peristalsis, Armor pillbug/Isopoda ball-roll, Link millipede/Diplopoda spiral, Haste house centipede/Chilopoda predator, Vault grasshopper later, Tun tardigrade next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Half / planarian. No cry inventing — thank-yous are silent desk motion only; springtail.wav EXISTS so prefersHouseCry adds springtail after springtail. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "springtail";
  const TRICKS = ["furculaflick", "antennawalk", "moistclingsoil", "foldtuck", "collophore", "denspring", "orchesella"];
  const HAPPY = ["denshop", "inkhop", "densfurcula"];

  const HAPPY_DUR = { denshop: 1.70, inkhop: 1.84, densfurcula: 1.76 };
  const ORCHESELLA_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    orchesella: ORCHESELLA_HOLD + RELEASE_S,
    furculaflick: 2.48,
    antennawalk: 2.42,
    moistclingsoil: 2.40,
    foldtuck: 2.44,
    collophore: 2.38,
    denspring: 2.56,
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
    if (kind === "orchesella") return 40 + roll * 26;
    if (kind === "collophore" || kind === "antennawalk" || kind === "furculaflick") return 12.8 + roll * 9.4;
    if (kind === "moistclingsoil" || kind === "foldtuck" || kind === "denspring") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "orchesella";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "orchesella") {
      if (roll < 0.17) return "furculaflick";
      if (roll < 0.33) return "antennawalk";
      if (roll < 0.49) return "moistclingsoil";
      if (roll < 0.65) return "foldtuck";
      if (roll < 0.83) return "collophore";
      return "denspring";
    }
    if (lastKind === "furculaflick") {
      if (roll < 0.16) return "orchesella";
      if (roll < 0.32) return "antennawalk";
      if (roll < 0.48) return "moistclingsoil";
      if (roll < 0.64) return "foldtuck";
      if (roll < 0.82) return "collophore";
      return "denspring";
    }
    if (lastKind === "antennawalk") {
      if (roll < 0.14) return "orchesella";
      if (roll < 0.3) return "furculaflick";
      if (roll < 0.46) return "moistclingsoil";
      if (roll < 0.62) return "foldtuck";
      if (roll < 0.8) return "collophore";
      return "denspring";
    }
    if (lastKind === "moistclingsoil") {
      if (roll < 0.15) return "orchesella";
      if (roll < 0.31) return "furculaflick";
      if (roll < 0.47) return "antennawalk";
      if (roll < 0.63) return "foldtuck";
      if (roll < 0.81) return "collophore";
      return "denspring";
    }
    if (lastKind === "foldtuck") {
      if (roll < 0.16) return "orchesella";
      if (roll < 0.32) return "furculaflick";
      if (roll < 0.48) return "antennawalk";
      if (roll < 0.64) return "moistclingsoil";
      if (roll < 0.82) return "collophore";
      return "denspring";
    }
    if (lastKind === "collophore") {
      if (roll < 0.15) return "orchesella";
      if (roll < 0.31) return "furculaflick";
      if (roll < 0.47) return "antennawalk";
      if (roll < 0.63) return "moistclingsoil";
      if (roll < 0.81) return "foldtuck";
      return "denspring";
    }
    if (lastKind === "denspring") {
      if (roll < 0.16) return "orchesella";
      if (roll < 0.32) return "furculaflick";
      if (roll < 0.48) return "antennawalk";
      if (roll < 0.64) return "moistclingsoil";
      if (roll < 0.82) return "foldtuck";
      return "collophore";
    }
    if (roll < 0.14) return "orchesella";
    if (roll < 0.28) return "furculaflick";
    if (roll < 0.42) return "antennawalk";
    if (roll < 0.56) return "moistclingsoil";
    if (roll < 0.7) return "foldtuck";
    if (roll < 0.85) return "collophore";
    return "denspring";
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
    return key === TRICK_KEY || key === "hop";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denshop";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denshop" ? "sit" : name === "inkhop" ? "play" : "sit"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denshopPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshop));
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

  function inkhopPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhop));
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

  function densfurculaPose(t) {
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
    if (next.kind === "denshop") {
      const pose = denshopPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkhop") {
      const pose = inkhopPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densfurculaPose(next.t);
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
      kind === "orchesella"
        ? "sit"
        : kind === "furculaflick"
          ? "play"
          : kind === "denspring"
            ? "play"
            : kind === "antennawalk"
              ? "talk"
              : kind === "moistclingsoil"
                ? "sit"
                : kind === "foldtuck"
                  ? "sit"
                  : kind === "collophore"
                    ? "talk"
                    : "sit";
    return {
      kind,
      phase: kind === "orchesella" ? "hold" : "go",
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

  function orchesellaPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function furculaflickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.furculaflick));
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

  function antennawalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennawalk));
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

  function denspringPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.denspring));
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

  function foldtuckPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.foldtuck));
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

  function moistclingsoilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.moistclingsoil));
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

  function collophorePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.collophore));
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
      trick.kind !== "furculaflick" &&
      trick.kind !== "antennawalk" &&
      trick.kind !== "moistclingsoil" &&
      trick.kind !== "foldtuck" &&
      trick.kind !== "collophore" &&
      trick.kind !== "denspring"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "orchesella") {
      if (next.t < ORCHESELLA_HOLD) {
        const pose = orchesellaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ORCHESELLA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ORCHESELLA_HOLD);
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
    if (next.kind === "furculaflick") {
      const pose = furculaflickPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennawalk") {
      const pose = antennawalkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "moistclingsoil") {
      const pose = moistclingsoilPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "foldtuck") {
      const pose = foldtuckPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "collophore") {
      const pose = collophorePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denspringPose(next.t, fromX, trick.facing);
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
    ORCHESELLA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    orchesellaPose,
    releasePose,
    furculaflickPose,
    antennawalkPose,
    denspringPose,
    foldtuckPose,
    moistclingsoilPose,
    collophorePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denshopPose,
    inkhopPose,
    densfurculaPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSpringtailTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
