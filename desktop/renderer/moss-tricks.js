/** Felt ground tricks while idle. House sheet moss — tuft / bead / spore / cushion / thatch personality (soft carpet swell as tuft — never named swell (Sol owns swell as thank-you), dew bead, spore lift as spore — never named lift (Ember owns lift), cushion creep as cushion — never named creep (Still window owns creep) / crawl (Cling owns crawl) / moss (Sash owns moss), quiet green thatch desk life on the blotter felt; not Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web moss-tricks.ts. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play LEAN unchanged — never names lean. Special carpet ethogram unchanged — never names carpet as a trick. Sash owns moss; Sol owns swell as thank-you and press as a trick; Ember owns lift; Cling owns crawl/damp/press/tide; Still window owns creep; Burr owns root; Coin owns flare; Phoenix owns lift; Fuse owns pulse as thank-you; Chamber owns quiet as thank-you; Ledger owns page as thank-you; Jade owns treaty as thank-you. Plant/bryophyte desk life only — not an animal or moray copy. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "moss";
  const TRICKS = ["tuft", "bead", "spore", "cushion", "thatch"];
  const HAPPY = ["humid", "velvet", "meadow"];
  const HAPPY_DUR = { humid: 1.28, velvet: 1.16, meadow: 1.22 };
  const THATCH_HOLD = 12.4;
  const RELEASE_S = 0.72;
  const DUR = { thatch: THATCH_HOLD + RELEASE_S, tuft: 1.46, bead: 1.22, spore: 1.38, cushion: 1.52 };

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
    if (kind === "thatch") return 50 + roll * 30;
    if (kind === "tuft") return 15 + roll * 11;
    if (kind === "cushion") return 16 + roll * 12;
    return justFinished ? 10.8 + roll * 8 : 5.4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "thatch";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "thatch") {
      if (roll < 0.26) return "tuft";
      if (roll < 0.48) return "bead";
      if (roll < 0.72) return "spore";
      return "cushion";
    }
    if (lastKind === "tuft") {
      if (roll < 0.28) return "thatch";
      if (roll < 0.5) return "bead";
      if (roll < 0.72) return "spore";
      return "cushion";
    }
    if (lastKind === "bead") {
      if (roll < 0.22) return "thatch";
      if (roll < 0.44) return "tuft";
      if (roll < 0.66) return "spore";
      return "cushion";
    }
    if (roll < 0.2) return "thatch";
    if (roll < 0.4) return "tuft";
    if (roll < 0.6) return "bead";
    if (roll < 0.8) return "spore";
    return "cushion";
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
    return key === TRICK_KEY || key === "felt";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "humid";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "humid" ? "talk" : name === "velvet" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function humidPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.humid));
    if (u < 0.22) {
      const s = u / 0.22;
      return { lift: s * 0.08, rot: s * 3.2, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
      const bead = Math.sin(t * 1.55);
      return {
        lift: 0.08 + Math.abs(bead) * 0.04,
        rot: 3.2 + bead * 2.1,
        dx: bead * 0.02,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.06 * (1 - s), rot: 2.2 * (1 - s), dx: 0, anim: "sit" };
  }
  function velvetPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.velvet));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.14, rot: s * -2.4, dx: 0, anim: "play" };
    }
    if (u < 0.76) {
      const nap = Math.sin(t * 1.7);
      return {
        lift: 0.14 + Math.abs(nap) * 0.05,
        rot: -2.4 + nap * 2.2,
        dx: nap * 0.03,
        anim: "play",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.1 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "idle" };
  }
  function meadowPose(t) {
    return {
      lift: 0.03 + Math.abs(Math.sin(t * 0.58)) * 0.04,
      rot: Math.sin(t * 0.72) * 1.1,
      dx: Math.sin(t * 0.4) * -0.04,
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
    if (next.kind === "humid") {
      const pose = humidPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "velvet") {
      const pose = velvetPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = meadowPose(next.t);
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
      kind === "thatch"
        ? "sit"
        : kind === "tuft"
          ? "sit"
          : kind === "bead"
            ? "talk"
            : kind === "spore"
              ? "play"
              : kind === "cushion"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "thatch" ? "hold" : "go",
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

  function thatchPose(t) {
    const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
    return {
      lift: 0.04 + Math.abs(Math.sin(t * 0.42)) * 0.035,
      rot: 1.6 + breath * 1.5,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.04 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 1.4 * (1 - u) };
  }

  function tuftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tuft));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.1, rot: s * 2.5 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.16) / 0.62;
      const swell = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * Math.abs(swell) * 0.02,
        lift: 0.1 + Math.abs(swell) * 0.14,
        rot: facing * (2.5 + swell * 3.2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.1 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "sit",
    };
  }
  function beadPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bead));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.06, rot: s * 6 * facing, anim: "talk" };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const drop = smoothstep(s);
      return {
        x: fromX + facing * drop * 0.1,
        lift: 0.06 + drop * 0.08,
        rot: facing * (6 - drop * 10),
        anim: "talk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.55) / 0.23;
      const roll = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (0.1 + s * 0.06),
        lift: 0.14 - s * 0.06 + roll * 0.03,
        rot: facing * (-4 + roll * 3),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.16 * (1 - s),
      lift: 0.08 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit",
    };
  }
  function sporePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spore));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.08, rot: s * -1.5 * facing, anim: "play" };
    }
    if (u < 0.42) {
      const s = (u - 0.14) / 0.28;
      const loft = smoothstep(s);
      return {
        x: fromX + facing * loft * 0.04,
        lift: 0.08 + loft * 0.32,
        rot: facing * (-1.5 + loft * 4),
        anim: "play",
      };
    }
    if (u < 0.72) {
      const s = (u - 0.42) / 0.3;
      const drift = Math.sin(s * Math.PI * 2.6);
      return {
        x: fromX + facing * (0.04 + drift * 0.05),
        lift: 0.4 - s * 0.18 + Math.abs(drift) * 0.04,
        rot: facing * (2.5 + drift * 3.5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.04 * (1 - s),
      lift: 0.2 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "sit",
    };
  }
  function cushionPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cushion));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.05, rot: s * 1.2 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.16) / 0.54;
      const pulse = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * (s * 0.28 + pulse * 0.02),
        lift: 0.05 + Math.abs(pulse) * 0.04,
        rot: facing * (1.2 + pulse * 1.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX + facing * 0.28 * (1 - s * 0.15),
      lift: 0.05 * (1 - s),
      rot: facing * (1 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "bead" && trick.kind !== "spore" && trick.kind !== "cushion") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "thatch") {
      if (next.t < THATCH_HOLD) {
        const pose = thatchPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < THATCH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - THATCH_HOLD);
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
    if (next.kind === "tuft") {
      const pose = tuftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bead") {
      const pose = beadPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "spore") {
      const pose = sporePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cushionPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    THATCH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    thatchPose,
    releasePose,
    tuftPose,
    beadPose,
    sporePose,
    cushionPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    humidPose,
    velvetPose,
    meadowPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMossTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
