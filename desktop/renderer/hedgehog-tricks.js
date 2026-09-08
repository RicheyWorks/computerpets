/** Burr ground tricks while idle — ultra-polish pass. House hedgehog — curl / snuffle / anoint / bristle / root / trundle / wheel personality (soft Atelerix desk life). Curl guarded pin-cushion hold without naming ball (window-play) or tuck (turtle) or loaf/nest; snuffle nose-down forage without naming dig or sniff-clone; anoint foam-and-spread without naming wash/preen; bristle quill lift without naming flare/puff; root litter shove without naming dig/steal; trundle slow rolling gait without naming waddle (penguin) or plod (turtle); wheel pet-hedgehog night-run without naming zoom/scurry/reel. Window-play BALL unchanged — never names a trick `ball`. Guest slug Burr / key hedgehog — accept "hedgehog" and "burr". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`hedgehog.wav`). Thank-yous snort / soft / grunt. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `hedgehog-tricks.ts`. True house-hedgehog desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/chinchilla/axolotl/toucan/iguana/dragon/Vesper clones. Bird ultra (Soot→Ember) + Miso/Pip/Thimble/Clip/Whee/Ink/Coin/Rue/Wick done; Echo/budgie + Peck/penguin + Quill/parrot skip birds; Keel/toucan skip if bird. Next guest ultra is Floss / chinchilla. No cry inventing — thank-yous silent desk motion only. Never retouch Rui sprites. */

