/** Column ground tricks while idle — ultra-polish pass. House carpenter ant — gallery / pheromone / crumb / bustle / camponotus / trophallaxis / frass personality (gallery wood-tunnel mandible work on the blotter — never named column (Moth orchid owns column) / nest (window NEST + Clip) / chew / bore (carpenter bee window) / dig / gnaw (beaver) / trail (Pulse+ethogram-old) / road / scent / carry / oviposit (Twig) / filiform (Twig), pheromone scent-road dab — never named trail (Pulse) / scent / road / mark / waggle (Comb window) / figure (Comb) / dance (Rui) / buzz (Relay) / jstroke (Spark) / stream (Ghost), crumb food-haul lift — never named carry / forage (bumblebee window) / cheek (Clip) / pocket (Clip) / pollen (Moth happy) / nectar (Disk) / honey (Comb happy) / browse (Twig), bustle nest-chamber hurry — never named nest / hive (Comb) / scurry (Clip) / scuttle (Tenant) / amble (Bloom) / crawl (Cling) / tread (Twig) / walk (ethogram-old) / dart (Coin+ethogram-old), camponotus desk life as a Camponotus pennsylvanicus Black Carpenter Ant week, trophallaxis mouth-to-mouth food share (species-true Formicidae trophallaxis — never named feed / eat / kiss / share / honeydew-as-trick / nectar / honey / pollen / cheek / pocket), frass wood-powder eject from the gallery (species-true Camponotus gallery frass — never named dust (Floss) / puff (Pebble) / spore (Felt) / sawdust / chip (Sip) / dig / bore / chew / gnaw / drop (Fan)); not Twig rocking/catalepsy/browse/tread/diapheromera/oviposit/filiform, Dart hawking/tandem/nymph/whir/anax/obelisk/ommatidia, Spark lantern/jstroke/semaphore/elytra/photinus/photocyte/sternite, Ghost plumose/lunule/silk/stream/actias/aphagy/cauda, Milk asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus, Comb figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Dew mucilage/tentacle/digest/gland/rosette/lamina/circinate, Well peristome/cistern/brine/operculum/urn/ala/baffle, Snap clamp/trichome/stew/unseal/poise/cage/scape, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Echo preen/bobble, Ember cinder/blaze, Quill fan/flash, Relay buzz/click, Rui dance, Sepia hover, Pulse medusa/trail, Clip nest/scurry, Tenant antenna/scuttle, Dragon glow, or Jade sway/Sol nod copies). Trophallaxis is the iconic Formicidae mouth-share (not window NEST, not ethogram-old trail/dart/still). Frass is the iconic gallery wood-powder eject (not Floss dust, not Felt spore). Window-play NEST unchanged — never names nest. Ethogram keeps camponotus sit_hold; adds gallery/pheromone/crumb/bustle/trophallaxis/frass softs + freeze (replaces thin trail/dart/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via carpenter_ant.wav. Thank-yous pennsylvanicus / honeydew / formicine. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web carpenter_ant-tricks.ts. True house-carpenter-ant desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig or *Dragon electrical clone. Next guest ultra is Shard / silica. Formicidae Camponotus desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "carpenter_ant";
  const TRICKS = ["gallery", "pheromone", "crumb", "bustle", "camponotus", "trophallaxis", "frass"];
  const HAPPY = ["pennsylvanicus", "honeydew", "formicine"];




  const HAPPY_DUR = {
    pennsylvanicus: 1.70,
    honeydew: 1.84,
    formicine: 1.76,
  };
  const CAMPONOTUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    camponotus: CAMPONOTUS_HOLD + RELEASE_S,
    gallery: 2.48,
    pheromone: 2.42,
    crumb: 2.44,
    bustle: 2.56,
    trophallaxis: 2.40,
    frass: 2.38,
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
    if (kind === "camponotus") return 40 + roll * 24;
    if (kind === "trophallaxis" || kind === "frass" || kind === "gallery") return 12 + roll * 9;
    if (kind === "pheromone" || kind === "crumb" || kind === "bustle") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "camponotus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "camponotus") {
      if (roll < 0.16) return "gallery";
      if (roll < 0.32) return "pheromone";
      if (roll < 0.48) return "crumb";
      if (roll < 0.64) return "bustle";
      if (roll < 0.82) return "trophallaxis";
      return "frass";
    }
    if (lastKind === "gallery") {
      if (roll < 0.18) return "camponotus";
      if (roll < 0.34) return "pheromone";
      if (roll < 0.5) return "crumb";
      if (roll < 0.66) return "bustle";
      if (roll < 0.83) return "trophallaxis";
      return "frass";
    }
    if (lastKind === "pheromone") {
      if (roll < 0.16) return "camponotus";
      if (roll < 0.32) return "gallery";
      if (roll < 0.48) return "crumb";
      if (roll < 0.64) return "bustle";
      if (roll < 0.82) return "trophallaxis";
      return "frass";
    }
    if (lastKind === "trophallaxis" || lastKind === "frass") {
      if (roll < 0.16) return "camponotus";
      if (roll < 0.32) return "gallery";
      if (roll < 0.48) return "pheromone";
      if (roll < 0.64) return "crumb";
      if (roll < 0.8) return "bustle";
      return lastKind === "trophallaxis" ? ("frass") : ("trophallaxis");
    }
    if (roll < 0.14) return "camponotus";
    if (roll < 0.28) return "gallery";
    if (roll < 0.42) return "pheromone";
    if (roll < 0.56) return "crumb";
    if (roll < 0.7) return "bustle";
    if (roll < 0.85) return "trophallaxis";
    return "frass";
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
    return key === TRICK_KEY || key === "column";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
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
    const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "pennsylvanicus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "pennsylvanicus" ? "play" : name === "honeydew" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function pennsylvanicusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pennsylvanicus));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 2.9, rot: s * 12, dx: 0, anim: "play" };
    }
    if (u < 0.72) {
      const rock = Math.sin(t * 3.4) + 0.22 * Math.sin(t * 6.8);
      return {
        lift: 2.9 + Math.abs(rock) * 1.35,
        rot: 12 + rock * 10,
        dx: rock * 0.22,
        anim: "play",
      };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function honeydewPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.honeydew));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 3.2, rot: s * -9.5, dx: s * 0.18, anim: "talk" };
    }
    if (u < 0.78) {
      const shed = Math.sin(t * 4.2) + 0.3 * Math.sin(t * 9.1);
      return {
        lift: 3.2 + Math.abs(shed) * 1.4,
        rot: -9.5 + shed * 9,
        dx: shed * 0.2,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.1 * (1 - s), rot: -4.5 * (1 - s), dx: 0, anim: "sit" };
  }

  function formicinePose(t) {
    return {
      lift: 2.1 + Math.abs(Math.sin(t * 0.42)) * 0.85,
      rot: Math.sin(t * 0.55) * 6.5,
      dx: Math.sin(t * 0.28) * 0.12,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "pennsylvanicus") {
      const pose = pennsylvanicusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "honeydew") {
      const pose = honeydewPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = formicinePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "camponotus"
        ? "sit"
        : kind === "gallery"
          ? "sit"
          : kind === "pheromone"
            ? "walk"
            : kind === "crumb"
              ? "walk"
              : kind === "bustle"
                ? "walk"
                : kind === "trophallaxis"
                  ? "talk"
                  : kind === "frass"
                    ? "sit"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "camponotus" ? "hold" : "go",
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

  function camponotusPose(t) {
    const breath = Math.sin(t * 0.18) + 0.035 * Math.sin(t * 0.95);
    const grain = Math.abs(Math.sin(t * 0.58));
    return {
      lift: 2.4 + grain * 1.1,
      rot: 3.8 + breath * 3.2,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 3.0 * (1 - u) };
  }

  function galleryPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gallery));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.55, rot: s * -10 * facing, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.14) / 0.68;
      const chew = Math.sin(s * Math.PI * 7.2) + 0.28 * Math.sin(s * Math.PI * 12.4);
      return {
        x: fromX + facing * chew * 0.18,
        lift: 2.55 + Math.abs(chew) * 1.25,
        rot: facing * (-10 + chew * 9),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 2.0 * (1 - s),
      rot: facing * (-4.5 * (1 - s)),
      anim: "sit",
    };
  }

  function pheromonePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pheromone));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.9, rot: s * 9 * facing, anim: "walk" };
    }
    if (u < 0.8) {
      const s = (u - 0.12) / 0.68;
      const dab = Math.sin(s * Math.PI * 4.6);
      const step = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * (0.55 * s + step * 0.2),
        lift: 2.9 + Math.max(0, -dab) * 1.3 + Math.abs(step) * 0.9,
        rot: facing * (9 + dab * 8 + step * 5),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + facing * 0.4 * (1 - s * 0.3),
      lift: 2.1 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }

  function crumbPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.crumb));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.2, rot: s * -9 * facing, anim: "walk" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const haul = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * (0.5 * s + haul * 0.18),
        lift: 3.2 + Math.abs(haul) * 1.2,
        rot: facing * (-9 + haul * 8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.35 * (1 - s * 0.35),
      lift: 2.2 * (1 - s),
      rot: facing * (-4 * (1 - s)),
      anim: "sit",
    };
  }

  function bustlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bustle));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 3.0, rot: s * 10 * facing, anim: "walk" };
    }
    if (u < 0.84) {
      const s = (u - 0.1) / 0.74;
      const zig = Math.sin(s * Math.PI * 5.4) + 0.35 * Math.sin(s * Math.PI * 9.2);
      return {
        x: fromX + facing * (0.35 * Math.sin(s * Math.PI) + zig * 0.22),
        lift: 3.0 + Math.abs(zig) * 1.35,
        rot: facing * (10 + zig * 9),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * 0.12 * (1 - s),
      lift: 2.1 * (1 - s),
      rot: facing * (4.5 * (1 - s)),
      anim: "sit",
    };
  }

  function trophallaxisPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.trophallaxis));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.7, rot: s * 8.5 * facing, anim: "talk" };
    }
    if (u < 0.78) {
      const share = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.2);
      return {
        x: fromX + facing * share * 0.14,
        lift: 2.7 + Math.abs(share) * 1.3,
        rot: facing * (8.5 + share * 8),
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return {
      x: fromX,
      lift: 2.7 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "talk",
    };
  }

  function frassPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.frass));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.5, rot: s * -8 * facing, anim: "sit" };
    }
    if (u < 0.42) {
      const s = (u - 0.14) / 0.28;
      return {
        x: fromX + facing * 0.12 * s,
        lift: 2.5 + s * 1.6,
        rot: facing * (-8 + s * 3),
        anim: "sit",
      };
    }
    if (u < 0.78) {
      const eject = Math.sin(t * 6.2);
      return {
        x: fromX + facing * 0.12,
        lift: 4.1 + Math.abs(eject) * 0.7,
        rot: facing * (-5 + eject * 5),
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return {
      x: fromX + facing * 0.12 * (1 - s),
      lift: 4.1 * (1 - s),
      rot: facing * (-3 * (1 - s)),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "gallery" &&
      trick.kind !== "pheromone" &&
      trick.kind !== "crumb" &&
      trick.kind !== "bustle" &&
      trick.kind !== "trophallaxis" &&
      trick.kind !== "frass"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "camponotus") {
      if (next.t < CAMPONOTUS_HOLD) {
        const pose = camponotusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CAMPONOTUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CAMPONOTUS_HOLD);
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
    if (next.kind === "gallery") {
      const pose = galleryPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pheromone") {
      const pose = pheromonePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "crumb") {
      const pose = crumbPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "trophallaxis") {
      const pose = trophallaxisPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "frass") {
      const pose = frassPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bustlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    CAMPONOTUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    pennsylvanicusPose,
    honeydewPose,
    formicinePose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    camponotusPose,
    releasePose,
    galleryPose,
    pheromonePose,
    crumbPose,
    bustlePose,
    trophallaxisPose,
    frassPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCarpenterAntTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
