# hostme（hostme） MVP実装計画

## Phase 0: プロジェクトセットアップ + スケルトンデプロイ

> 依存: なし

- [x] **0-1** Next.js プロジェクト初期化（App Router + TypeScript + Tailwind CSS v4 + ESLint + src/）
- [x] **0-2** 追加パッケージ: `framer-motion`, `@opennextjs/cloudflare`, `vitest`, `wrangler`
- [x] **0-3** Tailwind テーマ設定（CSS変数ベース、monospace フォント）
- [x] **0-4** グローバルスタイル（ベース背景色、テキスト色、カーソル点滅アニメ）
- [x] **0-5** ディレクトリ構造の作成
- [x] **0-6** ~~OGP用フォントファイル配置（`public/fonts/JetBrainsMono-Bold.ttf`）~~ → Google Fonts CDN に変更（CF Workers で self-fetch 不可のため）
- [x] **0-7** OpenNext + Cloudflare Workers 設定（`wrangler.jsonc`, `open-next.config.ts`）
  - `nodejs_compat` フラグ、`compatibility_date: 2026-03-18`
- [x] **0-8** ローカルで `next/og` ImageResponse 検証 — OK（PNG 21KB 返却確認済み）
  - 本番 Workers デプロイは Phase 5 で実施
  - **ダメだった場合**: satori 直接 or 10枚事前生成にフォールバック
- [x] **0-9** `.gitignore` 確認、初回コミット

### ディレクトリ構造

```
src/
  app/
    page.tsx              # トップ画面
    diagnose/page.tsx     # 質問画面
    result/page.tsx       # 結果画面（Server Component → Client Component に渡す）
    about/page.tsx        # LPページ（Server Component）
    about/AboutContent.tsx # LP本体（Client Component、行単位タイピング）
    ogp/route.tsx         # OGP画像生成エンドポイント（Edge Runtime）
    not-found.tsx         # 404ページ（ターミナル風）
    layout.tsx            # 共通レイアウト
    globals.css
  components/
    Terminal.tsx           # ターミナル外枠
    TypingText.tsx         # タイピングアニメーション
    ProgressBar.tsx        # ローディング用プログレスバー
    QuestionBlock.tsx      # 質問表示ブロック
    ActionButtons.tsx      # 結果画面のアクションボタン群
    ThemeSwitcher.tsx       # テーマ切り替えUI（green/cyber/purple/amber）
  data/
    services.ts            # サービス情報定数
    scoring.ts             # スコアリングマトリクス + 理由テンプレート
    questions.ts           # 質問定義
  lib/
    calc.ts                # スコア計算ロジック
    share.ts               # Xシェアテキスト生成
    validate.ts            # URLパラメータバリデーション
  types/
    index.ts               # 型定義
public/
  fonts/
    JetBrainsMono-Bold.ttf # OGP画像用フォント
scripts/
  generate-images.mjs      # nanobanana画像生成スクリプト
```

---

## Phase 1: 型定義 + データレイヤー

> 依存: Phase 0 完了

- [x] **1-1** 型定義（`src/types/index.ts`）
  - `ServiceId` — 10サービスのリテラル型ユニオン
  - `Service` — サービス情報の型
  - `Question`, `QuestionOption` — 質問・選択肢の型
  - `ScoreMatrix`, `ReasonTemplates`, `DefaultReasons` — スコアリング関連の型
  - `ServiceResult`, `DiagnosisResult` — 計算結果の型
- [x] **1-2** 質問データ（`src/data/questions.ts`）— 7問、選択肢数: Q1:2, Q2:3, Q3:3, Q4:3, Q5:4, Q6:3, Q7:4
- [x] **1-3** サービス情報データ（`src/data/services.ts`）— 10サービスの表示情報
- [x] **1-4** スコアリングマトリクス（`src/data/scoring.ts`）— scoring.md の全テーブル + 理由テンプレート + デフォルト理由
- [x] **1-5** スコア計算ロジック（`src/lib/calc.ts`）— 同点処理（`getTop3`）、理由生成含む
- [x] **1-6** バリデーション（`src/lib/validate.ts`）— `a` パラメータの検証 + `encodeAnswers`
- [x] **1-7** ユニットテスト（vitest）— 15テスト全合格（ケース1〜3 + バリデーション + 同点処理 + 理由生成）

---

## Phase 2: 共通UIコンポーネント

> 依存: Phase 0 完了（Phase 1 と並行可能）

