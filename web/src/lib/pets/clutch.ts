/**
 * One due clutch, one nest. Two sits at the same moment keep one brood.
 * The house claims the wait before any child lands.
 */

import type { Genotype } from "./genetics";

export type BroodGuest = {
  name: string;
  genotype: Genotype;
};

export type OpenClutch = {
  id: string;
  user_id: string;
  species_key: string;
  parent_a?: string | null;
  parent_b?: string | null;
  due_at: unknown;
  brood: unknown;
};

export type HatchDesk<T> = {
  listOpen: (userId: string) => Promise<OpenClutch[]>;
  /** This sit takes the clutch. Null if another sit already did. */
  claim: (id: string, userId: string) => Promise<OpenClutch | null>;
  livingInHouse: (userId: string) => Promise<boolean>;
  mintNestChild: (opts: {
    userId: string;
    speciesKey: string;
    name: string;
    genotype: Genotype;
    parentA?: string | null;
    parentB?: string | null;
    makeActive: boolean;
  }) => Promise<T>;
};

/** Unreadable due stays a wait. Never a hatch. */
export function dueAtMs(dueAt: unknown): number {
  if (dueAt instanceof Date) return dueAt.getTime();
  if (typeof dueAt === "number") return dueAt;
  if (dueAt == null) return Number.NaN;
  return Date.parse(String(dueAt));
}

export function isClutchDue(dueAt: unknown, now: number): boolean {
  const due = dueAtMs(dueAt);
  if (Number.isNaN(due)) return false;
  return due <= now;
}

function looksLikeGenotype(value: unknown): value is Genotype {
  if (!value || typeof value !== "object") return false;
  const rec = value as Record<string, unknown>;
  for (const locus of ["eyes", "band", "mask", "aura"]) {
    const dip = rec[locus];
    if (!Array.isArray(dip) || dip.length < 2) return false;
    if (typeof dip[0] !== "string" || typeof dip[1] !== "string") return false;
  }
  return true;
}

/** Names and genes the nest already rolled. Garbage does not invent guests. */
export function parseBrood(brood: unknown): BroodGuest[] {
  let parsed: unknown = brood;
  if (typeof brood === "string") {
    try {
      parsed = JSON.parse(brood);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  const guests: BroodGuest[] = [];
  for (const child of parsed) {
    if (!child || typeof child !== "object") continue;
    const rec = child as { name?: unknown; genotype?: unknown };
    if (typeof rec.name !== "string") continue;
    const name = rec.name.trim().slice(0, 24);
    if (!name) continue;
    if (!looksLikeGenotype(rec.genotype)) continue;
    guests.push({ name, genotype: rec.genotype });
  }
  return guests;
}

/**
 * Claim each due clutch, then mint. A second sit finds the claim already taken.
 * Empty or broken brood still closes — no forever-open hatch to race again.
 */
export async function hatchDueClutches<T>(
  userId: string,
  desk: HatchDesk<T>,
  now = Date.now(),
): Promise<T[]> {
  const pending = await desk.listOpen(userId);
  const minted: T[] = [];
  for (const clutch of pending) {
    if (!isClutchDue(clutch.due_at, now)) continue;
    const claimed = await desk.claim(clutch.id, userId);
    if (!claimed) continue;
    const brood = parseBrood(claimed.brood);
    const living = await desk.livingInHouse(userId);
    let makeActive = !living;
    for (const child of brood) {
      minted.push(
        await desk.mintNestChild({
          userId,
          speciesKey: claimed.species_key,
          name: child.name,
          genotype: child.genotype,
          parentA: claimed.parent_a ?? null,
          parentB: claimed.parent_b ?? null,
          makeActive,
        }),
      );
      makeActive = false;
    }
  }
  return minted;
}
