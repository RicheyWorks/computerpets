/** Hour ground tricks while idle. House neighborly Theridiidae / Latrodectus southern black-widow desk life — hourglass / tangle / wrap / gumfoot / latrodectus personality (hourglass ventral red-hourglass abdomen tip without naming flash or belly or mark or show or display or glass or red or warn, tangle messy irregular cobweb weave without naming web or silk or spin or nest or nestguard or mesh or lace or snare or radiate or stabilimentum or swathe or strum, wrap sticky prey-wrap wind without naming bite or kill or eat or prey or coil or wind alone as play or bind, gumfoot sticky gumfoot trap-line drop without naming trap or line or glue or sticky or foot or drop or hang or pendant or fall, long latrodectus Latrodectus mactans dark-corner tangle perch — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or urticate or threat or cork or ecdysis or aphonopelma or oil or dab or tip or drum or sip or hover; window-play CARRY and Call Hour leave widow alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet own their tricks; guest slug Hour / key widow — accept "widow" and "hour"; do NOT name a trick widow or hour or flash or silk or web or bite or venom or gaze). Thank-yous mactans / hesperus / geometricus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web widow-tricks.ts. Window-play CARRY unchanged. True theridiid black-widow desk life — not tarantula/wolf-spider/jumping-spider/orb-weaver/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Stem owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "widow";
  const TRICKS = ["hourglass", "tangle", "wrap", "gumfoot", "latrodectus"];
  const HAPPY = ["mactans", "hesperus", "geometricus"];
  const HAPPY_DUR = { mactans: 1.70, hesperus: 1.84, geometricus: 1.76 };
  const LATRODECTUS_HOLD = 19.60;
  const RELEASE_S = 1.20;
  const DUR = { latrodectus: LATRODECTUS_HOLD + RELEASE_S, hourglass: 2.58, tangle: 2.52, wrap: 2.74, gumfoot: 2.66 };

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
      if (kind === "latrodectus") return 88 + roll * 38;
  if (kind === "hourglass") return 14.8 + roll * 11.4;
  if (kind === "tangle") return 16.0 + roll * 12.0;
  if (kind === "gumfoot") return 17.8 + roll * 12.2;
  return justFinished ? 14.8 + roll * 9.6 : 8.8 + roll * 8.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "latrodectus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "latrodectus") {
      if (roll < 0.26) return "hourglass";
      if (roll < 0.5) return "tangle";
      if (roll < 0.74) return "wrap";
      return "gumfoot";
    }
    if (lastKind === "hourglass") {
      if (roll < 0.26) return "latrodectus";
      if (roll < 0.5) return "tangle";
      if (roll < 0.74) return "wrap";
      return "gumfoot";
    }
    if (lastKind === "tangle") {
      if (roll < 0.22) return "latrodectus";
      if (roll < 0.44) return "hourglass";
      if (roll < 0.68) return "wrap";
      return "gumfoot";
    }
    if (roll < 0.2) return "latrodectus";
    if (roll < 0.4) return "hourglass";
    if (roll < 0.6) return "tangle";
    if (roll < 0.8) return "wrap";
    return "gumfoot";
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
    return key === TRICK_KEY || key === "hour";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "mactans";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "mactans" ? "sit" : name === "hesperus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function mactansPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mactans));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.020, rot: s * 2.15, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 5.2) + 0.18 * Math.sin(t * 10.4);
      return { lift: 0.020 + Math.abs(flash) * 0.012, rot: 2.15 + flash * 1.60, dx: flash * 0.0008, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.006 * (1 - s), rot: 0.34 * (1 - s), dx: 0, anim: "idle" };
  }
  function hesperusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hesperus));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.036, rot: s * -2.70, dx: s * 0.0015, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.8) + 0.20 * Math.sin(t * 7.6);
      return { lift: 0.036 + Math.abs(spring) * 0.017, rot: -2.70 + spring * 2.35, dx: spring * 0.0019, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.011 * (1 - s), rot: -0.42 * (1 - s), dx: 0, anim: "sit" };
  }
  function geometricusPose(t) {
    return { lift: 0.011 + Math.abs(Math.sin(t * 0.24)) * 0.013, rot: Math.sin(t * 0.24) * 1.18, dx: Math.sin(t * 0.18) * 0.0008, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "mactans") {
      const pose = mactansPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hesperus") {
      const pose = hesperusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = geometricusPose(next.t);
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
      kind === "latrodectus"
        ? "sit"
        : kind === "hourglass"
          ? "sit"
          : kind === "tangle"
            ? "talk"
            : kind === "wrap"
              ? "play"
              : kind === "gumfoot"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "latrodectus" ? "hold" : "go",
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


                      function latrodectusPose(t) {
    const breath = Math.sin(t * 0.08) + 0.05 * Math.sin(t * 0.24);
    const hang = Math.abs(Math.sin(t * 0.11));
    return { lift: 0.012 + hang * 0.009, rot: -0.55 + breath * 0.48 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.006 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.22 * (1 - u) };
  }

  function hourglassPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hourglass));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.018, rot: s * 16.8 * face, anim: "sit" };
    }
    if (u < 0.80) {
      const tip = Math.sin((u - 0.12) / 0.68 * Math.PI);
      const gleam = Math.sin(t * 3.2) + 0.14 * Math.sin(t * 6.4);
      return { x: fromX + face * gleam * 0.0004, lift: 0.016 + tip * 0.010 + Math.abs(gleam) * 0.004, rot: (16.8 + tip * 2.8 + gleam * 1.4) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.80) / 0.20);
    return { x: fromX, lift: 0.006 * (1 - s), rot: 2.4 * (1 - s) * face, anim: "idle" };
  }
  function tanglePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tangle));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0020, lift: s * 0.014, rot: s * 4.2 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const mess = Math.sin((u - 0.10) / 0.76 * Math.PI * 5.2);
      const weave = Math.sin(t * 4.4) + 0.22 * Math.sin(t * 8.8);
      return { x: fromX + face * (0.0020 + mess * 0.0028 + weave * 0.0007), lift: 0.012 + Math.abs(mess) * 0.011 + Math.abs(weave) * 0.006, rot: (4.2 + mess * 4.6 + weave * 2.0) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0020 * (1 - s), lift: 0.005 * (1 - s), rot: 0.8 * (1 - s) * face, anim: "idle" };
  }
  function wrapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wrap));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0014, lift: s * 0.028, rot: s * -5.6 * face, anim: "play" };
    }
    if (u < 0.84) {
      const wind = Math.sin((u - 0.11) / 0.73 * Math.PI * 4.4);
      const spin = Math.sin(t * 7.6) * 0.40;
      return { x: fromX + face * (0.0014 + Math.abs(wind) * 0.0024), lift: 0.024 + Math.abs(wind) * 0.014 + Math.abs(spin) * 0.007, rot: (-5.6 + wind * 8.8 + spin * 3.0) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0014 * (1 - s), lift: 0.008 * (1 - s), rot: -1.0 * (1 - s) * face, anim: "idle" };
  }
  function gumfootPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gumfoot));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX - face * s * 0.0012, lift: s * 0.008, rot: s * -3.8 * face, anim: "play" };
    }
    if (u < 0.85) {
      const drop = Math.sin((u - 0.13) / 0.72 * Math.PI * 3.2);
      const tack = Math.sin(t * 2.8) + 0.16 * Math.sin(t * 5.6);
      return { x: fromX - face * (0.0012 + Math.abs(drop) * 0.0018 + tack * 0.0004), lift: 0.006 + Math.abs(drop) * 0.012 + Math.abs(tack) * 0.005, rot: (-3.8 + drop * 4.4 + tack * 1.6) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX - face * 0.0012 * (1 - s), lift: 0.004 * (1 - s), rot: -0.7 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "hourglass" && trick.kind !== "tangle" && trick.kind !== "wrap" && trick.kind !== "gumfoot") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "latrodectus") {
      if (next.t < LATRODECTUS_HOLD) {
        const pose = latrodectusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LATRODECTUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LATRODECTUS_HOLD);
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
    if (next.kind === "hourglass") {
      const pose = hourglassPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tangle") {
      const pose = tanglePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "wrap") {
      const pose = wrapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gumfootPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LATRODECTUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    latrodectusPose,
    releasePose,
    hourglassPose,
    tanglePose,
    wrapPose,
    gumfootPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    mactansPose,
    hesperusPose,
    geometricusPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWidowTricks = api;
})(typeof window !== "undefined" ? window : globalThis);