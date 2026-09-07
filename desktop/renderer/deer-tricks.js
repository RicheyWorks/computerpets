/** Flag ground tricks while idle. House neighborly Cervidae / Odocoileus virginianus white-tailed deer oak-edge desk life — flagtail / edgebrowse / earswivel / forestamp / odocoileus personality (flagtail white caudal flag flash without naming flag or caudal or scut or tail or wave or bob or tip or alarm or snort or stot or pronk or leap or hop, edgebrowse oak-edge browse nibble without naming browse or eat or feed or graze or forage or chew or bite or nip or graze or branta or dabble, earswivel pinna cup-and-swivel without naming ear or pinna or listen or hear or sense or feel or probe or haller or antennule or palp, forestamp forefoot stamp warn without naming stamp or stomp or kick or pound or thump or strike or run or dart or dash or sprint or chase or hunt, long odocoileus Odocoileus virginianus freeze-alert oak-edge hold — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or urticate or threat or cork or ecdysis or aphonopelma or hourglass or tangle or wrap or gumfoot or latrodectus or legwave or oscillate or autotomy or gregarious or phalangium or pedipalp or metasoma or fluoresce or sanddig or centruroides or flagellum or acetic or palpcrush or trayburrow or mastigoproctus or quest or haller or hypostome or engorge or ixodes or malleoli or suctorial or chelicrush or sprintburst or eremobates or promenade or oil or dab or tip or drum or sip or hover; window-play RUN and Call Flag leave deer alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale own their tricks; guest slug Flag / key deer — accept "deer" and "rack" (roster slug rack; campaign Flag); do NOT name a trick deer or flag or rack or moose or cervid or ungulate or antler or velvet or scent or gaze). Thank-yous virginianus / couesi / oakedge. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web deer-tricks.ts. Window-play RUN unchanged. True white-tailed deer Cervidae desk life — not solifuge/tick/vinegaroon/scorpion/harvestman/fox/rabbit/rui clones. Cape owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "deer";
  const TRICKS = ["flagtail", "edgebrowse", "earswivel", "forestamp", "odocoileus"];
  const HAPPY = ["virginianus", "couesi", "oakedge"];
  const HAPPY_DUR = { virginianus: 1.82, couesi: 1.96, oakedge: 1.88 };
  const ODOCOILEUS_HOLD = 19.96;
  const RELEASE_S = 1.32;
  const DUR = { odocoileus: ODOCOILEUS_HOLD + RELEASE_S, flagtail: 2.76, edgebrowse: 2.70, earswivel: 2.92, forestamp: 2.84 };

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
      if (kind === "odocoileus") return 100 + roll * 26;
  if (kind === "flagtail") return 17.0 + roll * 9.2;
  if (kind === "edgebrowse") return 18.2 + roll * 9.8;
  if (kind === "forestamp") return 19.6 + roll * 10.4;
  return justFinished ? 16.0 + roll * 8.4 : 10.0 + roll * 7.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "odocoileus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "odocoileus") {
      if (roll < 0.26) return "flagtail";
      if (roll < 0.5) return "edgebrowse";
      if (roll < 0.74) return "earswivel";
      return "forestamp";
    }
    if (lastKind === "flagtail") {
      if (roll < 0.26) return "odocoileus";
      if (roll < 0.5) return "edgebrowse";
      if (roll < 0.74) return "earswivel";
      return "forestamp";
    }
    if (lastKind === "edgebrowse") {
      if (roll < 0.22) return "odocoileus";
      if (roll < 0.44) return "flagtail";
      if (roll < 0.68) return "earswivel";
      return "forestamp";
    }
    if (roll < 0.2) return "odocoileus";
    if (roll < 0.4) return "flagtail";
    if (roll < 0.6) return "edgebrowse";
    if (roll < 0.8) return "earswivel";
    return "forestamp";
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
    return key === TRICK_KEY || key === "rack";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "virginianus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "virginianus" ? "sit" : name === "couesi" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function virginianusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.virginianus));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.020, rot: s * 2.20, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.0) + 0.14 * Math.sin(t * 8.0);
      return { lift: 0.020 + Math.abs(flash) * 0.013, rot: 2.20 + flash * 1.35, dx: flash * 0.00070, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.005 * (1 - s), rot: 0.28 * (1 - s), dx: 0, anim: "idle" };
  }
  function couesiPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.couesi));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.038, rot: s * -2.80, dx: s * 0.0015, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.0) + 0.16 * Math.sin(t * 6.0);
      return { lift: 0.038 + Math.abs(spring) * 0.017, rot: -2.80 + spring * 2.20, dx: spring * 0.0019, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.010 * (1 - s), rot: -0.36 * (1 - s), dx: 0, anim: "sit" };
  }
  function oakedgePose(t) {
    return { lift: 0.008 + Math.abs(Math.sin(t * 0.17)) * 0.013, rot: Math.sin(t * 0.17) * 1.10, dx: Math.sin(t * 0.13) * 0.00075, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "virginianus") {
      const pose = virginianusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "couesi") {
      const pose = couesiPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = oakedgePose(next.t);
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
      kind === "odocoileus"
        ? "sit"
        : kind === "flagtail"
          ? "play"
          : kind === "edgebrowse"
            ? "talk"
            : kind === "earswivel"
              ? "talk"
              : kind === "forestamp"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "odocoileus" ? "hold" : "go",
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


                      function odocoileusPose(t) {
    const breath = Math.sin(t * 0.048) + 0.036 * Math.sin(t * 0.14);
    const hush = Math.abs(Math.sin(t * 0.062));
    return { lift: 0.006 + hush * 0.006, rot: 0.28 + breath * 0.38 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0036 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.14 * (1 - u) };
  }

  function flagtailPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.flagtail));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0012, lift: s * 0.042, rot: s * -4.8 * face, anim: "play" };
    }
    if (u < 0.86) {
      const flag = Math.sin((u - 0.10) / 0.76 * Math.PI * 4.4);
      const flash = Math.sin(t * 6.6) + 0.18 * Math.sin(t * 13.2);
      return { x: fromX + face * (0.0012 + flag * 0.0010 + flash * 0.00032), lift: 0.038 + Math.abs(flag) * 0.016 + Math.abs(flash) * 0.007, rot: (-4.8 + flag * 3.2 + flash * 1.8) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0012 * (1 - s), lift: 0.008 * (1 - s), rot: -0.8 * (1 - s) * face, anim: "idle" };
  }
  function edgebrowsePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.edgebrowse));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0018, lift: s * -0.022, rot: s * 6.2 * face, anim: "talk" };
    }
    if (u < 0.84) {
      const nip = Math.sin((u - 0.12) / 0.72 * Math.PI * 3.8);
      const chew = Math.sin(t * 5.2) + 0.16 * Math.sin(t * 10.4);
      return { x: fromX + face * (0.0018 + nip * 0.0011 + chew * 0.00028), lift: -0.018 + Math.abs(nip) * 0.012 + Math.abs(chew) * 0.005, rot: (6.2 + nip * 2.6 + chew * 1.5) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0018 * (1 - s), lift: -0.004 * (1 - s), rot: 0.9 * (1 - s) * face, anim: "idle" };
  }
  function earswivelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.earswivel));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0006, lift: s * 0.012, rot: s * 3.6 * face, anim: "talk" };
    }
    if (u < 0.88) {
      const swivel = Math.sin((u - 0.10) / 0.78 * Math.PI * 5.6);
      const cup = Math.sin(t * 8.2) + 0.20 * Math.sin(t * 16.4);
      return { x: fromX + face * (0.0006 + swivel * 0.0009 + cup * 0.00026), lift: 0.010 + Math.abs(swivel) * 0.010 + Math.abs(cup) * 0.004, rot: (3.6 + swivel * 4.2 + cup * 2.2) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0006 * (1 - s), lift: 0.003 * (1 - s), rot: 0.6 * (1 - s) * face, anim: "idle" };
  }
  function forestampPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.forestamp));
    const face = facing == null ? 1 : facing;
    if (u < 0.08) {
      const s = smoothstep(u / 0.08);
      return { x: fromX + face * s * 0.0014, lift: s * 0.028, rot: s * -3.4 * face, anim: "play" };
    }
    if (u < 0.55) {
      const stamp = Math.sin((u - 0.08) / 0.47 * Math.PI * 4.0);
      const thump = Math.sin(t * 11.0) + 0.14 * Math.sin(t * 22.0);
      return { x: fromX + face * (0.0014 + Math.abs(stamp) * 0.0008 + thump * 0.00030), lift: 0.010 + Math.abs(stamp) * 0.024 + Math.abs(thump) * 0.008, rot: (-3.4 + stamp * 2.8 + thump * 1.6) * face, anim: "play" };
    }
    if (u < 0.88) {
      const settle = Math.sin((u - 0.55) / 0.33 * Math.PI);
      return { x: fromX + face * (0.0020 - settle * 0.0006), lift: 0.014 + Math.abs(settle) * 0.010, rot: (-1.0 + settle * 1.8) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0014 * (1 - s), lift: 0.004 * (1 - s), rot: -0.3 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "flagtail" && trick.kind !== "edgebrowse" && trick.kind !== "earswivel" && trick.kind !== "forestamp") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "odocoileus") {
      if (next.t < ODOCOILEUS_HOLD) {
        const pose = odocoileusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ODOCOILEUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ODOCOILEUS_HOLD);
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
    if (next.kind === "flagtail") {
      const pose = flagtailPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "edgebrowse") {
      const pose = edgebrowsePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "earswivel") {
      const pose = earswivelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = forestampPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ODOCOILEUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    odocoileusPose,
    releasePose,
    flagtailPose,
    edgebrowsePose,
    earswivelPose,
    forestampPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    virginianusPose,
    couesiPose,
    oakedgePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDeerTricks = api;
})(typeof window !== "undefined" ? window : globalThis);