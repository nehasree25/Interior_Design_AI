param(
    [string]$PythonCommand = "py -3"
)

$ErrorActionPreference = "Stop"

$venvPath = Join-Path $PSScriptRoot ".venv"
$requirementsPath = Join-Path $PSScriptRoot "requirements.txt"

if (-not (Test-Path $requirementsPath)) {
    throw "requirements.txt was not found at $requirementsPath"
}

if (-not (Test-Path $venvPath)) {
    Write-Host "Creating virtual environment at $venvPath"
    Invoke-Expression "$PythonCommand -m venv `"$venvPath`""
}

$pythonPath = Join-Path $venvPath "Scripts\python.exe"

Write-Host "Upgrading pip"
& $pythonPath -m pip install --upgrade pip

Write-Host "Installing backend requirements"
& $pythonPath -m pip install -r $requirementsPath

Write-Host "Done. Activate with: backend\.venv\Scripts\Activate.ps1"
