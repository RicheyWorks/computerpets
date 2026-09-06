$path = Join-Path (Get-Location) "desktop\renderer\window-play.js"
$c = [System.IO.File]::ReadAllText($path)
$c = $c.Replace("Arca waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave.", "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave.")
$c = $c.Replace("if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
$c = $c.Replace("walk onto the stool — take the damp blotter", "walk onto the drip — take the damp blotter")
$c = $c.Replace("sit the wait on the window stool as a damp blotter (papers damp)", "sit the wait on the sash drip as a damp blotter; she waits, she does not drink")

# Unique waitPoint x/pad: only WAIT uses pad 38 + 0.58 together
$idx = $c.IndexOf("function waitPoint")
if ($idx -lt 0) { throw "no waitPoint" }
$chunk = $c.Substring($idx, 900)
$newChunk = $chunk.Replace("const pad = 38;", "const pad = 34;")
$newChunk = $newChunk.Replace("span * 0.58", "span * 0.48")
$newChunk = $newChunk.Replace("const blotter = Math.max(27, size * 0.145);", "const drip = Math.max(64, win.height * 0.15);")
$newChunk = $newChunk.Replace("win.height - blotter", "win.height - drip")
$newChunk = $newChunk.Replace("clamp(lift, 20, maxLift)", "clamp(lift, 28, maxLift)")
$newChunk = $newChunk.Replace("sit sealed cyst on interior stool (papers damp)", "sit the wait on the drip; she waits, she does not drink")
$c = $c.Substring(0, $idx) + $newChunk + $c.Substring($idx + 900)
[System.IO.File]::WriteAllText($path, $c)
Write-Output ("hdr drip=" + $c.Contains("Arca waits a sash drip"))
Write-Output ("size=" + $c.Contains("kind === WAIT) return w.width >= 194 && w.height >= 176"))
Write-Output ("x48=" + $c.Contains("span * 0.48"))
Write-Output ("dripH=" + $c.Contains("win.height * 0.15"))
Write-Output ("stool left in waitPoint=" + $c.Substring($c.IndexOf("function waitPoint"), 900).Contains("stool"))
