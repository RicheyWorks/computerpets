/** Species-true window play. Rui clings and dives. Arc rides the title-bar ridge. Volt coils a window corner. Trace traces a window path. Flux fields the glass. Spark crackles an edge. Ion charges a corner, then bolts the glass. Gauss orbits the outside of the frame. Relay clicks two nodes. Fuse seats into a clip and holds. Ground seats the bottom lug and earths. Miso sits the top ledge. Pip watches from the floor at a window's feet. Thimble hops to a window, thumps on the floor beside it, then vanishes. Clip hops to a window, ducks into the bottom-inside corner as a drawer, cheeks inventory, then pops back to the floor. Whee waddles to a window, loaves on the floor at its feet, wheeks, popcorns once, then waddles off. Ink paddles the long way to a window, basks on the bottom rail as a pond stone, withdraws the head, then slides the long way back. Coin drifts onto a window as if the glass were a bowl, swims one slow honest circle on the pane, then drifts off. Echo hops onto a window as a lamp-shade perch, repeats the room kinder, then hops off. Rue walks to a window, scents the near jamb on the floor (muzzle in the crack), then slips away. Peck hops onto a window as a landing rock, stands in full dress, bows (brief, required), then hops down. Quill hooks a window jamb with the bill as a third foot, climbs, hangs sideways, quotes from the chest, then drops. Wick threads the sash-sill gap as a tube, then dashes off. Burr shuffles to a window, snuffles the foot of the pane, curls into a ball against the glass, waits, then uncurls and shuffles off. Floss hops onto a window meeting rail as a dust tray, rolls in the sash-dust, fluffs, then hops down. Bloom drifts onto a window as a cistern wall, walks the pane (a salamander on glass), then sinks off. Keel hops onto a window cornice, tosses fruit from the bill, then hops down. Sol climbs a sun-warmed pane, head-bobs once, flattens as the living ornament, then climbs down. Vesper drapes a window lintel as a sleeping wyrm, then slips down. Ember banks as a coal on the window ash, kindles, then returns. Nori buns in a sash well as an inkwell hide, then unrolls. Saffron writes an S-curve along the sash as a pencil-tray canyon, then finishes. Bandit inspects a window jamb as a ruler, ticks the frame in bands, then closes. Jade saddles a casement stay as a lamp-arm, folds in half, then unfolds. Bluff hops onto a window stool as an eraser-dish stage, flips belly-up, holds the death, then rights himself. Sash patrols a damp moss-cup along the condensation channel, pauses, then finishes the lap. Lula pours onto a window apron as a blotter river, loops, holds the weight, then lets go. Coral tiles a window muntin as a stamp box, flashes the tricolor rumor, then stays kind. Blush stones a window sill horn as a pink desert rock, tucks, holds, then inches off. Atlas charts a window transom as a map shelf, climbs the jamb as a tree, unrolls the carpet, then gathers off. Cup lids a window sash latch as a teacup: crawl to the latch, taste the lever as a lid, hide in the latch cup, then jet off. Sepia flushes a window light as lamp-ripple weather: write the pane, hover a W, then fade. Chamber rises a window jamb as stacked nacre rooms: drift onto the oldest room, rise room by room, occupy the last chamber, then sink. Pulse chimes a window pane as a glass of water: drift onto the first moon, ring four moons as a cross, pulse once, then drift. Ochre reefs a window pane as a damp blotter: creep onto the wet glass, plant five arms, remain, then uncling. Tenant knobs a window sash lift as a vacant shell: shuffle onto the lift, measure the mouth, try the abdomen, reject it, then drop. Ledger plows a window stool as a sand tray: bury onto the wood, book-gills read the grain, hold the helmet, then unbury. Anchor hitches a window parting bead as a pencil: hover to the bead, wrap the tail, hold the question mark, then unhitch. Kite barrels a window pane as the sky of a bowl: soar a length of sky, barrel once, then glide. Door gapes a window sash-jamb crack as a book crevice: slip into the crack, breathe the gape, dart once, then slip. Felt leans a window meeting rail as blotter felt: carpet the rail, lean toward the lamp, remain, then peel. Vein unfurls a window sash pocket as a damp saucer: slip into the pocket, unfurl black stems first, stay shy, then fold. Fan golds a window lamp-side as autumn: take the lamp-side glass, gold the fans, hold, then fade. Mast seeds a window stool as an acorn dish: take the stool, stand a small height, drop one letter, remain small, then step back. Disk opens a window pane as an ink-dish pad: float the still ink, open once for the lamp, close, remain the floor, then leave for the night. Others walk a sill. */
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
  const BUN = "bun";
  const WRITE = "write";
  const INSPECT = "inspect";
  const SADDLE = "saddle";
  const FLIP = "flip";
  const PATROL = "patrol";
  const LOOP = "loop";
  const MOSAIC = "mosaic";
  const STONE = "stone";
  const CHART = "chart";
  const LID = "lid";
  const FLUSH = "flush";
  const RISE = "rise";
  const CHIME = "chime";
  const REEF = "reef";
  const KNOB = "knob";
  const PLOW = "plow";
  const HITCH = "hitch";
  const BARREL = "barrel";
  const GAPE = "gape";
  const LEAN = "lean";
  const UNFURL = "unfurl";
  const GOLD = "gold";
  const SEED = "seed";
  const OPEN = "open";
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
    bunOn: 1.44,
    bunTuck: 1.96,
    bun: 3.15,
    bunOff: 1.62,
    writeOn: 0.62,
    write: 2.28,
    writeOff: 0.57,
    inspectOn: 0.71,
    inspect: 2.55,
    inspectOff: 0.66,
    saddleOn: 1.18,
    saddleFold: 1.76,
    saddle: 3.42,
    saddleOff: 1.08,
    flipOn: 0.64,
    flipRoll: 0.92,
    flip: 2.72,
    flipOff: 0.78,
    patrolOn: 0.48,
    patrol: 2.04,
    patrolOff: 0.52,
    loopOn: 1.74,
    loopSettle: 2.36,
    loop: 3.88,
    loopOff: 1.78,
    mosaicOn: 0.82,
    mosaicFlash: 0.68,
    mosaic: 2.46,
    mosaicOff: 0.74,
    stoneOn: 1.92,
    stoneTuck: 2.22,
    stone: 4.36,
    stoneOff: 2.04,
    chartOn: 1.26,
    chartUnroll: 2.08,
    chart: 3.08,
    chartOff: 1.14,
    lidOn: 1.06,
    lidProbe: 1.34,
    lid: 2.58,
    lidOff: 0.84,
    flushOn: 1.22,
    flush: 1.64,
    flushHover: 2.48,
    flushOff: 0.96,
    riseOn: 1.58,
    rise: 3.06,
    riseHold: 2.94,
    riseOff: 1.52,
    chimeOn: 1.44,
    chime: 3.22,
    chimePulse: 1.18,
    chimeOff: 1.36,
    reefOn: 2.18,
    reef: 2.86,
    reefHold: 4.22,
    reefOff: 1.94,
    knobOn: 0.82,
    knobMeasure: 1.86,
    knob: 1.24,
    knobOff: 0.68,
    plowOn: 1.66,
    plowRead: 2.54,
    plow: 1.98,
    plowOff: 1.41,
    hitchOn: 1.48,
    hitchWrap: 1.62,
    hitch: 2.76,
    hitchOff: 1.28,
    barrelOn: 1.86,
    barrelSpan: 2.48,
    barrel: 1.54,
    barrelOff: 1.72,
    gapeOn: 1.16,
    gape: 2.86,
    gapeDart: 0.82,
    gapeOff: 1.14,
    leanOn: 2.46,
    lean: 3.14,
    leanHold: 4.68,
    leanOff: 2.22,
    unfurlOn: 2.08,
    unfurl: 3.62,
    unfurlHold: 2.94,
    unfurlOff: 1.86,
    goldOn: 2.34,
    gold: 2.58,
    goldHold: 3.72,
    goldOff: 2.16,
    seedOn: 2.22,
    seed: 1.96,
    seedHold: 3.44,
    seedOff: 1.78,
    openOn: 2.58,
    open: 2.76,
    openHold: 3.66,
    openOff: 1.88,
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
    if (key === "ball_python") return BUN;
    if (key === "corn_snake") return WRITE;
    if (key === "kingsnake") return INSPECT;
    if (key === "green_tree_python") return SADDLE;
    if (key === "hognose") return FLIP;
    if (key === "garter") return PATROL;
    if (key === "boa") return LOOP;
    if (key === "milk_snake") return MOSAIC;
    if (key === "rosy_boa") return STONE;
    if (key === "carpet_python") return CHART;
    if (key === "octopus") return LID;
    if (key === "cuttlefish") return FLUSH;
    if (key === "nautilus") return RISE;
    if (key === "moon_jelly") return CHIME;
    if (key === "sea_star") return REEF;
    if (key === "hermit_crab") return KNOB;
    if (key === "horseshoe_crab") return PLOW;
    if (key === "seahorse") return HITCH;
    if (key === "manta") return BARREL;
    if (key === "moray") return GAPE;
    if (key === "moss") return LEAN;
    if (key === "maidenhair") return UNFURL;
    if (key === "ginkgo") return GOLD;
    if (key === "oak") return SEED;
    if (key === "water_lily") return OPEN;
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
      if (kind === BUN) return w.width >= 180 && w.height >= 200;
      if (kind === WRITE) return w.width >= 200 && w.height >= 100;
      if (kind === INSPECT) return w.width >= 140 && w.height >= 200;
      if (kind === SADDLE) return w.width >= 160 && w.height >= 220;
      if (kind === FLIP) return w.width >= 180 && w.height >= 140;
      if (kind === LOOP) return w.width >= 220 && w.height >= 160;
      if (kind === MOSAIC) return w.width >= 200 && w.height >= 180;
      if (kind === STONE) return w.width >= 160 && w.height >= 140;
      if (kind === CHART) return w.width >= 220 && w.height >= 200;
      if (kind === LID) return w.width >= 180 && w.height >= 180;
      if (kind === FLUSH) return w.width >= 200 && w.height >= 186;
      if (kind === RISE) return w.width >= 168 && w.height >= 228;
      if (kind === CHIME) return w.width >= 204 && w.height >= 198;
      if (kind === REEF) return w.width >= 188 && w.height >= 216;
      if (kind === KNOB) return w.width >= 176 && w.height >= 164;
      if (kind === PLOW) return w.width >= 192 && w.height >= 158;
      if (kind === HITCH) return w.width >= 168 && w.height >= 208;
      if (kind === BARREL) return w.width >= 236 && w.height >= 224;
      if (kind === GAPE) return w.width >= 172 && w.height >= 212;
      if (kind === LEAN) return w.width >= 196 && w.height >= 186;
      if (kind === UNFURL) return w.width >= 184 && w.height >= 204;
      if (kind === GOLD) return w.width >= 202 && w.height >= 214;
      if (kind === SEED) return w.width >= 198 && w.height >= 172;
      if (kind === OPEN) return w.width >= 194 && w.height >= 188;
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
    if (kind === BUN) {
      const hold = bunPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -72 : 72;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 68 : -68;
      return {
        id: best.id,
        kind,
        side: "well",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "unroll",
        spin: "none",
      };
    }
    if (kind === WRITE) {
      const start = writePoint(best, 0, size, work);
      const end = writePoint(best, 1, size, work);
      const fromLeft = start.x >= workW / 2;
      const approachOff = fromLeft ? -76 : 76;
      const approachX = clamp(start.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = end.x < workW / 2 ? 70 : -70;
      return {
        id: best.id,
        kind,
        side: "canyon",
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "finish",
        spin: "none",
        writeEndX: end.x,
        writeEndLift: end.lift,
      };
    }
    if (kind === INSPECT) {
      const edge = opts && (opts.side === "right" || opts.side === "left") ? opts.side : pickSide(best, petX, size, workW);
      const start = inspectPoint(best, edge, 0, size, work);
      const end = inspectPoint(best, edge, 1, size, work);
      const approachOff = edge === "left" ? -64 : 64;
      const approachX = clamp(start.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = edge === "left" ? -72 : 72;
      return {
        id: best.id,
        kind,
        side: "ruler",
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(start.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "close",
        spin: "none",
        inspectEndX: end.x,
        inspectEndLift: end.lift,
      };
    }
    if (kind === SADDLE) {
      const edge = opts && (opts.side === "right" || opts.side === "left") ? opts.side : pickSide(best, petX, size, workW);
      const hold = saddlePoint(best, edge, size, work);
      const approachOff = edge === "left" ? -70 : 70;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = edge === "left" ? -64 : 64;
      return {
        id: best.id,
        kind,
        side: "stay",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "unfold",
        spin: "none",
      };
    }
    if (kind === FLIP) {
      const hold = flipPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -70 : 70;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 68 : -68;
      return {
        id: best.id,
        kind,
        side: "stool",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "over",
        spin: "none",
      };
    }
    if (kind === PATROL) {
      const start = patrolPoint(best, 0, size, work);
      const end = patrolPoint(best, 1, size, work);
      const approachX = clamp(start.x - 64, 8, Math.max(8, workW - size - 8));
      const away = 72;
      return {
        id: best.id,
        kind,
        side: "cup",
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "lap",
        spin: "none",
        patrolEndX: end.x,
        patrolEndLift: end.lift,
      };
    }
    if (kind === LOOP) {
      const hold = loopPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -76 : 76;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 74 : -74;
      return {
        id: best.id,
        kind,
        side: "apron",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "let",
        spin: "none",
      };
    }
    if (kind === MOSAIC) {
      const hold = mosaicPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -68 : 68;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 70 : -70;
      return {
        id: best.id,
        kind,
        side: "muntin",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "kind",
        spin: "none",
      };
    }
    if (kind === STONE) {
      const edge = opts && (opts.side === "right" || opts.side === "left") ? opts.side : pickSide(best, petX, size, workW);
      const hold = stonePoint(best, edge, size, work);
      const approachOff = edge === "left" ? -70 : 70;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = edge === "left" ? -66 : 66;
      return {
        id: best.id,
        kind,
        side: "horn",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "inch",
        spin: "none",
      };
    }
    if (kind === CHART) {
      const edge = opts && (opts.side === "right" || opts.side === "left") ? opts.side : pickSide(best, petX, size, workW);
      const goingRight = edge === "left";
      const start = chartPoint(best, goingRight ? 0 : 1, size, work);
      const end = chartPoint(best, goingRight ? 1 : 0, size, work);
      const approachOff = goingRight ? -72 : 72;
      const approachX = clamp(start.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = goingRight ? -64 : 64;
      return {
        id: best.id,
        kind,
        side: "transom",
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(start.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "gather",
        spin: "none",
        chartEndX: end.x,
        chartEndLift: end.lift,
      };
    }
    if (kind === LID) {
      const hold = lidPoint(best, size, work);
      const lockRight = hold.x + size / 2 >= best.x + best.width / 2;
      const approachOff = lockRight ? 68 : -68;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = lockRight ? 58 : -58;
      return {
        id: best.id,
        kind,
        side: "latch",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "jet",
        spin: "none",
      };
    }
    if (kind === FLUSH) {
      const start = flushPoint(best, 0, size, work);
      const end = flushPoint(best, 1, size, work);
      const goingRight = end.x >= start.x;
      const approachOff = goingRight ? -72 : 72;
      const approachX = clamp(start.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = goingRight ? 64 : -64;
      return {
        id: best.id,
        kind,
        side: "ripple",
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "fade",
        spin: "none",
        flushEndX: end.x,
        flushEndLift: end.lift,
      };
    }
    if (kind === RISE) {
      const edge = opts && (opts.side === "right" || opts.side === "left") ? opts.side : pickSide(best, petX, size, workW);
      const start = risePoint(best, edge, 0, size, work);
      const end = risePoint(best, edge, 2, size, work);
      const approachOff = edge === "right" ? 72 : -72;
      const approachX = clamp(start.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = edge === "right" ? 64 : -64;
      return {
        id: best.id,
        kind,
        side: "rooms",
        riseEdge: edge,
        holdX: start.x,
        holdLift: start.lift,
        approachX,
        landX: clamp(start.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "sink",
        spin: "none",
        riseEndX: end.x,
        riseEndLift: end.lift,
      };
    }
    if (kind === CHIME) {
      const hold = chimePoint(best, 0, size, work);
      const approachOff = hold.x < workW / 2 ? -70 : 70;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 62 : -62;
      return {
        id: best.id,
        kind,
        side: "saucer",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "drift",
        spin: "none",
      };
    }
    if (kind === REEF) {
      const hold = reefPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -58 : 58;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 54 : -54;
      return {
        id: best.id,
        kind,
        side: "blotter",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "uncling",
        spin: "none",
      };
    }
    if (kind === KNOB) {
      const hold = knobPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -62 : 62;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 56 : -56;
      return {
        id: best.id,
        kind,
        side: "lift",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "reject",
        spin: "none",
      };
    }
    if (kind === PLOW) {
      const hold = plowPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -74 : 74;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 68 : -68;
      return {
        id: best.id,
        kind,
        side: "sand",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "unbury",
        spin: "none",
      };
    }
    if (kind === HITCH) {
      const hold = hitchPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -64 : 64;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 60 : -60;
      return {
        id: best.id,
        kind,
        side: "bead",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "unhitch",
        spin: "none",
      };
    }
    if (kind === BARREL) {
      const dir = best.x + best.width / 2 >= workW / 2 ? -1 : 1;
      const hold = barrelPoint(best, 0, size, work, dir);
      const end = barrelPoint(best, 1, size, work, dir);
      const approachOff = hold.x < workW / 2 ? -72 : 72;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = end.x < workW / 2 ? 68 : -68;
      return {
        id: best.id,
        kind,
        side: "sky",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "glide",
        spin: "none",
        barrelEndX: end.x,
        barrelEndLift: end.lift,
        barrelDir: dir,
      };
    }
    if (kind === GAPE) {
      const hold = gapePoint(best, size, work);
      const dart = gapeDartPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -64 : 64;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 70 : -70;
      return {
        id: best.id,
        kind,
        side: "crevice",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "slip",
        spin: "none",
        gapeDartX: dart.x,
        gapeDartLift: dart.lift,
        gapeEdge: hold.side,
      };
    }
    if (kind === LEAN) {
      const hold = leanPoint(best, size, work);
      const dir = leanLampDir(best, work);
      const approachOff = hold.x < workW / 2 ? -58 : 58;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 62 : -62;
      return {
        id: best.id,
        kind,
        side: "page",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "peel",
        spin: "none",
        leanDir: dir,
      };
    }
    if (kind === UNFURL) {
      const hold = unfurlPoint(best, size, work);
      const approachOff = hold.side === "right" ? 66 : -66;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.side === "right" ? 64 : -64;
      return {
        id: best.id,
        kind,
        side: "pocket",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "fold",
        spin: "none",
        unfurlEdge: hold.side,
      };
    }
    if (kind === GOLD) {
      const hold = goldPoint(best, size, work);
      const dir = goldLampDir(best, work);
      const approachOff = hold.x < workW / 2 ? -60 : 60;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 66 : -66;
      return {
        id: best.id,
        kind,
        side: "autumn",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "fade",
        spin: "none",
        goldDir: dir,
      };
    }
    if (kind === SEED) {
      const hold = seedPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -70 : 70;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 64 : -64;
      return {
        id: best.id,
        kind,
        side: "dish",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "small",
        spin: "none",
      };
    }
    if (kind === OPEN) {
      const hold = openPoint(best, size, work);
      const dir = openLampDir(best, work);
      const approachOff = hold.x < workW / 2 ? -64 : 64;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 60 : -60;
      return {
        id: best.id,
        kind,
        side: "ink",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "night",
        spin: "none",
        openDir: dir,
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
    if (target.kind === BUN) {
      const hold = bunPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === WRITE) {
      const goingRight = (target.writeEndX != null ? target.writeEndX : target.holdX) >= target.holdX;
      const start = writePoint(win, goingRight ? 0 : 1, sprite, work);
      const end = writePoint(win, goingRight ? 1 : 0, sprite, work);
      return { ...target, holdX: start.x, holdLift: start.lift, writeEndX: end.x, writeEndLift: end.lift };
    }
    if (target.kind === INSPECT) {
      const edge = inspectEdge(target, win, sprite);
      const start = inspectPoint(win, edge, 0, sprite, work);
      const end = inspectPoint(win, edge, 1, sprite, work);
      return { ...target, holdX: start.x, holdLift: start.lift, inspectEndX: end.x, inspectEndLift: end.lift };
    }
    if (target.kind === SADDLE) {
      const edge = saddleEdge(target, win, sprite);
      const hold = saddlePoint(win, edge, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === FLIP) {
      const hold = flipPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === PATROL) {
      const goingRight = (target.patrolEndX != null ? target.patrolEndX : target.holdX) >= target.holdX;
      const start = patrolPoint(win, goingRight ? 0 : 1, sprite, work);
      const end = patrolPoint(win, goingRight ? 1 : 0, sprite, work);
      return { ...target, holdX: start.x, holdLift: start.lift, patrolEndX: end.x, patrolEndLift: end.lift };
    }
    if (target.kind === LOOP) {
      const hold = loopPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === MOSAIC) {
      const hold = mosaicPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === STONE) {
      const edge = stoneEdge(target, win, sprite);
      const hold = stonePoint(win, edge, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === CHART) {
      const goingRight = (target.chartEndX != null ? target.chartEndX : target.holdX) >= target.holdX;
      const start = chartPoint(win, goingRight ? 0 : 1, sprite, work);
      const end = chartPoint(win, goingRight ? 1 : 0, sprite, work);
      return { ...target, holdX: start.x, holdLift: start.lift, chartEndX: end.x, chartEndLift: end.lift };
    }
    if (target.kind === LID) {
      const hold = lidPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === FLUSH) {
      const goingRight = (target.flushEndX != null ? target.flushEndX : target.holdX) >= target.holdX;
      const start = flushPoint(win, goingRight ? 0 : 1, sprite, work);
      const end = flushPoint(win, goingRight ? 1 : 0, sprite, work);
      return { ...target, holdX: start.x, holdLift: start.lift, flushEndX: end.x, flushEndLift: end.lift };
    }
    if (target.kind === RISE) {
      const edge = riseEdgeName(target, win, sprite);
      const start = risePoint(win, edge, 0, sprite, work);
      const end = risePoint(win, edge, 2, sprite, work);
      return { ...target, riseEdge: edge, holdX: start.x, holdLift: start.lift, riseEndX: end.x, riseEndLift: end.lift };
    }
    if (target.kind === CHIME) {
      const hold = chimePoint(win, 0, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === REEF) {
      const hold = reefPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === KNOB) {
      const hold = knobPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === PLOW) {
      const hold = plowPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === HITCH) {
      const hold = hitchPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BARREL) {
      const dir = target.barrelDir === -1 ? -1 : 1;
      const hold = barrelPoint(win, 0, sprite, work, dir);
      const end = barrelPoint(win, 1, sprite, work, dir);
      return { ...target, holdX: hold.x, holdLift: hold.lift, barrelEndX: end.x, barrelEndLift: end.lift, barrelDir: dir };
    }
    if (target.kind === GAPE) {
      const hold = gapePoint(win, sprite, work);
      const dart = gapeDartPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift, gapeDartX: dart.x, gapeDartLift: dart.lift, gapeEdge: hold.side };
    }
    if (target.kind === LEAN) {
      const hold = leanPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift, leanDir: leanLampDir(win, work) };
    }
    if (target.kind === UNFURL) {
      const hold = unfurlPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift, unfurlEdge: hold.side };
    }
    if (target.kind === GOLD) {
      const hold = goldPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift, goldDir: goldLampDir(win, work) };
    }
    if (target.kind === SEED) {
      const hold = seedPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === OPEN) {
      const hold = openPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift, openDir: openLampDir(win, work) };
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

  function bunPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 40;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.28;
    const fromTop = Math.max(win.height * 0.5, Math.min(win.height * 0.54, win.height - 88));
    const gripY = win.y + fromTop;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function bunFace(target) {
    return target.landX >= target.holdX ? -1 : 1;
  }

  function bunOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const pour = t * t * (2 - t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const sink = t * t;
    return {
      x: fromX + (toX - fromX) * pour,
      lift: fromLift + (toLift - fromLift) * pour - sink * 6,
      rot: 8 * pour,
    };
  }

  function bunTuckPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.55) {
      const s = t / 0.55;
      const coil = s * s * (3 - 2 * s);
      return { lift: -6 - coil * 6, rot: 8 + coil * 30 };
    }
    const s = (t - 0.55) / 0.45;
    const tuck = s * s;
    return { lift: -12 - tuck * 4, rot: 38 + tuck * 4 };
  }

  function bunOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.32) {
      const s = t / 0.32;
      const open = s * s * (3 - 2 * s);
      return {
        x: fromX,
        lift: fromLift + open * 8,
        rot: 42 * (1 - open),
      };
    }
    const s = (t - 0.32) / 0.68;
    const ease = s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + 8 + (toLift - fromLift - 8) * ease,
      rot: 0,
    };
  }

  function writePoint(win, u, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const inset = Math.max(88, size * 0.42);
    const tray = Math.max(148, Math.min(win.width * 0.32, Math.max(0, win.width - size - inset * 2)));
    const t = Math.max(0, Math.min(1, u));
    const x = win.x + inset + tray * t;
    const fromBot = Math.max(88, Math.min(size * 0.52, win.height * 0.22));
    const gripY = win.y + win.height - fromBot;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift) };
  }

  function writeFace(target) {
    return (target.writeEndX != null ? target.writeEndX : target.holdX) >= target.holdX ? 1 : -1;
  }

  function writeOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const slip = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease + slip * 6 * (toX >= fromX ? 1 : -1),
      lift: fromLift + (toLift - fromLift) * ease + slip * 10,
      rot: (toX >= fromX ? 1 : -1) * 9 * slip,
    };
  }

  function writePath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const curve = Math.sin(t * Math.PI * 2);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + curve * 26,
      rot: (toX >= fromX ? 1 : -1) * curve * 16,
    };
  }

  function writeOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease * 0.12,
        lift: fromLift + 6 * ease,
        rot: (toX >= fromX ? 1 : -1) * 8 * (1 - ease),
      };
    }
    const s = (t - 0.28) / 0.72;
    const ease = s * s * (3 - 2 * s);
    const hop = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * (0.12 + 0.88 * ease),
      lift: fromLift + 6 + (toLift - fromLift - 6) * ease + hop * 8 * (1 - s),
      rot: 0,
    };
  }

  function inspectEdge(target, win, sprite) {
    if (target && (target.side === "right" || target.side === "left")) return target.side;
    const size = sprite == null ? SPRITE : sprite;
    const mid = win.x + win.width / 2;
    const x = target && target.holdX != null ? target.holdX : 0;
    return x + size / 2 >= mid ? "right" : "left";
  }

  function inspectPoint(win, side, u, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const inset = Math.max(30, size * 0.18);
    const x = edge === "right" ? win.x + win.width - size - inset : win.x + inset;
    const t = Math.max(0, Math.min(1, u));
    const lowY = win.y + win.height * 0.74;
    const highY = win.y + win.height * 0.38;
    const gripY = lowY + (highY - lowY) * t;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift), side: edge };
  }

  function inspectFace(target) {
    return target.landX >= target.holdX ? 1 : -1;
  }

  function inspectOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.48) {
      const s = t / 0.48;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease,
        lift: fromLift + (toLift - fromLift) * ease * 0.35,
        rot: 0,
      };
    }
    const s = (t - 0.48) / 0.52;
    const ease = s * s * (3 - 2 * s);
    const freeze = s > 0.7;
    const tick = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: toX,
      lift: fromLift + (toLift - fromLift) * (0.35 + 0.65 * ease),
      rot: freeze ? 0 : 4 * tick,
    };
  }

  function inspectPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const bands = 4;
    const scaled = t * bands;
    const band = Math.min(bands - 1, Math.floor(scaled));
    const local = scaled - band;
    const step = local < 0.4 ? local / 0.4 : 1;
    const ease = step * step * (3 - 2 * step);
    const u0 = band / (bands - 1);
    const u1 = Math.min(1, (band + 1) / (bands - 1));
    const at = band === bands - 1 ? 1 : u0 + (u1 - u0) * ease;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const freeze = local >= 0.4 || band === bands - 1;
    const tick = step <= 0 || step >= 1 ? 0 : Math.sin(step * Math.PI);
    return {
      x: fromX + (toX - fromX) * at,
      lift: fromLift + (toLift - fromLift) * at,
      rot: freeze ? 0 : (toLift >= fromLift ? 1 : -1) * 5 * tick,
    };
  }

  function inspectOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.18) {
      return { x: fromX, lift: fromLift, rot: 0 };
    }
    if (t < 0.5) {
      const s = (t - 0.18) / 0.32;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX,
        lift: fromLift + (toLift - fromLift) * ease * 0.45,
        rot: 0,
      };
    }
    const s = (t - 0.5) / 0.5;
    const ease = s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * (0.45 + 0.55 * ease),
      rot: 0,
    };
  }

  function saddleEdge(target, win, sprite) {
    if (target && (target.side === "right" || target.side === "left")) return target.side;
    const size = sprite == null ? SPRITE : sprite;
    const mid = win.x + win.width / 2;
    const x = target && target.holdX != null ? target.holdX : 0;
    return x + size / 2 >= mid ? "right" : "left";
  }

  function saddlePoint(win, side, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const reach = Math.max(132, size * 0.76);
    const x = edge === "right" ? win.x + win.width - size - reach : win.x + reach;
    const fromTop = Math.max(100, Math.min(win.height * 0.24, 118));
    const gripY = win.y + fromTop;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift), side: edge };
  }

  function saddleFace(target, win, size) {
    if (win) return saddleEdge(target, win, size) === "right" ? -1 : 1;
    return target.landX >= target.holdX ? 1 : -1;
  }

  function saddleOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.56) {
      const s = t / 0.56;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease * 0.48,
        lift: fromLift + (toLift - fromLift) * ease,
        rot: 0,
      };
    }
    const s = (t - 0.56) / 0.44;
    const ease = s * s * (3 - 2 * s);
    const loop = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * (0.48 + 0.52 * ease),
      lift: toLift + loop * 5,
      rot: (toX >= fromX ? 1 : -1) * 8 * loop,
    };
  }

  function saddleFoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.4) {
      const s = t / 0.4;
      const ease = s * s;
      return { lift: ease * 4, rot: ease * 8 };
    }
    if (t < 0.78) {
      const s = (t - 0.4) / 0.38;
      const fold = s * s * (3 - 2 * s);
      return { lift: 4 - fold * 16, rot: 8 + fold * 22 };
    }
    return { lift: -12, rot: 30 };
  }

  function saddleOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.26) {
      const s = t / 0.26;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX,
        lift: fromLift + 12 * ease,
        rot: 30 * (1 - ease),
      };
    }
    const s = (t - 0.26) / 0.74;
    const ease = s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + 12 + (toLift - fromLift - 12) * ease,
      rot: 0,
    };
  }

  function flipPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 32;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.52;
    const fromBot = Math.max(48, Math.min(size * 0.34, win.height * 0.16));
    const gripY = win.y + win.height - fromBot;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 20, maxLift) };
  }

  function flipFace(target) {
    return target.landX >= target.holdX ? -1 : 1;
  }

  function flipOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hop * 18,
      rot: (toX >= fromX ? 1 : -1) * 10 * hop,
    };
  }

  function flipRollPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s;
      return { lift: ease * 6, rot: ease * 14 };
    }
    if (t < 0.72) {
      const s = (t - 0.22) / 0.5;
      const roll = s * s * (3 - 2 * s);
      return { lift: 6 - roll * 14, rot: 14 + roll * 154 };
    }
    return { lift: -8, rot: 168 };
  }

  function flipOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.34) {
      const s = t / 0.34;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX,
        lift: fromLift + 10 * ease,
        rot: 168 * (1 - ease),
      };
    }
    const s = (t - 0.34) / 0.66;
    const ease = s * s * (3 - 2 * s);
    const hop = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + 10 + (toLift - fromLift - 10) * ease + hop * 10 * (1 - s),
      rot: 0,
    };
  }

  function patrolPoint(win, u, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 24;
    const span = Math.max(0, win.width - size - pad * 2);
    const t = Math.max(0, Math.min(1, u));
    const x = win.x + pad + span * t;
    const fromBot = Math.max(76, Math.min(size * 0.46, win.height * 0.19));
    const gripY = win.y + win.height - fromBot;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 18, maxLift) };
  }

  function patrolFace(target) {
    return (target.patrolEndX != null ? target.patrolEndX : target.holdX) >= target.holdX ? 1 : -1;
  }

  function patrolOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const slip = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + slip * 7,
      rot: (toX >= fromX ? 1 : -1) * 7 * slip,
    };
  }

  function patrolPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    let travel;
    if (t < 0.42) {
      const s = t / 0.42;
      travel = s * s * (3 - 2 * s) * 0.48;
    } else if (t < 0.58) {
      travel = 0.48;
    } else {
      const s = (t - 0.58) / 0.42;
      travel = 0.48 + s * s * (3 - 2 * s) * 0.52;
    }
    const heading = toX >= fromX ? 1 : -1;
    const pausing = t >= 0.42 && t < 0.58;
    const dart = pausing ? 0 : Math.sin(t * Math.PI * 7);
    const flick = pausing ? Math.sin(((t - 0.42) / 0.16) * Math.PI) : 0;
    return {
      x: fromX + (toX - fromX) * travel,
      lift: fromLift + (toLift - fromLift) * travel + dart * 5,
      rot: heading * (pausing ? flick * 8 : dart * 9),
    };
  }

  function patrolOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.3) {
      const s = t / 0.3;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease * 0.1,
        lift: fromLift + 5 * ease,
        rot: (toX >= fromX ? 1 : -1) * 6 * (1 - ease),
      };
    }
    const s = (t - 0.3) / 0.7;
    const ease = s * s * (3 - 2 * s);
    const hop = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * (0.1 + 0.9 * ease),
      lift: fromLift + 5 + (toLift - fromLift - 5) * ease + hop * 6 * (1 - s),
      rot: 0,
    };
  }

  function loopPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 56;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.22;
    const fromBot = Math.max(24, Math.min(size * 0.16, win.height * 0.08));
    const gripY = win.y + win.height - fromBot;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 14, maxLift) };
  }

  function loopFace(target, win, size) {
    if (win) {
      const spr = size == null ? SPRITE : size;
      return target.holdX + spr / 2 >= win.x + win.width / 2 ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function loopOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const liftEase = t * t;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * liftEase,
      rot: (toX >= fromX ? 1 : -1) * 6 * ease,
    };
  }

  function loopSettlePath(u) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const wind = t * Math.PI * 2;
    const shrink = 1 - ease;
    return {
      x: Math.sin(wind) * 14 * shrink,
      lift: -ease * 12 + Math.cos(wind) * 8 * shrink,
      rot: ease * 20,
    };
  }

  function loopOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.32) {
      const s = t / 0.32;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX,
        lift: fromLift + 6 * ease,
        rot: 20 * (1 - ease),
      };
    }
    const s = (t - 0.32) / 0.68;
    const ease = s * s;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + 6 + (toLift - fromLift - 6) * ease,
      rot: 0,
    };
  }

  function mosaicPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const span = Math.max(0, win.width - size);
    const x = win.x + span * 0.34;
    const gripY = win.y + win.height * 0.44;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function mosaicFace(target, win, size) {
    if (win) {
      const spr = size == null ? SPRITE : size;
      return target.holdX + spr / 2 >= win.x + win.width / 2 ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function mosaicOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const liftEase = t * t * (2 - t);
    const hop = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 10;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * liftEase + hop,
      rot: (toX >= fromX ? 1 : -1) * 7 * ease,
    };
  }

  function mosaicFlashPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const dart = Math.sin(t * Math.PI * 3);
    const rumor = Math.sin(t * Math.PI);
    return {
      x: dart * 10,
      lift: Math.abs(dart) * 6,
      rot: rumor * 17,
    };
  }

  function mosaicOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.26) {
      const s = t / 0.26;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX,
        lift: fromLift + 5 * ease,
        rot: 0,
      };
    }
    const s = (t - 0.26) / 0.74;
    const ease = s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + 5 + (toLift - fromLift - 5) * ease,
      rot: 0,
    };
  }

  function stoneEdge(target, win, sprite) {
    if (target && (target.side === "right" || target.side === "left")) return target.side;
    const size = sprite == null ? SPRITE : sprite;
    const mid = win.x + win.width / 2;
    const x = target && target.holdX != null ? target.holdX : 0;
    return x + size / 2 >= mid ? "right" : "left";
  }

  function stonePoint(win, side, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const proud = Math.max(18, size * 0.16);
    const x = edge === "right" ? win.x + win.width - size + proud : win.x - proud;
    const fromBot = Math.max(36, Math.min(size * 0.22, win.height * 0.11));
    const gripY = win.y + win.height - fromBot;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 18, maxLift), side: edge };
  }

  function stoneFace(target, win, size) {
    if (win) {
      const spr = size == null ? SPRITE : size;
      return target.holdX + spr / 2 >= win.x + win.width / 2 ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function stoneOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t;
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const inch = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 6;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * (t * t * (2 - t)) + inch,
      rot: (toX >= fromX ? 1 : -1) * 5 * ease,
    };
  }

  function stoneTuckPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.48) {
      const s = t / 0.48;
      const ease = s * s * (3 - 2 * s);
      return { lift: -ease * 8, rot: ease * 9 };
    }
    const s = (t - 0.48) / 0.52;
    const loaf = s * s * (3 - 2 * s);
    return { lift: -8 - loaf * 4, rot: 9 + loaf * 5 };
  }

  function stoneOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX,
        lift: fromLift + 8 * ease,
        rot: 14 * (1 - ease),
      };
    }
    const s = (t - 0.28) / 0.72;
    const ease = s * s;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + 8 + (toLift - fromLift - 8) * ease,
      rot: 0,
    };
  }

  function chartPoint(win, u, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const inset = Math.max(36, size * 0.2);
    const runner = Math.max(160, Math.min(win.width * 0.42, Math.max(0, win.width - size - inset * 2)));
    const t = Math.max(0, Math.min(1, u));
    const x = win.x + inset + runner * t;
    const fromTop = Math.max(84, Math.min(win.height * 0.2, 96));
    const gripY = win.y + fromTop;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function chartFace(target) {
    return (target.chartEndX != null ? target.chartEndX : target.holdX) >= target.holdX ? 1 : -1;
  }

  function chartOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.58) {
      const s = t / 0.58;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease * 0.32,
        lift: fromLift + (toLift - fromLift) * ease,
        rot: dir * 6 * ease,
      };
    }
    const s = (t - 0.58) / 0.42;
    const ease = s * s * (3 - 2 * s);
    const reach = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * (0.32 + 0.68 * ease),
      lift: toLift + reach * 4,
      rot: dir * (6 + 2 * ease),
    };
  }

  function chartUnrollPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    const wave = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 5;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + wave,
      rot: dir * 8 * t,
    };
  }

  function chartOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.3) {
      const s = t / 0.3;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease * 0.12,
        lift: fromLift + 6 * ease,
        rot: dir * 8 * (1 - ease),
      };
    }
    const s = (t - 0.3) / 0.7;
    const ease = s * s;
    return {
      x: fromX + (toX - fromX) * (0.12 + 0.88 * ease),
      lift: fromLift + 6 + (toLift - fromLift - 6) * ease,
      rot: 0,
    };
  }

  function lidPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 36;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.84;
    const rail = Math.max(92, win.height * 0.5);
    const gripY = win.y + rail;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function lidFace(target, win, size) {
    if (win) {
      const spr = size == null ? SPRITE : size;
      return target.holdX + spr / 2 >= win.x + win.width / 2 ? -1 : 1;
    }
    return target.landX >= target.holdX ? 1 : -1;
  }

  function lidOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.52) {
      const s = t / 0.52;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease * 0.38,
        lift: fromLift + 5 * ease,
        rot: dir * 6 * ease,
      };
    }
    const s = (t - 0.52) / 0.48;
    const ease = s * s * (3 - 2 * s);
    const jet = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * (0.38 + 0.62 * ease),
      lift: fromLift + (toLift - fromLift) * ease + jet * 16,
      rot: dir * (6 + 5 * ease),
    };
  }

  function lidProbePath(u) {
    const t = Math.max(0, Math.min(1, u));
    const reach = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.5);
    const tap = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 3);
    return {
      x: reach * 12 + tap * 3,
      lift: Math.abs(tap) * 4,
      rot: reach * 9,
    };
  }

  function lidOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.32) {
      const s = t / 0.32;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease * 0.1,
        lift: fromLift + 14 * ease,
        rot: dir * 11 * (1 - ease),
      };
    }
    const s = (t - 0.32) / 0.68;
    const ease = s * s;
    const jet = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * (0.1 + 0.9 * ease),
      lift: fromLift + 14 + (toLift - fromLift - 14) * ease + jet * 10,
      rot: 0,
    };
  }

  function flushPoint(win, u, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const inset = Math.max(40, size * 0.22);
    const span = Math.max(72, Math.min(win.width * 0.28, Math.max(0, win.width - size - inset * 2)));
    const room = Math.max(0, win.width - size - inset * 2 - span);
    const t = Math.max(0, Math.min(1, u));
    const x = win.x + inset + room * 0.38 + span * t;
    const fromTop = Math.max(108, Math.min(win.height * 0.36, 148));
    const peak = 28;
    let rise = 0;
    if (t < 0.25) rise = (t / 0.25) * peak;
    else if (t < 0.5) rise = (1 - (t - 0.25) / 0.25) * peak;
    else if (t < 0.75) rise = ((t - 0.5) / 0.25) * peak;
    else rise = (1 - (t - 0.75) / 0.25) * peak;
    const gripY = win.y + fromTop - rise;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function flushFace(target) {
    return (target.flushEndX != null ? target.flushEndX : target.holdX) >= target.holdX ? 1 : -1;
  }

  function flushOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    const ease = t * t * (3 - 2 * t);
    const bob = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 11;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + bob,
      rot: dir * 5 * bob * 0.08,
    };
  }

  function flushPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const stripe = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2) * 11;
    const flicker = t <= 0 || t >= 1 ? 0 : Math.abs(Math.sin(t * Math.PI * 3)) * 6;
    return {
      x: stripe,
      lift: flicker,
      rot: stripe * 0.35,
    };
  }

  function flushHoverPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const peak = 28;
    let rise = 0;
    if (t < 0.25) rise = (t / 0.25) * peak;
    else if (t < 0.5) rise = (1 - (t - 0.25) / 0.25) * peak;
    else if (t < 0.75) rise = ((t - 0.5) / 0.25) * peak;
    else rise = (1 - (t - 0.75) / 0.25) * peak;
    const dir = toX >= fromX ? 1 : -1;
    return {
      x: fromX + (toX - fromX) * t,
      lift: fromLift + rise,
      rot: dir * (t < 0.5 ? 7 : -7) * (rise / peak),
    };
  }

  function flushOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.34) {
      const s = t / 0.34;
      const ease = s * s * (3 - 2 * s);
      const fade = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI) * 5;
      return {
        x: fromX + (toX - fromX) * ease * 0.08,
        lift: fromLift - 7 * ease + fade,
        rot: 0,
      };
    }
    const s = (t - 0.34) / 0.66;
    const ease = s * s;
    const bob = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI) * 6 * (1 - s);
    return {
      x: fromX + (toX - fromX) * (0.08 + 0.92 * ease),
      lift: fromLift - 7 + (toLift - fromLift + 7) * ease + bob,
      rot: 0,
    };
  }

  function riseEdgeName(target, win, sprite) {
    if (target && (target.riseEdge === "right" || target.riseEdge === "left")) return target.riseEdge;
    if (win) {
      const size = sprite == null ? SPRITE : sprite;
      const mid = (target && target.holdX != null ? target.holdX : 0) + size / 2;
      return mid >= win.x + win.width / 2 ? "right" : "left";
    }
    return "left";
  }

  function risePoint(win, side, room, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = side === "right" ? "right" : "left";
    const proud = size * 0.55;
    const x = edge === "right" ? win.x + win.width - size + proud : win.x - proud;
    const step = Math.max(0, Math.min(2, room == null ? 0 : room));
    const fromBot = 0.82 - step * 0.23;
    const gripY = win.y + win.height * fromBot;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift), side: edge };
  }

  function riseFace(target) {
    return target.riseEdge === "right" ? -1 : 1;
  }

  function riseOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const gas = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 7;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + gas,
      rot: (toX >= fromX ? 1 : -1) * 4 * (1 - ease),
    };
  }

  function risePath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    let step = 0;
    let rising = 0;
    let frac = 0;
    if (t < 0.22) {
      step = 0;
    } else if (t < 0.38) {
      frac = (t - 0.22) / 0.16;
      step = smoothstep(frac) * 0.5;
      rising = 1;
    } else if (t < 0.56) {
      step = 0.5;
    } else if (t < 0.78) {
      frac = (t - 0.56) / 0.22;
      step = 0.5 + smoothstep(frac) * 0.5;
      rising = 1;
    } else {
      step = 1;
    }
    const tilt = rising ? Math.sin(Math.max(0, Math.min(1, frac)) * Math.PI) * 9 : 0;
    return {
      x: fromX + (toX - fromX) * step,
      lift: fromLift + (toLift - fromLift) * step,
      rot: tilt,
    };
  }

  function riseHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const consider = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 3;
    return {
      x: 0,
      lift: consider,
      rot: consider * 0.4,
    };
  }

  function riseOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.42) {
      const s = t / 0.42;
      const ease = s * s * (3 - 2 * s);
      const midLift = fromLift * 0.28;
      return {
        x: fromX,
        lift: fromLift + (midLift - fromLift) * ease,
        rot: 5 * (1 - ease),
      };
    }
    const s = (t - 0.42) / 0.58;
    const ease = s * s;
    const midLift = fromLift * 0.28;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: midLift + (toLift - midLift) * ease,
      rot: 0,
    };
  }

  function chimeCenter(win, sprite, work) {
    return fieldPoint(win, sprite, work);
  }

  function chimePoint(win, moon, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const center = chimeCenter(win, size, work);
    const room = Math.min(win.width, win.height);
    const reach = clamp(room * 0.12, 32, 44);
    const slot = Math.max(0, Math.min(3, Math.floor(Number(moon) || 0)));
    const dx = slot === 2 ? -reach : slot === 3 ? reach : 0;
    const dy = slot === 0 ? reach : slot === 1 ? -reach : 0;
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x: center.x + dx, lift: clamp(center.lift + dy, 36, maxLift) };
  }

  function chimeFace(target) {
    return target.landX >= target.holdX ? 1 : -1;
  }

  function chimeOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const vacant = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 9;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + vacant,
      rot: 0,
    };
  }

  function chimePath(u, top, bottom, left, right) {
    const t = Math.max(0, Math.min(1, u));
    const center = { x: top.x, lift: left.lift };
    const mix = (a, b, s) => {
      const e = s * s * (3 - 2 * s);
      const ax = a && a.x != null ? a.x : 0;
      const bx = b && b.x != null ? b.x : 0;
      const al = a && a.lift != null ? a.lift : 0;
      const bl = b && b.lift != null ? b.lift : 0;
      return {
        x: ax + (bx - ax) * e,
        lift: al + (bl - al) * e,
        rot: 0,
      };
    };
    if (t < 0.14) return { x: top.x, lift: top.lift, rot: 0 };
    if (t < 0.32) return mix(top, bottom, (t - 0.14) / 0.18);
    if (t < 0.42) return { x: bottom.x, lift: bottom.lift, rot: 0 };
    if (t < 0.52) return mix(bottom, center, (t - 0.42) / 0.1);
    if (t < 0.62) return mix(center, left, (t - 0.52) / 0.1);
    if (t < 0.72) return { x: left.x, lift: left.lift, rot: 0 };
    if (t < 0.82) return mix(left, center, (t - 0.72) / 0.1);
    if (t < 0.92) return mix(center, right, (t - 0.82) / 0.1);
    return { x: right.x, lift: right.lift, rot: 0 };
  }

  function chimePulsePath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.36) {
      const s = t / 0.36;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease,
        lift: fromLift + (toLift - fromLift) * ease,
        rot: 0,
      };
    }
    const s = (t - 0.36) / 0.64;
    const beat = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: toX,
      lift: toLift + beat * 16,
      rot: 0,
    };
  }

  function chimeOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t;
    const vacant = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 7 * (1 - t);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + vacant,
      rot: 0,
    };
  }

  function reefPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 28;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.28;
    const wet = Math.max(48, win.height * 0.28);
    const gripY = win.y + win.height - wet;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function reefArm(win, arm, sprite, work) {
    const blot = reefPoint(win, sprite, work);
    const room = Math.min(win.width, win.height);
    const reach = clamp(room * 0.04, 12, 18);
    const slot = Math.max(0, Math.min(4, Math.floor(Number(arm) || 0)));
    const angle = Math.PI / 2 + slot * ((Math.PI * 2) / 5);
    const dx = Math.cos(angle) * reach;
    const dy = Math.sin(angle) * reach;
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x: blot.x + dx, lift: clamp(blot.lift + dy, 36, maxLift) };
  }

  function reefFace(target) {
    return target.landX >= target.holdX ? 1 : -1;
  }

  function reefOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * t * (t * (t * 6 - 15) + 10);
    const press = t > 0.82 ? Math.sin(((t - 0.82) / 0.18) * Math.PI) * 4 : 0;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease - press,
      rot: 0,
    };
  }

  function reefPath(u, blot, arms) {
    const t = Math.max(0, Math.min(1, u));
    const center = blot && blot.x != null ? blot : { x: 0, lift: 0 };
    const pts = arms && arms.length ? arms : [center, center, center, center, center];
    const slot = Math.min(4, Math.floor(t * 5));
    const local = (t - slot * 0.2) / 0.2;
    const arm = pts[slot] || center;
    const mix = (a, b, s) => {
      const e = s * s * (3 - 2 * s);
      const ax = a && a.x != null ? a.x : 0;
      const bx = b && b.x != null ? b.x : 0;
      const al = a && a.lift != null ? a.lift : 0;
      const bl = b && b.lift != null ? b.lift : 0;
      return {
        x: ax + (bx - ax) * e,
        lift: al + (bl - al) * e,
        rot: 0,
      };
    };
    if (local < 0.55) return mix(center, arm, local / 0.55);
    return mix(arm, center, (local - 0.55) / 0.45);
  }

  function reefHoldPath(u, at) {
    const x = at && at.x != null ? at.x : 0;
    const lift = at && at.lift != null ? at.lift : 0;
    return { x, lift, rot: 0 };
  }

  function reefOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.22) {
      return { x: fromX, lift: fromLift, rot: 0 };
    }
    const s = (t - 0.22) / 0.78;
    const ease = s * s;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease,
      rot: 0,
    };
  }

  function knobPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 30;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.58;
    const liftPride = Math.max(40, size * 0.22);
    const gripY = win.y + win.height - liftPride;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function knobFace(target) {
    return target.landX >= target.holdX ? 1 : -1;
  }

  function knobOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.48) {
      const s = t / 0.48;
      const ease = s * s * (3 - 2 * s);
      const hop = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
      return {
        x: fromX + (toX - fromX) * ease * 0.46,
        lift: fromLift + hop * 14,
        rot: dir * 8 * hop,
      };
    }
    const s = (t - 0.48) / 0.52;
    const ease = s * s * (3 - 2 * s);
    const seat = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * (0.46 + 0.54 * ease),
      lift: fromLift + (toLift - fromLift) * ease + seat * 6,
      rot: dir * 5 * (1 - ease),
    };
  }

  function knobMeasurePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.38) {
      const s = t / 0.38;
      const reach = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
      return { x: reach * 10, lift: reach * 3, rot: reach * 7 };
    }
    if (t < 0.52) {
      return { x: 0, lift: 0, rot: 0 };
    }
    const s = (t - 0.52) / 0.48;
    const reach = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    const tick = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI * 2);
    return { x: reach * 14 + tick * 2, lift: Math.abs(tick) * 3, rot: reach * 9 };
  }

  function knobPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.42) {
      const s = t / 0.42;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 8, lift: -6 * ease, rot: 6 * ease };
    }
    if (t < 0.58) {
      return { x: 8, lift: -6, rot: 6 };
    }
    const s = (t - 0.58) / 0.42;
    const ease = s * s * (3 - 2 * s);
    const shove = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return { x: 8 * (1 - ease) - shove * 6, lift: -6 * (1 - ease), rot: 6 * (1 - ease) };
  }

  function knobOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease * 0.12,
        lift: fromLift + 8 * ease,
        rot: dir * 7 * (1 - ease),
      };
    }
    const s = (t - 0.28) / 0.72;
    const ease = s * s;
    const hop = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return {
      x: fromX + (toX - fromX) * (0.12 + 0.88 * ease),
      lift: fromLift + 8 + (toLift - fromLift - 8) * ease + hop * 10,
      rot: dir * 6 * hop * (1 - s),
    };
  }

  function plowPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 26;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.16;
    const stool = Math.max(14, size * 0.09);
    const gripY = win.y + win.height - stool;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 18, maxLift) };
  }

  function plowFace(target) {
    return target.landX >= target.holdX ? 1 : -1;
  }

  function plowOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    const ease = t * t * t * (t * (t * 6 - 15) + 10);
    const furrow = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2) * 3 * (1 - t);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + Math.abs(furrow),
      rot: dir * 7 * (1 - ease),
    };
  }

  function plowReadPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.46) {
      const s = t / 0.46;
      const page = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
      return { x: page * 3, lift: -5 * page, rot: page * 4 };
    }
    if (t < 0.56) {
      return { x: 0, lift: -2, rot: 0 };
    }
    const s = (t - 0.56) / 0.44;
    const page = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
    return { x: -page * 4, lift: -6 * page, rot: -page * 5 };
  }

  function plowPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    return { x: -3 * ease, lift: -4 * ease, rot: 3 * ease };
  }

  function plowOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.34) {
      const s = t / 0.34;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX + (toX - fromX) * ease * 0.1,
        lift: fromLift + 5 * ease,
        rot: dir * 5 * ease,
      };
    }
    const s = (t - 0.34) / 0.66;
    const ease = s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * (0.1 + 0.9 * ease),
      lift: fromLift + 5 + (toLift - fromLift - 5) * ease,
      rot: dir * 5 * (1 - ease),
    };
  }

  function hitchPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const span = Math.max(0, win.width - size);
    const x = win.x + span * 0.47;
    const gripY = win.y + win.height * 0.61;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function hitchFace(target) {
    return target.landX >= target.holdX ? 1 : -1;
  }

  function hitchOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    const ease = t * t * (3 - 2 * t);
    const hover = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 3) * 5;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + hover,
      rot: dir * 6 * (1 - ease),
    };
  }

  function hitchWrapPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.38) {
      const s = t / 0.38;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 6, lift: ease * 3, rot: ease * 10 };
    }
    if (t < 0.72) {
      const s = (t - 0.38) / 0.34;
      const wrap = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI);
      return { x: 6 - wrap * 2, lift: 3 + wrap * 2, rot: 10 - wrap * 4 };
    }
    const s = (t - 0.72) / 0.28;
    const ease = s * s * (3 - 2 * s);
    return { x: 4 * (1 - ease), lift: 3 * (1 - ease), rot: 6 * (1 - ease) };
  }

  function hitchPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const bob = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2) * 2;
    return { x: 0, lift: bob, rot: bob * 0.8 };
  }

  function hitchOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX,
        lift: fromLift + 4 * ease,
        rot: dir * 8 * ease,
      };
    }
    const s = (t - 0.28) / 0.72;
    const ease = s * s * (3 - 2 * s);
    const hover = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI) * 6;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + 4 + (toLift - fromLift - 4) * ease + hover,
      rot: dir * 8 * (1 - ease),
    };
  }

  function barrelPoint(win, u, sprite, work, dir) {
    const size = sprite == null ? SPRITE : sprite;
    const t = Math.max(0, Math.min(1, u));
    const sign = dir === -1 ? -1 : 1;
    const span = Math.max(0, win.width - size);
    const leftU = 0.18;
    const rightU = 0.82;
    const startU = sign === 1 ? leftU : rightU;
    const endU = sign === 1 ? rightU : leftU;
    const x = win.x + span * (startU + (endU - startU) * t);
    const startY = win.y + win.height * 0.28;
    const endY = win.y + win.height * 0.38;
    const gripY = startY + (endY - startY) * t;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 40, maxLift) };
  }

  function barrelFace(target) {
    const endX = target.barrelEndX != null ? target.barrelEndX : target.holdX;
    return endX >= target.holdX ? 1 : -1;
  }

  function barrelOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    const ease = t * t * (3 - 2 * t);
    const wing = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 10;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + wing,
      rot: dir * 8 * (t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI)),
    };
  }

  function barrelSpanPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    const ease = t * t * (3 - 2 * t);
    const swell = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 6;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + swell,
      rot: dir * 4 * (t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2)),
    };
  }

  function barrelPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const roll = Math.sin(t * Math.PI);
    return {
      x: t * 18,
      lift: roll * 14,
      rot: 360 * t,
    };
  }

  function barrelOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.24) {
      const s = t / 0.24;
      const ease = s * s * (3 - 2 * s);
      return {
        x: fromX,
        lift: fromLift + 5 * ease,
        rot: dir * 10 * (1 - ease),
      };
    }
    const s = (t - 0.24) / 0.76;
    const ease = s * s * (3 - 2 * s);
    const glide = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI) * 8;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + 5 + (toLift - fromLift - 5) * ease + glide,
      rot: dir * 7 * (1 - ease),
    };
  }

  function gapeEdgeName(win, work) {
    const workW = work && work.width ? work.width : 1280;
    return win.x + win.width / 2 >= workW / 2 ? "left" : "right";
  }

  function gapePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = gapeEdgeName(win, work);
    const hide = size * 0.32;
    const x = edge === "right" ? win.x + win.width - size + hide : win.x - hide;
    const gripY = win.y + win.height * 0.38;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift), side: edge };
  }

  function gapeDartPoint(win, sprite, work) {
    const hold = gapePoint(win, sprite, work);
    const inward = hold.side === "right" ? -1 : 1;
    const reach = Math.min(86, Math.max(54, win.width * 0.14));
    const x = hold.x + inward * reach;
    const lift = hold.lift + 6;
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function gapeFace(target) {
    const dartX = target.gapeDartX != null ? target.gapeDartX : target.holdX;
    return dartX >= target.holdX ? 1 : -1;
  }

  function gapeOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    const ease = t * t * (3 - 2 * t);
    const pour = t * t;
    const mix = ease * 0.4 + pour * 0.6;
    const squeeze = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * mix,
      lift: fromLift + (toLift - fromLift) * mix + squeeze * 7,
      rot: dir * (6 + squeeze * 14),
    };
  }

  function gapePath(u) {
    const t = Math.max(0, Math.min(1, u));
    const jaw = Math.max(0, Math.sin(t * Math.PI * 5));
    return {
      x: 0,
      lift: jaw * 2.4,
      rot: jaw * 6.5,
    };
  }

  function gapeDartPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    if (t < 0.32) {
      const s = t / 0.32;
      const ease = s * s;
      return {
        x: fromX + (toX - fromX) * ease,
        lift: fromLift + (toLift - fromLift) * ease,
        rot: dir * 10 * ease,
      };
    }
    const s = (t - 0.32) / 0.68;
    const snap = 1 - s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * snap,
      lift: fromLift + (toLift - fromLift) * snap,
      rot: dir * 10 * snap,
    };
  }

  function gapeOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const dir = toX >= fromX ? 1 : -1;
    const ease = t * t * (3 - 2 * t);
    const uncoil = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + uncoil * 8 * (1 - t),
      rot: dir * 8 * (1 - ease),
    };
  }

  function leanLampDir(win, work) {
    const workW = work && work.width ? work.width : 1280;
    return win.x + win.width / 2 < workW / 2 ? 1 : -1;
  }

  function leanPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 36;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.36;
    const rail = Math.max(84, win.height * 0.51);
    const gripY = win.y + rail;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function leanFace(target) {
    return target.leanDir === -1 ? -1 : 1;
  }

  function leanOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * t * (t * (t * 6 - 15) + 10);
    const press = t > 0.72 ? Math.sin(((t - 0.72) / 0.28) * Math.PI) * 3 : 0;
    const settle = (1 - t) * 5;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease - press,
      rot: settle * (toX >= fromX ? 1 : -1),
    };
  }

  function leanPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    return {
      x: ease * 11,
      lift: ease * 8,
      rot: ease * 14,
    };
  }

  function leanHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const breathe = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.8;
    return {
      x: 11,
      lift: 8 + breathe,
      rot: 14,
    };
  }

  function leanOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.28) {
      return { x: fromX, lift: fromLift, rot: 10 * (1 - t / 0.28) };
    }
    const s = (t - 0.28) / 0.72;
    const ease = s * s;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease,
      rot: 4 * (1 - ease),
    };
  }

  function unfurlEdgeName(win, work) {
    const workW = work && work.width ? work.width : 1280;
    return win.x + win.width / 2 < workW / 2 ? "left" : "right";
  }

  function unfurlPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const edge = unfurlEdgeName(win, work);
    const inset = size * 0.14;
    const x = edge === "right" ? win.x + win.width - size + inset : win.x - inset;
    const pocket = Math.max(72, win.height * 0.76);
    const gripY = win.y + pocket;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift), side: edge };
  }

  function unfurlFace(target) {
    return target.unfurlEdge === "right" ? 1 : -1;
  }

  function unfurlOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * t * (t * (t * 6 - 15) + 10);
    const tuck = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 7;
    const coil = t * t;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease - tuck,
      rot: (toX >= fromX ? -1 : 1) * 26 * coil,
    };
  }

  function unfurlPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.42) {
      const s = t / 0.42;
      const ease = s * s * (3 - 2 * s);
      return {
        x: 0,
        lift: -8 + ease * 26,
        rot: 46 - ease * 30,
      };
    }
    const s = (t - 0.42) / 0.58;
    const ease = s * s * (3 - 2 * s);
    return {
      x: ease * 6,
      lift: 18 + ease * 6,
      rot: 16 - ease * 7,
    };
  }

  function unfurlHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const shy = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 1.4;
    return {
      x: 6,
      lift: 24 + shy,
      rot: 9,
    };
  }

  function unfurlOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.34) {
      const s = t / 0.34;
      const fold = s * s;
      return {
        x: fromX,
        lift: fromLift - fold * 10,
        rot: 9 + fold * 28,
      };
    }
    const s = (t - 0.34) / 0.66;
    const ease = s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift - 10 + (toLift - (fromLift - 10)) * ease,
      rot: 37 * (1 - ease),
    };
  }

  function goldLampDir(win, work) {
    const workW = work && work.width ? work.width : 1280;
    return win.x + win.width / 2 < workW / 2 ? 1 : -1;
  }

  function goldPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const dir = goldLampDir(win, work);
    const pad = 28;
    const span = Math.max(0, win.width - size - pad * 2);
    const u = dir === 1 ? 0.78 : 0.22;
    const x = win.x + pad + span * u;
    const light = Math.max(70, win.height * 0.38);
    const gripY = win.y + light;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function goldFace(target) {
    return target.goldDir === -1 ? -1 : 1;
  }

  function goldOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * t * (t * (t * 6 - 15) + 10);
    const leaf = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 2;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease - leaf,
      rot: (1 - ease) * 2 * (toX >= fromX ? 1 : -1),
    };
  }

  function goldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const ease = t * t * (3 - 2 * t);
    return {
      x: ease * 8,
      lift: 2 + ease * 7,
      rot: 3 * (1 - ease),
    };
  }

  function goldHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const fossil = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.35;
    return {
      x: 8,
      lift: 9 + fossil,
      rot: 0,
    };
  }

  function goldOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.4) {
      const s = t / 0.4;
      const fade = s * s;
      return {
        x: fromX,
        lift: fromLift - fade * 12,
        rot: 0,
      };
    }
    const s = (t - 0.4) / 0.6;
    const ease = s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift - 12 + (toLift - (fromLift - 12)) * ease,
      rot: 0,
    };
  }


  function seedPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 42;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.86;
    const dish = Math.max(44, size * 0.26);
    const gripY = win.y + win.height - dish;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 22, maxLift) };
  }

  function seedFace(target) {
    return target.landX >= target.holdX ? -1 : 1;
  }

  function seedOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * t * (t * (t * 6 - 15) + 10);
    const plant = t > 0.7 && t < 1 ? Math.sin(((t - 0.7) / 0.3) * Math.PI) * 3 : 0;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease - plant,
      rot: (1 - ease) * 4 * (toX >= fromX ? 1 : -1),
    };
  }

  function seedPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.36) {
      const s = t / 0.36;
      const ease = s * s * (3 - 2 * s);
      return { x: 0, lift: ease * 15, rot: ease * 2 };
    }
    if (t < 0.7) {
      const s = (t - 0.36) / 0.34;
      const bow = Math.sin(s * Math.PI);
      const letter = s * s * (3 - 2 * s);
      return {
        x: letter * 11,
        lift: 15 - bow * 8,
        rot: 2 + bow * 10,
      };
    }
    const s = (t - 0.7) / 0.3;
    const ease = s * s * (3 - 2 * s);
    return {
      x: 11 + ease * 2,
      lift: 15 - ease * 1,
      rot: 2 * (1 - ease),
    };
  }

  function seedHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const breathe = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.6;
    return {
      x: 13,
      lift: 14 + breathe,
      rot: 0,
    };
  }

  function seedOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.32) {
      const s = t / 0.32;
      const ease = s * s;
      return {
        x: fromX + (toX - fromX) * ease * 0.08,
        lift: fromLift - 6 * ease,
        rot: 0,
      };
    }
    const s = (t - 0.32) / 0.68;
    const ease = s * s * (3 - 2 * s);
    return {
      x: fromX + (toX - fromX) * (0.08 + 0.92 * ease),
      lift: fromLift - 6 + (toLift - (fromLift - 6)) * ease,
      rot: 0,
    };
  }

  function openLampDir(win, work) {
    const workW = work && work.width ? work.width : 1280;
    return win.x + win.width / 2 < workW / 2 ? 1 : -1;
  }

  function openPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 32;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.22;
    const water = Math.max(76, win.height * 0.671);
    const gripY = win.y + water;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function openFace(target) {
    return target.openDir === -1 ? -1 : 1;
  }

  function openOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * t * (t * (t * 6 - 15) + 10);
    const bob = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 5;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + bob,
      rot: (1 - ease) * 3 * (toX >= fromX ? 1 : -1),
    };
  }

  function openPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.2) {
      return { x: 0, lift: 3, rot: 0 };
    }
    if (t < 0.52) {
      const s = (t - 0.2) / 0.32;
      const ease = s * s * (3 - 2 * s);
      return {
        x: ease * 3,
        lift: 3 + ease * 14,
        rot: ease * 6,
      };
    }
    if (t < 0.7) {
      return { x: 3, lift: 17, rot: 6 };
    }
    const s = (t - 0.7) / 0.3;
    const ease = s * s * (3 - 2 * s);
    return {
      x: 3 - ease * 2,
      lift: 17 - ease * 13,
      rot: 6 * (1 - ease),
    };
  }

  function openHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const still = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.7;
    return {
      x: 1,
      lift: 4 + still,
      rot: 0,
    };
  }

  function openOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    if (t < 0.3) {
      return { x: fromX, lift: fromLift, rot: 0 };
    }
    const s = (t - 0.3) / 0.7;
    const ease = s * s * (3 - 2 * s);
    const bob = s <= 0 || s >= 1 ? 0 : Math.sin(s * Math.PI) * 6 * (1 - s);
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + bob,
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
    if (shouldAbort(life) && play.phase !== "drop" && play.phase !== "dive" && play.phase !== "land" && play.phase !== "ridge-off" && play.phase !== "coil-off" && play.phase !== "path-off" && play.phase !== "field-off" && play.phase !== "crackle-off" && play.phase !== "charge-off" && play.phase !== "orbit-off" && play.phase !== "click-off" && play.phase !== "hold-off" && play.phase !== "earth-off" && play.phase !== "ledge-off" && play.phase !== "watch-off" && play.phase !== "thump-off" && play.phase !== "stash-off" && play.phase !== "wheek-off" && play.phase !== "bask-off" && play.phase !== "circle-off" && play.phase !== "perch-off" && play.phase !== "scent-off" && play.phase !== "bow-off" && play.phase !== "hook-off" && play.phase !== "thread-off" && play.phase !== "ball-off" && play.phase !== "dust-off" && play.phase !== "wall-off" && play.phase !== "toss-off" && play.phase !== "flatten-off" && play.phase !== "drape-off" && play.phase !== "kindle-off" && play.phase !== "bun-off" && play.phase !== "write-off" && play.phase !== "inspect-off" && play.phase !== "saddle-off" && play.phase !== "patrol-off" && play.phase !== "loop-off" && play.phase !== "mosaic-off" && play.phase !== "stone-off" && play.phase !== "chart-off" && play.phase !== "lid-off" && play.phase !== "flush-off" && play.phase !== "rise-off" && play.phase !== "chime-off" && play.phase !== "reef-off" && play.phase !== "knob-off" && play.phase !== "plow-off" && play.phase !== "hitch-off" && play.phase !== "barrel-off" && play.phase !== "gape-off" && play.phase !== "lean-off" && play.phase !== "unfurl-off" && play.phase !== "gold-off") {
      return abortToFloor(play, { x: play.x, lift: play.lift }, work);
    }
    let next = { ...play, t: play.t + Math.max(0, dt) };
    const lookId = (next.phase === "click-hop" || next.phase === "click-b") && next.target && next.target.clickToId
      ? next.target.clickToId
      : next.target && next.target.id;
    const win = findWin(windows, lookId);
    if (win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land" && next.phase !== "ridge-off" && next.phase !== "coil-off" && next.phase !== "path-off" && next.phase !== "field-off" && next.phase !== "crackle-off" && next.phase !== "charge-off" && next.phase !== "orbit-off" && next.phase !== "click-off" && next.phase !== "hold-off" && next.phase !== "earth-off" && next.phase !== "ledge-off" && next.phase !== "watch-off" && next.phase !== "thump-off" && next.phase !== "stash-off" && next.phase !== "wheek-off" && next.phase !== "bask-off" && next.phase !== "circle-off" && next.phase !== "perch-off" && next.phase !== "scent-off" && next.phase !== "bow-off" && next.phase !== "hook-off" && next.phase !== "thread-off" && next.phase !== "ball-off" && next.phase !== "dust-off" && next.phase !== "wall-off" && next.phase !== "toss-off" && next.phase !== "flatten-off" && next.phase !== "drape-off" && next.phase !== "kindle-off" && next.phase !== "bun-off" && next.phase !== "write-off" && next.phase !== "inspect-off" && next.phase !== "saddle-off" && next.phase !== "patrol-off" && next.phase !== "loop-off" && next.phase !== "mosaic-off" && next.phase !== "stone-off" && next.phase !== "chart-off" && next.phase !== "lid-off" && next.phase !== "flush-off" && next.phase !== "rise-off" && next.phase !== "chime-off" && next.phase !== "reef-off" && next.phase !== "knob-off" && next.phase !== "plow-off" && next.phase !== "hitch-off" && next.phase !== "barrel-off" && next.phase !== "gape-off" && next.phase !== "lean-off" && next.phase !== "unfurl-off" && next.phase !== "gold-off" && next.phase !== "seed-off" && next.phase !== "open-off") {
      next.target = refitTarget(next.target, win, size, work, windows);
    } else if (!win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land" && next.phase !== "approach" && next.phase !== "ridge-off" && next.phase !== "coil-off" && next.phase !== "path-off" && next.phase !== "field-off" && next.phase !== "crackle-off" && next.phase !== "charge-off" && next.phase !== "orbit-off" && next.phase !== "click-off" && next.phase !== "hold-off" && next.phase !== "earth-off" && next.phase !== "ledge-off" && next.phase !== "watch-off" && next.phase !== "thump-off" && next.phase !== "stash-off" && next.phase !== "wheek-off" && next.phase !== "bask-off" && next.phase !== "circle-off" && next.phase !== "perch-off" && next.phase !== "scent-off" && next.phase !== "bow-off" && next.phase !== "hook-off" && next.phase !== "thread-off" && next.phase !== "ball-off" && next.phase !== "dust-off" && next.phase !== "wall-off" && next.phase !== "toss-off" && next.phase !== "flatten-off" && next.phase !== "drape-off" && next.phase !== "kindle-off" && next.phase !== "bun-off" && next.phase !== "write-off" && next.phase !== "inspect-off" && next.phase !== "saddle-off" && next.phase !== "patrol-off" && next.phase !== "loop-off" && next.phase !== "mosaic-off" && next.phase !== "stone-off" && next.phase !== "chart-off" && next.phase !== "lid-off" && next.phase !== "flush-off" && next.phase !== "rise-off" && next.phase !== "chime-off" && next.phase !== "reef-off" && next.phase !== "knob-off" && next.phase !== "plow-off" && next.phase !== "hitch-off" && next.phase !== "barrel-off" && next.phase !== "gape-off" && next.phase !== "lean-off" && next.phase !== "unfurl-off" && next.phase !== "gold-off" && next.phase !== "seed-off" && next.phase !== "open-off") {
      return abortToFloor(next, { x: next.x, lift: next.lift }, work);
    }

    const target = next.target;
    if (next.phase === "approach") {
      const dest = target.approachX;
      const dir = dest >= next.x ? 1 : -1;
      next.facing = dir;
      next.anim = "walk";
      const pace = target.kind === BASK ? WALK_PX * 0.4 : target.kind === BOW ? WALK_PX * 0.62 : target.kind === BALL ? WALK_PX * 0.46 : target.kind === DUST ? WALK_PX * 0.92 : target.kind === WALL ? WALK_PX * 0.36 : target.kind === TOSS ? WALK_PX * 0.84 : target.kind === FLATTEN ? WALK_PX * 0.28 : target.kind === DRAPE ? WALK_PX * 0.34 : target.kind === KINDLE ? WALK_PX * 0.38 : target.kind === BUN ? WALK_PX * 0.31 : target.kind === WRITE ? WALK_PX * 0.58 : target.kind === INSPECT ? WALK_PX * 0.51 : target.kind === SADDLE ? WALK_PX * 0.29 : target.kind === FLIP ? WALK_PX * 0.44 : target.kind === PATROL ? WALK_PX * 0.76 : target.kind === LOOP ? WALK_PX * 0.22 : target.kind === MOSAIC ? WALK_PX * 0.54 : target.kind === STONE ? WALK_PX * 0.17 : target.kind === CHART ? WALK_PX * 0.33 : target.kind === LID ? WALK_PX * 0.26 : target.kind === FLUSH ? WALK_PX * 0.23 : target.kind === RISE ? WALK_PX * 0.18 : target.kind === CHIME ? WALK_PX * 0.16 : target.kind === REEF ? WALK_PX * 0.13 : target.kind === KNOB ? WALK_PX * 0.38 : target.kind === PLOW ? WALK_PX * 0.11 : target.kind === HITCH ? WALK_PX * 0.19 : target.kind === BARREL ? WALK_PX * 0.14 : target.kind === LEAN ? WALK_PX * 0.09 : target.kind === UNFURL ? WALK_PX * 0.15 : target.kind === GOLD ? WALK_PX * 0.12 : target.kind === SEED ? WALK_PX * 0.16 : target.kind === OPEN ? WALK_PX * 0.11 : WALK_PX;
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
        if (target.kind === BUN) {
          return goPhase(next, "bun-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRITE) {
          return goPhase(next, "write-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === INSPECT) {
          return goPhase(next, "inspect-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === SADDLE) {
          return goPhase(next, "saddle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === FLIP) {
          return goPhase(next, "flip-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === PATROL) {
          return goPhase(next, "patrol-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === LOOP) {
          return goPhase(next, "loop-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === MOSAIC) {
          return goPhase(next, "mosaic-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === STONE) {
          return goPhase(next, "stone-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === CHART) {
          return goPhase(next, "chart-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === LID) {
          return goPhase(next, "lid-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === FLUSH) {
          return goPhase(next, "flush-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === RISE) {
          return goPhase(next, "rise-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === CHIME) {
          return goPhase(next, "chime-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === REEF) {
          return goPhase(next, "reef-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === KNOB) {
          return goPhase(next, "knob-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === PLOW) {
          return goPhase(next, "plow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === HITCH) {
          return goPhase(next, "hitch-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === BARREL) {
          return goPhase(next, "barrel-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === GAPE) {
          return goPhase(next, "gape-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
        }
        if (target.kind === LEAN) {
          return goPhase(next, "lean-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === UNFURL) {
          return goPhase(next, "unfurl-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === GOLD) {
          return goPhase(next, "gold-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === SEED) {
          return goPhase(next, "seed-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === OPEN) {
          return goPhase(next, "open-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
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
        const banked = goPhase(next, "kindle-coal", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
        const coal = kindleCoalPath(0);
        banked.x = target.holdX;
        banked.lift = target.holdLift + coal.lift;
        banked.rot = coal.rot;
        return banked;
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

    if (next.phase === "bun-on") {
      const face = bunFace(target);
      const u = next.t / DUR.bunOn;
      const pose = bunOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        const tucked = goPhase(next, "bun-tuck", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
        const start = bunTuckPath(0);
        tucked.x = target.holdX;
        tucked.lift = target.holdLift + start.lift;
        tucked.rot = start.rot;
        return tucked;
      }
      return next;
    }

    if (next.phase === "bun-tuck") {
      const face = bunFace(target);
      const pose = bunTuckPath(Math.min(1, next.t / DUR.bunTuck));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.bunTuck) {
        const held = goPhase(next, "bun", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
        held.lift = target.holdLift - 16;
        held.rot = 42;
        return held;
      }
      return next;
    }

    if (next.phase === "bun") {
      const face = bunFace(target);
      next.x = target.holdX;
      next.lift = target.holdLift - 16;
      next.rot = 42;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.bun) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "bun-off", { x: target.holdX, lift: next.lift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "bun-off") {
      const u = next.t / DUR.bunOff;
      const pose = bunOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "write-on") {
      const face = writeFace(target);
      const u = next.t / DUR.writeOn;
      const pose = writeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "write", { x: target.holdX, lift: target.holdLift }, { x: target.writeEndX != null ? target.writeEndX : target.holdX, lift: target.writeEndLift != null ? target.writeEndLift : target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "write") {
      const goingRight = (target.writeEndX != null ? target.writeEndX : target.holdX) >= target.holdX;
      const start = writePoint(win, goingRight ? 0 : 1, size, work);
      const end = writePoint(win, goingRight ? 1 : 0, size, work);
      const u = next.t / DUR.write;
      const pose = writePath(Math.min(1, u), start, end);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = goingRight ? 1 : -1;
      if (u >= 1) {
        const endX = target.writeEndX != null ? target.writeEndX : end.x;
        const endLift = target.writeEndLift != null ? target.writeEndLift : end.lift;
        const leaveFace = target.landX >= endX ? 1 : -1;
        return goPhase(next, "write-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "write-off") {
      const u = next.t / DUR.writeOff;
      const pose = writeOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= (target.writeEndX != null ? target.writeEndX : target.holdX) ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "inspect-on") {
      const face = inspectFace(target);
      const u = next.t / DUR.inspectOn;
      const pose = inspectOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "inspect", { x: target.holdX, lift: target.holdLift }, { x: target.inspectEndX != null ? target.inspectEndX : target.holdX, lift: target.inspectEndLift != null ? target.inspectEndLift : target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "inspect") {
      const edge = inspectEdge(target, win, size);
      const start = inspectPoint(win, edge, 0, size, work);
      const end = inspectPoint(win, edge, 1, size, work);
      const u = next.t / DUR.inspect;
      const pose = inspectPath(Math.min(1, u), start, end);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = inspectFace(target);
      if (u >= 1) {
        const endX = target.inspectEndX != null ? target.inspectEndX : end.x;
        const endLift = target.inspectEndLift != null ? target.inspectEndLift : end.lift;
        const leaveFace = target.landX >= endX ? 1 : -1;
        return goPhase(next, "inspect-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "inspect-off") {
      const u = next.t / DUR.inspectOff;
      const pose = inspectOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = inspectFace(target);
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "saddle-on") {
      const face = saddleFace(target, win, size);
      const u = next.t / DUR.saddleOn;
      const pose = saddleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "saddle-fold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "saddle-fold") {
      const face = saddleFace(target, win, size);
      const pose = saddleFoldPath(Math.min(1, next.t / DUR.saddleFold));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.saddleFold) {
        const held = goPhase(next, "saddle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
        const folded = saddleFoldPath(1);
        held.x = target.holdX;
        held.lift = target.holdLift + folded.lift;
        held.rot = folded.rot;
        return held;
      }
      return next;
    }

    if (next.phase === "saddle") {
      const face = saddleFace(target, win, size);
      const folded = saddleFoldPath(1);
      next.x = target.holdX;
      next.lift = target.holdLift + folded.lift;
      next.rot = folded.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.saddle) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "saddle-off", { x: target.holdX, lift: target.holdLift + folded.lift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "saddle-off") {
      const u = next.t / DUR.saddleOff;
      const pose = saddleOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "flip-on") {
      const face = flipFace(target);
      const u = next.t / DUR.flipOn;
      const pose = flipOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "flip-roll", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "flip-roll") {
      const face = flipFace(target);
      const pose = flipRollPath(Math.min(1, next.t / DUR.flipRoll));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.flipRoll) {
        const held = goPhase(next, "flip", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
        const dead = flipRollPath(1);
        held.x = target.holdX;
        held.lift = target.holdLift + dead.lift;
        held.rot = dead.rot;
        return held;
      }
      return next;
    }

    if (next.phase === "flip") {
      const face = flipFace(target);
      const dead = flipRollPath(1);
      next.x = target.holdX;
      next.lift = target.holdLift + dead.lift;
      next.rot = dead.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.flip) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "flip-off", { x: target.holdX, lift: target.holdLift + dead.lift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "flip-off") {
      const u = next.t / DUR.flipOff;
      const pose = flipOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "patrol-on") {
      const face = patrolFace(target);
      const u = next.t / DUR.patrolOn;
      const pose = patrolOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "patrol", { x: target.holdX, lift: target.holdLift }, { x: target.patrolEndX != null ? target.patrolEndX : target.holdX, lift: target.patrolEndLift != null ? target.patrolEndLift : target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "patrol") {
      const goingRight = (target.patrolEndX != null ? target.patrolEndX : target.holdX) >= target.holdX;
      const start = patrolPoint(win, goingRight ? 0 : 1, size, work);
      const end = patrolPoint(win, goingRight ? 1 : 0, size, work);
      const u = next.t / DUR.patrol;
      const pose = patrolPath(Math.min(1, u), start, end);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = goingRight ? 1 : -1;
      if (u >= 1) {
        const endX = target.patrolEndX != null ? target.patrolEndX : end.x;
        const endLift = target.patrolEndLift != null ? target.patrolEndLift : end.lift;
        const leaveFace = target.landX >= endX ? 1 : -1;
        return goPhase(next, "patrol-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "patrol-off") {
      const u = next.t / DUR.patrolOff;
      const pose = patrolOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= (target.patrolEndX != null ? target.patrolEndX : target.holdX) ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "loop-on") {
      const face = loopFace(target, win, size);
      const u = next.t / DUR.loopOn;
      const pose = loopOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "loop-settle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "loop-settle") {
      const face = loopFace(target, win, size);
      const pose = loopSettlePath(Math.min(1, next.t / DUR.loopSettle));
      next.x = target.holdX + pose.x;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.loopSettle) {
        const held = goPhase(next, "loop", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
        const settled = loopSettlePath(1);
        held.x = target.holdX + settled.x;
        held.lift = target.holdLift + settled.lift;
        held.rot = settled.rot;
        return held;
      }
      return next;
    }

    if (next.phase === "loop") {
      const face = loopFace(target, win, size);
      const settled = loopSettlePath(1);
      next.x = target.holdX + settled.x;
      next.lift = target.holdLift + settled.lift;
      next.rot = settled.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.loop) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "loop-off", { x: target.holdX + settled.x, lift: target.holdLift + settled.lift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "loop-off") {
      const u = next.t / DUR.loopOff;
      const pose = loopOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "mosaic-on") {
      const face = mosaicFace(target, win, size);
      const u = next.t / DUR.mosaicOn;
      const pose = mosaicOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "mosaic-flash", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "mosaic-flash") {
      const face = mosaicFace(target, win, size);
      const pose = mosaicFlashPath(Math.min(1, next.t / DUR.mosaicFlash));
      next.x = target.holdX + pose.x;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.mosaicFlash) {
        return goPhase(next, "mosaic", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "mosaic") {
      const face = mosaicFace(target, win, size);
      next.x = target.holdX;
      next.lift = target.holdLift;
      next.rot = 0;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.mosaic) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "mosaic-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "mosaic-off") {
      const u = next.t / DUR.mosaicOff;
      const pose = mosaicOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "stone-on") {
      const face = stoneFace(target, win, size);
      const u = next.t / DUR.stoneOn;
      const pose = stoneOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "stone-tuck", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "stone-tuck") {
      const face = stoneFace(target, win, size);
      const pose = stoneTuckPath(Math.min(1, next.t / DUR.stoneTuck));
      next.x = target.holdX;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.stoneTuck) {
        const held = goPhase(next, "stone", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
        held.x = target.holdX;
        held.lift = target.holdLift - 12;
        held.rot = 14;
        return held;
      }
      return next;
    }

    if (next.phase === "stone") {
      const face = stoneFace(target, win, size);
      next.x = target.holdX;
      next.lift = target.holdLift - 12;
      next.rot = 14;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.stone) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "stone-off", { x: target.holdX, lift: target.holdLift - 12 }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "stone-off") {
      const u = next.t / DUR.stoneOff;
      const pose = stoneOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "chart-on") {
      const face = chartFace(target);
      const u = next.t / DUR.chartOn;
      const pose = chartOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        const endX = target.chartEndX != null ? target.chartEndX : target.holdX;
        const endLift = target.chartEndLift != null ? target.chartEndLift : target.holdLift;
        return goPhase(next, "chart-unroll", { x: target.holdX, lift: target.holdLift }, { x: endX, lift: endLift }, "walk", face);
      }
      return next;
    }

    if (next.phase === "chart-unroll") {
      const face = chartFace(target);
      const endX = target.chartEndX != null ? target.chartEndX : target.holdX;
      const endLift = target.chartEndLift != null ? target.chartEndLift : target.holdLift;
      const u = next.t / DUR.chartUnroll;
      const pose = chartUnrollPath(Math.min(1, u), next.from, { x: endX, lift: endLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        const held = goPhase(next, "chart", { x: endX, lift: endLift }, { x: endX, lift: endLift }, "sit", face);
        held.x = endX;
        held.lift = endLift;
        held.rot = face * 8;
        return held;
      }
      return next;
    }

    if (next.phase === "chart") {
      const face = chartFace(target);
      const endX = target.chartEndX != null ? target.chartEndX : target.holdX;
      const endLift = target.chartEndLift != null ? target.chartEndLift : target.holdLift;
      next.x = endX;
      next.lift = endLift;
      next.rot = face * 8;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.chart) {
        const leaveFace = target.landX >= endX ? 1 : -1;
        return goPhase(next, "chart-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "chart-off") {
      const u = next.t / DUR.chartOff;
      const pose = chartOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      const endX = target.chartEndX != null ? target.chartEndX : target.holdX;
      next.facing = target.landX >= endX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "lid-on") {
      const face = lidFace(target, win, size);
      const u = next.t / DUR.lidOn;
      const pose = lidOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = u < 0.52 ? "walk" : "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "lid-probe", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "lid-probe") {
      const face = lidFace(target, win, size);
      const pose = lidProbePath(Math.min(1, next.t / DUR.lidProbe));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.lidProbe) {
        const held = goPhase(next, "lid", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
        held.x = target.holdX;
        held.lift = target.holdLift - 10;
        held.rot = face * 11;
        return held;
      }
      return next;
    }

    if (next.phase === "lid") {
      const face = lidFace(target, win, size);
      next.x = target.holdX;
      next.lift = target.holdLift - 10;
      next.rot = face * 11;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.lid) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "lid-off", { x: target.holdX, lift: target.holdLift - 10 }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "lid-off") {
      const u = next.t / DUR.lidOff;
      const pose = lidOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "flush-on") {
      const face = flushFace(target);
      const u = next.t / DUR.flushOn;
      const pose = flushOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = u < 0.55 ? "walk" : "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "flush", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "flush") {
      const face = flushFace(target);
      const pose = flushPath(Math.min(1, next.t / DUR.flush));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.flush) {
        const endX = target.flushEndX != null ? target.flushEndX : target.holdX;
        const endLift = target.flushEndLift != null ? target.flushEndLift : target.holdLift;
        return goPhase(next, "flush-hover", { x: target.holdX, lift: target.holdLift }, { x: endX, lift: endLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "flush-hover") {
      const face = flushFace(target);
      const endX = target.flushEndX != null ? target.flushEndX : target.holdX;
      const endLift = target.flushEndLift != null ? target.flushEndLift : target.holdLift;
      const u = next.t / DUR.flushHover;
      const pose = win
        ? flushPoint(win, Math.min(1, u), size, work)
        : flushHoverPath(Math.min(1, u), next.from, { x: endX, lift: endLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = win ? flushHoverPath(Math.min(1, u), { x: target.holdX, lift: target.holdLift }, { x: endX, lift: endLift }).rot : pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        const leaveFace = target.landX >= endX ? 1 : -1;
        return goPhase(next, "flush-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "flush-off") {
      const u = next.t / DUR.flushOff;
      const pose = flushOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      const endX = target.flushEndX != null ? target.flushEndX : target.holdX;
      next.facing = target.landX >= endX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "rise-on") {
      const face = riseFace(target);
      const u = next.t / DUR.riseOn;
      const pose = riseOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        const endX = target.riseEndX != null ? target.riseEndX : target.holdX;
        const endLift = target.riseEndLift != null ? target.riseEndLift : target.holdLift;
        return goPhase(next, "rise", { x: target.holdX, lift: target.holdLift }, { x: endX, lift: endLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "rise") {
      const face = riseFace(target);
      const endX = target.riseEndX != null ? target.riseEndX : target.holdX;
      const endLift = target.riseEndLift != null ? target.riseEndLift : target.holdLift;
      const u = next.t / DUR.rise;
      const pose = risePath(Math.min(1, u), next.from, { x: endX, lift: endLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.rise) {
        const held = goPhase(next, "rise-hold", { x: endX, lift: endLift }, { x: endX, lift: endLift }, "sit", face);
        held.x = endX;
        held.lift = endLift;
        held.rot = 0;
        return held;
      }
      return next;
    }

    if (next.phase === "rise-hold") {
      const face = riseFace(target);
      const endX = target.riseEndX != null ? target.riseEndX : target.holdX;
      const endLift = target.riseEndLift != null ? target.riseEndLift : target.holdLift;
      const pose = riseHoldPath(Math.min(1, next.t / DUR.riseHold));
      next.x = endX + pose.x;
      next.lift = endLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.riseHold) {
        const leaveFace = target.landX >= endX ? 1 : -1;
        return goPhase(next, "rise-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "rise-off") {
      const u = next.t / DUR.riseOff;
      const pose = riseOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      const endX = target.riseEndX != null ? target.riseEndX : target.holdX;
      next.facing = target.landX >= endX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "chime-on") {
      const face = chimeFace(target);
      const u = next.t / DUR.chimeOn;
      const pose = chimeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "chime", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "chime") {
      const face = chimeFace(target);
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const u = next.t / DUR.chime;
      const top = chimePoint(win, 0, size, work);
      const bottom = chimePoint(win, 1, size, work);
      const left = chimePoint(win, 2, size, work);
      const right = chimePoint(win, 3, size, work);
      const pose = chimePath(Math.min(1, u), top, bottom, left, right);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.chime) {
        const center = chimeCenter(win, size, work);
        return goPhase(next, "chime-pulse", { x: right.x, lift: right.lift }, { x: center.x, lift: center.lift }, "play", face);
      }
      return next;
    }

    if (next.phase === "chime-pulse") {
      const face = chimeFace(target);
      const u = next.t / DUR.chimePulse;
      const pose = chimePulsePath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.chimePulse) {
        const leaveFace = target.landX >= next.to.x ? 1 : -1;
        return goPhase(next, "chime-off", { x: next.to.x, lift: next.to.lift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "chime-off") {
      const u = next.t / DUR.chimeOff;
      const pose = chimeOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= next.from.x ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "reef-on") {
      const face = reefFace(target);
      const u = next.t / DUR.reefOn;
      const pose = reefOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "reef", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "reef") {
      const face = reefFace(target);
      if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
      const u = next.t / DUR.reef;
      const blot = reefPoint(win, size, work);
      const arms = [0, 1, 2, 3, 4].map((arm) => reefArm(win, arm, size, work));
      const pose = reefPath(Math.min(1, u), blot, arms);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.reef) {
        return goPhase(next, "reef-hold", { x: blot.x, lift: blot.lift }, { x: blot.x, lift: blot.lift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "reef-hold") {
      const face = reefFace(target);
      const u = next.t / DUR.reefHold;
      const pose = reefHoldPath(Math.min(1, u), next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.reefHold) {
        const leaveFace = target.landX >= next.to.x ? 1 : -1;
        return goPhase(next, "reef-off", { x: next.to.x, lift: next.to.lift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "reef-off") {
      const u = next.t / DUR.reefOff;
      const pose = reefOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= next.from.x ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "knob-on") {
      const face = knobFace(target);
      const u = next.t / DUR.knobOn;
      const pose = knobOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "knob-measure", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "knob-measure") {
      const face = knobFace(target);
      const pose = knobMeasurePath(Math.min(1, next.t / DUR.knobMeasure));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.knobMeasure) {
        return goPhase(next, "knob", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "knob") {
      const face = knobFace(target);
      const pose = knobPath(Math.min(1, next.t / DUR.knob));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = next.t / DUR.knob < 0.58 ? "sit" : "play";
      next.facing = face;
      if (next.t >= DUR.knob) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "knob-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "knob-off") {
      const u = next.t / DUR.knobOff;
      const pose = knobOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "plow-on") {
      const face = plowFace(target);
      const u = next.t / DUR.plowOn;
      const pose = plowOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "plow-read", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "plow-read") {
      const face = plowFace(target);
      const pose = plowReadPath(Math.min(1, next.t / DUR.plowRead));
      next.x = target.holdX + pose.x;
      next.lift = target.holdLift + pose.lift;
      next.anim = "play";
      next.rot = pose.rot;
      next.facing = face;
      if (next.t >= DUR.plowRead) {
        return goPhase(next, "plow", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "plow") {
      const face = plowFace(target);
      const pose = plowPath(Math.min(1, next.t / DUR.plow));
      next.x = target.holdX + pose.x;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.plow) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "plow-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "plow-off") {
      const u = next.t / DUR.plowOff;
      const pose = plowOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "hitch-on") {
      const face = hitchFace(target);
      const u = next.t / DUR.hitchOn;
      const pose = hitchOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "hitch-wrap", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "hitch-wrap") {
      const face = hitchFace(target);
      const pose = hitchWrapPath(Math.min(1, next.t / DUR.hitchWrap));
      next.x = target.holdX + pose.x;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.hitchWrap) {
        return goPhase(next, "hitch", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "hitch") {
      const face = hitchFace(target);
      const pose = hitchPath(Math.min(1, next.t / DUR.hitch));
      next.x = target.holdX + pose.x;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.hitch) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "hitch-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "hitch-off") {
      const u = next.t / DUR.hitchOff;
      const pose = hitchOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "barrel-on") {
      const face = barrelFace(target);
      const u = next.t / DUR.barrelOn;
      const pose = barrelOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        const endX = target.barrelEndX != null ? target.barrelEndX : target.holdX;
        const endLift = target.barrelEndLift != null ? target.barrelEndLift : target.holdLift;
        return goPhase(next, "barrel-span", { x: target.holdX, lift: target.holdLift }, { x: endX, lift: endLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "barrel-span") {
      const face = barrelFace(target);
      const endX = target.barrelEndX != null ? target.barrelEndX : target.holdX;
      const endLift = target.barrelEndLift != null ? target.barrelEndLift : target.holdLift;
      const u = next.t / DUR.barrelSpan;
      const pose = barrelSpanPath(Math.min(1, u), { x: target.holdX, lift: target.holdLift }, { x: endX, lift: endLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.barrelSpan) {
        return goPhase(next, "barrel", { x: endX, lift: endLift }, { x: endX, lift: endLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "barrel") {
      const face = barrelFace(target);
      const endX = target.barrelEndX != null ? target.barrelEndX : target.holdX;
      const endLift = target.barrelEndLift != null ? target.barrelEndLift : target.holdLift;
      const pose = barrelPath(Math.min(1, next.t / DUR.barrel));
      next.x = endX + pose.x * face;
      next.lift = endLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.barrel) {
        const leaveFace = target.landX >= endX ? 1 : -1;
        const done = barrelPath(1);
        return goPhase(next, "barrel-off", { x: endX + done.x * face, lift: endLift + done.lift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "barrel-off") {
      const u = next.t / DUR.barrelOff;
      const pose = barrelOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= (target.barrelEndX != null ? target.barrelEndX : target.holdX) ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "gape-on") {
      const face = gapeFace(target);
      const u = next.t / DUR.gapeOn;
      const pose = gapeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "gape", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "gape") {
      const face = gapeFace(target);
      const pose = gapePath(Math.min(1, next.t / DUR.gape));
      next.x = target.holdX + pose.x;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.gape) {
        const dartX = target.gapeDartX != null ? target.gapeDartX : target.holdX;
        const dartLift = target.gapeDartLift != null ? target.gapeDartLift : target.holdLift;
        return goPhase(next, "gape-dart", { x: target.holdX, lift: target.holdLift }, { x: dartX, lift: dartLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "gape-dart") {
      const face = gapeFace(target);
      const dartX = target.gapeDartX != null ? target.gapeDartX : target.holdX;
      const dartLift = target.gapeDartLift != null ? target.gapeDartLift : target.holdLift;
      const u = next.t / DUR.gapeDart;
      const pose = gapeDartPath(Math.min(1, u), { x: target.holdX, lift: target.holdLift }, { x: dartX, lift: dartLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = face;
      if (u >= 1) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        return goPhase(next, "gape-off", { x: target.holdX, lift: target.holdLift }, { x: target.landX, lift: 0 }, "play", leaveFace);
      }
      return next;
    }

    if (next.phase === "gape-off") {
      const u = next.t / DUR.gapeOff;
      const pose = gapeOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "lean-on") {
      const face = leanFace(target);
      const u = next.t / DUR.leanOn;
      const pose = leanOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "lean", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "lean") {
      const face = leanFace(target);
      const pose = leanPath(Math.min(1, next.t / DUR.lean));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.lean) {
        return goPhase(next, "lean-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "lean-hold") {
      const face = leanFace(target);
      const pose = leanHoldPath(Math.min(1, next.t / DUR.leanHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.leanHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = leanHoldPath(1);
        return goPhase(next, "lean-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "lean-off") {
      const u = next.t / DUR.leanOff;
      const pose = leanOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "unfurl-on") {
      const face = unfurlFace(target);
      const u = next.t / DUR.unfurlOn;
      const pose = unfurlOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "unfurl", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "unfurl") {
      const face = unfurlFace(target);
      const pose = unfurlPath(Math.min(1, next.t / DUR.unfurl));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.unfurl) {
        return goPhase(next, "unfurl-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "unfurl-hold") {
      const face = unfurlFace(target);
      const pose = unfurlHoldPath(Math.min(1, next.t / DUR.unfurlHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.unfurlHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = unfurlHoldPath(1);
        return goPhase(next, "unfurl-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "unfurl-off") {
      const u = next.t / DUR.unfurlOff;
      const pose = unfurlOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "gold-on") {
      const face = goldFace(target);
      const u = next.t / DUR.goldOn;
      const pose = goldOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "gold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "gold") {
      const face = goldFace(target);
      const pose = goldPath(Math.min(1, next.t / DUR.gold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.gold) {
        return goPhase(next, "gold-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "gold-hold") {
      const face = goldFace(target);
      const pose = goldHoldPath(Math.min(1, next.t / DUR.goldHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.goldHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = goldHoldPath(1);
        return goPhase(next, "gold-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "gold-off") {
      const u = next.t / DUR.goldOff;
      const pose = goldOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "seed-on") {
      const face = seedFace(target);
      const u = next.t / DUR.seedOn;
      const pose = seedOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "seed", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "seed") {
      const face = seedFace(target);
      const pose = seedPath(Math.min(1, next.t / DUR.seed));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.seed) {
        return goPhase(next, "seed-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "seed-hold") {
      const face = seedFace(target);
      const pose = seedHoldPath(Math.min(1, next.t / DUR.seedHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.seedHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = seedHoldPath(1);
        return goPhase(next, "seed-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "seed-off") {
      const u = next.t / DUR.seedOff;
      const pose = seedOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "open-on") {
      const face = openFace(target);
      const u = next.t / DUR.openOn;
      const pose = openOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "open", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "open") {
      const face = openFace(target);
      const pose = openPath(Math.min(1, next.t / DUR.open));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.open) {
        return goPhase(next, "open-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "open-hold") {
      const face = openFace(target);
      const pose = openHoldPath(Math.min(1, next.t / DUR.openHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.openHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = openHoldPath(1);
        return goPhase(next, "open-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "open-off") {
      const u = next.t / DUR.openOff;
      const pose = openOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
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
    BUN,
    WRITE,
    INSPECT,
    SADDLE,
    FLIP,
    PATROL,
    LOOP,
    MOSAIC,
    STONE,
    CHART,
    LID,
    FLUSH,
    RISE,
    CHIME,
    REEF,
    KNOB,
    PLOW,
    HITCH,
    BARREL,
    UNFURL,
    GOLD,
    SEED,
    OPEN,
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
    bunPoint,
    bunFace,
    bunOnPath,
    bunTuckPath,
    bunOffPath,
    writePoint,
    writeFace,
    writeOnPath,
    writePath,
    writeOffPath,
    inspectEdge,
    inspectPoint,
    inspectFace,
    inspectOnPath,
    inspectPath,
    inspectOffPath,
    saddleEdge,
    saddlePoint,
    saddleFace,
    saddleOnPath,
    saddleFoldPath,
    saddleOffPath,
    flipPoint,
    flipFace,
    flipOnPath,
    flipRollPath,
    flipOffPath,
    patrolPoint,
    patrolFace,
    patrolOnPath,
    patrolPath,
    patrolOffPath,
    loopPoint,
    loopFace,
    loopOnPath,
    loopSettlePath,
    loopOffPath,
    mosaicPoint,
    mosaicFace,
    mosaicOnPath,
    mosaicFlashPath,
    mosaicOffPath,
    stoneEdge,
    stonePoint,
    stoneFace,
    stoneOnPath,
    stoneTuckPath,
    stoneOffPath,
    chartPoint,
    chartFace,
    chartOnPath,
    chartUnrollPath,
    chartOffPath,
    lidPoint,
    lidFace,
    lidOnPath,
    lidProbePath,
    lidOffPath,
    flushPoint,
    flushFace,
    flushOnPath,
    flushPath,
    flushHoverPath,
    flushOffPath,
    riseEdgeName,
    risePoint,
    riseFace,
    riseOnPath,
    risePath,
    riseHoldPath,
    riseOffPath,
    chimeCenter,
    chimePoint,
    chimeFace,
    chimeOnPath,
    chimePath,
    chimePulsePath,
    chimeOffPath,
    reefPoint,
    reefArm,
    reefFace,
    reefOnPath,
    reefPath,
    reefHoldPath,
    reefOffPath,
    knobPoint,
    knobFace,
    knobOnPath,
    knobMeasurePath,
    knobPath,
    knobOffPath,
    plowPoint,
    plowFace,
    plowOnPath,
    plowReadPath,
    plowPath,
    plowOffPath,
    hitchPoint,
    hitchFace,
    hitchOnPath,
    hitchWrapPath,
    hitchPath,
    hitchOffPath,
    barrelPoint,
    barrelFace,
    barrelOnPath,
    barrelSpanPath,
    barrelPath,
    barrelOffPath,
    gapeEdgeName,
    gapePoint,
    gapeDartPoint,
    gapeFace,
    gapeOnPath,
    gapePath,
    gapeDartPath,
    gapeOffPath,
    leanLampDir,
    leanPoint,
    leanFace,
    leanOnPath,
    leanPath,
    leanHoldPath,
    leanOffPath,
    unfurlEdgeName,
    unfurlPoint,
    unfurlFace,
    unfurlOnPath,
    unfurlPath,
    unfurlHoldPath,
    unfurlOffPath,
    goldLampDir,
    goldPoint,
    goldFace,
    goldOnPath,
    goldPath,
    goldHoldPath,
    goldOffPath,
    seedPoint,
    seedFace,
    seedOnPath,
    seedPath,
    seedHoldPath,
    seedOffPath,
    openLampDir,
    openPoint,
    openFace,
    openOnPath,
    openPath,
    openHoldPath,
    openOffPath,
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
