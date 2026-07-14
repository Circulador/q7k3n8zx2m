# Conexão entre modos — Guardião Digital da Operação

Este documento explica como **mapa**, **cadeia**, **diárias**, **chefões** e **semanais** alimentam o **mesmo progresso** do jogador.

## Hub central (Progresso)

Tudo converge no **Dashboard do Guardião** (`screenProfile`):

| Métrica | Alimentada por |
|---------|----------------|
| **XP / Nível / Moedas** | Qualquer acerto em campanha, cadeia, diária ou chefão |
| **Países** | Campanhas no mapa mundial |
| **Radar de temas** | Todos os modos de quiz (`themeStats`) — incluindo chefões |
| **Repetição espaçada** | Diária prioriza erros com intervalo 1→3→7 dias (`S.missed`) |
| **Revisão guiada** | Dashboard → “📚 Revisar meus erros” (sem penalidade) |
| **Reportar** | Após erro em phishing/BEC/dados — micro-compromisso de canal |
| **Debriefing** | Pós-campanha e pós-cadeia na tela de resultado |
| **Gestor (piloto)** | Dados reais da sua equipe neste dispositivo; outras equipes sem métrica fake |
| **Semana temática** | Meta extra: 8 acertos no tema da semana (rotação automática) |
| **Ofensiva (streak)** | Diária, campanha vencida, chefão concluído |
| **Chefões / Resiliência** | Tabletop com índice de maturidade |
| **Conquistas** | Marcos cruzados (países, chefões, XP, streak…) |
| **Certificado** | Snapshot de tudo acima + selo de resiliência |

## Fluxo por modo

### 🗺️ Mapa — Campanhas por país
- 6 situações **aleatórias** por país (temas do país + papel do jogador).
- Alternativas **embaralhadas** a cada exibição.
- Atualiza: `S.done`, `themeStats`, **semanal “campanhas”**, XP, conquistas de explorador.

### ⛓️ Cadeia Carajás → China
- 2 situações por etapa (mina, ferrovia, porto…), **ordem aleatória** a cada partida.
- Atualiza: `S.chainDone`, `themeStats`, desbloqueios na loja (ferroviário, moldura cadeia).

### 📅 Missão diária
- 5 situações do **BANK**, ordem aleatória; **prioriza temas fracos** no radar.
- Atualiza: `S.daily`, ofensiva, **semanal “acertos”**, XP.

### 🐉 Chefões (tabletop)
- 10 cenas **em sequência narrativa** (história conectada).
- **Alternativas embaralhadas** em cada cena.
- Atualiza: `S.bossStats`, resiliência operacional, **semanal “chefão”**, conquistas (Cadeia Protegida, Resiliência Lendária…), **selo do certificado**.

### 🏆 Desafios semanais
Não são um modo separado — **somam automaticamente** enquanto você joga:

| Meta semanal | Incrementa quando |
|--------------|-------------------|
| Acerte 20 situações | Qualquer acerto (mapa, cadeia, diária) |
| Complete 3 campanhas | Termina campanha de país no mapa |
| Vença 1 chefão | Conclui uma aventura tabletop |

## Ponte corporativo ↔ pessoal

Cada pergunta do BANK inclui campo **`personal`** (PT/EN): um paralelo lúdico da vida do colaborador (SMS de entrega, senha do banco, Wi-Fi de shopping…) para o jogador **pensar o princípio**, não decorar a letra.

Exibido na tela de quiz como **“💡 Na sua vida”**.

## Aleatoriedade (anti-decorar)

| Modo | Perguntas | Alternativas |
|------|-----------|--------------|
| Mapa | Embaralhadas por partida | Embaralhadas |
| Cadeia | Embaralhadas por partida | Embaralhadas |
| Diária | Embaralhadas + prioriza temas fracos | Embaralhadas |
| Chefão | Ordem fixa (narrativa) | Embaralhadas |

## Banco de perguntas — revisão manual

| Arquivo | Conteúdo |
|---------|----------|
| `js/questions-data.js` | BANK — campanhas e diárias (PT/EN, id, personal) |
| `js/bosses-data.js` | 6 chefões × 10 cenas |
| `js/game.js` → `CHAINS` | Perguntas da cadeia de produção |
| **`review.html`** | Interface de revisão no navegador (busca, filtro por fonte/tema/dificuldade, idioma PT / EN / PT+EN) |

Abra `review.html` no navegador ou use o link **“Revisar banco de perguntas”** no Dashboard.
