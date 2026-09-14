/** Felt ground tricks while idle — ultra-polish pass. House sheet moss — tuft / bead / spore / cushion / thatch / rhizoid / seta personality (soft carpet swell as tuft — never named swell (Sol owns swell as thank-you), dew bead, spore puff as spore — never named lift (Ember owns lift) / puff (Puff guest), cushion creep as cushion — never named creep (Still window owns creep) / crawl (Cling owns crawl) / moss (Sash owns moss), quiet green thatch desk life on the blotter felt, rhizoid grip anchoring into the blotter (bryophyte holdfast filaments — never named root (Burr) / holdfast (ethogram) / cling), seta sporophyte stalk stretch + capsule nod (never named peristome/operculum — other guests; never named lift); not Door hinge/pharynx/knot/lurk/jamb/mucus/sentry, Kite wing/lobe/gyre/vault/span/breach/ram, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Ochre/Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, or snake guests Sash seam/moss/lap copies). Rhizoid is the species-true sheet-moss anchor polish (not Burr root, not Cling crawl, not Door knot). Seta is the iconic sporophyte stalk stretch (not Ember lift, not spore puff alone, not window-play LEAN). Window-play LEAN unchanged — never names lean. Never names carpet as a trick. Ethogram keeps thatch sit_hold; adds tuft/bead/spore/cushion/rhizoid/seta softs + freeze (replaces thin lean/nod/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via moss.wav. Thank-yous humid / velvet / meadow. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `moss-tricks.ts`. True house-moss desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids lean/swell/lift/creep/crawl/moss/root/holdfast/peristome/operculum/hinge/mucus/sentry/podia/bell/drift/gulp/flare name collisions. Bird ultra (Soot→Ember) + Miso→Door done; skip Rui + birds. Next guest ultra is Vein / maidenhair. No cry inventing beyond house moss.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "moss";
const TRICKS = ["tuft", "bead", "spore", "cushion", "thatch", "rhizoid", "seta"];
const HAPPY = ["humid", "velvet", "meadow"];
const HAPPY_DUR = {
    humid: 1.28,
    velvet: 1.16,
    meadow: 1.22,
};
/** Thatch hold — Felt parks the soft green carpet on the blotter. Not window-play LEAN. */
const THATCH_HOLD = 10.8;
const RELEASE_S = 0.62;
const DUR = {
    thatch: THATCH_HOLD + RELEASE_S,
    tuft: 1.58,
    bead: 1.48,
    spore: 1.56,
    cushion: 1.64,
    rhizoid: 1.68,
    seta: 1.72,
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
    if (kind === "thatch")
        return 38 + roll * 24;
    if (kind === "cushion" || kind === "rhizoid" || kind === "seta")
        return 12 + roll * 9;
    if (kind === "tuft" || kind === "bead" || kind === "spore")
        return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}
