# Sit Grok Imagine videos from cries-in/ as house cry wavs.
# Drop files named like the catalog key (red_panda.mp4), then run this script.

Set-Location (Join-Path $PSScriptRoot "..")

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  Write-Host "ffmpeg is missing."
  Write-Host "Install it with: winget install ffmpeg"
  exit 1
}

$catalogPath = Join-Path (Get-Location) "web\src\lib\pets\catalog.ts"
if (-not (Test-Path $catalogPath)) {
  Write-Host "Could not find the catalog at web\src\lib\pets\catalog.ts"
  exit 1
}

$catalog = Get-Content -Raw $catalogPath
$species = @{}
foreach ($m in [regex]::Matches($catalog, '\{ key: "([a-z0-9_]+)"')) {
  $species[$m.Groups[1].Value] = $true
}

$inDir = Join-Path (Get-Location) "cries-in"
$deskDir = Join-Path (Get-Location) "desktop\renderer\sounds"
$webDir = Join-Path (Get-Location) "web\public\sounds"
New-Item -ItemType Directory -Force -Path $deskDir | Out-Null
New-Item -ItemType Directory -Force -Path $webDir | Out-Null

$exts = @(".mp4", ".mov", ".webm")
$drops = @()
if (Test-Path $inDir) {
  $drops = @(Get-ChildItem -Path $inDir -File | Where-Object { $exts -contains $_.Extension.ToLowerInvariant() })
}

if ($drops.Count -eq 0) {
  Write-Host "No videos in cries-in/."
  Write-Host "Drop files named like red_panda.mp4, then run this script again."
  exit 0
}

$sat = @()
$skipped = @()
$af = "silenceremove=start_periods=1:start_duration=0.05:start_threshold=-40dB:detection=peak,areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-40dB:detection=peak,areverse,dynaudnorm=p=0.95:m=8,atrim=0:4,asetpts=PTS-STARTPTS"

foreach ($drop in $drops) {
  $key = $drop.BaseName.ToLowerInvariant()
  if (-not $species.ContainsKey($key)) {
    $skipped += "$($drop.Name) (not a catalog key)"
    Write-Host "skipped $($drop.Name) (not a catalog key)"
    continue
  }
  $tmp = Join-Path $env:TEMP ("computerpets-cry-" + $key + ".wav")
  $ffArgs = @(
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", $drop.FullName,
    "-vn", "-ac", "1", "-ar", "44100",
    "-af", $af,
    $tmp
  )
  & ffmpeg @ffArgs
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmp)) {
    $skipped += "$($drop.Name) (ffmpeg failed)"
    Write-Host "skipped $($drop.Name) (ffmpeg failed)"
    continue
  }
  Copy-Item -Force $tmp (Join-Path $deskDir ($key + ".wav"))
  Copy-Item -Force $tmp (Join-Path $webDir ($key + ".wav"))
  Remove-Item -Force $tmp -ErrorAction SilentlyContinue
  $sat += $key
  Write-Host "sat $key"
}

Write-Host ""
Write-Host ("sat {0}. skipped {1}." -f $sat.Count, $skipped.Count)
if ($sat.Count -gt 0) {
  Write-Host ("sat: " + ($sat -join ", "))
}
if ($skipped.Count -gt 0) {
  Write-Host ("skipped: " + ($skipped -join ", "))
}