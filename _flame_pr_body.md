## Summary
- Flame leftover (`chicken_of_woods`) drips a real sash stile as warm wood: walk onto the stile, sit the bright bracket, drip once, sit the warm wood, then leave.
- Kind is `drip` (not `shelf` — Frill/oyster owns that; not `cloud` — Puff; not `gold` — Fan; not `flame` / `bracket` / `sulfur`). Right stile (Frill still owns left timber shelf).
- Eighth leftover of the fungi den. Puff leftover still clouds a window apron as a spore dish. Mane still teeths. Ring still zones. Horn still forks. Lattice still hollows. Cap still warts. Frill still shelves.
- Generic-sill pin moves off `chicken_of_woods` onto Starter (`yeast`). Do not start Starter.
- Catalog stays 220. No new pet. No new `/demo` route.

## Test plan
- [x] `desktop/renderer/window-play.test.cjs` (391 pass)
- [x] `web/scripts/window-play.test.mjs` (450 pass / 220 named cases)
- [x] `desktop/renderer/leftover-house.test.cjs` (6 pass)
- [x] playFor(chicken_of_woods) === drip; playFor(oyster) === shelf; playFor(puffball) === cloud; playFor(yeast) === sill
