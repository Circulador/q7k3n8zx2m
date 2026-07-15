/* Mapa "A Orbita no mundo" — baseado no componente oficial orbita.com/pt/onde-estamos */
var OrbitaWorldMap = (function () {
  var assetV = (typeof window !== "undefined" && window.APP_VERSION) ? String(window.APP_VERSION) : "";
  function assetUrl(path) { return assetV ? path + "?v=" + assetV : path; }
  var VW = 960, VH = 520;
  var BASE = "#007E7A", HIGHLIGHT = "#ECB11F", ACTIVE = "#F5C842";

  var ISO_TO_GAME = {
    "076": "br", "124": "ca", "826": "gb", "512": "om", "458": "my", "392": "jp",
    "360": "id", "840": "us", "604": "pe", "152": "cl", "032": "ar", "756": "ch",
    "528": "nl", "784": "ae", "156": "cn", "356": "in", "702": "sg", "036": "au",
    "682": "sa"
  };

  var activityItems = [
    { icon: "building2", id: "sede", labelPt: "Sede", labelEn: "HQ" },
    { icon: "handshake", id: "joint-venture", labelPt: "Joint Venture", labelEn: "Joint Venture" },
    { icon: "factory", id: "operacao", labelPt: "Operação", labelEn: "Operation" },
    { icon: "briefcase", id: "escritorios", labelPt: "Escritórios", labelEn: "Offices" },
    { icon: "zap", id: "metais-transicao", labelPt: "Metais de transição energética", labelEn: "Energy transition metals" },
    { icon: "globe2", id: "mega-hub", labelPt: "Mega Hub", labelEn: "Mega Hub" },
    { icon: "anchor", id: "portos", labelPt: "Portos", labelEn: "Ports" },
    { icon: "search", id: "exploracao", labelPt: "Exploração", labelEn: "Exploration" },
    { icon: "train", id: "ferrovias", labelPt: "Ferrovias", labelEn: "Railways" },
    { icon: "hardhat", id: "minas-subterraneas", labelPt: "Minas subterrâneas", labelEn: "Underground mines" },
    { icon: "layers", id: "solucoes-minerio", labelPt: "Soluções em minério de ferro", labelEn: "Iron ore solutions" }
  ];

  var productItems = [
    { icon: "circle", id: "pelotas", labelPt: "Pelotas", labelEn: "Pellets" },
    { icon: "gem", id: "minerio-ferro", labelPt: "Minério de ferro", labelEn: "Iron ore" },
    { icon: "atom", id: "cobalto", labelPt: "Cobalto", labelEn: "Cobalt" },
    { icon: "box", id: "briquetes", labelPt: "Briquetes", labelEn: "Briquettes" },
    { icon: "circle", id: "niquel", labelPt: "Níquel", labelEn: "Nickel" },
    { icon: "star", id: "pgm-ouro-prata", labelPt: "PGM, ouro e prata", labelEn: "PGM, gold and silver" },
    { icon: "cpu", id: "cobre", labelPt: "Cobre", labelEn: "Copper" }
  ];

  var countryData = {
    "076": { activities: ["sede", "mega-hub", "exploracao", "metais-transicao", "solucoes-minerio", "operacao", "portos", "ferrovias", "joint-venture", "escritorios"], namePt: "Brasil", nameEn: "Brazil", phrasePt: "Sede global da Orbita. Maior produtor mundial de minério de ferro e pelotas, com vasta rede de ferrovias e portos.", phraseEn: "Orbita's global headquarters. World's largest iron ore and pellet producer, with an extensive railway and port network.", products: ["cobre", "niquel", "briquetes", "minerio-ferro", "pelotas", "pgm-ouro-prata"] },
    "124": { activities: ["metais-transicao", "portos", "exploracao", "operacao", "escritorios", "minas-subterraneas"], namePt: "Canadá", nameEn: "Canada", phrasePt: "Operações de classe mundial em metais de transição energética, com destaque para níquel, cobre e cobalto.", phraseEn: "World-class energy transition metals operations, with a focus on nickel, copper and cobalt.", products: ["cobalto", "cobre", "niquel", "pgm-ouro-prata"] },
    "840": { activities: ["mega-hub", "escritorios"], namePt: "Estados Unidos", nameEn: "United States", phrasePt: "Escritórios comerciais e Mega Hub na estratégia global da Orbita.", phraseEn: "Commercial offices and Mega Hub in Orbita's global strategy.", products: [] },
    "604": { activities: ["escritorios", "exploracao"], namePt: "Peru", nameEn: "Peru", phrasePt: "Projetos de operação e exploração mineral com foco em cobre.", phraseEn: "Mining operation and exploration projects focused on copper.", products: [] },
    "152": { activities: ["escritorios", "exploracao"], namePt: "Chile", nameEn: "Chile", phrasePt: "Escritórios comerciais e projetos de exploração mineral.", phraseEn: "Commercial offices and mineral exploration projects.", products: [] },
    "032": { activities: ["escritorios"], namePt: "Argentina", nameEn: "Argentina", phrasePt: "Escritório comercial apoiando relações comerciais na região.", phraseEn: "Commercial office supporting business relations in the region.", products: [] },
    "826": { activities: ["escritorios", "operacao", "metais-transicao"], namePt: "Reino Unido", nameEn: "United Kingdom", phrasePt: "Refino de níquel de alta pureza para a cadeia de metais da transição energética.", phraseEn: "High-purity nickel refining for the energy transition metals supply chain.", products: ["niquel"] },
    "756": { activities: ["escritorios"], namePt: "Suíça", nameEn: "Switzerland", phrasePt: "Centro de trading e gestão financeira internacional.", phraseEn: "International trading and financial management center.", products: [] },
    "528": { activities: ["escritorios"], namePt: "Países Baixos", nameEn: "Netherlands", phrasePt: "Escritório europeu de distribuição de minério de ferro.", phraseEn: "European iron ore distribution office.", products: [] },
    "682": { activities: ["mega-hub", "joint-venture"], namePt: "Arábia Saudita", nameEn: "Saudi Arabia", phrasePt: "Joint venture de pelotização para distribuição no Oriente Médio e Ásia.", phraseEn: "Pelletizing joint venture for distribution in the Middle East and Asia.", products: ["pelotas"] },
    "784": { activities: ["mega-hub", "escritorios"], namePt: "Emirados Árabes Unidos", nameEn: "UAE", phrasePt: "Mega Hub estratégico de distribuição de pelotas e briquetes para o mercado asiático.", phraseEn: "Strategic Mega Hub for pellet and briquette distribution to Asian markets.", products: ["pelotas", "briquetes"] },
    "512": { activities: ["escritorios", "operacao", "mega-hub", "solucoes-minerio"], namePt: "Omã", nameEn: "Oman", phrasePt: "Mega Hub de beneficiamento e distribuição de produtos de minério de ferro.", phraseEn: "Mega Hub for iron ore product processing and distribution.", products: ["pelotas"] },
    "356": { activities: ["escritorios"], namePt: "Índia", nameEn: "India", phrasePt: "Escritórios e parcerias estratégicas para distribuição de minério de ferro.", phraseEn: "Offices and strategic partnerships for iron ore distribution.", products: [] },
    "458": { activities: ["escritorios", "portos", "operacao"], namePt: "Malásia", nameEn: "Malaysia", phrasePt: "Terminal marítimo de Teluk Rubiah — movimentação e distribuição de minério na Ásia.", phraseEn: "Teluk Rubiah maritime terminal — ore handling and distribution across Asia.", products: [] },
    "360": { activities: ["exploracao", "joint-venture", "operacao", "escritorios"], namePt: "Indonésia", nameEn: "Indonesia", phrasePt: "Participação minoritária na PT Orbita Indonesia — exploração e operação de níquel.", phraseEn: "Minority stake in PT Orbita Indonesia — nickel exploration and operation.", products: ["niquel"] },
    "156": { activities: ["escritorios"], namePt: "China", nameEn: "China", phrasePt: "Principal destino de vendas — escritórios comerciais e relacionamento com o mercado.", phraseEn: "Main sales destination — commercial offices and market relationships.", products: [] },
    "392": { activities: ["metais-transicao", "operacao", "escritorios"], namePt: "Japão", nameEn: "Japan", phrasePt: "Refino de níquel e fornecimento para clientes ao redor do mundo.", phraseEn: "Nickel refining and supply to customers worldwide.", products: ["niquel"] },
    "702": { activities: ["escritorios"], namePt: "Singapura", nameEn: "Singapore", phrasePt: "Hub comercial regional para toda a Ásia-Pacífico.", phraseEn: "Regional commercial hub for Asia-Pacific.", products: [] },
    "036": { activities: ["escritorios"], namePt: "Austrália", nameEn: "Australia", phrasePt: "Escritório comercial na Oceania.", phraseEn: "Commercial office in Oceania.", products: [] }
  };

  var state = { filterId: null, filterType: null, selectedIso: null };
  var projection, pathFn, countrySel, svgNode, tooltipNode, clearBtn, loadingNode;
  var itemById, onCountryClick, onFilterChange, onClearSelection, onBeforeClearSelection;
  var langFn = function () { return "pt"; };
  var ready = false, routesLayer, countryFeatures;
  var progressByGame = {};

  function notifyFilterChange() {
    if (onFilterChange) onFilterChange();
  }

  function getFilter() {
    return { filterType: state.filterType, filterId: state.filterId, selectedIso: state.selectedIso };
  }

  function currentLang() { return typeof langFn === "function" ? langFn() : "pt"; }
  function label(item) { return currentLang() === "en" ? item.labelEn : item.labelPt; }
  function countryName(data) { return currentLang() === "en" ? data.nameEn : data.namePt; }
  function countryPhrase(data) { return currentLang() === "en" ? data.phraseEn : data.phrasePt; }

  function loadScript(src, globalName) {
    if (window[globalName]) return Promise.resolve(window[globalName]);
    window.__vwmScripts = window.__vwmScripts || {};
    if (window.__vwmScripts[src]) {
      return window.__vwmScripts[src].then(function () { return window[globalName]; });
    }
    window.__vwmScripts[src] = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.async = true;
      s.src = src;
      s.onload = function () { window[globalName] ? resolve() : reject(new Error("Missing " + globalName)); };
      s.onerror = function () { reject(new Error("Failed " + src)); };
      document.head.appendChild(s);
    }).then(function () { return window[globalName]; });
    return window.__vwmScripts[src].then(function () { return window[globalName]; });
  }

  function getIso(feature) { return String(feature && feature.id ? feature.id : "").padStart(3, "0"); }
  function getData(feature) { return countryData[getIso(feature)]; }

  function escapeHtml(v) {
    return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderIcon(name) {
    var icons = {
      anchor: '<path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="5" r="3"/>',
      atom: '<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/>',
      box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>',
      briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
      building2: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
      circle: '<circle cx="12" cy="12" r="10"/>',
      cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/>',
      factory: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>',
      gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/>',
      globe2: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>',
      handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/>',
      hardhat: '<path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><rect x="2" y="15" width="20" height="4" rx="1"/>',
      layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/>',
      search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
      star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
      train: '<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/>',
      zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'
    };
    var icon = icons[name] || icons.layers;
    return '<span class="vwm-icon"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icon + "</svg></span>";
  }

  function buildLegend(container, items, type) {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(function (item) {
      var btn = document.createElement("button");
      btn.className = "vwm-legend-button";
      btn.type = "button";
      btn.dataset.vwmLegendType = type;
      btn.dataset.vwmLegendId = item.id;
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = renderIcon(item.icon) + "<span>" + escapeHtml(label(item)) + "</span>";
      btn.addEventListener("click", function () { toggleFilter(type, item.id); });
      container.appendChild(btn);
    });
  }

  function toggleFilter(type, id) {
    if (state.filterType === type && state.filterId === id) {
      state.filterType = null;
      state.filterId = null;
    } else {
      state.filterType = type;
      state.filterId = id;
      state.selectedIso = null;
    }
    hideTooltip();
    updateState();
    notifyFilterChange();
  }

  function selectCountry(feature) {
    var iso = getIso(feature);
    if (!countryData[iso]) return;
    if (state.selectedIso === iso) state.selectedIso = null;
    else {
      state.selectedIso = iso;
      state.filterType = null;
      state.filterId = null;
    }
    updateState();
    notifyFilterChange();
  }

  function clearSelection(force) {
    if (!force && onBeforeClearSelection && onBeforeClearSelection() === false) return;
    state.filterType = null;
    state.filterId = null;
    state.selectedIso = null;
    hideTooltip();
    updateState();
    notifyFilterChange();
    if (onClearSelection) onClearSelection();
  }

  function clearCountryHighlight() {
    if (!state.selectedIso) return;
    state.selectedIso = null;
    updateState();
  }

  function matchesFilter(feature) {
    var data = getData(feature);
    if (!data || !state.filterId) return false;
    if (state.filterType === "activity") return data.activities.indexOf(state.filterId) >= 0;
    if (state.filterType === "product") return data.products.indexOf(state.filterId) >= 0;
    return false;
  }

  function matchesState(feature) {
    if (state.selectedIso) return state.selectedIso === getIso(feature);
    if (state.filterId) return matchesFilter(feature);
    return true;
  }

  function updateState() {
    var hasSel = Boolean(state.selectedIso || state.filterId);
    if (clearBtn) {
      clearBtn.hidden = !hasSel;
      clearBtn.setAttribute("aria-pressed", hasSel ? "true" : "false");
    }
    document.querySelectorAll(".vwm-legend-button").forEach(function (btn) {
      var type = btn.dataset.vwmLegendType;
      var id = btn.dataset.vwmLegendId;
      var legendOn = type === state.filterType && id === state.filterId;
      var countryOn = false;
      var cd = state.selectedIso ? countryData[state.selectedIso] : null;
      if (cd && type === "activity") countryOn = cd.activities.indexOf(id) >= 0;
      if (cd && type === "product") countryOn = cd.products.indexOf(id) >= 0;
      var on = legendOn || countryOn;
      btn.classList.toggle("is-active", on);
      btn.classList.toggle("is-dimmed", hasSel && !on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (!countrySel) return;
    countrySel
      .attr("fill", function (f) {
        if (!getData(f)) return BASE;
        if (state.selectedIso === getIso(f)) return ACTIVE;
        return statusFill(f);
      })
      .classed("is-muted", function (f) { return hasSel && !matchesState(f); })
      .classed("is-active", function (f) { return state.selectedIso === getIso(f); })
      .classed("is-filtered", function (f) { return Boolean(state.filterId && matchesFilter(f)); });
  }

  var PROGRESS_PENDING = "#ECB11F", PROGRESS_PARTIAL = "#E8823A", PROGRESS_DONE = "#2E9E5B";
  function statusFill(f) {
    var gid = ISO_TO_GAME[getIso(f)];
    if (!gid) return HIGHLIGHT;
    var p = progressByGame[gid];
    if (p === undefined || p === null) return PROGRESS_PENDING;
    if (p >= 80) return PROGRESS_DONE;
    return PROGRESS_PARTIAL;
  }
  function setProgress(map) {
    progressByGame = map || {};
    if (countrySel) updateState();
  }

  function buildTooltip(feature) {
    var data = getData(feature);
    if (!data) return "";
    var actTitle = langFn() === "en" ? "Activity" : "Atuação";
    var prodTitle = langFn() === "en" ? "Product portfolio" : "Portfólio de Produtos";
    var playLabel = langFn() === "en" ? "Start campaign" : "Iniciar campanha";
    var html = '<div class="vwm-tooltip-title">' + escapeHtml(countryName(data)) + "</div>";
    if (data.phrasePt) html += '<p class="vwm-tooltip-phrase">' + escapeHtml(countryPhrase(data)) + "</p>";
    if (data.activities.length) {
      html += '<div class="vwm-tooltip-section"><span class="vwm-tooltip-label">' + actTitle + '</span><div class="vwm-tooltip-icon-grid">';
      data.activities.forEach(function (id) {
        var it = itemById[id];
        if (it) html += '<span class="vwm-tooltip-icon-card" title="' + escapeHtml(label(it)) + '">' + renderIcon(it.icon) + "</span>";
      });
      html += "</div></div>";
    }
    if (data.products.length) {
      html += '<div class="vwm-tooltip-section"><span class="vwm-tooltip-label">' + prodTitle + '</span><div class="vwm-tooltip-icon-grid">';
      data.products.forEach(function (id) {
        var it = itemById[id];
        if (it) html += '<span class="vwm-tooltip-icon-card" title="' + escapeHtml(label(it)) + '">' + renderIcon(it.icon) + "</span>";
      });
      html += "</div></div>";
    }
    var gameId = ISO_TO_GAME[getIso(feature)];
    if (gameId) html += '<button type="button" class="vwm-tooltip-play btn btn-primary btn-sm" data-game-id="' + gameId + '">🚀 ' + playLabel + "</button>";
    return html;
  }

  function showTooltip(event, feature) {
    if (!tooltipNode || !getData(feature)) return;
    tooltipNode.innerHTML = buildTooltip(feature);
    tooltipNode.hidden = false;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var narrow = vw <= 900;
    if (narrow) {
      tooltipNode.style.left = "12px";
      tooltipNode.style.right = "12px";
      tooltipNode.style.width = "auto";
      tooltipNode.style.maxWidth = "none";
      tooltipNode.style.top = Math.max(12, Math.min(event.clientY + 12, vh - 220)) + "px";
    } else {
      tooltipNode.style.right = "auto";
      tooltipNode.style.width = "";
      tooltipNode.style.left = Math.max(8, Math.min(event.clientX + 18, vw - 320)) + "px";
      tooltipNode.style.top = Math.max(8, Math.min(event.clientY - 8, vh - 280)) + "px";
    }
    var playBtn = tooltipNode.querySelector(".vwm-tooltip-play");
    if (playBtn && onCountryClick) {
      playBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        onCountryClick(playBtn.getAttribute("data-game-id"), false);
      });
    }
  }

  function hideTooltip() { if (tooltipNode) tooltipNode.hidden = true; }

  function renderMap(d3, topojson, world) {
    if (!svgNode || !world || !world.objects || !world.objects.countries) {
      showError(langFn() === "en" ? "Invalid world atlas." : "Atlas mundial inválido.");
      return;
    }
    if (loadingNode) loadingNode.hidden = true;
    projection = d3.geoNaturalEarth1().fitExtent([[20, 18], [VW - 20, VH - 24]], { type: "Sphere" });
    pathFn = d3.geoPath(projection);
    var svg = d3.select(svgNode);
    svg.selectAll("*").remove();
    svg.attr("viewBox", "0 0 " + VW + " " + VH);
    var features = topojson.feature(world, world.objects.countries).features;
    countryFeatures = features;
    countrySel = svg.append("g").attr("class", "vwm-countries").selectAll("path").data(features).join("path")
      .attr("class", function (f) { return getData(f) ? "vwm-country has-data" : "vwm-country"; })
      .attr("d", pathFn)
      .attr("fill", function (f) { return getData(f) ? HIGHLIGHT : BASE; })
      .attr("stroke", "#ffffff")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 0.45)
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", function (f) { var d = getData(f); return d ? countryName(d) : (f.properties && f.properties.name) || ""; })
      .attr("aria-disabled", function (f) { return getData(f) ? "false" : "true"; })
      .on("click", function (event, feature) {
        if (!getData(feature)) {
          if (onBeforeClearSelection && onBeforeClearSelection() === false) {
            event.stopPropagation();
            return;
          }
          return;
        }
        event.stopPropagation();
        var iso = getIso(feature);
        selectCountry(feature);
        hideTooltip();
        if (onCountryClick && ISO_TO_GAME[iso]) onCountryClick(ISO_TO_GAME[iso]);
      })
      .on("keydown", function (event, feature) {
        if (getData(feature) && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          selectCountry(feature);
          hideTooltip();
          var iso = getIso(feature);
          if (onCountryClick && ISO_TO_GAME[iso]) onCountryClick(ISO_TO_GAME[iso]);
        }
      });
    routesLayer = svg.append("g").attr("class", "vwm-routes");
    svg.on("click", function (event) {
      if (typeof window !== "undefined" && window.__mapDragMoved) return;
      clearSelection(false);
    });
    ready = true;
    updateState();
  }

  function showError(msg) {
    if (!loadingNode) return;
    loadingNode.hidden = false;
    loadingNode.classList.add("is-error");
    loadingNode.textContent = msg;
  }

  function init(opts) {
    svgNode = opts.svg;
    tooltipNode = opts.tooltip;
    clearBtn = opts.clearBtn;
    loadingNode = opts.loading;
    onCountryClick = opts.onCountryClick;
    onFilterChange = opts.onFilterChange;
    onClearSelection = opts.onClearSelection;
    onBeforeClearSelection = opts.onBeforeClearSelection;
    langFn = opts.lang || function () { return "pt"; };
    itemById = {};
    activityItems.concat(productItems).forEach(function (it) { itemById[it.id] = it; });
    buildLegend(opts.activityLegend, activityItems, "activity");
    buildLegend(opts.productLegend, productItems, "product");
    if (clearBtn) clearBtn.addEventListener("click", function () { clearSelection(true); });
    if (loadingNode) { loadingNode.hidden = false; loadingNode.classList.remove("is-error"); loadingNode.textContent = langFn() === "en" ? "Loading map..." : "Carregando mapa..."; }
    return Promise.all([
      loadScript(assetUrl("assets/d3.min.js"), "d3"),
      loadScript(assetUrl("assets/topojson-client.min.js"), "topojson"),
      fetch(assetUrl("assets/countries-110m.json")).then(function (r) { if (!r.ok) throw new Error("atlas"); return r.json(); })
    ]).then(function (res) { renderMap(res[0], res[1], res[2]); });
  }

  function refresh() {
    if (!ready) return;
    buildLegend(document.getElementById("mapActivityLegend"), activityItems, "activity");
    buildLegend(document.getElementById("mapProductLegend"), productItems, "product");
    if (countrySel) updateState();
  }

  function highlightGameId(gameId, opts) {
    opts = opts || {};
    var iso = null;
    if (gameId) {
      Object.keys(ISO_TO_GAME).forEach(function (k) { if (ISO_TO_GAME[k] === gameId) iso = k; });
    }
    state.selectedIso = iso;
    if (!opts.keepFilter) {
      state.filterType = null;
      state.filterId = null;
      notifyFilterChange();
    }
    updateState();
  }

  function project(lat, lon) {
    if (!projection) return { x: 0, y: 0 };
    var p = projection([lon, lat]);
    return { x: p[0], y: p[1] };
  }

  function findCountryFeature(gameId) {
    if (!countryFeatures || !gameId) return null;
    var iso = gameToIso(gameId);
    if (!iso) return null;
    var key = String(iso).padStart(3, "0");
    for (var i = 0; i < countryFeatures.length; i++) {
      if (getIso(countryFeatures[i]) === key) return countryFeatures[i];
    }
    return null;
  }

  var CONTINENT_BOXES = {
    sa: { lon: [-82, -34], lat: [-56, 13] },
    na: { lon: [-140, -52], lat: [12, 72] },
    eu: { lon: [-12, 42], lat: [34, 62] },
    me: { lon: [24, 64], lat: [11, 42] },
    as: { lon: [58, 150], lat: [-11, 56] },
    oc: { lon: [110, 180], lat: [-48, -9] }
  };
  var GAME_CONTINENT = {
    br: "sa", pe: "sa", cl: "sa", ar: "sa",
    ca: "na", us: "na",
    gb: "eu", ch: "eu", nl: "eu",
    om: "me", ae: "me", sa: "me",
    my: "as", jp: "as", id: "as", cn: "as", in: "as", sg: "as",
    au: "oc"
  };

  function projectedBoxBounds(box) {
    if (!projection) return null;
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    var steps = 14;
    for (var i = 0; i <= steps; i++) {
      var lon = box.lon[0] + (box.lon[1] - box.lon[0]) * (i / steps);
      for (var j = 0; j <= steps; j++) {
        var lat = box.lat[0] + (box.lat[1] - box.lat[0]) * (j / steps);
        var p = projection([lon, lat]);
        if (!p) continue;
        if (p[0] < minX) minX = p[0];
        if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1];
        if (p[1] > maxY) maxY = p[1];
      }
    }
    if (minX === Infinity) return null;
    return [[minX, minY], [maxX, maxY]];
  }

  function getContinentBounds(gameId) {
    var cont = GAME_CONTINENT[gameId];
    if (!cont || !CONTINENT_BOXES[cont]) return null;
    return projectedBoxBounds(CONTINENT_BOXES[cont]);
  }

  // Uniform country view: fixed zoom so map pane + arrows stay identical for every country.
  function getCountryView(gameId, opts) {
    opts = opts || {};
    if (!pathFn) return null;
    var feature = findCountryFeature(gameId);
    var b = null;
    if (feature) b = pathFn.bounds(feature);
    if (!b) {
      b = getContinentBounds(gameId);
      if (!b) return null;
    }
    var cx = (b[0][0] + b[1][0]) / 2;
    var cy = (b[0][1] + b[1][1]) / 2;
    var aspect = opts.aspect && opts.aspect > 0 ? opts.aspect : VW / VH;
    if (opts.uniform) {
      var fw = opts.fixedW > 0 ? opts.fixedW : 400;
      var nh = fw / aspect;
      if (nh > VH) { nh = VH; fw = nh * aspect; }
      return { cx: cx, cy: cy, targetW: fw, targetH: nh };
    }
    var bw = Math.max(b[1][0] - b[0][0], 3);
    var bh = Math.max(b[1][1] - b[0][1], 3);
    var pad = 1.03;
    var boxW = bw * pad;
    var boxH = bh * pad;
    var nw, nh;
    if (boxW / boxH > aspect) {
      nw = boxW;
      nh = nw / aspect;
    } else {
      nh = boxH;
      nw = nh * aspect;
    }
    if (nw > VW) { nw = VW; nh = nw / aspect; }
    if (nh > VH) { nh = VH; nw = nh * aspect; }
    return {
      cx: cx,
      cy: cy,
      targetW: nw,
      targetH: nh
    };
  }

  function drawRoutes(routes) {
    if (!routesLayer || !pathFn) return;
    routesLayer.selectAll("*").remove();
    if (!routes || !routes.length) return;
    routes.forEach(function (route) {
      if (!route.pts || route.pts.length < 2) return;
      var coords = route.pts.map(function (p) { return [p.lon, p.lat]; });
      var line = { type: "LineString", coordinates: coords };
      routesLayer.append("path")
        .attr("class", "route-line " + (route.cls || "") + (route.active ? " route-active" : " route-dim"))
        .attr("d", pathFn(line))
        .attr("fill", "none");
    });
  }

  function isReady() { return ready; }

  function gameToIso(gameId) {
    var iso = null;
    Object.keys(ISO_TO_GAME).forEach(function (k) { if (ISO_TO_GAME[k] === gameId) iso = k; });
    return iso;
  }

  function buildItemById() {
    var m = {};
    activityItems.concat(productItems).forEach(function (it) { m[it.id] = it; });
    return m;
  }

  function getActivityLabel(id, lang) {
    var it = buildItemById()[id];
    if (!it) return id;
    return lang === "en" ? it.labelEn : it.labelPt;
  }

  function getProductLabel(id, lang) {
    return getActivityLabel(id, lang);
  }

  function getCountries(lang) {
    return Object.keys(countryData).map(function (iso) {
      var d = countryData[iso];
      return {
        iso: iso,
        gameId: ISO_TO_GAME[iso] || null,
        name: lang === "en" ? d.nameEn : d.namePt,
        phrase: lang === "en" ? d.phraseEn : d.phrasePt,
        activities: d.activities.slice(),
        products: d.products.slice()
      };
    });
  }

  function getCountry(gameId, lang) {
    var iso = gameToIso(gameId);
    if (!iso || !countryData[iso]) return null;
    var d = countryData[iso];
    return {
      iso: iso,
      gameId: gameId,
      name: lang === "en" ? d.nameEn : d.namePt,
      phrase: lang === "en" ? d.phraseEn : d.phrasePt,
      activities: d.activities.slice(),
      products: d.products.slice()
    };
  }

  return {
    init: init,
    refresh: refresh,
    clearSelection: clearSelection,
    clearCountryHighlight: clearCountryHighlight,
    highlightGameId: highlightGameId,
    getFilter: getFilter,
    project: project,
    drawRoutes: drawRoutes,
    getCountryView: getCountryView,
    setProgress: setProgress,
    isReady: isReady,
    gameToIso: gameToIso,
    ISO_TO_GAME: ISO_TO_GAME,
    VW: VW,
    VH: VH,
    getCountries: getCountries,
    getCountry: getCountry,
    getActivityLabel: getActivityLabel,
    getProductLabel: getProductLabel,
    getActivityItems: function () { return activityItems.slice(); },
    getProductItems: function () { return productItems.slice(); }
  };
})();
