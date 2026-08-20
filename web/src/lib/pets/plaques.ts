import { beeGuideFor, type BeeGuide } from "./bee-guide";
import { isBee } from "./bees";
import { cornerGuideFor, type CornerGuide } from "./corner-guide";
import { isCorner } from "./corner";
import { farGuideFor, type FarGuide } from "./far-guide";
import { isFar } from "./far";
import { fungiGuideFor, type FungiGuide } from "./fungi-guide";
import { isFungus } from "./fungi";
import { gardenGuideFor, type GardenGuide } from "./garden-guide";
import { isGarden } from "./garden";
import { houseGuideFor, type HouseGuide } from "./house-guide";
import { insectGuideFor, type InsectGuide } from "./insect-guide";
import { isInsect } from "./insects";
import { pondGuideFor, type PondGuide } from "./pond-guide";
import { isPond } from "./pond";
import { roostGuideFor, type RoostGuide } from "./roost-guide";
import { isRoost } from "./roost";
import { seaGuideFor, type SeaGuide } from "./sea-guide";
import { isSea } from "./sea";
import { isSnake } from "./shed";
import { guideFor, type SnakeGuide } from "./snake-guide";
import { wellGuideFor, type WellGuide } from "./well-guide";
import { isWell } from "./well";
import { creekGuideFor, type CreekGuide } from "./creek-guide";
import { isCreek } from "./creek";
import { stoneGuideFor, type StoneGuide } from "./stone-guide";
import { isStone } from "./stone";
import { woodGuideFor, type WoodGuide } from "./wood-guide";
import { isWood } from "./wood";

export type FieldGuide = SnakeGuide | HouseGuide | SeaGuide | GardenGuide | InsectGuide | BeeGuide | FungiGuide | FarGuide | PondGuide | RoostGuide | WellGuide | CornerGuide | WoodGuide | StoneGuide | CreekGuide;

export function plaqueFor(key: string | undefined | null): FieldGuide | null {
  return guideFor(key) ?? seaGuideFor(key) ?? gardenGuideFor(key) ?? insectGuideFor(key) ?? beeGuideFor(key) ?? pondGuideFor(key) ?? roostGuideFor(key) ?? cornerGuideFor(key) ?? woodGuideFor(key) ?? stoneGuideFor(key) ?? creekGuideFor(key) ?? fungiGuideFor(key) ?? farGuideFor(key) ?? wellGuideFor(key) ?? houseGuideFor(key);
}

export function classroomFor(key: string) {
  if (isSnake(key)) {
    return { to: "/snakes" as const, label: "All ten in the den", verb: "crawl" };
  }
  if (isSea(key)) {
    return { to: "/sea" as const, label: "All ten in the tide", verb: "swim" };
  }
  if (isGarden(key)) {
    return { to: "/garden" as const, label: "All ten in the garden", verb: "grow" };
  }
  if (isInsect(key) || isBee(key)) {
    return { to: "/hive" as const, label: isBee(key) ? "The hive. Bees and comb." : "All ten in the hive", verb: "stay" };
  }
  if (isPond(key)) {
    return { to: "/pond" as const, label: "All ten in the pond", verb: "stay" };
  }
  if (isRoost(key)) {
    return { to: "/roost" as const, label: "All ten in the roost", verb: "stay" };
  }
  if (isCorner(key)) {
    return { to: "/corner" as const, label: "All ten in the corner", verb: "stay" };
  }
  if (isWood(key)) {
    return { to: "/wood" as const, label: "All ten in the wood", verb: "stay" };
  }
  if (isStone(key)) {
    return { to: "/stone" as const, label: "All ten in the stone", verb: "stay" };
  }
  if (isCreek(key)) {
    return { to: "/creek" as const, label: "All ten in the creek", verb: "swim" };
  }
  if (isFungus(key)) {
    return { to: "/cellar" as const, label: "All ten in the cellar", verb: "stay" };
  }
  if (isWell(key)) {
    return { to: "/well" as const, label: "All ten in the well", verb: "stay" };
  }
  if (isFar(key)) {
    return { to: "/far" as const, label: "All ten in the far den", verb: "stay" };
  }
  return { to: "/study" as const, label: "The rest of the house", verb: "walk" };
}
