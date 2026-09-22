# Windows GPU probe. Prints a line protocol. Never substitutes 0 for a missing reading.
# Temperature and power come from nvidia-smi when it actually prints them.
# Utilization and memory can come from English GPU performance counters.
# A missing tool or counter is ABSENT, not a zero.
$ErrorActionPreference = "SilentlyContinue"
$ProgressPreference = "SilentlyContinue"
$OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

function Format-Invariant([double]$n) {
  return $n.ToString([Globalization.CultureInfo]::InvariantCulture)
}

$nvidiaCmd = Get-Command nvidia-smi -ErrorAction SilentlyContinue
if (-not $nvidiaCmd) {
  Write-Output "NVIDIA_ABSENT"
} else {
  $raw = & $nvidiaCmd.Source --query-gpu=name,temperature.gpu,utilization.gpu,memory.used,memory.total,power.draw --format=csv,noheader,nounits 2>$null
  if ($LASTEXITCODE -ne 0 -or $null -eq $raw) {
    Write-Output "NVIDIA_ABSENT"
  } else {
    $lines = @($raw | ForEach-Object { "$_".Trim() } | Where-Object { $_ })
    if ($lines.Count -eq 0) {
      Write-Output "NVIDIA_EMPTY"
    } else {
      Write-Output "NVIDIA"
      foreach ($line in $lines) { Write-Output $line }
      Write-Output "ENDNVIDIA"
    }
  }
}

try {
  $engineCounter = Get-Counter "\GPU Engine(*)\Utilization Percentage" -ErrorAction Stop
  Write-Output "ENGINE"
  foreach ($sample in @($engineCounter.CounterSamples)) {
    $value = [double]::NaN
    $ok = [double]::TryParse(
      [string]$sample.CookedValue,
      [Globalization.NumberStyles]::Float,
      [Globalization.CultureInfo]::InvariantCulture,
      [ref]$value
    )
    if (-not $ok) { continue }
    if ([double]::IsNaN($value) -or [double]::IsInfinity($value)) { continue }
    $name = [string]$sample.InstanceName
    if (-not $name) { continue }
    Write-Output ($name + "`t" + (Format-Invariant $value))
  }
  Write-Output "ENDENGINE"
} catch {
  Write-Output "ENGINE_ABSENT"
}

$usage = @{}
$limit = @{}
$usageOk = $false
$limitOk = $false
try {
  $usageCounter = Get-Counter "\GPU Adapter Memory(*)\Dedicated Usage" -ErrorAction Stop
  $usageOk = $true
  foreach ($sample in @($usageCounter.CounterSamples)) {
    $value = [double]::NaN
    $ok = [double]::TryParse(
      [string]$sample.CookedValue,
      [Globalization.NumberStyles]::Float,
      [Globalization.CultureInfo]::InvariantCulture,
      [ref]$value
    )
    if (-not $ok) { continue }
    if ([double]::IsNaN($value) -or [double]::IsInfinity($value)) { continue }
    $name = [string]$sample.InstanceName
    if (-not $name) { continue }
    $usage[$name] = $value
  }
} catch {
  $usageOk = $false
}
try {
  $limitCounter = Get-Counter "\GPU Adapter Memory(*)\Dedicated Limit" -ErrorAction Stop
  $limitOk = $true
  foreach ($sample in @($limitCounter.CounterSamples)) {
    $value = [double]::NaN
    $ok = [double]::TryParse(
      [string]$sample.CookedValue,
      [Globalization.NumberStyles]::Float,
      [Globalization.CultureInfo]::InvariantCulture,
      [ref]$value
    )
    if (-not $ok) { continue }
    if ([double]::IsNaN($value) -or [double]::IsInfinity($value)) { continue }
    $name = [string]$sample.InstanceName
    if (-not $name) { continue }
    $limit[$name] = $value
  }
} catch {
  $limitOk = $false
}

if (-not $usageOk -and -not $limitOk) {
  Write-Output "MEMORY_ABSENT"
} else {
  Write-Output "MEMORY"
  $names = @($usage.Keys + $limit.Keys | Select-Object -Unique)
  foreach ($name in $names) {
    $usedText = ""
    $limitText = ""
    if ($usage.ContainsKey($name)) { $usedText = Format-Invariant ([double]$usage[$name]) }
    if ($limit.ContainsKey($name)) { $limitText = Format-Invariant ([double]$limit[$name]) }
    Write-Output ($name + "`t" + $usedText + "`t" + $limitText)
  }
  Write-Output "ENDMEMORY"
}

Write-Output "END"
exit 0
