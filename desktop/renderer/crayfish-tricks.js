/** Pinch ground tricks while idle — ultra-polish pass. House neighborly Astacoidea common-crayfish desk life — chelate / caridoid / chimney / antennule / astacid / scaph / meral personality (chelate cheliped snap without naming claw or snap or pinch, caridoid tail-flip escape burst without naming flip or dart or escape, chimney mud-bank burrow settle without naming burrow or dig or fossorial, antennule tip-tap probe without naming antenna or tap, long astacid Astacoidea desk hold under the tray grain, scaph scaphognathite gill-bailer pulse without naming bailer or breath or gill, meral meral-spread threat raise without naming threat or brandish or claw — never named wait or wake or still or hide or cover or wiggle or claw or snap or pinch or antenna or burrow or dig or flip or telson or carapace or swap or scuttle or withdraw or vacancy or bookgill or furrow or fossil or annulate or fossorial or tentacular or hydrostatic or gymnophion or stegos or dualjaw or bailer or chela or radula or pedal or pneumostome or ommatophore or lymnaeid as trick kinds; window-play CLAW owns claw; ethogram softs + freeze own those words; special Pinch owns pinch; Tenant owns swap/antenna/scuttle/withdraw/vacancy/chela/bailer; Ledger owns carapace/bookgill/telson/furrow/fossil; Slip owns annulate/fossorial/tentacular/hydrostatic/gymnophion/stegos/dualjaw; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid/odontophore/neuston; Pebble owns burrow; guest slug Pinch / key crayfish only for isKey matching — accept "crayfish" and "pinch"; do NOT name a trick "crayfish" or "pinch" or "claw" or "snap" or "antenna" or "burrow" or "flip" or "telson" or "carapace" or "annulate" or "fossorial" or "tentacular" or "hydrostatic" or "gymnophion" or "stegos" or "dualjaw" or "bailer" or "chela" or "radula" or "pedal" or "pneumostome" or "ommatophore" or "lymnaeid") — not Tenant hermit shell life, not Ledger horseshoe helmet life, not Slip caecilian silt life, not Whorl pond-snail life. chelate cheliped snap on the tray without naming claw or snap or pinch, caridoid uropod-tail flip retreat without naming flip or dart, chimney mud chimney settle without naming burrow or dig, antennule antennular tap without naming antenna, astacid long Astacoidea metabolic hold under the scrap grain, scaph scaphognathite gill-bailer pulse (THE decapod breathing tell), meral meral-spread threat raise (THE crayfish agonistic tell); clasp / marl / chitin thank-yous. Feed-happy after eat. Card-open freeze and window-play CLAW do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop crayfish-tricks.js. Window-play CLAW unchanged. Ethogram softs + freeze — never names pinch/snap/still/wiggle as trick kinds. Hinge owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via crayfish.wav. */
(function (root) {
  const TRICK_KEY = "crayfish";
  const TRICKS = ["chelate", "caridoid", "chimney", "antennule", "astacid", "scaph", "meral"];
  const HAPPY = ["clasp", "marl", "chitin"];
  const HAPPY_DUR = { clasp: 1.64, marl: 1.76, chitin: 1.71 };
  const ASTACID_HOLD = 10.8;
  const RELEASE_S = 1.14;
  const DUR = {
    astacid: ASTACID_HOLD + RELEASE_S,
    chelate: 2.28,
    caridoid: 2.42,
    chimney: 2.48,
    antennule: 2.34,
    scaph: 2.36,
    meral: 2.31,
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
    if (kind === "astacid") return 38 + roll * 24;
    if (kind === "scaph" || kind === "meral" || kind === "chelate") return 12 + roll * 9;
    if (kind === "caridoid" || kind === "chimney" || kind === "antennule") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "astacid";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "astacid") {
      if (roll < 0.16) return "chelate";
      if (roll < 0.32) return "caridoid";
      if (roll < 0.48) return "chimney";
      if (roll < 0.64) return "antennule";
      if (roll < 0.82) return "scaph";
      return "meral";
    }
    if (lastKind === "chelate") {
      if (roll < 0.16) return "astacid";
      if (roll < 0.32) return "caridoid";
      if (roll < 0.48) return "chimney";
      if (roll < 0.64) return "antennule";
      if (roll < 0.82) return "scaph";
      return "meral";
    }
    if (lastKind === "caridoid") {
      if (roll < 0.14) return "astacid";
      if (roll < 0.3) return "chelate";
      if (roll < 0.46) return "chimney";
      if (roll < 0.62) return "antennule";
      if (roll < 0.8) return "scaph";
      return "meral";
    }
    if (lastKind === "scaph" || lastKind === "meral") {
      if (roll < 0.14) return "astacid";
      if (roll < 0.3) return "chelate";
      if (roll < 0.46) return "caridoid";
      if (roll < 0.62) return "chimney";
      if (roll < 0.78) return "antennule";
      return lastKind === "scaph" ? "meral" : "scaph";
    }
    if (roll < 0.14) return "astacid";
    if (roll < 0.28) return "chelate";
    if (roll < 0.42) return "caridoid";
    if (roll < 0.56) return "chimney";
    if (roll < 0.7) return "antennule";
    if (roll < 0.85) return "scaph";
    return "meral";
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
    return key === TRICK_KEY || key === "pinch";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "clasp";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "clasp" ? "sit" : name === "marl" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function claspPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.clasp));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 1.72);
      return {
        lift: 2.8 + Math.abs(flash) * 1.4,
        rot: 12 + flash * 8,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function marlPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.marl));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 3.4, rot: s * -14, dx: s * 0.15, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 2.1);
      return {
        lift: 3.4 + Math.abs(wriggle) * 1.6,
        rot: -14 + wriggle * 10,
        dx: 0.08,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function chitinPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.52) * 6,
      dx: 0,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "clasp") {
      const pose = claspPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "marl") {
      const pose = marlPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = chitinPose(next.t);
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
      kind === "astacid"
        ? "sit"
        : kind === "chelate"
          ? "play"
          : kind === "caridoid"
            ? "play"
            : kind === "chimney"
              ? "walk"
              : kind === "antennule"
                ? "sit"
                : kind === "scaph"
                  ? "sit"
                  : kind === "meral"
                    ? "play"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? kind : "chelate",
      phase: kind === "astacid" ? "hold" : "go",
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

  function astacidPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.14) * 4,
      anim: "sit",
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function chelatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chelate));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.2, rot: s * 14 * face, anim: "play" };
    }
    if (u < 0.78) {
      const snap = Math.sin(t * 2.4);
      return {
        x: fromX + face * snap * 0.12,
        lift: 3.2 + Math.abs(snap) * 1.4,
        rot: face * (14 + snap * 10),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: face * (4 * (1 - s)),
      anim: "idle",
    };
  }

  function caridoidPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.caridoid));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.6, rot: s * -16 * face, anim: "play" };
    }
    if (u < 0.48) {
      const s = smoothstep((u - 0.12) / 0.36);
      return {
        x: fromX - face * (2.2 + s * 4.5),
        lift: 3.6 + Math.sin(s * Math.PI) * 2.2,
        rot: face * (-16 + s * 22),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const settle = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX - face * (6.7 * (1 - s)),
        lift: 2.4 + Math.abs(settle) * 1.1,
        rot: face * (6 + settle * 8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function chimneyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chimney));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.8, lift: s * 2.2, rot: s * 8 * face, anim: "walk" };
    }
    if (u < 0.72) {
      const mud = Math.sin(t * 1.6);
      return {
        x: fromX + face * (0.8 + mud * 0.4),
        lift: 2.2 + Math.abs(mud) * 1.0,
        rot: face * (8 + mud * 10),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: s > 0.6 ? "idle" : "sit",
    };
  }

  function antennulePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennule));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.4, rot: s * 10 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const tap = Math.sin(t * 2.8);
      return {
        x: fromX + face * tap * 0.2,
        lift: 2.4 + Math.abs(tap) * 1.1,
        rot: face * (10 + tap * 12),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function scaphPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scaph));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "sit" };
    }
    if (u < 0.55) {
      const pulse = Math.sin(t * 3.2);
      return {
        x: fromX,
        lift: 2.8 + pulse * 1.6,
        rot: face * (12 + pulse * 14),
        anim: "sit",
      };
    }
    if (u < 0.78) {
      const scent = Math.sin(t * 1.1);
      return {
        x: fromX + face * scent * 0.15,
        lift: 4.0 + Math.abs(scent) * 0.6,
        rot: face * (22 + scent * 4),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.0 * (1 - s),
      rot: face * (8 * (1 - s)),
      anim: "idle",
    };
  }

  function meralPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.meral));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.55) {
      const flash = Math.abs(Math.sin(t * 2.6));
      return {
        x: fromX + face * flash * 0.2,
        lift: 3.4 + flash * 1.4,
        rot: face * (-12 - flash * 10),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const warn = Math.sin(t * 1.4);
      return {
        x: fromX,
        lift: 4.4 + Math.abs(warn) * 0.7,
        rot: face * (-18 + warn * 6),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.8 * (1 - s),
      rot: face * (-5 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (shouldAbort(flags)) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "astacid") {
      if (next.t < ASTACID_HOLD) {
        const pose = astacidPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < ASTACID_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ASTACID_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    if (next.kind === "chelate") {
      const pose = chelatePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "caridoid") {
      const pose = caridoidPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "chimney") {
      const pose = chimneyPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennule") {
      const pose = antennulePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "scaph") {
      const pose = scaphPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = meralPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX });
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    ASTACID_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    astacidPose,
    releasePose,
    chelatePose,
    caridoidPose,
    chimneyPose,
    antennulePose,
    scaphPose,
    meralPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    claspPose,
    marlPose,
    chitinPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCrayfishTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
