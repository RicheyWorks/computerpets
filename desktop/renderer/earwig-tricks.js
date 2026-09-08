/** Forceps ground tricks while idle. House neighborly Forficulidae / Forficula auricularia European earwig desk life -- cercithreat / fanwing / nightscuttle / broodguard / forficulahush personality (cercithreat forceps-cerci threaten then groom distinct from Haste forcipule and Barb pincer; fanwing hind-wing unfold flash under tegmina distinct from Lace wingtremble, Jewel jewelflick, Banner wingbanner, Fan flutter; nightscuttle nocturnal desk scuttle distinct from Haste fleetlegs/wallrace and Hermit scuttle; broodguard desk-safe brood-guard curl over clutch distinct from Lace eggraise and Milk chrysalis; long forficulahush Forficula earwig hush -- never named wait; NOT Haste house_centipede (forcipule/wallrace/antennaflick/fleetlegs/scutigera; densforcep taken); NOT Lace lacewing; NOT Jewel jewelwing; NOT Banner swallowtail; NOT Barb scorpion; NOT Link millipede; NOT Armor pillbug; window-play and Call Forceps leave earwig alone; guest slug Forceps / key earwig -- accept "earwig" and "forceps"; Thank-yous densforceps / inkforceps / densforficula (NOT densforcep — Haste owns densforcep). Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web earwig-tricks.ts. Next: Snout / acorn_weevil. Catalog 220. */
(function (root) {
  const TRICK_KEY = "earwig";
  const TRICKS = ["cercithreat", "fanwing", "nightscuttle", "broodguard", "forficulahush"];
  const HAPPY = ["densforceps", "inkforceps", "densforficula"];
  const HAPPY_DUR = { densforceps: 2.48, inkforceps: 2.58, densforficula: 2.36 };
  const FORFICULAHUSH_HOLD = 28.80;
  const RELEASE_S = 2.08;
  const DUR = { forficulahush: FORFICULAHUSH_HOLD + RELEASE_S, cercithreat: 4.18, fanwing: 4.02, nightscuttle: 4.64, broodguard: 4.34 };

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
    if (kind === "forficulahush") return 188 + roll * 17;
    if (kind === "cercithreat") return 20.8 + roll * 3.3;
    if (kind === "fanwing") return 22.2 + roll * 3.4;
    if (kind === "nightscuttle") return 25.4 + roll * 3.9;
    if (kind === "broodguard") return 23.0 + roll * 3.5;
    return justFinished ? 18.2 + roll * 2.8 : 13.6 + roll * 2.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "forficulahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "forficulahush") {
      if (roll < 0.26) return "cercithreat";
      if (roll < 0.5) return "fanwing";
      if (roll < 0.74) return "nightscuttle";
      return "broodguard";
    }
    if (lastKind === "cercithreat") {
      if (roll < 0.26) return "forficulahush";
      if (roll < 0.5) return "fanwing";
      if (roll < 0.74) return "nightscuttle";
      return "broodguard";
    }
    if (lastKind === "fanwing") {
      if (roll < 0.22) return "forficulahush";
      if (roll < 0.44) return "cercithreat";
      if (roll < 0.68) return "nightscuttle";
      return "broodguard";
    }
    if (roll < 0.2) return "forficulahush";
    if (roll < 0.4) return "cercithreat";
    if (roll < 0.6) return "fanwing";
    if (roll < 0.8) return "nightscuttle";
    return "broodguard";
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
    return key === TRICK_KEY || key === "forceps";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densforceps";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densforceps" ? "sit" : name === "inkforceps" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densforcepsPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densforceps));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0024, rot: s * 0.11, anim: "sit" };
    }
    if (u < 0.86) {
      const cerci = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.35);
      return { lift: -0.0024 + Math.abs(cerci) * 0.00135, rot: 0.11 + cerci * 0.16, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: -0.0024 * (1 - s), rot: 0.11 * (1 - s), anim: "idle" };
  }
  function inkforcepsPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkforceps));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0038, rot: s * -0.22, anim: "play" };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.05);
      return { lift: 0.0038 + Math.abs(pulse) * 0.00185, rot: -0.22 + pulse * 0.26, anim: "play" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0038 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }
  function densforficulaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densforficula));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0016, rot: s * 0.14, anim: "play" };
    }
    if (u < 0.82) {
      const flash = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.15);
      return { lift: 0.0016 + Math.abs(flash) * 0.00112, rot: 0.14 + flash * 0.15, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0016 * (1 - s), rot: 0.14 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densforceps") {
      const pose = densforcepsPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkforceps") {
      const pose = inkforcepsPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densforficulaPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "forficulahush";
    const anim =
      k === "forficulahush"
        ? "sit"
        : k === "cercithreat"
          ? "play"
          : k === "fanwing"
            ? "talk"
            : k === "nightscuttle"
              ? "play"
              : k === "broodguard"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "forficulahush" ? "hold" : "go",
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

  function forficulahushPose(t) {
    const breath = Math.sin(t * 0.00092) + 0.00034 * Math.sin(t * 0.0027);
    const hush = Math.abs(Math.sin(t * 0.00036));
    return { lift: -0.00022 + hush * 0.00006, rot: 0.006 + breath * 0.0024 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.006 * (1 - u) };
  }

  function cercithreatPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cercithreat));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00004, lift: s * -0.0012, rot: s * 0.32 * face, anim: "play" };
    }
    if (u < 0.55) {
      const threat = Math.sin((u - 0.12) / 0.43 * Math.PI * 3.4);
      return {
        x: fromX + face * (0.00004 + threat * 0.00012),
        lift: -0.0012 + Math.abs(threat) * 0.00055,
        rot: (0.32 + threat * 0.28) * face,
        anim: "play",
      };
    }
    if (u < 0.88) {
      const groom = Math.sin((u - 0.55) / 0.33 * Math.PI * 4.2);
      return {
        x: fromX + face * (0.00004 + groom * 0.00006),
        lift: -0.0006 + Math.abs(groom) * 0.0009,
        rot: (0.12 + groom * 0.14) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00004 * (1 - s), lift: -0.0003 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }

  function fanwingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fanwing));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00005, lift: s * 0.0036, rot: s * -0.18 * face, anim: "talk" };
    }
    if (u < 0.72) {
      const fan = Math.sin((u - 0.14) / 0.58 * Math.PI);
      const shimmer = Math.sin(t * 8.4) * 0.012;
      return {
        x: fromX + face * (0.00005 + fan * 0.0001),
        lift: 0.0036 + fan * 0.0042 + Math.abs(shimmer) * 0.0004,
        rot: (-0.18 + fan * 0.42 + shimmer) * face,
        anim: "talk",
      };
    }
    if (u < 0.88) {
      const s = smoothstep((u - 0.72) / 0.16);
      return { x: fromX + face * 0.00015, lift: 0.0078 - s * 0.0042, rot: (0.24 - s * 0.2) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00015 * (1 - s), lift: 0.0036 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }

  function nightscuttlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nightscuttle));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0002, lift: s * 0.0007, rot: s * -0.08 * face, anim: "play" };
    }
    if (u < 0.88) {
      const dash = (u - 0.10) / 0.78;
      const scuttle = Math.sin(dash * Math.PI * 9.5);
      const bob = Math.abs(Math.sin(dash * Math.PI * 7.2));
      return {
        x: fromX + face * (0.0002 + dash * 0.028 + scuttle * 0.00045),
        lift: 0.0007 + bob * 0.0011,
        rot: (-0.08 + scuttle * 0.12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0282 * (1 - s * 0.015), lift: 0.0007 * (1 - s), rot: -0.02 * (1 - s) * face, anim: "idle" };
  }

  function broodguardPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.broodguard));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00003, lift: s * -0.0032, rot: s * 0.22 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const guard = Math.sin((u - 0.16) / 0.68 * Math.PI * 1.8);
      const nest = Math.abs(Math.sin(t * 1.35));
      return {
        x: fromX + face * (0.00003 + guard * 0.00008),
        lift: -0.0032 - nest * 0.00055,
        rot: (0.22 + guard * 0.1) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00003 * (1 - s), lift: -0.0032 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "cercithreat" && trick.kind !== "fanwing" && trick.kind !== "nightscuttle" && trick.kind !== "broodguard") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "forficulahush") {
      if (next.t < FORFICULAHUSH_HOLD) {
        const pose = forficulahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < FORFICULAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - FORFICULAHUSH_HOLD);
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
    if (next.kind === "cercithreat") {
      const pose = cercithreatPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fanwing") {
      const pose = fanwingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nightscuttle") {
      const pose = nightscuttlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = broodguardPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    FORFICULAHUSH_HOLD,
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
    densforcepsPose,
    inkforcepsPose,
    densforficulaPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    forficulahushPose,
    releasePose,
    cercithreatPose,
    fanwingPose,
    nightscuttlePose,
    broodguardPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetEarwigTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
