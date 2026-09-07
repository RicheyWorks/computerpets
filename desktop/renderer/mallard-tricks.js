/** Drake ground tricks while idle. House neighborly Anatidae / Anas mallard desk life — dabble / upend / headshake / gruntwhistle / anas personality (dabble surface-bill tip-feed without naming tip or tipup or window-play tip or hop or soar, upend full tip-up tail-high forage without naming plunge or dive or hangup or softcrouch, headshake comfort head-shake without naming shake-cry or snore or cronk or keeyer, gruntwhistle grunt-whistle courtship nod without naming sing or song or cry or call or feebee or carol or whistle-cry, long anas Anas platyrhynchos green-head desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or oil or dab; window-play leaves mallard tip alone; Soot/Wedge/Heart/Hook/Dee/Brick own their tricks; guest slug Drake / key mallard — accept "mallard" and "drake"; do NOT name a trick mallard or drake or tip or hop or soar or mantle or dabble-cry). Thank-yous platyrhynchos / conboschas / diazi. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web mallard-tricks.ts. Window-play unchanged (TIP / tip). True mallard desk life — not robin/chickadee/hawk/owl/crow/raven clones. Vee owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "mallard";
  const TRICKS = ["dabble", "upend", "headshake", "gruntwhistle", "anas"];
  const HAPPY = ["platyrhynchos", "conboschas", "diazi"];
  const HAPPY_DUR = { platyrhynchos: 1.66, conboschas: 1.81, diazi: 1.72 };
  const ANAS_HOLD = 19.36;
  const RELEASE_S = 1.16;
  const DUR = { anas: ANAS_HOLD + RELEASE_S, dabble: 2.54, upend: 2.70, headshake: 2.34, gruntwhistle: 2.60 };

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
      if (kind === "anas") return 88 + roll * 40;
  if (kind === "dabble") return 15.4 + roll * 13.4;
  if (kind === "upend") return 18.2 + roll * 12.2;
  if (kind === "gruntwhistle") return 20.6 + roll * 12.8;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "anas";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "anas") {
      if (roll < 0.26) return "dabble";
      if (roll < 0.5) return "upend";
      if (roll < 0.74) return "headshake";
      return "gruntwhistle";
    }
    if (lastKind === "dabble") {
      if (roll < 0.26) return "anas";
      if (roll < 0.5) return "upend";
      if (roll < 0.74) return "headshake";
      return "gruntwhistle";
    }
    if (lastKind === "upend") {
      if (roll < 0.22) return "anas";
      if (roll < 0.44) return "dabble";
      if (roll < 0.68) return "headshake";
      return "gruntwhistle";
    }
    if (roll < 0.2) return "anas";
    if (roll < 0.4) return "dabble";
    if (roll < 0.6) return "upend";
    if (roll < 0.8) return "headshake";
    return "gruntwhistle";
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
    return key === TRICK_KEY || key === "drake";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "platyrhynchos";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "platyrhynchos" ? "sit" : name === "conboschas" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function platyrhynchosPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.platyrhynchos));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.018, rot: s * 2.25, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.5) + 0.26 * Math.sin(t * 11.2);
      return {
        lift: 0.018 + Math.abs(flash) * 0.015,
        rot: 2.25 + flash * 1.65,
        dx: flash * 0.0011,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.008 * (1 - s), rot: 0.58 * (1 - s), dx: 0, anim: "idle" };
  }
  function conboschasPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.conboschas));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.030, rot: s * -2.15, dx: s * 0.0015, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.2) + 0.25 * Math.sin(t * 7.6);
      return {
        lift: 0.030 + Math.abs(wriggle) * 0.021,
        rot: -2.15 + wriggle * 2.65,
        dx: wriggle * 0.0023,
        anim: "play",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.011 * (1 - s), rot: -0.40 * (1 - s), dx: 0, anim: "sit" };
  }
  function diaziPose(t) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.28)) * 0.016,
      rot: Math.sin(t * 0.28) * 1.30,
      dx: Math.sin(t * 0.23) * 0.0012,
      anim: "sit",
    };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "platyrhynchos") {
      const pose = platyrhynchosPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "conboschas") {
      const pose = conboschasPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = diaziPose(next.t);
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
    const anim =
      kind === "anas"
        ? "sit"
        : kind === "dabble"
          ? "play"
          : kind === "upend"
            ? "play"
            : kind === "headshake"
              ? "sit"
              : kind === "gruntwhistle"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "anas" ? "hold" : "go",
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


                      function anasPose(t) {
    const breath = Math.sin(t * 0.088) + 0.07 * Math.sin(t * 0.24);
    const soft = Math.abs(Math.sin(t * 0.115));
    return {
      lift: 0.006 + soft * 0.014,
      rot: 0.58 + breath * 0.74,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.22 * (1 - u) };
  }

  function dabblePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dabble));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      // dabble tips the bill into the ink dish without naming tip
      return { x: fromX, lift: s * -0.018, rot: s * 18.5 * face, anim: "play" };
    }
    if (u < 0.86) {
      const sift = Math.sin(t * 3.4) + 0.22 * Math.sin(t * 6.8);
      return {
        x: fromX + face * sift * 0.0018,
        lift: -0.018 + Math.abs(sift) * 0.010,
        rot: (18.5 + sift * 3.2) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: -0.006 * (1 - s),
      rot: 2.4 * (1 - s) * face,
      anim: "idle",
    };
  }
  function upendPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.upend));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      // upend rolls the sternum high for a deep tip-up
      return { x: fromX, lift: s * -0.036, rot: s * 42 * face, anim: "play" };
    }
    if (u < 0.84) {
      const kick = Math.sin(t * 2.6) + 0.2 * Math.sin(t * 5.1);
      return {
        x: fromX + face * kick * 0.0014,
        lift: -0.036 + Math.abs(kick) * 0.012,
        rot: (42 + kick * 4.5) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: -0.010 * (1 - s),
      rot: 6.0 * (1 - s) * face,
      anim: "idle",
    };
  }
  function headshakePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.headshake));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // headshake lifts into a comfort shake
      return { x: fromX, lift: s * 0.014, rot: s * 4.2 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const shake = Math.sin(t * 14.5) + 0.35 * Math.sin(t * 29.0);
      return {
        x: fromX + face * shake * 0.0020,
        lift: 0.014 + Math.abs(shake) * 0.008,
        rot: (4.2 + shake * 12.5) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 0.005 * (1 - s),
      rot: 0.8 * (1 - s) * face,
      anim: "idle",
    };
  }
  function gruntwhistlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gruntwhistle));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      // gruntwhistle lifts into a courtship nod without naming sing
      return { x: fromX, lift: s * 0.028, rot: s * 8.2 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.11) / 0.75;
      const phrase = Math.sin(s * Math.PI * 2.6);
      const settle = Math.abs(Math.sin(s * Math.PI * 5.2));
      return {
        x: fromX + face * (0.005 * s + phrase * 0.0028),
        lift: 0.024 + settle * 0.016,
        rot: (8.2 + phrase * 6.0) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + face * 0.005 * (1 - s),
      lift: 0.010 * (1 - s),
      rot: 1.6 * (1 - s) * face,
      anim: "idle",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "dabble" && trick.kind !== "upend" && trick.kind !== "headshake" && trick.kind !== "gruntwhistle") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "anas") {
      if (next.t < ANAS_HOLD) {
        const pose = anasPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ANAS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ANAS_HOLD);
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
    if (next.kind === "dabble") {
      const pose = dabblePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "upend") {
      const pose = upendPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "headshake") {
      const pose = headshakePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gruntwhistlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ANAS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    anasPose,
    releasePose,
    dabblePose,
    upendPose,
    headshakePose,
    gruntwhistlePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    platyrhynchosPose,
    conboschasPose,
    diaziPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMallardTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
