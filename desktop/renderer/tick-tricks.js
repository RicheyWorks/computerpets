/** Clasp ground tricks while idle. House neighborly Ixodidae / Ixodes scapularis black-legged-tick desk life — quest / haller / hypostome / engorge / ixodes personality (quest questing foreleg-raise without naming wait or still or freeze or nod or bob or wave or tip or feel or sense or probe or antennule or palp or flagellum or acetic, haller Haller organ tarsal-sense without naming sense or feel or probe or tip or wave or bob or hallers or antennule or palpcrush or pedipalp or metasoma, hypostome hypostome blotter-anchor without naming clasp or grip or latch or cling or pinch or chelate or crush or seize or hold or bite or suck or blood, engorge engorge settle-swell without naming eat or feed or swell or fill or gorged or bloodmeal or suck or latch or meal or chew, long ixodes Ixodes scapularis blotter-hem hold — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or urticate or threat or cork or ecdysis or aphonopelma or hourglass or tangle or wrap or gumfoot or latrodectus or legwave or oscillate or autotomy or gregarious or phalangium or pedipalp or metasoma or fluoresce or sanddig or centruroides or flagellum or acetic or palpcrush or trayburrow or mastigoproctus or promenade or oil or dab or tip or drum or sip or hover; window-play CARRY and Call Clasp leave tick alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip own their tricks; guest slug Clasp / key tick — accept "tick" and "clasp"; do NOT name a trick tick or clasp or insect or mite or spider or scorpion or silk or web or venom or gaze). Thank-yous scapularis / deerhost / blackleg. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web tick-tricks.ts. Window-play CARRY unchanged. True ixodid black-legged-tick desk life — not vinegaroon/scorpion/harvestman/widow/tarantula/wolf-spider/jumping-spider/orb-weaver/crayfish clones. Gale owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "tick";
  const TRICKS = ["quest", "haller", "hypostome", "engorge", "ixodes"];
  const HAPPY = ["scapularis", "deerhost", "blackleg"];
  const HAPPY_DUR = { scapularis: 1.78, deerhost: 1.92, blackleg: 1.84 };
  const IXODES_HOLD = 19.88;
  const RELEASE_S = 1.28;
  const DUR = { ixodes: IXODES_HOLD + RELEASE_S, quest: 2.72, haller: 2.66, hypostome: 2.88, engorge: 2.80 };

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
      if (kind === "ixodes") return 96 + roll * 30;
  if (kind === "quest") return 16.2 + roll * 10.0;
  if (kind === "haller") return 17.4 + roll * 10.6;
  if (kind === "engorge") return 18.8 + roll * 11.2;
  return justFinished ? 15.6 + roll * 8.8 : 9.6 + roll * 8.0;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "ixodes";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "ixodes") {
      if (roll < 0.26) return "quest";
      if (roll < 0.5) return "haller";
      if (roll < 0.74) return "hypostome";
      return "engorge";
    }
    if (lastKind === "quest") {
      if (roll < 0.26) return "ixodes";
      if (roll < 0.5) return "haller";
      if (roll < 0.74) return "hypostome";
      return "engorge";
    }
    if (lastKind === "haller") {
      if (roll < 0.22) return "ixodes";
      if (roll < 0.44) return "quest";
      if (roll < 0.68) return "hypostome";
      return "engorge";
    }
    if (roll < 0.2) return "ixodes";
    if (roll < 0.4) return "quest";
    if (roll < 0.6) return "haller";
    if (roll < 0.8) return "hypostome";
    return "engorge";
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
    return key === TRICK_KEY || key === "clasp";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "scapularis";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "scapularis" ? "sit" : name === "deerhost" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function scapularisPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scapularis));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.016, rot: s * 2.20, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.0) + 0.14 * Math.sin(t * 8.0);
      return { lift: 0.016 + Math.abs(flash) * 0.011, rot: 2.20 + flash * 1.35, dx: flash * 0.00070, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.004 * (1 - s), rot: 0.28 * (1 - s), dx: 0, anim: "idle" };
  }
  function deerhostPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.deerhost));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.034, rot: s * -2.80, dx: s * 0.0014, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 2.9) + 0.16 * Math.sin(t * 5.8);
      return { lift: 0.034 + Math.abs(spring) * 0.016, rot: -2.80 + spring * 2.20, dx: spring * 0.0018, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.010 * (1 - s), rot: -0.36 * (1 - s), dx: 0, anim: "sit" };
  }
  function blacklegPose(t) {
    return { lift: 0.008 + Math.abs(Math.sin(t * 0.16)) * 0.012, rot: Math.sin(t * 0.16) * 1.10, dx: Math.sin(t * 0.12) * 0.00070, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "scapularis") {
      const pose = scapularisPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "deerhost") {
      const pose = deerhostPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = blacklegPose(next.t);
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
      kind === "ixodes"
        ? "sit"
        : kind === "quest"
          ? "talk"
          : kind === "haller"
            ? "talk"
            : kind === "hypostome"
              ? "play"
              : kind === "engorge"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "ixodes" ? "hold" : "go",
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


                      function ixodesPose(t) {
    const breath = Math.sin(t * 0.048) + 0.040 * Math.sin(t * 0.14);
    const wait = Math.abs(Math.sin(t * 0.072));
    return { lift: 0.006 + wait * 0.006, rot: 0.28 + breath * 0.38 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0038 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.14 * (1 - u) };
  }

  function questPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.quest));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0012, lift: s * 0.028, rot: s * -8.4 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const quest = Math.sin((u - 0.11) / 0.75 * Math.PI * 4.4);
      const feel = Math.sin(t * 6.6) + 0.16 * Math.sin(t * 13.2);
      return { x: fromX + face * (0.0012 + quest * 0.0014 + feel * 0.00035), lift: 0.024 + Math.abs(quest) * 0.014 + Math.abs(feel) * 0.005, rot: (-8.4 + quest * 3.2 + feel * 1.8) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.006 * (1 - s), rot: -1.2 * (1 - s) * face, anim: "idle" };
  }
  function hallerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.haller));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0008, lift: s * 0.014, rot: s * 4.6 * face, anim: "talk" };
    }
    if (u < 0.88) {
      const sense = Math.sin((u - 0.10) / 0.78 * Math.PI * 5.6);
      const organ = Math.sin(t * 8.2) + 0.20 * Math.sin(t * 16.4);
      return { x: fromX + face * (0.0008 + sense * 0.0018 + organ * 0.00045), lift: 0.012 + Math.abs(sense) * 0.010 + Math.abs(organ) * 0.004, rot: (4.6 + sense * 3.4 + organ * 2.2) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.003 * (1 - s), rot: 0.7 * (1 - s) * face, anim: "idle" };
  }
  function hypostomePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hypostome));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0018, lift: s * -0.010, rot: s * 6.2 * face, anim: "play" };
    }
    if (u < 0.84) {
      const anchor = Math.sin((u - 0.12) / 0.72 * Math.PI * 3.2);
      const tooth = Math.sin(t * 4.8) + 0.18 * Math.sin(t * 9.6);
      return { x: fromX + face * (0.0018 + anchor * 0.0010 + tooth * 0.0004), lift: -0.008 + Math.abs(anchor) * 0.008 + Math.abs(tooth) * 0.004, rot: (6.2 + anchor * 2.2 + tooth * 1.4) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0018 * (1 - s), lift: -0.002 * (1 - s), rot: 0.9 * (1 - s) * face, anim: "idle" };
  }
  function engorgePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.engorge));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX - face * s * 0.0006, lift: s * -0.004, rot: s * 2.4 * face, anim: "play" };
    }
    if (u < 0.86) {
      const fill = Math.sin((u - 0.14) / 0.72 * Math.PI);
      const pulse = Math.sin(t * 2.6) + 0.12 * Math.sin(t * 5.2);
      return { x: fromX - face * (0.0006 + fill * 0.0008), lift: -0.002 + fill * 0.018 + Math.abs(pulse) * 0.006, rot: (2.4 + fill * 1.8 + pulse * 1.0) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX - face * 0.0006 * (1 - s), lift: 0.004 * (1 - s), rot: 0.4 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "quest" && trick.kind !== "haller" && trick.kind !== "hypostome" && trick.kind !== "engorge") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "ixodes") {
      if (next.t < IXODES_HOLD) {
        const pose = ixodesPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < IXODES_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - IXODES_HOLD);
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
    if (next.kind === "quest") {
      const pose = questPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "haller") {
      const pose = hallerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hypostome") {
      const pose = hypostomePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = engorgePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    IXODES_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    ixodesPose,
    releasePose,
    questPose,
    hallerPose,
    hypostomePose,
    engorgePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    scapularisPose,
    deerhostPose,
    blacklegPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetTickTricks = api;
})(typeof window !== "undefined" ? window : globalThis);