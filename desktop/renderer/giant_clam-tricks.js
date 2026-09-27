/** Gate ground tricks while idle — ultra-polish pass. House neighborly Giant Clam Tridacna gigas / Tridacninae / Cardiidae giant clam desk life (giant_clam / Gate) — mantlecurtainpulse / siphonjetpuff / shellgapeclosegate / zooxanthellaesunbask / byssusgrip / mantleedge / tridacnahush personality (mantlecurtainpulse mantle-curtain pulse without naming mantle or curtain or pulse alone as wait — Tridacna mantle tell; siphonjetpuff siphon jet puff without naming siphon or jet or puff alone as wait — excurrent-siphon tell; shellgapeclosegate shell gape-close gate without naming shell or gape or close alone as wait — valve gape tell; zooxanthellaesunbask zooxanthellae sun bask without naming zooxanthellae or sun or bask alone as wait — photosynthetic symbiont bask (distinct from Ridge brain_coral zooxflash); byssusgrip byssus grip without naming byssus or grip alone as wait — juvenile byssal attachment tell; mantleedge mantle-edge sense without naming mantle or edge alone as wait — phototaxis / mantle-margin tell; long tridacnahush Tridacna hush hold (THE tridacnahush sit_hold tell) — never named wait or crouch or sit or still or giant_clam or gate as bare ethogram-only trick kinds; Veil lionfish owns pectoralveilfanflare/gulpinginhalecue/spinewarnraise/slowhoverstalk/stripebar/venomwarn/pteroishush — do NOT reuse; Ridge brain_coral owns zooxflash/diploriahush — do NOT reuse; Hinge mussel owns adductor/protractor/inhalant — do NOT reuse; Pearl oyster owns lamella/imbricate — do NOT reuse; Cement barnacle owns cirrikick/opershut/cementhold/balanushush — do NOT reuse; Tube sea_cucumber owns tubefootcrawl/holothuriahush — do NOT reuse; Soar eagle_ray comes next — do NOT start; guest slug Gate / key giant_clam only for wantsThankYou matching — accept "giant_clam" and "gate"; do NOT name a trick "giant_clam" or "gate" or "lionfish" or "veil" or "brain_coral" or "ridge" or "mussel" or "hinge" or "oyster" or "pearl" or "barnacle" or "cement" or "eagle_ray" or "soar"; not Veil Pterois life, not Ridge Diploria life, not Hinge Unionidae life, not Pearl oyster life, not Cement Balanus life, not Soar Myliobatidae life, not Rui. Mantlecurtainpulse / siphonjetpuff / shellgapeclosegate / zooxanthellaesunbask / byssusgrip / mantleedge / tridacnahush; densgate / inkgate / denstridacna thank-yous. Same map as web giant_clam-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names open/mantle/still/wait/giant_clam as bare ethogram-only trick kinds. True Giant Clam Tridacna gigas desk life only — mantle curtain, siphon jet, shell gape-close, zooxanthellae bask, byssus grip, mantle edge, Tridacna hush. Next house-order ultra: Soar / eagle_ray. No cry inventing — giant_clam.wav EXISTS so prefersHouseCry adds giant_clam after lionfish. Amplitudes raised toward Rui richness; denser waits/weights; TRIDACNAHUSH_HOLD=11.2 RELEASE_S=1.18 (not 34.12/2.53). Catalog 221. */
(function (root) {

  const TRICK_KEY = "giant_clam";
  const TRICKS = ["mantlecurtainpulse", "siphonjetpuff", "shellgapeclosegate", "zooxanthellaesunbask", "byssusgrip", "mantleedge", "tridacnahush"];
  const HAPPY = ["densgate", "inkgate", "denstridacna"];

  const HAPPY_DUR = { densgate: 1.70, inkgate: 1.84, denstridacna: 1.76 };
  const TRIDACNAHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    tridacnahush: TRIDACNAHUSH_HOLD + RELEASE_S,
    mantlecurtainpulse: 2.48,
    siphonjetpuff: 2.42,
    shellgapeclosegate: 2.40,
    zooxanthellaesunbask: 2.44,
    byssusgrip: 2.38,
    mantleedge: 2.56,
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
    if (kind === "tridacnahush") return 40 + roll * 26;
    if (kind === "byssusgrip" || kind === "mantlecurtainpulse" || kind === "mantleedge") return 12.8 + roll * 9.4;
    if (kind === "shellgapeclosegate" || kind === "siphonjetpuff" || kind === "zooxanthellaesunbask") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tridacnahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tridacnahush") {
      if (roll < 0.17) return "mantlecurtainpulse";
      if (roll < 0.33) return "siphonjetpuff";
      if (roll < 0.49) return "shellgapeclosegate";
      if (roll < 0.65) return "zooxanthellaesunbask";
      if (roll < 0.83) return "byssusgrip";
      return "mantleedge";
    }
    if (lastKind === "mantlecurtainpulse") {
      if (roll < 0.16) return "tridacnahush";
      if (roll < 0.32) return "siphonjetpuff";
      if (roll < 0.48) return "shellgapeclosegate";
      if (roll < 0.64) return "zooxanthellaesunbask";
      if (roll < 0.82) return "byssusgrip";
      return "mantleedge";
    }
    if (lastKind === "siphonjetpuff") {
      if (roll < 0.14) return "tridacnahush";
      if (roll < 0.3) return "mantlecurtainpulse";
      if (roll < 0.46) return "shellgapeclosegate";
      if (roll < 0.62) return "zooxanthellaesunbask";
      if (roll < 0.8) return "byssusgrip";
      return "mantleedge";
    }
    if (lastKind === "shellgapeclosegate") {
      if (roll < 0.15) return "tridacnahush";
      if (roll < 0.31) return "mantlecurtainpulse";
      if (roll < 0.47) return "siphonjetpuff";
      if (roll < 0.63) return "zooxanthellaesunbask";
      if (roll < 0.81) return "byssusgrip";
      return "mantleedge";
    }
    if (lastKind === "zooxanthellaesunbask") {
      if (roll < 0.16) return "tridacnahush";
      if (roll < 0.32) return "mantlecurtainpulse";
      if (roll < 0.48) return "siphonjetpuff";
      if (roll < 0.64) return "shellgapeclosegate";
      if (roll < 0.82) return "byssusgrip";
      return "mantleedge";
    }
    if (lastKind === "byssusgrip") {
      if (roll < 0.15) return "tridacnahush";
      if (roll < 0.31) return "mantlecurtainpulse";
      if (roll < 0.47) return "siphonjetpuff";
      if (roll < 0.63) return "shellgapeclosegate";
      if (roll < 0.81) return "zooxanthellaesunbask";
      return "mantleedge";
    }
    if (lastKind === "mantleedge") {
      if (roll < 0.16) return "tridacnahush";
      if (roll < 0.32) return "mantlecurtainpulse";
      if (roll < 0.48) return "siphonjetpuff";
      if (roll < 0.64) return "shellgapeclosegate";
      if (roll < 0.82) return "zooxanthellaesunbask";
      return "byssusgrip";
    }
    if (roll < 0.14) return "tridacnahush";
    if (roll < 0.28) return "mantlecurtainpulse";
    if (roll < 0.42) return "siphonjetpuff";
    if (roll < 0.56) return "shellgapeclosegate";
    if (roll < 0.7) return "zooxanthellaesunbask";
    if (roll < 0.85) return "byssusgrip";
    return "mantleedge";
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
    return key === TRICK_KEY || key === "gate";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densgate";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densgate" ? "sit" : name === "inkgate" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densgatePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgate));
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

  function inkgatePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgate));
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

  function denstridacnaPose(t) {
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
    if (next.kind === "densgate") {
      const pose = densgatePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkgate") {
      const pose = inkgatePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denstridacnaPose(next.t);
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
      kind === "tridacnahush"
        ? "sit"
        : kind === "mantlecurtainpulse"
          ? "sit"
          : kind === "mantleedge"
            ? "talk"
            : kind === "siphonjetpuff"
              ? "play"
              : kind === "shellgapeclosegate"
                ? "sit"
                : kind === "zooxanthellaesunbask"
                  ? "sit"
                  : kind === "byssusgrip"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "tridacnahush" ? "hold" : "go",
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

  function tridacnahushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function mantlecurtainpulsePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mantlecurtainpulse));
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

  function siphonjetpuffPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.siphonjetpuff));
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

  function mantleedgePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mantleedge));
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

  function zooxanthellaesunbaskPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.zooxanthellaesunbask));
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

  function shellgapeclosegatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.shellgapeclosegate));
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

  function byssusgripPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.byssusgrip));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "walk",
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
      trick.kind !== "mantlecurtainpulse" &&
      trick.kind !== "siphonjetpuff" &&
      trick.kind !== "shellgapeclosegate" &&
      trick.kind !== "zooxanthellaesunbask" &&
      trick.kind !== "byssusgrip" &&
      trick.kind !== "mantleedge"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "tridacnahush") {
      if (next.t < TRIDACNAHUSH_HOLD) {
        const pose = tridacnahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TRIDACNAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TRIDACNAHUSH_HOLD);
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
    if (next.kind === "mantlecurtainpulse") {
      const pose = mantlecurtainpulsePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "siphonjetpuff") {
      const pose = siphonjetpuffPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "shellgapeclosegate") {
      const pose = shellgapeclosegatePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "zooxanthellaesunbask") {
      const pose = zooxanthellaesunbaskPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "byssusgrip") {
      const pose = byssusgripPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = mantleedgePose(next.t, fromX, trick.facing);
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
    TRIDACNAHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    tridacnahushPose,
    releasePose,
    mantlecurtainpulsePose,
    siphonjetpuffPose,
    mantleedgePose,
    zooxanthellaesunbaskPose,
    shellgapeclosegatePose,
    byssusgripPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densgatePose,
    inkgatePose,
    denstridacnaPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCleanerShrimpTricks = api;
})(typeof window !== "undefined" ? window : globalThis);