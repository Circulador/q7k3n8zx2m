/* =============================================================================
   PERFIL ESCALÁVEL — equipes (Sua equipe) e papéis (Seu dia a dia)

   COMO ESCALAR
   ------------
   1) Nova EQUIPE: copie um objeto em PROFILE_CONFIG.teams, defina id único.
      - themes: temas de quiz priorizados (ids de THEMES em game.js)
      - glossary: termos sugeridos no glossário
      - scenarioReplace (opcional): adapta texto genérico de “porto” ao contexto
      - skipScenarioAdapt: true se a equipe já usa cenários nativos (ex.: porto)

   2) Novo PAPEL (dia a dia): copie um objeto em PROFILE_CONFIG.roles.
      - themes + glossary: mesma lógica
      - ptd / end: subtítulo exibido no card e na home

   3) PERGUNTAS (questions-data.js / country-questions-data.js):
      - teams: ["id_equipe"] — prioriza para quem está na equipe
      - roles: ["id_papel"] — prioriza para quem tem o papel
      - qByTeam: { id_equipe: { q: { pt, en } } } — texto exclusivo por equipe

   4) Publique com nova versão (?v=) no index.html e sw.js.

   Não é necessário alterar game.js ao adicionar equipe ou papel.
   ============================================================================= */

var PROFILE_CONFIG = {
  defaults: {
    team: "mina",
    role: "field",
    glossary: ["phishing", "mfa", "ransomware", "vpn"]
  },
  teams: [
    {
      id: "mina", ico: "⛏️", pt: "Mina", en: "Mine", order: 10,
      themes: ["ot", "device", "port", "phishing", "data"],
      glossary: ["scada", "plc", "homolog"],
      scenarioReplace: {
        pt: [[/\bNo porto\b/g, "Na mina"], [/\bno porto\b/g, "na mina"], [/\bterminal portuário\b/gi, "área de controle da mina"]],
        en: [[/\bAt the port\b/g, "At the mine"], [/\bat the port\b/g, "at the mine"], [/\bport terminal\b/gi, "mine control area"]]
      }
    },
    {
      id: "ferrovia", ico: "🚂", pt: "Ferrovia", en: "Railway", order: 20,
      themes: ["ot", "device", "remote", "phishing", "data"],
      glossary: ["homolog", "badusb", "screenlock"],
      scenarioReplace: {
        pt: [[/\bNo porto\b/g, "Na ferrovia"], [/\bno porto\b/g, "na ferrovia"], [/\bterminal portuário\b/gi, "pátio ferroviário"]],
        en: [[/\bAt the port\b/g, "On the railway"], [/\bat the port\b/g, "on the railway"], [/\bport terminal\b/gi, "rail yard"]]
      }
    },
    {
      id: "porto", ico: "🚢", pt: "Porto", en: "Port", order: 30,
      themes: ["port", "ot", "device", "phishing", "data"],
      glossary: ["homolog", "badusb", "permissions"],
      skipScenarioAdapt: true
    },
    {
      id: "corporativo", ico: "🏢", pt: "Corporativo", en: "Corporate", order: 40,
      themes: ["phishing", "password", "data", "bec", "remote"],
      glossary: ["mfa", "bec", "lgpd"],
      scenarioReplace: {
        pt: [[/\bNo porto\b/g, "No escritório corporativo"], [/\bno porto\b/g, "no escritório corporativo"], [/\bterminal portuário\b/gi, "área de trabalho aberta"]],
        en: [[/\bAt the port\b/g, "At the corporate office"], [/\bat the port\b/g, "at the corporate office"], [/\bport terminal\b/gi, "open work area"]]
      }
    },
    {
      id: "ti", ico: "💻", pt: "TI & Segurança", en: "IT & Security", order: 50,
      themes: ["phishing", "password", "ot", "device", "data"],
      glossary: ["mfa", "itotbridge", "ransomware"],
      scenarioReplace: {
        pt: [[/\bNo porto\b/g, "No data center"], [/\bno porto\b/g, "no data center"], [/\bterminal portuário\b/gi, "sala de servidores"]],
        en: [[/\bAt the port\b/g, "At the data center"], [/\bat the port\b/g, "at the data center"], [/\bport terminal\b/gi, "server room"]]
      }
    },
    {
      id: "ot", ico: "🏭", pt: "Automação (OT)", en: "Automation (OT)", order: 60,
      themes: ["ot", "device", "password", "phishing", "port"],
      glossary: ["scada", "plc", "itotbridge"],
      scenarioReplace: {
        pt: [[/\bNo porto\b/g, "Na área de automação"], [/\bno porto\b/g, "na área de automação"], [/\bterminal portuário\b/gi, "sala do supervisório"]],
        en: [[/\bAt the port\b/g, "In the automation area"], [/\bat the port\b/g, "in the automation area"], [/\bport terminal\b/gi, "SCADA room"]]
      }
    },
    {
      id: "logistica", ico: "📦", pt: "Logística", en: "Logistics", order: 70,
      themes: ["port", "data", "phishing", "device", "remote"],
      glossary: ["permissions", "dlp", "homolog"],
      skipScenarioAdapt: true,
      scenarioReplace: {
        pt: [[/\bNo porto\b/g, "No centro de distribuição"], [/\bno porto\b/g, "no centro de distribuição"], [/\bterminal portuário\b/gi, "área de despacho"]],
        en: [[/\bAt the port\b/g, "At the distribution center"], [/\bat the port\b/g, "at the distribution center"], [/\bport terminal\b/gi, "dispatch area"]]
      }
    },
    {
      id: "energia", ico: "⚡", pt: "Energia", en: "Energy", order: 80,
      themes: ["ot", "device", "phishing", "data", "port"],
      glossary: ["scada", "plc", "hmi"],
      scenarioReplace: {
        pt: [[/\bNo porto\b/g, "Na subestação"], [/\bno porto\b/g, "na subestação"], [/\bterminal portuário\b/gi, "painel de controle de energia"]],
        en: [[/\bAt the port\b/g, "At the substation"], [/\bat the port\b/g, "at the substation"], [/\bport terminal\b/gi, "energy control panel"]]
      }
    },
    {
      id: "projetos", ico: "📐", pt: "Projetos & Engenharia", en: "Projects & Engineering", order: 90,
      themes: ["data", "remote", "phishing", "bec", "device"],
      glossary: ["classification", "supplierfraud", "dlp"],
      scenarioReplace: {
        pt: [[/\bNo porto\b/g, "No canteiro de obras"], [/\bno porto\b/g, "no canteiro de obras"], [/\bterminal portuário\b/gi, "escritório de engenharia de campo"]],
        en: [[/\bAt the port\b/g, "At the construction site"], [/\bat the port\b/g, "at the construction site"], [/\bport terminal\b/gi, "field engineering office"]]
      }
    },
    {
      id: "esg", ico: "🌿", pt: "Sustentabilidade", en: "Sustainability", order: 100,
      themes: ["data", "phishing", "remote", "password", "bec"],
      glossary: ["lgpd", "classification", "dlp"],
      scenarioReplace: {
        pt: [[/\bNo porto\b/g, "No projeto de monitoramento ambiental"], [/\bno porto\b/g, "no projeto de monitoramento ambiental"], [/\bterminal portuário\b/gi, "estação de coleta de dados"]],
        en: [[/\bAt the port\b/g, "At the environmental monitoring project"], [/\bat the port\b/g, "at the environmental monitoring project"], [/\bport terminal\b/gi, "data collection station"]]
      }
    }
  ],
  roles: [
    {
      id: "admin", ico: "🏢", pt: "Administrativo", en: "Office", order: 10,
      ptd: "E-mails, planilhas, sistemas", end: "Emails, spreadsheets, systems",
      themes: ["phishing", "password", "data", "bec", "device"],
      glossary: ["phishing", "mfa", "lgpd", "bec"]
    },
    {
      id: "field", ico: "⛏️", pt: "Operação/Campo", en: "Field/Operations", order: 20,
      ptd: "Mina, ferrovia, porto", end: "Mine, railway, port",
      themes: ["port", "ot", "device", "phishing", "data"],
      glossary: ["homolog", "screenlock", "badusb", "permissions"]
    },
    {
      id: "ot", ico: "🏭", pt: "Automação (OT)", en: "Automation (OT)", order: 30,
      ptd: "Sistemas industriais/ICS", end: "Industrial systems/ICS",
      themes: ["ot", "device", "password", "phishing", "port"],
      glossary: ["scada", "plc", "hmi", "itotbridge"]
    },
    {
      id: "leader", ico: "🧭", pt: "Liderança", en: "Leadership", order: 40,
      ptd: "Gestão e decisões", end: "Management & decisions",
      themes: ["bec", "data", "phishing", "remote", "ot"],
      glossary: ["bec", "supplierfraud", "classification", "dlp"]
    },
    {
      id: "analyst", ico: "📊", pt: "Analista", en: "Analyst", order: 50,
      ptd: "Dados, relatórios, indicadores", end: "Data, reports, metrics",
      themes: ["data", "password", "phishing", "bec", "remote"],
      glossary: ["dlp", "classification", "mfa", "phishing"]
    },
    {
      id: "tech", ico: "🔧", pt: "Técnico", en: "Technician", order: 60,
      ptd: "Manutenção, inspeção, campo", end: "Maintenance, inspection, field",
      themes: ["ot", "device", "port", "password", "phishing"],
      glossary: ["homolog", "scada", "permissions", "badusb"]
    },
    {
      id: "contractor", ico: "🤝", pt: "Terceiros", en: "Contractors", order: 70,
      ptd: "Prestadores e parceiros externos", end: "External providers & partners",
      themes: ["phishing", "remote", "device", "password", "data"],
      glossary: ["phishing", "vpn", "screenlock", "mfa"]
    },
    {
      id: "trainee", ico: "🎓", pt: "Em formação", en: "In training", order: 80,
      ptd: "Estágio, trainee, capacitação", end: "Internship, trainee, learning",
      themes: ["phishing", "password", "device", "data", "remote"],
      glossary: ["phishing", "mfa", "ransomware", "vpn"]
    }
  ]
};

