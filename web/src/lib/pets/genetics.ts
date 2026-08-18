/**
 * Mendel at the nest. Hardy–Weinberg on this blotter.
 * Phenotype strings match TRAIT_POOLS (eyes / mark / aura). Extra guild
 * loci are card morphs the house can already say — not new sprites.
 */

export type Diploid = readonly [string, string];
export type Genotype = Record<string, Diploid>;

export type AlleleDef = {
  id: string;
  look: string;
  rank: number;
};

export type LocusDef = {
  id: string;
  label: string;
  alleles: readonly AlleleDef[];
  /** complete: higher rank shows. incomplete: the het pair has its own look. */
  dominance: "complete" | "incomplete";
  hetLeft?: string;
  hetRight?: string;
  hetLook?: string;
};

export const EYES: LocusDef = {
  id: "eyes",
  label: "Eyes",
  dominance: "incomplete",
  hetLeft: "A",
  hetRight: "a",
  hetLook: "frost",
  alleles: [
    { id: "E", look: "ember", rank: 3 },
    { id: "A", look: "amber", rank: 2 },
    { id: "a", look: "ink", rank: 1 },
  ],
};

export const BAND: LocusDef = {
  id: "band",
  label: "Band",
  dominance: "complete",
  alleles: [
    { id: "B", look: "banded", rank: 2 },
    { id: "b", look: "clear", rank: 1 },
  ],
};

export const MASK: LocusDef = {
  id: "mask",
  label: "Mask",
  dominance: "complete",
  alleles: [
    { id: "M", look: "masked", rank: 2 },
    { id: "m", look: "open", rank: 1 },
  ],
};

export const AURA: LocusDef = {
  id: "aura",
  label: "Aura",
  dominance: "incomplete",
  hetLeft: "L",
  hetRight: "s",
  hetLook: "dustlit",
  alleles: [
    { id: "E", look: "emberlit", rank: 3 },
    { id: "L", look: "moonlit", rank: 2 },
    { id: "s", look: "still", rank: 1 },
  ],
};

export const FRUIT: LocusDef = {
  id: "fruit",
  label: "Fruit",
  dominance: "complete",
  alleles: [
    { id: "R", look: "ripe", rank: 2 },
    { id: "r", look: "green", rank: 1 },
  ],
};

export const SPORE: LocusDef = {
  id: "spore",
  label: "Spore",
  dominance: "complete",
  alleles: [
    { id: "U", look: "rust", rank: 2 },
    { id: "u", look: "pale", rank: 1 },
  ],
};

export const DUST: LocusDef = {
  id: "dust",
  label: "Dust",
  dominance: "complete",
  alleles: [
    { id: "W", look: "dusted", rank: 2 },
    { id: "w", look: "clear", rank: 1 },
  ],
};

export const GLOW: LocusDef = {
  id: "glow",
  label: "Glow",
  dominance: "complete",
  alleles: [
    { id: "G", look: "lamp", rank: 2 },
    { id: "g", look: "dim", rank: 1 },
  ],
};

export const HOUSE_LOCI: readonly LocusDef[] = [EYES, BAND, MASK, AURA];

export const GUILD_EXTRA: Record<string, LocusDef> = {
  garden: FRUIT,
  fungi: SPORE,
  insects: DUST,
  sea: GLOW,
  far: GLOW,
};

export type GuildId = "house" | "snakes" | "sea" | "garden" | "hive" | "cellar" | "far";

const GARDEN = new Set([
  "moss",
  "maidenhair",
  "ginkgo",
  "oak",
  "water_lily",
  "orchid",
  "saguaro",
  "venus_flytrap",
  "pitcher",
  "sundew",
]);
const FUNGI = new Set([
  "oyster",
  "fly_agaric",
  "morel",
  "chanterelle",
  "turkey_tail",
  "lions_mane",
  "puffball",
  "chicken_of_woods",
  "yeast",
  "lichen",
]);
const INSECTS = new Set([
  "honeybee",
  "monarch",
  "luna",
  "firefly",
  "darner",
  "stick",
  "carpenter_ant",
  "ladybird",
  "mantis",
  "cicada",
]);
const SEA = new Set([
  "octopus",
  "cuttlefish",
  "nautilus",
  "moon_jelly",
  "sea_star",
  "hermit_crab",
  "horseshoe_crab",
  "seahorse",
  "manta",
  "moray",
]);
const FAR = new Set([
  "photovore",
  "choir",
  "nimbus",
  "silica",
  "terminator",
  "nexus",
  "halovore",
  "magneton",
  "umbral",
  "cyst",
]);
const SNAKES = new Set([
  "ball_python",
  "corn_snake",
  "kingsnake",
  "green_tree_python",
  "hognose",
  "garter",
  "boa",
  "milk_snake",
  "rosy_boa",
  "carpet_python",
]);

