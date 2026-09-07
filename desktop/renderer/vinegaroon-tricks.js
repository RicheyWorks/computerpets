/** Whip ground tricks while idle. House neighborly Thelyphonida / Mastigoproctus giant-vinegaroon desk life — flagellum / acetic / palpcrush / trayburrow / mastigoproctus personality (flagellum whip-sense probe without naming whip or sense or feel or probe or palp or bob or wave or flag or antenna or feeler or touch or trail, acetic spray-raise without naming spray or vinegar or acid or sting or stinger or telson or metasoma or tail or threat or warn or strike or coil, raptorial pedipalp-crush without naming pedipalp or crush or chelate or grasp or pincer or claw or hold or seize or pinch or feel or pat, trayburrow burrow-scrape without naming dig or burrow or sanddig or fossor or scratch or scrape or rake or shovel or nest or nestguard, long mastigoproctus Mastigoproctus giganteus sand-tray blotter hold — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or urticate or threat or cork or ecdysis or aphonopelma or hourglass or tangle or wrap or gumfoot or latrodectus or legwave or oscillate or autotomy or gregarious or phalangium or pedipalp or metasoma or fluoresce or sanddig or centruroides or promenade or oil or dab or tip or drum or sip or hover; window-play CARRY and Call Whip leave vinegaroon alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb own their tricks; guest slug Whip / key vinegaroon — accept "vinegaroon" and "whip"; do NOT name a trick vinegaroon or whip or sting or venom or scorpion or spider or silk or web or gaze). Thank-yous giganteus / tohono / thelyphonus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web vinegaroon-tricks.ts. Window-play CARRY unchanged. True thelyphonid giant-vinegaroon desk life — not scorpion/harvestman/widow/tarantula/wolf-spider/jumping-spider/orb-weaver clones. Clasp owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "vinegaroon";
  const TRICKS = ["flagellum", "acetic", "palpcrush", "trayburrow", "mastigoproctus"];
  const HAPPY = ["giganteus", "tohono", "thelyphonus"];
  const HAPPY_DUR = { giganteus: 1.76, tohono: 1.90, thelyphonus: 1.82 };
  const MASTIGOPROCTUS_HOLD = 19.80;
  const RELEASE_S = 1.26;
  const DUR = { mastigoproctus: MASTIGOPROCTUS_HOLD + RELEASE_S, flagellum: 2.68, acetic: 2.62, palpcrush: 2.84, trayburrow: 2.76 };

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
      if (kind === "mastigoproctus") return 94 + roll * 32;
  if (kind === "flagellum") return 15.8 + roll * 10.4;
  if (kind === "acetic") return 17.0 + roll * 11.0;
  if (kind === "trayburrow") return 18.4 + roll * 11.6;
  return justFinished ? 15.4 + roll * 9.0 : 9.4 + roll * 8.2;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "mastigoproctus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "mastigoproctus") {
      if (roll < 0.26) return "flagellum";
      if (roll < 0.5) return "acetic";
      if (roll < 0.74) return "palpcrush";
      return "trayburrow";
    }
    if (lastKind === "flagellum") {
      if (roll < 0.26) return "mastigoproctus";
      if (roll < 0.5) return "acetic";
      if (roll < 0.74) return "palpcrush";
      return "trayburrow";
    }
    if (lastKind === "acetic") {
      if (roll < 0.22) return "mastigoproctus";
      if (roll < 0.44) return "flagellum";
      if (roll < 0.68) return "palpcrush";
      return "trayburrow";
    }
    if (roll < 0.2) return "mastigoproctus";
    if (roll < 0.4) return "flagellum";
    if (roll < 0.6) return "acetic";
    if (roll < 0.8) return "palpcrush";
    return "trayburrow";
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
    return key === TRICK_KEY || key === "whip";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "giganteus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "giganteus" ? "sit" : name === "tohono" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function giganteusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.giganteus));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.020, rot: s * 2.70, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.4) + 0.16 * Math.sin(t * 8.8);
      return { lift: 0.020 + Math.abs(flash) * 0.013, rot: 2.70 + flash * 1.55, dx: flash * 0.00080, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.005 * (1 - s), rot: 0.34 * (1 - s), dx: 0, anim: "idle" };
  }
  function tohonoPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tohono));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.040, rot: s * -3.20, dx: s * 0.0017, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.2) + 0.18 * Math.sin(t * 6.4);
      return { lift: 0.040 + Math.abs(spring) * 0.018, rot: -3.20 + spring * 2.50, dx: spring * 0.0021, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.012 * (1 - s), rot: -0.42 * (1 - s), dx: 0, anim: "sit" };
  }
  function thelyphonusPose(t) {
    return { lift: 0.010 + Math.abs(Math.sin(t * 0.18)) * 0.014, rot: Math.sin(t * 0.18) * 1.28, dx: Math.sin(t * 0.14) * 0.00080, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "giganteus") {
      const pose = giganteusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tohono") {
      const pose = tohonoPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = thelyphonusPose(next.t);
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
      kind === "mastigoproctus"
        ? "sit"
        : kind === "flagellum"
          ? "talk"
          : kind === "acetic"
            ? "play"
            : kind === "palpcrush"
              ? "play"
              : kind === "trayburrow"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "mastigoproctus" ? "hold" : "go",
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


                      function mastigoproctusPose(t) {
    const breath = Math.sin(t * 0.055) + 0.045 * Math.sin(t * 0.16);
    const hang = Math.abs(Math.sin(t * 0.085));
    return { lift: 0.010 + hang * 0.008, rot: 0.42 + breath * 0.50 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0045 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.18 * (1 - u) };
  }

  function flagellumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.flagellum));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0016, lift: s * 0.012, rot: s * 5.2 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const wave = Math.sin((u - 0.10) / 0.76 * Math.PI * 5.0);
      const tip = Math.sin(t * 7.2) + 0.18 * Math.sin(t * 14.4);
      return { x: fromX + face * (0.0016 + wave * 0.0028 + tip * 0.0005), lift: 0.010 + Math.abs(wave) * 0.011 + Math.abs(tip) * 0.004, rot: (5.2 + wave * 4.0 + tip * 2.0) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0016 * (1 - s), lift: 0.003 * (1 - s), rot: 0.8 * (1 - s) * face, anim: "idle" };
  }
  function aceticPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.acetic));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX - face * s * 0.0010, lift: s * 0.040, rot: s * -14.0 * face, anim: "play" };
    }
    if (u < 0.78) {
      const rear = Math.sin((u - 0.12) / 0.66 * Math.PI);
      const puff = Math.sin(t * 3.2) + 0.12 * Math.sin(t * 6.4);
      return { x: fromX - face * (0.0010 + rear * 0.0018), lift: 0.036 + rear * 0.016 + Math.abs(puff) * 0.006, rot: (-14.0 - rear * 5.2 + puff * 1.4) * face, anim: "play" };
    }
    if (u < 0.90) {
      const spray = Math.sin((u - 0.78) / 0.12 * Math.PI * 3);
      return { x: fromX - face * 0.0012, lift: 0.042 + Math.abs(spray) * 0.010, rot: (-16.0 + spray * 2.8) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX - face * 0.0010 * (1 - s), lift: 0.010 * (1 - s), rot: -2.4 * (1 - s) * face, anim: "idle" };
  }
  function palpcrushPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.palpcrush));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0030, lift: s * 0.018, rot: s * 8.4 * face, anim: "play" };
    }
    if (u < 0.84) {
      const crush = Math.sin((u - 0.11) / 0.73 * Math.PI * 3.6);
      const clamp = Math.sin(t * 5.6) + 0.22 * Math.sin(t * 11.2);
      return { x: fromX + face * (0.0030 + crush * 0.0016 + clamp * 0.0007), lift: 0.016 + Math.abs(crush) * 0.010 + Math.abs(clamp) * 0.006, rot: (8.4 + crush * 2.8 + clamp * 2.0) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0030 * (1 - s), lift: 0.005 * (1 - s), rot: 1.2 * (1 - s) * face, anim: "idle" };
  }
  function trayburrowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.trayburrow));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0020, lift: s * -0.006, rot: s * 4.0 * face, anim: "play" };
    }
    if (u < 0.86) {
      const scoop = Math.sin((u - 0.14) / 0.72 * Math.PI * 4.2);
      const grit = Math.sin(t * 5.4) + 0.15 * Math.sin(t * 10.8);
      return { x: fromX + face * (0.0020 + scoop * 0.0026 + grit * 0.00055), lift: -0.004 + Math.abs(scoop) * 0.012 + Math.abs(grit) * 0.005, rot: (4.0 + scoop * 3.8 + grit * 1.6) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0020 * (1 - s), lift: 0.002 * (1 - s), rot: 0.7 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "flagellum" && trick.kind !== "acetic" && trick.kind !== "palpcrush" && trick.kind !== "trayburrow") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "mastigoproctus") {
      if (next.t < MASTIGOPROCTUS_HOLD) {
        const pose = mastigoproctusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MASTIGOPROCTUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MASTIGOPROCTUS_HOLD);
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
    if (next.kind === "flagellum") {
      const pose = flagellumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "acetic") {
      const pose = aceticPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "palpcrush") {
      const pose = palpcrushPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = trayburrowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    MASTIGOPROCTUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    mastigoproctusPose,
    releasePose,
    flagellumPose,
    aceticPose,
    palpcrushPose,
    trayburrowPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    giganteusPose,
    tohonoPose,
    thelyphonusPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetVinegaroonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);