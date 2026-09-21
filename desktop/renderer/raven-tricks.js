/** Wedge ground tricks while idle — ultra-polish pass. House neighborly Corvidae Common raven desk life — dihedral / billtap / tumble / cronk / invite / toeing / hackles personality (dihedral soaring wing-set posture without naming soar or glide or thermal or kettle or loft or hop or walk or strut or fan, billtap bill-tap stow gesture without naming cache or croak or caw or probe or dig or peck or bill or fossick, tumble blotter roll-play without naming barrel or roll or soar or aerobat or looping or hopwalk, cronk throat kronk gesture without naming croak or caw or call or cronk-cry or vocal, invite play-bow without naming play or bow-cry or hop or strut, toeing foot-object manipulate without naming grasp or cache or probe or dig or peck or claw, long hackles throat-ruff flare on the high rafter — never named wait or wake or still or hide or cover or croak or caw or cache or hop or walk or strut or fan or preen or probe or dig or peck or bill or roost or berry or juggle or peer or skip or quote or crack or flash or sidle or bobble or mimic or dangle or huddle or toboggan or waddle or porpoise or trumpet or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or spiggin or zigzag or spinous or fanning or gasterosteid or acetabulum or prostomium or looping or undulatory or hirudinean or lantern or jstroke or semaphore or elytra or photinus or plumose or lunule or silk or stream or actias; window-play CROAK owns croak; window-play CACHE owns cache; window-play SOAR owns soar; window-play BARREL owns barrel; Soot owns hopwalk/monocle/fossick/anting/scrutinize/glean/corvid; Budgie owns preen/sidle/bobble/mimic/dangle; Parrot owns quote/strut/fan/crack/flash; Toucan owns roost/berry/juggle/peer/skip; Penguin owns huddle/toboggan/waddle/porpoise/trumpet; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid/nuptial/pelvic; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean/botryoidal/auricle; Ghost owns luna moth life; Spark owns firefly life; guest slug Wedge / key raven only for isKey matching — accept "raven" and "wedge"; do NOT name a trick "raven" or "wedge" or "croak" or "caw" or "cache" or "soar" or "barrel" or "hop" or "preen" or "probe" or "fan" or "strut" or "roost" or "hopwalk" or "monocle" or "fossick" or "anting" or "scrutinize" or "glean" or "corvid") — not Quill macaw life, not Echo budgie life, not Soot crow life, not Prickle stickleback life, not Latch leech life, not Ghost luna, not Spark firefly. Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. dihedral wing-set on the blotter without naming soar, billtap stow-tap without naming cache, tumble roll-play without naming barrel, cronk throat gesture without naming croak, invite play-bow on the blotter, toeing foot-work without naming grasp, hackles long Corvus corax metabolic perch on the high rafter with principalis / sinuatus / cryptoleucus cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play CROAK do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop/web raven-tricks. Window-play CROAK unchanged — never names croak. Window-play CACHE/SOAR/BARREL unchanged. True Corvidae Common raven desk life only — distinct from Quill macaw, Echo budgie, Soot crow, Prickle stickleback, Latch leech, Ghost luna, and Spark firefly. Heart now Rue-dense; Dee owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via raven.wav. Amplitudes raised toward Rui richness; denser waits/weights (HACKLES_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names raven/wedge/croak/caw/cache as bare ethogram-only trick kinds. Window-play CROAK unchanged. Brick now Rue-dense; Drake now Rue-dense; Vee now Rue-dense; Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; Frill now Rue-dense; Cap now Rue-dense; next leftover Lattice / morel. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "raven";
  const TRICKS = ["dihedral", "billtap", "tumble", "cronk", "invite", "toeing", "hackles"];
  const HAPPY = ["principalis", "sinuatus", "cryptoleucus"];
  const HAPPY_DUR = { principalis: 1.66, sinuatus: 1.79, cryptoleucus: 1.71 };
  const HACKLES_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    hackles: HACKLES_HOLD + RELEASE_S,
    dihedral: 2.48,
    billtap: 2.22,
    tumble: 2.58,
    cronk: 2.36,
    invite: 2.28,
    toeing: 2.42,
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
    if (kind === "hackles") return 40 + roll * 26;
    if (kind === "dihedral" || kind === "billtap" || kind === "tumble" || kind === "cronk" || kind === "invite" || kind === "toeing") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "hackles";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    // weight hackles lower so short acts dominate (Rui-dense feel)
    const weights = list.map((k) => (k === "hackles" ? 0.72 : k === "invite" || k === "cronk" ? 1.28 : k === "dihedral" || k === "tumble" || k === "toeing" ? 1.18 : 1.08));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "dihedral";
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
    return key === TRICK_KEY || key === "wedge";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "principalis";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "principalis" ? "sit" : name === "sinuatus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function principalisPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.principalis));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 8.4, rot: s * 13.2, dx: 0, anim: "sit" };
    }
    if (u < 0.80) {
      const flash = Math.sin(t * 6.9) + 0.30 * Math.sin(t * 13.8);
      return {
        lift: 8.4 + Math.abs(flash) * 6,
        rot: 13.2 + flash * 10.8,
        dx: flash * 2.88,
        anim: "sit",
      };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function sinuatusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sinuatus));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 18, rot: s * -15.6, dx: s * 3.84, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 4.9) + 0.22 * Math.sin(t * 8.7);
      return {
        lift: 15.6 + Math.abs(wriggle) * 12,
        rot: -13.2 + wriggle * 18,
        dx: wriggle * 5.04,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" };
  }

  function cryptoleucusPose(t) {
    return {
      lift: 3.6 + Math.abs(Math.sin(t * 4.0)) * 9.6,
      rot: Math.sin(t * 3.4) * 10.8,
      dx: Math.sin(t * 2.6) * 3.84,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, dx: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const dur = HAPPY_DUR[next.kind] || HAPPY_DUR.principalis;
    let pose;
    if (next.kind === "sinuatus") pose = sinuatusPose(next.t);
    else if (next.kind === "cryptoleucus") pose = cryptoleucusPose(next.t);
    else pose = principalisPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.dx = pose.dx || 0;
    next.x = (happy.fromX != null ? happy.fromX : happy.x) + (next.dx || 0) * (happy.facing == null ? 1 : happy.facing);
    next.anim = pose.anim;
    if (next.t >= dur) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, dx: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "hackles"
        ? "sit"
        : kind === "dihedral" || kind === "billtap" || kind === "toeing"
          ? "sit"
          : kind === "tumble" || kind === "invite"
            ? "play"
            : kind === "cronk"
              ? "talk"
              : "sit";
    return {
      kind: kind,
      phase: kind === "hackles" ? "hold" : "go",
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

  function hacklesPose(t) {
    const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
    const soft = Math.abs(Math.sin(t * 0.9));
    return {
      lift: 2.4 + soft * 6 + Math.abs(breath) * 2.16,
      rot: -3 + breath * 5.4,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
  }

  function dihedralPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dihedral));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 12, rot: s * -9.6 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.10) / 0.78;
      const breath = Math.sin(s * Math.PI * 1.6);
      const settle = Math.abs(Math.sin(s * Math.PI * 2.4));
      return {
        x: fromX + face * (6 * s + breath * 2.88),
        lift: 9.6 + settle * 9.6,
        rot: (-9.6 + breath * 12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + face * 6 * (1 - s),
      lift: 4.8 * (1 - s),
      rot: -3.6 * (1 - s) * face,
      anim: "idle",
    };
  }

  function billtapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.billtap));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4.8, rot: s * -19.2 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const tap = Math.sin(t * 8.4) + 0.22 * Math.sin(t * 16.8);
      const bite = tap > 0.4 ? 1.0 : tap < -0.4 ? -0.6 : tap * 0.45;
      return {
        x: fromX + face * bite * 4.08,
        lift: 3.6 + Math.abs(tap) * 8.4,
        rot: (-19.2 + bite * 12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.4 * (1 - s),
      rot: -4.8 * (1 - s) * face,
      anim: "idle",
    };
  }

  function tumblePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tumble));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 14.4, rot: s * -16.8 * face, anim: "play" };
    }
    if (u < 0.84) {
      const spin = Math.sin(t * 4.2) + 0.28 * Math.sin(t * 8.4);
      return {
        x: fromX + face * spin * 8.4,
        lift: 12 + Math.abs(spin) * 14.4,
        rot: (-14.4 + spin * 21.6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + face * 2 * (1 - s),
      lift: 4.8 * (1 - s),
      rot: -4.8 * (1 - s) * face,
      anim: "idle",
    };
  }

  function cronkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cronk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 7.2, rot: s * 16.8 * face, anim: "talk" };
    }
    if (u < 0.88) {
      const pulse = Math.sin(t * 3.6) + 0.26 * Math.sin(t * 7.2);
      return {
        x: fromX + face * pulse * 3.12,
        lift: 6 + Math.abs(pulse) * 6,
        rot: (16.8 + pulse * 8.4) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 2.4 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" };
  }

  function invitePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.invite));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 4.8, rot: s * 21.6 * face, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const dip = Math.sin(s * Math.PI);
      return {
        x: fromX + face * dip * 3.6,
        lift: 3.6 + dip * 7.2,
        rot: (21.6 + dip * 7.2) * face,
        anim: "play",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.55) / 0.33;
      const bob = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + face * bob * 2.4,
        lift: 6 + Math.abs(bob) * 4.8,
        rot: (14.4 + bob * 6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 2.4 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" };
  }

  function toeingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.toeing));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 9.6, rot: s * -12 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const work = Math.sin(t * 5.6) + 0.28 * Math.sin(t * 11.2);
      const hop = Math.abs(Math.sin(t * 3.1));
      return {
        x: fromX + face * (work * 4.8 + hop * 2.4),
        lift: 7.2 + hop * 12 + Math.abs(work) * 3.6,
        rot: (-12 + work * 14.4) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 3.6 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "dihedral" &&
      trick.kind !== "billtap" &&
      trick.kind !== "tumble" &&
      trick.kind !== "cronk" &&
      trick.kind !== "invite" &&
      trick.kind !== "toeing"
    ) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "hackles") {
      if (next.t < HACKLES_HOLD) {
        const pose = hacklesPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HACKLES_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HACKLES_HOLD);
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
    let pose;
    if (next.kind === "dihedral") pose = dihedralPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else if (next.kind === "billtap") pose = billtapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else if (next.kind === "tumble") pose = tumblePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else if (next.kind === "invite") pose = invitePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else if (next.kind === "toeing") pose = toeingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else pose = cronkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    HACKLES_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    hacklesPose,
    releasePose,
    dihedralPose,
    billtapPose,
    tumblePose,
    cronkPose,
    invitePose,
    toeingPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    principalisPose,
    sinuatusPose,
    cryptoleucusPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRavenTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
