/**
 * The hive keeps a line. Wax is the place. Comb, Keep, and Hum sit on it.
 * Brood and stores ride companion_pets.line — the same packLine the sanctuary
 * already writes. Neglect can go quiet. The nest still keeps one.
 * It is not a shop.
 */

import type { CareStats } from "./care";

export const HIVE_PLACE = "honeycomb";
export const HIVE_SITTERS = ["honeybee", "honey_queen", "honey_drone"] as const;
export const HIVE_WORKER = "honeybee";
export const HIVE_BROOD_CELLS = 8;

export type HiveSitter = (typeof HIVE_SITTERS)[number];

export type HiveColony = {
  brood: number;
  stores: number;
  quiet: boolean;
};

export type CombSeat = {
  key: string;
  seat: "comb" | "keep" | "hum" | "worker";
  x: number;
  lift: number;
};

export function isHivePlace(key: string | undefined | null): boolean {
  return key === HIVE_PLACE;
}

export function sitsOnWax(key: string | undefined | null): boolean {
  return key === "honeybee" || key === "honey_queen" || key === "honey_drone";
}

export function clampBrood(n: number) {
  return Math.max(0, Math.min(HIVE_BROOD_CELLS, Math.round(n)));
}

/** Eight cells from a hundred of health. A spent comb is an empty brood. */
export function cellsFromHealth(health: number) {
  if (!Number.isFinite(health)) return 0;
  return clampBrood(health / 12.5);
}

export function colonyOf(
  stats: Pick<CareStats, "hunger" | "health"> & { brood?: number; stores?: number },
  departed = false,
): HiveColony {
  const brood = typeof stats.brood === "number" ? clampBrood(stats.brood) : cellsFromHealth(stats.health);
  const stores = typeof stats.stores === "number" ? Math.max(0, Math.min(100, Math.round(stats.stores))) : Math.max(0, Math.min(100, Math.round(stats.hunger)));
  return {
    brood,
    stores,
    quiet: departed || stats.health <= 0 || brood <= 0,
  };
}

/** Name the colony on the living line. Hunger is stores. Health is brood. */
export function stampColony(stats: CareStats): CareStats {
  return {
    ...stats,
    brood: cellsFromHealth(stats.health),
    stores: Math.max(0, Math.min(100, Math.round(stats.hunger))),
  };
}

export function combSeats(): CombSeat[] {
  return [
    { key: "honey_queen", seat: "keep", x: 286, lift: 54 },
    { key: "honeybee", seat: "comb", x: 214, lift: 46 },
    { key: "honeybee", seat: "worker", x: 348, lift: 42 },
    { key: "honey_drone", seat: "hum", x: 392, lift: 36 },
  ];
}

export function colonyWord(colony: HiveColony) {
  if (colony.quiet) return "The line went quieter.";
  if (colony.stores < 22) return "A nest should not be this empty.";
  if (colony.brood <= 1) return "The brood is thin.";
  return "Brood in some cells. Stores in others.";
}

/** Walkers stay on the wood. Wax is the place. Sitters keep the comb. */
export function hiveWalkers(keys: readonly string[]) {
  return keys.filter((key) => key !== HIVE_PLACE && !sitsOnWax(key));
}
