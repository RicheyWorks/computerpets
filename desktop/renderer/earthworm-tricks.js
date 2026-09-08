/** Cast ground tricks while idle. House neighborly Annelida / Lumbricus terrestris Common Earthworm soil life — surfacecast / nightcrawl / soilswallow / retractdive / terrestris personality (surfacecast castings push without naming cast or heap or pile or dirt or soil or dung or fertilizer or mulch or compost or feed or eat, nightcrawl nocturnal surface crawl without naming night or crawl or wriggle or slither or undulate or coil or curl or ball or roll or spiral, soilswallow soil ingest without naming swallow or eat or feed or dirt or soil or gulp or chew or forage, retractdive quick pull into burrow without naming burrow or dig or dive or hide or tuck or sleep or sit or coil or curl or ball, long terrestris Lumbricus terrestris Annelida common earthworm nightcrawler hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or peristalse or castheap or surfacerise or soilanchor or densclit; window-play STRIKE and Call Cast leave earthworm alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor own their tricks; guest slug Cast / key earthworm — accept "earthworm" and "cast" (roster slug cast; campaign Cast); do NOT confuse with Armor the Common Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT confuse slug cast with trick surfacecast or Cicada trick cast or Octopus trick jet; do NOT name a trick earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste or american_eel or silver. Thank-yous denscast / inkcast / denscastings. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web earthworm-tricks.ts. Window-play STRIKE unchanged. True Common Earthworm Lumbricus terrestris Annelida desk life — soft peristaltic crawler that pushes castings, night-crawls, swallows soil, and retracts into a burrow; not Armadillidium pillbug/Isopoda clones (conglobate/volvation/antennafeel/detritusnip), not Narceus millipede/Diplopoda clones, not Scutigera house centipede/Chilopoda clones, not Anguilla american eel — true soft worm peristalsis distinct from isopod ball-roll. Next house-order guest after Cast still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "earthworm";
  const TRICKS = ["surfacecast", "nightcrawl", "soilswallow", "retractdive", "terrestris"];
  const HAPPY = ["denscast", "inkcast", "denscastings"];
  const HAPPY_DUR = { denscast: 2.48, inkcast: 2.62, denscastings: 2.38 };
  const TERRESTRIS_HOLD = 23.60;
  const RELEASE_S = 2.02;
  const DUR = { terrestris: TERRESTRIS_HOLD + RELEASE_S, surfacecast: 4.15, nightcrawl: 4.65, soilswallow: 4.05, retractdive: 4.35 };

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
      if (kind === "terrestris") return 152 + roll * 14;
  if (kind === "nightcrawl") return 26.2 + roll * 4.4;
  if (kind === "surfacecast") return 25.6 + roll * 3.9;
  if (kind === "soilswallow") return 24.2 + roll * 3.8;
  if (kind === "retractdive") return 25.8 + roll * 4.0;
  return justFinished ? 18.8 + roll * 2.7 : 13.9 + roll * 2.3;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "terrestris";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "terrestris") {
      if (roll < 0.26) return "nightcrawl";
      if (roll < 0.5) return "surfacecast";
      if (roll < 0.74) return "soilswallow";
      return "retractdive";
    }
    if (lastKind === "nightcrawl") {
      if (roll < 0.26) return "terrestris";
      if (roll < 0.5) return "surfacecast";
      if (roll < 0.74) return "soilswallow";
      return "retractdive";
    }
    if (lastKind === "surfacecast") {
      if (roll < 0.22) return "terrestris";
      if (roll < 0.44) return "nightcrawl";
      if (roll < 0.68) return "soilswallow";
      return "retractdive";
    }
    if (roll < 0.2) return "terrestris";
    if (roll < 0.4) return "nightcrawl";
    if (roll < 0.6) return "surfacecast";
    if (roll < 0.8) return "soilswallow";
    return "retractdive";
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
    return key === TRICK_KEY || key === "cast";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denscast";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denscast" ? "sit" : name === "inkcast" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function denscastPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscast));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0048, rot: s * -0.12 };
    }
    if (u < 0.82) {
      const wiggle = Math.sin((u - 0.14) / 0.68 * Math.PI * 2.2);
      return { lift: 0.0048 + Math.abs(wiggle) * 0.0016, rot: -0.12 + wiggle * 0.22 };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0048 * (1 - s), rot: -0.12 * (1 - s) };
  }
  function inkcastPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkcast));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.0055, rot: s * 0.18 };
    }
    if (u < 0.80) {
      const coil = Math.sin((u - 0.16) / 0.64 * Math.PI * 2.8);
      return { lift: 0.0055 + Math.abs(coil) * 0.0018, rot: 0.18 + coil * 0.28 };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.0055 * (1 - s), rot: 0.18 * (1 - s) };
  }
  function denscastingsPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscastings));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0038, rot: s * -0.08 };
    }
    if (u < 0.86) {
      const heap = Math.sin((u - 0.12) / 0.74 * Math.PI * 1.8);
      return { lift: 0.0038 + Math.abs(heap) * 0.0022, rot: -0.08 + heap * 0.20 };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0038 * (1 - s), rot: -0.08 * (1 - s) };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denscast") {
      const pose = denscastPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkcast") {
      const pose = inkcastPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscastingsPose(next.t);
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
      kind === "terrestris"
        ? "sit"
        : kind === "nightcrawl"
          ? "play"
          : kind === "surfacecast"
            ? "play"
            : kind === "soilswallow"
              ? "talk"
              : kind === "retractdive"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "terrestris" ? "hold" : "go",
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


                      function terrestrisPose(t) {
    const breath = Math.sin(t * 0.0068) + 0.0028 * Math.sin(t * 0.017);
    const wave = Math.abs(Math.sin(t * 0.0042));
    return { lift: 0.00042 + wave * 0.00088, rot: -0.011 + breath * 0.038 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00042 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.010 * (1 - u) };
  }

  function nightcrawlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nightcrawl));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00055, lift: s * 0.0028, rot: s * 0.18 * face, anim: "play" };
    }
    if (u < 0.88) {
      const peri = Math.sin((u - 0.10) / 0.78 * Math.PI * 5.2);
      const hush = Math.sin(t * 1.05) + 0.05 * Math.sin(t * 2.10);
      return { x: fromX + face * (0.00055 + (u - 0.10) / 0.78 * 0.0068 + peri * 0.00135 + hush * 0.00012), lift: 0.0024 + Math.abs(peri) * 0.0026 + Math.abs(hush) * 0.0011, rot: (0.18 + peri * 0.42 + hush * 0.12) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0068 * (1 - s), lift: 0.00065 * (1 - s), rot: 0.025 * (1 - s) * face, anim: "idle" };
  }
  function surfacecastPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.surfacecast));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00032, lift: s * 0.0032, rot: s * 0.28 * face, anim: "play" };
    }
    if (u < 0.86) {
      const heap = Math.sin((u - 0.12) / 0.74 * Math.PI * 2.6);
      const push = Math.sin(t * 1.18) + 0.055 * Math.sin(t * 2.36);
      return { x: fromX + face * (0.00042 + (u - 0.12) / 0.74 * 0.0036 + heap * 0.00105 + push * 0.00013), lift: 0.0030 + Math.abs(heap) * 0.0034 + Math.abs(push) * 0.0013, rot: (0.28 + heap * 0.45 + push * 0.16) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0035 * (1 - s), lift: 0.0007 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" };
  }
  function soilswallowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.soilswallow));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0042, rot: s * -0.22 * face, anim: "talk" };
    }
    if (u < 0.84) {
      const gulp = Math.sin((u - 0.14) / 0.70 * Math.PI * 3.4);
      const soil = Math.sin(t * 0.96) + 0.045 * Math.sin(t * 1.92);
      return { x: fromX + face * (0.00028 + gulp * 0.00095 + soil * 0.00009), lift: 0.0042 + Math.abs(gulp) * 0.0026 + Math.abs(soil) * 0.0011, rot: (-0.22 + gulp * 0.36 + soil * 0.12) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00028 * (1 - s), lift: 0.0042 * (1 - s) + s * 0.0005, rot: -0.02 * (1 - s) * face, anim: "idle" };
  }
  function retractdivePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.retractdive));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00022, lift: s * 0.0018, rot: s * 0.14 * face, anim: "sit" };
    }
    if (u < 0.36) {
      const brace = smoothstep((u - 0.10) / 0.26);
      return { x: fromX + face * (0.00022 + brace * 0.00035), lift: 0.0018 + brace * 0.0038, rot: (0.14 + brace * -0.48) * face, anim: "sit" };
    }
    if (u < 0.86) {
      const hold = Math.sin((u - 0.36) / 0.50 * Math.PI * 1.5);
      const setae = Math.sin(t * 0.88) + 0.04 * Math.sin(t * 1.76);
      return { x: fromX + face * (0.00057 + hold * 0.00072 + setae * 0.00006), lift: 0.0055 + Math.abs(hold) * 0.0018 + Math.abs(setae) * 0.0009, rot: (-0.34 + hold * 0.28 + setae * 0.10) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00057 * (1 - s), lift: 0.0007 * (1 - s), rot: -0.025 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "nightcrawl" && trick.kind !== "surfacecast" && trick.kind !== "soilswallow" && trick.kind !== "retractdive") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "terrestris") {
      if (next.t < TERRESTRIS_HOLD) {
        const pose = terrestrisPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TERRESTRIS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TERRESTRIS_HOLD);
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
    if (next.kind === "nightcrawl") {
      const pose = nightcrawlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "surfacecast") {
      const pose = surfacecastPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "soilswallow") {
      const pose = soilswallowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = retractdivePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    TERRESTRIS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    terrestrisPose,
    releasePose,
    nightcrawlPose,
    surfacecastPose,
    soilswallowPose,
    retractdivePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denscastPose,
    inkcastPose,
    denscastingsPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetEarthwormTricks = api;
})(typeof window !== "undefined" ? window : globalThis);