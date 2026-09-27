/** Coral ground tricks while idle — ultra-polish pass. House Pueblo milk snake — rhyme / rumor / costume / frank / tile / cipher / verse personality (tricolor mimic stamp-box desk life; witty false-warning costume, not venom). Rhyme stacks the red/black/pale mnemonic flag; rumor softens a desk whisper; costume adjusts the false-warning coat; frank presses a cancellation stamp; tile places three stamp tiles; cipher ducks into a cryptic blotter fold (secretive milk-snake cover life — not hide/tuck/Nori nook); verse beats the red-black-pale teaching verse (not Bandit stripe, not rhyme hold). Window-play MOSAIC unchanged — never names `mosaic`. Ethogram keeps tongue + rhyme sit_hold; adds rumor/costume/cipher/verse/tile softs + freeze (replaces thin mimic). Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough/liana/arbor and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore/quiver/upright and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap/ribbon/creek and copy/brief/visa; Lula owns pour/heft/oxbow/slack/bank/anchor/meander and harbor/cradle/stay; budgie owns mimic; parrot owns flash; hedgehog owns curl/root; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone. Guest slug Coral / key milk_snake — accept "milk_snake" and "coral". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via milk_snake.wav. Thank-yous postmark / cachet / courtesy. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `milk-snake-tricks.ts`. True house-Pueblo-milk-snake desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids mosaic/loop/patrol/stripe/hood/feign/shovel/gape/encore/quiver/upright/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/loom/weave/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/blotter/pencil/clause/spice/cord/audit/verdict/plumb/raid/tribute/docket/seal/band/drawer/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/liana/arbor/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/ribbon/creek/pour/heft/oxbow/slack/bank/anchor/meander/harbor/cradle/stay/mimic/flash/root/flare/dig/perch/hang/clasp/scent/stone/heave/lug/earth/bed/pebble/crevice/mesa/arroyo name collisions. Bird ultra (Soot→Ember) + Miso→Lula done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Amplitudes raised toward Rui richness; denser waits/weights (RHYME_HOLD=11.2 RELEASE_S=1.18). Blush densified. Atlas densified. Cup densified. Sepia densified. Chamber densified. Pulse densified. Ochre densified. Tenant densified. Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house milk_snake.wav prefer. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "milk_snake";
  const TRICKS = ["rhyme", "rumor", "costume", "frank", "tile", "cipher", "verse"];
  const HAPPY = ["postmark", "cachet", "courtesy"];
  const HAPPY_DUR = {
      postmark: 1.55,
      cachet: 1.6,
      courtesy: 1.58,
  };
  /** Rhyme hold — Coral stacks red/black/pale as the desk mnemonic flag. Not Bandit stripe. Not window-play MOSAIC. */
  const RHYME_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      rhyme: RHYME_HOLD + RELEASE_S,
      rumor: 1.78,
      costume: 1.92,
      frank: 1.72,
      tile: 1.98,
      cipher: 2.05,
      verse: 2.12,
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
      if (kind === "rhyme")
          return 40 + roll * 26;
      if (kind === "verse" || kind === "costume")
          return 12.8 + roll * 9.4;
      if (kind === "cipher" || kind === "rumor")
          return 12.8 + roll * 9.4;
      if (kind === "frank" || kind === "tile")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn = false, lastKind) {
      if (musicOn)
          return "rhyme";
      const roll = rand == null ? Math.random() : rand;
      const pool = TRICKS.filter((k) => k !== lastKind);
      const list = pool.length ? pool : [...TRICKS];
      const weights = list.map((k) => k === "rhyme" ? 0.72 : k === "cipher" || k === "verse" || k === "costume" ? 1.28 : k === "frank" || k === "tile" ? 1.18 : 1.08);
      let total = 0;
      for (let i = 0; i < weights.length; i++)
          total += weights[i];
      let r = roll * total;
      for (let i = 0; i < list.length; i++) {
          r -= weights[i];
          if (r <= 0)
              return list[i];
      }
      return list[list.length - 1] || "rhyme";
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
      return key === TRICK_KEY || key === "coral";
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
      const name = HAPPY.includes(kind) ? kind : "postmark";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x,
          lift: 0,
          rot: 0,
          anim: name === "postmark" ? "sit" : name === "cachet" ? "sit" : "talk",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function postmarkPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.postmark));
      if (u < 0.14) {
          const s = u / 0.14;
          return { lift: s * 5.04, rot: s * -19.2, dx: 0, anim: "sit" };
      }
      if (u < 0.78) {
          const press = Math.abs(Math.sin(t * 4.6));
          return {
              lift: 5.04 + press * 4.08,
              rot: -19.2 + Math.sin(t * 3.4) * 16.8,
              dx: Math.sin(t * 1.8) * 0.66,
              anim: "sit",
          };
      }
      const s = (u - 0.78) / 0.22;
      return { lift: 5.04 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "idle" };
  }
  function cachetPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cachet));
      if (u < 0.12) {
          const s = u / 0.12;
          return { lift: s * 5.52, rot: s * 21.6, dx: 0, anim: "sit" };
      }
      if (u < 0.8) {
          const rock = Math.sin(t * 2.8);
          return {
              lift: 5.52 + Math.abs(rock) * 3.84,
              rot: 21.6 + rock * 19.2,
              dx: rock * 0.84,
              anim: "sit",
          };
      }
      const s = (u - 0.8) / 0.2;
      return { lift: 5.52 * (1 - s), rot: 21.6 * (1 - s), dx: 0, anim: "sit" };
  }
  function courtesyPose(t) {
      return {
          lift: Math.abs(Math.sin(t * 3.4)) * 4.56 + 2.88,
          rot: -19.2 + Math.sin(t * 2.8) * 16.8,
          dx: Math.sin(t * 1.9) * 0.84,
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
      if (next.kind === "postmark") {
          const pose = postmarkPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "cachet") {
          const pose = cachetPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = courtesyPose(next.t);
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
      const anim = kind === "rhyme"
          ? "sit"
          : kind === "rumor"
              ? "talk"
              : kind === "costume"
                  ? "sit"
                  : kind === "frank"
                      ? "sit"
                      : kind === "tile"
                          ? "walk"
                          : kind === "cipher"
                              ? "sit"
                              : kind === "verse"
                                  ? "talk"
                                  : "sit";
      return {
          kind,
          phase: kind === "rhyme" ? "hold" : "go",
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
  function rhymePose(t) {
      // Three-beat tricolor rock — red / black / pale mnemonic, not Bandit band ticks.
      const beat = Math.sin(t * 1.7) + 0.54 * Math.sin(t * 3.4);
      return {
          lift: 2.88 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
          rot: -26.4 + Math.sin(t * 2.4) * 21.6 + Math.sin(t * 4.6) * 12,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return {
          lift: (2.88 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)),
          rot: -26.4 * (1 - u),
      };
  }
  function rumorPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.rumor));
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 5.76, rot: s * 19.2 * facing, anim: "talk" };
      }
      if (u < 0.55) {
          const s = (u - 0.14) / 0.41;
          return {
              x: fromX + facing * smoothstep(s) * 5.04,
              lift: 5.76 - s * 1.68 + Math.sin(s * Math.PI) * 2.64,
              rot: facing * (19.2 - s * 33.6),
              anim: "talk",
          };
      }
      if (u < 0.82) {
          const s = (u - 0.55) / 0.27;
          return {
              x: fromX + facing * (5.04 - smoothstep(s) * 5.04),
              lift: 3.84 + Math.abs(Math.sin(s * Math.PI * 1.8)) * 2.4,
              rot: facing * (-16.8 + s * 12),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.82) / 0.18);
      return {
          x: fromX,
          lift: 3.84 * (1 - s),
          rot: facing * (-4.8 * (1 - s)),
          anim: "sit",
      };
  }
  function costumePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.costume));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 6.24, rot: s * 33.6 * facing, anim: "sit" };
      }
      if (u < 0.72) {
          const s = (u - 0.12) / 0.6;
          const shiver = Math.sin(s * Math.PI * 4.2);
          return {
              x: fromX + facing * shiver * 1.32,
              lift: 6.24 - s * 1.68 + Math.abs(shiver) * 2.64,
              rot: facing * (33.6 - s * 43.2 + shiver * 16.8),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.72) / 0.28);
      return {
          x: fromX,
          lift: 4.32 * (1 - s),
          rot: facing * (-7.2 * (1 - s)),
          anim: "sit",
      };
  }
  function frankPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.frank));
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 5.76, rot: s * 19.2 * facing, anim: "sit" };
      }
      if (u < 0.5) {
          const s = (u - 0.14) / 0.36;
          return {
              x: fromX + facing * s * 1.44,
              lift: 5.76 - smoothstep(s) * 4.32,
              rot: facing * (19.2 - s * 33.6),
              anim: "sit",
          };
      }
      if (u < 0.82) {
          const s = (u - 0.5) / 0.32;
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
          lift: 1.2 * (1 - s),
          rot: facing * (-4.8 * (1 - s)),
          anim: "idle",
      };
  }
  function tilePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.tile));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 2.16, lift: s * 3.84, rot: s * 16.8 * facing, anim: "walk" };
      }
      if (u < 0.45) {
          const s = (u - 0.12) / 0.33;
          const step = Math.floor(s * 3);
          const local = (s * 3) % 1;
          return {
              x: fromX + facing * (2.16 + step * 2.4 + smoothstep(local) * 2.4),
              lift: 3.84 + Math.sin(local * Math.PI) * 3.12,
              rot: facing * (16.8 + Math.sin(local * Math.PI) * 26.4),
              anim: "walk",
          };
      }
      if (u < 0.78) {
          const s = (u - 0.45) / 0.33;
          return {
              x: fromX + facing * (9.36 - smoothstep(s) * 3.84),
              lift: 4.08 + Math.abs(Math.sin(s * Math.PI * 1.8)) * 2.4,
              rot: facing * (26.4 - s * 33.6),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * (5.52 * (1 - s)),
          lift: 3.84 * (1 - s),
          rot: facing * (-4.8 * (1 - s)),
          anim: "sit",
      };
  }
  /** Cipher — cryptic milk-snake cover fold under the blotter corner. Not hide. Not Nori nook. Not tuck. */
  function cipherPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.cipher));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 4.08, rot: s * -14.4 * facing, anim: "sit" };
      }
      if (u < 0.42) {
          const s = (u - 0.12) / 0.3;
          return {
              x: fromX + facing * smoothstep(s) * -1.68,
              lift: 4.08 - smoothstep(s) * 2.4,
              rot: facing * (-14.4 + s * 4.8),
              anim: "sit",
          };
      }
      if (u < 0.82) {
          const s = (u - 0.42) / 0.4;
          const hush = Math.abs(Math.sin(s * Math.PI * 1.8));
          return {
              x: fromX + facing * -1.68,
              lift: 1.44 + hush * 2.16,
              rot: facing * (-12 + hush * 19.2),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.82) / 0.18);
      return {
          x: fromX + facing * (-1.68 * (1 - s)),
          lift: 1.44 * (1 - s),
          rot: facing * (-4.8 * (1 - s)),
          anim: "idle",
      };
  }
  /** Verse — three-beat red/black/pale teaching verse. Not Bandit stripe. Not rhyme hold. */
  function versePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.verse));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 1.92, lift: s * 4.32, rot: s * 21.6 * facing, anim: "talk" };
      }
      if (u < 0.78) {
          const s = (u - 0.12) / 0.66;
          const beat = Math.floor(s * 3);
          const local = (s * 3) % 1;
          const bob = Math.sin(local * Math.PI);
          return {
              x: fromX + facing * (1.92 + beat * 1.68 + bob * 0.72),
              lift: 4.32 + Math.abs(bob) * 3.36,
              rot: facing * (21.6 + beat * 7.2 + bob * 24),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * ((1.92 + 3.36) * (1 - s)),
          lift: 4.32 * (1 - s),
          rot: facing * (9.6 * (1 - s)),
          anim: "sit",
      };
  }
  function stepTrick(trick, dt, flags) {
      if (!trick || trick.phase === "done")
          return trick;
      if (shouldAbort(flags) && trick.kind !== "tile" && trick.kind !== "rumor" && trick.kind !== "verse") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "rhyme") {
          if (next.t < RHYME_HOLD) {
              const pose = rhymePose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < RHYME_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - RHYME_HOLD);
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
      if (next.kind === "rumor") {
          const pose = rumorPose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "costume") {
          const pose = costumePose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "frank") {
          const pose = frankPose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "tile") {
          const pose = tilePose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "cipher") {
          const pose = cipherPose(next.t, from, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = versePose(next.t, from, trick.facing);
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
    RHYME_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    rhymePose,
    releasePose,
    rumorPose,
    costumePose,
    frankPose,
    tilePose,
    cipherPose,
    versePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    postmarkPose,
    cachetPose,
    courtesyPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMilkSnakeTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : /** @type {any} */ (this));
