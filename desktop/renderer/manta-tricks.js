/** Kite ground tricks while idle. House reef manta — wing / lobe / gyre / vault / span personality (pectoral wing glide, cephalic-lobe plankton scoop, barrel-roll curiosity as a gyre (never named barrel — window-play owns BARREL), forward somersault vault (never named somersault — Rui owns that), gentle-giant wingspan desk life; not Coin drift/gulp/flare/glint/dart, Pulse bell/oral/lucent/trail/medusa, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Sepia hover/pupil, Chamber spiral, Cup mantle/jet, Ink soak/tuck, or Clip nest). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web manta-tricks.ts. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play BARREL unchanged — never names barrel. Special Soar (eagle_ray) unchanged — never names soar/spots as tricks. Anchor owns coil/buoy/siphon/swivel/pouch and coronet/pipe/moor; Rui owns somersault; Ledger owns carapace/bookgill/telson/furrow/fossil and blue/page/tray; Tenant owns swap/antenna/scuttle/withdraw/vacancy and scrap/fit/lease; Cling owns podia/righting/crawl/evert/penta and damp/press/tide; Pulse owns bell/oral/lucent/trail/medusa and halo/lumen/gel; Cup owns jet/mantle/sucker/veil/tinker and keep/tint/squeeze; Sepia owns bone/pupil/chroma/hover/blot and ripple/glance/dab; Chamber owns spiral/siphuncle/nacre/pinhole/fringe and chamber/pearl/quiet; Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; Clip owns nest/cheek/scurry/pocket/reel and stuff/chitter/sprint; Burr owns curl; Fuse owns pulse as thank-you; ferret owns tube; Bluff owns hood; Bandit owns tribute; Phoenix owns lift; Sol owns press as a trick and tap as thank-you; rabbit owns dig; boa owns cradle as thank-you. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "manta";
  const TRICKS = ["wing", "lobe", "gyre", "vault", "span"];
  const HAPPY = ["ceil", "scoop", "breadth"];
  const HAPPY_DUR = { ceil: 1.24, scoop: 1.16, breadth: 1.22 };
  const SPAN_HOLD = 11.6;
  const RELEASE_S = 0.72;
  const DUR = { span: SPAN_HOLD + RELEASE_S, wing: 1.48, lobe: 1.36, gyre: 1.4, vault: 1.32 };

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
    if (kind === "span") return 48 + roll * 28;
    if (kind === "wing") return 16 + roll * 12;
    if (kind === "vault") return 14 + roll * 10;
    return justFinished ? 10.5 + roll * 8 : 5.2 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "span";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "span") {
      if (roll < 0.26) return "wing";
      if (roll < 0.48) return "lobe";
      if (roll < 0.72) return "gyre";
      return "vault";
    }
    if (lastKind === "wing") {
      if (roll < 0.28) return "span";
      if (roll < 0.5) return "lobe";
      if (roll < 0.72) return "gyre";
      return "vault";
    }
    if (lastKind === "lobe") {
      if (roll < 0.22) return "span";
      if (roll < 0.44) return "wing";
      if (roll < 0.66) return "gyre";
      return "vault";
    }
    if (roll < 0.2) return "span";
    if (roll < 0.4) return "wing";
    if (roll < 0.6) return "lobe";
    if (roll < 0.8) return "gyre";
    return "vault";
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
    return key === TRICK_KEY || key === "kite";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "ceil";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "ceil" ? "play" : name === "scoop" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function ceilPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ceil));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.42, rot: s * -2.4, dx: 0, anim: "play" };
    }
    if (u < 0.8) {
      const tip = Math.sin(t * 1.85);
      return {
        lift: 0.42 + Math.abs(tip) * 0.08,
        rot: -2.4 + tip * 3.6,
        dx: tip * 0.04,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.32 * (1 - s), rot: -1.6 * (1 - s), dx: 0, anim: "idle" };
  }
  function scoopPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scoop));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.18, rot: s * 6.5, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
      const draw = Math.sin(t * 2.35);
      return {
        lift: 0.18 + Math.abs(draw) * 0.09,
        rot: 6.5 + draw * 5.5,
        dx: draw * 0.08,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.14 * (1 - s), rot: 3.8 * (1 - s), dx: 0, anim: "sit" };
  }
  function breadthPose(t) {
    return {
      lift: 0.12 + Math.abs(Math.sin(t * 0.78)) * 0.1,
      rot: Math.sin(t * 0.92) * 1.8,
      dx: Math.sin(t * 0.55) * 0.05,
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
    if (next.kind === "ceil") {
      const pose = ceilPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "scoop") {
      const pose = scoopPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = breadthPose(next.t);
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
      kind === "span"
        ? "sit"
        : kind === "wing"
          ? "play"
          : kind === "lobe"
            ? "talk"
            : kind === "gyre"
              ? "play"
              : kind === "vault"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "span" ? "hold" : "go",
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

  function spanPose(t) {
    const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
    return {
      lift: 0.12 + Math.abs(Math.sin(t * 0.42)) * 0.06,
      rot: breath * 1.05,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.12 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.75 * (1 - u) };
  }

  function wingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wing));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.38, rot: s * -3.5 * facing, anim: "play" };
    }
    if (u < 0.8) {
      const s = (u - 0.12) / 0.68;
      const beat = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * (0.22 * s + beat * 0.06),
        lift: 0.38 + beat * 0.1,
        rot: facing * (-3.5 + beat * 5.5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + facing * 0.22 * (1 - s),
      lift: 0.3 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit",
    };
  }
  function lobePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lobe));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.16, rot: s * 7 * facing, anim: "talk" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const scoop = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * (0.14 + Math.abs(scoop) * 0.07),
        lift: 0.16 + Math.abs(scoop) * 0.07,
        rot: facing * (7 + scoop * 4.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.1 * (1 - s),
      lift: 0.12 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }
  function gyrePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gyre));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.48, rot: s * -12 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const s = (u - 0.12) / 0.66;
      const roll = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * roll * 0.1,
        lift: 0.48 + Math.abs(Math.sin(s * Math.PI * 2)) * 0.12,
        rot: facing * (-12 + s * 30 + roll * 18),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.36 * (1 - s),
      rot: facing * (8 * (1 - s)),
      anim: "sit",
    };
  }
  function vaultPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.vault));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.62, rot: s * -8 * facing, anim: "play" };
    }
    if (u < 0.72) {
      const s = (u - 0.16) / 0.56;
      const flip = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * flip * 0.08,
        lift: 0.62 + flip * 0.18,
        rot: facing * (-8 + s * 28),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.5 * (1 - s),
      rot: facing * (6 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lobe" && trick.kind !== "gyre" && trick.kind !== "vault") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "span") {
      if (next.t < SPAN_HOLD) {
        const pose = spanPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SPAN_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SPAN_HOLD);
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
    if (next.kind === "wing") {
      const pose = wingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lobe") {
      const pose = lobePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gyre") {
      const pose = gyrePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = vaultPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    SPAN_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    spanPose,
    releasePose,
    wingPose,
    lobePose,
    gyrePose,
    vaultPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    ceilPose,
    scoopPose,
    breadthPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMantaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
