## Summary
- Spark the firefly (`firefly` / `spark`) glows a lower sash light as ink dusk: walk onto the light, sit the glow, then leave. `playFor("firefly")` returns `glow`.
- Same sash-light furniture family as Drake (tip) and Gale (run); different pose. Ink dusk, not Ghost's lamp dusk. The dragon Spark (`spark_dragon`) still crackles an edge. Wink still owns flash. Ember still owns kindle. Ghost still owns week. Night still owns dusk. Comb still owns waggle. Milk still owns weed.
- Fourth leftover of the remaining hive den. Catalog stays 220. Next leftover is Dart (`darner`). Do not start Dart.

## Test plan
- [x] `node --test desktop/renderer/window-play.test.cjs desktop/renderer/leftover-house.test.cjs` (349 pass)
- [x] Spark / Ghost web `window-play.test.mjs` with `--experimental-strip-types`
- [ ] Overlay sit: `/demo/spark` glows the lower sash; `/demo/crackle` still crackles
