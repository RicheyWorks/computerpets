/** Cache ground tricks while idle. House neighborly Sciuridae / Sciurus carolinensis eastern gray squirrel oak-stash desk life — nutbury / tailflick / cheekpouch / branchleap / sciurus personality (nutbury scatter-bury nut stash without naming bury or dig or cache or hide or nut or acorn or hoard or bury or plant or dig or scrape, tailflick caudal flick signal without naming flag or tail or wave or bob or tip or alarm or snort or flagtail, cheekpouch cheek-fill pocket without naming cheek or pouch or stuff or chew or eat or feed or browse or nibble or edgebrowse, branchleap desk-branch bound without naming leap or hop or jump or spring or dash or sprint or run or dart or fly or soar or glide, long sciurus Sciurus carolinensis freeze-alert oak hold — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or wingwrap or traguscup or thumbcrawl or duskhang or eptesicus or flagtail or edgebrowse or earswivel or forestamp or odocoileus or promenade or oil or dab or tip or drum or sip or hover; window-play RUN and Call Cache leave squirrel alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape own their tricks; guest slug Cache / key squirrel — accept "squirrel" and "cache" (roster slug cache; campaign Cache); do NOT name a trick squirrel or cache or chipmunk or marmot or prairie or flying or glider). Thank-yous oakstash / drey / scatterhoard. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web squirrel-tricks.ts. Window-play RUN unchanged. True eastern gray squirrel Sciuridae desk life — not bat/deer/solifuge/fox/rabbit/rui clones. Slick owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "squirrel";
  const TRICKS = ["nutbury", "tailflick", "cheekpouch", "branchleap", "sciurus"];
  const HAPPY = ["oakstash", "drey", "scatterhoard"];
  const HAPPY_DUR = { oakstash: 1.86, drey: 2.00, scatterhoard: 1.92 };
  const SCIURUS_HOLD = 20.04;
  const RELEASE_S = 1.36;
  const DUR = { sciurus: SCIURUS_HOLD + RELEASE_S, nutbury: 2.80, tailflick: 2.74, cheekpouch: 2.96, branchleap: 2.88 };

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
      if (kind === "sciurus") return 104 + roll * 22;
  if (kind === "nutbury") return 17.8 + roll * 8.4;
  if (kind === "tailflick") return 19.0 + roll * 9.0;
  if (kind === "branchleap") return 20.4 + roll * 9.6;
  return justFinished ? 16.4 + roll * 8.0 : 10.4 + roll * 7.2;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "sciurus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "sciurus") {
      if (roll < 0.26) return "nutbury";
      if (roll < 0.5) return "tailflick";
      if (roll < 0.74) return "cheekpouch";
      return "branchleap";
    }
    if (lastKind === "nutbury") {
      if (roll < 0.26) return "sciurus";
      if (roll < 0.5) return "tailflick";
      if (roll < 0.74) return "cheekpouch";
      return "branchleap";
    }
    if (lastKind === "tailflick") {
      if (roll < 0.22) return "sciurus";
      if (roll < 0.44) return "nutbury";
      if (roll < 0.68) return "cheekpouch";
      return "branchleap";
    }
    if (roll < 0.2) return "sciurus";
    if (roll < 0.4) return "nutbury";
    if (roll < 0.6) return "tailflick";
    if (roll < 0.8) return "cheekpouch";
    return "branchleap";
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
    return key === TRICK_KEY || key === "cache";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "oakstash";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "oakstash" ? "sit" : name === "drey" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function oakstashPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.oakstash));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.021, rot: s * 2.30, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.1) + 0.14 * Math.sin(t * 8.2);
      return { lift: 0.021 + Math.abs(flash) * 0.013, rot: 2.30 + flash * 1.38, dx: flash * 0.00071, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.005 * (1 - s), rot: 0.29 * (1 - s), dx: 0, anim: "idle" };
  }
  function dreyPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.drey));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.039, rot: s * -2.90, dx: s * 0.00155, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.1) + 0.16 * Math.sin(t * 6.2);
      return { lift: 0.039 + Math.abs(spring) * 0.017, rot: -2.90 + spring * 2.25, dx: spring * 0.00195, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.010 * (1 - s), rot: -0.37 * (1 - s), dx: 0, anim: "sit" };
  }
  function scatterhoardPose(t) {
    return { lift: 0.0085 + Math.abs(Math.sin(t * 0.165)) * 0.0135, rot: Math.sin(t * 0.165) * 1.12, dx: Math.sin(t * 0.125) * 0.00076, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "oakstash") {
      const pose = oakstashPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "drey") {
      const pose = dreyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = scatterhoardPose(next.t);
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
      kind === "sciurus"
        ? "sit"
        : kind === "nutbury"
          ? "play"
          : kind === "tailflick"
            ? "talk"
            : kind === "cheekpouch"
              ? "talk"
              : kind === "branchleap"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "sciurus" ? "hold" : "go",
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


                      function sciurusPose(t) {
    const breath = Math.sin(t * 0.050) + 0.035 * Math.sin(t * 0.148);
    const hush = Math.abs(Math.sin(t * 0.060));
    return { lift: 0.007 + hush * 0.007, rot: 0.30 + breath * 0.40 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0037 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.15 * (1 - u) };
  }

  function nutburyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nutbury));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0016, lift: s * -0.026, rot: s * 5.4 * face, anim: "play" };
    }
    if (u < 0.86) {
      const bury = Math.sin((u - 0.11) / 0.75 * Math.PI * 3.8);
      const scrape = Math.sin(t * 6.0) + 0.16 * Math.sin(t * 12.0);
      return { x: fromX + face * (0.0016 + bury * 0.0012 + scrape * 0.00030), lift: -0.022 + Math.abs(bury) * 0.016 + Math.abs(scrape) * 0.007, rot: (5.4 + bury * 2.8 + scrape * 1.6) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0016 * (1 - s), lift: -0.005 * (1 - s), rot: 0.8 * (1 - s) * face, anim: "idle" };
  }
  function tailflickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tailflick));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0007, lift: s * 0.016, rot: s * -4.2 * face, anim: "talk" };
    }
    if (u < 0.88) {
      const flick = Math.sin((u - 0.10) / 0.78 * Math.PI * 5.4);
      const tip = Math.sin(t * 8.6) + 0.18 * Math.sin(t * 17.2);
      return { x: fromX + face * (0.0007 + flick * 0.0009 + tip * 0.00026), lift: 0.014 + Math.abs(flick) * 0.012 + Math.abs(tip) * 0.005, rot: (-4.2 + flick * 3.6 + tip * 2.0) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0007 * (1 - s), lift: 0.003 * (1 - s), rot: -0.6 * (1 - s) * face, anim: "idle" };
  }
  function cheekpouchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cheekpouch));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0011, lift: s * 0.010, rot: s * 3.8 * face, anim: "talk" };
    }
    if (u < 0.84) {
      const pouch = Math.sin((u - 0.12) / 0.72 * Math.PI * 3.4);
      const chew = Math.sin(t * 5.4) + 0.15 * Math.sin(t * 10.8);
      return { x: fromX + face * (0.0011 + pouch * 0.0010 + chew * 0.00028), lift: 0.008 + Math.abs(pouch) * 0.011 + Math.abs(chew) * 0.005, rot: (3.8 + pouch * 2.4 + chew * 1.4) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0011 * (1 - s), lift: 0.002 * (1 - s), rot: 0.5 * (1 - s) * face, anim: "idle" };
  }
  function branchleapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.branchleap));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0020, lift: s * 0.044, rot: s * -3.2 * face, anim: "play" };
    }
    if (u < 0.55) {
      const leap = Math.sin((u - 0.09) / 0.46 * Math.PI * 2.6);
      const bound = Math.sin(t * 5.0) + 0.14 * Math.sin(t * 10.0);
      return { x: fromX + face * (0.0020 + leap * 0.0015 + bound * 0.00034), lift: 0.028 + Math.abs(leap) * 0.022 + Math.abs(bound) * 0.008, rot: (-3.2 + leap * 2.6 + bound * 1.5) * face, anim: "play" };
    }
    if (u < 0.88) {
      const settle = Math.sin((u - 0.55) / 0.33 * Math.PI);
      return { x: fromX + face * (0.0028 - settle * 0.0006), lift: 0.016 + Math.abs(settle) * 0.012, rot: (-0.9 + settle * 1.7) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0020 * (1 - s), lift: 0.004 * (1 - s), rot: -0.25 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "nutbury" && trick.kind !== "tailflick" && trick.kind !== "cheekpouch" && trick.kind !== "branchleap") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "sciurus") {
      if (next.t < SCIURUS_HOLD) {
        const pose = sciurusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SCIURUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SCIURUS_HOLD);
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
    if (next.kind === "nutbury") {
      const pose = nutburyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tailflick") {
      const pose = tailflickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cheekpouch") {
      const pose = cheekpouchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = branchleapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    SCIURUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    sciurusPose,
    releasePose,
    nutburyPose,
    tailflickPose,
    cheekpouchPose,
    branchleapPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    oakstashPose,
    dreyPose,
    scatterhoardPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSquirrelTricks = api;
})(typeof window !== "undefined" ? window : globalThis);