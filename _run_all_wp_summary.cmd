@echo off
node --test desktop\renderer\window-play.test.cjs > _wp_cjs_out.txt 2>&1
echo CJS_EXIT=%ERRORLEVEL% >> _wp_cjs_out.txt
node --test web\scripts\window-play.test.mjs > _wp_mjs_out.txt 2>&1
echo MJS_EXIT=%ERRORLEVEL% >> _wp_mjs_out.txt

