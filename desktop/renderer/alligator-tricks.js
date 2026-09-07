/** Levee ground tricks while idle. House neighborly Alligatoridae / Alligator mississippiensis American Alligator bank-dish desk life — bellowbank / deathcoil / snoutspy / baskgape / mississippi personality (bellowbank infrasound bank bellow without naming bellow or bank or roar or growl or vocal or throat or sound or call or rumble or infra or boom or chorus, deathcoil death-roll coil posture without naming death or coil or roll or spin or twist or thrash or prey or kill or shake or tumble or rotate or torque, snoutspy snout spy-hop without naming snout or spy or hop or nose or nostril or surface or peek or tip or lift or float or breathe or periscope, baskgape bask gape without naming bask or gape or yawn or mouth or jaw or sun or heat or therm or open or tooth or grin or smile, long mississippi Alligator mississippiensis bank-calm scute hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Levee leave alligator alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike own their tricks; guest slug Levee / key alligator — accept "alligator" and "levee" (roster slug levee; campaign Levee); do NOT name a trick alligator or levee or crocodile or jaw or crocodylus or acutus or deathroll or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or Horn or Bank or mining). Thank-yous denslevee / inklevee / densscute. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web alligator-tricks.ts. Window-play FLASH unchanged. True American Alligator Alligatoridae desk life — not crocodile/horned-lizard/chameleon/skink/anole/gecko/salamander/iguana/newt/frog/rui clones. Jaw owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "alligator";
  const TRICKS = ["bellowbank", "deathcoil", "snoutspy", "baskgape", "mississippi"];
  const HAPPY = ["denslevee", "inklevee", "densscute"];
  const HAPPY_DUR = { denslevee: 2.14, inklevee: 2.28, densscute: 2.20 };
  const MISSISSIPPI_HOLD = 20.60;
  const RELEASE_S = 1.64;
  const DUR = { mississippi: MISSISSIPPI_HOLD + RELEASE_S, bellowbank: 3.08, deathcoil: 3.02, snoutspy: 3.24, baskgape: 3.16 };

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
      if (kind === "mississippi") return 132 + roll * 12;
  if (kind === "bellowbank") return 20.6 + roll * 5.6;
  if (kind === "deathcoil") return 21.8 + roll * 6.2;
  if (kind === "baskgape") return 23.2 + roll * 6.8;
  return justFinished ? 19.2 + roll * 5.2 : 13.2 + roll * 4.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "mississippi";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "mississippi") {
      if (roll < 0.26) return "bellowbank";
      if (roll < 0.5) return "deathcoil";
      if (roll < 0.74) return "snoutspy";
      return "baskgape";
    }
    if (lastKind === "bellowbank") {
      if (roll < 0.26) return "mississippi";
      if (roll < 0.5) return "deathcoil";
      if (roll < 0.74) return "snoutspy";
      return "baskgape";
    }
    if (lastKind === "deathcoil") {
      if (roll < 0.22) return "mississippi";
      if (roll < 0.44) return "bellowbank";
      if (roll < 0.68) return "snoutspy";
      return "baskgape";
    }
    if (roll < 0.2) return "mississippi";
    if (roll < 0.4) return "bellowbank";
    if (roll < 0.6) return "deathcoil";
    if (roll < 0.8) return "snoutspy";
    return "baskgape";
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
    return key === TRICK_KEY || key === "levee";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denslevee";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denslevee" ? "sit" : name === "inklevee" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function densleveePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslevee));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.015, rot: s * 1.70, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const bank = Math.sin(t * 2.5) + 0.10 * Math.sin(t * 5.0);
      return { lift: 0.015 + Math.abs(bank) * 0.0076, rot: 1.70 + bank * 0.98, dx: bank * 0.00048, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.20 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkleveePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inklevee));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.044, rot: s * -2.70, dx: s * 0.00132, anim: "play" };
    }
    if (u < 0.85) {
      const roll = Math.sin(t * 2.8) + 0.12 * Math.sin(t * 5.6);
      return { lift: 0.044 + Math.abs(roll) * 0.015, rot: -2.70 + roll * 2.20, dx: roll * 0.00155, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.005 * (1 - s), rot: -0.36 * (1 - s), dx: 0, anim: "sit" };
  }
  function densscutePose(t) {
    return { lift: 0.0064 + Math.abs(Math.sin(t * 0.120)) * 0.0096, rot: Math.sin(t * 0.120) * 0.90, dx: Math.sin(t * 0.088) * 0.00052, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denslevee") {
      const pose = densleveePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inklevee") {
      const pose = inkleveePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densscutePose(next.t);
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
      kind === "mississippi"
        ? "sit"
        : kind === "bellowbank"
          ? "talk"
          : kind === "deathcoil"
            ? "play"
            : kind === "snoutspy"
              ? "play"
              : kind === "baskgape"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "mississippi" ? "hold" : "go",
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


                      function mississippiPose(t) {
    const breath = Math.sin(t * 0.030) + 0.020 * Math.sin(t * 0.090);
    const settle = Math.abs(Math.sin(t * 0.032));
    return { lift: 0.0032 + settle * 0.0084, rot: 0.09 + breath * 0.36 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0026 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.08 * (1 - u) };
  }

  function bellowbankPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bellowbank));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0005, lift: s * 0.022, rot: s * -2.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const bellow = Math.sin((u - 0.10) / 0.76 * Math.PI * 4.6);
      const bank = Math.sin(t * 5.4) + 0.13 * Math.sin(t * 10.8);
      return { x: fromX + face * (0.0005 + bellow * 0.0010 + bank * 0.00022), lift: 0.018 + Math.abs(bellow) * 0.014 + Math.abs(bank) * 0.005, rot: (-2.8 + bellow * 2.4 + bank * 1.3) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.003 * (1 - s), rot: -0.30 * (1 - s) * face, anim: "idle" };
  }
  function deathcoilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.deathcoil));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0022, lift: s * 0.038, rot: s * 4.8 * face, anim: "play" };
    }
    if (u < 0.88) {
      const coil = Math.sin((u - 0.09) / 0.79 * Math.PI * 7.4);
      const spin = Math.sin(t * 8.2) + 0.15 * Math.sin(t * 16.4);
      return { x: fromX + face * (0.0022 + coil * 0.0024 + spin * 0.00034), lift: 0.032 + Math.abs(coil) * 0.018 + Math.abs(spin) * 0.007, rot: (4.8 + coil * 3.2 + spin * 1.8) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0022 * (1 - s), lift: 0.005 * (1 - s), rot: 0.40 * (1 - s) * face, anim: "idle" };
  }
  function snoutspyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snoutspy));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0008, lift: s * 0.048, rot: s * 1.6 * face, anim: "play" };
    }
    if (u < 0.84) {
      const spy = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.2);
      const snout = Math.sin(t * 2.4) + 0.10 * Math.sin(t * 4.8);
      return { x: fromX + face * (0.0008 + spy * 0.0006 + snout * 0.00016), lift: 0.044 + Math.abs(spy) * 0.010 + Math.abs(snout) * 0.004, rot: (1.6 + spy * 1.2 + snout * 0.7) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.004 * (1 - s), rot: 0.18 * (1 - s) * face, anim: "idle" };
  }
  function baskgapePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.baskgape));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0003, lift: s * 0.010, rot: s * -1.4 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const gape = Math.sin((u - 0.14) / 0.72 * Math.PI * 1.8);
      const bask = Math.sin(t * 1.8) + 0.09 * Math.sin(t * 3.6);
      return { x: fromX + face * (0.0003 + gape * 0.0004 + bask * 0.00012), lift: 0.008 + Math.abs(gape) * 0.008 + Math.abs(bask) * 0.003, rot: (-1.4 + gape * 1.1 + bask * 0.6) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0003 * (1 - s), lift: 0.002 * (1 - s), rot: -0.16 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "bellowbank" && trick.kind !== "deathcoil" && trick.kind !== "snoutspy" && trick.kind !== "baskgape") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "mississippi") {
      if (next.t < MISSISSIPPI_HOLD) {
        const pose = mississippiPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MISSISSIPPI_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MISSISSIPPI_HOLD);
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
    if (next.kind === "bellowbank") {
      const pose = bellowbankPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "deathcoil") {
      const pose = deathcoilPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "snoutspy") {
      const pose = snoutspyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = baskgapePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    MISSISSIPPI_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    mississippiPose,
    releasePose,
    bellowbankPose,
    deathcoilPose,
    snoutspyPose,
    baskgapePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densleveePose,
    inkleveePose,
    densscutePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAlligatorTricks = api;
})(typeof window !== "undefined" ? window : globalThis);