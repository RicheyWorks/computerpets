$path = Join-Path (Get-Location) "desktop\renderer\window-play.js"
$c = [System.IO.File]::ReadAllText($path)
$c = $c.Replace("    const pad = 38;`r`n    const span = Math.max(0, win.width - size - pad * 2);`r`n    const x = win.x + pad + span * 0.58;", "    const pad = 34;`r`n    const span = Math.max(0, win.width - size - pad * 2);`r`n    const x = win.x + pad + span * 0.48;")
if (-not $c.Contains("span * 0.48")) {
  $c = $c.Replace("    const pad = 38;`n    const span = Math.max(0, win.width - size - pad * 2);`n    const x = win.x + pad + span * 0.58;", "    const pad = 34;`n    const span = Math.max(0, win.width - size - pad * 2);`n    const x = win.x + pad + span * 0.48;")
}
$c = $c.Replace("    const blotter = Math.max(27, size * 0.145);`r`n    const gripY = win.y + win.height - blotter;", "    const drip = Math.max(64, win.height * 0.15);`r`n    const gripY = win.y + win.height - drip;")
if (-not $c.Contains("win.height * 0.15")) {
  $c = $c.Replace("    const blotter = Math.max(27, size * 0.145);`n    const gripY = win.y + win.height - blotter;", "    const drip = Math.max(64, win.height * 0.15);`n    const gripY = win.y + win.height - drip;")
}
$c = $c.Replace("return { x, lift: clamp(lift, 20, maxLift) };", "return { x, lift: clamp(lift, 28, maxLift) };")
# only want waitPoint's clamp 20. Check remaining clamp(lift, 20
[System.IO.File]::WriteAllText($path, $c)
Write-Output ("x48=" + $c.Contains("span * 0.48"))
Write-Output ("drip=" + $c.Contains("win.height * 0.15"))
Write-Output ("clamp28 wait=" + ([regex]::Matches($c, "clamp\(lift, 28, maxLift\)")).Count)
Write-Output ("clamp20 left=" + ([regex]::Matches($c, "clamp\(lift, 20, maxLift\)")).Count)
