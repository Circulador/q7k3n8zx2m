# 🛡️ Guardião Cibernético — Orbita

Jogo web **bilíngue (Português 🇧🇷 / Inglês 🇬🇧)** de conscientização em **Cyber Security e Segurança da Informação**, ambientado nas operações reais da Orbita ao redor do mundo. Funciona 100% no navegador, sem login, com suporte **PWA** (instalável e offline após a primeira visita).

**Versão atual:** `v74` · **Demo ao vivo:** [circulador.github.io/q7k3n8zx2m](https://circulador.github.io/q7k3n8zx2m/?v=74)

---

## ✨ Destaques desta versão

### Navegação e UX (mobile-first)

- **Barra inferior (5 itens):** Início · Mapa · **Missões** (diária + semanal unificadas) · Desafios / Crises · Eu · **Loja**
- **Barra superior:** idioma, ofensiva, resumo de progresso, **🧭 guia** (compasso), **📖 glossário**, ♿ acessibilidade, ⚙️ configurações
- **Narração por voz** apenas no menu ♿ (removida da topbar)
- **CTA contextual** na home (“Jogar agora”) conforme diária, revisão SRS, campanha ou crise
- **Menus fixos acima da taskbar** no celular (configurações, acessibilidade, glossário)

### Conteúdo e pedagogia

- **🗺️ Mapa “A Orbita no mundo”** — D3 + TopoJSON (`js/orbita-world-map.js`), alinhado a [orbita.com/pt/onde-estamos](https://www.orbita.com/pt/onde-estamos)
- **⛓️ Cadeia Carajás → China** — storytelling tabletop com SVG animado (`js/boss-maps.js`, `js/chain-data.js`)
- **🎯 Desafios / Crises** — 6 crises com 10 cenas cada; dicas **“Na sua vida”** únicas por cena (`js/boss-personal-tips.js`)
- **📅 Missões diárias** + **🏆 metas semanais** na mesma tela
- **🛒 Loja de recompensas**, **📊 perfil Eu**, **🧭 painel do gestor**, **📚 banco de revisão** in-app
- **📜 Certificado** gerável na aba Eu (PNG / impressão)

### Acessibilidade

- Narração por voz, alto contraste, texto grande, redução de animações, Libras/ASL (VLibras + ASL)
- Leitura fácil, modo simples, catálogo de recursos a11y em Configurações
- Navegação por teclado e regiões `aria-live`

### 🧪 Menu demo (temporário — QA)

Botão **🧪** na topbar (ou Configurações → Menu demo) para testar a jornada integrada **0% → 100%**:

| Preset | Simula |
|--------|--------|
| 0% | Conta nova, sem onboarding |
| 25% | Início — poucos países, diária pendente |
| 50% | Meio — metade do mapa, 1 crise |
| 75% | Avançado — mapa quase completo, gestor on |
| 100% | Tudo desbloqueado |

Inclui atalhos de estado (diária, semana, moedas, gestor) e **ir para tela** (mapa, missões, crises, loja, etc.).

---

## 📂 Estrutura do projeto

```
.
├── index.html              # Telas, topbar, taskbar inferior, PWA
├── manifest.webmanifest
├── sw.js                   # Service Worker (cache v74)
├── README.md
├── RACIONAL-PEDAGOGICO.md
├── review.html             # Banco de revisão (legado; revisão também in-app)
├── test_a11y.py
├── test-a11y.mjs
├── assets/
│   ├── orbita-logo.svg
│   ├── countries-110m.json
│   ├── d3.min.js
│   └── topojson-client.min.js
├── css/
│   └── styles.css
├── icons/                  # PWA (192 / 512)
└── js/
    ├── game.js             # Jogo, i18n, navegação, certificado, gestor…
    ├── orbita-world-map.js # Mapa mundial (D3/TopoJSON)
    ├── bosses-data.js      # Crises / storytelling (10 cenas)
    ├── boss-maps.js        # SVG animado da cadeia (não alterar fluxo)
    ├── boss-personal-tips.js
    ├── chain-data.js
    ├── questions-data.js
    ├── country-questions-data.js
    ├── review-bank.js
    ├── access-gate.js
    ├── sign-lang.js        # VLibras / ASL
    └── demo-menu.js        # Menu demo temporário (QA)
```

> Lógica principal: **`js/game.js`**. Versão de cache: `window.APP_VERSION` em `index.html` e `CACHE_VERSION` em `sw.js` (atualmente **74**). Ao publicar, altere ambos e use `?v=74` na URL para forçar atualização.

---

## ▶️ Como executar

### Opção 1 — Servidor local (recomendado)

```bash
cd GuardiaoDigitalVale
python -m http.server 8093
```

Abra **http://localhost:8093** ou **http://localhost:8093/?v=74** após mudanças em CSS/JS.

### Opção 2 — GitHub Pages

Deploy automático na branch `main`. URL: [circulador.github.io/q7k3n8zx2m](https://circulador.github.io/q7k3n8zx2m/?v=74)

### Fluxo do jogador

1. Escolha **idioma** e **acessibilidade** (onboarding ou menu ♿).
2. Complete **equipe e papel** (setup) para personalizar missões.
3. Use a **taskbar inferior** e a **topbar** para navegar.
4. Progresso, preferências e conquistas ficam em `localStorage` (`guardiao_orbita_v7`).

### Testar integração (demo)

1. Abra o jogo e toque em **🧪** na topbar.
2. Aplique presets **0% → 25% → 50% → 75% → 100%** e confira o painel de status + CTA da home.
3. Use **Ir para tela** para validar mapa, missões, crises, loja e gestor.

---

## 🧪 Testes de acessibilidade

| Script | Comando | Porta |
|--------|---------|-------|
| Python | `python test_a11y.py` | 8095 |
| Node   | `node test-a11y.mjs`  | 8094 |

**Pré-requisito:** Playwright com Chromium.

---

## 🌍 Publicar nova versão

1. Atualize `window.APP_VERSION` em `index.html`, query `?v=` nos assets, `CACHE_VERSION` e lista `PRECACHE` em `sw.js`, e ícones em `manifest.webmanifest`.
2. Commit e push para `main`.
3. Aguarde o GitHub Pages (1–2 min) e acesse com `?v=XX` para evitar cache antigo.

---

## 🔒 Aviso

Ferramenta **educativa interna**. O mapa e as operações referenciam informações públicas da Orbita. O certificado é ilustrativo e **não substitui certificações oficiais**. Siga sempre as políticas oficiais de segurança da Orbita.