(function (root) {
  const TRICK_KEY = "hedgehog";
  const TRICKS = ["curl", "snuffle", "anoint", "bristle", "root", "trundle", "wheel"];
  const HAPPY = ["snort", "soft", "grunt"];

  const HAPPY_DUR = {
    snort: 1.62,
    soft: 1.7,
    grunt: 1.66,
  };

  /** Curl hold — Burr becomes a guarded pin-cushion ball on the desk. Not window-play ball. Not a turtle tuck. Not a cat loaf. Not a hamster nest. */
  const CURL_HOLD = 13.6;
  const RELEASE_S = 0.95;

  const DUR = {
    curl: CURL_HOLD + RELEASE_S,
    snuffle: 1.88,
    anoint: 1.96,
    bristle: 1.78,
    root: 1.92,
    trundle: 2.08,
    wheel: 2.15,
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
    if (kind === "curl") return 40 + roll * 26;
    if (kind === "snuffle") return 11 + roll * 8;
    if (kind === "anoint" || kind === "bristle") return 11 + roll * 8;
    if (kind === "root" || kind === "trundle") return 10 + roll * 8;
    if (kind === "wheel") return 12 + roll * 9;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn == null) musicOn = false;
    if (musicOn) return "curl";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "curl" ? 0.55 : k === "snuffle" || k === "trundle" || k === "wheel" ? 1.15 : 1
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "curl";
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
    return key === TRICK_KEY || key === "burr";
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
    if (facing == null) facing = 1;
    const name = HAPPY.includes(kind) ? kind : "snort";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "snort" ? "talk" : name === "soft" ? "sit" : "play",
      facing,
      fromX: x,
    };
  }

  function snortPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.snort));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 4.2, rot: -s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      return {
        lift: 4.2 + Math.abs(Math.sin(t * 10)) * 3.2,
        rot: -12 + Math.sin(t * 12) * 10,
        dx: Math.sin(t * 8) * 1.6,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 4.2 * (1 - s), rot: -12 * (1 - s), dx: 0, anim: "sit" };
  }

  function softPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.soft));
    if (u < 0.88) {
      return {
        lift: Math.sin(u * Math.PI) * 3.4,
        rot: 22 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI * 2) * 7,
        dx: Math.sin(u * Math.PI) * 2.2,
        anim: "sit",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 3, dx: 0, anim: "idle" };
  }

  function gruntPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 9)) * 5.2,
      rot: Math.sin(t * 11) * 16,
      dx: Math.sin(t * 7) * 2.0,
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
    if (next.kind === "snort") {
      const pose = snortPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "soft") {
      const pose = softPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gruntPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  /** Burr has no Rui-style sleep-frame hold. */
  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    if (facing == null) facing = 1;
    const anim =
      kind === "curl"
        ? "sit"
        : kind === "snuffle"
          ? "walk"
          : kind === "anoint"
            ? "sit"
            : kind === "bristle"
              ? "sit"
              : kind === "root"
                ? "play"
                : kind === "trundle"
                  ? "walk"
                  : kind === "wheel"
                    ? "play"
                    : "sit";
    return {
      kind,
      phase: kind === "curl" ? "hold" : "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim,
      facing,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  /** Curl — guarded pin-cushion ball. Not window-play ball. Not a turtle tuck. Not a cat loaf. */
  function curlPose(t) {
    return {
      lift: 0.8 + Math.sin(t * 1.3) * 0.7 + Math.abs(Math.sin(t * 2.4)) * 0.5,
      rot: 28 + Math.sin(t * 1.6) * 5 + Math.sin(t * 2.8) * 3,
    };
  }

  /** Soft uncurl — nose peeks; quills ease. Not window-play leave. */
  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 28 * (1 - u) };
  }

  /** Snuffle — nose-down forage along the wood. Not a dog sniff. Not a rabbit dig. Not a ferret steal. Ethogram hedgehog true. */
  function snufflePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snuffle));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -s * 4.2, rot: s * 14 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.12) / 0.74;
      return {
        x: fromX + facing * (18 * smoothstep(s) + Math.sin(s * Math.PI * 4) * 4.5),
        lift: -4.2 + Math.abs(Math.sin(s * Math.PI * 5)) * 3.2,
        rot: facing * (14 + Math.sin(s * Math.PI * 6) * 11),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 18,
      lift: -4.2 * (1 - s),
      rot: facing * 7 * (1 - s),
      anim: "sit",
    };
  }

  /** Anoint — foam-and-spread self-anoint. Head turns; quills get the foam. Not a cat wash. Not a budgie preen. Not a parrot fan. Ethogram Atelerix true. */
  function anointPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.anoint));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.2, rot: -s * 28 * facing, anim: "sit" };
    }
    if (u < 0.45) {
      const s = (u - 0.14) / 0.31;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 2.4,
        lift: 3.2 + Math.sin(s * Math.PI * 2) * 2.2,
        rot: facing * (-28 + Math.sin(s * Math.PI * 3) * 14),
        anim: "sit",
      };
    }
    if (u < 0.86) {
      const s = (u - 0.45) / 0.41;
      return {
        x: fromX,
        lift: 2.4 + Math.abs(Math.sin(s * Math.PI * 4)) * 4.6,
        rot: facing * (18 + Math.sin(s * Math.PI * 5) * 26),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 2.4 * (1 - s),
      rot: facing * 9 * (1 - s),
      anim: "sit",
    };
  }

  /** Bristle — quills lift; guarded freeze-display. Not a fox stalk. Not a dog wait. Not a cat stretch. */
  function bristlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bristle));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 5.8, rot: -s * 16, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.18) / 0.6;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.6,
        lift: 5.8 + Math.sin(s * Math.PI * 2) * 1.8,
        rot: -16 + Math.sin(s * Math.PI * 3) * 9,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 5.8 * (1 - s),
      rot: -8 * (1 - s),
      anim: "sit",
    };
  }

  /** Root — litter-rooting shove with the snout. Not a rabbit dig. Not a hamster pocket. Not a ferret steal. Ethogram insectivore true. */
  function rootPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.root));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return {
        x: fromX,
        lift: -s * 3.6,
        rot: s * 18 * facing,
        anim: "sit",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const shove = Math.sin(s * Math.PI * 4.5);
      return {
        x: fromX + facing * (14 * smoothstep(s) + shove * 5.5),
        lift: -3.6 + Math.abs(shove) * 5.0,
        rot: facing * (18 + shove * 22),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 14,
      lift: -3.6 * (1 - s),
      rot: facing * 9 * (1 - s),
      anim: "sit",
    };
  }

  /** Trundle — slow rolling Atelerix gait with quill sway. Not a penguin waddle. Not a turtle plod. Not a fox trot. */
  function trundlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.trundle));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.2, rot: -s * 10 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const bob = Math.sin(s * Math.PI * 5);
      const sway = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + facing * (20 * smoothstep(s)),
        lift: 2.2 + Math.abs(bob) * 3.8,
        rot: facing * (-10 + sway * 16 + bob * 8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 20,
      lift: 2.2 * (1 - s),
      rot: facing * -5 * (1 - s),
      anim: "sit",
    };
  }

  /** Wheel — night-run on an imaginary exercise wheel. Not hamster reel. Not guinea zig. Not ferret romp. House-hedgehog true. */
  function wheelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wheel));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 5.5, rot: -s * 18, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const spin = Math.sin(s * Math.PI * 7);
      const hop = Math.abs(Math.sin(s * Math.PI * 5));
      return {
        x: fromX + facing * (Math.sin(s * Math.PI * 2) * 6),
        lift: 5.5 + hop * 12,
        rot: -18 + spin * 32 + facing * hop * 8,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 5.5 * (1 - s),
      rot: -9 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "snuffle" && trick.kind !== "root" && trick.kind !== "trundle") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "curl") {
      if (next.t < CURL_HOLD) {
        const pose = curlPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CURL_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CURL_HOLD);
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
    if (next.kind === "snuffle") {
      const pose = snufflePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "anoint") {
      const pose = anointPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bristle") {
      const pose = bristlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "root") {
      const pose = rootPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "trundle") {
      const pose = trundlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = wheelPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) {
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    return next;
  }

  const api = {
    TRICK_KEY, TRICKS, HAPPY, HAPPY_DUR, DUR, CURL_HOLD, RELEASE_S,
    canStart, shouldAbort, nextTrickWait, pickTrick, sleepHoldFrame, beginTrick,
    curlPose, releasePose, snufflePose, anointPose, bristlePose, rootPose, trundlePose, wheelPose, stepTrick,
    happyCanStart, happyShouldAbort, wantsThankYou, startThankYou, pickHappy, beginHappy,
    snortPose, softPose, gruntPose, stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHedgehogTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
