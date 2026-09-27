/** Bandit ground tricks while idle — ultra-polish pass. House California kingsnake — stripe / audit / verdict / plumb / raid / band / drawer personality (banded ruler-drawer law; bold desk inspector). Stripe band-ripple across the body; audit deliberate desk survey; verdict stacked ruling hold; plumb straighten like a measuring stick; raid bold theatrical sweep; band show the bold black-and-white band pattern stretch; drawer ruler-drawer peek. Window-play INSPECT unchanged — never names `inspect`. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press. Guest slug Bandit / key kingsnake — accept "kingsnake" and "bandit". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via kingsnake.wav. Thank-yous tribute / docket / seal. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `kingsnake-tricks.ts`. True house-kingsnake desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids inspect/write/orb/nook/taste/inch/unroll/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/blotter/pencil/periscope/strike/pounce/sniff name collisions. Bird ultra (Soot→Ember) + Miso→Saffron done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Amplitudes raised toward Rui richness; denser waits/weights (VERDICT_HOLD=11.2 RELEASE_S=1.18). Jade densified. Bluff densified. Sash densified. Lula densified. Coral densified. Blush densified. Atlas densified. Cup densified. Sepia densified. Chamber densified. Pulse densified. Ochre densified. Tenant densified. Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house kingsnake.wav prefer. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "kingsnake";
  const TRICKS = ["stripe", "audit", "verdict", "plumb", "raid", "band", "drawer"];
  const HAPPY = ["tribute", "docket", "seal"];
  const HAPPY_DUR = { tribute: 1.58, docket: 1.66, seal: 1.72 };
  const VERDICT_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    stripe: 2.18,
    audit: 2.12,
    verdict: VERDICT_HOLD + RELEASE_S,
    plumb: 2.05,
    raid: 2.18,
    band: 2.28,
    drawer: 2.34,
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
    if (kind === "verdict") return 40 + roll * 26;
    if (kind === "audit" || kind === "drawer" || kind === "plumb") return 12.8 + roll * 9.4;
    if (kind === "stripe" || kind === "raid" || kind === "band") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "verdict";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "verdict" ? 0.72 : k === "audit" || k === "drawer" || k === "plumb" ? 1.28 : k === "stripe" || k === "raid" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "verdict";
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
    return key === TRICK_KEY || key === "bandit";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "tribute";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "tribute" ? "sit" : name === "docket" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function tributePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tribute));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 5.04, rot: s * 19.2, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      return {
        lift: 5.04 + Math.abs(Math.sin(t * 4.6)) * 4.08,
        rot: 19.2 + Math.sin(t * 3.4) * 16.8,
        dx: Math.sin(t * 2.1) * 1.32,
        anim: "sit",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 5.04 * (1 - s), rot: 19.2 * (1 - s), dx: 0, anim: "idle" };
  }

  function docketPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.docket));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 5.52, rot: s * -21.6, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
      const tick = Math.sin(t * 6.4);
      return {
        lift: 5.52 + Math.abs(tick) * 3.84,
        rot: -21.6 + tick * 26.4,
        dx: tick * 1.44,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 5.52 * (1 - s), rot: -21.6 * (1 - s), dx: 0, anim: "sit" };
  }

  function sealPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 2.2)) * 4.32 + 2.4,
      rot: -14.4 + Math.sin(t * 1.9) * 19.2,
      dx: Math.sin(t * 1.55) * 1.56,
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
    if (next.kind === "tribute") {
      const pose = tributePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "docket") {
      const pose = docketPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sealPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame() {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "verdict"
        ? "sit"
        : kind === "audit" || kind === "drawer"
          ? "talk"
          : kind === "plumb"
            ? "sit"
            : kind === "stripe" || kind === "raid" || kind === "band"
              ? "play"
              : "sit";
    return {
      kind: kind,
      phase: kind === "verdict" ? "hold" : "go",
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

  function verdictPose(t) {
    return {
      lift: 2.64 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
      rot: -21.6 + Math.sin(t * 2.4) * 26.4 + Math.sin(t * 4.6) * 14.4,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (2.64 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -21.6 * (1 - u) };
  }

  function stripePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stripe));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.36, rot: s * 19.2 * facing, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const band = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * (s * 7.8 + band * 3.36),
        lift: 3.36 + Math.abs(band) * 8.64,
        rot: facing * (19.2 + band * 38.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * (7.8 * (1 - s)),
      lift: 3.36 * (1 - s),
      rot: facing * 9.6 * (1 - s),
      anim: "sit",
    };
  }

  function auditPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.audit));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 1.68, lift: s * 5.52, rot: s * -21.6 * facing, anim: "talk" };
    }
    if (u < 0.84) {
      const s = (u - 0.12) / 0.72;
      const sweep = Math.sin(s * Math.PI * 2.6);
      return {
        x: fromX + facing * (1.68 + sweep * 3.84),
        lift: 5.52 + Math.abs(Math.sin(s * Math.PI * 3.2)) * 5.04,
        rot: facing * (-21.6 + sweep * 33.6),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * (1.68 * (1 - s)),
      lift: 5.52 * (1 - s),
      rot: facing * -10.8 * (1 - s),
      anim: "sit",
    };
  }

  function plumbPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.plumb));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4.56, rot: s * 26.4 * facing, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.14) / 0.58;
      return {
        x: fromX + facing * smoothstep(s) * 12.6,
        lift: 4.56 - s * 1.44 + Math.abs(Math.sin(s * Math.PI)) * 2.88,
        rot: facing * (26.4 - s * 40.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * (12.6 * (1 - s)),
      lift: 3.12 * (1 - s),
      rot: facing * (-14.4 * (1 - s)),
      anim: "sit",
    };
  }

  function raidPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.raid));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 6, rot: -s * 21.6 * facing, anim: "play" };
    }
    if (u < 0.46) {
      const s = (u - 0.1) / 0.36;
      return {
        x: fromX + facing * smoothstep(s) * 11.4,
        lift: 6 + Math.sin(s * Math.PI) * 5.76,
        rot: facing * (-21.6 + s * 38.4),
        anim: "play",
      };
    }
    if (u < 0.8) {
      const s = (u - 0.46) / 0.34;
      const home = smoothstep(s);
      return {
        x: fromX + facing * (11.4 * (1 - home)),
        lift: 6 * (1 - home * 0.45) + Math.sin(s * Math.PI) * 2.64,
        rot: facing * (16.8 - home * 26.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 6 * 0.55 * (1 - s),
      rot: facing * -7.2 * (1 - s),
      anim: "sit",
    };
  }

  function bandPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.band));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 5.76, rot: s * 24 * facing, anim: "play" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      const band = Math.abs(Math.sin(s * Math.PI * 3.4));
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 2.88,
        lift: 5.76 + band * 6.72,
        rot: facing * (24 + band * 26.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 5.76 * (1 - s),
      rot: facing * 12 * (1 - s),
      anim: "sit",
    };
  }

  function drawerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.drawer));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.36, rot: s * 19.2 * facing, anim: "talk" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const sway = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * (Math.abs(sway) * 10.2 + s * 2.64),
        lift: 3.36 + Math.abs(sway) * 8.64,
        rot: facing * (19.2 + sway * 38.4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 7.2,
      lift: 3.36 * (1 - s),
      rot: facing * 9.6 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "stripe" && trick.kind !== "raid" && trick.kind !== "band") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "verdict") {
      if (next.t < VERDICT_HOLD) {
        const pose = verdictPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < VERDICT_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - VERDICT_HOLD);
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
    let pose;
    if (next.kind === "stripe") pose = stripePose(next.t, from, trick.facing);
    else if (next.kind === "audit") pose = auditPose(next.t, from, trick.facing);
    else if (next.kind === "plumb") pose = plumbPose(next.t, from, trick.facing);
    else if (next.kind === "raid") pose = raidPose(next.t, from, trick.facing);
    else if (next.kind === "band") pose = bandPose(next.t, from, trick.facing);
    else pose = drawerPose(next.t, from, trick.facing);
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
    DUR,
    VERDICT_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    verdictPose,
    releasePose,
    stripePose,
    auditPose,
    plumbPose,
    raidPose,
    bandPose,
    drawerPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    tributePose,
    docketPose,
    sealPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetKingsnakeTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : /** @type {any} */ (this));
