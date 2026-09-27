<#
.SYNOPSIS
  Run every ComputerPets test suite this computer can run, then print one summary.

.DESCRIPTION
  Suites, in order:
    desktop    npm test in desktop/ (overlay, license, presence)
    web        npm test in web/ (needs web/node_modules)
    tsc        web type-check held to web/tsc-baseline.txt (node web/scripts/tsc-baseline.mjs)
    python     pytest in client/ using client/.venv
    check      python -m computerpets_client --check (offscreen window with a living pet)
    harness    python -m computerpets_client.app_harness, then .care_harness (docs/APP-HARNESS.md)
    cdn        node deploy/cdn/edge-redeem.test.cjs
    java       mvn -B verify (mvnw or mvn, plus java)
    deploy-sh  bash deploy/k8s/*.test.sh and deploy/terraform/*.test.sh (bash + python3 with PyYAML)
    tftest     terraform test in deploy/terraform (after you ran terraform init there)

  A suite whose tool is missing is reported as SKIP with the reason. Nothing is installed.
  Exit code is 1 when any suite fails, else 0. Logs go to %TEMP%\computerpets-test-all.

.PARAMETER Only
  Run just these suites, e.g. -Only python,cdn

.PARAMETER Skip
  Leave these suites out, e.g. -Skip web,tsc

.PARAMETER Quick
  Skip the slow suites: web, tsc, java, deploy-sh, tftest.

.PARAMETER Bash
  Path to a bash for deploy-sh when bash is not on PATH (for example Git Bash).

.PARAMETER List
  Print the suites and exit.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\test-all.ps1
.EXAMPLE
  pwsh scripts/test-all.ps1 -Quick
#>
[CmdletBinding()]
param(
  [string[]]$Only = @(),
  [string[]]$Skip = @(),
  [switch]$Quick,
  [string]$Bash = "",
  [switch]$List
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version 2

$Root = Split-Path -Parent $PSScriptRoot
$OnWindows = [IO.Path]::DirectorySeparatorChar -eq [char]92
$LogDir = Join-Path ([IO.Path]::GetTempPath()) "computerpets-test-all"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$Suites = @(
  @{ Name = "desktop";   Slow = $false; What = "npm test in desktop/" },
  @{ Name = "web";       Slow = $true;  What = "npm test in web/" },
  @{ Name = "tsc";       Slow = $true;  What = "web tsc --noEmit vs web/tsc-baseline.txt" },
  @{ Name = "python";    Slow = $false; What = "pytest in client/ (client/.venv)" },
  @{ Name = "check";     Slow = $false; What = "python -m computerpets_client --check" },
  @{ Name = "harness";   Slow = $false; What = "app_harness + care_harness (offline)" },
  @{ Name = "cdn";       Slow = $false; What = "node deploy/cdn/edge-redeem.test.cjs" },
  @{ Name = "java";      Slow = $true;  What = "mvn -B verify (backend)" },
  @{ Name = "deploy-sh"; Slow = $true;  What = "bash deploy/*/*.test.sh" },
  @{ Name = "tftest";    Slow = $true;  What = "terraform test in deploy/terraform" }
)
$Names = $Suites | ForEach-Object { $_.Name }

if ($List) {
  foreach ($s in $Suites) {
    $tag = ""
    if ($s.Slow) { $tag = "(not in -Quick)" }
    "{0,-10} {1} {2}" -f $s.Name, $s.What, $tag
  }
  exit 0
}

# -Only a,b arrives as one string when called through powershell -File; split it.
$Only = @($Only | ForEach-Object { $_ -split "," } | Where-Object { $_ })
$Skip = @($Skip | ForEach-Object { $_ -split "," } | Where-Object { $_ })
foreach ($n in @($Only + $Skip)) {
  if ($Names -notcontains $n) { throw "Unknown suite '$n'. Suites: $($Names -join ', ')" }
}

function Find-Tool([string]$name) {
  # Applications only, so npm resolves to npm.cmd and not npm.ps1 on Windows.
  $candidates = @($name)
  if ($OnWindows) { $candidates = @("$name.cmd", "$name.exe", "$name.bat", $name) }
  foreach ($c in $candidates) {
    $cmd = Get-Command $c -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($cmd) { return $cmd.Source }
  }
  return $null
}

