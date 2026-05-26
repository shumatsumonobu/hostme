/**
 * LP用デモ動画の自動録画スクリプト
 *
 * 使い方:
 *   1. npm run dev でローカルサーバーを起動
 *   2. npm run record-demo               → ja/en 両方録画
 *      npm run record-demo -- --ja       → 日本語のみ
 *      npm run record-demo -- --en       → 英語のみ
 *      npm run record-demo -- --screenshots → スクショ4枚撮影（EN）
 *   3. public/demo-ja.webm, public/demo-en.webm が生成される
 *      --screenshots: screenshot-home/diagnose/result/about.png が生成される
 *
 * 前提: npx playwright install chromium
 */
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const PUBLIC_DIR = path.join(__dirname, "..", "public");

/** dev serverが起動中か確認 */
function isServerRunning(url) {
  return new Promise((resolve) => {
    http.get(url, () => resolve(true)).on("error", () => resolve(false));
  });
}

/** dev serverを起動して準備完了を待つ */
async function startDevServer() {
  const child = spawn("npx", ["next", "dev"], {
    cwd: path.join(__dirname, ".."),
    stdio: "ignore",
    shell: true,
    detached: false,
  });
  // 準備完了を待つ（最大30秒）
  for (let i = 0; i < 60; i++) {
    if (await isServerRunning(BASE_URL)) return child;
    await new Promise((r) => setTimeout(r, 500));
  }
  child.kill();
  throw new Error("dev server failed to start");
}

/** Windows パスを WSL パスに変換 */
function toWslPath(winPath) {
  return winPath.replace(/\\/g, "/").replace(/^([A-Z]):/i, (_, d) => `/mnt/${d.toLowerCase()}`);
}

/** spawn を Promise 化 */
function runCmd(cmd, args) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { stdio: "inherit", shell: true });
    proc.on("close", (code) => resolve(code));
    proc.on("error", () => resolve(1));
  });
}

/** WebM → GIF 変換（WSL ffmpeg, 2パスパレット最適化） */
async function convertToGif(lang) {
  const webm = path.join(PUBLIC_DIR, `demo-${lang}.webm`);
  const gif = path.join(PUBLIC_DIR, `demo-${lang}.gif`);
  const palette = path.join(PUBLIC_DIR, `_palette-${lang}.png`);
  const wslWebm = toWslPath(webm);
  const wslGif = toWslPath(gif);
  const wslPalette = toWslPath(palette);
  const filters = "fps=8,scale=800:-1:flags=lanczos";

  console.log(`  GIF変換中（2パス）: demo-${lang}.gif ...`);

  // パス1: パレット生成
  const code1 = await runCmd("wsl", [
    "--", "ffmpeg", "-i", wslWebm,
    "-vf", `"${filters},palettegen=stats_mode=diff"`,
    "-y", wslPalette,
  ]);
  if (code1 !== 0) {
    console.warn(`  パレット生成失敗 (exit ${code1}), スキップ`);
    return;
  }

  // パス2: パレット適用してGIF生成（[x] がシェル展開されないよう引用符で囲む）
  const lavfi = `${filters}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3`;
  const code2 = await runCmd("wsl", [
    "--", "ffmpeg", "-i", wslWebm, "-i", wslPalette,
    "-lavfi", `"${lavfi}"`,
    "-y", wslGif,
  ]);
  if (code2 === 0) {
    console.log(`  GIF完了: demo-${lang}.gif`);
  } else {
    console.warn(`  GIF変換失敗 (exit ${code2}), スキップ`);
  }

  // パレット一時ファイル削除
  try { require("fs").unlinkSync(palette); } catch {}
}

/** Playwright一時ファイルを削除 */
function cleanupTempVideos() {
  const fs = require("fs");
  const files = fs.readdirSync(PUBLIC_DIR);
  for (const f of files) {
    if (f.endsWith(".webm") && !f.startsWith("demo-")) {
      fs.unlinkSync(path.join(PUBLIC_DIR, f));
    }
  }
}

