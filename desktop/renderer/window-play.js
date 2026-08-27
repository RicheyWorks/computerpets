/** Species-true window play. Rui clings and dives. Arc rides the title-bar ridge. Volt coils a window corner. Trace traces a window path. Flux fields the glass. Spark crackles an edge. Ion charges a corner, then bolts the glass. Gauss orbits the outside of the frame. Relay clicks two nodes. Fuse seats into a clip and holds. Ground seats the bottom lug and earths. Miso sits the top ledge. Pip watches from the floor at a window's feet. Thimble hops to a window, thumps on the floor beside it, then vanishes. Clip hops to a window, ducks into the bottom-inside corner as a drawer, cheeks inventory, then pops back to the floor. Whee waddles to a window, loaves on the floor at its feet, wheeks, popcorns once, then waddles off. Ink paddles the long way to a window, basks on the bottom rail as a pond stone, withdraws the head, then slides the long way back. Coin drifts onto a window as if the glass were a bowl, swims one slow honest circle on the pane, then drifts off. Echo hops onto a window as a lamp-shade perch, repeats the room kinder, then hops off. Rue walks to a window, scents the near jamb on the floor (muzzle in the crack), then slips away. Peck hops onto a window as a landing rock, stands in full dress, bows (brief, required), then hops down. Quill hooks a window jamb with the bill as a third foot, climbs, hangs sideways, quotes from the chest, then drops. Wick threads the sash-sill gap as a tube, then dashes off. Burr shuffles to a window, snuffles the foot of the pane, curls into a ball against the glass, waits, then uncurls and shuffles off. Floss hops onto a window meeting rail as a dust tray, rolls in the sash-dust, fluffs, then hops down. Bloom drifts onto a window as a cistern wall, walks the pane (a salamander on glass), then sinks off. Keel hops onto a window cornice, tosses fruit from the bill, then hops down. Sol climbs a sun-warmed pane, head-bobs once, flattens as the living ornament, then climbs down. Vesper drapes a window lintel as a sleeping wyrm, then slips down. Ember banks as a coal on the window ash, kindles, then returns. Others walk a sill. */
(function (root) {
  const SPRITE = 176;
  const CLING = "cling-dive";
  const RIDGE = "ridge";
  const COIL = "coil";
  const PATH = "path";
  const FIELD = "field";
  const CRACKLE = "crackle";
  const CHARGE = "charge";
  const ORBIT = "orbit";
  const CLICK = "click";
  const HOLD = "hold";
  const EARTH = "earth";
  const LEDGE = "ledge";
  const WATCH = "watch";
  const THUMP = "thump";
  const STASH = "stash";
  const WHEEK = "wheek";
  const BASK = "bask";
  const CIRCLE = "circle";
  const PERCH = "perch";
  const SCENT = "scent";
  const BOW = "bow";
  const HOOK = "hook";
  const THREAD = "thread";
  const BALL = "ball";
  const DUST = "dust";
  const WALL = "wall";
  const TOSS = "toss";
  const FLATTEN = "flatten";
  const DRAPE = "drape";
  const KINDLE = "kindle";
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
    coilOn: 0.68,
    coilHold: 1.45,
    coilOff: 0.72,
    pathOn: 0.52,
    pathWalk: 2.2,
    pathSit: 0.7,
    pathOff: 0.55,
    fieldOn: 0.76,
    fieldHold: 1.55,
    fieldOff: 0.82,
    crackleOn: 0.32,
    crackleHop: 0.26,
    crackleOff: 0.4,
    chargeOn: 0.88,
    chargeBolt: 0.36,
    chargeHold: 0.78,
    chargeOff: 0.5,
    orbitOn: 0.58,
    orbitLoop: 2.6,
    orbitHold: 0.72,
    orbitOff: 0.52,
    clickOn: 0.4,
    clickHold: 0.36,
    clickHop: 0.62,
    clickOff: 0.5,
    holdOn: 0.52,
    holdSit: 2.4,
    holdOff: 0.55,
    earthOn: 0.46,
    earthSit: 1.55,
    earthOff: 0.5,
    ledgeOn: 0.48,
    ledgeSit: 2.35,
    ledgeOff: 0.52,
    watchOn: 0.74,
    watchHold: 1.85,
    watchOff: 0.66,
    thumpOn: 0.34,
    thump: 0.3,
    thumpOff: 0.3,
    stashOn: 0.42,
    stashCheek: 0.88,
    stashOff: 0.4,
    wheekOn: 0.7,
    wheekLoaf: 0.72,
    wheek: 0.46,
    wheekPop: 0.4,
    wheekOff: 0.68,
    baskOn: 1.12,
    bask: 0.88,
    baskWithdraw: 1.72,
    baskOff: 1.08,
    circleOn: 0.92,
    circle: 2.85,
    circleOff: 0.88,
    perchOn: 0.4,
    perchTalk: 1.48,
    perchOff: 0.46,
    scentOn: 0.58,
    scent: 1.72,
    scentOff: 0.64,
    bowOn: 0.54,
    bowStand: 0.92,
    bow: 0.58,
    bowOff: 0.56,
    hookOn: 0.5,
    hookClimb: 1.24,
    hook: 1.72,
    hookOff: 0.58,
    threadOn: 0.44,
    thread: 1.48,
    threadOff: 0.38,
    ballOn: 0.76,
    ballSnuffle: 1.0,
    ball: 1.8,
    ballOff: 0.88,
    dustOn: 0.52,
    dust: 1.35,
    dustFluff: 0.62,
    dustOff: 0.5,
    wallOn: 1.08,
    wall: 2.42,
    wallOff: 0.96,
    tossOn: 0.52,
    tossSit: 0.88,
    toss: 0.72,
    tossOff: 0.56,
    flattenOn: 1.28,
    flattenBob: 1.4,
    flatten: 2.6,
    flattenOff: 1.18,
    drapeOn: 1.55,
    drapeSettle: 1.85,
    drape: 2.85,
    drapeOff: 1.42,
    kindleOn: 1.32,
    kindleCoal: 1.68,
    kindle: 2.18,
    kindleOff: 1.24,
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
    if (key === "volt_dragon") return COIL;
    if (key === "trace_dragon") return PATH;
    if (key === "flux_dragon") return FIELD;
    if (key === "spark_dragon") return CRACKLE;
    if (key === "ion_dragon") return CHARGE;
    if (key === "gauss_dragon") return ORBIT;
    if (key === "relay_dragon") return CLICK;
    if (key === "fuse_dragon") return HOLD;
    if (key === "ground_dragon") return EARTH;
    if (key === "cat") return LEDGE;
    if (key === "dog") return WATCH;
    if (key === "rabbit") return THUMP;
    if (key === "hamster") return STASH;
    if (key === "guinea_pig") return WHEEK;
    if (key === "turtle") return BASK;
    if (key === "goldfish") return CIRCLE;
    if (key === "budgie") return PERCH;
    if (key === "fox") return SCENT;
    if (key === "penguin") return BOW;
    if (key === "parrot") return HOOK;
    if (key === "ferret") return THREAD;
    if (key === "hedgehog") return BALL;
    if (key === "chinchilla") return DUST;
    if (key === "axolotl") return WALL;
    if (key === "toucan") return TOSS;
    if (key === "iguana") return FLATTEN;
    if (key === "dragon") return DRAPE;
    if (key === "phoenix") return KINDLE;
    return SILL;
  }

  function canStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving || state.card) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function shouldAbort(state) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving || state.card) return true;
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

  function coilPoint(win, corner, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const wrap = size * 0.36;
    const x = corner === "left" ? win.x - wrap : win.x + win.width - size + wrap;
    const lift = gripLift(win.y, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift), corner };
  }

  function cracklePoint(win, u, sprite, work, side) {
    const size = sprite == null ? SPRITE : sprite;
    const wrap = size * 0.28;
    const edge = side === "right" ? "right" : "left";
    const x = edge === "right" ? win.x + win.width - size + wrap : win.x - wrap;
    const topLift = gripLift(win.y, work);
    const botY = win.y + win.height * 0.7;
    const maxLift = (work && work.height ? work.height : 800) - 48;
    const botLift = clamp(gripLift(botY, work), 28, maxLift);
    const t = Math.max(0, Math.min(1, u));
    return {
      x,
      lift: clamp(topLift + (botLift - topLift) * t, 28, maxLift),
      side: edge,
    };
  }

  function chargeOpposite(corner) {
    if (corner === "tl") return "br";
    if (corner === "tr") return "bl";
    if (corner === "bl") return "tr";
    return "tl";
  }

  function chargePoint(win, corner, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const insetX = Math.max(22, size * 0.12);
    const insetTop = Math.max(52, size * 0.3);
    const insetBot = Math.max(44, size * 0.24);
    const name = corner === "tr" || corner === "bl" || corner === "br" ? corner : "tl";
    const right = name === "tr" || name === "br";
    const top = name === "tl" || name === "tr";
    const x = right ? win.x + win.width - size - insetX : win.x + insetX;
    const gripY = top ? win.y + insetTop : win.y + win.height - insetBot;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift), corner: name };
  }

  function fieldPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const insetTop = Math.max(56, size * 0.32);
    const insetBot = Math.max(36, size * 0.18);
    const x = win.x + (win.width - size) / 2;
    const innerH = Math.max(0, win.height - insetTop - insetBot);
    const gripY = win.y + insetTop + innerH * 0.5;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function pathPoint(win, u, sprite, work, side) {
    const size = sprite == null ? SPRITE : sprite;
    const t = Math.max(0, Math.min(1, u));
    const startSide = side === "right" ? "right" : "left";
    const farSide = startSide === "left" ? "right" : "left";
    const near = sideHold(win, startSide, size, work);
    const far = sideHold(win, farSide, size, work);
    const topLift = ridgePoint(win, 0.5, size, work).lift;
    const lowY = win.y + win.height * 0.72;
    const maxLift = (work && work.height ? work.height : 800) - 48;
    const lowLift = clamp(gripLift(lowY, work), 28, maxLift);
    const a = { x: near.x, lift: lowLift };
    const b = { x: near.x, lift: topLift };
    const c = { x: far.x, lift: topLift };
    const d = { x: far.x, lift: lowLift };
    let from;
    let to;
    let s;
    if (t < 1 / 3) {
      from = a;
      to = b;
      s = t * 3;
    } else if (t < 2 / 3) {
      from = b;
      to = c;
      s = (t - 1 / 3) * 3;
    } else {
      from = c;
      to = d;
      s = (t - 2 / 3) * 3;
    }
    return {
      x: from.x + (to.x - from.x) * s,
      lift: from.lift + (to.lift - from.lift) * s,
      side: startSide,
    };
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
      if (kind === COIL) return w.width >= 140 && w.height >= 140;
      if (kind === PATH) return w.width >= 180 && w.height >= 160;
      if (kind === FIELD) return w.width >= 220 && w.height >= 200;
      if (kind === CRACKLE) return w.width >= 100 && w.height >= 180;
      if (kind === CHARGE) return w.width >= 200 && w.height >= 200;
      if (kind === ORBIT) return w.width >= 200 && w.height >= 200;
      if (kind === CLICK) return w.width >= 160 && w.height >= 140;
      if (kind === HOLD) return w.width >= 140 && w.height >= 160;
      if (kind === EARTH) return w.width >= 180 && w.height >= 140;
      if (kind === LEDGE) return w.width >= 180 && w.height >= 80;
      if (kind === WATCH) return w.width >= 160 && w.height >= 70;
      if (kind === THUMP) return w.width >= 140 && w.height >= 70;
      if (kind === STASH) return w.width >= 160 && w.height >= 140;
      if (kind === WHEEK) return w.width >= 160 && w.height >= 70;
      if (kind === BASK) return w.width >= 180 && w.height >= 140;
      if (kind === CIRCLE) return w.width >= 220 && w.height >= 200;
      if (kind === PERCH) return w.width >= 140 && w.height >= 180;
      if (kind === SCENT) return w.width >= 140 && w.height >= 80;
      if (kind === BOW) return w.width >= 180 && w.height >= 160;
      if (kind === HOOK) return w.width >= 140 && w.height >= 200;
      if (kind === THREAD) return w.width >= 200 && w.height >= 80;
      if (kind === BALL) return w.width >= 160 && w.height >= 70;
      if (kind === DUST) return w.width >= 180 && w.height >= 200;
      if (kind === WALL) return w.width >= 200 && w.height >= 220;
      if (kind === TOSS) return w.width >= 180 && w.height >= 200;
      if (kind === FLATTEN) return w.width >= 180 && w.height >= 200;
      if (kind === DRAPE) return w.width >= 180 && w.height >= 200;
      if (kind === KINDLE) return w.width >= 180 && w.height >= 220;
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
    if (kind === COIL) {
      const corner = (opts && opts.side) || pickSide(best, petX, size, workW);
      const hold = coilPoint(best, corner, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const away = corner === "left" ? -90 : 90;
      return {
        id: best.id,
        kind,
        side: corner,
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        spin: "none",
      };
    }
    if (kind === PATH) {
      const startSide = (opts && opts.side) || pickSide(best, petX, size, workW);
      const start = pathPoint(best, 0, size, work, startSide);
      const end = pathPoint(best, 1, size, work, startSide);
      const approachX = clamp(start.x, 8, Math.max(8, workW - size - 8));
      const leave = opts && opts.leave ? opts.leave : roll < 0.5 ? "hop" : "drop";
      const away = startSide === "left" ? 88 : -88;
      return {
        id: best.id,
        kind,
        side: startSide,
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        pathEndX: end.x,
        pathEndLift: end.lift,
        leave,
        spin: "none",
      };
    }
    if (kind === FIELD) {
      const hold = fieldPoint(best, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const leave = opts && opts.leave ? opts.leave : roll < 0.5 ? "drift" : "drop";
      const away = hold.x < workW / 2 ? 88 : -88;
      return {
        id: best.id,
        kind,
        side: "glass",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave,
        spin: "none",
      };
    }
    if (kind === CRACKLE) {
      const edge = (opts && opts.side) || pickSide(best, petX, size, workW);
      const startU = opts && (opts.hopFrom === 0 || opts.hopFrom === 1) ? opts.hopFrom : roll < 0.5 ? 0 : 1;
      const endU = startU === 0 ? 1 : 0;
      const start = cracklePoint(best, startU, size, work, edge);
      const end = cracklePoint(best, endU, size, work, edge);
      const approachX = clamp(start.x, 8, Math.max(8, workW - size - 8));
      const leave = opts && opts.leave ? opts.leave : roll < 0.5 ? "hop" : "drop";
      const away = edge === "left" ? -88 : 88;
      return {
        id: best.id,
        kind,
        side: edge,
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        crackleEndX: end.x,
        crackleEndLift: end.lift,
        hopFrom: startU,
        hopTo: endU,
        leave,
        spin: "none",
      };
    }
    if (kind === CHARGE) {
      const edge = (opts && opts.side) || pickSide(best, petX, size, workW);
      const startCorner = (opts && opts.corner) || (edge === "right" ? "tr" : "tl");
      const endCorner = chargeOpposite(startCorner);
      const start = chargePoint(best, startCorner, size, work);
      const end = chargePoint(best, endCorner, size, work);
      const approachX = clamp(start.x, 8, Math.max(8, workW - size - 8));
      const leave = opts && (opts.leave === "hop" || opts.leave === "drop") ? opts.leave : roll < 0.5 ? "hop" : "drop";
      const endRight = endCorner === "tr" || endCorner === "br";
      const away = endRight ? 88 : -88;
      return {
        id: best.id,
        kind,
        side: startCorner === "tr" || startCorner === "br" ? "right" : "left",
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        chargeEndX: end.x,
        chargeEndLift: end.lift,
        startCorner,
        endCorner,
        leave,
        spin: "none",
      };
    }
    if (kind === ORBIT) {
      const side = (opts && opts.side) || pickSide(best, petX, size, workW);
      const dir = opts && (opts.orbitDir === -1 || opts.orbitDir === 1) ? opts.orbitDir : roll < 0.5 ? 1 : -1;
      const startU = side === "right" ? 0.75 : 0;
      const span = 0.82;
      const endU = ((startU + dir * span) % 1 + 1) % 1;
      const start = orbitPoint(best, startU, size, work, dir);
      const end = orbitPoint(best, endU, size, work, dir);
      const approachX = clamp(start.x, 8, Math.max(8, workW - size - 8));
      const leave = opts && (opts.leave === "hop" || opts.leave === "drop") ? opts.leave : roll < 0.5 ? "hop" : "drop";
      const away = side === "left" ? -88 : 88;
      return {
        id: best.id,
        kind,
        side,
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        orbitStartU: startU,
        orbitEndU: endU,
        orbitDir: dir,
        orbitEndX: end.x,
        orbitEndLift: end.lift,
        leave,
        spin: "none",
      };
    }
    if (kind === CLICK) {
      let other = best;
      let otherDist = Infinity;
      for (const w of usable) {
        if (!w || w.id === best.id) continue;
        const mid = w.x + w.width / 2;
        const d = Math.abs(mid - (best.x + best.width / 2));
        if (d < otherDist) {
          other = w;
          otherDist = d;
        }
      }
      const pair = opts && opts.pair === "corners" ? "corners" : "sides";
      const edge = (opts && opts.side) || pickSide(best, petX, size, workW);
      let startNode;
      let endNode;
      if (other.id !== best.id) {
        const aMid = best.x + best.width / 2;
        const bMid = other.x + other.width / 2;
        if (aMid <= bMid) {
          startNode = pair === "corners" ? "tr" : "right";
          endNode = pair === "corners" ? "tl" : "left";
        } else {
          startNode = pair === "corners" ? "tl" : "left";
          endNode = pair === "corners" ? "tr" : "right";
        }
      } else {
        startNode = pair === "corners" ? (edge === "right" ? "tr" : "tl") : edge;
        endNode = clickOpposite(startNode);
      }
      if (opts && opts.nodeFrom) startNode = opts.nodeFrom;
      if (opts && opts.nodeTo) endNode = opts.nodeTo;
      const start = clickPoint(best, startNode, size, work);
      const end = clickPoint(other, endNode, size, work);
      const approachX = clamp(start.x, 8, Math.max(8, workW - size - 8));
      const leave = opts && (opts.leave === "hop" || opts.leave === "drop") ? opts.leave : roll < 0.5 ? "hop" : "drop";
      const endRight = endNode === "right" || endNode === "tr" || endNode === "br";
      const away = endRight ? 88 : -88;
      return {
        id: best.id,
        clickToId: other.id,
        kind,
        side: startNode === "right" || startNode === "tr" || startNode === "br" ? "right" : "left",
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        clickEndX: end.x,
        clickEndLift: end.lift,
        startNode,
        endNode,
        leave,
        spin: "none",
      };
    }
    if (kind === HOLD) {
      const side = (opts && opts.side) || pickSide(best, petX, size, workW);
      const clip = opts && (opts.clip === "sash" || opts.clip === "jamb")
        ? opts.clip
        : roll < 0.5 ? "jamb" : "sash";
      const hold = holdPoint(best, clip, side, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const leave = opts && (opts.leave === "hop" || opts.leave === "drop") ? opts.leave : roll < 0.5 ? "hop" : "drop";
      const away = side === "left" ? -88 : 88;
      return {
        id: best.id,
        kind,
        side,
        clip,
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave,
        spin: "none",
      };
    }
    if (kind === EARTH) {
      const hold = earthPoint(best, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const leave = opts && (opts.leave === "step" || opts.leave === "drop") ? opts.leave : roll < 0.5 ? "step" : "drop";
      const away = hold.x < workW / 2 ? -72 : 72;
      return {
        id: best.id,
        kind,
        side: "bottom",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave,
        spin: "none",
      };
    }
    if (kind === LEDGE) {
      const hold = ledgePoint(best, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 88 : -88;
      return {
        id: best.id,
        kind,
        side: "top",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "hop",
        spin: "none",
      };
    }
    if (kind === WATCH) {
      const hold = watchPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -108 : 108;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 92 : -92;
      return {
        id: best.id,
        kind,
        side: "feet",
        holdX: hold.x,
        holdLift: 0,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "trot",
        spin: "none",
      };
    }
    if (kind === THUMP) {
      const edge = (opts && opts.side) || pickSide(best, petX, size, workW);
      const hold = thumpPoint(best, size, work, edge);
      const holdX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const approachOff = edge === "left" ? -96 : 96;
      const approachX = clamp(holdX + approachOff, 8, Math.max(8, workW - size - 8));
      const away = edge === "left" ? -118 : 118;
      return {
        id: best.id,
        kind,
        side: edge,
        holdX,
        holdLift: 0,
        approachX,
        landX: clamp(holdX + away, 8, Math.max(8, workW - size - 8)),
        leave: "vanish",
        spin: "none",
      };
    }
    if (kind === STASH) {
      const edge = (opts && opts.side) || pickSide(best, petX, size, workW);
      const hold = stashPoint(best, edge, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const away = edge === "left" ? -80 : 80;
      return {
        id: best.id,
        kind,
        side: edge,
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "pop",
        spin: "none",
      };
    }
    if (kind === WHEEK) {
      const hold = wheekPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -100 : 100;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 88 : -88;
      return {
        id: best.id,
        kind,
        side: "feet",
        holdX: hold.x,
        holdLift: 0,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "waddle",
        spin: "none",
      };
    }
    if (kind === BASK) {
      const hold = baskPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -168 : 168;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 156 : -156;
      return {
        id: best.id,
        kind,
        side: "rail",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "slide",
        spin: "none",
      };
    }
    if (kind === CIRCLE) {
      const dir = opts && (opts.circleDir === -1 || opts.circleDir === 1) ? opts.circleDir : 1;
      const hold = circlePoint(best, 0, size, work, dir);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 88 : -88;
      return {
        id: best.id,
        kind,
        side: "bowl",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "drift",
        spin: "none",
        circleDir: dir,
      };
    }
    if (kind === PERCH) {
      const side = (opts && opts.side) || pickSide(best, petX, size, workW);
      const hold = perchPoint(best, side, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const away = side === "left" ? -88 : 88;
      return {
        id: best.id,
        kind,
        side,
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "hop",
        spin: "none",
      };
    }
    if (kind === SCENT) {
      const side = (opts && opts.side) || pickSide(best, petX, size, workW);
      const hold = scentPoint(best, side, size, work);
      const holdX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const approachOff = side === "left" ? -92 : 92;
      const approachX = clamp(holdX + approachOff, 8, Math.max(8, workW - size - 8));
      const away = side === "left" ? -110 : 110;
      return {
        id: best.id,
        kind,
        side,
        holdX,
        holdLift: 0,
        approachX,
        landX: clamp(holdX + away, 8, Math.max(8, workW - size - 8)),
        leave: "slip",
        spin: "none",
      };
    }
    if (kind === BOW) {
      const hold = bowPoint(best, size, work);
      const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 88 : -88;
      return {
        id: best.id,
        kind,
        side: "pane",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "hop",
        spin: "none",
      };
    }
    if (kind === HOOK) {
      const side = (opts && opts.side) || pickSide(best, petX, size, workW);
      const start = hookPoint(best, side, 0, size, work);
      const hang = hookPoint(best, side, 1, size, work);
      const approachX = clamp(hang.x, 8, Math.max(8, workW - size - 8));
      const away = side === "left" ? -88 : 88;
      return {
        id: best.id,
        kind,
        side,
        holdX: hang.x,
        holdLift: hang.lift,
        hookStartX: start.x,
        hookStartLift: start.lift,
        approachX,
        landX: clamp(hang.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "drop",
        spin: "none",
      };
    }
    if (kind === THREAD) {
      const edge = (opts && opts.side) || pickSide(best, petX, size, workW);
      const startU = edge === "right" ? 1 : 0;
      const endU = startU === 0 ? 1 : 0;
      const start = threadPoint(best, startU, size, work);
      const end = threadPoint(best, endU, size, work);
      const approachX = clamp(start.x, 8, Math.max(8, workW - size - 8));
      const away = end.x >= start.x ? 80 : -80;
      return {
        id: best.id,
        kind,
        side: "gap",
        holdX: start.x,
        holdLift: start.lift,
        threadEndX: end.x,
        threadEndLift: end.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "dash",
        spin: "none",
      };
    }
    if (kind === BALL) {
      const hold = ballPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -92 : 92;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 72 : -72;
      return {
        id: best.id,
        kind,
        side: "foot",
        holdX: hold.x,
        holdLift: 0,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "shuffle",
        spin: "none",
      };
    }
    if (kind === DUST) {
      const hold = dustPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -88 : 88;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 76 : -76;
      return {
        id: best.id,
        kind,
        side: "tray",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "hop",
        spin: "none",
      };
    }
    if (kind === WALL) {
      const edge = (opts && opts.side) || pickSide(best, petX, size, workW);
      const start = wallPoint(best, 0, edge, size, work);
      const end = wallPoint(best, 1, edge, size, work);
      const approachX = clamp(start.x, 8, Math.max(8, workW - size - 8));
      const away = start.x < workW / 2 ? 72 : -72;
      return {
        id: best.id,
        kind,
        side: "tank",
        holdX: start.x,
        holdLift: start.lift,
        wallEndX: end.x,
        wallEndLift: end.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "sink",
        spin: "none",
      };
    }
    if (kind === TOSS) {
      const edge = opts && opts.side ? opts.side : pickSide(best, petX, size, workW);
      const hold = tossPoint(best, edge, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -80 : 80;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 72 : -72;
      return {
        id: best.id,
        kind,
        side: "cornice",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "hop",
        spin: "none",
      };
    }
    if (kind === FLATTEN) {
      const hold = flattenPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -96 : 96;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 80 : -80;
      return {
        id: best.id,
        kind,
        side: "brick",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "climb",
        spin: "none",
      };
    }
    if (kind === DRAPE) {
      const edge = (opts && opts.side) || pickSide(best, petX, size, workW);
      const hold = drapePoint(best, edge, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -88 : 88;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 72 : -72;
      return {
        id: best.id,
        kind,
        side: "lintel",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "slip",
        spin: "none",
      };
    }
    if (kind === KINDLE) {
      const hold = kindlePoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -80 : 80;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 76 : -76;
      return {
        id: best.id,
        kind,
        side: "ash",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "return",
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

  function refitTarget(target, win, sprite, work, windows) {
    if (!target || !win) return target;
    if (target.kind === CLING) {
      const hold = sideHold(win, target.side, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === RIDGE) {
      const hold = ridgePoint(win, 0.5, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === COIL) {
      const hold = coilPoint(win, target.side, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === PATH) {
      const start = pathPoint(win, 0, sprite, work, target.side);
      const end = pathPoint(win, 1, sprite, work, target.side);
      return { ...target, holdX: start.x, holdLift: start.lift, pathEndX: end.x, pathEndLift: end.lift };
    }
    if (target.kind === FIELD) {
      const hold = fieldPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === CRACKLE) {
      const start = cracklePoint(win, target.hopFrom != null ? target.hopFrom : 0, sprite, work, target.side);
      const end = cracklePoint(win, target.hopTo != null ? target.hopTo : 1, sprite, work, target.side);
      return { ...target, holdX: start.x, holdLift: start.lift, crackleEndX: end.x, crackleEndLift: end.lift };
    }
    if (target.kind === CHARGE) {
      const start = chargePoint(win, target.startCorner || "tl", sprite, work);
      const end = chargePoint(win, target.endCorner || chargeOpposite(target.startCorner || "tl"), sprite, work);
      return { ...target, holdX: start.x, holdLift: start.lift, chargeEndX: end.x, chargeEndLift: end.lift };
    }
    if (target.kind === ORBIT) {
      const startU = target.orbitStartU != null ? target.orbitStartU : 0;
      const endU = target.orbitEndU != null ? target.orbitEndU : 0.82;
      const start = orbitPoint(win, startU, sprite, work, target.orbitDir);
      const end = orbitPoint(win, endU, sprite, work, target.orbitDir);
      return { ...target, holdX: start.x, holdLift: start.lift, orbitEndX: end.x, orbitEndLift: end.lift };
    }
    if (target.kind === CLICK) {
      const fromWin = (windows && findWin(windows, target.id)) || win;
      const toWin = (windows && findWin(windows, target.clickToId)) || fromWin;
      const start = clickPoint(fromWin, target.startNode || "left", sprite, work);
      const end = clickPoint(toWin, target.endNode || clickOpposite(target.startNode || "left"), sprite, work);
      return { ...target, holdX: start.x, holdLift: start.lift, clickEndX: end.x, clickEndLift: end.lift };
    }
    if (target.kind === HOLD) {
      const hold = holdPoint(win, target.clip || "jamb", target.side, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === EARTH) {
      const hold = earthPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === LEDGE) {
      const hold = ledgePoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === WATCH) {
      const hold = watchPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: 0 };
    }
    if (target.kind === THUMP) {
      const edge = target.side === "right" ? "right" : "left";
      const hold = thumpPoint(win, sprite, work, edge);
      return { ...target, holdX: hold.x, holdLift: 0 };
    }
    if (target.kind === STASH) {
      const edge = target.side === "right" ? "right" : "left";
      const hold = stashPoint(win, edge, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === WHEEK) {
      const hold = wheekPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: 0 };
    }
    if (target.kind === BASK) {
      const hold = baskPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === CIRCLE) {
      const hold = circlePoint(win, 0, sprite, work, target.circleDir);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === PERCH) {
      const hold = perchPoint(win, target.side === "right" ? "right" : "left", sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === SCENT) {
      const hold = scentPoint(win, target.side === "right" ? "right" : "left", sprite, work);
      return { ...target, holdX: hold.x, holdLift: 0 };
    }
    if (target.kind === BOW) {
      const hold = bowPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === HOOK) {
      const edge = target.side === "right" ? "right" : "left";
      const start = hookPoint(win, edge, 0, sprite, work);
      const hang = hookPoint(win, edge, 1, sprite, work);
      return { ...target, holdX: hang.x, holdLift: hang.lift, hookStartX: start.x, hookStartLift: start.lift };
    }
    if (target.kind === THREAD) {
      const goingRight = (target.threadEndX != null ? target.threadEndX : target.holdX) >= target.holdX;
      const start = threadPoint(win, goingRight ? 0 : 1, sprite, work);
      const end = threadPoint(win, goingRight ? 1 : 0, sprite, work);
      return { ...target, holdX: start.x, holdLift: start.lift, threadEndX: end.x, threadEndLift: end.lift };
    }
    if (target.kind === BALL) {
      const hold = ballPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: 0 };
    }
    if (target.kind === DUST) {
      const hold = dustPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === WALL) {
      const edge = wallEdge(target, win, sprite);
      const start = wallPoint(win, 0, edge, sprite, work);
      const end = wallPoint(win, 1, edge, sprite, work);
      return { ...target, holdX: start.x, holdLift: start.lift, wallEndX: end.x, wallEndLift: end.lift };
    }
    if (target.kind === TOSS) {
      const edge = tossEdge(target, win, sprite);
      const hold = tossPoint(win, edge, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === FLATTEN) {
      const hold = flattenPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === DRAPE) {
      const edge = drapeEdge(target, win, sprite);
      const hold = drapePoint(win, edge, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === KINDLE) {
      const hold = kindlePoint(win, sprite, work);
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

  function coilOnPath(u, from, to, side) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    const out = side === "left" ? -1 : 1;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * ease + out * 40 * Math.sin(t * Math.PI),
      lift: fromLift + (toLift - fromLift) * ease + Math.sin(t * Math.PI) * 26,
      rot: out * -58 * Math.sin(t * Math.PI),
    };
  }

  function coilOffPath(u, from, to, side) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    const out = side === "left" ? -1 : 1;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * ease + out * 36 * Math.sin(t * Math.PI),
      lift: fromLift + (toLift - fromLift) * (t * t),
      rot: out * 48 * Math.sin(t * Math.PI),
    };
  }

  function fieldOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + Math.sin(t * Math.PI) * 10,
      rot: 0,
    };
  }

  function driftOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * (t * t * 0.55 + ease * 0.45),
      rot: 0,
    };
  }

  function chargeBoltPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease,
      rot: (toX >= fromX ? 1 : -1) * 18 * Math.sin(t * Math.PI),
    };
  }

  function orbitPoint(win, u, sprite, work, _dir) {
    const size = sprite == null ? SPRITE : sprite;
    const t = ((Number(u) % 1) + 1) % 1;
    const out = size * 0.62;
    const leftX = win.x - out;
    const rightX = win.x + win.width - size + out;
    const maxLift = (work && work.height ? work.height : 800) - 48;
    const top = clamp(gripLift(win.y - size * 0.1, work), 36, maxLift);
    const bot = clamp(gripLift(win.y + win.height + size * 0.12, work), 16, maxLift);
    const bl = { x: leftX, lift: bot };
    const tl = { x: leftX, lift: top };
    const tr = { x: rightX, lift: top };
    const br = { x: rightX, lift: bot };
    let from;
    let to;
    let s;
    if (t < 0.25) {
      from = bl;
      to = tl;
      s = t / 0.25;
    } else if (t < 0.5) {
      from = tl;
      to = tr;
      s = (t - 0.25) / 0.25;
    } else if (t < 0.75) {
      from = tr;
      to = br;
      s = (t - 0.5) / 0.25;
    } else {
      from = br;
      to = bl;
      s = (t - 0.75) / 0.25;
    }
    const x = from.x + (to.x - from.x) * s;
    const lift = from.lift + (to.lift - from.lift) * s;
    const midX = win.x + (win.width - size) / 2;
    const midLift = (top + bot) / 2;
    return {
      x: x + (midX - x) * 0.06,
      lift: clamp(lift + (midLift - lift) * 0.04, 16, maxLift),
      u: t,
    };
  }

  function clickNodeName(node) {
    if (node === "right" || node === "tr" || node === "br" || node === "tl" || node === "bl" || node === "left") return node;
    return "left";
  }

  function clickOpposite(node) {
    const name = clickNodeName(node);
    if (name === "left") return "right";
    if (name === "right") return "left";
    if (name === "tl") return "tr";
    if (name === "tr") return "tl";
    if (name === "bl") return "br";
    return "bl";
  }

  function clickPoint(win, node, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const name = clickNodeName(node);
    const pad = size * 0.22;
    const leftX = win.x - pad;
    const rightX = win.x + win.width - size + pad;
    const right = name === "right" || name === "tr" || name === "br";
    const top = name === "tl" || name === "tr";
    const bot = name === "bl" || name === "br";
    const x = right ? rightX : leftX;
    let gripY;
    if (top) gripY = win.y + Math.max(18, size * 0.08);
    else if (bot) gripY = win.y + win.height - Math.max(28, size * 0.16);
    else gripY = win.y + Math.max(36, win.height * 0.28);
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift), node: name };
  }

  function clickOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const pull = t * t * t;
    const mix = ease * 0.35 + pull * 0.65;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * mix,
      lift: fromLift + (toLift - fromLift) * mix + Math.sin(t * Math.PI) * 10,
      rot: (toX >= fromX ? 1 : -1) * 8 * Math.sin(t * Math.PI),
    };
  }

  function clickHopPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const span = Math.abs(toX - fromX) + Math.abs(toLift - fromLift);
    const arc = 28 + span * 0.08;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + Math.sin(t * Math.PI) * arc,
      rot: (toX >= fromX ? 1 : -1) * 14 * Math.sin(t * Math.PI),
    };
  }

  function orbitOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const pull = t * t * t;
    const mix = ease * 0.4 + pull * 0.6;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * mix,
      lift: fromLift + (toLift - fromLift) * mix + Math.sin(t * Math.PI) * 12,
      rot: (toX >= fromX ? 1 : -1) * 10 * Math.sin(t * Math.PI),
    };
  }

  function holdClipName(clip) {
    return clip === "sash" ? "sash" : "jamb";
  }

  function holdPoint(win, clip, side, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const kind = holdClipName(clip);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    if (kind === "sash") {
      const pad = 16;
      const span = Math.max(0, win.width - size - pad * 2);
      const u = edge === "right" ? 0.78 : 0.22;
      const x = win.x + pad + span * u;
      const gripY = win.y + win.height * 0.68;
      return { x, lift: clamp(gripLift(gripY, work), 36, maxLift), clip: "sash", side: edge };
    }
    const nest = size * 0.06;
    const x = edge === "right" ? win.x + win.width - size + nest : win.x - nest;
    const gripY = win.y + Math.max(48, win.height * 0.56);
    return { x, lift: clamp(gripLift(gripY, work), 36, maxLift), clip: "jamb", side: edge };
  }

  function holdOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease,
      rot: 0,
    };
  }

  function earthPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 22;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.36;
    const lug = Math.max(10, size * 0.08);
    const gripY = win.y + win.height + lug;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 8, maxLift) };
  }

  function earthOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease,
      rot: 0,
    };
  }

  function ledgePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 28;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.24;
    const lift = gripLift(win.y - 44, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function watchPoint(win, sprite, _work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 20;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.2;
    return { x, lift: 0 };
  }

  function watchOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: 0,
      rot: 0.2 * t,
    };
  }

  function watchOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: 0,
      rot: 0.2 * (1 - t),
    };
  }

  function thumpPoint(win, sprite, _work, side) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const gap = Math.max(10, size * 0.08);
    const x = edge === "right" ? win.x + win.width + gap : win.x - size - gap;
    return { x, lift: 0, side: edge };
  }

  function thumpOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const arc = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: arc * 20,
      rot: (toX >= fromX ? 1 : -1) * 10 * arc,
    };
  }

  function thumpStampPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.45) {
      const s = t / 0.45;
      return { lift: 8 * Math.sin(s * Math.PI * 0.5), rot: -7 * s };
    }
    if (t < 0.62) {
      const s = (t - 0.45) / 0.17;
      return { lift: 8 * (1 - s), rot: -7 * (1 - s) };
    }
    return { lift: 0, rot: 0 };
  }

  function thumpVanishPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const arc = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: arc * 24,
      rot: (toX >= fromX ? 1 : -1) * 14 * arc,
    };
  }

  function stashPoint(win, corner, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = corner === "right" ? "right" : "left";
    const nestX = Math.max(6, size * 0.03);
    const nestBot = Math.max(14, size * 0.08);
    const x = edge === "right" ? win.x + win.width - size - nestX : win.x + nestX;
    const gripY = win.y + win.height - nestBot;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift), side: edge };
  }

  function stashOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 16,
      rot: (toX >= fromX ? 1 : -1) * 10 * hop,
    };
  }

  function stashCheekPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const pulse = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2);
    return {
      lift: Math.abs(pulse) * 5,
      rot: pulse * 8,
    };
  }

  function stashOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 20,
      rot: (toX >= fromX ? 1 : -1) * 12 * hop,
    };
  }

  function wheekPoint(win, sprite, _work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 24;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.56;
    return { x, lift: 0 };
  }

  function wheekFace(target, win, size) {
    const dim = size == null ? SPRITE : size;
    if (win) {
      const mid = win.x + win.width / 2;
      return target.holdX + dim / 2 >= mid ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function wheekOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: 0,
      rot: 0,
    };
  }

  function wheekVoicePath(u) {
    const t = Math.max(0, Math.min(1, u));
    const pulse = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2);
    return {
      lift: Math.abs(pulse) * 5,
      rot: 0,
    };
  }

  function wheekPopPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      lift: hop * 30,
      rot: 0,
    };
  }

  function wheekOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: 0,
      rot: 0,
    };
  }

  function baskPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 26;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.74;
    const rail = Math.max(22, size * 0.18);
    const gripY = win.y + win.height - rail;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift) };
  }

  function baskOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const stroke = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 3);
    const fade = 1 - t;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + Math.abs(stroke) * 8 * fade,
      rot: (toX >= fromX ? 1 : -1) * stroke * 7 * fade,
    };
  }

  function baskWithdrawPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const s = t < 0.28 ? smoothstep(t / 0.28) : 1;
    return {
      x: s <= 0 ? 0 : -9 * s,
      lift: s <= 0 ? 0 : -3 * s,
      rot: 0,
    };
  }

  function baskOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.5) {
      const s = t / 0.5;
      return {
        x: fromX + (toX - fromX) * 0.55 * smoothstep(s),
        lift: fromLift,
        rot: 0,
      };
    }
    const s = (t - 0.5) / 0.5;
    const midX = fromX + (toX - fromX) * 0.55;
    const stroke = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI * 2);
    return {
      x: midX + (toX - midX) * smoothstep(s),
      lift: fromLift + (toLift - fromLift) * (s * s) + Math.abs(stroke) * 6 * (1 - s),
      rot: (toX >= fromX ? 1 : -1) * stroke * 5 * (1 - s),
    };
  }

  function circlePoint(win, u, sprite, work, dir) {
    const size = sprite == null ? SPRITE : sprite;
    const field = fieldPoint(win, size, work);
    const roomX = Math.max(20, (win.width - size) * 0.5 - 16);
    const roomY = Math.max(20, win.height * 0.2);
    const rx = clamp(Math.min(roomX, 80), 20, 80);
    const ry = clamp(Math.min(roomY, 68), 20, 68);
    const cx = field.x;
    const cy = field.lift - Math.min(28, ry * 0.35);
    const t = ((Number(u) % 1) + 1) % 1;
    const sign = dir === -1 ? -1 : 1;
    const theta = sign * t * Math.PI * 2;
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return {
      x: cx + rx * Math.cos(theta),
      lift: clamp(cy + ry * Math.sin(theta), 36, maxLift),
      u: t,
    };
  }

  function circleOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + Math.sin(t * Math.PI) * 8,
      rot: 0,
    };
  }

  function perchPoint(win, side, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const inset = Math.max(12, size * 0.08);
    const x = edge === "right" ? win.x + win.width - size - inset : win.x + inset;
    const gripY = win.y + Math.max(64, win.height * 0.44);
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift), side: edge };
  }

  function perchOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 16,
      rot: (toX >= fromX ? 1 : -1) * 10 * hop,
    };
  }

  function perchTalkPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const pulse = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2);
    return {
      lift: Math.abs(pulse) * 5,
      rot: pulse * 7,
    };
  }

  function scentPoint(win, side, sprite, _work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const nest = Math.max(16, size * 0.11);
    const x = edge === "right" ? win.x + win.width - size + nest : win.x - nest;
    return { x, lift: 0, side: edge };
  }

  function scentOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const lean = t * t;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: 0,
      rot: (toX >= fromX ? 1 : -1) * 6 * lean,
    };
  }

  function scentNosePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.6) {
      const s = t / 0.6;
      const pulse = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI * 2);
      return {
        x: Math.abs(pulse) * 7,
        lift: Math.abs(pulse) * 4,
        rot: pulse * 6,
      };
    }
    const s = (t - 0.6) / 0.4;
    const peek = s * s * (3 - 2 * s);
    return {
      x: 5 + peek * 9,
      lift: 2 + peek * 2,
      rot: peek * 8,
    };
  }

  function scentOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = 1 - (1 - t) * (1 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: 0,
      rot: (1 - ease) * (toX >= fromX ? -4 : 4),
    };
  }

  function bowPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 30;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.38;
    const rail = Math.max(22, size * 0.18);
    const rock = Math.max(48, size * 0.28);
    const gripY = win.y + win.height - rail - rock;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function bowFace(target, win, size) {
    const dim = size == null ? SPRITE : size;
    if (win) {
      const mid = win.x + win.width / 2;
      return target.holdX + dim / 2 >= mid ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function bowOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 14,
      rot: (toX >= fromX ? 1 : -1) * 6 * hop,
    };
  }

  function bowDipPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.38) {
      const s = t / 0.38;
      const dip = s * s * (3 - 2 * s);
      return { lift: -6 * dip || 0, rot: 14 * dip };
    }
    if (t < 0.55) {
      return { lift: -6, rot: 14 };
    }
    const s = (t - 0.55) / 0.45;
    const up = s * s * (3 - 2 * s);
    return { lift: -6 * (1 - up) || 0, rot: 14 * (1 - up) };
  }

  function bowOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 18,
      rot: (toX >= fromX ? 1 : -1) * 8 * hop,
    };
  }

  function hookPoint(win, side, u, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const wrap = size * 0.2;
    const x = edge === "right" ? win.x + win.width - size + wrap : win.x - wrap;
    const t = Math.max(0, Math.min(1, u));
    const lowY = win.y + win.height * 0.78;
    const highY = win.y + win.height * 0.22;
    const gripY = lowY + (highY - lowY) * t;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift), side: edge };
  }

  function hookHangRot(side) {
    return side === "right" ? -72 : 72;
  }

  function hookOnPath(u, from, to, side) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    const lean = hookHangRot(side) * 0.2;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 18,
      rot: lean * ease,
    };
  }

  function hookClimbPath(u, from, to, side) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const steps = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 3);
    const out = side === "right" ? 1 : -1;
    const startRot = hookHangRot(side) * 0.2;
    const endRot = hookHangRot(side);
    return {
      x: fromX + (toX - fromX) * ease + out * steps * 4,
      lift: fromLift + (toLift - fromLift) * ease + Math.abs(steps) * 8,
      rot: startRot + (endRot - startRot) * ease,
    };
  }

  function hookQuotePath(u, side) {
    const t = Math.max(0, Math.min(1, u));
    const pulse = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.4);
    const base = hookHangRot(side);
    return {
      lift: Math.abs(pulse) * 6,
      rot: base + pulse * 6,
    };
  }

  function hookOffPath(u, from, to, side) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t;
    const slide = smoothstep(t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const out = side === "right" ? 1 : -1;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * slide + out * 10 * hop,
      lift: fromLift + (toLift - fromLift) * ease,
      rot: hookHangRot(side) * (1 - slide),
    };
  }

  function threadPoint(win, u, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const inset = Math.max(28, size * 0.16);
    const span = Math.max(0, win.width - size - inset * 2);
    const t = Math.max(0, Math.min(1, u));
    const x = win.x + inset + span * t;
    const crack = Math.max(7, size * 0.04);
    const gripY = win.y + win.height - crack;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 8, maxLift) };
  }

  function threadOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const pour = t * t;
    const mix = ease * 0.35 + pour * 0.65;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const squeeze = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * mix,
      lift: fromLift + (toLift - fromLift) * mix + squeeze * 8,
      rot: (toX >= fromX ? 1 : -1) * 22 * squeeze,
    };
  }

  function threadPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const wriggle = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 5);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + wriggle * 7,
      rot: (toX >= fromX ? 1 : -1) * 18 * wriggle,
    };
  }

  function threadOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const pop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + pop * 12 * (1 - t),
      rot: (toX >= fromX ? 1 : -1) * 10 * pop,
    };
  }

  function ballPoint(win, sprite, _work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 18;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.38;
    return { x, lift: 0 };
  }

  function ballFace(target, win, size) {
    const dim = size == null ? SPRITE : size;
    if (win) {
      const mid = win.x + win.width / 2;
      return target.holdX + dim / 2 >= mid ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function ballOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const shuffle = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 3);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: 0,
      rot: (toX >= fromX ? 1 : -1) * 4 * shuffle,
    };
  }

  function ballSnufflePath(u) {
    const t = Math.max(0, Math.min(1, u));
    const wiggle = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 4);
    return {
      x: wiggle * 6,
      lift: Math.abs(wiggle) * 2,
      rot: wiggle * 8,
    };
  }

  function ballCurlPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const tuck = t < 0.32 ? t / 0.32 : 1;
    const ease = tuck * tuck * (3 - 2 * tuck);
    return {
      lift: 0,
      rot: ease * 22,
    };
  }

  function ballOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const unroll = Math.min(1, t / 0.28);
    const open = unroll * unroll * (3 - 2 * unroll);
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: 0,
      rot: 22 * (1 - open),
    };
  }

  function dustPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 32;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.62;
    const rail = Math.max(72, win.height * 0.42);
    const gripY = win.y + rail;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function dustFace(target, win, size) {
    const dim = size == null ? SPRITE : size;
    if (win) {
      const mid = win.x + win.width / 2;
      return target.holdX + dim / 2 >= mid ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function dustOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 28,
      rot: (toX >= fromX ? 1 : -1) * 8 * hop,
    };
  }

  function dustRollPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const roll = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2);
    return {
      x: roll * 10,
      lift: Math.abs(roll) * 6,
      rot: roll * 70,
    };
  }

  function dustFluffPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const shake = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 5);
    return {
      lift: Math.abs(shake) * 10,
      rot: shake * 6,
    };
  }

  function dustOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 22,
      rot: (toX >= fromX ? 1 : -1) * 10 * hop,
    };
  }

  function wallPoint(win, u, side, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const inset = Math.max(52, size * 0.3);
    const x = edge === "right" ? win.x + win.width - size - inset : win.x + inset;
    const lowFromBot = Math.max(64, size * 0.36);
    const highFromTop = Math.max(128, win.height * 0.58);
    const y0 = win.y + win.height - lowFromBot;
    const y1 = win.y + highFromTop;
    const t = Math.max(0, Math.min(1, Number(u) || 0));
    const gripY = y0 + (y1 - y0) * t;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift), side: edge };
  }

  function wallEdge(target, win, size) {
    const dim = size == null ? SPRITE : size;
    if (win) {
      const mid = win.x + win.width / 2;
      return target.holdX + dim / 2 >= mid ? "right" : "left";
    }
    return "left";
  }

  function wallFace(target, win, size) {
    const dim = size == null ? SPRITE : size;
    if (win) {
      const mid = win.x + win.width / 2;
      return target.holdX + dim / 2 >= mid ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function wallOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const slip = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + slip * 6,
      rot: (toX >= fromX ? 1 : -1) * 4 * (1 - t),
    };
  }

  function wallWalkPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const step = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 4);
    return {
      x: fromX + (toX - fromX) * ease + step * 7,
      lift: fromLift + (toLift - fromLift) * ease,
      rot: (toLift >= fromLift ? 1 : -1) * (3 + step * 6),
    };
  }

  function wallOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.4) {
      const s = t / 0.4;
      const ease = s * s;
      return {
        x: fromX + (toX - fromX) * 0.12 * ease,
        lift: fromLift * (1 - ease * 0.55),
        rot: 0,
      };
    }
    const s = (t - 0.4) / 0.6;
    const ease = s * s * (3 - 2 * s);
    const midX = fromX + (toX - fromX) * 0.12;
    const midLift = fromLift * 0.45;
    return {
      x: midX + (toX - midX) * ease,
      lift: midLift + (toLift - midLift) * (s * s),
      rot: 0,
    };
  }

  function tossPoint(win, side, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const nest = Math.max(48, size * 0.28);
    const x = edge === "right" ? win.x + win.width - size - nest : win.x + nest;
    const gripY = win.y + Math.max(56, size * 0.34);
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift), side: edge };
  }

  function tossEdge(target, win, size) {
    const dim = size == null ? SPRITE : size;
    if (win) {
      const mid = win.x + win.width / 2;
      return target.holdX + dim / 2 >= mid ? "right" : "left";
    }
    return "left";
  }

  function tossFace(target, win, size) {
    const dim = size == null ? SPRITE : size;
    if (win) {
      const mid = win.x + win.width / 2;
      return target.holdX + dim / 2 >= mid ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function tossOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 26,
      rot: (toX >= fromX ? 1 : -1) * 8 * hop,
    };
  }

  function tossFlickPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.28) {
      const s = t / 0.28;
      const dip = s * s;
      return { lift: -dip * 5, rot: dip * 14 };
    }
    if (t < 0.64) {
      const s = (t - 0.28) / 0.36;
      const snap = s * s * (3 - 2 * s);
      return { lift: -5 + snap * 20, rot: 14 - snap * 40 };
    }
    const s = (t - 0.64) / 0.36;
    const settle = s * s * (3 - 2 * s);
    return { lift: 15 * (1 - settle), rot: -26 * (1 - settle) };
  }

  function tossOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 20,
      rot: (toX >= fromX ? 1 : -1) * 9 * hop,
    };
  }

  function flattenPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const x = win.x + (win.width - size) / 2;
    const fromTop = Math.max(96, Math.min(win.height * 0.3, win.height * 0.38));
    const gripY = win.y + fromTop;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function flattenFace(target) {
    return target.landX >= target.holdX ? -1 : 1;
  }

  function flattenOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const step = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 3);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + step * 5,
      rot: (toX >= fromX ? 1 : -1) * 4 * (1 - t),
    };
  }

  function flattenBobPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.38) {
      const s = t / 0.38;
      const dip = s * s;
      return { lift: -dip * 9, rot: dip * 12 };
    }
    if (t < 0.62) {
      const s = (t - 0.38) / 0.24;
      const snap = s * s * (3 - 2 * s);
      return { lift: -9 + snap * 9, rot: 12 - snap * 12 };
    }
    return { lift: 0, rot: 0 };
  }

  function flattenOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.5) {
      const s = t / 0.5;
      const ease = s * s;
      return {
        x: fromX + (toX - fromX) * 0.18 * ease,
        lift: fromLift * (1 - ease * 0.42),
        rot: 0,
      };
    }
    const s = (t - 0.5) / 0.5;
    const ease = s * s * (3 - 2 * s);
    const midX = fromX + (toX - fromX) * 0.18;
    const midLift = fromLift * 0.58;
    return {
      x: midX + (toX - midX) * ease,
      lift: midLift + (toLift - midLift) * (s * s),
      rot: 0,
    };
  }

  function drapePoint(win, side, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const span = Math.max(0, win.width - size);
    const x = edge === "right" ? win.x + span * 0.78 : win.x + span * 0.22;
    const fromTop = Math.max(48, Math.min(56, size * 0.3));
    const gripY = win.y + fromTop;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift), side: edge };
  }

  function drapeEdge(target, win, size) {
    const dim = size == null ? SPRITE : size;
    if (win) {
      const mid = win.x + win.width / 2;
      return target.holdX + dim / 2 >= mid ? "right" : "left";
    }
    return "left";
  }

  function drapeFace(target, win, size) {
    if (win) return drapeEdge(target, win, size) === "right" ? -1 : 1;
    return target.landX >= target.holdX ? 1 : -1;
  }

  function drapeOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const rise = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const smoke = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2);
    return {
      x: fromX + (toX - fromX) * ease + smoke * 14,
      lift: fromLift + (toLift - fromLift) * rise,
      rot: smoke * 8,
    };
  }

  function drapeSettlePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.45) {
      const s = t / 0.45;
      const ease = s * s;
      return { lift: -ease * 6, rot: ease * 16 };
    }
    if (t < 0.75) {
      const s = (t - 0.45) / 0.3;
      const snap = s * s * (3 - 2 * s);
      return { lift: -6 + snap * 4, rot: 16 + snap * 6 };
    }
    return { lift: -2, rot: 22 };
  }

  function drapeOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s;
      return {
        x: fromX,
        lift: fromLift + ease * 4,
        rot: 22 * (1 - ease),
      };
    }
    const s = (t - 0.28) / 0.72;
    const ease = s * s * (3 - 2 * s);
    const smoke = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease + smoke * 10,
      lift: fromLift + (toLift - fromLift) * (s * s),
      rot: 0,
    };
  }

  function kindlePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const span = Math.max(0, win.width - size);
    const x = win.x + span * 0.58;
    const fromTop = Math.max(win.height * 0.62, Math.min(win.height * 0.7, win.height - 80));
    const gripY = win.y + fromTop;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function kindleFace(target) {
    return target.landX >= target.holdX ? -1 : 1;
  }

  function kindleOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const bank = t * t;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    return {
      x: fromX + (toX - fromX) * bank,
      lift: fromLift + (toLift - fromLift) * bank,
      rot: -10 * bank,
    };
  }

  function kindleCoalPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const breath = Math.sin(t * Math.PI);
    return { lift: breath * 3, rot: -10 + breath * 3 };
  }

  function kindleRisePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.35) {
      const s = t / 0.35;
      const catchFire = s * s;
      return { lift: catchFire * 18, rot: -10 + catchFire * 16 };
    }
    if (t < 0.7) {
      const s = (t - 0.35) / 0.35;
      const rise = s * s * (3 - 2 * s);
      return { lift: 18 + rise * 36, rot: 6 - rise * 4 };
    }
    return { lift: 54, rot: 2 };
  }

  function kindleOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.22) {
      const s = t / 0.22;
      return {
        x: fromX,
        lift: fromLift + s * 10,
        rot: 2 * (1 - s),
      };
    }
    const s = (t - 0.22) / 0.78;
    const ease = s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + 10 + (toLift - fromLift - 10) * ease,
      rot: 0,
    };
  }

  function earthStepOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.42) {
      const s = t / 0.42;
      return {
        x: fromX + (toX - fromX) * 0.48 * smoothstep(s),
        lift: fromLift,
        rot: 0,
      };
    }
    const s = (t - 0.42) / 0.58;
    const midX = fromX + (toX - fromX) * 0.48;
    return {
      x: midX + (toX - midX) * smoothstep(s),
      lift: fromLift + (toLift - fromLift) * (s * s),
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
    if (shouldAbort(life) && play.phase !== "drop" && play.phase !== "dive" && play.phase !== "land" && play.phase !== "ridge-off" && play.phase !== "coil-off" && play.phase !== "path-off" && play.phase !== "field-off" && play.phase !== "crackle-off" && play.phase !== "charge-off" && play.phase !== "orbit-off" && play.phase !== "click-off" && play.phase !== "hold-off" && play.phase !== "earth-off" && play.phase !== "ledge-off" && play.phase !== "watch-off" && play.phase !== "thump-off" && play.phase !== "stash-off" && play.phase !== "wheek-off" && play.phase !== "bask-off" && play.phase !== "circle-off" && play.phase !== "perch-off" && play.phase !== "scent-off" && play.phase !== "bow-off" && play.phase !== "hook-off" && play.phase !== "thread-off" && play.phase !== "ball-off" && play.phase !== "dust-off" && play.phase !== "wall-off" && play.phase !== "toss-off" && play.phase !== "flatten-off" && play.phase !== "drape-off" && play.phase !== "kindle-off") {
      return abortToFloor(play, { x: play.x, lift: play.lift }, work);
    }
    let next = { ...play, t: play.t + Math.max(0, dt) };
    const lookId = (next.phase === "click-hop" || next.phase === "click-b") && next.target && next.target.clickToId
      ? next.target.clickToId
      : next.target && next.target.id;
    const win = findWin(windows, lookId);
    if (win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land" && next.phase !== "ridge-off" && next.phase !== "coil-off" && next.phase !== "path-off" && next.phase !== "field-off" && next.phase !== "crackle-off" && next.phase !== "charge-off" && next.phase !== "orbit-off" && next.phase !== "click-off" && next.phase !== "hold-off" && next.phase !== "earth-off" && next.phase !== "ledge-off" && next.phase !== "watch-off" && next.phase !== "thump-off" && next.phase !== "stash-off" && next.phase !== "wheek-off" && next.phase !== "bask-off" && next.phase !== "circle-off" && next.phase !== "perch-off" && next.phase !== "scent-off" && next.phase !== "bow-off" && next.phase !== "hook-off" && next.phase !== "thread-off" && next.phase !== "ball-off" && next.phase !== "dust-off" && next.phase !== "wall-off" && next.phase !== "toss-off" && next.phase !== "flatten-off" && next.phase !== "drape-off" && next.phase !== "kindle-off") {
      next.target = refitTarget(next.target, win, size, work, windows);
    } else if (!win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land" && next.phase !== "approach" && next.phase !== "ridge-off" && next.phase !== "coil-off" && next.phase !== "path-off" && next.phase !== "field-off" && next.phase !== "crackle-off" && next.phase !== "charge-off" && next.phase !== "orbit-off" && next.phase !== "click-off" && next.phase !== "hold-off" && next.phase !== "earth-off" && next.phase !== "ledge-off" && next.phase !== "watch-off" && next.phase !== "thump-off" && next.phase !== "stash-off" && next.phase !== "wheek-off" && next.phase !== "bask-off" && next.phase !== "circle-off" && next.phase !== "perch-off" && next.phase !== "scent-off" && next.phase !== "bow-off" && next.phase !== "hook-off" && next.phase !== "thread-off" && next.phase !== "ball-off" && next.phase !== "dust-off" && next.phase !== "wall-off" && next.phase !== "toss-off" && next.phase !== "flatten-off" && next.phase !== "drape-off" && next.phase !== "kindle-off") {
      return abortToFloor(next, { x: next.x, lift: next.lift }, work);
    }

    const target = next.target;
    if (next.phase === "approach") {
      const dest = target.approachX;
      const dir = dest >= next.x ? 1 : -1;
      next.facing = dir;
      next.anim = "walk";
      const pace = target.kind === BASK ? WALK_PX * 0.4 : target.kind === BOW ? WALK_PX * 0.62 : target.kind === BALL ? WALK_PX * 0.46 : target.kind === DUST ? WALK_PX * 0.92 : target.kind === WALL ? WALK_PX * 0.36 : target.kind === TOSS ? WALK_PX * 0.84 : target.kind === FLATTEN ? WALK_PX * 0.28 : target.kind === DRAPE ? WALK_PX * 0.34 : target.kind === KINDLE ? WALK_PX * 0.38 : WALK_PX;
      next.x += dir * pace * dt;
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
        if (target.kind === COIL) {
          return goPhase(next, "coil-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === PATH) {
          return goPhase(next, "path-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === FIELD) {
          return goPhase(next, "field-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === CRACKLE) {
          return goPhase(next, "crackle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === CHARGE) {
          return goPhase(next, "charge-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === ORBIT) {
          return goPhase(next, "orbit-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === CLICK) {
          return goPhase(next, "click-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === HOLD) {
          return goPhase(next, "hold-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === EARTH) {
          return goPhase(next, "earth-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === LEDGE) {
          return goPhase(next, "ledge-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === WATCH) {
          return goPhase(next, "watch-on", { x: dest, lift: 0 }, { x: target.holdX, lift: 0 }, "walk", dir);
        }
        if (target.kind === THUMP) {
          return goPhase(next, "thump-on", { x: dest, lift: 0 }, { x: target.holdX, lift: 0 }, "play", dir);
        }
        if (target.kind === STASH) {
          return goPhase(next, "stash-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === WHEEK) {
          return goPhase(next, "wheek-on", { x: dest, lift: 0 }, { x: target.holdX, lift: 0 }, "walk", dir);
        }
        if (target.kind === BASK) {
          return goPhase(next, "bask-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === CIRCLE) {
          return goPhase(next, "circle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === PERCH) {
          return goPhase(next, "perch-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === SCENT) {
          return goPhase(next, "scent-on", { x: dest, lift: 0 }, { x: target.holdX, lift: 0 }, "walk", dir);
        }
        if (target.kind === BOW) {
          return goPhase(next, "bow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === HOOK) {
          return goPhase(next, "hook-on", { x: dest, lift: 0 }, { x: target.hookStartX != null ? target.hookStartX : target.holdX, lift: target.hookStartLift != null ? target.hookStartLift : 0 }, "play", dir);
        }
        if (target.kind === THREAD) {
          return goPhase(next, "thread-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === BALL) {
          return goPhase(next, "ball-on", { x: dest, lift: 0 }, { x: target.holdX, lift: 0 }, "walk", dir);
        }
        if (target.kind === DUST) {
          return goPhase(next, "dust-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === WALL) {
          return goPhase(next, "wall-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === TOSS) {
          return goPhase(next, "toss-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === FLATTEN) {
          return goPhase(next, "flatten-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === DRAPE) {
          return goPhase(next, "drape-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === KINDLE) {
          return goPhase(next, "kindle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
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

    if (next.phase === "coil-on") {
      const u = next.t / DUR.coilOn;
      const pose = coilOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift }, target.side);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.side === "left" ? 1 : -1;
      if (u >= 1) {
        return goPhase(next, "coil-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", next.facing);
      }
      return next;
    }

    if (next.phase === "coil-hold") {
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = target.side === "left" ? 1 : -1;
      if (next.t >= DUR.coilHold) {
        const land = { x: target.landX, lift: 0 };
        return goPhase(next, "coil-off", { x: target.holdX, lift: target.holdLift }, land, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "coil-off") {
      const u = next.t / DUR.coilOff;
      const pose = coilOffPath(Math.min(1, u), next.from, next.to, target.side);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "path-on") {
      const u = next.t / DUR.pathOn;
      const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.side === "left" ? 1 : -1;
      if (u >= 1) {
        const face = target.side === "left" ? 1 : -1;
        return goPhase(next, "path-walk", { x: target.holdX, lift: target.holdLift }, { x: target.pathEndX, lift: target.pathEndLift }, "walk", face);
      }
      return next;
    }

    if (next.phase === "path-walk") {
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const u = Math.min(1, next.t / DUR.pathWalk);
      const pose = pathPoint(win, u, size, work, target.side);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "walk";
      if (u < 2 / 3) next.facing = target.side === "left" ? 1 : -1;
      else next.facing = target.side === "left" ? -1 : 1;
      if (u >= 1) {
        const endX = target.pathEndX != null ? target.pathEndX : pose.x;
        const endLift = target.pathEndLift != null ? target.pathEndLift : pose.lift;
        return goPhase(next, "path-sit", { x: endX, lift: endLift }, { x: endX, lift: endLift }, "sit", next.facing);
      }
      return next;
    }

    if (next.phase === "path-sit") {
      const sitX = target.pathEndX != null ? target.pathEndX : target.holdX;
      const sitLift = target.pathEndLift != null ? target.pathEndLift : target.holdLift;
      next.x = sitX;
      next.lift = sitLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = target.side === "left" ? -1 : 1;
      if (next.t >= DUR.pathSit) {
        const land = { x: target.landX, lift: 0 };
        return goPhase(next, "path-off", { x: sitX, lift: sitLift }, land, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "path-off") {
      const u = next.t / DUR.pathOff;
      const pose = target.leave === "drop"
        ? dropPath(Math.min(1, u), next.from, next.to)
        : leapPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = target.leave === "drop" ? 0 : pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "field-on") {
      const u = next.t / DUR.fieldOn;
      const pose = fieldOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) {
        return goPhase(next, "field-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", next.facing);
      }
      return next;
    }

    if (next.phase === "field-hold") {
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (next.t >= DUR.fieldHold) {
        const land = { x: target.landX, lift: 0 };
        return goPhase(next, "field-off", { x: target.holdX, lift: target.holdLift }, land, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "field-off") {
      const u = next.t / DUR.fieldOff;
      const pose = target.leave === "drop"
        ? dropPath(Math.min(1, u), next.from, next.to)
        : driftOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "crackle-on") {
      const u = next.t / DUR.crackleOn;
      const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.side === "left" ? 1 : -1;
      if (u >= 1) {
        const hop = goPhase(next, "crackle-hop", { x: target.holdX, lift: target.holdLift }, { x: target.crackleEndX, lift: target.crackleEndLift }, "play", next.facing);
        hop.hopIndex = 0;
        return hop;
      }
      return next;
    }

    if (next.phase === "crackle-hop") {
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const hops = 3;
      const idx = next.hopIndex || 0;
      const startU = target.hopFrom != null ? target.hopFrom : 0;
      const endU = target.hopTo != null ? target.hopTo : 1;
      const fromU = startU + (endU - startU) * (idx / hops);
      const toU = startU + (endU - startU) * ((idx + 1) / hops);
      const from = cracklePoint(win, fromU, size, work, target.side);
      const to = cracklePoint(win, toU, size, work, target.side);
      const u = next.t / DUR.crackleHop;
      const pose = leapPath(Math.min(1, u), from, to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * 0.35;
      next.anim = idx % 2 === 0 ? "play" : "idle";
      next.facing = target.side === "left" ? 1 : -1;
      if (u >= 1) {
        if (idx + 1 >= hops) {
          const endX = target.crackleEndX != null ? target.crackleEndX : to.x;
          const endLift = target.crackleEndLift != null ? target.crackleEndLift : to.lift;
          return goPhase(next, "crackle-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "play", next.facing);
        }
        const hop = goPhase(next, "crackle-hop", to, to, idx % 2 === 0 ? "idle" : "play", next.facing);
        hop.hopIndex = idx + 1;
        return hop;
      }
      return next;
    }

    if (next.phase === "crackle-off") {
      const u = next.t / DUR.crackleOff;
      const pose = target.leave === "drop"
        ? dropPath(Math.min(1, u), next.from, next.to)
        : leapPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = target.leave === "drop" ? 0 : pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "charge-on") {
      const face = (target.chargeEndX != null ? target.chargeEndX : target.holdX) >= target.holdX ? 1 : -1;
      const leapT = Math.min(DUR.leap, DUR.chargeOn * 0.55);
      if (next.t < leapT) {
        const pose = leapPath(Math.min(1, next.t / leapT), next.from, { x: target.holdX, lift: target.holdLift });
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "play";
      } else {
        next.x = target.holdX;
        next.lift = target.holdLift;
        next.rot = 0;
        next.anim = "sit";
      }
      next.facing = face;
      if (next.t >= DUR.chargeOn) {
        return goPhase(next, "charge-bolt", { x: target.holdX, lift: target.holdLift }, { x: target.chargeEndX, lift: target.chargeEndLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "charge-bolt") {
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const from = chargePoint(win, target.startCorner || "tl", size, work);
      const to = chargePoint(win, target.endCorner || chargeOpposite(target.startCorner || "tl"), size, work);
      const u = next.t / DUR.chargeBolt;
      const pose = chargeBoltPath(Math.min(1, u), from, to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = to.x >= from.x ? 1 : -1;
      if (u >= 1) {
        const endX = target.chargeEndX != null ? target.chargeEndX : to.x;
        const endLift = target.chargeEndLift != null ? target.chargeEndLift : to.lift;
        return goPhase(next, "charge-hold", { x: endX, lift: endLift }, { x: endX, lift: endLift }, "sit", next.facing);
      }
      return next;
    }

    if (next.phase === "charge-hold") {
      const sitX = target.chargeEndX != null ? target.chargeEndX : target.holdX;
      const sitLift = target.chargeEndLift != null ? target.chargeEndLift : target.holdLift;
      next.x = sitX;
      next.lift = sitLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = sitX >= target.holdX ? 1 : -1;
      if (next.t >= DUR.chargeHold) {
        return goPhase(next, "charge-off", { x: sitX, lift: sitLift }, { x: target.landX, lift: 0 }, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "charge-off") {
      const u = next.t / DUR.chargeOff;
      const pose = target.leave === "drop"
        ? dropPath(Math.min(1, u), next.from, next.to)
        : leapPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = target.leave === "drop" ? 0 : pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "orbit-on") {
      const u = next.t / DUR.orbitOn;
      const pose = orbitOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.side === "left" ? 1 : -1;
      if (u >= 1) {
        return goPhase(next, "orbit-loop", { x: target.holdX, lift: target.holdLift }, { x: target.orbitEndX, lift: target.orbitEndLift }, "walk", next.facing);
      }
      return next;
    }

    if (next.phase === "orbit-loop") {
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const startU = target.orbitStartU != null ? target.orbitStartU : 0;
      const dir = target.orbitDir === -1 ? -1 : 1;
      const u = Math.min(1, next.t / DUR.orbitLoop);
      const loopU = ((startU + dir * 0.82 * u) % 1 + 1) % 1;
      const pose = orbitPoint(win, loopU, size, work, dir);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = (win.x + win.width / 2 > pose.x + size / 2 ? 1 : -1) * 8;
      next.anim = "walk";
      if (u < 0.25) next.facing = dir === 1 ? 1 : -1;
      else if (u < 0.5) next.facing = dir === 1 ? 1 : -1;
      else if (u < 0.75) next.facing = dir === 1 ? -1 : 1;
      else next.facing = dir === 1 ? -1 : 1;
      if (u >= 1) {
        const endX = target.orbitEndX != null ? target.orbitEndX : pose.x;
        const endLift = target.orbitEndLift != null ? target.orbitEndLift : pose.lift;
        return goPhase(next, "orbit-hold", { x: endX, lift: endLift }, { x: endX, lift: endLift }, "sit", next.facing);
      }
      return next;
    }

    if (next.phase === "orbit-hold") {
      const sitX = target.orbitEndX != null ? target.orbitEndX : target.holdX;
      const sitLift = target.orbitEndLift != null ? target.orbitEndLift : target.holdLift;
      next.x = sitX;
      next.lift = sitLift;
      next.rot = 0;
      next.anim = "sit";
      if (next.t >= DUR.orbitHold) {
        return goPhase(next, "orbit-off", { x: sitX, lift: sitLift }, { x: target.landX, lift: 0 }, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "orbit-off") {
      const u = next.t / DUR.orbitOff;
      const pose = target.leave === "drop"
        ? dropPath(Math.min(1, u), next.from, next.to)
        : leapPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = target.leave === "drop" ? 0 : pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "click-on") {
      const u = next.t / DUR.clickOn;
      const pose = clickOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.side === "left" ? 1 : -1;
      if (u >= 1) {
        return goPhase(next, "click-a", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", next.facing);
      }
      return next;
    }

    if (next.phase === "click-a") {
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = target.side === "left" ? 1 : -1;
      if (next.t >= DUR.clickHold) {
        const face = (target.clickEndX != null ? target.clickEndX : target.holdX) >= target.holdX ? 1 : -1;
        return goPhase(next, "click-hop", { x: target.holdX, lift: target.holdLift }, { x: target.clickEndX, lift: target.clickEndLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "click-hop") {
      const to = { x: target.clickEndX, lift: target.clickEndLift };
      const u = next.t / DUR.clickHop;
      const pose = clickHopPath(Math.min(1, u), next.from, to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = (to.x != null ? to.x : target.holdX) >= target.holdX ? 1 : -1;
      if (u >= 1) {
        const endX = target.clickEndX != null ? target.clickEndX : next.x;
        const endLift = target.clickEndLift != null ? target.clickEndLift : next.lift;
        return goPhase(next, "click-b", { x: endX, lift: endLift }, { x: endX, lift: endLift }, "sit", next.facing);
      }
      return next;
    }

    if (next.phase === "click-b") {
      const sitX = target.clickEndX != null ? target.clickEndX : target.holdX;
      const sitLift = target.clickEndLift != null ? target.clickEndLift : target.holdLift;
      next.x = sitX;
      next.lift = sitLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = sitX >= target.holdX ? 1 : -1;
      if (next.t >= DUR.clickHold) {
        return goPhase(next, "click-off", { x: sitX, lift: sitLift }, { x: target.landX, lift: 0 }, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "click-off") {
      const u = next.t / DUR.clickOff;
      const pose = target.leave === "drop"
        ? dropPath(Math.min(1, u), next.from, next.to)
        : leapPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = target.leave === "drop" ? 0 : pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "hold-on") {
      const u = next.t / DUR.holdOn;
      const pose = holdOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      next.facing = target.side === "left" ? 1 : -1;
      if (u >= 1) {
        return goPhase(next, "hold-sit", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", next.facing);
      }
      return next;
    }

    if (next.phase === "hold-sit") {
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = target.side === "left" ? 1 : -1;
      if (next.t >= DUR.holdSit) {
        const land = { x: target.landX, lift: 0 };
        return goPhase(next, "hold-off", { x: target.holdX, lift: target.holdLift }, land, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "hold-off") {
      const u = next.t / DUR.holdOff;
      const pose = target.leave === "drop"
        ? dropPath(Math.min(1, u), next.from, next.to)
        : leapPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = target.leave === "drop" ? 0 : pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "earth-on") {
      const face = target.landX >= target.holdX ? 1 : -1;
      const u = next.t / DUR.earthOn;
      const pose = earthOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "earth-sit", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "earth-sit") {
      const face = target.landX >= target.holdX ? 1 : -1;
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.earthSit) {
        const land = { x: target.landX, lift: 0 };
        return goPhase(next, "earth-off", { x: target.holdX, lift: target.holdLift }, land, "play", face);
      }
      return next;
    }

    if (next.phase === "earth-off") {
      const u = next.t / DUR.earthOff;
      const pose = target.leave === "drop"
        ? dropPath(Math.min(1, u), next.from, next.to)
        : earthStepOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = target.leave === "drop" ? "play" : "walk";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "ledge-on") {
      const face = target.landX >= target.holdX ? 1 : -1;
      const u = next.t / DUR.ledgeOn;
      const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "ledge-sit", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "ledge-sit") {
      const face = target.landX >= target.holdX ? 1 : -1;
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.ledgeSit) {
        const land = { x: target.landX, lift: 0 };
        return goPhase(next, "ledge-off", { x: target.holdX, lift: target.holdLift }, land, "play", face);
      }
      return next;
    }

    if (next.phase === "ledge-off") {
      const u = next.t / DUR.ledgeOff;
      const pose = leapPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "watch-on") {
      const face = target.holdX >= next.from.x ? 1 : -1;
      const u = next.t / DUR.watchOn;
      const pose = watchOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: 0 });
      next.x = pose.x;
      next.lift = 0;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return { ...goPhase(next, "watch-hold", { x: target.holdX, lift: 0 }, { x: target.holdX, lift: 0 }, "sit", face), rot: 0.2 };
      }
      return next;
    }

    if (next.phase === "watch-hold") {
      const face = target.landX >= target.holdX ? 1 : -1;
      next.x = target.holdX;
      next.lift = 0;
      next.rot = 0.2;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.watchHold) {
        return { ...goPhase(next, "watch-off", { x: target.holdX, lift: 0 }, { x: target.landX, lift: 0 }, "walk", face), rot: 0.2 };
      }
      return next;
    }

    if (next.phase === "watch-off") {
      const u = next.t / DUR.watchOff;
      const pose = watchOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = 0;
      next.rot = pose.rot;
      next.anim = "walk";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "thump-on") {
      const face = target.holdX >= next.from.x ? 1 : -1;
      const u = next.t / DUR.thumpOn;
      const pose = thumpOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: 0 });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "thump", { x: target.holdX, lift: 0 }, { x: target.holdX, lift: 0 }, "play", face);
      }
      return next;
    }

    if (next.phase === "thump") {
      const face = target.landX >= target.holdX ? 1 : -1;
      const pose = thumpStampPath(Math.min(1, next.t / DUR.thump));
      next.x = target.holdX;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.thump) {
        return goPhase(next, "thump-off", { x: target.holdX, lift: 0 }, { x: target.landX, lift: 0 }, "play", face);
      }
      return next;
    }

    if (next.phase === "thump-off") {
      const u = next.t / DUR.thumpOff;
      const pose = thumpVanishPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "stash-on") {
      const face = target.landX >= target.holdX ? 1 : -1;
      const u = next.t / DUR.stashOn;
      const pose = stashOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.side === "left" ? 1 : -1;
      if (u >= 1) {
        return goPhase(next, "stash-cheek", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "stash-cheek") {
      const face = target.landX >= target.holdX ? 1 : -1;
      const pose = stashCheekPath(Math.min(1, next.t / DUR.stashCheek));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.stashCheek) {
        return goPhase(next, "stash-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", face);
      }
      return next;
    }

    if (next.phase === "stash-off") {
      const u = next.t / DUR.stashOff;
      const pose = stashOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "wheek-on") {
      const face = target.holdX >= next.from.x ? 1 : -1;
      const u = next.t / DUR.wheekOn;
      const pose = wheekOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: 0 });
      next.x = pose.x;
      next.lift = 0;
      next.rot = 0;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        const loafFace = wheekFace(target, win, size);
        return goPhase(next, "wheek-loaf", { x: target.holdX, lift: 0 }, { x: target.holdX, lift: 0 }, "sit", loafFace);
      }
      return next;
    }

    if (next.phase === "wheek-loaf") {
      const face = wheekFace(target, win, size);
      next.x = target.holdX;
      next.lift = 0;
      next.rot = 0;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.wheekLoaf) {
        return goPhase(next, "wheek", { x: target.holdX, lift: 0 }, { x: target.holdX, lift: 0 }, "talk", face);
      }
      return next;
    }

    if (next.phase === "wheek") {
      const face = wheekFace(target, win, size);
      const pose = wheekVoicePath(Math.min(1, next.t / DUR.wheek));
      next.x = target.holdX;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "talk";
      next.facing = face;
      if (next.t >= DUR.wheek) {
        return goPhase(next, "wheek-pop", { x: target.holdX, lift: 0 }, { x: target.holdX, lift: 0 }, "play", face);
      }
      return next;
    }

    if (next.phase === "wheek-pop") {
      const face = wheekFace(target, win, size);
      const pose = wheekPopPath(Math.min(1, next.t / DUR.wheekPop));
      next.x = target.holdX;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.wheekPop) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "wheek-off", { x: target.holdX, lift: 0 }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "wheek-off") {
      const u = next.t / DUR.wheekOff;
      const pose = wheekOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = 0;
      next.rot = 0;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "bask-on") {
      const face = target.holdX >= next.from.x ? 1 : -1;
      const u = next.t / DUR.baskOn;
      const pose = baskOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "bask", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "bask") {
      const face = target.landX >= target.holdX ? 1 : -1;
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.bask) {
        return goPhase(next, "bask-withdraw", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "bask-withdraw") {
      const face = target.landX >= target.holdX ? 1 : -1;
      const pose = baskWithdrawPath(Math.min(1, next.t / DUR.baskWithdraw));
      next.x = target.holdX - face * Math.abs(pose.x);
      next.lift = target.holdLift + pose.lift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.baskWithdraw) {
        return goPhase(next, "bask-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", face);
      }
      return next;
    }

    if (next.phase === "bask-off") {
      const u = next.t / DUR.baskOff;
      const pose = baskOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "circle-on") {
      const u = next.t / DUR.circleOn;
      const pose = circleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) {
        return goPhase(next, "circle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "circle") {
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const dir = target.circleDir === -1 ? -1 : 1;
      const u = Math.min(1, next.t / DUR.circle);
      const pose = circlePoint(win, u, size, work, dir);
      const theta = dir * u * Math.PI * 2;
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      next.facing = Math.sin(theta) * dir > 0 ? -1 : 1;
      if (u >= 1) {
        return goPhase(next, "circle-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", next.facing);
      }
      return next;
    }

    if (next.phase === "circle-off") {
      const u = next.t / DUR.circleOff;
      const pose = driftOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = 0;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "perch-on") {
      const face = target.side === "left" ? 1 : -1;
      const u = next.t / DUR.perchOn;
      const pose = perchOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "perch-talk", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "talk", face);
      }
      return next;
    }

    if (next.phase === "perch-talk") {
      const face = target.side === "left" ? 1 : -1;
      const pose = perchTalkPath(Math.min(1, next.t / DUR.perchTalk));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "talk";
      next.facing = face;
      if (next.t >= DUR.perchTalk) {
        return goPhase(next, "perch-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", target.landX >= target.holdX ? 1 : -1);
      }
      return next;
    }

    if (next.phase === "perch-off") {
      const u = next.t / DUR.perchOff;
      const pose = perchOnPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "scent-on") {
      const face = target.side === "left" ? 1 : -1;
      const u = next.t / DUR.scentOn;
      const pose = scentOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: 0 });
      next.x = pose.x;
      next.lift = 0;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "scent", { x: target.holdX, lift: 0 }, { x: target.holdX, lift: 0 }, "sit", face);
      }
      return next;
    }

    if (next.phase === "scent") {
      const face = target.side === "left" ? 1 : -1;
      const pose = scentNosePath(Math.min(1, next.t / DUR.scent));
      next.x = target.holdX + face * pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.scent) {
        return goPhase(next, "scent-off", { x: target.holdX, lift: 0 }, { x: target.landX, lift: 0 }, "walk", target.landX >= target.holdX ? 1 : -1);
      }
      return next;
    }

    if (next.phase === "scent-off") {
      const u = next.t / DUR.scentOff;
      const pose = scentOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = 0;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "bow-on") {
      const face = bowFace(target, win, size);
      const u = next.t / DUR.bowOn;
      const pose = bowOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "bow-stand", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "bow-stand") {
      const face = bowFace(target, win, size);
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.bowStand) {
        return goPhase(next, "bow", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "bow") {
      const face = bowFace(target, win, size);
      const pose = bowDipPath(Math.min(1, next.t / DUR.bow));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = face * pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.bow) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "bow-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "bow-off") {
      const u = next.t / DUR.bowOff;
      const pose = bowOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "hook-on") {
      const face = target.side === "left" ? 1 : -1;
      const startX = target.hookStartX != null ? target.hookStartX : target.holdX;
      const startLift = target.hookStartLift != null ? target.hookStartLift : 0;
      const u = next.t / DUR.hookOn;
      const pose = hookOnPath(Math.min(1, u), next.from, { x: startX, lift: startLift }, target.side);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "hook-climb", { x: startX, lift: startLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "hook-climb") {
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const face = target.side === "left" ? 1 : -1;
      const start = hookPoint(win, target.side === "right" ? "right" : "left", 0, size, work);
      const hang = hookPoint(win, target.side === "right" ? "right" : "left", 1, size, work);
      const u = next.t / DUR.hookClimb;
      const pose = hookClimbPath(Math.min(1, u), start, hang, target.side);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "hook", { x: hang.x, lift: hang.lift }, { x: hang.x, lift: hang.lift }, "talk", face);
      }
      return next;
    }

    if (next.phase === "hook") {
      const face = target.side === "left" ? 1 : -1;
      const pose = hookQuotePath(Math.min(1, next.t / DUR.hook), target.side);
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "talk";
      next.facing = face;
      if (next.t >= DUR.hook) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "hook-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "hook-off") {
      const u = next.t / DUR.hookOff;
      const pose = hookOffPath(Math.min(1, u), next.from, next.to, target.side);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "thread-on") {
      const face = (target.threadEndX != null ? target.threadEndX : target.holdX) >= target.holdX ? 1 : -1;
      const u = next.t / DUR.threadOn;
      const pose = threadOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "thread", { x: target.holdX, lift: target.holdLift }, { x: target.threadEndX != null ? target.threadEndX : target.holdX, lift: target.threadEndLift != null ? target.threadEndLift : target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "thread") {
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const goingRight = (target.threadEndX != null ? target.threadEndX : target.holdX) >= target.holdX;
      const start = threadPoint(win, goingRight ? 0 : 1, size, work);
      const end = threadPoint(win, goingRight ? 1 : 0, size, work);
      const u = next.t / DUR.thread;
      const pose = threadPath(Math.min(1, u), start, end);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = goingRight ? 1 : -1;
      if (u >= 1) {
        const endX = target.threadEndX != null ? target.threadEndX : end.x;
        const endLift = target.threadEndLift != null ? target.threadEndLift : end.lift;
        const leaveFace = target.landX >= endX ? 1 : -1;
        return goPhase(next, "thread-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "thread-off") {
      const u = next.t / DUR.threadOff;
      const pose = threadOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= (target.threadEndX != null ? target.threadEndX : target.holdX) ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "ball-on") {
      const face = target.holdX >= next.from.x ? 1 : -1;
      const u = next.t / DUR.ballOn;
      const pose = ballOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: 0 });
      next.x = pose.x;
      next.lift = 0;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        const pane = ballFace(target, win, size);
        return goPhase(next, "ball-snuffle", { x: target.holdX, lift: 0 }, { x: target.holdX, lift: 0 }, "play", pane);
      }
      return next;
    }

    if (next.phase === "ball-snuffle") {
      const face = ballFace(target, win, size);
      const pose = ballSnufflePath(Math.min(1, next.t / DUR.ballSnuffle));
      next.x = target.holdX + face * pose.x;
      next.lift = pose.lift;
      next.rot = face * pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.ballSnuffle) {
        return goPhase(next, "ball", { x: target.holdX, lift: 0 }, { x: target.holdX, lift: 0 }, "sit", face);
      }
      return next;
    }

    if (next.phase === "ball") {
      const face = ballFace(target, win, size);
      const pose = ballCurlPath(Math.min(1, next.t / DUR.ball));
      next.x = target.holdX;
      next.lift = 0;
      next.rot = face * pose.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.ball) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "ball-off", { x: target.holdX, lift: 0 }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "ball-off") {
      const u = next.t / DUR.ballOff;
      const pose = ballOffPath(Math.min(1, u), next.from, next.to);
      const tuckFace = ballFace(target, win, size);
      next.x = pose.x;
      next.lift = 0;
      next.rot = tuckFace * pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "dust-on") {
      const face = target.holdX >= next.from.x ? 1 : -1;
      const u = next.t / DUR.dustOn;
      const pose = dustOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        const pane = dustFace(target, win, size);
        return goPhase(next, "dust", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", pane);
      }
      return next;
    }

    if (next.phase === "dust") {
      const face = dustFace(target, win, size);
      const pose = dustRollPath(Math.min(1, next.t / DUR.dust));
      next.x = target.holdX + face * pose.x;
      next.lift = target.holdLift + pose.lift;
      next.rot = face * pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.dust) {
        return goPhase(next, "dust-fluff", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "dust-fluff") {
      const face = dustFace(target, win, size);
      const pose = dustFluffPath(Math.min(1, next.t / DUR.dustFluff));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = face * pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.dustFluff) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "dust-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "dust-off") {
      const u = next.t / DUR.dustOff;
      const pose = dustOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "wall-on") {
      const face = wallFace(target, win, size);
      const u = next.t / DUR.wallOn;
      const pose = wallOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "wall", { x: target.holdX, lift: target.holdLift }, { x: target.wallEndX != null ? target.wallEndX : target.holdX, lift: target.wallEndLift != null ? target.wallEndLift : target.holdLift }, "walk", face);
      }
      return next;
    }

    if (next.phase === "wall") {
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const edge = wallEdge(target, win, size);
      const face = wallFace(target, win, size);
      const start = wallPoint(win, 0, edge, size, work);
      const end = wallPoint(win, 1, edge, size, work);
      const u = Math.min(1, next.t / DUR.wall);
      const pose = wallWalkPath(u, start, end);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = face * pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        const endX = target.wallEndX != null ? target.wallEndX : end.x;
        const endLift = target.wallEndLift != null ? target.wallEndLift : end.lift;
        const leaveFace = target.landX >= endX ? 1 : -1;
        return goPhase(next, "wall-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "wall-off") {
      const u = next.t / DUR.wallOff;
      const pose = wallOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= (target.wallEndX != null ? target.wallEndX : target.holdX) ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "toss-on") {
      const face = tossFace(target, win, size);
      const u = next.t / DUR.tossOn;
      const pose = tossOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "toss-sit", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "toss-sit") {
      const face = tossFace(target, win, size);
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.tossSit) {
        return goPhase(next, "toss", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "toss") {
      const face = tossFace(target, win, size);
      const pose = tossFlickPath(Math.min(1, next.t / DUR.toss));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = face * pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.toss) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "toss-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "toss-off") {
      const u = next.t / DUR.tossOff;
      const pose = tossOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "flatten-on") {
      const face = flattenFace(target);
      const u = next.t / DUR.flattenOn;
      const pose = flattenOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "flatten-bob", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "flatten-bob") {
      const face = flattenFace(target);
      const pose = flattenBobPath(Math.min(1, next.t / DUR.flattenBob));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = face * pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.flattenBob) {
        return goPhase(next, "flatten", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "flatten") {
      const face = flattenFace(target);
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.flatten) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "flatten-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "flatten-off") {
      const u = next.t / DUR.flattenOff;
      const pose = flattenOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "drape-on") {
      const face = drapeFace(target, win, size);
      const u = next.t / DUR.drapeOn;
      const pose = drapeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "drape-settle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "drape-settle") {
      const face = drapeFace(target, win, size);
      const pose = drapeSettlePath(Math.min(1, next.t / DUR.drapeSettle));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = face * pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.drapeSettle) {
        const held = goPhase(next, "drape", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
        held.lift = target.holdLift - 2;
        held.rot = face * 22;
        return held;
      }
      return next;
    }

    if (next.phase === "drape") {
      const face = drapeFace(target, win, size);
      next.x = target.holdX;
      next.lift = target.holdLift - 2;
      next.rot = face * 22;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.drape) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "drape-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "drape-off") {
      const u = next.t / DUR.drapeOff;
      const pose = drapeOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "kindle-on") {
      const face = kindleFace(target);
      const u = next.t / DUR.kindleOn;
      const pose = kindleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "kindle-coal", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "kindle-coal") {
      const face = kindleFace(target);
      const pose = kindleCoalPath(Math.min(1, next.t / DUR.kindleCoal));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.kindleCoal) {
        return goPhase(next, "kindle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "kindle") {
      const face = kindleFace(target);
      const pose = kindleRisePath(Math.min(1, next.t / DUR.kindle));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.kindle) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "kindle-off", { x: target.holdX, lift: next.lift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "kindle-off") {
      const u = next.t / DUR.kindleOff;
      const pose = kindleOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
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
    COIL,
    PATH,
    FIELD,
    CRACKLE,
    CHARGE,
    ORBIT,
    CLICK,
    HOLD,
    EARTH,
    LEDGE,
    WATCH,
    THUMP,
    STASH,
    WHEEK,
    BASK,
    CIRCLE,
    PERCH,
    SCENT,
    BOW,
    HOOK,
    THREAD,
    BALL,
    DUST,
    WALL,
    TOSS,
    FLATTEN,
    DRAPE,
    KINDLE,
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
    coilPoint,
    pathPoint,
    fieldPoint,
    cracklePoint,
    chargePoint,
    chargeOpposite,
    orbitPoint,
    orbitOnPath,
    clickPoint,
    clickOpposite,
    clickOnPath,
    clickHopPath,
    holdPoint,
    holdOnPath,
    earthPoint,
    earthOnPath,
    earthStepOffPath,
    ledgePoint,
    watchPoint,
    watchOnPath,
    watchOffPath,
    thumpPoint,
    thumpOnPath,
    thumpStampPath,
    thumpVanishPath,
    stashPoint,
    stashOnPath,
    stashCheekPath,
    stashOffPath,
    wheekPoint,
    wheekFace,
    wheekOnPath,
    wheekVoicePath,
    wheekPopPath,
    wheekOffPath,
    baskPoint,
    baskOnPath,
    baskWithdrawPath,
    baskOffPath,
    circlePoint,
    circleOnPath,
    perchPoint,
    perchOnPath,
    perchTalkPath,
    scentPoint,
    scentOnPath,
    scentNosePath,
    scentOffPath,
    bowPoint,
    bowFace,
    bowOnPath,
    bowDipPath,
    bowOffPath,
    hookPoint,
    hookHangRot,
    hookOnPath,
    hookClimbPath,
    hookQuotePath,
    hookOffPath,
    threadPoint,
    threadOnPath,
    threadPath,
    threadOffPath,
    ballPoint,
    ballFace,
    ballOnPath,
    ballSnufflePath,
    ballCurlPath,
    ballOffPath,
    dustPoint,
    dustFace,
    dustOnPath,
    dustRollPath,
    dustFluffPath,
    dustOffPath,
    wallPoint,
    wallEdge,
    wallFace,
    wallOnPath,
    wallWalkPath,
    wallOffPath,
    tossPoint,
    tossEdge,
    tossFace,
    tossOnPath,
    tossFlickPath,
    tossOffPath,
    flattenPoint,
    flattenFace,
    flattenOnPath,
    flattenBobPath,
    flattenOffPath,
    drapePoint,
    drapeEdge,
    drapeFace,
    drapeOnPath,
    drapeSettlePath,
    drapeOffPath,
    kindlePoint,
    kindleFace,
    kindleOnPath,
    kindleCoalPath,
    kindleRisePath,
    kindleOffPath,
    pickTarget,
    refitTarget,
    divePath,
    leapPath,
    dropPath,
    slideOffPath,
    coilOnPath,
    coilOffPath,
    fieldOnPath,
    driftOffPath,
    chargeBoltPath,
    orbitOnPath,
    beginPlay,
    abortToFloor,
    stepPlay,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWindowPlay = api;
})(typeof window !== "undefined" ? window : globalThis);
