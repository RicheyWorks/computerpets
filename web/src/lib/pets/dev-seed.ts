/**
 * The dev-only stand-in kennel (the rule; dev-seed.server.ts does the database part). With sign-in off
 * (VITE_AUTH_ENABLED=false) the page and the server share one dev keeper ("dev-user") on the embedded in-memory
 * PGLite, which starts empty, so the phone check only ever saw an empty kennel. With COMPUTERPETS_DEV_SEED=kennel
 * too, the dev keeper's first sanctuary read hatches these guests, once. Never with a real database (DATABASE_URL
 * set), never with sign-in on, never for anyone but the dev keeper; nothing is written to disk.
 */
export const DEV_SEED_ENV = "COMPUTERPETS_DEV_SEED";
export const DEV_SEED_VALUE = "kennel";

/** Six guests the catalog already has (names only; no new pets, no art). */
export const DEV_SEED_PETS: readonly { key: string; name: string }[] = [
  { key: "red_panda", name: "Mochi" },
  { key: "cat", name: "Pepper" },
  { key: "fox", name: "Juniper" },
  { key: "axolotl", name: "Bloop" },
  { key: "raccoon", name: "Tamsin" },
  { key: "budgie", name: "Kiwi" },
];

export type DevSeedGate = {
  env: Record<string, string | undefined>;
  dbSource: string;
  authConfigured: boolean;
  userId: string;
  devUserId: string;
};

/** Only when asked for, on in-memory PGLite with no DATABASE_URL, with sign-in off, for the dev keeper. */
export function devSeedAllowed(g: DevSeedGate): boolean {
  return (
    g.env[DEV_SEED_ENV] === DEV_SEED_VALUE &&
    g.dbSource === "pglite" &&
    !(g.env.DATABASE_URL ?? "").trim() &&
    !g.authConfigured &&
    !!g.devUserId &&
    g.userId === g.devUserId
  );
}
