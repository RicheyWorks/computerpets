/** Whisk ground tricks while idle. House neighborly Ictaluridae / Ictalurus punctatus Channel Catfish mud-bottom whisker desk life — barbelprobe / cavitynest / mudcloud / caudalthrash / ictalurus personality (barbelprobe barbel taste-probe bottom without naming barbel or whisker or probe or taste or bottom or mud or silt or sniff or sense or mouth or lip or chin or forage or crawl or idle or quiet or cruise or glide or swim, cavitynest cavity nest spawn without naming cavity or nest or spawn or hole or brood or guard or sit or hover or wash or dig or scrape or fan or bed or gravel or male or egg or fry or den, mudcloud mud-cloud settle without naming mud or cloud or silt or settle or stir or thrash or boil or splash or surge or burst or hide or bury or dust or plume or haze, caudalthrash caudal thrash surge without naming caudal or thrash or surge or tail or fin or bolt or dash or burst or leap or jump or sprint or power or kick or slap or whip, long ictalurus Ictalurus punctatus Ictaluridae channel hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or driftfeed or insectrise or reddscrape or vermicflash or fontinalis or densspeck or inkspeck or densredd or coverstrike or bedfan or surboil or latline or salmoides or denslunge or inklunge or densgape or parietalgaze or nuchalrise or burrowsit or eggseize or punctatus or denspeak or inkpeak or densisle or hingeshut or berryforage or shellsoak or nestscrape or carolinae or denslid or inklid or densdome or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Whisk leave catfish alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck own their tricks; guest slug Whisk / key catfish — accept "catfish" and "whisk" (roster slug whisk; campaign Whisk); do NOT name a trick catfish or whisk or brook_trout or speck or bass or lunge or tuatara or peak or box_turtle or lid or snapper or beak or crocodile or jaw or alligator or levee or turtle or ink or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or denslevee or inklevee or densscute or densjaw or inkjaw or denskeel or densbeak or inkbeak or densplastron or denslid or inklid or densdome or denspeak or inkpeak or densisle or denslunge or inklunge or densgape or densspeck or inkspeck or densredd or Horn or Bank or mining or lizard or reef or coral or salt). Thank-yous denswhisk / inkwhisk / densbarbel. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web catfish-tricks.ts. Window-play FLASH unchanged. True Channel Catfish Ictalurus punctatus Ictaluridae desk life — not Salvelinus brook trout/Salmonidae, not Micropterus bass/Centrarchidae, not tuatara/Rhynchocephalia, not reef fish clones. Next house-order guest after Whisk still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "catfish";
  const TRICKS = ["barbelprobe", "cavitynest", "mudcloud", "caudalthrash", "ictalurus"];
  const HAPPY = ["denswhisk", "inkwhisk", "densbarbel"];
  const HAPPY_DUR = { denswhisk: 2.28, inkwhisk: 2.44, densbarbel: 2.34 };
  const ICTALURUS_HOLD = 21.08;
  const RELEASE_S = 1.88;
  const DUR = { ictalurus: ICTALURUS_HOLD + RELEASE_S, barbelprobe: 3.34, cavitynest: 3.26, mudcloud: 3.48, caudalthrash: 3.40 };

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
      if (kind === "ictalurus") return 146 + roll * 12;
  if (kind === "barbelprobe") return 22.8 + roll * 4.2;
  if (kind === "cavitynest") return 24.0 + roll * 4.8;
  if (kind === "mudcloud") return 23.4 + roll * 6.0;
  if (kind === "caudalthrash") return 25.4 + roll * 5.4;
  return justFinished ? 20.6 + roll * 3.8 : 14.6 + roll * 3.0;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "ictalurus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "ictalurus") {
      if (roll < 0.26) return "barbelprobe";
      if (roll < 0.5) return "cavitynest";
      if (roll < 0.74) return "mudcloud";
      return "caudalthrash";
    }
    if (lastKind === "barbelprobe") {
      if (roll < 0.26) return "ictalurus";
      if (roll < 0.5) return "cavitynest";
      if (roll < 0.74) return "mudcloud";
      return "caudalthrash";
    }
    if (lastKind === "cavitynest") {
      if (roll < 0.22) return "ictalurus";
      if (roll < 0.44) return "barbelprobe";
      if (roll < 0.68) return "mudcloud";
      return "caudalthrash";
    }
    if (roll < 0.2) return "ictalurus";
    if (roll < 0.4) return "barbelprobe";
    if (roll < 0.6) return "cavitynest";
    if (roll < 0.8) return "mudcloud";
    return "caudalthrash";
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
    return key === TRICK_KEY || key === "whisk";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denswhisk";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denswhisk" ? "sit" : name === "inkwhisk" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denswhiskPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswhisk));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.011, rot: s * 1.18, dx: 0, anim: "sit" };
    }
    if (u < 0.86) {
      const hold = Math.sin(t * 1.95) + 0.10 * Math.sin(t * 3.9);
      return { lift: 0.011 + Math.abs(hold) * 0.0060, rot: 1.18 + hold * 0.78, dx: hold * 0.00034, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0018 * (1 - s), rot: 0.14 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkwhiskPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwhisk));
    if (u < 0.09) {
      const s = u / 0.09;
      return { lift: s * 0.048, rot: s * -2.45, dx: s * 0.00135, anim: "play" };
    }
    if (u < 0.85) {
      const roll = Math.sin(t * 2.75) + 0.13 * Math.sin(t * 5.5);
      return { lift: 0.048 + Math.abs(roll) * 0.015, rot: -2.45 + roll * 2.15, dx: roll * 0.00155, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.0045 * (1 - s), rot: -0.30 * (1 - s), dx: 0, anim: "sit" };
  }
  function densbarbelPose(t) {
    return { lift: 0.0046 + Math.abs(Math.sin(t * 0.092)) * 0.0074, rot: Math.sin(t * 0.092) * 0.68, dx: Math.sin(t * 0.062) * 0.00038, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denswhisk") {
      const pose = denswhiskPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkwhisk") {
      const pose = inkwhiskPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densbarbelPose(next.t);
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
      kind === "ictalurus"
        ? "sit"
        : kind === "barbelprobe"
          ? "talk"
          : kind === "cavitynest"
            ? "sit"
            : kind === "mudcloud"
              ? "play"
              : kind === "caudalthrash"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "ictalurus" ? "hold" : "go",
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


                      function ictalurusPose(t) {
    const breath = Math.sin(t * 0.017) + 0.013 * Math.sin(t * 0.055);
    const hover = Math.abs(Math.sin(t * 0.021));
    return { lift: 0.0026 + hover * 0.0058, rot: 0.04 + breath * 0.31 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0021 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.04 * (1 - u) };
  }

  function barbelprobePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.barbelprobe));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0010, lift: s * 0.008, rot: s * -0.95 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const probe = Math.sin((u - 0.14) / 0.72 * Math.PI * 2.4);
      const taste = Math.sin(t * 1.35) + 0.09 * Math.sin(t * 2.7);
      return { x: fromX + face * (0.0010 + probe * 0.0020 + taste * 0.00018), lift: 0.007 + Math.abs(probe) * 0.007 + Math.abs(taste) * 0.0025, rot: (-0.95 + probe * 0.95 + taste * 0.48) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0010 * (1 - s), lift: 0.0012 * (1 - s), rot: -0.10 * (1 - s) * face, anim: "idle" };
  }
  function cavitynestPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cavitynest));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0004, lift: s * 0.005, rot: s * 1.15 * face, anim: "sit" };
    }
    if (u < 0.87) {
      const nest = Math.sin((u - 0.11) / 0.76 * Math.PI * 2.8);
      const brood = Math.sin(t * 2.2) + 0.08 * Math.sin(t * 4.4);
      return { x: fromX + face * (0.0004 + nest * 0.0011 + brood * 0.00016), lift: 0.004 + Math.abs(nest) * 0.008 + Math.abs(brood) * 0.0028, rot: (1.15 + nest * 1.4 + brood * 0.72) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return { x: fromX + face * 0.0004 * (1 - s), lift: 0.0009 * (1 - s), rot: 0.12 * (1 - s) * face, anim: "idle" };
  }
  function mudcloudPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mudcloud));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0007, lift: s * 0.022, rot: s * -1.8 * face, anim: "play" };
    }
    if (u < 0.83) {
      const cloud = Math.sin((u - 0.10) / 0.73 * Math.PI * 3.8);
      const silt = Math.sin(t * 3.1) + 0.12 * Math.sin(t * 6.2);
      return { x: fromX + face * (0.0007 + cloud * 0.0026 + silt * 0.00032), lift: 0.020 + Math.abs(cloud) * 0.016 + Math.abs(silt) * 0.006, rot: (-1.8 + cloud * 2.6 + silt * 1.15) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.83) / 0.17);
    return { x: fromX + face * 0.0007 * (1 - s), lift: 0.003 * (1 - s), rot: -0.18 * (1 - s) * face, anim: "idle" };
  }
  function caudalthrashPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.caudalthrash));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0014, lift: s * 0.036, rot: s * 2.1 * face, anim: "play" };
    }
    if (u < 0.84) {
      const thrash = Math.sin((u - 0.09) / 0.75 * Math.PI * 4.2);
      const surge = Math.sin(t * 4.0) + 0.14 * Math.sin(t * 8.0);
      return { x: fromX + face * (0.0014 + thrash * 0.0030 + surge * 0.00034), lift: 0.032 + Math.abs(thrash) * 0.020 + Math.abs(surge) * 0.008, rot: (2.1 + thrash * 2.2 + surge * 1.35) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0014 * (1 - s), lift: 0.0035 * (1 - s), rot: 0.20 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "barbelprobe" && trick.kind !== "cavitynest" && trick.kind !== "mudcloud" && trick.kind !== "caudalthrash") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "ictalurus") {
      if (next.t < ICTALURUS_HOLD) {
        const pose = ictalurusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ICTALURUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ICTALURUS_HOLD);
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
    if (next.kind === "barbelprobe") {
      const pose = barbelprobePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cavitynest") {
      const pose = cavitynestPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mudcloud") {
      const pose = mudcloudPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = caudalthrashPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ICTALURUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    ictalurusPose,
    releasePose,
    barbelprobePose,
    cavitynestPose,
    mudcloudPose,
    caudalthrashPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denswhiskPose,
    inkwhiskPose,
    densbarbelPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCatfishTricks = api;
})(typeof window !== "undefined" ? window : globalThis);