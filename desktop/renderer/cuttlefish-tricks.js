/** Sepia ground tricks while idle — ultra-polish pass. House cuttlefish — bone / pupil / chroma / hover / blot / strike / zebra personality (cuttlebone buoyancy, W-pupil regard, chromatophore rewrite, water-column hover, sepia ink blot, feeding-tentacle strike, zebra agonistic banding; not Cup mantle dens, Coin bowl-drift, Bloom gill-amble, or Ink soak-tuck). Bone rides the cuttlebone mid-column; pupil W-slits regard the blotter; chroma rewrites skin color bands; hover fin-rows the water column; blot sepia-clouds then settles; strike shoots the two long feeding tentacles (species-true Sepia officinalis prey capture — not Cup sucker taste, not jet dart, not window-play FLUSH); zebra flashes high-contrast agonistic bars (species-true male display — not chroma rewrite, not Cup papilla texture, not parrot flash). Window-play FLUSH unchanged — never names `flush`. Ethogram keeps hide sit_hold; adds pupil/chroma/hover/blot/strike/zebra softs + freeze (replaces thin flush/hover). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via cuttlefish.wav. Thank-yous ripple / glance / dab. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `cuttlefish-tricks.ts`. True house-cuttlefish desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids flush/lid/mantle/sucker/jet/veil/tinker/papilla/ooze/drift/gulp/flare/dart/soak/tuck/paddle/gill/amble/plume/legend/fan/flash/latch/puff/unfurl/chart/climb/probe/canyon/crawl/siphon/pulse/slink/den/cork/nest/savor/settle/survey/snatch/band/funnel/tentacle/loom/wave/buoy/chamber name collisions with prior guests and cuttlefish window-play. Bird ultra (Soot→Ember) + Miso→Cup done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Amplitudes raised toward Rui richness; denser waits/weights (BONE_HOLD=11.2 RELEASE_S=1.18). Chamber densified. Pulse densified. Ochre densified. Tenant densified. Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house cuttlefish.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "cuttlefish";
const TRICKS = ["bone", "pupil", "chroma", "hover", "blot", "strike", "zebra"];
const HAPPY = ["ripple", "glance", "dab"];
const HAPPY_DUR = {
    ripple: 1.55,
    glance: 1.5,
    dab: 1.42,
};
/** Bone hold — Sepia rides the cuttlebone mid-column. Not window-play FLUSH. Not Cup mantle plate. Not Coin drift. */
const BONE_HOLD = 11.2;
const RELEASE_S = 1.18;
const DUR = {
    bone: BONE_HOLD + RELEASE_S,
    pupil: 1.78,
    chroma: 1.92,
    hover: 1.85,
    blot: 1.88,
    strike: 2.05,
    zebra: 2.12,
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
    if (kind === "bone")
        return 40 + roll * 26;
    if (kind === "strike" || kind === "zebra" || kind === "chroma")
        return 12.8 + roll * 9.4;
    if (kind === "blot" || kind === "hover" || kind === "pupil")
        return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}