export function guildOf(key: string): GuildId {
  if (SNAKES.has(key)) return "snakes";
  if (SEA.has(key)) return "sea";
  if (GARDEN.has(key)) return "garden";
  if (INSECTS.has(key)) return "hive";
  if (FUNGI.has(key)) return "cellar";
  if (FAR.has(key)) return "far";
  return "house";
}

export function extraLocusFor(key: string): LocusDef | null {
  const guild = guildOf(key);
  if (guild === "garden") return FRUIT;
  if (guild === "cellar") return SPORE;
  if (guild === "hive") return DUST;
  if (guild === "sea" || guild === "far") return GLOW;
  return null;
}

export function lociFor(key: string): LocusDef[] {
  const extra = extraLocusFor(key);
  return extra ? [...HOUSE_LOCI, extra] : [...HOUSE_LOCI];
}

export function locusById(id: string, speciesKey = "dog"): LocusDef | null {
  return lociFor(speciesKey).find((l) => l.id === id) ?? HOUSE_LOCI.find((l) => l.id === id) ?? null;
}

function alleleDef(locus: LocusDef, id: string) {
  return locus.alleles.find((a) => a.id === id) ?? locus.alleles[locus.alleles.length - 1]!;
}

export function sortDiploid(locus: LocusDef, alleles: readonly string[]): Diploid {
  const [x, y] = alleles.length >= 2 ? [alleles[0]!, alleles[1]!] : [alleles[0]!, alleles[0]!];
  const rx = alleleDef(locus, x).rank;
  const ry = alleleDef(locus, y).rank;
  if (ry > rx) return [y, x];
  if (rx === ry) return x <= y ? [x, y] : [y, x];
  return [x, y];
}

export function formatDiploid(dip: Diploid) {
  return `${dip[0]}${dip[1]}`;
}

export function parseDiploid(locus: LocusDef, raw: string): Diploid {
  const ids = locus.alleles.map((a) => a.id).sort((a, b) => b.length - a.length);
  let rest = raw.trim();
  const found: string[] = [];
  while (rest && found.length < 2) {
    const hit = ids.find((id) => rest.startsWith(id));
    if (!hit) break;
    found.push(hit);
    rest = rest.slice(hit.length);
  }
  if (found.length === 1) found.push(found[0]!);
  if (found.length < 2) return sortDiploid(locus, [locus.alleles[0]!.id, locus.alleles[0]!.id]);
  return sortDiploid(locus, found);
}

export function lookOf(locus: LocusDef, dip: Diploid): string {
  const [x, y] = sortDiploid(locus, dip);
  if (locus.dominance === "incomplete" && locus.hetLook && locus.hetLeft && locus.hetRight) {
    const pair = new Set([x, y]);
    if (pair.has(locus.hetLeft) && pair.has(locus.hetRight) && pair.size === 2) {
      return locus.hetLook;
    }
  }
  return alleleDef(locus, x).look;
}

export function markLook(band: Diploid, mask: Diploid): string {
  const banded = lookOf(BAND, band) === "banded";
  const masked = lookOf(MASK, mask) === "masked";
  if (banded && masked) return "starred";
  if (banded) return "banded";
  if (masked) return "masked";
  return "plain";
}

export type Phenotype = {
  eyes: string;
  mark: string;
  aura: string;
  extra?: { id: string; label: string; look: string };
};

export function phenotypeOf(genotype: Genotype, speciesKey: string): Phenotype {
  const eyes = lookOf(EYES, genotype.eyes ?? ["A", "A"]);
  const mark = markLook(genotype.band ?? ["B", "B"], genotype.mask ?? ["m", "m"]);
  const aura = lookOf(AURA, genotype.aura ?? ["s", "s"]);
  const extraDef = extraLocusFor(speciesKey);
  const extra =
    extraDef && genotype[extraDef.id]
      ? { id: extraDef.id, label: extraDef.label, look: lookOf(extraDef, genotype[extraDef.id]!) }
      : undefined;
  return extra ? { eyes, mark, aura, extra } : { eyes, mark, aura };
}

