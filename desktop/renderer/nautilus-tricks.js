/** Chamber ground tricks while idle — ultra-polish pass. House nautilus — spiral / siphuncle / nacre / pinhole / fringe / hyponome / aperture personality (chambered shell spiral, gas-tube buoyancy, pearly nacre calm, pinhole-eye regard, suckerless tentacle fringe, hyponome funnel jet, soft-body aperture emerge; not Cup mantle dens, Sepia cuttlebone chromatophores, or Coin bowl-drift). Spiral rides the coiled chambers; siphuncle gas-tubes buoyancy; nacre pearly-calms; pinhole regards the blotter; fringe waves suckerless cirri; hyponome funnel-jets (species-true Nautilus pompilius locomotion — not Cup mantle jet, not window-play RISE); aperture soft-body emerges/retracts at the shell mouth (species-true protective/foraging posture — not Cup dens, not Sepia blot). Window-play RISE unchanged — never names `rise`. Ethogram keeps hide sit_hold; adds siphuncle/nacre/pinhole/fringe/hyponome/aperture softs + freeze (replaces thin rise/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via nautilus.wav. Thank-yous chamber / pearl / quiet. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `nautilus-tricks.ts`. True house-nautilus desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids rise/flush/lid/mantle/sucker/jet/veil/tinker/papilla/ooze/drift/gulp/flare/dart/soak/tuck/paddle/gill/amble/plume/legend/fan/flash/latch/puff/unfurl/chart/climb/probe/canyon/crawl/siphon/pulse/slink/den/cork/nest/savor/settle/survey/snatch/band/funnel/tentacle/loom/wave/buoy/bone/pupil/chroma/hover/blot/strike/zebra name collisions with prior guests and nautilus window-play. Bird ultra (Soot→Ember) + Miso→Sepia done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Pulse / moon_jelly ultra done; Ochre / sea_star ultra done; Tenant / hermit_crab ultra done; Ledger / horseshoe_crab ultra done; Amplitudes raised toward Rui richness; denser waits/weights (SPIRAL_HOLD=11.2 RELEASE_S=1.18). Pulse densified. Ochre densified. Tenant densified. Ledger densified. Anchor densified. Kite densified. Next leftover Door / moray. No cry inventing beyond house nautilus.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "nautilus";
const TRICKS = ["spiral", "siphuncle", "nacre", "pinhole", "fringe", "hyponome", "aperture"];
const HAPPY = ["chamber", "pearl", "quiet"];
const HAPPY_DUR = {
    chamber: 1.55,
    pearl: 1.5,
    quiet: 1.42,
};
/** Spiral hold — Chamber rests in the coiled chambers. Not window-play RISE. Not Cup mantle plate. Not Sepia bone. */
const SPIRAL_HOLD = 11.2;
const RELEASE_S = 1.18;
const DUR = {
    spiral: SPIRAL_HOLD + RELEASE_S,
    siphuncle: 1.78,
    nacre: 1.85,
    pinhole: 1.78,
    fringe: 1.92,
    hyponome: 2.05,
    aperture: 2.12,
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
    if (kind === "spiral")
        return 40 + roll * 26;
    if (kind === "hyponome" || kind === "aperture" || kind === "fringe")
        return 12.8 + roll * 9.4;
    if (kind === "siphuncle" || kind === "nacre" || kind === "pinhole")
        return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}
