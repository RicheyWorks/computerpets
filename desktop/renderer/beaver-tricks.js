/** Dam ground tricks while idle. House neighborly Castoridae / Castor canadensis North-American-beaver lodge-cup desk life — woodfell / paddleclap / lodgehaul / mudpack / castor personality (woodfell fell-gnaw timber without naming fell or gnaw or chop or bite or cut or timber or wood or bark or chip or tooth or teeth or aspen or willow, paddleclap paddle-tail slap without naming slap or clap or smack or warn or threat or splash or paddle or flat or bang or thump or alarm, lodgehaul lodge-stick haul without naming haul or drag or carry or stick or lodge or dam or ferry or load or tug or pull or timber, mudpack mud-seal pack without naming mud or pack or seal or plaster or pat or smear or clay or bank or wall or chink, long castor Castor canadensis surface-alert dive-hush hold — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover; window-play RUN and Call Dam leave beaver alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin own their tricks; guest slug Dam / key beaver — accept "beaver" and "dam" (roster slug dam; campaign Dam); do NOT name a trick beaver or dam or muskrat or otter or mink or coypu or nutria or raccoon or skunk or opossum or ferret or weasel or Bank or mining). Thank-yous denslodge / inkdam / densmud. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web beaver-tricks.ts. Window-play RUN unchanged. True North-American-beaver Castoridae desk life — not opossum/skunk/raccoon/otter/squirrel/bat/deer/solifuge/fox/rabbit/rui/ferret clones. Spine owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "beaver";
  const TRICKS = ["woodfell", "paddleclap", "lodgehaul", "mudpack", "castor"];
  const HAPPY = ["denslodge", "inkdam", "densmud"];
  const HAPPY_DUR = { denslodge: 1.96, inkdam: 2.10, densmud: 2.02 };
  const CASTOR_HOLD = 20.24;
  const RELEASE_S = 1.46;
  const DUR = { castor: CASTOR_HOLD + RELEASE_S, woodfell: 2.90, paddleclap: 2.84, lodgehaul: 3.06, mudpack: 2.98 };

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
      if (kind === "castor") return 114 + roll * 12;
  if (kind === "woodfell") return 18.8 + roll * 7.4;
  if (kind === "paddleclap") return 20.0 + roll * 8.0;
  if (kind === "mudpack") return 21.4 + roll * 8.6;
  return justFinished ? 17.4 + roll * 7.0 : 11.4 + roll * 6.2;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "castor";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "castor") {
      if (roll < 0.26) return "woodfell";
      if (roll < 0.5) return "paddleclap";
      if (roll < 0.74) return "lodgehaul";
      return "mudpack";
    }
    if (lastKind === "woodfell") {
      if (roll < 0.26) return "castor";
      if (roll < 0.5) return "paddleclap";
      if (roll < 0.74) return "lodgehaul";
      return "mudpack";
    }
    if (lastKind === "paddleclap") {
      if (roll < 0.22) return "castor";
      if (roll < 0.44) return "woodfell";
      if (roll < 0.68) return "lodgehaul";
      return "mudpack";
    }
    if (roll < 0.2) return "castor";
    if (roll < 0.4) return "woodfell";
    if (roll < 0.6) return "paddleclap";
    if (roll < 0.8) return "lodgehaul";
    return "mudpack";
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
    return key === TRICK_KEY || key === "dam";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denslodge";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denslodge" ? "sit" : name === "inkdam" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denslodgePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslodge));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.016, rot: s * 1.90, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 3.2) + 0.13 * Math.sin(t * 6.4);
      return { lift: 0.016 + Math.abs(flash) * 0.009, rot: 1.90 + flash * 1.10, dx: flash * 0.00060, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.22 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkdamPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkdam));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.038, rot: s * -2.40, dx: s * 0.00124, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 2.8) + 0.14 * Math.sin(t * 5.6);
      return { lift: 0.038 + Math.abs(spring) * 0.014, rot: -2.40 + spring * 2.00, dx: spring * 0.00160, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.007 * (1 - s), rot: -0.30 * (1 - s), dx: 0, anim: "sit" };
  }
  function densmudPose(t) {
    return { lift: 0.0072 + Math.abs(Math.sin(t * 0.136)) * 0.0110, rot: Math.sin(t * 0.136) * 0.98, dx: Math.sin(t * 0.102) * 0.00064, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denslodge") {
      const pose = denslodgePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkdam") {
      const pose = inkdamPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densmudPose(next.t);
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
      kind === "castor"
        ? "sit"
        : kind === "woodfell"
          ? "play"
          : kind === "paddleclap"
            ? "play"
            : kind === "lodgehaul"
              ? "talk"
              : kind === "mudpack"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "castor" ? "hold" : "go",
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


                      function castorPose(t) {
    const breath = Math.sin(t * 0.040) + 0.030 * Math.sin(t * 0.118);
    const hush = Math.abs(Math.sin(t * 0.046));
    return { lift: 0.004 + hush * 0.010, rot: 0.24 + breath * 0.46 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0032 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.11 * (1 - u) };
  }

  function woodfellPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.woodfell));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0016, lift: s * -0.018, rot: s * -5.2 * face, anim: "play" };
    }
    if (u < 0.86) {
      const gnaw = Math.sin((u - 0.10) / 0.76 * Math.PI * 5.0);
      const chip = Math.sin(t * 7.4) + 0.16 * Math.sin(t * 14.8);
      return { x: fromX + face * (0.0016 + gnaw * 0.0009 + chip * 0.00026), lift: -0.016 + Math.abs(gnaw) * 0.012 + Math.abs(chip) * 0.005, rot: (-5.2 + gnaw * 3.4 + chip * 1.8) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0016 * (1 - s), lift: -0.003 * (1 - s), rot: -0.55 * (1 - s) * face, anim: "idle" };
  }
  function paddleclapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.paddleclap));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * -0.0008, lift: s * 0.042, rot: s * 6.4 * face, anim: "play" };
    }
    if (u < 0.28) {
      const s = smoothstep((u - 0.11) / 0.17);
      return { x: fromX + face * (-0.0008 + s * 0.0004), lift: 0.042 - s * 0.058, rot: (6.4 - s * 10.8) * face, anim: "play" };
    }
    if (u < 0.88) {
      const slap = Math.sin((u - 0.28) / 0.60 * Math.PI * 3.4);
      const wet = Math.sin(t * 5.8) + 0.14 * Math.sin(t * 11.6);
      return { x: fromX + face * (-0.0004 + slap * 0.0010 + wet * 0.00024), lift: -0.012 + Math.abs(slap) * 0.018 + Math.abs(wet) * 0.005, rot: (-4.0 + slap * 3.6 + wet * 1.6) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * -0.0004 * (1 - s), lift: -0.002 * (1 - s), rot: -0.45 * (1 - s) * face, anim: "idle" };
  }
  function lodgehaulPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lodgehaul));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0022, lift: s * 0.028, rot: s * 4.2 * face, anim: "talk" };
    }
    if (u < 0.84) {
      const haul = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.6);
      const tug = Math.sin(t * 4.4) + 0.13 * Math.sin(t * 8.8);
      return { x: fromX + face * (0.0022 + haul * 0.0014 + tug * 0.00030), lift: 0.024 + Math.abs(haul) * 0.012 + Math.abs(tug) * 0.006, rot: (4.2 + haul * 2.2 + tug * 1.5) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0022 * (1 - s), lift: 0.006 * (1 - s), rot: 0.55 * (1 - s) * face, anim: "idle" };
  }
  function mudpackPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mudpack));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0010, lift: s * -0.014, rot: s * 3.6 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const pack = Math.sin((u - 0.10) / 0.76 * Math.PI * 4.0);
      const pat = Math.sin(t * 6.2) + 0.15 * Math.sin(t * 12.4);
      return { x: fromX + face * (0.0010 + pack * 0.0012 + pat * 0.00028), lift: -0.010 + Math.abs(pack) * 0.014 + Math.abs(pat) * 0.006, rot: (3.6 + pack * 2.8 + pat * 1.7) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0010 * (1 - s), lift: -0.002 * (1 - s), rot: 0.4 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "woodfell" && trick.kind !== "paddleclap" && trick.kind !== "lodgehaul" && trick.kind !== "mudpack") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "castor") {
      if (next.t < CASTOR_HOLD) {
        const pose = castorPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CASTOR_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CASTOR_HOLD);
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
    if (next.kind === "woodfell") {
      const pose = woodfellPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "paddleclap") {
      const pose = paddleclapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lodgehaul") {
      const pose = lodgehaulPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = mudpackPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CASTOR_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    castorPose,
    releasePose,
    woodfellPose,
    paddleclapPose,
    lodgehaulPose,
    mudpackPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denslodgePose,
    inkdamPose,
    densmudPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBeaverTricks = api;
})(typeof window !== "undefined" ? window : globalThis);