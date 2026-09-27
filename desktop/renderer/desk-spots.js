/** Per-desktop pet spot on Windows (ADR 0132).
 * The overlay follows the keeper across virtual desktops (ADR 0131). When it lands on
 * another desktop, main sends { from, to }: the desktop id the overlay's own window left
 * and the one it is on now. Both ids come from GetWindowDesktopId on that one window.
 * The pet's x on `from` is kept in card.json (`deskSpots`). If `to` has a kept spot, the
 * pet goes back there. If not, it stays where it is, which is what it did before.
 * Older cards have no deskSpots and load with an empty map. There was no saved pet
 * position before this, so nothing else moves. At most MAX_DESKS ids are kept; an id
 * not visited for STALE_MS is dropped (a removed desktop never comes back).
 */
(function (root) {
  const MAX_DESKS = 12;
  const STALE_MS = 90 * 24 * 60 * 60 * 1000;
  const HOLD_MS = 10 * 1000;
  const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  const NIL = "00000000-0000-0000-0000-000000000000";

  /** A lowercase GUID, or "". GUID_NULL is not a desktop. */
  function cleanDeskId(id) {
    const text = String(id == null ? "" : id).trim().replace(/^\{|\}$/g, "").toLowerCase();
    return GUID.test(text) && text !== NIL ? text : "";
  }

  function num(v) {
    return typeof v === "number" && Number.isFinite(v) ? v : NaN;
  }

  function cleanSpot(raw) {
    if (!raw || typeof raw !== "object") return null;
    const x = num(raw.x);
    const w = num(raw.w);
    const at = num(raw.at);
    if (!(x >= 0) || !(w > 0) || !(at > 0)) return null;
    return { x: Math.round(x), w: Math.round(w), at: Math.round(at) };
  }

  /** Newest MAX_DESKS ids; with a clock, ids older than STALE_MS go. */
  function prune(spots, now) {
    const rows = Object.entries(spots || {}).filter(([, s]) => !!s);
    const live = Number.isFinite(now) ? rows.filter(([, s]) => now - s.at <= STALE_MS) : rows;
    live.sort((a, b) => b[1].at - a[1].at);
    const out = {};
    for (const [id, s] of live.slice(0, MAX_DESKS)) out[id] = s;
    return out;
  }

  /** card.json deskSpots -> { [deskId]: { x, w, at } }. Anything else is an empty map. */
  function parseSpots(raw, now) {
    const out = {};
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
    for (const [key, value] of Object.entries(raw)) {
      const id = cleanDeskId(key);
      const spot = cleanSpot(value);
      if (id && spot) out[id] = spot;
    }
    return prune(out, now);
  }

  /** A kept spot, scaled to this overlay width and held inside [min, max]. */
  function spotFor(spots, id, here) {
    const key = cleanDeskId(id);
    const spot = key && spots ? spots[key] : null;
    if (!spot) return null;
    const width = num(here && here.width);
    let x = spot.x;
    if (width > 0 && Math.abs(width - spot.w) > 1) x = (spot.x * width) / spot.w;
    const min = Number.isFinite(here && here.min) ? here.min : 0;
    const max = Number.isFinite(here && here.max) ? Math.max(min, here.max) : Infinity;
    return Math.round(Math.min(max, Math.max(min, x)));
  }

  /**
   * The overlay moved desktops. Keep the pet's x for `from`, then look up `to`.
   * here: { x, width, min, max, now }. Returns { spots, x } where x is null when `to`
   * has no kept spot (the pet stays put), or null when the move is not a real move.
   */
  function arrive(spots, move, here) {
    const from = cleanDeskId(move && move.from);
    const to = cleanDeskId(move && move.to);
    if (!to || from === to) return null;
    const now = Number.isFinite(here && here.now) ? here.now : Date.now();
    const next = { ...(spots || {}) };
    const x = num(here && here.x);
    const width = num(here && here.width);
    if (from && x >= 0 && width > 0) next[from] = { x: Math.round(x), w: Math.round(width), at: now };
    const kept = prune(next, now);
    return { spots: kept, x: spotFor(kept, to, here) };
  }

  const api = { MAX_DESKS, STALE_MS, HOLD_MS, cleanDeskId, parseSpots, prune, spotFor, arrive };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDeskSpots = api;
})(typeof window !== "undefined" ? window : globalThis);