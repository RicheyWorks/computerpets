/** Armor ground tricks while idle — ultra-polish pass. House neighborly Isopoda / Armadillidium vulgare Common Pillbug terrestrial crustacean desk life (pillbug / Armor) — conglobate / volvation / antennafeel / detritusnip / pleopods / uropodtap / vulgare personality (conglobate conglobation ball-roll tuck pulse without naming ball or roll or spiral or coil or curl or armor or armorup or hide or tuck or sleep or sit alone, volvation volvation armor-ball settle without naming ball or roll or spiral or coil or curl or armor or hide or tuck or sleep or sit alone, antennafeel antenna sense feel without naming antenna or tap or flick or sense or feeler or sweep or probe or touch or sniff or whisker or wave alone, detritusnip detritus nip graze without naming litter or graze or leaf or feed or eat or chew or forage or nibble or mulch or compost or dirt or soil alone, pleopods pleopod ventral gill-breath pulse tell without naming pleopod or gill or breath or ventral or flap or paddle or water or damp or wet alone, uropodtap uropod tail-tap steer tell without naming uropod or tail or tap or telson or steer or tip or end alone, long vulgare Armadillidium vulgare Isopoda common pillbug woodlouse hush hold (THE vulgare sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or coilcurl or detritusgrub or slowmarch or moistseek or benzoquinone or metachronal or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or compound or fifteenpair or scutigera or denshaste or inkhaste or densforcep or densantenna or ultrarun or antennaprobe or wallcling or preyseize or coleoptrata or glasscrawl or mucuscoat or nightmigrate or gravelhide or sargasso or yellowphase or rostrata or denssilver or inksilver or densglass or oralclamp or keratinrasp or undulglide or stonenest or anadromous or sevengill or marinus or densround or inkround or densdisk or densdisc or legwave or leafhush or hingeshut or carolinae or denslid or inklid or densdome or duffgrub or castings or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or roll or walk or still or pillbug or armor or millipede or link or house_centipede or haste as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play STRIKE unchanged if already fine; Link owns coilcurl/detritusgrub/slowmarch/moistseek/benzoquinone/metachronal/narceus — do NOT reuse coilcurl (millipede spiral ≠ pillbug conglobation); Haste owns antennaflick — antennafeel ok; Cast earthworm next — leave castings/duff/peristalse words free; header forbids coilcurl/detritusgrub/narceus/forcipule/wallrace/scutigera/duffgrub/castings/roll/walk/still; guest slug Armor / key pillbug only for isKey matching — accept "pillbug" and "armor"; do NOT name a trick "pillbug" or "armor" or "millipede" or "link" or "house_centipede" or "haste" or "earthworm" or "cast" or "roll" or "walk" or "still" or "ball") — not Link Narceus millipede/Diplopoda life, not Haste Scutigera house-centipede/Chilopoda life, not Cast Lumbricus earthworm next, not Lid Terrapene box-turtle life, not Silver Anguilla american-eel life, not Rui red_panda life. Conglobate ball without naming roll alone, volvation settle without naming tuck alone, antennafeel antenna without naming flick alone, detritusnip litter nip without naming eat alone, pleopods gill-breath without naming gill alone, uropodtap uropod tap without naming tail alone, vulgare long sit_hold on the Armadillidium hush (THE vulgare sit_hold tell); densarmor / inkarmor / densball thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop pillbug-tricks.js. Window-play STRIKE unchanged. Ethogram softs + freeze — never names roll/walk/still/wait/sit/pillbug/armor as bare ethogram-only trick kinds. True Common Pillbug Armadillidium vulgare Isopoda desk life only — terrestrial crustacean that conglobates into a tight ball, grazes leaf litter, taps with antennae, breathes with pleopods, steers with uropods, and settles in volvation; distinct from Link millipede/Diplopoda spiral coil, Haste house centipede/Chilopoda predator, Cast earthworm next, Lid box turtle, Silver eel, creek peers, Ink, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Cast / earthworm ultra done (peristalse/castheap/surfacerise/soilanchor/clitellum/setaebrace/terrestris). Jet / velvet_worm ultra done (slimejet/lobopod/antennawhip/preyharpoon/oralpapilla/onychophore/peripatus). Next house-order ultra: Hop / springtail. No cry inventing — thank-yous are silent desk motion only; pillbug.wav EXISTS so prefersHouseCry adds pillbug after millipede. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "pillbug";
  const TRICKS = ["conglobate", "volvation", "antennafeel", "detritusnip", "pleopods", "uropodtap", "vulgare"];
  const HAPPY = ["densarmor", "inkarmor", "densball"];

  const HAPPY_DUR = { densarmor: 1.70, inkarmor: 1.84, densball: 1.76 };
  const VULGARE_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    vulgare: VULGARE_HOLD + RELEASE_S,
    conglobate: 2.48,
    detritusnip: 2.56,
    volvation: 2.42,
    antennafeel: 2.38,
    pleopods: 2.40,
    uropodtap: 2.44,
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
    if (kind === "vulgare") return 40 + roll * 26;
    if (kind === "pleopods" || kind === "antennafeel" || kind === "conglobate") return 12.8 + roll * 9.4;
    if (kind === "detritusnip" || kind === "volvation" || kind === "uropodtap") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "vulgare";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "vulgare") {
      if (roll < 0.17) return "conglobate";
      if (roll < 0.33) return "detritusnip";
      if (roll < 0.49) return "volvation";
      if (roll < 0.65) return "antennafeel";
      if (roll < 0.83) return "pleopods";
      return "uropodtap";
    }
    if (lastKind === "conglobate") {
      if (roll < 0.16) return "vulgare";
      if (roll < 0.32) return "detritusnip";
      if (roll < 0.48) return "volvation";
      if (roll < 0.64) return "antennafeel";
      if (roll < 0.82) return "pleopods";
      return "uropodtap";
    }
    if (lastKind === "detritusnip") {
      if (roll < 0.14) return "vulgare";
      if (roll < 0.3) return "conglobate";
      if (roll < 0.46) return "volvation";
      if (roll < 0.62) return "antennafeel";
      if (roll < 0.8) return "pleopods";
      return "uropodtap";
    }
    if (lastKind === "volvation") {
      if (roll < 0.15) return "vulgare";
      if (roll < 0.31) return "conglobate";
      if (roll < 0.47) return "detritusnip";
      if (roll < 0.63) return "antennafeel";
      if (roll < 0.81) return "pleopods";
      return "uropodtap";
    }
    if (lastKind === "antennafeel") {
      if (roll < 0.16) return "vulgare";
      if (roll < 0.32) return "conglobate";
      if (roll < 0.48) return "detritusnip";
      if (roll < 0.64) return "volvation";
      if (roll < 0.82) return "pleopods";
      return "uropodtap";
    }
    if (lastKind === "pleopods") {
      if (roll < 0.15) return "vulgare";
      if (roll < 0.31) return "conglobate";
      if (roll < 0.47) return "detritusnip";
      if (roll < 0.63) return "volvation";
      if (roll < 0.81) return "antennafeel";
      return "uropodtap";
    }
    if (lastKind === "uropodtap") {
      if (roll < 0.16) return "vulgare";
      if (roll < 0.32) return "conglobate";
      if (roll < 0.48) return "detritusnip";
      if (roll < 0.64) return "volvation";
      if (roll < 0.82) return "antennafeel";
      return "pleopods";
    }
    if (roll < 0.14) return "vulgare";
    if (roll < 0.28) return "conglobate";
    if (roll < 0.42) return "volvation";
    if (roll < 0.56) return "antennafeel";
    if (roll < 0.7) return "detritusnip";
    if (roll < 0.85) return "pleopods";
    return "uropodtap";
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
    return key === TRICK_KEY || key === "armor";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densarmor";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densarmor" ? "sit" : name === "inkarmor" ? "play" : "sit"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densarmorPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densarmor));
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

  function inkarmorPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkarmor));
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

  function densballPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.58) * 8,
      dx: Math.sin(t * 0.4) * 0.06,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
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
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
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
        ? "play"
        : kind === "detritusnip"
          ? "talk"
          : kind === "volvation"
            ? "play"
            : kind === "antennafeel"
              ? "talk"
              : kind === "pleopods"
                ? "talk"
                : kind === "uropodtap"
                  ? "sit"
                  : "sit";
    return {
      kind,
      phase: kind === "vulgare" ? "hold" : "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim,
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function vulgarePose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function conglobatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.conglobate));
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

  function volvationPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.volvation));
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

  function detritusnipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.detritusnip));
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

  function uropodtapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.uropodtap));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "play" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "play",
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

  function pleopodsPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pleopods));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "talk" };
    }
    if (u < 0.78) {
      const hang = Math.sin(t * 2.0);
      return {
        x: fromX + face * (0.5 + hang * 0.1),
        lift: 2.8 + Math.abs(hang) * 1.2,
        rot: face * (11 + hang * 8),
        anim: "talk",
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

  function antennafeelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennafeel));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "talk" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "talk",
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
      trick.kind !== "conglobate" &&
      trick.kind !== "detritusnip" &&
      trick.kind !== "volvation" &&
      trick.kind !== "antennafeel" &&
      trick.kind !== "pleopods" &&
      trick.kind !== "uropodtap"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
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
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "conglobate") {
      const pose = conglobatePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "detritusnip") {
      const pose = detritusnipPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "volvation") {
      const pose = volvationPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennafeel") {
      const pose = antennafeelPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pleopods") {
      const pose = pleopodsPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = uropodtapPose(next.t, fromX, trick.facing);
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
    volvationPose,
    detritusnipPose,
    uropodtapPose,
    pleopodsPose,
    antennafeelPose,
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
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPillbugTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
