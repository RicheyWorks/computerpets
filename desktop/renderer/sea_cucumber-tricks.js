/** Tube ground tricks while idle — ultra-polish pass. House neighborly Pineapple Sea Cucumber Thelenota ananas / Holothuroidea sea cucumber desk life (sea_cucumber / Tube) — tubefootcrawl / depositfeedsift / cucumberswellshrink / softretractcue / teatspike / cloacalbreathe / holothuriahush personality (tubefootcrawl tube-foot crawl without naming tube or foot or crawl alone as wait — Thelenota podia gait; depositfeedsift deposit-feed sift without naming deposit or feed or sift alone as wait — detritus gut tell; cucumberswellshrink cucumber body swell-shrink without naming cucumber or swell or shrink alone as wait — hydrostatic tell; softretractcue soft retract defense cue without naming soft or retract or cue alone as wait — predator-tuck tell; teatspike pineapple teat-spike flare without naming teat or spike alone as wait — T. ananas papilla tell; cloacalbreathe cloacal breathe without naming cloacal or breathe alone as wait — Holothuroidea respiration tell; long holothuriahush Holothuria hush hold (THE holothuriahush sit_hold tell) — never named wait or crouch or sit or still or sea_cucumber or tube as bare ethogram-only trick kinds; Scrub cleaner_shrimp owns antennawaveadvertise/lysmatahush/dancescrubclientcue — do NOT reuse; Scrape parrotfish owns beakscrapegraze/scarushush — do NOT reuse; Paint clownfish owns peckcleanhost/amphiprionhush — do NOT reuse; Cast earthworm owns peristalsis/cast — do NOT reuse; sea_star owns podia/righting/crawl/evert/penta — do NOT reuse; Veil lionfish comes next — do NOT start; guest slug Tube / key sea_cucumber only for wantsThankYou matching — accept "sea_cucumber" and "tube"; do NOT name a trick "sea_cucumber" or "tube" or "cleaner_shrimp" or "scrub" or "parrotfish" or "scrape" or "clownfish" or "paint" or "lionfish" or "veil" or "earthworm" or "cast"; not Scrub Lysmata life, not Scrape Scaridae life, not Paint Amphiprion life, not Cast Lumbricus life, not sea_star Asteroidea life, not Veil Scorpaenidae life, not Rui. Tubefootcrawl / depositfeedsift / cucumberswellshrink / softretractcue / teatspike / cloacalbreathe / holothuriahush; denstube / inktube / densholothuria thank-yous. Same map as web sea_cucumber-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names crawl/still/wait/tube/sea_cucumber as bare ethogram-only trick kinds. True Pineapple Sea Cucumber Thelenota ananas desk life only — tube-foot crawl, deposit-feed sift, cucumber swell-shrink, soft retract cue, teat-spike flare, cloacal breathe, Holothuria hush. Next house-order ultra: Veil / lionfish. No cry inventing — sea_cucumber.wav EXISTS so prefersHouseCry adds sea_cucumber after cleaner_shrimp. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "sea_cucumber";
  const TRICKS = ["tubefootcrawl", "depositfeedsift", "cucumberswellshrink", "softretractcue", "teatspike", "cloacalbreathe", "holothuriahush"];
  const HAPPY = ["denstube", "inktube", "densholothuria"];

  const HAPPY_DUR = { denstube: 1.70, inktube: 1.84, densholothuria: 1.76 };
  const HOLOTHURIAHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    holothuriahush: HOLOTHURIAHUSH_HOLD + RELEASE_S,
    tubefootcrawl: 2.48,
    depositfeedsift: 2.42,
    cucumberswellshrink: 2.40,
    softretractcue: 2.44,
    teatspike: 2.38,
    cloacalbreathe: 2.56,
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
    if (kind === "holothuriahush") return 40 + roll * 26;
    if (kind === "teatspike" || kind === "tubefootcrawl" || kind === "cloacalbreathe") return 12.8 + roll * 9.4;
    if (kind === "cucumberswellshrink" || kind === "depositfeedsift" || kind === "softretractcue") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "holothuriahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "holothuriahush") {
      if (roll < 0.17) return "tubefootcrawl";
      if (roll < 0.33) return "depositfeedsift";
      if (roll < 0.49) return "cucumberswellshrink";
      if (roll < 0.65) return "softretractcue";
      if (roll < 0.83) return "teatspike";
      return "cloacalbreathe";
    }
    if (lastKind === "tubefootcrawl") {
      if (roll < 0.16) return "holothuriahush";
      if (roll < 0.32) return "depositfeedsift";
      if (roll < 0.48) return "cucumberswellshrink";
      if (roll < 0.64) return "softretractcue";
      if (roll < 0.82) return "teatspike";
      return "cloacalbreathe";
    }
    if (lastKind === "depositfeedsift") {
      if (roll < 0.14) return "holothuriahush";
      if (roll < 0.3) return "tubefootcrawl";
      if (roll < 0.46) return "cucumberswellshrink";
      if (roll < 0.62) return "softretractcue";
      if (roll < 0.8) return "teatspike";
      return "cloacalbreathe";
    }
    if (lastKind === "cucumberswellshrink") {
      if (roll < 0.15) return "holothuriahush";
      if (roll < 0.31) return "tubefootcrawl";
      if (roll < 0.47) return "depositfeedsift";
      if (roll < 0.63) return "softretractcue";
      if (roll < 0.81) return "teatspike";
      return "cloacalbreathe";
    }
    if (lastKind === "softretractcue") {
      if (roll < 0.16) return "holothuriahush";
      if (roll < 0.32) return "tubefootcrawl";
      if (roll < 0.48) return "depositfeedsift";
      if (roll < 0.64) return "cucumberswellshrink";
      if (roll < 0.82) return "teatspike";
      return "cloacalbreathe";
    }
    if (lastKind === "teatspike") {
      if (roll < 0.15) return "holothuriahush";
      if (roll < 0.31) return "tubefootcrawl";
      if (roll < 0.47) return "depositfeedsift";
      if (roll < 0.63) return "cucumberswellshrink";
      if (roll < 0.81) return "softretractcue";
      return "cloacalbreathe";
    }
    if (lastKind === "cloacalbreathe") {
      if (roll < 0.16) return "holothuriahush";
      if (roll < 0.32) return "tubefootcrawl";
      if (roll < 0.48) return "depositfeedsift";
      if (roll < 0.64) return "cucumberswellshrink";
      if (roll < 0.82) return "softretractcue";
      return "teatspike";
    }
    if (roll < 0.14) return "holothuriahush";
    if (roll < 0.28) return "tubefootcrawl";
    if (roll < 0.42) return "depositfeedsift";
    if (roll < 0.56) return "cucumberswellshrink";
    if (roll < 0.7) return "softretractcue";
    if (roll < 0.85) return "teatspike";
    return "cloacalbreathe";
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
    return key === TRICK_KEY || key === "tube";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denstube";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denstube" ? "sit" : name === "inktube" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denstubePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstube));
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

  function inktubePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inktube));
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

  function densholothuriaPose(t) {
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
    if (next.kind === "denstube") {
      const pose = denstubePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inktube") {
      const pose = inktubePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densholothuriaPose(next.t);
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
      kind === "holothuriahush"
        ? "sit"
        : kind === "tubefootcrawl"
          ? "sit"
          : kind === "cloacalbreathe"
            ? "talk"
            : kind === "depositfeedsift"
              ? "play"
              : kind === "cucumberswellshrink"
                ? "sit"
                : kind === "softretractcue"
                  ? "sit"
                  : kind === "teatspike"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "holothuriahush" ? "hold" : "go",
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

  function holothuriahushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function tubefootcrawlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tubefootcrawl));
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

  function depositfeedsiftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.depositfeedsift));
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

  function cloacalbreathePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cloacalbreathe));
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

  function softretractcuePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.softretractcue));
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

  function cucumberswellshrinkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cucumberswellshrink));
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

  function teatspikePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.teatspike));
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
      trick.kind !== "tubefootcrawl" &&
      trick.kind !== "depositfeedsift" &&
      trick.kind !== "cucumberswellshrink" &&
      trick.kind !== "softretractcue" &&
      trick.kind !== "teatspike" &&
      trick.kind !== "cloacalbreathe"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "holothuriahush") {
      if (next.t < HOLOTHURIAHUSH_HOLD) {
        const pose = holothuriahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HOLOTHURIAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HOLOTHURIAHUSH_HOLD);
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
    if (next.kind === "tubefootcrawl") {
      const pose = tubefootcrawlPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "depositfeedsift") {
      const pose = depositfeedsiftPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cucumberswellshrink") {
      const pose = cucumberswellshrinkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "softretractcue") {
      const pose = softretractcuePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "teatspike") {
      const pose = teatspikePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cloacalbreathePose(next.t, fromX, trick.facing);
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
    HOLOTHURIAHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    holothuriahushPose,
    releasePose,
    tubefootcrawlPose,
    depositfeedsiftPose,
    cloacalbreathePose,
    softretractcuePose,
    cucumberswellshrinkPose,
    teatspikePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denstubePose,
    inktubePose,
    densholothuriaPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCleanerShrimpTricks = api;
})(typeof window !== "undefined" ? window : globalThis);