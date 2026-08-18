export type HouseSeat = {
  id: string;
  name: string;
  departed?: boolean;
};

export type PedigreeGenes = {
  eyes?: readonly [string, string];
  band?: readonly [string, string];
  mask?: readonly [string, string];
  aura?: readonly [string, string];
};

export type OriginPhrase = {
  kind: "nest" | "hatch";
  lead: string;
  wear: string;
  parents: { id: string; name: string; inHouse: boolean }[];
};

function diploid(pair: readonly [string, string] | undefined, fallback: readonly [string, string]) {
  const dip = pair ?? fallback;
  return `${dip[0]}${dip[1]}`;
}

/** Eyes, mark, aura, then the square they wear. Not a lecture. */
export function wearLine(guest: {
  eyes: string;
  mark: string;
  aura: string;
  genes: PedigreeGenes;
}): string {
  const eyes = diploid(guest.genes.eyes, ["A", "A"]);
  const band = diploid(guest.genes.band, ["B", "B"]);
  const mask = diploid(guest.genes.mask, ["m", "m"]);
  const aura = diploid(guest.genes.aura, ["s", "s"]);
  return `${guest.eyes} eyes · ${guest.mark} · ${guest.aura}. ${eyes} · ${band}${mask} · ${aura}`;
}

export function lookHint(guest: { eyes: string; mark: string; aura: string }): string {
  return `${guest.eyes} eyes · ${guest.mark} · ${guest.aura}`;
}

/** A wait in house voice. Not an ISO dump. */
export function duePhrase(dueAt: string | number | Date, now = Date.now()): string {
  const due =
    typeof dueAt === "number" ? dueAt : dueAt instanceof Date ? dueAt.getTime() : Date.parse(dueAt);
  if (Number.isNaN(due)) return "due in a while";
  const ms = due - now;
  if (ms <= 0) return "due now";
  if (ms < 45 * 60 * 1000) return "due this hour";
  if (ms < 18 * 60 * 60 * 1000) return "due today";
  if (ms < 42 * 60 * 60 * 1000) return "due tomorrow";
  if (ms < 7 * 24 * 60 * 60 * 1000) return "due in a few days";
  return "due in a while";
}

/**
 * Pedigree in house voice. Nest names who they came from when those seats
 * are known. Hatch is a draw — parent ids are ignored.
 */
export function originPhrase(
  guest: {
    origin?: string | null;
    parent_a?: string | null;
    parent_b?: string | null;
    eyes: string;
    mark: string;
    aura: string;
    genes: PedigreeGenes;
  },
  house: readonly HouseSeat[] = [],
): OriginPhrase {
  const wear = wearLine(guest);
  if (guest.origin !== "nest") {
    return { kind: "hatch", lead: "Drawn at the hatchery", wear, parents: [] };
  }
  const ids = [guest.parent_a, guest.parent_b].filter((id): id is string => Boolean(id));
  const parents = ids.flatMap((id) => {
    const seat = house.find((row) => row.id === id);
    return seat ? [{ id, name: seat.name, inHouse: !seat.departed }] : [];
  });
  if (parents.length === 0) {
    return { kind: "nest", lead: "Of the nest", wear, parents: [] };
  }
  const lead =
    parents.length === 2 ? `Of ${parents[0]!.name} and ${parents[1]!.name}` : `Of ${parents[0]!.name}`;
  return { kind: "nest", lead, wear, parents };
}
