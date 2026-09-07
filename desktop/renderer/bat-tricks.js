/** Cape ground tricks while idle. House neighborly Vespertilionidae / Eptesicus fuscus big brown bat attic-nook desk life — wingwrap / traguscup / thumbcrawl / duskhang / eptesicus personality (wingwrap plagiopatagium cape-fold without naming cape or wing or membrane or patagium or fold or wrap or cloak or flap or fly or soar or glide or hover or sip, traguscup tragus cup-and-aim without naming ear or pinna or listen or hear or sense or echo or sonar or probe or haller or antennule or palp or earswivel, thumbcrawl chiropteran thumb claw desk crawl without naming crawl or walk or run or dart or dash or sprint or chase or hunt or claw or thumb or scurry or climb, duskhang alert hang-sway without naming hang or roost or sleep or upside or invert or drop or fall or leap or hop, long eptesicus Eptesicus fuscus freeze-alert attic hold — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or orient or saccade or palp or dragline or phidippus or cursor or eggsac or spiderling or eyeshine or tigrosa or urticate or threat or cork or ecdysis or aphonopelma or hourglass or tangle or wrap or gumfoot or latrodectus or legwave or oscillate or autotomy or gregarious or phalangium or pedipalp or metasoma or fluoresce or sanddig or centruroides or flagellum or acetic or palpcrush or trayburrow or mastigoproctus or quest or haller or hypostome or engorge or ixodes or malleoli or suctorial or chelicrush or sprintburst or eremobates or flagtail or edgebrowse or earswivel or forestamp or odocoileus or promenade or oil or dab or tip or drum or sip or hover; window-play RUN and Call Cape leave bat alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Loom/Leap/Prowl/Velvet/Hour/Stem/Barb/Whip/Clasp/Gale/Flag own their tricks; guest slug Cape / key bat — accept "bat" and "cape" (roster slug cape; campaign Cape); do NOT name a trick bat or cape or eptesicus_fuscus or chiroptera or megabat or microbat or vampire or fruit or fox or flying). Thank-yous fuscus / blossevillii / atticnook. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web bat-tricks.ts. Window-play RUN unchanged. True big brown bat Vespertilionidae desk life — not deer/solifuge/tick/vinegaroon/scorpion/fox/rabbit/rui clones. Cache owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "bat";
  const TRICKS = ["wingwrap", "traguscup", "thumbcrawl", "duskhang", "eptesicus"];
  const HAPPY = ["fuscus", "blossevillii", "atticnook"];
  const HAPPY_DUR = { fuscus: 1.84, blossevillii: 1.98, atticnook: 1.90 };
  const EPTESICUS_HOLD = 20.00;
  const RELEASE_S = 1.34;
  const DUR = { eptesicus: EPTESICUS_HOLD + RELEASE_S, wingwrap: 2.78, traguscup: 2.72, thumbcrawl: 2.94, duskhang: 2.86 };

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
      if (kind === "eptesicus") return 102 + roll * 24;
  if (kind === "wingwrap") return 17.4 + roll * 8.8;
  if (kind === "traguscup") return 18.6 + roll * 9.4;
  if (kind === "duskhang") return 20.0 + roll * 10.0;
  return justFinished ? 16.2 + roll * 8.2 : 10.2 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "eptesicus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "eptesicus") {
      if (roll < 0.26) return "wingwrap";
      if (roll < 0.5) return "traguscup";
      if (roll < 0.74) return "thumbcrawl";
      return "duskhang";
    }
    if (lastKind === "wingwrap") {
      if (roll < 0.26) return "eptesicus";
      if (roll < 0.5) return "traguscup";
      if (roll < 0.74) return "thumbcrawl";
      return "duskhang";
    }
    if (lastKind === "traguscup") {
      if (roll < 0.22) return "eptesicus";
      if (roll < 0.44) return "wingwrap";
      if (roll < 0.68) return "thumbcrawl";
      return "duskhang";
    }
    if (roll < 0.2) return "eptesicus";
    if (roll < 0.4) return "wingwrap";
    if (roll < 0.6) return "traguscup";
    if (roll < 0.8) return "thumbcrawl";
    return "duskhang";
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

  function wantsThankYou(key) {
    return key === TRICK_KEY || key === "cape";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
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
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.022, rot: s * 2.40, dx: 0, anim: "sit" };
    }
    if (u < 0.84) {
      const flash = Math.sin(t * 4.2) + 0.14 * Math.sin(t * 8.4);
      return { lift: 0.022 + Math.abs(flash) * 0.014, rot: 2.40 + flash * 1.40, dx: flash * 0.00072, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.005 * (1 - s), rot: 0.30 * (1 - s), dx: 0, anim: "idle" };
  }
  function blossevilliiPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blossevillii));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.040, rot: s * -3.00, dx: s * 0.0016, anim: "play" };
    }
    if (u < 0.85) {
      const spring = Math.sin(t * 3.2) + 0.16 * Math.sin(t * 6.4);
      return { lift: 0.040 + Math.abs(spring) * 0.018, rot: -3.00 + spring * 2.30, dx: spring * 0.0020, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.010 * (1 - s), rot: -0.38 * (1 - s), dx: 0, anim: "sit" };
  }
  function atticnookPose(t) {
    return { lift: 0.009 + Math.abs(Math.sin(t * 0.16)) * 0.014, rot: Math.sin(t * 0.16) * 1.15, dx: Math.sin(t * 0.12) * 0.00078, anim: "sit" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "fuscus") {
      const pose = fuscusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "blossevillii") {
      const pose = blossevilliiPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = atticnookPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "eptesicus"
        ? "sit"
        : kind === "wingwrap"
          ? "play"
          : kind === "traguscup"
            ? "talk"
            : kind === "thumbcrawl"
              ? "talk"
              : kind === "duskhang"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "eptesicus" ? "hold" : "go",
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


                      function eptesicusPose(t) {
    const breath = Math.sin(t * 0.052) + 0.034 * Math.sin(t * 0.15);
    const hush = Math.abs(Math.sin(t * 0.058));
    return { lift: 0.007 + hush * 0.007, rot: 0.32 + breath * 0.42 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.0038 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.16 * (1 - u) };
  }

  function wingwrapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wingwrap));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.0010, lift: s * 0.048, rot: s * -5.2 * face, anim: "play" };
    }
    if (u < 0.86) {
      const wrap = Math.sin((u - 0.11) / 0.75 * Math.PI * 3.6);
      const fold = Math.sin(t * 5.8) + 0.17 * Math.sin(t * 11.6);
      return { x: fromX + face * (0.0010 + wrap * 0.0011 + fold * 0.00030), lift: 0.042 + Math.abs(wrap) * 0.018 + Math.abs(fold) * 0.008, rot: (-5.2 + wrap * 3.4 + fold * 1.9) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.0010 * (1 - s), lift: 0.009 * (1 - s), rot: -0.9 * (1 - s) * face, anim: "idle" };
  }
  function traguscupPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.traguscup));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0005, lift: s * 0.014, rot: s * 4.0 * face, anim: "talk" };
    }
    if (u < 0.88) {
      const cup = Math.sin((u - 0.10) / 0.78 * Math.PI * 5.2);
      const flick = Math.sin(t * 9.0) + 0.19 * Math.sin(t * 18.0);
      return { x: fromX + face * (0.0005 + cup * 0.0008 + flick * 0.00024), lift: 0.012 + Math.abs(cup) * 0.011 + Math.abs(flick) * 0.004, rot: (4.0 + cup * 3.8 + flick * 2.0) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0005 * (1 - s), lift: 0.003 * (1 - s), rot: 0.7 * (1 - s) * face, anim: "idle" };
  }
  function thumbcrawlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.thumbcrawl));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0024, lift: s * -0.018, rot: s * 5.6 * face, anim: "play" };
    }
    if (u < 0.84) {
      const crawl = Math.sin((u - 0.12) / 0.72 * Math.PI * 4.2);
      const claw = Math.sin(t * 6.4) + 0.15 * Math.sin(t * 12.8);
      return { x: fromX + face * (0.0024 + crawl * 0.0014 + claw * 0.00032), lift: -0.014 + Math.abs(crawl) * 0.014 + Math.abs(claw) * 0.006, rot: (5.6 + crawl * 2.4 + claw * 1.4) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.0024 * (1 - s), lift: -0.003 * (1 - s), rot: 0.8 * (1 - s) * face, anim: "idle" };
  }
  function duskhangPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.duskhang));
    const face = facing == null ? 1 : facing;
    if (u < 0.09) {
      const s = smoothstep(u / 0.09);
      return { x: fromX + face * s * 0.0008, lift: s * 0.036, rot: s * -2.8 * face, anim: "play" };
    }
    if (u < 0.55) {
      const hang = Math.sin((u - 0.09) / 0.46 * Math.PI * 2.8);
      const sway = Math.sin(t * 4.6) + 0.13 * Math.sin(t * 9.2);
      return { x: fromX + face * (0.0008 + hang * 0.0007 + sway * 0.00028), lift: 0.032 + Math.abs(hang) * 0.016 + Math.abs(sway) * 0.007, rot: (-2.8 + hang * 2.2 + sway * 1.5) * face, anim: "play" };
    }
    if (u < 0.88) {
      const settle = Math.sin((u - 0.55) / 0.33 * Math.PI);
      return { x: fromX + face * (0.0012 - settle * 0.0004), lift: 0.018 + Math.abs(settle) * 0.010, rot: (-0.8 + settle * 1.6) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0008 * (1 - s), lift: 0.005 * (1 - s), rot: -0.2 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "wingwrap" && trick.kind !== "traguscup" && trick.kind !== "thumbcrawl" && trick.kind !== "duskhang") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
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
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "wingwrap") {
      const pose = wingwrapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "traguscup") {
      const pose = traguscupPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "thumbcrawl") {
      const pose = thumbcrawlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = duskhangPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
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
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBatTricks = api;
})(typeof window !== "undefined" ? window : globalThis);