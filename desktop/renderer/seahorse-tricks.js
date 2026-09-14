/** Anchor ground tricks while idle — ultra-polish pass. House lined seahorse — coil / buoy / siphon / swivel / pouch / dorsal / pectoral personality (prehensile-tail coil settle, upright water-column buoy, tubular snout siphon, independent-eye swivel, brood-pouch calm, soft dorsal-fin propulsion waves, pectoral fan steering ticks; not Coin drift/gulp/flare/glint/dart/yawn/forage, Pulse bell/oral/lucent/trail/medusa, Ledger carapace/bookgill/telson/furrow/fossil/pusher/ocular, Tenant swap/antenna/scuttle/withdraw/vacancy/chela/bailer, Ochre podia/righting/crawl/evert/penta/madre/papula, Sepia hover/pupil, Chamber spiral, Cup mantle, Ink soak/tuck, or Clip nest). Dorsal rides the species-true undulating dorsal fin (not Coin dart, not Cup jet, not Pulse trail, not buoy bob alone); pectoral ticks the paired pectoral fins for yaw (not Sepia pupil, not swivel eye alone, not Tenant antenna). Window-play HITCH unchanged — never names `hitch`. Special Hitch unchanged — never names hitch as a trick. Ethogram keeps coil sit_hold; adds buoy/siphon/swivel/pouch/dorsal/pectoral softs + freeze (replaces thin hitch/hover). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via seahorse.wav. Thank-yous coronet / pipe / moor. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `seahorse-tricks.ts`. True house-seahorse desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids hitch/hover/drift/gulp/soak/tuck/gill/amble/nest/cheek/curl/swap/withdraw/vacancy/antenna/scuttle/chela/bailer/podia/righting/crawl/evert/penta/bell/oral/lucent/trail/medusa/mantle/sucker/jet/veil/tinker/spiral/siphuncle/carapace/bookgill/pusher/ocular/plow/molt name collisions with prior guests and seahorse window-play. Bird ultra (Soot→Ember) + Miso→Ledger done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Kite / manta ultra done. Door / moray ultra done. Next guest ultra is Felt / moss. No cry inventing beyond house seahorse.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "seahorse";
const TRICKS = ["coil", "buoy", "siphon", "swivel", "pouch", "dorsal", "pectoral"];
const HAPPY = ["coronet", "pipe", "moor"];
const HAPPY_DUR = {
    coronet: 1.28,
    pipe: 1.18,
    moor: 1.22,
};
/** Coil hold — Anchor grips the desk with a prehensile tail. Not window-play HITCH. Not Ledger carapace. Not Burr curl. Not Ink tuck. */
const COIL_HOLD = 10.8;
const RELEASE_S = 0.62;
const DUR = {
    coil: COIL_HOLD + RELEASE_S,
    buoy: 1.58,
    siphon: 1.72,
    swivel: 1.85,
    pouch: 1.62,
    dorsal: 2.05,
    pectoral: 2.12,
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
    if (kind === "coil")
        return 38 + roll * 24;
    if (kind === "dorsal" || kind === "pectoral" || kind === "swivel")
        return 12 + roll * 9;
    if (kind === "siphon" || kind === "buoy" || kind === "pouch")
        return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}
