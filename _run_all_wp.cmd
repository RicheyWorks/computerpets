node --test desktop\renderer\window-play.test.cjs
if errorlevel 1 exit /b 1
node --test web\scripts\window-play.test.mjs

