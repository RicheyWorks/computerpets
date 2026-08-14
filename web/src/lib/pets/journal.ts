export type JournalEntry = {
  at: number;
  name: string;
  species: string;
  text: string;
};

const KEY = "computerpets.journal.v1";
const MAX = 16;

export function loadJournal(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as JournalEntry[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function appendJournal(entry: Omit<JournalEntry, "at">) {
  const next = [{ ...entry, at: Date.now() }, ...loadJournal()].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
