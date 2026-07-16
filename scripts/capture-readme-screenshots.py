"""Gera screenshots para o README (Playwright + servidor local)."""
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "screenshots"
PORT = 8096


def start_server():
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(ROOT), **kwargs)

    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    Thread(target=server.serve_forever, daemon=True).start()
    return server


def wait_home(page):
    page.wait_for_selector("#screenHome", timeout=15000)
    page.wait_for_function(
        "() => window.gdvDemoApi && typeof window.gdvDemoApi.refreshAll === 'function'",
        timeout=15000,
    )
    time.sleep(0.8)


def dismiss_onboarding(page):
    page.evaluate(
        """() => {
          const api = window.gdvDemoApi;
          if (!api) return;
          const S = api.getState();
          S.onboardingDone = true;
          S.offlineHintSeen = true;
          api.save();
          const ov = document.getElementById('onboardOverlay');
          if (ov) ov.hidden = true;
          document.body.classList.remove('onboard-open');
          api.refreshAll();
        }"""
    )
    time.sleep(0.8)


def apply_preset(page, pct):
    page.evaluate("() => { try { localStorage.removeItem('guardiao_orbita_v7'); } catch(e) {} }")
    page.reload(wait_until="networkidle")
    wait_home(page)
    page.evaluate(
        """(pct) => {
          const btn = document.querySelector('.demo-preset-btn[data-preset="' + pct + '"]');
          if (btn) btn.click();
        }""",
        pct,
    )
    time.sleep(1.0)
    dismiss_onboarding(page)


def open_settings(page):
    page.evaluate(
        """() => {
          if (window.gdvDemoApi && window.gdvDemoApi.toggleSettingsMenu)
            window.gdvDemoApi.toggleSettingsMenu(true);
        }"""
    )
    page.wait_for_selector("#settingsMenu:not([hidden])", timeout=5000)
    time.sleep(0.4)


def close_settings(page):
    page.evaluate(
        """() => {
          if (window.gdvDemoApi && window.gdvDemoApi.toggleSettingsMenu)
            window.gdvDemoApi.toggleSettingsMenu(false);
        }"""
    )
    time.sleep(0.3)


def go_nav(page, key):
    page.evaluate(
        """(k) => {
          const api = window.gdvDemoApi;
          if (api && api.nav && api.nav[k]) api.nav[k]();
        }""",
        key,
    )
    time.sleep(0.8)


def shot(page, name):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    page.screenshot(path=str(path), full_page=False)
    print(f"  OK {path.name}")


def main():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        import subprocess

        subprocess.check_call([sys.executable, "-m", "pip", "install", "playwright", "-q"])
        subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])
        from playwright.sync_api import sync_playwright

    server = start_server()
    url = f"http://127.0.0.1:{PORT}/index.html?v=readme-shots"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
        page.add_init_script(
            "try { sessionStorage.setItem('gdv_gate_ok_v2', '1'); } catch(e) {}"
        )
        page.goto(url, wait_until="networkidle")
        wait_home(page)

        # Início — diária pendente (preset 25%)
        apply_preset(page, 25)
        shot(page, "01-home-diaria-pendente.png")

        # Início — meio da jornada (preset 50%)
        apply_preset(page, 50)
        shot(page, "02-home-proximo-passo.png")

        # Configurações (menu ao lado do ⚙️)
        open_settings(page)
        shot(page, "03-configuracoes.png")
        close_settings(page)

        # Missões (diária + semanais)
        go_nav(page, "daily")
        shot(page, "04-missoes.png")

        # Mapa mundial
        go_nav(page, "map")
        time.sleep(1.5)
        shot(page, "05-mapa.png")

        # Crises / desafios
        go_nav(page, "boss")
        shot(page, "06-crises.png")

        # Eu — progresso
        go_nav(page, "profile")
        time.sleep(0.5)
        shot(page, "07-eu-progresso.png")

        browser.close()

    server.shutdown()
    print(f"\nScreenshots em {OUT}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
