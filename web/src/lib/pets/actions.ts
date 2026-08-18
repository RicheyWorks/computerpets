import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { HATCH_COST, SPECIES, findSpecies, mintTokenId, pickSpecies, pickWeightedRarity } from "./catalog";
import { applyFeed, applyPlay, applyRest, decayStats, type CareStats } from "./care";
import {
  genotypeFromPhenotype,
  isLegalGenotype,
  parseGenotypeJson,
  phenotypeOf,
  rollCatalogGenotype,
  stringifyGenotype,
  type Genotype,
} from "./genetics";
import { canPair, houseOffspringName, rollBrood, type NestVerb } from "./nest";

export type CompanionRow = {
  id: string;
  user_id: string;
  species_key: string;
  name: string;
  token_id: string;
  rarity: string;
  hunger: number;
  mood: number;
  energy: number;
  eyes: string;
  mark: string;
  aura: string;
  last_tick: string;
  hatched_at: string;
  is_active: boolean;
  genotype?: string | null;
  departed_at?: string | null;
  origin?: string | null;
  parent_a?: string | null;
  parent_b?: string | null;
};

export type CompanionView = CompanionRow & {
  hunger: number;
  mood: number;
  energy: number;
  genes: Genotype;
  departed: boolean;
};

export type ClutchRow = {
  id: string;
  user_id: string;
  species_key: string;
  verb: string;
  parent_a: string | null;
  parent_b: string | null;
  due_at: string;
  resolved_at: string | null;
  cost: number;
  brood: string;
  created_at: string;
};

export type ClutchView = {
  id: string;
  species_key: string;
  verb: NestVerb;
  parent_a: string | null;
  parent_b: string | null;
  due_at: string;
  waiting: boolean;
  count: number;
};

function asIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function genesOf(row: CompanionRow): Genotype {
  if (row.genotype) {
    const parsed = parseGenotypeJson(row.genotype, row.species_key);
    if (isLegalGenotype(parsed, row.species_key)) return parsed;
  }
  return genotypeFromPhenotype(
    { eyes: row.eyes, mark: row.mark, aura: row.aura },
    row.species_key,
  );
}

function hydrate(row: CompanionRow, now = Date.now()): CompanionView {
  const last = Date.parse(asIso(row.last_tick));
  const live = decayStats(
    { hunger: Number(row.hunger), mood: Number(row.mood), energy: Number(row.energy) },
    Number.isNaN(last) ? now : last,
    now,
  );
  const genes = genesOf(row);
  const pheno = phenotypeOf(genes, row.species_key);
  return {
    ...row,
    last_tick: asIso(row.last_tick),
    hatched_at: asIso(row.hatched_at),
    departed_at: row.departed_at ? asIso(row.departed_at) : null,
    hunger: live.hunger,
    mood: live.mood,
    energy: live.energy,
    is_active: Boolean(row.is_active),
    eyes: pheno.eyes,
    mark: pheno.mark,
    aura: pheno.aura,
    genes,
    departed: Boolean(row.departed_at),
    origin: row.origin ?? "hatch",
  };
}

async function ensureKeeper(userId: string) {
  const sql = await getSql();
  await sql`
    insert into pet_keepers (user_id, ember, hatches)
    values (${userId}, 12, 0)
    on conflict (user_id) do nothing
  `;
}

async function mintCompanion(opts: {
  userId: string;
  speciesKey: string;
  name: string;
  rarity: string;
  genotype: Genotype;
  origin: string;
  parentA?: string | null;
  parentB?: string | null;
  makeActive: boolean;
}) {
  const sql = await getSql();
  const species = findSpecies(opts.speciesKey);
  const id = crypto.randomUUID();
  const tokenId = mintTokenId();
  const pheno = phenotypeOf(opts.genotype, opts.speciesKey);
  await sql`
    insert into companion_pets (
      id, user_id, species_key, name, token_id, rarity,
      hunger, mood, energy, eyes, mark, aura, is_active,
      genotype, origin, parent_a, parent_b
    ) values (
      ${id}, ${opts.userId}, ${opts.speciesKey}, ${opts.name}, ${tokenId}, ${opts.rarity},
      78, 74, 80, ${pheno.eyes}, ${pheno.mark}, ${pheno.aura}, ${opts.makeActive},
      ${stringifyGenotype(opts.genotype)}, ${opts.origin}, ${opts.parentA ?? null}, ${opts.parentB ?? null}
    )
  `;
  const created = await sql<CompanionRow>`
    select * from companion_pets where id = ${id} and user_id = ${opts.userId}
  `;
  return { view: hydrate(created[0]!), species };
}

type BroodJson = { genotype: Genotype; name: string };