// 診断フローの回答（Cloudflare Workers が #1 になる組み合わせ）
// Q1: 商用利用する(1) Q2: 無料(0) Q3: 簡単(0) Q4: 従量課金NG(0)
// Q5: Next.js(0) Q6: 個人(0) Q7: Cloudflare(2)
const ANSWERS = [1, 0, 0, 0, 0, 0, 2];

const LANG_CONFIG = {
  ja: { key: "1", region: "1", startText: "[Enter] Start", langText: "[1] 日本語", readyText: "[Enter] 診断スタート" },
  en: { key: "2", region: "1", startText: "[Enter] Start", langText: "[2] English", readyText: "[Enter] Start diagnosis" },
};

async function wait(page, ms = 800) {
  await page.waitForTimeout(ms);
}

async function recordLang(lang) {
  const config = LANG_CONFIG[lang];
  const outPath = path.join(PUBLIC_DIR, `demo-${lang}.webm`);

  console.log(`\n[${ lang.toUpperCase() }] 録画開始...`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: PUBLIC_DIR,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  // 背景色をターミナル風に（白フラッシュ防止）
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setDefaultBackgroundColorOverride", {
    color: { r: 10, g: 26, b: 10, a: 1 }, // #0a1a0a
  });

  try {
    await page.waitForTimeout(500);

    // --- ホームページ ---
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    console.log(`  ホームページ読み込み完了`);

    // イントロタイピング完了を待つ
    await page.waitForSelector(`text=/\\[Enter\\] Start/`, { timeout: 120000 });
    await wait(page, 1000);

    // Enter → 言語選択へ
    await page.keyboard.press("Enter");
    console.log(`  → 言語選択`);
    await page.waitForSelector(`text=${config.langText}`, { timeout: 10000 });
    await wait(page, 1000);

    // 言語選択
    await page.keyboard.press(config.key);
    console.log(`  → リージョン選択 (${lang})`);
    await wait(page, 2000);

    // リージョン選択のタイピング完了を待つ
    await wait(page, 3000);

    // リージョン選択 (Asia)
    await page.keyboard.press(config.region);
    console.log(`  → Ready`);

    // Ready画面のタイピング完了を待つ
    await page.waitForSelector(`text=${config.readyText}`, { timeout: 30000 });
    await wait(page, 1500);

    // Enter → 診断開始
    await page.keyboard.press("Enter");
    console.log(`  → 診断開始`);

    // --- 診断ページ ---
    await page.waitForURL("**/diagnose**", { timeout: 20000 });
    console.log(`  診断ページ読み込み完了`);

    // 7問に回答
    for (let i = 0; i < ANSWERS.length; i++) {
      await page.waitForSelector(`text=[${i + 1}/7]`, { timeout: 15000 });
      await wait(page, 1500);

      const key = String(ANSWERS[i] + 1);
      await page.keyboard.press(key);
      console.log(`  Q${i + 1}/7 → ${key}`);
    }

    // ローディングアニメーション
    console.log(`  → ローディング中...`);
    await wait(page, 5000);

    // --- 結果ページ ---
    await page.waitForURL("**/result**", { timeout: 30000 });
    console.log(`  結果ページ読み込み完了`);

    // 結果のタイピングアニメーション完了を待つ
    await wait(page, 15000);

    // アクションボタン表示を待つ
    await page.waitForSelector("text=[?]", { timeout: 10000 });
    await wait(page, 2000);

    // [?] 仕組みを見る → About ページ
    await page.keyboard.press("?");
    console.log(`  → About（仕組みを見る）`);
    await page.waitForURL("**/about**", { timeout: 15000 });
    console.log(`  Aboutページ読み込み完了`);

    // Aboutページの内容を見せる
    await wait(page, 8000);

    // 余韻
    await wait(page, 2000);

    console.log(`[${lang.toUpperCase()}] 録画終了`);
  } finally {
    const video = page.video();
    await context.close();
    if (video) {
      await video.saveAs(outPath);
      console.log(`  保存先: ${outPath}`);
    }
    await browser.close();
  }
}

