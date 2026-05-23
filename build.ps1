# build.ps1 — local build for EnterprisePetBackend
# Run from the project root: .\build.ps1

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "==> Project: $projectRoot" -ForegroundColor Cyan

# --- Pre-flight: JDK 21 ---
$javaVersion = $null
try {
    $javaOut = & java -version 2>&1 | Out-String
    if ($javaOut -match '"(\d+)(\.\d+)?') {
        $javaVersion = [int]$matches[1]
    }
} catch {
    Write-Host "ERROR: 'java' not on PATH. Install JDK 21 from https://adoptium.net/." -ForegroundColor Red
    exit 1
}

if ($null -eq $javaVersion -or $javaVersion -lt 21) {
    Write-Host "ERROR: JDK 21 required (pom declares <java.version>21</java.version>). Detected: $javaOut" -ForegroundColor Red
    Write-Host "Install Temurin 21 from https://adoptium.net/ and set JAVA_HOME accordingly." -ForegroundColor Yellow
    exit 1
}
Write-Host "==> Java OK (>= 21)" -ForegroundColor Green

# --- Pre-flight: Maven 3.9+ ---
try {
    $mvnOut = & mvn -v 2>&1 | Out-String
} catch {
    Write-Host "ERROR: 'mvn' not on PATH. Install Maven 3.9+ from https://maven.apache.org/." -ForegroundColor Red
    exit 1
}
if ($mvnOut -notmatch "Apache Maven (3\.\d+|[4-9])") {
    Write-Host "ERROR: Maven 3.9+ required. Detected: $mvnOut" -ForegroundColor Red
    exit 1
}
Write-Host "==> Maven OK" -ForegroundColor Green

# --- Warn about the application (1).yml issue ---
if (Test-Path "src\main\resources\application (1).yml") {
    Write-Host ""
    Write-Host "WARNING: 'src\main\resources\application (1).yml' is present." -ForegroundColor Yellow
    Write-Host "  Spring Boot will NOT load this file at runtime (it expects 'application.yml')." -ForegroundColor Yellow
    Write-Host "  Compile will still succeed, but the app will fail to start until you rename it." -ForegroundColor Yellow
    Write-Host ""
}

# --- Build ---
Write-Host "==> Running: mvn -B -DskipTests clean package" -ForegroundColor Cyan
& mvn -B -DskipTests clean package
if ($LASTEXITCODE -ne 0) {
    Write-Host "==> BUILD FAILED (exit $LASTEXITCODE)" -ForegroundColor Red
    exit $LASTEXITCODE
}

# --- Report output ---
$jar = Get-ChildItem -Path "target" -Filter "*.jar" -ErrorAction SilentlyContinue | Where-Object { $_.Name -notmatch "original|sources|javadoc" } | Select-Object -First 1
if ($jar) {
    Write-Host ""
    Write-Host "==> BUILD OK" -ForegroundColor Green
    Write-Host "    JAR: $($jar.FullName)" -ForegroundColor Green
    Write-Host "    Size: $([math]::Round($jar.Length / 1MB, 1)) MB" -ForegroundColor Green
    Write-Host ""
    Write-Host "    Run with:  java -jar `"$($jar.FullName)`"" -ForegroundColor Cyan
} else {
    Write-Host "==> Build succeeded but no fat JAR was found under target\." -ForegroundColor Yellow
}
