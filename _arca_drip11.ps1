$utf8 = New-Object System.Text.UTF8Encoding $false
function Load([string]$p) { return [System.IO.File]::ReadAllText((Join-Path (Get-Location) $p)) }
function Save([string]$p, [string]$t) { [System.IO.File]::WriteAllText((Join-Path (Get-Location) $p), $t, $utf8) }

foreach ($doc in @("docs\ROADMAP.md","docs\ARCHITECTURE.md","README.md","desktop\README.md")) {
  $d = Load $doc
  $n = $d
  $n = $n.Replace("Arca (``cyst`` / ``arca``) waits a real window stool as a damp blotter: walk onto the stool (interior stool — papers damp a traveling cyst waits", "Arca (``cyst`` / ``arca``) waits a real sash drip as a damp blotter: walk onto the drip (sash drip — she waits, she does not drink; a traveling cyst waits")
  $n = $n.Replace("Next leftover is Arca (``cyst``). Do not start Arca.", "Next leftover was Arca (``cyst``); Arca waits. Next leftover is Boot (``paramecium``). Do not start Boot.")
  $n = $n.Replace("next leftover is Arca;", "next leftover is Boot; far den closed;")
  if ($n -eq $d) { Write-Output "$doc unchanged" } else { Save $doc $n; Write-Output "$doc ok" }
}
Write-Output "done"