- [x] **2-1** ターミナル外枠（`Terminal.tsx`）— ウィンドウ風フレーム（赤・黄・緑ドット）、モバイルファースト、PC で `max-w-2xl` 中央寄せ
- [x] **2-2** タイピングアニメーション（`TypingText.tsx`）— framer-motion、カーソル点滅付き
- [x] **2-3** プログレスバー（`ProgressBar.tsx`）— ASCII風（`█` `░`）、アニメーション付き
- [x] **2-4** 質問ブロック（`QuestionBlock.tsx`）— `[n/7]` 表示、番号選択、ホバーハイライト、キーボード対応
- [x] **2-5** 結果カード（`ResultCard.tsx`）— 1位: 詳細表示（罫線囲み）、2位以下: compact 1行
- [x] **2-6** アクションボタン群（`ActionButtons.tsx`）— `[s]` `[r]` `[?]`、キーボードショートカット対応

---

## Phase 3: ページ実装

> 依存: Phase 1 + Phase 2 完了

- [x] **3-1** 共通レイアウト（`layout.tsx`）— `lang="ja"`, metadata, JetBrains Mono フォント読み込み（Phase 0 で作成済み）
- [x] **3-2** トップ画面（`/`）— `$ hostme` タイピングアニメ → Enter で `/diagnose` に遷移
- [x] **3-3** 質問画面（`/diagnose`）— クライアントコンポーネント、useState でステート管理、← back、キーボード入力対応
- [x] **3-4** ローディング演出 — 質問画面内で `analyzing...` → プログレスバー → `/result` に遷移
- [x] **3-5** 結果画面（`/result`）— Server Component で `?a=` パラメータ取得・スコア計算 → Client Component（ResultContent）に渡す
- [x] **3-6** Xシェアテキスト生成（`share.ts`）— spec.md のフォーマット準拠
- [x] **3-7** LPページ（`/about`）— スコアリング一覧表、選定基準、情報ソース、フィードバックリンク
- [x] **3-8** 404ページ（`not-found.tsx`）— ターミナル風（`$ command not found`）
- [x] **3-9** favicon / apple-touch-icon 設定 — Phase 4.8-8 で動的生成済み
- [x] **3-10** テーマ切り替え機能 — CSS変数ベース（green/cyber/purple/amber）、ThemeSwitcher コンポーネント、localStorage 保存
  - `@theme` に直接 hex を書くと Tailwind v4 がビルド時に `lab()` 変換してハードコードする問題を回避
  - 生CSS変数（`--raw-*`）を `:root`/`[data-theme]` で定義 → `@theme` で `var()` 参照 → ランタイム解決

---

## Phase 4: OGP画像生成

> 依存: Phase 1 完了（Phase 0-8 で動作確認済み前提）

- [x] **4-1** OGPエンドポイント本実装（`/ogp/route.tsx`）— `next/og` ImageResponse, 1200x630px
  - `a` パラメータからスコア計算 → TOP3を画像に描画（結果OGP: 30KB）
  - フォントは `public/fonts/` から `fetch()` で読み込み
  - 不正パラメータ → デフォルトOGP画像を返す（22KB）
- [x] **4-2** OGPレイアウト — ウィンドウ風フレーム（赤黄緑ドット）、#1a1a2e背景 + #00ff41テキスト
- [x] **4-3** 結果画面の `generateMetadata()` — `og:image` → `/ogp?a=...`, `twitter:card` → `summary_large_image`（Phase 3-5 で実装済み）
- [x] **4-4** トップ画面用デフォルトOGP — パラメータなしの `/ogp` で返却

---

## Phase 5: デプロイ + Analytics

> 依存: Phase 3 + Phase 4 完了

- [x] **5-1** 本番デプロイ（WSLから実行: `opennextjs-cloudflare` → `wrangler deploy`）
- [x] **5-2** Cloudflare ドメイン・DNS 設定（hostme.dev → Workers ルーティング）
- [x] **5-3** Cloudflare Web Analytics 有効化（RUM、グローバル）
- [x] **5-4** 全ページ動作確認（/, /diagnose, /result, /about, /ogp）
- [x] **5-5** OGP画像の実機確認（metatags.io で確認OK）

---

## Phase 6: ポリッシュ + リリース準備

> 依存: Phase 5 完了

- [x] **6-1** SEO（`robots.txt`, `sitemap.xml`, JSON-LD: WebApplication）
- [x] **6-2** パフォーマンス最適化（Lighthouse、フォント `display: swap`、バンドル削減）
- [x] **6-3** アクセシビリティ（キーボードナビ、ARIA、色コントラスト比）
- [x] **6-4** エラーハンドリング（不正URLリダイレクト、エラーバウンダリ）
- [x] **6-5** favicon + Apple Touch Icon（ターミナル風 `>_` 動的生成）
- [x] **6-6** README.md 作成
- [x] **6-7** 最終動作テスト — 本番確認OK、OGP画像生成OK

---

## Phase 4.5: i18n + リージョン対応

> 依存: Phase 4 完了

### 設計

**URL設計変更**: `?l=ja&r=asia&a=1,0,0,0,0,0,2`
- `l` — 言語（`ja` | `en`）
- `r` — リージョン（`asia` | `us` | `eu` | `global`）
- `a` — 回答（既存のまま）

