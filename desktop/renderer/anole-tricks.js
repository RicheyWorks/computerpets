/** Wink ground tricks while idle. House neighborly Dactyloidae / Anolis carolinensis Green Anole vine-post desk life — dewlapflash / pushupshow / hueshift / preyinch / anolis personality (dewlapflash dewlap gular flash without naming dewlap or flash or gular or throat or pink or flare or wave or bob or signal or warn or bark or cry, pushupshow push-up bob display without naming push or up or bob or display or rise or hold or wave or pump or bounce or jump or hop or climb, hueshift hue color wash without naming hue or color or brown or green or shift or change or fade or wash or chrom or pigment or camouflage or blend, preyinch prey inch stalk without naming prey or inch or stalk or freeze or cricket or insect or hunt or lunge or creep or wait or look or aim, long anolis Anolis carolinensis surface-calm vine hush flash — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Wink leave anole alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad own their tricks; guest slug Wink / key anole — accept "anole" and "wink" (roster slug wink; campaign Wink); do NOT name a trick anole or wink or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or pad or denspad or inkpad or denscling or Bank or mining). Thank-yous denswink / inkwink / densdewlap. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web anole-tricks.ts. Window-play FLASH unchanged. True Green Anole Dactyloidae desk life — not gecko/salamander/iguana/newt/frog/rui clones. Skink owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "anole";
  const TRICKS = ["dewlapflash", "pushupshow", "hueshift", "preyinch", "anolis"];
  const HAPPY = ["denswink", "inkwink", "densdewlap"];
  const HAPPY_DUR = { denswink: 2.06, inkwink: 2.20, densdewlap: 2.12 };
  const ANOLIS_HOLD = 20.44;
  const RELEASE_S = 1.56;
  const DUR = { anolis: ANOLIS_HOLD + RELEASE_S, dewlapflash: 3.00, pushupshow: 2.94, hueshift: 3.16, preyinch: 3.08 };

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
      if (kind === "anolis") return 124 + roll * 12;
  if (kind === "dewlapflash") return 19.8 + roll * 6.4;
  if (kind === "pushupshow") return 21.0 + roll * 7.0;
  if (kind === "preyinch") return 22.4 + roll * 7.6;
  return justFinished ? 18.4 + roll * 6.0 : 12.4 + roll * 5.2;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "anolis";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "anolis") {
      if (roll < 0.26) return "dewlapflash";
      if (roll < 0.5) return "pushupshow";
      if (roll < 0.74) return "hueshift";
      return "preyinch";
    }
    if (lastKind === "dewlapflash") {
      if (roll < 0.26) return "anolis";
      if (roll < 0.5) return "pushupshow";
      if (roll < 0.74) return "hueshift";
      return "preyinch";
    }
    if (lastKind === "pushupshow") {
      if (roll < 0.22) return "anolis";
      if (roll < 0.44) return "dewlapflash";
      if (roll < 0.68) return "hueshift";
      return "preyinch";
    }
    if (roll < 0.2) return "anolis";
    if (roll < 0.4) return "dewlapflash";
    if (roll < 0.6) return "pushupshow";
    if (roll < 0.8) return "hueshift";
    return "preyinch";
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
    return key === TRICK_KEY || key === "wink";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denswink";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denswink" ? "sit" : name === "inkwink" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denswinkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswink));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.020, rot: s * 2.15, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 3.2) + 0.12 * Math.sin(t * 6.4);
      return { lift: 0.020 + Math.abs(flash) * 0.010, rot: 2.15 + flash * 1.20, dx: flash * 0.00060, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.28 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkwinkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwink));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.044, rot: s * -2.65, dx: s * 0.00132, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 2.8) + 0.13 * Math.sin(t * 5.6);
      return { lift: 0.044 + Math.abs(spring) * 0.015, rot: -2.65 + spring * 2.20, dx: spring * 0.00158, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.006 * (1 - s), rot: -0.36 * (1 - s), dx: 0, anim: "sit" };
  }
  function densdewlapPose(t) {
    return { lift: 0.0078 + Math.abs(Math.sin(t * 0.128)) * 0.0114, rot: Math.sin(t * 0.128) * 1.05, dx: Math.sin(t * 0.096) * 0.00064, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denswink") {
      const pose = denswinkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkwink") {
      const pose = inkwinkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densdewlapPose(next.t);
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
      kind === "anolis"
        ? "sit"
        : kind === "dewlapflash"
          ? "sit"
          : kind === "pushupshow"
            ? "play"
            : kind === "hueshift"
              ? "talk"
              : kind === "preyinch"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "anolis" ? "hold" : "go",
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


                      function anolisPose(t) {
    const breath = Math.sin(t * 0.034) + 0.028 * Math.sin(t * 0.102);
    const perch = Math.abs(Math.sin(t * 0.040));
    return { lift: 0.005 + perch * 0.011, rot: 0.16 + breath * 0.48 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0034 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.12 * (1 - u) };
  }

  function dewlapflashPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dewlapflash));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0008, lift: s * 0.032, rot: s * 4.2 * face, anim: "talk" };
    }
    if (u < 0.85) {
      const flash = Math.sin((u - 0.11) / 0.74 * Math.PI * 4.6);
      const gular = Math.sin(t * 5.8) + 0.15 * Math.sin(t * 11.6);
      return { x: fromX + face * (0.0008 + flash * 0.0009 + gular * 0.00022), lift: 0.028 + Math.abs(flash) * 0.014 + Math.abs(gular) * 0.006, rot: (4.2 + flash * 2.6 + gular * 1.4) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.005 * (1 - s), rot: 0.40 * (1 - s) * face, anim: "idle" };
  }
  function pushupshowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pushupshow));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0012, lift: s * 0.048, rot: s * -3.4 * face, anim: "play" };
    }
    if (u < 0.86) {
      const push = Math.sin((u - 0.10) / 0.76 * Math.PI * 5.2);
      const bob = Math.sin(t * 6.8) + 0.14 * Math.sin(t * 13.6);
      return { x: fromX + face * (0.0012 + push * 0.0010 + bob * 0.00024), lift: 0.036 + Math.abs(push) * 0.022 + Math.abs(bob) * 0.008, rot: (-3.4 + push * 2.4 + bob * 1.5) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.006 * (1 - s), rot: -0.42 * (1 - s) * face, anim: "idle" };
  }
  function hueshiftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hueshift));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0005, lift: s * 0.018, rot: s * 2.2 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const hue = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.2);
      const wash = Math.sin(t * 2.8) + 0.12 * Math.sin(t * 5.6);
      return { x: fromX + face * (0.0005 + hue * 0.0006 + wash * 0.00018), lift: 0.016 + Math.abs(hue) * 0.010 + Math.abs(wash) * 0.004, rot: (2.2 + hue * 1.4 + wash * 1.0) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.003 * (1 - s), rot: 0.28 * (1 - s) * face, anim: "idle" };
  }
  function preyinchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.preyinch));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0024, lift: s * 0.012, rot: s * -4.6 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const inch = Math.sin((u - 0.11) / 0.75 * Math.PI * 3.2);
      const freeze = Math.sin(t * 4.4) + 0.14 * Math.sin(t * 8.8);
      return { x: fromX + face * (0.0024 + inch * 0.0018 + freeze * 0.00026), lift: 0.010 + Math.abs(inch) * 0.011 + Math.abs(freeze) * 0.005, rot: (-4.6 + inch * 2.2 + freeze * 1.3) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0024 * (1 - s), lift: 0.002 * (1 - s), rot: -0.50 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "dewlapflash" && trick.kind !== "pushupshow" && trick.kind !== "hueshift" && trick.kind !== "preyinch") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "anolis") {
      if (next.t < ANOLIS_HOLD) {
        const pose = anolisPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ANOLIS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ANOLIS_HOLD);
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
    if (next.kind === "dewlapflash") {
      const pose = dewlapflashPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pushupshow") {
      const pose = pushupshowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hueshift") {
      const pose = hueshiftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = preyinchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ANOLIS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    anolisPose,
    releasePose,
    dewlapflashPose,
    pushupshowPose,
    hueshiftPose,
    preyinchPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denswinkPose,
    inkwinkPose,
    densdewlapPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAnoleTricks = api;
})(typeof window !== "undefined" ? window : globalThis);