/** Fan ground tricks while idle — ultra-polish pass. House ginkgo — biloba / notch / flutter / drop / amber / dichotomy / petiole personality (two-lobed biloba fan leaf open — never named fan (Parrot owns fan) / lobe (Kite owns lobe) / frond (Vein owns frond), apical notch tip settle, flutter fall as flutter — never named lean (Felt window owns lean) / unfurl (Vein window owns unfurl) / nod (Sol owns nod) / gold (Fan window owns gold), soft golden drop to blotter, living-fossil amber calm desk life under the lamp, dichotomous vein-fork shimmer as dichotomy — never named fork (taken) / venation collision with Vein name / midrib (taken), slender leaf-stalk petiole flex (species-true ginkgo petiole — never named stipe (Vein owns stipe) / rachis (Vein) / root (Burr) / rhizoid (Felt)); not Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Dichotomy is the species-true forking leaf-vein polish (not Vein name, not fork token). Petiole is the iconic long slender stalk flex (not Vein stipe, not Burr root). Window-play GOLD unchanged — never names gold as a trick. Ethogram keeps amber sit_hold; adds biloba/notch/flutter/drop/dichotomy/petiole softs + freeze (replaces thin lean/nod/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via ginkgo.wav. Thank-yous ochre / gilt / linger. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `ginkgo-tricks.ts`. True house-ginkgo desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids fan/gold/lean/unfurl/nod/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/fork/midrib/fossil/root name collisions. Bird ultra (Soot→Ember) + Miso→Vein done; skip Rui + birds. Next guest ultra is Mast / oak. No cry inventing beyond house ginkgo.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "ginkgo";
const TRICKS = ["biloba", "notch", "flutter", "drop", "amber", "dichotomy", "petiole"];
const HAPPY = ["ochre", "gilt", "linger"];
const HAPPY_DUR = {
    ochre: 1.28,
    gilt: 1.16,
    linger: 1.22,
};
/** Amber hold — Fan parks living-fossil calm on the blotter. Not window-play GOLD. */
const AMBER_HOLD = 10.8;
const RELEASE_S = 0.62;
const DUR = {
    amber: AMBER_HOLD + RELEASE_S,
    biloba: 1.58,
    notch: 1.48,
    flutter: 1.64,
    drop: 1.56,
    dichotomy: 1.68,
    petiole: 1.72,
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
    if (kind === "amber")
        return 38 + roll * 24;
    if (kind === "flutter" || kind === "dichotomy" || kind === "petiole")
        return 12 + roll * 9;
    if (kind === "biloba" || kind === "notch" || kind === "drop")
        return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}
