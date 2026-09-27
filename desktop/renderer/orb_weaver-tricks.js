/** Loom ground tricks while idle — ultra-polish pass. House neighborly Araneidae / Araneus European garden spider (orb_weaver / Loom) desk life — radiate / stabilimentum / swathe / strum / araneus / dragline / viscid personality (radiate orb-radial frame without naming frame or still or dart or orb as bare ethogram-only trick kinds, stabilimentum zigzag decoration without naming zigzag or still or dart or decorate, swathe prey-wrap without naming wrap or still or dart or bind, strum web-vibration without naming vibrate or still or dart or pluck, dragline safety-line without naming line or still or dart or silk, viscid sticky spiral without naming sticky or still or dart or glue, long araneus sit_hold under the scrap lamp (THE araneus sit_hold tell) — never named wait or wake or still or hide or cover or glue or flare or dart or nest or zig or swim or gulp or drift or glint or hinge or sucker or latch or crawl or dig or burrow or blush or pink or sit_web or wrap as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play web RED unchanged if already fine; Rose owns bacteriorhodopsin/saltsquare/gasvesicle/carotenoid/retinal/archaellum/brinedrift; Rod owns runandtumble/binaryfission/pilus/chemotax/nucleoid/fimbria/flagmotor; guest slug Loom / key orb_weaver only for isKey matching — accept "orb_weaver" and "loom"; do NOT name a trick "orb_weaver" or "loom" or "still" or "web" or "wrap") — not Rose haloarchaea life, not Rod coli life, not Jumping Spider / Wolf Spider / Tarantula / Widow life. Radiate orb-radial tip without naming frame, stabilimentum zigzag without naming decorate, swathe prey-wrap without naming bind, strum vibration without naming pluck, dragline safety-line without naming silk, viscid sticky spiral without naming glue, araneus long sit_hold under the scrap lamp (THE araneus sit_hold tell); diadematus / quadratus / marmoreus thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web orb_weaver-tricks.ts. Window-play web RED unchanged. Ethogram softs + freeze — never names loom/orb_weaver/still/sit_web/wrap as bare ethogram-only trick kinds. True Araneus desk life only — distinct from Rose, Rod, and other arachnid guests. Next house-order ultra: Flag / deer. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via orb_weaver.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "orb_weaver";
  const TRICKS = ["radiate", "stabilimentum", "swathe", "strum", "araneus", "dragline", "viscid"];
  const HAPPY = ["diadematus", "quadratus", "marmoreus"];

  const HAPPY_DUR = { diadematus: 1.70, quadratus: 1.82, marmoreus: 1.71 };
  const ARANEUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    araneus: ARANEUS_HOLD + RELEASE_S,
    radiate: 2.36,
    stabilimentum: 2.50,
    swathe: 2.56,
    strum: 2.42,
    dragline: 2.44,
    viscid: 2.39,
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

  function nextTrickWait(justFinished,rand,kind) {
    const roll = rand == null ? Math.random() : rand;
    if (kind === "araneus") return 40 + roll * 26;
    if (kind === "dragline" || kind === "viscid" || kind === "radiate") return 12.8 + roll * 9.4;
    if (kind === "stabilimentum" || kind === "swathe" || kind === "strum") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand,musicOn,lastKind) {
    if (musicOn) return "araneus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "araneus") {
      if (roll < 0.17) return "radiate";
      if (roll < 0.33) return "stabilimentum";
      if (roll < 0.49) return "swathe";
      if (roll < 0.65) return "strum";
      if (roll < 0.83) return "dragline";
      return "viscid";
    }
    if (lastKind === "radiate") {
      if (roll < 0.16) return "araneus";
      if (roll < 0.32) return "stabilimentum";
      if (roll < 0.48) return "swathe";
      if (roll < 0.64) return "strum";
      if (roll < 0.82) return "dragline";
      return "viscid";
    }
    if (lastKind === "stabilimentum") {
      if (roll < 0.14) return "araneus";
      if (roll < 0.3) return "radiate";
      if (roll < 0.46) return "swathe";
      if (roll < 0.62) return "strum";
      if (roll < 0.8) return "dragline";
      return "viscid";
    }
    if (lastKind === "dragline" || lastKind === "viscid") {
      if (roll < 0.14) return "araneus";
      if (roll < 0.3) return "radiate";
      if (roll < 0.46) return "stabilimentum";
      if (roll < 0.62) return "swathe";
      if (roll < 0.78) return "strum";
      return lastKind === "dragline" ? ("viscid") : ("dragline");
    }
    if (roll < 0.14) return "araneus";
    if (roll < 0.28) return "radiate";
    if (roll < 0.42) return "stabilimentum";
    if (roll < 0.56) return "swathe";
    if (roll < 0.7) return "strum";
    if (roll < 0.85) return "dragline";
    return "viscid";
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
    return key === TRICK_KEY || key === "loom";
  }

  function startThankYou(key,lastKind,x,
    facing,flags,
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind,rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind,x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "diadematus";
    return {
      kind: name, happy: true,
      phase: "go",
      t: 0,x,
      lift: 0,
      rot: 0,
      anim: name === "diadematus" ? "sit" : name === "quadratus" ? "play" : "sit",
      facing: facing == null ? 1 : facing, fromX: x,
    };
  }

  function diadematusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.diadematus));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 1.72);
      return {
        lift: 2.8 + Math.abs(flash) * 1.4,
        rot: 12 + flash * 8,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function quadratusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.quadratus));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 2.1);
      return {
        lift: 3.4 + Math.abs(wriggle) * 1.6,
        rot: -14 + wriggle * 10,
        dx: 0.08,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function marmoreusPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.52) * 6,
      dx: 0,
      anim: "sit",
    };
  }

  function stepHappy(happy,dt,flags) {
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "diadematus") {
      const pose = diadematusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "quadratus") {
      const pose = quadratusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = marmoreusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key,_frameCount) {
    return null;
  }

  function beginTrick(kind,x, facing) {
    const anim =
      kind === "araneus"
        ? "sit"
        : kind === "radiate"
          ? "sit"
          : kind === "stabilimentum"
            ? "walk"
            : kind === "swathe"
              ? "play"
              : kind === "strum"
                ? "play"
                : kind === "dragline"
                  ? "play"
                  : kind === "viscid"
                    ? "walk"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? (kind) : "radiate",
      phase: kind === "araneus" ? "hold" : "go",
      t: 0,x,
      lift: 0,
      rot: 0,anim,
      facing: facing == null ? 1 : facing, fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function araneusPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.14) * 4,
      anim: "sit",
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function radiatePose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.radiate));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.5, rot: s * 14 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const snap = Math.sin(t * 2.4);
      return {
        x: fromX + face * snap * 0.14,
        lift: 3.5 + Math.abs(snap) * 1.5,
        rot: face * (15 + snap * 11),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: face * (4 * (1 - s)),
      anim: "idle",
    };
  }

  function stabilimentumPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stabilimentum));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.9, rot: s * -16 * face, anim: "walk" };
    }
    if (u < 0.48) {
      const s = smoothstep((u - 0.12) / 0.36);
      return {
        x: fromX - face * (2.2 + s * 4.5),
        lift: 3.6 + Math.sin(s * Math.PI) * 2.2,
        rot: face * (-16 + s * 22),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const settle = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX - face * (6.7 * (1 - s)),
        lift: 2.4 + Math.abs(settle) * 1.1,
        rot: face * (6 + settle * 8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function swathePose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.swathe));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.8, lift: s * 2.2, rot: s * 8 * face, anim: "play" };
    }
    if (u < 0.72) {
      const mud = Math.sin(t * 1.6);
      return {
        x: fromX + face * (0.8 + mud * 0.4),
        lift: 2.2 + Math.abs(mud) * 1.0,
        rot: face * (8 + mud * 10),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: s > 0.6 ? ("idle") : ("play"),
    };
  }

  function strumPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.strum));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.4, rot: s * 10 * face, anim: "play" };
    }
    if (u < 0.84) {
      const tap = Math.sin(t * 2.8);
      return {
        x: fromX + face * tap * 0.2,
        lift: 2.4 + Math.abs(tap) * 1.1,
        rot: face * (10 + tap * 12),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function draglinePose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dragline));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "play" };
    }
    if (u < 0.55) {
      const pulse = Math.sin(t * 3.2);
      return {
        x: fromX,
        lift: 2.8 + pulse * 1.6,
        rot: face * (12 + pulse * 14),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const scent = Math.sin(t * 1.1);
      return {
        x: fromX + face * scent * 0.15,
        lift: 4.0 + Math.abs(scent) * 0.6,
        rot: face * (22 + scent * 4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.0 * (1 - s),
      rot: face * (8 * (1 - s)),
      anim: "idle",
    };
  }

  function viscidPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.viscid));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "walk" };
    }
    if (u < 0.55) {
      const flash = Math.abs(Math.sin(t * 2.6));
      return {
        x: fromX + face * flash * 0.2,
        lift: 3.4 + flash * 1.4,
        rot: face * (-12 - flash * 10),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const warn = Math.sin(t * 1.4);
      return {
        x: fromX,
        lift: 4.4 + Math.abs(warn) * 0.7,
        rot: face * (-18 + warn * 6),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.8 * (1 - s),
      rot: face * (-5 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick,dt,flags) {
    if (shouldAbort(flags)) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "araneus") {
      if (next.t < ARANEUS_HOLD) {
        const pose = araneusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < ARANEUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ARANEUS_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    if (next.kind === "radiate") {
      const pose = radiatePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stabilimentum") {
      const pose = stabilimentumPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "swathe") {
      const pose = swathePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "strum") {
      const pose = strumPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dragline") {
      const pose = draglinePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = viscidPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    ARANEUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    araneusPose,
    releasePose,
    radiatePose,
    stabilimentumPose,
    swathePose,
    strumPose,
    draglinePose,
    viscidPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    diadematusPose,
    quadratusPose,
    marmoreusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOrbWeaverTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
