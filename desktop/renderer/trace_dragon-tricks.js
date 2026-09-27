/** Trace ground tricks while idle — ultra-polish pass. House neighborly Path Dragon trace_dragon desk life (trace_dragon / Trace) — outlinetracepathwalk / dashedlineflicker / cornersnapturn / breadcrumbperch / pathglow / waypointskip / tracehush personality (outlinetracepathwalk outline-trace path walk without naming outline or path or walk alone as wait — outline-trace path walk tell; dashedlineflicker dashed-line flicker without naming dashed or line or flicker alone as wait — dashed-line flicker tell; cornersnapturn corner-snap turn without naming corner or snap or turn alone as wait — corner snap turn tell; breadcrumbperch breadcrumb perch without naming breadcrumb or perch alone as wait — breadcrumb perch tell; pathglow path-glow without naming path or glow alone as wait — path glow tell (distinct from Flux later); waypointskip waypoint-skip without naming waypoint or skip alone as wait — waypoint skip tell; tracehush trace hush hold (THE tracehush sit_hold tell) — never named wait or crouch or sit or still or trace_dragon or trace as bare ethogram-only trick kinds; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT reuse; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse; Hide grouper owns cavernambushsettle/gulargulpinhale/colorpatternflush/slowcaudalhover/jawsnap/stripeband/epinephelushush — do NOT reuse; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Fuse owns fuse life — do NOT reuse; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse; Spark spark_dragon next — do NOT start (Flux landed); guest slug Trace / key trace_dragon only for wantsThankYou matching — accept "trace_dragon" and "trace"; do NOT name a trick "trace_dragon" or "trace" or "volt_dragon" or "volt" or "cyber_dragon" or "arc" or "grouper" or "hide" or "relay" or "fuse" or "dragon" or "vesper" or "flux"; not Volt Coil Dragon life, not Arc Grid Dragon life, not Hide Epinephelus life, not Relay click/latch life, not Fuse life, not Vesper dragon life, not Flux life, not Rui. Outlinetracepathwalk / dashedlineflicker / cornersnapturn / breadcrumbperch / pathglow / waypointskip / tracehush; denstrace / inktrace / denstracedragon thank-yous. Same map as web trace_dragon-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names path/still/watch/wait/trace_dragon as bare ethogram-only trick kinds. True Path Dragon trace_dragon desk life only — outline-trace path walk, dashed-line flicker, corner snap turn, breadcrumb perch, path glow, waypoint skip, trace hush. Next house-order ultra: Spark / spark_dragon (Flux landed). No cry inventing — trace_dragon.wav EXISTS so prefersHouseCry adds trace_dragon after volt_dragon. Amplitudes raised toward Rui richness; denser waits/weights; TRACEHUSH_HOLD=11.2 RELEASE_S=1.18 (not 37.18/2.64). Catalog 221. */
(function (root) {

  const TRICK_KEY = "trace_dragon";
  const TRICKS = ["outlinetracepathwalk", "dashedlineflicker", "cornersnapturn", "breadcrumbperch", "pathglow", "waypointskip", "tracehush"];
  const HAPPY = ["denstrace", "inktrace", "denstracedragon"];

  const HAPPY_DUR = { denstrace: 1.70, inktrace: 1.84, denstracedragon: 1.76 };
  const TRACEHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    tracehush: TRACEHUSH_HOLD + RELEASE_S,
    outlinetracepathwalk: 2.48,
    dashedlineflicker: 2.42,
    cornersnapturn: 2.40,
    breadcrumbperch: 2.44,
    pathglow: 2.38,
    waypointskip: 2.56,
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
    if (kind === "tracehush") return 40 + roll * 26;
    if (kind === "pathglow" || kind === "outlinetracepathwalk" || kind === "waypointskip") return 12.8 + roll * 9.4;
    if (kind === "cornersnapturn" || kind === "dashedlineflicker" || kind === "breadcrumbperch") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tracehush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tracehush") {
      if (roll < 0.17) return "outlinetracepathwalk";
      if (roll < 0.33) return "dashedlineflicker";
      if (roll < 0.49) return "cornersnapturn";
      if (roll < 0.65) return "breadcrumbperch";
      if (roll < 0.83) return "pathglow";
      return "waypointskip";
    }
    if (lastKind === "outlinetracepathwalk") {
      if (roll < 0.16) return "tracehush";
      if (roll < 0.32) return "dashedlineflicker";
      if (roll < 0.48) return "cornersnapturn";
      if (roll < 0.64) return "breadcrumbperch";
      if (roll < 0.82) return "pathglow";
      return "waypointskip";
    }
    if (lastKind === "dashedlineflicker") {
      if (roll < 0.14) return "tracehush";
      if (roll < 0.3) return "outlinetracepathwalk";
      if (roll < 0.46) return "cornersnapturn";
      if (roll < 0.62) return "breadcrumbperch";
      if (roll < 0.8) return "pathglow";
      return "waypointskip";
    }
    if (lastKind === "cornersnapturn") {
      if (roll < 0.15) return "tracehush";
      if (roll < 0.31) return "outlinetracepathwalk";
      if (roll < 0.47) return "dashedlineflicker";
      if (roll < 0.63) return "breadcrumbperch";
      if (roll < 0.81) return "pathglow";
      return "waypointskip";
    }
    if (lastKind === "breadcrumbperch") {
      if (roll < 0.16) return "tracehush";
      if (roll < 0.32) return "outlinetracepathwalk";
      if (roll < 0.48) return "dashedlineflicker";
      if (roll < 0.64) return "cornersnapturn";
      if (roll < 0.82) return "pathglow";
      return "waypointskip";
    }
    if (lastKind === "pathglow") {
      if (roll < 0.15) return "tracehush";
      if (roll < 0.31) return "outlinetracepathwalk";
      if (roll < 0.47) return "dashedlineflicker";
      if (roll < 0.63) return "cornersnapturn";
      if (roll < 0.81) return "breadcrumbperch";
      return "waypointskip";
    }
    if (lastKind === "waypointskip") {
      if (roll < 0.16) return "tracehush";
      if (roll < 0.32) return "outlinetracepathwalk";
      if (roll < 0.48) return "dashedlineflicker";
      if (roll < 0.64) return "cornersnapturn";
      if (roll < 0.82) return "breadcrumbperch";
      return "pathglow";
    }
    if (roll < 0.14) return "tracehush";
    if (roll < 0.28) return "outlinetracepathwalk";
    if (roll < 0.42) return "dashedlineflicker";
    if (roll < 0.56) return "cornersnapturn";
    if (roll < 0.7) return "breadcrumbperch";
    if (roll < 0.85) return "pathglow";
    return "waypointskip";
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
    return key === TRICK_KEY || key === "trace";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denstrace";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denstrace" ? "sit" : name === "inktrace" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denstracePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstrace));
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

  function inktracePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inktrace));
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

  function denstracedragonPose(t) {
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
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "tracehush";
    const anim =
      k === "tracehush"
        ? "sit"
        : k === "outlinetracepathwalk"
          ? "play"
          : k === "waypointskip"
            ? "talk"
            : k === "dashedlineflicker"
              ? "walk"
              : k === "cornersnapturn"
                ? "sit"
                : k === "breadcrumbperch"
                  ? "sit"
                  : k === "pathglow"
                    ? "walk"
                    : "sit";
    return {
      kind: k,
      phase: k === "tracehush" ? "hold" : "go",
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

  function tracehushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function outlinetracepathwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.outlinetracepathwalk));
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

  function dashedlineflickerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dashedlineflicker));
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

  function waypointskipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.waypointskip));
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

  function breadcrumbperchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.breadcrumbperch));
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

  function cornersnapturnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cornersnapturn));
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

  function pathglowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pathglow));
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
      trick.kind !== "outlinetracepathwalk" &&
      trick.kind !== "dashedlineflicker" &&
      trick.kind !== "cornersnapturn" &&
      trick.kind !== "breadcrumbperch" &&
      trick.kind !== "pathglow" &&
      trick.kind !== "waypointskip"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "tracehush") {
      if (next.t < TRACEHUSH_HOLD) {
        const pose = tracehushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TRACEHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TRACEHUSH_HOLD);
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
    if (next.kind === "outlinetracepathwalk") {
      const pose = outlinetracepathwalkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dashedlineflicker") {
      const pose = dashedlineflickerPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cornersnapturn") {
      const pose = cornersnapturnPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "breadcrumbperch") {
      const pose = breadcrumbperchPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pathglow") {
      const pose = pathglowPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = waypointskipPose(next.t, fromX, trick.facing);
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
    TRACEHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    tracehushPose,
    releasePose,
    outlinetracepathwalkPose,
    dashedlineflickerPose,
    waypointskipPose,
    breadcrumbperchPose,
    cornersnapturnPose,
    pathglowPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denstracePose,
    inktracePose,
    denstracedragonPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetTraceDragonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);