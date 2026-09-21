/** Tenant ground tricks while idle — ultra-polish pass. House hermit crab — swap / antenna / scuttle / withdraw / vacancy / chela / bailer personality (shell-swap try-on, antennal tap probes, sideways scuttle bursts, soft-abdomen withdraw into the lid, house-hunting vacancy desk life, major-claw chela display, scaphognathite gill-bailer irrigation; not Cling podia/righting/crawl/evert/penta/madre/papula, Pulse bell/oral/lucent/trail/medusa, Clip nest/cheek/scurry/pocket/reel, Burr curl/snuffle, Chamber spiral, Cup mantle, Ink soak/tuck, Coin drift, Wave clawwave, or Ghost claw). Chela rides a major cheliped wave (species-true hermit claw display — not Wave clawwave, not fiddler advertise, not window-play KNOB); bailer pumps the branchial scaphognathite (species-true hermit gill irrigation — not Pulse oral, not Bloom gill, not Ink paddle). Window-play KNOB unchanged — never names `knob`. Special Trade unchanged — never names trade as a trick. Ethogram keeps withdraw sit_hold; adds swap/antenna/scuttle/vacancy/chela/bailer softs + freeze (replaces thin inspect/shuffle). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via hermit_crab.wav. Thank-yous scrap / fit / lease. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `hermit_crab-tricks.ts`. True house-hermit desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids knob/trade/podia/righting/crawl/evert/penta/madre/papula/bell/oral/lucent/trail/medusa/mantle/sucker/jet/veil/tinker/spiral/siphuncle/drift/gulp/soak/tuck/gill/amble/nest/cheek/curl/clawwave/chelate/stalkeyescan name collisions with prior guests and hermit window-play. Bird ultra (Soot→Ember) + Miso→Ochre done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Ledger / horseshoe_crab ultra done; Anchor / seahorse ultra done; next guest ultra is Kite / manta. Amplitudes raised toward Rui richness; denser waits/weights (WITHDRAW_HOLD=11.2 RELEASE_S=1.18). Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Next leftover Mast / oak. No cry inventing beyond house hermit_crab.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "hermit_crab";
const TRICKS = ["swap", "antenna", "scuttle", "withdraw", "vacancy", "chela", "bailer"];
const HAPPY = ["scrap", "fit", "lease"];
const HAPPY_DUR = {
    scrap: 1.28,
    fit: 1.18,
    lease: 1.2,
};
/** Withdraw hold — Tenant rests tucked in the borrowed lid. Not window-play KNOB. Not Cling podia. Not Burr curl. Not Ink tuck. */
const WITHDRAW_HOLD = 11.2;
const RELEASE_S = 1.18;
const DUR = {
    withdraw: WITHDRAW_HOLD + RELEASE_S,
    swap: 1.72,
    antenna: 1.58,
    scuttle: 1.85,
    vacancy: 1.72,
    chela: 2.05,
    bailer: 2.12,
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
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest")
        return true;
    if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter")
        return true;
    return false;
}
function nextTrickWait(justFinished, rand, kind) {
    const roll = rand == null ? Math.random() : rand;
    if (kind === "withdraw")
        return 40 + roll * 26;
    if (kind === "chela" || kind === "bailer" || kind === "scuttle")
        return 12.8 + roll * 9.4;
    if (kind === "swap" || kind === "antenna" || kind === "vacancy")
        return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}
