/** Rod ground tricks while idle — ultra-polish pass. House neighborly Escherichia coli (coli / Rod) desk life — runandtumble / binaryfission / pilus / chemotax / nucleoid / fimbria / flagmotor personality (runandtumble run-and-tumble motility without naming tumble or run or still or dart as bare ethogram-only trick kinds, binaryfission septum split without naming divide or still or dart or split, pilus type-IV reach without naming reach or still or dart or stick, chemotax chemotaxis bias without naming taxis or still or dart or swim, fimbria adhesion fringe without naming glue or still or dart or cling, flagmotor flagellar-motor spin without naming motor or still or dart or spin, long nucleoid sit_hold under the scrap lamp (THE nucleoid sit_hold tell) — never named wait or wake or still or hide or cover or glue or flare or dart or nest or zig or swim or gulp or drift or glint or hinge or sucker or latch or crawl or dig or burrow or pedal or radula or pneumostome or ommatophore or lymnaeid or adductor or protractor or inhalant or ctenidium or unionid or acetabulum or prostomium or looping or undulatory or hirudinean or botryoidal or auricle or spiggin or zigzag or spinous or fanning or gasterosteid or nuptial or pelvic or cilia or pellicle or cytostome or vacuole or ciliophora or trichocyst or avoiding or slipper or row or wiggle or scute or pseudopod or ectoplasm or endoplasm or foodcup or proteus or uroid or streaming or eyespot or flagellum or chloroplast or phototaxis or euglenid or metaboly or paramylon or colony or inversion or phialopore or somatic or coenobium or daughter or gonidia or frustule or raphe or girdle or oilstore or pennate or epitheca or navicula or holdfast or haptera or blade or pneumatocyst or meristem or sorus or sporophyll or biflagellate or cupplast or stigma or pyrenoid or palmella or cellwall or wetplate or adoral or myoneme or membranelle or holdfoot or introversus or vortex or beadedmac or trumpetflare or longrodhush or densrod or inkrod or denscoli as trick kinds; ethogram softs + freeze own those words; window-play tumble broth-cup sill pan unchanged if already fine; Bell owns adoral/myoneme/membranelle/holdfoot/introversus/vortex/beadedmac; Spin owns biflagellate/cupplast/stigma/pyrenoid/palmella/cellwall/wetplate; Hold owns holdfast/haptera/blade/pneumatocyst/meristem/sorus/sporophyll; Pane owns frustule/raphe/girdle/oilstore/pennate/epitheca/navicula; Orb owns colony/inversion/phialopore/somatic/coenobium/daughter/gonidia; Spot owns eyespot/flagellum/chloroplast/phototaxis/euglenid/metaboly/paramylon; Reach owns pseudopod/ectoplasm/endoplasm/foodcup/proteus/uroid/streaming; Boot owns cilia/pellicle/cytostome/vacuole/ciliophora/trichocyst/avoiding; Rose will own haloarchaea life; guest slug Rod / key coli only for isKey matching — accept "coli" and "rod"; do NOT name a trick "coli" or "rod" or "tumble" or "run" or "still" or "bloom" or "trumpet") — not Bell stentor life, not Spin chlamydomonas life, not Hold kelp life, not Pane diatom life, not Orb volvox life, not Spot euglena life, not Reach amoeba life, not Boot paramecium life, not Rose haloarchaea. Run-and-tumble motility on the drop without naming tumble, binary fission septum tip without naming divide, pilus type-IV reach without naming stick, chemotax bias without naming swim, fimbria adhesion fringe without naming cling, flagmotor spin without naming motor, nucleoid long sit_hold under the scrap lamp (THE nucleoid sit_hold tell); k12 / mg1655 / bl21 thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web coli-tricks.ts. Window-play tumble RED unchanged. Ethogram softs + freeze — never names rod/coli/tumble/run/still as bare ethogram-only trick kinds. True Escherichia coli desk life only — distinct from Bell stentor, Spin chlamydomonas, Hold kelp, Pane diatom, Orb volvox, Spot euglena, Reach amoeba, Boot paramecium, and Rose haloarchaea. Rose owns the next seat. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via coli.wav. Amplitudes raised toward Rui richness; denser waits/weights (NUCLEOID_HOLD=11.2 RELEASE_S=1.18). Rose now Rue-dense; Brick now Rue-dense; Drake now Rue-dense; Vee now Rue-dense; Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; Frill now Rue-dense; Cap now Rue-dense; Lattice now Rue-dense; Horn now Rue-dense; Ring now Rue-dense; Mane now Rue-dense; next leftover Puff / puffball. Catalog 221. */
(function (root) {
  const TRICK_KEY = "coli";
  const TRICKS = ["runandtumble", "binaryfission", "pilus", "chemotax", "nucleoid", "fimbria", "flagmotor"];
  const HAPPY = ["k12", "mg1655", "bl21"];

  const HAPPY_DUR = { k12: 1.70, mg1655: 1.82, bl21: 1.71 };
  const NUCLEOID_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    nucleoid: NUCLEOID_HOLD + RELEASE_S,
    runandtumble: 2.36,
    binaryfission: 2.50,
    pilus: 2.56,
    chemotax: 2.42,
    fimbria: 2.44,
    flagmotor: 2.39,
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

  function nextTrickWait(justFinished,rand,kind) {
    const roll = rand == null ? Math.random() : rand;
    if (kind === "nucleoid") return 40 + roll * 26;
    if (kind === "fimbria" || kind === "flagmotor" || kind === "runandtumble" || kind === "binaryfission" || kind === "pilus" || kind === "chemotax") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "nucleoid";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
            k === "nucleoid" ? 0.72 : k === "fimbria" || k === "flagmotor" ? 1.28 : k === "runandtumble" || k === "binaryfission" || k === "pilus" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "runandtumble";
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
    return key === TRICK_KEY || key === "rod";
  }

  function startThankYou(key,lastKind,x,
    facing,flags,
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind,rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind,x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "k12";
    return {
      kind: name,happy: true,
      phase: "go",
      t: 0,x,
      lift: 0,
      rot: 0,
      anim: name === "k12" ? "sit" : name === "mg1655" ? "play" : "sit",
      facing: facing == null ? 1 : facing,fromX: x,
    };
  }

  function k12Pose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.k12));
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

  function mg1655Pose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mg1655));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 4.44, rot: s * -16.8, dx: s * 0.18, anim: "play" };
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

  function bl21Pose(t) {
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
    if (next.kind === "k12") {
      const pose = k12Pose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mg1655") {
      const pose = mg1655Pose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bl21Pose(next.t);
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
      kind === "nucleoid"
        ? "sit"
        : kind === "runandtumble"
          ? "sit"
          : kind === "binaryfission"
            ? "walk"
            : kind === "pilus"
              ? "play"
              : kind === "chemotax"
                ? "play"
                : kind === "fimbria"
                  ? "play"
                  : kind === "flagmotor"
                    ? "walk"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? (kind) : "runandtumble",
      phase: kind === "nucleoid" ? "hold" : "go",
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

  function nucleoidPose(t) {
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

  function runandtumblePose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.runandtumble));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 4.2, rot: s * 16.8 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const snap = Math.sin(t * 2.4);
      return {
        x: fromX + face * snap * 0.168,
        lift: 4.2 + Math.abs(snap) * 1.8,
        rot: face * (18 + snap * 13.2),
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

  function binaryfissionPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.binaryfission));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 4.68, rot: s * -19.2 * face, anim: "walk" };
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

  function pilusPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pilus));
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

  function chemotaxPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chemotax));
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

  function fimbriaPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fimbria));
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

  function flagmotorPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.flagmotor));
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
    if (next.kind === "nucleoid") {
      if (next.t < NUCLEOID_HOLD) {
        const pose = nucleoidPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < NUCLEOID_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - NUCLEOID_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    if (next.kind === "runandtumble") {
      const pose = runandtumblePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "binaryfission") {
      const pose = binaryfissionPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pilus") {
      const pose = pilusPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "chemotax") {
      const pose = chemotaxPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fimbria") {
      const pose = fimbriaPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = flagmotorPose(next.t, fromX, trick.facing);
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
    NUCLEOID_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    nucleoidPose,
    releasePose,
    runandtumblePose,
    binaryfissionPose,
    pilusPose,
    chemotaxPose,
    fimbriaPose,
    flagmotorPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    k12Pose,
    mg1655Pose,
    bl21Pose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetColiTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