async function resolveDueClutches(userId: string, now = Date.now()) {
  const sql = await getSql();
  const pending = await sql<ClutchRow>`
    select * from companion_clutches
    where user_id = ${userId} and resolved_at is null
  `;
  const minted: CompanionView[] = [];
  for (const clutch of pending) {
    if (Date.parse(asIso(clutch.due_at)) > now) continue;
    let brood: BroodJson[] = [];
    try {
      brood = JSON.parse(clutch.brood) as BroodJson[];
    } catch {
      brood = [];
    }
    const living = await sql<{ id: string }>`
      select id from companion_pets
      where user_id = ${userId} and departed_at is null
      limit 1
    `;
    let makeActive = living.length === 0;
    const species = findSpecies(clutch.species_key);
    for (const child of brood) {
      const row = await mintCompanion({
        userId,
        speciesKey: clutch.species_key,
        name: child.name,
        rarity: species?.rarity ?? "COMMON",
        genotype: child.genotype,
        origin: "nest",
        parentA: clutch.parent_a,
        parentB: clutch.parent_b,
        makeActive,
      });
      minted.push(row.view);
      makeActive = false;
    }
    await sql`
      update companion_clutches set resolved_at = now()
      where id = ${clutch.id} and user_id = ${userId}
    `;
  }
  return minted;
}

function clutchView(row: ClutchRow, now = Date.now()): ClutchView {
  let count = 1;
  try {
    const brood = JSON.parse(row.brood) as unknown[];
    count = Array.isArray(brood) ? brood.length : 1;
  } catch {
    count = 1;
  }
  return {
    id: row.id,
    species_key: row.species_key,
    verb: row.verb as NestVerb,
    parent_a: row.parent_a,
    parent_b: row.parent_b,
    due_at: asIso(row.due_at),
    waiting: Date.parse(asIso(row.due_at)) > now,
    count,
  };
}

export const getSanctuary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureKeeper(context.userId);
    await resolveDueClutches(context.userId);
    const sql = await getSql();
    const keepers = await sql<{ ember: number; hatches: number }>`
      select ember, hatches from pet_keepers where user_id = ${context.userId}
    `;
    const pets = await sql<CompanionRow>`
      select * from companion_pets where user_id = ${context.userId}
      order by hatched_at desc
    `;
    const clutches = await sql<ClutchRow>`
      select * from companion_clutches
      where user_id = ${context.userId} and resolved_at is null
      order by due_at asc
    `;
    const views = pets.map((p) => hydrate(p));
    return {
      ember: Number(keepers[0]?.ember ?? 12),
      hatches: Number(keepers[0]?.hatches ?? 0),
      pets: views.filter((p) => !p.departed),
      departed: views.filter((p) => p.departed),
      clutches: clutches.map((c) => clutchView(c)),
    };
  });

export const hatchPet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureKeeper(context.userId);
    const sql = await getSql();
    const keepers = await sql<{ ember: number; hatches: number }>`
      select ember, hatches from pet_keepers where user_id = ${context.userId}
    `;
    const ember = Number(keepers[0]?.ember ?? 0);
    const rarity = pickWeightedRarity();
    const cost = HATCH_COST[rarity];
    if (ember < cost) {
      throw new Error(`Need ${cost} ember to hatch a ${rarity.toLowerCase()} companion.`);
    }
    const species = pickSpecies(rarity);
    const genotype = rollCatalogGenotype(species.key);
    const existing = await sql<{ id: string }>`
      select id from companion_pets
      where user_id = ${context.userId} and departed_at is null
      limit 1
    `;
    const created = await mintCompanion({
      userId: context.userId,
      speciesKey: species.key,
      name: species.displayName,
      rarity,
      genotype,
      origin: "hatch",
      makeActive: existing.length === 0,
    });
    await sql`
      update pet_keepers
      set ember = ember - ${cost}, hatches = hatches + 1
      where user_id = ${context.userId}
    `;
    return created.view;
  });

const pairInput = z.object({
  parentA: z.string().min(1),
  parentB: z.string().min(1).optional().nullable(),
  name: z.string().trim().min(1).max(24).optional(),
});

