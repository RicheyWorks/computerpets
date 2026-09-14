/** Mast ground tricks while idle. House oak — acorn / sinus / gall / taproot / bole personality (acorn mast drop to the dish — never named drop (Fan owns drop) / dichotomy (Fan owns dichotomy) / petiole (Fan owns petiole) / seed (Mast window owns seed) / mast as fan-collision, lobed leaf sway as sinus — never named lobe (Kite owns lobe) / sway (Jade owns sway) / biloba (Fan owns biloba) / frond (Vein owns frond), gall curiosity tip inspect, deep taproot settle — never named root (Burr owns root) / dig (Rabbit owns dig), sturdy bole trunk calm desk life under the lamp; not Fan biloba/notch/flutter/drop/amber, Vein frond/rachis/fiddle/pinna/saucer, Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web oak-tricks.ts. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, maidenhair/Vein, ginkgo/Fan, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play SEED unchanged — never names seed. Special lean/nod/still ethogram unchanged — never names lean/nod/still as tricks. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Vein owns frond/rachis/fiddle/pinna/saucer and mist/filigree/shade; Fan owns biloba/notch/flutter/drop/amber and ochre/gilt/linger; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns root; Coin owns flare; Phoenix owns lift; Fuse owns pulse as thank-you; Chamber owns quiet as thank-you; Ledger owns page as thank-you and fossil as trick; Jade owns treaty as thank-you and sway as trick; Parrot owns fan; Kite owns lobe. Plant/oak desk life only — not a ginkgo copy, fern maidenhair copy, bryophyte moss copy, or animal/moray copy. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "oak";
  const TRICKS = ["acorn", "sinus", "gall", "taproot", "bole"];
  const HAPPY = ["cupule", "tannin", "grove"];
  const HAPPY_DUR = { cupule: 1.26, tannin: 1.16, grove: 1.3 };
  const BOLE_HOLD = 12.5;
  const RELEASE_S = 0.78;
  const DUR = { bole: BOLE_HOLD + RELEASE_S, acorn: 1.42, sinus: 1.52, gall: 1.22, taproot: 1.38 };

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
    if (kind === "bole") return 50 + roll * 30;
    if (kind === "acorn") return 15 + roll * 10;
    if (kind === "sinus") return 16 + roll * 11;
    return justFinished ? 10.8 + roll * 8 : 5.4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "bole";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "bole") {
      if (roll < 0.26) return "acorn";
      if (roll < 0.48) return "sinus";
      if (roll < 0.72) return "gall";
      return "taproot";
    }
    if (lastKind === "acorn") {
      if (roll < 0.28) return "bole";
      if (roll < 0.5) return "sinus";
      if (roll < 0.72) return "gall";
      return "taproot";
    }
    if (lastKind === "sinus") {
      if (roll < 0.22) return "bole";
      if (roll < 0.44) return "acorn";
      if (roll < 0.66) return "gall";
      return "taproot";
    }
    if (roll < 0.2) return "bole";
    if (roll < 0.4) return "acorn";
    if (roll < 0.6) return "sinus";
    if (roll < 0.8) return "gall";
    return "taproot";
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
    return key === TRICK_KEY || key === "mast";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "cupule";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "cupule" ? "talk" : name === "tannin" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function cupulePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cupule));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.06, rot: s * 2.4, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
      const cup = Math.sin(t * 1.35);
      return {
        lift: 0.06 + Math.abs(cup) * 0.032,
        rot: 2.4 + cup * 1.7,
        dx: cup * 0.014,
        anim: "talk",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.045 * (1 - s), rot: 1.6 * (1 - s), dx: 0, anim: "sit" };
  }
  function tanninPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tannin));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.14, rot: s * -2.5, dx: 0, anim: "play" };
    }
    if (u < 0.73) {
      const warm = Math.sin(t * 2.05);
      return {
        lift: 0.14 + Math.abs(warm) * 0.048,
        rot: -2.5 + warm * 2.8,
        dx: warm * 0.024,
        anim: "play",
      };
    }
    const s = (u - 0.73) / 0.27;
    return { lift: 0.1 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "idle" };
  }
  function grovePose(t) {
    return {
      lift: 0.018 + Math.abs(Math.sin(t * 0.4)) * 0.028,
      rot: Math.sin(t * 0.52) * 1.1,
      dx: Math.sin(t * 0.3) * -0.03,
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
    if (next.kind === "cupule") {
      const pose = cupulePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tannin") {
      const pose = tanninPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = grovePose(next.t);
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
      kind === "bole"
        ? "sit"
        : kind === "acorn"
          ? "talk"
          : kind === "sinus"
            ? "sit"
            : kind === "gall"
              ? "talk"
              : kind === "taproot"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "bole" ? "hold" : "go",
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

  function bolePose(t) {
    const breath = Math.sin(t * 0.3) + 0.035 * Math.sin(t * 1.05);
    return {
      lift: 0.025 + Math.abs(Math.sin(t * 0.3)) * 0.022,
      rot: -0.7 + breath * 0.95,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.025 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.7 * (1 - u) };
  }

  function acornPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.acorn));
    if (u < 0.17) {
      const s = smoothstep(u / 0.17);
      return { x: fromX, lift: s * 0.22, rot: s * -2.8 * facing, anim: "talk" };
    }
    if (u < 0.52) {
      const s = (u - 0.17) / 0.35;
      const hang = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + facing * hang * 0.02,
        lift: 0.22 - s * 0.03 + Math.abs(hang) * 0.025,
        rot: facing * (-2.8 + hang * 4.2),
        anim: "talk",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.52) / 0.3;
      const land = smoothstep(s);
      return {
        x: fromX + facing * (1 - land) * 0.025,
        lift: 0.18 * (1 - land * 0.9),
        rot: facing * (-1.8 + land * 3.2),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.025 * (1 - s),
      rot: facing * (1.0 * (1 - s)),
      anim: "sit",
    };
  }
  function sinusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sinus));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.055, rot: s * -4.8 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const wave = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * wave * 0.035,
        lift: 0.055 + Math.abs(wave) * 0.07,
        rot: facing * (-4.8 + wave * 8.6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.055 * (1 - s),
      rot: facing * (-2.2 * (1 - s)),
      anim: "sit",
    };
  }
  function gallPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gall));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.04, rot: s * 5.5 * facing, anim: "talk" };
    }
    if (u < 0.62) {
      const s = (u - 0.16) / 0.46;
      const tip = Math.sin(s * Math.PI * 5.1);
      return {
        x: fromX + facing * tip * 0.018,
        lift: 0.04 + Math.abs(tip) * 0.03,
        rot: facing * (5.5 + tip * 4.2),
        anim: "talk",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.62) / 0.22;
      const settle = smoothstep(s);
      return {
        x: fromX + facing * (1 - settle) * 0.018,
        lift: 0.045 * (1 - settle * 0.4),
        rot: facing * (5.5 - settle * 6.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.02 * (1 - s),
      rot: facing * (-0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function taprootPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.taproot));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.12, rot: s * 2.2 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.15) / 0.4;
      const press = smoothstep(s);
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 0.015,
        lift: 0.12 * (1 - press * 0.85),
        rot: facing * (2.2 - press * 3.5),
        anim: "play",
      };
    }
    if (u < 0.8) {
      const s = (u - 0.55) / 0.25;
      const dig = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * dig * 0.012,
        lift: 0.02 + Math.abs(dig) * 0.018,
        rot: facing * (-1.2 + dig * 2.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 0.018 * (1 - s),
      rot: facing * (-0.6 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "acorn" && trick.kind !== "sinus" && trick.kind !== "gall" && trick.kind !== "taproot") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "bole") {
      if (next.t < BOLE_HOLD) {
        const pose = bolePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BOLE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BOLE_HOLD);
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
    if (next.kind === "acorn") {
      const pose = acornPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sinus") {
      const pose = sinusPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gall") {
      const pose = gallPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = taprootPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    BOLE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    bolePose,
    releasePose,
    acornPose,
    sinusPose,
    gallPose,
    taprootPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    cupulePose,
    tanninPose,
    grovePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOakTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
