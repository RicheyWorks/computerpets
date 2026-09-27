/** Veil ground tricks while idle — ultra-polish pass. House neighborly Red Lionfish Pterois volitans / Pteroinae / Scorpaenidae lionfish desk life (lionfish / Veil) — pectoralveilfanflare / gulpinginhalecue / spinewarnraise / slowhoverstalk / stripebar / venomwarn / pteroishush personality (pectoralveilfanflare pectoral-veil fan flare without naming veil or fan or flare alone as wait — Pterois pectoral-fin tell; gulpinginhalecue gulping inhale cue without naming gulping or inhale or cue alone as wait — ambush-gulp tell; spinewarnraise dorsal spine warn raise without naming spine or warn or raise alone as wait — venomous dorsal-ray tell; slowhoverstalk slow hover stalk without naming hover or stalk alone as wait — leaf-mimic hover hunt; stripebar zebra stripe-bar flash without naming stripe or bar alone as wait — P. volitans radial-bar tell; venomwarn venom-spine warn without naming venom or warn alone as wait — Scorpaenidae defense tell; long pteroishush Pterois hush hold (THE pteroishush sit_hold tell) — never named wait or crouch or sit or still or lionfish or veil as bare ethogram-only trick kinds; Tube sea_cucumber owns tubefootcrawl/holothuriahush/depositfeedsift — do NOT reuse; Scrub cleaner_shrimp owns antennawaveadvertise/lysmatahush — do NOT reuse; Scrape parrotfish owns beakscrapegraze/scarushush/pectoralhover — do NOT reuse; Paint clownfish owns peckcleanhost/amphiprionhush — do NOT reuse; Shift chameleon owns veilflush/turretgaze/calyptratus — do NOT reuse (Guest Shift is Veiled Chameleon — keep lionfish kinds distinct); Gate giant_clam comes next — do NOT start; guest slug Veil / key lionfish only for wantsThankYou matching — accept "lionfish" and "veil"; do NOT name a trick "lionfish" or "veil" or "sea_cucumber" or "tube" or "cleaner_shrimp" or "scrub" or "parrotfish" or "scrape" or "clownfish" or "paint" or "chameleon" or "shift" or "giant_clam" or "gate"; not Tube Holothuroidea life, not Scrub Lysmata life, not Scrape Scaridae life, not Paint Amphiprion life, not Shift Chamaeleonidae life, not Gate Tridacna life, not Rui. Pectoralveilfanflare / gulpinginhalecue / spinewarnraise / slowhoverstalk / stripebar / venomwarn / pteroishush; densveil / inkveil / denspterois thank-yous. Same map as web lionfish-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names veil/hover/still/wait/lionfish as bare ethogram-only trick kinds. True Red Lionfish Pterois volitans desk life only — pectoral-veil fan, gulping inhale, spine warn raise, slow hover stalk, stripe-bar flash, venom warn, Pterois hush. Next house-order ultra: Gate / giant_clam. No cry inventing — lionfish.wav EXISTS so prefersHouseCry adds lionfish after sea_cucumber. Amplitudes raised toward Rui richness; denser waits/weights; PTEROISHUSH_HOLD=11.2 RELEASE_S=1.18 (not 33.84/2.48). Catalog 221. */
(function (root) {

  const TRICK_KEY = "lionfish";
  const TRICKS = ["pectoralveilfanflare", "gulpinginhalecue", "spinewarnraise", "slowhoverstalk", "stripebar", "venomwarn", "pteroishush"];
  const HAPPY = ["densveil", "inkveil", "denspterois"];

  const HAPPY_DUR = { densveil: 1.70, inkveil: 1.84, denspterois: 1.76 };
  const PTEROISHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    pteroishush: PTEROISHUSH_HOLD + RELEASE_S,
    pectoralveilfanflare: 2.48,
    gulpinginhalecue: 2.42,
    spinewarnraise: 2.40,
    slowhoverstalk: 2.44,
    stripebar: 2.38,
    venomwarn: 2.56,
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
    if (kind === "pteroishush") return 40 + roll * 26;
    if (kind === "stripebar" || kind === "pectoralveilfanflare" || kind === "venomwarn") return 12.8 + roll * 9.4;
    if (kind === "spinewarnraise" || kind === "gulpinginhalecue" || kind === "slowhoverstalk") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "pteroishush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "pteroishush") {
      if (roll < 0.17) return "pectoralveilfanflare";
      if (roll < 0.33) return "gulpinginhalecue";
      if (roll < 0.49) return "spinewarnraise";
      if (roll < 0.65) return "slowhoverstalk";
      if (roll < 0.83) return "stripebar";
      return "venomwarn";
    }
    if (lastKind === "pectoralveilfanflare") {
      if (roll < 0.16) return "pteroishush";
      if (roll < 0.32) return "gulpinginhalecue";
      if (roll < 0.48) return "spinewarnraise";
      if (roll < 0.64) return "slowhoverstalk";
      if (roll < 0.82) return "stripebar";
      return "venomwarn";
    }
    if (lastKind === "gulpinginhalecue") {
      if (roll < 0.14) return "pteroishush";
      if (roll < 0.3) return "pectoralveilfanflare";
      if (roll < 0.46) return "spinewarnraise";
      if (roll < 0.62) return "slowhoverstalk";
      if (roll < 0.8) return "stripebar";
      return "venomwarn";
    }
    if (lastKind === "spinewarnraise") {
      if (roll < 0.15) return "pteroishush";
      if (roll < 0.31) return "pectoralveilfanflare";
      if (roll < 0.47) return "gulpinginhalecue";
      if (roll < 0.63) return "slowhoverstalk";
      if (roll < 0.81) return "stripebar";
      return "venomwarn";
    }
    if (lastKind === "slowhoverstalk") {
      if (roll < 0.16) return "pteroishush";
      if (roll < 0.32) return "pectoralveilfanflare";
      if (roll < 0.48) return "gulpinginhalecue";
      if (roll < 0.64) return "spinewarnraise";
      if (roll < 0.82) return "stripebar";
      return "venomwarn";
    }
    if (lastKind === "stripebar") {
      if (roll < 0.15) return "pteroishush";
      if (roll < 0.31) return "pectoralveilfanflare";
      if (roll < 0.47) return "gulpinginhalecue";
      if (roll < 0.63) return "spinewarnraise";
      if (roll < 0.81) return "slowhoverstalk";
      return "venomwarn";
    }
    if (lastKind === "venomwarn") {
      if (roll < 0.16) return "pteroishush";
      if (roll < 0.32) return "pectoralveilfanflare";
      if (roll < 0.48) return "gulpinginhalecue";
      if (roll < 0.64) return "spinewarnraise";
      if (roll < 0.82) return "slowhoverstalk";
      return "stripebar";
    }
    if (roll < 0.14) return "pteroishush";
    if (roll < 0.28) return "pectoralveilfanflare";
    if (roll < 0.42) return "gulpinginhalecue";
    if (roll < 0.56) return "spinewarnraise";
    if (roll < 0.7) return "slowhoverstalk";
    if (roll < 0.85) return "stripebar";
    return "venomwarn";
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
    return key === TRICK_KEY || key === "veil";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densveil";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densveil" ? "sit" : name === "inkveil" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densveilPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densveil));
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

  function inkveilPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkveil));
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

  function denspteroisPose(t) {
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
    if (next.kind === "densveil") {
      const pose = densveilPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkveil") {
      const pose = inkveilPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denspteroisPose(next.t);
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
    const anim =
      kind === "pteroishush"
        ? "sit"
        : kind === "pectoralveilfanflare"
          ? "sit"
          : kind === "venomwarn"
            ? "talk"
            : kind === "gulpinginhalecue"
              ? "play"
              : kind === "spinewarnraise"
                ? "sit"
                : kind === "slowhoverstalk"
                  ? "sit"
                  : kind === "stripebar"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "pteroishush" ? "hold" : "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim,
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function pteroishushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function pectoralveilfanflarePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pectoralveilfanflare));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const bar = Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.8 + bar * 0.16),
        lift: 2.8 + Math.abs(bar) * 1.5,
        rot: face * (-12 + bar * 10),
        anim: "sit",
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

  function gulpinginhalecuePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gulpinginhalecue));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "play" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "play",
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

  function venomwarnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.venomwarn));
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

  function slowhoverstalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.slowhoverstalk));
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

  function spinewarnraisePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spinewarnraise));
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

  function stripebarPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stripebar));
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
      trick.kind !== "pectoralveilfanflare" &&
      trick.kind !== "gulpinginhalecue" &&
      trick.kind !== "spinewarnraise" &&
      trick.kind !== "slowhoverstalk" &&
      trick.kind !== "stripebar" &&
      trick.kind !== "venomwarn"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "pteroishush") {
      if (next.t < PTEROISHUSH_HOLD) {
        const pose = pteroishushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PTEROISHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PTEROISHUSH_HOLD);
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
    if (next.kind === "pectoralveilfanflare") {
      const pose = pectoralveilfanflarePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gulpinginhalecue") {
      const pose = gulpinginhalecuePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "spinewarnraise") {
      const pose = spinewarnraisePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "slowhoverstalk") {
      const pose = slowhoverstalkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stripebar") {
      const pose = stripebarPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = venomwarnPose(next.t, fromX, trick.facing);
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
    PTEROISHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    pteroishushPose,
    releasePose,
    pectoralveilfanflarePose,
    gulpinginhalecuePose,
    venomwarnPose,
    slowhoverstalkPose,
    spinewarnraisePose,
    stripebarPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densveilPose,
    inkveilPose,
    denspteroisPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCleanerShrimpTricks = api;
})(typeof window !== "undefined" ? window : globalThis);