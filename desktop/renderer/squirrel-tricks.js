/** Cache ground tricks while idle — ultra-polish pass. House neighborly Sciuridae / Sciurus carolinensis eastern gray squirrel oak-stash desk life (squirrel / Cache) — nutbury / tailflick / cheekpouch / branchleap / barkscramble / scold / sciurus personality (nutbury scatter-bury nut stash without naming bury or dig or cache or hide or nut or acorn or hoard or plant or scrape, tailflick caudal flick signal without naming flag or tail or wave or bob or tip or alarm or snort or flagtail, cheekpouch cheek-fill pocket without naming cheek or pouch or stuff or chew or eat or feed or browse or nibble or edgebrowse, branchleap desk-branch bound without naming leap or hop or jump or spring or dash or sprint or run or dart or fly or soar or glide, barkscramble bark scramble climb without naming climb or scramble or bark or trunk or tree or scurry or race or chase, scold chatter-scold alarm without naming chatter or scold or bark or cry or call or voice or chirp or beep or alarm or snort, long sciurus Sciurus carolinensis freeze-alert oak hold (THE sciurus sit_hold tell) — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or wingwrap or traguscup or thumbcrawl or duskhang or echolocate or calcar or eptesicus or flagtail or edgebrowse or earswivel or forestamp or stotbound or snortblow or odocoileus or hang or roost or flutter or still or bat or cape or squirrel or cache or hop or bury as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play RUN unchanged if already fine; Cape owns wingwrap/traguscup/thumbcrawl/duskhang/echolocate/calcar/eptesicus; Flag owns flagtail/edgebrowse/earswivel/forestamp/stotbound/snortblow/odocoileus; Dee/chickadee owns cache as bird trick word — do NOT name a trick cache; Glide flying_squirrel later owns glide — leave glide/soar free; Rue fox / Pip dog / Miso cat / Thimble rabbit stay distinct mammal peers; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own bird tricks; guest slug Cache / key squirrel only for isKey matching — accept "squirrel" and "cache"; do NOT name a trick "squirrel" or "cache" or "hop" or "bury" or "chipmunk" or "marmot" or "prairie" or "flying" or "glider" or "glide" or "soar") — not Cape bat life, not Flag deer life, not Dee chickadee life, not Glide flying-squirrel life, not Slick otter life, not bird life. Nutbury scatter-bury without naming bury, tailflick caudal flick without naming flagtail, cheekpouch cheek-fill without naming pouch, branchleap bound without naming hop, barkscramble bark scramble without naming climb, scold chatter-scold without naming cry, sciurus long sit_hold in the oak stash (THE sciurus sit_hold tell); oakstash / drey / scatterhoard thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web squirrel-tricks.ts. Window-play RUN unchanged. Ethogram softs + freeze — never names bury/hop/chatter/squirrel as bare ethogram-only trick kinds. True eastern gray squirrel Sciuridae desk life only — distinct from Cape, Flag, Dee, Glide, Slick, and birds. Next house-order ultra: Slick / otter. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via squirrel.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "squirrel";
  const TRICKS = ["nutbury", "tailflick", "cheekpouch", "branchleap", "barkscramble", "scold", "sciurus"];
  const HAPPY = ["oakstash", "drey", "scatterhoard"];
  const HAPPY_DUR = { oakstash: 1.70, drey: 1.84, scatterhoard: 1.76 };
  const SCIURUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      sciurus: SCIURUS_HOLD + RELEASE_S,
      nutbury: 2.48,
      tailflick: 2.42,
      cheekpouch: 2.56,
      branchleap: 2.44,
      barkscramble: 2.40,
      scold: 2.38,
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
      if (kind === "sciurus")
          return 40 + roll * 26;
      if (kind === "barkscramble" || kind === "scold" || kind === "nutbury")
          return 12.8 + roll * 9.4;
      if (kind === "tailflick" || kind === "cheekpouch" || kind === "branchleap")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "sciurus";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "sciurus") {
          if (roll < 0.17)
              return "nutbury";
          if (roll < 0.33)
              return "tailflick";
          if (roll < 0.49)
              return "cheekpouch";
          if (roll < 0.65)
              return "branchleap";
          if (roll < 0.83)
              return "barkscramble";
          return "scold";
      }
      if (lastKind === "nutbury") {
          if (roll < 0.16)
              return "sciurus";
          if (roll < 0.32)
              return "tailflick";
          if (roll < 0.48)
              return "cheekpouch";
          if (roll < 0.64)
              return "branchleap";
          if (roll < 0.82)
              return "barkscramble";
          return "scold";
      }
      if (lastKind === "tailflick") {
          if (roll < 0.14)
              return "sciurus";
          if (roll < 0.3)
              return "nutbury";
          if (roll < 0.46)
              return "cheekpouch";
          if (roll < 0.62)
              return "branchleap";
          if (roll < 0.8)
              return "barkscramble";
          return "scold";
      }
      if (lastKind === "barkscramble" || lastKind === "scold") {
          if (roll < 0.14)
              return "sciurus";
          if (roll < 0.3)
              return "nutbury";
          if (roll < 0.46)
              return "tailflick";
          if (roll < 0.62)
              return "cheekpouch";
          if (roll < 0.78)
              return "branchleap";
          return lastKind === "barkscramble" ? "scold" : "barkscramble";
      }
      if (roll < 0.14)
          return "sciurus";
      if (roll < 0.28)
          return "nutbury";
      if (roll < 0.42)
          return "tailflick";
      if (roll < 0.56)
          return "cheekpouch";
      if (roll < 0.7)
          return "branchleap";
      if (roll < 0.85)
          return "barkscramble";
      return "scold";
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
      return key === TRICK_KEY || key === "cache";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "oakstash";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "oakstash" ? "sit" : name === "drey" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function oakstashPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.oakstash));
      if (u < 0.14) {
          const s = u / 0.14;
          return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" };
      }
      if (u < 0.78) {
          const flash = Math.sin(t * 2.2);
          return {
              lift: 2.8 + Math.abs(flash) * 1.4,
              rot: 12 + flash * 8,
              dx: flash * 0.08,
              anim: "sit",
          };
      }
      const s = (u - 0.78) / 0.22;
      return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }
  function dreyPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.drey));
      if (u < 0.12) {
          const s = u / 0.12;
          return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" };
      }
      if (u < 0.8) {
          const wriggle = Math.sin(t * 2.6);
          return {
              lift: 3.4 + Math.abs(wriggle) * 1.6,
              rot: -14 + wriggle * 10,
              dx: wriggle * 0.12,
              anim: "play",
          };
      }
      const s = (u - 0.8) / 0.2;
      return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }
  function scatterhoardPose(t) {
      return {
          lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
          rot: Math.sin(t * 0.58) * 8,
          dx: Math.sin(t * 0.4) * 0.06,
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
      if (next.kind === "oakstash") {
          const pose = oakstashPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "drey") {
          const pose = dreyPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = scatterhoardPose(next.t);
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
      const anim = kind === "sciurus"
          ? "sit"
          : kind === "nutbury"
              ? "play"
              : kind === "tailflick"
                  ? "talk"
                  : kind === "cheekpouch"
                      ? "play"
                      : kind === "branchleap"
                          ? "play"
                          : kind === "barkscramble"
                              ? "talk"
                              : kind === "scold"
                                  ? "play"
                                  : "sit";
      return {
          kind,
          phase: kind === "sciurus" ? "hold" : "go",
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
  function sciurusPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.36) * 0.35,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function nutburyPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.nutbury));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "play" };
      }
      if (u < 0.78) {
          const tip = Math.sin(t * 2.4);
          return {
              x: fromX + face * (0.8 + tip * 0.12),
              lift: 3.5 + Math.abs(tip) * 1.5,
              rot: face * (16 + tip * 10),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + face * 0.8 * (1 - s),
          lift: 1.4 * (1 - s),
          rot: face * (4 * (1 - s)),
          anim: "idle",
      };
  }
  function tailflickPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.tailflick));
      const face = facing == null ? 1 : facing;
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 2.6, rot: s * -10 * face, anim: "talk" };
      }
      if (u < 0.78) {
          const bob = Math.sin(t * 2.8);
          return {
              x: fromX + face * bob * 0.5,
              lift: 2.6 + Math.abs(bob) * 1.4,
              rot: face * (-10 + bob * 12),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 1.2 * (1 - s),
          rot: face * (-3 * (1 - s)),
          anim: "idle",
      };
  }
  function cheekpouchPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.cheekpouch));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.8, rot: s * 14 * face, anim: "play" };
      }
      if (u < 0.78) {
          const cast = Math.sin(t * 2.6);
          return {
              x: fromX - face * cast * 0.16,
              lift: 3.6 + Math.abs(cast) * 1.6,
              rot: face * (14 + cast * 12),
              anim: "play",
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
  function branchleapPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.branchleap));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "play" };
      }
      if (u < 0.78) {
          const nestle = Math.sin(t * 2.2);
          return {
              x: fromX + face * (0.6 + nestle * 0.1),
              lift: 2.4 + Math.abs(nestle) * 1.8,
              rot: face * (12 + nestle * 8),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX + face * 0.6 * (1 - s),
          lift: 1.2 * (1 - s),
          rot: face * (3 * (1 - s)),
          anim: "idle",
      };
  }
  function barkscramblePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.barkscramble));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "talk" };
      }
      if (u < 0.55) {
          const tip = Math.sin(t * 2.0);
          return {
              x: fromX + face * tip * 0.08,
              lift: 2.8 + tip * 1.6,
              rot: face * (-12 + tip * 10),
              anim: "talk",
          };
      }
      if (u < 0.78) {
          const hush = Math.sin(t * 0.9);
          return {
              x: fromX,
              lift: 4.0 + Math.abs(hush) * 0.6,
              rot: face * (-4 + hush * 3),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 2.0 * (1 - s),
          rot: face * (-2 * (1 - s)),
          anim: "idle",
      };
  }
  function scoldPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.scold));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "play" };
      }
      if (u < 0.55) {
          const stretch = Math.sin(t * 2.3);
          return {
              x: fromX + face * stretch * 0.1,
              lift: 3.4 + stretch * 1.4,
              rot: face * (12 + stretch * 9),
              anim: "play",
          };
      }
      if (u < 0.78) {
          const hush = Math.sin(t * 0.85);
          return {
              x: fromX,
              lift: 4.4 + Math.abs(hush) * 0.7,
              rot: face * (5 + hush * 3),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 1.8 * (1 - s),
          rot: face * (2 * (1 - s)),
          anim: "idle",
      };
  }
  function stepTrick(trick, dt, flags) {
      if (!trick || trick.phase === "done")
          return trick;
      if (shouldAbort(flags) && trick.kind !== "nutbury" && trick.kind !== "tailflick" && trick.kind !== "cheekpouch" && trick.kind !== "branchleap" && trick.kind !== "barkscramble" && trick.kind !== "scold") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "sciurus") {
          if (next.t < SCIURUS_HOLD) {
              const pose = sciurusPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < SCIURUS_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - SCIURUS_HOLD);
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
      if (next.kind === "nutbury") {
          const pose = nutburyPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "tailflick") {
          const pose = tailflickPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "cheekpouch") {
          const pose = cheekpouchPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "branchleap") {
          const pose = branchleapPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "barkscramble") {
          const pose = barkscramblePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = scoldPose(next.t, fromX, trick.facing);
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
    SCIURUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    sciurusPose,
    releasePose,
    nutburyPose,
    tailflickPose,
    cheekpouchPose,
    branchleapPose,
    barkscramblePose,
    scoldPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    oakstashPose,
    dreyPose,
    scatterhoardPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSquirrelTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