export function phenotypeLine(pheno: Phenotype) {
  const bits = [`${pheno.eyes} eyes`, pheno.mark, pheno.aura];
  if (pheno.extra) bits.push(`${pheno.extra.look} ${pheno.extra.label.toLowerCase()}`);
  return bits.join(" · ");
}

export function emptyGenotype(speciesKey: string): Genotype {
  const g: Record<string, Diploid> = {
    eyes: ["A", "A"],
    band: ["B", "B"],
    mask: ["m", "m"],
    aura: ["s", "s"],
  };
  const extra = extraLocusFor(speciesKey);
  if (extra) g[extra.id] = [extra.alleles[0]!.id, extra.alleles[0]!.id];
  return g;
}

export function normalizeGenotype(raw: unknown, speciesKey: string): Genotype {
  const base = emptyGenotype(speciesKey);
  if (!raw || typeof raw !== "object") return base;
  const src = raw as Record<string, unknown>;
  const next: Record<string, Diploid> = { ...base };
  for (const locus of lociFor(speciesKey)) {
    const cell = src[locus.id];
    if (Array.isArray(cell) && cell.length >= 2) {
      next[locus.id] = sortDiploid(locus, [String(cell[0]), String(cell[1])]);
    } else if (typeof cell === "string") {
      next[locus.id] = parseDiploid(locus, cell);
    }
  }
  return next;
}

export function parseGenotypeJson(text: string | null | undefined, speciesKey: string): Genotype {
  if (!text) return emptyGenotype(speciesKey);
  try {
    return normalizeGenotype(JSON.parse(text), speciesKey);
  } catch {
    return emptyGenotype(speciesKey);
  }
}

export function stringifyGenotype(g: Genotype) {
  return JSON.stringify(g);
}

export function isLegalGenotype(g: Genotype, speciesKey: string): boolean {
  for (const locus of lociFor(speciesKey)) {
    const dip = g[locus.id];
    if (!dip || dip.length !== 2) return false;
    const ids = new Set(locus.alleles.map((a) => a.id));
    if (!ids.has(dip[0]) || !ids.has(dip[1])) return false;
  }
  return true;
}

/** A legal diploid that shows this look. Prefers a revealing het when the look is dominant. */
export function diploidForLook(locus: LocusDef, look: string): Diploid {
  if (locus.dominance === "incomplete" && look === locus.hetLook && locus.hetLeft && locus.hetRight) {
    return sortDiploid(locus, [locus.hetLeft, locus.hetRight]);
  }
  const match = locus.alleles.find((a) => a.look === look);
  if (match) return [match.id, match.id];
  const top = locus.alleles[0]!;
  return [top.id, top.id];
}

export function genotypeFromPhenotype(
  pheno: { eyes: string; mark: string; aura: string },
  speciesKey: string,
): Genotype {
  const g = emptyGenotype(speciesKey);
  g.eyes = diploidForLook(EYES, pheno.eyes);
  if (pheno.mark === "starred") {
    g.band = ["B", "B"];
    g.mask = ["M", "M"];
  } else if (pheno.mark === "banded") {
    g.band = ["B", "B"];
    g.mask = ["m", "m"];
  } else if (pheno.mark === "masked") {
    g.band = ["b", "b"];
    g.mask = ["M", "M"];
  } else {
    g.band = ["b", "b"];
    g.mask = ["m", "m"];
  }
  g.aura = diploidForLook(AURA, pheno.aura);
  return g;
}

function pickAllele(locus: LocusDef, rand: () => number): string {
  const weights = locus.alleles.map((a, i) => (i === 0 ? 0.22 : i === locus.alleles.length - 1 ? 0.38 : 0.4));
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = rand() * total;
  for (let i = 0; i < locus.alleles.length; i++) {
    roll -= weights[i]!;
    if (roll <= 0) return locus.alleles[i]!.id;
  }
  return locus.alleles[locus.alleles.length - 1]!.id;
}

/** Catalog draw: a legal genotype, then the card shows the pheno. */
export function rollCatalogGenotype(speciesKey: string, rand: () => number = Math.random): Genotype {
  const g: Record<string, Diploid> = {};
  for (const locus of lociFor(speciesKey)) {
    g[locus.id] = sortDiploid(locus, [pickAllele(locus, rand), pickAllele(locus, rand)]);
  }
  return g;
}

