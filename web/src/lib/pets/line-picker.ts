/**
 * No-recent-repeat line picker, shared in shape by the web desk, the overlay (`desktop/renderer/line-picker.js`)
 * and the Python blotter (`client/computerpets_client/line_picker.py`); a test holds all three to the same picks.
 *
 * Each speaker (a pet or guest key) remembers its last lines. `pick` never repeats one of the speaker's last
 * `recent` lines (fewer when the pool is smaller, so a pool of one still answers) and prefers a line it has not said
 * in the last `withinMs`. `offer` is for a single optional line, like a guest's tell: it says nothing rather than
 * repeat the same words inside `withinMs`. Only the choosing changes; every line's words stay as written.
 */
export const RECENT_LINES = 3;
export const RECENT_WITHIN_MS = 60_000;
const KEEP = 16;

type Said = { line: string; at: number };

export type LinePickerOptions = {
  recent?: number;
  withinMs?: number;
  random?: () => number;
  now?: () => number;
};

export type LinePicker = {
  pick: (speaker: string, pool: readonly string[]) => string;
  offer: (speaker: string, line: string) => string;
  note: (speaker: string, line: string) => void;
  recentFor: (speaker: string) => string[];
  reset: () => void;
};

export function createLinePicker(opts: LinePickerOptions = {}): LinePicker {
  const recent = Math.max(0, Math.floor(opts.recent ?? RECENT_LINES));
  const withinMs = Math.max(0, opts.withinMs ?? RECENT_WITHIN_MS);
  const random = opts.random ?? (() => Math.random());
  const now = opts.now ?? (() => Date.now());
  const log = new Map<string, Said[]>();

  const history = (speaker: string) => log.get(speaker) ?? [];
  const saidWithin = (hist: Said[], line: string, t: number) => hist.some((e) => e.line === line && t - e.at < withinMs);
  const note = (speaker: string, line: string, t = now()) => {
    if (!line) return;
    const hist = [...history(speaker), { line, at: t }];
    log.set(speaker, hist.slice(-KEEP));
  };

  return {
    pick(speaker, pool) {
      const lines = [...new Set((pool || []).filter((l): l is string => typeof l === "string" && l.length > 0))];
      if (!lines.length) return (pool && pool[0]) || "";
      const hist = history(speaker);
      const t = now();
      const avoid = Math.min(recent, lines.length - 1);
      const last = new Set(avoid > 0 ? hist.slice(-avoid).map((e) => e.line) : []);
      let open = lines.filter((l) => !last.has(l) && !saidWithin(hist, l, t));
      if (!open.length) open = lines.filter((l) => !last.has(l));
      if (!open.length) open = lines;
      const line = open[Math.min(open.length - 1, Math.floor(random() * open.length))] ?? open[0]!;
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

/** The one picker the web desk uses; tests swap it for a seeded one. */
export let linePicker: LinePicker = createLinePicker();

export function setLinePickerForTests(next?: LinePicker) {
  linePicker = next ?? createLinePicker();
}
