#Requires -Version 5.1

$ErrorActionPreference = "Stop"

$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir  = Join-Path $ScriptDir "petclinic-backend"
$FrontendDir = Join-Path $ScriptDir "petclinic-frontend"

$BackendProcess  = $null
$FrontendProcess = $null

function Stop-Services {
    Write-Host "Stopping backend and frontend..."

    if ($null -ne $BackendProcess -and -not $BackendProcess.HasExited) {
        taskkill /T /F /PID $BackendProcess.Id 2>$null | Out-Null
    }

    if ($null -ne $FrontendProcess -and -not $FrontendProcess.HasExited) {
        taskkill /T /F /PID $FrontendProcess.Id 2>$null | Out-Null
    }
}

if (-not (Test-Path $BackendDir)) {
    Write-Error "Backend directory not found: $BackendDir"
    exit 1
}

if (-not (Test-Path $FrontendDir)) {
    Write-Error "Frontend directory not found: $FrontendDir"
    exit 1
}

try {
    Write-Host "Starting Petclinic Backend (Spring Boot)..."
    $BackendProcess = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c cd /d `"$BackendDir`" && mvnw.cmd spring-boot:run" `
        -PassThru -NoNewWindow

    Write-Host "Starting Petclinic Frontend (Angular)..."
    $FrontendProcess = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c cd /d `"$FrontendDir`" && npm start" `
        -PassThru -NoNewWindow

    Write-Host "Backend PID:  $($BackendProcess.Id)"
    Write-Host "Frontend PID: $($FrontendProcess.Id)"
    Write-Host "Both services are starting. Press Ctrl+C to stop both."
    Write-Host "Frontend: http://localhost:4200/"
    Write-Host "Backend:  http://localhost:8080/"

    # Keep running until one process exits or Ctrl+C is pressed
    while (-not $BackendProcess.HasExited -and -not $FrontendProcess.HasExited) {
        Start-Sleep -Milliseconds 500
    }
}
finally {
    Stop-Services
}
