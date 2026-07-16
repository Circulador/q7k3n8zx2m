/* Banco de perguntas — revisão pedagógica (PT / EN / PT+EN) */
window.initReviewBank = function () {
  if (window._reviewBankInited) return;
  var listEl = document.getElementById("reviewList");
  if (!listEl) return;
  window._reviewBankInited = true;

  var THEMES = {
    phishing: "Phishing", password: "Senhas", ot: "OT", data: "Dados",
    device: "Dispositivos", remote: "Remoto", bec: "BEC", port: "Porto"
  };
  var SRC_LABEL = {
    bank: { pt: "Campanha / Diária", en: "Campaign / Daily" },
    chain: { pt: "Cadeia Carajás", en: "Carajás Chain" },
    boss: { pt: "Crise tabletop", en: "Tabletop crisis" }
  };

  function txt(obj, lang) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.pt || obj.en || "";
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildIndex() {
    var items = [];
    var bank = (typeof BANK !== "undefined" ? BANK : []).concat(typeof COUNTRY_BANK !== "undefined" ? COUNTRY_BANK : []);
    bank.forEach(function (q, i) {
      items.push({
        src: "bank", id: q.id || ("bank_" + i), theme: q.theme, diff: q.diff,
        q: q.q, opts: q.opts, correct: q.correct, why: q.why, personal: q.personal,
        labelPt: "Campanha / Diária", labelEn: "Campaign / Daily"
      });
    });
    (typeof CHAINS !== "undefined" ? CHAINS : []).forEach(function (ch) {
      ch.stages.forEach(function (st) {
        st.qs.forEach(function (q, qi) {
          items.push({
            src: "chain",
            id: ch.id + "_" + st.id + "_q" + (qi + 1),
            theme: q.theme, diff: q.diff,
            q: q.q, opts: q.opts, correct: q.correct, why: q.why, personal: null,
            labelPt: "Cadeia — " + txt(ch.name, "pt") + " · " + txt(st.name, "pt"),
            labelEn: "Chain — " + txt(ch.name, "en") + " · " + txt(st.name, "en")
          });
        });
      });
    });
    (typeof BOSSES !== "undefined" ? BOSSES : []).forEach(function (b) {
      b.phases.forEach(function (ph, i) {
        items.push({
          src: "boss", id: b.id + "_s" + (i + 1), theme: null, diff: null,
          scene: ph.scene, q: ph.q, opts: ph.opts, correct: ph.correct,
          why: ph.impactOk || ph.why, impactBad: ph.impactBad, bridge: ph.bridge,
          personal: null,
          labelPt: "Crise — " + txt(b.name, "pt") + " · " + txt(ph.scene, "pt"),
          labelEn: "Boss — " + txt(b.name, "en") + " · " + txt(ph.scene, "en")
        });
      });
    });
    return items;
  }

  function renderOpts(it, lang, both) {
    var html = "";
    it.opts.forEach(function (o, j) {
      var ok = j === it.correct;
      var mark = ok ? "✅ " : "";
      var cls = "review-opt" + (ok ? " ok" : "");
      if (both) {
        html += '<div class="' + cls + '">' +
          '<div class="review-bilingual review-opt-row">' +
          '<div class="review-col pt">' + mark + esc(txt(o, "pt")) + '</div>' +
          '<div class="review-col en">' + mark + esc(txt(o, "en")) + '</div>' +
          '</div></div>';
      } else {
        html += '<div class="' + cls + '">' + mark + esc(txt(o, lang)) + '</div>';
      }
    });
    return html;
  }

  function renderBilingualBlock(textPt, textEn, cls) {
    return '<div class="' + (cls || "review-block") + '">' +
      '<div class="review-bilingual">' +
      '<div class="review-col pt"><span class="review-lang-tag">PT</span> ' + esc(textPt) + '</div>' +
      '<div class="review-col en"><span class="review-lang-tag">EN</span> ' + esc(textEn) + '</div>' +
      '</div></div>';
  }

  function renderSingleBlock(text, cls) {
    return '<div class="' + (cls || "review-block") + '">' + esc(text) + '</div>';
  }

  function renderCard(it, lang, both) {
    var label = both ? esc(it.labelPt) + ' / ' + esc(it.labelEn) : esc(txt({ pt: it.labelPt, en: it.labelEn }, lang));
    var meta = '<span class="review-tag">' + it.src.toUpperCase() + '</span> ' +
      (it.id ? 'ID: ' + esc(it.id) + ' · ' : '') +
      (it.theme ? '<span class="review-tag">' + esc(THEMES[it.theme] || it.theme) + '</span> ' : '') +
      (it.diff ? 'Dif. ' + it.diff : '');

    var qHtml = both
      ? '<div class="review-q-wrap">' + renderBilingualBlock(txt(it.q, "pt"), txt(it.q, "en"), "review-q") + '</div>'
      : renderSingleBlock(txt(it.q, lang), "review-q");

    var personalHtml = "";
    if (it.personal) {
      personalHtml = both
        ? '<div class="review-personal">💡' + renderBilingualBlock(txt(it.personal, "pt"), txt(it.personal, "en"), "") + '</div>'
        : '<div class="review-personal">💡 ' + esc(txt(it.personal, lang)) + '</div>';
    }

    var whyHtml = "";
    if (it.why) {
      whyHtml = both
        ? '<div class="review-why"><strong>Por quê / Why</strong>' + renderBilingualBlock(txt(it.why, "pt"), txt(it.why, "en"), "") + '</div>'
        : '<div class="review-why"><strong>' + (lang === "en" ? "Why: " : "Por quê: ") + '</strong>' + esc(txt(it.why, lang)) + '</div>';
    }

    var extraHtml = "";
    if (it.impactBad) {
      extraHtml += both
        ? '<div class="review-impact-bad"><strong>Impacto errado / Wrong impact</strong>' + renderBilingualBlock(txt(it.impactBad, "pt"), txt(it.impactBad, "en"), "") + '</div>'
        : '<div class="review-impact-bad"><strong>' + (lang === "en" ? "Wrong impact: " : "Impacto errado: ") + '</strong>' + esc(txt(it.impactBad, lang)) + '</div>';
    }
    if (it.bridge) {
      extraHtml += both
        ? '<div class="review-bridge"><strong>Ponte narrativa / Story bridge</strong>' + renderBilingualBlock(txt(it.bridge, "pt"), txt(it.bridge, "en"), "") + '</div>'
        : '<div class="review-bridge"><strong>' + (lang === "en" ? "Story bridge: " : "Ponte narrativa: ") + '</strong>' + esc(txt(it.bridge, lang)) + '</div>';
    }

    return '<article class="review-card-inapp">' +
      '<h3>' + label + '</h3>' +
      '<div class="review-meta">' + meta + '</div>' +
      qHtml + personalHtml +
      '<div class="review-opts">' + renderOpts(it, lang, both) + '</div>' +
      whyHtml + extraHtml +
      '</article>';
  }

  var items = buildIndex();
  var totals = {
    all: items.length,
    bank: items.filter(function (i) { return i.src === "bank"; }).length,
    chain: items.filter(function (i) { return i.src === "chain"; }).length,
    boss: items.filter(function (i) { return i.src === "boss"; }).length
  };

  var themeSel = document.getElementById("reviewTheme");
  var diffSel = document.getElementById("reviewDiff");
  if (themeSel && !themeSel.dataset.ready) {
    themeSel.dataset.ready = "1";
    Object.keys(THEMES).forEach(function (k) {
      var o = document.createElement("option");
      o.value = k;
      o.textContent = THEMES[k];
      themeSel.appendChild(o);
    });
  }
  if (diffSel && !diffSel.dataset.ready) {
    diffSel.dataset.ready = "1";
    [1, 2, 3].forEach(function (d) {
      var o = document.createElement("option");
      o.value = String(d);
      o.textContent = "Dif. " + d;
      diffSel.appendChild(o);
    });
  }

  function getLang() {
    var r = document.querySelector('input[name="reviewLang"]:checked');
    return r ? r.value : "both";
  }

  function render() {
    var qEl = document.getElementById("reviewSearch");
    var srcEl = document.getElementById("reviewSource");
    var thEl = document.getElementById("reviewTheme");
    var dfEl = document.getElementById("reviewDiff");
    if (!qEl || !srcEl || !listEl) return;
    var q = qEl.value.toLowerCase();
    var src = srcEl.value;
    var th = thEl ? thEl.value : "";
    var df = dfEl ? dfEl.value : "";
    var lang = getLang();
    var both = lang === "both";
    listEl.innerHTML = "";
    listEl.className = both ? "review-list-inapp review-list-both" : "review-list-inapp";
    var n = 0;
    items.forEach(function (it) {
      if (src !== "all" && it.src !== src) return;
      if (th && it.theme !== th) return;
      if (df && String(it.diff) !== df) return;
      var blob = JSON.stringify(it).toLowerCase();
      if (q && blob.indexOf(q) < 0) return;
      n++;
      listEl.insertAdjacentHTML("beforeend", renderCard(it, lang, both));
    });
    var countEl = document.getElementById("reviewCount");
    if (countEl) {
      countEl.textContent = n + " de " + totals.all + " pergunta(s) — " +
        "BANK " + totals.bank + " · Cadeia " + totals.chain + " · Desafios / Crises " + totals.boss;
    }
  }

  var searchEl = document.getElementById("reviewSearch");
  if (searchEl && !searchEl.dataset.bound) {
    searchEl.dataset.bound = "1";
    searchEl.addEventListener("input", render);
  }
  var sourceEl = document.getElementById("reviewSource");
  if (sourceEl && !sourceEl.dataset.bound) {
    sourceEl.dataset.bound = "1";
    sourceEl.addEventListener("change", render);
  }
  if (themeSel && !themeSel.dataset.bound) {
    themeSel.dataset.bound = "1";
    themeSel.addEventListener("change", render);
  }
  if (diffSel && !diffSel.dataset.bound) {
    diffSel.dataset.bound = "1";
    diffSel.addEventListener("change", render);
  }
  document.querySelectorAll('input[name="reviewLang"]').forEach(function (el) {
    if (!el.dataset.bound) {
      el.dataset.bound = "1";
      el.addEventListener("change", render);
    }
  });
  window.refreshReviewBankLang = function () {
    var lang = (typeof S !== "undefined" && S.lang) ? S.lang : "pt";
    var radio = document.querySelector('input[name="reviewLang"][value="' + lang + '"]');
    if (radio) radio.checked = true;
    render();
  };

  render();
};

if (document.getElementById("reviewList")) {
  window.initReviewBank();
}
