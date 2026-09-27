/** Reach ground tricks while idle — ultra-polish pass. House neighborly Proteus amoeba desk life — pseudopod / ectoplasm / endoplasm / foodcup / proteus / uroid / streaming personality (pseudopod lobose reach without naming reach or stretch or still or dart or foot, ectoplasm clear rim crawl without naming crawl or glide or still or dart, endoplasm granular streaming without naming flow or still or dart, foodcup phagocytic cup without naming feed or eat or gulp or still, long proteus Amoeba desk hold under the pane foot, uroid trailing-end tuck without naming trail or dart or still or foot (THE amoeba uroid tell), streaming sol-gel cytoplasmic flow without naming flow or dart or swim or still (THE amoeba cytoplasmic-streaming tell) — never named wait or wake or still or hide or cover or glue or flare or dart or nest or zig or swim or gulp or drift or glint or hinge or sucker or latch or crawl or dig or burrow or pedal or radula or pneumostome or ommatophore or lymnaeid or adductor or protractor or inhalant or ctenidium or unionid or acetabulum or prostomium or looping or undulatory or hirudinean or botryoidal or auricle or spiggin or zigzag or spinous or fanning or gasterosteid or nuptial or pelvic or cilia or pellicle or cytostome or vacuole or ciliophora or trichocyst or avoiding or slipper or row or wiggle or scute or pseudopodreach or ectoplasmcrawl or foodvacuole or nucleusdrift or longreachhush as trick kinds; ethogram softs + freeze own those words; window-play FOOT owns the pane foot; Coin owns flare/dart/drift/gulp/glint; Twig owns stick-insect life; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean/botryoidal/auricle; Hinge owns adductor/protractor/inhalant/ctenidium/unionid/ligament/glochid; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid/odontophore/neuston; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid/nuptial/pelvic; Boot owns cilia/pellicle/cytostome/vacuole/ciliophora/trichocyst/avoiding; Door owns hinge; Anchor owns siphon; guest slug Reach / key amoeba only for isKey matching — accept "amoeba" and "reach"; do NOT name a trick "amoeba" or "reach" or "glue" or "flare" or "dart" or "still" or "foot" or "stretch" or "crawl" or "flow" or "gulp") — not Boot paramecium life, not Prickle stickleback life, not Coin goldfish life, not Latch leech life, not Hinge mussel life, not Twig stick-insect life, not Door moray, not Anchor seahorse, not Kite manta, not Gauss filing-dragon, not Spot euglena. Pseudopod lobose reach on the dish without naming stretch, ectoplasm rim crawl without naming dart, endoplasm granular stream without naming flow, foodcup phagocytic cup without naming eat, proteus long Amoeba metabolic hold under the scrap pane, uroid trailing-end tuck (THE amoeba uroid tell), streaming sol-gel cytoplasmic flow (THE amoeba cytoplasmic-streaming tell); chaos / discoides / dubia thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play FOOT do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web amoeba-tricks.ts. Window-play FOOT unchanged. Ethogram softs + freeze — never names reach/foot/still as bare ethogram-only trick kinds. True Proteus amoeba desk life only — distinct from Boot paramecium, Prickle stickleback, Coin goldfish, Latch leech, Hinge mussel, Twig stick insect, Door moray, Anchor seahorse, Kite manta, Gauss filing-dragon, and Spot euglena. Spin owns the next seat. No cry inventing — thank-yous are silent desk motion only. Amplitudes raised toward Rui richness; denser waits/weights (PROTEUS_HOLD=11.2 RELEASE_S=1.18). Pane now Rue-dense; Hold now Rue-dense; Spin now Rue-dense; Bell now Rue-dense; Rod now Rue-dense; Rose now Rue-dense; Brick now Rue-dense; Drake now Rue-dense; Vee now Rue-dense; Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; Frill now Rue-dense; Cap now Rue-dense; Lattice now Rue-dense; Horn now Rue-dense; Ring now Rue-dense; Mane now Rue-dense; next leftover Puff / puffball. prefersHouseCry via amoeba.wav. */
(function (root) {
  const TRICK_KEY = "amoeba";
  const TRICKS = ["pseudopod", "ectoplasm", "endoplasm", "foodcup", "proteus", "uroid", "streaming"];
  const HAPPY = ["chaos", "discoides", "dubia"];

  const HAPPY_DUR = { chaos: 1.67, discoides: 1.79, dubia: 1.71 };
  const PROTEUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    proteus: PROTEUS_HOLD + RELEASE_S,
    pseudopod: 2.32,
    ectoplasm: 2.46,
    endoplasm: 2.52,
    foodcup: 2.38,
    uroid: 2.40,
    streaming: 2.35,
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
    if (kind === "proteus") return 40 + roll * 26;
    if (kind === "uroid" || kind === "streaming" || kind === "pseudopod" || kind === "ectoplasm" || kind === "endoplasm" || kind === "foodcup") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "proteus";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "proteus" ? 0.72 : k === "uroid" || k === "streaming" ? 1.28 : k === "pseudopod" || k === "ectoplasm" || k === "endoplasm" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "pseudopod";
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
    return key === TRICK_KEY || key === "reach";
  }

  function startThankYou(key,lastKind,x,
    facing,flags,
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind | null | undefined);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind,rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind,x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "chaos";
    return {
      kind: name,happy: true,
      phase: "go",
      t: 0,x,
      lift: 0,
      rot: 0,
      anim: name === "chaos" ? "sit" : name === "discoides" ? "play" : "sit",
      facing: facing == null ? 1 : facing,fromX: x,
    };
  }

  function chaosPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chaos));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 1.72);
      return {
        lift: 3.36 + Math.abs(flash) * 1.68,
        rot: 14.4 + flash * 9.6,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "idle" };
  }

  function discoidesPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.discoides));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 4.26, rot: s * -16.8, dx: s * 0.18, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 2.1);
      return {
        lift: 4.08 + Math.abs(wriggle) * 1.92,
        rot: -16.8 + wriggle * 12,
        dx: 0.096,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 2.64 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "sit" };
  }

  function dubiaPose(t) {
    return {
      lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
      rot: Math.sin(t * 0.624) * 7.2,
      dx: 0,
      anim: "sit",
    };
  }

  function stepHappy(happy,dt,flags) {
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "chaos") {
      const pose = chaosPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "discoides") {
      const pose = discoidesPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dubiaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key,_frameCount) {
    return null;
  }

  function beginTrick(kind,x, facing) {
    const anim =
      kind === "proteus"
        ? "sit"
        : kind === "pseudopod"
          ? "sit"
          : kind === "ectoplasm"
            ? "walk"
            : kind === "endoplasm"
              ? "play"
              : kind === "foodcup"
                ? "play"
                : kind === "uroid"
                  ? "play"
                  : kind === "streaming"
                    ? "walk"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? (kind) : "pseudopod",
      phase: kind === "proteus" ? "hold" : "go",
      t: 0,x,
      lift: 0,
      rot: 0,anim,
      facing: facing == null ? 1 : facing,fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function proteusPose(t) {
    return {
      lift: 2.88 + Math.abs(Math.sin(t * 0.504)) * 1.44,
      rot: -0.216 + Math.sin(t * 0.168) * 4.8,
      anim: "sit",
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.216 * (1 - u) };
  }

  function pseudopodPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pseudopod));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4.02, rot: s * 16.8 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const snap = Math.sin(t * 2.4);
      return {
        x: fromX + face * snap * 0.156,
        lift: 4.02 + Math.abs(snap) * 1.74,
        rot: face * (17.4 + snap * 12.6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.68 * (1 - s),
      rot: face * (4.8 * (1 - s)),
      anim: "idle",
    };
  }

  function ectoplasmPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ectoplasm));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 4.5, rot: s * -19.2 * face, anim: "walk" };
    }
    if (u < 0.48) {
      const s = smoothstep((u - 0.12) / 0.36);
      return {
        x: fromX - face * (2.64 + s * 5.4),
        lift: 4.32 + Math.sin(s * Math.PI) * 2.64,
        rot: face * (-19.2 + s * 26.4),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const settle = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX - face * (8.04 * (1 - s)),
        lift: 2.88 + Math.abs(settle) * 1.32,
        rot: face * (7.2 + settle * 9.6),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.68 * (1 - s),
      rot: face * (3.6 * (1 - s)),
      anim: "idle",
    };
  }

  function endoplasmPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.endoplasm));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.96, lift: s * 2.64, rot: s * 9.6 * face, anim: "play" };
    }
    if (u < 0.72) {
      const mud = Math.sin(t * 1.6);
      return {
        x: fromX + face * (0.96 + mud * 0.48),
        lift: 2.64 + Math.abs(mud) * 1.0,
        rot: face * (9.6 + mud * 12),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + face * 0.96 * (1 - s),
      lift: 1.44 * (1 - s),
      rot: face * (3.6 * (1 - s)),
      anim: s > 0.72 ? ("idle") : ("play"),
    };
  }

  function foodcupPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.foodcup));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.88, rot: s * 12 * face, anim: "play" };
    }
    if (u < 0.84) {
      const tap = Math.sin(t * 2.8);
      return {
        x: fromX + face * tap * 0.24,
        lift: 2.88 + Math.abs(tap) * 1.32,
        rot: face * (12 + tap * 14.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 1.44 * (1 - s),
      rot: face * (3.6 * (1 - s)),
      anim: "idle",
    };
  }

  function uroidPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.uroid));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.36, rot: s * 14.4 * face, anim: "play" };
    }
    if (u < 0.55) {
      const pulse = Math.sin(t * 3.2);
      return {
        x: fromX,
        lift: 3.36 + pulse * 1.92,
        rot: face * (14.4 + pulse * 16.8),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const scent = Math.sin(t * 1.1);
      return {
        x: fromX + face * scent * 0.18,
        lift: 4.8 + Math.abs(scent) * 0.72,
        rot: face * (26.4 + scent * 4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.4 * (1 - s),
      rot: face * (9.6 * (1 - s)),
      anim: "idle",
    };
  }

  function streamingPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.streaming));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4.08, rot: s * -14.4 * face, anim: "walk" };
    }
    if (u < 0.55) {
      const flash = Math.abs(Math.sin(t * 2.6));
      return {
        x: fromX + face * flash * 0.24,
        lift: 4.08 + flash * 1.68,
        rot: face * (-14.4 - flash * 12),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const warn = Math.sin(t * 1.4);
      return {
        x: fromX,
        lift: 5.28 + Math.abs(warn) * 0.84,
        rot: face * (-21.6 + warn * 7.2),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.16 * (1 - s),
      rot: face * (-6 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick,dt,flags) {
    if (shouldAbort(flags)) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "proteus") {
      if (next.t < PROTEUS_HOLD) {
        const pose = proteusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < PROTEUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PROTEUS_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    if (next.kind === "pseudopod") {
      const pose = pseudopodPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ectoplasm") {
      const pose = ectoplasmPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "endoplasm") {
      const pose = endoplasmPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "foodcup") {
      const pose = foodcupPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "uroid") {
      const pose = uroidPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = streamingPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    PROTEUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    proteusPose,
    releasePose,
    pseudopodPose,
    ectoplasmPose,
    endoplasmPose,
    foodcupPose,
    uroidPose,
    streamingPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    chaosPose,
    discoidesPose,
    dubiaPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAmoebaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
