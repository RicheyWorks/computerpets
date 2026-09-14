/** Flag ground tricks while idle — ultra-polish pass. House neighborly Cervidae / Odocoileus virginianus white-tailed deer oak-edge desk life (deer / Flag / Rack) — flagtail / edgebrowse / earswivel / forestamp / stotbound / snortblow / odocoileus personality (flagtail white caudal flag flash without naming flag or caudal or scut or tail or wave or bob or tip or alarm or snort or stot or pronk or leap or hop, edgebrowse oak-edge browse nibble without naming browse or eat or feed or graze or forage or chew or bite or nip or branta or dabble, earswivel pinna cup-and-swivel without naming ear or pinna or listen or hear or sense or feel or probe or haller or antennule or palp, forestamp forefoot stamp warn without naming stamp or stomp or kick or pound or thump or strike or run or dart or dash or sprint or chase or hunt, stotbound stiff-legged bound without naming stot or pronk or leap or hop or pounce or bounce or spring or jump or bound or run or dart, snortblow alarm snort-blow without naming snort or blow or wheeze or bark or call or cry or voice or alarm or warn or hiss or grunt, long odocoileus Odocoileus virginianus freeze-alert oak-edge hold (THE odocoileus sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or urticate or threat or cork or ecdysis or rastellum or apophysis or aphonopelma or hourglass or tangle or wrap or gumfoot or combfoot or theridiid or latrodectus or legwave or oscillate or autotomy or gregarious or ozopore or leiobunum or phalangium or pedipalp or metasoma or fluoresce or sanddig or pectines or booklung or centruroides or caudalwhip or acetic or palpcrush or trayburrow or pygidial or antenniform or mastigoproctus or quest or haller or hypostome or engorge or scutum or capitulum or ixodes or malleoli or suctorial or chelicrush or sprintburst or propeltidium or tracheate or eremobates or flagellum or oil or dab or tip or drum or sip or hover or stridulate or deer or flag or rack or velvet as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play RUN unchanged if already fine; Gale owns malleoli/suctorial/chelicrush/sprintburst/propeltidium/tracheate/eremobates; Clasp owns quest/haller/hypostome/engorge/scutum/capitulum/ixodes; Whip owns caudalwhip/acetic/palpcrush/trayburrow/pygidial/antenniform/mastigoproctus; Barb owns pedipalp/metasoma/fluoresce/sanddig/pectines/booklung/centruroides; Stem owns legwave/oscillate/autotomy/gregarious/ozopore/leiobunum/phalangium; Hour owns hourglass/tangle/wrap/gumfoot/combfoot/theridiid/latrodectus; Velvet owns urticate/threat/cork/ecdysis/rastellum/apophysis/aphonopelma; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Rue fox / Pip dog / Miso cat / Thimble rabbit stay distinct mammal peers; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Flag / key deer only for isKey matching — accept "deer" and "rack" and "flag"; do NOT name a trick "deer" or "flag" or "rack" or "velvet" or "moose" or "cervid" or "ungulate" or "antler" or "gaze" or "still" or "wait" or "run" or "snort" or "stot") — not Gale solifuge life, not Clasp tick life, not Velvet tarantula life, not Rue fox life, not Pip dog life, not Cape bat life, not bird life. Flagtail caudal-flash without naming flag, edgebrowse oak-nibble without naming graze, earswivel pinna-swivel without naming listen, forestamp forefoot-warn without naming stomp, stotbound stiff-bound without naming leap, snortblow alarm-blow without naming cry, odocoileus long sit_hold on the oak edge (THE odocoileus sit_hold tell); virginianus / couesi / oakedge thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web deer-tricks.ts. Window-play RUN unchanged. Ethogram softs + freeze — never names flag/walk/still/deer as bare ethogram-only trick kinds. True white-tailed deer Cervidae desk life only — distinct from Gale, Clasp, Velvet, Rue, Pip, Cape, and birds. Next house-order ultra: Cape / bat. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via deer.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "deer";
  const TRICKS = ["flagtail", "edgebrowse", "earswivel", "forestamp", "stotbound", "snortblow", "odocoileus"];
  const HAPPY = ["virginianus", "couesi", "oakedge"];
  const HAPPY_DUR = { virginianus: 1.70, couesi: 1.84, oakedge: 1.76 };
  const ODOCOILEUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      odocoileus: ODOCOILEUS_HOLD + RELEASE_S,
      flagtail: 2.48,
      edgebrowse: 2.42,
      earswivel: 2.56,
      forestamp: 2.44,
      stotbound: 2.40,
      snortblow: 2.38,
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
      if (kind === "odocoileus")
          return 40 + roll * 26;
      if (kind === "stotbound" || kind === "snortblow" || kind === "flagtail")
          return 12.8 + roll * 9.4;
      if (kind === "edgebrowse" || kind === "earswivel" || kind === "forestamp")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "odocoileus";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "odocoileus") {
          if (roll < 0.17)
              return "flagtail";
          if (roll < 0.33)
              return "edgebrowse";
          if (roll < 0.49)
              return "earswivel";
          if (roll < 0.65)
              return "forestamp";
          if (roll < 0.83)
              return "stotbound";
          return "snortblow";
      }
      if (lastKind === "flagtail") {
          if (roll < 0.16)
              return "odocoileus";
          if (roll < 0.32)
              return "edgebrowse";
          if (roll < 0.48)
              return "earswivel";
          if (roll < 0.64)
              return "forestamp";
          if (roll < 0.82)
              return "stotbound";
          return "snortblow";
      }
      if (lastKind === "edgebrowse") {
          if (roll < 0.14)
              return "odocoileus";
          if (roll < 0.3)
              return "flagtail";
          if (roll < 0.46)
              return "earswivel";
          if (roll < 0.62)
              return "forestamp";
          if (roll < 0.8)
              return "stotbound";
          return "snortblow";
      }
      if (lastKind === "stotbound" || lastKind === "snortblow") {
          if (roll < 0.14)
              return "odocoileus";
          if (roll < 0.3)
              return "flagtail";
          if (roll < 0.46)
              return "edgebrowse";
          if (roll < 0.62)
              return "earswivel";
          if (roll < 0.78)
              return "forestamp";
          return lastKind === "stotbound" ? "snortblow" : "stotbound";
      }
      if (roll < 0.14)
          return "odocoileus";
      if (roll < 0.28)
          return "flagtail";
      if (roll < 0.42)
          return "edgebrowse";
      if (roll < 0.56)
          return "earswivel";
      if (roll < 0.7)
          return "forestamp";
      if (roll < 0.85)
          return "stotbound";
      return "snortblow";
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
      return key === TRICK_KEY || key === "rack" || key === "flag";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "virginianus";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "virginianus" ? "sit" : name === "couesi" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function virginianusPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.virginianus));
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
  function couesiPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.couesi));
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
  function oakedgePose(t) {
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
      if (next.kind === "virginianus") {
          const pose = virginianusPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "couesi") {
          const pose = couesiPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = oakedgePose(next.t);
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
      const anim = kind === "odocoileus"
          ? "sit"
          : kind === "flagtail"
              ? "play"
              : kind === "edgebrowse"
                  ? "talk"
                  : kind === "earswivel"
                      ? "talk"
                      : kind === "forestamp"
                          ? "play"
                          : kind === "stotbound"
                              ? "play"
                              : kind === "snortblow"
                                  ? "talk"
                                  : "sit";
      return {
          kind,
          phase: kind === "odocoileus" ? "hold" : "go",
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
  function odocoileusPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.36) * 0.35,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function flagtailPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.flagtail));
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
  function edgebrowsePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.edgebrowse));
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
  function earswivelPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.earswivel));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.8, rot: s * 14 * face, anim: "talk" };
      }
      if (u < 0.78) {
          const cast = Math.sin(t * 2.6);
          return {
              x: fromX - face * cast * 0.16,
              lift: 3.6 + Math.abs(cast) * 1.6,
              rot: face * (14 + cast * 12),
              anim: "talk",
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
  function forestampPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.forestamp));
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
  function stotboundPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.stotbound));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "play" };
      }
      if (u < 0.55) {
          const tip = Math.sin(t * 2.0);
          return {
              x: fromX + face * tip * 0.08,
              lift: 2.8 + tip * 1.6,
              rot: face * (-12 + tip * 10),
              anim: "play",
          };
      }
      if (u < 0.78) {
          const hush = Math.sin(t * 0.9);
          return {
              x: fromX,
              lift: 4.0 + Math.abs(hush) * 0.6,
              rot: face * (-4 + hush * 3),
              anim: "play",
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
  function snortblowPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.snortblow));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "talk" };
      }
      if (u < 0.55) {
          const stretch = Math.sin(t * 2.3);
          return {
              x: fromX + face * stretch * 0.1,
              lift: 3.4 + stretch * 1.4,
              rot: face * (12 + stretch * 9),
              anim: "talk",
          };
      }
      if (u < 0.78) {
          const hush = Math.sin(t * 0.85);
          return {
              x: fromX,
              lift: 4.4 + Math.abs(hush) * 0.7,
              rot: face * (5 + hush * 3),
              anim: "talk",
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
      if (shouldAbort(flags) && trick.kind !== "flagtail" && trick.kind !== "edgebrowse" && trick.kind !== "earswivel" && trick.kind !== "forestamp" && trick.kind !== "stotbound" && trick.kind !== "snortblow") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "odocoileus") {
          if (next.t < ODOCOILEUS_HOLD) {
              const pose = odocoileusPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < ODOCOILEUS_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - ODOCOILEUS_HOLD);
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
      if (next.kind === "flagtail") {
          const pose = flagtailPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "edgebrowse") {
          const pose = edgebrowsePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "earswivel") {
          const pose = earswivelPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "forestamp") {
          const pose = forestampPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "stotbound") {
          const pose = stotboundPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = snortblowPose(next.t, fromX, trick.facing);
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
    ODOCOILEUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    odocoileusPose,
    releasePose,
    flagtailPose,
    edgebrowsePose,
    earswivelPose,
    forestampPose,
    stotboundPose,
    snortblowPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    virginianusPose,
    couesiPose,
    oakedgePose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDeerTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
