// No-recent-repeat line picker for the overlay. Same rule as web/src/lib/pets/line-picker.ts and
// client/computerpets_client/line_picker.py (a test holds the three to the same picks).
// Each speaker remembers its last lines: pick never repeats one of the last `recent` (fewer for a small pool,
// so a pool of one still answers) and prefers a line not said in the last `withinMs`. offer is for one optional
// line, like a guest's tell: it stays quiet rather than repeat the same words inside `withinMs`.
// Only the choosing changes; every line's words stay as written.
(function (root) {
  const RECENT_LINES = 3;
  const RECENT_WITHIN_MS = 60000;
  const KEEP = 16;

  function createLinePicker(opts) {
    const o = opts || {};
    const recent = Math.max(0, Math.floor(o.recent == null ? RECENT_LINES : o.recent));
    const withinMs = Math.max(0, o.withinMs == null ? RECENT_WITHIN_MS : o.withinMs);
    const random = o.random || (() => Math.random());
    const now = o.now || (() => Date.now());
    const log = new Map();

    const history = (speaker) => log.get(speaker) || [];
    const saidWithin = (hist, line, t) => hist.some((e) => e.line === line && t - e.at < withinMs);
    function note(speaker, line, t) {
      if (!line) return;
      const hist = history(speaker).concat([{ line, at: t == null ? now() : t }]);
      log.set(speaker, hist.slice(-KEEP));
    }

    return {
      pick(speaker, pool) {
        const lines = [...new Set((pool || []).filter((l) => typeof l === "string" && l.length > 0))];
        if (!lines.length) return (pool && pool[0]) || "";
        const hist = history(speaker);
        const t = now();
        const avoid = Math.min(recent, lines.length - 1);
        const last = new Set(avoid > 0 ? hist.slice(-avoid).map((e) => e.line) : []);
        let open = lines.filter((l) => !last.has(l) && !saidWithin(hist, l, t));
        if (!open.length) open = lines.filter((l) => !last.has(l));
        if (!open.length) open = lines;
        const line = open[Math.min(open.length - 1, Math.floor(random() * open.length))] || open[0];
        note(speaker, line, t);
        return line;
      },
      offer(speaker, line) {
        if (!line) return "";
        const t = now();
        if (saidWithin(history(speaker), line, t)) return "";
        note(speaker, line, t);
        return line;
      },
      note: (speaker, line) => note(speaker, line),
      recentFor: (speaker) => history(speaker).map((e) => e.line),
      reset: () => log.clear(),
    };
  }

  const shared = createLinePicker();
  const api = {
    RECENT_LINES,
    RECENT_WITHIN_MS,
    createLinePicker,
    pick: (speaker, pool) => shared.pick(speaker, pool),
    offer: (speaker, line) => shared.offer(speaker, line),
    recentFor: (speaker) => shared.recentFor(speaker),
    reset: () => shared.reset(),
  };
  root.PetLines = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
