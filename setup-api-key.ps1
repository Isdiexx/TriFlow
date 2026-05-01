# Setup script para configurar la API key de Anthropic

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         Configuración de TriFlow - API Key Anthropic      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar si el archivo .env ya existe
if (Test-Path ".env") {
    Write-Host "✓ Archivo .env ya existe" -ForegroundColor Green
    $apiKey = Select-String "ANTHROPIC_KEY" .env | ForEach-Object { $_.Line }
    if ($apiKey -match "sk_ant") {
        Write-Host "✓ API key ya está configurada" -ForegroundColor Green
        exit 0
    }
} else {
    Write-Host "○ Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Archivo .env creado" -ForegroundColor Green
}

Write-Host ""
Write-Host "Para obtener tu API key:" -ForegroundColor Yellow
Write-Host "  1. Ve a https://console.anthropic.com/account/keys" -ForegroundColor White
Write-Host "  2. Crea una nueva API key" -ForegroundColor White
Write-Host "  3. Cópiala aquí:" -ForegroundColor White
Write-Host ""

$apiKey = Read-Host "Pega tu API key (sk_ant_...)"

if ($apiKey -match "^sk_ant_") {
    # Actualizar el archivo .env
    (Get-Content ".env") -replace "ANTHROPIC_KEY=.*", "ANTHROPIC_KEY=$apiKey" | Set-Content ".env"
    Write-Host ""
    Write-Host "✓ API key configurada correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Siguiente paso:" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✗ API key inválida. Debe comenzar con 'sk_ant_'" -ForegroundColor Red
    exit 1
}
