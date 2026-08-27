/** Call any of the 220. Groups are the existing dens. No new taxa. */
(function (root) {
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
  const WOOD_KEYS = ["deer", "bat", "squirrel", "otter", "raccoon", "skunk", "opossum", "beaver", "porcupine", "black_bear"];
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
    return list.filter((k) => k !== hostKey && k !== FLY_BIRD_KEY);
  }

  function shouldFly(keys, hostKey) {
    const list = Array.isArray(keys) ? keys : [];
    return list.indexOf(FLY_BIRD_KEY) >= 0 && hostKey !== FLY_BIRD_KEY;
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
    return { ...guest, phase: "leave", target: -160, dismissed: true, lift: guest.lift || 0 };
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

  function syncCalledPaint(root, guests, opts) {
    if (!root) return { reused: 0, added: 0, removed: 0 };
    const make = (opts && opts.createImg) || (typeof document !== "undefined" && document.createElement ? () => document.createElement("img") : null);
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
    const onDismiss = opts && opts.onDismiss;
    for (const g of visible) {
      let img = calledKids(root).find((el) => el.dataset && el.dataset.callKey === g.key);
      if (!img) {
        img = make();
        img.className = "called-guest";
        img.alt = g.name || g.key;
        if (!img.dataset) img.dataset = {};
        img.dataset.hit = "1";
        img.dataset.callKey = g.key;
        img.draggable = false;
        if (onDismiss && img.addEventListener) {
          img.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            onDismiss(g);
          });
        }
        if (root.appendChild) root.appendChild(img);
        added += 1;
      } else {
        reused += 1;
      }
      const frames = frameOf ? frameOf(g) : null;
      const src = frames && frames.length ? frames[g.frame || 0] || frames[0] : "";
      if (src && img.src !== src) img.src = src;
      if (img.style) img.style.transform = `translate3d(${g.x}px, ${-(g.lift || 0)}px, 0) scale(${g.facing || 1}, 1)`;
    }
    return { reused, added, removed };
  }

  const api = {
    CALL_GROUPS,
    FLY_BIRD_KEY,
    PERCH_BIRD_KEY,
    PERCH_HOST,
    ROBIN_SONG,
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
    beginCalled,
    dismissCalled,
    shouldPerchCalled,
    perchPoint,
    shouldSing,
    markSung,
    stepCalled,
    stillVisible,
    syncCalledPaint,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCallGuests = api;
})(typeof window !== "undefined" ? window : globalThis);
