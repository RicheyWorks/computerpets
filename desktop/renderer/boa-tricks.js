/** Lula ground tricks while idle — ultra-polish pass. House boa constrictor — pour / heft / oxbow / slack / bank / anchor / meander personality (pour/weight blotter-river desk life). Pour rests a river of muscle across the blotter; heft presses mass into the desk; oxbow bends a slow river loop; slack loosens a long body wave; bank claims the blotter edge; anchor plants heavy constrictor sit-mass (not hold ethogram act, not Nori orb, not coil); meander walks a slow river bend across the blotter (not Lula window-play loop, not Sash creek, not oxbow). Window-play LOOP unchanged — never names `loop`. Ethogram keeps tongue + hold; adds pour/heft/oxbow/anchor/meander softs + freeze. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough/liana/arbor and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore/quiver/upright and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap/ribbon/creek and copy/brief/visa; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone. Guest slug Lula / key boa — accept "boa" and "lula". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via boa.wav. Thank-yous harbor / cradle / stay. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `boa-tricks.ts`. True house-boa-constrictor desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids loop/patrol/stripe/hood/feign/shovel/gape/encore/quiver/upright/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/loom/weave/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/blotter/pencil/clause/spice/cord/audit/verdict/plumb/raid/tribute/docket/seal/band/drawer/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/liana/arbor/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/ribbon/creek/root/flare/dig/perch/hang/clasp/scent/stone/heave/lug/earth/bed/squeeze/delta name collisions. Bird ultra (Soot→Ember) + Miso→Sash done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Amplitudes raised toward Rui richness; denser waits/weights (POUR_HOLD=11.2 RELEASE_S=1.18). Coral densified. Blush densified. Atlas densified. Cup densified. Sepia densified. Chamber densified. Pulse densified. Ochre densified. Tenant densified. Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house boa.wav prefer. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "boa";
  const TRICKS = ["pour", "heft", "oxbow", "slack", "bank", "anchor", "meander"];
  const HAPPY = ["harbor", "cradle", "stay"];
  const HAPPY_DUR = {
      harbor: 1.55,
      cradle: 1.6,
      stay: 1.58,
  };
  /** Pour hold — Lula pours a river of muscle across the blotter. Not window-play LOOP. Not Nori orb. */
  const POUR_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      pour: POUR_HOLD + RELEASE_S,
      heft: 1.86,
      oxbow: 1.98,
      slack: 1.72,
      bank: 1.88,
      anchor: 2.05,
      meander: 2.12,
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
      if (kind === "pour")
          return 40 + roll * 26;
      if (kind === "anchor")
          return 12.8 + roll * 9.4;
      if (kind === "oxbow" || kind === "meander")
          return 12.8 + roll * 9.4;
      if (kind === "heft" || kind === "bank")
          return 11.6 + roll * 8.5;
      if (kind === "slack")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn = false, lastKind) {
      if (musicOn)
          return "pour";
      const roll = rand == null ? Math.random() : rand;
      const pool = TRICKS.filter((k) => k !== lastKind);
      const list = pool.length ? pool : [...TRICKS];
      const weights = list.map((k) => k === "pour" ? 0.72 : k === "anchor" || k === "meander" || k === "oxbow" ? 1.28 : k === "heft" || k === "bank" ? 1.18 : 1.08);
      let total = 0;
      for (let i = 0; i < weights.length; i++)
          total += weights[i];
      let r = roll * total;
      for (let i = 0; i < list.length; i++) {
          r -= weights[i];
          if (r <= 0)
              return list[i];
      }
      return list[list.length - 1] || "pour";
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
      return key === TRICK_KEY || key === "lula";
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
      const name = HAPPY.includes(kind) ? kind : "harbor";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x,
          lift: 0,
          rot: 0,
          anim: name === "harbor" ? "sit" : name === "cradle" ? "sit" : "talk",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function harborPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.harbor));
      if (u < 0.14) {
          const s = u / 0.14;
          return { lift: s * 5.04, rot: s * -19.2, dx: 0, anim: "sit" };
      }
      if (u < 0.8) {
          return {
              lift: 5.04 + Math.abs(Math.sin(t * 4.6)) * 4.08,
              rot: -19.2 + Math.sin(t * 3.4) * 16.8,
              dx: Math.sin(t * 1.8) * 0.66,
              anim: "sit",
          };
      }
      const s = (u - 0.8) / 0.2;
      return { lift: 5.04 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "idle" };
  }
  function cradlePose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cradle));
      if (u < 0.12) {
          const s = u / 0.12;
          return { lift: s * 5.52, rot: s * 21.6, dx: 0, anim: "sit" };
      }
      if (u < 0.78) {
          const rock = Math.sin(t * 3.2);
          return {
              lift: 5.52 + Math.abs(rock) * 3.84,
              rot: 21.6 + rock * 19.2,
              dx: rock * 0.84,
              anim: "sit",
          };
      }
      const s = (u - 0.78) / 0.22;
      return { lift: 5.52 * (1 - s), rot: 21.6 * (1 - s), dx: 0, anim: "sit" };
  }
  function stayPose(t) {
      return {
          lift: Math.abs(Math.sin(t * 3.4)) * 4.56 + 2.4,
          rot: -19.2 + Math.sin(t * 2.8) * 16.8,
          dx: Math.sin(t * 1.9) * 0.78,
          anim: "talk",
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
      if (next.kind === "harbor") {
          const pose = harborPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "cradle") {
          const pose = cradlePose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = stayPose(next.t);
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
      const anim = kind === "pour"
          ? "sit"
          : kind === "heft"
              ? "sit"
              : kind === "oxbow"
                  ? "walk"
                  : kind === "slack"
                      ? "talk"
                      : kind === "bank"
                          ? "sit"
                          : kind === "anchor"
                              ? "sit"
                              : kind === "meander"
                                  ? "walk"
                                  : "sit";
      return {
          kind,
          phase: kind === "pour" ? "hold" : "go",
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
  function pourPose(t) {
      return {
          lift: 2.88 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
          rot: -26.4 + Math.sin(t * 2.4) * 21.6 + Math.sin(t * 4.6) * 12,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: (2.88 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -26.4 * (1 - u) };
  }
  function heftPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.heft));
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 5.76, rot: s * 19.2 * facing, anim: "sit" };
      }
      if (u < 0.55) {
          const s = (u - 0.14) / 0.41;
          return {
              x: fromX + facing * s * 1.44,
              lift: 5.76 - smoothstep(s) * 4.32,
              rot: facing * (19.2 - s * 33.6),
              anim: "sit",
          };
      }
      if (u < 0.82) {
          const s = (u - 0.55) / 0.27;
          const press = Math.abs(Math.sin(s * Math.PI * 2.2));
          return {
              x: fromX + facing * 1.44,
              lift: 1.2 + press * 1.68,
              rot: facing * (-16.8 + press * 9.6),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.82) / 0.18);
      return {
          x: fromX + facing * (1.44 * (1 - s)),
          lift: 1.44 * (1 - s),
          rot: facing * -4 * (1 - s),
          anim: "idle",
      };
  }
  function oxbowPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.oxbow));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 2.88, lift: s * 3.36, rot: s * 21.6 * facing, anim: "walk" };
      }
      if (u < 0.48) {
          const s = (u - 0.12) / 0.36;
          return {
              x: fromX + facing * (2.88 + smoothstep(s) * 8.64),
              lift: 3.36 + Math.sin(s * Math.PI) * 3.12,
              rot: facing * (21.6 + Math.sin(s * Math.PI) * 26.4),
              anim: "walk",
          };
      }
      if (u < 0.78) {
          const s = (u - 0.48) / 0.3;
          return {
              x: fromX + facing * (11.52 - smoothstep(s) * 5.04),
              lift: 3.84 + Math.abs(Math.sin(s * Math.PI * 1.8)) * 2.4,
              rot: facing * (33.6 - s * 40.8),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * (6.48 * (1 - s)),
          lift: 3.12 * (1 - s),
          rot: facing * (-4.8 * (1 - s)),
          anim: "sit",
      };
  }
  function slackPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.slack));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 6.24, rot: s * 33.6 * facing, anim: "talk" };
      }
      if (u < 0.78) {
          const s = (u - 0.12) / 0.66;
          const ease = Math.sin(s * Math.PI * 2.4);
          return {
              x: fromX + facing * ease * 1.08,
              lift: 6.24 - s * 1.68 + Math.abs(ease) * 2.64,
              rot: facing * (33.6 - s * 40.8 + ease * 14.4),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 3.84 * (1 - s),
          rot: facing * (-4.8 * (1 - s)),
          anim: "sit",
      };
  }
  function bankPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.bank));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 3.84, lift: s * 3.12, rot: -s * 16.8 * facing, anim: "sit" };
      }
      if (u < 0.78) {
          const s = (u - 0.12) / 0.66;
          const nudge = Math.sin(s * Math.PI * 2.0);
          return {
              x: fromX + facing * (3.84 + nudge * 1.32),
              lift: 2.88 + Math.abs(nudge) * 2.4,
              rot: facing * (-16.8 + nudge * 14.4),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * (3.84 * (1 - s)),
          lift: 2.88 * (1 - s),
          rot: facing * (-4.8 * (1 - s)),
          anim: "idle",
      };
  }
  /** Anchor — heavy constrictor sit-mass planted on the blotter. Not hold ethogram. Not coil. */
  function anchorPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.anchor));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 4.08, rot: s * -12 * facing, anim: "sit" };
      }
      if (u < 0.42) {
          const s = (u - 0.12) / 0.3;
          return {
              x: fromX + facing * smoothstep(s) * 0.72,
              lift: 4.08 - smoothstep(s) * 2.64,
              rot: facing * (-12 + s * 7.2),
              anim: "sit",
          };
      }
      if (u < 0.82) {
          const s = (u - 0.42) / 0.4;
          const settle = Math.abs(Math.sin(s * Math.PI * 1.6));
          return {
              x: fromX + facing * 0.72,
              lift: 1.2 + settle * 2.16,
              rot: facing * (-9.6 + settle * 16.8),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.82) / 0.18);
      return {
          x: fromX + facing * (0.72 * (1 - s)),
          lift: 1.44 * (1 - s),
          rot: facing * (-4.8 * (1 - s)),
          anim: "idle",
      };
  }
  /** Meander — slow river bend across the blotter. Not window-play loop. Not Sash creek. */
  function meanderPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.meander));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 2.16, lift: s * 3.84, rot: s * 16.8 * facing, anim: "walk" };
      }
      if (u < 0.78) {
          const s = (u - 0.12) / 0.66;
          const bend = Math.sin(s * Math.PI * 2.4);
          return {
              x: fromX + facing * (2.16 + s * 7.68 + bend * 2.64),
              lift: 3.84 + Math.abs(bend) * 3.36,
              rot: facing * (16.8 + bend * 31.2),
              anim: "walk",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * ((2.16 + 7.68) * (1 - s)),
          lift: 3.84 * (1 - s),
          rot: facing * (7.2 * (1 - s)),
          anim: "sit",
      };
  }
  function stepTrick(trick, dt, flags) {
      if (!trick || trick.phase === "done")
          return trick;
      if (shouldAbort(flags) && trick.kind !== "oxbow" && trick.kind !== "bank" && trick.kind !== "meander") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "pour") {
          if (next.t < POUR_HOLD) {
              const pose = pourPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < POUR_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - POUR_HOLD);
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
      if (next.kind === "heft") {
          const pose = heftPose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "oxbow") {
          const pose = oxbowPose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "slack") {
          const pose = slackPose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "bank") {
          const pose = bankPose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "anchor") {
          const pose = anchorPose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = meanderPose(next.t, from, trick.facing);
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
    POUR_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    pourPose,
    releasePose,
    heftPose,
    oxbowPose,
    slackPose,
    bankPose,
    anchorPose,
    meanderPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    harborPose,
    cradlePose,
    stayPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBoaTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : /** @type {any} */ (this));
