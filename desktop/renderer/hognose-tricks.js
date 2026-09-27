/** Bluff ground tricks while idle — ultra-polish pass. House western hognose — hood / feign / shovel / gape / encore / quiver / upright personality (bluff/death-feign/nose desk life; eraser-dish theater). Hood false-cobra flatten on the eraser dish; feign belly-up death-feign drama; shovel keeled-nose dig on the blotter grit; gape open-mouth hiss bluff; encore theatrical recovery strut; quiver false-rattle tail buzz bluff (western hognose tail vibrate — not Keel toucan rattle, not Relay buzz); upright reared false-cobra stand on the eraser dish (distinct from hood flatten). Window-play FLIP unchanged — never names `flip`. Ethogram maps hood→flatten sit_hold, feign→playdead; keeps tongue/gape; adds shovel/encore/quiver/upright softs + freeze. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough/liana/arbor and pendant/treaty/emerald; Sash owns moss; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle/puff; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press; Lula window-play owns loop; Echo window-play owns perch; Keel owns rattle; Vee owns hiss; tarantula owns cork; Relay owns buzz. Guest slug Bluff / key hognose — accept "hognose" and "bluff". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via hognose.wav. Thank-yous aside / cue / ovation. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `hognose-tricks.ts`. True house-western-hognose desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/loom/weave/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/blotter/pencil/clause/spice/cord/stripe/audit/verdict/plumb/raid/tribute/docket/seal/band/drawer/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/liana/arbor/root/flare/dig/loop/perch/hang/clasp/playdead/flatten/rattle/hiss/cork/buzz/puff/moss name collisions. Bird ultra (Soot→Ember) + Miso→Jade done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Amplitudes raised toward Rui richness; denser waits/weights (HOOD_HOLD=11.2 RELEASE_S=1.18). Sash densified. Lula densified. Coral densified. Blush densified. Atlas densified. Cup densified. Sepia densified. Chamber densified. Pulse densified. Ochre densified. Tenant densified. Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house hognose.wav prefer. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "hognose";
  const TRICKS = ["hood", "feign", "shovel", "gape", "encore", "quiver", "upright"];
  const HAPPY = ["aside", "cue", "ovation"];
  const HAPPY_DUR = {
      aside: 1.55,
      cue: 1.6,
      ovation: 1.58,
  };
  /** Hood hold — Bluff flattens a false cobra hood on the eraser dish. Not window-play FLIP. Not Jade bracelet. */
  const HOOD_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      hood: HOOD_HOLD + RELEASE_S,
      feign: 1.86,
      shovel: 1.78,
      gape: 1.72,
      encore: 1.94,
      quiver: 2.02,
      upright: 2.1,
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
      if (kind === "hood")
          return 40 + roll * 26;
      if (kind === "feign" || kind === "upright" || kind === "gape")
          return 12.8 + roll * 9.4;
      if (kind === "shovel" || kind === "encore" || kind === "quiver")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn = false, lastKind) {
      if (musicOn)
          return "hood";
      const roll = rand == null ? Math.random() : rand;
      const pool = TRICKS.filter((k) => k !== lastKind);
      const list = pool.length ? pool : [...TRICKS];
      const weights = list.map((k) => k === "hood" ? 0.72 : k === "feign" || k === "upright" || k === "gape" ? 1.28 : k === "shovel" || k === "encore" ? 1.18 : 1.08);
      let total = 0;
      for (let i = 0; i < weights.length; i++)
          total += weights[i];
      let r = roll * total;
      for (let i = 0; i < list.length; i++) {
          r -= weights[i];
          if (r <= 0)
              return list[i];
      }
      return list[list.length - 1] || "hood";
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
      return key === TRICK_KEY || key === "bluff";
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
      var _a;
      const pool = HAPPY.filter((k) => k !== lastKind);
      const list = pool.length ? pool : [...HAPPY];
      const roll = rand == null ? Math.random() : rand;
      return (_a = list[Math.floor(roll * list.length)]) !== null && _a !== void 0 ? _a : list[0];
  }
  function beginHappy(kind, x, facing = 1) {
      const name = HAPPY.includes(kind) ? kind : "aside";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x,
          lift: 0,
          rot: 0,
          anim: name === "aside" ? "sit" : name === "cue" ? "talk" : "sit",
          facing,
          fromX: x,
      };
  }
  function asidePose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.aside));
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
  function cuePose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cue));
      if (u < 0.12) {
          const s = u / 0.12;
          return { lift: s * 5.52, rot: s * 21.6, dx: 0, anim: "talk" };
      }
      if (u < 0.78) {
          const tick = Math.sin(t * 7.2);
          return {
              lift: 5.52 + Math.abs(tick) * 3.84,
              rot: 21.6 + tick * 19.2,
              dx: tick * 1.44,
              anim: "talk",
          };
      }
      const s = (u - 0.78) / 0.22;
      return { lift: 5.52 * (1 - s), rot: 21.6 * (1 - s), dx: 0, anim: "sit" };
  }
  function ovationPose(t) {
      return {
          lift: Math.abs(Math.sin(t * 3.4)) * 4.56 + 2.4,
          rot: -19.2 + Math.sin(t * 2.8) * 16.8,
          dx: Math.sin(t * 2.2) * 1.68,
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
      if (next.kind === "aside") {
          const pose = asidePose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "cue") {
          const pose = cuePose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = ovationPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      if (next.t >= hold)
          return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
      return next;
  }
  /** Bluff has no Rui-style sleep-frame hold. */
  function sleepHoldFrame(_key, _frameCount) {
      return null;
  }
  function beginTrick(kind, x, facing = 1) {
      const anim = kind === "hood"
          ? "sit"
          : kind === "feign"
              ? "sit"
              : kind === "shovel"
                  ? "talk"
                  : kind === "gape"
                      ? "talk"
                      : kind === "encore"
                          ? "play"
                          : kind === "quiver"
                              ? "play"
                              : kind === "upright"
                                  ? "sit"
                                  : "sit";
      return {
          kind,
          phase: kind === "hood" ? "hold" : "go",
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
  /** Hood — false-cobra flatten on the eraser dish. Soft rock. Not window-play FLIP. Not Jade bracelet. */
  function hoodPose(t) {
      return {
          lift: 2.64 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
          rot: -26.4 + Math.sin(t * 2.4) * 21.6 + Math.sin(t * 4.6) * 12,
      };
  }
  /** Soft unflatten out of the hood; stays on the eraser dish. Not window-play leave. */
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: (2.64 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -26.4 * (1 - u) };
  }
  /** Feign — belly-up death-feign drama on the blotter. Not Nori unroll. Not Jade sway. */
  function feignPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.feign));
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 4.32, rot: s * 132 * facing, anim: "play" };
      }
      if (u < 0.72) {
          const s = (u - 0.14) / 0.58;
          return {
              x: fromX + facing * Math.sin(s * Math.PI * 0.8) * 1.68,
              lift: 1.08 + Math.sin(s * Math.PI * 1.6) * 2.16,
              rot: facing * (132 + Math.sin(s * Math.PI * 2.2) * 14.4),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.72) / 0.28);
      return {
          x: fromX,
          lift: 1.08 * (1 - s) + s * 2.64,
          rot: facing * (132 * (1 - s) + s * -12),
          anim: "sit",
      };
  }
  /** Shovel — keeled-nose dig on blotter grit. Not Thimble dig. Not Bandit plumb. */
  function shovelPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.shovel));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + facing * s * 2.88, lift: s * 3.36, rot: s * 26.4 * facing, anim: "talk" };
      }
      if (u < 0.84) {
          const s = (u - 0.12) / 0.72;
          const dig = Math.sin(s * Math.PI * 5.2);
          return {
              x: fromX + facing * (2.88 + dig * 4.32),
              lift: 2.88 + Math.abs(dig) * 3.84,
              rot: facing * (26.4 + dig * 28.8),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.84) / 0.16);
      return {
          x: fromX + facing * (2.88 * (1 - s)),
          lift: 2.88 * (1 - s),
          rot: facing * 9.6 * (1 - s),
          anim: "sit",
      };
  }
  /** Gape — open-mouth hiss bluff (silent desk motion). Not Vee hiss. Not Nori taste. */
  function gapePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.gape));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 6.24, rot: s * -21.6 * facing, anim: "talk" };
      }
      if (u < 0.82) {
          const s = (u - 0.12) / 0.7;
          const hiss = Math.sin(s * Math.PI * 3.2);
          return {
              x: fromX + facing * hiss * 2.64,
              lift: 6.24 + Math.abs(hiss) * 4.08,
              rot: facing * (-21.6 + hiss * 24),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.82) / 0.18);
      return {
          x: fromX,
          lift: 6.24 * (1 - s),
          rot: facing * -9.6 * (1 - s),
          anim: "sit",
      };
  }
  /** Encore — theatrical recovery strut after a bluff. Not Bandit raid. Not Jade bough. */
  function encorePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.encore));
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 5.76, rot: -s * 19.2 * facing, anim: "play" };
      }
      if (u < 0.5) {
          const s = (u - 0.12) / 0.38;
          return {
              x: fromX + facing * smoothstep(s) * 8.64,
              lift: 5.76 + Math.sin(s * Math.PI) * 5.04,
              rot: facing * (-19.2 + s * 40.8),
              anim: "play",
          };
      }
      if (u < 0.78) {
          const s = (u - 0.5) / 0.28;
          return {
              x: fromX + facing * 8.64,
              lift: 6.48 + Math.sin(s * Math.PI * 1.8) * 3.36,
              rot: facing * (21.6 - s * 12),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * (8.64 * (1 - s)),
          lift: 6.48 * (1 - s),
          rot: facing * 7.2 * (1 - s),
          anim: "sit",
      };
  }
  /** Quiver — false-rattle tail buzz bluff on the eraser dish. Not Keel rattle. Not Relay buzz. */
  function quiverPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.quiver));
      if (u < 0.1) {
          const s = smoothstep(u / 0.1);
          return { x: fromX, lift: s * 3.84, rot: s * 14.4 * facing, anim: "play" };
      }
      if (u < 0.86) {
          const s = (u - 0.1) / 0.76;
          const buzz = Math.sin(s * Math.PI * 14);
          return {
              x: fromX + facing * buzz * 3.36,
              lift: 3.84 + Math.abs(buzz) * 2.88 + Math.sin(s * Math.PI * 2.2) * 1.92,
              rot: facing * (14.4 + buzz * 33.6),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.86) / 0.14);
      return {
          x: fromX,
          lift: 3.84 * (1 - s),
          rot: facing * 7.2 * (1 - s),
          anim: "sit",
      };
  }
  /** Upright — reared false-cobra stand on the eraser dish. Distinct from hood flatten. Not Jade arbor. */
  function uprightPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.upright));
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 7.68, rot: s * -16.8 * facing, anim: "sit" };
      }
      if (u < 0.82) {
          const s = (u - 0.14) / 0.68;
          const sway = Math.sin(s * Math.PI * 2.4);
          return {
              x: fromX + facing * sway * 2.16,
              lift: 7.68 + Math.abs(sway) * 2.64,
              rot: facing * (-16.8 + sway * 21.6),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.82) / 0.18);
      return {
          x: fromX,
          lift: 7.68 * (1 - s),
          rot: facing * -7.2 * (1 - s),
          anim: "sit",
      };
  }
  function stepTrick(trick, dt, flags) {
      if (!trick || trick.phase === "done")
          return trick;
      if (shouldAbort(flags) && trick.kind !== "encore" && trick.kind !== "feign" && trick.kind !== "quiver") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "hood") {
          if (next.t < HOOD_HOLD) {
              const pose = hoodPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < HOOD_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - HOOD_HOLD);
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
      if (next.kind === "feign") {
          const pose = feignPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "shovel") {
          const pose = shovelPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "gape") {
          const pose = gapePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "encore") {
          const pose = encorePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "quiver") {
          const pose = quiverPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = uprightPose(next.t, fromX, trick.facing);
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
    HOOD_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    hoodPose,
    releasePose,
    feignPose,
    shovelPose,
    gapePose,
    encorePose,
    quiverPose,
    uprightPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    asidePose,
    cuePose,
    ovationPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHognoseTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : /** @type {any} */ (this));
