# 🛡️ Guardião Digital da Operação — Orbita

Jogo web **bilíngue (Português 🇧🇷 / Inglês 🇬🇧)** de conscientização em **Cyber Security e Segurança da Informação**, ambientado nas operações reais da Orbita ao redor do mundo. Funciona 100% no navegador, sem login.

---

## ✨ Destaques desta versão

- **🗺️ Mapa “A Orbita no mundo”** — componente em `js/orbita-world-map.js` (D3 + TopoJSON + `assets/countries-110m.json`), alinhado ao mapa oficial de [orbita.com/pt/onde-estamos](https://www.orbita.com/pt/onde-estamos). Legendas de **Atuação** (11) e **Portfólio** (7), filtro clicável, tooltip e lista de países. **Ícones 100% offline** (SVG inline — sem dependência de orbita.com).
- **⛓️ Cadeia Carajás → China** — aba **Cadeia ferro** no mapa: animação vetorial da mina S11D à China (ferrovia EFC, porto Ponta da Madeira, navio Orbitamax).
- **📜 Certificado na aba Progresso** — gere, baixe (PNG) ou imprima seu certificado **em qualquer fase** do jogo, com nome, título, equipe e estatísticas atuais.
- **♿ Acessibilidade** — narração por voz, alto contraste, texto grande, redução de animações, Libras/ASL, navegação por teclado e regiões `aria-live`. Painel branco do mapa revisado para contraste WCAG (≥ 4.5:1).
- **🎯 Campanhas por país**, **🐉 Boss Fights**, **📅 diárias**, **🏆 semanais**, **🎨 loja**, **📊 dashboard + radar**, **🏅 conquistas**, **🧭 painel do gestor** com exportação CSV.

---

## 📂 Estrutura do projeto

```
.
├── index.html                 # Telas, mapa Orbita, taskbar inferior
├── README.md
├── RACIONAL-PEDAGOGICO.md
├── test_a11y.py               # Testes A11y (Playwright + Python)
├── test-a11y.mjs              # Testes A11y (Playwright + Node)
├── assets/
│   ├── orbita-logo.svg
│   ├── countries-110m.json    # Atlas mundial (offline)
│   ├── d3.min.js
│   └── topojson-client.min.js
├── css/
│   └── styles.css
└── js/
    ├── game.js                # Jogo, i18n, navegação, certificado, gestor…
    ├── orbita-world-map.js      # Motor do mapa oficial Orbita (D3/TopoJSON)
    └── sign-lang.js           # Integração VLibras/ASL
```

> A lógica principal permanece em **`js/game.js`**. O mapa mundial está em **`js/orbita-world-map.js`** (D3/TopoJSON). Versão de cache: `window.APP_VERSION` em `index.html` (atualmente **26**).

---

## ▶️ Como executar

### Opção 1 — Servidor local (recomendado)

```bash
cd q7k3n8zx2m
python -m http.server 8093
```

Abra **http://localhost:8093** (ou `http://localhost:8093/index.html?v=26` após alterações em CSS/JS).

### Opção 2 — Abrir direto

Abra `index.html` no navegador. Alguns recursos (fetch do atlas) podem exigir servidor HTTP.

### Fluxo

1. Escolha **idioma** e **acessibilidade** na tela inicial.
2. Clique em **Começar**, defina nome, equipe e papel.
3. Use a **taskbar inferior**: Início, Mapa, Diária, Bosses, Semanal, Loja, **Progresso**, Gestor.

Progresso, preferências e conquistas ficam no `localStorage` do navegador.

---

## 🧪 Testes de acessibilidade

Dois scripts automatizam cenários na home e no menu ♿ A11y (toggles, estado salvo corrompido, restaurar padrão). Cada script sobe seu próprio servidor temporário:

| Script | Comando | Porta interna |
|--------|---------|-----------------|
| Python | `python test_a11y.py` | 8095 |
| Node   | `node test-a11y.mjs`  | 8094 |

**Pré-requisito:** Playwright com Chromium (`pip install playwright && playwright install chromium` ou `npm i playwright`).

Para desenvolvimento manual, use a porta **8093** (`python -m http.server 8093`).

---

## 🌍 Publicando no GitHub Pages

1. Suba os arquivos para o repositório (mantendo a estrutura de pastas).
2. **Settings → Pages → Branch: `main` / root**.
3. Acesse a URL gerada.

---

## 🔒 Aviso

Ferramenta **educativa interna**. O mapa e as operações são referências públicas (orbita.com/pt/onde-estamos). O certificado é ilustrativo e **não substitui certificações oficiais**. Siga sempre as políticas oficiais de segurança da Orbita.