export function gametesOf(dip: Diploid): [string, string] {
  return [dip[0], dip[1]];
}

export type PunnettCell = { genotype: Diploid; label: string };

export type PunnettSquare = {
  rowGametes: string[];
  colGametes: string[];
  cells: PunnettCell[][];
  genotypeCounts: Record<string, number>;
  phenotypeCounts: Record<string, number>;
  genotypeRatio: string;
  phenotypeRatio: string;
};

function ratioString(counts: Record<string, number>) {
  const parts = Object.entries(counts).filter(([, n]) => n > 0);
  const gcd = parts.reduce((g, [, n]) => {
    let a = g;
    let b = n;
    while (b) {
      const t = a % b;
      a = b;
      b = t;
    }
    return a || 1;
  }, parts[0]?.[1] ?? 1);
  return parts.map(([k, n]) => `${n / gcd} ${k}`).join(" : ");
}

export function punnettMono(locus: LocusDef, mother: Diploid, father: Diploid): PunnettSquare {
  const rows = gametesOf(sortDiploid(locus, mother));
  const cols = gametesOf(sortDiploid(locus, father));
  const genotypeCounts: Record<string, number> = {};
  const phenotypeCounts: Record<string, number> = {};
  const cells: PunnettCell[][] = rows.map((r) =>
    cols.map((c) => {
      const genotype = sortDiploid(locus, [r, c]);
      const label = formatDiploid(genotype);
      const look = lookOf(locus, genotype);
      genotypeCounts[label] = (genotypeCounts[label] ?? 0) + 1;
      phenotypeCounts[look] = (phenotypeCounts[look] ?? 0) + 1;
      return { genotype, label };
    }),
  );
  return {
    rowGametes: [...rows],
    colGametes: [...cols],
    cells,
    genotypeCounts,
    phenotypeCounts,
    genotypeRatio: ratioString(genotypeCounts),
    phenotypeRatio: ratioString(phenotypeCounts),
  };
}

export function rollLocus(locus: LocusDef, mother: Diploid, father: Diploid, rand: () => number = Math.random): Diploid {
  const rows = gametesOf(mother);
  const cols = gametesOf(father);
  const r = rows[rand() < 0.5 ? 0 : 1]!;
  const c = cols[rand() < 0.5 ? 0 : 1]!;
  return sortDiploid(locus, [r, c]);
}

export function crossGenotypes(
  mother: Genotype,
  father: Genotype,
  speciesKey: string,
  rand: () => number = Math.random,
): Genotype {
  const child: Record<string, Diploid> = {};
  for (const locus of lociFor(speciesKey)) {
    const m = mother[locus.id] ?? diploidForLook(locus, locus.alleles[0]!.look);
    const f = father[locus.id] ?? diploidForLook(locus, locus.alleles[0]!.look);
    child[locus.id] = rollLocus(locus, m, f, rand);
  }
  return child;
}

export function cloneGenotype(g: Genotype, speciesKey: string): Genotype {
  return normalizeGenotype(g, speciesKey);
}

export type DihybridSquare = {
  rowGametes: string[];
  colGametes: string[];
  cells: { band: Diploid; mask: Diploid; mark: string; label: string }[][];
  genotypeCounts: Record<string, number>;
  phenotypeCounts: Record<string, number>;
  genotypeRatio: string;
  phenotypeRatio: string;
};

function twoLocusGametes(band: Diploid, mask: Diploid): string[] {
  return [band[0] + mask[0], band[0] + mask[1], band[1] + mask[0], band[1] + mask[1]];
}

export function punnettDihybridMark(mother: Genotype, father: Genotype): DihybridSquare {
  const mb = mother.band ?? ["B", "b"];
  const mm = mother.mask ?? ["M", "m"];
  const fb = father.band ?? ["B", "b"];
  const fm = father.mask ?? ["M", "m"];
  const rows = twoLocusGametes(mb, mm);
  const cols = twoLocusGametes(fb, fm);
  const genotypeCounts: Record<string, number> = {};
  const phenotypeCounts: Record<string, number> = {};
  const cells = rows.map((r) =>
    cols.map((c) => {
      const band = sortDiploid(BAND, [r[0]!, c[0]!]);
      const mask = sortDiploid(MASK, [r[1]!, c[1]!]);
      const mark = markLook(band, mask);
      const label = `${formatDiploid(band)} ${formatDiploid(mask)}`;
      genotypeCounts[label] = (genotypeCounts[label] ?? 0) + 1;
      phenotypeCounts[mark] = (phenotypeCounts[mark] ?? 0) + 1;
      return { band, mask, mark, label };
    }),
  );
  return {
    rowGametes: rows,
    colGametes: cols,
    cells,
    genotypeCounts,
    phenotypeCounts,
    genotypeRatio: ratioString(genotypeCounts),
    phenotypeRatio: ratioString(phenotypeCounts),
  };
}

