/** Blade ground tricks while idle. House neighborly Tettigoniidae / Northern True Katydid desk life -- leafstill / antennatick / tegminasong / leafwalk / tettigonihush personality (leafstill leaf-mimic stillness; antennatick long-antenna tick; tegminasong tegmina song cue distinct from cricket stridulate; leafwalk slow leaf walk; long tettigonihush Tettigonia katydid hush -- never named wait; not Chirp gryllidae clones; not Brood cicada; not Vault grasshopper next; window-play and Call Blade leave katydid alone; guest slug Blade / key katydid -- accept "katydid" and "blade"; Thank-yous densblade / inkblade / denstettigonia. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web katydid-tricks.ts. Next: Vault / grasshopper. Catalog 220. */
(function (root) {
  const TRICK_KEY = "katydid";
  const TRICKS = ["leafstill", "antennatick", "tegminasong", "leafwalk", "tettigonihush"];
  const HAPPY = ["densblade", "inkblade", "denstettigonia"];
  const HAPPY_DUR = { densblade: 2.55, inkblade: 2.68, denstettigonia: 2.44 };
  const TETTIGONIHUSH_HOLD = 26.40;
  const RELEASE_S = 2.22;
  const DUR = { tettigonihush: TETTIGONIHUSH_HOLD + RELEASE_S, leafstill: 4.65, antennatick: 3.95, tegminasong: 4.28, leafwalk: 4.85 };

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
    if (kind === "tettigonihush") return 178 + roll * 16;
    if (kind === "leafstill") return 24.8 + roll * 4.2;
    if (kind === "antennatick") return 23.2 + roll * 3.9;
    if (kind === "tegminasong") return 22.8 + roll * 3.7;
    if (kind === "leafwalk") return 25.4 + roll * 4.0;
    return justFinished ? 18.4 + roll * 2.9 : 13.8 + roll * 2.5;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tettigonihush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tettigonihush") {
      if (roll < 0.26) return "leafstill";
      if (roll < 0.5) return "antennatick";
      if (roll < 0.74) return "tegminasong";
      return "leafwalk";
    }
    if (lastKind === "leafstill") {
      if (roll < 0.26) return "tettigonihush";
      if (roll < 0.5) return "antennatick";
      if (roll < 0.74) return "tegminasong";
      return "leafwalk";
    }
    if (lastKind === "antennatick") {
      if (roll < 0.22) return "tettigonihush";
      if (roll < 0.44) return "leafstill";
      if (roll < 0.68) return "tegminasong";
      return "leafwalk";
    }
    if (roll < 0.2) return "tettigonihush";
    if (roll < 0.4) return "leafstill";
    if (roll < 0.6) return "antennatick";
    if (roll < 0.8) return "tegminasong";
    return "leafwalk";
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

  function wantsThankYou(key) {
    return key === TRICK_KEY || key === "blade";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densblade";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densblade" ? "sit" : name === "inkblade" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densbladePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densblade));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0028, rot: s * 0.10, anim: "sit" };
    }
    if (u < 0.86) {
      const leaf = Math.sin(((u - 0.14) / 0.72) * Math.PI * 1.85);
      return { lift: -0.0028 + Math.abs(leaf) * 0.00095, rot: 0.10 + leaf * 0.08, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: -0.0028 * (1 - s), rot: 0.10 * (1 - s), anim: "idle" };
  }
  function inkbladePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkblade));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0036, rot: s * -0.26, anim: "play" };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 2.9);
      return { lift: 0.0036 + Math.abs(pulse) * 0.00135, rot: -0.26 + pulse * 0.20, anim: "play" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0036 * (1 - s), rot: -0.26 * (1 - s), anim: "idle" };
  }
  function denstettigoniaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstettigonia));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0022, rot: s * 0.16, anim: "play" };
    }
    if (u < 0.82) {
      const wing = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.15);
      return { lift: 0.0022 + Math.abs(wing) * 0.0009, rot: 0.16 + wing * 0.12, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0022 * (1 - s), rot: 0.16 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densblade") {
      const pose = densbladePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkblade") {
      const pose = inkbladePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denstettigoniaPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "tettigonihush";
    const anim =
      k === "tettigonihush"
        ? "sit"
        : k === "leafstill"
          ? "sit"
          : k === "antennatick"
            ? "talk"
            : k === "tegminasong"
              ? "play"
              : k === "leafwalk"
                ? "walk"
                : "sit";
    return {
      kind: k,
      phase: k === "tettigonihush" ? "hold" : "go",
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

  function tettigonihushPose(t) {
    const breath = Math.sin(t * 0.00142) + 0.00055 * Math.sin(t * 0.0044);
    const hush = Math.abs(Math.sin(t * 0.00062));
    return { lift: -0.00022 + hush * 0.00008, rot: 0.009 + breath * 0.0032 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00020 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.009 * (1 - u) };
  }

  function leafstillPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.leafstill));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00005, lift: s * -0.0032, rot: s * 0.06 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const sway = Math.sin((u - 0.16) / 0.70 * Math.PI * 1.15);
      const vein = Math.sin(t * 0.42) + 0.03 * Math.sin(t * 0.84);
      return {
        x: fromX + face * (0.00005 + sway * 0.00018 + vein * 0.00004),
        lift: -0.0032 + Math.abs(sway) * 0.00125 + Math.abs(vein) * 0.00018,
        rot: (0.10 + sway * 0.14 + vein * 0.03) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00005 * (1 - s), lift: -0.0032 * (1 - s), rot: 0.012 * (1 - s) * face, anim: "idle" };
  }

  function antennatickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennatick));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00012, lift: s * 0.0024, rot: s * 0.22 * face, anim: "talk" };
    }
    if (u < 0.88) {
      const tick = Math.sin((u - 0.10) / 0.78 * Math.PI * 7.2);
      const feel = Math.sin(t * 2.85) + 0.06 * Math.sin(t * 5.7);
      return {
        x: fromX + face * (0.00012 + tick * 0.00028 + feel * 0.00008),
        lift: 0.0024 + Math.abs(tick) * 0.00115 + Math.abs(feel) * 0.0004,
        rot: (0.22 + tick * 0.28 + feel * 0.10) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00012 * (1 - s), lift: 0.0024 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" };
  }

  function tegminasongPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tegminasong));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00018, lift: s * 0.0032, rot: s * 0.14 * face, anim: "play" };
    }
    if (u < 0.86) {
      const song = Math.sin((u - 0.12) / 0.74 * Math.PI * 5.4);
      const tegmen = Math.sin(t * 2.15) + 0.07 * Math.sin(t * 4.3);
      return {
        x: fromX + face * (0.00018 + song * 0.00042 + tegmen * 0.00008),
        lift: 0.0032 + Math.abs(song) * 0.00165 + Math.abs(tegmen) * 0.0005,
        rot: (0.14 + song * 0.36 + tegmen * 0.12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00018 * (1 - s), lift: 0.0007 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" };
  }

  function leafwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.leafwalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00035, lift: s * 0.0014, rot: s * -0.08 * face, anim: "walk" };
    }
    if (u < 0.90) {
      const step = Math.sin((u - 0.10) / 0.80 * Math.PI * 2.4);
      const crawl = (u - 0.10) / 0.80;
      return {
        x: fromX + face * (0.00035 + crawl * 0.0078 + step * 0.00045),
        lift: 0.0014 + Math.abs(step) * 0.0028,
        rot: (-0.08 + step * 0.18) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00815 * (1 - s * 0.05), lift: 0.0005 * (1 - s), rot: 0.015 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "leafstill" && trick.kind !== "antennatick" && trick.kind !== "tegminasong" && trick.kind !== "leafwalk") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "tettigonihush") {
      if (next.t < TETTIGONIHUSH_HOLD) {
        const pose = tettigonihushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TETTIGONIHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TETTIGONIHUSH_HOLD);
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
    if (next.kind === "leafstill") {
      const pose = leafstillPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennatick") {
      const pose = antennatickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tegminasong") {
      const pose = tegminasongPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = leafwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    TETTIGONIHUSH_HOLD,
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
    densbladePose,
    inkbladePose,
    denstettigoniaPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    tettigonihushPose,
    releasePose,
    leafstillPose,
    antennatickPose,
    tegminasongPose,
    leafwalkPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetKatydidTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);