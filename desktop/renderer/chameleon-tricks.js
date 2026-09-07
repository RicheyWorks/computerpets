/** Shift ground tricks while idle. House neighborly Chamaeleonidae / Chamaeleo calyptratus Veiled Chameleon perch desk life — veilflush / turretgaze / tongueshot / branchrock / calyptratus personality (veilflush chromatophore veil flush without naming color or hue or flush or pigment or change or shift or camouflage or blend or match or fade or bright or mood or stress, turretgaze independent turret gaze without naming eye or turret or gaze or aim or scan or look or watch or stereo or independent or orbit or pupil or lid, tongueshot ballistic tongue shot without naming tongue or shot or ballistic or sticky or prey or cricket or strike or whip or ball or tip or glue or catch, branchrock cryptic branch rock without naming branch or rock or sway or leaf or pendul or walk or climb or zygodactyl or foot or tong or grip or perch or vine, long calyptratus Chamaeleo calyptratus surface-calm casque hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Shift leave chameleon alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash own their tricks; guest slug Shift / key chameleon — accept "chameleon" and "shift" (roster slug shift; campaign Shift); do NOT name a trick chameleon or shift or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or Bank or mining). Thank-yous denshift / inkshift / denscasque. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web chameleon-tricks.ts. Window-play FLASH unchanged. True Veiled Chameleon Chamaeleonidae desk life — not skink/anole/gecko/salamander/iguana/newt/frog/rui clones. Spike owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "chameleon";
  const TRICKS = ["veilflush", "turretgaze", "tongueshot", "branchrock", "calyptratus"];
  const HAPPY = ["denshift", "inkshift", "denscasque"];
  const HAPPY_DUR = { denshift: 2.10, inkshift: 2.24, denscasque: 2.16 };
  const CALYPTRATUS_HOLD = 20.52;
  const RELEASE_S = 1.60;
  const DUR = { calyptratus: CALYPTRATUS_HOLD + RELEASE_S, veilflush: 3.04, turretgaze: 2.98, tongueshot: 3.20, branchrock: 3.12 };

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
      if (kind === "calyptratus") return 128 + roll * 12;
  if (kind === "veilflush") return 20.2 + roll * 6.0;
  if (kind === "turretgaze") return 21.4 + roll * 6.6;
  if (kind === "branchrock") return 22.8 + roll * 7.2;
  return justFinished ? 18.8 + roll * 5.6 : 12.8 + roll * 4.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "calyptratus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "calyptratus") {
      if (roll < 0.26) return "veilflush";
      if (roll < 0.5) return "turretgaze";
      if (roll < 0.74) return "tongueshot";
      return "branchrock";
    }
    if (lastKind === "veilflush") {
      if (roll < 0.26) return "calyptratus";
      if (roll < 0.5) return "turretgaze";
      if (roll < 0.74) return "tongueshot";
      return "branchrock";
    }
    if (lastKind === "turretgaze") {
      if (roll < 0.22) return "calyptratus";
      if (roll < 0.44) return "veilflush";
      if (roll < 0.68) return "tongueshot";
      return "branchrock";
    }
    if (roll < 0.2) return "calyptratus";
    if (roll < 0.4) return "veilflush";
    if (roll < 0.6) return "turretgaze";
    if (roll < 0.8) return "tongueshot";
    return "branchrock";
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
    return key === TRICK_KEY || key === "shift";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denshift";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denshift" ? "sit" : name === "inkshift" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denshiftPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshift));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.017, rot: s * 1.95, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const casque = Math.sin(t * 2.8) + 0.11 * Math.sin(t * 5.6);
      return { lift: 0.017 + Math.abs(casque) * 0.0085, rot: 1.95 + casque * 1.10, dx: casque * 0.00054, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.24 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkshiftPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkshift));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.044, rot: s * -2.70, dx: s * 0.00135, anim: "play" };
    }
    if (u < 0.85) {
      const tongue = Math.sin(t * 2.9) + 0.13 * Math.sin(t * 5.8);
      return { lift: 0.044 + Math.abs(tongue) * 0.015, rot: -2.70 + tongue * 2.20, dx: tongue * 0.00158, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.005 * (1 - s), rot: -0.36 * (1 - s), dx: 0, anim: "sit" };
  }
  function denscasquePose(t) {
    return { lift: 0.0070 + Math.abs(Math.sin(t * 0.128)) * 0.0105, rot: Math.sin(t * 0.128) * 0.98, dx: Math.sin(t * 0.096) * 0.00058, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denshift") {
      const pose = denshiftPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkshift") {
      const pose = inkshiftPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscasquePose(next.t);
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
      kind === "calyptratus"
        ? "sit"
        : kind === "veilflush"
          ? "sit"
          : kind === "turretgaze"
            ? "talk"
            : kind === "tongueshot"
              ? "play"
              : kind === "branchrock"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "calyptratus" ? "hold" : "go",
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


                      function calyptratusPose(t) {
    const breath = Math.sin(t * 0.034) + 0.024 * Math.sin(t * 0.102);
    const settle = Math.abs(Math.sin(t * 0.036));
    return { lift: 0.0038 + settle * 0.0095, rot: 0.12 + breath * 0.42 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0030 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.10 * (1 - u) };
  }

  function veilflushPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.veilflush));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0005, lift: s * 0.014, rot: s * 2.2 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const flush = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.4);
      const veil = Math.sin(t * 2.8) + 0.11 * Math.sin(t * 5.6);
      return { x: fromX + face * (0.0005 + flush * 0.0006 + veil * 0.00018), lift: 0.012 + Math.abs(flush) * 0.010 + Math.abs(veil) * 0.004, rot: (2.2 + flush * 1.4 + veil * 0.9) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.003 * (1 - s), rot: 0.24 * (1 - s) * face, anim: "idle" };
  }
  function turretgazePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.turretgaze));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0007, lift: s * 0.018, rot: s * -2.6 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const turret = Math.sin((u - 0.10) / 0.76 * Math.PI * 4.8);
      const gaze = Math.sin(t * 5.4) + 0.13 * Math.sin(t * 10.8);
      return { x: fromX + face * (0.0007 + turret * 0.0010 + gaze * 0.00022), lift: 0.016 + Math.abs(turret) * 0.012 + Math.abs(gaze) * 0.005, rot: (-2.6 + turret * 2.4 + gaze * 1.3) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0007 * (1 - s), lift: 0.003 * (1 - s), rot: -0.28 * (1 - s) * face, anim: "idle" };
  }
  function tongueshotPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tongueshot));
    const face = facing == null ? 1 : facing;
    if (u < 0.08) {
      const s = smoothstep(u / 0.08);
      return { x: fromX + face * s * 0.0012, lift: s * 0.028, rot: s * 4.6 * face, anim: "play" };
    }
    if (u < 0.88) {
      const shot = Math.sin((u - 0.08) / 0.80 * Math.PI * 3.2);
      const ball = Math.sin(t * 6.8) + 0.15 * Math.sin(t * 13.6);
      return { x: fromX + face * (0.0012 + shot * 0.0022 + ball * 0.00030), lift: 0.024 + Math.abs(shot) * 0.020 + Math.abs(ball) * 0.007, rot: (4.6 + shot * 2.8 + ball * 1.6) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.004 * (1 - s), rot: 0.40 * (1 - s) * face, anim: "idle" };
  }
  function branchrockPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.branchrock));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0008, lift: s * 0.020, rot: s * -3.4 * face, anim: "sit" };
    }
    if (u < 0.85) {
      const rock = Math.sin((u - 0.11) / 0.74 * Math.PI * 3.6);
      const sway = Math.sin(t * 3.4) + 0.12 * Math.sin(t * 6.8);
      return { x: fromX + face * (0.0008 + rock * 0.0016 + sway * 0.00026), lift: 0.016 + Math.abs(rock) * 0.014 + Math.abs(sway) * 0.005, rot: (-3.4 + rock * 2.2 + sway * 1.2) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.003 * (1 - s), rot: -0.32 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "veilflush" && trick.kind !== "turretgaze" && trick.kind !== "tongueshot" && trick.kind !== "branchrock") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "calyptratus") {
      if (next.t < CALYPTRATUS_HOLD) {
        const pose = calyptratusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CALYPTRATUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CALYPTRATUS_HOLD);
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
    if (next.kind === "veilflush") {
      const pose = veilflushPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "turretgaze") {
      const pose = turretgazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tongueshot") {
      const pose = tongueshotPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = branchrockPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CALYPTRATUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    calyptratusPose,
    releasePose,
    veilflushPose,
    turretgazePose,
    tongueshotPose,
    branchrockPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denshiftPose,
    inkshiftPose,
    denscasquePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetChameleonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);