function Quote-Arg([string]$a) {
  if ($a -match '[\s"]') { return '"' + ($a -replace '"', '\"') + '"' }
  return $a
}

# Run a program, send stdout and stderr to a log, return the exit code and the text.
function Invoke-Logged([string]$suite, [string]$exe, [string[]]$argv, [string]$cwd) {
  $out = Join-Path $LogDir "$suite.out.log"
  $err = Join-Path $LogDir "$suite.err.log"
  $argLine = ($argv | ForEach-Object { Quote-Arg $_ }) -join " "
  $params = @{
    FilePath = $exe
    WorkingDirectory = $cwd
    RedirectStandardOutput = $out
    RedirectStandardError = $err
    NoNewWindow = $true
    Wait = $true
    PassThru = $true
  }
  if ($argLine) { $params.ArgumentList = $argLine }
  $p = Start-Process @params
  $text = ""
  foreach ($f in @($out, $err)) {
    if (Test-Path $f) { $text += [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8) + "`n" }
  }
  $log = Join-Path $LogDir "$suite.log"
  Add-Content -Path $log -Value ("> " + $exe + " " + $argLine + "  (in " + $cwd + ")") -Encoding UTF8
  Add-Content -Path $log -Value $text -Encoding UTF8
  Remove-Item $out, $err -ErrorAction SilentlyContinue
  return @{ Code = $p.ExitCode; Text = $text }
}

function Get-Num([string]$text, [string]$pattern) {
  $m = [regex]::Matches($text, $pattern)
  if ($m.Count -eq 0) { return $null }
  return [int]$m[$m.Count - 1].Groups[1].Value
}

function Node-Counts([string]$text) {
  $t = Get-Num $text '(?m)^\S*\s*tests (\d+)\s*$'
  $p = Get-Num $text '(?m)^\S*\s*pass (\d+)\s*$'
  $f = Get-Num $text '(?m)^\S*\s*fail (\d+)\s*$'
  $s = Get-Num $text '(?m)^\S*\s*skipped (\d+)\s*$'
  if ($null -eq $t) { return "" }
  $c = "$p/$t pass"
  if ($f) { $c += ", $f fail" }
  if ($s) { $c += ", $s skip" }
  return $c
}

function Result([string]$status, [string]$counts, [string]$note) {
  return @{ Status = $status; Counts = $counts; Note = $note }
}

function Show-Tail([string]$text) {
  $lines = $text -split "\r?\n" | Where-Object { $_ -ne "" }
  $lines | Select-Object -Last 30 | ForEach-Object { "    $_" } | Write-Host
}

$Node = Find-Tool "node"
$Npm = Find-Tool "npm"
$Venv = Join-Path $Root "client/.venv"
$VenvPy = if ($OnWindows) { Join-Path $Venv "Scripts/python.exe" } else { Join-Path $Venv "bin/python" }
$VenvHelp = if ($OnWindows) {
  'cd client; py -3 -m venv .venv; .\.venv\Scripts\python.exe -m pip install -e ".[dev]"  (docs/CONTRIBUTING.md)'
} else {
  'cd client && python3 -m venv .venv && .venv/bin/pip install -e ".[dev]"  (docs/CONTRIBUTING.md)'
}

function Run-Desktop {
  if (-not $Node -or -not $Npm) { return Result "SKIP" "" "node/npm not installed" }
  $r = Invoke-Logged "desktop" $Npm @("test") (Join-Path $Root "desktop")
  $status = if ($r.Code -eq 0) { "PASS" } else { "FAIL" }
  if ($status -eq "FAIL") { Show-Tail $r.Text }
  return Result $status (Node-Counts $r.Text) ""
}

