/** Chirp ground tricks while idle. House neighborly Gryllidae / Gryllus / Fall Field Cricket desk life — stridulate / antennasweep / hopskip / burrowmouth / gryllushush personality (stridulate tegmen wing-chirp cue without naming song or buzz or tymbal or cast or egress or harden or magicicada or cicada or brood or rasp or file or bow or music or call or cry, antennasweep long feeler sweep without naming antenna or feeler or sweep or scan or look or sense or touch or probe alone as wait, hopskip hop-skip bound without naming hop or skip or jump or vault or bound or leap or grasshopper or katydid or blade alone as wait, burrowmouth burrow-mouth fossick without naming fossick or dig or burrow or mouth or hole or nest or dens alone as wait, long gryllushush Gryllus field-cricket hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or uburrow or pumppulse or headdig or tailcast or arenicolahush or densheap or inkheap or densarenicola or tymbal or cast or egress or harden or magicicada or septendecim or cassini or cicadidae or raptorial or gimbal or snatch or pendulum or mantodea or spots or aphid or reflex or climb or coccinella or gallery or pheromone or crumb or bustle or camponotus or rocking or catalepsy or browse or tread or diapheromera or hawking or tandem or nymph or whir or anax or lantern or jstroke or semaphore or elytra or photinus or figure or corbicula or hex or proboscis or hive or buzz or sun or perch or shed or fold; window-play and Call Chirp leave field_cricket alone; Brood/Fold/Seven/Column/Twig/Dart/Spark/Comb/Relay/Heap/Knurl/Thorn/Token/Spire own their tricks; guest slug Chirp / key field_cricket — accept "field_cricket" and "chirp" (roster slug chirp; campaign Chirp); do NOT accept bare "chirp" as a trick id; do NOT confuse with Brood the Periodical Cicada (key cicada / slug brood); do NOT confuse with Blade the Northern True Katydid (key katydid — next seat); do NOT confuse with Vault the Differential Grasshopper; do NOT name a trick field_cricket or chirp or cicada or brood or katydid or blade or grasshopper or vault or honeybee or lugworm or heap. Thank-yous denschirp / inkchirp / densgryllus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web field_cricket-tricks.ts. Window-play unchanged. True Gryllus Fall Field Cricket desk life — tegmen stridulation cue, antenna sweep, hop-skip bound, burrow-mouth fossick, and long Gryllus hush; not Magicicada cicada Brood clones (tymbal/cast/egress), not Mantodea Fold, not Orthoptera katydid/grasshopper (later), not honeybee Comb — true Gryllidae field-cricket life. Next house-order guest after Chirp still lacking tricks owns the next seat (Blade / katydid). No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "field_cricket";
  const TRICKS = ["stridulate", "antennasweep", "hopskip", "burrowmouth", "gryllushush"];
  const HAPPY = ["denschirp", "inkchirp", "densgryllus"];
  const HAPPY_DUR = { denschirp: 2.42, inkchirp: 2.58, densgryllus: 2.36 };
  const GRYLLUSHUSH_HOLD = 23.60;
  const RELEASE_S = 2.05;
  const DUR = { gryllushush: GRYLLUSHUSH_HOLD + RELEASE_S, stridulate: 3.85, antennasweep: 3.72, hopskip: 3.55, burrowmouth: 3.98 };

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
    if (kind === "gryllushush") return 152 + roll * 12;
    if (kind === "stridulate") return 22.4 + roll * 3.8;
    if (kind === "antennasweep") return 21.8 + roll * 3.6;
    if (kind === "hopskip") return 20.6 + roll * 3.4;
    if (kind === "burrowmouth") return 21.2 + roll * 3.5;
    return justFinished ? 16.8 + roll * 2.6 : 12.6 + roll * 2.2;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "gryllushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "gryllushush") {
      if (roll < 0.26) return "stridulate";
      if (roll < 0.5) return "antennasweep";
      if (roll < 0.74) return "hopskip";
      return "burrowmouth";
    }
    if (lastKind === "stridulate") {
      if (roll < 0.26) return "gryllushush";
      if (roll < 0.5) return "antennasweep";
      if (roll < 0.74) return "hopskip";
      return "burrowmouth";
    }
    if (lastKind === "antennasweep") {
      if (roll < 0.22) return "gryllushush";
      if (roll < 0.44) return "stridulate";
      if (roll < 0.68) return "hopskip";
      return "burrowmouth";
    }
    if (roll < 0.2) return "gryllushush";
    if (roll < 0.4) return "stridulate";
    if (roll < 0.6) return "antennasweep";
    if (roll < 0.8) return "hopskip";
    return "burrowmouth";
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
    return key === TRICK_KEY || key === "chirp";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denschirp";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denschirp" ? "sit" : name === "inkchirp" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function denschirpPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denschirp));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0038, rot: s * 0.14, anim: "sit" };
    }
    if (u < 0.86) {
      const chirp = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.35);
      return { lift: -0.0038 + Math.abs(chirp) * 0.00125, rot: 0.14 + chirp * 0.11, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: -0.0038 * (1 - s), rot: 0.14 * (1 - s), anim: "idle" };
  }
  function inkchirpPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkchirp));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0042, rot: s * -0.32, anim: "play" };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.6);
      return { lift: 0.0042 + Math.abs(pulse) * 0.00155, rot: -0.32 + pulse * 0.24, anim: "play" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0042 * (1 - s), rot: -0.32 * (1 - s), anim: "idle" };
  }
  function densgryllusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgryllus));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0026, rot: s * 0.20, anim: "play" };
    }
    if (u < 0.82) {
      const wing = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.55);
      return { lift: 0.0026 + Math.abs(wing) * 0.00105, rot: 0.20 + wing * 0.15, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0026 * (1 - s), rot: 0.20 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denschirp") {
      const pose = denschirpPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkchirp") {
      const pose = inkchirpPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densgryllusPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "gryllushush";
    const anim =
      k === "gryllushush"
        ? "sit"
        : k === "stridulate"
          ? "play"
          : k === "antennasweep"
            ? "talk"
            : k === "hopskip"
              ? "play"
              : k === "burrowmouth"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "gryllushush" ? "hold" : "go",
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

  function gryllushushPose(t) {
    const breath = Math.sin(t * 0.00195) + 0.00082 * Math.sin(t * 0.0059);
    const hush = Math.abs(Math.sin(t * 0.00088));
    return { lift: -0.00048 + hush * 0.00012, rot: 0.016 + breath * 0.0048 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00044 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.016 * (1 - u) };
  }

  function stridulatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stridulate));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00015, lift: s * 0.0028, rot: s * 0.18 * face, anim: "play" };
    }
    if (u < 0.88) {
      const rasp = Math.sin((u - 0.10) / 0.78 * Math.PI * 9.6);
      const cue = Math.sin(t * 3.65) + 0.08 * Math.sin(t * 7.3);
      return {
        x: fromX + face * (0.00015 + rasp * 0.00032 + cue * 0.00006),
        lift: 0.0028 + Math.abs(rasp) * 0.0018 + Math.abs(cue) * 0.00055,
        rot: (0.18 + rasp * 0.42 + cue * 0.14) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00015 * (1 - s), lift: 0.0006 * (1 - s), rot: 0.025 * (1 - s) * face, anim: "idle" };
  }

  function antennasweepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennasweep));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00022, lift: s * 0.0036, rot: s * 0.32 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const sweep = Math.sin((u - 0.12) / 0.74 * Math.PI * 3.2);
      const feel = Math.sin(t * 1.55) + 0.055 * Math.sin(t * 3.1);
      return {
        x: fromX + face * (0.00022 + sweep * 0.00095 + feel * 0.00014),
        lift: 0.0036 + Math.abs(sweep) * 0.0016 + Math.abs(feel) * 0.0005,
        rot: (0.32 + sweep * 0.38 + feel * 0.12) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00022 * (1 - s), lift: 0.0036 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }

  function hopskipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hopskip));
    const face = facing == null ? 1 : facing;
    if (u < 0.08) {
      const s = smoothstep(u / 0.08);
      return { x: fromX + face * s * 0.0004, lift: s * 0.0012, rot: s * -0.12 * face, anim: "play" };
    }
    if (u < 0.42) {
      const hop = Math.sin((u - 0.08) / 0.34 * Math.PI);
      return {
        x: fromX + face * (0.0004 + (u - 0.08) / 0.34 * 0.0068),
        lift: 0.0012 + hop * 0.0115,
        rot: (-0.12 + hop * 0.55) * face,
        anim: "play",
      };
    }
    if (u < 0.55) {
      const land = smoothstep((u - 0.42) / 0.13);
      return {
        x: fromX + face * (0.0072 + land * 0.0008),
        lift: 0.0012 * (1 - land),
        rot: (0.18 - land * 0.28) * face,
        anim: "play",
      };
    }
    if (u < 0.88) {
      const skip = Math.sin((u - 0.55) / 0.33 * Math.PI);
      return {
        x: fromX + face * (0.0080 + (u - 0.55) / 0.33 * 0.0045),
        lift: skip * 0.0078,
        rot: (-0.08 + skip * 0.42) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0125 * (1 - s * 0.08), lift: 0.0004 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" };
  }

  function burrowmouthPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.burrowmouth));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00028, lift: s * -0.0048, rot: s * 0.28 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const fossick = Math.sin((u - 0.14) / 0.70 * Math.PI * 3.4);
      const mouth = Math.sin(t * 1.18) + 0.05 * Math.sin(t * 2.36);
      return {
        x: fromX + face * (0.00028 + fossick * 0.00085 + mouth * 0.00012),
        lift: -0.0048 + Math.abs(fossick) * 0.0022 + Math.abs(mouth) * 0.00055,
        rot: (0.28 + fossick * 0.24 + mouth * 0.10) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00028 * (1 - s), lift: -0.0048 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "stridulate" && trick.kind !== "antennasweep" && trick.kind !== "hopskip" && trick.kind !== "burrowmouth") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "gryllushush") {
      if (next.t < GRYLLUSHUSH_HOLD) {
        const pose = gryllushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < GRYLLUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - GRYLLUSHUSH_HOLD);
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
    if (next.kind === "stridulate") {
      const pose = stridulatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennasweep") {
      const pose = antennasweepPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hopskip") {
      const pose = hopskipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = burrowmouthPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    GRYLLUSHUSH_HOLD,
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
    denschirpPose,
    inkchirpPose,
    densgryllusPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    gryllushushPose,
    releasePose,
    stridulatePose,
    antennasweepPose,
    hopskipPose,
    burrowmouthPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFieldCricketTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);