function pickTrick(rand, musicOn = false, lastKind) {
    if (musicOn)
        return "spiral";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) => k === "spiral" ? 0.72 : k === "hyponome" || k === "aperture" || k === "fringe" ? 1.28 : k === "siphuncle" || k === "nacre" || k === "pinhole" ? 1.18 : 1.08);
    let total = 0;
    for (let i = 0; i < weights.length; i++)
        total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return list[i];
    }
    return list[list.length - 1] || "spiral";
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
    return key === TRICK_KEY || key === "chamber";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "chamber";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "chamber" ? "sit" : name === "pearl" ? "talk" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function chamberPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chamber));
    if (u < 0.16) {
        const s = u / 0.16;
        return { lift: s * 3.84, rot: s * 16.8, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
        const coil = Math.sin(t * 2.4);
        return {
            lift: 3.84 + Math.abs(coil) * 2.16,
            rot: 16.8 + coil * 14.4,
            dx: coil * 0.54,
            anim: "sit",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.88 * (1 - s), rot: 9.6 * (1 - s), dx: 0, anim: "idle" };
}
function pearlPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pearl));
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
function quietPose(t) {
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
    if (next.kind === "chamber") {
        const pose = chamberPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "pearl") {
        const pose = pearlPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = quietPose(next.t);
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
    const anim = kind === "spiral"
        ? "sit"
        : kind === "siphuncle"
            ? "walk"
            : kind === "nacre"
                ? "sit"
                : kind === "pinhole"
                    ? "talk"
                    : kind === "fringe"
                        ? "play"
                        : kind === "hyponome"
                            ? "walk"
                            : kind === "aperture"
                                ? "play"
                                : "sit";
    return {
        kind: kind,
        phase: kind === "spiral" ? "hold" : "go",
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
function spiralPose(t) {
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
function siphunclePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.siphuncle));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 4.32, rot: s * 12 * facing, anim: "walk" };
    }
    if (u < 0.72) {
        const s = (u - 0.12) / 0.6;
        const gas = Math.sin(s * Math.PI * 2.6);
        const tube = Math.sin(s * Math.PI * 1.4);
        return {
            x: fromX + facing * tube * 0.66,
            lift: 4.32 + gas * 2.4,
            rot: facing * (12 + gas * 16.8 + tube * 7.2),
            anim: "walk",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX,
        lift: 3.84 * (1 - s),
        rot: facing * (7.2 * (1 - s)),
        anim: "sit",
    };
}
function nacrePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nacre));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 3.36, rot: s * 16.8 * facing, anim: "sit" };
    }
    if (u < 0.7) {
        const s = (u - 0.14) / 0.56;
        const sheen = Math.sin(s * Math.PI * 3.4);
        return {
            x: fromX + facing * sheen * 0.66,
            lift: 3.36 + Math.abs(sheen) * 2.16,
            rot: facing * (16.8 + sheen * 19.2),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
        x: fromX,
        lift: 2.64 * (1 - s),
        rot: facing * (9.6 * (1 - s)),
        anim: "idle",
    };
}
function pinholePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pinhole));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 3.12, rot: s * -24 * facing, anim: "talk" };
    }
    if (u < 0.55) {
        const s = (u - 0.14) / 0.41;
        const w = Math.sin(s * Math.PI * 2.2);
        return {
            x: fromX + facing * w * 0.66,
            lift: 3.12 + Math.abs(w) * 1.92,
            rot: facing * (-24 + w * 28.8),
            anim: "talk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        return {
            x: fromX,
            lift: 3.12 - s * 0.6,
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
function fringePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fringe));
    if (u < 0.1) {
        const s = smoothstep(u / 0.1);
        return { x: fromX, lift: s * 4.08, rot: s * -14.4 * facing, anim: "play" };
    }
    if (u < 0.72) {
        const s = (u - 0.1) / 0.62;
        const wave = Math.sin(s * Math.PI * 4.8);
        const soft = Math.sin(s * Math.PI * 2.2);
        return {
            x: fromX + facing * soft * 1.08,
            lift: 4.08 + Math.abs(wave) * 2.64,
            rot: facing * (-14.4 + wave * 21.6 + soft * 9.6),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX,
        lift: 3.36 * (1 - s),
        rot: facing * (-7.2 * (1 - s)),
        anim: "idle",
    };
}
function hyponomePose(t, fromX, facing) {
    // Hyponome funnel jet — species-true Nautilus pompilius locomotion. Not Cup mantle jet. Not window-play RISE.
    const u = Math.max(0, Math.min(1, t / DUR.hyponome));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX + facing * s * 0.72, lift: s * 2.88, rot: s * 9.6 * facing, anim: "walk" };
    }
    if (u < 0.38) {
        const s = smoothstep((u - 0.12) / 0.26);
        return {
            x: fromX + facing * (0.72 + s * 6.24),
            lift: 2.88 + s * 1.92,
            rot: facing * (9.6 - s * 4.8),
            anim: "play",
        };
    }
    if (u < 0.72) {
        const s = (u - 0.38) / 0.34;
        const pulse = Math.sin(s * Math.PI * 2.8);
        return {
            x: fromX + facing * (6.96 - s * 2.88 + pulse * 0.54),
            lift: 4.8 + Math.abs(pulse) * 2.16,
            rot: facing * (4.8 + pulse * 16.8),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX + facing * (4.08 * (1 - s)),
        lift: 3.36 * (1 - s),
        rot: facing * (4.8 * (1 - s)),
        anim: "idle",
    };
}
function aperturePose(t, fromX, facing) {
    // Soft-body aperture emerge/retract — species-true shell-mouth posture. Not Cup dens. Not Sepia blot.
    const u = Math.max(0, Math.min(1, t / DUR.aperture));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 3.84, rot: s * -16.8 * facing, anim: "play" };
    }
    if (u < 0.45) {
        const s = smoothstep((u - 0.12) / 0.33);
        return {
            x: fromX + facing * s * 1.44,
            lift: 3.84 + s * 1.68,
            rot: facing * (-16.8 + s * 12),
            anim: "play",
        };
    }
    if (u < 0.72) {
        const s = (u - 0.45) / 0.27;
        const quiver = Math.sin(s * Math.PI * 3.6);
        return {
            x: fromX + facing * (1.44 - s * 0.72 + quiver * 0.42),
            lift: 5.52 + Math.abs(quiver) * 1.92,
            rot: facing * (-4.8 + quiver * 19.2),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX + facing * (0.72 * (1 - s)),
        lift: 3.6 * (1 - s),
        rot: facing * (-7.2 * (1 - s)),
        anim: "idle",
    };
}
function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done")
        return trick;
    if (shouldAbort(flags) &&
        trick.kind !== "siphuncle" &&
        trick.kind !== "nacre" &&
        trick.kind !== "fringe" &&
        trick.kind !== "hyponome" &&
        trick.kind !== "aperture") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "spiral") {
        if (next.t < SPIRAL_HOLD) {
            const pose = spiralPose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < SPIRAL_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - SPIRAL_HOLD);
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
    if (next.kind === "siphuncle") {
        const pose = siphunclePose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "nacre") {
        const pose = nacrePose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "pinhole") {
        const pose = pinholePose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "fringe") {
        const pose = fringePose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "hyponome") {
        const pose = hyponomePose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = aperturePose(next.t, fromX, trick.facing);
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
    SPIRAL_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    spiralPose,
    releasePose,
    siphunclePose,
    nacrePose,
    pinholePose,
    fringePose,
    hyponomePose,
    aperturePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    chamberPose,
    pearlPose,
    quietPose,
    stepHappy
  };
  root.PetNautilusTricks = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
