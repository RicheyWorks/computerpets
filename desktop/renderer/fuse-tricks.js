/** Fuse ground tricks while idle — ultra-polish pass. House neighborly Cartridge Dragon fuse_dragon desk life (fuse_dragon / Fuse) — railseat / holdcurrent / blowclear / reseatsnap / cartridgerattle / bladeflash / fusehush personality (railseat rail-seat without naming rail or seat alone as wait — rail seat tell; holdcurrent hold-current without naming hold or current alone as wait — hold current tell; blowclear blow-clear without naming blow or clear alone as wait — blow clear tell; reseatsnap reseat-snap without naming reseat or snap alone as wait — reseat snap tell; cartridgerattle cartridge-rattle without naming cartridge or rattle alone as wait — cartridge rattle tell; bladeflash blade-flash without naming blade or flash alone as wait — blade flash tell; fusehush fuse hush hold (THE fusehush sit_hold tell) — never named wait or crouch or sit or still or fuse_dragon or fuse or cartridge as bare ethogram-only trick kinds; Relay relay_dragon owns contactclick/latchseat/arcflick/coilbuzz/poleswitch/armaturetap/relayhush — do NOT reuse; Gauss gauss_dragon owns filinglinesbandwalk/ironfilingsstand/fieldlinealign/magneticperchsettle/filingsweep/bandclamp/gausshush — do NOT reuse; Spark spark_dragon owns crackpointskitter/snoutcrackpop/clawtipcrackle/tailpointperch/fissureflash/tipscorch/sparkhush — do NOT reuse; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse; Ground ground_dragon owns earth life — do NOT reuse; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse claim; remaining thin non-birds (monarch / bees) next — do NOT start (Ground cooking); guest slug Fuse / key fuse_dragon only for wantsThankYou matching — accept "fuse_dragon" and "fuse"; do NOT name a trick "fuse_dragon" or "fuse" or "seat" or "current" or "blow" or "reseat" or "warm" or "snap" or "pulse" or "relay_dragon" or "relay" or "gauss_dragon" or "spark" or "dragon" or "vesper" or "cartridge" alone as bare wait; not Relay Click Dragon life, not Gauss Filing Dragon life, not Spark Crack Dragon life, not Arc Grid Dragon life, not Ground earth life, not Vesper dragon life, not Rui. Railseat / holdcurrent / blowclear / reseatsnap / cartridgerattle / bladeflash / fusehush; densfuse / inkfuse / densfusedragon thank-yous (never bare HAPPY warm/snap/pulse). Same map as web fuse-tricks.ts. Window-play hold unchanged. Ethogram softs + freeze — never names fuse/still/watch/wait/fuse_dragon as bare ethogram-only trick kinds. True Cartridge Dragon fuse_dragon desk life only — rail seat, hold current, blow clear, reseat snap, cartridge rattle, blade flash, fuse hush. Next house-order ultra: remaining thin non-birds (monarch / bees) (Ground cooking). No cry inventing — check fuse_dragon.wav; prefersHouseCry adds fuse_dragon after relay_dragon only if wav EXISTS. Amplitudes raised toward Rui richness; denser waits/weights; FUSEHUSH_HOLD=11.2 RELEASE_S=1.18. Catalog 221. */
(function (root) {

  const TRICK_KEY = "fuse_dragon";
  const TRICKS = ["railseat", "holdcurrent", "blowclear", "reseatsnap", "cartridgerattle", "bladeflash", "fusehush"];
  const HAPPY = ["densfuse", "inkfuse", "densfusedragon"];

  const HAPPY_DUR = { densfuse: 1.70, inkfuse: 1.84, densfusedragon: 1.76 };
  const FUSEHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    fusehush: FUSEHUSH_HOLD + RELEASE_S,
    railseat: 2.48,
    holdcurrent: 2.42,
    blowclear: 2.40,
    reseatsnap: 2.44,
    cartridgerattle: 2.38,
    bladeflash: 2.56,
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
    if (kind === "fusehush") return 40 + roll * 26;
    if (kind === "cartridgerattle" || kind === "railseat" || kind === "bladeflash") return 12.8 + roll * 9.4;
    if (kind === "blowclear" || kind === "holdcurrent" || kind === "reseatsnap") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "fusehush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "fusehush") {
      if (roll < 0.17) return "railseat";
      if (roll < 0.33) return "holdcurrent";
      if (roll < 0.49) return "blowclear";
      if (roll < 0.65) return "reseatsnap";
      if (roll < 0.83) return "cartridgerattle";
      return "bladeflash";
    }
    if (lastKind === "railseat") {
      if (roll < 0.16) return "fusehush";
      if (roll < 0.32) return "holdcurrent";
      if (roll < 0.48) return "blowclear";
      if (roll < 0.64) return "reseatsnap";
      if (roll < 0.82) return "cartridgerattle";
      return "bladeflash";
    }
    if (lastKind === "holdcurrent") {
      if (roll < 0.14) return "fusehush";
      if (roll < 0.3) return "railseat";
      if (roll < 0.46) return "blowclear";
      if (roll < 0.62) return "reseatsnap";
      if (roll < 0.8) return "cartridgerattle";
      return "bladeflash";
    }
    if (lastKind === "blowclear") {
      if (roll < 0.15) return "fusehush";
      if (roll < 0.31) return "railseat";
      if (roll < 0.47) return "holdcurrent";
      if (roll < 0.63) return "reseatsnap";
      if (roll < 0.81) return "cartridgerattle";
      return "bladeflash";
    }
    if (lastKind === "reseatsnap") {
      if (roll < 0.16) return "fusehush";
      if (roll < 0.32) return "railseat";
      if (roll < 0.48) return "holdcurrent";
      if (roll < 0.64) return "blowclear";
      if (roll < 0.82) return "cartridgerattle";
      return "bladeflash";
    }
    if (lastKind === "cartridgerattle") {
      if (roll < 0.15) return "fusehush";
      if (roll < 0.31) return "railseat";
      if (roll < 0.47) return "holdcurrent";
      if (roll < 0.63) return "blowclear";
      if (roll < 0.81) return "reseatsnap";
      return "bladeflash";
    }
    if (lastKind === "bladeflash") {
      if (roll < 0.16) return "fusehush";
      if (roll < 0.32) return "railseat";
      if (roll < 0.48) return "holdcurrent";
      if (roll < 0.64) return "blowclear";
      if (roll < 0.82) return "reseatsnap";
      return "cartridgerattle";
    }
    if (roll < 0.14) return "fusehush";
    if (roll < 0.28) return "railseat";
    if (roll < 0.42) return "holdcurrent";
    if (roll < 0.56) return "blowclear";
    if (roll < 0.7) return "reseatsnap";
    if (roll < 0.85) return "cartridgerattle";
    return "bladeflash";
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

  function wantsThankYou(key  ) {
    return key === TRICK_KEY || key === "fuse";
  }

  function startThankYou(
    key  ,
    lastKind,
    x,
    facing,
    flags
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = (HAPPY).includes(kind) ? (kind) : "densfuse";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densfuse" ? "sit" : name === "inkfuse" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densfusePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densfuse));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const flash = Math.sin(t * 2.2);
      return {
        lift: 2.8 + Math.abs(flash) * 1.4,
        rot: 12 + flash * 8,
        dx: flash * 0.08,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function inkfusePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkfuse));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" };
    }
    if (u < 0.8) {
      const wriggle = Math.sin(t * 2.6);
      return {
        lift: 3.4 + Math.abs(wriggle) * 1.6,
        rot: -14 + wriggle * 10,
        dx: wriggle * 0.12,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function densfusedragonPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.58) * 8,
      dx: Math.sin(t * 0.4) * 0.06,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densfuse") {
      const pose = densfusePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkfuse") {
      const pose = inkfusePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densfusedragonPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "fusehush";
    const anim =
      k === "fusehush"
        ? "sit"
        : k === "railseat"
          ? "play"
          : k === "bladeflash"
            ? "talk"
            : k === "holdcurrent"
              ? "walk"
              : k === "blowclear"
                ? "sit"
                : k === "reseatsnap"
                  ? "sit"
                  : k === "cartridgerattle"
                    ? "walk"
                    : "sit";
    return {
      kind: k,
      phase: k === "fusehush" ? "hold" : "go",
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

  function fusehushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function railseatPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.railseat));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.78) {
      const bar = Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.8 + bar * 0.16),
        lift: 2.8 + Math.abs(bar) * 1.5,
        rot: face * (-12 + bar * 10),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (-4 * (1 - s)),
      anim: "idle",
    };
  }

  function holdcurrentPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.holdcurrent));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function bladeflashPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bladeflash));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" };
    }
    if (u < 0.8) {
      const cloud = Math.sin(t * 3.0);
      return {
        x: fromX + face * (0.6 + cloud * 0.18),
        lift: 3.0 + Math.abs(cloud) * 1.8,
        rot: face * (14 + cloud * 12),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.5 * (1 - s),
      rot: face * (5 * (1 - s)),
      anim: "idle",
    };
  }

  function reseatsnapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.reseatsnap));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 1.0 * (1 - s),
      lift: 1.6 * (1 - s),
      rot: face * (6 * (1 - s)),
      anim: "idle",
    };
  }

  function blowclearPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.blowclear));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const hang = Math.sin(t * 2.0);
      return {
        x: fromX + face * (0.5 + hang * 0.1),
        lift: 2.8 + Math.abs(hang) * 1.2,
        rot: face * (11 + hang * 8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.5 * (1 - s),
      lift: 1.3 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function cartridgerattlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cartridgerattle));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (4 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "railseat" &&
      trick.kind !== "holdcurrent" &&
      trick.kind !== "blowclear" &&
      trick.kind !== "reseatsnap" &&
      trick.kind !== "cartridgerattle" &&
      trick.kind !== "bladeflash"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "fusehush") {
      if (next.t < FUSEHUSH_HOLD) {
        const pose = fusehushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < FUSEHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - FUSEHUSH_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "railseat") {
      const pose = railseatPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "holdcurrent") {
      const pose = holdcurrentPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "blowclear") {
      const pose = blowclearPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "reseatsnap") {
      const pose = reseatsnapPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cartridgerattle") {
      const pose = cartridgerattlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bladeflashPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }



  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    FUSEHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    fusehushPose,
    releasePose,
    railseatPose,
    holdcurrentPose,
    bladeflashPose,
    reseatsnapPose,
    blowclearPose,
    cartridgerattlePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densfusePose,
    inkfusePose,
    densfusedragonPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFuseTricks = api;
})(typeof window !== "undefined" ? window : globalThis);