function pickTrick(rand, musicOn = false, lastKind) {
    if (musicOn)
        return "bone";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) => k === "bone" ? 0.72 : k === "strike" || k === "zebra" || k === "chroma" ? 1.28 : k === "blot" || k === "hover" || k === "pupil" ? 1.18 : 1.08);
    let total = 0;
    for (let i = 0; i < weights.length; i++)
        total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return list[i];
    }
    return list[list.length - 1] || "bone";
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
    return key === TRICK_KEY || key === "sepia";
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
    const roll = rand == null ? Math.random() : rand;
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    return list[Math.floor(roll * list.length)] || list[0];
}
function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "ripple";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "ripple" ? "sit" : name === "glance" ? "talk" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function ripplePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ripple));
    if (u < 0.14) {
        const s = u / 0.14;
        return { lift: s * 3.84, rot: s * 16.8, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
        const fin = Math.sin(t * 3.4);
        return {
            lift: 3.84 + Math.abs(fin) * 2.16,
            rot: 16.8 + fin * 14.4,
            dx: fin * 0.54,
            anim: "sit",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.88 * (1 - s), rot: 9.6 * (1 - s), dx: 0, anim: "idle" };
}
function glancePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.glance));
    if (u < 0.12) {
        const s = u / 0.12;
        return { lift: s * 3.12, rot: s * -21.6, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
        const w = Math.sin(t * 2.6);
        return {
            lift: 3.12 + Math.abs(w) * 1.68,
            rot: -21.6 + w * 26.4,
            dx: w * 0.42,
            anim: "talk",
        };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.4 * (1 - s), rot: -14.4 * (1 - s), dx: 0, anim: "sit" };
}
function dabPose(t) {
    return {
        lift: Math.abs(Math.sin(t * 2.1)) * 2.64 + 2.88,
        rot: 9.6 + Math.sin(t * 2.8) * 16.8,
        dx: Math.sin(t * 1.6) * 0.48,
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
    if (next.kind === "ripple") {
        const pose = ripplePose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "glance") {
        const pose = glancePose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = dabPose(next.t);
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
    const anim = kind === "bone"
        ? "sit"
        : kind === "pupil"
            ? "talk"
            : kind === "chroma"
                ? "play"
                : kind === "hover"
                    ? "walk"
                    : kind === "blot"
                        ? "sit"
                        : kind === "strike"
                            ? "walk"
                            : kind === "zebra"
                                ? "play"
                                : "sit";
    return {
        kind,
        phase: kind === "bone" ? "hold" : "go",
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
function bonePose(t) {
    const beat = Math.sin(t * 1.7) + 0.54 * Math.sin(t * 3.4);
    return {
        lift: 2.88 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
        rot: -21.6 + Math.sin(t * 2.4) * 19.2 + beat * 9.6,
    };
}
function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return {
        lift: (2.88 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)),
        rot: -21.6 * (1 - u),
    };
}
function pupilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pupil));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 3.36, rot: s * -24 * facing, anim: "talk" };
    }
    if (u < 0.55) {
        const s = (u - 0.14) / 0.41;
        const w = Math.sin(s * Math.PI * 2.2);
        return {
            x: fromX + facing * w * 0.66,
            lift: 3.36 + Math.abs(w) * 2.16,
            rot: facing * (-24 + w * 28.8),
            anim: "talk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        return {
            x: fromX,
            lift: 3.36 - s * 0.72,
            rot: facing * (-9.6 + s * 4.8),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.16 * (1 - s),
        rot: facing * (-4.8 * (1 - s)),
        anim: "idle",
    };
}
function chromaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chroma));
    if (u < 0.1) {
        const s = smoothstep(u / 0.1);
        return { x: fromX, lift: s * 4.56, rot: s * 16.8 * facing, anim: "play" };
    }
    if (u < 0.72) {
        const s = (u - 0.1) / 0.62;
        const flash = Math.sin(s * Math.PI * 5.6);
        const band = Math.sin(s * Math.PI * 2.1);
        return {
            x: fromX + facing * band * 0.84,
            lift: 4.56 + Math.abs(flash) * 2.88,
            rot: facing * (16.8 + flash * 21.6 + band * 9.6),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX,
        lift: 3.84 * (1 - s),
        rot: facing * (9.6 * (1 - s)),
        anim: "sit",
    };
}
function hoverPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hover));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX + facing * s * 1.2, lift: s * 4.32, rot: s * 12 * facing, anim: "walk" };
    }
    if (u < 0.75) {
        const s = (u - 0.12) / 0.63;
        const bob = Math.sin(s * Math.PI * 3.2);
        const fin = Math.sin(s * Math.PI * 6.4);
        return {
            x: fromX + facing * (1.2 + s * 3.84 + fin * 0.66),
            lift: 4.32 + bob * 2.4,
            rot: facing * (12 + fin * 14.4 + bob * 7.2),
            anim: "walk",
        };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return {
        x: fromX + facing * (5.04 * (1 - s)),
        lift: 3.84 * (1 - s),
        rot: facing * (7.2 * (1 - s)),
        anim: "idle",
    };
}
function blotPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.blot));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 5.04, rot: s * -14.4 * facing, anim: "sit" };
    }
    if (u < 0.42) {
        const s = (u - 0.12) / 0.3;
        const cloud = Math.sin(s * Math.PI * 2.4);
        return {
            x: fromX + facing * cloud * 1.08,
            lift: 5.04 + Math.abs(cloud) * 2.88,
            rot: facing * (-14.4 + cloud * 19.2),
            anim: "play",
        };
    }
    if (u < 0.72) {
        const s = (u - 0.42) / 0.3;
        return {
            x: fromX - facing * s * 1.92,
            lift: 5.04 * (1 - s * 0.54),
            rot: facing * (4.8 - s * 9.6),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX - facing * (1.92 * (1 - s)),
        lift: 2.4 * (1 - s),
        rot: facing * (-3.6 * (1 - s)),
        anim: "idle",
    };
}
function strikePose(t, fromX, facing) {
    // Feeding-tentacle strike — two long tentacles shoot, then reel. Not Cup sucker/jet.
    const u = Math.max(0, Math.min(1, t / DUR.strike));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX + facing * s * 0.72, lift: s * 2.64, rot: s * 9.6 * facing, anim: "walk" };
    }
    if (u < 0.38) {
        const s = smoothstep((u - 0.12) / 0.26);
        return {
            x: fromX + facing * (0.72 + s * 6.6),
            lift: 2.64 + s * 1.68,
            rot: facing * (9.6 - s * 7.2),
            anim: "play",
        };
    }
    if (u < 0.72) {
        const s = (u - 0.38) / 0.34;
        const tug = Math.sin(s * Math.PI * 2.6);
        return {
            x: fromX + facing * (7.32 - s * 3.36 + tug * 0.48),
            lift: 4.32 + Math.abs(tug) * 1.92,
            rot: facing * (2.4 + tug * 16.8),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX + facing * (3.96 * (1 - s)),
        lift: 3.36 * (1 - s),
        rot: facing * (4.8 * (1 - s)),
        anim: "idle",
    };
}
function zebraPose(t, fromX, facing) {
    // Zebra agonistic banding — high-contrast bars flash. Not chroma rewrite, not parrot flash.
    const u = Math.max(0, Math.min(1, t / DUR.zebra));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 4.08, rot: s * -19.2 * facing, anim: "play" };
    }
    if (u < 0.7) {
        const s = (u - 0.12) / 0.58;
        const bars = Math.sin(s * Math.PI * 7.2);
        const sway = Math.sin(s * Math.PI * 2.4);
        return {
            x: fromX + facing * sway * 0.96,
            lift: 4.08 + Math.abs(bars) * 3.12,
            rot: facing * (-19.2 + bars * 26.4 + sway * 9.6),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
        x: fromX,
        lift: 3.6 * (1 - s),
        rot: facing * (-9.6 * (1 - s)),
        anim: "sit",
    };
}
function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done")
        return trick;
    if (shouldAbort(flags) &&
        trick.kind !== "chroma" &&
        trick.kind !== "hover" &&
        trick.kind !== "blot" &&
        trick.kind !== "strike" &&
        trick.kind !== "zebra") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "bone") {
        if (next.t < BONE_HOLD) {
            const pose = bonePose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < BONE_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - BONE_HOLD);
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
    if (next.kind === "pupil") {
        const pose = pupilPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "chroma") {
        const pose = chromaPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "hover") {
        const pose = hoverPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "blot") {
        const pose = blotPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "strike") {
        const pose = strikePose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = zebraPose(next.t, fromX, trick.facing);
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
    BONE_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    bonePose,
    releasePose,
    pupilPose,
    chromaPose,
    hoverPose,
    blotPose,
    strikePose,
    zebraPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    glancePose,
    dabPose,
    stepHappy
  };
  root.PetCuttlefishTricks = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
