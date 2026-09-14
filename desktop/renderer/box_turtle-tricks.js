/** Lid ground tricks while idle — ultra-polish pass. House neighborly Emydidae / Terrapene carolina Eastern Box Turtle hinge-dome desk life (box_turtle / Lid) — hingeshut / berryforage / shellsoak / nestscrape / dome / leafhush / carolinae personality (hingeshut hinged plastron shut without naming hinge or shut or close or box or clamp or seal or fold or clasp or vault or lid or shell or hide or tuck or retreat or withdraw or sit or freeze or still alone, berryforage woodland berry browse without naming berry or forage or browse or pluck or peck or nibble or hunt or seek or grub or sniff or root or graze or feed or snack alone, shellsoak shallow shell soak without naming shell or soak or bath or wallow or wet or puddle or pool or mud or dive or swim or float or settle or rest or lounge alone, nestscrape nest cup scrape without naming nest or scrape or dig or clutch or tunnel or cup or bowl or groove or pit or bury or cover or lay or excavate or shovel alone, dome high-domed carapace rise without naming dome or carapace or vault or keel or scute or ridge or hump or arch alone, leafhush leaf-litter hush without naming leaf or litter or hush or cover or duff or mulch or hide or cloak or settle alone, long carolinae Terrapene carolina dome-calm hinge hush hold (THE carolinae sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or ambushgape or mudbury or necklunge or banksnap or serrated or plastron or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or vsnout or keelridge or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or osteoderm or scutehush or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or coronal or sandhush or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or casque or zygodactyl or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or bluetail or stonehush or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or nuchal or vinehush or anolis or toepadcling or vocalclick or lickeye or mothstalk or setae or lamphush or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash or nictitate or gular or tympanum or frog or reed or snap or shut or hide or show or sit or still as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Beak owns ambushgape/mudbury/necklunge/banksnap/serrated/plastron/serpentina — do NOT reuse plastron as a trick kind; Jaw owns toothlock/highwalk/salttear/nestpit/vsnout/keelridge/acutus; Coal owns berrypluck — berryforage ok if distinct; Jaw owns nestpit — nestscrape ok; Ink turtle already ultra — keep Terrapene-true not Chelydra/Ink; Peak/tuatara next — leave tuatara words free; guest slug Lid / key box_turtle only for isKey matching — accept "box_turtle" and "lid"; do NOT name a trick "box_turtle" or "lid" or "hinge" or "shut" or "snapper" or "beak" or "snap" or "crocodile" or "jaw" or "alligator" or "levee" or "turtle" or "ink" or "plastron" or "still" or "flash" or "show" or "sit" or "tuatara" or "peak") — not Beak snapper life, not Jaw crocodile life, not Levee alligator life, not Ink painted-turtle life, not Peak tuatara life, not Rui red_panda life. Hingeshut hinged shut without naming hinge alone, berryforage woodland browse without naming berry alone, shellsoak shallow soak without naming shell alone, nestscrape nest scrape without naming nest alone, dome high carapace without naming dome alone, leafhush leaf litter without naming leaf alone, carolinae long sit_hold on the hinge dome (THE carolinae sit_hold tell); denslid / inklid / densdome thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web box_turtle-tricks.ts. Window-play FLASH unchanged. Ethogram softs + freeze — never names shut/walk/still/box_turtle as bare ethogram-only trick kinds. True Eastern Box Turtle Emydidae Terrapene carolina desk life only — distinct from Beak, Jaw, Levee, Ink, Peak, Spike, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Peak / tuatara. No cry inventing — thank-yous are silent desk motion only; no box_turtle.wav on disk so prefersHouseCry skipped (turtle.wav belongs to Ink). Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "box_turtle";
  const TRICKS = ["hingeshut", "berryforage", "shellsoak", "nestscrape", "dome", "leafhush", "carolinae"];
  const HAPPY = ["denslid", "inklid", "densdome"];
  const HAPPY_DUR = { denslid: 1.70, inklid: 1.84, densdome: 1.76 };
  const CAROLINAE_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      carolinae: CAROLINAE_HOLD + RELEASE_S,
      hingeshut: 2.48,
      berryforage: 2.42,
      shellsoak: 2.56,
      nestscrape: 2.44,
      dome: 2.40,
      leafhush: 2.38,
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
      if (kind === "carolinae")
          return 40 + roll * 26;
      if (kind === "dome" || kind === "leafhush" || kind === "hingeshut")
          return 12.8 + roll * 9.4;
      if (kind === "berryforage" || kind === "shellsoak" || kind === "nestscrape")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "carolinae";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "carolinae") {
          if (roll < 0.17)
              return "hingeshut";
          if (roll < 0.33)
              return "berryforage";
          if (roll < 0.49)
              return "shellsoak";
          if (roll < 0.65)
              return "nestscrape";
          if (roll < 0.83)
              return "dome";
          return "leafhush";
      }
      if (lastKind === "hingeshut") {
          if (roll < 0.16)
              return "carolinae";
          if (roll < 0.32)
              return "berryforage";
          if (roll < 0.48)
              return "shellsoak";
          if (roll < 0.64)
              return "nestscrape";
          if (roll < 0.82)
              return "dome";
          return "leafhush";
      }
      if (lastKind === "berryforage") {
          if (roll < 0.14)
              return "carolinae";
          if (roll < 0.3)
              return "hingeshut";
          if (roll < 0.46)
              return "shellsoak";
          if (roll < 0.62)
              return "nestscrape";
          if (roll < 0.8)
              return "dome";
          return "leafhush";
      }
      if (lastKind === "dome" || lastKind === "leafhush") {
          if (roll < 0.14)
              return "carolinae";
          if (roll < 0.3)
              return "hingeshut";
          if (roll < 0.46)
              return "berryforage";
          if (roll < 0.62)
              return "shellsoak";
          if (roll < 0.78)
              return "nestscrape";
          return lastKind === "dome" ? "leafhush" : "dome";
      }
      if (roll < 0.14)
          return "carolinae";
      if (roll < 0.28)
          return "hingeshut";
      if (roll < 0.42)
          return "berryforage";
      if (roll < 0.56)
          return "shellsoak";
      if (roll < 0.7)
          return "nestscrape";
      if (roll < 0.85)
          return "dome";
      return "leafhush";
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
      return key === TRICK_KEY || key === "lid";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "denslid";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "denslid" ? "sit" : name === "inklid" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function denslidPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslid));
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
  function inklidPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inklid));
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
  function densdomePose(t) {
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
      if (next.kind === "denslid") {
          const pose = denslidPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "inklid") {
          const pose = inklidPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = densdomePose(next.t);
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
      const anim = kind === "carolinae"
          ? "sit"
          : kind === "hingeshut"
              ? "sit"
              : kind === "berryforage"
                  ? "play"
                  : kind === "shellsoak"
                      ? "sit"
                      : kind === "nestscrape"
                          ? "play"
                          : kind === "dome"
                              ? "sit"
                              : kind === "leafhush"
                                  ? "sit"
                                  : "sit";
      return {
          kind,
          phase: kind === "carolinae" ? "hold" : "go",
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
  function carolinaePose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.36) * 0.35,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function hingeshutPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.hingeshut));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "sit" };
      }
      if (u < 0.78) {
          const tip = Math.sin(t * 2.4);
          return {
              x: fromX + face * (0.8 + tip * 0.12),
              lift: 3.5 + Math.abs(tip) * 1.5,
              rot: face * (16 + tip * 10),
              anim: "sit",
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
  function berryforagePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.berryforage));
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
  function shellsoakPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.shellsoak));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.8, rot: s * 14 * face, anim: "sit" };
      }
      if (u < 0.78) {
          const cast = Math.sin(t * 2.6);
          return {
              x: fromX - face * cast * 0.16,
              lift: 3.6 + Math.abs(cast) * 1.6,
              rot: face * (14 + cast * 12),
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
  function nestscrapePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.nestscrape));
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
  function domePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.dome));
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
  function leafhushPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.leafhush));
      const face = facing == null ? 1 : facing;
      if (u < 0.14) {
          const s = smoothstep(u / 0.14);
          return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "sit" };
      }
      if (u < 0.55) {
          const stretch = Math.sin(t * 2.3);
          return {
              x: fromX + face * stretch * 0.1,
              lift: 3.4 + stretch * 1.4,
              rot: face * (12 + stretch * 9),
              anim: "sit",
          };
      }
      if (u < 0.78) {
          const hush = Math.sin(t * 0.85);
          return {
              x: fromX,
              lift: 4.4 + Math.abs(hush) * 0.7,
              rot: face * (5 + hush * 3),
              anim: "sit",
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
      if (shouldAbort(flags) && trick.kind !== "hingeshut" && trick.kind !== "berryforage" && trick.kind !== "shellsoak" && trick.kind !== "nestscrape" && trick.kind !== "dome" && trick.kind !== "leafhush") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "carolinae") {
          if (next.t < CAROLINAE_HOLD) {
              const pose = carolinaePose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < CAROLINAE_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - CAROLINAE_HOLD);
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
      if (next.kind === "hingeshut") {
          const pose = hingeshutPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "berryforage") {
          const pose = berryforagePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "shellsoak") {
          const pose = shellsoakPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "nestscrape") {
          const pose = nestscrapePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "dome") {
          const pose = domePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = leafhushPose(next.t, fromX, trick.facing);
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
    CAROLINAE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    carolinaePose,
    releasePose,
    hingeshutPose,
    berryforagePose,
    shellsoakPose,
    nestscrapePose,
    domePose,
    leafhushPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denslidPose,
    inklidPose,
    densdomePose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBoxTurtleTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
