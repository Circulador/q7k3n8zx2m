"""Teste automatizado — home + menu acessibilidade (Playwright).
Servidor interno na porta 8095 — ver README (dev manual: porta 8093)."""
import json
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

ROOT = Path(__file__).resolve().parent
PORT = 8095


def start_server():
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(ROOT), **kwargs)

    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    Thread(target=server.serve_forever, daemon=True).start()
    return server


def metrics(page):
    return page.evaluate(
        """() => {
            const app = document.querySelector('.app');
            const home = document.getElementById('screenHome');
            const active = document.querySelector('.screen.active');
            const cs = app ? getComputedStyle(app) : null;
            return {
                appH: app ? app.offsetHeight : 0,
                homeDisplay: home ? getComputedStyle(home).display : null,
                activeId: active ? active.id : null,
                appOpacity: cs ? cs.opacity : null,
                appFilter: cs ? cs.filter : 'none',
                bodyClass: document.body ? document.body.className : '',
            };
        }"""
    )


def check(page, label, results, errors):
    m = metrics(page)
    ok = m["appH"] > 200 and m["activeId"] == "screenHome" and m["homeDisplay"] == "block"
    results.append({"label": label, "ok": ok, **m})
    if not ok:
        raise RuntimeError(f"{label} FALHOU: {m}")
    if errors:
        print(f"  avisos em {label}:", errors[:3])


def main():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Instalando playwright...")
        import subprocess

        subprocess.check_call([sys.executable, "-m", "pip", "install", "playwright", "-q"])
        subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])
        from playwright.sync_api import sync_playwright

    server = start_server()
    results = []
    errors = []
    url = f"http://127.0.0.1:{PORT}/index.html?v=testpy"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

        # 1) Carregamento limpo
        page.goto(url, wait_until="networkidle")
        time.sleep(0.6)
        check(page, "carregamento inicial", results, errors)
        errors.clear()

        # 2) Estado salvo problemático
        page.evaluate(
            """() => localStorage.setItem('guardiao_vale_v7', JSON.stringify({
                lang:'pt', onboardingDone:true,
                a11y:{voice:false,contrast:true,large:false,motion:true,signs:true,
                      fontScale:0,links:false,spacing:false,letterSpace:false,
                      dyslexia:false,colorblind:'protanopia',readingMode:false}
            }))"""
        )
        page.reload(wait_until="networkidle")
        time.sleep(1.2)
        check(page, "estado salvo corrompido", results, errors)
        errors.clear()

        # 3) Menu A11y — todas as opções
        page.click("#a11yBtn")
        page.wait_for_selector("#a11yMenu:not([hidden])", timeout=5000)
        toggles = page.locator("#a11yMenu .am-toggle")
        n = toggles.count()
        for i in range(n):
            toggles.nth(i).click()
            time.sleep(0.25)
            check(page, f"toggle {i+1}/{n}", results, errors)
            errors.clear()

        # 4) Restaurar padrão
        page.click("#resetA11yMenuBtn")
        time.sleep(0.4)
        check(page, "restaurar padrão", results, errors)

        # 5) Toggles da home
        for opt in ["optVoice", "optContrast", "optSigns", "optMotion"]:
            page.locator(f"#{opt}").click(force=True)
            time.sleep(0.2)
            check(page, f"home {opt} on", results, errors)
            errors.clear()
            page.locator(f"#{opt}").click(force=True)
            time.sleep(0.15)

        browser.close()

    server.shutdown()
    print("\n[OK] TODOS OS TESTES PASSARAM\n")
    for r in results:
        print(f"  OK {r['label']} — appH={r['appH']} filter={r.get('appFilter','none')}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print("\n[FALHA] TESTE FALHOU\n", exc)
        raise SystemExit(1)
