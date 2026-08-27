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

  const api = {
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
