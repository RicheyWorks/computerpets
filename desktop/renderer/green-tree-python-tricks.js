/** Jade ground tricks while idle — ultra-polish pass. House green tree python — bracelet / sway / jewel / heat / bough / liana / arbor personality (arboreal lamp-arm jewelry; vine-and-canopy desk life above the work). Bracelet folded living jewelry on a desk branch; sway lamp-arm rock without coming down; jewel still emerald display; heat lean toward bulb warmth; bough claim a desk branch high then ease home; liana vine reach across the blotter; arbor high canopy perch survey on the lamp arm. Window-play SADDLE unchanged — never names `saddle`. Ethogram retires thin lone `drape` (bracelet covers sit_hold). Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Sash owns moss; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press; Lula window-play owns loop; Echo window-play owns perch. Guest slug Jade / key green_tree_python — accept "green_tree_python" and "jade". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via green_tree_python.wav. Thank-yous pendant / treaty / emerald. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `green-tree-python-tricks.js`. True house-green-tree-python desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids saddle/drape/inspect/write/orb/nook/taste/inch/unroll/loom/weave/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/blotter/pencil/clause/spice/cord/stripe/audit/verdict/plumb/raid/tribute/docket/seal/band/drawer/loop/perch/hang/clasp/moss/preen/canopy/gleam name collisions. Bird ultra (Soot→Ember) + Miso→Bandit done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Amplitudes raised toward Rui richness; denser waits/weights (BRACELET_HOLD=11.2 RELEASE_S=1.18). Bluff densified. Sash densified. Lula densified. Coral densified. Blush densified. Atlas densified. Cup densified. Sepia densified. Chamber densified. Pulse densified. Ochre densified. Tenant densified. Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house green_tree_python.wav prefer. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "green_tree_python";
  const TRICKS = ["bracelet", "sway", "jewel", "heat", "bough", "liana", "arbor"];
  const HAPPY = ["pendant", "treaty", "emerald"];

  const HAPPY_DUR = {
    pendant: 1.58,
    treaty: 1.66,
    emerald: 1.72,
  };

  /** Bracelet hold — Jade folds into living jewelry on a desk branch. Not window-play SADDLE. Not Nori orb. */
  const BRACELET_HOLD = 11.2;
  const RELEASE_S = 1.18;

  const DUR = {
    bracelet: BRACELET_HOLD + RELEASE_S,
    sway: 2.18,
    jewel: 2.12,
    heat: 2.05,
    bough: 2.18,
    liana: 2.28,
    arbor: 2.34,
  };

  function canStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function shouldAbort(state) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return true;
    const cmd = String(state.cmd || "");
    return (
      cmd === "sleep" ||
      cmd === "leave" ||
      cmd === "hide" ||
      cmd === "rest" ||
      cmd === "seek" ||
      cmd === "eat" ||
      cmd === "play" ||
      cmd === "talk" ||
      cmd === "enter"
    );
  }

  function nextTrickWait(justFinished, rand, kind) {
    const roll = rand == null ? Math.random() : rand;
    if (kind === "bracelet") return 40 + roll * 26;
    if (kind === "jewel" || kind === "arbor" || kind === "heat") return 12.8 + roll * 9.4;
    if (kind === "sway" || kind === "bough" || kind === "liana") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn = false, lastKind){
    if (musicOn) return "bracelet";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) =>
      k === "bracelet" ? 0.72 : k === "jewel" || k === "arbor" || k === "heat" ? 1.28 : k === "sway" || k === "bough" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "bracelet";
  }

  function happyCanStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function happyShouldAbort(state) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving) return true;
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
    return key === TRICK_KEY || key === "jade";
  }

  function startThankYou(key, lastKind, x, facing, flags,
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand){
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] ?? list[0];
  }

  function beginHappy(kind, x, facing = 1){
    const name = HAPPY.includes(kind) ? kind : "pendant";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "pendant" ? "sit" : name === "treaty" ? "talk" : "sit",
      facing,
      fromX: x,
    };
  }

  function pendantPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pendant));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 5.04, rot: s * -19.2, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      return {
        lift: 5.04 + Math.abs(Math.sin(t * 4.6)) * 4.08,
        rot: -19.2 + Math.sin(t * 3.4) * 16.8,
        dx: Math.sin(t * 2.1) * 1.32,
        anim: "sit",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 5.04 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "idle" };
  }

  function treatyPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.treaty));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 5.52, rot: s * 21.6, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
      const tick = Math.sin(t * 6.4);
      return {
        lift: 5.52 + Math.abs(tick) * 3.84,
        rot: 21.6 + tick * 26.4,
        dx: tick * 1.44,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 5.52 * (1 - s), rot: 21.6 * (1 - s), dx: 0, anim: "sit" };
  }

  function emeraldPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 2.2)) * 4.32 + 2.4,
      rot: -14.4 + Math.sin(t * 1.9) * 19.2,
      dx: Math.sin(t * 1.55) * 1.56,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags){
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "pendant") {
      const pose = pendantPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "treaty") {
      const pose = treatyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = emeraldPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  /** Jade has no Rui-style sleep-frame hold. */
  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing = 1){
    const anim =
      kind === "bracelet"
        ? "sit"
        : kind === "jewel" || kind === "arbor"
          ? "sit"
          : kind === "heat"
            ? "talk"
            : kind === "sway" || kind === "bough" || kind === "liana"
              ? "play"
              : "sit";
    return {
      kind,
      phase: kind === "bracelet" ? "hold" : "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim,
      facing,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  /** Bracelet — folded arboreal jewelry on a desk branch. Soft rock. Not window-play SADDLE. Not Nori orb. */
  function braceletPose(t) {
    return {
      lift: 2.64 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
      rot: -21.6 + Math.sin(t * 2.4) * 26.4 + Math.sin(t * 4.6) * 14.4,
    };
  }

  /** Soft unfold out of the bracelet; stays above the blotter. Not window-play leave. */
  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (2.64 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -21.6 * (1 - u) };
  }

  /** Sway — lamp-arm rock without coming down. Not Saffron scribble. Not Bandit stripe. */
  function swayPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sway));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 5.76, rot: s * -24 * facing, anim: "play" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const rock = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * rock * 4.56,
        lift: 5.76 + Math.abs(rock) * 6.48,
        rot: facing * (-24 + rock * 38.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 5.76 * (1 - s),
      rot: facing * -12 * (1 - s),
      anim: "sit",
    };
  }

  /** Jewel — still emerald display above the work. Not Bandit verdict. Not Nori orb. */
  function jewelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.jewel));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 5.52, rot: s * -21.6 * facing, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.14) / 0.68;
      return {
        x: fromX + facing * Math.sin(s * Math.PI * 1.4) * 1.92,
        lift: 5.52 + Math.sin(s * Math.PI * 2.2) * 3.84,
        rot: facing * (-21.6 + Math.sin(s * Math.PI * 1.8) * 19.2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 5.52 * (1 - s),
      rot: facing * -9.6 * (1 - s),
      anim: "sit",
    };
  }

  /** Heat — lean toward bulb warmth without leaving height. Not Nori taste. Not Sol sun. */
  function heatPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.heat));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 1.68, lift: s * 5.52, rot: s * 21.6 * facing, anim: "talk" };
    }
    if (u < 0.84) {
      const s = (u - 0.12) / 0.72;
      const lean = Math.sin(s * Math.PI * 2.6);
      return {
        x: fromX + facing * (1.68 + lean * 3.84),
        lift: 5.52 + Math.abs(Math.sin(s * Math.PI * 3.2)) * 5.04,
        rot: facing * (21.6 + lean * 33.6),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * (1.68 * (1 - s)),
      lift: 5.52 * (1 - s),
      rot: facing * 10.8 * (1 - s),
      anim: "sit",
    };
  }

  /** Bough — claim a desk branch, settle high, then ease home. Arboreal, not terrestrial raid. */
  function boughPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bough));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 6, rot: -s * 21.6 * facing, anim: "play" };
    }
    if (u < 0.46) {
      const s = (u - 0.1) / 0.36;
      return {
        x: fromX + facing * smoothstep(s) * 11.4,
        lift: 6 + Math.sin(s * Math.PI) * 5.76,
        rot: facing * (-21.6 + s * 38.4),
        anim: "play",
      };
    }
    if (u < 0.8) {
      const s = (u - 0.46) / 0.34;
      const home = smoothstep(s);
      return {
        x: fromX + facing * (11.4 * (1 - home)),
        lift: 6 * (1 - home * 0.45) + Math.sin(s * Math.PI) * 2.64,
        rot: facing * (16.8 - home * 26.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 6 * 0.55 * (1 - s),
      rot: facing * -7.2 * (1 - s),
      anim: "sit",
    };
  }

  /** Liana — vine reach across the blotter. Not Lula loop. Not Bandit raid. Not Sash moss. Ethogram liana_soft. */
  function lianaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.liana));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 4.56, rot: s * 19.2 * facing, anim: "play" };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const vine = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * (smoothstep(s) * 13.8 + vine * 2.64),
        lift: 4.56 + Math.abs(vine) * 6.96,
        rot: facing * (19.2 + vine * 33.6),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * (13.8 * (1 - s)),
      lift: 4.56 * (1 - s),
      rot: facing * 9.6 * (1 - s),
      anim: "sit",
    };
  }

  /** Arbor — high canopy perch survey on the lamp arm. Not Echo perch. Not window-play SADDLE. Ethogram arbor_soft. */
  function arborPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.arbor));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 6.24, rot: s * -16.8 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.12) / 0.74;
      const survey = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * survey * 3.12,
        lift: 6.24 + Math.abs(survey) * 5.28,
        rot: facing * (-16.8 + survey * 28.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 6.24 * (1 - s),
      rot: facing * -8.4 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags){
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "sway" && trick.kind !== "bough" && trick.kind !== "liana") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "bracelet") {
      if (next.t < BRACELET_HOLD) {
        const pose = braceletPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BRACELET_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BRACELET_HOLD);
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
    if (next.kind === "sway") {
      const pose = swayPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "jewel") {
      const pose = jewelPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "heat") {
      const pose = heatPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bough") {
      const pose = boughPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "liana") {
      const pose = lianaPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = arborPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) {
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    DUR,
    BRACELET_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    braceletPose,
    releasePose,
    swayPose,
    jewelPose,
    heatPose,
    boughPose,
    lianaPose,
    arborPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    pendantPose,
    treatyPose,
    emeraldPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGreenTreePythonTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : /** @type {any} */ (this));
