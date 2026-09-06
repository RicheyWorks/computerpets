## Summary
- Gate leftover (window play only): Giant Clam (`giant_clam` / `gate`) mantles a window stool as a mantle dish. Kind is `mantle` (The mantle is the tell / Review the mantle). Furniture is a window stool (`mantledish`), distinct from Ridge boulder dish, Knurl wrack dish, Chirp grass dish, Veil reef ledge, Tube sand well, Scrub station dish, Scrape rock plate, Paint wreath cup, Wreath column dish, Rose salt pan.
- Eighth leftover of remaining reef/sea after well ten closed. Catalog 220. No new pet. Gate pose art untouched.
- Generic-sill pin moves off `giant_clam` onto leftover-house's next remaining generic-sill guest: Soar (`eagle_ray`). Do not start Soar.

## Test plan
- [x] leftover-house.test.cjs (6/6) via `cmd /c` from clone root with explicit cwd
- [x] window-play.test.cjs Gate leftover + Veil leftover + generic-sill clone test (now `eagle_ray`) — 450/450
- [x] window-play.test.mjs Gate leftover + Veil leftover — 279/279
- Confirm `playFor(sea_cucumber) === papillae`, `playFor(cleaner_shrimp) === station`, `playFor(parrotfish) === rasps`, `playFor(clownfish) === bars`, `playFor(anemone) === tentacles`, `playFor(brain_coral) === valleys`, `playFor(haloarchaea) === blush`, `playFor(sea_star) === reef`, `playFor(nexus) === many`, `playFor(lionfish) === rays`, `playFor(giant_clam) === mantle`, `playFor(eagle_ray) === sill`
