/** Bloom ground tricks while idle — ultra-polish pass. House axolotl — gill / amble / mend / smile / plume / sprout / glop personality (soft Ambystoma mexicanum desk life). Gill external-plume breathe hold without naming wall (window-play) or soak or drift; amble neotenic salamander walk without naming zoom/plod/dart; mend regenerate-adjacent settle without naming anoint/noodle; smile permanent soft face without naming gape/prance; plume bilateral gill sway play without naming preen/fan; sprout neotenic filament sprout-flare without naming puff/flash/frill; glop soft suction-feed mouth draw without naming gulp/bubble/nosh/dig. Window-play WALL unchanged — never names a trick `wall`. Window-play FLOAT (Nimbus) and BLOOM (yeast) stay untouched — never names `float` or `bloom`. Goldfish already owns drift/gulp/flare/glint/dart/yawn/forage and bubble/lip/swish. Turtle already owns soak/paddle. Rui already owns wave. Door window-play owns gape. Chinchilla already owns ash/bound/fluff/chin/sift/ricochet/gnaw. Hedgehog already owns curl/snuffle/anoint/bristle/root. Guest slug Bloom / key axolotl — accept "axolotl" and "bloom". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`axolotl.wav`). Thank-yous wink / blip / grin. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `axolotl-tricks.ts`. True house-axolotl desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/toucan/iguana/dragon/Vesper clones. Bird ultra (Soot→Ember) + Miso/Pip/Thimble/Clip/Whee/Ink/Coin/Rue/Wick/Burr/Floss done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan skip birds. Next guest ultra is Sol / iguana (skip Ember if bird). No cry inventing — thank-yous silent desk motion only. Never retouch Rui sprites. */

