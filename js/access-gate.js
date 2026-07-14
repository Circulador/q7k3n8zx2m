/* ============================================================
   TRAVA LEVE DE ACESSO (client-side)  —  Guardião Digital / Vale
   ------------------------------------------------------------
   ⚠️ IMPORTANTE (leia): isto NÃO é segurança de verdade.
   Como o site é estático (GitHub Pages), a senha fica no navegador
   e pode ser descoberta por quem inspecionar o código. Serve apenas
   para evitar acesso casual de quem receber o link por engano.
   Para senha "real", use Cloudflare Access (grátis) ou host com
   proteção de senha no servidor.

   COMO CONFIGURAR:
   - GATE_ENABLED = false  -> desliga a trava (site abre direto).
   - GATE_PASSPHRASE       -> troque pela senha que quiser.
   ============================================================ */
(function () {
  "use strict";

  var GATE_ENABLED = true;
  var GATE_PASSPHRASE = "vale-guardiao-2026";   // <-- troque aqui
  var STORAGE_KEY = "gdv_gate_ok_v1";

  if (!GATE_ENABLED) return;

  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
  } catch (e) { /* sessionStorage indisponível: segue com a trava */ }

  function build() {
    if (document.getElementById("gdvGate")) return;

    var ov = document.createElement("div");
    ov.id = "gdvGate";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "Acesso restrito");
    ov.style.cssText = [
      "position:fixed", "inset:0", "z-index:2147483647",
      "display:flex", "align-items:center", "justify-content:center",
      "padding:20px", "background:linear-gradient(180deg,#083540,#051a22)",
      "font-family:'Segoe UI',system-ui,sans-serif", "color:#eaf2f6"
    ].join(";");

    var card = document.createElement("div");
    card.style.cssText = [
      "width:min(420px,100%)", "background:#0a2a32",
      "border:1px solid #124a52", "border-radius:16px",
      "padding:28px 24px", "box-shadow:0 20px 60px rgba(0,0,0,.5)", "text-align:center"
    ].join(";");

    card.innerHTML =
      '<div style="font-size:2.6rem;line-height:1;margin-bottom:8px">🛡️</div>' +
      '<h1 style="font-size:1.15rem;margin:0 0 4px;color:#EDB111">Guardião Digital — Vale</h1>' +
      '<p style="font-size:.9rem;color:#8eb4be;margin:0 0 18px">Acesso restrito. Informe a senha para continuar.</p>' +
      '<input id="gdvGateInput" type="password" autocomplete="off" inputmode="text" ' +
      'placeholder="Senha de acesso" aria-label="Senha de acesso" ' +
      'style="width:100%;box-sizing:border-box;padding:13px 14px;border-radius:10px;border:1px solid #1b5a63;' +
      'background:rgba(0,0,0,.25);color:#fff;font-size:1rem;outline:none">' +
      '<p id="gdvGateErr" role="alert" style="min-height:1.1em;margin:8px 0 0;font-size:.82rem;color:#ff6b6b"></p>' +
      '<button id="gdvGateBtn" type="button" ' +
      'style="width:100%;margin-top:12px;padding:13px 14px;border:0;border-radius:10px;cursor:pointer;' +
      'font-size:1rem;font-weight:700;color:#04141b;background:linear-gradient(135deg,#EDB111,#c99400)">Entrar</button>';

    ov.appendChild(card);
    (document.body || document.documentElement).appendChild(ov);

    var input = document.getElementById("gdvGateInput");
    var btn = document.getElementById("gdvGateBtn");
    var err = document.getElementById("gdvGateErr");

    function tryEnter() {
      var val = (input.value || "").trim();
      if (val === GATE_PASSPHRASE) {
        try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
        ov.parentNode && ov.parentNode.removeChild(ov);
      } else {
        err.textContent = "Senha incorreta. Tente novamente.";
        input.value = "";
        input.focus();
      }
    }

    btn.addEventListener("click", tryEnter);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); tryEnter(); } });
    setTimeout(function () { input.focus(); }, 60);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
