$utf8 = New-Object System.Text.UTF8Encoding $false
function Load([string]$p) { return [System.IO.File]::ReadAllText((Join-Path (Get-Location) $p)) }
function Save([string]$p, [string]$t) { [System.IO.File]::WriteAllText((Join-Path (Get-Location) $p), $t, $utf8) }

$nl = "`n"
$arcaOld = "Arca waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave."
$arcaNew = "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave. Hush still owns cool. Latch still owns drink. Brood still owns emerge. This is the leftover after Hush. Far den ten closes."

$jsNewPt = "  function waitPoint(win, sprite, work) {" + $nl + "    const size = sprite == null ? SPRITE : sprite;" + $nl + "    const pad = 34;" + $nl + "    const span = Math.max(0, win.width - size - pad * 2);" + $nl + "    const x = win.x + pad + span * 0.48;" + $nl + "    // sash drip as a damp blotter — sit the wait on the drip; she waits, she does not drink; wait is the tell / traveling cyst" + $nl + "    // not Latch drip drink, not Horn moss-rim fork, not Ochre pane reef, not Hush lamp-shadow cool, not Brood window-foot soil husk" + $nl + "    const drip = Math.max(64, win.height * 0.15);" + $nl + "    const gripY = win.y + win.height - drip;" + $nl + "    const lift = gripLift(gripY, work);" + $nl + "    const maxLift = (work && work.height ? work.height : 800) - 48;" + $nl + "    return { x, lift: clamp(lift, 28, maxLift) };" + $nl + "  }" + $nl + $nl

$js = Load "desktop\renderer\window-play.js"
if (-not $js.Contains($arcaOld)) { throw "js missing arca stool header" }
$s = $js.IndexOf("  function waitPoint(win, sprite, work) {")
$e = $js.IndexOf("  function waitFace(target)")
if ($s -lt 0 -or $e -lt 0 -or $e -le $s) { throw "js waitPoint markers s=$s e=$e" }
$js = $js.Substring(0, $s) + $jsNewPt + $js.Substring($e)
$js = $js.Replace("if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
$js = $js.Replace("// walk onto the stool — take the damp blotter", "// walk onto the drip — take the damp blotter")
$js = $js.Replace("// sit the wait on the window stool as a damp blotter (papers damp)", "// sit the wait on the sash drip as a damp blotter; she waits, she does not drink")
$js = $js.Replace($arcaOld, $arcaNew)
$chunk = $js.Substring($js.IndexOf("function waitPoint"), 650)
if (-not $chunk.Contains("span * 0.48")) { throw "js waitPoint x" }
if (-not $chunk.Contains("win.height * 0.15")) { throw "js waitPoint drip" }
if (-not $chunk.Contains("clamp(lift, 28, maxLift)")) { throw "js waitPoint clamp" }
if (-not $js.Contains("if (kind === WAIT) return w.width >= 194 && w.height >= 176;")) { throw "js size" }
Save "desktop\renderer\window-play.js" $js
Write-Output "js ok"

$tsNewPt = "export function waitPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {" + $nl + "  const size = sprite == null ? SPRITE : sprite;" + $nl + "  const pad = 34;" + $nl + "  const span = Math.max(0, win.width - size - pad * 2);" + $nl + "  const x = win.x + pad + span * 0.48;" + $nl + "  // sash drip as a damp blotter — sit the wait on the drip; she waits, she does not drink; wait is the tell / traveling cyst" + $nl + "  // not Latch drip drink, not Horn moss-rim fork, not Ochre pane reef, not Hush lamp-shadow cool, not Brood window-foot soil husk" + $nl + "  const drip = Math.max(64, win.height * 0.15);" + $nl + "  const gripY = win.y + win.height - drip;" + $nl + "  const lift = gripLift(gripY, work);" + $nl + "  const maxLift = (work && work.height ? work.height : 800) - 48;" + $nl + "  return { x, lift: clamp(lift, 28, maxLift) };" + $nl + "}" + $nl + $nl
$ts = Load "web\src\lib\pets\window-play.ts"
if (-not $ts.Contains($arcaOld)) { throw "ts missing arca stool header" }
$s = $ts.IndexOf("export function waitPoint")
$e = $ts.IndexOf("export function waitFace")
if ($s -lt 0 -or $e -lt 0 -or $e -le $s) { throw "ts waitPoint markers s=$s e=$e" }
$ts = $ts.Substring(0, $s) + $tsNewPt + $ts.Substring($e)
$ts = $ts.Replace("if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
$ts = $ts.Replace("// walk onto the stool — take the damp blotter", "// walk onto the drip — take the damp blotter")
$ts = $ts.Replace("// sit the wait on the window stool as a damp blotter (papers damp)", "// sit the wait on the sash drip as a damp blotter; she waits, she does not drink")
$ts = $ts.Replace($arcaOld, $arcaNew)
$chunk = $ts.Substring($ts.IndexOf("export function waitPoint"), 700)
if (-not $chunk.Contains("span * 0.48")) { throw "ts waitPoint x" }
if (-not $chunk.Contains("win.height * 0.15")) { throw "ts waitPoint drip" }
if (-not $ts.Contains("if (kind === WAIT) return w.width >= 194 && w.height >= 176;")) { throw "ts size" }
Save "web\src\lib\pets\window-play.ts" $ts
Write-Output "ts ok"
Write-Output "core done"
