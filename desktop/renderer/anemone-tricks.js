/** Wreath ground tricks while idle — ultra-polish pass. House neighborly Magnificent Sea Anemone Heteractis magnifica / Actiniaria desk life (anemone / Wreath) — oraldiskwreathsway / nematocysttuck / pedaldiskwalkcreep / retractintocolumn / tentaclefan / oralflare / actiniahush personality (oraldiskwreathsway oral-disk wreath sway without naming wreath or sway or oral alone as wait; nematocysttuck nematocyst cnida tuck without naming tuck or sting or nematocyst alone as wait; pedaldiskwalkcreep pedal-disk walk creep without naming walk or creep or pedal alone as wait; retractintocolumn retract into column without naming retract or column or hide alone as wait; tentaclefan magnificent tentacle fan without naming tentacle or fan or wave alone as wait — Heteractis tentacle tell distinct from Ridge polyptentaclewave; oralflare oral-disk flare without naming flare or disk or mouth alone as wait — feeding tell; long actiniahush Actinia hush hold (THE actiniahush sit_hold tell) — never named wait or crouch or sit or still or anemone or wreath or open as bare ethogram-only trick kinds; Ridge brain_coral owns meandroidridgepulse/polyptentaclewave/diploriahush — do NOT reuse; moon_jelly and sea_star own their tells — do NOT reuse; Paint clownfish comes next — do NOT start; guest slug Wreath / key anemone only for wantsThankYou matching — accept "anemone" and "wreath"; do NOT name a trick "anemone" or "wreath" or "brain_coral" or "ridge" or "coral" or "clownfish" or "paint"; not Ridge Diploria life, not Paint Amphiprion life, not moon_jelly Aurelia life, not Rui. Oraldiskwreathsway / nematocysttuck / pedaldiskwalkcreep / retractintocolumn / tentaclefan / oralflare / actiniahush; denswreath / inkwreath / densactinia thank-yous. Same map as web anemone-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names wreath/open/still/walk/sit/wait/anemone as bare ethogram-only trick kinds. True Magnificent Sea Anemone Heteractis magnifica desk life only — oral-disk wreath sway, nematocyst tuck, pedal-disk creep, column retract, tentacle fan, oral flare, Actinia hush. Next house-order ultra: Paint / clownfish. No cry inventing — anemone.wav EXISTS so prefersHouseCry adds anemone after brain_coral. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "anemone";
  const TRICKS = ["oraldiskwreathsway", "nematocysttuck", "pedaldiskwalkcreep", "retractintocolumn", "tentaclefan", "oralflare", "actiniahush"];
  const HAPPY = ["denswreath", "inkwreath", "densactinia"];

  const HAPPY_DUR = { denswreath: 1.70, inkwreath: 1.84, densactinia: 1.76 };
  const ACTINIAHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    actiniahush: ACTINIAHUSH_HOLD + RELEASE_S,
    oraldiskwreathsway: 2.48,
    nematocysttuck: 2.42,
    pedaldiskwalkcreep: 2.40,
    retractintocolumn: 2.44,
    tentaclefan: 2.38,
    oralflare: 2.56,
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
    if (kind === "actiniahush") return 40 + roll * 26;
    if (kind === "tentaclefan" || kind === "oraldiskwreathsway" || kind === "oralflare") return 12.8 + roll * 9.4;
    if (kind === "pedaldiskwalkcreep" || kind === "nematocysttuck" || kind === "retractintocolumn") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "actiniahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "actiniahush") {
      if (roll < 0.17) return "oraldiskwreathsway";
      if (roll < 0.33) return "nematocysttuck";
      if (roll < 0.49) return "pedaldiskwalkcreep";
      if (roll < 0.65) return "retractintocolumn";
      if (roll < 0.83) return "tentaclefan";
      return "oralflare";
    }
    if (lastKind === "oraldiskwreathsway") {
      if (roll < 0.16) return "actiniahush";
      if (roll < 0.32) return "nematocysttuck";
      if (roll < 0.48) return "pedaldiskwalkcreep";
      if (roll < 0.64) return "retractintocolumn";
      if (roll < 0.82) return "tentaclefan";
      return "oralflare";
    }
    if (lastKind === "nematocysttuck") {
      if (roll < 0.14) return "actiniahush";
      if (roll < 0.3) return "oraldiskwreathsway";
      if (roll < 0.46) return "pedaldiskwalkcreep";
      if (roll < 0.62) return "retractintocolumn";
      if (roll < 0.8) return "tentaclefan";
      return "oralflare";
    }
    if (lastKind === "pedaldiskwalkcreep") {
      if (roll < 0.15) return "actiniahush";
      if (roll < 0.31) return "oraldiskwreathsway";
      if (roll < 0.47) return "nematocysttuck";
      if (roll < 0.63) return "retractintocolumn";
      if (roll < 0.81) return "tentaclefan";
      return "oralflare";
    }
    if (lastKind === "retractintocolumn") {
      if (roll < 0.16) return "actiniahush";
      if (roll < 0.32) return "oraldiskwreathsway";
      if (roll < 0.48) return "nematocysttuck";
      if (roll < 0.64) return "pedaldiskwalkcreep";
      if (roll < 0.82) return "tentaclefan";
      return "oralflare";
    }
    if (lastKind === "tentaclefan") {
      if (roll < 0.15) return "actiniahush";
      if (roll < 0.31) return "oraldiskwreathsway";
      if (roll < 0.47) return "nematocysttuck";
      if (roll < 0.63) return "pedaldiskwalkcreep";
      if (roll < 0.81) return "retractintocolumn";
      return "oralflare";
    }
    if (lastKind === "oralflare") {
      if (roll < 0.16) return "actiniahush";
      if (roll < 0.32) return "oraldiskwreathsway";
      if (roll < 0.48) return "nematocysttuck";
      if (roll < 0.64) return "pedaldiskwalkcreep";
      if (roll < 0.82) return "retractintocolumn";
      return "tentaclefan";
    }
    if (roll < 0.14) return "actiniahush";
    if (roll < 0.28) return "oraldiskwreathsway";
    if (roll < 0.42) return "nematocysttuck";
    if (roll < 0.56) return "pedaldiskwalkcreep";
    if (roll < 0.7) return "retractintocolumn";
    if (roll < 0.85) return "tentaclefan";
    return "oralflare";
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
    return key === TRICK_KEY || key === "wreath";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denswreath";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denswreath" ? "sit" : name === "inkwreath" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denswreathPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswreath));
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

  function inkwreathPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwreath));
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

  function densactiniaPose(t) {
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
    if (next.kind === "denswreath") {
      const pose = denswreathPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkwreath") {
      const pose = inkwreathPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densactiniaPose(next.t);
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
      kind === "actiniahush"
        ? "sit"
        : kind === "oraldiskwreathsway"
          ? "sit"
          : kind === "oralflare"
            ? "talk"
            : kind === "nematocysttuck"
              ? "play"
              : kind === "pedaldiskwalkcreep"
                ? "sit"
                : kind === "retractintocolumn"
                  ? "sit"
                  : kind === "tentaclefan"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "actiniahush" ? "hold" : "go",
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

  function actiniahushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function oraldiskwreathswayPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.oraldiskwreathsway));
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

  function nematocysttuckPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nematocysttuck));
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

  function oralflarePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.oralflare));
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

  function retractintocolumnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.retractintocolumn));
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

  function pedaldiskwalkcreepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pedaldiskwalkcreep));
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

  function tentaclefanPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tentaclefan));
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
      trick.kind !== "oraldiskwreathsway" &&
      trick.kind !== "nematocysttuck" &&
      trick.kind !== "pedaldiskwalkcreep" &&
      trick.kind !== "retractintocolumn" &&
      trick.kind !== "tentaclefan" &&
      trick.kind !== "oralflare"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "actiniahush") {
      if (next.t < ACTINIAHUSH_HOLD) {
        const pose = actiniahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ACTINIAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ACTINIAHUSH_HOLD);
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
    if (next.kind === "oraldiskwreathsway") {
      const pose = oraldiskwreathswayPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nematocysttuck") {
      const pose = nematocysttuckPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pedaldiskwalkcreep") {
      const pose = pedaldiskwalkcreepPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "retractintocolumn") {
      const pose = retractintocolumnPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tentaclefan") {
      const pose = tentaclefanPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = oralflarePose(next.t, fromX, trick.facing);
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
    ACTINIAHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    actiniahushPose,
    releasePose,
    oraldiskwreathswayPose,
    nematocysttuckPose,
    oralflarePose,
    retractintocolumnPose,
    pedaldiskwalkcreepPose,
    tentaclefanPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denswreathPose,
    inkwreathPose,
    densactiniaPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAnemoneTricks = api;
})(typeof window !== "undefined" ? window : globalThis);