@echo off
cd /d C:\Users\730ri\projects\ComputerPets
echo === leftover-house ===
node --test desktop\renderer\leftover-house.test.cjs
echo === Boot leftover cjs ===
node --test --test-name-pattern "Boot leftover" desktop\renderer\window-play.test.cjs
echo === Boot leftover mjs ===
node --test --test-name-pattern "Boot leftover" web\scripts\window-play.test.mjs
echo === Boot drop-glass slipper refit cjs ===
node --test --test-name-pattern "drop-glass slipper" desktop\renderer\window-play.test.cjs
echo === Boot drop-glass slipper refit mjs ===
node --test --test-name-pattern "drop-glass slipper" web\scripts\window-play.test.mjs
echo === Arca leftover cjs ===
node --test --test-name-pattern "Arca leftover" desktop\renderer\window-play.test.cjs
echo === Arca leftover mjs ===
node --test --test-name-pattern "Arca leftover" web\scripts\window-play.test.mjs
echo === Arca damp-blotter wait refit cjs ===
node --test --test-name-pattern "damp-blotter wait" desktop\renderer\window-play.test.cjs
echo === Hush leftover cjs ===
node --test --test-name-pattern "Hush leftover" desktop\renderer\window-play.test.cjs
echo DONE
