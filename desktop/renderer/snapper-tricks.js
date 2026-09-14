/** Beak ground tricks while idle — ultra-polish pass. House neighborly Chelydridae / Chelydra serpentina Common Snapping Turtle mud-bowl desk life (snapper / Beak) — ambushgape / mudbury / necklunge / banksnap / serrated / plastron / serpentina personality (ambushgape ambush open-mouth wait without naming ambush or gape or open or mouth or wait or lure or tongue or worm or bait or sit or freeze or still or stalk or crouch or hide, mudbury silt bury without naming mud or bury or silt or sink or dig or cover or cloak or nest or wallow or soak or bath or settle or bed or hide or dive, necklunge long-neck strike without naming neck or lunge or strike or dart or spear or whip or reach or coil or jolt or snap or bite or jab or thrust or shoot or extend, banksnap bankside clamp without naming bank or snap or bite or hiss or clamp or crush or chomp or grit or jaw or beak or tooth or mouth or growl or threat alone, serrated sawtooth posterior marginals without naming serrated or saw or tooth or edge or marginal or carapace or ridge or keel or scute alone, plastron reduced cruciform belly plate without naming plastron or belly or plate or cross or cruciform or bridge or shell alone, long serpentina Chelydra serpentina mud-calm plastron hush hold (THE serpentina sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or toothlock or highwalk or salttear or nestpit or vsnout or keelridge or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or osteoderm or scutehush or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or coronal or sandhush or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or casque or zygodactyl or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or bluetail or stonehush or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or nuchal or vinehush or anolis or toepadcling or vocalclick or lickeye or mothstalk or setae or lamphush or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash or nictitate or gular or tympanum or frog or reed or snap or shut or hide or show or sit or still as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Jaw owns toothlock/highwalk/salttear/nestpit/vsnout/keelridge/acutus; Levee owns bellowbank/deathcoil/snoutspy/baskgape/osteoderm/scutehush/mississippi; Ink turtle already ultra — keep Chelydra-true not painted turtle; Lid/box_turtle next — leave hinge/shut words free; not Macrochelys alligator-snapper tongue-lure; guest slug Beak / key snapper only for isKey matching — accept "snapper" and "beak"; do NOT name a trick "snapper" or "beak" or "snap" or "crocodile" or "jaw" or "alligator" or "levee" or "turtle" or "ink" or "box_turtle" or "lid" or "shut" or "still" or "flash" or "show" or "sit") — not Jaw crocodile life, not Levee alligator life, not Lid box-turtle life, not Ink painted-turtle life, not Rui red_panda life. Ambushgape open wait without naming gape alone, mudbury silt bury without naming mud alone, necklunge long-neck strike without naming neck alone, banksnap bank clamp without naming snap alone, serrated sawtooth marginals without naming serrated alone, plastron cruciform plate without naming plastron alone, serpentina long sit_hold on the mud bowl (THE serpentina sit_hold tell); densbeak / inkbeak / densplastron thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web snapper-tricks.ts. Window-play FLASH unchanged. Ethogram softs + freeze — never names snap/sit/still/snapper as bare ethogram-only trick kinds. True Chelydra serpentina Chelydridae Common Snapping Turtle desk life only — distinct from Jaw, Levee, Lid, Ink, Spike, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Lid / box_turtle. No cry inventing — thank-yous are silent desk motion only; no snapper.wav on disk so prefersHouseCry skipped. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "snapper";
  const TRICKS = ["ambushgape", "mudbury", "necklunge", "banksnap", "serrated", "plastron", "serpentina"];
  const HAPPY = ["densbeak", "inkbeak", "densplastron"];
  const HAPPY_DUR = { densbeak: 1.70, inkbeak: 1.84, densplastron: 1.76 };
  const SERPENTINA_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
      serpentina: SERPENTINA_HOLD + RELEASE_S,
      ambushgape: 2.48,
      mudbury: 2.42,
      necklunge: 2.56,
      banksnap: 2.44,
      serrated: 2.40,
      plastron: 2.38,
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
      if (kind === "serpentina")
          return 40 + roll * 26;
      if (kind === "serrated" || kind === "plastron" || kind === "ambushgape")
          return 12.8 + roll * 9.4;
      if (kind === "mudbury" || kind === "necklunge" || kind === "banksnap")
          return 11.6 + roll * 8.5;
      return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
      if (musicOn)
          return "serpentina";
      const roll = rand == null ? Math.random() : rand;
      if (lastKind === "serpentina") {
          if (roll < 0.17)
              return "ambushgape";
          if (roll < 0.33)
              return "mudbury";
          if (roll < 0.49)
              return "necklunge";
          if (roll < 0.65)
              return "banksnap";
          if (roll < 0.83)
              return "serrated";
          return "plastron";
      }
      if (lastKind === "ambushgape") {
          if (roll < 0.16)
              return "serpentina";
          if (roll < 0.32)
              return "mudbury";
          if (roll < 0.48)
              return "necklunge";
          if (roll < 0.64)
              return "banksnap";
          if (roll < 0.82)
              return "serrated";
          return "plastron";
      }
      if (lastKind === "mudbury") {
          if (roll < 0.14)
              return "serpentina";
          if (roll < 0.3)
              return "ambushgape";
          if (roll < 0.46)
              return "necklunge";
          if (roll < 0.62)
              return "banksnap";
          if (roll < 0.8)
              return "serrated";
          return "plastron";
      }
      if (lastKind === "serrated" || lastKind === "plastron") {
          if (roll < 0.14)
              return "serpentina";
          if (roll < 0.3)
              return "ambushgape";
          if (roll < 0.46)
              return "mudbury";
          if (roll < 0.62)
              return "necklunge";
          if (roll < 0.78)
              return "banksnap";
          return lastKind === "serrated" ? "plastron" : "serrated";
      }
      if (roll < 0.14)
          return "serpentina";
      if (roll < 0.28)
          return "ambushgape";
      if (roll < 0.42)
          return "mudbury";
      if (roll < 0.56)
          return "necklunge";
      if (roll < 0.7)
          return "banksnap";
      if (roll < 0.85)
          return "serrated";
      return "plastron";
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
      return key === TRICK_KEY || key === "beak";
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
      const name = HAPPY.indexOf(kind) >= 0 ? kind : "densbeak";
      return {
          kind: name,
          happy: true,
          phase: "go",
          t: 0,
          x: x,
          lift: 0,
          rot: 0,
          anim: name === "densbeak" ? "sit" : name === "inkbeak" ? "play" : "sit",
          facing: facing == null ? 1 : facing,
          fromX: x,
      };
  }
  function densbeakPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbeak));
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
  function inkbeakPose(t) {
      const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkbeak));
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
  function densplastronPose(t) {
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
      if (next.kind === "densbeak") {
          const pose = densbeakPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "inkbeak") {
          const pose = inkbeakPose(next.t);
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = densplastronPose(next.t);
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
      const anim = kind === "serpentina"
          ? "sit"
          : kind === "ambushgape"
              ? "talk"
              : kind === "mudbury"
                  ? "sit"
                  : kind === "necklunge"
                      ? "play"
                      : kind === "banksnap"
                          ? "play"
                          : kind === "serrated"
                              ? "sit"
                              : kind === "plastron"
                                  ? "sit"
                                  : "sit";
      return {
          kind,
          phase: kind === "serpentina" ? "hold" : "go",
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
  function serpentinaPose(t) {
      return {
          lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
          rot: -0.18 + Math.sin(t * 0.36) * 0.35,
      };
  }
  function releasePose(t) {
      const u = Math.max(0, Math.min(1, t / RELEASE_S));
      return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }
  function ambushgapePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.ambushgape));
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
  function mudburyPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.mudbury));
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
  function necklungePose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.necklunge));
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
  function banksnapPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.banksnap));
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
  function serratedPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.serrated));
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
  function plastronPose(t, fromX, facing) {
      const u = Math.max(0, Math.min(1, t / DUR.plastron));
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
      if (shouldAbort(flags) && trick.kind !== "ambushgape" && trick.kind !== "mudbury" && trick.kind !== "necklunge" && trick.kind !== "banksnap" && trick.kind !== "serrated" && trick.kind !== "plastron") {
          return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
      }
      const next = { ...trick, t: trick.t + Math.max(0, dt) };
      if (next.kind === "serpentina") {
          if (next.t < SERPENTINA_HOLD) {
              const pose = serpentinaPose(next.t);
              next.phase = "hold";
              next.lift = pose.lift;
              next.rot = pose.rot;
              next.anim = "sit";
              return next;
          }
          if (next.t < SERPENTINA_HOLD + RELEASE_S) {
              const pose = releasePose(next.t - SERPENTINA_HOLD);
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
      if (next.kind === "ambushgape") {
          const pose = ambushgapePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "mudbury") {
          const pose = mudburyPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "necklunge") {
          const pose = necklungePose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "banksnap") {
          const pose = banksnapPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else if (next.kind === "serrated") {
          const pose = serratedPose(next.t, fromX, trick.facing);
          next.x = pose.x;
          next.lift = pose.lift;
          next.rot = pose.rot;
          next.anim = pose.anim;
      }
      else {
          const pose = plastronPose(next.t, fromX, trick.facing);
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
    SERPENTINA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    serpentinaPose,
    releasePose,
    ambushgapePose,
    mudburyPose,
    necklungePose,
    banksnapPose,
    serratedPose,
    plastronPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densbeakPose,
    inkbeakPose,
    densplastronPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSnapperTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