async function takeScreenshots() {
  console.log("\n[SCREENSHOTS] スクリーンショット撮影開始...");

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setDefaultBackgroundColorOverride", {
    color: { r: 10, g: 26, b: 10, a: 1 },
  });

  try {
    // --- ホーム画面 ---
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForSelector("text=/\\[Enter\\] Start/", { timeout: 120000 });
    await wait(page, 1000);
    await page.screenshot({ path: path.join(PUBLIC_DIR, "screenshot-home.png") });
    console.log("  screenshot-home.png 保存完了");

    // EN 選択
    await page.keyboard.press("Enter");
    await page.waitForSelector("text=[2] English", { timeout: 10000 });
    await wait(page, 1000);
    await page.keyboard.press("2");
    await wait(page, 3000);

    // US リージョン選択
    await page.keyboard.press("2");
    await page.waitForSelector("text=[Enter] Start diagnosis", { timeout: 30000 });
    await wait(page, 1500);

    // 診断開始
    await page.keyboard.press("Enter");
    await page.waitForURL("**/diagnose**", { timeout: 20000 });

    // --- 診断画面（Q1）---
    await page.waitForSelector("text=[1/7]", { timeout: 15000 });
    await wait(page, 1500);
    await page.screenshot({ path: path.join(PUBLIC_DIR, "screenshot-diagnose.png") });
    console.log("  screenshot-diagnose.png 保存完了");

    // 7問に回答
    for (let i = 0; i < ANSWERS.length; i++) {
      await page.waitForSelector(`text=[${i + 1}/7]`, { timeout: 15000 });
      await wait(page, 500);
      await page.keyboard.press(String(ANSWERS[i] + 1));
    }

    // ローディング
    await wait(page, 5000);

    // --- 結果画面 ---
    await page.waitForURL("**/result**", { timeout: 30000 });
    await wait(page, 15000);
    await page.waitForSelector("text=[?]", { timeout: 10000 });
    await wait(page, 2000);
    await page.screenshot({ path: path.join(PUBLIC_DIR, "screenshot-result.png") });
    console.log("  screenshot-result.png 保存完了");

    // --- About画面 ---
    await page.keyboard.press("?");
    await page.waitForURL("**/about**", { timeout: 15000 });
    await wait(page, 8000);
    await page.screenshot({ path: path.join(PUBLIC_DIR, "screenshot-about.png"), fullPage: true });
    console.log("  screenshot-about.png 保存完了");

    console.log("\n[SCREENSHOTS] 全スクリーンショット完了！");
  } finally {
    await context.close();
    await browser.close();
  }
}

(async () => {
  const args = process.argv.slice(2);
  const jaOnly = args.includes("--ja");
  const enOnly = args.includes("--en");
  const screenshotsOnly = args.includes("--screenshots");

  // dev serverが動いていなければ自動起動
  let devServer = null;
  const running = await isServerRunning(BASE_URL);
  if (!running) {
    console.log("dev server を起動中...");
    devServer = await startDevServer();
    console.log("dev server 起動完了");
  }

  try {
    if (screenshotsOnly) {
      await takeScreenshots();
    } else {
      const langs = jaOnly ? ["ja"] : enOnly ? ["en"] : ["ja", "en"];
      for (const lang of langs) {
        await recordLang(lang);
      }
      // GIF 変換
      for (const lang of langs) {
        await convertToGif(lang);
      }
      console.log("\n全録画完了！");
    }
  } finally {
    // 自分で起動したdev serverは停止
    if (devServer) {
      devServer.kill();
      console.log("dev server を停止しました");
    }
    // Playwright一時ファイルを削除
    if (!screenshotsOnly) cleanupTempVideos();
  }
})();