(function (root) {
  const TRICK_KEY = "axolotl";
  const TRICKS = ["gill", "amble", "mend", "smile", "plume", "sprout", "glop"];
  const HAPPY = ["wink", "blip", "grin"];

  const HAPPY_DUR = {
    wink: 1.62,
    blip: 1.7,
    grin: 1.66,
  };

  /** Gill hold — Bloom breathes with external plumes on the desk. Not window-play WALL. Not a goldfish drift. Not a turtle soak. Not a cat loaf. */
  const GILL_HOLD = 13.6;
  const RELEASE_S = 0.95;

  const DUR = {
    gill: GILL_HOLD + RELEASE_S,
    amble: 1.88,
    mend: 1.96,
    smile: 1.78,
    plume: 1.92,
    sprout: 2.08,
    glop: 2.15,
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
    if (kind === "gill") return 40 + roll * 26;
    if (kind === "amble") return 11 + roll * 8;
    if (kind === "mend" || kind === "smile") return 11 + roll * 8;
    if (kind === "plume" || kind === "glop") return 10 + roll * 8;
    if (kind === "sprout") return 12 + roll * 9;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn == null) musicOn = false;
    if (musicOn) return "gill";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "gill" ? 0.55 : k === "amble" || k === "sprout" || k === "plume" ? 1.15 : 1
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "gill";
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
    return key === TRICK_KEY || key === "bloom";
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
    const name = HAPPY.includes(kind) ? kind : "wink";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "wink" ? "sit" : name === "blip" ? "talk" : "play",
      facing,
      fromX: x,
    };
  }

  function winkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.wink));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 4.2, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      return {
        lift: 4.2 + Math.sin(t * 7) * 2.2,
        rot: 12 + Math.sin(t * 9) * 10,
        dx: Math.sin(t * 6) * 1.2,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 4.2 * (1 - s), rot: 12 * (1 - s), dx: 0, anim: "idle" };
  }

  function blipPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blip));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 5.5, rot: -s * 14, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      return {
        lift: 5.5 + Math.abs(Math.sin(t * 10)) * 3.4,
        rot: -14 + Math.sin(t * 12) * 12,
        dx: Math.sin(t * 8) * 1.6,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 5.5 * (1 - s), rot: -14 * (1 - s), dx: 0, anim: "sit" };
  }

  function grinPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 8)) * 5.8 + 1.4,
      rot: Math.sin(t * 10) * 18,
      dx: Math.sin(t * 7) * 2.2,
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
    if (next.kind === "wink") {
      const pose = winkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "blip") {
      const pose = blipPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = grinPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  /** Bloom has no Rui-style sleep-frame hold. */
  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    if (facing == null) facing = 1;
    const anim =
      kind === "gill"
        ? "sit"
        : kind === "amble"
          ? "walk"
          : kind === "mend"
            ? "sit"
            : kind === "smile"
              ? "sit"
              : kind === "plume"
                ? "play"
                : kind === "sprout"
                  ? "play"
                  : kind === "glop"
                    ? "sit"
                    : "sit";
    return {
      kind,
      phase: kind === "gill" ? "hold" : "go",
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

  /** Gill — external plume breathe on the wood. Not window-play WALL. Not a goldfish drift. Not a turtle soak. Ethogram Ambystoma mexicanum true. */
  function gillPose(t) {
    return {
      lift: 2.4 + Math.sin(t * 1.9) * 3.2 + Math.abs(Math.sin(t * 3.6)) * 1.8,
      rot: 22 + Math.sin(t * 2.6) * 28 + Math.sin(t * 4.8) * 16,
    };
  }

  /** Soft settle — plumes still; Bloom stays on the desk. Not window-play leave. */
  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (2.4 + 3.2) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 22 * (1 - u) };
  }

  /** Amble — neotenic salamander walk across the grain. Not a dog zoom. Not a turtle plod. Not a goldfish dart. Not window-play WALL walk. Ethogram walking true. */
  function amblePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.amble));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 2.2, rot: -s * 12 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const step = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * (22 * smoothstep(s) + Math.sin(s * Math.PI * 2) * 2.4),
        lift: 2.2 + Math.abs(step) * 9.5,
        rot: facing * (-12 + step * 22),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 22,
      lift: 2.2 * (1 - s),
      rot: facing * -6 * (1 - s),
      anim: "sit",
    };
  }

  /** Mend — regenerate-adjacent settle; desk life heals slow. Not a ferret noodle. Not a hedgehog anoint. Not a rabbit groom. Ethogram regeneration true. */
  function mendPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mend));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: -s * 4.0, rot: s * 16 * facing, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 2.4,
        lift: -4.0 + Math.sin(s * Math.PI * 2) * 5.5,
        rot: facing * (16 + Math.sin(s * Math.PI * 2.5) * 14),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: (-4.0 + 5.5) * (1 - s) * 0.25,
      rot: facing * 8 * (1 - s),
      anim: "sit",
    };
  }

  /** Smile — permanent soft face on the desk. Not a fox prance. Not a parrot flash. Not Door window-play gape. Ethogram face true. */
  function smilePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.smile));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4.8, rot: s * 10 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.6,
        lift: 4.8 + Math.sin(s * Math.PI * 1.8) * 2.6,
        rot: facing * (10 + Math.sin(s * Math.PI * 2.2) * 12),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 4.8 * (1 - s),
      rot: facing * 5 * (1 - s),
      anim: "sit",
    };
  }

  /** Plume — bilateral gill sway as play. Not a budgie preen. Not a parrot fan. Not window-play WALL. Ethogram gill plume true. */
  function plumePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.plume));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return {
        x: fromX,
        lift: s * 3.8,
        rot: -s * 18 * facing,
        anim: "sit",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const sway = Math.sin(s * Math.PI * 5.5);
      return {
        x: fromX + facing * sway * 4.2,
        lift: 3.8 + Math.abs(sway) * 4.6,
        rot: facing * (-18 + sway * 36),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 3.8 * (1 - s),
      rot: facing * -9 * (1 - s),
      anim: "sit",
    };
  }

  /** Sprout — neotenic filament sprout-flare on the desk. Not puff/flash/frill guests. Not plume sway. Ethogram sprout_soft. */
  function sproutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sprout));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.2, rot: -s * 14 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const bloom = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * bloom * 2.8,
        lift: 3.2 + Math.abs(bloom) * 10.5,
        rot: facing * (-14 + bloom * 28),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 3.2 * (1 - s),
      rot: facing * -7 * (1 - s),
      anim: "sit",
    };
  }

  /** Glop — soft suction-feed mouth draw on desk grain. Not goldfish gulp/forage. Not rabbit nosh. Not dig. Ethogram glop_soft. */
  function glopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.glop));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: -s * 4.6, rot: s * 18 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      const suck = Math.sin(s * Math.PI * 5);
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.8,
        lift: -4.6 + Math.abs(suck) * 5.2,
        rot: facing * (18 + suck * 24),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: -4.6 * (1 - s),
      rot: facing * 9 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "amble" && trick.kind !== "plume" && trick.kind !== "sprout") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "gill") {
      if (next.t < GILL_HOLD) {
        const pose = gillPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < GILL_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - GILL_HOLD);
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
    if (next.kind === "amble") {
      const pose = amblePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mend") {
      const pose = mendPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "smile") {
      const pose = smilePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "plume") {
      const pose = plumePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sprout") {
      const pose = sproutPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = glopPose(next.t, fromX, trick.facing);
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
    TRICK_KEY, TRICKS, HAPPY, HAPPY_DUR, DUR, GILL_HOLD, RELEASE_S,
    canStart, shouldAbort, nextTrickWait, pickTrick, sleepHoldFrame, beginTrick,
    gillPose, releasePose, amblePose, mendPose, smilePose, plumePose, sproutPose, glopPose, stepTrick,
    happyCanStart, happyShouldAbort, wantsThankYou, startThankYou, pickHappy, beginHappy,
    winkPose, blipPose, grinPose, stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAxolotlTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
