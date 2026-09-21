/** Door ground tricks while idle — ultra-polish pass. House green moray — hinge / pharynx / knot / lurk / jamb / mucus / sentry personality (crevice-jaw hinge gape that is breath not a yawn — never named gape (window-play owns GAPE; Bluff owns gape), pharyngeal-jaw flash as pharynx (never named flash — Quill owns that), knot retreat into dens, ambush peek as lurk (never named peek/peer — Keel owns peer), reef-door jamb desk life in the book crevice, thick Gymnothorax mucus coat shimmer (never named slime/mucuscoat — Silver american_eel owns mucuscoat), head-out crevice sentry watch (never named guard/probe/periscope — prior guests own those); not Coin drift/gulp/flare/glint/dart, Pulse bell/oral/lucent/trail/medusa, Anchor coil/buoy/siphon/swivel/pouch, Kite wing/lobe/gyre/vault/span/breach/ram, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Ochre podia/righting/crawl/evert/penta, Sepia hover/pupil, Chamber spiral, Cup mantle/jet, Ink soak/tuck, Clip nest, or snake guests Nori/Saffron/Bandit/Jade/Bluff/Sash/Lula/Coral/Blush/Atlas coil/bun/stripe/bracelet/hood/seam/pour/rhyme/pebble/legend copies). Mucus is the species-true green-moray slime-coat polish (not Silver mucuscoat compound, not Coin flare, not Kite lobe). Sentry is the iconic head-out den watch (not lurk ambush peek alone, not Keel peer, not window-play GAPE). Window-play GAPE unchanged — never names gape. Ethogram keeps jamb sit_hold; adds hinge/pharynx/knot/lurk/mucus/sentry softs + freeze (replaces thin gape/hide/dart). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via moray.wav. Thank-yous breath / vigil / recess. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `moray-tricks.ts`. True house-moray desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids gape/flash/peer/dart/coil/buoy/siphon/swivel/pouch/wing/lobe/gyre/vault/span/breach/ram/carapace/swap/withdraw/podia/bell/oral/mantle/jet/drift/gulp/flare/mucuscoat/guard/probe/somersault name collisions with prior guests and moray window-play. Bird ultra (Soot→Ember) + Miso→Kite done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Next guest ultra is Felt / moss. Amplitudes raised toward Rui richness; denser waits/weights (JAMB_HOLD=11.2 RELEASE_S=1.18). Next leftover Felt / moss. No cry inventing beyond house moray.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "moray";
const TRICKS = ["hinge", "pharynx", "knot", "lurk", "jamb", "mucus", "sentry"];
const HAPPY = ["breath", "vigil", "recess"];
const HAPPY_DUR = {
    breath: 1.28,
    vigil: 1.18,
    recess: 1.24,
};
/** Jamb hold — Door parks the reef-door body in the desk crevice. Not window-play GAPE. Not Anchor coil. */
const JAMB_HOLD = 11.2;
const RELEASE_S = 1.18;
const DUR = {
    jamb: JAMB_HOLD + RELEASE_S,
    hinge: 1.58,
    pharynx: 1.52,
    knot: 1.68,
    lurk: 1.48,
    mucus: 1.64,
    sentry: 1.72,
};
function canStart(state) {
    if (!state)
        return false;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card)
        return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest")
        return false;
    if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter")
        return false;
    return true;
}
function shouldAbort(state) {
    if (!state)
        return true;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card)
        return true;
    const cmd = String(state.cmd || "");
    return (cmd === "sleep" ||
        cmd === "leave" ||
        cmd === "hide" ||
        cmd === "rest" ||
        cmd === "seek" ||
        cmd === "eat" ||
        cmd === "play" ||
        cmd === "talk" ||
        cmd === "enter");
}
function nextTrickWait(justFinished, rand, kind) {
    const roll = rand == null ? Math.random() : rand;
    if (kind === "jamb")
        return 40 + roll * 26;
    if (kind === "knot" || kind === "pharynx" || kind === "sentry")
        return 12.8 + roll * 9.4;
    if (kind === "hinge" || kind === "lurk" || kind === "mucus")
        return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}
