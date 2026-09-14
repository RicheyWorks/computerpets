/** Velvet ground tricks while idle — ultra-polish pass. House neighborly Theraphosidae / Aphonopelma desert-blonde (tarantula / Velvet) desk life — urticate / threat / cork / ecdysis / rastellum / apophysis / aphonopelma personality (urticate urticating-setae abdomen kick without naming flick or kick or brush or hair or sting or spray or defense or attack, threat threat-rear pedipalp raise without naming rear or stand or scare or display or warn or charge or rise or tower, cork burrow-mouth silk plug without naming plug or seal or burrow or nest or silk or web or door or lid or cork alone as wait, ecdysis molt soft-back posture without naming molt or shed or flip or soft or belly or roll or ecdysis alone as sleep, rastellum fossorial cheliceral rake without naming dig or burrow or rake or scrape or shovel or tunnel or litter, apophysis tibial mating-spur flash without naming spur or kick or jab or tibia or strike or fence or hook, long aphonopelma sit_hold under the scrap lamp (THE aphonopelma sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or oil or dab or tip or drum or sip or hover or stridulate or velvet as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play CARRY unchanged if already fine; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Chirp owns stridulate; Jet owns velvet_worm life; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Velvet / key tarantula only for isKey matching — accept "tarantula" and "velvet"; do NOT name a trick "tarantula" or "velvet" or "flick" or "kick" or "burrow" or "molt" or "silk" or "web" or "gaze" or "still" or "stridulate") — not Prowl wolf_spider life, not Leap jumping_spider life, not Loom orb_weaver life, not Hour widow life, not Jet velvet_worm life, not bird life. Urticate setae kick without naming flick, threat rear without naming stand, cork plug without naming burrow, ecdysis soft-back without naming molt, rastellum fossorial rake without naming dig, apophysis tibial flash without naming spur, aphonopelma long sit_hold under the scrap lamp (THE aphonopelma sit_hold tell); chalcodes / hentzi / iodius thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web tarantula-tricks.ts. Window-play CARRY unchanged. Ethogram softs + freeze — never names flick/walk/still/tarantula/velvet as bare ethogram-only trick kinds. True desert-blonde theraphosid desk life only — distinct from Prowl, Leap, Loom, Hour, Jet, and birds. Next house-order ultra: Hour / widow. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via tarantula.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "tarantula";
  const TRICKS = ["urticate", "threat", "cork", "ecdysis", "rastellum", "apophysis", "aphonopelma"];
  const HAPPY = ["chalcodes", "hentzi", "iodius"];
  const HAPPY_DUR = { chalcodes: 1.70, hentzi: 1.82, iodius: 1.71 };
  const APHONOPELMA_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      aphonopelma: APHONOPELMA_HOLD + RELEASE_S,
      urticate: 2.36,
      threat: 2.50,
      cork: 2.56,
      ecdysis: 2.42,
      rastellum: 2.44,
      apophysis: 2.39,
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
      if (kind === "aphonopelma")
          return 40 + roll * 26;
      if (kind === "rastellum" || kind === "apophysis" || kind === "urticate")
          return 12.8 + roll * 9.4;
      if (kind === "threat" || kind === "cork" || kind === "ecdysis")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "aphonopelma";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "aphonopelma") {
          if (roll < 0.17)
              return "urticate";
          if (roll < 0.33)
              return "threat";
          if (roll < 0.49)
              return "cork";
          if (roll < 0.65)
              return "ecdysis";
          if (roll < 0.83)
              return "rastellum";
          return "apophysis";
      }
      if (lastKind === "urticate") {
          if (roll < 0.16)
              return "aphonopelma";
          if (roll < 0.32)
              return "threat";
          if (roll < 0.48)
              return "cork";
          if (roll < 0.64)
              return "ecdysis";
          if (roll < 0.82)
              return "rastellum";
          return "apophysis";
      }
      if (lastKind === "threat") {
          if (roll < 0.14)
              return "aphonopelma";
          if (roll < 0.3)
              return "urticate";
          if (roll < 0.46)
              return "cork";
          if (roll < 0.62)
              return "ecdysis";
          if (roll < 0.8)
              return "rastellum";
          return "apophysis";
      }
      if (lastKind === "rastellum" || lastKind === "apophysis") {
          if (roll < 0.14)
              return "aphonopelma";
          if (roll < 0.3)
              return "urticate";
          if (roll < 0.46)
              return "threat";
          if (roll < 0.62)
              return "cork";
          if (roll < 0.78)
              return "ecdysis";
          return lastKind === "rastellum" ? "apophysis" : "rastellum";
      }
      if (roll < 0.14)
          return "aphonopelma";
      if (roll < 0.28)
          return "urticate";
      if (roll < 0.42)
          return "threat";
      if (roll < 0.56)
          return "cork";
      if (roll < 0.7)
          return "ecdysis";
      if (roll < 0.85)
          return "rastellum";
      return "apophysis";
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
      return key === TRICK_KEY || key === "velvet";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "chalcodes";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "chalcodes" ? "sit" : name === "hentzi" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function chalcodesPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chalcodes));
      if (u < 0.16) {
          const s = u / 0.16;
          return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
      }
      if (u < 0.82) {
          const flash = Math.sin(t * 1.72);
          return {
              lift: 2.8 + Math.abs(flash) * 1.4,
              rot: 12 + flash * 8,
              dx: 0,
              anim: "talk",
          };
      }
      const s = (u - 0.82) / 0.18;
      return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }
  function hentziPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hentzi));
      if (u < 0.14) {
          const s = u / 0.14;
          return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" };
      }
      if (u < 0.84) {
          const wriggle = Math.sin(t * 2.1);
          return {
              lift: 3.4 + Math.abs(wriggle) * 1.6,
              rot: -14 + wriggle * 10,
              dx: 0.08,
              anim: "play",
          };
      }
      const s = (u - 0.84) / 0.16;
      return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }
  function iodiusPose(t) {
      return {
          lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
          rot: Math.sin(t * 0.52) * 6,
          dx: 0,
          anim: "sit",
      };
  }
  function stepHappy(happy, dt, flags) {
      if (happyShouldAbort(flags)) {
          return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...happy, t: happy.t + Math.max(0, dt) };
      const hold = HAPPY_DUR[next.kind];
      if (next.kind === "chalcodes") {
          const pose = chalcodesPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "hentzi") {
          const pose = hentziPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = iodiusPose(next.t);
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
      const anim = kind === "aphonopelma"
          ? "sit"
          : kind === "urticate"
              ? "play"
              : kind === "threat"
                  ? "sit"
                  : kind === "cork"
                      ? "talk"
                      : kind === "ecdysis"
                          ? "sit"
                          : kind === "rastellum"
                              ? "walk"
                              : kind === "apophysis"
                                  ? "walk"
                                  : "sit";
      return {
          kind: TRICKS.indexOf(kind) >= 0 ? kind : "urticate",
          phase: kind === "aphonopelma" ? "hold" : "go",
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
  function aphonopelmaPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.14) * 4,
          anim: "sit",
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function urticatePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.urticate));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.5, rot: s * -14 * face, anim: "play" };
      }
      if (u < 0.78) {
          const snap = Math.sin(t * 2.4);
          return {
              x: fromX - face * snap * 0.14,
              lift: 3.5 + Math.abs(snap) * 1.5,
              rot: face * (-15 + snap * 11),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 1.4 * (1 - s),
          rot: face * (-4 * (1 - s)),
          anim: "idle",
      };
  }
  function threatPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.threat));
      const face = facing == null ? 1 : facing;
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 3.9, rot: s * -16 * face, anim: "sit" };
      }
      if (u < 0.48) {
          const s = smoothstep((u - 0.12) / 0.36);
          return {
              x: fromX + face * (2.2 + s * 4.5) * 0,
              lift: 3.6 + Math.sin(s * Math.PI) * 2.2,
              rot: face * (-16 + s * 6),
              anim: "sit",
          };
      }
      if (u < 0.78) {
          const s = (u - 0.48) / 0.3;
          const settle = Math.sin(s * Math.PI * 2.1);
          return {
              x: fromX,
              lift: 4.4 + Math.abs(settle) * 1.1,
              rot: face * (-18 + settle * 8),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 1.4 * (1 - s),
          rot: face * (-3 * (1 - s)),
          anim: "idle",
      };
  }
  function corkPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.cork));
      const face = facing == null ? 1 : facing;
      if (u < 0.16) {
          const s = smoothstep(u / 0.16);
          return { x: fromX + face * s * 0.8, lift: s * 2.2, rot: s * 8 * face, anim: "talk" };
      }
      if (u < 0.72) {
          const mud = Math.sin(t * 1.6);
          return {
              x: fromX + face * (0.8 + mud * 0.4),
              lift: 2.2 + Math.abs(mud) * 1.0,
              rot: face * (8 + mud * 10),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.72) / 0.28);
      return {
          x: fromX + face * 0.8 * (1 - s),
          lift: 1.2 * (1 - s),
          rot: face * (3 * (1 - s)),
          anim: s > 0.6 ? "idle" : "talk",
      };
  }
  function ecdysisPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.ecdysis));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.4, rot: s * 14 * face, anim: "sit" };
      }
      if (u < 0.84) {
          const tap = Math.sin(t * 2.8);
          return {
              x: fromX + face * tap * 0.2,
              lift: 2.4 + Math.abs(tap) * 1.1,
              rot: face * (14 + tap * 8),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.84) / 0.16);
      return {
          x: fromX,
          lift: 1.2 * (1 - s),
          rot: face * (3 * (1 - s)),
          anim: "idle",
      };
  }
  function rastellumPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.rastellum));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "walk" };
      }
      if (u < 0.55) {
          const pulse = Math.sin(t * 3.2);
          return {
              x: fromX,
              lift: 2.8 + pulse * 1.6,
              rot: face * (12 + pulse * 14),
              anim: "walk",
          };
      }
      if (u < 0.78) {
          const scent = Math.sin(t * 1.1);
          return {
              x: fromX + face * scent * 0.15,
              lift: 4.0 + Math.abs(scent) * 0.6,
              rot: face * (22 + scent * 4),
              anim: "walk",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 2.0 * (1 - s),
          rot: face * (8 * (1 - s)),
          anim: "idle",
      };
  }
  function apophysisPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.apophysis));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "walk" };
      }
      if (u < 0.55) {
          const flash = Math.abs(Math.sin(t * 2.6));
          return {
              x: fromX + face * flash * 0.2,
              lift: 3.4 + flash * 1.4,
              rot: face * (-12 - flash * 10),
              anim: "walk",
          };
      }
      if (u < 0.78) {
          const warn = Math.sin(t * 1.4);
          return {
              x: fromX,
              lift: 4.4 + Math.abs(warn) * 0.7,
              rot: face * (-18 + warn * 6),
              anim: "walk",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 1.8 * (1 - s),
          rot: face * (-5 * (1 - s)),
          anim: "idle",
      };
  }
  function stepTrick(trick, dt, flags) {
      if (shouldAbort(flags)) {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      const fromX = trick.fromX != null ? trick.fromX : trick.x;
      if (next.kind === "aphonopelma") {
          if (next.t < APHONOPELMA_HOLD) {
              const pose = aphonopelmaPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = pose.anim;
              return next;
          }
          if (next.t < APHONOPELMA_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - APHONOPELMA_HOLD);
              next.phase = "release";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
      }
      const hold = DUR[next.kind];
      if (next.kind === "urticate") {
          const pose = urticatePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "threat") {
          const pose = threatPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "cork") {
          const pose = corkPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "ecdysis") {
          const pose = ecdysisPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "rastellum") {
          const pose = rastellumPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = apophysisPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      if (next.t >= hold)
          return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
      return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    APHONOPELMA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    aphonopelmaPose,
    releasePose,
    urticatePose,
    threatPose,
    corkPose,
    ecdysisPose,
    rastellumPose,
    apophysisPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    chalcodesPose,
    hentziPose,
    iodiusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetTarantulaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
