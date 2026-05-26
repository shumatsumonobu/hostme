# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**コミットに Co-Authored-By を入れない。**
**コミットメッセージは英語で書く。**

## Commands

```bash
npm run dev          # 開発サーバー（node_modules不足時は自動インストール）
npm run build        # プロダクションビルド（cf:deployが内部で使用）
npm run test         # vitest 全テスト実行
npm run test:watch   # vitest ウォッチモード
npm run lint         # ESLint
npm run cf:deploy    # Cloudflare Workers デプロイ（WSL自動経由、Windowsから実行OK）
npm run cf:preview   # Cloudflare Workers ローカルプレビュー（同上）
```

単一テスト: `npx vitest run src/lib/calc.test.ts`

## Architecture

ターミナル風UIのホスティング診断ツール。7問の質問 → 10サービスをスコアリング → TOP3を表示。

### ページフロー

`/` → `/diagnose` → `/result` → `/about`。`/ogp`, `/lp/ogp` で OGP画像生成（Edge Runtime）。URL設計の詳細は [docs/spec.md](docs/spec.md) を参照。

### データレイヤー（`src/data/`）

診断ロジックに関わるデータは4ファイルに集約:

- **`services.ts`** — 10サービスの情報（料金・仕様、`Record<Lang, ServiceText>` で日英対応）
- **`scoring.ts`** — `scoreMatrix`（Q×選択肢×サービス→0〜3）、`regionScoreMatrix`（リージョン補正）、`reasonTemplates`（推奨理由）
- **`questions.ts`** — 7問の質問と選択肢
- **`i18n.ts`** — UIテキスト（ja/en）

### スコア計算（`src/lib/calc.ts`）

`calculateDiagnosis(answers, lang, region)`:
1. 各Qの回答から `scoreMatrix` でサービスごとにスコア加算（0〜3）
2. `regionScoreMatrix` でリージョン補正を加算
3. スコア降順でランキング生成
4. スコア3の項目から `reasonTemplates` で推奨理由を収集

`getTop3`: 3位タイは全て含める（4件以上になることもある）

### コンポーネントパターン

- **Server Component**: `result/page.tsx`（OGPメタデータ生成）、`about/page.tsx`
- **Client Component**: `diagnose/page.tsx`（状態管理）、`ResultContent.tsx`、`AboutContent.tsx`
- **Terminal**: 全ページ共通のターミナル風コンテナ。`lang` propで `document.documentElement.lang` を動的設定
- **TypingText / TypingSequence**: タイピングアニメーション。`onComplete` は `useRef` で保持（useEffect依存配列に入れない）

## Constraints

- **next.config.js は CJS 必須** — ESM(.ts)だと Turbopack がパニックする
- **Tailwind v4 の `@theme` に hex 直書き禁止** — `var()` 参照でランタイムテーマ切替を実現
- **vitest は `pool: "forks"`** — MSYS/Windows で `threads` だとフレイキー
- テーマCSS変数は `src/app/globals.css` の `:root` と `[data-theme="..."]` で定義
- パスエイリアス: `@/*` → `src/*`
- docs/standards.md の命名規則に従うこと。
