/** Slick ground tricks while idle. House neighborly Mustelidae / Lontra canadensis North American river otter ink-dish desk life — bellyglide / corkroll / shellcrunch / whiskernudge / lontra personality (bellyglide bank belly-glide without naming slide or slip or swim or dive or toboggan or porpoise or paddle or float or water or bank or mud or slick or otter, corkroll cork-barrel tumble without naming roll or spin or tumble or flip or twist or cartwheel or somersault or log or barrel, shellcrunch shell-crack meal without naming crunch or crack or chew or eat or feed or bite or smash or shell or clam or mussel or cray or jaw, whiskernudge vibrissa forage without naming whisker or hunt or forage or sniff or nose or probe or sweep or fossick or monocle or stalk or look, long lontra Lontra canadensis freeze-alert ink hold — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or nutbury or tailflick or cheekpouch or branchleap or sciurus or wingwrap or traguscup or thumbcrawl or duskhang or eptesicus or flagtail or edgebrowse or earswivel or forestamp or odocoileus or promenade or oil or dab or tip or drum or sip or hover; window-play RUN and Call Slick leave otter alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache own their tricks; guest slug Slick / key otter — accept "otter" and "slick" (roster slug slick; campaign Slick); do NOT name a trick otter or slick or weasel or mink or ferret or badger or marten or wolverine). Thank-yous riverden / floatbelly / inkraft. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web otter-tricks.ts. Window-play RUN unchanged. True North American river otter Mustelidae desk life — not squirrel/bat/deer/solifuge/fox/rabbit/rui/ferret clones. Wash owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "otter";
  const TRICKS = ["bellyglide", "corkroll", "shellcrunch", "whiskernudge", "lontra"];
  const HAPPY = ["riverden", "floatbelly", "inkraft"];
  const HAPPY_DUR = { riverden: 1.88, floatbelly: 2.02, inkraft: 1.94 };
  const LONTRA_HOLD = 20.08;
  const RELEASE_S = 1.38;
  const DUR = { lontra: LONTRA_HOLD + RELEASE_S, bellyglide: 2.82, corkroll: 2.76, shellcrunch: 2.98, whiskernudge: 2.90 };

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
      if (kind === "lontra") return 106 + roll * 20;
  if (kind === "bellyglide") return 18.0 + roll * 8.2;
  if (kind === "corkroll") return 19.2 + roll * 8.8;
  if (kind === "whiskernudge") return 20.6 + roll * 9.4;
  return justFinished ? 16.6 + roll * 7.8 : 10.6 + roll * 7.0;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "lontra";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "lontra") {
      if (roll < 0.26) return "bellyglide";
      if (roll < 0.5) return "corkroll";
      if (roll < 0.74) return "shellcrunch";
      return "whiskernudge";
    }
    if (lastKind === "bellyglide") {
      if (roll < 0.26) return "lontra";
      if (roll < 0.5) return "corkroll";
      if (roll < 0.74) return "shellcrunch";
      return "whiskernudge";
    }
    if (lastKind === "corkroll") {
      if (roll < 0.22) return "lontra";
      if (roll < 0.44) return "bellyglide";
      if (roll < 0.68) return "shellcrunch";
      return "whiskernudge";
    }
    if (roll < 0.2) return "lontra";
    if (roll < 0.4) return "bellyglide";
    if (roll < 0.6) return "corkroll";
    if (roll < 0.8) return "shellcrunch";
    return "whiskernudge";
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
    return key === TRICK_KEY || key === "slick";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "riverden";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "riverden" ? "sit" : name === "floatbelly" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function riverdenPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.riverden));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.020, rot: s * 2.20, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.0) + 0.14 * Math.sin(t * 8.0);
      return { lift: 0.020 + Math.abs(flash) * 0.012, rot: 2.20 + flash * 1.32, dx: flash * 0.00068, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.005 * (1 - s), rot: 0.28 * (1 - s), dx: 0, anim: "idle" };
  }
  function floatbellyPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.floatbelly));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.038, rot: s * -2.80, dx: s * 0.00148, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.0) + 0.16 * Math.sin(t * 6.0);
      return { lift: 0.038 + Math.abs(spring) * 0.016, rot: -2.80 + spring * 2.18, dx: spring * 0.00188, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.010 * (1 - s), rot: -0.36 * (1 - s), dx: 0, anim: "sit" };
  }
  function inkraftPose(t) {
    return { lift: 0.0082 + Math.abs(Math.sin(t * 0.160)) * 0.0130, rot: Math.sin(t * 0.160) * 1.08, dx: Math.sin(t * 0.120) * 0.00072, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "riverden") {
      const pose = riverdenPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "floatbelly") {
      const pose = floatbellyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = inkraftPose(next.t);
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
      kind === "lontra"
        ? "sit"
        : kind === "bellyglide"
          ? "play"
          : kind === "corkroll"
            ? "talk"
            : kind === "shellcrunch"
              ? "talk"
              : kind === "whiskernudge"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "lontra" ? "hold" : "go",
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


                      function lontraPose(t) {
    const breath = Math.sin(t * 0.048) + 0.034 * Math.sin(t * 0.142);
    const hush = Math.abs(Math.sin(t * 0.058));
    return { lift: 0.006 + hush * 0.008, rot: 0.28 + breath * 0.42 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0035 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.14 * (1 - u) };
  }

  function bellyglidePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bellyglide));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0024, lift: s * -0.030, rot: s * 4.6 * face, anim: "play" };
    }
    if (u < 0.86) {
      const glide = Math.sin((u - 0.10) / 0.76 * Math.PI * 3.2);
      const wet = Math.sin(t * 5.6) + 0.15 * Math.sin(t * 11.2);
      return { x: fromX + face * (0.0024 + glide * 0.0018 + wet * 0.00032), lift: -0.026 + Math.abs(glide) * 0.014 + Math.abs(wet) * 0.006, rot: (4.6 + glide * 2.4 + wet * 1.5) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0024 * (1 - s), lift: -0.006 * (1 - s), rot: 0.7 * (1 - s) * face, anim: "idle" };
  }
  function corkrollPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.corkroll));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0010, lift: s * 0.018, rot: s * -5.2 * face, anim: "play" };
    }
    if (u < 0.88) {
      const roll = Math.sin((u - 0.09) / 0.79 * Math.PI * 4.6);
      const spin = Math.sin(t * 7.2) + 0.17 * Math.sin(t * 14.4);
      return { x: fromX + face * (0.0010 + roll * 0.0013 + spin * 0.00028), lift: 0.012 + Math.abs(roll) * 0.016 + Math.abs(spin) * 0.006, rot: (-5.2 + roll * 4.8 + spin * 2.2) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0010 * (1 - s), lift: 0.003 * (1 - s), rot: -0.7 * (1 - s) * face, anim: "idle" };
  }
  function shellcrunchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.shellcrunch));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0012, lift: s * 0.008, rot: s * 3.4 * face, anim: "talk" };
    }
    if (u < 0.84) {
      const crunch = Math.sin((u - 0.12) / 0.72 * Math.PI * 3.6);
      const jaw = Math.sin(t * 6.2) + 0.16 * Math.sin(t * 12.4);
      return { x: fromX + face * (0.0012 + crunch * 0.0009 + jaw * 0.00026), lift: 0.006 + Math.abs(crunch) * 0.010 + Math.abs(jaw) * 0.005, rot: (3.4 + crunch * 2.2 + jaw * 1.6) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.002 * (1 - s), rot: 0.45 * (1 - s) * face, anim: "idle" };
  }
  function whiskernudgePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.whiskernudge));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0015, lift: s * 0.012, rot: s * 2.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const nudge = Math.sin((u - 0.11) / 0.75 * Math.PI * 4.0);
      const whisk = Math.sin(t * 8.0) + 0.18 * Math.sin(t * 16.0);
      return { x: fromX + face * (0.0015 + nudge * 0.0011 + whisk * 0.00030), lift: 0.010 + Math.abs(nudge) * 0.011 + Math.abs(whisk) * 0.005, rot: (2.8 + nudge * 2.6 + whisk * 1.8) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0015 * (1 - s), lift: 0.002 * (1 - s), rot: 0.4 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "bellyglide" && trick.kind !== "corkroll" && trick.kind !== "shellcrunch" && trick.kind !== "whiskernudge") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "lontra") {
      if (next.t < LONTRA_HOLD) {
        const pose = lontraPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONTRA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONTRA_HOLD);
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
    if (next.kind === "bellyglide") {
      const pose = bellyglidePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "corkroll") {
      const pose = corkrollPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "shellcrunch") {
      const pose = shellcrunchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = whiskernudgePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONTRA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    lontraPose,
    releasePose,
    bellyglidePose,
    corkrollPose,
    shellcrunchPose,
    whiskernudgePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    riverdenPose,
    floatbellyPose,
    inkraftPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOtterTricks = api;
})(typeof window !== "undefined" ? window : globalThis);