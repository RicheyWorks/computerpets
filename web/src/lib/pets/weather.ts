export type Weather = "clear" | "rain" | "wind" | "heat";

export function weatherOf(now = new Date()): Weather {
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  const n = ((day * 9301 + 49297) % 233280) / 233280;
  if (n < 0.4) return "clear";
  if (n < 0.62) return "rain";
  if (n < 0.82) return "wind";
  return "heat";
}

export function weatherLabel(w: Weather) {
  if (w === "rain") return "Rain";
  if (w === "wind") return "Wind";
  if (w === "heat") return "Heat";
  return "Clear";
}

export function weatherLine(key: string, w: Weather) {
  if (w === "rain") {
    if (key === "goldfish" || key === "axolotl" || key === "turtle" || key === "penguin" || key === "mallard" || key === "canada_goose") return "Proper weather. At last.";
    return "The blotter is honest about rain.";
  }
  if (w === "wind") {
    if (key === "budgie" || key === "parrot" || key === "toucan" || key === "phoenix" || key === "crow" || key === "raven" || key === "red_tail" || key === "chickadee" || key === "hummingbird") return "The air has opinions.";
    return "Something moved that was not me.";
  }
  if (w === "heat") {
    if (key === "iguana" || key === "turtle" || key === "dragon" || key === "cat") return "This patch of warmth is reserved.";
    if (
      key === "ball_python" ||
      key === "corn_snake" ||
      key === "kingsnake" ||
      key === "green_tree_python" ||
      key === "hognose" ||
      key === "garter" ||
      key === "boa" ||
      key === "milk_snake" ||
      key === "rosy_boa" ||
      key === "carpet_python"
    )
      return "Heat. I was waiting for this clause.";
    return "The lamp is working overtime.";
  }
  return null;
}

export function weatherIdle(key: string, w: Weather): "wander" | "sit" | "sleep" | null {
  if (w === "rain") {
    if (key === "goldfish" || key === "axolotl" || key === "penguin" || key === "mallard" || key === "canada_goose") return "wander";
    return "sit";
  }
  if (w === "heat" && (key === "iguana" || key === "turtle" || key === "cat" || key === "dragon" || key.includes("snake") || key.includes("boa") || key.includes("python") || key === "hognose" || key === "garter")) return "sit";
  if (w === "wind" && (key === "budgie" || key === "parrot" || key === "toucan" || key === "phoenix" || key === "crow" || key === "raven" || key === "red_tail" || key === "chickadee" || key === "hummingbird" || key === "pileated" || key === "robin")) return "wander";
  return null;
}