function pickTrick(rand, musicOn = false, lastKind) {
    if (musicOn)
        return "coil";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) => k === "coil" ? 0.55 : k === "dorsal" || k === "pectoral" || k === "swivel" ? 1.15 : 1);
    let total = 0;
    for (let i = 0; i < weights.length; i++)
        total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return list[i];
    }
    return list[list.length - 1] || "coil";
}
function happyCanStart(state) {
    if (!state)
        return false;
    if (state.asleep || state.hidden || state.leaving)
        return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide")
        return false;
    return true;
}
function happyShouldAbort(state) {
    if (!state)
        return true;
    if (state.asleep || state.hidden || state.leaving)
        return true;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide")
        return true;
    return false;
}
function wantsThankYou(key) {
    return key === TRICK_KEY || key === "anchor";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "coronet";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "coronet" ? "talk" : name === "pipe" ? "play" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function coronetPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.coronet));
    if (u < 0.16) {
        const s = u / 0.16;
        return { lift: s * 3.2, rot: s * 14, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
        const tip = Math.sin(t * 2.1);
        return {
            lift: 3.2 + Math.abs(tip) * 1.8,
            rot: 14 + tip * 16,
            dx: tip * 0.35,
            anim: "talk",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.4 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "idle" };
}
function pipePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pipe));
    if (u < 0.18) {
        const s = u / 0.18;
        return { lift: s * 2.8, rot: s * -18, dx: 0, anim: "play" };
    }
    if (u < 0.8) {
        const draw = Math.sin(t * 1.95);
        return {
            lift: 2.8 + Math.abs(draw) * 1.5,
            rot: -18 + draw * 22,
            dx: draw * 0.4,
            anim: "play",
        };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.2 * (1 - s), rot: -10 * (1 - s), dx: 0, anim: "sit" };
}
function moorPose(t) {
    return {
        lift: Math.abs(Math.sin(t * 2.0)) * 2.2 + 2.4,
        rot: 8 + Math.sin(t * 2.4) * 14,
        dx: Math.sin(t * 1.4) * 0.35,
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
    if (next.kind === "coronet") {
        const pose = coronetPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "pipe") {
        const pose = pipePose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = moorPose(next.t);
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
    const anim = kind === "coil"
        ? "sit"
        : kind === "buoy"
            ? "play"
            : kind === "siphon"
                ? "talk"
                : kind === "swivel"
                    ? "talk"
                    : kind === "pouch"
                        ? "sit"
                        : kind === "dorsal"
                            ? "walk"
                            : kind === "pectoral"
                                ? "talk"
                                : "sit";
    return {
        kind,
        phase: kind === "coil" ? "hold" : "go",
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
function coilPose(t) {
    const beat = Math.sin(t * 1.7) + 0.45 * Math.sin(t * 3.4);
    return {
        lift: 2.4 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
        rot: -18 + Math.sin(t * 2.4) * 16 + beat * 8,
    };
}
function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (2.4 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -18 * (1 - u) };
}
function buoyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.buoy));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 3.4, rot: s * -14 * facing, anim: "play" };
    }
    if (u < 0.78) {
        const s = (u - 0.12) / 0.66;
        const bob = Math.sin(s * Math.PI * 3.6);
        const drift = Math.sin(s * Math.PI * 1.2);
        return {
            x: fromX + facing * (bob * 0.45 + drift * 0.35),
            lift: 3.4 + bob * 1.6,
            rot: facing * (-14 + bob * 18 + drift * 8),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.4 * (1 - s),
        rot: facing * (-8 * (1 - s)),
        anim: "sit",
    };
}
function siphonPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.siphon));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 2.8, rot: s * 18 * facing, anim: "talk" };
    }
    if (u < 0.78) {
        const s = (u - 0.14) / 0.64;
        const draw = Math.sin(s * Math.PI * 4.4);
        return {
            x: fromX + facing * (0.55 + Math.abs(draw) * 0.4),
            lift: 2.8 + Math.abs(draw) * 1.5,
            rot: facing * (18 + draw * 16),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * 0.4 * (1 - s),
        lift: 1.8 * (1 - s),
        rot: facing * (8 * (1 - s)),
        anim: "sit",
    };
}
function swivelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.swivel));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 2.6, rot: s * -16 * facing, anim: "talk" };
    }
    if (u < 0.8) {
        const s = (u - 0.12) / 0.68;
        const eye = Math.sin(s * Math.PI * 5.6);
        const tick = Math.sin(s * Math.PI * 2.1);
        return {
            x: fromX + facing * tick * 0.55,
            lift: 2.6 + Math.abs(eye) * 1.5,
            rot: facing * (-16 + eye * 26 + tick * 10),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
        x: fromX,
        lift: 1.8 * (1 - s),
        rot: facing * (-8 * (1 - s)),
        anim: "sit",
    };
}
function pouchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pouch));
    if (u < 0.18) {
        const s = smoothstep(u / 0.18);
        return { x: fromX, lift: s * 2.4, rot: s * 12 * facing, anim: "sit" };
    }
    if (u < 0.78) {
        const s = (u - 0.18) / 0.6;
        const calm = Math.sin(s * Math.PI * 1.8);
        return {
            x: fromX + facing * calm * 0.45,
            lift: 2.4 + Math.abs(calm) * 1.4,
            rot: facing * (12 + calm * 14),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 1.8 * (1 - s),
        rot: facing * (6 * (1 - s)),
        anim: "idle",
    };
}
function dorsalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dorsal));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 3.2, rot: s * -12 * facing, anim: "walk" };
    }
    if (u < 0.7) {
        const s = (u - 0.12) / 0.58;
        const wave = Math.sin(s * Math.PI * 5.2);
        const surge = Math.sin(s * Math.PI * 1.4);
        return {
            x: fromX + facing * (surge * 1.25 + wave * 0.35),
            lift: 3.2 + Math.abs(wave) * 1.8,
            rot: facing * (-12 + wave * 20 + surge * 10),
            anim: "walk",
        };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
        x: fromX + facing * 1.0 * (1 - s),
        lift: 2.4 * (1 - s),
        rot: facing * (-6 * (1 - s)),
        anim: "idle",
    };
}
function pectoralPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pectoral));
    if (u < 0.12) {
        const s = smoothstep(u / 0.12);
        return { x: fromX, lift: s * 2.6, rot: s * 18 * facing, anim: "talk" };
    }
    if (u < 0.78) {
        const s = (u - 0.12) / 0.66;
        const flap = Math.sin(s * Math.PI * 4.8);
        const yaw = Math.sin(s * Math.PI * 1.6);
        return {
            x: fromX + facing * yaw * 0.7,
            lift: 2.6 + Math.abs(flap) * 1.5,
            rot: facing * (18 + flap * 22 + yaw * 10),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 1.8 * (1 - s),
        rot: facing * (8 * (1 - s)),
        anim: "sit",
    };
}
function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done")
        return trick;
    if (shouldAbort(flags) && trick.kind !== "siphon" && trick.kind !== "swivel" && trick.kind !== "pouch" && trick.kind !== "dorsal" && trick.kind !== "pectoral" && trick.kind !== "buoy") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "coil") {
        if (next.t < COIL_HOLD) {
            const pose = coilPose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < COIL_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - COIL_HOLD);
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
    if (next.kind === "buoy") {
        const pose = buoyPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "siphon") {
        const pose = siphonPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "swivel") {
        const pose = swivelPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "dorsal") {
        const pose = dorsalPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "pectoral") {
        const pose = pectoralPose(next.t, fromX, trick.facing);
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = pouchPose(next.t, fromX, trick.facing);
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
    COIL_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    coilPose,
    releasePose,
    buoyPose,
    siphonPose,
    swivelPose,
    pouchPose,
    dorsalPose,
    pectoralPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    coronetPose,
    pipePose,
    moorPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSeahorseTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
