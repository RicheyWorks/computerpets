import { houseGuideFor, type HouseGuide } from "./house-guide";
import { isSnake } from "./shed";
import { guideFor, type SnakeGuide } from "./snake-guide";

export type FieldGuide = SnakeGuide | HouseGuide;

export function plaqueFor(key: string | undefined | null): FieldGuide | null {
  return guideFor(key) ?? houseGuideFor(key);
}

export function classroomFor(key: string) {
  if (isSnake(key)) {
    return { to: "/snakes" as const, label: "All ten in the den", verb: "crawl" };
  }
  return { to: "/study" as const, label: "The rest of the house", verb: "walk" };
}
