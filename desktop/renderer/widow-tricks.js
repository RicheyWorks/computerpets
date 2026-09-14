/** Hour ground tricks while idle — ultra-polish pass. House neighborly Theridiidae / Latrodectus southern black-widow (widow / Hour) desk life — hourglass / tangle / wrap / gumfoot / combfoot / theridiid / latrodectus personality (hourglass ventral red-hourglass abdomen tip without naming flash or belly or mark or show or display or glass or red or warn, tangle messy irregular cobweb weave without naming web or silk or spin or nest or nestguard or mesh or lace or snare or radiate or stabilimentum or swathe or strum, wrap sticky prey-wrap wind without naming bite or kill or eat or prey or coil or wind alone as play or bind, gumfoot sticky gumfoot trap-line drop without naming trap or line or glue or sticky or foot or drop or hang or pendant or fall, combfoot theridiid comb-footed tarsus rake without naming comb or foot or rake or scrape or brush or tarsus alone as walk, theridiid family cobweb settle without naming family or settle or perch or crouch or still, long latrodectus Latrodectus mactans dark-corner tangle perch (THE latrodectus sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or urticate or threat or cork or ecdysis or rastellum or apophysis or aphonopelma or oil or dab or tip or drum or sip or hover or stridulate or hour or widow as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play CARRY unchanged if already fine; Velvet owns urticate/threat/cork/ecdysis/rastellum/apophysis/aphonopelma; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Chirp owns stridulate; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Hour / key widow only for isKey matching — accept "widow" and "hour"; do NOT name a trick "widow" or "hour" or "flash" or "silk" or "web" or "bite" or "venom" or "gaze" or "still") — not Velvet tarantula life, not Prowl wolf_spider life, not Leap jumping_spider life, not Loom orb_weaver life, not Stem harvestman life, not bird life. Hourglass abdomen tip without naming flash, tangle cobweb weave without naming web, wrap prey-wrap without naming bite, gumfoot trap-line without naming trap, combfoot tarsus rake without naming comb, theridiid family settle without naming still, latrodectus long sit_hold in the dark corner (THE latrodectus sit_hold tell); mactans / hesperus / geometricus thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web widow-tricks.ts. Window-play CARRY unchanged. Ethogram softs + freeze — never names hang/still/hour/widow as bare ethogram-only trick kinds. True theridiid black-widow desk life only — distinct from Velvet, Prowl, Leap, Loom, Stem, and birds. Next house-order ultra: Stem / harvestman. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via widow.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "widow";
  const TRICKS = ["hourglass", "tangle", "wrap", "gumfoot", "combfoot", "theridiid", "latrodectus"];
  const HAPPY = ["mactans", "hesperus", "geometricus"];
  const HAPPY_DUR = { mactans: 1.70, hesperus: 1.84, geometricus: 1.76 };
  const LATRODECTUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      latrodectus: LATRODECTUS_HOLD + RELEASE_S,
      hourglass: 2.48,
      tangle: 2.42,
      wrap: 2.56,
      gumfoot: 2.44,
      combfoot: 2.40,
      theridiid: 2.38,
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
      if (kind === "latrodectus")
          return 40 + roll * 26;
      if (kind === "combfoot" || kind === "theridiid" || kind === "hourglass")
          return 12.8 + roll * 9.4;
      if (kind === "tangle" || kind === "wrap" || kind === "gumfoot")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "latrodectus";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "latrodectus") {
          if (roll < 0.17)
              return "hourglass";
          if (roll < 0.33)
              return "tangle";
          if (roll < 0.49)
              return "wrap";
          if (roll < 0.65)
              return "gumfoot";
          if (roll < 0.83)
              return "combfoot";
          return "theridiid";
      }
      if (lastKind === "hourglass") {
          if (roll < 0.16)
              return "latrodectus";
          if (roll < 0.32)
              return "tangle";
          if (roll < 0.48)
              return "wrap";
          if (roll < 0.64)
              return "gumfoot";
          if (roll < 0.82)
              return "combfoot";
          return "theridiid";
      }
      if (lastKind === "tangle") {
          if (roll < 0.14)
              return "latrodectus";
          if (roll < 0.3)
              return "hourglass";
          if (roll < 0.46)
              return "wrap";
          if (roll < 0.62)
              return "gumfoot";
          if (roll < 0.8)
              return "combfoot";
          return "theridiid";
      }
      if (lastKind === "combfoot" || lastKind === "theridiid") {
          if (roll < 0.14)
              return "latrodectus";
          if (roll < 0.3)
              return "hourglass";
          if (roll < 0.46)
              return "tangle";
          if (roll < 0.62)
              return "wrap";
          if (roll < 0.78)
              return "gumfoot";
          return lastKind === "combfoot" ? "theridiid" : "combfoot";
      }
      if (roll < 0.14)
          return "latrodectus";
      if (roll < 0.28)
          return "hourglass";
      if (roll < 0.42)
          return "tangle";
      if (roll < 0.56)
          return "wrap";
      if (roll < 0.7)
          return "gumfoot";
      if (roll < 0.85)
          return "combfoot";
      return "theridiid";
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
      return key === TRICK_KEY || key === "hour";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "mactans";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "mactans" ? "sit" : name === "hesperus" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function mactansPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mactans));
      if (u < 0.16) {
          const s = u / 0.16;
          return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" };
      }
      if (u < 0.82) {
          const flash = Math.sin(t * 1.72);
          return {
              lift: 2.8 + Math.abs(flash) * 1.4,
              rot: 12 + flash * 8,
              dx: 0,
              anim: "sit",
          };
      }
      const s = (u - 0.82) / 0.18;
      return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }
  function hesperusPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hesperus));
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
  function geometricusPose(t) {
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
      if (next.kind === "mactans") {
          const pose = mactansPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "hesperus") {
          const pose = hesperusPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = geometricusPose(next.t);
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
      const anim = kind === "latrodectus"
          ? "sit"
          : kind === "hourglass"
              ? "sit"
              : kind === "tangle"
                  ? "talk"
                  : kind === "wrap"
                      ? "play"
                      : kind === "gumfoot"
                          ? "play"
                          : kind === "combfoot"
                              ? "walk"
                              : kind === "theridiid"
                                  ? "play"
                                  : "sit";
      return {
          kind: TRICKS.indexOf(kind) >= 0 ? kind : "hourglass",
          phase: kind === "latrodectus" ? "hold" : "go",
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
  function latrodectusPose(t) {
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
  function hourglassPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.hourglass));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.5, rot: s * 16 * face, anim: "sit" };
      }
      if (u < 0.78) {
          const tip = Math.sin(t * 2.4);
          return {
              x: fromX + face * tip * 0.12,
              lift: 3.5 + Math.abs(tip) * 1.5,
              rot: face * (16 + tip * 10),
              anim: "sit",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 1.4 * (1 - s),
          rot: face * (4 * (1 - s)),
          anim: "idle",
      };
  }
  function tanglePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.tangle));
      const face = facing == null ? 1 : facing;
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX + face * s * 0.8, lift: s * 2.6, rot: s * 10 * face, anim: "talk" };
      }
      if (u < 0.78) {
          const mess = Math.sin(t * 2.8);
          return {
              x: fromX + face * (0.8 + mess * 0.5),
              lift: 2.6 + Math.abs(mess) * 1.4,
              rot: face * (10 + mess * 12),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + face * 0.8 * (1 - s),
          lift: 1.2 * (1 - s),
          rot: face * (3 * (1 - s)),
          anim: "idle",
      };
  }
  function wrapPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.wrap));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.8, rot: s * -14 * face, anim: "play" };
      }
      if (u < 0.78) {
          const wind = Math.sin(t * 2.6);
          return {
              x: fromX - face * wind * 0.16,
              lift: 3.6 + Math.abs(wind) * 1.6,
              rot: face * (-14 + wind * 12),
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
  function gumfootPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.gumfoot));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX - face * s * 0.6, lift: s * 2.8, rot: s * -12 * face, anim: "play" };
      }
      if (u < 0.78) {
          const drop = Math.sin(t * 2.2);
          return {
              x: fromX - face * (0.6 + Math.abs(drop) * 0.4),
              lift: 2.4 + Math.abs(drop) * 1.8,
              rot: face * (-12 + drop * 10),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX - face * 0.6 * (1 - s),
          lift: 1.2 * (1 - s),
          rot: face * (-3 * (1 - s)),
          anim: "idle",
      };
  }
  function combfootPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.combfoot));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "walk" };
      }
      if (u < 0.55) {
          const rake = Math.sin(t * 3.2);
          return {
              x: fromX + face * rake * 0.18,
              lift: 2.8 + rake * 1.6,
              rot: face * (12 + rake * 14),
              anim: "walk",
          };
      }
      if (u < 0.78) {
          const comb = Math.sin(t * 1.1);
          return {
              x: fromX + face * comb * 0.12,
              lift: 4.0 + Math.abs(comb) * 0.6,
              rot: face * (22 + comb * 4),
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
  function theridiidPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.theridiid));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "play" };
      }
      if (u < 0.55) {
          const settle = Math.abs(Math.sin(t * 2.6));
          return {
              x: fromX + face * settle * 0.2,
              lift: 3.4 + settle * 1.4,
              rot: face * (-12 - settle * 10),
              anim: "play",
          };
      }
      if (u < 0.78) {
          const hush = Math.sin(t * 1.4);
          return {
              x: fromX,
              lift: 4.4 + Math.abs(hush) * 0.7,
              rot: face * (-18 + hush * 6),
              anim: "play",
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
      if (next.kind === "latrodectus") {
          if (next.t < LATRODECTUS_HOLD) {
              const pose = latrodectusPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = pose.anim;
              return next;
          }
          if (next.t < LATRODECTUS_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - LATRODECTUS_HOLD);
              next.phase = "release";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
      }
      const hold = DUR[next.kind];
      if (next.kind === "hourglass") {
          const pose = hourglassPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "tangle") {
          const pose = tanglePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "wrap") {
          const pose = wrapPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "gumfoot") {
          const pose = gumfootPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "combfoot") {
          const pose = combfootPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = theridiidPose(next.t, fromX, trick.facing);
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
    LATRODECTUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    latrodectusPose,
    releasePose,
    hourglassPose,
    tanglePose,
    wrapPose,
    gumfootPose,
    combfootPose,
    theridiidPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    mactansPose,
    hesperusPose,
    geometricusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWidowTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
