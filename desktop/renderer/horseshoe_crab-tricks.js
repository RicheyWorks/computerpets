/** Ledger ground tricks while idle — ultra-polish pass. House horseshoe crab — carapace / bookgill / telson / furrow / fossil / pusher / ocular personality (ancient helmet settle, book-gill breath flaps, telson dig probes, sand furrow pushes, living-fossil desk stillness, posterior pusher-leg swim bursts, lateral compound-eye ocular scans; not Tenant swap/antenna/scuttle/withdraw/vacancy/chela/bailer, Cling podia/righting/crawl/evert/penta/madre/papula, Pulse bell/oral/lucent/trail/medusa, Clip nest/cheek/scurry/pocket/reel, Burr curl/snuffle, Chamber spiral, Cup mantle, Ink soak/tuck, Coin drift, Wave clawwave, or Ghost claw). Pusher rides the species-true posterior swimming pushers (not Coin dart, not Cup jet, not furrow plow); ocular sweeps the lateral compound eyes (not Sepia pupil, not Chamber pinhole, not Tenant antenna). Window-play PLOW unchanged — never names `plow`. Special Molt unchanged — never names molt as a trick. Ethogram keeps carapace sit_hold; adds bookgill/telson/furrow/fossil/pusher/ocular softs + freeze (replaces thin plow/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via horseshoe_crab.wav. Thank-yous blue / page / tray. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `horseshoe_crab-tricks.ts`. True house-horseshoe desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids plow/molt/podia/righting/crawl/evert/penta/madre/papula/bell/oral/lucent/trail/medusa/mantle/sucker/jet/veil/tinker/spiral/siphuncle/drift/gulp/soak/tuck/gill/amble/nest/cheek/curl/swap/withdraw/vacancy/antenna/scuttle/chela/bailer/knob/trade name collisions with prior guests and horseshoe window-play. Bird ultra (Soot→Ember) + Miso→Tenant done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Anchor / seahorse ultra done; next guest ultra is Kite / manta. Amplitudes raised toward Rui richness; denser waits/weights (CARAPACE_HOLD=11.2 RELEASE_S=1.18). Next leftover Anchor / seahorse. No cry inventing beyond house horseshoe_crab.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "horseshoe_crab";
const TRICKS = ["carapace", "bookgill", "telson", "furrow", "fossil", "pusher", "ocular"];
const HAPPY = ["blue", "page", "tray"];
const HAPPY_DUR = {
    blue: 1.28,
    page: 1.18,
    tray: 1.22,
};
/** Carapace hold — Ledger rests under the ancient helmet. Not window-play PLOW. Not Tenant withdraw. Not Cling podia. Not Burr curl. Not Ink tuck. */
const CARAPACE_HOLD = 11.2;
const RELEASE_S = 1.18;
const DUR = {
    carapace: CARAPACE_HOLD + RELEASE_S,
    bookgill: 1.58,
    telson: 1.72,
    furrow: 1.85,
    fossil: 1.62,
    pusher: 2.05,
    ocular: 2.12,
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
    if (kind === "carapace")
        return 40 + roll * 26;
    if (kind === "pusher" || kind === "ocular" || kind === "furrow")
        return 12.8 + roll * 9.4;
    if (kind === "telson" || kind === "bookgill" || kind === "fossil")
        return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}
