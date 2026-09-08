/** Volt ground tricks while idle. House neighborly Coil Dragon (volt_dragon / Volt) desk life -- coil-edge charge / static fringe crackle / window-wire skim / spark hop / long volt hush; NOT Arc volt_dragon (esp. not coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/longvolthush/densvolt/inkvolt/densvoltdragon); NOT Hide grouper; NOT Soar eagle ray; NOT Vesper dragon (sprawl/guard/smolder/claim/fold); NOT Relay; NOT Fuse; NOT Rui; guest slug Volt / key volt_dragon -- accept volt_dragon and volt; Thank-yous densvolt / inkvolt / densvoltdragon. Sleep, hide, leave, rest, card, ribbon still win. Same map as web volt_dragon-tricks.ts. Next: Trace / trace_dragon. Catalog 220. */
(function (root) {
  const TRICK_KEY = "volt_dragon";
  const TRICKS = ["coiledgecharge", "windowwireskim", "staticfringecrackle", "sparkhop", "longvolthush"];
  const HAPPY = ["densvolt", "inkvolt", "densvoltdragon"];
  const HAPPY_DUR = { densvolt: 3.11, inkvolt: 2.93, densvoltdragon: 2.97 };
  const LONGVOLTHUSH_HOLD = 36.42;
  const RELEASE_S = 2.71;
  const DUR = { longvolthush: LONGVOLTHUSH_HOLD + RELEASE_S, coiledgecharge: 6.22, windowwireskim: 5.97, staticfringecrackle: 5.78, sparkhop: 5.63 };

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
    if (kind === "longvolthush") return 221 + roll * 34;
    if (kind === "windowwireskim") return 27.8 + roll * 3.7;
    if (kind === "sparkhop") return 25.4 + roll * 3.3;
    if (kind === "coiledgecharge") return 26.1 + roll * 3.6;
    if (kind === "staticfringecrackle") return 25.9 + roll * 3.1;
    return justFinished ? 19.6 + roll * 3.4 : 14.8 + roll * 2.9;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longvolthush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longvolthush") {
      if (roll < 0.26) return "windowwireskim";
      if (roll < 0.5) return "sparkhop";
      if (roll < 0.74) return "coiledgecharge";
      return "staticfringecrackle";
    }
    if (lastKind === "windowwireskim") {
      if (roll < 0.26) return "longvolthush";
      if (roll < 0.5) return "sparkhop";
      if (roll < 0.74) return "coiledgecharge";
      return "staticfringecrackle";
    }
    if (lastKind === "sparkhop") {
      if (roll < 0.22) return "longvolthush";
      if (roll < 0.44) return "windowwireskim";
      if (roll < 0.68) return "coiledgecharge";
      return "staticfringecrackle";
    }
    if (roll < 0.2) return "longvolthush";
    if (roll < 0.4) return "windowwireskim";
    if (roll < 0.6) return "sparkhop";
    if (roll < 0.8) return "coiledgecharge";
    return "staticfringecrackle";
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
    return key === TRICK_KEY || key === "volt";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densvolt";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densvolt" ? "sit" : name === "inkvolt" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }




  function densvoltPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densvolt));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0052, rot: s * -0.34, anim: "sit" };
    }
    if (u < 0.85) {
      const sway = Math.sin(((u - 0.13) / 0.72) * Math.PI * 2.85);
      return { lift: 0.0052 + Math.abs(sway) * 0.0017, rot: -0.34 + sway * 0.24, anim: "sit" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.0052 * (1 - s), rot: -0.34 * (1 - s), anim: "idle" };
  }
  function inkvoltPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkvolt));
    if (u < 0.1) {
      const s = u / 0.1;
      return { lift: s * 0.0061, rot: s * 0.42, anim: "play" };
    }
    if (u < 0.87) {
      const bob = Math.sin(((u - 0.1) / 0.77) * Math.PI * 2.55);
      return { lift: 0.0061 + Math.abs(bob) * 0.0021, rot: 0.42 + bob * 0.23, anim: "play" };
    }
    const s = (u - 0.87) / 0.13;
    return { lift: 0.0061 * (1 - s), rot: 0.42 * (1 - s), anim: "idle" };
  }
  function densvoltdragonPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densvoltdragon));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0044, rot: s * -0.26, anim: "play" };
    }
    if (u < 0.87) {
      const hush = Math.sin(((u - 0.12) / 0.75) * Math.PI * 2.15);
      return { lift: 0.0044 + Math.abs(hush) * 0.0014, rot: -0.26 + hush * 0.18, anim: "play" };
    }
    const s = (u - 0.87) / 0.13;
    return { lift: 0.0044 * (1 - s), rot: -0.26 * (1 - s), anim: "idle" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densvolt") {
      const pose = densvoltPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkvolt") {
      const pose = inkvoltPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densvoltdragonPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longvolthush";
    const anim =
      k === "longvolthush"
        ? "sit"
        : k === "windowwireskim"
          ? "walk"
          : k === "sparkhop"
            ? "play"
            : k === "staticfringecrackle"
              ? "sit"
              : k === "coiledgecharge"
                ? "play"
                : "sit";
    return {
      kind: k,
      phase: k === "longvolthush" ? "hold" : "go",
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




  function longvolthushPose(t) {
    const breath = Math.sin(t * 0.00028) + 0.00016 * Math.sin(t * 0.00097);
    const charge = Math.abs(Math.sin(t * 0.00019));
    return { lift: -0.00013 + charge * 0.00015, rot: 0.0011 + breath * 0.0022 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
  }

  function windowwireskimPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.windowwireskim));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00055, lift: s * 0.0026, rot: s * 0.09 * face, anim: "walk" };
    }
    if (u < 0.8) {
      const wire = Math.sin(((u - 0.14) / 0.66) * Math.PI * 4.1);
      const skim = Math.sin(((u - 0.14) / 0.66) * Math.PI * 2.0);
      return {
        x: fromX + face * (0.00055 + (u - 0.14) / 0.66 * 0.0014 + wire * 0.00008),
        lift: 0.0026 + Math.abs(skim) * 0.0021 + Math.abs(wire) * 0.0007,
        rot: (0.09 + skim * 0.13 + wire * 0.05) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return { x: fromX + face * (0.00195 * (1 - s) + 0.00055 * s), lift: 0.0026 * (1 - s), rot: 0.09 * (1 - s) * face, anim: "idle" };
  }
  function sparkhopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sparkhop));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * -0.00004, lift: s * 0.0018, rot: s * -0.12 * face, anim: "play" };
    }
    if (u < 0.42) {
      const s = smoothstep((u - 0.12) / 0.3);
      return { x: fromX + face * (-0.00004 + s * 0.00018), lift: 0.0018 + s * 0.0115, rot: (-0.12 + s * 0.34) * face, anim: "play" };
    }
    if (u < 0.78) {
      const crack = Math.sin(((u - 0.42) / 0.36) * Math.PI * 5.6);
      return {
        x: fromX + face * (0.00014 + crack * 0.00005),
        lift: 0.0133 - ((u - 0.42) / 0.36) * 0.0084 + Math.abs(crack) * 0.0016,
        rot: (0.22 + crack * 0.19) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.00014 * (1 - s), lift: 0.0049 * (1 - s), rot: 0.22 * (1 - s) * face, anim: "idle" };
  }
  function coiledgechargePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.coiledgecharge));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * -0.00011, lift: s * -0.0056, rot: s * 0.36 * face, anim: "play" };
    }
    if (u < 0.78) {
      const coil = Math.sin(((u - 0.16) / 0.62) * Math.PI * 3.3);
      const charge = Math.sin(((u - 0.16) / 0.62) * Math.PI * 6.2);
      return {
        x: fromX + face * (-0.00011 + coil * 0.00007),
        lift: -0.0056 + Math.abs(coil) * 0.0028 + Math.abs(charge) * 0.0019,
        rot: (0.36 + coil * 0.41 + charge * 0.14) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * -0.00011 * (1 - s), lift: -0.0056 * (1 - s), rot: 0.36 * (1 - s) * face, anim: "idle" };
  }
  function staticfringecracklePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.staticfringecrackle));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00003, lift: s * 0.0037, rot: s * 0.11 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const fringe = Math.sin(((u - 0.18) / 0.66) * Math.PI * 7.8);
      const crackle = Math.sin(((u - 0.18) / 0.66) * Math.PI * 3.1);
      return {
        x: fromX + face * (0.00003 + fringe * 0.00004),
        lift: 0.0037 + Math.abs(crackle) * 0.0022 + Math.abs(fringe) * 0.0011,
        rot: (0.11 + fringe * 0.22 + crackle * 0.09) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00003 * (1 - s), lift: 0.0037 * (1 - s), rot: 0.11 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "windowwireskim" && trick.kind !== "sparkhop" && trick.kind !== "coiledgecharge" && trick.kind !== "staticfringecrackle") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longvolthush") {
      if (next.t < LONGVOLTHUSH_HOLD) {
        const pose = longvolthushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGVOLTHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGVOLTHUSH_HOLD);
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
    if (next.kind === "windowwireskim") {
      const pose = windowwireskimPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sparkhop") {
      const pose = sparkhopPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "coiledgecharge") {
      const pose = coiledgechargePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = staticfringecracklePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGVOLTHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densvoltPose,
    inkvoltPose,
    densvoltdragonPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longvolthushPose,
    releasePose,
    windowwireskimPose,
    sparkhopPose,
    coiledgechargePose,
    staticfringecracklePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetVoltDragonTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
