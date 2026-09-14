/** Cup ground tricks while idle — ultra-polish pass. House octopus — mantle / sucker / jet / veil / tinker / papilla / ooze personality (cephalopod desk life; suckers, siphon jet, ink veil, problem-solving curiosity, dermal papillae texture-camouflage, boneless crack-ooze; teacup dens, not Coin bowl-drift or Bloom gill-amble or Ink soak-tuck or Sepia flush-hover). Mantle dens as a teacup-shaped cephalopod plate; sucker arm-tastes the blotter; jet siphon-darts; veil ink-clouds then settles; tinker puzzle-handles a desk gadget; papilla raises skin papillae for 3D camouflage (species-true Octopus vulgaris — not veil ink, not window-play LID, not Sepia chroma); ooze boneless-squeezes through a narrow gap (species-true escape — not mantle dens-hold, not jet dart). Window-play LID unchanged — never names `lid`. Ethogram keeps hide sit_hold; adds sucker/jet/veil/tinker/papilla/ooze softs + freeze (replaces thin hide/jet/taste). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via octopus.wav. Thank-yous keep / tint / squeeze. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `octopus-tricks.ts`. True house-octopus desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids lid/drift/gulp/flare/dart/soak/tuck/paddle/gill/amble/plume/legend/flush/fan/latch/puff/unfurl/chart/climb/probe/canyon/ripple/chroma/hover/blot/bone/pupil/crawl/siphon/pulse/slink/den/cork/nest/savor/settle/survey name collisions with prior guests and octopus window-play. Bird ultra (Soot→Ember) + Miso→Atlas done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Next guest ultra is Sepia / cuttlefish. No cry inventing beyond house octopus.wav prefer. Never retouch Rui sprites. */

