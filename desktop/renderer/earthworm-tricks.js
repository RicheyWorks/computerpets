/** Cast ground tricks while idle. House neighborly Annelida / Lumbricus terrestris Common Earthworm soil life — peristalse / castheap / surfacerise / soilanchor / terrestris personality (peristalse peristaltic body-wave crawl without naming wave or crawl or wriggle or slither or undulate or coil or curl or ball or roll or spiral, castheap castings heap push without naming cast or heap or pile or dirt or soil or dung or fertilizer or mulch or compost or feed or eat, surfacerise night surface rise without naming night or surface or rise or emerge or crawl or climb or dawn or dusk or moon, soilanchor setae soil-anchor brace without naming setae or anchor or brace or cling or grip or hold or dirt or soil or burrow or dig, long terrestris Lumbricus terrestris Annelida common earthworm nightcrawler hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass; window-play STRIKE and Call Cast leave earthworm alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link/Armor own their tricks; guest slug Cast / key earthworm — accept "earthworm" and "cast" (roster slug cast; campaign Cast); do NOT confuse with Armor the Common Pillbug (key pillbug / slug armor) or densarmor thank-you; do NOT confuse slug cast with trick castheap or Cicada trick cast or Octopus trick jet; do NOT name a trick earthworm or cast or pillbug or armor or millipede or link or house_centipede or haste or american_eel or silver. Thank-yous denscast / inkcast / densclit. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web earthworm-tricks.ts. Window-play STRIKE unchanged. True Common Earthworm Lumbricus terrestris Annelida desk life — soft peristaltic crawler that pushes castings, rises at night, and braces with setae; not Armadillidium pillbug/Isopoda clones (conglobate/volvation/antennafeel/detritusnip), not Narceus millipede/Diplopoda clones, not Scutigera house centipede/Chilopoda clones, not Anguilla american eel — true soft worm peristalsis distinct from isopod ball-roll. Next house-order guest after Cast still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "earthworm";
  const TRICKS = ["peristalse", "castheap", "surfacerise", "soilanchor", "terrestris"];
  const HAPPY = ["denscast", "inkcast", "densclit"];
  const HAPPY_DUR = { denscast: 2.48, inkcast: 2.62, densclit: 2.38 };
  const TERRESTRIS_HOLD = 23.60;
  const RELEASE_S = 2.02;
  const DUR = { terrestris: TERRESTRIS_HOLD + RELEASE_S, peristalse: 4.65, castheap: 4.15, surfacerise: 4.05, soilanchor: 4.35 };

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
  if (kind === "peristalse") return 26.2 + roll * 4.4;
  if (kind === "castheap") return 25.6 + roll * 3.9;
  if (kind === "surfacerise") return 24.2 + roll * 3.8;
  if (kind === "soilanchor") return 25.8 + roll * 4.0;
  return justFinished ? 18.8 + roll * 2.7 : 13.9 + roll * 2.3;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "terrestris";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "terrestris") {
      if (roll < 0.26) return "peristalse";
      if (roll < 0.5) return "castheap";
      if (roll < 0.74) return "surfacerise";
      return "soilanchor";
    }
    if (lastKind === "peristalse") {
      if (roll < 0.26) return "terrestris";
      if (roll < 0.5) return "castheap";
      if (roll < 0.74) return "surfacerise";
      return "soilanchor";
    }
    if (lastKind === "castheap") {
      if (roll < 0.22) return "terrestris";
      if (roll < 0.44) return "peristalse";
      if (roll < 0.68) return "surfacerise";
      return "soilanchor";
    }
    if (roll < 0.2) return "terrestris";
    if (roll < 0.4) return "peristalse";
    if (roll < 0.6) return "castheap";
    if (roll < 0.8) return "surfacerise";
    return "soilanchor";
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
      return { lift: s * 0.0048, rot: s * 0.85, dx: 0, anim: "sit" };
    }
    if (u < 0.88) {
      const hold = Math.sin(t * 0.82) + 0.032 * Math.sin(t * 1.64);
      return { lift: 0.0048 + Math.abs(hold) * 0.0016, rot: 0.85 + hold * 0.16, dx: hold * 0.00009, anim: "sit" };
    }
    const s = (u - 0.88) / 0.12;
    return { lift: 0.00065 * (1 - s), rot: 0.024 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkcastPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkcast));
    if (u < 0.10) {
      const s = u / 0.10;
      return { lift: s * 0.018, rot: s * 0.95, dx: s * 0.00055, anim: "play" };
    }
    if (u < 0.86) {
      const wave = Math.sin(t * 1.28) + 0.055 * Math.sin(t * 2.56);
      return { lift: 0.018 + Math.abs(wave) * 0.0055, rot: 0.95 + wave * 0.62, dx: wave * 0.00062, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0012 * (1 - s), rot: 0.048 * (1 - s), dx: 0, anim: "sit" };
  }
  function densclitPose(t) {
    return { lift: 0.00095 + Math.abs(Math.sin(t * 0.034)) * 0.0018, rot: Math.sin(t * 0.034) * 0.72, dx: Math.sin(t * 0.026) * 0.00010, anim: "sit" };
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
      const pose = densclitPose(next.t);
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
        : kind === "peristalse"
          ? "sit"
          : kind === "castheap"
            ? "play"
            : kind === "surfacerise"
              ? "talk"
              : kind === "soilanchor"
                ? "play"
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

  function peristalsePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.peristalse));
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
  function castheapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.castheap));
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
  function surfacerisePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.surfacerise));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00025, lift: s * 0.0065, rot: s * -0.16 * face, anim: "talk" };
    }
    if (u < 0.82) {
      const rise = Math.sin((u - 0.18) / 0.64 * Math.PI * 1.6);
      const night = Math.sin(t * 0.82) + 0.04 * Math.sin(t * 1.64);
      return { x: fromX + face * (0.00025 + rise * 0.00085 + night * 0.00008), lift: 0.0065 + Math.abs(rise) * 0.0028 + Math.abs(night) * 0.0010, rot: (-0.16 + rise * 0.32 + night * 0.11) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.00025 * (1 - s), lift: 0.0065 * (1 - s) + s * 0.0005, rot: -0.02 * (1 - s) * face, anim: "idle" };
  }
  function soilanchorPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.soilanchor));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00038, lift: s * 0.0035, rot: s * 0.28 * face, anim: "play" };
    }
    if (u < 0.36) {
      const brace = smoothstep((u - 0.10) / 0.26);
      return { x: fromX + face * (0.00038 + brace * 0.00065), lift: 0.0035 + brace * 0.0062, rot: (0.28 + brace * -0.82) * face, anim: "play" };
    }
    if (u < 0.86) {
      const hold = Math.sin((u - 0.36) / 0.50 * Math.PI * 1.8);
      const setae = Math.sin(t * 0.92) + 0.045 * Math.sin(t * 1.84);
      return { x: fromX + face * (0.00103 + hold * 0.00115 + setae * 0.00009), lift: 0.0092 + Math.abs(hold) * 0.0026 + Math.abs(setae) * 0.0012, rot: (-0.54 + hold * 0.42 + setae * 0.14) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00103 * (1 - s), lift: 0.00085 * (1 - s), rot: -0.03 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "peristalse" && trick.kind !== "castheap" && trick.kind !== "surfacerise" && trick.kind !== "soilanchor") {
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
    if (next.kind === "peristalse") {
      const pose = peristalsePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "castheap") {
      const pose = castheapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "surfacerise") {
      const pose = surfacerisePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = soilanchorPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    peristalsePose,
    castheapPose,
    surfacerisePose,
    soilanchorPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denscastPose,
    inkcastPose,
    densclitPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetEarthwormTricks = api;
})(typeof window !== "undefined" ? window : globalThis);