function pickTrick(rand, musicOn = false, lastKind) {
    if (musicOn)
        return "jamb";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) => k === "jamb" ? 0.72 : k === "knot" || k === "pharynx" || k === "sentry" ? 1.28 : k === "hinge" || k === "lurk" || k === "mucus" ? 1.18 : 1.08);
    let total = 0;
    for (let i = 0; i < weights.length; i++)
        total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return list[i];
    }
    return list[list.length - 1] || "hinge";
}
function happyCanStart(state) {
    if (!state)
        return false;
    if (state.asleep || state.hidden || state.leaving)
        return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest")
        return false;
    if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter")
        return false;
    return true;
}
function happyShouldAbort(state) {
    if (!state)
        return true;
    if (state.asleep || state.hidden || state.leaving)
        return true;
    const cmd = String(state.cmd || "");
    return (cmd === "sleep" ||
        cmd === "leave" ||
        cmd === "hide" ||
        cmd === "rest" ||
        cmd === "seek" ||
        cmd === "play" ||
        cmd === "talk" ||
        cmd === "enter");
}
function wantsThankYou(key) {
    return key === TRICK_KEY || key === "door";
}
function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key))
        return null;
    if (!happyCanStart(flags || { cmd: "idle" }))
        return null;
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "breath";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "breath" ? "talk" : name === "vigil" ? "play" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function breathPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.breath));
    if (u < 0.18) {
        const s = u / 0.18;
        return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
        const open = Math.sin(t * 1.95);
        return {
            lift: 3.36 + Math.abs(open) * 1.68,
            rot: 14.4 + open * 12,
            dx: open * 0.336,
            anim: "talk",
        };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "idle" };
}
function vigilPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.vigil));
    if (u < 0.2) {
        const s = u / 0.2;
        return { lift: s * 3.6, rot: s * -12, dx: 0, anim: "play" };
    }
    if (u < 0.78) {
        const tip = Math.sin(t * 2.1);
        return {
            lift: 3.6 + Math.abs(tip) * 1.8,
            rot: -12 + tip * 16.8,
            dx: tip * 0.384,
            anim: "play",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.4 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "idle" };
}
function recessPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.recess));
    if (u < 0.22) {
        const s = u / 0.22;
        return { lift: s * 2.64, rot: s * 7.2, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
        const breath = Math.sin(t * 1.1);
        return {
            lift: 2.64 + Math.abs(breath) * 1.32,
            rot: 7.2 + breath * 9.6,
            dx: breath * 0.24,
            anim: "sit",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 1.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" };
}
function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done")
        return happy;
    if (happyShouldAbort(flags)) {
        return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const dur = HAPPY_DUR[next.kind] || HAPPY_DUR.breath;
    let pose;
    if (next.kind === "breath")
        pose = breathPose(next.t);
    else if (next.kind === "vigil")
        pose = vigilPose(next.t);
    else
        pose = recessPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.x = (happy.fromX != null ? happy.fromX : happy.x) + (pose.dx || 0) * happy.facing;
    next.anim = pose.anim;
    if (next.t >= dur)
        return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
}
function sleepHoldFrame(_key, _frameCount) {
    return null;
}
function beginTrick(kind, x, facing) {
    const name = TRICKS.indexOf(kind) >= 0 ? kind : "hinge";
    const hold = name === "jamb";
    return {
        kind: name,
        phase: hold ? "hold" : "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: hold
            ? "sit"
            : name === "hinge" || name === "lurk" || name === "sentry"
                ? "talk"
                : name === "mucus"
                    ? "sit"
                    : name === "pharynx" || name === "knot"
                        ? "play"
                        : "play",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
}
function jambPose(t) {
    const breath = Math.sin(t * 0.42);
    return {
        lift: 2.88 + Math.abs(breath) * 1.44,
        rot: 4.8 + breath * 7.2,
        anim: "sit",
    };
}
function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    const s = smoothstep(u);
    return {
        lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)),
        rot: 4.8 * (1 - s),
        anim: "sit",
    };
}
/** Hinge — buccal pump / respiratory jaw rock. Not window-play GAPE. Not Bluff gape. */
function hingePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hinge));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 3.36, rot: s * 16.8 * facing, anim: "talk" };
    }
    if (u < 0.78) {
        const s = (u - 0.14) / 0.64;
        const open = Math.sin(s * Math.PI * 3.6);
        return {
            x: fromX + facing * Math.abs(open) * 0.42,
            lift: 3.36 + Math.abs(open) * 1.8,
            rot: facing * (16.8 + open * 14.4),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.4 * (1 - s),
        rot: facing * (9.6 * (1 - s)),
        anim: "idle",
    };
}
/** Pharynx — pharyngeal-jaw flash / prey-grab. Not Quill flash. Not Coin dart. */
function pharynxPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pharynx));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 2.88, rot: s * 9.6 * facing, anim: "play" };
    }
    if (u < 0.42) {
        const s = (u - 0.14) / 0.28;
        const snap = smoothstep(s);
        return {
            x: fromX + facing * snap * 2.16,
            lift: 2.88 + snap * 3.12,
            rot: facing * (9.6 + snap * 21.6),
            anim: "play",
        };
    }
    if (u < 0.74) {
        const s = (u - 0.42) / 0.32;
        const recoil = Math.sin(s * Math.PI);
        return {
            x: fromX + facing * (2.16 - s * 1.2),
            lift: 6.0 - s * 2.4 + recoil * 0.72,
            rot: facing * (31.2 - s * 16.8),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
        x: fromX + facing * 0.72 * (1 - s),
        lift: 2.64 * (1 - s),
        rot: facing * (9.6 * (1 - s)),
        anim: "idle",
    };
}
/** Knot — body cinch / retreat into dens. Not Anchor coil. Not Nori nook. */
function knotPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.knot));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 3.12, rot: s * -19.2 * facing, anim: "play" };
    }
    if (u < 0.55) {
        const s = (u - 0.14) / 0.41;
        const cinch = Math.sin(s * Math.PI * 2.2);
        return {
            x: fromX - facing * (1.44 * s + Math.abs(cinch) * 0.42),
            lift: 3.12 + Math.abs(cinch) * 1.92,
            rot: facing * (-19.2 + s * 50.4 + cinch * 16.8),
            anim: "play",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        return {
            x: fromX - facing * (1.44 + s * 0.96),
            lift: 3.36 * (1 - s * 0.42),
            rot: facing * (16.8 - s * 12),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX - facing * 2.16 * (1 - s),
        lift: 2.16 * (1 - s),
        rot: facing * (7.2 * (1 - s)),
        anim: "idle",
    };
}
/** Lurk — ambush peek from the dens. Not Keel peer. Not window-play GAPE. */
function lurkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lurk));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 2.88, rot: s * -7.2 * facing, anim: "talk" };
    }
    if (u < 0.48) {
        const s = (u - 0.16) / 0.32;
        return {
            x: fromX + facing * s * 1.92,
            lift: 2.88 + s * 1.44,
            rot: facing * (-7.2 + s * 14.4),
            anim: "talk",
        };
    }
    if (u < 0.74) {
        const hold = Math.sin((u - 0.48) * 16);
        return {
            x: fromX + facing * 1.92,
            lift: 4.08 + hold * 0.6,
            rot: facing * (7.2 + hold * 4.8),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
        x: fromX + facing * 1.92 * (1 - s),
        lift: 2.88 * (1 - s),
        rot: facing * (4.8 * (1 - s)),
        anim: "idle",
    };
}
/** Mucus — thick Gymnothorax slime-coat shimmer. Not Silver mucuscoat. Not Coin flare. */
function mucusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mucus));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 2.64, rot: s * 9.6 * facing, anim: "sit" };
    }
    if (u < 0.76) {
        const s = (u - 0.16) / 0.6;
        const shim = Math.sin(s * Math.PI * 4.2);
        const roll = Math.sin(s * Math.PI * 1.4);
        return {
            x: fromX + facing * (shim * 0.54 + roll * 0.3),
            lift: 2.64 + Math.abs(shim) * 1.68 + Math.abs(roll) * 0.72,
            rot: facing * (9.6 + shim * 14.4 + roll * 7.2),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return {
        x: fromX + facing * 0.48 * (1 - s),
        lift: 1.92 * (1 - s),
        rot: facing * (6 * (1 - s)),
        anim: "idle",
    };
}
/** Sentry — head-out crevice watch. Not lurk peek alone. Not Keel peer. Not guard. */
function sentryPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sentry));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 3.12, rot: s * -9.6 * facing, anim: "talk" };
    }
    if (u < 0.4) {
        const s = (u - 0.14) / 0.26;
        const rise = smoothstep(s);
        return {
            x: fromX + facing * rise * 1.68,
            lift: 3.12 + rise * 2.16,
            rot: facing * (-9.6 + rise * 12),
            anim: "talk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.4) / 0.38;
        const scan = Math.sin(s * Math.PI * 3.2);
        return {
            x: fromX + facing * (1.68 + scan * 0.42),
            lift: 5.04 + Math.abs(scan) * 0.96,
            rot: facing * (4.8 + scan * 16.8),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * 1.68 * (1 - s),
        lift: 3.12 * (1 - s),
        rot: facing * (7.2 * (1 - s)),
        anim: "idle",
    };
}
function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done")
        return trick;
    if (shouldAbort(flags) &&
        trick.kind !== "pharynx" &&
        trick.kind !== "knot" &&
        trick.kind !== "lurk" &&
        trick.kind !== "mucus" &&
        trick.kind !== "sentry") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "jamb") {
        if (next.t < JAMB_HOLD) {
            const pose = jambPose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < JAMB_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - JAMB_HOLD);
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
    let pose;
    if (next.kind === "hinge")
        pose = hingePose(next.t, fromX, trick.facing);
    else if (next.kind === "pharynx")
        pose = pharynxPose(next.t, fromX, trick.facing);
    else if (next.kind === "knot")
        pose = knotPose(next.t, fromX, trick.facing);
    else if (next.kind === "lurk")
        pose = lurkPose(next.t, fromX, trick.facing);
    else if (next.kind === "mucus")
        pose = mucusPose(next.t, fromX, trick.facing);
    else
        pose = sentryPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
    if (u >= 1)
        return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
}

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    DUR,
    JAMB_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    jambPose,
    releasePose,
    hingePose,
    pharynxPose,
    knotPose,
    lurkPose,
    mucusPose,
    sentryPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    breathPose,
    vigilPose,
    recessPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMorayTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
