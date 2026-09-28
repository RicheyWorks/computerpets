param([switch]$Check)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\desktop

# Plain words, then stop. A keeper should never have to read a PowerShell error to know what to do.
function Stop-Start([string]$Words) {
  Write-Host $Words
  exit 1
}

# 1. Node runs the overlay. Check it is here and new enough before anything else.
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Stop-Start "Node is not installed in this window yet. Install the LTS from https://nodejs.org (version 22 or newer), close this window, open a new PowerShell in the computerpets folder, and run .\desktop.ps1 again."
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Stop-Start "npm is missing. It comes with Node. Install the LTS from https://nodejs.org again, open a new PowerShell in the computerpets folder, and run .\desktop.ps1 again."
}
$version = "$(& node -v)".Trim()
$major = 0
if ($version -match '^v(\d+)\.') { $major = [int]$Matches[1] }
if ($major -lt 22) {
  Stop-Start "This Node is $version. The pets need version 22 or newer. Install the LTS from https://nodejs.org, open a new PowerShell in the computerpets folder, and run .\desktop.ps1 again."
}

# 2. The pieces. node_modules alone is not enough: a get-the-pieces run that was closed halfway
#    leaves the folder without Electron. The stamp is written only after npm install finishes,
#    and a newer package.json (after a pull) asks for the pieces again.
$electron = "node_modules\electron\path.txt"
$stamp = "node_modules\.computerpets-installed"
function Get-Pieces {
  if (-not (Test-Path $electron)) { return "missing" }
  if (-not (Test-Path $stamp)) { return "unfinished" }
  if ((Get-Item "package.json").LastWriteTimeUtc -gt (Get-Item $stamp).LastWriteTimeUtc) { return "changed" }
  return "ready"
}
$pieces = Get-Pieces

# 3. The pictures. The overlay's pet pictures are stored with Git LFS. A Git without LFS copies
#    small text pointers instead, and every pet would be invisible.
$picture = "renderer\sprites\crow\idle\1.png"
function Get-Pictures {
  if (-not (Test-Path $picture)) { return "missing" }
  $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $picture).Path)
  $head = [System.Text.Encoding]::ASCII.GetString($bytes, 0, [Math]::Min(23, $bytes.Length))
  if ($head -eq "version https://git-lfs") { return "lfs-pointers" }
  return "ready"
}
$seen = Get-Pictures

# -Check says what the start sees and changes nothing: no install, no overlay.
if ($Check) {
  Write-Host "ok: node $version"
  Write-Host "pieces: $pieces"
  Write-Host "pictures: $seen"
  exit 0
}

if ($seen -ne "ready") {
  Stop-Start "The pet pictures did not download. They come through Git LFS, which this Git does not have yet. Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull, and run .\desktop.ps1 again."
}

if ($pieces -ne "ready") {
  Write-Host "Getting the pieces (npm install). The first time can take a few minutes. Leave this window open."
  & npm install
  if ($LASTEXITCODE -ne 0) {
    Stop-Start "npm install did not finish. Check the internet, then run .\desktop.ps1 again. It gets the pieces again."
  }
  if (-not (Test-Path $electron)) { & npm rebuild electron }
  if (-not (Test-Path $electron)) {
    Stop-Start "The overlay piece (Electron) did not download. Check the internet, delete the desktop\node_modules folder, and run .\desktop.ps1 again."
  }
  Set-Content -Path $stamp -Value (Get-Date -Format o) -Encoding ASCII
}

# 4. Turn the pets on. npm start is electron .
& npm start
exit $LASTEXITCODE