function pickTrick(rand, musicOn = false, lastKind) {
    if (musicOn)
        return "carapace";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) => k === "carapace" ? 0.55 : k === "pusher" || k === "ocular" || k === "furrow" ? 1.15 : 1);
    let total = 0;
    for (let i = 0; i < weights.length; i++)
        total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return list[i];
    }
    return list[list.length - 1] || "carapace";
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
    return key === TRICK_KEY || key === "ledger";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "blue";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "blue" ? "talk" : name === "page" ? "play" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function bluePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blue));
    if (u < 0.16) {
        const s = u / 0.16;
        return { lift: s * 3.84, rot: s * 16.8, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
        const ink = Math.sin(t * 2.1);
        return {
            lift: 3.84 + Math.abs(ink) * 2.16,
            rot: 16.8 + ink * 19.2,
            dx: ink * 0.42,
            anim: "talk",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.88 * (1 - s), rot: 9.6 * (1 - s), dx: 0, anim: "idle" };
}
function pagePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.page));
    if (u < 0.18) {
        const s = u / 0.18;
        return { lift: s * 3.36, rot: s * -21.6, dx: 0, anim: "play" };
    }
    if (u < 0.8) {
        const turn = Math.sin(t * 1.95);
        return {
            lift: 3.36 + Math.abs(turn) * 1.8,
            rot: -21.6 + turn * 26.4,
            dx: turn * 0.48,
            anim: "play",
        };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.64 * (1 - s), rot: -12 * (1 - s), dx: 0, anim: "sit" };
}
function trayPose(t) {
    return {
        lift: Math.abs(Math.sin(t * 2.0)) * 2.64 + 2.88,
        rot: 9.6 + Math.sin(t * 2.4) * 16.8,
        dx: Math.sin(t * 1.4) * 0.42,
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
    if (next.kind === "blue") {
        const pose = bluePose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "page") {
        const pose = pagePose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = trayPose(next.t);
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
    const anim = kind === "carapace"
        ? "sit"
        : kind === "bookgill"
            ? "talk"
            : kind === "telson"
                ? "play"
                : kind === "furrow"
                    ? "walk"
                    : kind === "fossil"
                        ? "sit"
                        : kind === "pusher"
                            ? "walk"
                            : kind === "ocular"
                                ? "talk"
                                : "sit";
    return {
        kind,
        phase: kind === "carapace" ? "hold" : "go",
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
function carapacePose(t) {
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
function bookgillPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bookgill));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 3.36, rot: s * 16.8 * facing, anim: "talk" };
    }
    if (u < 0.78) {
        const s = (u - 0.12) / 0.66;
        const flap = Math.sin(s * Math.PI * 5.2);
        const rock = Math.sin(s * Math.PI * 1.1);
        return {
            x: fromX + facing * rock * 0.66,
            lift: 3.36 + Math.abs(flap) * 1.92,
            rot: facing * (16.8 + flap * 19.2 + rock * 9.6),
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
function telsonPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.telson));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 4.08, rot: s * -26.4 * facing, anim: "play" };
    }
    if (u < 0.72) {
        const s = (u - 0.14) / 0.58;
        const dig = Math.sin(s * Math.PI * 3.4);
        return {
            x: fromX + facing * dig * 0.84,
            lift: 4.08 - Math.abs(dig) * 1.44 + 1.2,
            rot: facing * (-26.4 + dig * 33.6),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX,
        lift: 3.12 * (1 - s),
        rot: facing * (-12 * (1 - s)),
        anim: "sit",
    };
}
function furrowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.furrow));
    if (u < 0.1) {
        const s = smoothstep(u / 0.1);
        return { x: fromX, lift: s * 3.36, rot: s * -16.8 * facing, anim: "walk" };
    }
    if (u < 0.74) {
        const s = (u - 0.1) / 0.64;
        const grind = Math.sin(s * Math.PI * 2.4);
        const push = Math.sin(s * Math.PI * 1.1);
        return {
            x: fromX + facing * (s * 1.86 + grind * 0.3),
            lift: 3.36 + Math.abs(grind) * 1.68,
            rot: facing * (-16.8 + grind * 14.4 + push * 7.2),
            anim: "walk",
        };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
        x: fromX + facing * 1.86 * (1 - s * 0.15),
        lift: 3.36 * (1 - s),
        rot: facing * (-7.2 * (1 - s)),
        anim: "idle",
    };
}
function fossilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fossil));
    if (u < 0.18) {
        const s = smoothstep(u / 0.18);
        return { x: fromX, lift: s * 2.88, rot: s * 14.4 * facing, anim: "sit" };
    }
    if (u < 0.78) {
        const s = (u - 0.18) / 0.6;
        const alive = Math.sin(s * Math.PI * 1.8);
        return {
            x: fromX + facing * alive * 0.54,
            lift: 2.88 + Math.abs(alive) * 1.68,
            rot: facing * (14.4 + alive * 16.8),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.16 * (1 - s),
        rot: facing * (7.2 * (1 - s)),
        anim: "idle",
    };
}
function pusherPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pusher));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 3.84, rot: s * -19.2 * facing, anim: "walk" };
    }
    if (u < 0.7) {
        const s = (u - 0.12) / 0.58;
        const kick = Math.sin(s * Math.PI * 4.4);
        const surge = Math.sin(s * Math.PI * 1.4);
        return {
            x: fromX + facing * (surge * 1.5 + kick * 0.48),
            lift: 3.84 + Math.abs(kick) * 2.16,
            rot: facing * (-19.2 + kick * 26.4 + surge * 12),
            anim: "walk",
        };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
        x: fromX + facing * 1.2 * (1 - s),
        lift: 2.88 * (1 - s),
        rot: facing * (-9.6 * (1 - s)),
        anim: "idle",
    };
}
function ocularPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ocular));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 3.12, rot: s * 21.6 * facing, anim: "talk" };
    }
    if (u < 0.78) {
        const s = (u - 0.12) / 0.66;
        const sweep = Math.sin(s * Math.PI * 3.6);
        const lean = Math.sin(s * Math.PI * 1.5);
        return {
            x: fromX + facing * lean * 0.72,
            lift: 3.12 + Math.abs(sweep) * 1.8,
            rot: facing * (21.6 + sweep * 28.8 + lean * 9.6),
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
function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done")
        return trick;
    if (shouldAbort(flags) && trick.kind !== "furrow" && trick.kind !== "telson" && trick.kind !== "fossil" && trick.kind !== "pusher" && trick.kind !== "ocular") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "carapace") {
        if (next.t < CARAPACE_HOLD) {
            const pose = carapacePose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < CARAPACE_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - CARAPACE_HOLD);
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
    if (next.kind === "bookgill") {
        const pose = bookgillPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "telson") {
        const pose = telsonPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "furrow") {
        const pose = furrowPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "pusher") {
        const pose = pusherPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "ocular") {
        const pose = ocularPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = fossilPose(next.t, fromX, trick.facing);
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
    CARAPACE_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    carapacePose,
    releasePose,
    bookgillPose,
    telsonPose,
    furrowPose,
    fossilPose,
    pusherPose,
    ocularPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    bluePose,
    pagePose,
    trayPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHorseshoeCrabTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
