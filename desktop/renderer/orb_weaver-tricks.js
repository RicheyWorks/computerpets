/** Loom ground tricks while idle. House neighborly Araneidae / Araneus European garden spider desk life — radiate / stabilimentum / swathe / strum / araneus personality (radiate orb-radial frame-spin without naming web or silk or orb or spin or frame or loom or weave or hub, stabilimentum zigzag decoration without naming zigzag or decorate or banner or cross or diadem or ribbon, swathe prey-bundle turn without naming wrap or cocoon or parcel or bind or bolus or prey, strum signal-line vibrate without naming vibrate or pluck or twang or signal or shake or tremor, long araneus Araneus diadematus garden-orb hub perch — never named wait or sitweb or hubsit or roost or web or silk or wrap or hop or preen or fan or strut or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or oil or dab or tip or drum or sip or hover; window-play WEB and Call Loom leave orb_weaver alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own their tricks; guest slug Loom / key orb_weaver — accept "orb_weaver" and "loom"; do NOT name a trick orb_weaver or loom or web or silk or wrap or orb or spin or vibrate or zigzag or prey). Thank-yous diadematus / quadratus / marmoreus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web orb_weaver-tricks.ts. Window-play WEB unchanged. True European garden spider desk life — not hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Leap owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "orb_weaver";
  const TRICKS = ["radiate", "stabilimentum", "swathe", "strum", "araneus"];
  const HAPPY = ["diadematus", "quadratus", "marmoreus"];
  const HAPPY_DUR = { diadematus: 1.62, quadratus: 1.76, marmoreus: 1.68 };
  const ARANEUS_HOLD = 19.36;
  const RELEASE_S = 1.12;
  const DUR = { araneus: ARANEUS_HOLD + RELEASE_S, radiate: 2.56, stabilimentum: 2.68, swathe: 2.42, strum: 2.54 };

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
      if (kind === "araneus") return 88 + roll * 38;
  if (kind === "radiate") return 14.2 + roll * 12.4;
  if (kind === "stabilimentum") return 16.4 + roll * 12.6;
  if (kind === "strum") return 17.8 + roll * 12.2;
  return justFinished ? 14.0 + roll * 10.4 : 8.0 + roll * 9.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "araneus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "araneus") {
      if (roll < 0.26) return "radiate";
      if (roll < 0.5) return "stabilimentum";
      if (roll < 0.74) return "swathe";
      return "strum";
    }
    if (lastKind === "radiate") {
      if (roll < 0.26) return "araneus";
      if (roll < 0.5) return "stabilimentum";
      if (roll < 0.74) return "swathe";
      return "strum";
    }
    if (lastKind === "stabilimentum") {
      if (roll < 0.22) return "araneus";
      if (roll < 0.44) return "radiate";
      if (roll < 0.68) return "swathe";
      return "strum";
    }
    if (roll < 0.2) return "araneus";
    if (roll < 0.4) return "radiate";
    if (roll < 0.6) return "stabilimentum";
    if (roll < 0.8) return "swathe";
    return "strum";
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
    return key === TRICK_KEY || key === "loom";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "diadematus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "diadematus" ? "sit" : name === "quadratus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function diadematusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.diadematus));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.020, rot: s * 2.15, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.24 * Math.sin(t * 11.6);
      return { lift: 0.020 + Math.abs(flash) * 0.014, rot: 2.15 + flash * 1.65, dx: flash * 0.0010, anim: "sit" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.008 * (1 - s), rot: 0.42 * (1 - s), dx: 0, anim: "idle" };
  }
  function quadratusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.quadratus));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.034, rot: s * -2.35, dx: s * 0.0014, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.2) + 0.23 * Math.sin(t * 8.4);
      return { lift: 0.034 + Math.abs(wriggle) * 0.020, rot: -2.35 + wriggle * 2.55, dx: wriggle * 0.0022, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.011 * (1 - s), rot: -0.40 * (1 - s), dx: 0, anim: "sit" };
  }
  function marmoreusPose(t) {
    return { lift: 0.009 + Math.abs(Math.sin(t * 0.28)) * 0.015, rot: Math.sin(t * 0.28) * 1.22, dx: Math.sin(t * 0.22) * 0.0010, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "diadematus") {
      const pose = diadematusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "quadratus") {
      const pose = quadratusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = marmoreusPose(next.t);
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
      kind === "araneus"
        ? "sit"
        : kind === "radiate"
          ? "play"
          : kind === "stabilimentum"
            ? "play"
            : kind === "swathe"
              ? "sit"
              : kind === "strum"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "araneus" ? "hold" : "go",
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


                      function araneusPose(t) {
    const breath = Math.sin(t * 0.09) + 0.06 * Math.sin(t * 0.27);
    const hub = Math.abs(Math.sin(t * 0.19));
    return { lift: 0.008 + hub * 0.010, rot: 0.32 + breath * 0.58 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.005 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.18 * (1 - u) };
  }

  function radiatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.radiate));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * 0.028, rot: s * 11.2 * face, anim: "play" };
    }
    if (u < 0.88) {
      const spoke = Math.sin(t * 5.4) + 0.22 * Math.sin(t * 10.8);
      const turn = Math.sin((u - 0.11) / 0.77 * Math.PI * 3.0);
      return { x: fromX + face * spoke * 0.0013, lift: 0.026 + Math.abs(spoke) * 0.009, rot: (11.2 + turn * 7.5 + spoke * 2.4) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.008 * (1 - s), rot: 1.8 * (1 - s) * face, anim: "idle" };
  }
  function stabilimentumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stabilimentum));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.003, lift: s * 0.032, rot: s * -6.4 * face, anim: "play" };
    }
    if (u < 0.87) {
      const zig = Math.sin((u - 0.12) / 0.75 * Math.PI * 4.0);
      const bob = Math.sin(t * 4.8) + 0.18 * Math.sin(t * 9.6);
      return { x: fromX + face * (0.003 + zig * 0.007 + bob * 0.0012), lift: 0.030 + Math.abs(zig) * 0.014 + Math.abs(bob) * 0.006, rot: (-6.4 + zig * 12.0 + bob * 2.2) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return { x: fromX + face * 0.003 * (1 - s), lift: 0.010 * (1 - s), rot: -1.2 * (1 - s) * face, anim: "idle" };
  }
  function swathePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.swathe));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 0.022, rot: s * 9.6 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const roll = Math.sin(t * 3.6) + 0.24 * Math.sin(t * 7.2);
      return { x: fromX + face * roll * 0.0009, lift: 0.020 + Math.abs(roll) * 0.011, rot: (9.6 + roll * 5.8) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.006 * (1 - s), rot: 1.2 * (1 - s) * face, anim: "idle" };
  }
  function strumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.strum));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX, lift: s * 0.018, rot: s * -4.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.09) / 0.77;
      const pulse = Math.sin(s * Math.PI * 7.2);
      const shiver = Math.abs(Math.sin(s * Math.PI * 14.4));
      return { x: fromX + face * pulse * 0.0016, lift: 0.016 + shiver * 0.010, rot: (-4.8 + pulse * 5.4) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 0.006 * (1 - s), rot: -0.8 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "radiate" && trick.kind !== "stabilimentum" && trick.kind !== "swathe" && trick.kind !== "strum") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "araneus") {
      if (next.t < ARANEUS_HOLD) {
        const pose = araneusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ARANEUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ARANEUS_HOLD);
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
    if (next.kind === "radiate") {
      const pose = radiatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stabilimentum") {
      const pose = stabilimentumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "swathe") {
      const pose = swathePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = strumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ARANEUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    araneusPose,
    releasePose,
    radiatePose,
    stabilimentumPose,
    swathePose,
    strumPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    diadematusPose,
    quadratusPose,
    marmoreusPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOrbWeaverTricks = api;
})(typeof window !== "undefined" ? window : globalThis);