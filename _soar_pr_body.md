## Summary
- Soar leftover (window play only): Spotted Eagle Ray (`eagle_ray` / `soar`) spots a mid pane as a reef sky. Kind is `spots` (The spots are the tell / Review the spots). Furniture is a mid pane (`reefsky`), distinct from Kite barrel pane-as-bowl-sky, Choir/Nimbus mid-pane air/methane, Gleam bright pane, Drake/Spot/Spark sash lights, Veil reef ledge, Gate stool mantle dish. Kind must not be `soar` (Hook/red_tail), not guest name Soar, not key eagle_ray, not `spot` (Seven/ladybird).
- Ninth leftover of remaining reef/sea after well ten closed. Catalog 220. No new pet. Soar pose art untouched.
- Generic-sill pin moves off `eagle_ray` onto leftover-house's next remaining generic-sill guest: Hide (`grouper`). Do not start Hide.

## Test plan
- [x] leftover-house.test.cjs (6/6) via `cmd /c` from clone root with explicit cwd
- [x] window-play.test.cjs Soar leftover + Gate leftover + Veil leftover + generic-sill clone test (now `grouper`) — 451/451
- [x] window-play.test.mjs Soar leftover + Gate leftover + Veil leftover — 280/280
- Confirm `playFor(giant_clam) === mantle`, `playFor(lionfish) === rays`, `playFor(eagle_ray) === spots`, `playFor(grouper) === sill`