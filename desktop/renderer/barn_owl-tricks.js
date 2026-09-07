/** Heart ground tricks while idle. House neighborly Tytonidae barn owl desk life — diskturn / softcrouch / parallax / snore / tytonid personality (diskturn heart-face facial-disk acoustic turn without naming swivel or hiss or hoot or gaze or cock or look or peer or hop or walk or strut or fan, softcrouch silent hunt crouch without naming stoop or dive or soar or hunt or crouch-cry or cache or probe or dig or peck or bill, parallax triangulation sway without naming bob or sway or nod or bobble or sidle or hopwalk or monocle, snore snore-threat posture without naming hiss or hoot or scream or croak or caw or vocal or cronk, long tytonid Tytonidae metabolic perch on the beam hollow — never named wait or wake or still or hide or cover or hiss or hoot or croak or caw or cache or hop or walk or strut or fan or preen or probe or dig or peck or bill or roost or berry or juggle or peer or skip or quote or crack or flash or sidle or bobble or mimic or dangle or huddle or toboggan or waddle or porpoise or trumpet or hopwalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or spiggin or zigzag or spinous or fanning or gasterosteid or acetabulum or prostomium or looping or undulatory or hirudinean or lantern or jstroke or semaphore or elytra or photinus or plumose or lunule or silk or stream or actias; window-play HISS owns hiss; Budgie owns preen/sidle/bobble/mimic/dangle; Parrot owns quote/strut/fan/crack/flash; Toucan owns roost/berry/juggle/peer/skip; Penguin owns huddle/toboggan/waddle/porpoise/trumpet; Soot owns hopwalk/monocle/fossick/anting/corvid; Wedge owns dihedral/billtap/tumble/cronk/hackles; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean; Ghost owns luna moth life; Spark owns firefly life; guest slug Heart / key barn_owl only for isKey matching — accept "barn_owl" and "heart"; do NOT name a trick "barn_owl" or "heart" or "hiss" or "hoot" or "swivel" or "preen" or "hop" or "probe" or "fan" or "strut" or "roost" or "hopwalk" or "monocle" or "fossick" or "anting" or "corvid" or "dihedral" or "billtap" or "tumble" or "cronk" or "hackles") — not Quill macaw life, not Echo budgie life, not Soot crow life, not Wedge raven life, not Prickle stickleback life, not Latch leech life, not Ghost luna, not Spark firefly. diskturn facial-disk on the blotter without naming swivel, softcrouch hunt-sit without naming stoop, parallax sway without naming bob, snore threat-posture without naming hiss, tytonid long Tyto alba metabolic perch on the beam hollow with furcata / javanica / guttata cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play HISS do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop barn_owl-tricks.js. Window-play HISS unchanged — never names hiss. True Tytonidae barn owl desk life only — distinct from Quill macaw, Echo budgie, Soot crow, Wedge raven, Prickle stickleback, Latch leech, Ghost luna, and Spark firefly. Hook owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "barn_owl";
  const TRICKS = ["diskturn", "softcrouch", "parallax", "snore", "tytonid"];
  const HAPPY = ["furcata", "javanica", "guttata"];
  const HAPPY_DUR = { furcata: 1.58, javanica: 1.72, guttata: 1.65 };
  const TYTONID_HOLD = 18.86;
  const RELEASE_S = 1.14;
  const DUR = { tytonid: TYTONID_HOLD + RELEASE_S, diskturn: 2.46, softcrouch: 2.38, parallax: 2.58, snore: 2.44 };

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
      if (kind === "tytonid") return 78 + roll * 44;
  if (kind === "diskturn") return 16.8 + roll * 12.6;
  if (kind === "softcrouch") return 17.4 + roll * 13.0;
  if (kind === "snore") return 20.2 + roll * 14.2;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tytonid";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tytonid") {
      if (roll < 0.26) return "diskturn";
      if (roll < 0.5) return "softcrouch";
      if (roll < 0.74) return "parallax";
      return "snore";
    }
    if (lastKind === "diskturn") {
      if (roll < 0.26) return "tytonid";
      if (roll < 0.5) return "softcrouch";
      if (roll < 0.74) return "parallax";
      return "snore";
    }
    if (lastKind === "softcrouch") {
      if (roll < 0.22) return "tytonid";
      if (roll < 0.44) return "diskturn";
      if (roll < 0.68) return "parallax";
      return "snore";
    }
    if (roll < 0.2) return "tytonid";
    if (roll < 0.4) return "diskturn";
    if (roll < 0.6) return "softcrouch";
    if (roll < 0.8) return "parallax";
    return "snore";
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
    return key === TRICK_KEY || key === "heart";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "furcata";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "furcata" ? "sit" : name === "javanica" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function furcataPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.furcata));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.019, rot: s * 2.15, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
      return {
        lift: 0.019 + Math.abs(flash) * 0.014,
        rot: 2.15 + flash * 1.55,
        dx: flash * 0.0010,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.008 * (1 - s), rot: 0.55 * (1 - s), dx: 0, anim: "idle" };
  }
  function javanicaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.javanica));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.028, rot: s * -2.05, dx: s * 0.0014, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
      return {
        lift: 0.028 + Math.abs(wriggle) * 0.020,
        rot: -2.05 + wriggle * 2.55,
        dx: wriggle * 0.0022,
        anim: "play",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.010 * (1 - s), rot: -0.38 * (1 - s), dx: 0, anim: "sit" };
  }
  function guttataPose(t) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.29)) * 0.015,
      rot: Math.sin(t * 0.29) * 1.25,
      dx: Math.sin(t * 0.24) * 0.0011,
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
    if (next.kind === "furcata") {
      const pose = furcataPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "javanica") {
      const pose = javanicaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = guttataPose(next.t);
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
      kind === "tytonid"
        ? "sit"
        : kind === "diskturn"
          ? "sit"
          : kind === "softcrouch"
            ? "sit"
            : kind === "parallax"
              ? "play"
              : kind === "snore"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "tytonid" ? "hold" : "go",
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


                      function tytonidPose(t) {
    const breath = Math.sin(t * 0.10) + 0.08 * Math.sin(t * 0.27);
    const soft = Math.abs(Math.sin(t * 0.13));
    return {
      lift: 0.005 + soft * 0.014,
      rot: 0.55 + breath * 0.68,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.22 * (1 - u) };
  }

  function diskturnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.diskturn));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      // facial disk settles into an acoustic turn
      return { x: fromX, lift: s * 0.022, rot: s * 8.4 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.11) / 0.75;
      // heart-face disk tracks a soft sound without naming swivel
      const scan = Math.sin(s * Math.PI * 1.35);
      const settle = Math.abs(Math.sin(s * Math.PI * 2.1));
      return {
        x: fromX + face * (0.006 * s + scan * 0.003),
        lift: 0.018 + settle * 0.012,
        rot: (8.4 + scan * 4.6) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + face * 0.006 * (1 - s),
      lift: 0.010 * (1 - s),
      rot: 1.6 * (1 - s) * face,
      anim: "idle",
    };
  }
  function softcrouchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.softcrouch));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      // silent hunt crouch settles low
      return { x: fromX, lift: s * -0.018, rot: s * -1.15 * face, anim: "sit" };
    }
    if (u < 0.80) {
      const hush = Math.sin(t * 2.2) + 0.18 * Math.sin(t * 5.1);
      return {
        x: fromX + face * hush * 0.002,
        lift: -0.018 + Math.abs(hush) * 0.006,
        rot: (-1.15 + hush * 0.55) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.80) / 0.20);
    return {
      x: fromX,
      lift: -0.008 * (1 - s),
      rot: -0.35 * (1 - s) * face,
      anim: "idle",
    };
  }
  function parallaxPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.parallax));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // triangulation sway coils onto the blotter
      return { x: fromX, lift: s * 0.024, rot: s * -2.65 * face, anim: "play" };
    }
    if (u < 0.86) {
      const swing = Math.sin(t * 3.5) + 0.30 * Math.sin(t * 7.0);
      return {
        x: fromX + face * swing * 0.016,
        lift: 0.020 + Math.abs(swing) * 0.018,
        rot: (-1.25 + swing * 3.4) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 0.008 * (1 - s), rot: -0.35 * (1 - s) * face, anim: "idle" };
  }
  function snorePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snore));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.014, rot: s * -1.55 * face, anim: "talk" };
    }
    if (u < 0.88) {
      // snore-threat throat pulse without naming hiss
      const pulse = Math.sin(t * 2.8) + 0.24 * Math.sin(t * 5.6);
      return {
        x: fromX + face * pulse * 0.0025,
        lift: 0.012 + Math.abs(pulse) * 0.010,
        rot: (-1.55 + pulse * 1.05) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.005 * (1 - s), rot: -0.28 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "diskturn" && trick.kind !== "softcrouch" && trick.kind !== "parallax" && trick.kind !== "snore") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "tytonid") {
      if (next.t < TYTONID_HOLD) {
        const pose = tytonidPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TYTONID_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TYTONID_HOLD);
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
    if (next.kind === "diskturn") {
      const pose = diskturnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "softcrouch") {
      const pose = softcrouchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "parallax") {
      const pose = parallaxPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = snorePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    TYTONID_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    tytonidPose,
    releasePose,
    diskturnPose,
    softcrouchPose,
    parallaxPose,
    snorePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    furcataPose,
    javanicaPose,
    guttataPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBarnOwlTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
