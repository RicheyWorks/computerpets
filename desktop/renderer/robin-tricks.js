/** Brick ground tricks while idle — ultra-polish pass. House neighborly Turdidae / Turdus American robin desk life — runstop / listen / carol / tug / rufous / tailcock / turdus personality (runstop run-stop-run lawn forage without naming hop or hopwalk or soar, listen head-cock worm-listen without naming monocle or parallax or softcrouch, carol dawn-carol stance without naming sing or song or cry or call or feebee or keeyer or cronk or snore, tug turf-tug worm-pull without naming fossick or mantle or cache or seedhammer, rufous brick-breast puff without naming strut or fan or capflash or flash-of-hawk, tailcock tail-cock flick without naming tumble or dihedral or softcrouch or plunge, long turdus Turdus migratorius brick-breast desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid or kettle or stoop or bind or keeyer or patagial or tower or buteo or feebee or gargle or hangup or cache or capflash or seedhammer or poecile; window-play leaves robin fly alone; Soot/Wedge/Heart/Hook/Dee own their tricks; guest slug Brick / key robin — accept "robin" and "brick"; do NOT name a trick robin or brick or hop or soar or mantle or breast or flick). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous migratorius / achrusterus / caurinus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop robin-tricks.js. Window-play unchanged. True American robin desk life — not chickadee/hawk/owl/crow/raven clones. Drake owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via robin.wav. Amplitudes raised toward Rui richness; denser waits/weights (TURDUS_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names robin/brick/hop/soar as bare ethogram-only trick kinds. Window-play unchanged. Drake now Rue-dense; Vee now Rue-dense; next leftover Drum / pileated. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "robin";
  const TRICKS = ["runstop", "listen", "carol", "tug", "rufous", "tailcock", "turdus"];
  const HAPPY = ["migratorius", "achrusterus", "caurinus"];
  const HAPPY_DUR = { migratorius: 1.58, achrusterus: 1.72, caurinus: 1.65 };
  const TURDUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    turdus: TURDUS_HOLD + RELEASE_S,
    runstop: 2.48,
    listen: 2.36,
    carol: 2.52,
    tug: 2.42,
    rufous: 2.34,
    tailcock: 2.46,
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
    if (kind === "turdus") return 40 + roll * 26;
    if (kind === "runstop" || kind === "listen" || kind === "carol" || kind === "tug" || kind === "rufous" || kind === "tailcock") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "turdus";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) => (k === "turdus" ? 0.72 : k === "runstop" || k === "carol" ? 1.28 : k === "listen" || k === "tailcock" ? 1.18 : 1.08));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "runstop";
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
    return key === TRICK_KEY || key === "brick";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "migratorius";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "achrusterus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function migratoriusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.migratorius));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 7.2, rot: s * 14.4, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
      return { lift: 7.2 + Math.abs(flash) * 6, rot: 14.4 + flash * 9.6, dx: flash * 2.64, anim: "sit" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function achrusterusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.achrusterus));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 16.8, rot: s * -14.4, dx: s * 3.6, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
      return { lift: 14.4 + Math.abs(wriggle) * 12, rot: -12 + wriggle * 16.8, dx: wriggle * 4.8, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" };
  }

  function caurinusPose(t) {
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
      next.kind === "migratorius"
        ? migratoriusPose(next.t)
        : next.kind === "achrusterus"
          ? achrusterusPose(next.t)
          : caurinusPose(next.t);
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
      kind === "turdus" || kind === "listen" || kind === "rufous"
        ? "sit"
        : kind === "runstop" || kind === "tug" || kind === "tailcock"
          ? "play"
          : kind === "carol"
            ? "talk"
            : "sit";
    return {
      kind: kind,
      phase: kind === "turdus" ? "hold" : "go",
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

  function turdusPose(t) {
    const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
    const soft = Math.abs(Math.sin(t * 0.9));
    return { lift: 2.4 + soft * 4.8 + Math.abs(breath) * 1.8, rot: -2.4 + breath * 4.8 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
  }

  function runstopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.runstop));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 9.6, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.10) / 0.78;
      const dash = Math.sin(s * Math.PI * 3.2);
      const plant = Math.abs(Math.sin(s * Math.PI * 6.4));
      return {
        x: fromX + face * (10 * s + dash * 7.2),
        lift: 4.8 + plant * 12 + Math.abs(dash) * 3.6,
        rot: (-12 + dash * 9.6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 10 * (1 - s), lift: 4.8 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function listenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.listen));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * -7.2, rot: s * 19.2 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const hush = Math.sin(t * 1.6) + 0.22 * Math.sin(t * 3.3);
      return {
        x: fromX + face * hush * 2.64,
        lift: -7.2 + Math.abs(hush) * 3.6,
        rot: (19.2 + hush * 6) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: -3.6 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" };
  }

  function carolPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.carol));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * 7.2, rot: s * 16.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.11) / 0.75;
      const phrase = Math.sin(s * Math.PI * 2.4);
      const settle = Math.abs(Math.sin(s * Math.PI * 4.8));
      return {
        x: fromX + face * (4 * s + phrase * 2.88),
        lift: 6 + settle * 4.8,
        rot: (16.8 + phrase * 7.2) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 4 * (1 - s), lift: 3.6 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" };
  }

  function tugPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tug));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -9.6, rot: s * 14.4 * face, anim: "play" };
    }
    if (u < 0.88) {
      const yank = Math.sin(t * 3.1) + 0.26 * Math.sin(t * 6.2);
      return {
        x: fromX + face * (-4.8 + yank * 6),
        lift: -9.6 + Math.abs(yank) * 12,
        rot: (14.4 + yank * 12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: -4.8 * (1 - s), rot: 3.6 * (1 - s) * face, anim: "idle" };
  }

  function rufousPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rufous));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 8.4, rot: s * -16.8 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const flash = Math.sin(t * 5.1) + 0.3 * Math.sin(t * 10.2);
      return {
        x: fromX + face * flash * 3.6,
        lift: 7.2 + Math.abs(flash) * 7.2,
        rot: (-16.8 + flash * 12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 3.6 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function tailcockPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tailcock));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 14.4, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.88) {
      const cock = Math.sin(t * 6.2) + 0.22 * Math.sin(t * 12.4);
      const dip = Math.abs(Math.sin(t * 3.1));
      return {
        x: fromX + face * cock * 3,
        lift: 4.8 + dip * 14.4 + Math.abs(cock) * 3.6,
        rot: (-12 + cock * 9.6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 4.8 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    const short =
      trick.kind === "runstop" ||
      trick.kind === "listen" ||
      trick.kind === "carol" ||
      trick.kind === "tug" ||
      trick.kind === "rufous" ||
      trick.kind === "tailcock";
    if (shouldAbort(flags) && !short) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "turdus") {
      if (next.t < TURDUS_HOLD) {
        const pose = turdusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TURDUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TURDUS_HOLD);
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
      runstop: runstopPose,
      listen: listenPose,
      carol: carolPose,
      tug: tugPose,
      rufous: rufousPose,
      tailcock: tailcockPose,
    }[next.kind];
    const pose = poseFn(next.t, from, trick.facing);
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
    TURDUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    turdusPose,
    releasePose,
    runstopPose,
    listenPose,
    carolPose,
    tugPose,
    rufousPose,
    tailcockPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    migratoriusPose,
    achrusterusPose,
    caurinusPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRobinTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
