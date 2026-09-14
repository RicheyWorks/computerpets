/** Dam ground tricks while idle — ultra-polish pass. House neighborly Castoridae / Castor canadensis North-American-beaver lodge-cup desk life (beaver / Dam) — woodfell / paddleclap / lodgehaul / mudpack / aspen / divehush / castor personality (woodfell fell-gnaw timber without naming fell or gnaw or chop or bite or cut or timber or wood or bark or chip or tooth or teeth or willow alone, paddleclap paddle-tail slap without naming slap or clap or smack or warn or threat or splash or paddle or flat or bang or thump or alarm, lodgehaul lodge-stick haul without naming haul or drag or carry or stick or lodge or dam or ferry or load or tug or pull or timber alone, mudpack mud-seal pack without naming mud or pack or seal or plaster or pat or smear or clay or bank or wall or chink, aspen aspen-browse chew tell without naming aspen alone or willow or browse or chew or leaf or bud or cambium or forage, divehush surface-dive hush tell without naming dive or hush or swim or splash or plunge or submerge or sink or warn alone, long castor Castor canadensis surface-alert dive-hush hold (THE castor sit_hold tell) — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or stillfeign or scrapnose or gapegrin or raftergrip or pouchcarry or prehensile or didelphis or footstomp or duffgrub or handwarn or plumeaim or scentraise or plantigrade or mephitis or pawdouse or litterdig or rearstand or maskpeer or dexterous or ringtail or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or denslide or spraint or lontra or nutbury or tailflick or cheekpouch or branchleap or barkscramble or scold or sciurus or wingwrap or traguscup or thumbcrawl or duskhang or eptesicus or flagtail or edgebrowse or earswivel or forestamp or odocoileus or tube or romp or steal or puff or noodle or corkscrew or slink or hang or roost or flutter or still or stamp or raise or spray or skunk or stripe or playdead or grin or opossum or ferret or weasel or mink or otter or red_panda or wash or beaver or dam or gnaw or slap or sit as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play RUN unchanged if already fine; Grin owns stillfeign/scrapnose/gapegrin/raftergrip/pouchcarry/prehensile/didelphis; Stripe owns footstomp/duffgrub/handwarn/plumeaim/scentraise/plantigrade/mephitis; Wash owns pawdouse/litterdig/rearstand/maskpeer/dexterous/ringtail/procyon; Slick owns bellyglide/corkroll/shellcrunch/whiskernudge/denslide/spraint/lontra; Cache owns nutbury/tailflick/cheekpouch/branchleap/barkscramble/scold/sciurus; Cape owns wingwrap/traguscup/thumbcrawl/duskhang/echolocate/calcar/eptesicus; Flag owns flagtail/edgebrowse/earswivel/forestamp/stotbound/snortblow/odocoileus; Rui is red_panda — never name a trick red_panda or wash or raccoon or skunk or stripe or opossum or grin or beaver or dam; ferret owns tube/romp/steal/puff/noodle/corkscrew/slink; mining bee owns shaft/mass/vernal/fovea/andrena — do NOT collide with mining; Rue fox / Pip dog / Miso cat / Thimble rabbit stay distinct mammal peers; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own bird tricks; guest slug Dam / key beaver only for isKey matching — accept "beaver" and "dam"; do NOT name a trick "beaver" or "dam" or "gnaw" or "slap" or "sit" or "muskrat" or "otter" or "mink" or "coypu" or "nutria" or "raccoon" or "skunk" or "opossum" or "ferret" or "weasel" or "Bank" or "mining" or "porcupine" or "spine") — not Grin opossum life, not Stripe skunk life, not Wash raccoon life, not Slick otter life, not Cache squirrel life, not Cape bat life, not Flag deer life, not Rui red_panda life, not ferret clone, not bird life, not Spine porcupine life. Woodfell fell-gnaw without naming gnaw, paddleclap paddle-slap without naming slap, lodgehaul lodge-haul without naming haul alone, mudpack mud-seal without naming mud alone, aspen aspen-browse without naming aspen alone, divehush dive-hush without naming dive alone, castor long sit_hold in the lodge cup (THE castor sit_hold tell); denslodge / inkdam / densmud thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web beaver-tricks.ts. Window-play RUN unchanged. Ethogram softs + freeze — never names gnaw/slap/sit/beaver as bare ethogram-only trick kinds. True North-American-beaver Castoridae desk life only — distinct from Grin, Stripe, Wash, Slick, Cache, Cape, Flag, Rui, ferret, Spine, and birds. Next house-order ultra: Spine / porcupine. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via beaver.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "beaver";
  const TRICKS = ["woodfell", "paddleclap", "lodgehaul", "mudpack", "aspen", "divehush", "castor"];
  const HAPPY = ["denslodge", "inkdam", "densmud"];
  const HAPPY_DUR = { denslodge: 1.70, inkdam: 1.84, densmud: 1.76 };
  const CASTOR_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      castor: CASTOR_HOLD + RELEASE_S,
      woodfell: 2.48,
      paddleclap: 2.42,
      lodgehaul: 2.56,
      mudpack: 2.44,
      aspen: 2.40,
      divehush: 2.38,
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
      if (kind === "castor")
          return 40 + roll * 26;
      if (kind === "aspen" || kind === "divehush" || kind === "woodfell")
          return 12.8 + roll * 9.4;
      if (kind === "paddleclap" || kind === "lodgehaul" || kind === "mudpack")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "castor";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "castor") {
          if (roll < 0.17)
              return "woodfell";
          if (roll < 0.33)
              return "paddleclap";
          if (roll < 0.49)
              return "lodgehaul";
          if (roll < 0.65)
              return "mudpack";
          if (roll < 0.83)
              return "aspen";
          return "divehush";
      }
      if (lastKind === "woodfell") {
          if (roll < 0.16)
              return "castor";
          if (roll < 0.32)
              return "paddleclap";
          if (roll < 0.48)
              return "lodgehaul";
          if (roll < 0.64)
              return "mudpack";
          if (roll < 0.82)
              return "aspen";
          return "divehush";
      }
      if (lastKind === "paddleclap") {
          if (roll < 0.14)
              return "castor";
          if (roll < 0.3)
              return "woodfell";
          if (roll < 0.46)
              return "lodgehaul";
          if (roll < 0.62)
              return "mudpack";
          if (roll < 0.8)
              return "aspen";
          return "divehush";
      }
      if (lastKind === "aspen" || lastKind === "divehush") {
          if (roll < 0.14)
              return "castor";
          if (roll < 0.3)
              return "woodfell";
          if (roll < 0.46)
              return "paddleclap";
          if (roll < 0.62)
              return "lodgehaul";
          if (roll < 0.78)
              return "mudpack";
          return lastKind === "aspen" ? "divehush" : "aspen";
      }
      if (roll < 0.14)
          return "castor";
      if (roll < 0.28)
          return "woodfell";
      if (roll < 0.42)
          return "paddleclap";
      if (roll < 0.56)
          return "lodgehaul";
      if (roll < 0.7)
          return "mudpack";
      if (roll < 0.85)
          return "aspen";
      return "divehush";
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
      return key === TRICK_KEY || key === "dam";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "denslodge";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "denslodge" ? "sit" : name === "inkdam" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function denslodgePose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslodge));
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
  function inkdamPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkdam));
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
  function densmudPose(t) {
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
      if (next.kind === "denslodge") {
          const pose = denslodgePose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "inkdam") {
          const pose = inkdamPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = densmudPose(next.t);
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
      const anim = kind === "castor"
          ? "sit"
          : kind === "woodfell"
              ? "play"
              : kind === "paddleclap"
                  ? "play"
                  : kind === "lodgehaul"
                      ? "talk"
                      : kind === "mudpack"
                          ? "talk"
                          : kind === "aspen"
                              ? "play"
                              : kind === "divehush"
                                  ? "play"
                                  : "sit";
      return {
          kind,
          phase: kind === "castor" ? "hold" : "go",
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
  function castorPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.36) * 0.35,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function woodfellPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.woodfell));
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
  function paddleclapPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.paddleclap));
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
  function lodgehaulPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.lodgehaul));
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
  function mudpackPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.mudpack));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "talk" };
      }
      if (u < 0.78) {
          const nestle = Math.sin(t * 2.2);
          return {
              x: fromX + face * (0.6 + nestle * 0.1),
              lift: 2.4 + Math.abs(nestle) * 1.8,
              rot: face * (12 + nestle * 8),
              anim: "talk",
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
  function aspenPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.aspen));
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
  function divehushPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.divehush));
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
      if (shouldAbort(flags) && trick.kind !== "woodfell" && trick.kind !== "paddleclap" && trick.kind !== "lodgehaul" && trick.kind !== "mudpack" && trick.kind !== "aspen" && trick.kind !== "divehush") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "castor") {
          if (next.t < CASTOR_HOLD) {
              const pose = castorPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < CASTOR_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - CASTOR_HOLD);
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
      if (next.kind === "woodfell") {
          const pose = woodfellPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "paddleclap") {
          const pose = paddleclapPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "lodgehaul") {
          const pose = lodgehaulPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "mudpack") {
          const pose = mudpackPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "aspen") {
          const pose = aspenPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = divehushPose(next.t, fromX, trick.facing);
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
    CASTOR_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    castorPose,
    releasePose,
    woodfellPose,
    paddleclapPose,
    lodgehaulPose,
    mudpackPose,
    aspenPose,
    divehushPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denslodgePose,
    inkdamPose,
    densmudPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBeaverTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
