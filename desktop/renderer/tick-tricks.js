/** Clasp ground tricks while idle — ultra-polish pass. House neighborly Ixodidae / Ixodes scapularis black-legged-tick (tick / Clasp) desk life — quest / haller / hypostome / engorge / scutum / capitulum / ixodes personality (quest questing foreleg-raise without naming wait or still or freeze or nod or bob or wave or tip or feel or sense or probe or antennule or palp or flagellum or acetic or clasp or tick, haller Haller organ tarsal-sense without naming sense or feel or probe or tip or wave or bob or hallers or antennule or palpcrush or pedipalp or metasoma or antenniform, hypostome hypostome blotter-anchor without naming clasp or grip or latch or cling or pinch or chelate or crush or seize or hold or bite or suck or blood or acetabulum or prostomium, engorge engorge settle-swell without naming eat or feed or swell or fill or gorged or bloodmeal or suck or latch or meal or chew or looping, scutum dorsal scutum-shield settle without naming shield or armor or plate or shell or carapace or dorsum or back or cover, capitulum capitulum mouthpart-frame without naming mouth or jaw or chelicera or palp or head or face or bite or suck or latch, long ixodes Ixodes scapularis blotter-hem hold (THE ixodes sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or urticate or threat or cork or ecdysis or rastellum or apophysis or aphonopelma or hourglass or tangle or wrap or gumfoot or combfoot or theridiid or latrodectus or legwave or oscillate or autotomy or gregarious or ozopore or leiobunum or phalangium or pedipalp or metasoma or fluoresce or sanddig or pectines or booklung or centruroides or caudalwhip or acetic or palpcrush or trayburrow or pygidial or antenniform or mastigoproctus or flagellum or oil or dab or tip or drum or sip or hover or stridulate or tick or clasp as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play CARRY unchanged if already fine; Whip owns caudalwhip/acetic/palpcrush/trayburrow/pygidial/antenniform/mastigoproctus; Barb owns pedipalp/metasoma/fluoresce/sanddig/pectines/booklung/centruroides; Stem owns legwave/oscillate/autotomy/gregarious/ozopore/leiobunum/phalangium; Hour owns hourglass/tangle/wrap/gumfoot/combfoot/theridiid/latrodectus; Velvet owns urticate/threat/cork/ecdysis/rastellum/apophysis/aphonopelma; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean/botryoidal/auricle; Ledger owns bookgill/telson; Tenant owns chela; Chirp owns stridulate; Gale / solifuge words stay free for later; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Clasp / key tick only for isKey matching — accept "tick" and "clasp"; do NOT name a trick "tick" or "clasp" or "insect" or "mite" or "spider" or "scorpion" or "silk" or "web" or "venom" or "gaze" or "still" or "wait" or "latch") — not Whip vinegaroon life, not Barb scorpion life, not Stem harvestman life, not Hour widow life, not Velvet tarantula life, not Prowl wolf_spider life, not Leap jumping_spider life, not Loom orb_weaver life, not Latch leech life, not Gale solifuge life, not bird life. Quest questing without naming wait, haller Haller-sense without naming antenniform, hypostome anchor without naming latch, engorge settle without naming looping, scutum shield-settle without naming armor, capitulum mouthpart-frame without naming chelicera, ixodes long sit_hold on the blotter (THE ixodes sit_hold tell); scapularis / deerhost / blackleg thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web tick-tricks.ts. Window-play CARRY unchanged. Ethogram softs + freeze — never names clasp/still/wait/tick as bare ethogram-only trick kinds. True ixodid black-legged-tick desk life only — distinct from Whip, Barb, Stem, Hour, Velvet, Prowl, Leap, Loom, Latch, Gale, and birds. Next house-order ultra: Gale / solifuge. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via tick.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "tick";
  const TRICKS = ["quest", "haller", "hypostome", "engorge", "scutum", "capitulum", "ixodes"];
  const HAPPY = ["scapularis", "deerhost", "blackleg"];
  const HAPPY_DUR = { scapularis: 1.70, deerhost: 1.84, blackleg: 1.76 };
  const IXODES_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      ixodes: IXODES_HOLD + RELEASE_S,
      quest: 2.48,
      haller: 2.42,
      hypostome: 2.56,
      engorge: 2.44,
      scutum: 2.40,
      capitulum: 2.38,
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
      if (kind === "ixodes")
          return 40 + roll * 26;
      if (kind === "scutum" || kind === "capitulum" || kind === "quest")
          return 12.8 + roll * 9.4;
      if (kind === "haller" || kind === "hypostome" || kind === "engorge")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "ixodes";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "ixodes") {
          if (roll < 0.17)
              return "quest";
          if (roll < 0.33)
              return "haller";
          if (roll < 0.49)
              return "hypostome";
          if (roll < 0.65)
              return "engorge";
          if (roll < 0.83)
              return "scutum";
          return "capitulum";
      }
      if (lastKind === "quest") {
          if (roll < 0.16)
              return "ixodes";
          if (roll < 0.32)
              return "haller";
          if (roll < 0.48)
              return "hypostome";
          if (roll < 0.64)
              return "engorge";
          if (roll < 0.82)
              return "scutum";
          return "capitulum";
      }
      if (lastKind === "haller") {
          if (roll < 0.14)
              return "ixodes";
          if (roll < 0.3)
              return "quest";
          if (roll < 0.46)
              return "hypostome";
          if (roll < 0.62)
              return "engorge";
          if (roll < 0.8)
              return "scutum";
          return "capitulum";
      }
      if (lastKind === "scutum" || lastKind === "capitulum") {
          if (roll < 0.14)
              return "ixodes";
          if (roll < 0.3)
              return "quest";
          if (roll < 0.46)
              return "haller";
          if (roll < 0.62)
              return "hypostome";
          if (roll < 0.78)
              return "engorge";
          return lastKind === "scutum" ? "capitulum" : "scutum";
      }
      if (roll < 0.14)
          return "ixodes";
      if (roll < 0.28)
          return "quest";
      if (roll < 0.42)
          return "haller";
      if (roll < 0.56)
          return "hypostome";
      if (roll < 0.7)
          return "engorge";
      if (roll < 0.85)
          return "scutum";
      return "capitulum";
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
      return key === TRICK_KEY || key === "clasp";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "scapularis";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "scapularis" ? "sit" : name === "deerhost" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function scapularisPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scapularis));
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
  function deerhostPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.deerhost));
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
  function blacklegPose(t) {
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
      if (next.kind === "scapularis") {
          const pose = scapularisPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "deerhost") {
          const pose = deerhostPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = blacklegPose(next.t);
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
      const anim = kind === "ixodes"
          ? "sit"
          : kind === "quest"
              ? "talk"
              : kind === "haller"
                  ? "talk"
                  : kind === "hypostome"
                      ? "play"
                      : kind === "engorge"
                          ? "play"
                          : kind === "scutum"
                              ? "sit"
                              : kind === "capitulum"
                                  ? "play"
                                  : "sit";
      return {
          kind,
          phase: kind === "ixodes" ? "hold" : "go",
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
  function ixodesPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.36) * 0.35,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function questPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.quest));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "talk" };
      }
      if (u < 0.78) {
          const tip = Math.sin(t * 2.4);
          return {
              x: fromX + face * (0.8 + tip * 0.12),
              lift: 3.5 + Math.abs(tip) * 1.5,
              rot: face * (16 + tip * 10),
              anim: "talk",
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
  function hallerPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.haller));
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
  function hypostomePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.hypostome));
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
  function engorgePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.engorge));
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
  function scutumPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.scutum));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "sit" };
      }
      if (u < 0.55) {
          const tip = Math.sin(t * 2.0);
          return {
              x: fromX + face * tip * 0.08,
              lift: 2.8 + tip * 1.6,
              rot: face * (-12 + tip * 10),
              anim: "sit",
          };
      }
      if (u < 0.78) {
          const hush = Math.sin(t * 0.9);
          return {
              x: fromX,
              lift: 4.0 + Math.abs(hush) * 0.6,
              rot: face * (-4 + hush * 3),
              anim: "sit",
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
  function capitulumPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.capitulum));
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
      if (shouldAbort(flags) && trick.kind !== "quest" && trick.kind !== "haller" && trick.kind !== "hypostome" && trick.kind !== "engorge" && trick.kind !== "scutum" && trick.kind !== "capitulum") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "ixodes") {
          if (next.t < IXODES_HOLD) {
              const pose = ixodesPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < IXODES_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - IXODES_HOLD);
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
      if (next.kind === "quest") {
          const pose = questPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "haller") {
          const pose = hallerPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "hypostome") {
          const pose = hypostomePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "engorge") {
          const pose = engorgePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "scutum") {
          const pose = scutumPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = capitulumPose(next.t, fromX, trick.facing);
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
    IXODES_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    ixodesPose,
    releasePose,
    questPose,
    hallerPose,
    hypostomePose,
    engorgePose,
    scutumPose,
    capitulumPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    scapularisPose,
    deerhostPose,
    blacklegPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetTickTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
