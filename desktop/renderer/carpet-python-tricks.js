/** Atlas ground tricks while idle — ultra-polish pass. House carpet python — legend / rung / contour / runner / bearing / canopy / inset personality (map/carpet climb desk life; chart-shelf cartographer + jungle Morelia canopy, not Nori ball-bun or Jade lamp-arm jewelry or Blush desert pebble). Legend rests a desk map-legend carpet plate; rung climbs a blotter rung; contour traces a map contour S-curve; runner lays a carpet runner; bearing compass-orients true; canopy weaves a jungle canopy branch climb (species-true Morelia arboreal — not Jade bough/liana/arbor, not Echo perch, not rung desk-rung); inset settles a map inset plate (cartographer Atlas — not legend hold, not window-play CHART). Window-play CHART unchanged — never names `chart`. Ethogram keeps tongue + legend sit_hold; adds rung/contour/runner/canopy/inset softs + freeze (replaces thin drape-only). Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough/liana/arbor and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore/quiver/upright and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap/ribbon/creek and copy/brief/visa; Lula owns pour/heft/oxbow/slack/bank/anchor/meander and harbor/cradle/stay; Coral owns rhyme/rumor/costume/frank/tile/cipher/verse and postmark/cachet/courtesy; Blush owns pebble/crevice/rosy/mesa/arroyo/dune/talus and climate/manners/corner; budgie owns mimic; parrot owns flash; hedgehog owns curl/root; turtle owns tuck; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone; carpet_python window-play owns chart; hamster owns nest. Guest slug Atlas / key carpet_python — accept "carpet_python" and "atlas". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via carpet_python.wav. Thank-yous survey / gazette / shelf. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `carpet-python-tricks.ts`. True house-carpet-python desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids chart/climb/unroll/drape/tongue/pebble/crevice/rosy/mesa/arroyo/dune/talus/climate/manners/corner/mosaic/loop/patrol/stripe/hood/feign/shovel/gape/encore/flip/saddle/inspect/write/orb/nook/taste/inch/bun/ball/coil/curl/bask/loaf/potato/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/audit/verdict/plumb/raid/tribute/docket/seal/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/mimic/flash/root/flare/dig/perch/hang/clasp/scent/heave/lug/earth/bed/nest/pour/heft/oxbow/slack/bank/harbor/cradle/stay/rhyme/rumor/costume/frank/tile/postmark/cachet/courtesy/tuck/hide/liana/arbor/loom/weave/azimuth/margin/rosette/wrap/branch/parcel/ridge/pit/diamond name collisions with prior guests and carpet_python window-play. Bird ultra (Soot→Ember) + Miso→Blush done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Amplitudes raised toward Rui richness; denser waits/weights (LEGEND_HOLD=11.2 RELEASE_S=1.18). Cup densified. Sepia densified. Chamber densified. Pulse densified. Ochre densified. Tenant densified. Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house carpet_python.wav prefer. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "carpet_python";
  const TRICKS = ["legend", "rung", "contour", "runner", "bearing", "canopy", "inset"];
  const HAPPY = ["survey", "gazette", "shelf"];
  const HAPPY_DUR = {
      survey: 1.55,
      gazette: 1.6,
      shelf: 1.58,
  };
  /** Legend hold — Atlas rests as a desk map-legend carpet plate. Not window-play CHART. Not Nori orb. */
  const LEGEND_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      legend: LEGEND_HOLD + RELEASE_S,
      rung: 1.78,
      contour: 1.92,
      runner: 1.98,
      bearing: 1.72,
      canopy: 2.05,
      inset: 2.12,
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
      if (kind === "legend")
          return 40 + roll * 26;
      if (kind === "canopy" || kind === "inset" || kind === "contour")
          return 12.8 + roll * 9.4;
      if (kind === "rung" || kind === "runner")
          return 12.8 + roll * 9.4;
      if (kind === "bearing")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn = false, lastKind) {
      if (musicOn)
          return "legend";
      const roll = rand == null ? Math.random() : rand;
      const pool = TRICKS.filter((k) => k !== lastKind);
      const list = pool.length ? pool : [...TRICKS];
      const weights = list.map((k) => k === "legend" ? 0.72 : k === "canopy" || k === "inset" || k === "contour" ? 1.28 : k === "rung" || k === "runner" ? 1.18 : 1.08);
      let total = 0;
      for (let i = 0; i < weights.length; i++)
          total += weights[i];
      let r = roll * total;
      for (let i = 0; i < list.length; i++) {
          r -= weights[i];
          if (r <= 0)
              return list[i];
      }
      return list[list.length - 1] || "legend";
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
      return key === TRICK_KEY || key === "atlas";
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
      const name = HAPPY.includes(kind) ? kind : "survey";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x,
          lift: 0,
          rot: 0,
          anim: name === "survey" ? "sit" : name === "gazette" ? "sit" : "talk",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function surveyPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.survey));
      if (u < 0.14) {
          const s = u / 0.14;
          return { lift: s * 5.04, rot: s * -19.2, dx: 0, anim: "sit" };
      }
      if (u < 0.78) {
          const scan = Math.abs(Math.sin(t * 4.6));
          return {
              lift: 5.04 + scan * 4.08,
              rot: -19.2 + Math.sin(t * 3.4) * 16.8,
              dx: Math.sin(t * 1.8) * 0.66,
              anim: "sit",
          };
      }
      const s = (u - 0.78) / 0.22;
      return { lift: 5.04 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "idle" };
  }
  function gazettePose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gazette));
      if (u < 0.12) {
          const s = u / 0.12;
          return { lift: s * 5.52, rot: s * 21.6, dx: 0, anim: "sit" };
      }
      if (u < 0.8) {
          const nod = Math.sin(t * 2.8);
          return {
              lift: 5.52 + Math.abs(nod) * 3.84,
              rot: 21.6 + nod * 19.2,
              dx: nod * 0.84,
              anim: "sit",
          };
      }
      const s = (u - 0.8) / 0.2;
      return { lift: 5.52 * (1 - s), rot: 21.6 * (1 - s), dx: 0, anim: "sit" };
  }
  function shelfPose(t) {
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
      if (next.kind === "survey") {
          const pose = surveyPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "gazette") {
          const pose = gazettePose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = shelfPose(next.t);
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
      const anim = kind === "legend"
          ? "sit"
          : kind === "rung"
              ? "walk"
              : kind === "contour"
                  ? "walk"
                  : kind === "runner"
                      ? "walk"
                      : kind === "bearing"
                          ? "sit"
                          : kind === "canopy"
                              ? "walk"
                              : kind === "inset"
                                  ? "sit"
                                  : "sit";
      return {
          kind,
          phase: kind === "legend" ? "hold" : "go",
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
  function legendPose(t) {
      // Map-legend carpet breath — patterned plate on the blotter, not window chart.
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
  function rungPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.rung));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 1.92, lift: s * 4.32, rot: s * 21.6 * facing, anim: "walk" };
      }
      if (u < 0.42) {
          const s = (u - 0.12) / 0.3;
          // Climb a desk rung — vertical lift, not Jade bracelet coil jewelry.
          return {
              x: fromX + facing * (1.92 + smoothstep(s) * 1.44),
              lift: 4.32 + smoothstep(s) * 5.76,
              rot: facing * (21.6 - s * 12),
              anim: "play",
          };
      }
      if (u < 0.72) {
          const s = (u - 0.42) / 0.3;
          const sway = Math.sin(s * Math.PI * 2.6);
          return {
              x: fromX + facing * (3.36 + sway * 0.66),
              lift: 10.08 + Math.abs(sway) * 1.92,
              rot: facing * (7.2 + sway * 16.8),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.72) / 0.28);
      return {
          x: fromX + facing * (3.36 * (1 - s)),
          lift: 10.08 * (1 - s),
          rot: facing * (4.8 * (1 - s)),
          anim: "walk",
      };
  }
  function contourPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.contour));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 2.16, lift: s * 3.84, rot: s * 19.2 * facing, anim: "walk" };
      }
      if (u < 0.7) {
          const s = (u - 0.12) / 0.696;
          // Trace a map contour — soft S-curve, not Saffron pencil scribble.
          const wave = Math.sin(s * Math.PI * 2.8);
          return {
              x: fromX + facing * (2.16 + s * 6.48),
              lift: 3.84 + Math.abs(wave) * 3.36,
              rot: facing * (19.2 + wave * 26.4),
              anim: "walk",
          };
      }
      const s = smoothstep((u - 0.7) / 0.3);
      return {
          x: fromX + facing * (8.64 * (1 - s)),
          lift: 4.32 * (1 - s),
          rot: facing * (9.6 * (1 - s)),
          anim: "sit",
      };
  }
  function runnerPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.runner));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 2.16, lift: s * 3.6, rot: s * 16.8 * facing, anim: "walk" };
      }
      if (u < 0.48) {
          const s = (u - 0.12) / 0.36;
          // Lay a carpet runner along the blotter — not Nori unroll bun.
          const step = Math.floor(s * 3);
          const local = (s * 3) % 1;
          return {
              x: fromX + facing * (2.16 + step * 2.4 + smoothstep(local) * 2.4),
              lift: 3.6 + Math.sin(local * Math.PI) * 2.88,
              rot: facing * (16.8 + Math.sin(local * Math.PI) * 24),
              anim: "walk",
          };
      }
      if (u < 0.78) {
          const s = (u - 0.48) / 0.3;
          const nap = Math.abs(Math.sin(s * Math.PI * 2.0));
          return {
              x: fromX + facing * 9.36,
              lift: 1.68 + nap * 2.16,
              rot: facing * (-14.4 + nap * 12),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * (9.36 * (1 - s)),
          lift: 1.92 * (1 - s),
          rot: facing * (-4.8 * (1 - s)),
          anim: "idle",
      };
  }
  function bearingPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.bearing));
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 6, rot: s * 31.2 * facing, anim: "sit" };
      }
      if (u < 0.72) {
          const s = (u - 0.14) / 0.696;
          // Compass-bearing orient — head points true, not Bandit stripe audit.
          const tick = Math.sin(s * Math.PI * 3.4);
          return {
              x: fromX + facing * tick * 0.78,
              lift: 6 - s * 1.44 + Math.abs(tick) * 2.4,
              rot: facing * (31.2 - s * 40.8 + tick * 14.4),
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
  function canopyPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.canopy));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 1.68, lift: s * 5.04, rot: s * 24 * facing, anim: "walk" };
      }
      if (u < 0.45) {
          const s = (u - 0.12) / 0.33;
          // Jungle canopy branch weave — Morelia arboreal, not Jade liana jewelry, not Echo perch.
          const weave = Math.sin(s * Math.PI * 3.0);
          return {
              x: fromX + facing * (1.68 + smoothstep(s) * 2.88 + weave * 0.54),
              lift: 5.04 + smoothstep(s) * 5.52 + Math.abs(weave) * 1.68,
              rot: facing * (24 - s * 9.6 + weave * 19.2),
              anim: "play",
          };
      }
      if (u < 0.78) {
          const s = (u - 0.45) / 0.33;
          const hang = Math.abs(Math.sin(s * Math.PI * 2.2));
          return {
              x: fromX + facing * (4.56 + hang * 0.42),
              lift: 10.56 - s * 1.92 + hang * 2.16,
              rot: facing * (9.6 + hang * 14.4),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * (4.56 * (1 - s)),
          lift: 8.64 * (1 - s),
          rot: facing * (7.2 * (1 - s)),
          anim: "walk",
      };
  }
  function insetPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.inset));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 5.76, rot: s * -16.8 * facing, anim: "sit" };
      }
      if (u < 0.42) {
          const s = (u - 0.12) / 0.3;
          // Settle into a map inset plate — cartographer Atlas, not legend breath, not CHART.
          return {
              x: fromX + facing * smoothstep(s) * -1.92,
              lift: 5.76 - smoothstep(s) * 3.36,
              rot: facing * (-16.8 + s * 26.4),
              anim: "sit",
          };
      }
      if (u < 0.78) {
          const s = (u - 0.42) / 0.36;
          const press = Math.abs(Math.sin(s * Math.PI * 2.4));
          return {
              x: fromX + facing * -1.92,
              lift: 2.16 + press * 2.64,
              rot: facing * (12 + press * 14.4),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * (-1.92 * (1 - s)),
          lift: 2.64 * (1 - s),
          rot: facing * (4.8 * (1 - s)),
          anim: "sit",
      };
  }
  function stepTrick(trick, dt, flags) {
      if (!trick || trick.phase === "done")
          return trick;
      if (shouldAbort(flags) &&
          trick.kind !== "runner" &&
          trick.kind !== "rung" &&
          trick.kind !== "contour" &&
          trick.kind !== "canopy") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "legend") {
          if (next.t < LEGEND_HOLD) {
              const pose = legendPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < LEGEND_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - LEGEND_HOLD);
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
      if (next.kind === "rung") {
          const pose = rungPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "contour") {
          const pose = contourPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "runner") {
          const pose = runnerPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "canopy") {
          const pose = canopyPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "inset") {
          const pose = insetPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = bearingPose(next.t, fromX, trick.facing);
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
    LEGEND_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    legendPose,
    releasePose,
    rungPose,
    contourPose,
    runnerPose,
    bearingPose,
    canopyPose,
    insetPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    surveyPose,
    gazettePose,
    shelfPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCarpetPythonTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : /** @type {any} */ (this));
