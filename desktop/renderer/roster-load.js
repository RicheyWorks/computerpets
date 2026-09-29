/** The house already has the roster on disk. A sandboxed file fetch is not a door. */
(function (root) {
  const MISSING_LINE = "The house could not find the roster.";

  function takeRoster(parsed) {
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => r && r.key && r.name);
  }

  function foundRoster(rows) {
    return Array.isArray(rows) && rows.length > 0;
  }

  /**
   * One pet in a list: "Name · Kind" (Rui · Red Panda), never the catalog key unless there is no name.
   * The tray, the house window's Pet list, the card's Call list, and the blotter (unlock_dialog.py
   * pet_choice_text) all say it this way.
   */
  function choiceText(row) {
    if (!row) return "";
    const name = row.name ? String(row.name) : "";
    const kind = row.speciesLabel ? String(row.speciesLabel) : "";
    if (!name) return row.key ? String(row.key) : "";
    return kind ? `${name} · ${kind}` : name;
  }

  function missingLine() {
    return MISSING_LINE;
  }

  function readRoster(file, io) {
    if (!io || typeof io.readFileSync !== "function") return [];
    try {
      return takeRoster(JSON.parse(io.readFileSync(file, "utf8")));
    } catch {
      return [];
    }
  }

  function openRoster(rows) {
    if (foundRoster(rows)) return { ok: true, roster: rows };
    return { ok: false, line: MISSING_LINE };
  }

  async function askHouseRoster(desk) {
    if (!desk || typeof desk.roster !== "function") return [];
    try {
      return takeRoster(await desk.roster());
    } catch {
      return [];
    }
  }

  async function loadHouseRoster(desk) {
    return openRoster(await askHouseRoster(desk));
  }

  /**
   * The Companions menu, one submenu per den. It was one flat list of all 221, taller than any screen, and the
   * pet's own menu (the only menu on a desktop with no tray to see) ran to 255 rows. Every guest stays reachable:
   * a guest in no den (a roster newer than the dens) lands in a last "Others" den instead of being dropped.
   * @param {{ key: string }[]} rows the roster, in house order
   * @param {{ label: string, keys: string[] }[]} dens the house dens (PetCallGuests.groups())
   * @returns {{ label: string, rows: { key: string }[] }[]}
   */
  function companionDens(rows, dens) {
    const byKey = new Map((rows || []).map((r) => [r.key, r]));
    const placed = new Set();
    const out = [];
    for (const den of dens || []) {
      const inDen = den.keys.map((k) => byKey.get(k)).filter((r) => r && !placed.has(r.key));
      for (const r of inDen) placed.add(r.key);
      if (inDen.length) out.push({ label: `${den.label} (${inDen.length})`, rows: inDen });
    }
    const rest = (rows || []).filter((r) => !placed.has(r.key));
    if (rest.length) out.push({ label: `Others (${rest.length})`, rows: rest });
    return out;
  }

  const api = {
    companionDens,
    choiceText,
    takeRoster,
    foundRoster,
    missingLine,
    readRoster,
    openRoster,
    askHouseRoster,
    loadHouseRoster,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRoster = api;
})(typeof window !== "undefined" ? window : globalThis);
