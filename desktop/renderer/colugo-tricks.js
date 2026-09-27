/** Sail ground tricks while idle — ultra-polish pass. House neighborly Galeopterus variegatus / Sunda Colugo desk life (colugo / Sail) — patagiumglide / clingclimb / headdownhang / leaffoldsettle / membranespread / barkclamp / galeopterushush personality (patagiumglide membrane glide without naming glide or sail or colugo alone as wait — distinct from Glide flying_squirrel and sugar glider; clingclimb bark cling-climb without naming cling or climb or walk alone as wait — distinct from Hang reachcrawl and Wrist pretailhang; headdownhang head-down hang without naming hang or head or down alone as wait — distinct from Hang hangsway and Swing brachiate; leaffoldsettle leaf-fold settle without naming fold or leaf or settle alone as wait — distinct from Hang clawhook and Wrist tailcoil; membranespread patagium membrane-spread without naming membrane or spread or wing alone as wait — distinct from Glide and Bat; barkclamp bark clamp cling without naming clamp or bark or grip alone as wait — distinct from Limpet clampseal and Hang clawhook; long galeopterushush Galeopterus variegatus hush hold (THE galeopterushush sit_hold tell) — never named wait or crouch or sit or sail or cling or still or colugo or sail as bare ethogram-only trick kinds; Wrist kinkajou owns pretailhang/nectarsip/wristrotate/nightscamper/honeylap/tailcoil/potoshush — do NOT reuse; Swing gibbon owns brachiate/whoopduet/bipedalstrut/hangreach/armhook/duetbow/hylobateshush — do NOT reuse; Hang sloth owns hangsway/reachcrawl/algaescratch/headturnstare/clawhook/slowdrip/bradypushush — do NOT reuse; guest slug Sail / key colugo only for wantsThankYou matching — accept "colugo" and "sail"; do NOT name a trick "colugo" or "sail" or "kinkajou" or "wrist" or "gibbon" or "swing" or "sloth" or "hang" or "glide"; not Wrist Potos life, not Swing Hylobates life, not Hang Choloepus life, not Glide flying_squirrel, not Rui. Patagiumglide / clingclimb / headdownhang / leaffoldsettle / membranespread / barkclamp / galeopterushush; denssail / inksail / densgaleopterus thank-yous. Same map as web colugo-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names sail/cling/still/sit/wait/colugo as bare ethogram-only trick kinds. True Sunda Colugo Galeopterus variegatus desk life only — patagium glide, cling climb, head-down hang, leaf-fold settle, membrane spread, bark clamp, Galeopterus hush. Next house-order ultra: Glide / flying_squirrel. No cry inventing — colugo.wav EXISTS so prefersHouseCry adds colugo after kinkajou. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "colugo";
  const TRICKS = ["patagiumglide", "clingclimb", "headdownhang", "leaffoldsettle", "membranespread", "barkclamp", "galeopterushush"];
  const HAPPY = ["denssail", "inksail", "densgaleopterus"];

  const HAPPY_DUR = { denssail: 1.70, inksail: 1.84, densgaleopterus: 1.76 };
  const GALEOPTERUSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    galeopterushush: GALEOPTERUSHUSH_HOLD + RELEASE_S,
    patagiumglide: 2.48,
    clingclimb: 2.42,
    headdownhang: 2.40,
    leaffoldsettle: 2.44,
    membranespread: 2.38,
    barkclamp: 2.56,
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
    if (kind === "galeopterushush") return 40 + roll * 26;
    if (kind === "membranespread" || kind === "patagiumglide" || kind === "leaffoldsettle") return 12.8 + roll * 9.4;
    if (kind === "headdownhang" || kind === "clingclimb" || kind === "barkclamp") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "galeopterushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "galeopterushush") {
      if (roll < 0.17) return "patagiumglide";
      if (roll < 0.33) return "clingclimb";
      if (roll < 0.49) return "headdownhang";
      if (roll < 0.65) return "leaffoldsettle";
      if (roll < 0.83) return "membranespread";
      return "barkclamp";
    }
    if (lastKind === "patagiumglide") {
      if (roll < 0.16) return "galeopterushush";
      if (roll < 0.32) return "clingclimb";
      if (roll < 0.48) return "headdownhang";
      if (roll < 0.64) return "leaffoldsettle";
      if (roll < 0.82) return "membranespread";
      return "barkclamp";
    }
    if (lastKind === "clingclimb") {
      if (roll < 0.14) return "galeopterushush";
      if (roll < 0.3) return "patagiumglide";
      if (roll < 0.46) return "headdownhang";
      if (roll < 0.62) return "leaffoldsettle";
      if (roll < 0.8) return "membranespread";
      return "barkclamp";
    }
    if (lastKind === "headdownhang") {
      if (roll < 0.15) return "galeopterushush";
      if (roll < 0.31) return "patagiumglide";
      if (roll < 0.47) return "clingclimb";
      if (roll < 0.63) return "leaffoldsettle";
      if (roll < 0.81) return "membranespread";
      return "barkclamp";
    }
    if (lastKind === "leaffoldsettle") {
      if (roll < 0.16) return "galeopterushush";
      if (roll < 0.32) return "patagiumglide";
      if (roll < 0.48) return "clingclimb";
      if (roll < 0.64) return "headdownhang";
      if (roll < 0.82) return "membranespread";
      return "barkclamp";
    }
    if (lastKind === "membranespread") {
      if (roll < 0.15) return "galeopterushush";
      if (roll < 0.31) return "patagiumglide";
      if (roll < 0.47) return "clingclimb";
      if (roll < 0.63) return "headdownhang";
      if (roll < 0.81) return "leaffoldsettle";
      return "barkclamp";
    }
    if (lastKind === "barkclamp") {
      if (roll < 0.16) return "galeopterushush";
      if (roll < 0.32) return "patagiumglide";
      if (roll < 0.48) return "clingclimb";
      if (roll < 0.64) return "headdownhang";
      if (roll < 0.82) return "leaffoldsettle";
      return "membranespread";
    }
    if (roll < 0.14) return "galeopterushush";
    if (roll < 0.28) return "patagiumglide";
    if (roll < 0.42) return "clingclimb";
    if (roll < 0.56) return "headdownhang";
    if (roll < 0.7) return "leaffoldsettle";
    if (roll < 0.85) return "membranespread";
    return "barkclamp";
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
    return key === TRICK_KEY || key === "sail";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denssail";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denssail" ? "sit" : name === "inksail" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denssailPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssail));
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

  function inksailPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksail));
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

  function densgaleopterusPose(t) {
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
    if (next.kind === "denssail") {
      const pose = denssailPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inksail") {
      const pose = inksailPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densgaleopterusPose(next.t);
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
      kind === "galeopterushush"
        ? "sit"
        : kind === "patagiumglide"
          ? "play"
          : kind === "barkclamp"
            ? "talk"
            : kind === "clingclimb"
              ? "walk"
              : kind === "headdownhang"
                ? "sit"
                : kind === "leaffoldsettle"
                  ? "play"
                  : kind === "membranespread"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "galeopterushush" ? "hold" : "go",
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

  function galeopterushushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function patagiumglidePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.patagiumglide));
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

  function clingclimbPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.clingclimb));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "walk",
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

  function barkclampPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.barkclamp));
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

  function leaffoldsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.leaffoldsettle));
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

  function headdownhangPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.headdownhang));
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

  function membranespreadPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.membranespread));
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
      trick.kind !== "patagiumglide" &&
      trick.kind !== "clingclimb" &&
      trick.kind !== "headdownhang" &&
      trick.kind !== "leaffoldsettle" &&
      trick.kind !== "membranespread" &&
      trick.kind !== "barkclamp"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "galeopterushush") {
      if (next.t < GALEOPTERUSHUSH_HOLD) {
        const pose = galeopterushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < GALEOPTERUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - GALEOPTERUSHUSH_HOLD);
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
    if (next.kind === "patagiumglide") {
      const pose = patagiumglidePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "clingclimb") {
      const pose = clingclimbPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "headdownhang") {
      const pose = headdownhangPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "leaffoldsettle") {
      const pose = leaffoldsettlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "membranespread") {
      const pose = membranespreadPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = barkclampPose(next.t, fromX, trick.facing);
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
    GALEOPTERUSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    galeopterushushPose,
    releasePose,
    patagiumglidePose,
    clingclimbPose,
    barkclampPose,
    leaffoldsettlePose,
    headdownhangPose,
    membranespreadPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denssailPose,
    inksailPose,
    densgaleopterusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetColugoTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
