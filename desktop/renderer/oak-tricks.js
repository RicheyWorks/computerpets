/** Mast ground tricks while idle — ultra-polish pass. House oak — acorn / sinus / gall / taproot / bole / catkin / tyloses personality (acorn mast drop to the dish — never named drop (Fan owns drop) / dichotomy (Fan owns dichotomy) / petiole (Fan owns petiole) / seed (Mast window owns seed; Clip/hamster owns seed as a trick) / mast as fan-collision, lobed leaf sway as sinus — never named lobe (Kite owns lobe) / sway (Jade owns sway) / biloba (Fan owns biloba) / frond (Vein owns frond), gall curiosity tip inspect, deep taproot settle — never named root (Burr owns root) / dig (Rabbit owns dig), sturdy bole trunk calm desk life under the lamp, hanging male catkin tassel (species-true oak catkin — never named flutter (Fan owns flutter) / gold (Fan window owns gold) / drop (Fan owns drop)), white-oak tyloses vessel-plug (species-true Quercus alba watertight wood — never named barrel / cork (Velvet owns cork) / fossil (Ledger owns fossil) / vessel (stingless owns vessel)); not Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Catkin is the species-true hanging male flower tassel (not Fan flutter/drop/gold). Tyloses is the iconic white-oak vessel plug that makes the wood watertight (not barrel, not Velvet cork, not Ledger fossil). Window-play SEED unchanged — never names seed as a trick. Ethogram keeps bole sit_hold; adds acorn/sinus/gall/taproot/catkin/tyloses softs + freeze (replaces thin lean/nod/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via oak.wav. Thank-yous cupule / tannin / grove. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `oak-tricks.ts`. True house-oak desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids seed/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/canopy name collisions. Bird ultra (Soot→Ember) + Miso→Fan done; skip Rui + birds. Next guest ultra is Disk / water_lily. No cry inventing beyond house oak.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "oak";
const TRICKS = ["acorn", "sinus", "gall", "taproot", "bole", "catkin", "tyloses"];
const HAPPY = ["cupule", "tannin", "grove"];
const HAPPY_DUR = {
    cupule: 1.28,
    tannin: 1.16,
    grove: 1.22,
};
/** Bole hold — Mast parks sturdy trunk calm on the blotter. Not window-play SEED. */
const BOLE_HOLD = 10.8;
const RELEASE_S = 0.62;
const DUR = {
    bole: BOLE_HOLD + RELEASE_S,
    acorn: 1.58,
    sinus: 1.64,
    gall: 1.48,
    taproot: 1.56,
    catkin: 1.68,
    tyloses: 1.72,
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
    if (kind === "bole")
        return 38 + roll * 24;
    if (kind === "catkin" || kind === "tyloses" || kind === "sinus")
        return 12 + roll * 9;
    if (kind === "acorn" || kind === "gall" || kind === "taproot")
        return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}
