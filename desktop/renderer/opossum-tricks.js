/** Grin ground tricks while idle. House neighborly Didelphidae / Didelphis virginiana Virginia-opossum rafter-hem desk life — stillfeign / scrapnose / gapegrin / raftergrip / didelphis personality (stillfeign thanatosis limp-feign without naming dead or play or limp or feign or thanatosis or freeze or faint or flop or threat or warn, scrapnose hem-scrap forage without naming dig or bury or scratch or scrape or rake or fossick or litter or dirt or soil or hole or grub or forage or nose or sniff, gapegrin open-mouth defensive grin without naming hiss or gape or teeth or jaw or threat or warn or smile or bare or flash or pink, raftergrip prehensile rafter-grip climb without naming climb or grip or reach or hang or tail or curl or prehensile or rafter or hem or stretch or tall, long didelphis Didelphis virginiana freeze-alert pouch hold — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover; window-play RUN and Call Grin leave opossum alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe own their tricks; guest slug Grin / key opossum — accept "opossum" and "grin" (roster slug grin; campaign Grin); do NOT name a trick opossum or grin or possum or marsupial or pouch or cat or raccoon or skunk or ferret or weasel or mink or otter or coati or kinkajou). Thank-yous pouchden / inkgrin / denshem. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web opossum-tricks.ts. Window-play RUN unchanged. True Virginia-opossum Didelphidae desk life — not skunk/raccoon/otter/squirrel/bat/deer/solifuge/fox/rabbit/rui/ferret clones. Dam owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "opossum";
  const TRICKS = ["stillfeign", "scrapnose", "gapegrin", "raftergrip", "didelphis"];
  const HAPPY = ["pouchden", "inkgrin", "denshem"];
  const HAPPY_DUR = { pouchden: 1.94, inkgrin: 2.08, denshem: 2.00 };
  const DIDELPHIS_HOLD = 20.20;
  const RELEASE_S = 1.44;
  const DUR = { didelphis: DIDELPHIS_HOLD + RELEASE_S, stillfeign: 2.88, scrapnose: 2.82, gapegrin: 3.04, raftergrip: 2.96 };

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
      if (kind === "didelphis") return 112 + roll * 14;
  if (kind === "stillfeign") return 18.6 + roll * 7.6;
  if (kind === "scrapnose") return 19.8 + roll * 8.2;
  if (kind === "raftergrip") return 21.2 + roll * 8.8;
  return justFinished ? 17.2 + roll * 7.2 : 11.2 + roll * 6.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "didelphis";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "didelphis") {
      if (roll < 0.26) return "stillfeign";
      if (roll < 0.5) return "scrapnose";
      if (roll < 0.74) return "gapegrin";
      return "raftergrip";
    }
    if (lastKind === "stillfeign") {
      if (roll < 0.26) return "didelphis";
      if (roll < 0.5) return "scrapnose";
      if (roll < 0.74) return "gapegrin";
      return "raftergrip";
    }
    if (lastKind === "scrapnose") {
      if (roll < 0.22) return "didelphis";
      if (roll < 0.44) return "stillfeign";
      if (roll < 0.68) return "gapegrin";
      return "raftergrip";
    }
    if (roll < 0.2) return "didelphis";
    if (roll < 0.4) return "stillfeign";
    if (roll < 0.6) return "scrapnose";
    if (roll < 0.8) return "gapegrin";
    return "raftergrip";
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
    return key === TRICK_KEY || key === "grin";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "pouchden";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "pouchden" ? "sit" : name === "inkgrin" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function pouchdenPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pouchden));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.018, rot: s * 2.00, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 3.4) + 0.14 * Math.sin(t * 6.8);
      return { lift: 0.018 + Math.abs(flash) * 0.010, rot: 2.00 + flash * 1.14, dx: flash * 0.00064, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.003 * (1 - s), rot: 0.24 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkgrinPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgrin));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.036, rot: s * -2.60, dx: s * 0.00130, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 2.9) + 0.14 * Math.sin(t * 5.8);
      return { lift: 0.036 + Math.abs(spring) * 0.015, rot: -2.60 + spring * 2.10, dx: spring * 0.00168, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.007 * (1 - s), rot: -0.32 * (1 - s), dx: 0, anim: "sit" };
  }
  function denshemPose(t) {
    return { lift: 0.0076 + Math.abs(Math.sin(t * 0.142)) * 0.0116, rot: Math.sin(t * 0.142) * 1.02, dx: Math.sin(t * 0.108) * 0.00068, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "pouchden") {
      const pose = pouchdenPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkgrin") {
      const pose = inkgrinPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denshemPose(next.t);
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
      kind === "didelphis"
        ? "sit"
        : kind === "stillfeign"
          ? "play"
          : kind === "scrapnose"
            ? "play"
            : kind === "gapegrin"
              ? "talk"
              : kind === "raftergrip"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "didelphis" ? "hold" : "go",
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


                      function didelphisPose(t) {
    const breath = Math.sin(t * 0.042) + 0.032 * Math.sin(t * 0.126);
    const hush = Math.abs(Math.sin(t * 0.050));
    return { lift: 0.005 + hush * 0.009, rot: 0.26 + breath * 0.44 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0034 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.12 * (1 - u) };
  }

  function stillfeignPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stillfeign));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0014, lift: s * 0.022, rot: s * 8.4 * face, anim: "play" };
    }
    if (u < 0.28) {
      const s = smoothstep((u - 0.12) / 0.16);
      return { x: fromX + face * (0.0014 - s * 0.0004), lift: 0.022 - s * 0.034, rot: (8.4 - s * 11.2) * face, anim: "play" };
    }
    if (u < 0.88) {
      const limp = Math.sin(t * 1.1) * 0.08;
      return { x: fromX + face * 0.0010, lift: -0.014 + Math.abs(limp) * 0.003, rot: (-2.6 + limp) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0010 * (1 - s), lift: -0.003 * (1 - s), rot: -0.4 * (1 - s) * face, anim: "idle" };
  }
  function scrapnosePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scrapnose));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0013, lift: s * -0.016, rot: s * -3.8 * face, anim: "play" };
    }
    if (u < 0.88) {
      const root = Math.sin((u - 0.09) / 0.79 * Math.PI * 4.2);
      const sniff = Math.sin(t * 6.8) + 0.17 * Math.sin(t * 13.6);
      return { x: fromX + face * (0.0013 + root * 0.0016 + sniff * 0.00034), lift: -0.012 + Math.abs(root) * 0.015 + Math.abs(sniff) * 0.005, rot: (-3.8 + root * 3.8 + sniff * 2.0) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0013 * (1 - s), lift: -0.002 * (1 - s), rot: -0.5 * (1 - s) * face, anim: "idle" };
  }
  function gapegrinPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gapegrin));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0005, lift: s * 0.048, rot: s * 5.8 * face, anim: "talk" };
    }
    if (u < 0.84) {
      const sway = Math.sin((u - 0.12) / 0.72 * Math.PI * 2.2);
      const gape = Math.sin(t * 4.0) + 0.13 * Math.sin(t * 8.0);
      return { x: fromX + face * (0.0005 + sway * 0.0007 + gape * 0.00022), lift: 0.046 + Math.abs(sway) * 0.011 + Math.abs(gape) * 0.005, rot: (5.8 + sway * 2.0 + gape * 1.4) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.008 * (1 - s), rot: 0.7 * (1 - s) * face, anim: "idle" };
  }
  function raftergripPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.raftergrip));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * -0.0016, lift: s * 0.062, rot: s * -4.6 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const reach = Math.sin((u - 0.11) / 0.75 * Math.PI * 3.0);
      const curl = Math.sin(t * 5.2) + 0.15 * Math.sin(t * 10.4);
      return { x: fromX + face * (-0.0016 + reach * 0.0011 + curl * 0.00028), lift: 0.060 + Math.abs(reach) * 0.014 + Math.abs(curl) * 0.006, rot: (-4.6 + reach * 2.6 + curl * 1.7) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * -0.0016 * (1 - s), lift: 0.010 * (1 - s), rot: -0.55 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "stillfeign" && trick.kind !== "scrapnose" && trick.kind !== "gapegrin" && trick.kind !== "raftergrip") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "didelphis") {
      if (next.t < DIDELPHIS_HOLD) {
        const pose = didelphisPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DIDELPHIS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DIDELPHIS_HOLD);
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
    if (next.kind === "stillfeign") {
      const pose = stillfeignPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "scrapnose") {
      const pose = scrapnosePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gapegrin") {
      const pose = gapegrinPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = raftergripPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    DIDELPHIS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    didelphisPose,
    releasePose,
    stillfeignPose,
    scrapnosePose,
    gapegrinPose,
    raftergripPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    pouchdenPose,
    inkgrinPose,
    denshemPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOpossumTricks = api;
})(typeof window !== "undefined" ? window : globalThis);