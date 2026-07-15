# 🛡️ Guardião Cibernético — Orbita

Jogo web **bilíngue (Português 🇧🇷 / Inglês 🇬🇧)** de conscientização em **Cyber Security e Segurança da Informação**, ambientado nas operações reais da Orbita ao redor do mundo. Funciona 100% no navegador, sem login, com suporte **PWA** (instalável e offline após a primeira visita).

**Versão atual:** `v131` · **Demo ao vivo:** [circulador.github.io/q7k3n8zx2m](https://circulador.github.io/q7k3n8zx2m/?v=131)

---

## ✨ Destaques desta versão

### Perfil unificado (onboarding + edição)

Uma **única tela de perfil** (`#screenSetup`) cobre nome, equipe e papel:

| Momento | Badge | Título |
|---------|-------|--------|
| **Primeira vez** (após onboarding) | 👤 Perfil rápido | Personalize seu perfil |
| **Edição** (Configurações ou aba Eu) | ✏️ Editar perfil | Editar perfil |

**Equipes (10):** Mina · Ferrovia · Porto · Corporativo · TI & Segurança · Automação (OT) · Logística · Energia · Projetos & Engenharia · Sustentabilidade

**Papéis (8):** Administrativo · Operação/Campo · Automação (OT) · Liderança · Analista · Técnico · Terceiros · Em formação

- **Nome (opcional)** no topo — certificado e ranking (`Exemplo: Rodolfo Conte`)
- Onboarding em **5 passos** → Setup → primeira atividade

### Conquistas e certificado

**16 conquistas** ligadas às mecânicas do jogo: perfil, mapa, diária, metas semanais, cadeia Norte, crises, sequência e glossário.

Certificado com **layout revisado** — estatísticas em grade (rótulo + valor) e conquistas em 3 colunas sem sobreposição.

### Navegação e UX (mobile-first)

- **Barra inferior (5 itens):** Início · Mapa · **Missões** (diária + semanal) · Desafios / Crises · Eu · **Loja**
- **Barra superior:** idioma, ofensiva, progresso, **🧭 guia**, **📖 glossário**, ♿ acessibilidade, ⚙️ configurações
- **Início e Missões (UX v2):** hierarquia clara, linguagem acessível, CTA contextual (“Jogar agora”)
- Rollback de interface legada via `?ux=122` (sem toggle na UI)
- Menus fixos acima da taskbar no celular

### Conteúdo e pedagogia

- **🗺️ Mapa “A Orbita no mundo”** — D3 + TopoJSON, alinhado a [orbita.com/pt/onde-estamos](https://www.orbita.com/pt/onde-estamos)
- **⛓️ Cadeia Carajás → China** — storytelling tabletop com SVG animado
- **🎯 Desafios / Crises** — 6 crises com 10 cenas cada; mapas vetoriais animados por cenário (Carajás, escritórios, BEC, OT, hub Omã, vazamento, porto)
- **📅 Missões diárias** + **🏆 metas semanais** na mesma tela
- **🛒 Loja**, **📊 perfil Eu**, **🧭 painel do gestor**, **📚 banco de revisão** in-app
- **📜 Certificado** gerável na aba Eu (PNG / impressão)

### Acessibilidade

- Narração por voz, alto contraste, texto grande, redução de animações, Libras/ASL (VLibras + ASL)
- Leitura fácil, modo simples, catálogo de recursos a11y em Configurações
- Navegação por teclado e regiões `aria-live`

### 🧪 Menu demo (temporário — QA)

Em **Configurações → Menu demo** — testa a jornada integrada **0% → 100%**:

| Preset | Simula |
|--------|--------|
| 0% | Conta nova, sem onboarding |
| 25% | Início — poucos países, diária pendente |
| 50% | Meio — metade do mapa, 1 crise |
| 75% | Avançado — mapa quase completo, gestor on |
| 100% | Tudo desbloqueado |

Inclui atalhos de estado e **ir para tela** (mapa, missões, crises, loja, etc.).

---

## 📂 Estrutura do projeto

```
.
├── index.html              # Telas, topbar, taskbar inferior, PWA
├── manifest.webmanifest
├── sw.js                   # Service Worker (cache v130)
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
    ├── boss-maps.js        # SVG animado da cadeia
    ├── boss-personal-tips.js
    ├── chain-data.js
    ├── questions-data.js
    ├── country-questions-data.js
    ├── review-bank.js
    ├── access-gate.js
    ├── sign-lang.js        # VLibras / ASL
    └── demo-menu.js        # Menu demo temporário (QA)
```

> Lógica principal: **`js/game.js`**. Versão de cache: `window.APP_VERSION` em `index.html` e `CACHE_VERSION` em `sw.js` (atualmente **130**). Ao publicar, altere ambos e use `?v=130` na URL para forçar atualização.

---

## ▶️ Como executar

### Opção 1 — Servidor local (recomendado)

```bash
cd GuardiaoDigitalVale
python -m http.server 8093
```

Abra **http://localhost:8093** ou **http://localhost:8093/?v=130** após mudanças em CSS/JS.

### Opção 2 — GitHub Pages

Deploy automático na branch `main`. URL: [circulador.github.io/q7k3n8zx2m](https://circulador.github.io/q7k3n8zx2m/?v=130)

### Fluxo do jogador

1. Escolha **idioma** e **acessibilidade** (onboarding ou menu ♿).
2. **Personalize seu perfil** — nome (opcional), equipe e papel.
3. Use a **taskbar inferior** e a **topbar** para navegar.
4. Edite o perfil depois em **⚙️ Configurações** ou **Eu → Editar perfil**.
5. Progresso, preferências e conquistas ficam em `localStorage` (`guardiao_orbita_v7`).

### Testar integração (demo)

1. Abra o jogo e vá em **⚙️ Configurações → Menu demo**.
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
3. Aguarde o GitHub Pages (1–2 min) e acesse com `?v=XX` para evitar cache antigo do Service Worker.

---

## 🔒 Aviso

Ferramenta **educativa interna**. O mapa e as operações referenciam informações públicas da Orbita. O certificado é ilustrativo e **não substitui certificações oficiais**. Siga sempre as políticas oficiais de segurança da Orbita.