function Run-Web {
  if (-not $Node -or -not $Npm) { return Result "SKIP" "" "node/npm not installed" }
  if (-not (Test-Path (Join-Path $Root "web/node_modules"))) { return Result "SKIP" "" "no web/node_modules: run npm ci in web/" }
  $r = Invoke-Logged "web" $Npm @("test") (Join-Path $Root "web")
  $status = if ($r.Code -eq 0) { "PASS" } else { "FAIL" }
  if ($status -eq "FAIL") { Show-Tail $r.Text }
  return Result $status (Node-Counts $r.Text) ""
}

function Run-Tsc {
  if (-not $Node) { return Result "SKIP" "" "node not installed" }
  if (-not (Test-Path (Join-Path $Root "web/node_modules/typescript"))) { return Result "SKIP" "" "no web/node_modules: run npm ci in web/" }
  $r = Invoke-Logged "tsc" $Node @("scripts/tsc-baseline.mjs") (Join-Path $Root "web")
  $m = [regex]::Match($r.Text, 'tsc: (\d+) lines \((\d+) errors\), baseline (\d+)')
  $counts = ""
  $note = ""
  if ($m.Success) {
    $counts = "$($m.Groups[1].Value) lines / baseline $($m.Groups[3].Value)"
    if ([int]$m.Groups[1].Value -lt [int]$m.Groups[3].Value) { $note = "fewer than baseline: node scripts/tsc-baseline.mjs --update" }
  }
  if ($r.Code -eq 0) { return Result "PASS" $counts $note }
  Show-Tail $r.Text
  return Result "FAIL" $counts "new tsc output"
}

function Run-Python {
  if (-not (Test-Path $VenvPy)) { return Result "SKIP" "" "no client/.venv. Create it: $VenvHelp" }
  $r = Invoke-Logged "python" $VenvPy @("-m", "pytest", "-q", "-rs", "-p", "no:cacheprovider") (Join-Path $Root "client")
  $p = Get-Num $r.Text '(\d+) passed'
  $f = Get-Num $r.Text '(\d+) failed'
  $s = Get-Num $r.Text '(\d+) skipped'
  $e = Get-Num $r.Text '(\d+) errors?\b'
  $counts = ""
  if ($null -ne $p) {
    $counts = "$p passed"
    if ($f) { $counts += ", $f failed" }
    if ($e) { $counts += ", $e errors" }
    if ($s) { $counts += ", $s skipped" }
  }
  $status = if ($r.Code -eq 0) { "PASS" } else { "FAIL" }
  if ($status -eq "FAIL") { Show-Tail $r.Text }
  return Result $status $counts ""
}

function Run-Check {
  if (-not (Test-Path $VenvPy)) { return Result "SKIP" "" "no client/.venv (see python)" }
  $r = Invoke-Logged "check" $VenvPy @("-m", "computerpets_client", "--check") (Join-Path $Root "client")
  $ok = ([regex]::Matches($r.Text, '(?m)^ok:')).Count
  $status = if ($r.Code -eq 0) { "PASS" } else { "FAIL" }
  if ($status -eq "FAIL") { Show-Tail $r.Text }
  return Result $status "$ok ok lines" ""
}

function Run-Harness {
  if (-not (Test-Path $VenvPy)) { return Result "SKIP" "" "no client/.venv (see python)" }
  $cwd = Join-Path $Root "client"
  $a = Invoke-Logged "harness" $VenvPy @("-m", "computerpets_client.app_harness") $cwd
  $c = Invoke-Logged "harness" $VenvPy @("-m", "computerpets_client.care_harness") $cwd
  $am = [regex]::Match($a.Text, '(\d+)/(\d+) passed')
  $cm = [regex]::Match($c.Text, '(\d+)/(\d+) passed')
  $counts = "app " + $(if ($am.Success) { $am.Value -replace ' passed', '' } else { "?" }) + ", care " + $(if ($cm.Success) { $cm.Value -replace ' passed', '' } else { "?" })
  if ($a.Code -eq 0 -and $c.Code -eq 0) { return Result "PASS" $counts "" }
  if ($a.Code -ne 0) { Show-Tail $a.Text }
  if ($c.Code -ne 0) { Show-Tail $c.Text }
  return Result "FAIL" $counts ""
}

