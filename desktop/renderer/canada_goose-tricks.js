/** Vee ground tricks while idle. House neighborly Anatidae / Branta canada goose desk life — graze / hiss / nestguard / honk / branta personality (graze terrestrial blotter-lawn graze without naming dabble or tip or upend or forage-bill, hiss threat-hiss neck-forward without naming snore or cronk or keeyer or softcrouch, nestguard brood-territory plant without naming brood or nest or softcrouch or hangup or cache, honk chin-strap neck-stretch call without naming gruntwhistle or carol or feebee or sing or cry or call or song, long branta Branta canadensis chin-strap desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or oil or dab or tip; window-play leaves goose alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake own their tricks; guest slug Vee / key canada_goose — accept "canada_goose" and "vee"; do NOT name a trick canada_goose or vee or goose or dabble or tip or hop or soar or mantle). Thank-yous canadensis / maxima / interior. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web canada_goose-tricks.ts. Window-play unchanged. True Canada goose desk life — not mallard/robin/chickadee/hawk/owl/crow/raven clones. Drum owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "canada_goose";
  const TRICKS = ["graze", "hiss", "nestguard", "honk", "branta"];
  const HAPPY = ["canadensis", "maxima", "interior"];
  const HAPPY_DUR = { canadensis: 1.69, maxima: 1.84, interior: 1.75 };
  const BRANTA_HOLD = 19.72;
  const RELEASE_S = 1.18;
  const DUR = { branta: BRANTA_HOLD + RELEASE_S, graze: 2.62, hiss: 2.48, nestguard: 2.56, honk: 2.72 };

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
      if (kind === "branta") return 90 + roll * 38;
  if (kind === "graze") return 16.0 + roll * 12.8;
  if (kind === "hiss") return 17.4 + roll * 11.8;
  if (kind === "honk") return 21.2 + roll * 13.0;
  return justFinished ? 15.0 + roll * 11.0 : 8.8 + roll * 9.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "branta";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "branta") {
      if (roll < 0.26) return "graze";
      if (roll < 0.5) return "hiss";
      if (roll < 0.74) return "nestguard";
      return "honk";
    }
    if (lastKind === "graze") {
      if (roll < 0.26) return "branta";
      if (roll < 0.5) return "hiss";
      if (roll < 0.74) return "nestguard";
      return "honk";
    }
    if (lastKind === "hiss") {
      if (roll < 0.22) return "branta";
      if (roll < 0.44) return "graze";
      if (roll < 0.68) return "nestguard";
      return "honk";
    }
    if (roll < 0.2) return "branta";
    if (roll < 0.4) return "graze";
    if (roll < 0.6) return "hiss";
    if (roll < 0.8) return "nestguard";
    return "honk";
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
    return key === TRICK_KEY || key === "vee";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "canadensis";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "canadensis" ? "sit" : name === "maxima" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function canadensisPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.canadensis));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.020, rot: s * 2.40, dx: 0, anim: "sit" };
    }
    if (u < 0.83) {
      const flash = Math.sin(t * 5.2) + 0.24 * Math.sin(t * 10.4);
      return {
        lift: 0.020 + Math.abs(flash) * 0.014,
        rot: 2.40 + flash * 1.55,
        dx: flash * 0.0010,
        anim: "sit",
      };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: 0.009 * (1 - s), rot: 0.62 * (1 - s), dx: 0, anim: "idle" };
  }
  function maximaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.maxima));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.034, rot: s * -2.40, dx: s * 0.0016, anim: "play" };
    }
    if (u < 0.86) {
      const wriggle = Math.sin(t * 3.8) + 0.22 * Math.sin(t * 7.1);
      return {
        lift: 0.034 + Math.abs(wriggle) * 0.022,
        rot: -2.40 + wriggle * 2.45,
        dx: wriggle * 0.0021,
        anim: "play",
      };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.012 * (1 - s), rot: -0.45 * (1 - s), dx: 0, anim: "sit" };
  }
  function interiorPose(t) {
    return {
      lift: 0.008 + Math.abs(Math.sin(t * 0.26)) * 0.015,
      rot: Math.sin(t * 0.26) * 1.22,
      dx: Math.sin(t * 0.21) * 0.0011,
      anim: "sit",
    };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "canadensis") {
      const pose = canadensisPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "maxima") {
      const pose = maximaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = interiorPose(next.t);
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
      kind === "branta"
        ? "sit"
        : kind === "graze"
          ? "play"
          : kind === "hiss"
            ? "play"
            : kind === "nestguard"
              ? "sit"
              : kind === "honk"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "branta" ? "hold" : "go",
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


                      function brantaPose(t) {
    const breath = Math.sin(t * 0.082) + 0.08 * Math.sin(t * 0.21);
    const soft = Math.abs(Math.sin(t * 0.102));
    return {
      lift: 0.007 + soft * 0.015,
      rot: 0.72 + breath * 0.68,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.005 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.28 * (1 - u) };
  }

  function grazePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.graze));
    const face = facing == null ? 1 : facing;
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      // graze tips the neck to blotter lawn without naming dabble
      return { x: fromX, lift: s * -0.014, rot: s * 14.2 * face, anim: "play" };
    }
    if (u < 0.87) {
      const nibble = Math.sin(t * 2.8) + 0.2 * Math.sin(t * 5.6);
      return {
        x: fromX + face * nibble * 0.0022,
        lift: -0.014 + Math.abs(nibble) * 0.009,
        rot: (14.2 + nibble * 2.8) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.87) / 0.13);
    return {
      x: fromX,
      lift: -0.005 * (1 - s),
      rot: 2.0 * (1 - s) * face,
      anim: "idle",
    };
  }
  function hissPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hiss));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      // hiss plants low and leans into a threat
      return { x: fromX + face * s * 0.004, lift: s * -0.008, rot: s * -11.5 * face, anim: "play" };
    }
    if (u < 0.84) {
      const flare = Math.sin(t * 6.2) + 0.28 * Math.sin(t * 12.4);
      return {
        x: fromX + face * (0.004 + flare * 0.0016),
        lift: -0.008 + Math.abs(flare) * 0.011,
        rot: (-11.5 + flare * 3.4) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + face * 0.004 * (1 - s),
      lift: -0.003 * (1 - s),
      rot: -2.0 * (1 - s) * face,
      anim: "idle",
    };
  }
  function nestguardPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nestguard));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      // nestguard settles into a planted brood watch
      return { x: fromX, lift: s * 0.010, rot: s * 3.1 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const watch = Math.sin(t * 1.15) + 0.18 * Math.sin(t * 2.4);
      return {
        x: fromX + face * watch * 0.0010,
        lift: 0.010 + Math.abs(watch) * 0.007,
        rot: (3.1 + watch * 2.2) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 0.004 * (1 - s),
      rot: 0.6 * (1 - s) * face,
      anim: "idle",
    };
  }
  function honkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.honk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // honk stretches the chin-strap neck without naming cry
      return { x: fromX, lift: s * 0.036, rot: s * -4.5 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.10) / 0.76;
      const phrase = Math.sin(s * Math.PI * 3.0);
      const settle = Math.abs(Math.sin(s * Math.PI * 6.0));
      return {
        x: fromX + face * phrase * 0.0018,
        lift: 0.032 + settle * 0.014,
        rot: (-4.5 + phrase * 5.2) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 0.012 * (1 - s),
      rot: -0.8 * (1 - s) * face,
      anim: "idle",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "graze" && trick.kind !== "hiss" && trick.kind !== "nestguard" && trick.kind !== "honk") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "branta") {
      if (next.t < BRANTA_HOLD) {
        const pose = brantaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BRANTA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BRANTA_HOLD);
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
    if (next.kind === "graze") {
      const pose = grazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hiss") {
      const pose = hissPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nestguard") {
      const pose = nestguardPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = honkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    BRANTA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    brantaPose,
    releasePose,
    grazePose,
    hissPose,
    nestguardPose,
    honkPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    canadensisPose,
    maximaPose,
    interiorPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCanadaGooseTricks = api;
})(typeof window !== "undefined" ? window : globalThis);