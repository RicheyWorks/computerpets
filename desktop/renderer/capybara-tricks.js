/** Soak ground tricks while idle. House neighborly Hydrochoerinae / Hydrochoerus hydrochaeris capybara river-bank desk life — mudwallow / sedgecrop / alarmwhistle / pilelean / hydrochoerus personality (mudwallow silt-bank wallow without naming soak or wallow or mud or silt or bank or bath or dip or sit or rest or lounge or nap, sedgecrop sedge graze crop without naming graze or crop or sedge or reed or chew or nibble or browse or eat or hay or grass or forage or mouth, alarmwhistle whistle alert peep without naming whistle or alarm or alert or peep or chirp or call or warn or bark or cry or yell or talk, pilelean social pile lean nudge without naming pile or lean or nudge or nose or social or huddle or press or rest or flank or shoulder, long hydrochoerus Hydrochoerus hydrochaeris surface-calm bank hush hold — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play RUN and Call Soak leave capybara alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal own their tricks; guest slug Soak / key capybara — accept "capybara" and "soak" (roster slug soak; campaign Soak); do NOT name a trick capybara or soak or capybara or hydrochoerus or hydrochaeris or guinea_pig or whee or beaver or dam or otter or slick or bear or coal or porcupine or hedgehog or raccoon or skunk or opossum or ferret or weasel or turtle or ink or Bank or mining). Thank-yous denssoak / inksoak / denswallow. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web capybara-tricks.ts. Window-play RUN unchanged. True capybara Hydrochoerinae desk life — not beaver/guinea_pig/otter/turtle/bear/porcupine/rui clones. Gecko owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "capybara";
  const TRICKS = ["mudwallow", "sedgecrop", "alarmwhistle", "pilelean", "hydrochoerus"];
  const HAPPY = ["denssoak", "inksoak", "denswallow"];
  const HAPPY_DUR = { denssoak: 2.02, inksoak: 2.16, denswallow: 2.08 };
  const HYDROCHOERUS_HOLD = 20.36;
  const RELEASE_S = 1.52;
  const DUR = { hydrochoerus: HYDROCHOERUS_HOLD + RELEASE_S, mudwallow: 2.96, sedgecrop: 2.90, alarmwhistle: 3.12, pilelean: 3.04 };

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
      if (kind === "hydrochoerus") return 120 + roll * 12;
  if (kind === "mudwallow") return 19.4 + roll * 6.8;
  if (kind === "sedgecrop") return 20.6 + roll * 7.4;
  if (kind === "pilelean") return 22.0 + roll * 8.0;
  return justFinished ? 18.0 + roll * 6.4 : 12.0 + roll * 5.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "hydrochoerus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "hydrochoerus") {
      if (roll < 0.26) return "mudwallow";
      if (roll < 0.5) return "sedgecrop";
      if (roll < 0.74) return "alarmwhistle";
      return "pilelean";
    }
    if (lastKind === "mudwallow") {
      if (roll < 0.26) return "hydrochoerus";
      if (roll < 0.5) return "sedgecrop";
      if (roll < 0.74) return "alarmwhistle";
      return "pilelean";
    }
    if (lastKind === "sedgecrop") {
      if (roll < 0.22) return "hydrochoerus";
      if (roll < 0.44) return "mudwallow";
      if (roll < 0.68) return "alarmwhistle";
      return "pilelean";
    }
    if (roll < 0.2) return "hydrochoerus";
    if (roll < 0.4) return "mudwallow";
    if (roll < 0.6) return "sedgecrop";
    if (roll < 0.8) return "alarmwhistle";
    return "pilelean";
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
    return key === TRICK_KEY || key === "soak";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denssoak";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denssoak" ? "sit" : name === "inksoak" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denssoakPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssoak));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.016, rot: s * 1.95, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 2.9) + 0.12 * Math.sin(t * 5.8);
      return { lift: 0.016 + Math.abs(flash) * 0.008, rot: 1.95 + flash * 1.10, dx: flash * 0.00056, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.24 * (1 - s), dx: 0, anim: "idle" };
  }
  function inksoakPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksoak));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.040, rot: s * -2.45, dx: s * 0.00122, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 2.5) + 0.13 * Math.sin(t * 5.0);
      return { lift: 0.040 + Math.abs(spring) * 0.013, rot: -2.45 + spring * 2.00, dx: spring * 0.00150, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.006 * (1 - s), rot: -0.32 * (1 - s), dx: 0, anim: "sit" };
  }
  function denswallowPose(t) {
    return { lift: 0.0072 + Math.abs(Math.sin(t * 0.122)) * 0.0108, rot: Math.sin(t * 0.122) * 0.96, dx: Math.sin(t * 0.090) * 0.00060, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denssoak") {
      const pose = denssoakPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inksoak") {
      const pose = inksoakPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denswallowPose(next.t);
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
      kind === "hydrochoerus"
        ? "sit"
        : kind === "mudwallow"
          ? "sit"
          : kind === "sedgecrop"
            ? "play"
            : kind === "alarmwhistle"
              ? "talk"
              : kind === "pilelean"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "hydrochoerus" ? "hold" : "go",
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


                      function hydrochoerusPose(t) {
    const breath = Math.sin(t * 0.034) + 0.028 * Math.sin(t * 0.102);
    const hush = Math.abs(Math.sin(t * 0.040));
    return { lift: 0.005 + hush * 0.011, rot: 0.16 + breath * 0.48 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0034 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.13 * (1 - u) };
  }

  function mudwallowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mudwallow));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0008, lift: s * -0.028, rot: s * 3.2 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const wallow = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.2);
      const silt = Math.sin(t * 3.4) + 0.15 * Math.sin(t * 6.8);
      return { x: fromX + face * (0.0008 + wallow * 0.0008 + silt * 0.00022), lift: -0.024 + Math.abs(wallow) * 0.010 + Math.abs(silt) * 0.004, rot: (3.2 + wallow * 1.8 + silt * 1.1) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0008 * (1 - s), lift: -0.006 * (1 - s), rot: 0.38 * (1 - s) * face, anim: "idle" };
  }
  function sedgecropPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sedgecrop));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0018, lift: s * -0.016, rot: s * 4.6 * face, anim: "play" };
    }
    if (u < 0.86) {
      const crop = Math.sin((u - 0.10) / 0.76 * Math.PI * 4.6);
      const chew = Math.sin(t * 6.8) + 0.14 * Math.sin(t * 13.6);
      return { x: fromX + face * (0.0018 + crop * 0.0010 + chew * 0.00022), lift: -0.012 + Math.abs(crop) * 0.014 + Math.abs(chew) * 0.005, rot: (4.6 + crop * 2.6 + chew * 1.4) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0018 * (1 - s), lift: -0.003 * (1 - s), rot: 0.46 * (1 - s) * face, anim: "idle" };
  }
  function alarmwhistlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.alarmwhistle));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0012, lift: s * 0.036, rot: s * -3.4 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const peep = Math.sin((u - 0.10) / 0.76 * Math.PI * 5.4);
      const alert = Math.sin(t * 7.0) + 0.16 * Math.sin(t * 14.0);
      return { x: fromX + face * (0.0012 + peep * 0.0012 + alert * 0.00028), lift: 0.032 + Math.abs(peep) * 0.014 + Math.abs(alert) * 0.006, rot: (-3.4 + peep * 3.0 + alert * 1.6) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.006 * (1 - s), rot: -0.42 * (1 - s) * face, anim: "idle" };
  }
  function pileleanPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pilelean));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * -0.0014, lift: s * 0.014, rot: s * 5.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const lean = Math.sin((u - 0.11) / 0.75 * Math.PI * 3.4);
      const nudge = Math.sin(t * 5.2) + 0.15 * Math.sin(t * 10.4);
      return { x: fromX + face * (-0.0014 + lean * 0.0014 + nudge * 0.00026), lift: 0.012 + Math.abs(lean) * 0.011 + Math.abs(nudge) * 0.005, rot: (5.8 + lean * 2.2 + nudge * 1.5) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * -0.0014 * (1 - s), lift: 0.003 * (1 - s), rot: 0.54 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "mudwallow" && trick.kind !== "sedgecrop" && trick.kind !== "alarmwhistle" && trick.kind !== "pilelean") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "hydrochoerus") {
      if (next.t < HYDROCHOERUS_HOLD) {
        const pose = hydrochoerusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HYDROCHOERUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HYDROCHOERUS_HOLD);
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
    if (next.kind === "mudwallow") {
      const pose = mudwallowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sedgecrop") {
      const pose = sedgecropPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "alarmwhistle") {
      const pose = alarmwhistlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pileleanPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    HYDROCHOERUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    hydrochoerusPose,
    releasePose,
    mudwallowPose,
    sedgecropPose,
    alarmwhistlePose,
    pileleanPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denssoakPose,
    inksoakPose,
    denswallowPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCapybaraTricks = api;
})(typeof window !== "undefined" ? window : globalThis);