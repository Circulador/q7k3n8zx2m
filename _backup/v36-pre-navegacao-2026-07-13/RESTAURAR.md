# Backup — Guardião Digital v36 (antes da navegação nos quizzes)

**Data:** 13/07/2026  
**Versão:** `APP_VERSION=36`  
**Conteúdo:** Estado completo antes de simplificação UX + botões Voltar/Avançar/Sair nos quizzes.

## O que este backup inclui

- Pedagogia v36 (SRS, reportar, debrief, gestor piloto, país, semana temática)
- Banco de revisão (`review.html`)
- `country-questions-data.js`, `chain-data.js`, `review-bank.js`
- Todos os assets, CSS, testes a11y

## Como restaurar (Windows PowerShell)

```powershell
$root = "c:\temp\Workshop Cursor\GuardiaoDigitalVale"
$bak  = "$root\_backup\v36-pre-navegacao-2026-07-13"

# Cópia dos arquivos do backup para a raiz do projeto
Copy-Item -Path "$bak\*" -Destination $root -Recurse -Force
```

Depois recarregue o jogo com **Ctrl+F5**.

## Restaurar só um arquivo

```powershell
Copy-Item "$bak\js\game.js" "$root\js\game.js" -Force
```

## Próximas melhorias planejadas (ainda não neste backup)

- Barra inferior com 4 itens (Mapa · Diária · Chefões · Progresso)
- Unificar “Revisar”
- Renomear resiliência do HUD
- Trilha “Minha semana” no onboarding
