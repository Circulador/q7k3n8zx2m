/* Accessibility suite — Hand Talk (Orbita) + VLibras/ASL fallbacks */
(function(global){
"use strict";

/* Cole o token Hand Talk da Orbita aqui para ativar os 22 recursos do plugin */
var HANDTALK_TOKEN = "";

var htInstance = null;
var htLang = "";
var htScriptLoaded = false;
var vlibrasReady = false;

function $(id){ return document.getElementById(id); }

function htConfig(lang){
  return {
    token: HANDTALK_TOKEN,
    language: lang === "pt" ? "pt-br" : "en-ase",
    side: "right",
    opacity: 1,
    maxTextSize: 500
  };
}

function destroyHandTalk(){
  if(htInstance && typeof htInstance.destroy === "function"){
    try{ htInstance.destroy(); }catch(e){}
  }
  document.querySelectorAll("[class^='ht-'],[class*=' ht-'],[id*='handtalk-plugin'],[id*='HandTalk']").forEach(function(el){
    if(el.id !== "handTalkStatus" && el !== document.body && el !== document.documentElement) el.remove();
  });
  htInstance = null;
  htLang = "";
  document.body.classList.remove("handtalk-on");
}

function loadHandTalkScript(cb){
  if(htScriptLoaded && global.HT){ if(cb) cb(true); return; }
  if(global.HT){ htScriptLoaded = true; if(cb) cb(true); return; }
  var s = document.createElement("script");
  s.src = "https://plugin.handtalk.me/web/latest/handtalk.min.js";
  s.onload = function(){ htScriptLoaded = true; if(cb) cb(true); };
  s.onerror = function(){ if(cb) cb(false); };
  document.body.appendChild(s);
}

function ensureHandTalk(lang, cb){
  if(!HANDTALK_TOKEN){ if(cb) cb(false, "no-token"); return; }
  if(htInstance && htLang === lang){ if(cb) cb(true); return; }
  destroyHandTalk();
  loadHandTalkScript(function(ok){
    if(!ok || !global.HT){ if(cb) cb(false, "script"); return; }
    try{
      htInstance = new global.HT(htConfig(lang));
      htLang = lang;
      document.body.classList.add("handtalk-on");
      if(cb) cb(true);
    }catch(e){ if(cb) cb(false, "init"); }
  });
}

function ensureVLibras(cb){
  if(vlibrasReady && global.VLibras){ if(cb) cb(); return; }
  var root = $("vlibrasRoot"); if(root) root.removeAttribute("hidden");
  if(global.VLibras && global.VLibras.Widget){
    vlibrasReady = true; if(cb) cb(); return;
  }
  var s = document.createElement("script");
  s.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  s.onload = function(){
    try{
      new global.VLibras.Widget("https://vlibras.gov.br/app");
      vlibrasReady = true;
    }catch(e){}
    if(cb) cb();
  };
  document.body.appendChild(s);
}

function hideVLibras(){
  var root = $("vlibrasRoot"); if(root) root.setAttribute("hidden", "");
  document.body.classList.remove("vlibras-on");
}

function showVLibras(){
  ensureVLibras(function(){
    document.body.classList.add("vlibras-on");
    var root = $("vlibrasRoot"); if(root) root.removeAttribute("hidden");
  });
}

function getSelectionText(){
  var t = "";
  try{ t = (global.getSelection && global.getSelection().toString()) || ""; }catch(e){}
  return t.trim();
}

function openASLPanel(word){
  var panel = $("aslPanel"), frame = $("aslFrame"), wordEl = $("aslWord"), empty = $("aslEmpty"), wrap = $("aslAccess");
  if(!panel) return;
  word = word || getSelectionText();
  panel.hidden = false;
  if(wrap) wrap.classList.add("open");
  if(word){
    if(wordEl) wordEl.textContent = word;
    if(empty) empty.hidden = true;
    if(frame){
      frame.hidden = false;
      frame.src = "https://www.signasl.org/sign/" + encodeURIComponent(word.toLowerCase().replace(/[^a-z0-9\s-]/gi, "").replace(/\s+/g, "-"));
    }
  }else{
    if(wordEl) wordEl.textContent = "";
    if(frame){ frame.hidden = true; frame.src = "about:blank"; }
    if(empty) empty.hidden = false;
  }
}

function closeASLPanel(){
  var panel = $("aslPanel"), frame = $("aslFrame"), wrap = $("aslAccess");
  if(panel) panel.hidden = true;
  if(wrap) wrap.classList.remove("open");
  if(frame) frame.src = "about:blank";
}

function showASLFallback(){
  var wrap = $("aslAccess"); if(!wrap) return;
  wrap.hidden = false;
  document.body.classList.add("asl-on");
}

function hideASL(){
  document.body.classList.remove("asl-on");
  closeASLPanel();
  var wrap = $("aslAccess"); if(wrap) wrap.hidden = true;
}

function bindASL(){
  var wrap = $("aslAccess"); if(!wrap || wrap.getAttribute("data-bound")) return;
  wrap.setAttribute("data-bound", "1");
  var btn = $("aslAccessBtn"), close = $("aslClose"), tr = $("aslTranslate");
  if(btn) btn.addEventListener("click", function(e){
    e.stopPropagation();
    var panel = $("aslPanel");
    if(panel && !panel.hidden) closeASLPanel();
    else openASLPanel(getSelectionText());
  });
  if(close) close.addEventListener("click", function(e){ e.stopPropagation(); closeASLPanel(); });
  if(tr) tr.addEventListener("click", function(e){ e.stopPropagation(); openASLPanel(getSelectionText()); });
  document.addEventListener("mouseup", function(){
    if(!document.body.classList.contains("asl-on")) return;
    var w = getSelectionText(), sel = $("aslSelection");
    if(sel && w.length > 1 && w.length < 48) sel.textContent = w;
  });
}

function setHandTalkStatus(lang, mode){
  var el = $("handTalkStatus"); if(!el) return;
  var msgs = {
    "handtalk-pt": {pt: "Hand Talk ativo — Libras + 22 recursos assistivos (como orbita.com).", en: "Hand Talk active — Libras + 22 assistive features (like orbita.com)."},
    "handtalk-en": {pt: "Hand Talk ativo — ASL + 22 recursos assistivos (como orbita.com).", en: "Hand Talk active — ASL + 22 assistive features (like orbita.com)."},
    "vlibras": {pt: "VLibras ativo (fallback). Para o pacote completo Hand Talk, configure o token da Orbita.", en: "VLibras active (fallback). For full Hand Talk suite, configure Orbita token."},
    "asl-fallback": {pt: "ASL via dicionário (fallback). Para Hand Talk completo, configure o token da Orbita.", en: "ASL dictionary (fallback). For full Hand Talk, configure Orbita token."},
    "off": {pt: "", en: ""}
  };
  var key = mode || "off";
  var txt = msgs[key] ? (msgs[key][lang] || msgs[key].pt) : "";
  el.textContent = txt;
  el.hidden = !txt;
}

function applySignLanguage(lang, enabled){
  document.body.classList.toggle("lang-pt", lang === "pt");
  document.body.classList.toggle("lang-en", lang === "en");
  document.body.classList.toggle("signs-on", !!enabled);

  destroyHandTalk();
  hideVLibras();
  hideASL();
  setHandTalkStatus(lang, "off");

  if(!enabled) return;

  ensureHandTalk(lang, function(ok){
    if(ok){
      setHandTalkStatus(lang, lang === "pt" ? "handtalk-pt" : "handtalk-en");
      return;
    }
    if(lang === "pt"){
      showVLibras();
      setHandTalkStatus(lang, "vlibras");
    }else{
      bindASL();
      showASLFallback();
      setHandTalkStatus(lang, "asl-fallback");
    }
  });
}

global.SignLang = {
  apply: applySignLanguage,
  openASL: openASLPanel,
  hasHandTalkToken: function(){ return !!HANDTALK_TOKEN; }
};

})(window);
