$utf8 = New-Object System.Text.UTF8Encoding $false
function Load([string]$p) { return [System.IO.File]::ReadAllText((Join-Path (Get-Location) $p)) }
function Save([string]$p, [string]$t) { [System.IO.File]::WriteAllText((Join-Path (Get-Location) $p), $t, $utf8) }

$headerDup = "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave. Hush still owns cool. Latch still owns drink. Brood still owns emerge. This is the leftover after Hush. Far den ten closes. Hush still owns cool. Ochre still owns reef. Latch still owns drink. Lula still owns loop. Brood still owns emerge. Felt still owns lean. Vein still owns unfurl. Brine still owns frost. Knot still owns many. This is the leftover after Hush. This is the tenth leftover of the far den and closes far ten."
$headerClean = "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave. Hush still owns cool. Latch still owns drink. Brood still owns emerge. Ochre still owns reef. Lula still owns loop. Felt still owns lean. Vein still owns unfurl. Brine still owns frost. Knot still owns many. This is the leftover after Hush. This is the tenth leftover of the far den and closes far ten. Far den ten closes."

function PatchCopy([string]$t) {
  $t = $t.Replace("Arca leftover waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave", "Arca leftover waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave")
  $t = $t.Replace("it waits a window stool as a damp blotter", "it waits a sash drip as a damp blotter")
  $t = $t.Replace("a walk onto the stool, not a cling", "a walk onto the drip, not a cling")
  $t = $t.Replace("the window stool as a damp blotter, not the sky", "the sash drip as a damp blotter, not the sky")
  $t = $t.Replace("a real stool blotter, not a thin strip", "a real sash drip, not a thin strip")
  $t = $t.Replace("a real stool blotter, not a thinner frame", "a real sash drip, not a thinner drip")
  $t = $t.Replace("a real window stool as a damp blotter", "a real sash drip as a damp blotter")
  $t = $t.Replace("it walks onto the window stool as a damp blotter", "it walks onto the sash drip as a damp blotter")
  $t = $t.Replace("it stays on the stool blotter", "it stays on the sash drip")
  $t = $t.Replace("Arca leftover waits a window stool as a damp blotter", "Arca leftover waits a sash drip as a damp blotter")
  $t = $t.Replace("Arca waits a window stool as a damp blotter", "Arca waits a sash drip as a damp blotter")
  if ($t.Contains($headerDup)) { $t = $t.Replace($headerDup, $headerClean) }
  return $t
}

function PatchArcaSize([string]$t, [string]$name) {
  $oldShort = '[{ id: "short", x: 200, y: 80, width: 194, height: 162 }], 80, "cyst"'
  $newShort = '[{ id: "short", x: 200, y: 80, width: 193, height: 176 }], 80, "cyst"'
  if (-not $t.Contains($oldShort)) { throw "$name missing cyst short gate" }
  $t = $t.Replace($oldShort, $newShort)
  $oldOk = '[{ id: "wait", x: 200, y: 80, width: 196, height: 164 }], 80, "cyst"'
  $newOk = '[{ id: "wait", x: 200, y: 80, width: 194, height: 176 }], 80, "cyst"'
  if (-not $t.Contains($oldOk)) { throw "$name missing cyst okWait gate" }
  $t = $t.Replace($oldOk, $newOk)
  $anchor = 'assert.ok(okWait, "a real sash drip as a damp blotter");'
  $extra = 'assert.ok(okWait, "a real sash drip as a damp blotter");' + "`n" + '  const shortH = P.pickTarget([{ id: "shortH", x: 200, y: 80, width: 194, height: 175 }], 80, "cyst", WORK, P.SPRITE);' + "`n" + '  assert.equal(shortH, null, "a real sash drip, not a shorter drip");' + "`n" + '  const drinkOk = P.pickTarget([{ id: "drip", x: 200, y: 80, width: 194, height: 176 }], 80, "leech", WORK, P.SPRITE);' + "`n" + '  assert.ok(drinkOk, "Latch still takes a sash drip");' + "`n" + '  const forkOk = P.pickTarget([{ id: "fork", x: 200, y: 80, width: 194, height: 176 }], 80, "chanterelle", WORK, P.SPRITE);' + "`n" + '  assert.ok(forkOk, "Horn still takes a sash drip");'
  if (-not $t.Contains($anchor)) { throw "$name missing okWait assert after copy" }
  $t = $t.Replace($anchor, $extra)
  $cool = 'assert.ok(Math.abs(wait.x - cool.x) > 8 || Math.abs(wait.lift - cool.lift) > 1, "not Hush lamp-shadow cool");'
  $coolPlus = 'assert.ok(Math.abs(wait.x - cool.x) > 8 || Math.abs(wait.lift - cool.lift) > 1, "not Hush lamp-shadow cool");' + "`n" + '  const fork = P.forkPoint(WIN, P.SPRITE, WORK);' + "`n" + '  assert.ok(Math.abs(wait.lift - drink.lift) < 8, "same sash drip furniture family as Latch");' + "`n" + '  assert.ok(Math.abs(wait.x - drink.x) > 20, "same drip, not Latch''s drink spot");' + "`n" + '  assert.ok(Math.abs(wait.x - fork.x) > 20, "same drip, not Horn''s fork spot");'
  if (-not $t.Contains($cool)) { throw "$name missing cool distinguish" }
  $t = $t.Replace($cool, $coolPlus)
  return $t
}

foreach ($rel in @("desktop\renderer\window-play.test.cjs","web\scripts\window-play.test.mjs")) {
  $t = Load $rel
  $t = PatchCopy $t
  $t = PatchArcaSize $t $rel
  Save $rel $t
  Write-Output "$rel ok"
}

$h = Load "desktop\renderer\leftover-house.test.cjs"
$h = $h.Replace("Arca leftover waits a window stool as a damp blotter; tenth leftover of the far den done and closes far ten;", "Arca leftover waits a sash drip as a damp blotter; tenth leftover of the far den done; far ten closed;")
$cystOld = 'assert.equal(WP.playFor("cyst"), "wait");'
$cystNeedle = $cystOld + "`n" + '  assert.equal(WP.WAIT, "wait");'
$cystNew = $cystOld + "`n" + '  assert.equal(WP.WAIT, "wait");' + "`n" + '  assert.notEqual(WP.playFor("cyst"), "arca");' + "`n" + '  assert.notEqual(WP.playFor("cyst"), "cyst");'
if (-not $h.Contains($cystNeedle)) { throw "house cyst block" }
$h = $h.Replace($cystNeedle, $cystNew)
$h = PatchCopy $h
Save "desktop\renderer\leftover-house.test.cjs" $h
Write-Output "house ok"

foreach ($doc in @("README.md","desktop\README.md","docs\ARCHITECTURE.md","docs\ROADMAP.md","desktop\renderer\window-play.js","web\src\lib\pets\window-play.ts")) {
  $d = Load $doc
  $n = PatchCopy $d
  if ($n -eq $d) { Write-Output "$doc no extra copy" } else { Save $doc $n; Write-Output "$doc copy ok" }
}
Write-Output "DONE"
