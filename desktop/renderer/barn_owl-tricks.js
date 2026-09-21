/** Heart ground tricks while idle — ultra-polish pass. House neighborly Tytonidae barn owl desk life — diskturn / softcrouch / parallax / snore / twist / pellet / tytonid personality (diskturn heart-face facial-disk acoustic turn without naming swivel or hiss or hoot or gaze or cock or look or peer or hop or walk or strut or fan, softcrouch silent hunt crouch without naming stoop or dive or soar or hunt or crouch-cry or cache or probe or dig or peck or bill, parallax triangulation sway without naming bob or sway or nod or bobble or sidle or hopwalk or monocle, snore snore-threat posture without naming hiss or hoot or scream or croak or caw or vocal or cronk, twist cervical extreme turn without naming swivel or gaze or cock or look or peer, pellet cast-gesture without naming cough or regurg or eat or cache or probe or dig or peck or bill, long tytonid Tytonidae metabolic perch on the beam hollow — never named wait or wake or still or hide or cover or hiss or hoot or croak or caw or cache or hop or walk or strut or fan or preen or probe or dig or peck or bill or roost or berry or juggle or peer or skip or quote or crack or flash or sidle or bobble or mimic or dangle or huddle or toboggan or waddle or porpoise or trumpet or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or spiggin or zigzag or spinous or fanning or gasterosteid or acetabulum or prostomium or looping or undulatory or hirudinean or lantern or jstroke or semaphore or elytra or photinus or plumose or lunule or silk or stream or actias; window-play HISS owns hiss; Budgie owns preen/sidle/bobble/mimic/dangle; Parrot owns quote/strut/fan/crack/flash; Toucan owns roost/berry/juggle/peer/skip; Penguin owns huddle/toboggan/waddle/porpoise/trumpet; Soot owns hopwalk/monocle/fossick/anting/scrutinize/glean/corvid; Wedge owns dihedral/billtap/tumble/cronk/invite/toeing/hackles; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid/nuptial/pelvic; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean/botryoidal/auricle; Ghost owns luna moth life; Spark owns firefly life; guest slug Heart / key barn_owl only for isKey matching — accept "barn_owl" and "heart"; do NOT name a trick "barn_owl" or "heart" or "hiss" or "hoot" or "swivel" or "preen" or "hop" or "probe" or "fan" or "strut" or "roost" or "hopwalk" or "monocle" or "fossick" or "anting" or "scrutinize" or "glean" or "corvid" or "dihedral" or "billtap" or "tumble" or "cronk" or "invite" or "toeing" or "hackles") — not Quill macaw life, not Echo budgie life, not Soot crow life, not Wedge raven life, not Prickle stickleback life, not Latch leech life, not Ghost luna, not Spark firefly. Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. diskturn facial-disk on the blotter without naming swivel, softcrouch hunt-sit without naming stoop, parallax sway without naming bob, snore threat-posture without naming hiss, twist cervical turn without naming swivel, pellet cast without naming cough, tytonid long Tyto alba metabolic perch on the beam hollow with furcata / javanica / guttata cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play HISS do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop barn_owl-tricks.js. Window-play HISS unchanged — never names hiss. True Tytonidae barn owl desk life only — distinct from Quill macaw, Echo budgie, Soot crow, Wedge raven, Prickle stickleback, Latch leech, Ghost luna, and Spark firefly. Dee owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via barn_owl.wav. Amplitudes raised toward Rui richness; denser waits/weights (TYTONID_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names barn_owl/heart/hiss/hoot/swivel as bare ethogram-only trick kinds. Window-play HISS unchanged. Next leftover Hook / red_tail. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "barn_owl";
  const TRICKS = ["diskturn", "softcrouch", "parallax", "snore", "twist", "pellet", "tytonid"];
  const HAPPY = ["furcata", "javanica", "guttata"];
  const HAPPY_DUR = { furcata: 1.58, javanica: 1.72, guttata: 1.65 };
  const TYTONID_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    tytonid: TYTONID_HOLD + RELEASE_S,
    diskturn: 2.46,
    softcrouch: 2.38,
    parallax: 2.58,
    snore: 2.44,
    twist: 2.52,
    pellet: 2.36,
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
    if (kind === "tytonid") return 40 + roll * 26;
    if (kind === "diskturn" || kind === "softcrouch" || kind === "parallax" || kind === "snore" || kind === "twist" || kind === "pellet") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tytonid";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) => (k === "tytonid" ? 0.72 : k === "twist" || k === "diskturn" ? 1.28 : k === "snore" || k === "parallax" || k === "softcrouch" ? 1.18 : 1.08));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "diskturn";
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
      anim: name === "javanica" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function furcataPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.furcata));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 7.2, rot: s * 14.4, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
      return {
        lift: 7.2 + Math.abs(flash) * 6,
        rot: 14.4 + flash * 9.6,
        dx: flash * 2.64,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function javanicaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.javanica));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 16.8, rot: s * -14.4, dx: s * 3.6, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
      return {
        lift: 14.4 + Math.abs(wriggle) * 12,
        rot: -12 + wriggle * 16.8,
        dx: wriggle * 4.8,
        anim: "play",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" };
  }

  function guttataPose(t) {
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
        : kind === "diskturn" || kind === "softcrouch" || kind === "twist"
          ? "sit"
          : kind === "parallax" || kind === "pellet"
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
    const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
    const soft = Math.abs(Math.sin(t * 0.9));
    return {
      lift: 2.4 + soft * 4.8 + Math.abs(breath) * 1.8,
      rot: -2.4 + breath * 4.8,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
  }

  function diskturnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.diskturn));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * 6, rot: s * 21.6 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.11) / 0.75;
      const scan = Math.sin(s * Math.PI * 1.35);
      const settle = Math.abs(Math.sin(s * Math.PI * 2.1));
      return {
        x: fromX + face * (4 * s + scan * 2.88),
        lift: 4.8 + settle * 4.2,
        rot: (21.6 + scan * 7.2) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + face * 4 * (1 - s),
      lift: 3.6 * (1 - s),
      rot: 6 * (1 - s) * face,
      anim: "idle",
    };
  }

  function softcrouchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.softcrouch));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * -9.6, rot: s * -9.6 * face, anim: "sit" };
    }
    if (u < 0.80) {
      const hush = Math.sin(t * 2.2) + 0.18 * Math.sin(t * 5.1);
      return {
        x: fromX + face * hush * 2.64,
        lift: -9.6 + Math.abs(hush) * 3.6,
        rot: (-9.6 + hush * 4.8) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.80) / 0.20);
    return {
      x: fromX,
      lift: -4.8 * (1 - s),
      rot: -3.6 * (1 - s) * face,
      anim: "idle",
    };
  }

  function parallaxPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.parallax));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 9.6, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.86) {
      const swing = Math.sin(t * 3.5) + 0.30 * Math.sin(t * 7.0);
      return {
        x: fromX + face * swing * 12,
        lift: 7.2 + Math.abs(swing) * 9.6,
        rot: (-7.2 + swing * 14.4) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 4.8 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function snorePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snore));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 7.2, rot: s * -14.4 * face, anim: "talk" };
    }
    if (u < 0.88) {
      const pulse = Math.sin(t * 2.8) + 0.24 * Math.sin(t * 5.6);
      return {
        x: fromX + face * pulse * 2.88,
        lift: 6 + Math.abs(pulse) * 7.2,
        rot: (-14.4 + pulse * 9.6) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 3.6 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" };
  }

  function twistPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.twist));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 4.8, rot: s * 33.6 * face, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const hold = Math.sin(s * Math.PI * 0.5);
      return {
        x: fromX + face * hold * 2.4,
        lift: 4.8 + hold * 2.4,
        rot: (33.6 + hold * 9.6) * face,
        anim: "sit",
      };
    }
    if (u < 0.88) {
      // reverse the extreme turn — other side
      const s = (u - 0.55) / 0.33;
      return {
        x: fromX,
        lift: 4.8,
        rot: (43.2 - s * 76.8) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 3.6 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" };
  }

  function pelletPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pellet));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 12, rot: s * -16.8 * face, anim: "play" };
    }
    if (u < 0.45) {
      // lean into cast
      const s = (u - 0.14) / 0.31;
      const strain = Math.sin(s * Math.PI);
      return {
        x: fromX + face * strain * 3.6,
        lift: 9.6 + strain * 4.8,
        rot: (-16.8 - strain * 7.2) * face,
        anim: "play",
      };
    }
    if (u < 0.88) {
      // cast bob
      const s = (u - 0.45) / 0.43;
      const bob = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + face * bob * 3,
        lift: 4.8 + Math.abs(bob) * 12,
        rot: (-9.6 + bob * 12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 4.8 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "diskturn" &&
      trick.kind !== "softcrouch" &&
      trick.kind !== "parallax" &&
      trick.kind !== "snore" &&
      trick.kind !== "twist" &&
      trick.kind !== "pellet"
    ) {
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
    const from = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "diskturn") {
      const pose = diskturnPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "softcrouch") {
      const pose = softcrouchPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "parallax") {
      const pose = parallaxPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "snore") {
      const pose = snorePose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "twist") {
      const pose = twistPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pelletPose(next.t, from, trick.facing);
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
    twistPose,
    pelletPose,
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