function buildProfileRegistry(cfg) {
  var teams = [], roles = [], teamById = {}, roleById = {};
  var ROLE_THEMES = {}, TEAM_THEMES = {}, GLOSSARY_TEAM_PICKS = {}, GLOSSARY_ROLE_PICKS = {}, TEAM_SCENARIO_REPLACE = {};
  var i, t, r, orderOf = function(x, idx) { return x.order !== undefined ? x.order : (idx + 1) * 10; };

  for (i = 0; i < cfg.teams.length; i++) {
    t = cfg.teams[i];
    if (t.enabled === false) continue;
    teamById[t.id] = t;
    teams.push({ id: t.id, ico: t.ico, pt: t.pt, en: t.en, order: orderOf(t, i) });
    TEAM_THEMES[t.id] = t.themes || [];
    if (t.glossary && t.glossary.length) GLOSSARY_TEAM_PICKS[t.id] = t.glossary.slice();
    if (t.scenarioReplace) TEAM_SCENARIO_REPLACE[t.id] = t.scenarioReplace;
  }
  teams.sort(function(a, b) { return a.order - b.order; });

  for (i = 0; i < cfg.roles.length; i++) {
    r = cfg.roles[i];
    if (r.enabled === false) continue;
    roleById[r.id] = r;
    roles.push({ id: r.id, ico: r.ico, pt: r.pt, en: r.en, ptd: r.ptd, end: r.end, order: orderOf(r, i) });
    ROLE_THEMES[r.id] = r.themes || [];
    if (r.glossary && r.glossary.length) GLOSSARY_ROLE_PICKS[r.id] = r.glossary.slice();
  }
  roles.sort(function(a, b) { return a.order - b.order; });

  GLOSSARY_ROLE_PICKS.default = (cfg.defaults && cfg.defaults.glossary) ? cfg.defaults.glossary.slice() : [];

  return {
    version: 1,
    defaultTeam: (cfg.defaults && cfg.defaults.team) || (teams[0] && teams[0].id) || "",
    defaultRole: (cfg.defaults && cfg.defaults.role) || (roles[0] && roles[0].id) || "",
    TEAMS: teams,
    ROLES: roles,
    ROLE_THEMES: ROLE_THEMES,
    TEAM_THEMES: TEAM_THEMES,
    GLOSSARY_TEAM_PICKS: GLOSSARY_TEAM_PICKS,
    GLOSSARY_ROLE_PICKS: GLOSSARY_ROLE_PICKS,
    TEAM_SCENARIO_REPLACE: TEAM_SCENARIO_REPLACE,
    getTeam: function(id) { return teamById[id] || null; },
    getRole: function(id) { return roleById[id] || null; },
    teamIds: function() { return teams.map(function(x) { return x.id; }); },
    roleIds: function() { return roles.map(function(x) { return x.id; }); },
    validateTeam: function(id) { return !!teamById[id]; },
    validateRole: function(id) { return !!roleById[id]; },
    teamSkipsScenarioAdapt: function(id) {
      var tm = teamById[id];
      return !!(tm && tm.skipScenarioAdapt);
    },
    ensureState: function(state) {
      if (!state) return;
      if (!this.validateTeam(state.team)) state.team = this.defaultTeam;
      if (!this.validateRole(state.role)) state.role = this.defaultRole;
    }
  };
}

