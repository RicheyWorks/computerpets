$jsPath = Join-Path (Get-Location) "desktop\renderer\window-play.js"
$c = [System.IO.File]::ReadAllText($jsPath)
$nl = if ($c.Contains("`r`n")) { "`r`n" } else { "`n" }

function Ins([string]$hay, [string]$needle, [string]$insert) {
  if ($hay.Contains($insert.Trim())) { return $hay }
  if (-not $hay.Contains($needle)) { throw "missing needle: $($needle.Substring(0, [Math]::Min(80, $needle.Length)))" }
  return $hay.Replace($needle, $insert)
}

$c = Ins $c "This is the leftover after Beacon. This is the ninth leftover of the far den. Others walk a sill. */" "This is the leftover after Beacon. This is the ninth leftover of the far den. Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave. Hush still owns cool. Latch still owns drink. Brood still owns emerge. This is the leftover after Hush. Far den ten closes. Others walk a sill. */"

$c = Ins $c ("  const COOL = `"cool`";" + $nl + "  const SILL = `"sill`";") ("  const COOL = `"cool`";" + $nl + "  const WAIT = `"wait`";" + $nl + "  const SILL = `"sill`";")

$c = Ins $c ("    coolOff: 2.90," + $nl + "    sillHop: 0.38,") ("    coolOff: 2.90," + $nl + "    waitOn: 3.14," + $nl + "    wait: 2.66," + $nl + "    waitHold: 5.42," + $nl + "    waitOff: 2.94," + $nl + "    sillHop: 0.38,")

$c = Ins $c ("    if (key === `"umbral`") return COOL;" + $nl + "    return SILL;") ("    if (key === `"umbral`") return COOL;" + $nl + "    if (key === `"cyst`") return WAIT;" + $nl + "    return SILL;")

$c = Ins $c ("    if (kind === COOL) return w.width >= 198 && w.height >= 188;" + $nl + "    return w.width >= 180 && w.height >= 70;") ("    if (kind === COOL) return w.width >= 198 && w.height >= 188;" + $nl + "    if (kind === WAIT) return w.width >= 194 && w.height >= 176;" + $nl + "    return w.width >= 180 && w.height >= 70;")

[System.IO.File]::WriteAllText($jsPath, $c)
Write-Output "pass1 ok"
Write-Output ("WAIT const " + $c.Contains('const WAIT = "wait"'))
Write-Output ("cyst playFor " + $c.Contains('key === "cyst"'))
Write-Output ("waitOn " + $c.Contains("waitOn: 3.14"))
Write-Output ("WAIT size " + $c.Contains("kind === WAIT) return w.width >= 194"))
