/** Banner ground tricks while idle — ultra-polish pass. House neighborly Papilionidae / Papilio glaucus Eastern Tiger Swallowtail desk life (swallowtail / Banner) — wingbanner / puddlesip / flutterhop / tailglidesettle / tornusflash / tigerband / papiliohush personality (wingbanner forewing open-close bask pulse without naming asclepias or oyamel or plumose or lunule or wing alone as wait, puddlesip mineral puddle-sip desk cue without naming proboscis or figure or sip alone as wait, flutterhop short flutter desk hop without naming hopskip or hindleap or hop or flutter alone as wait, tailglidesettle hindwing-tail flick then soft glide settle without naming tailflick or stream or tail alone as wait, tornusflash hindwing tornusflash flash warn without naming eye or spot or flash alone as wait, tigerband tiger-stripe band pulse without naming stripe or band or tiger alone as wait, long papiliohush Papilio swallowtail hush hold (THE papiliohush sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or asclepias or oyamel or plumose or lunule or densmilk or inkmilk or densdanaus or densghost or inkghost or densactias or hopskip or hindleap or deskbask or mandiblegraze or femurrasp or tympanal or saltatory or caeliferahush or densvault or inkvault or denscaelifera or leafstill or antennatick or tegminasong or leafwalk or tegminlift or greenmimic or tettigonihush or densblade or inkblade or denstettigonia or stridulate or antennasweep or burrowmouth or cerciflick or tegmenraise or gryllushush or denschirp or inkchirp or densgryllus or bury or flat or still or sit or walk or hop or spring or vault or banner or swallowtail as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Milk monarch owns asclepias/oyamel — do NOT reuse; Ghost luna owns plumose/lunule — do NOT reuse; Comb honeybee owns proboscis/figure — do NOT reuse; Dart darner — do NOT reuse; Chirp owns hopskip/stridulate/gryllushush — do NOT reuse; Vault owns hindleap/deskbask/mandiblegraze/femurrasp/tympanal/saltatory/caeliferahush — do NOT reuse (Banner owns wingbanner/puddlesip/flutterhop/tailglidesettle/tornusflash/tigerband/papiliohush, not Vault); Blade owns leafstill/tettigonihush — do NOT reuse; squirrel may own tailflick — do NOT reuse; Jewel jewelwing next — do NOT reuse bare banner/swallowtail; header forbids bare bury/flat/still/sit/wait and bare swallowtail/banner as trick kinds; guest slug Banner / key swallowtail only for wantsThankYou matching — accept "swallowtail" and "banner"; do NOT accept bare "banner" as a trick id; do NOT name a trick "swallowtail" or "banner" or "monarch" or "milk" or "luna" or "ghost" or "honeybee" or "comb" or "darner" or "dart" or "grasshopper" or "vault" or "katydid" or "blade" or "field_cricket" or "chirp" or "asclepias" or "oyamel" or "plumose" or "lunule" or "hopskip" or "hindleap" or "caeliferahush" or "densvault" or "densblade" or "denschirp") — not Milk Danaus monarch life, not Ghost Actias luna life, not Comb Apis honeybee life, not Dart Aeshnidae darner life, not Vault Melanoplus grasshopper life, not Blade Tettigoniidae katydid life, not Chirp Gryllus field-cricket life, not Jewel Calopterygidae jewelwing life (next guest), not Rui red_panda life. Wingbanner without naming wing alone, puddlesip without naming sip alone, flutterhop without naming hop alone, tailglidesettle without naming tail alone, tornusflash without naming eye alone, tigerband without naming tiger alone, papiliohush long sit_hold on the Papilio swallowtail hush (THE papiliohush sit_hold tell); densbanner / inkbanner / denspapilio thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web swallowtail-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names hunt/sit/still/wait/walk/banner as bare ethogram-only trick kinds. True Eastern Tiger Swallowtail Papilio glaucus Papilionidae desk life only — forewing bask pulse, puddle sip, flutter hop, tail-glide settle, tornusflash flash, tiger-band pulse, and Papilio hush; distinct from Milk monarch asclepias/oyamel, Ghost luna plumose/lunule, Comb honeybee, Dart darner, Vault grasshopper hindleap/deskbask/mandiblegraze/femurrasp/tympanal/saltatory/caeliferahush, Blade katydid, Chirp cricket hopskip, Jewel jewelwing next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Jewel / jewelwing. No cry inventing — thank-yous are silent desk motion only; swallowtail.wav EXISTS so prefersHouseCry adds swallowtail after grasshopper. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "swallowtail";
  const TRICKS = ["wingbanner", "puddlesip", "flutterhop", "tailglidesettle", "tornusflash", "tigerband", "papiliohush"];
  const HAPPY = ["densbanner", "inkbanner", "denspapilio"];

  const HAPPY_DUR = { densbanner: 1.70, inkbanner: 1.84, denspapilio: 1.76 };
  const PAPILIOHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    papiliohush: PAPILIOHUSH_HOLD + RELEASE_S,
    wingbanner: 2.48,
    puddlesip: 2.42,
    flutterhop: 2.40,
    tailglidesettle: 2.44,
    tornusflash: 2.38,
    tigerband: 2.56,
  };

  function canStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function shouldAbort(state) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return true;
    const cmd = String(state.cmd || "");
    return (
      cmd === "sleep" ||
      cmd === "leave" ||
      cmd === "hide" ||
      cmd === "rest" ||
      cmd === "seek" ||
      cmd === "eat" ||
      cmd === "play" ||
      cmd === "talk" ||
      cmd === "enter"
    );
  }

  function nextTrickWait(justFinished, rand, kind) {
    const roll = rand == null ? Math.random() : rand;
    if (kind === "papiliohush") return 40 + roll * 26;
    if (kind === "tornusflash" || kind === "wingbanner" || kind === "tailglidesettle") return 12.8 + roll * 9.4;
    if (kind === "flutterhop" || kind === "puddlesip" || kind === "tigerband") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "papiliohush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "papiliohush") {
      if (roll < 0.17) return "wingbanner";
      if (roll < 0.33) return "puddlesip";
      if (roll < 0.49) return "flutterhop";
      if (roll < 0.65) return "tailglidesettle";
      if (roll < 0.83) return "tornusflash";
      return "tigerband";
    }
    if (lastKind === "wingbanner") {
      if (roll < 0.16) return "papiliohush";
      if (roll < 0.32) return "puddlesip";
      if (roll < 0.48) return "flutterhop";
      if (roll < 0.64) return "tailglidesettle";
      if (roll < 0.82) return "tornusflash";
      return "tigerband";
    }
    if (lastKind === "puddlesip") {
      if (roll < 0.14) return "papiliohush";
      if (roll < 0.3) return "wingbanner";
      if (roll < 0.46) return "flutterhop";
      if (roll < 0.62) return "tailglidesettle";
      if (roll < 0.8) return "tornusflash";
      return "tigerband";
    }
    if (lastKind === "flutterhop") {
      if (roll < 0.15) return "papiliohush";
      if (roll < 0.31) return "wingbanner";
      if (roll < 0.47) return "puddlesip";
      if (roll < 0.63) return "tailglidesettle";
      if (roll < 0.81) return "tornusflash";
      return "tigerband";
    }
    if (lastKind === "tailglidesettle") {
      if (roll < 0.16) return "papiliohush";
      if (roll < 0.32) return "wingbanner";
      if (roll < 0.48) return "puddlesip";
      if (roll < 0.64) return "flutterhop";
      if (roll < 0.82) return "tornusflash";
      return "tigerband";
    }
    if (lastKind === "tornusflash") {
      if (roll < 0.15) return "papiliohush";
      if (roll < 0.31) return "wingbanner";
      if (roll < 0.47) return "puddlesip";
      if (roll < 0.63) return "flutterhop";
      if (roll < 0.81) return "tailglidesettle";
      return "tigerband";
    }
    if (lastKind === "tigerband") {
      if (roll < 0.16) return "papiliohush";
      if (roll < 0.32) return "wingbanner";
      if (roll < 0.48) return "puddlesip";
      if (roll < 0.64) return "flutterhop";
      if (roll < 0.82) return "tailglidesettle";
      return "tornusflash";
    }
    if (roll < 0.14) return "papiliohush";
    if (roll < 0.28) return "wingbanner";
    if (roll < 0.42) return "puddlesip";
    if (roll < 0.56) return "flutterhop";
    if (roll < 0.7) return "tailglidesettle";
    if (roll < 0.85) return "tornusflash";
    return "tigerband";
  }

  function happyCanStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function happyShouldAbort(state) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving) return true;
    const cmd = String(state.cmd || "");
    return (
      cmd === "sleep" ||
      cmd === "leave" ||
      cmd === "hide" ||
      cmd === "rest" ||
      cmd === "seek" ||
      cmd === "play" ||
      cmd === "talk" ||
      cmd === "enter"
    );
  }

  function wantsThankYou(key  ) {
    return key === TRICK_KEY || key === "banner";
  }

  function startThankYou(
    key  ,
    lastKind,
    x,
    facing,
    flags
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
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
    const name = (HAPPY).includes(kind) ? (kind) : "densbanner";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densbanner" ? "sit" : name === "inkbanner" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densbannerPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbanner));
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

  function inkbannerPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkbanner));
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

  function denspapilioPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.58) * 8,
      dx: Math.sin(t * 0.4) * 0.06,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densbanner") {
      const pose = densbannerPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkbanner") {
      const pose = inkbannerPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denspapilioPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "papiliohush"
        ? "sit"
        : kind === "wingbanner"
          ? "play"
          : kind === "tigerband"
            ? "talk"
            : kind === "puddlesip"
              ? "walk"
              : kind === "flutterhop"
                ? "sit"
                : kind === "tailglidesettle"
                  ? "play"
                  : kind === "tornusflash"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "papiliohush" ? "hold" : "go",
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

  function papiliohushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function wingbannerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wingbanner));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.78) {
      const bar = Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.8 + bar * 0.16),
        lift: 2.8 + Math.abs(bar) * 1.5,
        rot: face * (-12 + bar * 10),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (-4 * (1 - s)),
      anim: "idle",
    };
  }

  function puddlesipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.puddlesip));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function tigerbandPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tigerband));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" };
    }
    if (u < 0.8) {
      const cloud = Math.sin(t * 3.0);
      return {
        x: fromX + face * (0.6 + cloud * 0.18),
        lift: 3.0 + Math.abs(cloud) * 1.8,
        rot: face * (14 + cloud * 12),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.5 * (1 - s),
      rot: face * (5 * (1 - s)),
      anim: "idle",
    };
  }

  function tailglidesettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tailglidesettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "play" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 1.0 * (1 - s),
      lift: 1.6 * (1 - s),
      rot: face * (6 * (1 - s)),
      anim: "idle",
    };
  }

  function flutterhopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.flutterhop));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const hang = Math.sin(t * 2.0);
      return {
        x: fromX + face * (0.5 + hang * 0.1),
        lift: 2.8 + Math.abs(hang) * 1.2,
        rot: face * (11 + hang * 8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.5 * (1 - s),
      lift: 1.3 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function tornusflashPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tornusflash));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (4 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "wingbanner" &&
      trick.kind !== "puddlesip" &&
      trick.kind !== "flutterhop" &&
      trick.kind !== "tailglidesettle" &&
      trick.kind !== "tornusflash" &&
      trick.kind !== "tigerband"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "papiliohush") {
      if (next.t < PAPILIOHUSH_HOLD) {
        const pose = papiliohushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PAPILIOHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PAPILIOHUSH_HOLD);
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
    if (next.kind === "wingbanner") {
      const pose = wingbannerPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "puddlesip") {
      const pose = puddlesipPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "flutterhop") {
      const pose = flutterhopPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tailglidesettle") {
      const pose = tailglidesettlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tornusflash") {
      const pose = tornusflashPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tigerbandPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }



  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    PAPILIOHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    papiliohushPose,
    releasePose,
    wingbannerPose,
    puddlesipPose,
    tigerbandPose,
    tailglidesettlePose,
    flutterhopPose,
    tornusflashPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densbannerPose,
    inkbannerPose,
    denspapilioPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSwallowtailTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