var PROFILE = buildProfileRegistry(PROFILE_CONFIG);
var TEAMS = PROFILE.TEAMS;
var ROLES = PROFILE.ROLES;
var ROLE_THEMES = PROFILE.ROLE_THEMES;
var TEAM_THEMES = PROFILE.TEAM_THEMES;
var GLOSSARY_TEAM_PICKS = PROFILE.GLOSSARY_TEAM_PICKS;
var GLOSSARY_ROLE_PICKS = PROFILE.GLOSSARY_ROLE_PICKS;
var TEAM_SCENARIO_REPLACE = PROFILE.TEAM_SCENARIO_REPLACE;

/* --- TEMPLATE (copie para PROFILE_CONFIG.teams ou .roles) ---
{
  id: "refino", ico: "⚗️", pt: "Refino", en: "Refining", order: 110,
  themes: ["ot", "data", "phishing", "device", "bec"],
  glossary: ["scada", "dlp", "homolog"],
  scenarioReplace: {
    pt: [[/\bNo porto\b/g, "No refino"], [/\bterminal portuário\b/gi, "sala de controle do refino"]],
    en: [[/\bAt the port\b/g, "At the refinery"], [/\bport terminal\b/gi, "refinery control room"]]
  }
}
{
  id: "supervisor", ico: "👷", pt: "Supervisão", en: "Supervision", order: 90,
  ptd: "Turno, equipe de campo, indicadores", end: "Shift, field crew, metrics",
  themes: ["ot", "port", "phishing", "data", "device"],
  glossary: ["homolog", "screenlock", "permissions", "scada"]
}
Para ocultar sem apagar: enabled: false
--- */
