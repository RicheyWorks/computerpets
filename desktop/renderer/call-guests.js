/** Call any of the 221. Groups are the existing dens. No new taxa. Called guests draw on the shared sprite surface (ADR 0127). */
(function (root) {
  let surfaceLib = null;
  if (typeof module !== "undefined" && module.exports) surfaceLib = require("./sprite-surface.js");

  function surfaceApi() {
    if (surfaceLib) return surfaceLib;
    const scope = typeof globalThis !== "undefined" ? globalThis : {};
    return scope.PetSpriteSurface || null;
  }

  function calledBox() {
    const api = surfaceApi();
    const n = api && api.BOX && api.BOX.called;
    return typeof n === "number" && n > 0 ? n : GUEST_DEST;
  }

  const HOUSE_KEYS = [
    "red_panda",
    "cat",
    "dog",
    "rabbit",
    "hamster",
    "guinea_pig",
    "turtle",
    "goldfish",
    "budgie",
    "fox",
    "penguin",
    "parrot",
    "ferret",
    "hedgehog",
    "chinchilla",
    "axolotl",
    "toucan",
    "iguana",
    "dragon",
    "phoenix",
  ];
  const SNAKE_KEYS = ["ball_python", "corn_snake", "kingsnake", "green_tree_python", "hognose", "garter", "boa", "milk_snake", "rosy_boa", "carpet_python"];
  const SEA_KEYS = ["octopus", "cuttlefish", "nautilus", "moon_jelly", "sea_star", "hermit_crab", "horseshoe_crab", "seahorse", "manta", "moray"];
  const GARDEN_KEYS = ["moss", "maidenhair", "ginkgo", "oak", "water_lily", "orchid", "saguaro", "venus_flytrap", "pitcher", "sundew"];
  const INSECT_KEYS = ["honeybee", "monarch", "luna", "firefly", "darner", "stick", "carpenter_ant", "ladybird", "mantis", "cicada"];
  const BEE_KEYS = ["bumblebee", "carpenter_bee", "mason_bee", "leafcutter", "stingless", "sweat_bee", "mining_bee", "honey_drone", "honey_queen", "honeycomb"];
  const POND_KEYS = ["frog", "toad", "newt", "salamander", "caecilian", "crayfish", "pond_snail", "mussel", "leech", "stickleback"];
  const ROOST_KEYS = ["crow", "raven", "barn_owl", "red_tail", "chickadee", "robin", "mallard", "canada_goose", "pileated", "hummingbird"];
  const CORNER_KEYS = ["orb_weaver", "jumping_spider", "wolf_spider", "tarantula", "widow", "harvestman", "scorpion", "vinegaroon", "tick", "solifuge"];
  const WOOD_KEYS = ["deer", "bat", "squirrel", "otter", "raccoon", "skunk", "opossum", "beaver", "porcupine", "black_bear", "capybara"];
  const CANOPY_KEYS = ["sloth", "lemur", "gibbon", "kinkajou", "colugo", "flying_squirrel", "howler", "tarsier", "potto", "koala"];
  const STONE_KEYS = ["gecko", "anole", "skink", "chameleon", "horned_lizard", "alligator", "crocodile", "snapper", "box_turtle", "tuatara"];
  const CREEK_KEYS = ["bass", "brook_trout", "catfish", "bluegill", "perch", "pike", "walleye", "paddlefish", "lamprey", "american_eel"];
  const LOG_KEYS = ["house_centipede", "millipede", "pillbug", "earthworm", "velvet_worm", "springtail", "tardigrade", "planarian", "nematode", "amphipod"];
  const SHORE_KEYS = ["fiddler_crab", "ghost_crab", "limpet", "barnacle", "chiton", "periwinkle", "sand_dollar", "sea_urchin", "knobbed_whelk", "lugworm"];
  const REEF_KEYS = ["brain_coral", "anemone", "clownfish", "parrotfish", "cleaner_shrimp", "sea_cucumber", "lionfish", "giant_clam", "eagle_ray", "grouper"];
  const MEADOW_KEYS = ["field_cricket", "katydid", "grasshopper", "swallowtail", "jewelwing", "lacewing", "earwig", "acorn_weevil", "click_beetle", "robber_fly"];
  const FUNGI_KEYS = ["oyster", "fly_agaric", "morel", "chanterelle", "turkey_tail", "lions_mane", "puffball", "chicken_of_woods", "yeast", "lichen"];
  const WELL_KEYS = ["paramecium", "amoeba", "euglena", "volvox", "diatom", "kelp", "chlamydomonas", "stentor", "coli", "haloarchaea"];
  const FAR_KEYS = ["photovore", "choir", "nimbus", "silica", "terminator", "nexus", "halovore", "magneton", "umbral", "cyst"];
  const GRID_KEYS = ["cyber_dragon", "volt_dragon", "trace_dragon", "flux_dragon", "spark_dragon", "ion_dragon", "gauss_dragon", "relay_dragon", "fuse_dragon", "ground_dragon"];

  /** Same dens as the house rooms. Aliases are words the rooms already use. */
  const CALL_GROUPS = [
    { id: "house", label: "House", aliases: ["house", "study", "companions"], keys: HOUSE_KEYS },
    { id: "snakes", label: "Snakes", aliases: ["snakes", "snake", "den"], keys: SNAKE_KEYS },
    { id: "tide", label: "Tide", aliases: ["tide", "sea", "marine"], keys: SEA_KEYS },
    { id: "garden", label: "Garden", aliases: ["garden", "plant", "plants"], keys: GARDEN_KEYS },
    { id: "hive", label: "Hive", aliases: ["hive", "insect", "insects", "bee", "bees"], keys: INSECT_KEYS.concat(BEE_KEYS) },
    { id: "pond", label: "Pond", aliases: ["pond"], keys: POND_KEYS },
    { id: "roost", label: "Roost", aliases: ["roost", "bird", "birds"], keys: ROOST_KEYS },
    { id: "corner", label: "Corner", aliases: ["corner"], keys: CORNER_KEYS },
    { id: "wood", label: "Wood", aliases: ["wood"], keys: WOOD_KEYS },
    { id: "canopy", label: "Canopy", aliases: ["canopy"], keys: CANOPY_KEYS },
    { id: "stone", label: "Stone", aliases: ["stone"], keys: STONE_KEYS },
    { id: "creek", label: "Creek", aliases: ["creek"], keys: CREEK_KEYS },
    { id: "log", label: "Log", aliases: ["log"], keys: LOG_KEYS },
    { id: "shore", label: "Shore", aliases: ["shore"], keys: SHORE_KEYS },
    { id: "reef", label: "Reef", aliases: ["reef"], keys: REEF_KEYS },
    { id: "meadow", label: "Meadow", aliases: ["meadow"], keys: MEADOW_KEYS },
    { id: "cellar", label: "Cellar", aliases: ["cellar", "fungi", "fungus"], keys: FUNGI_KEYS },
    { id: "well", label: "Well", aliases: ["well"], keys: WELL_KEYS },
    { id: "far", label: "Far", aliases: ["far", "far den"], keys: FAR_KEYS },
    { id: "grid", label: "Grid", aliases: ["grid"], keys: GRID_KEYS },
  ];

  const FLY_BIRD_KEY = "hummingbird";
  const PERCH_BIRD_KEY = "robin";
  const PERCH_HOST = "red_panda";
  const ROBIN_SONG = "I sang. The worm can wait.";
  const SONG_EVERY_S = 8;
  const PERCH_ON_S = 0.72;
  const SHOULDER_X = 36;
  const SHOULDER_LIFT = 36;
  const MIN_STAY_S = 24;
  const CALL_EMPTY = "no guest from that look-up";
  const MEET_DEE_KEY = "chickadee";
  const MEET_CAT_KEY = "cat";
  const MEET_HOST = "red_panda";
  const PEER_ROBIN_KEY = "robin";
  const WINDOW_SIT_KEY = "cat";
  const DEE_RUI_LINE = "Dee-dee. I saw the red one.";
  const DEE_ROBIN_LINE = "Dee. You found the lawn first.";
  const CAT_RUI_LINE = "I sat. You were already here.";
  const CAT_SILL_LINE = "The sill will do.";
  const GRASS_LIE_KEY = "cat";
  const CAT_GRASS_LINE = "The moss will do.";
  const GRASS_STAY_S = 4.8;
  const MEET_DOG_KEY = "dog";
  const MEET_CROW_KEY = "crow";
  const PEER_PIP_KEY = "dog";
  const WINDOW_CAP_KEY = "crow";
  const PIP_RUI_LINE = "I walked over. You were the red one.";
  const SOOT_RUI_LINE = "Caw. I found the red one.";
  const SOOT_CAP_LINE = "The cap will do.";
  const CAT_PIP_LINE = "I sat. You were already walking.";
  const MEET_RABBIT_KEY = "rabbit";
  const MEET_RAVEN_KEY = "raven";
  const WINDOW_TRANSOM_KEY = "raven";
  const THIMBLE_RUI_LINE = "I thumped. You were the red one.";
  const THIMBLE_PIP_LINE = "I thumped. You were already walking.";
  const WEDGE_RUI_LINE = "I croaked. You were the red one.";
  const WEDGE_TRANSOM_LINE = "The transom will do.";
  const CROW_HOP = 16;
  const CROW_LIFT = 16;
  const RAVEN_HOP = 22;
  const RAVEN_LIFT = 20;
  const THUMP_HOP = 8;
  const MEET_ON_S = 0.64;
  const TELL_S = 1.6;
  const HOP_LIFT = 10;
  const BESIDE_X = 52;
  const NEAR_X = 44;

  function norm(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function groups() {
    return CALL_GROUPS.map((g) => ({ id: g.id, label: g.label, aliases: g.aliases.slice(), keys: g.keys.slice() }));
  }

  function groupById(id) {
    return CALL_GROUPS.find((g) => g.id === id) || null;
  }

  function matchGroup(query) {
    const q = norm(query);
    if (!q) return null;
    return (
      CALL_GROUPS.find((g) => g.id === q || norm(g.label) === q || g.aliases.some((a) => a === q)) || null
    );
  }

  function guestFields(row) {
    if (!row || typeof row !== "object") return null;
    const key = String(row.key || "");
    if (!key) return null;
    return {
      key,
      slug: String(row.slug || ""),
      name: String(row.name || ""),
      speciesLabel: String(row.speciesLabel || row.species || ""),
    };
  }

  function matchOneGuest(query, roster) {
    const q = norm(query);
    if (!q || !Array.isArray(roster)) return null;
    const rows = roster.map(guestFields).filter(Boolean);
    const exact = rows.find(
      (g) =>
        norm(g.key) === q ||
        norm(g.slug) === q ||
        norm(g.name) === q ||
        norm(g.speciesLabel) === q,
    );
    if (exact) return exact;
    const starts = rows.filter(
      (g) =>
        norm(g.name).startsWith(q) ||
        norm(g.slug).startsWith(q) ||
        norm(g.key).startsWith(q),
    );
    if (starts.length === 1) return starts[0];
    return null;
  }

  function matchCall(query, roster) {
    const q = norm(query);
    if (!q) return [];
    const group = matchGroup(q);
    if (group) return group.keys.slice();
    const one = matchOneGuest(q, roster);
    if (one) return [one.key];
    return [];
  }

  function callKeys(query, roster, groupId) {
    const fromQuery = matchCall(query, roster);
    if (fromQuery.length) return fromQuery;
    if (groupId) {
      const g = groupById(groupId);
      return g ? g.keys.slice() : [];
    }
    return [];
  }

  function walkersOf(keys, hostKey) {
    const list = Array.isArray(keys) ? keys.filter((k, i, all) => k && all.indexOf(k) === i) : [];
    return list.filter((k) => k !== hostKey && k !== FLY_BIRD_KEY && k !== PERCH_BIRD_KEY);
  }

  function shouldFly(keys, hostKey) {
    const list = Array.isArray(keys) ? keys : [];
    return list.indexOf(FLY_BIRD_KEY) >= 0 && hostKey !== FLY_BIRD_KEY;
  }

  function shouldRobinFly(keys, hostKey) {
    const list = Array.isArray(keys) ? keys : [];
    return list.indexOf(PERCH_BIRD_KEY) >= 0 && hostKey !== PERCH_BIRD_KEY;
  }

  const AUTO_MEET_KEYS = [MEET_DEE_KEY, MEET_CAT_KEY, MEET_DOG_KEY, MEET_CROW_KEY, MEET_RABBIT_KEY, MEET_RAVEN_KEY];

  function nextAutoMeet(present, hostKey) {
    const have = new Set((Array.isArray(present) ? present : []).map((row) => (typeof row === "string" ? row : row && row.key)).filter(Boolean));
    for (const key of AUTO_MEET_KEYS) {
      if (key !== hostKey && !have.has(key)) return key;
    }
    return null;
  }

  const GUEST_DEST = 128;

  function destFit(img) {
    if (!img) return false;
    if (img.style) {
      img.style.width = GUEST_DEST + "px";
      img.style.height = GUEST_DEST + "px";
      img.style.objectFit = "contain";
      img.style.objectPosition = "bottom";
      img.style.border = "0";
      img.style.outline = "none";
      img.style.background = "transparent";
      img.style.boxShadow = "none";
    }
    // Width and height attributes clear a canvas backing store. The sprite surface owns that bitmap.
    if (img.setAttribute && typeof img.getContext !== "function") {
      img.setAttribute("width", String(GUEST_DEST));
      img.setAttribute("height", String(GUEST_DEST));
    }
    return true;
  }

  function beginCalled(key, width, slot, of) {
    const w = Math.max(320, width || 800);
    const n = Math.max(1, of || 1);
    const dest = 48 + slot * Math.max(64, (w - 200) / n);
    return {
      key,
      phase: "in",
      t: 0,
      age: 0,
      x: w + 24,
      lift: 0,
      target: dest,
      facing: -1,
      dismissed: false,
      sungAt: 0,
    };
  }

  function dismissCalled(guest) {
    if (!guest) return guest;
    return { ...guest, phase: "leave", target: -160, dismissed: true, placed: false, lift: guest.lift || 0 };
  }

  const CLICK_PX = 8;

  function clickMoved(dx, dy, threshold) {
    const lim = threshold == null ? CLICK_PX : threshold;
    return Math.abs(dx || 0) > lim || Math.abs(dy || 0) > lim;
  }

  function placeCalled(guest, x, width) {
    if (!guest) return guest;
    const w = Math.max(320, width || 800);
    const dest = Math.max(8, Math.min(w - 80, x == null ? guest.x || 0 : x));
    return {
      ...guest,
      x: dest,
      target: dest,
      lift: 0,
      phase: "stay",
      t: 0,
      placed: true,
      fromX: undefined,
      fromLift: undefined,
      toX: undefined,
      toLift: undefined,
    };
  }

  function shouldPerchCalled(key, flags) {
    if (!flags || flags.hidden) return false;
    if (key !== PERCH_BIRD_KEY) return false;
    if (flags.hostKey && flags.hostKey !== PERCH_HOST) return false;
    return !!flags.hostSleeping;
  }

  function perchPoint(hostX, hostFacing, hostLift) {
    const face = hostFacing < 0 ? -1 : 1;
    return {
      x: (hostX || 0) + face * SHOULDER_X,
      lift: (hostLift || 0) + SHOULDER_LIFT,
    };
  }

  function goCalledPerch(guest, flags) {
    const hold = perchPoint(flags && flags.hostX, flags && flags.hostFacing, flags && flags.hostLift);
    return {
      ...guest,
      phase: "approach-perch",
      t: 0,
      target: hold.x,
      fromX: guest.x,
      fromLift: guest.lift || 0,
      toX: hold.x,
      toLift: hold.lift,
      facing: hold.x >= guest.x ? 1 : -1,
    };
  }

  function peerOf(flags, key) {
    const peers = flags && Array.isArray(flags.peers) ? flags.peers : [];
    for (const p of peers) {
      if (!p || p.key !== key) continue;
      if (p.phase === "gone" || p.phase === "leave") continue;
      return p;
    }
    return null;
  }

  function shouldMeetRui(key, flags) {
    if (!flags || flags.hidden) return false;
    if (key !== MEET_DEE_KEY && key !== MEET_CAT_KEY && key !== MEET_DOG_KEY && key !== MEET_CROW_KEY && key !== MEET_RABBIT_KEY && key !== MEET_RAVEN_KEY) return false;
    if (flags.hostKey && flags.hostKey !== MEET_HOST) return false;
    if (key === MEET_DEE_KEY && peerOf(flags, PEER_ROBIN_KEY)) return false;
    if (key === MEET_CAT_KEY && peerOf(flags, PEER_PIP_KEY)) return false;
    if (key === MEET_RABBIT_KEY && peerOf(flags, PEER_PIP_KEY)) return false;
    return true;
  }

  function shouldMeetPeer(key, flags) {
    if (!flags || flags.hidden) return false;
    if (key === MEET_DEE_KEY) return !!peerOf(flags, PEER_ROBIN_KEY);
    if (key === MEET_CAT_KEY) {
      if (peerOf(flags, PEER_ROBIN_KEY) && peerOf(flags, MEET_DEE_KEY)) return false;
      return !!peerOf(flags, PEER_PIP_KEY);
    }
    if (key === MEET_RABBIT_KEY) {
      if (peerOf(flags, MEET_CAT_KEY)) return false;
      return !!peerOf(flags, PEER_PIP_KEY);
    }
    return false;
  }

  function shouldSitGrass(key, flags) {
    if (!flags || flags.hidden) return false;
    if (key !== GRASS_LIE_KEY) return false;
    const b = flags.grassBound;
    return !!(b && Number.isFinite(b.x) && Number.isFinite(b.lift));
  }

  function shouldSitGrass(key, flags) {
    if (!flags || flags.hidden) return false;
    if (key !== GRASS_LIE_KEY) return false;
    const b = flags.grassBound;
    return !!(b && Number.isFinite(b.x) && Number.isFinite(b.lift));
  }

  function shouldSitBound(key, flags) {
    if (!flags || flags.hidden) return false;
    if (key === WINDOW_SIT_KEY) {
      const g = flags.grassBound;
      if (g && Number.isFinite(g.x) && Number.isFinite(g.lift)) return true;
      const b = flags.windowBound;
      return !!(b && Number.isFinite(b.x) && Number.isFinite(b.lift));
    }
    if (key === WINDOW_CAP_KEY) {
      const b = flags.capBound;
      return !!(b && Number.isFinite(b.x) && Number.isFinite(b.lift));
    }
    if (key === WINDOW_TRANSOM_KEY) {
      const b = flags.transomBound;
      return !!(b && Number.isFinite(b.x) && Number.isFinite(b.lift));
    }
    return false;
  }

  function meetPoint(flags, key) {
    const hostX = flags && flags.hostX != null ? flags.hostX : 0;
    const face = flags && flags.hostFacing < 0 ? -1 : 1;
    if (key === MEET_DEE_KEY) return { x: hostX + face * NEAR_X, lift: 8 };
    if (key === MEET_CROW_KEY) return { x: hostX + face * NEAR_X, lift: CROW_LIFT };
    if (key === MEET_RAVEN_KEY) return { x: hostX + face * NEAR_X, lift: RAVEN_LIFT };
    if (key === MEET_DOG_KEY) return { x: hostX + face * BESIDE_X, lift: 0 };
    if (key === MEET_RABBIT_KEY) return { x: hostX - face * BESIDE_X, lift: 0 };
    return { x: hostX - face * BESIDE_X, lift: 0 };
  }

  function peerPoint(flags, guestKey) {
    if (guestKey === MEET_CAT_KEY || guestKey === MEET_RABBIT_KEY) {
      const p = peerOf(flags, PEER_PIP_KEY);
      if (!p) return { x: 200, lift: 0 };
      return { x: (p.x || 0) + 48, lift: 0 };
    }
    const p = peerOf(flags, PEER_ROBIN_KEY);
    if (!p) return { x: 200, lift: 8 };
    return { x: (p.x || 0) + 36, lift: (p.lift || 0) + 8 };
  }

  function boundPoint(flags, key) {
    if (key === WINDOW_SIT_KEY || key === MEET_CAT_KEY || key === GRASS_LIE_KEY) {
      const g = flags && flags.grassBound;
      if (g && Number.isFinite(g.x) && Number.isFinite(g.lift)) return { x: g.x, lift: g.lift, kind: g.kind || "grass" };
    }
    if (key === WINDOW_TRANSOM_KEY || key === MEET_RAVEN_KEY) {
      const b = flags && flags.transomBound;
      if (!b) return { x: 120, lift: 72, kind: "transom" };
      return { x: b.x, lift: b.lift, kind: b.kind || "transom" };
    }
    if (key === WINDOW_CAP_KEY || key === MEET_CROW_KEY) {
      const b = flags && flags.capBound;
      if (!b) return { x: 120, lift: 48, kind: "drip-cap" };
      return { x: b.x, lift: b.lift, kind: b.kind || "drip-cap" };
    }
    const b = flags && flags.windowBound;
    if (!b) return { x: 120, lift: 18, kind: "sill" };
    return { x: b.x, lift: b.lift, kind: b.kind || "sill" };
  }

  function windowSitBound(win, work) {
    if (!win || typeof win !== "object") return null;
    const w = Number(win.width);
    const h = Number(win.height);
    if (!(w > 8) || !(h > 8)) return null;
    const workH = Math.max(240, (work && work.height) || 800);
    const floor = (work && work.floorLift) || 0;
    const x0 = Number(win.x);
    const y0 = Number(win.y);
    if (![x0, y0, w, h].every(Number.isFinite)) return null;
    const bottom = y0 + h;
    let lift = workH - bottom + 16;
    if (!Number.isFinite(lift)) return null;
    lift = Math.max(floor + 12, Math.min(workH * 0.42, lift));
    return { kind: "sill", x: x0 + w * 0.38, lift };
  }

  function firstWindowBound(windows, work) {
    const list = Array.isArray(windows) ? windows : [];
    for (const win of list) {
      const b = windowSitBound(win, work);
      if (b) return b;
    }
    return null;
  }

  function windowCapBound(win, work) {
    if (!win || typeof win !== "object") return null;
    const w = Number(win.width);
    const h = Number(win.height);
    if (!(w > 8) || !(h > 8)) return null;
    const workH = Math.max(240, (work && work.height) || 800);
    const workW = Math.max(320, (work && work.width) || 1400);
    const floor = (work && work.floorLift) || 0;
    const x0 = Number(win.x);
    const y0 = Number(win.y);
    if (![x0, y0, w, h].every(Number.isFinite)) return null;
    const cap = 22;
    const gripY = y0 - cap;
    let lift = workH - floor - gripY;
    if (!Number.isFinite(lift)) return null;
    lift = Math.max(floor + 36, Math.min(workH * 0.72, lift));
    const chimneyLeft = x0 + w / 2 < workW / 2;
    const x = chimneyLeft ? x0 + 10 : x0 + w - 10;
    return { kind: "drip-cap", x, lift };
  }

  function firstCapBound(windows, work) {
    const list = Array.isArray(windows) ? windows : [];
    for (const win of list) {
      const b = windowCapBound(win, work);
      if (b) return b;
    }
    return null;
  }

  function windowTransomBound(win, work) {
    if (!win || typeof win !== "object") return null;
    const w = Number(win.width);
    const h = Number(win.height);
    if (!(w > 8) || !(h > 8)) return null;
    const workH = Math.max(240, (work && work.height) || 800);
    const floor = (work && work.floorLift) || 0;
    const x0 = Number(win.x);
    const y0 = Number(win.y);
    if (![x0, y0, w, h].every(Number.isFinite)) return null;
    const rafter = 16;
    const gripY = y0 + rafter;
    let lift = workH - floor - gripY;
    if (!Number.isFinite(lift)) return null;
    lift = Math.max(floor + 48, Math.min(workH * 0.82, lift));
    return { kind: "transom", x: x0 + w * 0.5, lift };
  }

  function firstTransomBound(windows, work) {
    const list = Array.isArray(windows) ? windows : [];
    for (const win of list) {
      const b = windowTransomBound(win, work);
      if (b) return b;
    }
    return null;
  }

  function goCalledMeet(guest, flags, kind) {
    const hold = kind === "peer" ? peerPoint(flags, guest.key) : meetPoint(flags, guest.key);
    return {
      ...guest,
      phase: "approach-meet",
      meetKind: kind,
      t: 0,
      target: hold.x,
      fromX: guest.x,
      fromLift: guest.lift || 0,
      toX: hold.x,
      toLift: hold.lift,
      facing: hold.x >= guest.x ? 1 : -1,
    };
  }

  function goCalledBound(guest, flags) {
    const hold = boundPoint(flags, guest.key);
    return {
      ...guest,
      phase: "approach-bound",
      meetKind: "bound",
      t: 0,
      target: hold.x,
      fromX: guest.x,
      fromLift: guest.lift || 0,
      toX: hold.x,
      toLift: hold.lift,
      facing: hold.x >= guest.x ? 1 : -1,
      boundKind: hold.kind,
    };
  }

  function meetBusy(phase) {
    return (
      phase === "approach-meet" ||
      phase === "meet" ||
      phase === "approach-bound" ||
      phase === "bound" ||
      phase === "approach-perch" ||
      phase === "perch" ||
      phase === "leave" ||
      phase === "gone"
    );
  }

  function shouldTell(guest) {
    if (!guest || guest.told) return false;
    if (guest.phase !== "meet" && guest.phase !== "bound") return false;
    return true;
  }

  function tellLine(guest) {
    if (!guest) return "";
    if (guest.phase === "bound" || guest.meetKind === "bound") {
      if (guest.boundKind === "grass" || guest.boundKind === "pad") return CAT_GRASS_LINE;
      if (guest.key === MEET_CROW_KEY || guest.key === WINDOW_CAP_KEY) return SOOT_CAP_LINE;
      if (guest.key === MEET_RAVEN_KEY || guest.key === WINDOW_TRANSOM_KEY) return WEDGE_TRANSOM_LINE;
      return CAT_SILL_LINE;
    }
    if (guest.key === MEET_DEE_KEY && guest.meetKind === "peer") return DEE_ROBIN_LINE;
    if (guest.key === MEET_DEE_KEY) return DEE_RUI_LINE;
    if (guest.key === MEET_CAT_KEY && guest.meetKind === "peer") return CAT_PIP_LINE;
    if (guest.key === MEET_CAT_KEY) return CAT_RUI_LINE;
    if (guest.key === MEET_RABBIT_KEY && guest.meetKind === "peer") return THIMBLE_PIP_LINE;
    if (guest.key === MEET_RABBIT_KEY) return THIMBLE_RUI_LINE;
    if (guest.key === MEET_DOG_KEY) return PIP_RUI_LINE;
    if (guest.key === MEET_CROW_KEY) return SOOT_RUI_LINE;
    if (guest.key === MEET_RAVEN_KEY) return WEDGE_RUI_LINE;
    return "";
  }

  function markTold(guest) {
    return { ...guest, told: true };
  }

  function shouldSing(guest) {
    if (!guest || guest.key !== PERCH_BIRD_KEY || guest.phase !== "perch") return false;
    return guest.age + 0.0001 >= (guest.sungAt || 0);
  }

  function markSung(guest) {
    return { ...guest, sungAt: (guest.age || 0) + SONG_EVERY_S };
  }

  function stepCalled(guest, dt, width, flags) {
    if (!guest || guest.phase === "gone") return guest;
    const next = { ...guest, t: guest.t + Math.max(0, dt), age: guest.age + Math.max(0, dt), lift: guest.lift || 0 };
    const perchNow = shouldPerchCalled(next.key, flags);
    if (perchNow && next.phase !== "approach-perch" && next.phase !== "perch" && next.phase !== "leave" && next.phase !== "gone") {
      return goCalledPerch(next, flags);
    }
    if (!perchNow && (next.phase === "approach-perch" || next.phase === "perch")) {
      return { ...next, phase: "stay", t: 0, lift: 0, target: next.x };
    }

    const meetPeer = shouldMeetPeer(next.key, flags);
    const meetRui = shouldMeetRui(next.key, flags);
    const sitBound = shouldSitBound(next.key, flags);
    if (next.placed && next.phase === "stay") {
      return next;
    }
    if (!meetBusy(next.phase)) {
      if (meetPeer) return goCalledMeet(next, flags, "peer");
      if (meetRui) return goCalledMeet(next, flags, "rui");
      if (sitBound) return goCalledBound(next, flags);
    }
    if ((next.phase === "approach-meet" || next.phase === "meet") && !meetPeer && !meetRui) {
      if (sitBound && (next.key === WINDOW_SIT_KEY || next.key === WINDOW_CAP_KEY || next.key === WINDOW_TRANSOM_KEY)) return goCalledBound(next, flags);
      return { ...next, phase: "stay", t: 0, lift: 0, target: next.x };
    }
    if ((next.phase === "approach-bound" || next.phase === "bound") && !sitBound) {
      return { ...next, phase: "stay", t: 0, lift: 0, target: next.x };
    }

    if (next.phase === "approach-perch") {
      const hold = perchPoint(flags && flags.hostX, flags && flags.hostFacing, flags && flags.hostLift);
      next.target = hold.x;
      next.toX = hold.x;
      next.toLift = hold.lift;
      const u = Math.min(1, next.t / PERCH_ON_S);
      const fromX = next.fromX != null ? next.fromX : next.x;
      const fromLift = next.fromLift != null ? next.fromLift : next.lift || 0;
      next.x = fromX + (hold.x - fromX) * u;
      next.lift = fromLift + (hold.lift - fromLift) * u;
      next.facing = hold.x >= fromX ? 1 : -1;
      if (u >= 1) return { ...next, phase: "perch", t: 0, x: hold.x, lift: hold.lift, target: hold.x };
      return next;
    }
    if (next.phase === "perch") {
      const hold = perchPoint(flags && flags.hostX, flags && flags.hostFacing, flags && flags.hostLift);
      next.x = hold.x;
      next.lift = hold.lift;
      next.target = hold.x;
      next.facing = (flags && flags.hostFacing) < 0 ? -1 : 1;
      return next;
    }

    if (next.phase === "approach-meet") {
      const hold = next.meetKind === "peer" ? peerPoint(flags, next.key) : meetPoint(flags, next.key);
      next.target = hold.x;
      next.toX = hold.x;
      next.toLift = hold.lift;
      const u = Math.min(1, next.t / MEET_ON_S);
      const fromX = next.fromX != null ? next.fromX : next.x;
      const fromLift = next.fromLift != null ? next.fromLift : next.lift || 0;
      const hop = next.key === MEET_DEE_KEY
        ? Math.abs(Math.sin(next.t * 16)) * HOP_LIFT * (1 - u)
        : next.key === MEET_CROW_KEY
          ? Math.abs(Math.sin(next.t * 14)) * CROW_HOP * (1 - u)
          : next.key === MEET_RAVEN_KEY
            ? Math.abs(Math.sin(next.t * 11)) * RAVEN_HOP * (1 - u)
            : next.key === MEET_RABBIT_KEY
              ? Math.abs(Math.sin(next.t * 10)) * THUMP_HOP * (1 - u)
              : 0;
      next.x = fromX + (hold.x - fromX) * u;
      next.lift = fromLift + (hold.lift - fromLift) * u + hop;
      next.facing = hold.x >= fromX ? 1 : -1;
      if (u >= 1) return { ...next, phase: "meet", t: 0, x: hold.x, lift: hold.lift, target: hold.x };
      return next;
    }
    if (next.phase === "meet") {
      const hold = next.meetKind === "peer" ? peerPoint(flags, next.key) : meetPoint(flags, next.key);
      next.x = hold.x;
      next.lift = hold.lift;
      next.target = hold.x;
      if (next.t >= TELL_S) {
        if (next.meetKind === "rui" && (next.key === WINDOW_SIT_KEY || next.key === WINDOW_CAP_KEY || next.key === WINDOW_TRANSOM_KEY) && sitBound) return goCalledBound(next, flags);
        return dismissCalled(next);
      }
      return next;
    }
    if (next.phase === "approach-bound") {
      const hold = boundPoint(flags, next.key);
      next.target = hold.x;
      next.toX = hold.x;
      next.toLift = hold.lift;
      const u = Math.min(1, next.t / MEET_ON_S);
      const fromX = next.fromX != null ? next.fromX : next.x;
      const fromLift = next.fromLift != null ? next.fromLift : next.lift || 0;
      next.x = fromX + (hold.x - fromX) * u;
      next.lift = fromLift + (hold.lift - fromLift) * u;
      next.facing = hold.x >= fromX ? 1 : -1;
      if (u >= 1) return { ...next, phase: "bound", t: 0, x: hold.x, lift: hold.lift, target: hold.x };
      return next;
    }
    if (next.phase === "bound") {
      const hold = boundPoint(flags, next.key);
      next.x = hold.x;
      const bat = next.key === GRASS_LIE_KEY && (hold.kind === "grass" || hold.kind === "pad") && next.t > 1.1 && next.t < 2.4
        ? Math.abs(Math.sin(next.t * 9)) * 7
        : 0;
      next.lift = hold.lift + bat;
      next.target = hold.x;
      next.boundKind = hold.kind;
      const stay = hold.kind === "grass" || hold.kind === "pad" ? GRASS_STAY_S : TELL_S;
      if (next.t >= stay) return dismissCalled(next);
      return next;
    }

    const remaining = next.target - next.x;
    if (Math.abs(remaining) > 2) {
      next.facing = remaining >= 0 ? 1 : -1;
      next.x += next.facing * 90 * Math.max(0, dt);
      next.lift = 0;
      return next;
    }
    next.x = next.target;
    next.lift = 0;
    if (next.phase === "in") {
      return { ...next, phase: "stay", t: 0 };
    }
    if (next.phase === "stay") {
      if (next.placed) return next;
      if (next.t >= 3.2) {
        const w = Math.max(320, width || 800);
        const dest = 48 + Math.random() * Math.max(80, w - 200);
        return { ...next, phase: "wander", t: 0, target: dest, facing: dest >= next.x ? 1 : -1 };
      }
      return next;
    }
    if (next.phase === "wander") {
      if (next.t >= 2.4) return { ...next, phase: "stay", t: 0 };
      return next;
    }
    if (next.phase === "leave") {
      if (next.x <= -140 || next.age >= MIN_STAY_S * 8) return { ...next, phase: "gone" };
      return next;
    }
    return next;
  }

  function stillVisible(guest) {
    return !!(guest && guest.phase !== "gone");
  }

  function calledKids(root) {
    if (!root) return [];
    if (root.querySelectorAll) return Array.from(root.querySelectorAll("[data-call-key]"));
    return Array.from(root.children || []);
  }

  function poseFrames(guest, sprites) {
    const pack = sprites && typeof sprites === "object" ? sprites : {};
    const sit = Array.isArray(pack.sit) ? pack.sit.filter(Boolean) : [];
    const idle = Array.isArray(pack.idle) ? pack.idle.filter(Boolean) : [];
    const walk = Array.isArray(pack.walk) ? pack.walk.filter(Boolean) : [];
    if (guest && (guest.phase === "perch" || guest.phase === "approach-perch" || guest.phase === "meet" || guest.phase === "bound")) {
      if (sit.length) return sit;
      if (idle.length) return idle;
    }
    if (walk.length) return walk;
    if (idle.length) return idle;
    if (sit.length) return sit;
    return [];
  }

  function poseSrc(guest, sprites) {
    const frames = poseFrames(guest, sprites);
    if (!frames.length) return "";
    const i = Math.abs((guest && guest.frame) || 0) % frames.length;
    return frames[i];
  }

  function assignedSrc(el) {
    if (!el) return "";
    if (el.dataset && el.dataset.frame) return el.dataset.frame;
    if (el.dataset && el.dataset.frameSrc) return el.dataset.frameSrc;
    if (typeof el.getContext === "function") return "";
    if (el.getAttribute) return el.getAttribute("src") || "";
    return el.src || "";
  }

  function assignSrc(el, src, opts) {
    if (!el || !src) return false;
    const surface = el.dataset && el.dataset.surface;
    const known = el.dataset && (el.dataset.frame || el.dataset.frameSrc);
    if (known === src && surface && surface !== "refused" && surface !== "pending") return false;
    const api = surfaceApi();
    if (!api || typeof api.paintHeld !== "function") {
      if (el.dataset) {
        el.dataset.surface = "refused";
        delete el.dataset.frame;
      }
      return false;
    }
    const painted = api.paintHeld(el, src, Object.assign({ cssSize: calledBox() }, opts || {}));
    if (!painted || painted.ok !== true) return false;
    if (el.dataset) el.dataset.frameSrc = src;
    if (painted.cached) return false;
    return true;
  }

  function createCalledCanvas() {
    if (typeof document === "undefined" || typeof document.createElement !== "function") return null;
    const canvas = document.createElement("canvas");
    if (canvas.dataset) canvas.dataset.surface = "pending";
    return canvas;
  }

  function syncCalledPaint(root, guests, opts) {
    if (!root) return { reused: 0, added: 0, removed: 0 };
    // createImg is the node-reuse test seam. The overlay default is a canvas.
    const make = (opts && opts.createImg) || createCalledCanvas;
    if (!make) return { reused: 0, added: 0, removed: 0 };
    const visible = (Array.isArray(guests) ? guests : []).filter(stillVisible);
    const keep = Object.create(null);
    for (const g of visible) keep[g.key] = g;
    let removed = 0;
    for (const el of calledKids(root)) {
      const key = el.dataset && el.dataset.callKey;
      if (!key || !keep[key]) {
        if (el.remove) el.remove();
        else if (root.removeChild) root.removeChild(el);
        removed += 1;
      }
    }
    let reused = 0;
    let added = 0;
    const frameOf = opts && opts.frameOf;
    const onPress = opts && opts.onPress;
    const onDismiss = opts && opts.onDismiss;
    for (const g of visible) {
      let img = calledKids(root).find((el) => el.dataset && el.dataset.callKey === g.key);
      if (!img) {
        img = make();
        img.className = "called-guest";
        img.alt = "";
        if (img.setAttribute) {
          img.setAttribute("role", "img");
          img.setAttribute("aria-label", g.name || g.key);
        } else img.ariaLabel = g.name || g.key;
        if (!img.dataset) img.dataset = {};
        img.dataset.hit = "1";
        img.dataset.callKey = g.key;
        if (!img.dataset.surface) img.dataset.surface = "pending";
        img.draggable = false;
        if ((onPress || onDismiss) && img.addEventListener) {
          img.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            if (onPress) onPress(g, e, img);
            else onDismiss(g);
          });
        }
        if (root.appendChild) root.appendChild(img);
        added += 1;
      } else {
        reused += 1;
      }
      // opts.place (reduced motion, calm-motion.js): where to draw the guest still, and its frame; null keeps it
      // out of sight until it rests. Without it the guest is drawn where it walks.
      const at = opts && opts.place ? opts.place(g) : undefined;
      if (at === null) {
        if (img.style) img.style.visibility = "hidden";
        continue;
      }
      if (img.style && img.style.visibility) img.style.visibility = "";
      const frames = frameOf ? frameOf(g) : poseFrames(g, g.sprites);
      const frame = at ? at.frame : g.frame;
      let src = frames && frames.length ? frames[Math.abs(frame || 0) % frames.length] || frames[0] : "";
      if (!src) src = poseSrc(g, g.sprites) || (g.sprites && (g.sprites.idle && g.sprites.idle[0])) || "";
      destFit(img);
      assignSrc(img, src, opts && opts.surface);
      const x = at ? at.x : g.x;
      const lift = at ? at.lift : g.lift || 0;
      const facing = at ? at.facing : g.facing || 1;
      if (img.style) img.style.transform = `translate3d(${x}px, ${-lift}px, 0) scale(${facing}, 1)`;
    }
    return { reused, added, removed };
  }

  const api = {
    CALL_GROUPS,
    FLY_BIRD_KEY,
    PERCH_BIRD_KEY,
    PERCH_HOST,
    ROBIN_SONG,
    MEET_DEE_KEY,
    MEET_CAT_KEY,
    MEET_HOST,
    PEER_ROBIN_KEY,
    WINDOW_SIT_KEY,
    DEE_RUI_LINE,
    DEE_ROBIN_LINE,
    CAT_RUI_LINE,
    CAT_SILL_LINE,
    GRASS_LIE_KEY,
    CAT_GRASS_LINE,
    GRASS_STAY_S,
    MEET_DOG_KEY,
    MEET_CROW_KEY,
    PEER_PIP_KEY,
    WINDOW_CAP_KEY,
    PIP_RUI_LINE,
    SOOT_RUI_LINE,
    SOOT_CAP_LINE,
    CAT_PIP_LINE,
    MEET_RABBIT_KEY,
    MEET_RAVEN_KEY,
    WINDOW_TRANSOM_KEY,
    THIMBLE_RUI_LINE,
    THIMBLE_PIP_LINE,
    WEDGE_RUI_LINE,
    WEDGE_TRANSOM_LINE,
    MEET_ON_S,
    TELL_S,
    SONG_EVERY_S,
    MIN_STAY_S,
    CALL_EMPTY,
    groups,
    groupById,
    matchGroup,
    matchCall,
    matchOneGuest,
    callKeys,
    walkersOf,
    shouldFly,
    shouldRobinFly,
    AUTO_MEET_KEYS,
    nextAutoMeet,
    GUEST_DEST,
    destFit,
    beginCalled,
    dismissCalled,
    CLICK_PX,
    clickMoved,
    placeCalled,
    shouldPerchCalled,
    perchPoint,
    shouldSing,
    markSung,
    shouldMeetRui,
    shouldMeetPeer,
    shouldSitBound,
    shouldSitGrass,
    meetPoint,
    peerPoint,
    windowSitBound,
    firstWindowBound,
    windowCapBound,
    firstCapBound,
    windowTransomBound,
    firstTransomBound,
    shouldTell,
    tellLine,
    markTold,
    stepCalled,
    stillVisible,
    poseFrames,
    poseSrc,
    assignSrc,
    syncCalledPaint,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCallGuests = api;
})(typeof window !== "undefined" ? window : globalThis);
