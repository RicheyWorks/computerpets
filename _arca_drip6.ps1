$utf8 = New-Object System.Text.UTF8Encoding $false
function Load([string]$p) { return [System.IO.File]::ReadAllText((Join-Path (Get-Location) $p)) }
function Save([string]$p, [string]$t) { [System.IO.File]::WriteAllText((Join-Path (Get-Location) $p), $t, $utf8) }
function MustContain([string]$name, [string]$t, [string]$s) {
  if (-not $t.Contains($s)) { throw "$name missing: $s" }
}

$arcaOld = "Arca waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave."
$arcaNew = "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave. Hush still owns cool. Latch still owns drink. Brood still owns emerge. This is the leftover after Hush. Far den ten closes."

# --- JS waitPoint (unique function; do not touch other clamps) ---
$js = Load "desktop\renderer\window-play.js"
MustContain "js" $js $arcaOld
$jsOldPt = @"
  function waitPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 38;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.58;
    // window stool as a damp blotter — sit sealed cyst on interior stool (papers damp); wait is the tell / traveling cyst
    // not Ochre pane reef, not Latch drip drink, not Lula apron loop, not Felt lean blotter-felt, not Brood emerge, not Vein damp saucer, not Brine salt-dish frost, not Knot paperweight many
    const blotter = Math.max(27, size * 0.145);
    const gripY = win.y + win.height - blotter;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 20, maxLift) };
  }
"@
$jsNewPt = @"
  function waitPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 34;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.48;
    // sash drip as a damp blotter — sit the wait on the drip; she waits, she does not drink; wait is the tell / traveling cyst
    // not Latch drip drink, not Horn moss-rim fork, not Ochre pane reef, not Hush lamp-shadow cool, not Brood window-foot soil husk
    const drip = Math.max(64, win.height * 0.15);
    const gripY = win.y + win.height - drip;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }
"@
MustContain "js waitPoint" $js $jsOldPt
$js = $js.Replace($jsOldPt, $jsNewPt)
$js = $js.Replace("if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
$js = $js.Replace("// walk onto the stool — take the damp blotter", "// walk onto the drip — take the damp blotter")
$js = $js.Replace("// sit the wait on the window stool as a damp blotter (papers damp)", "// sit the wait on the sash drip as a damp blotter; she waits, she does not drink")
$js = $js.Replace($arcaOld, $arcaNew)
MustContain "js drip x" $js "span * 0.48"
MustContain "js WAIT size" $js "if (kind === WAIT) return w.width >= 194 && w.height >= 176;"
MustContain "js header" $js "Arca waits a sash drip as a damp blotter: walk onto the drip"
if ($js.Contains("span * 0.58") -and $js.Substring($js.IndexOf("function waitPoint"), 800).Contains("0.58")) { throw "js waitPoint still 0.58" }
Save "desktop\renderer\window-play.js" $js
Write-Output "js ok"

# --- TS waitPoint by unique markers ---
$ts = Load "web\src\lib\pets\window-play.ts"
MustContain "ts" $ts $arcaOld
$tsStart = $ts.IndexOf("export function waitPoint")
$tsEnd = $ts.IndexOf("export function waitFace")
if ($tsStart -lt 0 -or $tsEnd -lt 0 -or $tsEnd -le $tsStart) { throw "ts waitPoint markers" }
$tsNewPt = @"
export function waitPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 34;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.48;
  // sash drip as a damp blotter — sit the wait on the drip; she waits, she does not drink; wait is the tell / traveling cyst
  // not Latch drip drink, not Horn moss-rim fork, not Ochre pane reef, not Hush lamp-shadow cool, not Brood window-foot soil husk
  const drip = Math.max(64, win.height * 0.15);
  const gripY = win.y + win.height - drip;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 28, maxLift) };
}

"@
$ts = $ts.Substring(0, $tsStart) + $tsNewPt + $ts.Substring($tsEnd)
$ts = $ts.Replace("if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
$ts = $ts.Replace("// walk onto the stool — take the damp blotter", "// walk onto the drip — take the damp blotter")
$ts = $ts.Replace("// sit the wait on the window stool as a damp blotter (papers damp)", "// sit the wait on the sash drip as a damp blotter; she waits, she does not drink")
$ts = $ts.Replace($arcaOld, $arcaNew)
MustContain "ts WAIT size" $ts "if (kind === WAIT) return w.width >= 194 && w.height >= 176;"
MustContain "ts header" $ts "Arca waits a sash drip as a damp blotter: walk onto the drip"
$wpChunk = $ts.Substring($ts.IndexOf("export function waitPoint"), 700)
if (-not $wpChunk.Contains("span * 0.48")) { throw "ts waitPoint missing 0.48" }
if (-not $wpChunk.Contains("win.height * 0.15")) { throw "ts waitPoint missing drip height" }
if (-not $wpChunk.Contains("clamp(lift, 28, maxLift)")) { throw "ts waitPoint missing clamp 28" }
Save "web\src\lib\pets\window-play.ts" $ts
Write-Output "ts ok"

function PatchTests([string]$rel) {
  $t = Load $rel
  if (-not $t.Contains("Arca leftover waits a window stool as a damp blotter")) { throw "$rel missing Arca test" }
  $t = $t.Replace("Arca leftover waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave", "Arca leftover waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave")
  $t = $t.Replace("it waits a window stool as a damp blotter", "it waits a sash drip as a damp blotter")
  $t = $t.Replace("a walk onto the stool, not a cling", "a walk onto the drip, not a cling")
  $t = $t.Replace("the window stool as a damp blotter, not the sky", "the sash drip as a damp blotter, not the sky")
  $t = $t.Replace('assert.equal(tiny, null, "a real stool blotter, not a thin strip");', 'assert.equal(tiny, null, "a real sash drip, not a thin strip");')
  $oldSize = @"
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 194, height: 162 }], 80, "cyst", WORK, P.SPRITE);
  assert.equal(short, null, "a real stool blotter, not a thinner frame");
  const okWait = P.pickTarget([{ id: "wait", x: 200, y: 80, width: 196, height: 164 }], 80, "cyst", WORK, P.SPRITE);
  assert.ok(okWait, "a real window stool as a damp blotter");
