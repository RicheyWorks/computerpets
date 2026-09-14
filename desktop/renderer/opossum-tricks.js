/** Grin ground tricks while idle — ultra-polish pass. House neighborly Didelphidae / Didelphis virginiana Virginia-opossum rafter-hem desk life (opossum / Grin) — stillfeign / scrapnose / gapegrin / raftergrip / pouchcarry / prehensile / didelphis personality (stillfeign thanatosis limp-feign without naming dead or play or limp or feign or thanatosis or freeze or faint or flop or threat or warn or playdead, scrapnose hem-scrap forage without naming dig or bury or scratch or scrape or rake or fossick or litter or dirt or soil or hole or grub or forage or nose or sniff, gapegrin open-mouth defensive grin without naming hiss or gape or teeth or jaw or threat or warn or smile or bare or flash or pink or playdead, raftergrip prehensile rafter-grip climb without naming climb or grip or reach or hang or tail or curl or prehensile alone or rafter or hem or stretch or tall, pouchcarry marsupial pouch-carry tell without naming pouch or carry or joey or marsupial or litter or nurse or den alone, prehensile prehensile-tail curl tell without naming tail or curl or grip or hang or prehensile alone or wrap or coil or monkey, long didelphis Didelphis virginiana freeze-alert pouch hold (THE didelphis sit_hold tell) — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or footstomp or duffgrub or handwarn or plumeaim or scentraise or plantigrade or mephitis or pawdouse or litterdig or rearstand or maskpeer or dexterous or ringtail or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or denslide or spraint or lontra or nutbury or tailflick or cheekpouch or branchleap or barkscramble or scold or sciurus or wingwrap or traguscup or thumbcrawl or duskhang or eptesicus or flagtail or edgebrowse or earswivel or forestamp or odocoileus or tube or romp or steal or puff or noodle or corkscrew or slink or hang or roost or flutter or still or stamp or raise or spray or skunk or stripe or playdead or grin or opossum or ferret or weasel or mink or otter or red_panda or wash or beaver or dam as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play RUN unchanged if already fine; Stripe owns footstomp/duffgrub/handwarn/plumeaim/scentraise/plantigrade/mephitis; Wash owns pawdouse/litterdig/rearstand/maskpeer/dexterous/ringtail/procyon; Slick owns bellyglide/corkroll/shellcrunch/whiskernudge/denslide/spraint/lontra; Cache owns nutbury/tailflick/cheekpouch/branchleap/barkscramble/scold/sciurus; Cape owns wingwrap/traguscup/thumbcrawl/duskhang/echolocate/calcar/eptesicus; Flag owns flagtail/edgebrowse/earswivel/forestamp/stotbound/snortblow/odocoileus; Rui is red_panda — never name a trick red_panda or wash or raccoon or skunk or stripe or opossum or grin; ferret owns tube/romp/steal/puff/noodle/corkscrew/slink; Rue fox / Pip dog / Miso cat / Thimble rabbit stay distinct mammal peers; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own bird tricks; guest slug Grin / key opossum only for isKey matching — accept "opossum" and "grin"; do NOT name a trick "opossum" or "grin" or "playdead" or "possum" or "marsupial" or "pouch" or "beaver" or "dam" or "ferret" or "weasel" or "mink" or "otter" or "raccoon" or "coati" or "kinkajou" or "red_panda" or "wash" or "slick" or "skunk" or "stripe") — not Stripe skunk life, not Wash raccoon life, not Slick otter life, not Cache squirrel life, not Cape bat life, not Flag deer life, not Dam beaver life, not Rui red_panda life, not ferret clone, not bird life. Stillfeign thanatosis without naming playdead, scrapnose hem-scrap without naming dig, gapegrin open-mouth without naming hiss, raftergrip rafter-grip without naming climb alone, pouchcarry pouch-carry without naming pouch alone, prehensile prehensile-tail without naming tail alone, didelphis long sit_hold in the rafter hem (THE didelphis sit_hold tell); pouchden / inkgrin / denshem thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web opossum-tricks.ts. Window-play RUN unchanged. Ethogram softs + freeze — never names playdead/grin/walk/opossum as bare ethogram-only trick kinds. True Virginia-opossum Didelphidae desk life only — distinct from Stripe, Wash, Slick, Cache, Cape, Flag, Dam, Rui, ferret, and birds. Next house-order ultra: Dam / beaver. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via opossum.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "opossum";
  const TRICKS = ["stillfeign", "scrapnose", "gapegrin", "raftergrip", "pouchcarry", "prehensile", "didelphis"];
  const HAPPY = ["pouchden", "inkgrin", "denshem"];
  const HAPPY_DUR = { pouchden: 1.70, inkgrin: 1.84, denshem: 1.76 };
  const DIDELPHIS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      didelphis: DIDELPHIS_HOLD + RELEASE_S,
      stillfeign: 2.48,
      scrapnose: 2.42,
      gapegrin: 2.56,
      raftergrip: 2.44,
      pouchcarry: 2.40,
      prehensile: 2.38,
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
      if (kind === "didelphis")
          return 40 + roll * 26;
      if (kind === "pouchcarry" || kind === "prehensile" || kind === "stillfeign")
          return 12.8 + roll * 9.4;
      if (kind === "scrapnose" || kind === "gapegrin" || kind === "raftergrip")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "didelphis";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "didelphis") {
          if (roll < 0.17)
              return "stillfeign";
          if (roll < 0.33)
              return "scrapnose";
          if (roll < 0.49)
              return "gapegrin";
          if (roll < 0.65)
              return "raftergrip";
          if (roll < 0.83)
              return "pouchcarry";
          return "prehensile";
      }
      if (lastKind === "stillfeign") {
          if (roll < 0.16)
              return "didelphis";
          if (roll < 0.32)
              return "scrapnose";
          if (roll < 0.48)
              return "gapegrin";
          if (roll < 0.64)
              return "raftergrip";
          if (roll < 0.82)
              return "pouchcarry";
          return "prehensile";
      }
      if (lastKind === "scrapnose") {
          if (roll < 0.14)
              return "didelphis";
          if (roll < 0.3)
              return "stillfeign";
          if (roll < 0.46)
              return "gapegrin";
          if (roll < 0.62)
              return "raftergrip";
          if (roll < 0.8)
              return "pouchcarry";
          return "prehensile";
      }
      if (lastKind === "pouchcarry" || lastKind === "prehensile") {
          if (roll < 0.14)
              return "didelphis";
          if (roll < 0.3)
              return "stillfeign";
          if (roll < 0.46)
              return "scrapnose";
          if (roll < 0.62)
              return "gapegrin";
          if (roll < 0.78)
              return "raftergrip";
          return lastKind === "pouchcarry" ? "prehensile" : "pouchcarry";
      }
      if (roll < 0.14)
          return "didelphis";
      if (roll < 0.28)
          return "stillfeign";
      if (roll < 0.42)
          return "scrapnose";
      if (roll < 0.56)
          return "gapegrin";
      if (roll < 0.7)
          return "raftergrip";
      if (roll < 0.85)
          return "pouchcarry";
      return "prehensile";
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
      return key === TRICK_KEY || key === "grin";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "pouchden";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "pouchden" ? "sit" : name === "inkgrin" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function pouchdenPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pouchden));
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
  function inkgrinPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgrin));
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
  function denshemPose(t) {
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
      if (next.kind === "pouchden") {
          const pose = pouchdenPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "inkgrin") {
          const pose = inkgrinPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = denshemPose(next.t);
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
      const anim = kind === "didelphis"
          ? "sit"
          : kind === "stillfeign"
              ? "play"
              : kind === "scrapnose"
                  ? "talk"
                  : kind === "gapegrin"
                      ? "play"
                      : kind === "raftergrip"
                          ? "play"
                          : kind === "pouchcarry"
                              ? "talk"
                              : kind === "prehensile"
                                  ? "play"
                                  : "sit";
      return {
          kind,
          phase: kind === "didelphis" ? "hold" : "go",
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
  function didelphisPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.36) * 0.35,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function stillfeignPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.stillfeign));
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
  function scrapnosePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.scrapnose));
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
  function gapegrinPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.gapegrin));
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
  function raftergripPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.raftergrip));
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
  function pouchcarryPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.pouchcarry));
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
  function prehensilePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.prehensile));
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
      if (shouldAbort(flags) && trick.kind !== "stillfeign" && trick.kind !== "scrapnose" && trick.kind !== "gapegrin" && trick.kind !== "raftergrip" && trick.kind !== "pouchcarry" && trick.kind !== "prehensile") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "didelphis") {
          if (next.t < DIDELPHIS_HOLD) {
              const pose = didelphisPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < DIDELPHIS_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - DIDELPHIS_HOLD);
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
      if (next.kind === "stillfeign") {
          const pose = stillfeignPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "scrapnose") {
          const pose = scrapnosePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "gapegrin") {
          const pose = gapegrinPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "raftergrip") {
          const pose = raftergripPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "pouchcarry") {
          const pose = pouchcarryPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = prehensilePose(next.t, fromX, trick.facing);
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
    DIDELPHIS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    didelphisPose,
    releasePose,
    stillfeignPose,
    scrapnosePose,
    gapegrinPose,
    raftergripPose,
    pouchcarryPose,
    prehensilePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    pouchdenPose,
    inkgrinPose,
    denshemPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOpossumTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
