# PowerShell script om de volledige mappenstructuur aan te maken

$directories = @(
    "frontend/js",
    "frontend/assets",
    "frontend/assets/images",
    "frontend/assets/icons",
    "frontend/components",
    "backend",
    "backend/agents",
    "backend/api",
    "backend/models",
    "backend/services",
    "backend/utils",
    "backend/tests",
    "database",
    "database/migrations",
    "uploads",
    "uploads/cao_files",
    "uploads/temp",
    "outputs",
    "outputs/excel_files",
    "outputs/reports",
    "outputs/logs",
    "docs",
    "scripts"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force
    Write-Host "Created: $dir"
}

Write-Host "Mappenstructuur succesvol aangemaakt!"