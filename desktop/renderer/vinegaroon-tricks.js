/** Whip ground tricks while idle — ultra-polish pass. House neighborly Thelyphonida / Mastigoproctus giant-vinegaroon (vinegaroon / Whip) desk life — caudalwhip / acetic / palpcrush / trayburrow / pygidial / antenniform / mastigoproctus personality (caudalwhip caudal whip-sense without naming whip or flagellum or sense or feel or probe or palp or bob or wave or flag or antenna or feeler or touch or trail or caudal, acetic spray-raise without naming spray or vinegar or acid or sting or stinger or telson or metasoma or tail or threat or warn or strike or coil, palpcrush raptorial pedipalp-crush without naming pedipalp or crush or chelate or grasp or pincer or claw or hold or seize or pinch or feel or pat, trayburrow burrow-scrape without naming dig or burrow or sanddig or fossor or scratch or scrape or rake or shovel or nest or nestguard, pygidial pygidial-gland raise without naming gland or acid or vinegar or spray or scent or ozopore, antenniform antenniform first-leg probe without naming antenna or feeler or legwave or palp or probe or orient or saccade, long mastigoproctus Mastigoproctus giganteus sand-tray blotter hold (THE mastigoproctus sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or urticate or threat or cork or ecdysis or rastellum or apophysis or aphonopelma or hourglass or tangle or wrap or gumfoot or combfoot or theridiid or latrodectus or legwave or oscillate or autotomy or gregarious or ozopore or leiobunum or phalangium or pedipalp or metasoma or fluoresce or sanddig or pectines or booklung or centruroides or flagellum or oil or dab or tip or drum or sip or hover or stridulate or vinegaroon or whip as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play CARRY unchanged if already fine; Spot owns flagellum; Barb owns pedipalp/metasoma/fluoresce/sanddig/pectines/booklung/centruroides; Stem owns legwave/oscillate/autotomy/gregarious/ozopore/leiobunum/phalangium; Hour owns hourglass/tangle/wrap/gumfoot/combfoot/theridiid/latrodectus; Velvet owns urticate/threat/cork/ecdysis/rastellum/apophysis/aphonopelma; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Ledger owns bookgill/telson; Tenant owns chela; Chirp owns stridulate; Flag / deer owns the next seat; Flag / deer owns the next seat; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Whip / key vinegaroon only for isKey matching — accept "vinegaroon" and "whip"; do NOT name a trick "vinegaroon" or "whip" or "sting" or "venom" or "scorpion" or "spider" or "silk" or "web" or "gaze" or "still" or "flagellum" or "pedipalp" or "sanddig") — not Barb scorpion life, not Stem harvestman life, not Hour widow life, not Velvet tarantula life, not Prowl wolf_spider life, not Leap jumping_spider life, not Loom orb_weaver life, not Spot euglena life, not Gale solifuge life, not bird life. Caudalwhip whip-sense without naming flagellum, acetic spray-raise without naming sting, palpcrush crush without naming pedipalp, trayburrow scrape without naming sanddig, pygidial gland-raise without naming ozopore, antenniform first-leg probe without naming antenna, mastigoproctus long sit_hold on the blotter (THE mastigoproctus sit_hold tell); giganteus / tohono / thelyphonus thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web vinegaroon-tricks.ts. Window-play CARRY unchanged. Ethogram softs + freeze — never names whip/walk/still/vinegaroon as bare ethogram-only trick kinds. True thelyphonid giant-vinegaroon desk life only — distinct from Barb, Stem, Hour, Velvet, Prowl, Leap, Loom, Spot, Gale, and birds. Next house-order ultra: Flag / deer. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via vinegaroon.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "vinegaroon";
  const TRICKS = ["caudalwhip", "acetic", "palpcrush", "trayburrow", "pygidial", "antenniform", "mastigoproctus"];
  const HAPPY = ["giganteus", "tohono", "thelyphonus"];
  const HAPPY_DUR = { giganteus: 1.70, tohono: 1.84, thelyphonus: 1.76 };
  const MASTIGOPROCTUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      mastigoproctus: MASTIGOPROCTUS_HOLD + RELEASE_S,
      caudalwhip: 2.48,
      acetic: 2.42,
      palpcrush: 2.56,
      trayburrow: 2.44,
      pygidial: 2.40,
      antenniform: 2.38,
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
      if (kind === "mastigoproctus")
          return 40 + roll * 26;
      if (kind === "pygidial" || kind === "antenniform" || kind === "caudalwhip")
          return 12.8 + roll * 9.4;
      if (kind === "acetic" || kind === "palpcrush" || kind === "trayburrow")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "mastigoproctus";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "mastigoproctus") {
          if (roll < 0.17)
              return "caudalwhip";
          if (roll < 0.33)
              return "acetic";
          if (roll < 0.49)
              return "palpcrush";
          if (roll < 0.65)
              return "trayburrow";
          if (roll < 0.83)
              return "pygidial";
          return "antenniform";
      }
      if (lastKind === "caudalwhip") {
          if (roll < 0.16)
              return "mastigoproctus";
          if (roll < 0.32)
              return "acetic";
          if (roll < 0.48)
              return "palpcrush";
          if (roll < 0.64)
              return "trayburrow";
          if (roll < 0.82)
              return "pygidial";
          return "antenniform";
      }
      if (lastKind === "acetic") {
          if (roll < 0.14)
              return "mastigoproctus";
          if (roll < 0.3)
              return "caudalwhip";
          if (roll < 0.46)
              return "palpcrush";
          if (roll < 0.62)
              return "trayburrow";
          if (roll < 0.8)
              return "pygidial";
          return "antenniform";
      }
      if (lastKind === "pygidial" || lastKind === "antenniform") {
          if (roll < 0.14)
              return "mastigoproctus";
          if (roll < 0.3)
              return "caudalwhip";
          if (roll < 0.46)
              return "acetic";
          if (roll < 0.62)
              return "palpcrush";
          if (roll < 0.78)
              return "trayburrow";
          return lastKind === "pygidial" ? "antenniform" : "pygidial";
      }
      if (roll < 0.14)
          return "mastigoproctus";
      if (roll < 0.28)
          return "caudalwhip";
      if (roll < 0.42)
          return "acetic";
      if (roll < 0.56)
          return "palpcrush";
      if (roll < 0.7)
          return "trayburrow";
      if (roll < 0.85)
          return "pygidial";
      return "antenniform";
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
      return key === TRICK_KEY || key === "whip";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "giganteus";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "giganteus" ? "sit" : name === "tohono" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function giganteusPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.giganteus));
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
  function tohonoPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tohono));
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
  function thelyphonusPose(t) {
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
      if (next.kind === "giganteus") {
          const pose = giganteusPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "tohono") {
          const pose = tohonoPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = thelyphonusPose(next.t);
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
      const anim = kind === "mastigoproctus"
          ? "sit"
          : kind === "caudalwhip"
              ? "talk"
              : kind === "acetic"
                  ? "play"
                  : kind === "palpcrush"
                      ? "play"
                      : kind === "trayburrow"
                          ? "play"
                          : kind === "pygidial"
                              ? "talk"
                              : kind === "antenniform"
                                  ? "play"
                                  : "sit";
      return {
          kind: TRICKS.indexOf(kind) >= 0 ? kind : "caudalwhip",
          phase: kind === "mastigoproctus" ? "hold" : "go",
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
  function mastigoproctusPose(t) {
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
  function caudalwhipPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.caudalwhip));
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
  function aceticPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.acetic));
      const face = facing == null ? 1 : facing;
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 2.6, rot: s * -10 * face, anim: "play" };
      }
      if (u < 0.78) {
          const bob = Math.sin(t * 2.8);
          return {
              x: fromX + face * bob * 0.5,
              lift: 2.6 + Math.abs(bob) * 1.4,
              rot: face * (-10 + bob * 12),
              anim: "play",
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
  function palpcrushPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.palpcrush));
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
  function trayburrowPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.trayburrow));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "play" };
      }
      if (u < 0.78) {
          const nestle = Math.sin(t * 2.2);
          return {
              x: fromX + face * (0.6 + Math.abs(nestle) * 0.4),
              lift: 2.4 + Math.abs(nestle) * 1.8,
              rot: face * (12 + nestle * 10),
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
  function pygidialPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.pygidial));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "talk" };
      }
      if (u < 0.55) {
          const tip = Math.sin(t * 3.2);
          return {
              x: fromX + face * tip * 0.18,
              lift: 2.8 + tip * 1.6,
              rot: face * (-12 + tip * 14),
              anim: "talk",
          };
      }
      if (u < 0.78) {
          const hush = Math.sin(t * 1.1);
          return {
              x: fromX + face * hush * 0.12,
              lift: 4.0 + Math.abs(hush) * 0.6,
              rot: face * (-22 + hush * 4),
              anim: "talk",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 2.0 * (1 - s),
          rot: face * (-8 * (1 - s)),
          anim: "idle",
      };
  }
  function antenniformPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.antenniform));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "play" };
      }
      if (u < 0.55) {
          const stretch = Math.abs(Math.sin(t * 2.6));
          return {
              x: fromX + face * stretch * 0.2,
              lift: 3.4 + stretch * 1.4,
              rot: face * (12 + stretch * 10),
              anim: "play",
          };
      }
      if (u < 0.78) {
          const hush = Math.sin(t * 1.4);
          return {
              x: fromX,
              lift: 4.4 + Math.abs(hush) * 0.7,
              rot: face * (18 + hush * 6),
              anim: "play",
          };
      }
      const s = smoothstep((u - 0.78) / 0.22);
      return {
          x: fromX,
          lift: 1.8 * (1 - s),
          rot: face * (5 * (1 - s)),
          anim: "idle",
      };
  }
  function stepTrick(trick, dt, flags) {
      if (shouldAbort(flags)) {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      const fromX = trick.fromX != null ? trick.fromX : trick.x;
      if (next.kind === "mastigoproctus") {
          if (next.t < MASTIGOPROCTUS_HOLD) {
              const pose = mastigoproctusPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = pose.anim;
              return next;
          }
          if (next.t < MASTIGOPROCTUS_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - MASTIGOPROCTUS_HOLD);
              next.phase = "release";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
      }
      const hold = DUR[next.kind];
      if (next.kind === "caudalwhip") {
          const pose = caudalwhipPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "acetic") {
          const pose = aceticPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "palpcrush") {
          const pose = palpcrushPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "trayburrow") {
          const pose = trayburrowPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "pygidial") {
          const pose = pygidialPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = antenniformPose(next.t, fromX, trick.facing);
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
    MASTIGOPROCTUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    mastigoproctusPose,
    releasePose,
    caudalwhipPose,
    aceticPose,
    palpcrushPose,
    trayburrowPose,
    pygidialPose,
    antenniformPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    giganteusPose,
    tohonoPose,
    thelyphonusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetVinegaroonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
