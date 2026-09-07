/** Beak ground tricks while idle. House neighborly Chelydridae / Chelydra serpentina Common Snapping Turtle mud-bowl desk life — ambushgape / mudbury / necklunge / banksnap / serpentina personality (ambushgape ambush open-mouth wait without naming ambush or gape or open or mouth or wait or lure or tongue or worm or bait or sit or freeze or still or stalk or crouch or hide, mudbury silt bury without naming mud or bury or silt or sink or dig or cover or cloak or nest or wallow or soak or bath or settle or bed or hide or dive, necklunge long-neck strike without naming neck or lunge or strike or dart or spear or whip or reach or coil or jolt or snap or bite or jab or thrust or shoot or extend, banksnap bankside snap without naming bank or snap or bite or hiss or clamp or crush or chomp or grit or jaw or beak or tooth or mouth or growl or threat, long serpentina Chelydra serpentina mud-calm plastron hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Beak leave snapper alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw own their tricks; guest slug Beak / key snapper — accept "snapper" and "beak" (roster slug beak; campaign Beak); do NOT name a trick snapper or beak or crocodile or jaw or alligator or levee or alligatoridae or mississippiensis or crocodylus or acutus or deathroll or turtle or ink or box_turtle or lid or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or denslevee or inklevee or densscute or densjaw or inkjaw or denskeel or Horn or Bank or mining). Thank-yous densbeak / inkbeak / densplastron. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web snapper-tricks.ts. Window-play FLASH unchanged. True Common Snapping Turtle Chelydridae desk life — not alligator-snapper Macrochelys tongue-lure, not croc/alligator/turtle/rui clones. Lid owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "snapper";
  const TRICKS = ["ambushgape", "mudbury", "necklunge", "banksnap", "serpentina"];
  const HAPPY = ["densbeak", "inkbeak", "densplastron"];
  const HAPPY_DUR = { densbeak: 2.18, inkbeak: 2.32, densplastron: 2.24 };
  const SERPENTINA_HOLD = 20.68;
  const RELEASE_S = 1.68;
  const DUR = { serpentina: SERPENTINA_HOLD + RELEASE_S, ambushgape: 3.12, mudbury: 3.06, necklunge: 3.28, banksnap: 3.20 };

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
      if (kind === "serpentina") return 136 + roll * 12;
  if (kind === "ambushgape") return 21.0 + roll * 5.2;
  if (kind === "mudbury") return 22.2 + roll * 5.8;
  if (kind === "necklunge") return 22.6 + roll * 6.4;
  if (kind === "banksnap") return 23.6 + roll * 6.4;
  return justFinished ? 19.6 + roll * 4.8 : 13.6 + roll * 4.0;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "serpentina";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "serpentina") {
      if (roll < 0.26) return "ambushgape";
      if (roll < 0.5) return "mudbury";
      if (roll < 0.74) return "necklunge";
      return "banksnap";
    }
    if (lastKind === "ambushgape") {
      if (roll < 0.26) return "serpentina";
      if (roll < 0.5) return "mudbury";
      if (roll < 0.74) return "necklunge";
      return "banksnap";
    }
    if (lastKind === "mudbury") {
      if (roll < 0.22) return "serpentina";
      if (roll < 0.44) return "ambushgape";
      if (roll < 0.68) return "necklunge";
      return "banksnap";
    }
    if (roll < 0.2) return "serpentina";
    if (roll < 0.4) return "ambushgape";
    if (roll < 0.6) return "mudbury";
    if (roll < 0.8) return "necklunge";
    return "banksnap";
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
    return key === TRICK_KEY || key === "beak";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densbeak";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densbeak" ? "sit" : name === "inkbeak" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function densbeakPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbeak));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.015, rot: s * 1.70, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const bank = Math.sin(t * 2.5) + 0.10 * Math.sin(t * 5.0);
      return { lift: 0.015 + Math.abs(bank) * 0.0074, rot: 1.70 + bank * 0.98, dx: bank * 0.00048, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.20 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkbeakPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkbeak));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.044, rot: s * -2.70, dx: s * 0.00132, anim: "play" };
    }
    if (u < 0.85) {
      const roll = Math.sin(t * 2.8) + 0.12 * Math.sin(t * 5.6);
      return { lift: 0.044 + Math.abs(roll) * 0.015, rot: -2.70 + roll * 2.20, dx: roll * 0.00152, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.005 * (1 - s), rot: -0.36 * (1 - s), dx: 0, anim: "sit" };
  }
  function densplastronPose(t) {
    return { lift: 0.0062 + Math.abs(Math.sin(t * 0.114)) * 0.0094, rot: Math.sin(t * 0.114) * 0.88, dx: Math.sin(t * 0.082) * 0.00052, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densbeak") {
      const pose = densbeakPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkbeak") {
      const pose = inkbeakPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densplastronPose(next.t);
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
      kind === "serpentina"
        ? "sit"
        : kind === "ambushgape"
          ? "talk"
          : kind === "mudbury"
            ? "sit"
            : kind === "necklunge"
              ? "play"
              : kind === "banksnap"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "serpentina" ? "hold" : "go",
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


                      function serpentinaPose(t) {
    const breath = Math.sin(t * 0.026) + 0.016 * Math.sin(t * 0.082);
    const settle = Math.abs(Math.sin(t * 0.028));
    return { lift: 0.0032 + settle * 0.0084, rot: 0.09 + breath * 0.36 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0026 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.08 * (1 - u) };
  }

  function ambushgapePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ambushgape));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0005, lift: s * 0.018, rot: s * -2.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const gape = Math.sin((u - 0.12) / 0.74 * Math.PI * 2.2);
      const ambush = Math.sin(t * 1.8) + 0.10 * Math.sin(t * 3.6);
      return { x: fromX + face * (0.0005 + gape * 0.0006 + ambush * 0.00016), lift: 0.014 + Math.abs(gape) * 0.010 + Math.abs(ambush) * 0.003, rot: (-2.8 + gape * 1.4 + ambush * 0.70) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.003 * (1 - s), rot: -0.28 * (1 - s) * face, anim: "idle" };
  }
  function mudburyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mudbury));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0012, lift: s * 0.010, rot: s * 1.6 * face, anim: "sit" };
    }
    if (u < 0.85) {
      const bury = Math.sin((u - 0.11) / 0.74 * Math.PI * 3.4);
      const mud = Math.sin(t * 3.2) + 0.11 * Math.sin(t * 6.4);
      return { x: fromX + face * (0.0012 + bury * 0.0014 + mud * 0.00024), lift: 0.008 + Math.abs(bury) * 0.012 + Math.abs(mud) * 0.004, rot: (1.6 + bury * 2.0 + mud * 1.1) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.002 * (1 - s), rot: 0.18 * (1 - s) * face, anim: "idle" };
  }
  function necklungePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.necklunge));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0024, lift: s * 0.036, rot: s * -3.4 * face, anim: "play" };
    }
    if (u < 0.84) {
      const lunge = Math.sin((u - 0.10) / 0.74 * Math.PI * 4.6);
      const neck = Math.sin(t * 5.6) + 0.13 * Math.sin(t * 11.2);
      return { x: fromX + face * (0.0024 + lunge * 0.0032 + neck * 0.00036), lift: 0.030 + Math.abs(lunge) * 0.018 + Math.abs(neck) * 0.006, rot: (-3.4 + lunge * 3.2 + neck * 1.6) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0024 * (1 - s), lift: 0.005 * (1 - s), rot: -0.34 * (1 - s) * face, anim: "idle" };
  }
  function banksnapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.banksnap));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0018, lift: s * 0.042, rot: s * 2.6 * face, anim: "play" };
    }
    if (u < 0.86) {
      const snap = Math.sin((u - 0.11) / 0.75 * Math.PI * 5.0);
      const bank = Math.sin(t * 6.0) + 0.12 * Math.sin(t * 12.0);
      return { x: fromX + face * (0.0018 + snap * 0.0022 + bank * 0.00032), lift: 0.036 + Math.abs(snap) * 0.016 + Math.abs(bank) * 0.005, rot: (2.6 + snap * 2.4 + bank * 1.3) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0018 * (1 - s), lift: 0.004 * (1 - s), rot: 0.24 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "ambushgape" && trick.kind !== "mudbury" && trick.kind !== "necklunge" && trick.kind !== "banksnap") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "serpentina") {
      if (next.t < SERPENTINA_HOLD) {
        const pose = serpentinaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SERPENTINA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SERPENTINA_HOLD);
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
    if (next.kind === "ambushgape") {
      const pose = ambushgapePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mudbury") {
      const pose = mudburyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "necklunge") {
      const pose = necklungePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = banksnapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    SERPENTINA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    serpentinaPose,
    releasePose,
    ambushgapePose,
    mudburyPose,
    necklungePose,
    banksnapPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densbeakPose,
    inkbeakPose,
    densplastronPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSnapperTricks = api;
})(typeof window !== "undefined" ? window : globalThis);