/** Species-true window play. Rui clings and dives. Arc rides the title-bar ridge. Others walk a sill. */
(function (root) {
  const SPRITE = 176;
  const CLING = "cling-dive";
  const RIDGE = "ridge";
  const SILL = "sill";
  const IGNORE = "ignore";
  const WALK_PX = 98;
  const DUR = {
    leap: 0.48,
    cling: 0.55,
    hang: 1.35,
    drop: 0.42,
    dive: 0.72,
    ridgeLeap: 0.5,
    ridgeHold: 1.4,
    ridgeOff: 0.58,
    sillHop: 0.38,
    sillWalk: 1.55,
    sillDown: 0.36,
    land: 0.18,
  };

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function playFor(key) {
    if (key === "red_panda") return CLING;
    if (key === "cyber_dragon") return RIDGE;
    return SILL;
  }

  function canStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function shouldAbort(state) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving) return true;
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

  function nextPlayWait(justFinished, rand) {
    const roll = rand == null ? Math.random() : rand;
    return justFinished ? 18 + roll * 10 : 7 + roll * 8;
  }

  function gripLift(gripY, work) {
    const floor = work && work.floorLift ? work.floorLift : 0;
    const h = work && work.height ? work.height : 800;
    return h - floor - gripY;
  }

  function sideHold(win, side, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const x = side === "left" ? win.x - size * 0.38 : win.x + win.width - size * 0.62;
    const gripY = win.y + Math.max(40, win.height * 0.38);
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift), side };
  }

  function sillPoint(win, u, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 16;
    const x0 = win.x + pad;
    const x1 = win.x + win.width - size - pad;
    const span = Math.max(0, x1 - x0);
    const x = x0 + span * Math.max(0, Math.min(1, u));
    const lift = gripLift(win.y + 8, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 20, maxLift) };
  }

  function ridgePoint(win, u, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 20;
    const x0 = win.x + pad;
    const x1 = win.x + win.width - size - pad;
    const span = Math.max(0, x1 - x0);
    const x = x0 + span * Math.max(0, Math.min(1, u));
    const lift = gripLift(win.y, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function pickSide(win, petX, sprite, workW) {
    const size = sprite == null ? SPRITE : sprite;
    const petMid = petX + size / 2;
    const leftRoom = win.x > 20;
    const rightRoom = win.x + win.width < workW - 20;
    if (leftRoom && rightRoom) {
      return Math.abs(petMid - win.x) <= Math.abs(petMid - (win.x + win.width)) ? "left" : "right";
    }
    if (rightRoom && !leftRoom) return "right";
    if (leftRoom && !rightRoom) return "left";
    return petMid < workW / 2 ? "left" : "right";
  }

  function pickTarget(windows, petX, key, work, sprite, opts) {
    const kind = playFor(key);
    if (kind === IGNORE) return null;
    const size = sprite == null ? SPRITE : sprite;
    const workW = work && work.width ? work.width : 800;
    const list = Array.isArray(windows) ? windows : [];
    const usable = list.filter((w) => {
      if (!w) return false;
      if (kind === CLING) return w.height >= 160 && w.width >= 100;
      if (kind === RIDGE) return w.width >= 160 && w.height >= 80;
      return w.width >= 180 && w.height >= 70;
    });
    if (!usable.length) return null;
    let best = usable[0];
    let bestDist = Infinity;
    for (const w of usable) {
      const mid = w.x + w.width / 2;
      const d = Math.abs(mid - (petX + size / 2));
      if (d < bestDist) {
        best = w;
        bestDist = d;
      }
    }
    const roll = opts && opts.rand != null ? opts.rand : Math.random();
    if (kind === CLING) {
      const side = (opts && opts.side) || pickSide(best, petX, size, workW);
      const hold = sideHold(best, side, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const away = side === "left" ? -86 : 86;
      return {
        id: best.id,
        kind,
        side,
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        diveFrom: opts && opts.diveFrom ? opts.diveFrom : roll < 0.42 ? "top" : "side",
        spin: opts && opts.spin ? opts.spin : roll < 0.5 ? "backflip" : "spin",
      };
    }
    if (kind === RIDGE) {
      const hold = ridgePoint(best, 0.5, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const leave = opts && opts.leave ? opts.leave : roll < 0.5 ? "hop" : "slide";
      const away = hold.x < workW / 2 ? 88 : -88;
      return {
        id: best.id,
        kind,
        side: "top",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave,
        spin: "none",
      };
    }
    const start = sillPoint(best, 0.12, size, work);
    const end = sillPoint(best, 0.88, size, work);
    return {
      id: best.id,
      kind,
      side: "top",
      holdX: start.x,
      holdLift: start.lift,
      approachX: clamp(start.x, 8, Math.max(8, workW - size - 8)),
      landX: clamp(end.x, 8, Math.max(8, workW - size - 8)),
      sillEndX: end.x,
      spin: "none",
    };
  }

  function refitTarget(target, win, sprite, work) {
    if (!target || !win) return target;
    if (target.kind === CLING) {
      const hold = sideHold(win, target.side, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === RIDGE) {
      const hold = ridgePoint(win, 0.5, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    const start = sillPoint(win, 0.12, sprite, work);
    const end = sillPoint(win, 0.88, sprite, work);
    return { ...target, holdX: start.x, holdLift: start.lift, sillEndX: end.x };
  }

  function divePath(u, from, to, spin) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    const out = from && from.side === "left" ? -1 : 1;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const arc = 34 + Math.abs(fromLift - toLift) * 0.1;
    const turns = spin === "backflip" ? -360 : spin === "none" ? 0 : 360;
    return {
      x: fromX + (toX - fromX) * ease + out * 64 * Math.sin(t * Math.PI),
      lift: fromLift * (1 - ease) + toLift * ease + Math.sin(t * Math.PI) * arc,
      rot: turns * t,
    };
  }

  function leapPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + Math.sin(t * Math.PI) * 22,
      rot: (toX >= fromX ? 1 : -1) * 16 * Math.sin(t * Math.PI),
    };
  }

  function dropPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * smoothstep(t),
      lift: fromLift + (toLift - fromLift) * ease,
      rot: 0,
    };
  }

  function slideOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.38) {
      const s = t / 0.38;
      return {
        x: fromX + (toX - fromX) * 0.42 * smoothstep(s),
        lift: fromLift,
        rot: 0,
      };
    }
    const s = (t - 0.38) / 0.62;
    const midX = fromX + (toX - fromX) * 0.42;
    return {
      x: midX + (toX - midX) * smoothstep(s),
      lift: fromLift + (toLift - fromLift) * (s * s),
      rot: 0,
    };
  }

  function beginPlay(target, petX) {
    if (!target) return null;
    const x = petX == null ? target.approachX : petX;
    return {
      phase: "approach",
      t: 0,
      target,
      x,
      lift: 0,
      rot: 0,
      anim: "walk",
      facing: target.approachX >= x ? 1 : -1,
      from: { x, lift: 0 },
      to: { x: target.approachX, lift: 0 },
    };
  }

  function goPhase(play, phase, from, to, anim, facing) {
    return {
      ...play,
      phase,
      t: 0,
      from,
      to,
      anim: anim || play.anim,
      facing: facing || play.facing,
      x: from.x,
      lift: from.lift,
      rot: 0,
    };
  }

  function abortToFloor(play, pet, work) {
    const x = pet && pet.x != null ? pet.x : play.x;
    const lift = pet && pet.lift != null ? pet.lift : play.lift || 0;
    if (lift < 10) {
      return { ...play, phase: "done", t: 0, x, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    return goPhase(
      { ...play, abort: true },
      "drop",
      { x, lift },
      { x, lift: 0 },
      "play",
      play.facing,
    );
  }

  function findWin(windows, id) {
    if (!id || !Array.isArray(windows)) return null;
    return windows.find((w) => w && w.id === id) || null;
  }

  function stepPlay(play, dt, pet, windows, work, sprite, flags) {
    if (!play || play.phase === "done") return play;
    const size = sprite == null ? SPRITE : sprite;
    const life = flags || {};
    if (shouldAbort(life) && play.phase !== "drop" && play.phase !== "dive" && play.phase !== "land" && play.phase !== "ridge-off") {
      return abortToFloor(play, { x: play.x, lift: play.lift }, work);
    }
    let next = { ...play, t: play.t + Math.max(0, dt) };
    const win = findWin(windows, next.target && next.target.id);
    if (win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land" && next.phase !== "ridge-off") {
      next.target = refitTarget(next.target, win, size, work);
    } else if (!win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land" && next.phase !== "approach" && next.phase !== "ridge-off") {
      return abortToFloor(next, { x: next.x, lift: next.lift }, work);
    }

    const target = next.target;
    if (next.phase === "approach") {
      const dest = target.approachX;
      const dir = dest >= next.x ? 1 : -1;
      next.facing = dir;
      next.anim = "walk";
      next.x += dir * WALK_PX * dt;
      next.lift = 0;
      next.rot = 0;
      if ((dir === 1 && next.x >= dest) || (dir === -1 && next.x <= dest)) {
        next.x = dest;
        if (target.kind === CLING) {
          return goPhase(next, "leap", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === RIDGE) {
          return goPhase(next, "ridge-leap", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        return goPhase(next, "sill-hop", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
      }
      return next;
    }

    if (next.phase === "leap") {
      const u = next.t / DUR.leap;
      const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.side === "left" ? 1 : -1;
      if (u >= 1) return goPhase(next, "cling", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", next.facing);
      return next;
    }

    if (next.phase === "cling") {
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = target.side === "left" ? 1 : -1;
      if (next.t >= DUR.cling) {
        return goPhase(next, "hang", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "hang") {
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "play";
      if (next.t >= DUR.hang) {
        const leave = target.diveFrom === "top"
          ? { x: target.holdX, lift: target.holdLift + 18 }
          : { x: target.holdX, lift: target.holdLift };
        const land = { x: target.landX, lift: 0, side: target.side };
        if (target.kind === CLING) {
          return goPhase(next, "dive", leave, land, "play", next.facing);
        }
        return goPhase(next, "drop", leave, land, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "dive") {
      const u = next.t / DUR.dive;
      const pose = divePath(Math.min(1, u), { ...next.from, side: target.side }, next.to, target.spin);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "drop") {
      const u = next.t / DUR.drop;
      const pose = dropPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "ridge-leap") {
      const u = next.t / DUR.ridgeLeap;
      const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      if (u >= 1) {
        const face = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "ridge-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "ridge-hold") {
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (next.t >= DUR.ridgeHold) {
        const land = { x: target.landX, lift: 0 };
        return goPhase(next, "ridge-off", { x: target.holdX, lift: target.holdLift }, land, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "ridge-off") {
      const u = next.t / DUR.ridgeOff;
      const pose = target.leave === "slide"
        ? slideOffPath(Math.min(1, u), next.from, next.to)
        : leapPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = target.leave === "slide" ? 0 : pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "sill-hop") {
      const u = next.t / DUR.sillHop;
      const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      if (u >= 1) {
        return goPhase(next, "sill-walk", { x: target.holdX, lift: target.holdLift }, { x: target.sillEndX, lift: target.holdLift }, "walk", target.sillEndX >= target.holdX ? 1 : -1);
      }
      return next;
    }

    if (next.phase === "sill-walk") {
      const dest = target.sillEndX;
      const dir = dest >= next.x ? 1 : -1;
      next.facing = dir;
      next.anim = "walk";
      next.x += dir * (WALK_PX * 0.72) * dt;
      next.lift = target.holdLift;
      next.rot = 0;
      if ((dir === 1 && next.x >= dest) || (dir === -1 && next.x <= dest) || next.t >= DUR.sillWalk) {
        next.x = dest;
        return goPhase(next, "sill-down", { x: dest, lift: target.holdLift }, { x: dest, lift: 0 }, "play", dir);
      }
      return next;
    }

    if (next.phase === "sill-down") {
      const u = next.t / DUR.sillDown;
      const pose = dropPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "land") {
      next.x = next.to.x;
      next.lift = 0;
      next.rot = 0;
      next.anim = "idle";
      if (next.t >= DUR.land) return { ...next, phase: "done" };
      return next;
    }

    return next;
  }

  const api = {
    SPRITE,
    CLING,
    RIDGE,
    SILL,
    IGNORE,
    DUR,
    playFor,
    canStart,
    shouldAbort,
    nextPlayWait,
    sideHold,
    sillPoint,
    ridgePoint,
    pickTarget,
    refitTarget,
    divePath,
    leapPath,
    dropPath,
    slideOffPath,
    beginPlay,
    abortToFloor,
    stepPlay,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWindowPlay = api;
})(typeof window !== "undefined" ? window : globalThis);
