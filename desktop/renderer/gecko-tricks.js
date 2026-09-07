/** Pad ground tricks while idle. House neighborly Gekkonidae / Hemidactylus turcicus Mediterranean house gecko lamp-plaster desk life — toepadcling / vocalclick / lickeye / mothstalk / hemidactylus personality (toepadcling toe-pad lamella cling without naming cling or pad or toe or lamella or setae or wall or plaster or climb or grip or hold or stick or scale, vocalclick vocal click chirp without naming click or chirp or vocal or peep or call or warn or bark or cry or yell or talk or tok or trill, lickeye lick-eye tongue wipe without naming lick or eye or tongue or wipe or clean or blink or ocular or sclera or mouth or face, mothstalk moth stalk freeze without naming moth or stalk or freeze or prey or insect or hunt or lunge or creep or wait or look or aim, long hemidactylus Hemidactylus turcicus surface-calm lamp hush cling — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play RUN and Call Pad leave gecko alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak own their tricks; guest slug Pad / key gecko — accept "gecko" and "pad" (roster slug pad; campaign Pad); do NOT name a trick gecko or pad or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or anole or wink or caecilian or slip or frog or reed or toad or pebble or ink or Bank or mining). Thank-yous denspad / inkpad / denscling. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web gecko-tricks.ts. Window-play RUN unchanged. True Mediterranean house gecko Gekkonidae desk life — not salamander/iguana/newt/anole/frog/rui clones. Anole owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "gecko";
  const TRICKS = ["toepadcling", "vocalclick", "lickeye", "mothstalk", "hemidactylus"];
  const HAPPY = ["denspad", "inkpad", "denscling"];
  const HAPPY_DUR = { denspad: 2.04, inkpad: 2.18, denscling: 2.10 };
  const HEMIDACTYLUS_HOLD = 20.40;
  const RELEASE_S = 1.54;
  const DUR = { hemidactylus: HEMIDACTYLUS_HOLD + RELEASE_S, toepadcling: 2.98, vocalclick: 2.92, lickeye: 3.14, mothstalk: 3.06 };

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
      if (kind === "hemidactylus") return 122 + roll * 12;
  if (kind === "toepadcling") return 19.6 + roll * 6.6;
  if (kind === "vocalclick") return 20.8 + roll * 7.2;
  if (kind === "mothstalk") return 22.2 + roll * 7.8;
  return justFinished ? 18.2 + roll * 6.2 : 12.2 + roll * 5.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "hemidactylus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "hemidactylus") {
      if (roll < 0.26) return "toepadcling";
      if (roll < 0.5) return "vocalclick";
      if (roll < 0.74) return "lickeye";
      return "mothstalk";
    }
    if (lastKind === "toepadcling") {
      if (roll < 0.26) return "hemidactylus";
      if (roll < 0.5) return "vocalclick";
      if (roll < 0.74) return "lickeye";
      return "mothstalk";
    }
    if (lastKind === "vocalclick") {
      if (roll < 0.22) return "hemidactylus";
      if (roll < 0.44) return "toepadcling";
      if (roll < 0.68) return "lickeye";
      return "mothstalk";
    }
    if (roll < 0.2) return "hemidactylus";
    if (roll < 0.4) return "toepadcling";
    if (roll < 0.6) return "vocalclick";
    if (roll < 0.8) return "lickeye";
    return "mothstalk";
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
    return key === TRICK_KEY || key === "pad";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denspad";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denspad" ? "sit" : name === "inkpad" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denspadPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspad));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.018, rot: s * 2.05, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 3.0) + 0.12 * Math.sin(t * 6.0);
      return { lift: 0.018 + Math.abs(flash) * 0.009, rot: 2.05 + flash * 1.15, dx: flash * 0.00058, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.26 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkpadPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkpad));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.042, rot: s * -2.55, dx: s * 0.00128, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 2.6) + 0.13 * Math.sin(t * 5.2);
      return { lift: 0.042 + Math.abs(spring) * 0.014, rot: -2.55 + spring * 2.10, dx: spring * 0.00155, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.006 * (1 - s), rot: -0.34 * (1 - s), dx: 0, anim: "sit" };
  }
  function densclingPose(t) {
    return { lift: 0.0076 + Math.abs(Math.sin(t * 0.126)) * 0.0112, rot: Math.sin(t * 0.126) * 1.00, dx: Math.sin(t * 0.094) * 0.00062, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denspad") {
      const pose = denspadPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkpad") {
      const pose = inkpadPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densclingPose(next.t);
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
      kind === "hemidactylus"
        ? "sit"
        : kind === "toepadcling"
          ? "sit"
          : kind === "vocalclick"
            ? "play"
            : kind === "lickeye"
              ? "talk"
              : kind === "mothstalk"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "hemidactylus" ? "hold" : "go",
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


                      function hemidactylusPose(t) {
    const breath = Math.sin(t * 0.036) + 0.030 * Math.sin(t * 0.108);
    const cling = Math.abs(Math.sin(t * 0.042));
    return { lift: 0.006 + cling * 0.012, rot: 0.18 + breath * 0.52 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0036 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.14 * (1 - u) };
  }

  function toepadclingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.toepadcling));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0006, lift: s * 0.034, rot: s * -2.8 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const cling = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.4);
      const setae = Math.sin(t * 3.6) + 0.16 * Math.sin(t * 7.2);
      return { x: fromX + face * (0.0006 + cling * 0.0007 + setae * 0.00020), lift: 0.030 + Math.abs(cling) * 0.012 + Math.abs(setae) * 0.005, rot: (-2.8 + cling * 1.6 + setae * 1.2) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.006 * (1 - s), rot: -0.36 * (1 - s) * face, anim: "idle" };
  }
  function vocalclickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.vocalclick));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0010, lift: s * 0.028, rot: s * 3.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const click = Math.sin((u - 0.10) / 0.76 * Math.PI * 5.8);
      const chirp = Math.sin(t * 7.4) + 0.15 * Math.sin(t * 14.8);
      return { x: fromX + face * (0.0010 + click * 0.0011 + chirp * 0.00026), lift: 0.024 + Math.abs(click) * 0.016 + Math.abs(chirp) * 0.006, rot: (3.8 + click * 2.8 + chirp * 1.5) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0010 * (1 - s), lift: 0.004 * (1 - s), rot: 0.44 * (1 - s) * face, anim: "idle" };
  }
  function lickeyePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lickeye));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0014, lift: s * -0.012, rot: s * 5.2 * face, anim: "play" };
    }
    if (u < 0.86) {
      const wipe = Math.sin((u - 0.10) / 0.76 * Math.PI * 4.2);
      const tongue = Math.sin(t * 6.2) + 0.14 * Math.sin(t * 12.4);
      return { x: fromX + face * (0.0014 + wipe * 0.0009 + tongue * 0.00024), lift: -0.008 + Math.abs(wipe) * 0.018 + Math.abs(tongue) * 0.006, rot: (5.2 + wipe * 2.4 + tongue * 1.6) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0014 * (1 - s), lift: -0.002 * (1 - s), rot: 0.50 * (1 - s) * face, anim: "idle" };
  }
  function mothstalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mothstalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0022, lift: s * 0.010, rot: s * -4.2 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const stalk = Math.sin((u - 0.11) / 0.75 * Math.PI * 3.0);
      const freeze = Math.sin(t * 4.8) + 0.15 * Math.sin(t * 9.6);
      return { x: fromX + face * (0.0022 + stalk * 0.0016 + freeze * 0.00028), lift: 0.008 + Math.abs(stalk) * 0.012 + Math.abs(freeze) * 0.005, rot: (-4.2 + stalk * 2.0 + freeze * 1.4) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0022 * (1 - s), lift: 0.002 * (1 - s), rot: -0.48 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "toepadcling" && trick.kind !== "vocalclick" && trick.kind !== "lickeye" && trick.kind !== "mothstalk") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "hemidactylus") {
      if (next.t < HEMIDACTYLUS_HOLD) {
        const pose = hemidactylusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HEMIDACTYLUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HEMIDACTYLUS_HOLD);
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
    if (next.kind === "toepadcling") {
      const pose = toepadclingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "vocalclick") {
      const pose = vocalclickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lickeye") {
      const pose = lickeyePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = mothstalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    HEMIDACTYLUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    hemidactylusPose,
    releasePose,
    toepadclingPose,
    vocalclickPose,
    lickeyePose,
    mothstalkPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denspadPose,
    inkpadPose,
    densclingPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGeckoTricks = api;
})(typeof window !== "undefined" ? window : globalThis);