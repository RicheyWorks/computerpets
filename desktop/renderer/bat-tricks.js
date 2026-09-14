/** Cape ground tricks while idle — ultra-polish pass. House neighborly Vespertilionidae / Eptesicus fuscus big brown bat attic-nook desk life (bat / Cape) — wingwrap / traguscup / thumbcrawl / duskhang / echolocate / calcar / eptesicus personality (wingwrap plagiopatagium cape-fold without naming cape or wing or membrane or patagium or fold or wrap or cloak or flap or fly or soar or glide or hover or sip, traguscup tragus cup-and-aim without naming ear or pinna or listen or hear or sense or echo or sonar or probe or haller or antennule or palp or earswivel, thumbcrawl chiropteran thumb claw desk crawl without naming crawl or walk or run or dart or dash or sprint or chase or hunt or claw or thumb or scurry or climb, duskhang alert hang-sway without naming hang or roost or sleep or upside or invert or drop or fall or leap or hop, echolocate click-train aim without naming echo or sonar or ultrasound or cry or call or voice or bark or chirp or click or beep, calcar calcar-spur uropatagium stretch without naming calcar or spur or uropatagium or membrane or tail or tip or stretch or kick, long eptesicus Eptesicus fuscus freeze-alert attic hold (THE eptesicus sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or urticate or threat or cork or ecdysis or rastellum or apophysis or aphonopelma or hourglass or tangle or wrap or gumfoot or combfoot or theridiid or latrodectus or legwave or oscillate or autotomy or gregarious or ozopore or leiobunum or phalangium or pedipalp or metasoma or fluoresce or sanddig or pectines or booklung or centruroides or caudalwhip or acetic or palpcrush or trayburrow or pygidial or antenniform or mastigoproctus or quest or haller or hypostome or engorge or scutum or capitulum or ixodes or malleoli or suctorial or chelicrush or sprintburst or propeltidium or tracheate or eremobates or flagtail or edgebrowse or earswivel or forestamp or stotbound or snortblow or odocoileus or flagellum or oil or dab or tip or drum or sip or hover or stridulate or bat or cape or hang or roost or flutter or still as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play RUN unchanged if already fine; Flag owns flagtail/edgebrowse/earswivel/forestamp/stotbound/snortblow/odocoileus; Gale owns malleoli/suctorial/chelicrush/sprintburst/propeltidium/tracheate/eremobates; Clasp owns quest/haller/hypostome/engorge/scutum/capitulum/ixodes; Whip owns caudalwhip/acetic/palpcrush/trayburrow/pygidial/antenniform/mastigoproctus; Barb owns pedipalp/metasoma/fluoresce/sanddig/pectines/booklung/centruroides; Stem owns legwave/oscillate/autotomy/gregarious/ozopore/leiobunum/phalangium; Hour owns hourglass/tangle/wrap/gumfoot/combfoot/theridiid/latrodectus; Velvet owns urticate/threat/cork/ecdysis/rastellum/apophysis/aphonopelma; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Sip owns hover/sip; Glide flying_squirrel later — leave glide/soar free; Rue fox / Pip dog / Miso cat / Thimble rabbit stay distinct mammal peers; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own bird tricks; guest slug Cape / key bat only for isKey matching — accept "bat" and "cape"; do NOT name a trick "bat" or "cape" or "hang" or "roost" or "flutter" or "still" or "echolocation" or "chiroptera" or "megabat" or "microbat" or "vampire" or "fruit" or "fox" or "flying") — not Flag deer life, not Gale solifuge life, not Clasp tick life, not Velvet tarantula life, not Rue fox life, not Pip dog life, not Sip hummingbird life, not Glide flying-squirrel life, not bird life. Wingwrap cape-fold without naming cape, traguscup tragus-aim without naming listen, thumbcrawl thumb-crawl without naming crawl, duskhang hang-sway without naming roost, echolocate click-train without naming cry, calcar calcar-stretch without naming membrane, eptesicus long sit_hold in the attic nook (THE eptesicus sit_hold tell); fuscus / blossevillii / atticnook thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web bat-tricks.ts. Window-play RUN unchanged. Ethogram softs + freeze — never names hang/flutter/still/bat as bare ethogram-only trick kinds. True big brown bat Vespertilionidae desk life only — distinct from Flag, Gale, Clasp, Velvet, Rue, Pip, Sip, Glide, Cache, and birds. Next house-order ultra: Cache / squirrel. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via bat.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "bat";
  const TRICKS = ["wingwrap", "traguscup", "thumbcrawl", "duskhang", "echolocate", "calcar", "eptesicus"];
  const HAPPY = ["fuscus", "blossevillii", "atticnook"];
  const HAPPY_DUR = { fuscus: 1.70, blossevillii: 1.84, atticnook: 1.76 };
  const EPTESICUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      eptesicus: EPTESICUS_HOLD + RELEASE_S,
      wingwrap: 2.48,
      traguscup: 2.42,
      thumbcrawl: 2.56,
      duskhang: 2.44,
      echolocate: 2.40,
      calcar: 2.38,
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
      if (kind === "eptesicus")
          return 40 + roll * 26;
      if (kind === "echolocate" || kind === "calcar" || kind === "wingwrap")
          return 12.8 + roll * 9.4;
      if (kind === "traguscup" || kind === "thumbcrawl" || kind === "duskhang")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "eptesicus";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "eptesicus") {
          if (roll < 0.17)
              return "wingwrap";
          if (roll < 0.33)
              return "traguscup";
          if (roll < 0.49)
              return "thumbcrawl";
          if (roll < 0.65)
              return "duskhang";
          if (roll < 0.83)
              return "echolocate";
          return "calcar";
      }
      if (lastKind === "wingwrap") {
          if (roll < 0.16)
              return "eptesicus";
          if (roll < 0.32)
              return "traguscup";
          if (roll < 0.48)
              return "thumbcrawl";
          if (roll < 0.64)
              return "duskhang";
          if (roll < 0.82)
              return "echolocate";
          return "calcar";
      }
      if (lastKind === "traguscup") {
          if (roll < 0.14)
              return "eptesicus";
          if (roll < 0.3)
              return "wingwrap";
          if (roll < 0.46)
              return "thumbcrawl";
          if (roll < 0.62)
              return "duskhang";
          if (roll < 0.8)
              return "echolocate";
          return "calcar";
      }
      if (lastKind === "echolocate" || lastKind === "calcar") {
          if (roll < 0.14)
              return "eptesicus";
          if (roll < 0.3)
              return "wingwrap";
          if (roll < 0.46)
              return "traguscup";
          if (roll < 0.62)
              return "thumbcrawl";
          if (roll < 0.78)
              return "duskhang";
          return lastKind === "echolocate" ? "calcar" : "echolocate";
      }
      if (roll < 0.14)
          return "eptesicus";
      if (roll < 0.28)
          return "wingwrap";
      if (roll < 0.42)
          return "traguscup";
      if (roll < 0.56)
          return "thumbcrawl";
      if (roll < 0.7)
          return "duskhang";
      if (roll < 0.85)
          return "echolocate";
      return "calcar";
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
      return key === TRICK_KEY || key === "cape";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "fuscus";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "fuscus" ? "sit" : name === "blossevillii" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function fuscusPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.fuscus));
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
  function blossevilliiPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blossevillii));
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
  function atticnookPose(t) {
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
      if (next.kind === "fuscus") {
          const pose = fuscusPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "blossevillii") {
          const pose = blossevilliiPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = atticnookPose(next.t);
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
      const anim = kind === "eptesicus"
          ? "sit"
          : kind === "wingwrap"
              ? "play"
              : kind === "traguscup"
                  ? "talk"
                  : kind === "thumbcrawl"
                      ? "play"
                      : kind === "duskhang"
                          ? "play"
                          : kind === "echolocate"
                              ? "talk"
                              : kind === "calcar"
                                  ? "play"
                                  : "sit";
      return {
          kind,
          phase: kind === "eptesicus" ? "hold" : "go",
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
  function eptesicusPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.36) * 0.35,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function wingwrapPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.wingwrap));
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
  function traguscupPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.traguscup));
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
  function thumbcrawlPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.thumbcrawl));
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
  function duskhangPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.duskhang));
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
  function echolocatePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.echolocate));
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
  function calcarPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.calcar));
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
      if (shouldAbort(flags) && trick.kind !== "wingwrap" && trick.kind !== "traguscup" && trick.kind !== "thumbcrawl" && trick.kind !== "duskhang" && trick.kind !== "echolocate" && trick.kind !== "calcar") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "eptesicus") {
          if (next.t < EPTESICUS_HOLD) {
              const pose = eptesicusPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < EPTESICUS_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - EPTESICUS_HOLD);
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
      if (next.kind === "wingwrap") {
          const pose = wingwrapPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "traguscup") {
          const pose = traguscupPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "thumbcrawl") {
          const pose = thumbcrawlPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "duskhang") {
          const pose = duskhangPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "echolocate") {
          const pose = echolocatePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = calcarPose(next.t, fromX, trick.facing);
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
    EPTESICUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    eptesicusPose,
    releasePose,
    wingwrapPose,
    traguscupPose,
    thumbcrawlPose,
    duskhangPose,
    echolocatePose,
    calcarPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    fuscusPose,
    blossevilliiPose,
    atticnookPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBatTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
