import { gardenGuideFor, type GardenGuide } from "./garden-guide";
import { isGarden } from "./garden";
import { houseGuideFor, type HouseGuide } from "./house-guide";
import { seaGuideFor, type SeaGuide } from "./sea-guide";
import { isSea } from "./sea";
import { isSnake } from "./shed";
import { guideFor, type SnakeGuide } from "./snake-guide";

export type FieldGuide = SnakeGuide | HouseGuide | SeaGuide | GardenGuide;

export function plaqueFor(key: string | undefined | null): FieldGuide | null {
  return guideFor(key) ?? seaGuideFor(key) ?? gardenGuideFor(key) ?? houseGuideFor(key);
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
  return { to: "/study" as const, label: "The rest of the house", verb: "walk" };
}
