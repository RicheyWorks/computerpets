import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { HATCH_COST, SPECIES, findSpecies, mintTokenId, pickSpecies, pickWeightedRarity } from "./catalog";
import {
  applySanctuaryCare,
  packLine,
  seedCareFromRow,
  stageOf,
  tickSanctuary,
  type CareStats,
  type LifeStage,
  type SanctuaryCare,
} from "./care";
import {
  genotypeFromPhenotype,
  isLegalGenotype,
  parseGenotypeJson,
  phenotypeOf,
  rollCatalogGenotype,
  stringifyGenotype,
  type Genotype,
} from "./genetics";
import { hatchDueClutches, isClutchDue, parseBrood } from "./clutch";
import { canPair, departLine, houseOffspringName, rollBrood, type NestVerb } from "./nest";

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
  health?: number | null;
  hygiene?: number | null;
  floor_since?: string | null;
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
  line?: string | null;
};

export type CompanionView = CompanionRow & {
  hunger: number;
  mood: number;
  energy: number;
  health: number;
  hygiene: number;
  bond: number;
  sick: boolean;
  hidden: boolean;
  mess: CareStats["mess"];
  gifts: CareStats["gifts"];
  shedAt: number;
  lastTick: number;
  genes: Genotype;
  departed: boolean;
  stage: LifeStage;
  bornAt: number;
  note?: string;
  farewell?: string | null;
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
  if (value instanceof Date) {
    const n = value.getTime();
    if (Number.isNaN(n)) return "";
    return value.toISOString();
  }
  if (value == null) return "";
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

function asMs(value: unknown, fallback: number) {
  if (value == null) return fallback;
  const n = value instanceof Date ? value.getTime() : Date.parse(asIso(value));
  return Number.isNaN(n) ? fallback : n;
}

function careSeed(row: CompanionRow, now: number): CareStats {
  return seedCareFromRow(
    {
      hunger: row.hunger,
      mood: row.mood,
      energy: row.energy,
      health: row.health,
      hygiene: row.hygiene,
      bornAt: asMs(row.hatched_at, now),
      lastTick: asMs(row.last_tick, now),
      line: row.line,
    },
    now,
  );
}

function floorSinceMs(row: CompanionRow): number | null {
  if (!row.floor_since) return null;
  const n = asMs(row.floor_since, Number.NaN);
  return Number.isNaN(n) ? null : n;
}

function viewOf(row: CompanionRow, stats: CareStats, extras: { departedAt?: string | null; note?: string; farewell?: string | null } = {}): CompanionView {
  const genes = genesOf(row);
  const pheno = phenotypeOf(genes, row.species_key);
  const departedAt = extras.departedAt ?? (row.departed_at ? asIso(row.departed_at) : null);
  return {
    ...row,
    last_tick: asIso(row.last_tick),
    hatched_at: asIso(row.hatched_at),
    departed_at: departedAt,
    floor_since: row.floor_since ? asIso(row.floor_since) : null,
    hunger: stats.hunger,
    mood: stats.mood,
    energy: stats.energy,
    health: stats.health,
    hygiene: stats.hygiene,
    bond: stats.bond,
    sick: stats.sick,
    hidden: stats.hidden,
    mess: stats.mess,
    gifts: stats.gifts,
    shedAt: stats.shedAt,
    lastTick: stats.lastTick,
    is_active: departedAt ? false : Boolean(row.is_active),
    eyes: pheno.eyes,
    mark: pheno.mark,
    aura: pheno.aura,
    genes,
    departed: Boolean(departedAt),
    origin: row.origin ?? "hatch",
    stage: stageOf(stats),
    bornAt: stats.bornAt,
    note: extras.note,
    farewell: extras.farewell ?? (departedAt ? departLine(row.name, row.species_key) : null),
  };
}

function hydrate(row: CompanionRow, now = Date.now()): CompanionView {
  if (row.departed_at) return viewOf(row, careSeed(row, now));
  const last = asMs(row.last_tick, now);
  const tick = tickSanctuary(row.species_key, careSeed(row, now), last, floorSinceMs(row), now);
  return viewOf(
    { ...row, floor_since: tick.floorSince ? new Date(tick.floorSince).toISOString() : null },
    tick.stats,
    {
      departedAt: tick.departedAt ? new Date(tick.departedAt).toISOString() : null,
      farewell: tick.verb ? departLine(row.name, row.species_key) : null,
    },
  );
}

async function persistTick(userId: string, id: string, tick: ReturnType<typeof tickSanctuary>, now: number) {
  const sql = await getSql();
  const s = tick.stats;
  const line = packLine(s);
  const floorSince = tick.floorSince ? new Date(tick.floorSince).toISOString() : null;
  if (tick.departedAt) {
    const gone = new Date(tick.departedAt).toISOString();
    await sql`
      update companion_pets
      set hunger = ${s.hunger},
          mood = ${s.mood},
          energy = ${s.energy},
          hygiene = ${s.hygiene},
          health = ${s.health},
          last_tick = ${new Date(now).toISOString()},
          floor_since = ${floorSince},
          line = ${line},
          departed_at = ${gone},
          is_active = false
      where id = ${id} and user_id = ${userId} and departed_at is null
    `;
    return;
  }
  await sql`
    update companion_pets
    set hunger = ${s.hunger},
        mood = ${s.mood},
        energy = ${s.energy},
        hygiene = ${s.hygiene},
        health = ${s.health},
        last_tick = ${new Date(now).toISOString()},
        floor_since = ${floorSince},
        line = ${line}
    where id = ${id} and user_id = ${userId} and departed_at is null
  `;
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
      hunger, mood, energy, health, hygiene, eyes, mark, aura, is_active,
      genotype, origin, parent_a, parent_b
    ) values (
      ${id}, ${opts.userId}, ${opts.speciesKey}, ${opts.name}, ${tokenId}, ${opts.rarity},
      78, 74, 80, 92, 86, ${pheno.eyes}, ${pheno.mark}, ${pheno.aura}, ${opts.makeActive},
      ${stringifyGenotype(opts.genotype)}, ${opts.origin}, ${opts.parentA ?? null}, ${opts.parentB ?? null}
    )
  `;
  const created = await sql<CompanionRow>`
    select * from companion_pets where id = ${id} and user_id = ${opts.userId}
  `;
  return { view: hydrate(created[0]!), species };
}

async function resolveDueClutches(userId: string, now = Date.now()) {
  const sql = await getSql();
  return hatchDueClutches(
    userId,
    {
      listOpen: (uid) =>
        sql<ClutchRow>`
          select * from companion_clutches
          where user_id = ${uid} and resolved_at is null
        `,
      claim: async (id, uid) => {
        const rows = await sql<ClutchRow>`
          update companion_clutches
          set resolved_at = now()
          where id = ${id} and user_id = ${uid} and resolved_at is null
          returning *
        `;
        return rows[0] ?? null;
      },
      livingInHouse: async (uid) => {
        const living = await sql<{ id: string }>`
          select id from companion_pets
          where user_id = ${uid} and departed_at is null
          limit 1
        `;
        return living.length > 0;
      },
      mintNestChild: async (opts) => {
        const species = findSpecies(opts.speciesKey);
        const row = await mintCompanion({
          userId: opts.userId,
          speciesKey: opts.speciesKey,
          name: opts.name,
          rarity: species?.rarity ?? "COMMON",
          genotype: opts.genotype,
          origin: "nest",
          parentA: opts.parentA,
          parentB: opts.parentB,
          makeActive: opts.makeActive,
        });
        return row.view;
      },
    },
    now,
  );
}

function clutchView(row: ClutchRow, now = Date.now()): ClutchView {
  return {
    id: row.id,
    species_key: row.species_key,
    verb: row.verb as NestVerb,
    parent_a: row.parent_a,
    parent_b: row.parent_b,
    due_at: asIso(row.due_at),
    waiting: !isClutchDue(row.due_at, now),
    count: parseBrood(row.brood).length,
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
    const now = Date.now();
    const views: CompanionView[] = [];
    for (const p of pets) {
      if (p.departed_at) {
        views.push(hydrate(p, now));
        continue;
      }
      const last = asMs(p.last_tick, now);
      const tick = tickSanctuary(p.species_key, careSeed(p, now), last, floorSinceMs(p), now);
      await persistTick(context.userId, p.id, tick, now);
      views.push(
        viewOf(
          { ...p, floor_since: tick.floorSince ? new Date(tick.floorSince).toISOString() : null },
          tick.stats,
          {
            departedAt: tick.departedAt ? new Date(tick.departedAt).toISOString() : null,
            farewell: tick.verb ? departLine(p.name, p.species_key) : null,
          },
        ),
      );
    }
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
    const now = Date.now();
    const tickA = tickSanctuary(parentA.species_key, careSeed(parentA, now), asMs(parentA.last_tick, now), floorSinceMs(parentA), now);
    await persistTick(context.userId, parentA.id, tickA, now);
    if (tickA.departedAt) throw new Error("The first guest has left this house.");
    let parentB: CompanionRow | null = null;
    let stageB: LifeStage | undefined;
    if (data.parentB) {
      if (data.parentB === data.parentA) throw new Error("Pair two, or let a starter split. Not one guest twice.");
      const bRows = await sql<CompanionRow>`
        select * from companion_pets
        where id = ${data.parentB} and user_id = ${context.userId} and departed_at is null
      `;
      parentB = bRows[0] ?? null;
      if (!parentB) throw new Error("The second guest is not in this house.");
      const tickB = tickSanctuary(parentB.species_key, careSeed(parentB, now), asMs(parentB.last_tick, now), floorSinceMs(parentB), now);
      await persistTick(context.userId, parentB.id, tickB, now);
      if (tickB.departedAt) throw new Error("The second guest has left this house.");
      stageB = stageOf(tickB.stats, now);
    }
    const verdict = canPair(parentA.species_key, parentB?.species_key ?? null, {
      a: { stage: stageOf(tickA.stats, now) },
      b: stageB ? { stage: stageB } : undefined,
    });
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
  action: z.enum(["feed", "play", "rest", "clean", "medicine", "shed"]),
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

    const now = Date.now();
    const last = asMs(row.last_tick, now);
    const tick = tickSanctuary(row.species_key, careSeed(row, now), last, floorSinceMs(row), now);
    if (tick.departedAt) {
      await persistTick(context.userId, row.id, tick, now);
      throw new Error(departLine(row.name, row.species_key));
    }

    const cared = applySanctuaryCare(data.action as SanctuaryCare, row.species_key, tick.stats, now);
    const next = cared.stats;
    const floorSince = next.health > 0 ? null : tick.floorSince;
    const line = packLine(next);

    await sql`
      update companion_pets
      set hunger = ${next.hunger},
          mood = ${next.mood},
          energy = ${next.energy},
          hygiene = ${next.hygiene},
          health = ${next.health},
          last_tick = ${new Date(now).toISOString()},
          floor_since = ${floorSince ? new Date(floorSince).toISOString() : null},
          line = ${line}
      where id = ${data.petId} and user_id = ${context.userId} and departed_at is null
    `;
    await sql`
      update pet_keepers set ember = ember + 1 where user_id = ${context.userId}
    `;

    const updated = await sql<CompanionRow>`
      select * from companion_pets where id = ${data.petId} and user_id = ${context.userId}
    `;
    return viewOf(updated[0]!, next, { note: cared.note });
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