function pickTrick(rand, musicOn, lastKind) {
    if (musicOn)
        return "amber";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "amber") {
        if (roll < 0.18)
            return "biloba";
        if (roll < 0.34)
            return "notch";
        if (roll < 0.5)
            return "flutter";
        if (roll < 0.66)
            return "drop";
        if (roll < 0.83)
            return "dichotomy";
        return "petiole";
    }
    if (lastKind === "biloba") {
        if (roll < 0.2)
            return "amber";
        if (roll < 0.36)
            return "notch";
        if (roll < 0.52)
            return "flutter";
        if (roll < 0.68)
            return "drop";
        if (roll < 0.84)
            return "dichotomy";
        return "petiole";
    }
    if (lastKind === "notch") {
        if (roll < 0.18)
            return "amber";
        if (roll < 0.34)
            return "biloba";
        if (roll < 0.5)
            return "flutter";
        if (roll < 0.66)
            return "drop";
        if (roll < 0.83)
            return "dichotomy";
        return "petiole";
    }
    if (lastKind === "dichotomy" || lastKind === "petiole") {
        if (roll < 0.16)
            return "amber";
        if (roll < 0.32)
            return "biloba";
        if (roll < 0.48)
            return "notch";
        if (roll < 0.64)
            return "flutter";
        if (roll < 0.8)
            return "drop";
        return lastKind === "dichotomy" ? "petiole" : "dichotomy";
    }
    if (roll < 0.14)
        return "amber";
    if (roll < 0.28)
        return "biloba";
    if (roll < 0.42)
        return "notch";
    if (roll < 0.56)
        return "flutter";
    if (roll < 0.7)
        return "drop";
    if (roll < 0.85)
        return "dichotomy";
    return "petiole";
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
    return key === TRICK_KEY || key === "fan";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "ochre";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "ochre" ? "talk" : name === "gilt" ? "play" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function ochrePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ochre));
    if (u < 0.2) {
        const s = u / 0.2;
        return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
        const warm = Math.sin(t * 1.72);
        return {
            lift: 2.8 + Math.abs(warm) * 1.4,
            rot: 12 + warm * 10,
            dx: warm * 0.12,
            anim: "talk",
        };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" };
}
function giltPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gilt));
    if (u < 0.18) {
        const s = u / 0.18;
        return { lift: s * 3.0, rot: s * -10, dx: 0, anim: "play" };
    }
    if (u < 0.78) {
        const flash = Math.sin(t * 2.05);
        return {
            lift: 3.0 + Math.abs(flash) * 1.5,
            rot: -10 + flash * 14,
            dx: flash * 0.14,
            anim: "play",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.0 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "idle" };
}
function lingerPose(t) {
    return {
        lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
        rot: Math.sin(t * 0.72) * 8,
        dx: Math.sin(t * 0.4) * -0.12,
        anim: "sit",
    };
}
function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done")
        return happy;
    if (happyShouldAbort(flags)) {
        return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "ochre") {
        const pose = ochrePose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "gilt") {
        const pose = giltPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = lingerPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    if (next.t >= hold)
        return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
}
function sleepHoldFrame(_key, _frameCount) {
    return null;
}
function beginTrick(kind, x, facing) {
    const anim = kind === "amber"
        ? "sit"
        : kind === "biloba"
            ? "sit"
            : kind === "notch"
                ? "talk"
                : kind === "flutter"
                    ? "play"
                    : kind === "drop"
                        ? "talk"
                        : kind === "dichotomy"
                            ? "play"
                            : kind === "petiole"
                                ? "talk"
                                : "sit";
    return {
        kind: kind,
        phase: kind === "amber" ? "hold" : "go",
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
function amberPose(t) {
    const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
    return {
        lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
        rot: 4 + breath * 6,
    };
}
function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    const s = smoothstep(u);
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4 * (1 - s) };
}
/** Biloba — two-lobed leaf open. Not parrot fan. Not Vein frond. */
function bilobaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.biloba));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 2.6, rot: s * -10 * facing, anim: "sit" };
    }
    if (u < 0.78) {
        const s = (u - 0.16) / 0.62;
        const split = Math.sin(s * Math.PI * 1.6);
        return {
            x: fromX + facing * Math.abs(split) * 0.35,
            lift: 2.6 + Math.abs(split) * 1.6,
            rot: facing * (-10 + split * 14),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 1.8 * (1 - s),
        rot: facing * (-6 * (1 - s)),
        anim: "sit",
    };
}
/** Notch — apical notch tip settle. Not Sol nod. */
function notchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.notch));
    if (u < 0.18) {
        const s = smoothstep(u / 0.18);
        return { x: fromX, lift: s * 2.4, rot: s * 14 * facing, anim: "talk" };
    }
    if (u < 0.55) {
        const s = (u - 0.18) / 0.37;
        const tip = Math.sin(s * Math.PI * 3.4);
        return {
            x: fromX + facing * tip * 0.4,
            lift: 2.4 + Math.abs(tip) * 1.4,
            rot: facing * (14 + tip * 12),
            anim: "talk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        const settle = smoothstep(s);
        return {
            x: fromX + facing * (1 - settle) * 0.5,
            lift: 3.2 - settle * 1.2,
            rot: facing * (14 - settle * 16),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.0 * (1 - s),
        rot: facing * (-3 * (1 - s)),
        anim: "sit",
    };
}
/** Flutter — soft flutter fall. Never named lean/unfurl/gold. */
function flutterPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.flutter));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 4.2, rot: s * 8 * facing, anim: "play" };
    }
    if (u < 0.72) {
        const s = (u - 0.14) / 0.58;
        const fall = Math.sin(s * Math.PI * 6.4);
        const descend = s * 2.4;
        return {
            x: fromX + facing * fall * 0.45,
            lift: 4.2 - descend + Math.abs(fall) * 0.8,
            rot: facing * (8 + fall * 12 - s * 10),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX + facing * 0.2 * (1 - s),
        lift: 1.6 * (1 - s),
        rot: facing * (-4 * (1 - s)),
        anim: "sit",
    };
}
/** Drop — soft golden leaf drop to blotter. Never named gold. */
function dropPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.drop));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "talk" };
    }
    if (u < 0.55) {
        const s = (u - 0.16) / 0.39;
        const hang = Math.sin(s * Math.PI * 1.8);
        return {
            x: fromX + facing * hang * 0.35,
            lift: 3.2 - s * 0.8 + Math.abs(hang) * 0.6,
            rot: facing * (-8 + hang * 12),
            anim: "talk",
        };
    }
    if (u < 0.82) {
        const s = (u - 0.55) / 0.27;
        const land = smoothstep(s);
        return {
            x: fromX + facing * (1 - land) * 0.4,
            lift: 2.4 * (1 - land * 0.85),
            rot: facing * (-4 + land * 8),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
        x: fromX,
        lift: 0.8 * (1 - s),
        rot: facing * (3 * (1 - s)),
        anim: "sit",
    };
}
/** Dichotomy — dichotomous vein-fork shimmer through the lamina. Not Vein name. Not fork token. */
function dichotomyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dichotomy));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 1.8, rot: s * -8 * facing, anim: "play" };
    }
    if (u < 0.55) {
        const s = (u - 0.16) / 0.39;
        const shimmer = Math.sin(s * Math.PI * 4.2);
        return {
            x: fromX + facing * (s * 0.6 + shimmer * 0.2),
            lift: 1.8 + Math.abs(shimmer) * 1.6,
            rot: facing * (-8 + shimmer * 14),
            anim: "play",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        const hold = Math.sin(s * Math.PI * 3.4);
        return {
            x: fromX + facing * 0.6,
            lift: 2.8 + Math.abs(hold) * 0.8,
            rot: facing * (4 + hold * 10),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * 0.6 * (1 - s),
        lift: 1.8 * (1 - s) + s * 0.2,
        rot: facing * (4 * (1 - s)),
        anim: "idle",
    };
}
/** Petiole — long slender leaf-stalk flex. Not Vein stipe. Not Burr root. Not Felt rhizoid. */
function petiolePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.petiole));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" };
    }
    if (u < 0.4) {
        const s = (u - 0.14) / 0.26;
        const flex = smoothstep(s);
        return {
            x: fromX + facing * flex * 0.5,
            lift: 2.6 + flex * 2.4,
            rot: facing * (10 + flex * 8),
            anim: "talk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.4) / 0.38;
        const sway = Math.sin(s * Math.PI * 3.2);
        return {
            x: fromX + facing * (0.5 + sway * 0.3),
            lift: 4.8 + Math.abs(sway) * 0.8,
            rot: facing * (6 + sway * 14),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * 0.5 * (1 - s),
        lift: 2.6 * (1 - s),
        rot: facing * (6 * (1 - s)),
        anim: "idle",
    };
}
function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done")
        return trick;
    if (shouldAbort(flags) &&
        trick.kind !== "biloba" &&
        trick.kind !== "notch" &&
        trick.kind !== "flutter" &&
        trick.kind !== "drop" &&
        trick.kind !== "dichotomy" &&
        trick.kind !== "petiole") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "amber") {
        if (next.t < AMBER_HOLD) {
            const pose = amberPose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < AMBER_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - AMBER_HOLD);
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
    if (next.kind === "biloba")
        pose = bilobaPose(next.t, fromX, trick.facing);
    else if (next.kind === "notch")
        pose = notchPose(next.t, fromX, trick.facing);
    else if (next.kind === "flutter")
        pose = flutterPose(next.t, fromX, trick.facing);
    else if (next.kind === "drop")
        pose = dropPose(next.t, fromX, trick.facing);
    else if (next.kind === "dichotomy")
        pose = dichotomyPose(next.t, fromX, trick.facing);
    else
        pose = petiolePose(next.t, fromX, trick.facing);
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
    AMBER_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    amberPose,
    releasePose,
    bilobaPose,
    notchPose,
    flutterPose,
    dropPose,
    dichotomyPose,
    petiolePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    ochrePose,
    giltPose,
    lingerPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGinkgoTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
