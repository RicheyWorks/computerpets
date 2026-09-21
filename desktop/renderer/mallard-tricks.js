/** Drake ground tricks while idle — ultra-polish pass. House neighborly Anatidae / Anas mallard desk life — dabble / upend / headshake / gruntwhistle / speculum / nodswim / anas personality (dabble surface-bill tip-feed without naming tip or tipup or window-play tip or hop or soar, upend full tip-up tail-high forage without naming plunge or dive or hangup or softcrouch, headshake comfort head-shake without naming shake-cry or snore or cronk or keeyer, gruntwhistle grunt-whistle courtship nod without naming sing or song or cry or call or feebee or carol or whistle-cry, speculum blue wing-bar flash without naming fan or strut or capflash or flash-of-hawk, nodswim nod-swim courtship glide without naming paddle or soar or hopwalk or tumble, long anas Anas platyrhynchos green-head desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid or kettle or stoop or bind or keeyer or patagial or tower or buteo or feebee or gargle or hangup or cache or capflash or seedhammer or poecile or runstop or listen or carol or tug or rufous or tailcock or turdus or oil or dab; window-play leaves mallard tip alone; Soot/Wedge/Heart/Hook/Dee/Brick own their tricks; guest slug Drake / key mallard — accept "mallard" and "drake"; do NOT name a trick mallard or drake or tip or hop or soar or mantle or dabble-cry). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous platyrhynchos / conboschas / diazi. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web mallard-tricks.ts. Window-play unchanged (TIP / tip). True mallard desk life — not robin/chickadee/hawk/owl/crow/raven clones. Vee owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via mallard.wav. Amplitudes raised toward Rui richness; denser waits/weights (ANAS_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names mallard/drake/tip/loaf/quack as bare ethogram-only trick kinds. Window-play unchanged. Vee now Rue-dense; Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; next leftover Peck / penguin. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "mallard";
  const TRICKS = ["dabble", "upend", "headshake", "gruntwhistle", "speculum", "nodswim", "anas"];
  const HAPPY = ["platyrhynchos", "conboschas", "diazi"];
  const HAPPY_DUR = { platyrhynchos: 1.66, conboschas: 1.81, diazi: 1.72 };
  const ANAS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    anas: ANAS_HOLD + RELEASE_S,
    dabble: 2.54,
    upend: 2.70,
    headshake: 2.34,
    gruntwhistle: 2.60,
    speculum: 2.38,
    nodswim: 2.52,
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
    if (kind === "anas") return 40 + roll * 26;
    if (kind === "dabble" || kind === "upend" || kind === "headshake" || kind === "gruntwhistle" || kind === "speculum" || kind === "nodswim") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "anas";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) => (k === "anas" ? 0.72 : k === "dabble" || k === "gruntwhistle" ? 1.28 : k === "upend" || k === "nodswim" ? 1.18 : 1.08));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "dabble";
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
      anim: name === "conboschas" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function platyrhynchosPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.platyrhynchos));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 7.2, rot: s * 14.4, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.5) + 0.26 * Math.sin(t * 11.2);
      return { lift: 7.2 + Math.abs(flash) * 6, rot: 14.4 + flash * 9.6, dx: flash * 2.64, anim: "sit" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function conboschasPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.conboschas));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 16.8, rot: s * -14.4, dx: s * 3.6, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.2) + 0.25 * Math.sin(t * 7.6);
      return { lift: 14.4 + Math.abs(wriggle) * 12, rot: -12 + wriggle * 16.8, dx: wriggle * 4.8, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" };
  }

  function diaziPose(t) {
    return {
      lift: 3.6 + Math.abs(Math.sin(t * 4.0)) * 8.4,
      rot: Math.sin(t * 3.4) * 10.8,
      dx: Math.sin(t * 2.6) * 3.6,
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
    const pose =
      next.kind === "platyrhynchos"
        ? platyrhynchosPose(next.t)
        : next.kind === "conboschas"
          ? conboschasPose(next.t)
          : diaziPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "anas" || kind === "headshake" || kind === "speculum"
        ? "sit"
        : kind === "dabble" || kind === "upend" || kind === "nodswim"
          ? "play"
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
    const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
    const soft = Math.abs(Math.sin(t * 0.9));
    return { lift: 2.4 + soft * 4.8 + Math.abs(breath) * 1.8, rot: -2.4 + breath * 4.8 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
  }

  function dabblePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dabble));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -9.6, rot: s * 21.6 * face, anim: "play" };
    }
    if (u < 0.86) {
      const sift = Math.sin(t * 3.4) + 0.22 * Math.sin(t * 6.8);
      return {
        x: fromX + face * sift * 3.6,
        lift: -9.6 + Math.abs(sift) * 7.2,
        rot: (21.6 + sift * 6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: -3.6 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" };
  }

  function upendPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.upend));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * -14.4, rot: s * 45.6 * face, anim: "play" };
    }
    if (u < 0.84) {
      const kick = Math.sin(t * 2.6) + 0.2 * Math.sin(t * 5.1);
      return {
        x: fromX + face * kick * 3,
        lift: -14.4 + Math.abs(kick) * 6,
        rot: (45.6 + kick * 7.2) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: -4.8 * (1 - s), rot: 7.2 * (1 - s) * face, anim: "idle" };
  }

  function headshakePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.headshake));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 7.2, rot: s * 9.6 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const shake = Math.sin(t * 14.5) + 0.35 * Math.sin(t * 29.0);
      return {
        x: fromX + face * shake * 3.6,
        lift: 7.2 + Math.abs(shake) * 4.8,
        rot: (9.6 + shake * 16.8) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 3.6 * (1 - s), rot: 2.4 * (1 - s) * face, anim: "idle" };
  }

  function gruntwhistlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gruntwhistle));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * 7.2, rot: s * 16.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.11) / 0.75;
      const phrase = Math.sin(s * Math.PI * 2.6);
      const settle = Math.abs(Math.sin(s * Math.PI * 5.2));
      return {
        x: fromX + face * (4 * s + phrase * 3.36),
        lift: 6 + settle * 4.8,
        rot: (16.8 + phrase * 7.2) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 4 * (1 - s), lift: 3.6 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" };
  }

  function speculumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.speculum));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 9.6, rot: s * -14.4 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const flash = Math.sin(t * 5.4) + 0.28 * Math.sin(t * 10.8);
      return {
        x: fromX + face * flash * 3.6,
        lift: 8.4 + Math.abs(flash) * 7.2,
        rot: (-14.4 + flash * 12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 3.6 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function nodswimPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nodswim));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 6, rot: s * -9.6 * face, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.10) / 0.78;
      const nod = Math.sin(s * Math.PI * 3.6);
      const glide = Math.abs(Math.sin(s * Math.PI * 1.8));
      return {
        x: fromX + face * (12 * s + nod * 4.8),
        lift: 4.8 + glide * 9.6 + Math.abs(nod) * 3.6,
        rot: (-9.6 + nod * 12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 12 * (1 - s), lift: 3.6 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    const short =
      trick.kind === "dabble" ||
      trick.kind === "upend" ||
      trick.kind === "headshake" ||
      trick.kind === "gruntwhistle" ||
      trick.kind === "speculum" ||
      trick.kind === "nodswim";
    if (shouldAbort(flags) && !short) {
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
    const from = trick.fromX != null ? trick.fromX : trick.x;
    const poseFn = {
      dabble: dabblePose,
      upend: upendPose,
      headshake: headshakePose,
      gruntwhistle: gruntwhistlePose,
      speculum: speculumPose,
      nodswim: nodswimPose,
    };
    const fn = poseFn[next.kind] || dabblePose;
    const pose = fn(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
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
    speculumPose,
    nodswimPose,
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
