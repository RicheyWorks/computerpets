import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  HATCH_COST,
  SPECIES,
  TRAIT_POOLS,
  findSpecies,
  mintTokenId,
  pickSpecies,
  pickWeightedRarity,
} from "./catalog";
import {
  applyFeed,
  applyPlay,
  applyRest,
  decayStats,
  type CareStats,
} from "./care";

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
};

export type CompanionView = CompanionRow & {
  hunger: number;
  mood: number;
  energy: number;
};

function pick<T extends readonly string[]>(pool: T, rand: () => number) {
  return pool[Math.floor(rand() * pool.length)] ?? pool[0]!;
}

function asIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function hydrate(row: CompanionRow, now = Date.now()): CompanionView {
  const last = Date.parse(asIso(row.last_tick));
  const live = decayStats(
    { hunger: Number(row.hunger), mood: Number(row.mood), energy: Number(row.energy) },
    Number.isNaN(last) ? now : last,
    now,
  );
  return {
    ...row,
    last_tick: asIso(row.last_tick),
    hatched_at: asIso(row.hatched_at),
    hunger: live.hunger,
    mood: live.mood,
    energy: live.energy,
    is_active: Boolean(row.is_active),
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

export const getSanctuary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureKeeper(context.userId);
    const sql = await getSql();
    const keepers = await sql<{ ember: number; hatches: number }>`
      select ember, hatches from pet_keepers where user_id = ${context.userId}
    `;
    const pets = await sql<CompanionRow>`
      select * from companion_pets where user_id = ${context.userId}
      order by hatched_at desc
    `;
    return {
      ember: Number(keepers[0]?.ember ?? 12),
      hatches: Number(keepers[0]?.hatches ?? 0),
      pets: pets.map((p) => hydrate(p)),
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
    const id = crypto.randomUUID();
    const tokenId = mintTokenId();
    const eyes = pick(TRAIT_POOLS.eyes, Math.random);
    const mark = pick(TRAIT_POOLS.mark, Math.random);
    const aura = pick(TRAIT_POOLS.aura, Math.random);

    const existing = await sql<{ id: string }>`
      select id from companion_pets where user_id = ${context.userId} limit 1
    `;
    const makeActive = existing.length === 0;

    await sql`
      insert into companion_pets (
        id, user_id, species_key, name, token_id, rarity,
        hunger, mood, energy, eyes, mark, aura, is_active
      ) values (
        ${id}, ${context.userId}, ${species.key}, ${species.displayName}, ${tokenId}, ${rarity},
        78, 74, 80, ${eyes}, ${mark}, ${aura}, ${makeActive}
      )
    `;
    await sql`
      update pet_keepers
      set ember = ember - ${cost}, hatches = hatches + 1
      where user_id = ${context.userId}
    `;

    const created = await sql<CompanionRow>`
      select * from companion_pets where id = ${id} and user_id = ${context.userId}
    `;
    return hydrate(created[0]!);
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
      select * from companion_pets where id = ${data.petId} and user_id = ${context.userId}
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
      where id = ${data.petId} and user_id = ${context.userId}
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
      where id = ${data.petId} and user_id = ${context.userId}
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
