# Restaura backup v36-pre-navegacao para a raiz do projeto
$ErrorActionPreference = "Stop"
$bak = $PSScriptRoot
$root = (Get-Item $bak).Parent.Parent.FullName
Write-Host "Restaurando de: $bak"
Write-Host "Para:           $root"
Copy-Item -Path "$bak\*" -Destination $root -Recurse -Force
Write-Host "Concluido. Abra index.html e use Ctrl+F5."
