/** Reed ground tricks while idle — ultra-polish pass. House neighborly Anura green-frog desk life — gular / nictitate / tympanum / iliac / lentic / toepad / webbing personality (throat pouch, nictitating wipe, tympanum tip, hindlimb coil, damp perch sit, toe-pad cling, hindfoot webbing fan — never named wait or wake or still or hop or croak or frog or reed or damp or plop or bank or blotter or lorica or tegument or ampoule or bradyzoite or cryptobiosis or sporocyst or tachyzoite as trick kinds; window-play WAIT owns wait; ethogram-old hop/croak/still own those words; window-play PLOP owns plop; MiningBee owns bank; Arca owns lorica/tegument/ampoule/bradyzoite/cryptobiosis/sporocyst/tachyzoite; guest slug Reed / key frog only for isKey matching — accept "frog" and "reed"; do NOT name a trick "frog" or "reed" or "wait" or "wake" or "still" or "hop" or "croak" or "damp" or "plop" or "bank" or "blotter" or "lorica" or "cryptobiosis") — not Arca sealed-vault, not Bloom axolotl, not Ink turtle, not Hush shade-umbra, not Beacon field-magnet, not Brine salt-brine, not Knot junction-weave, not Dusk twilight-belt, not Shard living-crystal, not Drift methane-cloud, not Choir chord-body, not Gleam lamp-drinker, not Pebble toad verruca/burrow/parotoid/tubercle/bufonid; never named wait / wake / still / hop / croak / damp / plop / bank / blotter / frog / reed / lorica / tegument / ampoule / bradyzoite / cryptobiosis / sporocyst / tachyzoite / verruca / burrow / parotoid / tubercle / bufonid — Echo/Quill birds — do not copy. gular throat-pouch inflate without naming croak, nictitate nictitating wipe without naming damp, tympanum tip-listen, iliac hindlimb coil without naming hop, lentic damp-perch metabolic hold, toepad toe-pad cling settle (THE adhesive toe-disc tell), webbing hindfoot webbing fan stir (THE anuran swim-foot tell); chorus / rivulet / spring thank-yous. Feed-happy after eat. Card-open freeze and window-play WAIT do not swallow a thank-you. Sleep, hide, leave win. Same map as web frog-tricks.ts. Window-play WAIT/PLOP unchanged. Ethogram softs + freeze — never names hop/croak/still as trick kinds. Hinge owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via frog.wav. */
(function (root) {
  const TRICK_KEY = "frog";
  const TRICKS = ["gular", "nictitate", "tympanum", "iliac", "lentic", "toepad", "webbing"];
  const HAPPY = ["chorus", "rivulet", "spring"];
  const HAPPY_DUR = { chorus: 1.58, rivulet: 1.71, spring: 1.66 };
  const LENTIC_HOLD = 10.8;
  const RELEASE_S = 1.14;
  const DUR = {
      lentic: LENTIC_HOLD + RELEASE_S,
      gular: 2.31,
      nictitate: 2.39,
      tympanum: 2.24,
      iliac: 2.36,
      toepad: 2.28,
      webbing: 2.42,
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
      if (kind === "lentic")
          return 38 + roll * 24;
      if (kind === "toepad" || kind === "webbing" || kind === "nictitate")
          return 12 + roll * 9;
      if (kind === "gular" || kind === "tympanum" || kind === "iliac")
          return 11 + roll * 8;
      return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "lentic";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "lentic") {
          if (roll < 0.18)
              return "gular";
          if (roll < 0.34)
              return "nictitate";
          if (roll < 0.5)
              return "tympanum";
          if (roll < 0.66)
              return "iliac";
          if (roll < 0.83)
              return "toepad";
          return "webbing";
      }
      if (lastKind === "gular") {
          if (roll < 0.2)
              return "lentic";
          if (roll < 0.36)
              return "nictitate";
          if (roll < 0.52)
              return "tympanum";
          if (roll < 0.68)
              return "iliac";
          if (roll < 0.84)
              return "toepad";
          return "webbing";
      }
      if (lastKind === "nictitate") {
          if (roll < 0.18)
              return "lentic";
          if (roll < 0.34)
              return "gular";
          if (roll < 0.5)
              return "tympanum";
          if (roll < 0.66)
              return "iliac";
          if (roll < 0.83)
              return "toepad";
          return "webbing";
      }
      if (lastKind === "toepad" || lastKind === "webbing") {
          if (roll < 0.16)
              return "lentic";
          if (roll < 0.32)
              return "gular";
          if (roll < 0.48)
              return "nictitate";
          if (roll < 0.64)
              return "tympanum";
          if (roll < 0.8)
              return "iliac";
          return lastKind === "toepad" ? "webbing" : "toepad";
      }
      if (roll < 0.14)
          return "lentic";
      if (roll < 0.28)
          return "gular";
      if (roll < 0.42)
          return "nictitate";
      if (roll < 0.56)
          return "tympanum";
      if (roll < 0.7)
          return "iliac";
      if (roll < 0.85)
          return "toepad";
      return "webbing";
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
      return key === TRICK_KEY || key === "reed";
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
      const roll = rand == null ? Math.random() : rand;
      const pool = HAPPY.filter((k) => k !== lastKind);
      const list = pool.length ? pool : [...HAPPY];
      return list[Math.floor(roll * list.length) % list.length];
  }
  function beginHappy(kind, x, facing) {
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "chorus";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "chorus" ? "talk" : name === "rivulet" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function chorusPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chorus));
      if (u < 0.2) {
          const s = u / 0.2;
          return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
      }
      if (u < 0.76) {
          const tick = Math.sin(t * 1.72);
          return {
              lift: 2.8 + Math.abs(tick) * 1.4,
              rot: 12 + tick * 10,
              dx: tick * 0.12,
              anim: "talk",
          };
      }
      const s = (u - 0.76) / 0.24;
      return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }
  function rivuletPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.rivulet));
      if (u < 0.18) {
          const s = u / 0.18;
          return { lift: s * 3.4, rot: s * -14, dx: s * 0.15, anim: "play" };
      }
      if (u < 0.78) {
          const swell = Math.sin(t * 2.1);
          return {
              lift: 3.4 + Math.abs(swell) * 1.6,
              rot: -14 + swell * 12,
              dx: swell * 0.18,
              anim: "play",
          };
      }
      const s = (u - 0.78) / 0.22;
      return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }
  function springPose(t) {
      return {
          lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
          rot: Math.sin(t * 0.9) * 8,
          dx: Math.sin(t * 0.7) * 0.1,
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
      if (next.kind === "chorus") {
          const pose = chorusPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "rivulet") {
          const pose = rivuletPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = springPose(next.t);
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
      const anim = kind === "lentic"
          ? "sit"
          : kind === "gular"
              ? "talk"
              : kind === "nictitate"
                  ? "sit"
                  : kind === "tympanum"
                      ? "talk"
                      : kind === "iliac"
                          ? "play"
                          : kind === "toepad"
                              ? "sit"
                              : kind === "webbing"
                                  ? "play"
                                  : "sit";
      return {
          kind: TRICKS.indexOf(kind) >= 0 ? kind : "gular",
          phase: kind === "lentic" ? "hold" : "go",
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
  function lenticPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: Math.sin(t * 0.55) * 6,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function gularPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.gular));
      if (u < 0.16) {
          const s = smoothstep(u / 0.16);
          return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "talk" };
      }
      if (u < 0.72) {
          const s = (u - 0.16) / 0.56;
          const caseShell = Math.sin(s * Math.PI * 3.4);
          const settle = smoothstep(s);
          return {
              x: fromX + facing * (settle * 0.8 + caseShell * 0.15),
              lift: 3.2 + Math.abs(caseShell) * 0.8,
              rot: facing * (-8 + caseShell * 12 + settle * 4),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.72) / 0.28);
      return {
          x: fromX + facing * 0.6 * (1 - s),
          lift: 1.6 * (1 - s),
          rot: facing * (-2 * (1 - s)),
          anim: "sit",
      };
  }
  function nictitatePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.nictitate));
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" };
      }
      if (u < 0.7) {
          const s = (u - 0.14) / 0.56;
          const press = Math.sin(s * Math.PI * 3.6);
          const membrane = smoothstep(s);
          return {
              x: fromX + facing * (membrane * 0.45 + press * 0.12),
              lift: 2.6 + Math.abs(press) * 1.6,
              rot: facing * (10 + press * 8),
              anim: "talk",
          };
      }
      if (u < 0.88) {
          const s = (u - 0.7) / 0.18;
          const settle = smoothstep(s);
          return {
              x: fromX + facing * 0.28 * (1 - settle * 0.4),
              lift: 1.8 + settle * 0.4,
              rot: facing * (4 - settle * 6),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.88) / 0.12);
      return {
          x: fromX + facing * 0.12 * (1 - s),
          lift: 0.8 * (1 - s),
          rot: facing * (1.2 * (1 - s)),
          anim: "sit",
      };
  }
  function tympanumPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.tympanum));
      if (u < 0.16) {
          const s = smoothstep(u / 0.16);
          return { x: fromX, lift: s * 2.4, rot: s * 8 * facing, anim: "talk" };
      }
      if (u < 0.52) {
          const s = (u - 0.16) / 0.36;
          const tip = smoothstep(s);
          return {
              x: fromX + facing * tip * 0.35,
              lift: 2.4 + tip * 1.4,
              rot: facing * (8 - tip * 14),
              anim: "talk",
          };
      }
      if (u < 0.82) {
          const s = (u - 0.52) / 0.3;
          const hold = Math.sin(s * Math.PI * 2.8);
          return {
              x: fromX + facing * 0.35,
              lift: 3.2 + Math.abs(hold) * 0.8,
              rot: facing * (-4 + hold * 10),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.82) / 0.18);
      return {
          x: fromX + facing * 0.35 * (1 - s),
          lift: 1.6 * (1 - s),
          rot: facing * (-2 * (1 - s)),
          anim: "sit",
      };
  }
  function iliacPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.iliac));
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.6, rot: s * -10 * facing, anim: "play" };
      }
      if (u < 0.78) {
          const s = (u - 0.14) / 0.64;
          const tuck = Math.sin(s * Math.PI * 3.2);
          const dormant = Math.sin(s * Math.PI * 1.6);
          return {
              x: fromX + facing * (tuck * 0.4 + dormant * 0.15),
              lift: 2.6 + Math.abs(dormant) * 1.4 + Math.abs(tuck) * 0.6,
              rot: facing * (-10 + dormant * 12 + tuck * 8),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 1.2 * (1 - s),
          rot: facing * (-2 * (1 - s)),
          anim: "sit",
      };
  }
  function toepadPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.toepad));
      if (u < 0.16) {
          const s = smoothstep(u / 0.16);
          return { x: fromX, lift: s * 1.8, rot: s * -8 * facing, anim: "sit" };
      }
      if (u < 0.55) {
          const s = (u - 0.16) / 0.39;
          const rock = Math.sin(s * Math.PI * 4.2);
          return {
              x: fromX + facing * (s * 0.6 + rock * 0.2),
              lift: 1.8 + Math.abs(rock) * 1.6,
              rot: facing * (-8 + rock * 14),
              anim: "sit",
          };
      }
      if (u < 0.78) {
          const s = (u - 0.55) / 0.23;
          const spin = Math.sin(s * Math.PI * 3.4);
          return {
              x: fromX + facing * 0.6,
              lift: 2.8 + Math.abs(spin) * 0.8,
              rot: facing * (4 + spin * 10),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + facing * 0.6 * (1 - s),
          lift: 1.6 * (1 - s),
          rot: facing * (2 * (1 - s)),
          anim: "idle",
      };
  }
  function webbingPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.webbing));
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" };
      }
      if (u < 0.4) {
          const s = (u - 0.14) / 0.26;
          const sip = smoothstep(s);
          return {
              x: fromX + facing * sip * 0.5,
              lift: 2.6 + sip * 2.4,
              rot: facing * (10 + sip * 8),
              anim: "talk",
          };
      }
      if (u < 0.78) {
          const s = (u - 0.4) / 0.38;
          const drink = Math.sin(s * Math.PI * 3.2);
          return {
              x: fromX + facing * (0.5 + drink * 0.3),
              lift: 4.8 + Math.abs(drink) * 0.8,
              rot: facing * (6 + drink * 14),
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
          trick.kind !== "gular" &&
          trick.kind !== "nictitate" &&
          trick.kind !== "tympanum" &&
          trick.kind !== "iliac" &&
          trick.kind !== "toepad" &&
          trick.kind !== "webbing") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "lentic") {
          if (next.t < LENTIC_HOLD) {
              const pose = lenticPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < LENTIC_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - LENTIC_HOLD);
              next.phase = "release";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
      }
      const hold = DUR[next.kind];
      const fromX = trick.fromX != null ? trick.fromX : trick.x;
      if (next.kind === "gular") {
          const pose = gularPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "nictitate") {
          const pose = nictitatePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "tympanum") {
          const pose = tympanumPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "iliac") {
          const pose = iliacPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "toepad") {
          const pose = toepadPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "webbing") {
          const pose = webbingPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      if (next.t >= hold)
          return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
      next.phase = "go";
      return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    DUR,
    LENTIC_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    lenticPose,
    releasePose,
    gularPose,
    nictitatePose,
    tympanumPose,
    iliacPose,
    toepadPose,
    webbingPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    chorusPose,
    rivuletPose,
    springPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFrogTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
