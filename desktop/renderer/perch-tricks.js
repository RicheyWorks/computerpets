/** Bar ground tricks while idle. House neighborly Percidae / Perca flavescens Yellow Perch tiger-bar school life — tigerbar / schoolhover / duskrise / ribbonspawn / flavescens personality (tigerbar vertical tiger-bar flash without naming tiger or bar or stripe or vertical or flank or mark or paint or band or flash or show or idle or quiet or cruise or glide or swim or hold or float, schoolhover school midwater hover without naming school or hover or midwater or shoal or pack or cruise or glide or float or drift or hold or idle or quiet or swim or mill or gather, duskrise dusk surface rise-feed without naming dusk or rise or feed or surface or insect or peck or sip or boil or flash or forage or snatch or gulp or mouth or lip or evening or twilight, ribbonspawn gelatin egg-ribbon spawn without naming ribbon or spawn or gelatin or egg or nest or bed or gravel or male or fry or dens or wash or dig or hole or brood or guard or jelly or strand, round flavescens Perca flavescens Percidae yellow perch hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or platehover or colonyfan or insectpeck or gillflare or macrochirus or denspenny or inkpenny or densplate or barbelprobe or cavitynest or mudcloud or caudalthrash or ictalurus or denswhisk or inkwhisk or densbarbel or driftfeed or insectrise or reddscrape or vermicflash or fontinalis or densspeck or inkspeck or densredd or coverstrike or bedfan or surboil or latline or salmoides or denslunge or inklunge or densgape or parietalgaze or nuchalrise or burrowsit or eggseize or punctatus or denspeak or inkpeak or densisle or hingeshut or berryforage or shellsoak or nestscrape or carolinae or denslid or inklid or densdome or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLARE and Call Bar leave perch alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny own their tricks; guest slug Bar / key perch — accept "perch" and "bar" (roster slug bar; campaign Bar); do NOT confuse with Barb the scorpion (key scorpion / slug barb); do NOT name a trick perch or bar or bluegill or penny or catfish or whisk or brook_trout or speck or bass or lunge or tuatara or peak or box_turtle or lid or snapper or beak or crocodile or jaw or alligator or levee or turtle or ink or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or denslevee or inklevee or densscute or densjaw or inkjaw or denskeel or densbeak or inkbeak or densplastron or denslid or inklid or densdome or denspeak or inkpeak or densisle or denslunge or inklunge or densgape or densspeck or inkspeck or densredd or denswhisk or inkwhisk or densbarbel or denspenny or inkpenny or densplate or Horn or Bank or mining or lizard or reef or coral or salt). Thank-yous densbar / inkbar / denstiger. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web perch-tricks.ts. Window-play FLARE unchanged. True Yellow Perch Perca flavescens Percidae desk life — not Lepomis bluegill/Centrarchidae, not Ictalurus channel catfish/Ictaluridae, not Salvelinus brook trout/Salmonidae, not Micropterus bass/Centrarchidae clones (coverstrike/bedfan/surboil/latline), not Centruroides scorpion/Barb, not tuatara/Rhynchocephalia, not reef fish clones. Next house-order guest after Bar still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "perch";
  const TRICKS = ["tigerbar", "schoolhover", "duskrise", "ribbonspawn", "flavescens"];
  const HAPPY = ["densbar", "inkbar", "denstiger"];
  const HAPPY_DUR = { densbar: 2.32, inkbar: 2.50, denstiger: 2.38 };
  const FLAVESCENS_HOLD = 21.36;
  const RELEASE_S = 1.90;
  const DUR = { flavescens: FLAVESCENS_HOLD + RELEASE_S, tigerbar: 3.36, schoolhover: 3.44, duskrise: 3.50, ribbonspawn: 3.42 };

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
      if (kind === "flavescens") return 150 + roll * 12;
  if (kind === "tigerbar") return 22.6 + roll * 4.4;
  if (kind === "schoolhover") return 24.8 + roll * 4.2;
  if (kind === "duskrise") return 24.2 + roll * 5.4;
  if (kind === "ribbonspawn") return 25.2 + roll * 5.6;
  return justFinished ? 21.0 + roll * 3.4 : 15.0 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "flavescens";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "flavescens") {
      if (roll < 0.26) return "tigerbar";
      if (roll < 0.5) return "schoolhover";
      if (roll < 0.74) return "duskrise";
      return "ribbonspawn";
    }
    if (lastKind === "tigerbar") {
      if (roll < 0.26) return "flavescens";
      if (roll < 0.5) return "schoolhover";
      if (roll < 0.74) return "duskrise";
      return "ribbonspawn";
    }
    if (lastKind === "schoolhover") {
      if (roll < 0.22) return "flavescens";
      if (roll < 0.44) return "tigerbar";
      if (roll < 0.68) return "duskrise";
      return "ribbonspawn";
    }
    if (roll < 0.2) return "flavescens";
    if (roll < 0.4) return "tigerbar";
    if (roll < 0.6) return "schoolhover";
    if (roll < 0.8) return "duskrise";
    return "ribbonspawn";
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
    return key === TRICK_KEY || key === "bar";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densbar";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densbar" ? "sit" : name === "inkbar" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function densbarPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbar));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.010, rot: s * 1.08, dx: 0, anim: "sit" };
    }
    if (u < 0.86) {
      const hold = Math.sin(t * 1.72) + 0.08 * Math.sin(t * 3.44);
      return { lift: 0.010 + Math.abs(hold) * 0.0050, rot: 1.08 + hold * 0.64, dx: hold * 0.00026, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0018 * (1 - s), rot: 0.10 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkbarPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkbar));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.048, rot: s * -2.35, dx: s * 0.00125, anim: "play" };
    }
    if (u < 0.85) {
      const roll = Math.sin(t * 2.70) + 0.11 * Math.sin(t * 5.4);
      return { lift: 0.048 + Math.abs(roll) * 0.012, rot: -2.35 + roll * 2.05, dx: roll * 0.00145, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.0044 * (1 - s), rot: -0.24 * (1 - s), dx: 0, anim: "sit" };
  }
  function denstigerPose(t) {
    return { lift: 0.0046 + Math.abs(Math.sin(t * 0.082)) * 0.0072, rot: Math.sin(t * 0.082) * 0.66, dx: Math.sin(t * 0.054) * 0.00032, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densbar") {
      const pose = densbarPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkbar") {
      const pose = inkbarPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denstigerPose(next.t);
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
      kind === "flavescens"
        ? "sit"
        : kind === "tigerbar"
          ? "sit"
          : kind === "schoolhover"
            ? "sit"
            : kind === "duskrise"
              ? "talk"
              : kind === "ribbonspawn"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "flavescens" ? "hold" : "go",
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


                      function flavescensPose(t) {
    const breath = Math.sin(t * 0.014) + 0.010 * Math.sin(t * 0.044);
    const hover = Math.abs(Math.sin(t * 0.017));
    return { lift: 0.0028 + hover * 0.0058, rot: 0.04 + breath * 0.26 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.04 * (1 - u) };
  }

  function tigerbarPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tigerbar));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0010, lift: s * 0.014, rot: s * -1.15 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const bar = Math.sin((u - 0.12) / 0.74 * Math.PI * 2.8);
      const stripe = Math.sin(t * 1.35) + 0.09 * Math.sin(t * 2.7);
      return { x: fromX + face * (0.0010 + bar * 0.0020 + stripe * 0.00020), lift: 0.012 + Math.abs(bar) * 0.010 + Math.abs(stripe) * 0.0032, rot: (-1.15 + bar * 1.35 + stripe * 0.55) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0010 * (1 - s), lift: 0.0020 * (1 - s), rot: -0.12 * (1 - s) * face, anim: "idle" };
  }
  function schoolhoverPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.schoolhover));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0004, lift: s * 0.011, rot: s * 0.95 * face, anim: "sit" };
    }
    if (u < 0.87) {
      const school = Math.sin((u - 0.11) / 0.76 * Math.PI * 2.8);
      const drift = Math.sin(t * 1.42) + 0.08 * Math.sin(t * 2.84);
      return { x: fromX + face * (0.0004 + school * 0.0018 + drift * 0.00022), lift: 0.010 + Math.abs(school) * 0.007 + Math.abs(drift) * 0.0024, rot: (0.95 + school * 1.15 + drift * 0.55) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return { x: fromX + face * 0.0004 * (1 - s), lift: 0.0016 * (1 - s), rot: 0.10 * (1 - s) * face, anim: "idle" };
  }
  function duskrisePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.duskrise));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.0010, lift: s * 0.032, rot: s * -1.28 * face, anim: "talk" };
    }
    if (u < 0.85) {
      const rise = Math.sin((u - 0.13) / 0.72 * Math.PI * 3.8);
      const peck = Math.sin(t * 2.95) + 0.10 * Math.sin(t * 5.9);
      return { x: fromX + face * (0.0010 + rise * 0.0018 + peck * 0.00024), lift: 0.030 + Math.abs(rise) * 0.012 + Math.abs(peck) * 0.0045, rot: (-1.28 + rise * 1.85 + peck * 0.82) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX + face * 0.0010 * (1 - s), lift: 0.0030 * (1 - s), rot: -0.14 * (1 - s) * face, anim: "idle" };
  }
  function ribbonspawnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ribbonspawn));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0014, lift: s * 0.036, rot: s * 2.05 * face, anim: "play" };
    }
    if (u < 0.84) {
      const ribbon = Math.sin((u - 0.10) / 0.74 * Math.PI * 3.2);
      const gel = Math.sin(t * 3.35) + 0.12 * Math.sin(t * 6.7);
      return { x: fromX + face * (0.0014 + ribbon * 0.0024 + gel * 0.00028), lift: 0.033 + Math.abs(ribbon) * 0.016 + Math.abs(gel) * 0.006, rot: (2.05 + ribbon * 1.85 + gel * 1.10) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0014 * (1 - s), lift: 0.0034 * (1 - s), rot: 0.18 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "tigerbar" && trick.kind !== "schoolhover" && trick.kind !== "duskrise" && trick.kind !== "ribbonspawn") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "flavescens") {
      if (next.t < FLAVESCENS_HOLD) {
        const pose = flavescensPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < FLAVESCENS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - FLAVESCENS_HOLD);
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
    if (next.kind === "tigerbar") {
      const pose = tigerbarPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "schoolhover") {
      const pose = schoolhoverPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "duskrise") {
      const pose = duskrisePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = ribbonspawnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    FLAVESCENS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    flavescensPose,
    releasePose,
    tigerbarPose,
    schoolhoverPose,
    duskrisePose,
    ribbonspawnPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densbarPose,
    inkbarPose,
    denstigerPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPerchTricks = api;
})(typeof window !== "undefined" ? window : globalThis);