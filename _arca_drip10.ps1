$utf8 = New-Object System.Text.UTF8Encoding $false
function Load([string]$p) { return [System.IO.File]::ReadAllText((Join-Path (Get-Location) $p)) }
function Save([string]$p, [string]$t) { [System.IO.File]::WriteAllText((Join-Path (Get-Location) $p), $t, $utf8) }

$headerDup = "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave. Hush still owns cool. Latch still owns drink. Brood still owns emerge. This is the leftover after Hush. Far den ten closes. Hush still owns cool. Ochre still owns reef. Latch still owns drink. Lula still owns loop. Brood still owns emerge. Felt still owns lean. Vein still owns unfurl. Brine still owns frost. Knot still owns many. This is the leftover after Hush. This is the tenth leftover of the far den and closes far ten."
$headerClean = "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave. Hush still owns cool. Latch still owns drink. Brood still owns emerge. Ochre still owns reef. Lula still owns loop. Felt still owns lean. Vein still owns unfurl. Brine still owns frost. Knot still owns many. This is the leftover after Hush. This is the tenth leftover of the far den and closes far ten. Far den ten closes."

$h = Load "desktop\renderer\leftover-house.test.cjs"
$nl = if ($h.Contains("`r`n")) { "`r`n" } else { "`n" }
$titleOld = "Arca leftover waits a window stool as a damp blotter; tenth leftover of the far den done and closes far ten;"
$titleNew = "Arca leftover waits a sash drip as a damp blotter; tenth leftover of the far den done; far ten closed;"
if (-not $h.Contains($titleOld)) { throw "house title" }
$h = $h.Replace($titleOld, $titleNew)
$waitEq = 'assert.equal(WP.WAIT, "wait");'
if (-not $h.Contains($waitEq)) { throw "house WAIT" }
if ($h.Contains('playFor("cyst"), "arca"')) { Write-Output "house arca notEqual already" }
else {
  $h = $h.Replace($waitEq, $waitEq + $nl + '  assert.notEqual(WP.playFor("cyst"), "arca");' + $nl + '  assert.notEqual(WP.playFor("cyst"), "cyst");')
}
Save "desktop\renderer\leftover-house.test.cjs" $h
Write-Output "house ok"

foreach ($doc in @("README.md","desktop\README.md","docs\ARCHITECTURE.md","docs\ROADMAP.md","desktop\renderer\window-play.js","web\src\lib\pets\window-play.ts")) {
  $d = Load $doc
  $n = $d
  $n = $n.Replace("Arca leftover waits a window stool as a damp blotter", "Arca leftover waits a sash drip as a damp blotter")
  $n = $n.Replace("Arca waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave.", "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave.")
  $n = $n.Replace("Arca waits a window stool as a damp blotter", "Arca waits a sash drip as a damp blotter")
  if ($n.Contains($headerDup)) { $n = $n.Replace($headerDup, $headerClean) }
  if ($n -eq $d) { Write-Output "$doc unchanged" } else { Save $doc $n; Write-Output "$doc ok" }
}
Write-Output "DONE"
