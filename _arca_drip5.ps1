$js = Join-Path (Get-Location) "desktop\renderer\window-play.js"
$c = [System.IO.File]::ReadAllText($js)
$c = $c.Replace("// window stool as a damp blotter — sit the wait on the drip; she waits, she does not drink; wait is the tell / traveling cyst", "// sash drip as a damp blotter — sit the wait on the drip; she waits, she does not drink; wait is the tell / traveling cyst")
$c = $c.Replace("// not Ochre pane reef, not Latch drip drink, not Lula apron loop, not Felt lean blotter-felt, not Brood emerge, not Vein damp saucer, not Brine salt-dish frost, not Knot paperweight many", "// not Latch drip drink, not Horn moss-rim fork, not Ochre pane reef, not Hush lamp-shadow cool, not Brood window-foot soil husk")
[System.IO.File]::WriteAllText($js, $c)

$ts = Join-Path (Get-Location) "web\src\lib\pets\window-play.ts"
$t = [System.IO.File]::ReadAllText($ts)
$idx = $t.IndexOf("export function waitPoint")
if ($idx -lt 0) { throw "no TS waitPoint" }
$chunk = $t.Substring($idx, 1400)
$newChunk = $chunk.Replace("const pad = 38;", "const pad = 34;")
$newChunk = $newChunk.Replace("span * 0.58", "span * 0.48")
$newChunk = $newChunk.Replace("const blotter = Math.max(27, size * 0.145);", "const drip = Math.max(64, win.height * 0.15);")
$newChunk = $newChunk.Replace("win.height - blotter", "win.height - drip")
$newChunk = $newChunk.Replace("clamp(lift, 20, maxLift)", "clamp(lift, 28, maxLift)")
$t = $t.Substring(0, $idx) + $newChunk + $t.Substring($idx + 1400)
$t = $t.Replace("if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
$t = $t.Replace("kind === WAIT) return w.width >= 196 && w.height >= 164", "kind === WAIT) return w.width >= 194 && w.height >= 176")
[System.IO.File]::WriteAllText($ts, $t)
Write-Output ("js comment sash=" + $c.Contains("// sash drip as a damp blotter — sit the wait on the drip"))
Write-Output ("ts pad34=" + $t.Substring($t.IndexOf("export function waitPoint"), 1400).Contains("pad = 34"))
Write-Output ("ts drip=" + $t.Substring($t.IndexOf("export function waitPoint"), 1400).Contains("win.height * 0.15"))
Write-Output ("ts size=" + $t.Contains("kind === WAIT) return w.width >= 194 && w.height >= 176"))