export function isDihybridMark(a: Genotype, b: Genotype) {
  const het = (d: Diploid | undefined) => !!d && d[0] !== d[1];
  return het(a.band) && het(a.mask) && het(b.band) && het(b.mask);
}

export type HwReport = {
  locus: string;
  n: number;
  alleleCounts: Record<string, number>;
  freq: Record<string, number>;
  observed: Record<string, number>;
  expected: Record<string, number>;
  equilibrium: boolean | null;
  fixed: string | null;
  note: string;
};

function chiClose(observed: Record<string, number>, expected: Record<string, number>, n: number) {
  if (n < 4) return null;
  let x2 = 0;
  const keys = new Set([...Object.keys(observed), ...Object.keys(expected)]);
  for (const k of keys) {
    const exp = expected[k] ?? 0;
    const obs = observed[k] ?? 0;
    if (exp <= 0) {
      if (obs > 0) x2 += 4;
      continue;
    }
    x2 += (obs - exp) ** 2 / exp;
  }
  return x2 < 3.84;
}

export function hardyWeinberg(locus: LocusDef, diploids: Diploid[]): HwReport {
  const n = diploids.length;
  const alleleCounts: Record<string, number> = {};
  for (const a of locus.alleles) alleleCounts[a.id] = 0;
  const observed: Record<string, number> = {};
  for (const raw of diploids) {
    const dip = sortDiploid(locus, raw);
    observed[formatDiploid(dip)] = (observed[formatDiploid(dip)] ?? 0) + 1;
    alleleCounts[dip[0]] = (alleleCounts[dip[0]] ?? 0) + 1;
    alleleCounts[dip[1]] = (alleleCounts[dip[1]] ?? 0) + 1;
  }
  const copies = n * 2;
  const freq: Record<string, number> = {};
  for (const a of locus.alleles) {
    freq[a.id] = copies === 0 ? 0 : (alleleCounts[a.id] ?? 0) / copies;
  }
  const expected: Record<string, number> = {};
  const ids = locus.alleles.map((a) => a.id);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i; j < ids.length; j++) {
      const dip = sortDiploid(locus, [ids[i]!, ids[j]!]);
      const label = formatDiploid(dip);
      const p = freq[ids[i]!] ?? 0;
      const q = freq[ids[j]!] ?? 0;
      const share = i === j ? p * p : 2 * p * q;
      expected[label] = (expected[label] ?? 0) + share * n;
    }
  }
  if (n === 0) {
    return {
      locus: locus.id,
      n,
      alleleCounts,
      freq,
      observed,
      expected,
      equilibrium: null,
      fixed: null,
      note: "No one here. The square is empty.",
    };
  }
  const present = ids.filter((id) => (alleleCounts[id] ?? 0) > 0);
  const fixed = present.length === 1 ? present[0]! : null;
  if (n === 1) {
    return {
      locus: locus.id,
      n,
      alleleCounts,
      freq,
      observed,
      expected,
      equilibrium: null,
      fixed,
      note: "One guest. A population of one is not a population.",
    };
  }
  if (fixed) {
    return {
      locus: locus.id,
      n,
      alleleCounts,
      freq,
      observed,
      expected,
      equilibrium: true,
      fixed,
      note: `Only ${alleleDef(locus, fixed).look} remains. The other alleles are not on this blotter.`,
    };
  }
  const close = chiClose(observed, expected, n);
  if (close === null) {
    return {
      locus: locus.id,
      n,
      alleleCounts,
      freq,
      observed,
      expected,
      equilibrium: null,
      fixed: null,
      note: "Too few to judge. This is one blotter, not an infinite field.",
    };
  }
  return {
    locus: locus.id,
    n,
    alleleCounts,
    freq,
    observed,
    expected,
    equilibrium: close,
    fixed: null,
    note: close
      ? "The house matches the square. Quietly in equilibrium."
      : "The house is not in equilibrium. A founder, a drift, a rooster and too many hens.",
  };
}