function Run-Cdn {
  if (-not $Node) { return Result "SKIP" "" "node not installed" }
  $r = Invoke-Logged "cdn" $Node @("deploy/cdn/edge-redeem.test.cjs") $Root
  $m = [regex]::Match($r.Text, '(\d+) passed, (\d+) failed')
  $counts = if ($m.Success) { "$($m.Groups[1].Value) passed, $($m.Groups[2].Value) failed" } else { "" }
  $status = if ($r.Code -eq 0) { "PASS" } else { "FAIL" }
  if ($status -eq "FAIL") { Show-Tail $r.Text }
  return Result $status $counts ""
}

function Run-Java {
  $wrapper = if ($OnWindows) { Join-Path $Root "mvnw.cmd" } else { Join-Path $Root "mvnw" }
  $mvn = if (Test-Path $wrapper) { $wrapper } else { Find-Tool "mvn" }
  $java = Find-Tool "java"
  if (-not $java -and $env:JAVA_HOME) {
    $jh = Join-Path $env:JAVA_HOME $(if ($OnWindows) { "bin/java.exe" } else { "bin/java" })
    if (Test-Path $jh) { $java = $jh }
  }
  if (-not $java) { return Result "SKIP" "" "java not installed" }
  if (-not $mvn) { return Result "SKIP" "" "mvn not installed (and no mvnw)" }
  $r = Invoke-Logged "java" $mvn @("-B", "verify") $Root
  $m = [regex]::Matches($r.Text, 'Tests run: (\d+), Failures: (\d+), Errors: (\d+), Skipped: (\d+)')
  $counts = ""
  if ($m.Count -gt 0) {
    $g = $m[$m.Count - 1].Groups
    $counts = "$($g[1].Value) run, $($g[2].Value) fail, $($g[3].Value) err, $($g[4].Value) skip"
  }
  $status = if ($r.Code -eq 0) { "PASS" } else { "FAIL" }
  if ($status -eq "FAIL") { Show-Tail $r.Text }
  return Result $status $counts ""
}

function Find-Bash {
  if ($Bash) {
    if (-not (Test-Path $Bash)) { throw "-Bash path not found: $Bash" }
    return @{ Path = $Bash; Why = "" }
  }
  $b = Find-Tool "bash"
  # On Windows, System32\bash.exe is the WSL launcher; it may have no distro. Do not guess.
  if ($b -and $OnWindows -and $env:WINDIR -and $b.StartsWith((Join-Path $env:WINDIR "System32"), [StringComparison]::OrdinalIgnoreCase)) { $b = $null }
  if ($b) { return @{ Path = $b; Why = "" } }
  $why = "bash not installed"
  if ($OnWindows) {
    $git = Find-Tool "git"
    if ($git) {
      $gitBash = Join-Path (Split-Path -Parent (Split-Path -Parent $git)) "bin/bash.exe"
      if (Test-Path $gitBash) { $why = "bash not on PATH (Git Bash is at $gitBash; pass -Bash to try it)" }
    }
  }
  return @{ Path = $null; Why = $why }
}

function Run-DeploySh {
  $found = Find-Bash
  if (-not $found.Path) { return Result "SKIP" "" $found.Why }
  $bashExe = $found.Path
  # Most of these meta-tests parse YAML and HCL with python3 and PyYAML.
  $probe = Invoke-Logged "deploy-sh" $bashExe @("-c", "python3 -c 'import yaml'") $Root
  if ($probe.Code -ne 0) { return Result "SKIP" "" "python3 with PyYAML is not available to bash (these tests need it)" }
  $tests = @(Get-ChildItem -Path (Join-Path $Root "deploy") -Recurse -Filter "*.test.sh" | Sort-Object FullName)
  if ($tests.Count -eq 0) { return Result "SKIP" "" "no deploy/*.test.sh" }
  $failed = @()
  foreach ($t in $tests) {
    $rel = $t.FullName.Substring($Root.Length + 1) -replace '\\', '/'
    $r = Invoke-Logged "deploy-sh" $bashExe @($rel) $Root
    if ($r.Code -ne 0) { $failed += $rel }
  }
  $counts = "$($tests.Count - $failed.Count)/$($tests.Count) scripts pass"
  if ($failed.Count -eq 0) { return Result "PASS" $counts "" }
  $failed | ForEach-Object { Write-Host "    failed: $_" }
  return Result "FAIL" $counts ""
}

