## Summary
- Hide leftover (window play only): Nassau Grouper (`grouper` / `hide`) holes a sash well as a reef hole. Kind is `hole` (The hole is the tell / Review the hole). Furniture is a sash well (`reefhole`), distinct from Scrub sash-well station dish, Rose sash-well salt pan, Lattice sash-well leaf mold, Velvet sash-well silk burrow, Tube window-well sand well, Silver window-well bank hole, Soar mid-pane reef sky, Gate stool mantle dish. Kind must not be `hide` (guest name), not key `grouper`, not Door/gape/moray, not Lance/bill, not soar/Hook, not spots/Soar, not mantle/Gate, not rays/Veil, not papillae/Tube, not station/Scrub, not Silver's `go`.
- Tenth leftover of remaining reef/sea after well ten closed. Reef/sea leftovers closed (Veil→Gate→Soar→Hide). Catalog 220. No new pet. Hide pose art untouched.
- Generic-sill pin moves off `grouper`. Hide was the last catalog generic-sill pin in this campaign queue — next leftover none; no generic-sill pin remains. Fallthrough sill path kept for unknown keys only. Do not start another guest.

## Test plan
- [x] leftover-house.test.cjs (6/6) via `cmd /c` from clone root with explicit cwd
- [x] window-play.test.cjs Hide leftover + Soar leftover + Gate leftover + unknown-key sill clone test — 452/452
- [x] window-play.test.mjs Hide leftover + Soar leftover + Gate leftover — 281/281
- Confirm `playFor(grouper) === hole`, `playFor(eagle_ray) === spots`, `playFor(giant_clam) === mantle`, `playFor(__sill_fallthrough__) === sill`
