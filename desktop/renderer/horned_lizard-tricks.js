/** Spike ground tricks while idle. House neighborly Phrynosomatidae / Phrynosoma cornutum Texas Horned Lizard sand-tray desk life — bloodsquirt / antfeast / freezeflat / rainharvest / phrynosoma personality (bloodsquirt ocular blood-squirt bluff without naming blood or squirt or ocular or eye or spray or threat or warn or defense or stream or red or bleed or pressure, antfeast harvester ant feast without naming ant or feast or harvest or eat or nibble or prey or pogonomyrmex or crawl or bite or forage or crumb, freezeflat freeze flatten crypsis without naming freeze or flat or flatten or still or hide or camouflage or sand or crypt or press or loaf or nap, rainharvest dorsal rain-harvest without naming rain or harvest or drip or channel or water or dew or drink or dorsal or mouth or groove or scale, long phrynosoma Phrynosoma cornutum surface-calm crown hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Spike leave horned_lizard alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift own their tricks; guest slug Spike / key horned_lizard — accept "horned_lizard" and "spike" (roster slug spike; campaign Spike); do NOT name a trick horned_lizard or spike or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or Horn or Bank or mining). Thank-yous denspike / inkspike / denscorona. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web horned_lizard-tricks.ts. Window-play FLASH unchanged. True Texas Horned Lizard Phrynosomatidae desk life — not chameleon/skink/anole/gecko/salamander/iguana/newt/frog/rui clones. Levee owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "horned_lizard";
  const TRICKS = ["bloodsquirt", "antfeast", "freezeflat", "rainharvest", "phrynosoma"];
  const HAPPY = ["denspike", "inkspike", "denscorona"];
  const HAPPY_DUR = { denspike: 2.12, inkspike: 2.26, denscorona: 2.18 };
  const PHRYNOSOMA_HOLD = 20.56;
  const RELEASE_S = 1.62;
  const DUR = { phrynosoma: PHRYNOSOMA_HOLD + RELEASE_S, bloodsquirt: 3.06, antfeast: 3.00, freezeflat: 3.22, rainharvest: 3.14 };

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
      if (kind === "phrynosoma") return 130 + roll * 12;
  if (kind === "bloodsquirt") return 20.4 + roll * 5.8;
  if (kind === "antfeast") return 21.6 + roll * 6.4;
  if (kind === "rainharvest") return 23.0 + roll * 7.0;
  return justFinished ? 19.0 + roll * 5.4 : 13.0 + roll * 4.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "phrynosoma";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "phrynosoma") {
      if (roll < 0.26) return "bloodsquirt";
      if (roll < 0.5) return "antfeast";
      if (roll < 0.74) return "freezeflat";
      return "rainharvest";
    }
    if (lastKind === "bloodsquirt") {
      if (roll < 0.26) return "phrynosoma";
      if (roll < 0.5) return "antfeast";
      if (roll < 0.74) return "freezeflat";
      return "rainharvest";
    }
    if (lastKind === "antfeast") {
      if (roll < 0.22) return "phrynosoma";
      if (roll < 0.44) return "bloodsquirt";
      if (roll < 0.68) return "freezeflat";
      return "rainharvest";
    }
    if (roll < 0.2) return "phrynosoma";
    if (roll < 0.4) return "bloodsquirt";
    if (roll < 0.6) return "antfeast";
    if (roll < 0.8) return "freezeflat";
    return "rainharvest";
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
    return key === TRICK_KEY || key === "spike";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denspike";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denspike" ? "sit" : name === "inkspike" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denspikePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspike));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.016, rot: s * 1.85, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const crown = Math.sin(t * 2.6) + 0.10 * Math.sin(t * 5.2);
      return { lift: 0.016 + Math.abs(crown) * 0.0080, rot: 1.85 + crown * 1.05, dx: crown * 0.00050, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.22 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkspikePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspike));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.042, rot: s * -2.55, dx: s * 0.00128, anim: "play" };
    }
    if (u < 0.85) {
      const ant = Math.sin(t * 2.7) + 0.12 * Math.sin(t * 5.4);
      return { lift: 0.042 + Math.abs(ant) * 0.014, rot: -2.55 + ant * 2.10, dx: ant * 0.00150, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.005 * (1 - s), rot: -0.34 * (1 - s), dx: 0, anim: "sit" };
  }
  function denscoronaPose(t) {
    return { lift: 0.0066 + Math.abs(Math.sin(t * 0.124)) * 0.0100, rot: Math.sin(t * 0.124) * 0.94, dx: Math.sin(t * 0.092) * 0.00054, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denspike") {
      const pose = denspikePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkspike") {
      const pose = inkspikePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscoronaPose(next.t);
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
      kind === "phrynosoma"
        ? "sit"
        : kind === "bloodsquirt"
          ? "play"
          : kind === "antfeast"
            ? "play"
            : kind === "freezeflat"
              ? "sit"
              : kind === "rainharvest"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "phrynosoma" ? "hold" : "go",
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


                      function phrynosomaPose(t) {
    const breath = Math.sin(t * 0.032) + 0.022 * Math.sin(t * 0.096);
    const settle = Math.abs(Math.sin(t * 0.034));
    return { lift: 0.0034 + settle * 0.0088, rot: 0.10 + breath * 0.38 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0028 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.09 * (1 - u) };
  }

  function bloodsquirtPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bloodsquirt));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0004, lift: s * 0.026, rot: s * 3.6 * face, anim: "play" };
    }
    if (u < 0.86) {
      const squirt = Math.sin((u - 0.09) / 0.77 * Math.PI * 5.2);
      const ocular = Math.sin(t * 6.2) + 0.14 * Math.sin(t * 12.4);
      return { x: fromX + face * (0.0004 + squirt * 0.0009 + ocular * 0.00020), lift: 0.022 + Math.abs(squirt) * 0.016 + Math.abs(ocular) * 0.006, rot: (3.6 + squirt * 2.6 + ocular * 1.4) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0004 * (1 - s), lift: 0.004 * (1 - s), rot: 0.34 * (1 - s) * face, anim: "idle" };
  }
  function antfeastPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antfeast));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0018, lift: s * 0.016, rot: s * -2.4 * face, anim: "play" };
    }
    if (u < 0.88) {
      const nibble = Math.sin((u - 0.10) / 0.78 * Math.PI * 6.8);
      const harvest = Math.sin(t * 7.6) + 0.13 * Math.sin(t * 15.2);
      return { x: fromX + face * (0.0018 + nibble * 0.0020 + harvest * 0.00028), lift: 0.014 + Math.abs(nibble) * 0.012 + Math.abs(harvest) * 0.005, rot: (-2.4 + nibble * 2.2 + harvest * 1.2) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0018 * (1 - s), lift: 0.003 * (1 - s), rot: -0.26 * (1 - s) * face, anim: "idle" };
  }
  function freezeflatPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.freezeflat));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0002, lift: s * 0.002, rot: s * 0.6 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const hush = Math.sin((u - 0.14) / 0.72 * Math.PI * 1.4);
      const sand = Math.sin(t * 1.6) + 0.08 * Math.sin(t * 3.2);
      return { x: fromX + face * (0.0002 + hush * 0.0003 + sand * 0.00010), lift: 0.001 + Math.abs(hush) * 0.004 + Math.abs(sand) * 0.002, rot: (0.6 + hush * 0.7 + sand * 0.4) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0002 * (1 - s), lift: 0.001 * (1 - s), rot: 0.12 * (1 - s) * face, anim: "idle" };
  }
  function rainharvestPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rainharvest));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0006, lift: s * 0.012, rot: s * -2.0 * face, anim: "talk" };
    }
    if (u < 0.84) {
      const channel = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.8);
      const drip = Math.sin(t * 3.0) + 0.11 * Math.sin(t * 6.0);
      return { x: fromX + face * (0.0006 + channel * 0.0008 + drip * 0.00018), lift: 0.010 + Math.abs(channel) * 0.010 + Math.abs(drip) * 0.004, rot: (-2.0 + channel * 1.6 + drip * 0.9) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.002 * (1 - s), rot: -0.22 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "bloodsquirt" && trick.kind !== "antfeast" && trick.kind !== "freezeflat" && trick.kind !== "rainharvest") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "phrynosoma") {
      if (next.t < PHRYNOSOMA_HOLD) {
        const pose = phrynosomaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PHRYNOSOMA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PHRYNOSOMA_HOLD);
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
    if (next.kind === "bloodsquirt") {
      const pose = bloodsquirtPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antfeast") {
      const pose = antfeastPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "freezeflat") {
      const pose = freezeflatPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = rainharvestPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    PHRYNOSOMA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    phrynosomaPose,
    releasePose,
    bloodsquirtPose,
    antfeastPose,
    freezeflatPose,
    rainharvestPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denspikePose,
    inkspikePose,
    denscoronaPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHornedLizardTricks = api;
})(typeof window !== "undefined" ? window : globalThis);