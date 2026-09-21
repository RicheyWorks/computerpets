/** Hinge ground tricks while idle — ultra-polish pass. House neighborly Unionidae Eastern-elliptio desk life — adductor / protractor / inhalant / ctenidium / unionid / ligament / glochid personality (adductor valve clap without naming clap or snap or hinge or gape, protractor muscular-foot plough without naming dig or burrow or crawl or pedal, inhalant aperture draw without naming siphon or breath or filter, ctenidium filter-gill beat without naming gill or mantle or fringe or trail, long unionid Elliptio desk hold under the silt grain, ligament elastic spring-open without naming hinge or gape or snap, glochid brood-larval flutter without naming larva or spawn or hitch — never named wait or wake or still or hide or cover or wiggle or siphon or filter or hinge or gape or dig or burrow or crawl or pedal or radula or pneumostome or ommatophore or lymnaeid or odontophore or neuston or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or scaph or meral or mantle or sucker or jet or claw or snap or pinch or annulate or fossorial or tentacular or hydrostatic or gymnophion or stegos or dualjaw as trick kinds; window-play FILTER owns filter; ethogram softs + freeze own those words; special Siphon owns siphon; Door owns hinge as a trick kind; Anchor owns siphon as a trick kind; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid/odontophore/neuston; Chamber owns spiral/siphuncle/nacre/pinhole/fringe; Tenant owns swap/antenna/scuttle/withdraw/vacancy; Pinch owns chelate/caridoid/chimney/antennule/astacid/scaph/meral; Cup owns mantle; Bloom owns gill; Pulse owns trail; Bluff owns gape; Pebble owns burrow; Slip owns tentacular/annulate/fossorial/hydrostatic/gymnophion/stegos/dualjaw; guest slug Hinge / key mussel only for isKey matching — accept "mussel" and "hinge"; do NOT name a trick "mussel" or "hinge" or "siphon" or "filter" or "gill" or "mantle" or "nacre" or "pedal" or "radula" or "gape" or "dig" or "burrow") — not Whorl pond-snail life, not Chamber nautilus shell life, not Tenant hermit shell life, not Pinch crayfish claw life, not Door moray hinge, not Anchor seahorse siphon. adductor valve clap on the silt dish without naming snap or hinge, protractor foot-plough without naming dig or burrow, inhalant aperture draw without naming siphon or filter, ctenidium ctenidial beat without naming gill, unionid long Elliptio metabolic hold under the scrap silt, ligament elastic spring-open (THE bivalve hinge-ligament tell), glochid brood flutter (THE freshwater-unionid larval tell); complanata / alate / elliptio thank-yous. Feed-happy after eat. Card-open freeze and window-play FILTER do not swallow a thank-you. Sleep, hide, leave win. Same map as web mussel-tricks.ts. Window-play FILTER unchanged. Ethogram softs + freeze — never names siphon/still/filter as trick kinds. Prickle owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights (UNIONID_HOLD=11.2 RELEASE_S=1.18). Pane now Rue-dense; Hold now Rue-dense; Spin now Rue-dense; Bell now Rue-dense; Rod now Rue-dense; Rose now Rue-dense; Brick now Rue-dense; Drake now Rue-dense; Vee now Rue-dense; next leftover Drum / pileated. prefersHouseCry via mussel.wav. */
(function (root) {
  const TRICK_KEY = "mussel";
  const TRICKS = ["adductor", "protractor", "inhalant", "ctenidium", "unionid", "ligament", "glochid"];
  const HAPPY = ["complanata", "alate", "elliptio"];
  const HAPPY_DUR = { complanata: 1.64, alate: 1.76, elliptio: 1.71 };
  const UNIONID_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    unionid: UNIONID_HOLD + RELEASE_S,
    adductor: 2.28,
    protractor: 2.42,
    inhalant: 2.48,
    ctenidium: 2.34,
    ligament: 2.36,
    glochid: 2.31,
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
    if (kind === "unionid") return 40 + roll * 26;
    if (kind === "ligament" || kind === "glochid" || kind === "adductor" || kind === "protractor" || kind === "inhalant" || kind === "ctenidium") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "unionid";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "unionid" ? 0.72 : k === "ligament" || k === "glochid" ? 1.28 : k === "adductor" || k === "protractor" || k === "inhalant" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "adductor";
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
    return key === TRICK_KEY || key === "hinge";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "complanata";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "complanata" ? "sit" : name === "alate" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function complanataPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.complanata));
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

  function alatePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.alate));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 4.08, rot: s * -16.8, dx: s * 0.18, anim: "play" };
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

  function elliptioPose(t) {
    return {
      lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
      rot: Math.sin(t * 0.624) * 7.2,
      dx: 0,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "complanata") {
      const pose = complanataPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "alate") {
      const pose = alatePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = elliptioPose(next.t);
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
      kind === "unionid"
        ? "sit"
        : kind === "adductor"
          ? "play"
          : kind === "protractor"
            ? "walk"
            : kind === "inhalant"
              ? "sit"
              : kind === "ctenidium"
                ? "sit"
                : kind === "ligament"
                  ? "play"
                  : kind === "glochid"
                    ? "walk"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? kind : "adductor",
      phase: kind === "unionid" ? "hold" : "go",
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

  function unionidPose(t) {
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

  function adductorPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.adductor));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.84, rot: s * 16.8 * face, anim: "play" };
    }
    if (u < 0.78) {
      const snap = Math.sin(t * 2.4);
      return {
        x: fromX + face * snap * 0.144,
        lift: 3.84 + Math.abs(snap) * 1.68,
        rot: face * (16.8 + snap * 12),
        anim: "play",
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

  function protractorPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.protractor));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 4.32, rot: s * -19.2 * face, anim: "walk" };
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

  function inhalantPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.inhalant));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.96, lift: s * 2.64, rot: s * 9.6 * face, anim: "sit" };
    }
    if (u < 0.72) {
      const mud = Math.sin(t * 1.6);
      return {
        x: fromX + face * (0.96 + mud * 0.48),
        lift: 2.64 + Math.abs(mud) * 1.0,
        rot: face * (9.6 + mud * 12),
        anim: "idle",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + face * 0.96 * (1 - s),
      lift: 1.44 * (1 - s),
      rot: face * (3.6 * (1 - s)),
      anim: s > 0.6 ? "idle" : "sit",
    };
  }

  function ctenidiumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ctenidium));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.88, rot: s * 12 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const tap = Math.sin(t * 2.8);
      return {
        x: fromX + face * tap * 0.24,
        lift: 2.88 + Math.abs(tap) * 1.32,
        rot: face * (12 + tap * 14.4),
        anim: "sit",
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

  function ligamentPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ligament));
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
        rot: face * (26.4 + scent * 4.8),
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

  function glochidPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.glochid));
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

  function stepTrick(trick, dt, flags) {
    if (shouldAbort(flags)) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "unionid") {
      if (next.t < UNIONID_HOLD) {
        const pose = unionidPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < UNIONID_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - UNIONID_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    if (next.kind === "adductor") {
      const pose = adductorPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "protractor") {
      const pose = protractorPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inhalant") {
      const pose = inhalantPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ctenidium") {
      const pose = ctenidiumPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ligament") {
      const pose = ligamentPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = glochidPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX });
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    UNIONID_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    unionidPose,
    releasePose,
    adductorPose,
    protractorPose,
    inhalantPose,
    ctenidiumPose,
    ligamentPose,
    glochidPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    complanataPose,
    alatePose,
    elliptioPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMusselTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
