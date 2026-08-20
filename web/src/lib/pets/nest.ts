/**
 * Nest surfaces: fair rail, house names. Pairing math lives in genetics.ts.
 */

import { findSpecies } from "./catalog";
import { ROSTER } from "./roster";
import {
  extraLocusFor,
  phenotypeLine,
  phenotypeOf,
  type Genotype,
  type NestPath,
} from "./genetics";

export { lookHint, originPhrase, wearLine, duePhrase, type HouseSeat, type OriginPhrase } from "./pedigree";

export {
  NEST_COST_CLUTCH,
  NEST_COST_SINGLE,
  canPair,
  departLine,
  departVerb,
  extinctLines,
  guestCallName,
  nestPath,
  rollBrood,
  type BroodChild,
  type NestPath,
  type NestVerb,
  type PairNo,
  type PairOk,
  type PairSeat,
} from "./genetics";

const DIMINUTIVE = ["kit", "small", "new", "young", "second"];

export function houseOffspringName(
  speciesKey: string,
  parentName: string,
  path: NestPath,
  rand: () => number = Math.random,
): string {
  const species = findSpecies(speciesKey);
  const base = parentName.trim() || species?.displayName || "guest";
  if (path.verb === "split") return `${base}'s rise`.slice(0, 24);
  if (path.verb === "share") return `${base}'s share`.slice(0, 24);
  if (path.verb === "bud") return `${base}'s bud`.slice(0, 24);
  if (path.verb === "brood") return `${base}'s brood`.slice(0, 24);
  const bit = DIMINUTIVE[Math.floor(rand() * DIMINUTIVE.length)] ?? "kit";
  return `${base} ${bit}`.slice(0, 24);
}

export type LivingGuest = {
  id: string;
  species_key: string;
  name: string;
  genotype: Genotype;
  departed?: boolean;
};

export type FairRibbon = { kind: "recessive" | "true" | "recovered"; line: string };

export type FairSpecies = {
  key: string;
  name: string;
  held: { look: string; count: number }[];
  ghosts: string[];
  ribbons: FairRibbon[];
};

export function fairForSpecies(
  speciesKey: string,
  living: { genotype: Genotype; name?: string }[],
  departed: { genotype: Genotype }[] = [],
): FairSpecies {
  const guest = ROSTER.find((r) => r.key === speciesKey);
  const name = guest?.name ?? findSpecies(speciesKey)?.displayName ?? speciesKey;
  const counts = new Map<string, number>();
  for (const held of living) {
    const look = phenotypeLine(phenotypeOf(held.genotype, speciesKey));
    counts.set(look, (counts.get(look) ?? 0) + 1);
  }
  const held = [...counts.entries()].map(([look, count]) => ({ look, count }));
  const extra = extraLocusFor(speciesKey);
  const ghosts = extra
    ? extra.alleles
        .map((a) => a.look)
        .filter((look) => !living.some((g) => phenotypeOf(g.genotype, speciesKey).extra?.look === look))
        .map((look) => `${look} ${extra.label.toLowerCase()}`)
    : ["frost eyes", "plain mark", "still aura"].filter(
        (ghost) => !held.some((h) => h.look.includes(ghost.split(" ")[0]!)),
      );

  const ribbons: FairRibbon[] = [];
  const recessiveLooks = living.filter((g) => {
    const p = phenotypeOf(g.genotype, speciesKey);
    return p.eyes === "ink" || p.mark === "plain" || p.aura === "still";
  });
  if (recessiveLooks.length > 0) {
    ribbons.push({
      kind: "recessive",
      line: `A recessive landed. ${recessiveLooks[0]!.name ?? name} wears what the square had hidden.`,
    });
  }
  const truePairs = living.filter((g) => {
    const gt = g.genotype;
    return (
      gt.eyes?.[0] === gt.eyes?.[1] &&
      gt.band?.[0] === gt.band?.[1] &&
      gt.mask?.[0] === gt.mask?.[1] &&
      gt.aura?.[0] === gt.aura?.[1]
    );
  });
  if (truePairs.length >= 2) {
    ribbons.push({
      kind: "true",
      line: `A true-breeding pair of ${name}. The square will not surprise you here.`,
    });
  }
  if (departed.length > 0 && living.length > 0) {
    const departedAlleles = new Set<string>();
    const livingAlleles = new Set<string>();
    for (const g of departed) {
      for (const dip of Object.values(g.genotype)) {
        departedAlleles.add(dip[0]);
        departedAlleles.add(dip[1]);
      }
    }
    for (const g of living) {
      for (const dip of Object.values(g.genotype)) {
        livingAlleles.add(dip[0]);
        livingAlleles.add(dip[1]);
      }
    }
    if ([...livingAlleles].some((a) => departedAlleles.has(a))) {
      ribbons.push({
        kind: "recovered",
        line: `An allele came home to this ${name}. The house remembers.`,
      });
    }
  }

  return { key: speciesKey, name, held, ghosts: [...new Set(ghosts)].slice(0, 4), ribbons };
}

export function fairHouse(living: LivingGuest[], departed: LivingGuest[] = []): FairSpecies[] {
  const keys = [...new Set(living.filter((g) => !g.departed).map((g) => g.species_key))];
  return keys.map((key) =>
    fairForSpecies(
      key,
      living.filter((g) => g.species_key === key && !g.departed),
      departed.filter((g) => g.species_key === key),
    ),
  );
}
