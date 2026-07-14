/**
 * Teste automatizado — página inicial + menu de acessibilidade
 * Uso: node test-a11y.mjs
 * Servidor interno na porta 8094 — ver README (dev manual: porta 8093).
 */
import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = 8094;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = req.url.split("?")[0] || "/";
      const file = join(ROOT, url === "/" ? "index.html" : url.replace(/^\//, ""));
      try {
        const data = readFileSync(file);
        res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404).end("Not found");
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function assertVisible(page, selector, label) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: "attached", timeout: 8000 });
  const box = await el.boundingBox();
  if (!box || box.width < 2 || box.height < 2) {
    throw new Error(`${label}: elemento sem área visível (${selector})`);
  }
}

async function appMetrics(page) {
  return page.evaluate(() => {
    const app = document.querySelector(".app");
    const home = document.getElementById("screenHome");
    const active = document.querySelector(".screen.active");
    const style = app ? getComputedStyle(app) : null;
    return {
      appH: app ? app.offsetHeight : 0,
      homeDisplay: home ? getComputedStyle(home).display : null,
      activeId: active ? active.id : null,
      appOpacity: style ? style.opacity : null,
      appFilter: style ? style.filter : null,
      bodyClass: document.body.className,
      errors: window.__testErrors || [],
    };
  });
}

async function run() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.addInitScript(() => {
    window.__testErrors = [];
    window.addEventListener("error", (e) => window.__testErrors.push(e.message));
  });

  const url = `http://127.0.0.1:${PORT}/index.html?v=test`;
  const results = [];

  async function check(label) {
    const m = await appMetrics(page);
    const ok = m.appH > 200 && m.activeId === "screenHome" && m.homeDisplay === "block";
    results.push({ label, ok, ...m, errors: [...errors] });
    if (!ok) throw new Error(`${label} FALHOU: appH=${m.appH} active=${m.activeId}`);
  }

  try {
    // 1) Carregamento limpo
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await assertVisible(page, "#screenHome", "Home");
    await check("carregamento inicial");
    results[results.length - 1].errors = [];

    // 2) Simular estado corrompido (daltônico + libras + contraste)
    await page.evaluate(() => {
      localStorage.setItem(
        "guardiao_orbita_v7",
        JSON.stringify({
          lang: "pt",
          a11y: {
            voice: false,
            contrast: true,
            large: false,
            motion: true,
            signs: true,
            fontScale: 0,
            links: false,
            spacing: false,
            letterSpace: false,
            dyslexia: false,
            colorblind: "protanopia",
            readingMode: false,
          },
        })
      );
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await check("estado salvo corrompido");
    results[results.length - 1].errors = [];

    // 3) Abrir menu A11y e clicar em todas as opções
    await page.click("#a11yBtn");
    await page.waitForSelector("#a11yMenu:not([hidden])", { timeout: 3000 });
    const toggles = page.locator("#a11yMenu .am-toggle");
    const count = await toggles.count();
    for (let i = 0; i < count; i++) {
      await toggles.nth(i).click();
      await page.waitForTimeout(200);
      await check(`toggle ${i + 1}/${count}`);
      results[results.length - 1].errors = [];
    }

    // 4) Restaurar padrão
    await page.click("#resetA11yMenuBtn");
    await page.waitForTimeout(400);
    await check("restaurar padrão");

    // 5) Toggles da home
    for (const id of ["optVoice", "optContrast", "optSigns", "optMotion"]) {
      await page.locator(`#${id}`).click({ force: true });
      await page.waitForTimeout(200);
      await check(`home ${id}`);
      results[results.length - 1].errors = [];
      await page.locator(`#${id}`).click({ force: true });
      await page.waitForTimeout(150);
    }

    console.log("\n✅ TODOS OS TESTES PASSARAM\n");
    results.forEach((r) => {
      console.log(`  ✓ ${r.label} — appH:${r.appH} filter:${r.appFilter || "none"}`);
    });
    process.exit(0);
  } catch (err) {
    console.error("\n❌ TESTE FALHOU\n", err.message);
    results.forEach((r) => {
      console.log(`  ${r.ok ? "✓" : "✗"} ${r.label}`, JSON.stringify(r));
    });
    if (errors.length) console.log("Console errors:", errors);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

run();
