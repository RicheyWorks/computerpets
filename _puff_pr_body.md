## Summary
- Puff leftover (`puffball`) clouds a real window apron as a spore dish: walk onto the apron, sit the soft mound, cloud once, sit the dish, then leave.
- Kind is `cloud` (not `puff` — Pebble/toad owns that; not `dust` — Floss owns that; not Mane `teeth`, not Ring `zones`, not Horn `fork`, not Lattice `hollow`, not Cap `warts`, not Frill `shelf`).
- Seventh leftover of the fungi den. Mane leftover still teeths a sash gap as a wood wound. Ring still zones. Horn still forks. Lattice still hollows. Cap still warts. Frill still shelves.
- Generic-sill pin moves off `puffball` onto Flame (`chicken_of_woods`). Do not start Flame.
- Catalog stays 220. No new pet. No new `/demo` route.

## Test plan
- [x] `desktop/renderer/window-play.test.cjs` (389 pass)
- [x] `web/scripts/window-play.test.mjs` (218 pass expected)
- [x] `desktop/renderer/leftover-house.test.cjs` (6 pass)
- [x] playFor(puffball) === cloud; playFor(toad) === puff; playFor(lions_mane) === teeth; playFor(chicken_of_woods) === sill
