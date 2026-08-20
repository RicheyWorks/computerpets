import { BEE_KEYS, isBee } from "./bees";
import { CORNER_KEYS, isCorner } from "./corner";
import { FAR_KEYS, isFar } from "./far";
import { FUNGI_KEYS, isFungus } from "./fungi";
import { GARDEN_KEYS, isGarden } from "./garden";
import { INSECT_KEYS, isInsect } from "./insects";
import { HOUSE_KEYS } from "./house-guide";
import { LIVING_KINDS, type LivingKind } from "./living";
import { POND_KEYS, isPond } from "./pond";
import { ROOST_KEYS, isRoost } from "./roost";
import { SEA_KEYS, isSea } from "./sea";
import { isSnake } from "./shed";
import { SNAKE_KEYS } from "./snakes";
import { CREEK_KEYS, isCreek } from "./creek";
import { LOG_KEYS, isLog } from "./log";
import { SHORE_KEYS, isShore } from "./shore";
import { STONE_KEYS, isStone } from "./stone";
import { WELL_KEYS, isWell } from "./well";
import { WOOD_KEYS, isWood } from "./wood";

export type RoomId = "house" | "snakes" | "tide" | "garden" | "hive" | "pond" | "roost" | "corner" | "wood" | "stone" | "creek" | "log" | "shore" | "cellar" | "well" | "far";

export type RoomPath = "/study" | "/snakes" | "/sea" | "/garden" | "/hive" | "/pond" | "/roost" | "/corner" | "/wood" | "/stone" | "/creek" | "/log" | "/shore" | "/cellar" | "/well" | "/far";

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
    line: "The hive keeps a line. Brood, stores, a quiet if neglected.",
  },
  {
    id: "pond",
    label: "Pond",
    kicker: "The pond",
    path: "/pond",
    watchSlug: "reed",
    watchName: "Reed",
    keys: POND_KEYS,
    line: "Ten pond guests. A frog is not a toad.",
  },
  {
    id: "roost",
    label: "Roost",
    kicker: "The roost",
    path: "/roost",
    watchSlug: "soot",
    watchName: "Soot",
    keys: ROOST_KEYS,
    line: "Ten birds. A crow is not a raven.",
  },
  {
    id: "corner",
    label: "Corner",
    kicker: "The corner",
    path: "/corner",
    watchSlug: "loom",
    watchName: "Loom",
    keys: CORNER_KEYS,
    line: "Ten guests of the corner. A harvestman is not a spider.",
  },
  {
    id: "wood",
    label: "Wood",
    kicker: "The wood",
    path: "/wood",
    watchSlug: "rack",
    watchName: "Rack",
    keys: WOOD_KEYS,
    line: "Ten of the wood. A bat is not a bird. A porcupine is not Burr.",
  },
  {
    id: "stone",
    label: "Stone",
    kicker: "The stone",
    path: "/stone",
    watchSlug: "pad",
    watchName: "Pad",
    keys: STONE_KEYS,
    line: "Ten of the stone. A tuatara is not a lizard. An alligator is not a crocodile.",
  },
  {
    id: "creek",
    label: "Creek",
    kicker: "The creek",
    path: "/creek",
    watchSlug: "lunge",
    watchName: "Lunge",
    keys: CREEK_KEYS,
    line: "Ten of the creek. A bass is not a trout. A lamprey is not an eel.",
  },
  {
    id: "log",
    label: "Log",
    kicker: "The log",
    path: "/log",
    watchSlug: "haste",
    watchName: "Haste",
    keys: LOG_KEYS,
    line: "Ten under the log. A millipede is not a centipede. A pillbug is not an insect.",
  },
  {
    id: "shore",
    label: "Shore",
    kicker: "The shore",
    path: "/shore",
    watchSlug: "wave",
    watchName: "Wave",
    keys: SHORE_KEYS,
    line: "Ten of the shore. A fiddler is not a hermit. A ghost crab is not a horseshoe crab.",
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
    id: "well",
    label: "Well",
    kicker: "The well",
    path: "/well",
    watchSlug: "boot",
    watchName: "Boot",
    keys: WELL_KEYS,
    line: "Ten guests of the rest. A paramecium is not an animal.",
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
  if (isPond(key)) return BY_ID.pond;
  if (isRoost(key)) return BY_ID.roost;
  if (isCorner(key)) return BY_ID.corner;
  if (isWood(key)) return BY_ID.wood;
  if (isStone(key)) return BY_ID.stone;
  if (isCreek(key)) return BY_ID.creek;
  if (isLog(key)) return BY_ID.log;
  if (isShore(key)) return BY_ID.shore;
  if (isFungus(key)) return BY_ID.cellar;
  if (isWell(key)) return BY_ID.well;
  if (isFar(key)) return BY_ID.far;
  return BY_ID.house;
}

export function guestsIn(room: Room | RoomId): LivingKind[] {
  const keys = (typeof room === "string" ? BY_ID[room] : room).keys;
  return LIVING_KINDS.filter((kind) => keys.includes(kind.key));
}
