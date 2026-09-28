/**
 * The stand-in kennel's database part (the rule is in dev-seed.ts): the guests to hatch for this keeper now, which
 * is the seed list the first time the dev keeper opens the kennel and [] every other time or anywhere else.
 */
import { DEV_USER_ID, authConfigured } from "@/lib/auth/verify.server";
import { dbSource, getSql } from "@/lib/db";
import { DEV_SEED_PETS, devSeedAllowed } from "./dev-seed";

export async function devSeedPets(userId: string): Promise<readonly { key: string; name: string }[]> {
  if (!devSeedAllowed({ env: process.env, dbSource, authConfigured, userId, devUserId: DEV_USER_ID })) return [];
  const sql = await getSql();
  const any = await sql<{ id: string }>`select id from companion_pets where user_id = ${userId} limit 1`;
  return any.length ? [] : DEV_SEED_PETS;
}
