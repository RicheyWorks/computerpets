/** Spine ground tricks while idle. House neighborly Erethizontidae / Erethizon dorsatum North-American-porcupine pine-post desk life — toothclack / boleclimb / cambiumchew / dorsoflare / erethizon personality (toothclack teeth-chatter warn without naming chatter or teeth or tooth or jaw or warn or threat or clack or click or snap or hiss or growl, boleclimb bole-trunk climb without naming climb or bole or trunk or tree or ascend or scramble or grip or claw or limb or pine or oak, cambiumchew cambium-bark browse without naming cambium or bark or chew or browse or peel or strip or gnaw or bite or wood or aspen or willow, dorsoflare dorsal-quill crest without naming quill or spine or dorsal or flare or crest or bristle or raise or rump or rear or needle or barb, long erethizon Erethizon dorsatum surface-alert pine-hush hold — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash; window-play RUN and Call Spine leave porcupine alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam own their tricks; guest slug Spine / key porcupine — accept "porcupine" and "spine" (roster slug spine; campaign Spine); do NOT name a trick porcupine or spine or quill or burr or hedgehog or parrot or beaver or muskrat or otter or mink or coypu or nutria or raccoon or skunk or opossum or ferret or weasel or Bank or mining). Thank-yous denspine / inkspine / denscrest. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web porcupine-tricks.ts. Window-play RUN unchanged. True North-American-porcupine Erethizontidae desk life — not beaver/opossum/skunk/raccoon/otter/squirrel/bat/deer/hedgehog/parrot/rui/ferret clones. Black Bear owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "porcupine";
  const TRICKS = ["toothclack", "boleclimb", "cambiumchew", "dorsoflare", "erethizon"];
  const HAPPY = ["denspine", "inkspine", "denscrest"];
  const HAPPY_DUR = { denspine: 1.98, inkspine: 2.12, denscrest: 2.04 };
  const ERETHIZON_HOLD = 20.28;
  const RELEASE_S = 1.48;
  const DUR = { erethizon: ERETHIZON_HOLD + RELEASE_S, toothclack: 2.92, boleclimb: 2.86, cambiumchew: 3.08, dorsoflare: 3.00 };

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
      if (kind === "erethizon") return 116 + roll * 12;
  if (kind === "toothclack") return 19.0 + roll * 7.2;
  if (kind === "boleclimb") return 20.2 + roll * 7.8;
  if (kind === "dorsoflare") return 21.6 + roll * 8.4;
  return justFinished ? 17.6 + roll * 6.8 : 11.6 + roll * 6.0;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "erethizon";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "erethizon") {
      if (roll < 0.26) return "toothclack";
      if (roll < 0.5) return "boleclimb";
      if (roll < 0.74) return "cambiumchew";
      return "dorsoflare";
    }
    if (lastKind === "toothclack") {
      if (roll < 0.26) return "erethizon";
      if (roll < 0.5) return "boleclimb";
      if (roll < 0.74) return "cambiumchew";
      return "dorsoflare";
    }
    if (lastKind === "boleclimb") {
      if (roll < 0.22) return "erethizon";
      if (roll < 0.44) return "toothclack";
      if (roll < 0.68) return "cambiumchew";
      return "dorsoflare";
    }
    if (roll < 0.2) return "erethizon";
    if (roll < 0.4) return "toothclack";
    if (roll < 0.6) return "boleclimb";
    if (roll < 0.8) return "cambiumchew";
    return "dorsoflare";
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
    return key === TRICK_KEY || key === "spine";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denspine";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denspine" ? "sit" : name === "inkspine" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denspinePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspine));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.017, rot: s * 1.95, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 3.1) + 0.13 * Math.sin(t * 6.2);
      return { lift: 0.017 + Math.abs(flash) * 0.009, rot: 1.95 + flash * 1.12, dx: flash * 0.00058, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.24 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkspinePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspine));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.040, rot: s * -2.50, dx: s * 0.00128, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 2.7) + 0.14 * Math.sin(t * 5.4);
      return { lift: 0.040 + Math.abs(spring) * 0.014, rot: -2.50 + spring * 2.05, dx: spring * 0.00155, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.007 * (1 - s), rot: -0.32 * (1 - s), dx: 0, anim: "sit" };
  }
  function denscrestPose(t) {
    return { lift: 0.0074 + Math.abs(Math.sin(t * 0.132)) * 0.0112, rot: Math.sin(t * 0.132) * 1.00, dx: Math.sin(t * 0.098) * 0.00062, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denspine") {
      const pose = denspinePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkspine") {
      const pose = inkspinePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscrestPose(next.t);
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
      kind === "erethizon"
        ? "sit"
        : kind === "toothclack"
          ? "talk"
          : kind === "boleclimb"
            ? "play"
            : kind === "cambiumchew"
              ? "play"
              : kind === "dorsoflare"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "erethizon" ? "hold" : "go",
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


                      function erethizonPose(t) {
    const breath = Math.sin(t * 0.038) + 0.028 * Math.sin(t * 0.112);
    const hush = Math.abs(Math.sin(t * 0.044));
    return { lift: 0.005 + hush * 0.011, rot: 0.22 + breath * 0.48 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0034 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.12 * (1 - u) };
  }

  function toothclackPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.toothclack));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0014, lift: s * 0.022, rot: s * 4.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const clack = Math.sin((u - 0.10) / 0.76 * Math.PI * 6.2);
      const jaw = Math.sin(t * 8.2) + 0.18 * Math.sin(t * 16.4);
      return { x: fromX + face * (0.0014 + clack * 0.0007 + jaw * 0.00022), lift: 0.018 + Math.abs(clack) * 0.010 + Math.abs(jaw) * 0.004, rot: (4.8 + clack * 2.8 + jaw * 1.6) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0014 * (1 - s), lift: 0.004 * (1 - s), rot: 0.50 * (1 - s) * face, anim: "idle" };
  }
  function boleclimbPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.boleclimb));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0018, lift: s * 0.052, rot: s * -3.6 * face, anim: "play" };
    }
    if (u < 0.84) {
      const haul = Math.sin((u - 0.11) / 0.73 * Math.PI * 2.8);
      const grip = Math.sin(t * 4.6) + 0.14 * Math.sin(t * 9.2);
      return { x: fromX + face * (0.0018 + haul * 0.0012 + grip * 0.00028), lift: 0.048 + Math.abs(haul) * 0.016 + Math.abs(grip) * 0.006, rot: (-3.6 + haul * 2.4 + grip * 1.4) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0018 * (1 - s), lift: 0.008 * (1 - s), rot: -0.50 * (1 - s) * face, anim: "idle" };
  }
  function cambiumchewPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cambiumchew));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0020, lift: s * -0.016, rot: s * -4.6 * face, anim: "play" };
    }
    if (u < 0.86) {
      const chew = Math.sin((u - 0.12) / 0.74 * Math.PI * 4.6);
      const peel = Math.sin(t * 6.8) + 0.15 * Math.sin(t * 13.6);
      return { x: fromX + face * (0.0020 + chew * 0.0010 + peel * 0.00026), lift: -0.014 + Math.abs(chew) * 0.013 + Math.abs(peel) * 0.005, rot: (-4.6 + chew * 3.2 + peel * 1.7) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0020 * (1 - s), lift: -0.003 * (1 - s), rot: -0.48 * (1 - s) * face, anim: "idle" };
  }
  function dorsoflarePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dorsoflare));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * -0.0006, lift: s * 0.036, rot: s * 5.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const flare = Math.sin((u - 0.10) / 0.76 * Math.PI * 3.2);
      const crest = Math.sin(t * 5.4) + 0.16 * Math.sin(t * 10.8);
      return { x: fromX + face * (-0.0006 + flare * 0.0011 + crest * 0.00024), lift: 0.032 + Math.abs(flare) * 0.014 + Math.abs(crest) * 0.006, rot: (5.8 + flare * 2.6 + crest * 1.5) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * -0.0006 * (1 - s), lift: 0.006 * (1 - s), rot: 0.55 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "toothclack" && trick.kind !== "boleclimb" && trick.kind !== "cambiumchew" && trick.kind !== "dorsoflare") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "erethizon") {
      if (next.t < ERETHIZON_HOLD) {
        const pose = erethizonPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ERETHIZON_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ERETHIZON_HOLD);
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
    if (next.kind === "toothclack") {
      const pose = toothclackPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "boleclimb") {
      const pose = boleclimbPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cambiumchew") {
      const pose = cambiumchewPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dorsoflarePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ERETHIZON_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    erethizonPose,
    releasePose,
    toothclackPose,
    boleclimbPose,
    cambiumchewPose,
    dorsoflarePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denspinePose,
    inkspinePose,
    denscrestPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPorcupineTricks = api;
})(typeof window !== "undefined" ? window : globalThis);