function pickTrick(rand, musicOn, lastKind) {
    if (musicOn)
        return "thatch";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "thatch") {
        if (roll < 0.18)
            return "tuft";
        if (roll < 0.34)
            return "bead";
        if (roll < 0.5)
            return "spore";
        if (roll < 0.66)
            return "cushion";
        if (roll < 0.83)
            return "rhizoid";
        return "seta";
    }
    if (lastKind === "tuft") {
        if (roll < 0.2)
            return "thatch";
        if (roll < 0.36)
            return "bead";
        if (roll < 0.52)
            return "spore";
        if (roll < 0.68)
            return "cushion";
        if (roll < 0.84)
            return "rhizoid";
        return "seta";
    }
    if (lastKind === "bead") {
        if (roll < 0.18)
            return "thatch";
        if (roll < 0.34)
            return "tuft";
        if (roll < 0.5)
            return "spore";
        if (roll < 0.66)
            return "cushion";
        if (roll < 0.83)
            return "rhizoid";
        return "seta";
    }
    if (lastKind === "rhizoid" || lastKind === "seta") {
        if (roll < 0.16)
            return "thatch";
        if (roll < 0.32)
            return "tuft";
        if (roll < 0.48)
            return "bead";
        if (roll < 0.64)
            return "spore";
        if (roll < 0.8)
            return "cushion";
        return lastKind === "rhizoid" ? "seta" : "rhizoid";
    }
    if (roll < 0.14)
        return "thatch";
    if (roll < 0.28)
        return "tuft";
    if (roll < 0.42)
        return "bead";
    if (roll < 0.56)
        return "spore";
    if (roll < 0.7)
        return "cushion";
    if (roll < 0.85)
        return "rhizoid";
    return "seta";
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
    return key === TRICK_KEY || key === "felt";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "humid";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "humid" ? "talk" : name === "velvet" ? "play" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function humidPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.humid));
    if (u < 0.22) {
        const s = u / 0.22;
        return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
        const bead = Math.sin(t * 1.55);
        return {
            lift: 2.8 + Math.abs(bead) * 1.4,
            rot: 12 + bead * 10,
            dx: bead * 0.08,
            anim: "talk",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" };
}
function velvetPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.velvet));
    if (u < 0.2) {
        const s = u / 0.2;
        return { lift: s * 3.0, rot: s * -10, dx: 0, anim: "play" };
    }
    if (u < 0.76) {
        const nap = Math.sin(t * 1.7);
        return {
            lift: 3.0 + Math.abs(nap) * 1.5,
            rot: -10 + nap * 14,
            dx: nap * 0.1,
            anim: "play",
        };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 2.0 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "idle" };
}
function meadowPose(t) {
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
    if (next.kind === "humid") {
        const pose = humidPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "velvet") {
        const pose = velvetPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = meadowPose(next.t);
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
    const anim = kind === "thatch"
        ? "sit"
        : kind === "tuft"
            ? "sit"
            : kind === "bead"
                ? "talk"
                : kind === "spore"
                    ? "play"
                    : kind === "cushion"
                        ? "sit"
                        : kind === "rhizoid"
                            ? "sit"
                            : kind === "seta"
                                ? "play"
                                : "sit";
    return {
        kind: kind,
        phase: kind === "thatch" ? "hold" : "go",
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
function thatchPose(t) {
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
/** Tuft — soft carpet swell / gametophore tip rise. Not Sol swell thank-you. */
function tuftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tuft));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "sit" };
    }
    if (u < 0.78) {
        const s = (u - 0.16) / 0.62;
        const swell = Math.sin(s * Math.PI * 2.4);
        return {
            x: fromX + facing * Math.abs(swell) * 0.35,
            lift: 2.6 + Math.abs(swell) * 1.6,
            rot: facing * (10 + swell * 12),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 1.8 * (1 - s),
        rot: facing * (6 * (1 - s)),
        anim: "sit",
    };
}
/** Bead — dew bead roll across the phyllid tip. Not Coin flare. */
function beadPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bead));
    if (u < 0.18) {
        const s = smoothstep(u / 0.18);
        return { x: fromX, lift: s * 2.4, rot: s * 14 * facing, anim: "talk" };
    }
    if (u < 0.55) {
        const s = (u - 0.18) / 0.37;
        const drop = smoothstep(s);
        return {
            x: fromX + facing * drop * 1.4,
            lift: 2.4 + drop * 1.8,
            rot: facing * (14 - drop * 18),
            anim: "talk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        const roll = Math.sin(s * Math.PI);
        return {
            x: fromX + facing * (1.4 + s * 0.6),
            lift: 4.0 - s * 1.4 + roll * 0.5,
            rot: facing * (-4 + roll * 8),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * 1.8 * (1 - s),
        lift: 2.0 * (1 - s),
        rot: facing * (-3 * (1 - s)),
        anim: "sit",
    };
}
/** Spore — capsule puff / spore release loft. Not Ember lift. Not Puff guest. */
function sporePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spore));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 2.2, rot: s * -6 * facing, anim: "play" };
    }
    if (u < 0.42) {
        const s = (u - 0.14) / 0.28;
        const loft = smoothstep(s);
        return {
            x: fromX + facing * loft * 0.8,
            lift: 2.2 + loft * 3.2,
            rot: facing * (-6 + loft * 14),
            anim: "play",
        };
    }
    if (u < 0.72) {
        const s = (u - 0.42) / 0.3;
        const drift = Math.sin(s * Math.PI * 2.6);
        return {
            x: fromX + facing * (0.8 + drift * 0.45),
            lift: 5.2 - s * 1.8 + Math.abs(drift) * 0.6,
            rot: facing * (8 + drift * 12),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX + facing * 0.8 * (1 - s),
        lift: 2.4 * (1 - s),
        rot: facing * (6 * (1 - s)),
        anim: "sit",
    };
}
/** Cushion — mat creep across the blotter. Not Still creep. Not Cling crawl. */
function cushionPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cushion));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 2.2, rot: s * 6 * facing, anim: "sit" };
    }
    if (u < 0.7) {
        const s = (u - 0.16) / 0.54;
        const pulse = Math.sin(s * Math.PI * 3.2);
        return {
            x: fromX + facing * (s * 2.4 + pulse * 0.25),
            lift: 2.2 + Math.abs(pulse) * 1.2,
            rot: facing * (6 + pulse * 10),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
        x: fromX + facing * 2.4 * (1 - s * 0.2),
        lift: 1.6 * (1 - s),
        rot: facing * (4 * (1 - s)),
        anim: "sit",
    };
}
/** Rhizoid — filament grip into the blotter. Not Burr root. Not Cling crawl. Not holdfast ethogram. */
function rhizoidPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rhizoid));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 1.8, rot: s * 8 * facing, anim: "sit" };
    }
    if (u < 0.55) {
        const s = (u - 0.16) / 0.39;
        const dig = Math.sin(s * Math.PI * 2.8);
        return {
            x: fromX + facing * (s * 0.6 + dig * 0.2),
            lift: 1.8 - s * 0.9 + Math.abs(dig) * 0.5,
            rot: facing * (8 + dig * 14),
            anim: "sit",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        const hold = Math.sin(s * Math.PI * 3.4);
        return {
            x: fromX + facing * 0.6,
            lift: 0.9 + Math.abs(hold) * 0.45,
            rot: facing * (6 + hold * 8),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * 0.6 * (1 - s),
        lift: 0.9 * (1 - s) + s * 0.2,
        rot: facing * (4 * (1 - s)),
        anim: "idle",
    };
}
/** Seta — sporophyte stalk stretch + capsule nod. Not Ember lift. Not spore puff alone. */
function setaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.seta));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 2.6, rot: s * -8 * facing, anim: "play" };
    }
    if (u < 0.4) {
        const s = (u - 0.14) / 0.26;
        const rise = smoothstep(s);
        return {
            x: fromX + facing * rise * 0.5,
            lift: 2.6 + rise * 2.8,
            rot: facing * (-8 + rise * 10),
            anim: "play",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.4) / 0.38;
        const nod = Math.sin(s * Math.PI * 3.2);
        return {
            x: fromX + facing * (0.5 + nod * 0.3),
            lift: 5.2 + Math.abs(nod) * 0.8,
            rot: facing * (4 + nod * 16),
            anim: "play",
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
        trick.kind !== "tuft" &&
        trick.kind !== "bead" &&
        trick.kind !== "spore" &&
        trick.kind !== "cushion" &&
        trick.kind !== "rhizoid" &&
        trick.kind !== "seta") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "thatch") {
        if (next.t < THATCH_HOLD) {
            const pose = thatchPose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < THATCH_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - THATCH_HOLD);
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
    if (next.kind === "tuft")
        pose = tuftPose(next.t, fromX, trick.facing);
    else if (next.kind === "bead")
        pose = beadPose(next.t, fromX, trick.facing);
    else if (next.kind === "spore")
        pose = sporePose(next.t, fromX, trick.facing);
    else if (next.kind === "cushion")
        pose = cushionPose(next.t, fromX, trick.facing);
    else if (next.kind === "rhizoid")
        pose = rhizoidPose(next.t, fromX, trick.facing);
    else
        pose = setaPose(next.t, fromX, trick.facing);
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
    THATCH_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    thatchPose,
    releasePose,
    tuftPose,
    beadPose,
    sporePose,
    cushionPose,
    rhizoidPose,
    setaPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    humidPose,
    velvetPose,
    meadowPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMossTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