**トップ画面フロー**:
```
$ hostme
  [1] 日本語
  [2] English

$ hostme --lang ja
  [1] asia     (日本/アジア)
  [2] us       (北米)
  [3] eu       (ヨーロッパ)
  [4] global   (特定なし)

$ hostme --lang ja --region asia analyze
  → /diagnose?l=ja&r=asia
```

**リージョンスコアリング**（既存スコアに加算）:

| サービス | asia | us | eu | global |
|----------|------|-----|-----|--------|
| Vercel Hobby | +2 | +2 | +1 | +1 |
| Vercel Pro | +2 | +2 | +1 | +1 |
| Cloudflare Workers | +2 | +2 | +2 | +3 |
| AWS Amplify | +2 | +2 | +2 | +2 |
| Firebase App Hosting | +1 | +2 | +1 | +1 |
| Google Cloud Run | +2 | +2 | +2 | +2 |
| Netlify | 0 | +2 | +1 | +1 |
| Render | -1 | +2 | +1 | 0 |
| Fly.io | +2 | +2 | +2 | +2 |
| Railway | 0 | +2 | 0 | 0 |

根拠:
- Cloudflare/Fly.io: 300+エッジ、全リージョンで強い
- Vercel/Amplify/Cloud Run: 東京リージョンあり → asia +2
- Firebase App Hosting: 東京なし、シンガポール追加(2025/10) → asia +1
- Netlify: Edge Functions が2025年に東京撤退 → asia 0
- Render: US中心、日本リージョンなし → asia -1
- Railway: US中心だがシンガポールあり → asia 0

### タスク

- [x] **4.5-1** 型定義追加（`Lang`, `Region`, `RegionScoreMatrix`, `ServiceText` 等）
- [x] **4.5-2** i18nテキストデータ（`src/data/i18n.ts`）— 質問・選択肢・UIテキストの ja/en
- [x] **4.5-3** サービス情報の英語版（`services.ts` を `text: Record<Lang, ServiceText>` に改修）
- [x] **4.5-4** リージョンスコアリングマトリクス（`src/data/scoring.ts` に `regionScoreMatrix` 追加）
- [x] **4.5-5** 理由テンプレートの英語版（`scoring.ts` — `Record<Lang, string>` に改修）
- [x] **4.5-6** `validate.ts` — `parseLang`, `parseRegion` 追加
- [x] **4.5-7** `calc.ts` — `lang`/`region` 引数追加、リージョンスコア加算ロジック
- [x] **4.5-8** トップ画面（`/`）— 言語選択 → リージョン選択 → 診断開始の3ステップフロー
- [x] **4.5-9** 質問画面（`/diagnose`）— `?l=&r=` パラメータで言語/リージョン取得、i18n対応
- [x] **4.5-10** 結果画面（`/result`）— i18n対応 + リージョン反映 + generateMetadata多言語化
- [x] **4.5-11** OGP画像（`/ogp`）— 英語版レイアウト対応、`--region` 表示
- [x] **4.5-12** `share.ts` — 英語版シェアテキスト、URL に `l`/`r` パラメータ追加
- [x] **4.5-13** テスト更新 — 23テスト全合格（リージョンスコア・英語理由・parseLang/parseRegion）
- [x] **4.5-14** about ページ i18n対応（`?l=` パラメータで言語切替）

---

## 依存関係

```
Phase 0（セットアップ + スケルトンデプロイ）
  │
  ├── Phase 1（データレイヤー）──┐
  │     └── Phase 4（OGP生成）  ├── Phase 3（ページ実装）
  └── Phase 2（UIコンポーネント）┘
                                     ↓
                               Phase 4.5（i18n + リージョン）
                                     ↓
                               Phase 5（デプロイ + Analytics）
                                     ↓
                               Phase 6（ポリッシュ）
```

## 技術的な注意点

- **OGP画像生成**: `next/og` (ImageResponse) を Cloudflare Workers 上で動的生成。フォントは `public/fonts/` に配置し `fetch()` で読み込む（`node:fs` は使わない、自己参照 fetch に注意）
- **`/result` のコンポーネント設計**: Server Component で `searchParams` 取得 + スコア計算 → Client Component（ActionButtons等）に props で渡す
- **デプロイ**: WSL から実行（Windows のファイル名制約回避）
- **Worker サイズ上限**: 無料 3MiB / 有料 10MiB（WASM + フォントで膨らむ可能性に注意）
- **Tailwind v4 テーマ切り替え**: `@theme` に hex を直書きすると `lab()` にビルド時変換される。`var()` 参照にすることで `color-mix()` ベースのランタイム解決が有効になる
- **next.config**: `.ts` → `.js`（CJS）に変更。Next.js が config を CJS にコンパイルするため ESM の `import.meta.url` が使えない
