/** Ledger ground tricks while idle. House horseshoe crab — carapace / bookgill / telson / furrow / fossil personality (ancient helmet settle, book-gill breath flaps, telson dig probes, sand furrow pushes, living-fossil desk life; not Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Clip nest/cheek/scurry/pocket/reel, Burr curl/snuffle, Chamber spiral, Cup mantle, Ink soak/tuck, or Coin drift). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web horseshoe_crab-tricks.ts. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play PLOW unchanged — never names plow. Special Molt unchanged — never names molt as a trick. Tenant owns swap/antenna/scuttle/withdraw/vacancy and scrap/fit/lease; Cling owns podia/righting/crawl/evert/penta and damp/press/tide; Pulse owns bell/oral/lucent/trail/medusa and halo/lumen/gel; Cup owns jet/mantle/sucker/veil/tinker and keep/tint/squeeze; Sepia owns bone/pupil/chroma/hover/blot and ripple/glance/dab; Chamber owns spiral/siphuncle/nacre/pinhole/fringe and chamber/pearl/quiet; Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; Clip owns nest/cheek/scurry/pocket/reel and stuff/chitter/sprint; Burr owns curl; Fuse owns pulse as thank-you; ferret owns tube; Bluff owns hood; Bandit owns tribute; Phoenix owns lift; Sol owns press as a trick and tap as thank-you; rabbit owns dig. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "horseshoe_crab";
  const TRICKS = ["carapace", "bookgill", "telson", "furrow", "fossil"];
  const HAPPY = ["blue", "page", "tray"];
  const HAPPY_DUR = { blue: 1.24, page: 1.16, tray: 1.2 };
  const CARAPACE_HOLD = 12.2;
  const RELEASE_S = 0.72;
  const DUR = { carapace: CARAPACE_HOLD + RELEASE_S, bookgill: 1.36, telson: 1.48, furrow: 1.66, fossil: 1.42 };

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
    if (kind === "carapace") return 49 + roll * 28;
    if (kind === "furrow") return 18 + roll * 12;
    if (kind === "telson") return 16 + roll * 11;
    return justFinished ? 10.5 + roll * 8 : 5.2 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "carapace";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "carapace") {
      if (roll < 0.26) return "bookgill";
      if (roll < 0.48) return "telson";
      if (roll < 0.72) return "furrow";
      return "fossil";
    }
    if (lastKind === "bookgill") {
      if (roll < 0.28) return "carapace";
      if (roll < 0.5) return "telson";
      if (roll < 0.72) return "furrow";
      return "fossil";
    }
    if (lastKind === "telson") {
      if (roll < 0.22) return "carapace";
      if (roll < 0.44) return "bookgill";
      if (roll < 0.66) return "furrow";
      return "fossil";
    }
    if (roll < 0.2) return "carapace";
    if (roll < 0.4) return "bookgill";
    if (roll < 0.6) return "telson";
    if (roll < 0.8) return "furrow";
    return "fossil";
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
    return key === TRICK_KEY || key === "ledger";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "blue";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "blue" ? "talk" : name === "page" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function bluePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blue));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.3, rot: s * 2.4, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      const ink = Math.sin(t * 1.9);
      return {
        lift: 0.3 + Math.abs(ink) * 0.08,
        rot: 2.4 + ink * 3.6,
        dx: ink * 0.03,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.24 * (1 - s), rot: 1.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function pagePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.page));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.22, rot: s * -6.5, dx: 0, anim: "play" };
    }
    if (u < 0.78) {
      const turn = Math.sin(t * 1.85);
      return {
        lift: 0.22 + Math.abs(turn) * 0.12,
        rot: -6.5 + turn * 11,
        dx: turn * 0.06,
        anim: "play",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.18 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" };
  }

  function trayPose(t) {
    return {
      lift: 0.12 + Math.abs(Math.sin(t * 0.95)) * 0.14,
      rot: Math.sin(t * 1.15) * 2.4,
      dx: Math.sin(t * 0.7) * 0.03,
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
    if (next.kind === "blue") {
      const pose = bluePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "page") {
      const pose = pagePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = trayPose(next.t);
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
      kind === "carapace"
        ? "sit"
        : kind === "bookgill"
          ? "talk"
          : kind === "telson"
            ? "play"
            : kind === "furrow"
              ? "walk"
              : kind === "fossil"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "carapace" ? "hold" : "go",
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

  function carapacePose(t) {
    const breath = Math.sin(t * 0.52) + 0.08 * Math.sin(t * 1.4);
    return {
      lift: 0.08 + Math.abs(Math.sin(t * 0.52)) * 0.06,
      rot: breath * 0.9,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.08 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.7 * (1 - u) };
  }

  function bookgillPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bookgill));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.14, rot: s * 3 * facing, anim: "talk" };
    }
    if (u < 0.8) {
      const s = (u - 0.12) / 0.68;
      const flap = Math.sin(s * Math.PI * 5.2);
      const rock = Math.sin(s * Math.PI * 1.1);
      return {
        x: fromX + facing * rock * 0.05,
        lift: 0.14 + Math.abs(flap) * 0.08,
        rot: facing * (3 + flap * 5.5 + rock * 1.5),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 0.12 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "sit",
    };
  }

  function telsonPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.telson));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.35, rot: s * -12 * facing, anim: "play" };
    }
    if (u < 0.72) {
      const s = (u - 0.14) / 0.58;
      const dig = Math.sin(s * Math.PI * 3.4);
      return {
        x: fromX + facing * dig * 0.1,
        lift: 0.35 - Math.abs(dig) * 0.18,
        rot: facing * (-12 + dig * 14),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.28 * (1 - s),
      rot: facing * (-5 * (1 - s)),
      anim: "sit",
    };
  }

  function furrowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.furrow));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.1, rot: s * -4 * facing, anim: "walk" };
    }
    if (u < 0.78) {
      const s = (u - 0.12) / 0.66;
      const grind = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * s * 1.55,
        lift: 0.1 + Math.abs(grind) * 0.06,
        rot: facing * (-4 + grind * 3.5),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 1.55 * (1 - s * 0.15),
      lift: 0.1 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "idle",
    };
  }

  function fossilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fossil));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * 0.06, rot: s * 1.5 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.2) / 0.58;
      const alive = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + facing * alive * 0.04,
        lift: 0.06 + Math.abs(alive) * 0.04,
        rot: facing * (1.5 + alive * 1.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.06 * (1 - s),
      rot: facing * (1 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "furrow" && trick.kind !== "telson" && trick.kind !== "fossil") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "carapace") {
      if (next.t < CARAPACE_HOLD) {
        const pose = carapacePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CARAPACE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CARAPACE_HOLD);
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
    if (next.kind === "bookgill") {
      const pose = bookgillPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "telson") {
      const pose = telsonPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "furrow") {
      const pose = furrowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = fossilPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CARAPACE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    carapacePose,
    releasePose,
    bookgillPose,
    telsonPose,
    furrowPose,
    fossilPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    bluePose,
    pagePose,
    trayPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHorseshoeCrabTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
