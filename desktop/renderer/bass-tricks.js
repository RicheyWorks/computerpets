/** Lunge ground tricks while idle — ultra-polish pass. House neighborly Centrarchidae / Micropterus salmoides Largemouth Bass freshwater-ambush desk life (bass / Lunge) — coverstrike / bedfan / surboil / latline / maxilla / weedline / salmoides personality (coverstrike ambush strike from cover without naming cover or strike or ambush or lunge or hunt or prey or chase or attack or rush or dart or snap or bite or jaws or mouth or weed or log or stump or shadow alone, bedfan male nest-bed caudal fan without naming bed or fan or nest or spawn or scrape or dig or circular or circle or gravel or male or brood or guard or sit or hover or wash or sweep alone, surboil surface strike boil without naming surface or boil or splash or top or jump or leap or breach or froth or swirl or rise or burst or pop or roll or thrash alone, latline lateral-line hover sense without naming lateral or line or hover or sense or feel or vibrate or pressure or detect or scan or watch or idle or float or hang or drift or listen or quiet alone, maxilla maxilla-jaw flare set without naming maxilla or jaw or gape or mouth or flare or open or bite or tooth or lip or buccal alone, weedline weed-edge hang without naming weed or line or edge or hang or float or cover or shade or stalk or wait alone, long salmoides Micropterus salmoides freshwater Centrarchidae hush hold (THE salmoides sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or parietalgaze or nuchalrise or burrowsit or eggseize or acrodont or diapsid or punctatus or denspeak or inkpeak or densisle or hingeshut or berryforage or shellsoak or nestscrape or carolinae or denslid or inklid or densdome or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash or nictitate or gular or tympanum or frog or reed or snap or shut or hide or show or sit or still or gape or bass or lunge as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Peak owns parietalgaze/nuchalrise/burrowsit/eggseize/acrodont/diapsid/punctatus — do NOT reuse; Beak owns ambushgape; creek fish peers own theirs; Speck brook_trout next — leave salmonid words free; guest slug Lunge / key bass only for isKey matching — accept "bass" and "lunge"; do NOT name a trick "bass" or "lunge" or "tuatara" or "peak" or "box_turtle" or "lid" or "snapper" or "beak" or "snap" or "crocodile" or "jaw" or "alligator" or "levee" or "turtle" or "ink" or "still" or "flash" or "show" or "sit" or "gape" or "weedhush") — not Peak tuatara life, not Lid box-turtle life, not Beak snapper life, not Speck brook_trout life, not creek fish clones, not Rui red_panda life. Coverstrike cover ambush without naming cover alone, bedfan nest bed without naming bed alone, surboil surface boil without naming boil alone, latline lateral line without naming lateral alone, maxilla maxilla flare without naming jaw alone, weedline weed edge without naming weed alone, salmoides long sit_hold on the freshwater weed edge (THE salmoides sit_hold tell); denslunge / inklunge / densgape thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web bass-tricks.ts. Window-play FLASH unchanged. Ethogram softs + freeze — never names still/lunge/gape/bass as bare ethogram-only trick kinds. True Largemouth Bass Micropterus salmoides Centrarchidae desk life only — distinct from Peak, Lid, Beak, Jaw, Levee, Speck, creek peers, Ink, Spike, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Speck / brook_trout. No cry inventing — thank-yous are silent desk motion only; bass.wav EXISTS so prefersHouseCry adds bass after tuatara. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "bass";
  const TRICKS = ["coverstrike", "bedfan", "surboil", "latline", "maxilla", "weedline", "salmoides"];
  const HAPPY = ["denslunge", "inklunge", "densgape"];
  const HAPPY_DUR = { denslunge: 1.70, inklunge: 1.84, densgape: 1.76 };
  const SALMOIDES_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      salmoides: SALMOIDES_HOLD + RELEASE_S,
      coverstrike: 2.48,
      bedfan: 2.42,
      surboil: 2.56,
      latline: 2.44,
      maxilla: 2.40,
      weedline: 2.38,
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
      if (kind === "salmoides")
          return 40 + roll * 26;
      if (kind === "maxilla" || kind === "weedline" || kind === "coverstrike")
          return 12.8 + roll * 9.4;
      if (kind === "bedfan" || kind === "surboil" || kind === "latline")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "salmoides";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "salmoides") {
          if (roll < 0.17)
              return "coverstrike";
          if (roll < 0.33)
              return "bedfan";
          if (roll < 0.49)
              return "surboil";
          if (roll < 0.65)
              return "latline";
          if (roll < 0.83)
              return "maxilla";
          return "weedline";
      }
      if (lastKind === "coverstrike") {
          if (roll < 0.16)
              return "salmoides";
          if (roll < 0.32)
              return "bedfan";
          if (roll < 0.48)
              return "surboil";
          if (roll < 0.64)
              return "latline";
          if (roll < 0.82)
              return "maxilla";
          return "weedline";
      }
      if (lastKind === "bedfan") {
          if (roll < 0.14)
              return "salmoides";
          if (roll < 0.3)
              return "coverstrike";
          if (roll < 0.46)
              return "surboil";
          if (roll < 0.62)
              return "latline";
          if (roll < 0.8)
              return "maxilla";
          return "weedline";
      }
      if (lastKind === "maxilla" || lastKind === "weedline") {
          if (roll < 0.14)
              return "salmoides";
          if (roll < 0.3)
              return "coverstrike";
          if (roll < 0.46)
              return "bedfan";
          if (roll < 0.62)
              return "surboil";
          if (roll < 0.78)
              return "latline";
          return lastKind === "maxilla" ? "weedline" : "maxilla";
      }
      if (roll < 0.14)
          return "salmoides";
      if (roll < 0.28)
          return "coverstrike";
      if (roll < 0.42)
          return "bedfan";
      if (roll < 0.56)
          return "surboil";
      if (roll < 0.7)
          return "latline";
      if (roll < 0.85)
          return "maxilla";
      return "weedline";
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
      return key === TRICK_KEY || key === "lunge";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "denslunge";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "denslunge" ? "sit" : name === "inklunge" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function denslungePose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslunge));
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
  function inklungePose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inklunge));
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
  function densgapePose(t) {
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
      if (next.kind === "denslunge") {
          const pose = denslungePose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "inklunge") {
          const pose = inklungePose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = densgapePose(next.t);
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
      const anim = kind === "salmoides"
          ? "sit"
          : kind === "coverstrike"
              ? "play"
              : kind === "bedfan"
                  ? "sit"
                  : kind === "surboil"
                      ? "play"
                      : kind === "latline"
                          ? "talk"
                          : kind === "maxilla"
                              ? "sit"
                              : kind === "weedline"
                                  ? "sit"
                                  : "sit";
      return {
          kind,
          phase: kind === "salmoides" ? "hold" : "go",
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
  function salmoidesPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.36) * 0.35,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function coverstrikePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.coverstrike));
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
  function bedfanPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.bedfan));
      const face = facing == null ? 1 : facing;
      if (u < 0.12) {
          const s = smoothstep(u / 0.12);
          return { x: fromX, lift: s * 2.6, rot: s * -10 * face, anim: "sit" };
      }
      if (u < 0.78) {
          const bob = Math.sin(t * 2.8);
          return {
              x: fromX + face * bob * 0.5,
              lift: 2.6 + Math.abs(bob) * 1.4,
              rot: face * (-10 + bob * 12),
              anim: "sit",
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
  function surboilPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.surboil));
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
  function latlinePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.latline));
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
  function maxillaPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.maxilla));
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
  function weedlinePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.weedline));
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
      if (shouldAbort(flags) && trick.kind !== "coverstrike" && trick.kind !== "bedfan" && trick.kind !== "surboil" && trick.kind !== "latline" && trick.kind !== "maxilla" && trick.kind !== "weedline") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "salmoides") {
          if (next.t < SALMOIDES_HOLD) {
              const pose = salmoidesPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < SALMOIDES_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - SALMOIDES_HOLD);
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
      if (next.kind === "coverstrike") {
          const pose = coverstrikePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "bedfan") {
          const pose = bedfanPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "surboil") {
          const pose = surboilPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "latline") {
          const pose = latlinePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "maxilla") {
          const pose = maxillaPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = weedlinePose(next.t, fromX, trick.facing);
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
    SALMOIDES_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    salmoidesPose,
    releasePose,
    coverstrikePose,
    bedfanPose,
    surboilPose,
    latlinePose,
    maxillaPose,
    weedlinePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denslungePose,
    inklungePose,
    densgapePose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBassTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
