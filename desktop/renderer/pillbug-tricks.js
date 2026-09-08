/** Armor ground tricks while idle. House neighborly Isopoda / Armadillidium vulgare Common Pillbug terrestrial crustacean life — conglobate / volvation / antennafeel / detritusnip / vulgare personality (conglobate roll-into-ball conglobation without naming ball or roll or spiral or coil or curl or armor or armorup or hide or tuck or sleep or sit, volvation volvation tuck armor-ball settle without naming ball or roll or spiral or coil or curl or armor or hide or tuck or sleep or sit, antennafeel antenna sense feel without naming antenna or tap or flick or sense or feeler or sweep or probe or touch or sniff or whisker or wave, detritusnip detritus nip graze without naming litter or graze or leaf or feed or eat or chew or forage or nibble or mulch or compost or dirt or soil, long vulgare Armadillidium vulgare Isopoda common pillbug woodlouse hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass; window-play STRIKE and Call Armor leave pillbug alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag/Cape/Cache/Slick/Wash/Stripe/Grin/Dam/Spine/Coal/Soak/Pad/Wink/Dash/Shift/Spike/Levee/Jaw/Beak/Lid/Peak/Lunge/Speck/Whisk/Penny/Bar/Lance/Night/Spoon/Round/Silver/Haste/Link own their tricks; guest slug Armor / key pillbug — accept "pillbug" and "armor" (roster slug armor; campaign Armor); do NOT confuse with Link the American Giant Millipede (key millipede / slug link) or denslink thank-you; do NOT name a trick pillbug or armor or millipede or link or house_centipede or haste or american_eel or silver. Thank-yous densarmor / inkarmor / densball. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web pillbug-tricks.ts. Window-play STRIKE unchanged. True Common Pillbug Armadillidium vulgare Isopoda desk life — terrestrial crustacean that conglobates into a tight ball, grazes leaf litter, taps with antennae, and settles in volvation; not Narceus millipede/Diplopoda clones (coilcurl/detritusgrub/slowmarch/moistseek), not Scutigera house centipede/Chilopoda clones, not Anguilla american eel — true isopod volvation ball distinct from millipede spiral coil. Next house-order guest after Armor still lacking tricks owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "pillbug";
  const TRICKS = ["conglobate", "volvation", "antennafeel", "detritusnip", "vulgare"];
  const HAPPY = ["densarmor", "inkarmor", "densball"];
  const HAPPY_DUR = { densarmor: 2.55, inkarmor: 2.68, densball: 2.42 };
  const VULGARE_HOLD = 22.80;
  const RELEASE_S = 1.95;
  const DUR = { vulgare: VULGARE_HOLD + RELEASE_S, conglobate: 4.45, detritusnip: 4.25, antennafeel: 3.95, volvation: 4.55 };

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
      if (kind === "vulgare") return 148 + roll * 13;
  if (kind === "conglobate") return 25.4 + roll * 4.2;
  if (kind === "detritusnip") return 26.6 + roll * 3.8;
  if (kind === "antennafeel") return 22.8 + roll * 3.6;
  if (kind === "volvation") return 27.8 + roll * 4.4;
  return justFinished ? 19.2 + roll * 2.8 : 14.2 + roll * 2.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "vulgare";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "vulgare") {
      if (roll < 0.26) return "conglobate";
      if (roll < 0.5) return "detritusnip";
      if (roll < 0.74) return "antennafeel";
      return "volvation";
    }
    if (lastKind === "conglobate") {
      if (roll < 0.26) return "vulgare";
      if (roll < 0.5) return "detritusnip";
      if (roll < 0.74) return "antennafeel";
      return "volvation";
    }
    if (lastKind === "detritusnip") {
      if (roll < 0.22) return "vulgare";
      if (roll < 0.44) return "conglobate";
      if (roll < 0.68) return "antennafeel";
      return "volvation";
    }
    if (roll < 0.2) return "vulgare";
    if (roll < 0.4) return "conglobate";
    if (roll < 0.6) return "detritusnip";
    if (roll < 0.8) return "antennafeel";
    return "volvation";
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
    return key === TRICK_KEY || key === "armor";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densarmor";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densarmor" ? "sit" : name === "inkarmor" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function densarmorPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densarmor));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0055, rot: s * 1.15, dx: 0, anim: "sit" };
    }
    if (u < 0.88) {
      const hold = Math.sin(t * 0.88) + 0.035 * Math.sin(t * 1.76);
      return { lift: 0.0055 + Math.abs(hold) * 0.0018, rot: 1.15 + hold * 0.18, dx: hold * 0.00010, anim: "sit" };
    }
    const s = (u - 0.88) / 0.12;
    return { lift: 0.0007 * (1 - s), rot: 0.028 * (1 - s), dx: 0, anim: "idle" };
  }
  function inkarmorPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkarmor));
    if (u < 0.10) {
      const s = u / 0.10;
      return { lift: s * 0.024, rot: s * 1.35, dx: s * 0.00065, anim: "play" };
    }
    if (u < 0.86) {
      const roll = Math.sin(t * 1.45) + 0.060 * Math.sin(t * 2.90);
      return { lift: 0.024 + Math.abs(roll) * 0.0065, rot: 1.35 + roll * 0.85, dx: roll * 0.00075, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0014 * (1 - s), rot: 0.055 * (1 - s), dx: 0, anim: "sit" };
  }
  function densballPose(t) {
    return { lift: 0.0011 + Math.abs(Math.sin(t * 0.038)) * 0.0022, rot: Math.sin(t * 0.038) * 0.95, dx: Math.sin(t * 0.028) * 0.00012, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densarmor") {
      const pose = densarmorPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkarmor") {
      const pose = inkarmorPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densballPose(next.t);
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
      kind === "vulgare"
        ? "sit"
        : kind === "conglobate"
          ? "sit"
          : kind === "detritusnip"
            ? "play"
            : kind === "antennafeel"
              ? "talk"
              : kind === "volvation"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "vulgare" ? "hold" : "go",
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


                      function vulgarePose(t) {
    const breath = Math.sin(t * 0.0074) + 0.0032 * Math.sin(t * 0.019);
    const sway = Math.abs(Math.sin(t * 0.0036));
    return { lift: 0.00048 + sway * 0.00095, rot: -0.014 + breath * 0.042 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00048 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.012 * (1 - u) };
  }

  function conglobatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.conglobate));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * -0.00022, lift: s * 0.0042, rot: s * 0.55 * face, anim: "sit" };
    }
    if (u < 0.32) {
      const ball = smoothstep((u - 0.12) / 0.20);
      return { x: fromX + face * (-0.00022 + ball * 0.00018), lift: 0.0042 + ball * 0.0088, rot: (0.55 + ball * 2.35) * face, anim: "sit" };
    }
    if (u < 0.78) {
      const roll = Math.sin((u - 0.32) / 0.46 * Math.PI * 2.2);
      const hush = Math.sin(t * 0.78) + 0.04 * Math.sin(t * 1.56);
      return { x: fromX + face * (0.00008 + roll * 0.0028 + hush * 0.00006), lift: 0.0125 + Math.abs(roll) * 0.0016 + Math.abs(hush) * 0.0009, rot: (2.90 + roll * 0.55 + hush * 0.12) * face, anim: "sit" };
    }
    if (u < 0.90) {
      const open = smoothstep((u - 0.78) / 0.12);
      return { x: fromX + face * 0.00008 * (1 - open * 0.4), lift: 0.0125 * (1 - open) + open * 0.0035, rot: (2.90 * (1 - open) + open * 0.35) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00005 * (1 - s), lift: 0.0007 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }
  function detritusnipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.detritusnip));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00038, lift: s * 0.0038, rot: s * 0.32 * face, anim: "play" };
    }
    if (u < 0.88) {
      const husk = Math.sin((u - 0.11) / 0.77 * Math.PI * 3.1);
      const nibble = Math.sin(t * 1.22) + 0.06 * Math.sin(t * 2.44);
      return { x: fromX + face * (0.00038 + (u - 0.11) / 0.77 * 0.0036 + husk * 0.00085 + nibble * 0.00010), lift: 0.0028 + Math.abs(husk) * 0.0026 + Math.abs(nibble) * 0.0011, rot: (0.32 + husk * 0.42 + nibble * 0.16) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00398 * (1 - s), lift: 0.0007 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" };
  }
  function antennafeelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennafeel));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00042, lift: s * 0.0048, rot: s * -0.22 * face, anim: "talk" };
    }
    if (u < 0.90) {
      const wave = Math.sin((u - 0.10) / 0.80 * Math.PI * 6.4);
      const probe = Math.sin(t * 1.72) + 0.07 * Math.sin(t * 3.44);
      return { x: fromX + face * (0.00042 + (u - 0.10) / 0.80 * 0.0042 + wave * 0.00055 + probe * 0.00009), lift: 0.0038 + Math.abs(wave) * 0.0022 + Math.abs(probe) * 0.0012, rot: (-0.22 + wave * 0.38 + probe * 0.14) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00462 * (1 - s), lift: 0.00075 * (1 - s), rot: -0.028 * (1 - s) * face, anim: "idle" };
  }
  function volvationPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.volvation));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0022, rot: s * 0.18 * face, anim: "play" };
    }
    if (u < 0.36) {
      const tuck = smoothstep((u - 0.10) / 0.26);
      return { x: fromX + face * (0.00028 + tuck * 0.00055), lift: 0.0022 + tuck * 0.0055, rot: (0.18 + tuck * -0.72) * face, anim: "play" };
    }
    if (u < 0.86) {
      const cling = Math.sin((u - 0.36) / 0.50 * Math.PI * 1.8);
      const damp = Math.sin(t * 0.92) + 0.045 * Math.sin(t * 1.84);
      return { x: fromX + face * (0.00083 + cling * 0.00095 + damp * 0.00008), lift: 0.0075 + Math.abs(cling) * 0.0024 + Math.abs(damp) * 0.0011, rot: (-0.54 + cling * 0.38 + damp * 0.14) * face, anim: "sit" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00083 * (1 - s), lift: 0.0008 * (1 - s), rot: -0.03 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "conglobate" && trick.kind !== "detritusnip" && trick.kind !== "antennafeel" && trick.kind !== "volvation") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "vulgare") {
      if (next.t < VULGARE_HOLD) {
        const pose = vulgarePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < VULGARE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - VULGARE_HOLD);
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
    if (next.kind === "conglobate") {
      const pose = conglobatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "detritusnip") {
      const pose = detritusnipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennafeel") {
      const pose = antennafeelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = volvationPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    VULGARE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    vulgarePose,
    releasePose,
    conglobatePose,
    detritusnipPose,
    antennafeelPose,
    volvationPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densarmorPose,
    inkarmorPose,
    densballPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPillbugTricks = api;
})(typeof window !== "undefined" ? window : globalThis);