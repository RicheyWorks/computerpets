/** Vee ground tricks while idle — ultra-polish pass. House neighborly Anatidae / Branta canada goose desk life — graze / hiss / nestguard / honk / triumph / chinstrap / branta personality (graze terrestrial blotter-lawn graze without naming graze or tip or hiss or forage-bill, hiss threat-hiss neck-forward without naming snore or cronk or keeyer or softcrouch, nestguard brood-territory plant without naming brood or nest or softcrouch or hangup or cache, honk chin-strap neck-stretch call without naming honk or carol or feebee or sing or cry or call or song, triumph triumph-ceremony wing-half and neck-bob without naming kettle or stoop or bind or fan or strut or tumble, chinstrap white-cheek chin-strap flash without naming capflash or chinstrap or rufous or flash-of-hawk, long branta Branta canadensis chin-strap desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid or kettle or stoop or bind or keeyer or patagial or tower or buteo or feebee or gargle or hangup or cache or capflash or seedhammer or poecile or runstop or listen or carol or tug or rufous or tailcock or turdus or graze or hiss or nestguard or honk or chinstrap or triumph or branta or oil or dab or tip; window-play leaves goose alone; Soot/Wedge/Heart/Hook/Dee/Brick/Vee own their tricks; guest slug Vee / key canada_goose — accept "canada_goose" and "vee"; do NOT name a trick canada_goose or vee or goose or graze or tip or hop or soar or mantle). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous canadensis / maxima / interior. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web canada_goose-tricks.ts. Window-play unchanged. True Canada goose desk life — not canada_goose/robin/chickadee/hawk/owl/crow/raven clones. Drum owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via canada_goose.wav. Amplitudes raised toward Rui richness; denser waits/weights (BRANTA_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names canada_goose/vee/honk/loaf as bare ethogram-only trick kinds. Window-play unchanged. Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; Peck now Rue-dense; next leftover Quill / parrot. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "canada_goose";
  const TRICKS = ["graze", "hiss", "nestguard", "honk", "triumph", "chinstrap", "branta"];
  const HAPPY = ["canadensis", "maxima", "interior"];
  const HAPPY_DUR = { canadensis: 1.69, maxima: 1.84, interior: 1.75 };
  const BRANTA_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    branta: BRANTA_HOLD + RELEASE_S,
    graze: 2.54,
    hiss: 2.48,
    nestguard: 2.56,
    honk: 2.60,
    triumph: 2.42,
    chinstrap: 2.38,
  };

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
    if (kind === "branta") return 40 + roll * 26;
    if (kind === "graze" || kind === "hiss" || kind === "nestguard" || kind === "honk" || kind === "triumph" || kind === "chinstrap") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "branta";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) => (k === "branta" ? 0.72 : k === "graze" || k === "honk" ? 1.28 : k === "hiss" || k === "triumph" ? 1.18 : 1.08));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "graze";
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
      anim: name === "maxima" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function canadensisPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.canadensis));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 7.2, rot: s * 14.4, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.5) + 0.26 * Math.sin(t * 11.2);
      return { lift: 7.2 + Math.abs(flash) * 6, rot: 14.4 + flash * 9.6, dx: flash * 2.64, anim: "sit" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function maximaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.maxima));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 16.8, rot: s * -14.4, dx: s * 3.6, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.2) + 0.25 * Math.sin(t * 7.6);
      return { lift: 14.4 + Math.abs(wriggle) * 12, rot: -12 + wriggle * 16.8, dx: wriggle * 4.8, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" };
  }

  function interiorPose(t) {
    return {
      lift: 3.6 + Math.abs(Math.sin(t * 4.0)) * 8.4,
      rot: Math.sin(t * 3.4) * 10.8,
      dx: Math.sin(t * 2.6) * 3.6,
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
    const pose =
      next.kind === "canadensis"
        ? canadensisPose(next.t)
        : next.kind === "maxima"
          ? maximaPose(next.t)
          : interiorPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "branta" || kind === "nestguard" || kind === "chinstrap"
        ? "sit"
        : kind === "graze" || kind === "hiss" || kind === "triumph"
          ? "play"
          : kind === "honk"
            ? "talk"
            : "sit";
    return {
      kind,
      phase: kind === "branta" ? "hold" : "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim,
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function brantaPose(t) {
    const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
    const soft = Math.abs(Math.sin(t * 0.9));
    return { lift: 2.4 + soft * 4.8 + Math.abs(breath) * 1.8, rot: -2.4 + breath * 4.8 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
  }

  function grazePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.graze));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -9.6, rot: s * 21.6 * face, anim: "play" };
    }
    if (u < 0.86) {
      const nibble = Math.sin(t * 3.4) + 0.22 * Math.sin(t * 6.8);
      return {
        x: fromX + face * nibble * 3.6,
        lift: -9.6 + Math.abs(nibble) * 7.2,
        rot: (21.6 + nibble * 6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: -3.6 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" };
  }

  function hissPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hiss));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 4.8, lift: s * -7.2, rot: s * -19.2 * face, anim: "play" };
    }
    if (u < 0.84) {
      const flare = Math.sin(t * 6.2) + 0.28 * Math.sin(t * 12.4);
      return {
        x: fromX + face * (4.8 + flare * 3.6),
        lift: -7.2 + Math.abs(flare) * 6,
        rot: (-19.2 + flare * 9.6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 4.8 * (1 - s), lift: -2.4 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" };
  }

  function nestguardPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nestguard));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * 9.6, rot: s * 12 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const watch = Math.sin(t * 1.15) + 0.18 * Math.sin(t * 2.4);
      return {
        x: fromX + face * watch * 3,
        lift: 9.6 + Math.abs(watch) * 4.8,
        rot: (12 + watch * 7.2) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 3.6 * (1 - s), rot: 3.6 * (1 - s) * face, anim: "idle" };
  }

  function honkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.honk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 12, rot: s * -14.4 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.10) / 0.76;
      const phrase = Math.sin(s * Math.PI * 3.0);
      const settle = Math.abs(Math.sin(s * Math.PI * 6.0));
      return {
        x: fromX + face * (4 * s + phrase * 3.6),
        lift: 10.8 + settle * 6,
        rot: (-14.4 + phrase * 12) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 4 * (1 - s), lift: 4.8 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function chinstrapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chinstrap));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 8.4, rot: s * 16.8 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const flash = Math.sin(t * 5.2) + 0.28 * Math.sin(t * 10.4);
      return {
        x: fromX + face * flash * 3.6,
        lift: 7.2 + Math.abs(flash) * 6,
        rot: (16.8 + flash * 12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 3.6 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" };
  }

  function triumphPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.triumph));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 14.4, rot: s * -7.2 * face, anim: "play" };
    }
    if (u < 0.86) {
      const bob = Math.sin(t * 4.8) + 0.3 * Math.sin(t * 9.6);
      return {
        x: fromX + face * bob * 4.2,
        lift: 13.2 + Math.abs(bob) * 8.4,
        rot: (-7.2 + bob * 14.4) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 4.8 * (1 - s), rot: -2.4 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    const short =
      trick.kind === "graze" ||
      trick.kind === "hiss" ||
      trick.kind === "nestguard" ||
      trick.kind === "honk" ||
      trick.kind === "chinstrap" ||
      trick.kind === "triumph";
    if (shouldAbort(flags) && !short) {
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
    const from = trick.fromX != null ? trick.fromX : trick.x;
    const poseFn = {
      graze: grazePose,
      hiss: hissPose,
      nestguard: nestguardPose,
      honk: honkPose,
      chinstrap: chinstrapPose,
      triumph: triumphPose,
    };
    const fn = poseFn[next.kind] || grazePose;
    const pose = fn(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
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
    chinstrapPose,
    triumphPose,
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