function pickTrick(rand, musicOn = false, lastKind) {
    if (musicOn)
        return "withdraw";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) => k === "withdraw" ? 0.72 : k === "chela" || k === "bailer" || k === "scuttle" ? 1.28 : k === "swap" || k === "antenna" || k === "vacancy" ? 1.18 : 1.08);
    let total = 0;
    for (let i = 0; i < weights.length; i++)
        total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return list[i];
    }
    return list[list.length - 1] || "withdraw";
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
    return key === TRICK_KEY || key === "tenant";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "scrap";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "scrap" ? "talk" : name === "fit" ? "sit" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function scrapPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scrap));
    if (u < 0.16) {
        const s = u / 0.16;
        return { lift: s * 3.84, rot: s * -16.8, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
        const nibble = Math.sin(t * 2.4);
        return {
            lift: 3.84 + Math.abs(nibble) * 2.16,
            rot: -16.8 + nibble * 19.2,
            dx: nibble * 0.48,
            anim: "talk",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.88 * (1 - s), rot: -9.6 * (1 - s), dx: 0, anim: "idle" };
}
function fitPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.fit));
    if (u < 0.18) {
        const s = u / 0.18;
        return { lift: s * 3.36, rot: s * 19.2, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
        const settle = Math.sin(t * 1.85);
        return {
            lift: 3.36 + Math.abs(settle) * 1.68,
            rot: 19.2 + settle * 16.8,
            dx: settle * 0.42,
            anim: "sit",
        };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.64 * (1 - s), rot: 12 * (1 - s), dx: 0, anim: "sit" };
}
function leasePose(t) {
    return {
        lift: Math.abs(Math.sin(t * 2.1)) * 2.64 + 2.88,
        rot: 9.6 + Math.sin(t * 2.6) * 16.8,
        dx: Math.sin(t * 1.5) * 0.48,
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
    if (next.kind === "scrap") {
        const pose = scrapPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "fit") {
        const pose = fitPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = leasePose(next.t);
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
    const anim = kind === "withdraw"
        ? "sit"
        : kind === "swap"
            ? "play"
            : kind === "antenna"
                ? "talk"
                : kind === "scuttle"
                    ? "walk"
                    : kind === "vacancy"
                        ? "walk"
                        : kind === "chela"
                            ? "play"
                            : kind === "bailer"
                                ? "talk"
                                : "sit";
    return {
        kind,
        phase: kind === "withdraw" ? "hold" : "go",
        t: 0,
        x,
        lift: 0,
        rot: 0,
        anim,
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
}
function withdrawPose(t) {
    const beat = Math.sin(t * 1.7) + 0.54 * Math.sin(t * 3.4);
    return {
        lift: 2.88 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
        rot: -21.6 + Math.sin(t * 2.4) * 19.2 + beat * 8,
    };
}
function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (2.88 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -21.6 * (1 - u) };
}
function swapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.swap));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 4.32, rot: s * -33.6 * facing, anim: "play" };
    }
    if (u < 0.52) {
        const s = (u - 0.14) / 0.38;
        const tryOn = Math.sin(s * Math.PI * 2);
        return {
            x: fromX + facing * tryOn * 1.02,
            lift: 4.32 + Math.abs(tryOn) * 2.16,
            rot: facing * (-33.6 + tryOn * 50.4),
            anim: "play",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.52) / 0.26;
        return {
            x: fromX,
            lift: 4.32 * (1 - s * 0.48),
            rot: facing * (-33.6 * (1 - s) + 12 * s),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.64 * (1 - s),
        rot: facing * (7.2 * (1 - s)),
        anim: "sit",
    };
}
function antennaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antenna));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 3.12, rot: s * 21.6 * facing, anim: "talk" };
    }
    if (u < 0.78) {
        const s = (u - 0.12) / 0.66;
        const tap = Math.sin(s * Math.PI * 4.2);
        const lean = Math.sin(s * Math.PI * 1.3);
        return {
            x: fromX + facing * lean * 0.66,
            lift: 3.12 + Math.abs(tap) * 1.92,
            rot: facing * (21.6 + tap * 19.2 + lean * 9.6),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.16 * (1 - s),
        rot: facing * (9.6 * (1 - s)),
        anim: "sit",
    };
}
function scuttlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scuttle));
    if (u < 0.1) {
        const s = smoothstep(u / 0.1);
        return { x: fromX, lift: s * 3.36, rot: s * -16.8 * facing, anim: "walk" };
    }
    if (u < 0.74) {
        const s = (u - 0.1) / 0.64;
        const burst = Math.sin(s * Math.PI * 4.6);
        const side = Math.sin(s * Math.PI * 1.2);
        return {
            x: fromX + facing * (side * 1.62 + burst * 0.35),
            lift: 3.36 + Math.abs(burst) * 1.92,
            rot: facing * (-16.8 + burst * 12 + side * 9.6),
            anim: "walk",
        };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
        x: fromX + facing * 1.62 * (1 - s),
        lift: 3.36 * (1 - s),
        rot: facing * (-7.2 * (1 - s)),
        anim: "idle",
    };
}
function vacancyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.vacancy));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 3.12, rot: s * 14.4 * facing, anim: "walk" };
    }
    if (u < 0.42) {
        const s = (u - 0.14) / 0.28;
        return {
            x: fromX + facing * s * 1.38,
            lift: 3.12 + Math.sin(s * Math.PI) * 1.68,
            rot: facing * (14.4 + Math.sin(s * Math.PI * 2) * 12),
            anim: "walk",
        };
    }
    if (u < 0.72) {
        const s = (u - 0.42) / 0.3;
        const measure = Math.sin(s * Math.PI * 3);
        return {
            x: fromX + facing * 1.38,
            lift: 2.88 + Math.abs(measure) * 1.92,
            rot: facing * (measure * 26.4),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX + facing * 1.38 * (1 - s),
        lift: 2.4 * (1 - s),
        rot: facing * (7.2 * (1 - s)),
        anim: "idle",
    };
}
function chelaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chela));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 4.08, rot: s * -26.4 * facing, anim: "play" };
    }
    if (u < 0.7) {
        const s = (u - 0.14) / 0.56;
        const wave = Math.sin(s * Math.PI * 3.2);
        const brandish = Math.sin(s * Math.PI * 1.5);
        return {
            x: fromX + facing * brandish * 0.84,
            lift: 4.08 + Math.abs(wave) * 2.16,
            rot: facing * (-26.4 + wave * 33.6 + brandish * 12),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
        x: fromX,
        lift: 3.12 * (1 - s),
        rot: facing * (-12 * (1 - s)),
        anim: "sit",
    };
}
function bailerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bailer));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 3.36, rot: s * 16.8 * facing, anim: "talk" };
    }
    if (u < 0.78) {
        const s = (u - 0.12) / 0.66;
        const pump = Math.sin(s * Math.PI * 5.2);
        const chamber = Math.sin(s * Math.PI * 1.6);
        return {
            x: fromX + facing * chamber * 0.54,
            lift: 3.36 + Math.abs(pump) * 1.92 + Math.abs(chamber) * 0.96,
            rot: facing * (16.8 + pump * 21.6 + chamber * 9.6),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.64 * (1 - s),
        rot: facing * (9.6 * (1 - s)),
        anim: "sit",
    };
}
function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done")
        return trick;
    if (shouldAbort(flags) && trick.kind !== "swap" && trick.kind !== "scuttle" && trick.kind !== "vacancy" && trick.kind !== "chela") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "withdraw") {
        if (next.t < WITHDRAW_HOLD) {
            const pose = withdrawPose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < WITHDRAW_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - WITHDRAW_HOLD);
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
    const from = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "swap") {
        const pose = swapPose(next.t, from, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "antenna") {
        const pose = antennaPose(next.t, from, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "scuttle") {
        const pose = scuttlePose(next.t, from, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "vacancy") {
        const pose = vacancyPose(next.t, from, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "chela") {
        const pose = chelaPose(next.t, from, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = bailerPose(next.t, from, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
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
    WITHDRAW_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    withdrawPose,
    releasePose,
    swapPose,
    antennaPose,
    scuttlePose,
    vacancyPose,
    chelaPose,
    bailerPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    scrapPose,
    fitPose,
    leasePose,
    stepHappy
  };
  root.PetHermitCrabTricks = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