"@
  $newSize = @"
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 193, height: 176 }], 80, "cyst", WORK, P.SPRITE);
  assert.equal(short, null, "a real sash drip, not a thinner drip");
  const shortH = P.pickTarget([{ id: "shortH", x: 200, y: 80, width: 194, height: 175 }], 80, "cyst", WORK, P.SPRITE);
  assert.equal(shortH, null, "a real sash drip, not a shorter drip");
  const okWait = P.pickTarget([{ id: "wait", x: 200, y: 80, width: 194, height: 176 }], 80, "cyst", WORK, P.SPRITE);
  assert.ok(okWait, "a real sash drip as a damp blotter");
  const drinkOk = P.pickTarget([{ id: "drip", x: 200, y: 80, width: 194, height: 176 }], 80, "leech", WORK, P.SPRITE);
  assert.ok(drinkOk, "Latch still takes a sash drip");
  const forkOk = P.pickTarget([{ id: "fork", x: 200, y: 80, width: 194, height: 176 }], 80, "chanterelle", WORK, P.SPRITE);
  assert.ok(forkOk, "Horn still takes a sash drip");
"@
  if (-not $t.Contains($oldSize)) { throw "$rel missing Arca size gate block" }
  $t = $t.Replace($oldSize, $newSize)
  $coolLine = '  assert.ok(Math.abs(wait.x - cool.x) > 8 || Math.abs(wait.lift - cool.lift) > 1, "not Hush lamp-shadow cool");'
  $coolPlus = @"
  assert.ok(Math.abs(wait.x - cool.x) > 8 || Math.abs(wait.lift - cool.lift) > 1, "not Hush lamp-shadow cool");
  const fork = P.forkPoint(WIN, P.SPRITE, WORK);
  assert.ok(Math.abs(wait.lift - drink.lift) < 8, "same sash drip furniture family as Latch");
  assert.ok(Math.abs(wait.x - drink.x) > 20, "same drip, not Latch's drink spot");
  assert.ok(Math.abs(wait.x - fork.x) > 20, "same drip, not Horn's fork spot");
"@
  if (-not $t.Contains($coolLine)) { throw "$rel missing cool distinguish line" }
  $t = $t.Replace($coolLine, $coolPlus)
  $t = $t.Replace("it walks onto the window stool as a damp blotter", "it walks onto the sash drip as a damp blotter")
  $t = $t.Replace("it stays on the stool blotter", "it stays on the sash drip")
  $t = $t.Replace($arcaOld, $arcaNew)
  Save $rel $t
  Write-Output "$rel ok"
}
PatchTests "desktop\renderer\window-play.test.cjs"
PatchTests "web\scripts\window-play.test.mjs"

# leftover-house
$h = Load "desktop\renderer\leftover-house.test.cjs"
$h = $h.Replace("Arca leftover waits a window stool as a damp blotter; tenth leftover of the far den done and closes far ten;", "Arca leftover waits a sash drip as a damp blotter; tenth leftover of the far den done; far ten closed;")
$cystBlock = @"
  assert.equal(WP.playFor("cyst"), "wait");
  assert.equal(WP.WAIT, "wait");
  assert.notEqual(WP.playFor("cyst"), "reef");
"@
$cystNew = @"
  assert.equal(WP.playFor("cyst"), "wait");
  assert.equal(WP.WAIT, "wait");
  assert.notEqual(WP.playFor("cyst"), "arca");
  assert.notEqual(WP.playFor("cyst"), "cyst");
  assert.notEqual(WP.playFor("cyst"), "reef");
"@
if (-not $h.Contains($cystBlock)) { throw "house missing cyst block" }
$h = $h.Replace($cystBlock, $cystNew)
$h = $h.Replace($arcaOld, $arcaNew)
Save "desktop\renderer\leftover-house.test.cjs" $h
Write-Output "house ok"

# docs
foreach ($doc in @("README.md","desktop\README.md","docs\ARCHITECTURE.md","docs\ROADMAP.md")) {
  $d = Load $doc
  $n = $d.Replace($arcaOld, $arcaNew)
  $n = $n.Replace("Arca leftover waits a window stool as a damp blotter", "Arca leftover waits a sash drip as a damp blotter")
  $n = $n.Replace("Arca waits a window stool as a damp blotter", "Arca waits a sash drip as a damp blotter")
  if ($n -eq $d) { Write-Output "$doc no arca stool phrase (check)" } else { Save $doc $n; Write-Output "$doc ok" }
}
Write-Output "DONE"
