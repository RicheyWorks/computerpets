/** Lid ground tricks while idle. House neighborly Emydidae / Terrapene carolina Eastern Box Turtle hinge-dome desk life — hingeshut / berryforage / shellsoak / nestscrape / carolinae personality (hingeshut hinged plastron shut without naming hinge or shut or close or box or clamp or seal or fold or clasp or vault or dome or lid or shell or hide or tuck or retreat or withdraw, berryforage woodland berry browse without naming berry or forage or browse or pluck or peck or nibble or hunt or seek or grub or sniff or root or graze or feed or snack, shellsoak shallow shell soak without naming shell or soak or bath or wallow or wet or puddle or pool or mud or dive or swim or float or settle or rest or lounge, nestscrape nest cup scrape without naming nest or scrape or dig or clutch or tunnel or cup or bowl or groove or pit or bury or cover or lay or excavate or shovel, long carolinae Terrapene carolina dome-calm hinge hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play FLASH and Call Lid leave box_turtle alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak own their tricks; guest slug Lid / key box_turtle — accept "box_turtle" and "lid" (roster slug lid; campaign Lid); do NOT name a trick box_turtle or lid or snapper or beak or crocodile or jaw or alligator or levee or turtle or ink or horned_lizard or spike or phrynosoma or chameleon or calyptratus or veiled or skink or plestiodon or fasciatus or anole or anolis or carolinensis or gecko or hemidactylus or turcicus or salamander or dapple or iguana or sol or newt or eft or caecilian or slip or frog or reed or toad or pebble or dash or densdash or inkdash or densbluff or wink or denswink or inkwink or densdewlap or shift or denshift or inkshift or denscasque or denspike or inkspike or denscorona or denslevee or inklevee or densscute or densjaw or inkjaw or denskeel or densbeak or inkbeak or densplastron or Horn or Bank or mining or tuatara). Thank-yous denslid / inklid / densdome. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web box_turtle-tricks.ts. Window-play FLASH unchanged. True Eastern Box Turtle Emydidae Terrapene desk life — not snapper/Chelydra, not croc/alligator/rui clones. Next house-order guest after Lid still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "box_turtle";
  const TRICKS = ["hingeshut", "berryforage", "shellsoak", "nestscrape", "carolinae"];
  const HAPPY = ["denslid", "inklid", "densdome"];
  const HAPPY_DUR = { denslid: 2.20, inklid: 2.34, densdome: 2.26 };
  const CAROLINAE_HOLD = 20.72;
  const RELEASE_S = 1.70;
  const DUR = { carolinae: CAROLINAE_HOLD + RELEASE_S, hingeshut: 3.14, berryforage: 3.08, shellsoak: 3.30, nestscrape: 3.22 };

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
      if (kind === "carolinae") return 138 + roll * 12;
  if (kind === "hingeshut") return 21.2 + roll * 5.0;
  if (kind === "berryforage") return 22.4 + roll * 5.6;
  if (kind === "shellsoak") return 22.6 + roll * 6.4;
  if (kind === "nestscrape") return 23.8 + roll * 6.2;
  return justFinished ? 19.8 + roll * 4.6 : 13.8 + roll * 3.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "carolinae";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "carolinae") {
      if (roll < 0.26) return "hingeshut";
      if (roll < 0.5) return "berryforage";
      if (roll < 0.74) return "shellsoak";
      return "nestscrape";
    }
    if (lastKind === "hingeshut") {
      if (roll < 0.26) return "carolinae";
      if (roll < 0.5) return "berryforage";
      if (roll < 0.74) return "shellsoak";
      return "nestscrape";
    }
    if (lastKind === "berryforage") {
      if (roll < 0.22) return "carolinae";
      if (roll < 0.44) return "hingeshut";
      if (roll < 0.68) return "shellsoak";
      return "nestscrape";
    }
    if (roll < 0.2) return "carolinae";
    if (roll < 0.4) return "hingeshut";
    if (roll < 0.6) return "berryforage";
    if (roll < 0.8) return "shellsoak";
    return "nestscrape";
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
    return key === TRICK_KEY || key === "lid";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denslid";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denslid" ? "sit" : name === "inklid" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denslidPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslid));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.014, rot: s * 1.55, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const dome = Math.sin(t * 2.4) + 0.10 * Math.sin(t * 4.8);
      return { lift: 0.014 + Math.abs(dome) * 0.0070, rot: 1.55 + dome * 0.92, dx: dome * 0.00044, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.18 * (1 - s), dx: 0, anim: "idle" };
  }
  function inklidPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inklid));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.040, rot: s * -2.50, dx: s * 0.00120, anim: "play" };
    }
    if (u < 0.85) {
      const roll = Math.sin(t * 2.7) + 0.12 * Math.sin(t * 5.4);
      return { lift: 0.040 + Math.abs(roll) * 0.014, rot: -2.50 + roll * 2.05, dx: roll * 0.00140, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.005 * (1 - s), rot: -0.32 * (1 - s), dx: 0, anim: "sit" };
  }
  function densdomePose(t) {
    return { lift: 0.0058 + Math.abs(Math.sin(t * 0.110)) * 0.0088, rot: Math.sin(t * 0.110) * 0.82, dx: Math.sin(t * 0.078) * 0.00048, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denslid") {
      const pose = denslidPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inklid") {
      const pose = inklidPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densdomePose(next.t);
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
      kind === "carolinae"
        ? "sit"
        : kind === "hingeshut"
          ? "sit"
          : kind === "berryforage"
            ? "play"
            : kind === "shellsoak"
              ? "sit"
              : kind === "nestscrape"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "carolinae" ? "hold" : "go",
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


                      function carolinaePose(t) {
    const breath = Math.sin(t * 0.024) + 0.014 * Math.sin(t * 0.078);
    const settle = Math.abs(Math.sin(t * 0.026));
    return { lift: 0.0028 + settle * 0.0076, rot: 0.07 + breath * 0.32 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.06 * (1 - u) };
  }

  function hingeshutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hingeshut));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX + face * s * 0.0004, lift: s * 0.012, rot: s * -1.8 * face, anim: "sit" };
    }
    if (u < 0.87) {
      const hinge = Math.sin((u - 0.13) / 0.74 * Math.PI * 2.0);
      const box = Math.sin(t * 1.6) + 0.09 * Math.sin(t * 3.2);
      return { x: fromX + face * (0.0004 + hinge * 0.0005 + box * 0.00014), lift: 0.010 + Math.abs(hinge) * 0.008 + Math.abs(box) * 0.002, rot: (-1.8 + hinge * 1.1 + box * 0.55) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return { x: fromX + face * 0.0004 * (1 - s), lift: 0.002 * (1 - s), rot: -0.20 * (1 - s) * face, anim: "idle" };
  }
  function berryforagePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.berryforage));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0016, lift: s * 0.028, rot: s * 2.2 * face, anim: "play" };
    }
    if (u < 0.85) {
      const forage = Math.sin((u - 0.11) / 0.74 * Math.PI * 4.2);
      const berry = Math.sin(t * 4.4) + 0.12 * Math.sin(t * 8.8);
      return { x: fromX + face * (0.0016 + forage * 0.0020 + berry * 0.00028), lift: 0.022 + Math.abs(forage) * 0.014 + Math.abs(berry) * 0.005, rot: (2.2 + forage * 2.4 + berry * 1.2) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { x: fromX + face * 0.0016 * (1 - s), lift: 0.004 * (1 - s), rot: 0.22 * (1 - s) * face, anim: "idle" };
  }
  function shellsoakPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.shellsoak));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0008, lift: s * 0.008, rot: s * 1.2 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const soak = Math.sin((u - 0.12) / 0.74 * Math.PI * 2.6);
      const shell = Math.sin(t * 2.2) + 0.10 * Math.sin(t * 4.4);
      return { x: fromX + face * (0.0008 + soak * 0.0010 + shell * 0.00020), lift: 0.006 + Math.abs(soak) * 0.010 + Math.abs(shell) * 0.003, rot: (1.2 + soak * 1.6 + shell * 0.90) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.002 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" };
  }
  function nestscrapePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nestscrape));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0020, lift: s * 0.038, rot: s * -2.8 * face, anim: "play" };
    }
    if (u < 0.84) {
      const scrape = Math.sin((u - 0.10) / 0.74 * Math.PI * 5.2);
      const nest = Math.sin(t * 5.8) + 0.13 * Math.sin(t * 11.6);
      return { x: fromX + face * (0.0020 + scrape * 0.0028 + nest * 0.00034), lift: 0.032 + Math.abs(scrape) * 0.016 + Math.abs(nest) * 0.006, rot: (-2.8 + scrape * 2.8 + nest * 1.5) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0020 * (1 - s), lift: 0.005 * (1 - s), rot: -0.30 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "hingeshut" && trick.kind !== "berryforage" && trick.kind !== "shellsoak" && trick.kind !== "nestscrape") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "carolinae") {
      if (next.t < CAROLINAE_HOLD) {
        const pose = carolinaePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CAROLINAE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CAROLINAE_HOLD);
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
    if (next.kind === "hingeshut") {
      const pose = hingeshutPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "berryforage") {
      const pose = berryforagePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "shellsoak") {
      const pose = shellsoakPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = nestscrapePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CAROLINAE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    carolinaePose,
    releasePose,
    hingeshutPose,
    berryforagePose,
    shellsoakPose,
    nestscrapePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denslidPose,
    inklidPose,
    densdomePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBoxTurtleTricks = api;
})(typeof window !== "undefined" ? window : globalThis);