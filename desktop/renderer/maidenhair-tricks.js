/** Vein ground tricks while idle — ultra-polish pass. House maidenhair fern — frond / rachis / fiddle / pinna / saucer / sori / stipe personality (delicate fan fronds, black wiry rachis, soft fiddlehead uncoil as fiddle — never named unfurl (Vein window owns unfurl) / lean (Felt window owns lean) / nod (Sol owns nod), leaflet pinna flutter, mist-loving damp saucer desk life, underside sori dots shimmer (fern spore-cases — never named spore (Felt owns spore) / puff (Puff guest) / lift (Ember)), glossy black stipe flex below the rachis (species-true petiole stalk — never named wire as a guest collision / root (Burr) / rhizoid (Felt)); not Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb/mucus/sentry, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Sori is the species-true fern underside polish (not Felt spore puff). Stipe is the iconic black glossy stalk flex (not rachis wire alone, not Burr root). Window-play UNFURL unchanged — never names unfurl as a trick. Ethogram keeps saucer sit_hold; adds frond/rachis/fiddle/pinna/sori/stipe softs + freeze (replaces thin lean/nod; drops ethogram unfurl scheduling — window-play still owns UNFURL). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via maidenhair.wav. Thank-yous mist / filigree / shade. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `maidenhair-tricks.ts`. True house-fern desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids unfurl/lean/nod/swell/lift/creep/crawl/moss/root/spore/tuft/bead/cushion/thatch/rhizoid/seta/hinge/mucus/sentry/podia/bell/drift/gulp/flare/fan name collisions. Bird ultra (Soot→Ember) + Miso→Felt done; skip Rui + birds. Amplitudes raised toward Rui richness; denser waits/weights (SAUCER_HOLD=11.2 RELEASE_S=1.18). Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house maidenhair.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "maidenhair";
const TRICKS = ["frond", "rachis", "fiddle", "pinna", "saucer", "sori", "stipe"];
const HAPPY = ["mist", "filigree", "shade"];
const HAPPY_DUR = {
    mist: 1.28,
    filigree: 1.16,
    shade: 1.22,
};
/** Saucer hold — Vein parks the damp fern saucer on the blotter. Not window-play UNFURL. */
const SAUCER_HOLD = 11.2;
const RELEASE_S = 1.18;
const DUR = {
    saucer: SAUCER_HOLD + RELEASE_S,
    frond: 1.58,
    rachis: 1.48,
    fiddle: 1.56,
    pinna: 1.64,
    sori: 1.68,
    stipe: 1.72,
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
    if (kind === "saucer")
        return 40 + roll * 26;
    if (kind === "sori" || kind === "stipe")
        return 12.8 + roll * 9.4;
    if (kind === "frond" || kind === "rachis" || kind === "fiddle" || kind === "pinna")
        return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}