export const pairNest = createServerFn({ method: "POST" })
  .validator((input: unknown) => pairInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await ensureKeeper(context.userId);
    const sql = await getSql();
    const aRows = await sql<CompanionRow>`
      select * from companion_pets
      where id = ${data.parentA} and user_id = ${context.userId} and departed_at is null
    `;
    const parentA = aRows[0];
    if (!parentA) throw new Error("The first guest is not in this house.");
    let parentB: CompanionRow | null = null;
    if (data.parentB) {
      if (data.parentB === data.parentA) throw new Error("Pair two, or let a starter split. Not one guest twice.");
      const bRows = await sql<CompanionRow>`
        select * from companion_pets
        where id = ${data.parentB} and user_id = ${context.userId} and departed_at is null
      `;
      parentB = bRows[0] ?? null;
      if (!parentB) throw new Error("The second guest is not in this house.");
    }
    const verdict = canPair(parentA.species_key, parentB?.species_key ?? null);
    if (!verdict.ok) throw new Error(verdict.reason);
    const path = verdict.path;
    const keepers = await sql<{ ember: number }>`
      select ember from pet_keepers where user_id = ${context.userId}
    `;
    const ember = Number(keepers[0]?.ember ?? 0);
    if (ember < path.cost) {
      throw new Error(`Need ${path.cost} ember for ${path.word}.`);
    }
    const mother = genesOf(parentA);
    const father = parentB ? genesOf(parentB) : null;
    const brood = rollBrood(parentA.species_key, mother, father, path);
    const named = brood.map((child, i) => ({
      genotype: child.genotype,
      name:
        i === 0 && data.name
          ? data.name
          : houseOffspringName(parentA.species_key, parentA.name, path),
    }));
    await sql`
      update pet_keepers set ember = ember - ${path.cost} where user_id = ${context.userId}
    `;
    if (path.waitMs > 0) {
      const id = crypto.randomUUID();
      const due = new Date(Date.now() + path.waitMs).toISOString();
      await sql`
        insert into companion_clutches (
          id, user_id, species_key, verb, parent_a, parent_b, due_at, cost, brood
        ) values (
          ${id}, ${context.userId}, ${parentA.species_key}, ${path.verb},
          ${parentA.id}, ${parentB?.id ?? null}, ${due}, ${path.cost}, ${JSON.stringify(named)}
        )
      `;
      return {
        waiting: true as const,
        verb: path.verb,
        word: path.word,
        plaque: path.plaque,
        due_at: due,
        count: named.length,
        pets: [] as CompanionView[],
      };
    }
    const living = await sql<{ id: string }>`
      select id from companion_pets
      where user_id = ${context.userId} and departed_at is null
      limit 1
    `;
    let makeActive = living.length === 0;
    const pets: CompanionView[] = [];
    for (const child of named) {
      const minted = await mintCompanion({
        userId: context.userId,
        speciesKey: parentA.species_key,
        name: child.name,
        rarity: parentA.rarity,
        genotype: child.genotype,
        origin: "nest",
        parentA: parentA.id,
        parentB: parentB?.id ?? null,
        makeActive,
      });
      pets.push(minted.view);
      makeActive = false;
    }
    return {
      waiting: false as const,
      verb: path.verb,
      word: path.word,
      plaque: path.plaque,
      due_at: null,
      count: pets.length,
      pets,
    };
  });

export const releasePet = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ petId: z.string().min(1) }).parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update companion_pets
      set departed_at = now(), is_active = false
      where id = ${data.petId} and user_id = ${context.userId} and departed_at is null
    `;
    return { ok: true };
  });

const careInput = z.object({
  petId: z.string().min(1),
  action: z.enum(["feed", "play", "rest"]),
});

export const careForPet = createServerFn({ method: "POST" })
  .validator((input: unknown) => careInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<CompanionRow>`
      select * from companion_pets where id = ${data.petId} and user_id = ${context.userId} and departed_at is null
    `;
    const row = rows[0];
    if (!row) throw new Error("Companion not found.");

    const live = hydrate(row);
    const next: CareStats =
      data.action === "feed"
        ? applyFeed(live)
        : data.action === "play"
          ? applyPlay(live)
          : applyRest(live);

    await sql`
      update companion_pets
      set hunger = ${next.hunger},
          mood = ${next.mood},
          energy = ${next.energy},
          last_tick = now()
      where id = ${data.petId} and user_id = ${context.userId}
    `;
    await sql`
      update pet_keepers set ember = ember + 1 where user_id = ${context.userId}
    `;

    const updated = await sql<CompanionRow>`
      select * from companion_pets where id = ${data.petId} and user_id = ${context.userId}
    `;
    return hydrate(updated[0]!);
  });

const selectInput = z.object({ petId: z.string().min(1) });

export const setActivePet = createServerFn({ method: "POST" })
  .validator((input: unknown) => selectInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update companion_pets set is_active = false where user_id = ${context.userId}
    `;
    await sql`
      update companion_pets set is_active = true
      where id = ${data.petId} and user_id = ${context.userId} and departed_at is null
    `;
    return { ok: true };
  });

const renameInput = z.object({
  petId: z.string().min(1),
  name: z.string().trim().min(1).max(24),
});

export const renamePet = createServerFn({ method: "POST" })
  .validator((input: unknown) => renameInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update companion_pets set name = ${data.name}
      where id = ${data.petId} and user_id = ${context.userId} and departed_at is null
    `;
    return { ok: true };
  });

export const catalogSnapshot = createServerFn({ method: "GET" }).handler(async () => {
  return SPECIES.map((s) => ({
    ...s,
    owned: false,
  }));
});

export function speciesOrThrow(key: string) {
  const s = findSpecies(key);
  if (!s) throw new Error(`Unknown species: ${key}`);
  return s;
}
