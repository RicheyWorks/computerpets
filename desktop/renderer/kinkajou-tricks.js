/** Wrist ground tricks while idle. House neighborly kinkajou (Potos flavus / Procyonidae) desk life -- pretailhang / nectarsip / wristrotate / nightscamper / potoshush personality (pretailhang prehensile-tail hang distinct from Swing brachiate and Hang hangsway and Opossum hang; nectarsip long-tongue nectar sip posture distinct from Hummingbird hover and Cicada tymbal; wristrotate forearm wrist-rotate reach distinct from Hang reachcrawl and Ferret barrel; nightscamper nocturnal scamper distinct from Lemur hopgallop and Squirrel scurry; long potoshush Potos flavus hush -- never named wait; NOT Swing gibbon; NOT Sun lemur; NOT Hang sloth; NOT Rui red panda; NOT ferret; guest slug Wrist / key kinkajou -- accept kinkajou and wrist; Thank-yous denswrist / inkwrist / denspotos. Sleep, hide, leave, rest, card, ribbon still win. Same map as web kinkajou-tricks.ts. Next: Sail / colugo. Catalog 220. */
(function (root) {
  const TRICK_KEY = "kinkajou";
  const TRICKS = ["pretailhang", "nectarsip", "wristrotate", "nightscamper", "potoshush"];
  const HAPPY = ["denswrist", "inkwrist", "denspotos"];
  const HAPPY_DUR = { denswrist: 2.58, inkwrist: 2.71, denspotos: 2.44 };
  const POTOSHUSH_HOLD = 30.85;
  const RELEASE_S = 2.28;
  const DUR = { potoshush: POTOSHUSH_HOLD + RELEASE_S, pretailhang: 5.16, nectarsip: 4.98, wristrotate: 5.22, nightscamper: 5.08 };

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
    if (kind === "potoshush") return 194 + roll * 19;
    if (kind === "pretailhang") return 23.1 + roll * 3.4;
    if (kind === "nectarsip") return 24.8 + roll * 3.5;
    if (kind === "wristrotate") return 22.4 + roll * 3.3;
    if (kind === "nightscamper") return 21.2 + roll * 3.2;
    return justFinished ? 18.4 + roll * 2.9 : 13.7 + roll * 2.5;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "potoshush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "potoshush") {
      if (roll < 0.26) return "pretailhang";
      if (roll < 0.5) return "nectarsip";
      if (roll < 0.74) return "wristrotate";
      return "nightscamper";
    }
    if (lastKind === "pretailhang") {
      if (roll < 0.26) return "potoshush";
      if (roll < 0.5) return "nectarsip";
      if (roll < 0.74) return "wristrotate";
      return "nightscamper";
    }
    if (lastKind === "nectarsip") {
      if (roll < 0.22) return "potoshush";
      if (roll < 0.44) return "pretailhang";
      if (roll < 0.68) return "wristrotate";
      return "nightscamper";
    }
    if (roll < 0.2) return "potoshush";
    if (roll < 0.4) return "pretailhang";
    if (roll < 0.6) return "nectarsip";
    if (roll < 0.8) return "wristrotate";
    return "nightscamper";
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
    return key === TRICK_KEY || key === "wrist";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denswrist";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denswrist" ? "sit" : name === "inkwrist" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function denswristPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswrist));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0042, rot: s * -0.14, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.18);
      return { lift: 0.0042 + Math.abs(sway) * 0.0013, rot: -0.14 + sway * 0.16, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0042 * (1 - s), rot: -0.14 * (1 - s), anim: "idle" };
  }
  function inkwristPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwrist));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0031, rot: s * 0.22, anim: "play" };
    }
    if (u < 0.82) {
      const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 2.95);
      return { lift: 0.0031 + Math.abs(arc) * 0.0018, rot: 0.22 + arc * 0.24, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0031 * (1 - s), rot: 0.22 * (1 - s), anim: "idle" };
  }
  function denspotosPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspotos));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0014, rot: s * 0.15, anim: "play" };
    }
    if (u < 0.83) {
      const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.12);
      return { lift: -0.0014 + Math.abs(hush) * 0.0010, rot: 0.15 + hush * 0.14, anim: "play" };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: -0.0014 * (1 - s), rot: 0.15 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denswrist") {
      const pose = denswristPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkwrist") {
      const pose = inkwristPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denspotosPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "potoshush";
    const anim =
      k === "potoshush"
        ? "sit"
        : k === "pretailhang"
          ? "play"
          : k === "nectarsip"
            ? "play"
            : k === "nightscamper"
              ? "walk"
              : k === "wristrotate"
                ? "play"
                : "sit";
    return {
      kind: k,
      phase: k === "potoshush" ? "hold" : "go",
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

  function potoshushPose(t) {
    const breath = Math.sin(t * 0.00072) + 0.00022 * Math.sin(t * 0.0019);
    const hush = Math.abs(Math.sin(t * 0.00029));
    return { lift: -0.00014 + hush * 0.000042, rot: 0.0032 + breath * 0.0020 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00016 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0041 * (1 - u) };
  }

  function pretailhangPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pretailhang));
    const face = facing == null ? 1 : facing;
    // prehensile-tail hang: hook, invert-settle, soft sway, unhook -- not Swing brachiate arc, not Hang hangsway
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.0005, lift: s * 0.0092, rot: s * 0.55 * face, anim: "play" };
    }
    if (u < 0.55) {
      const s = smoothstep((u - 0.16) / 0.39);
      const sway = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + face * (0.0005 + sway * 0.0006),
        lift: 0.0092 + Math.abs(sway) * 0.0018,
        rot: (0.55 + sway * 0.12) * face,
        anim: "play",
      };
    }
    if (u < 0.8) {
      const s = smoothstep((u - 0.55) / 0.25);
      return {
        x: fromX + face * (0.0011 - s * 0.0003),
        lift: 0.0092 - s * 0.0025,
        rot: (0.67 - s * 0.28) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.0067 * (1 - s), rot: 0.39 * (1 - s) * face, anim: "idle" };
  }

  function nectarsipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nectarsip));
    const face = facing == null ? 1 : facing;
    // long-tongue nectar sip: lean, tongue-extend pulse thrice, draw back -- desk motion only, no audio
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0007, lift: s * 0.0036, rot: s * -0.28 * face, anim: "play" };
    }
    if (u < 0.78) {
      const sip = (u - 0.14) / 0.64;
      const tongue = Math.sin(sip * Math.PI * 3.05);
      return {
        x: fromX + face * (0.0007 + Math.abs(tongue) * 0.00035),
        lift: 0.0036 + Math.abs(tongue) * 0.0012,
        rot: (-0.28 + tongue * 0.14) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.0007 * (1 - s), lift: 0.0036 * (1 - s), rot: -0.28 * (1 - s) * face, anim: "idle" };
  }

  function wristrotatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wristrotate));
    const face = facing == null ? 1 : facing;
    // forearm wrist-rotate reach: plant, rotate-extend, probe, retract -- not Hang reachcrawl, not ferret barrel
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0004, lift: s * 0.0048, rot: s * -0.36 * face, anim: "play" };
    }
    if (u < 0.52) {
      const reach = (u - 0.14) / 0.38;
      const twist = Math.sin(reach * Math.PI * 2.1);
      return {
        x: fromX + face * (0.0004 + reach * 0.0022),
        lift: 0.0048 + Math.abs(twist) * 0.0016,
        rot: (-0.36 + twist * 0.42) * face,
        anim: "play",
      };
    }
    if (u < 0.78) {
      const draw = Math.sin(((u - 0.52) / 0.26) * Math.PI);
      return {
        x: fromX + face * (0.0026 - draw * 0.0005),
        lift: 0.0048 - draw * 0.0010,
        rot: (0.06 - draw * 0.18) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.0021 * (1 - s), lift: 0.0038 * (1 - s), rot: -0.12 * (1 - s) * face, anim: "idle" };
  }

  function nightscamperPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nightscamper));
    const face = facing == null ? 1 : facing;
    // nocturnal scamper: low quick scramble across desk -- not lemur hop-gallop, not upright bipedal strut
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 0.0008, lift: s * 0.0022, rot: s * -0.06 * face, anim: "walk" };
    }
    if (u < 0.84) {
      const scam = (u - 0.1) / 0.74;
      const step = Math.sin(scam * Math.PI * 5.2);
      return {
        x: fromX + face * (0.0008 + scam * 0.022),
        lift: 0.0022 + Math.abs(step) * 0.0018,
        rot: (-0.06 + step * 0.09) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * (0.0228 - s * 0.0006), lift: 0.0022 * (1 - s), rot: -0.06 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "pretailhang" && trick.kind !== "nectarsip" && trick.kind !== "wristrotate" && trick.kind !== "nightscamper") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "potoshush") {
      if (next.t < POTOSHUSH_HOLD) {
        const pose = potoshushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < POTOSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - POTOSHUSH_HOLD);
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
    if (next.kind === "pretailhang") {
      const pose = pretailhangPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nectarsip") {
      const pose = nectarsipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nightscamper") {
      const pose = nightscamperPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = wristrotatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    POTOSHUSH_HOLD,
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
    denswristPose,
    inkwristPose,
    denspotosPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    potoshushPose,
    releasePose,
    pretailhangPose,
    nectarsipPose,
    wristrotatePose,
    nightscamperPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetKinkajouTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
