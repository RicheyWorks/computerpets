/** Whee ground tricks while idle — ultra-polish pass. House guinea pig — popcorn / rumble / hay / potato / zig / lookout / teeth personality (soft blotter guinea-pig life). Potato round-settle without naming loaf or wait or nest or flop or den or sprawl or curl; popcorn joy-bursts without naming binky or zoom or scurry; rumble desk-strut without naming wag or buzz; hay nose-forage without naming dig or cheek or nosh or nibble-trick; zig peppery dash without naming zoom or scurry; lookout bipedal stand-survey without naming periscope (rabbit) or beg; teeth soft chatter-buzz without naming talk-cmd or wheek (window-play) or chatter (Relay). Window-play WHEEK unchanged — never names wheek. Guest slug Whee / key guinea_pig — accept "guinea_pig" and "whee". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`guinea_pig.wav`). Thank-yous peep / nibble / toot. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `guinea-pig-tricks.ts`. True house-guinea-pig desk life — not Rui/cat/dog/rabbit/hamster/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble / Clip already done; Whee continues mammal ultra-polish. Next guest ultra is Ink / turtle. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. */
(function (root) {
  const TRICK_KEY = "guinea_pig";
  const TRICKS = ["popcorn", "rumble", "hay", "potato", "zig", "lookout", "teeth"];
  const HAPPY = ["peep", "nibble", "toot"];
  const HAPPY_DUR = { peep: 1.58, nibble: 1.66, toot: 1.72 };
  const POTATO_HOLD = 14.4;
  const RELEASE_S = 1.02;
  const DUR = {
    popcorn: 1.85,
    rumble: 2.1,
    hay: 2.12,
    potato: POTATO_HOLD + RELEASE_S,
    zig: 1.85,
    lookout: 2.1,
    teeth: 2.08,
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
    if (kind === "potato") return 42 + roll * 28;
    if (kind === "popcorn" || kind === "zig") return 12 + roll * 9;
    if (kind === "lookout" || kind === "teeth") return 11 + roll * 8;
    if (kind === "hay" || kind === "rumble") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "potato";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "potato" ? 0.55 : k === "hay" || k === "rumble" || k === "lookout" ? 1.15 : 1
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "hay";
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
    return key === TRICK_KEY || key === "whee";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "peep";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "peep" ? "talk" : name === "nibble" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function peepPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.peep));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 5.5, rot: s * 14, dx: 0, anim: "talk" };
    }
    if (u < 0.85) {
      const soft = Math.sin(t * 18);
      return { lift: 5.5 + Math.abs(soft) * 2.2, rot: 14 + soft * 8, dx: 0, anim: "talk" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 5.5 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "sit" };
  }

  function nibblePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nibble));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: -s * 4.5, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.85) {
      const buzz = Math.sin(t * 14) + 0.2 * Math.sin(t * 22);
      return { lift: -4.5 + Math.abs(buzz) * 3.2, rot: 12 + buzz * 7, dx: 0, anim: "sit" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: -4.5 * (1 - s), rot: 12 * (1 - s), dx: 0, anim: "sit" };
  }

  function tootPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.toot));
    return {
      lift: Math.sin(u * Math.PI) * 10,
      rot: Math.sin(u * Math.PI * 2) * 14,
      dx: Math.sin(u * Math.PI) * 5,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "peep") {
      const pose = peepPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nibble") {
      const pose = nibblePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tootPose(next.t);
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
    const name = TRICKS.indexOf(kind) >= 0 ? kind : "hay";
    const anim =
      name === "potato" || name === "hay" || name === "rumble" || name === "lookout" || name === "teeth"
        ? "sit"
        : name === "popcorn" || name === "zig"
          ? "play"
          : "sit";
    return {
      kind: name,
      phase: name === "potato" ? "hold" : "go",
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

  function potatoPose(t) {
    const soft = Math.sin(t * 1.7);
    const breath = Math.sin(t * 2.8);
    return {
      lift: -4.2 + soft * 1.5 + Math.abs(breath) * 1.0,
      rot: 14 + breath * 4 + Math.sin(t * 5.1) * 3,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return {
      lift: -4.2 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 6,
      rot: 14 * (1 - u) + Math.sin(u * Math.PI) * 8,
    };
  }

  function popcornPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.popcorn));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { lift: -s * 3, rot: s * 6, dx: 0, anim: "sit" };
    }
    if (u < 0.88) {
      const hops = Math.sin(((u - 0.12) / 0.76) * Math.PI * 3);
      return {
        lift: Math.abs(hops) * 18,
        rot: hops * 14,
        dx: Math.sin(((u - 0.12) / 0.76) * Math.PI * 2) * 4,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { lift: 3 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "sit" };
  }

  function rumblePose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.rumble));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { lift: -s * 3, rot: -s * 14, dx: s * 5, anim: "sit" };
    }
    if (u < 0.85) {
      return {
        lift: -3 + Math.abs(Math.sin(t * 7)) * 4,
        rot: -14 + Math.sin(t * 6) * 16,
        dx: 5 + Math.sin(t * 5) * 6,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { lift: -3 * (1 - s), rot: -14 * (1 - s), dx: 5 * (1 - s), anim: "sit" };
  }

  function hayPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.hay));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: -s * 6, rot: s * 16, dx: 0, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: -6 + Math.abs(Math.sin(t * 10)) * 3.5,
        rot: 16 + Math.sin(t * 9) * 8,
        dx: Math.sin(t * 7) * 2,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: -6 * (1 - s), rot: 16 * (1 - s), dx: 0, anim: "sit" };
  }

  function zigPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.zig));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: -s * 4, rot: s * 10, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.18) / 0.64;
      const wobble = Math.sin(s * Math.PI * 4);
      return {
        x: fromX + face * 26 * smoothstep(s) + wobble * 4,
        lift: Math.abs(Math.sin(s * Math.PI * 3)) * 10,
        rot: wobble * 16,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 26, lift: 3 * (1 - s), rot: 4 * (1 - s), anim: "sit" };
  }

  function lookoutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lookout));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 12, rot: s * -8 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const sway = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + face * sway * 2,
        lift: 12 + Math.abs(sway) * 3.5,
        rot: -8 * face + sway * 10,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: 12 * (1 - s), rot: -8 * face * (1 - s), anim: "sit" };
  }

  function teethPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.teeth));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -s * 3, rot: s * 10 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const buzz = Math.sin(t * 22) + 0.25 * Math.sin(t * 34);
      return {
        x: fromX + face * buzz * 1.5,
        lift: -5 + Math.abs(buzz) * 7,
        rot: 14 * face + buzz * 14,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: -3 * (1 - s), rot: 10 * face * (1 - s), anim: "sit" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "popcorn" && trick.kind !== "zig") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "potato") {
      if (next.t < POTATO_HOLD) {
        const pose = potatoPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < POTATO_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - POTATO_HOLD);
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
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    const face = trick.facing;
    if (next.kind === "popcorn") {
      const pose = popcornPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rumble") {
      const pose = rumblePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hay") {
      const pose = hayPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lookout") {
      const pose = lookoutPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "teeth") {
      const pose = teethPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = zigPose(next.t, fromX, face);
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
    DUR,
    POTATO_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    potatoPose,
    releasePose,
    popcornPose,
    rumblePose,
    hayPose,
    zigPose,
    lookoutPose,
    teethPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    peepPose,
    nibblePose,
    tootPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGuineaPigTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
