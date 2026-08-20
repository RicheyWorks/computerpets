/**
 * The hive keeps a line. Wax is the place. Comb, Keep, and Hum sit on it.
 * Brood and stores ride the same living line the overlay already writes.
 * Neglect can go quiet. Comb stays Comb. It is not a shop.
 */
(function (root) {
  const HIVE_PLACE = "honeycomb";
  const HIVE_SITTERS = ["honeybee", "honey_queen", "honey_drone"];
  const HIVE_WORKER = "honeybee";
  const HIVE_BROOD_CELLS = 8;

  function isHivePlace(key) {
    return key === HIVE_PLACE;
  }

  function sitsOnWax(key) {
    return key === "honeybee" || key === "honey_queen" || key === "honey_drone";
  }

  function clampBrood(n) {
    return Math.max(0, Math.min(HIVE_BROOD_CELLS, Math.round(n)));
  }

  /** Eight cells from a hundred of health. A spent comb is an empty brood. */
  function cellsFromHealth(health) {
    if (!Number.isFinite(health)) return 0;
    return clampBrood(health / 12.5);
  }

  function colonyOf(stats, departed = false) {
    const brood = typeof stats.brood === "number" ? clampBrood(stats.brood) : cellsFromHealth(stats.health);
    const stores = typeof stats.stores === "number"
      ? Math.max(0, Math.min(100, Math.round(stats.stores)))
      : Math.max(0, Math.min(100, Math.round(stats.hunger)));
    return {
      brood,
      stores,
      quiet: departed || stats.health <= 0 || brood <= 0,
    };
  }

  /** Name the colony on the living line. Hunger is stores. Health is brood. */
  function stampColony(stats) {
    return {
      ...stats,
      brood: cellsFromHealth(stats.health),
      stores: Math.max(0, Math.min(100, Math.round(stats.hunger))),
    };
  }

  function combSeats() {
    return [
      { key: "honey_queen", seat: "keep", x: 286, lift: 54 },
      { key: "honeybee", seat: "comb", x: 214, lift: 46 },
      { key: "honeybee", seat: "worker", x: 348, lift: 42 },
      { key: "honey_drone", seat: "hum", x: 392, lift: 36 },
    ];
  }

  function colonyWord(colony) {
    if (colony.quiet) return "The line went quieter.";
    if (colony.stores < 22) return "A nest should not be this empty.";
    if (colony.brood <= 1) return "The brood is thin.";
    return "Brood in some cells. Stores in others.";
  }

  /** Walkers stay on the wood. Wax is the place. Sitters keep the comb. */
  function hiveWalkers(keys) {
    return keys.filter((key) => key !== HIVE_PLACE && !sitsOnWax(key));
  }

  const api = {
    HIVE_PLACE,
    HIVE_SITTERS,
    HIVE_WORKER,
    HIVE_BROOD_CELLS,
    isHivePlace,
    sitsOnWax,
    clampBrood,
    cellsFromHealth,
    colonyOf,
    stampColony,
    combSeats,
    colonyWord,
    hiveWalkers,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHive = api;
})(typeof window !== "undefined" ? window : globalThis);