function pickTrick(rand, musicOn, lastKind) {
    if (musicOn)
        return "saucer";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) =>
        k === "saucer" ? 0.72 : k === "sori" || k === "stipe" ? 1.28 : k === "frond" || k === "rachis" || k === "fiddle" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "frond";
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
    return key === TRICK_KEY || key === "vein";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "mist";
    return {
        kind: name,
        happy: true,
        phase: "go",
        t: 0,
        x: x,
        lift: 0,
        rot: 0,
        anim: name === "mist" ? "talk" : name === "filigree" ? "play" : "sit",
        facing: facing == null ? 1 : facing,
        fromX: x,
    };
}
function mistPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mist));
    if (u < 0.2) {
        const s = u / 0.2;
        return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
        const vapor = Math.sin(t * 1.72);
        return {
            lift: 3.36 + Math.abs(vapor) * 1.68,
            rot: 14.4 + vapor * 12,
            dx: vapor * 0.144,
            anim: "talk",
        };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "sit" };
}
function filigreePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.filigree));
    if (u < 0.18) {
        const s = u / 0.18;
        return { lift: s * 3.6, rot: s * -12, dx: 0, anim: "play" };
    }
    if (u < 0.78) {
        const lace = Math.sin(t * 2.05);
        return {
            lift: 3.6 + Math.abs(lace) * 1.8,
            rot: -12 + lace * 16.8,
            dx: lace * 0.168,
            anim: "play",
        };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.4 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "idle" };
}
function shadePose(t) {
    return {
        lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
        rot: Math.sin(t * 0.864) * 9.6,
        dx: Math.sin(t * 0.48) * -0.144,
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
    if (next.kind === "mist") {
        const pose = mistPose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else if (next.kind === "filigree") {
        const pose = filigreePose(next.t);
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
    }
    else {
        const pose = shadePose(next.t);
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
    const anim = kind === "saucer"
        ? "sit"
        : kind === "frond"
            ? "sit"
            : kind === "rachis"
                ? "talk"
                : kind === "fiddle"
                    ? "play"
                    : kind === "pinna"
                        ? "talk"
                        : kind === "sori"
                            ? "play"
                            : kind === "stipe"
                                ? "talk"
                                : "sit";
    return {
        kind: kind,
        phase: kind === "saucer" ? "hold" : "go",
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
function saucerPose(t) {
    const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
    return {
        lift: 2.88 + Math.abs(Math.sin(t * 0.504)) * 1.44,
        rot: 4.8 + breath * 7.2,
    };
}
function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    const s = smoothstep(u);
    return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4.8 * (1 - s) };
}
/** Frond — delicate fan frond open. Not parrot fan. Not window-play UNFURL. */
function frondPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.frond));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 3.12, rot: s * -12 * facing, anim: "sit" };
    }
    if (u < 0.78) {
        const s = (u - 0.16) / 0.62;
        const open = Math.sin(s * Math.PI * 1.6);
        return {
            x: fromX + facing * Math.abs(open) * 0.42,
            lift: 3.12 + Math.abs(open) * 1.92,
            rot: facing * (-12 + open * 16.8),
            anim: "sit",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.16 * (1 - s),
        rot: facing * (-7.2 * (1 - s)),
        anim: "sit",
    };
}
/** Rachis — black wiry stem sway. Not Felt rhizoid. */
function rachisPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rachis));
    if (u < 0.18) {
        const s = smoothstep(u / 0.18);
        return { x: fromX, lift: s * 2.88, rot: s * 16.8 * facing, anim: "talk" };
    }
    if (u < 0.55) {
        const s = (u - 0.18) / 0.37;
        const wire = Math.sin(s * Math.PI * 3.4);
        return {
            x: fromX + facing * wire * 0.48,
            lift: 2.88 + Math.abs(wire) * 1.68,
            rot: facing * (16.8 + wire * 14.4),
            anim: "talk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        const settle = smoothstep(s);
        return {
            x: fromX + facing * (1 - settle) * 0.6,
            lift: 3.84 - settle * 1.44,
            rot: facing * (16.8 - settle * 19.2),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX,
        lift: 2.4 * (1 - s),
        rot: facing * (-3.6 * (1 - s)),
        anim: "sit",
    };
}
/** Fiddle — fiddlehead uncoil. Never named unfurl. */
function fiddlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fiddle));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 2.64, rot: s * 9.6 * facing, anim: "play" };
    }
    if (u < 0.42) {
        const s = (u - 0.14) / 0.28;
        const coil = smoothstep(s);
        return {
            x: fromX + facing * coil * 0.96,
            lift: 2.64 + coil * 3.84,
            rot: facing * (9.6 - coil * 16.8),
            anim: "play",
        };
    }
    if (u < 0.72) {
        const s = (u - 0.42) / 0.3;
        const open = Math.sin(s * Math.PI * 0.9);
        return {
            x: fromX + facing * (0.96 + open * 0.54),
            lift: 6.24 - s * 2.16 + Math.abs(open) * 0.72,
            rot: facing * (-7.2 + open * 14.4),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
        x: fromX + facing * 0.96 * (1 - s),
        lift: 2.88 * (1 - s),
        rot: facing * (-4.8 * (1 - s)),
        anim: "sit",
    };
}
/** Pinna — leaflet flutter. Not Felt bead. */
function pinnaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pinna));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 2.64, rot: s * 7.2 * facing, anim: "talk" };
    }
    if (u < 0.7) {
        const s = (u - 0.16) / 0.54;
        const flutter = Math.sin(s * Math.PI * 5.6);
        return {
            x: fromX + facing * (s * 1.44 + flutter * 0.3),
            lift: 2.64 + Math.abs(flutter) * 1.44,
            rot: facing * (7.2 + flutter * 12),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
        x: fromX + facing * 1.44 * (1 - s * 0.24),
        lift: 1.92 * (1 - s),
        rot: facing * (4.8 * (1 - s)),
        anim: "sit",
    };
}
/** Sori — underside spore-case dots shimmer. Not Felt spore. Not Ember lift. */
function soriPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sori));
    if (u < 0.16) {
        const s = smoothstep(u / 0.16);
        return { x: fromX, lift: s * 2.16, rot: s * -9.6 * facing, anim: "play" };
    }
    if (u < 0.55) {
        const s = (u - 0.16) / 0.39;
        const shimmer = Math.sin(s * Math.PI * 4.2);
        return {
            x: fromX + facing * (s * 0.72 + shimmer * 0.24),
            lift: 2.16 + Math.abs(shimmer) * 1.92,
            rot: facing * (-9.6 + shimmer * 16.8),
            anim: "play",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.55) / 0.23;
        const hold = Math.sin(s * Math.PI * 3.4);
        return {
            x: fromX + facing * 0.72,
            lift: 3.36 + Math.abs(hold) * 0.96,
            rot: facing * (4.8 + hold * 12),
            anim: "play",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * 0.72 * (1 - s),
        lift: 2.16 * (1 - s) + s * 0.24,
        rot: facing * (4.8 * (1 - s)),
        anim: "idle",
    };
}
/** Stipe — glossy black stalk flex below rachis. Not Burr root. Not Felt rhizoid. */
function stipePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stipe));
    if (u < 0.14) {
        const s = smoothstep(u / 0.14);
        return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "talk" };
    }
    if (u < 0.4) {
        const s = (u - 0.14) / 0.26;
        const flex = smoothstep(s);
        return {
            x: fromX + facing * flex * 0.6,
            lift: 3.12 + flex * 2.88,
            rot: facing * (12 + flex * 9.6),
            anim: "talk",
        };
    }
    if (u < 0.78) {
        const s = (u - 0.4) / 0.38;
        const sway = Math.sin(s * Math.PI * 3.2);
        return {
            x: fromX + facing * (0.6 + sway * 0.36),
            lift: 5.76 + Math.abs(sway) * 0.96,
            rot: facing * (7.2 + sway * 16.8),
            anim: "talk",
        };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
        x: fromX + facing * 0.6 * (1 - s),
        lift: 3.12 * (1 - s),
        rot: facing * (7.2 * (1 - s)),
        anim: "idle",
    };
}
function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done")
        return trick;
    if (shouldAbort(flags) &&
        trick.kind !== "frond" &&
        trick.kind !== "rachis" &&
        trick.kind !== "fiddle" &&
        trick.kind !== "pinna" &&
        trick.kind !== "sori" &&
        trick.kind !== "stipe") {
        return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "saucer") {
        if (next.t < SAUCER_HOLD) {
            const pose = saucerPose(next.t);
            next.phase = "hold";
            next.lift = pose.lift;
            next.rot = pose.rot;
            next.anim = "sit";
            return next;
        }
        if (next.t < SAUCER_HOLD + RELEASE_S) {
            const pose = releasePose(next.t - SAUCER_HOLD);
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
    if (next.kind === "frond")
        pose = frondPose(next.t, fromX, trick.facing);
    else if (next.kind === "rachis")
        pose = rachisPose(next.t, fromX, trick.facing);
    else if (next.kind === "fiddle")
        pose = fiddlePose(next.t, fromX, trick.facing);
    else if (next.kind === "pinna")
        pose = pinnaPose(next.t, fromX, trick.facing);
    else if (next.kind === "sori")
        pose = soriPose(next.t, fromX, trick.facing);
    else
        pose = stipePose(next.t, fromX, trick.facing);
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
    SAUCER_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    saucerPose,
    releasePose,
    frondPose,
    rachisPose,
    fiddlePose,
    pinnaPose,
    soriPose,
    stipePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    mistPose,
    filigreePose,
    shadePose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMaidenhairTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
