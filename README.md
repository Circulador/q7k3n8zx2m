# 🛡️ Guardião Cibernético — Orbita

Jogo web **bilíngue (Português 🇧🇷 / Inglês 🇬🇧)** de conscientização em **Cyber Security e Segurança da Informação**, ambientado nas operações reais da Orbita ao redor do mundo. Funciona 100% no navegador, sem login, com suporte **PWA** (instalável e offline após a primeira visita).

**Versão atual:** `v156` · **Demo ao vivo:** [circulador.github.io/q7k3n8zx2m](https://circulador.github.io/q7k3n8zx2m/?v=156)

---

## ✨ Destaques desta versão

### Perfil escalável (equipe × papel)

Configuração centralizada em **`js/profile-data.js`** — novas equipes e papéis podem ser adicionados sem alterar `game.js`.

| Momento | Badge | Título |
|---------|-------|--------|
| **Primeira vez** (após onboarding) | 👤 Perfil rápido | Personalize seu perfil |
| **Edição** (Configurações ou aba Eu) | ✏️ Editar perfil | Editar perfil |

**Equipes (10):** Mina · Ferrovia · Porto · Corporativo · TI & Segurança · Automação (OT) · Logística · Energia · Projetos & Engenharia · Sustentabilidade

**Papéis (8):** Administrativo · Operação/Campo · Automação (OT) · Liderança · Analista · Técnico · Terceiros · Em formação

- **Matriz de correlação** área × rotina (alta / média / baixa / especial) com feedback dinâmico no setup
- **Nome (opcional)** no topo — certificado e ranking
- Onboarding em **5 passos** → Setup → primeira atividade

### Home mobile-first (UX v2)

- **Launcher de 5 segundos:** CTA principal no topo, metas semanais compactas (chips), próxima conquista e contexto social por área
- **Sticky CTA** no mobile quando a diária está pendente
- **Faixa “Como funciona”** recolhível nos primeiros dias
- Rollback de interface legada via `?ux=122` ou toggle em Configurações

### Navegação (mobile-first)

**Barra inferior (5 itens):**

Início → Mapa → Desafios / Crises → Missões → Eu

**Barra superior:** idioma, ofensiva, progresso, 📖 glossário, ♿ acessibilidade, ⚙️ configurações

**Dentro de ⚙️ Configurações:**

- 🧭 Reabrir guia do jogo
- 🛒 Loja
- ✏️ Editar perfil
- Tema, acessibilidade, modo simples, painel do gestor, menu demo

> A **Loja** e o **Guia** saíram da taskbar inferior e da toolbar — ficam apenas em Configurações.

### Conteúdo e pedagogia

- **🗺️ Mapa “A Orbita no mundo”** — D3 + TopoJSON
- **⛓️ Cadeia Carajás → China** — storytelling tabletop com SVG animado
- **🎯 Desafios / Crises** — crises com cenas interativas e mapas vetoriais por cenário
- **📅 Missões diárias** + **🏆 metas semanais** na mesma tela
- **16 conquistas**, **📜 certificado** (PNG / impressão), **🧭 painel do gestor**, **📚 banco de revisão** in-app

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
├── sw.js                   # Service Worker (cache v156)
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
    ├── profile-data.js     # Equipes, papéis, correlação (escalável)
    ├── orbita-world-map.js # Mapa mundial (D3/TopoJSON)
    ├── bosses-data.js      # Crises / storytelling
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

> Lógica principal: **`js/game.js`**. Versão de cache: `window.APP_VERSION` em `index.html` e `CACHE_VERSION` em `sw.js` (atualmente **156**). Ao publicar, altere ambos e use `?v=156` na URL para forçar atualização.

---

## ▶️ Como executar

### Opção 1 — Servidor local (recomendado)

```powershell
cd GuardiaoDigitalVale
python -m http.server 8093
```

Abra **[http://localhost:8093/?v=156](http://localhost:8093/?v=156)** após mudanças em CSS/JS.

### Opção 2 — GitHub Pages

Deploy automático na branch `main`. URL: [circulador.github.io/q7k3n8zx2m/?v=156](https://circulador.github.io/q7k3n8zx2m/?v=156)

### Fluxo do jogador

1. Escolha **idioma** e **acessibilidade** (onboarding ou menu ♿).
2. **Personalize seu perfil** — onde você atua e como é seu trabalho.
3. Na **Início**, use o botão ▶️ principal para o próximo passo do treino.
4. Navegue pela **taskbar inferior** (Início, Mapa, Desafios/Crises, Missões, Eu).
5. **Loja** e **guia** ficam em **⚙️ Configurações**.
6. Progresso, preferências e conquistas ficam em `localStorage` (`guardiao_orbita_v7`).

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
2. Atualize este `README.md` (versão, URLs e destaques).
3. Commit e push para `main`.
4. Aguarde o GitHub Pages (1–2 min) e acesse com `?v=XX` para evitar cache antigo do Service Worker.

---

## 🔒 Aviso

Ferramenta **educativa interna**. O mapa e as operações referenciam informações públicas da Orbita. O certificado é ilustrativo e **não substitui certificações oficiais**. Siga sempre as políticas oficiais de segurança da Orbita.