export function houseHw(speciesKey: string, genotypes: Genotype[]): HwReport[] {
  return lociFor(speciesKey).map((locus) =>
    hardyWeinberg(
      locus,
      genotypes.map((g) => g[locus.id] ?? diploidForLook(locus, locus.alleles[0]!.look)),
    ),
  );
}

export function hiddenRecessive(locus: LocusDef, dip: Diploid): string | null {
  const [x, y] = sortDiploid(locus, dip);
  if (x === y) return null;
  const low = alleleDef(locus, y);
  if (low.rank < alleleDef(locus, x).rank) return y;
  return null;
}

export function catalogLooks(speciesKey: string): { eyes: string[]; mark: string[]; aura: string[]; extra?: string[] } {
  const extra = extraLocusFor(speciesKey);
  return {
    eyes: ["amber", "ink", "frost", "ember"],
    mark: ["plain", "masked", "banded", "starred"],
    aura: ["still", "dustlit", "emberlit", "moonlit"],
    extra: extra ? extra.alleles.map((a) => a.look) : undefined,
  };
}

export function watchLocusId(a: Genotype, b: Genotype, speciesKey: string): string {
  for (const locus of lociFor(speciesKey)) {
    const ha = hiddenRecessive(locus, a[locus.id] ?? [locus.alleles[0]!.id, locus.alleles[0]!.id]);
    const hb = hiddenRecessive(locus, b[locus.id] ?? [locus.alleles[0]!.id, locus.alleles[0]!.id]);
    if (ha && hb && ha === hb) return locus.id;
  }
  if (isDihybridMark(a, b)) return "mark";
  return "eyes";
}

export const NEST_COST_SINGLE = 3;
export const NEST_COST_CLUTCH = 5;

export type NestVerb = "split" | "share" | "bud" | "brood" | "egg" | "clutch" | "seed" | "spore" | "hatchling" | "wait";

export type NestPath = {
  verb: NestVerb;
  word: string;
  plaque: string;
  parents: 1 | 2;
  count: number;
  waitMs: number;
  cost: number;
};

const SNAKE_CLUTCH = new Set([
  "ball_python",
  "corn_snake",
  "kingsnake",
  "green_tree_python",
  "hognose",
  "garter",
  "boa",
  "milk_snake",
  "rosy_boa",
  "carpet_python",
]);
const INSECT_CLUTCH = new Set([
  "honeybee",
  "monarch",
  "firefly",
  "darner",
  "stick",
  "carpenter_ant",
  "ladybird",
  "mantis",
  "cicada",
]);

const HOUSE_NAME: Record<string, string> = {
  octopus: "Cup",
  yeast: "Starter",
  lichen: "Pact",
  nexus: "Knot",
  cyst: "Arca",
  seahorse: "Anchor",
  luna: "Ghost",
  red_panda: "Rui",
  photovore: "Gleam",
  honeybee: "Comb",
  moss: "Felt",
};