function Run-Tftest {
  $tf = Find-Tool "terraform"
  if (-not $tf) { return Result "SKIP" "" "terraform not installed" }
  $dir = Join-Path $Root "deploy/terraform"
  if (-not (Test-Path (Join-Path $dir ".terraform"))) { return Result "SKIP" "" "run terraform init in deploy/terraform first (it downloads providers)" }
  $r = Invoke-Logged "tftest" $tf @("test", "-no-color") $dir
  $m = [regex]::Match($r.Text, '(\d+) passed, (\d+) failed')
  $counts = if ($m.Success) { "$($m.Groups[1].Value) passed, $($m.Groups[2].Value) failed" } else { "" }
  $status = if ($r.Code -eq 0) { "PASS" } else { "FAIL" }
  if ($status -eq "FAIL") { Show-Tail $r.Text }
  return Result $status $counts ""
}

$Runners = @{
  "desktop" = { Run-Desktop }; "web" = { Run-Web }; "tsc" = { Run-Tsc }; "python" = { Run-Python }
  "check" = { Run-Check }; "harness" = { Run-Harness }; "cdn" = { Run-Cdn }; "java" = { Run-Java }
  "deploy-sh" = { Run-DeploySh }; "tftest" = { Run-Tftest }
}

$oldQt = $env:QT_QPA_PLATFORM
$env:QT_QPA_PLATFORM = "offscreen"
Get-ChildItem -Path $LogDir -Filter "*.log" -ErrorAction SilentlyContinue | Remove-Item -ErrorAction SilentlyContinue

$rows = @()
$total = [Diagnostics.Stopwatch]::StartNew()
try {
  foreach ($s in $Suites) {
    $name = $s.Name
    $why = $null
    if ($Only.Count -gt 0 -and $Only -notcontains $name) { continue }
    if ($Skip -contains $name) { $why = "left out by -Skip" }
    elseif ($Quick -and $s.Slow -and $Only -notcontains $name) { $why = "left out by -Quick" }
    if ($why) {
      $rows += [pscustomobject]@{ Suite = $name; Result = "SKIP"; Counts = ""; Time = ""; Note = $why }
      continue
    }
    Write-Host ("== {0}: {1}" -f $name, $s.What)
    $sw = [Diagnostics.Stopwatch]::StartNew()
    try {
      $res = & $Runners[$name]
    } catch {
      $res = Result "FAIL" "" ("runner error: " + $_.Exception.Message)
    }
    $sw.Stop()
    $secs = "{0:N0}s" -f $sw.Elapsed.TotalSeconds
    $line = "   " + ((@($res.Status, $res.Counts, $res.Note) | Where-Object { $_ }) -join "  ")
    if ($res.Status -eq "FAIL") { Write-Host $line -ForegroundColor Red } else { Write-Host $line }
    $rows += [pscustomobject]@{ Suite = $name; Result = $res.Status; Counts = $res.Counts; Time = $secs; Note = $res.Note }
  }
} finally {
  $env:QT_QPA_PLATFORM = $oldQt
}
$total.Stop()

Write-Host ""
Write-Host "ComputerPets test-all summary"
$rows | Format-Table -AutoSize -Wrap Suite, Result, Counts, Time, Note | Out-String -Width 200 | Write-Host
$fails = @($rows | Where-Object { $_.Result -eq "FAIL" })
$passes = @($rows | Where-Object { $_.Result -eq "PASS" })
$skips = @($rows | Where-Object { $_.Result -eq "SKIP" })
Write-Host ("{0} passed, {1} failed, {2} skipped in {3:N0}s. Logs: {4}" -f $passes.Count, $fails.Count, $skips.Count, $total.Elapsed.TotalSeconds, $LogDir)
if ($fails.Count -gt 0) { exit 1 }
exit 0