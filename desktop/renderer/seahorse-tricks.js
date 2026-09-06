/** Anchor ground tricks while idle. House lined seahorse — coil / buoy / siphon / swivel / pouch personality (prehensile tail grip settle, upright water-column buoy, tubular snout siphon, independent-eye swivel, brood-pouch calm desk life; not Coin drift/gulp/flare/glint/dart, Pulse bell/oral/lucent/trail/medusa, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Sepia hover/pupil, Chamber spiral, Cup mantle, Ink soak/tuck, or Clip nest). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web seahorse-tricks.ts. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play HITCH unchanged — never names hitch. Special Hitch unchanged — never names hitch as a trick. Ledger owns carapace/bookgill/telson/furrow/fossil and blue/page/tray; Tenant owns swap/antenna/scuttle/withdraw/vacancy and scrap/fit/lease; Cling owns podia/righting/crawl/evert/penta and damp/press/tide; Pulse owns bell/oral/lucent/trail/medusa and halo/lumen/gel; Cup owns jet/mantle/sucker/veil/tinker and keep/tint/squeeze; Sepia owns bone/pupil/chroma/hover/blot and ripple/glance/dab; Chamber owns spiral/siphuncle/nacre/pinhole/fringe and chamber/pearl/quiet; Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; Clip owns nest/cheek/scurry/pocket/reel and stuff/chitter/sprint; Burr owns curl; Fuse owns pulse as thank-you; ferret owns tube; Bluff owns hood; Bandit owns tribute; Phoenix owns lift; Sol owns press as a trick and tap as thank-you; rabbit owns dig; boa owns cradle as thank-you. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "seahorse";
  const TRICKS = ["coil", "buoy", "siphon", "swivel", "pouch"];
  const HAPPY = ["coronet", "pipe", "moor"];
  const HAPPY_DUR = { coronet: 1.22, pipe: 1.18, moor: 1.2 };
  const COIL_HOLD = 11.8;
  const RELEASE_S = 0.7;
  const DUR = { coil: COIL_HOLD + RELEASE_S, buoy: 1.42, siphon: 1.34, swivel: 1.28, pouch: 1.46 };

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
    if (kind === "coil") return 48 + roll * 28;
    if (kind === "pouch") return 17 + roll * 12;
    if (kind === "buoy") return 15 + roll * 11;
    return justFinished ? 10.5 + roll * 8 : 5.2 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "coil";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "coil") {
      if (roll < 0.26) return "buoy";
      if (roll < 0.48) return "siphon";
      if (roll < 0.72) return "swivel";
      return "pouch";
    }
    if (lastKind === "buoy") {
      if (roll < 0.28) return "coil";
      if (roll < 0.5) return "siphon";
      if (roll < 0.72) return "swivel";
      return "pouch";
    }
    if (lastKind === "siphon") {
      if (roll < 0.22) return "coil";
      if (roll < 0.44) return "buoy";
      if (roll < 0.66) return "swivel";
      return "pouch";
    }
    if (roll < 0.2) return "coil";
    if (roll < 0.4) return "buoy";
    if (roll < 0.6) return "siphon";
    if (roll < 0.8) return "swivel";
    return "pouch";
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
    return key === TRICK_KEY || key === "anchor";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "coronet";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "coronet" ? "talk" : name === "pipe" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function coronetPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.coronet));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.34, rot: s * 3.2, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      const tip = Math.sin(t * 2.05);
      return {
        lift: 0.34 + Math.abs(tip) * 0.07,
        rot: 3.2 + tip * 4.2,
        dx: tip * 0.025,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.26 * (1 - s), rot: 2.2 * (1 - s), dx: 0, anim: "idle" };
  }

  function pipePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pipe));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.2, rot: s * -5.5, dx: 0, anim: "play" };
    }
    if (u < 0.78) {
      const draw = Math.sin(t * 2.2);
      return {
        lift: 0.2 + Math.abs(draw) * 0.1,
        rot: -5.5 + draw * 9.5,
        dx: draw * 0.07,
        anim: "play",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.16 * (1 - s), rot: -3.5 * (1 - s), dx: 0, anim: "sit" };
  }

  function moorPose(t) {
    return {
      lift: 0.14 + Math.abs(Math.sin(t * 0.88)) * 0.12,
      rot: Math.sin(t * 1.05) * 2.1,
      dx: Math.sin(t * 0.62) * 0.025,
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
    if (next.kind === "coronet") {
      const pose = coronetPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pipe") {
      const pose = pipePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = moorPose(next.t);
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
      kind === "coil"
        ? "sit"
        : kind === "buoy"
          ? "play"
          : kind === "siphon"
            ? "talk"
            : kind === "swivel"
              ? "talk"
              : kind === "pouch"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "coil" ? "hold" : "go",
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

  function coilPose(t) {
    const breath = Math.sin(t * 0.48) + 0.07 * Math.sin(t * 1.35);
    return {
      lift: 0.1 + Math.abs(Math.sin(t * 0.48)) * 0.05,
      rot: breath * 1.15,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.1 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.85 * (1 - u) };
  }

  function buoyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.buoy));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.55, rot: s * -2 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const bob = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * bob * 0.04,
        lift: 0.55 + bob * 0.08,
        rot: facing * (-2 + bob * 3.5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.45 * (1 - s),
      rot: facing * (-1.2 * (1 - s)),
      anim: "sit",
    };
  }

  function siphonPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.siphon));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.18, rot: s * 6 * facing, anim: "talk" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const draw = Math.sin(s * Math.PI * 4.4);
      return {
        x: fromX + facing * (0.12 + Math.abs(draw) * 0.08),
        lift: 0.18 + Math.abs(draw) * 0.06,
        rot: facing * (6 + draw * 4.5),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.08 * (1 - s),
      lift: 0.14 * (1 - s),
      rot: facing * (3.5 * (1 - s)),
      anim: "sit",
    };
  }

  function swivelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.swivel));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.16, rot: s * -4 * facing, anim: "talk" };
    }
    if (u < 0.8) {
      const s = (u - 0.12) / 0.68;
      const eye = Math.sin(s * Math.PI * 5.6);
      const tick = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX + facing * tick * 0.03,
        lift: 0.16 + Math.abs(eye) * 0.05,
        rot: facing * (-4 + eye * 10 + tick * 2),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 0.12 * (1 - s),
      rot: facing * (-2.5 * (1 - s)),
      anim: "sit",
    };
  }

  function pouchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pouch));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * 0.08, rot: s * 1.8 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.2) / 0.58;
      const calm = Math.sin(s * Math.PI * 1.5);
      return {
        x: fromX + facing * calm * 0.035,
        lift: 0.08 + Math.abs(calm) * 0.045,
        rot: facing * (1.8 + calm * 1.6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.08 * (1 - s),
      rot: facing * (1.1 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "siphon" && trick.kind !== "swivel" && trick.kind !== "pouch") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "coil") {
      if (next.t < COIL_HOLD) {
        const pose = coilPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < COIL_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - COIL_HOLD);
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
    if (next.kind === "buoy") {
      const pose = buoyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "siphon") {
      const pose = siphonPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "swivel") {
      const pose = swivelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pouchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    COIL_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    coilPose,
    releasePose,
    buoyPose,
    siphonPose,
    swivelPose,
    pouchPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    coronetPose,
    pipePose,
    moorPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSeahorseTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
