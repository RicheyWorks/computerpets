import { beeGuideFor, type BeeGuide } from "./bee-guide";
import { isBee } from "./bees";
import { farGuideFor, type FarGuide } from "./far-guide";
import { isFar } from "./far";
import { fungiGuideFor, type FungiGuide } from "./fungi-guide";
import { isFungus } from "./fungi";
import { gardenGuideFor, type GardenGuide } from "./garden-guide";
import { isGarden } from "./garden";
import { houseGuideFor, type HouseGuide } from "./house-guide";
import { insectGuideFor, type InsectGuide } from "./insect-guide";
import { isInsect } from "./insects";
import { seaGuideFor, type SeaGuide } from "./sea-guide";
import { isSea } from "./sea";
import { isSnake } from "./shed";
import { guideFor, type SnakeGuide } from "./snake-guide";

export type FieldGuide = SnakeGuide | HouseGuide | SeaGuide | GardenGuide | InsectGuide | BeeGuide | FungiGuide | FarGuide;

export function plaqueFor(key: string | undefined | null): FieldGuide | null {
  return guideFor(key) ?? seaGuideFor(key) ?? gardenGuideFor(key) ?? insectGuideFor(key) ?? beeGuideFor(key) ?? fungiGuideFor(key) ?? farGuideFor(key) ?? houseGuideFor(key);
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
  if (isFungus(key)) {
    return { to: "/cellar" as const, label: "All ten in the cellar", verb: "stay" };
  }
  if (isFar(key)) {
    return { to: "/far" as const, label: "All ten in the far den", verb: "stay" };
  }
  return { to: "/study" as const, label: "The rest of the house", verb: "walk" };
}
