## Summary
- Seven (`ladybird` / `seven`) spots a window-box leaf as a leaf dish: walk onto the leaf, sit the spot, then leave. `playFor("ladybird")` returns `spot`.
- Window-box leaf as a leaf dish — not Disc's window-box leaf foliage snip, not Thrum's window-box meadow forage, not Sip's window-box bloom sip, not Haste's sash-jamb crack hunt, not Comb's sill-pan wax waggle. Seven spots; she eats aphids; a beetle, not a rumor of luck. Haste still owns hunt. Disc still owns snip. Thrum still owns forage. Sip still owns sip. Comb still owns waggle. Column still owns nest. Twig still owns freeze. Dart still owns hawk.
- Kind conflicts: not `seven` (guest name), not `hunt` (Haste/house_centipede), not `count` (taken), not `nest` (Column/carpenter_ant), not `freeze` (Twig/stick), not `hawk` (Dart/darner), not `bore` (Auger/carpenter_bee), not `trail` (Eft/newt), not `lady` (generic), not `aphid` (spot is the tell), not `beetle` (generic).
- Eighth leftover of the remaining hive den. Catalog stays 220. Next leftover is Fold (`mantis`). Do not start Fold.

## Test plan
- [x] `node --test desktop/renderer/window-play.test.cjs desktop/renderer/leftover-house.test.cjs` (357 pass)
- [x] Seven / Column / Twig / Dart / Spark / Ghost web `window-play.test.mjs` with `--experimental-strip-types` (169 pass)
- [ ] Overlay sit: `/demo/seven` spots the window-box leaf; `/demo/disc` still snips; `/demo/haste` still hunts