(function (root) {
const TRICK_KEY = "octopus";
const TRICKS = ["mantle", "sucker", "jet", "veil", "tinker", "papilla", "ooze"];
const HAPPY = ["keep", "tint", "squeeze"];
const HAPPY_DUR = {
    keep: 1.55,
    tint: 1.62,
    squeeze: 1.5,
};
/** Mantle hold — Cup dens as a teacup-shaped cephalopod plate. Not window-play LID. Not Coin drift. */
const MANTLE_HOLD = 12.2;
const RELEASE_S = 0.82;
const DUR = {
    mantle: MANTLE_HOLD + RELEASE_S,
    sucker: 1.78,
    jet: 1.72,
    veil: 1.92,
    tinker: 1.98,
    papilla: 2.05,
    ooze: 2.12,
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
    if (kind === "mantle")
        return 38 + roll * 24;
    if (kind === "papilla" || kind === "ooze" || kind === "veil")
        return 12 + roll * 9;
    if (kind === "sucker" || kind === "tinker")
        return 11 + roll * 8;
    if (kind === "jet")
        return 10 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}
function pickTrick(rand, musicOn = false, lastKind) {
    if (musicOn)
        return "mantle";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) => k === "mantle" ? 0.55 : k === "papilla" || k === "ooze" || k === "veil" ? 1.15 : 1);
    let total = 0;
    for (let i = 0; i < weights.length; i++)
        total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return list[i];
    }
    return list[list.length - 1] || "mantle";
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
    return key === TRICK_KEY || key === "cup";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "keep";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x,
        lift: 0,
        rot: 0,
        anim: name === "keep" ? "sit" : name === "tint" ? "talk" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function keepPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.keep));
    if (u < 0.14) {
        const s = u / 0.14;
        return { lift: s * 4.2, rot: s * -16, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
        const wrap = Math.abs(Math.sin(t * 4.6));
        return {
            lift: 4.2 + wrap * 3.4,
            rot: -16 + Math.sin(t * 3.4) * 14,
            dx: Math.sin(t * 1.8) * 0.55,
            anim: "sit",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 4.2 * (1 - s), rot: -16 * (1 - s), dx: 0, anim: "idle" };
}
function tintPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tint));
    if (u < 0.12) {
        const s = u / 0.12;
        return { lift: s * 4.6, rot: s * 18, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
        const shimmer = Math.sin(t * 3.1);
        return {
            lift: 4.6 + Math.abs(shimmer) * 3.2,
            rot: 18 + shimmer * 16,
            dx: shimmer * 0.7,
            anim: "talk",
        };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 4.6 * (1 - s), rot: 18 * (1 - s), dx: 0, anim: "sit" };
}
function squeezePose(t) {
    return {
        lift: Math.abs(Math.sin(t * 3.4)) * 3.8 + 2.4,
        rot: -16 + Math.sin(t * 2.8) * 14,
        dx: Math.sin(t * 1.9) * 0.7,
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
    if (next.kind === "keep") {
        const pose = keepPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "tint") {
        const pose = tintPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = squeezePose(next.t);
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
    const anim = kind === "mantle"
        ? "sit"
        : kind === "sucker"
            ? "walk"
            : kind === "jet"
                ? "walk"
                : kind === "veil"
                    ? "sit"
                    : kind === "tinker"
                        ? "play"
                        : kind === "papilla"
                            ? "sit"
                            : kind === "ooze"
                                ? "walk"
                                : "sit";
    return {
        kind,
        phase: kind === "mantle" ? "hold" : "go",
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
function mantlePose(t) {
    const beat = Math.sin(t * 1.7) + 0.45 * Math.sin(t * 3.4);
    return {
        lift: 2.4 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
        rot: -22 + Math.sin(t * 2.4) * 18 + Math.sin(t * 4.6) * 10,
    };
}
function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return {
        lift: (2.4 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)),
        rot: -22 * (1 - u),
    };
}
function suckerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sucker));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX + facing * s * 1.2, lift: s * 2.8, rot: s * 16 * facing, anim: "walk" };
    }
    if (u < 0.55) {
        const s = (u - 0.12) / 0.43;
        const taste = Math.sin(s * Math.PI * 3.4);
        return {
            x: fromX + facing * (1.2 + s * 3.6 + taste * 0.55),
            lift: 2.8 + Math.abs(taste) * 2.4,
            rot: facing * (16 + taste * 14),
            anim: "play",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        return {
            x: fromX + facing * (4.8 - s * 0.6),
            lift: 3.2 + Math.sin(s * Math.PI) * 1.4,
            rot: facing * (8 - s * 4),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * (4.2 * (1 - s)),
        lift: 3.2 * (1 - s),
        rot: facing * (4 * (1 - s)),
        anim: "walk",
    };
}
function jetPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.jet));
    if (u < 0.1) {
        const s = smoothstep(u / 0.1);
        return { x: fromX - facing * s * 1.1, lift: s * 2.2, rot: s * -14 * facing, anim: "sit" };
    }
    if (u < 0.45) {
        const s = smoothstep((u - 0.1) / 0.35);
        return {
            x: fromX - facing * 1.1 + facing * s * 7.2,
            lift: 2.2 + Math.sin(s * Math.PI) * 3.6,
            rot: facing * (-14 + s * 28),
            anim: "walk",
        };
    }
    if (u < 0.72) {
        const s = (u - 0.45) / 0.27;
        const coast = Math.abs(Math.sin(s * Math.PI * 1.6));
        return {
            x: fromX + facing * (6.1 + coast * 0.35),
            lift: 2.0 + coast * 1.2,
            rot: facing * (8 - s * 10),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX + facing * (6.4 * (1 - s)),
        lift: 2.2 * (1 - s),
        rot: facing * (-2 * (1 - s)),
        anim: "idle",
    };
}
function veilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.veil));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 4.4, rot: s * 18 * facing, anim: "sit" };
    }
    if (u < 0.48) {
        const s = (u - 0.14) / 0.34;
        const cloud = Math.sin(s * Math.PI * 2.8);
        return {
            x: fromX + facing * cloud * 0.7,
            lift: 4.4 + Math.abs(cloud) * 2.6,
            rot: facing * (18 + cloud * 14),
            anim: "play",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.48) / 0.3;
        return {
            x: fromX + facing * Math.sin(s * Math.PI) * 0.4,
            lift: 4.4 * (1 - s * 0.55),
            rot: facing * (8 - s * 12),
            anim: "sit",
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
function tinkerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tinker));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX + facing * s * 1.4, lift: s * 3.2, rot: s * 18 * facing, anim: "play" };
    }
    if (u < 0.55) {
        const s = (u - 0.12) / 0.43;
        const puzzle = Math.sin(s * Math.PI * 4.2);
        return {
            x: fromX + facing * (1.4 + puzzle * 1.1),
            lift: 3.2 + Math.abs(puzzle) * 2.8,
            rot: facing * (18 + puzzle * 16),
            anim: "play",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        const check = Math.abs(Math.sin(s * Math.PI * 2));
        return {
            x: fromX + facing * (1.4 - s * 0.4),
            lift: 3.4 + check * 1.4,
            rot: facing * (10 - s * 6 + check * 4),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * (1.0 * (1 - s)),
        lift: 3.4 * (1 - s),
        rot: facing * (4 * (1 - s)),
        anim: "idle",
    };
}
function papillaPose(t, fromX, facing) {
    // Dermal papillae raise — 3D skin camouflage texture, not ink veil.
    const u = Math.max(0, Math.min(1, t / DUR.papilla));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 3.6, rot: s * -14 * facing, anim: "sit" };
    }
    if (u < 0.72) {
        const s = (u - 0.14) / 0.58;
        const bumps = Math.sin(s * Math.PI * 5.2) + 0.35 * Math.sin(s * Math.PI * 9);
        return {
            x: fromX + facing * bumps * 0.35,
            lift: 3.6 + Math.abs(bumps) * 2.8,
            rot: facing * (-14 + bumps * 16),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX,
        lift: 3.6 * (1 - s),
        rot: facing * (-14 * (1 - s)),
        anim: "sit",
    };
}
function oozePose(t, fromX, facing) {
    // Boneless squeeze through a narrow gap — species-true escape, not mantle dens.
    const u = Math.max(0, Math.min(1, t / DUR.ooze));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX + facing * s * 0.8, lift: s * 1.8, rot: s * 12 * facing, anim: "walk" };
    }
    if (u < 0.45) {
        const s = smoothstep((u - 0.12) / 0.33);
        return {
            x: fromX + facing * (0.8 + s * 2.2),
            lift: 1.8 - s * 1.2,
            rot: facing * (12 - s * 22),
            anim: "walk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.45) / 0.33;
        const flow = Math.sin(s * Math.PI * 2.4);
        return {
            x: fromX + facing * (3.0 + s * 3.4 + flow * 0.4),
            lift: 0.6 + Math.abs(flow) * 2.4 + s * 2.0,
            rot: facing * (-10 + flow * 18),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * (6.4 * (1 - s) + s * 0),
        lift: 2.6 * (1 - s),
        rot: facing * (4 * (1 - s)),
        anim: "idle",
    };
}
function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done")
        return trick;
    if (shouldAbort(flags) &&
        trick.kind !== "jet" &&
        trick.kind !== "sucker" &&
        trick.kind !== "tinker" &&
        trick.kind !== "ooze") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "mantle") {
        if (next.t < MANTLE_HOLD) {
            const pose = mantlePose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < MANTLE_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - MANTLE_HOLD);
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
    if (next.kind === "sucker") {
        const pose = suckerPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "jet") {
        const pose = jetPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "veil") {
        const pose = veilPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "papilla") {
        const pose = papillaPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "ooze") {
        const pose = oozePose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = tinkerPose(next.t, fromX, trick.facing);
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
    MANTLE_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    mantlePose,
    releasePose,
    suckerPose,
    jetPose,
    veilPose,
    tinkerPose,
    papillaPose,
    oozePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    keepPose,
    tintPose,
    squeezePose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOctopusTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
