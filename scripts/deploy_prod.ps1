# PowerShell Automated Production Deployment Script for SIMONA-BT
# Target: https://simona-bt.ru (simona_prod, 5.188.30.184)

param (
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$SSH_HOST = "simona_prod"
$BUNDLE_PATH = Join-Path $PSScriptRoot "prod_bundle.tar.gz"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "SIMONA-BT: Deploying to Production (https://simona-bt.ru)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Typecheck
Write-Host "Step 1: Running local TypeScript verification..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Error "TypeScript check failed. Aborting deployment."
    exit 1
}
Write-Host "TypeScript check PASSED." -ForegroundColor Green

# 2. Package bundle
Write-Host "Step 2: Packaging project bundle..." -ForegroundColor Yellow
if (Test-Path $BUNDLE_PATH) {
    Remove-Item $BUNDLE_PATH -Force
}

$TarExcludes = @(
    "--exclude=node_modules",
    "--exclude=.next",
    "--exclude=.git",
    "--exclude=*.log",
    "--exclude=.env*",
    "--exclude=*bundle.tar.gz",
    "--exclude=prisma/dev.db*",
    "--exclude=data/*.backup*",
    "--exclude=storage/uploads"
)

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
& tar -czf $BUNDLE_PATH @TarExcludes -C $ProjectRoot .
if ($LASTEXITCODE -gt 1) {
    Write-Error "Failed to package bundle."
    exit 1
}
Write-Host "Created bundle: $BUNDLE_PATH" -ForegroundColor Green

# 3. Transfer bundle
Write-Host "Step 3: Uploading bundle to $SSH_HOST..." -ForegroundColor Yellow
scp $BUNDLE_PATH "${SSH_HOST}:/tmp/simona_prod_bundle.tar.gz"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to upload bundle to server."
    exit 1
}
Remove-Item $BUNDLE_PATH -Force
Write-Host "Upload complete." -ForegroundColor Green

# 4. Upload deploy runner script
Write-Host "Step 4: Executing remote production build on server..." -ForegroundColor Yellow
scp (Join-Path $PSScriptRoot "remote_build_prod.sh") "${SSH_HOST}:/tmp/remote_build_prod.sh"
ssh $SSH_HOST "chmod +x /tmp/remote_build_prod.sh && /tmp/remote_build_prod.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Remote deployment failed."
    exit 1
}

# 5. Verify live URL
Write-Host "Step 5: Verifying live production URL..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
$Status = curl.exe -s -o NUL -w "%{http_code}" https://simona-bt.ru
Write-Host "HTTP Status: $Status" -ForegroundColor Green

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT SUCCESSFUL: https://simona-bt.ru" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
