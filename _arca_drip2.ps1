$path = Join-Path (Get-Location) "desktop\renderer\window-play.js"
$c = [System.IO.File]::ReadAllText($path)
$old = @"
    const pad = 38;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.58;
    // sash drip as a damp blotter — sit the wait on the drip; she waits, she does not drink; wait is the tell / traveling cyst
    // not Ochre pane reef, not Latch drip drink, not Lula apron loop, not Felt lean blotter-felt, not Brood emerge, not Vein damp saucer, not Brine salt-dish frost, not Knot paperweight many
    const blotter = Math.max(27, size * 0.145);
    const gripY = win.y + win.height - blotter;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 20, maxLift) };
"@
$new = @"
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
"@
if (-not $c.Contains($old)) { throw "JS waitPoint body not found" }
$c = $c.Replace($old, $new)
$c = $c.Replace("    if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "    if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
[System.IO.File]::WriteAllText($path, $c)
Write-Output "js waitPoint ok"
Write-Output ("drip geom " + $c.Contains("win.height * 0.15"))
Write-Output ("x 0.48 " + $c.Contains("span * 0.48"))
Write-Output ("size 194 " + $c.Contains("kind === WAIT) return w.width >= 194 && w.height >= 176"))
