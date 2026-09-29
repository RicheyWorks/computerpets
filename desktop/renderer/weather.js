/** Daily weather the house already uses. Same civil-day clock. Same sit-or-swim idle. */
(function (root) {
  function weatherOf(now, live) {
    if (live === "clear" || live === "rain" || live === "wind" || live === "heat") return live;
    now = now || new Date();
    const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
    const n = ((day * 9301 + 49297) % 233280) / 233280;
    if (n < 0.4) return "clear";
    if (n < 0.62) return "rain";
    if (n < 0.82) return "wind";
    return "heat";
  }

  function weatherLabel(w) {
    if (w === "rain") return "Rain";
    if (w === "wind") return "Wind";
    if (w === "heat") return "Heat";
    return "Clear";
  }

  function weatherLine(key, w) {
    if (w === "rain") {
      if (key === "goldfish" || key === "axolotl" || key === "turtle" || key === "penguin" || key === "mallard" || key === "canada_goose") return "Proper weather. At last.";
      return "It is raining outside. I will stay in, thanks.";
    }
    if (w === "wind") {
      if (key === "budgie" || key === "parrot" || key === "toucan" || key === "phoenix" || key === "crow" || key === "raven" || key === "red_tail" || key === "chickadee" || key === "hummingbird" || key === "pileated" || key === "robin") return "The air has opinions.";
      return "Something moved that was not me.";
    }
    if (w === "heat") {
      if (key === "iguana" || key === "turtle" || key === "dragon" || key === "cat") return "This patch of warmth is reserved.";
      if (key === "cyber_dragon") return "The glow is reserved. Heat is weather I already keep.";
      if (key === "volt_dragon") return "The coil is reserved. Heat is weather I already keep.";
      if (key === "trace_dragon") return "The path is reserved. Heat is weather I already keep.";
      if (key === "flux_dragon") return "The field is reserved. Heat is weather I already keep.";
      if (key === "spark_dragon") return "The crackle is reserved. Heat is weather I already keep.";
      if (key === "ion_dragon") return "The haze is reserved. Heat is weather I already keep.";
      if (key === "gauss_dragon") return "The filings are reserved. Heat is weather I already keep.";
      if (key === "relay_dragon") return "The click is reserved. Heat is weather I already keep.";
      if (key === "fuse_dragon") return "The filament is reserved. Heat is weather I already keep.";
      if (key === "ground_dragon") return "The strap is reserved. Heat is weather I already keep.";
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

  function weatherIdle(key, w) {
    if (w === "rain") {
      if (key === "goldfish" || key === "axolotl" || key === "penguin" || key === "mallard" || key === "canada_goose") return "wander";
      return "sit";
    }
    if (w === "heat" && (key === "iguana" || key === "turtle" || key === "cat" || key === "dragon" || key === "cyber_dragon" || key === "volt_dragon" || key === "trace_dragon" || key === "flux_dragon" || key === "spark_dragon" || key === "ion_dragon" || key === "gauss_dragon" || key === "relay_dragon" || key === "fuse_dragon" || key === "ground_dragon" || key.includes("snake") || key.includes("boa") || key.includes("python") || key === "hognose" || key === "garter")) return "sit";
    if (w === "wind" && (key === "budgie" || key === "parrot" || key === "toucan" || key === "phoenix" || key === "crow" || key === "raven" || key === "red_tail" || key === "chickadee" || key === "hummingbird" || key === "pileated" || key === "robin")) return "wander";
    return null;
  }

  const api = { weatherOf, weatherLabel, weatherLine, weatherIdle };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWeather = api;
})(typeof window !== "undefined" ? window : globalThis);