function pickTrick(rand, musicOn, lastKind) {
    if (musicOn)
        return "bole";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "bole") {
        if (roll < 0.18)
            return "acorn";
        if (roll < 0.34)
            return "sinus";
        if (roll < 0.5)
            return "gall";
        if (roll < 0.66)
            return "taproot";
        if (roll < 0.83)
            return "catkin";
        return "tyloses";
    }
    if (lastKind === "acorn") {
        if (roll < 0.2)
            return "bole";
        if (roll < 0.36)
            return "sinus";
        if (roll < 0.52)
            return "gall";
        if (roll < 0.68)
            return "taproot";
        if (roll < 0.84)
            return "catkin";
        return "tyloses";
    }
    if (lastKind === "sinus") {
        if (roll < 0.18)
            return "bole";
        if (roll < 0.34)
            return "acorn";
        if (roll < 0.5)
            return "gall";
        if (roll < 0.66)
            return "taproot";
        if (roll < 0.83)
            return "catkin";
        return "tyloses";
    }
    if (lastKind === "catkin" || lastKind === "tyloses") {
        if (roll < 0.16)
            return "bole";
        if (roll < 0.32)
            return "acorn";
        if (roll < 0.48)
            return "sinus";
        if (roll < 0.64)
            return "gall";
        if (roll < 0.8)
            return "taproot";
        return lastKind === "catkin" ? "tyloses" : "catkin";
    }
    if (roll < 0.14)
        return "bole";
    if (roll < 0.28)
        return "acorn";
    if (roll < 0.42)
        return "sinus";
    if (roll < 0.56)
        return "gall";
    if (roll < 0.7)
        return "taproot";
    if (roll < 0.85)
        return "catkin";
    return "tyloses";
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
    return key === TRICK_KEY || key === "mast";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "cupule";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "cupule" ? "talk" : name === "tannin" ? "play" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function cupulePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cupule));
    if (u < 0.2) {
        const s = u / 0.2;
        return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
        const cup = Math.sin(t * 1.72);
        return {
            lift: 2.8 + Math.abs(cup) * 1.4,
            rot: 12 + cup * 10,
            dx: cup * 0.12,
            anim: "talk",
        };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" };
}
function tanninPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tannin));
    if (u < 0.18) {
        const s = u / 0.18;
        return { lift: s * 3.0, rot: s * -10, dx: 0, anim: "play" };
    }
    if (u < 0.78) {
        const warm = Math.sin(t * 2.05);
        return {
            lift: 3.0 + Math.abs(warm) * 1.5,
            rot: -10 + warm * 14,
            dx: warm * 0.14,
            anim: "play",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.0 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "idle" };
}
function grovePose(t) {
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
    if (next.kind === "cupule") {
        const pose = cupulePose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "tannin") {
        const pose = tanninPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = grovePose(next.t);
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
    const anim = kind === "bole"
        ? "sit"
        : kind === "acorn"
            ? "talk"
            : kind === "sinus"
                ? "sit"
                : kind === "gall"
                    ? "talk"
                    : kind === "taproot"
                        ? "play"
                        : kind === "catkin"
                            ? "play"
                            : kind === "tyloses"
                                ? "talk"
                                : "sit";
    return {
        kind: kind,
        phase: kind === "bole" ? "hold" : "go",
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
function bolePose(t) {
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
/** Acorn — mast drop to the dish. Never named drop/seed. */
function acornPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.acorn));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "talk" };
    }
    if (u < 0.52) {
        const s = (u - 0.16) / 0.36;
        const hang = Math.sin(s * Math.PI * 1.8);
        return {
            x: fromX + facing * hang * 0.35,
            lift: 3.2 - s * 0.8 + Math.abs(hang) * 0.6,
            rot: facing * (-8 + hang * 12),
            anim: "talk",
        };
    }
    if (u < 0.82) {
        const s = (u - 0.52) / 0.3;
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
/** Sinus — lobed leaf sway. Never named lobe/sway/frond. */
function sinusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sinus));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 2.6, rot: s * -10 * facing, anim: "sit" };
    }
    if (u < 0.78) {
        const s = (u - 0.14) / 0.64;
        const wave = Math.sin(s * Math.PI * 2.4);
        return {
            x: fromX + facing * wave * 0.4,
            lift: 2.6 + Math.abs(wave) * 1.6,
            rot: facing * (-10 + wave * 14),
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
/** Gall — curiosity tip inspect. Not Sol nod. */
function gallPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gall));
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
/** Taproot — deep root settle. Never named root/dig. */
function taprootPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.taproot));
    if (u < 0.15) {
        const s = smoothstep(u / 0.15);
        return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "play" };
    }
    if (u < 0.55) {
        const s = (u - 0.15) / 0.4;
        const press = smoothstep(s);
        return {
            x: fromX + facing * Math.sin(s * Math.PI) * 0.25,
            lift: 2.6 * (1 - press * 0.7),
            rot: facing * (10 - press * 14),
            anim: "play",
        };
    }
    if (u < 0.8) {
        const s = (u - 0.55) / 0.25;
        const dig = Math.sin(s * Math.PI * 3.2);
        return {
            x: fromX + facing * dig * 0.2,
            lift: 0.8 + Math.abs(dig) * 0.6,
            rot: facing * (-4 + dig * 10),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
        x: fromX,
        lift: 0.6 * (1 - s),
        rot: facing * (-2 * (1 - s)),
        anim: "sit",
    };
}
/** Catkin — hanging male flower tassel. Not Fan flutter/drop/gold. */
function catkinPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.catkin));
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
        const hang = Math.sin(s * Math.PI * 3.4);
        return {
            x: fromX + facing * 0.6,
            lift: 2.8 + Math.abs(hang) * 0.8,
            rot: facing * (4 + hang * 10),
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
/** Tyloses — white-oak vessel plug. Not barrel, not Velvet cork, not Ledger fossil. */
function tylosesPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tyloses));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" };
    }
    if (u < 0.4) {
        const s = (u - 0.14) / 0.26;
        const plug = smoothstep(s);
        return {
            x: fromX + facing * plug * 0.5,
            lift: 2.6 + plug * 2.4,
            rot: facing * (10 + plug * 8),
            anim: "talk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.4) / 0.38;
        const seal = Math.sin(s * Math.PI * 3.2);
        return {
            x: fromX + facing * (0.5 + seal * 0.3),
            lift: 4.8 + Math.abs(seal) * 0.8,
            rot: facing * (6 + seal * 14),
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
        trick.kind !== "acorn" &&
        trick.kind !== "sinus" &&
        trick.kind !== "gall" &&
        trick.kind !== "taproot" &&
        trick.kind !== "catkin" &&
        trick.kind !== "tyloses") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "bole") {
        if (next.t < BOLE_HOLD) {
            const pose = bolePose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < BOLE_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - BOLE_HOLD);
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
    if (next.kind === "acorn")
        pose = acornPose(next.t, fromX, trick.facing);
    else if (next.kind === "sinus")
        pose = sinusPose(next.t, fromX, trick.facing);
    else if (next.kind === "gall")
        pose = gallPose(next.t, fromX, trick.facing);
    else if (next.kind === "taproot")
        pose = taprootPose(next.t, fromX, trick.facing);
    else if (next.kind === "catkin")
        pose = catkinPose(next.t, fromX, trick.facing);
    else
        pose = tylosesPose(next.t, fromX, trick.facing);
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
    BOLE_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    bolePose,
    releasePose,
    acornPose,
    sinusPose,
    gallPose,
    taprootPose,
    catkinPose,
    tylosesPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    cupulePose,
    tanninPose,
    grovePose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOakTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
