/** Trace ground tricks while idle. House neighborly Path Dragon (trace_dragon / Trace) desk life -- outline-trace path walk / dashed-line flicker / corner snap turn / breadcrumb perch / long trace hush; NOT Volt volt_dragon (esp. not coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/longvolthush/densvolt/inkvolt/densvoltdragon); NOT Arc cyber_dragon (esp. not arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/longcyberhush/densarc/inkarc/denscyber); NOT Hide grouper; NOT Soar eagle ray; NOT Vesper dragon (sprawl/guard/smolder/claim/fold); NOT Relay; NOT Fuse; NOT Rui; guest slug Trace / key trace_dragon -- accept trace_dragon and trace; Thank-yous denstrace / inktrace / denstracedragon. Sleep, hide, leave, rest, card, ribbon still win. Same map as web trace_dragon-tricks.ts. Next: Flux / flux_dragon. Catalog 220. */
(function (root) {
  const TRICK_KEY = "trace_dragon";
  const TRICKS = ["outlinetracepathwalk", "dashedlineflicker", "cornersnapturn", "breadcrumbperch", "longtracehush"];
  const HAPPY = ["denstrace", "inktrace", "denstracedragon"];
  const HAPPY_DUR = { denstrace: 3.18, inktrace: 2.86, denstracedragon: 3.04 };
  const LONGTRACEHUSH_HOLD = 37.18;
  const RELEASE_S = 2.64;
  const DUR = { longtracehush: LONGTRACEHUSH_HOLD + RELEASE_S, outlinetracepathwalk: 6.41, dashedlineflicker: 5.84, cornersnapturn: 5.52, breadcrumbperch: 5.71 };

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
    if (kind === "longtracehush") return 224 + roll * 36;
    if (kind === "dashedlineflicker") return 28.2 + roll * 3.5;
    if (kind === "breadcrumbperch") return 26.0 + roll * 3.2;
    if (kind === "outlinetracepathwalk") return 26.8 + roll * 3.4;
    if (kind === "cornersnapturn") return 25.2 + roll * 3.4;
    return justFinished ? 19.6 + roll * 3.4 : 14.8 + roll * 2.9;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longtracehush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longtracehush") {
      if (roll < 0.26) return "dashedlineflicker";
      if (roll < 0.5) return "breadcrumbperch";
      if (roll < 0.74) return "outlinetracepathwalk";
      return "cornersnapturn";
    }
    if (lastKind === "dashedlineflicker") {
      if (roll < 0.26) return "longtracehush";
      if (roll < 0.5) return "breadcrumbperch";
      if (roll < 0.74) return "outlinetracepathwalk";
      return "cornersnapturn";
    }
    if (lastKind === "breadcrumbperch") {
      if (roll < 0.22) return "longtracehush";
      if (roll < 0.44) return "dashedlineflicker";
      if (roll < 0.68) return "outlinetracepathwalk";
      return "cornersnapturn";
    }
    if (roll < 0.2) return "longtracehush";
    if (roll < 0.4) return "dashedlineflicker";
    if (roll < 0.6) return "breadcrumbperch";
    if (roll < 0.8) return "outlinetracepathwalk";
    return "cornersnapturn";
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
    return key === TRICK_KEY || key === "trace";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denstrace";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denstrace" ? "sit" : name === "inktrace" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }





  function denstracePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstrace));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0048, rot: s * -0.31, anim: "sit" };
    }
    if (u < 0.86) {
      const sway = Math.sin(((u - 0.12) / 0.74) * Math.PI * 2.65);
      return { lift: 0.0048 + Math.abs(sway) * 0.0015, rot: -0.31 + sway * 0.22, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0048 * (1 - s), rot: -0.31 * (1 - s), anim: "idle" };
  }
  function inktracePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inktrace));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.0057, rot: s * 0.38, anim: "play" };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.11) / 0.75) * Math.PI * 2.7);
      return { lift: 0.0057 + Math.abs(bob) * 0.0019, rot: 0.38 + bob * 0.21, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0057 * (1 - s), rot: 0.38 * (1 - s), anim: "idle" };
  }
  function denstracedragonPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstracedragon));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0041, rot: s * -0.23, anim: "play" };
    }
    if (u < 0.86) {
      const hush = Math.sin(((u - 0.13) / 0.73) * Math.PI * 2.05);
      return { lift: 0.0041 + Math.abs(hush) * 0.0013, rot: -0.23 + hush * 0.16, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0041 * (1 - s), rot: -0.23 * (1 - s), anim: "idle" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denstrace") {
      const pose = denstracePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inktrace") {
      const pose = inktracePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denstracedragonPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longtracehush";
    const anim =
      k === "longtracehush"
        ? "sit"
        : k === "dashedlineflicker"
          ? "sit"
          : k === "breadcrumbperch"
            ? "sit"
            : k === "cornersnapturn"
              ? "play"
              : k === "outlinetracepathwalk"
                ? "walk"
                : "sit";
    return {
      kind: k,
      phase: k === "longtracehush" ? "hold" : "go",
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





  function longtracehushPose(t) {
    const breath = Math.sin(t * 0.00031) + 0.00014 * Math.sin(t * 0.00105);
    const path = Math.abs(Math.sin(t * 0.00017));
    return { lift: -0.00011 + path * 0.00013, rot: 0.0009 + breath * 0.0019 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00011 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0028 * (1 - u) };
  }

  function dashedlineflickerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dashedlineflicker));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00022, lift: s * 0.0016, rot: s * 0.07 * face, anim: "sit" };
    }
    if (u < 0.82) {
      const dash = Math.sin(((u - 0.12) / 0.7) * Math.PI * 9.2);
      const gap = Math.sin(((u - 0.12) / 0.7) * Math.PI * 4.6);
      const on = dash > 0 ? 1 : 0.18;
      return {
        x: fromX + face * (0.00022 + (u - 0.12) / 0.7 * 0.0011 + gap * 0.00006),
        lift: 0.0016 * on + Math.abs(gap) * 0.0014,
        rot: (0.07 + dash * 0.11 + gap * 0.04) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * (0.00132 * (1 - s) + 0.00022 * s), lift: 0.0016 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" };
  }
  function breadcrumbperchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.breadcrumbperch));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00008, lift: s * 0.0042, rot: s * -0.08 * face, anim: "sit" };
    }
    if (u < 0.38) {
      const s = smoothstep((u - 0.14) / 0.24);
      return { x: fromX + face * (0.00008 + s * 0.00042), lift: 0.0042 + s * 0.0068, rot: (-0.08 + s * 0.18) * face, anim: "sit" };
    }
    if (u < 0.72) {
      const crumb = Math.sin(((u - 0.38) / 0.34) * Math.PI * 3.4);
      return {
        x: fromX + face * (0.0005 + crumb * 0.00009),
        lift: 0.011 - ((u - 0.38) / 0.34) * 0.0046 + Math.abs(crumb) * 0.0012,
        rot: (0.1 + crumb * 0.14) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.0064 * (1 - s), rot: 0.1 * (1 - s) * face, anim: "idle" };
  }
  function outlinetracepathwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.outlinetracepathwalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX + face * s * 0.0004, lift: s * 0.0021, rot: s * 0.06 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const outline = Math.sin(((u - 0.15) / 0.63) * Math.PI * 5.2);
      const path = ((u - 0.15) / 0.63);
      return {
        x: fromX + face * (0.0004 + path * 0.00185 + outline * 0.00011),
        lift: 0.0021 + Math.abs(outline) * 0.0018,
        rot: (0.06 + outline * 0.09) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * (0.00225 * (1 - s) + 0.0004 * s), lift: 0.0021 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" };
  }
  function cornersnapturnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cornersnapturn));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00005, lift: s * 0.0024, rot: s * 0.18 * face, anim: "play" };
    }
    if (u < 0.4) {
      const s = smoothstep((u - 0.16) / 0.24);
      return { x: fromX + face * (0.00005 + s * 0.00035), lift: 0.0024 + s * 0.0031, rot: (0.18 + s * 0.72) * face, anim: "play" };
    }
    if (u < 0.78) {
      const snap = Math.sin(((u - 0.4) / 0.38) * Math.PI * 2.2);
      return {
        x: fromX + face * (0.0004 + snap * 0.00007),
        lift: 0.0055 + Math.abs(snap) * 0.0016,
        rot: (0.9 + snap * 0.28) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.0004 * (1 - s), lift: 0.0055 * (1 - s), rot: 0.9 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "dashedlineflicker" && trick.kind !== "breadcrumbperch" && trick.kind !== "outlinetracepathwalk" && trick.kind !== "cornersnapturn") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longtracehush") {
      if (next.t < LONGTRACEHUSH_HOLD) {
        const pose = longtracehushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGTRACEHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGTRACEHUSH_HOLD);
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
    if (next.kind === "dashedlineflicker") {
      const pose = dashedlineflickerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "breadcrumbperch") {
      const pose = breadcrumbperchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "outlinetracepathwalk") {
      const pose = outlinetracepathwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cornersnapturnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGTRACEHUSH_HOLD,
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
    denstracePose,
    inktracePose,
    denstracedragonPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longtracehushPose,
    releasePose,
    dashedlineflickerPose,
    breadcrumbperchPose,
    outlinetracepathwalkPose,
    cornersnapturnPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetTraceDragonTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
