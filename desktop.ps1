param([switch]$Check)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
# The window stays in the computerpets folder when this ends, however it ends (a stop, -Check, Ctrl+C, the pets
# turned off): it went into desktop\ and stayed there, so "run .\desktop.ps1 again" in the same window said
# .\desktop.ps1 was not recognized, and cd web went looking for desktop\web.
Push-Location $PSScriptRoot\desktop
try {
  # Plain words, then stop. A keeper should never have to read a PowerShell error to know what to do.
  function Stop-Start([string]$Words) {
    Write-Host $Words
    if ($blocked) { Write-Host $bypassNote }
    exit 1
  }

  # Windows' default policy (Restricted) blocks .\desktop.ps1, so a keeper there started this with
  # powershell -ExecutionPolicy Bypass -File .\desktop.ps1 (START-HERE). Every "type .\desktop.ps1" below would be
  # blocked again for them, so say the line that works. The policy is read without this window's own -ExecutionPolicy.
  function Test-ScriptsBlocked {
    foreach ($scope in "MachinePolicy", "UserPolicy", "CurrentUser", "LocalMachine") {
      $policy = "$(Get-ExecutionPolicy -Scope $scope)"
      if ($policy -ne "Undefined") { return ($policy -eq "Restricted" -or $policy -eq "AllSigned") }
    }
    return $true
  }
  $blocked = $false
  if ($env:OS -eq "Windows_NT") { $blocked = Test-ScriptsBlocked }
  $bypassNote = "Windows blocks scripts on this computer, so wherever these words say .\desktop.ps1, type powershell -ExecutionPolicy Bypass -File .\desktop.ps1 instead."

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
  #    leaves it unfinished. npm writes node_modules\.package-lock.json last, when an install finishes
  #    (this script's stamp says the same), so a plain npm install counts too; a newer package.json
  #    (after a pull) asks for the pieces again. Electron 42 and newer do not download Electron itself
  #    during npm install: it comes the first time Electron runs (the first npm start), so the pieces
  #    are ready only once node_modules\electron\path.txt names an Electron that is really there.
  $electron = "node_modules\electron\path.txt"
  $finished = "node_modules\.package-lock.json"
  $stamp = "node_modules\.computerpets-installed"
  function Test-Electron {
    if (-not (Test-Path $electron)) { return $false }
    return (Test-Path (Join-Path "node_modules\electron\dist" (Get-Content $electron -Raw).Trim()))
  }
  function Get-Pieces {
    if (-not (Test-Path "node_modules\electron\package.json")) { return "missing" }
    $done = @($finished, $stamp) | Where-Object { Test-Path $_ } | ForEach-Object { (Get-Item $_).LastWriteTimeUtc } | Sort-Object -Descending | Select-Object -First 1
    if (-not $done) { return "unfinished" }
    if ((Get-Item "package.json").LastWriteTimeUtc -gt $done) { return "changed" }
    if (-not (Test-Electron)) { return "unfinished" }
    return "ready"
  }
  $pieces = Get-Pieces

  # 3. The pictures. The overlay's pet pictures are stored with Git LFS. A Git without LFS copies
  #    small text pointers instead, and every pet would be invisible. A git lfs pull that stopped partway
  #    (a lost connection, a full disk) leaves some pets as pointers, and those pets would be invisible too,
  #    so every pet's folder is looked at, not only the crow's. A pointer is a small text file (about 130
  #    bytes) and every real picture is over 10 KB, so only files under 1 KB are opened: fast enough for
  #    every start.
  $sprites = "renderer\sprites"
  $picture = "renderer\sprites\crow\idle\1.png"
  $gone = 0
  $pets = 0
  function Get-Pictures {
    if (-not (Test-Path $picture)) { return "missing" }
    $root = (Resolve-Path $sprites).Path
    $found = @{}
    $head = New-Object byte[] 23
    foreach ($f in ([System.IO.DirectoryInfo]::new($root)).EnumerateFiles("*.png", [System.IO.SearchOption]::AllDirectories)) {
      if ($f.Length -ge 1024) { continue }
      $stream = $f.OpenRead()
      try { $n = $stream.Read($head, 0, 23) } finally { $stream.Close() }
      if ([System.Text.Encoding]::ASCII.GetString($head, 0, $n) -eq "version https://git-lfs") {
        $found[$f.FullName.Substring($root.Length + 1).Split("\")[0]] = $true
      }
    }
    $script:gone = $found.Count
    $script:pets = @([System.IO.Directory]::GetDirectories($root)).Count
    if ($script:gone -eq 0) { return "ready" }
    if ($script:gone -ge $script:pets) { return "lfs-pointers" }
    return "partial"
  }
  $seen = Get-Pictures
  # "12 of 221 pets are still missing their pictures" (one pet: "is ... its").
  $still = "$gone of $pets pets are still missing their pictures"
  if ($gone -eq 1) { $still = "1 of $pets pets is still missing its pictures" }

  # -Check says what the start sees and changes nothing: no install, no overlay.
  # The last line says what to type next, in plain words (the pictures first: the start stops there).
  if ($Check) {
    Write-Host "ok: node $version"
    Write-Host "pieces: $pieces"
    Write-Host "pictures: $seen"
    if ($blocked) { Write-Host "note: $bypassNote" }
    if ($seen -eq "partial") {
      Write-Host "next: $($still): Git LFS stopped before it fetched them all. In the computerpets folder type git lfs pull. Then type .\desktop.ps1 and press Enter."
    } elseif ($seen -ne "ready") {
      Write-Host "next: The pet pictures are not here yet. Install Git LFS from https://git-lfs.com, then in the computerpets folder type git lfs install and then git lfs pull. Then type .\desktop.ps1 and press Enter."
    } elseif ($pieces -eq "missing") {
      Write-Host "next: Type .\desktop.ps1 and press Enter. It gets the pieces (a few minutes the first time), then the pets come on."
    } elseif ($pieces -eq "unfinished") {
      Write-Host "next: Type .\desktop.ps1 and press Enter. It finishes getting the pieces, then the pets come on."
    } elseif ($pieces -eq "changed") {
      Write-Host "next: Type .\desktop.ps1 and press Enter. It gets the new pieces, then the pets come on."
    } else {
      Write-Host "next: Type .\desktop.ps1 and press Enter to turn the pets on."
    }
    exit 0
  }

  if ($seen -eq "partial") {
    Stop-Start "$still. Git LFS stopped before it fetched them all. In the computerpets folder run git lfs pull, and run .\desktop.ps1 again."
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
    if (-not (Test-Electron)) {
      Write-Host "Getting Electron, the overlay piece (about 100 MB). Leave this window open."
      & node node_modules\electron\install.js
    }
    if (-not (Test-Electron)) {
      Stop-Start "The overlay piece (Electron) did not download. Check the internet, delete the desktop\node_modules folder, and run .\desktop.ps1 again."
    }
    Set-Content -Path $stamp -Value (Get-Date -Format o) -Encoding ASCII
  }

  # 4. Turn the pets on. npm start is electron .
  & npm start
  exit $LASTEXITCODE
} finally {
  Pop-Location
}
