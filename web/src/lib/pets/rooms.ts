import { BEE_KEYS, isBee } from "./bees";
import { FAR_KEYS, isFar } from "./far";
import { FUNGI_KEYS, isFungus } from "./fungi";
import { GARDEN_KEYS, isGarden } from "./garden";
import { INSECT_KEYS, isInsect } from "./insects";
import { HOUSE_KEYS } from "./house-guide";
import { LIVING_KINDS, type LivingKind } from "./living";
import { SEA_KEYS, isSea } from "./sea";
import { isSnake } from "./shed";
import { SNAKE_KEYS } from "./snakes";

export type RoomId = "house" | "snakes" | "tide" | "garden" | "hive" | "cellar" | "far";

export type RoomPath = "/study" | "/snakes" | "/sea" | "/garden" | "/hive" | "/cellar" | "/far";

export type Room = {
  id: RoomId;
  label: string;
  kicker: string;
  path: RoomPath;
  watchSlug: string;
  watchName: string;
  keys: readonly string[];
  line: string;
};

export const ROOMS: readonly Room[] = [
  {
    id: "house",
    label: "House",
    kicker: "The study",
    path: "/study",
    watchSlug: "rui",
    watchName: "Rui",
    keys: HOUSE_KEYS,
    line: "Twenty companions. The rest of the house.",
  },
  {
    id: "snakes",
    label: "Snakes",
    kicker: "The den",
    path: "/snakes",
    watchSlug: "nori",
    watchName: "Nori",
    keys: SNAKE_KEYS,
    line: "Ten snakes. Blue, then a coat on the wood.",
  },
  {
    id: "tide",
    label: "Tide",
    kicker: "The tide",
    path: "/sea",
    watchSlug: "cup",
    watchName: "Cup",
    keys: SEA_KEYS,
    line: "Ten marine guests. A cooler wash.",
  },
  {
    id: "garden",
    label: "Garden",
    kicker: "The garden",
    path: "/garden",
    watchSlug: "felt",
    watchName: "Felt",
    keys: GARDEN_KEYS,
    line: "Ten plants. They lean to the lamp.",
  },
  {
    id: "hive",
    label: "Hive",
    kicker: "The hive",
    path: "/hive",
    watchSlug: "comb",
    watchName: "Comb",
    keys: [...INSECT_KEYS, ...BEE_KEYS],
    line: "The bees walk. The comb sits. The plaque teaches.",
  },
  {
    id: "cellar",
    label: "Cellar",
    kicker: "The cellar",
    path: "/cellar",
    watchSlug: "frill",
    watchName: "Frill",
    keys: FUNGI_KEYS,
    line: "Ten fungi. Damp wood. Not plants.",
  },
  {
    id: "far",
    label: "Far",
    kicker: "The far den",
    path: "/far",
    watchSlug: "gleam",
    watchName: "Gleam",
    keys: FAR_KEYS,
    line: "Ten guests that never evolved here.",
  },
];

const BY_ID = Object.fromEntries(ROOMS.map((room) => [room.id, room])) as Record<RoomId, Room>;

export function roomById(id: RoomId) {
  return BY_ID[id];
}

export function roomOf(key: string | undefined | null): Room {
  if (!key) return BY_ID.house;
  if (isSnake(key)) return BY_ID.snakes;
  if (isSea(key)) return BY_ID.tide;
  if (isGarden(key)) return BY_ID.garden;
  if (isInsect(key) || isBee(key)) return BY_ID.hive;
  if (isFungus(key)) return BY_ID.cellar;
  if (isFar(key)) return BY_ID.far;
  return BY_ID.house;
}

export function guestsIn(room: Room | RoomId): LivingKind[] {
  const keys = (typeof room === "string" ? BY_ID[room] : room).keys;
  return LIVING_KINDS.filter((kind) => keys.includes(kind.key));
}
