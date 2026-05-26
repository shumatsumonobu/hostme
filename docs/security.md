# hostme セキュリティ監査・対策

## 概要

hostme.dev カスタムドメイン公開前にセキュリティ監査を実施。
公開後に未対策のまま露出するリスクを排除するため、ドメイン設定より先に対応する。

## 監査結果

### 問題なし（対応不要）

| カテゴリ | 状態 | 詳細 |
|----------|------|------|
| 入力バリデーション | 優秀 | `src/lib/validate.ts` で全URLパラメータをホワイトリスト検証。lang/region/answers すべて厳密 |
| XSS対策 | 良好 | `dangerouslySetInnerHTML` / `eval()` 使用なし。React自動エスケープに依存 |
| シークレット管理 | 良好 | .env なし、ハードコードされた秘密情報なし。APIキー不使用 |
| 外部リンク | 良好 | 全て `rel="noopener noreferrer"` 付き、`window.open()` に `noopener,noreferrer` フラグ |
| シェア機能 | 良好 | `encodeURIComponent()` で適切にエンコード（`src/lib/share.ts`） |
| localStorage | 良好 | 未使用（テーマ機能削除済み） |
| オープンリダイレクト | なし | 全ナビゲーション先がハードコード。ユーザー入力由来のURLへの遷移なし |
| 依存パッケージ | 良好 | 最小限の依存。`npm audit` で脆弱性なし（定期確認推奨） |

### 対応済み

| 項目 | 対策 | ステータス |
|------|------|------------|
| セキュリティヘッダー | ~~`src/proxy.ts`~~ → 削除済み（opennextjs-cloudflare 非対応）。Cloudflare Transform Rules で対応予定 | 未対応 |
| X-Powered-By | `next.config.js` で `poweredByHeader: false` | 実装済み |
| Permissions-Policy | ~~proxy~~ → Cloudflare Transform Rules で対応予定 | 未対応 |

### 未対応（Cloudflare側）

| 優先度 | 項目 | 対策 |
|--------|------|------|
| 中 | レートリミット | Cloudflare ダッシュボードで設定（診断ツールなので低優先） |
| 中 | WAF / Bot Fight Mode | カスタムドメイン設定後にダッシュボードで有効化 |

## 対策: セキュリティヘッダー

### `next.config.js`

```js
poweredByHeader: false  // X-Powered-By: Next.js を除去
```

### ~~`src/proxy.ts`~~ → 削除済み

opennextjs-cloudflare が Next.js の proxy convention をサポートしていないため、`src/proxy.ts` は削除済み。
セキュリティヘッダー（CSP, X-Frame-Options, HSTS 等）は **Cloudflare Transform Rules** で設定する方針。

設定すべきヘッダー（Transform Rules で追加予定）:

| ヘッダー | 値 | 目的 |
|----------|-----|------|
| `X-Content-Type-Options` | `nosniff` | MIMEタイプスニッフィング防止 |
| `X-Frame-Options` | `DENY` | クリックジャッキング防止 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | リファラー情報の制御 |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | 不要なブラウザAPI無効化 |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | HTTPS強制（Cloudflareも自動付与） |
| `Content-Security-Policy` | 下記参照 | リソース読み込み制御 |

### CSP ポリシー（Transform Rules で設定予定）

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
media-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

| ディレクティブ | 理由 |
|----------------|------|
| `script-src 'unsafe-inline'` | Next.js ハイドレーション用インラインスクリプト |
| `style-src 'unsafe-inline'` | Tailwind v4 / framer-motion がインラインスタイルを使用 |
| `font-src 'self'` | `next/font/google` がビルド時にセルフホスト。外部CDN不要 |
| `media-src 'self'` | LP デモ動画（`/demo-ja.webm`, `/demo-en.webm`） |
| `img-src data: blob:` | MatrixRain Canvas描画 + OGP画像生成 |
| `frame-ancestors 'none'` | X-Frame-Options の CSP版（より新しいブラウザ向け） |

## 対策: Cloudflare側（ダッシュボード設定）

hostme.dev のカスタムドメイン設定後に以下を推奨:

- **SSL/TLS**: Full (strict) モード
- **Always Use HTTPS**: ON
- **Automatic HTTPS Rewrites**: ON
- **DDoS Protection**: 自動有効（Free プランで十分）
- **Bot Fight Mode**: OFF（Twitterbot 等の OGP 取得をブロックするため無効化）
- **Block AI Bots**: ON（AI 学習クローラーのみブロック）
- **Rate Limiting**: 必要に応じて設定（無料プランでは制限あり）
- **WAF**: Managed Rules の Free 枠を有効化

## 運用ガイドライン

- `npm audit` を定期実行（月1回目安）
- 依存パッケージのアップデート時にセキュリティアドバイザリを確認
- CSP違反が発生した場合はブラウザコンソールで確認し、ポリシーを調整
- 新しい外部リソース追加時はCSPの更新を忘れずに
