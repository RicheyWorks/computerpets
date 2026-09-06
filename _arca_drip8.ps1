$utf8 = New-Object System.Text.UTF8Encoding $false
function Load([string]$p) { return [System.IO.File]::ReadAllText((Join-Path (Get-Location) $p)) }
function Save([string]$p, [string]$t) { [System.IO.File]::WriteAllText((Join-Path (Get-Location) $p), $t, $utf8) }

function PatchWaitPoint([string]$src, [string]$startMark, [string]$endMark, [string]$name) {
  $s = $src.IndexOf($startMark)
  $e = $src.IndexOf($endMark)
  if ($s -lt 0 -or $e -lt 0 -or $e -le $s) { throw "$name markers s=$s e=$e" }
  $chunk = $src.Substring($s, $e - $s)
  if (-not $chunk.Contains("const pad = 38;")) { throw "$name no pad 38" }
  $chunk = $chunk.Replace("const pad = 38;", "const pad = 34;")
  $chunk = $chunk.Replace("span * 0.58", "span * 0.48")
  $chunk = $chunk.Replace("const blotter = Math.max(27, size * 0.145);", "const drip = Math.max(64, win.height * 0.15);")
  $chunk = $chunk.Replace("win.height - blotter", "win.height - drip")
  $n28 = $chunk.Replace("clamp(lift, 20, maxLift)", "clamp(lift, 28, maxLift)")
  if ($n28 -eq $chunk) { throw "$name clamp 20 not found" }
  $chunk = $n28
  $chunk = $chunk.Replace("window stool as a damp blotter", "sash drip as a damp blotter")
  $chunk = $chunk.Replace("sit sealed cyst on interior stool (papers damp)", "sit the wait on the drip; she waits, she does not drink")
  if (-not $chunk.Contains("span * 0.48")) { throw "$name x" }
  if (-not $chunk.Contains("win.height * 0.15")) { throw "$name drip" }
  if (-not $chunk.Contains("clamp(lift, 28, maxLift)")) { throw "$name clamp" }
  if ($chunk.Contains("const pad = 38;")) { throw "$name pad still 38" }
  return $src.Substring(0, $s) + $chunk + $src.Substring($e)
}

$arcaOld = "Arca waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave."
$arcaNew = "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave. Hush still owns cool. Latch still owns drink. Brood still owns emerge. This is the leftover after Hush. Far den ten closes."

$js = Load "desktop\renderer\window-play.js"
$js = PatchWaitPoint $js "function waitPoint" "function waitFace" "js"
$js = $js.Replace("if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
$js = $js.Replace("// walk onto the stool — take the damp blotter", "// walk onto the drip — take the damp blotter")
$js = $js.Replace("// sit the wait on the window stool as a damp blotter (papers damp)", "// sit the wait on the sash drip as a damp blotter; she waits, she does not drink")
if (-not $js.Contains($arcaOld)) { throw "js header" }
$js = $js.Replace($arcaOld, $arcaNew)
Save "desktop\renderer\window-play.js" $js
Write-Output "js ok"

$ts = Load "web\src\lib\pets\window-play.ts"
$ts = PatchWaitPoint $ts "export function waitPoint" "export function waitFace" "ts"
$ts = $ts.Replace("if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
$ts = $ts.Replace("// walk onto the stool — take the damp blotter", "// walk onto the drip — take the damp blotter")
$ts = $ts.Replace("// sit the wait on the window stool as a damp blotter (papers damp)", "// sit the wait on the sash drip as a damp blotter; she waits, she does not drink")
if (-not $ts.Contains($arcaOld)) { throw "ts header" }
$ts = $ts.Replace($arcaOld, $arcaNew)
Save "web\src\lib\pets\window-play.ts" $ts
Write-Output "ts ok"
Write-Output "core done"
