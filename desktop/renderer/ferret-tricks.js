/** Wick ground tricks while idle — ultra-polish pass. House ferret — tube / romp / steal / puff / noodle / corkscrew / slink personality (soft Mustela desk life). Tube sock-tunnel hold without naming nest or den or loaf or potato or soak; romp war-bounce play without naming zoom or binky or popcorn; steal sock-thief dash without naming dig or cache or stash (fox); puff bottlebrush scare without naming flare (goldfish) or frill; noodle long-body weave without naming twist or spiral (taken); corkscrew weasel-war-dance spin without naming dance (Rui) or tumble; slink low weasel-belly creep without naming sneak-clone of dog or stalk (fox). Window-play THREAD unchanged — never names a trick `thread`. Guest slug Wick / key ferret — accept "ferret" and "wick". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`ferret.wav`). Thank-yous dook / kiss / chuckle. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `ferret-tricks.ts`. True house-ferret desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble / Clip / Whee / Ink / Coin / Rue already done; Echo/budgie + Peck/penguin + Quill/parrot skip (birds). Wick continues house-order ultra-polish. Next guest ultra is Burr / hedgehog. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites.  ferret.wav EXISTS so prefersHouseCry adds ferret. Amplitudes raised toward Rui richness; denser waits/weights (TUBE_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */
(function (root) {
  const TRICK_KEY = "ferret";
  const TRICKS = ["tube", "romp", "steal", "puff", "noodle", "corkscrew", "slink"];
  const HAPPY = ["dook", "kiss", "chuckle"];
  const HAPPY_DUR = { dook: 1.72, kiss: 1.58, chuckle: 1.66 };
  const TUBE_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    tube: TUBE_HOLD + RELEASE_S,
    romp: 1.88,
    steal: 1.95,
    puff: 1.85,
    noodle: 1.92,
    corkscrew: 2.05,
    slink: 2.12,
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
    if (kind === "tube") return 40 + roll * 26;
    if (kind === "romp" || kind === "corkscrew" || kind === "slink") return 12.8 + roll * 9.4;
    if (kind === "steal" || kind === "puff" || kind === "noodle") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tube";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "tube" ? 0.72 : k === "romp" || k === "corkscrew" || k === "slink" ? 1.28 : k === "steal" || k === "puff" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "tube";
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
    return key === TRICK_KEY || key === "wick";
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
    const name = HAPPY.includes(kind) ? kind : "dook";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "dook" ? "talk" : name === "kiss" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function dookPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dook));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 10.2, rot: -s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
      return {
        lift: 10.2 + Math.abs(Math.sin(t * 11)) * 4.6,
        rot: -12 + Math.sin(t * 14) * 9.6,
        dx: Math.sin(t * 10) * 1.9,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 10.2 * (1 - s), rot: -12 * (1 - s), dx: 0, anim: "sit" };
  }

  function kissPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.kiss));
    if (u < 0.86) {
      return {
        lift: Math.sin(u * Math.PI) * 6.6,
        rot: Math.sin(u * Math.PI * 4) * 12,
        dx: Math.sin(u * Math.PI * 2) * 2.9,
        anim: "sit",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.86) / 0.14) * Math.PI) * 3.6, dx: 0, anim: "idle" };
  }

  function chucklePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chuckle));
    return {
      lift: Math.abs(Math.sin(t * 11)) * 7.0,
      rot: Math.sin(t * 13) * 16.8,
      dx: Math.sin(t * 8) * 2.6,
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
    if (next.kind === "dook") {
      const pose = dookPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "kiss") {
      const pose = kissPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = chucklePose(next.t);
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
      kind === "tube"
        ? "sit"
        : kind === "romp" || kind === "noodle" || kind === "corkscrew"
          ? "play"
          : kind === "steal" || kind === "slink"
            ? "walk"
            : kind === "puff"
              ? "sit"
              : "sit";
    return {
      kind,
      phase: kind === "tube" ? "hold" : "go",
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

  function tubePose(t) {
    const soft = Math.sin(t * 1.7);
    const breath = Math.sin(t * 2.8);
    return {
      lift: -5.0 + soft * 1.8 + Math.abs(breath) * 1.2,
      rot: 19.2 + breath * 7.2 + Math.sin(t * 5.1) * 4.8,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return {
      lift: -5.0 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 7.2,
      rot: 19.2 * (1 - u),
    };
  }

  function rompPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.romp));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 6, rot: -s * 21.6, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const hop = Math.sin(s * Math.PI * 5.5);
      const side = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + facing * (16 * smoothstep(s) + side * 6),
        lift: 6 + Math.abs(hop) * 14.4,
        rot: -21.6 + hop * 31.2 + side * 14.4,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 16,
      lift: 6 * (1 - s),
      rot: -12 * (1 - s),
      anim: "sit",
    };
  }

  function stealPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.steal));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -s * 4.2, rot: s * 9.6 * facing, anim: "sit" };
    }
    if (u < 0.5) {
      const s = smoothstep((u - 0.12) / 0.38);
      return {
        x: fromX + facing * 12 * s,
        lift: -4.2 + Math.abs(Math.sin(s * Math.PI * 3)) * 4.8,
        rot: facing * (9.6 + Math.sin(s * Math.PI * 4) * 8.4),
        anim: "walk",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.5) / 0.38;
      const dash = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + facing * (12 + 18 * smoothstep(s)),
        lift: 3.6 + Math.abs(dash) * 7.2,
        rot: facing * (7.2 + dash * 16.8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 30,
      lift: 3.6 * (1 - s),
      rot: facing * 4.8 * (1 - s),
      anim: "sit",
    };
  }

  function puffPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.puff));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 5.4, rot: s * 19.2 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.16) / 0.62;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 2.5,
        lift: 5.4 + Math.sin(s * Math.PI) * 4.2,
        rot: facing * (19.2 + Math.sin(s * Math.PI * 3) * 14.4),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 5.4 * (1 - s),
      rot: facing * 9.6 * (1 - s),
      anim: "sit",
    };
  }

  function noodlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.noodle));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return {
        x: fromX,
        lift: s * 4.2,
        rot: -s * 31.2,
        anim: "play",
      };
    }
    if (u < 0.86) {
      return {
        x: fromX + facing * Math.sin(t * 7) * 5.5,
        lift: 4.2 + Math.abs(Math.sin(t * 9)) * 6.6,
        rot: -31.2 + Math.sin(t * 8) * 38.4,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 4.2 * (1 - s),
      rot: -31.2 * (1 - s),
      anim: "sit",
    };
  }

  function corkscrewPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.corkscrew));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 7.2, rot: -s * 24 * facing, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const spin = Math.sin(s * Math.PI * 6);
      const hop = Math.abs(Math.sin(s * Math.PI * 4));
      return {
        x: fromX + facing * (Math.sin(s * Math.PI * 3) * 8),
        lift: 7.2 + hop * 16.8,
        rot: facing * (-24 + spin * 43.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 7.2 * (1 - s),
      rot: facing * -12 * (1 - s),
      anim: "sit",
    };
  }

  function slinkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.slink));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: -s * 6.6, rot: s * 12 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      const creep = Math.sin(s * Math.PI * 5);
      return {
        x: fromX + facing * (22 * smoothstep(s)),
        lift: -6.6 + Math.abs(creep) * 3.4,
        rot: facing * (12 + creep * 9.6),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 22,
      lift: -6.6 * (1 - s),
      rot: facing * 7.2 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "romp" && trick.kind !== "steal" && trick.kind !== "corkscrew") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "tube") {
      if (next.t < TUBE_HOLD) {
        const pose = tubePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TUBE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TUBE_HOLD);
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
    if (next.kind === "romp") {
      const pose = rompPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "steal") {
      const pose = stealPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "puff") {
      const pose = puffPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "noodle") {
      const pose = noodlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "corkscrew") {
      const pose = corkscrewPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = slinkPose(next.t, fromX, trick.facing);
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
    DUR,
    TUBE_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    tubePose,
    releasePose,
    rompPose,
    stealPose,
    puffPose,
    noodlePose,
    corkscrewPose,
    slinkPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    dookPose,
    kissPose,
    chucklePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFerretTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