export function nestPath(speciesKey: string, parentCount: 1 | 2): NestPath {
  if (speciesKey === "yeast") {
    return {
      verb: "split",
      word: parentCount === 1 ? "a rise" : "a conjugate rise",
      plaque: "Starter divides. One guest may split. Two may meet, then rise. The loaf is the tell.",
      parents: parentCount,
      count: 1,
      waitMs: 0,
      cost: NEST_COST_SINGLE,
    };
  }
  if (speciesKey === "lichen") {
    return {
      verb: "share",
      word: "a share",
      plaque: "Pact is two kingdoms already. Pairing is a fragment that shares, not a mammal clutch.",
      parents: parentCount,
      count: 1,
      waitMs: 0,
      cost: NEST_COST_SINGLE,
    };
  }
  if (speciesKey === "nexus") {
    return {
      verb: "bud",
      word: "a bud",
      plaque: "Knot is a colony. A bud walks away with the name. Many animals, one guest.",
      parents: parentCount,
      count: 1,
      waitMs: 0,
      cost: NEST_COST_SINGLE,
    };
  }
  if (speciesKey === "cyst") {
    return {
      verb: "wait",
      word: "a long wait",
      plaque: "Arca waits. Pairing is a long wait. Most of a life is the wait.",
      parents: 2,
      count: 1,
      waitMs: 24 * 60 * 60 * 1000,
      cost: NEST_COST_SINGLE,
    };
  }
  if (speciesKey === "seahorse") {
    return {
      verb: "brood",
      word: "a pouch",
      plaque: "The male broods. Pair still two seahorses. Anchor keeps the pouch.",
      parents: 2,
      count: 1,
      waitMs: 30 * 60 * 1000,
      cost: NEST_COST_SINGLE,
    };
  }
  if (speciesKey === "luna") {
    return {
      verb: "egg",
      word: "an egg",
      plaque: "Adults do not eat. They may still pair. The offspring is an egg, then a hatchling.",
      parents: 2,
      count: 1,
      waitMs: 20 * 60 * 1000,
      cost: NEST_COST_SINGLE,
    };
  }
  if (SNAKE_CLUTCH.has(speciesKey)) {
    return {
      verb: "clutch",
      word: "a clutch",
      plaque: "Snakes clutch. Same care object. The square still rolls.",
      parents: 2,
      count: 3,
      waitMs: 0,
      cost: NEST_COST_CLUTCH,
    };
  }
  if (INSECT_CLUTCH.has(speciesKey)) {
    return {
      verb: "egg",
      word: "a few eggs",
      plaque: "Insects egg. Honeybee only with honeybee. Not bee × mantis.",
      parents: 2,
      count: 2,
      waitMs: 0,
      cost: NEST_COST_CLUTCH,
    };
  }
  const guild = guildOf(speciesKey);
  if (guild === "garden") {
    return {
      verb: "seed",
      word: "a seed",
      plaque: "Plants fruit and seed. Same care object. A different verb.",
      parents: 2,
      count: 1,
      waitMs: 0,
      cost: NEST_COST_SINGLE,
    };
  }
  if (guild === "cellar") {
    return {
      verb: "spore",
      word: "a spore",
      plaque: "Fungi spore. Not a plant clutch. The print is the tell.",
      parents: 2,
      count: 1,
      waitMs: 0,
      cost: NEST_COST_SINGLE,
    };
  }
  return {
    verb: "hatchling",
    word: "a hatchling",
    plaque: "Two of a kind. A small hatchling. Bond starts fresh.",
    parents: 2,
    count: 1,
    waitMs: 0,
    cost: NEST_COST_SINGLE,
  };
}

export type PairOk = { ok: true; path: NestPath };
export type PairNo = { ok: false; reason: string };

export function canPair(parentAKey: string, parentBKey: string | null | undefined): PairOk | PairNo {
  const solo = parentAKey === "yeast" || parentAKey === "lichen" || parentAKey === "nexus";
  if (!parentBKey) {
    if (!solo) {
      return { ok: false, reason: "The nest wants two of a kind — unless a starter splits, a pact shares, or a colony buds." };
    }
    return { ok: true, path: nestPath(parentAKey, 1) };
  }
  if (parentAKey !== parentBKey) {
    return { ok: false, reason: "Same species only. A dog does not pair with an oyster. Gleam does not pair with Rui." };
  }
  return { ok: true, path: nestPath(parentAKey, 2) };
}

export type BroodChild = {
  genotype: Genotype;
  phenotype: Phenotype;
};

export function rollBrood(
  speciesKey: string,
  mother: Genotype,
  father: Genotype | null,
  path: NestPath,
  rand: () => number = Math.random,
): BroodChild[] {
  const children: BroodChild[] = [];
  for (let i = 0; i < path.count; i++) {
    const genotype = father == null ? cloneGenotype(mother, speciesKey) : crossGenotypes(mother, father, speciesKey, rand);
    children.push({ genotype, phenotype: phenotypeOf(genotype, speciesKey) });
  }
  return children;
}

export function guestCallName(key: string) {
  return HOUSE_NAME[key] ?? key;
}

/** Keeper-local extinction: last living of a kind is gone, and no clutch waits. */
export function extinctLines(
  onceHeld: Iterable<string>,
  living: Iterable<string>,
  pending: Iterable<string>,
  nameOf: (key: string) => string = guestCallName,
): { key: string; line: string }[] {
  const live = new Set(living);
  const wait = new Set(pending);
  const lines: { key: string; line: string }[] = [];
  for (const key of onceHeld) {
    if (live.has(key) || wait.has(key)) continue;
    lines.push({ key, line: `This house has no ${nameOf(key)}.` });
  }
  return lines;
}
