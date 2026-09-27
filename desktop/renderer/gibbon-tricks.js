/** Swing ground tricks while idle — ultra-polish pass. House neighborly Hylobates lar / Lar Gibbon desk life (gibbon / Swing) — brachiate / whoopduet / bipedalstrut / hangreach / armhook / duetbow / hylobateshush personality (brachiate brachiation swing-arc without naming swing or hang or brachiate alone as wait — distinct from Hang hangsway and Opossum hang; whoopduet silent whoop-duet cue posture without naming whoop or song or call alone as wait — distinct from Crow hopwalk and Cicada tymbal; bipedalstrut upright bipedal strut without naming walk or strut or bipedal alone as wait — distinct from Deer freeze and Sun hopgallop; hangreach hang-reach fruit pick without naming hang or reach or crawl alone as wait — distinct from Hang reachcrawl and Sloth algaescratch; armhook arm-hook branch hold without naming hook or claw or hang alone as wait — distinct from Hang clawhook and Sun scentmark; duetbow duet-bow pair posture without naming bow or song or duet alone as wait — distinct from Sun stinkfight and Crow hopwalk; long hylobateshush Hylobates lar hush hold (THE hylobateshush sit_hold tell) — never named wait or crouch or sit or walk or swing or gibbon as bare ethogram-only trick kinds; Sun lemur owns bellybask/ringtailcurl/hopgallop/scentmark/stinkfight/sunworship/lemurhush — do NOT reuse; Hang sloth owns hangsway/reachcrawl/algaescratch/headturnstare/clawhook/slowdrip/bradypushush — do NOT reuse; Rob robber_fly owns sallyhawk/beardgroom/midsnatch/stiltsstance/mystaxwipe/perchsally/asilushush — do NOT reuse; guest slug Swing / key gibbon only for wantsThankYou matching — accept "gibbon" and "swing"; do NOT name a trick "gibbon" or "swing" or "lemur" or "sun" or "sloth" or "hang" or "lemurhush" or "hangsway"; not Sun Lemur catta life, not Hang Choloepus life, not Wrist kinkajou, not Rui. Brachiate / whoopduet / bipedalstrut / hangreach / armhook / duetbow / hylobateshush; densswing / inkswing / denshylobates thank-yous. Same map as web gibbon-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names swing/song/still/sit/wait/gibbon as bare ethogram-only trick kinds. True Lar Gibbon Hylobates lar desk life only — brachiate, whoop-duet, bipedal strut, hang-reach, arm-hook, duet-bow, Hylobates hush. Next house-order ultra: Wrist / kinkajou. No cry inventing — gibbon.wav EXISTS so prefersHouseCry adds gibbon after lemur. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "gibbon";
  const TRICKS = ["brachiate", "whoopduet", "bipedalstrut", "hangreach", "armhook", "duetbow", "hylobateshush"];
  const HAPPY = ["densswing", "inkswing", "denshylobates"];

  const HAPPY_DUR = { densswing: 1.70, inkswing: 1.84, denshylobates: 1.76 };
  const HYLOBATESHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    hylobateshush: HYLOBATESHUSH_HOLD + RELEASE_S,
    brachiate: 2.48,
    whoopduet: 2.42,
    bipedalstrut: 2.40,
    hangreach: 2.44,
    armhook: 2.38,
    duetbow: 2.56,
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
    if (kind === "hylobateshush") return 40 + roll * 26;
    if (kind === "armhook" || kind === "brachiate" || kind === "hangreach") return 12.8 + roll * 9.4;
    if (kind === "bipedalstrut" || kind === "whoopduet" || kind === "duetbow") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "hylobateshush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "hylobateshush") {
      if (roll < 0.17) return "brachiate";
      if (roll < 0.33) return "whoopduet";
      if (roll < 0.49) return "bipedalstrut";
      if (roll < 0.65) return "hangreach";
      if (roll < 0.83) return "armhook";
      return "duetbow";
    }
    if (lastKind === "brachiate") {
      if (roll < 0.16) return "hylobateshush";
      if (roll < 0.32) return "whoopduet";
      if (roll < 0.48) return "bipedalstrut";
      if (roll < 0.64) return "hangreach";
      if (roll < 0.82) return "armhook";
      return "duetbow";
    }
    if (lastKind === "whoopduet") {
      if (roll < 0.14) return "hylobateshush";
      if (roll < 0.3) return "brachiate";
      if (roll < 0.46) return "bipedalstrut";
      if (roll < 0.62) return "hangreach";
      if (roll < 0.8) return "armhook";
      return "duetbow";
    }
    if (lastKind === "bipedalstrut") {
      if (roll < 0.15) return "hylobateshush";
      if (roll < 0.31) return "brachiate";
      if (roll < 0.47) return "whoopduet";
      if (roll < 0.63) return "hangreach";
      if (roll < 0.81) return "armhook";
      return "duetbow";
    }
    if (lastKind === "hangreach") {
      if (roll < 0.16) return "hylobateshush";
      if (roll < 0.32) return "brachiate";
      if (roll < 0.48) return "whoopduet";
      if (roll < 0.64) return "bipedalstrut";
      if (roll < 0.82) return "armhook";
      return "duetbow";
    }
    if (lastKind === "armhook") {
      if (roll < 0.15) return "hylobateshush";
      if (roll < 0.31) return "brachiate";
      if (roll < 0.47) return "whoopduet";
      if (roll < 0.63) return "bipedalstrut";
      if (roll < 0.81) return "hangreach";
      return "duetbow";
    }
    if (lastKind === "duetbow") {
      if (roll < 0.16) return "hylobateshush";
      if (roll < 0.32) return "brachiate";
      if (roll < 0.48) return "whoopduet";
      if (roll < 0.64) return "bipedalstrut";
      if (roll < 0.82) return "hangreach";
      return "armhook";
    }
    if (roll < 0.14) return "hylobateshush";
    if (roll < 0.28) return "brachiate";
    if (roll < 0.42) return "whoopduet";
    if (roll < 0.56) return "bipedalstrut";
    if (roll < 0.7) return "hangreach";
    if (roll < 0.85) return "armhook";
    return "duetbow";
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
    return key === TRICK_KEY || key === "swing";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densswing";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densswing" ? "sit" : name === "inkswing" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densswingPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densswing));
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

  function inkswingPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkswing));
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

  function denshylobatesPose(t) {
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
    if (next.kind === "densswing") {
      const pose = densswingPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkswing") {
      const pose = inkswingPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denshylobatesPose(next.t);
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
      kind === "hylobateshush"
        ? "sit"
        : kind === "brachiate"
          ? "play"
          : kind === "duetbow"
            ? "talk"
            : kind === "whoopduet"
              ? "walk"
              : kind === "bipedalstrut"
                ? "sit"
                : kind === "hangreach"
                  ? "play"
                  : kind === "armhook"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "hylobateshush" ? "hold" : "go",
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

  function hylobateshushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function brachiatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.brachiate));
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

  function whoopduetPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.whoopduet));
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

  function duetbowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.duetbow));
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

  function hangreachPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hangreach));
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

  function bipedalstrutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bipedalstrut));
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

  function armhookPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.armhook));
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
      trick.kind !== "brachiate" &&
      trick.kind !== "whoopduet" &&
      trick.kind !== "bipedalstrut" &&
      trick.kind !== "hangreach" &&
      trick.kind !== "armhook" &&
      trick.kind !== "duetbow"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "hylobateshush") {
      if (next.t < HYLOBATESHUSH_HOLD) {
        const pose = hylobateshushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HYLOBATESHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HYLOBATESHUSH_HOLD);
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
    if (next.kind === "brachiate") {
      const pose = brachiatePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "whoopduet") {
      const pose = whoopduetPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bipedalstrut") {
      const pose = bipedalstrutPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hangreach") {
      const pose = hangreachPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "armhook") {
      const pose = armhookPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = duetbowPose(next.t, fromX, trick.facing);
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
    HYLOBATESHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    hylobateshushPose,
    releasePose,
    brachiatePose,
    whoopduetPose,
    duetbowPose,
    hangreachPose,
    bipedalstrutPose,
    armhookPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densswingPose,
    inkswingPose,
    denshylobatesPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGibbonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
