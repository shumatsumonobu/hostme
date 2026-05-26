# hostme デプロイガイド

## インフラ構成

| 項目 | 値 |
|------|-----|
| ホスティング | Cloudflare Workers |
| ビルドツール | opennextjs-cloudflare |
| ワーカー名 | `hostme` |
| Workers URL | `https://hostme.shumatsumonobu.workers.dev` |
| カスタムドメイン | `hostme.dev`（Cloudflare Registrar で取得済み） |
| SSL | Cloudflare 自動管理 |

## デプロイフロー

```
npm run cf:deploy（Windows ターミナル）
  │
  ▼
scripts/deploy.sh
  │
  ▼ WSL に自動切り替え
  │
  ├─ 1. rm -rf node_modules && npm install（Linux用バイナリ）
  ├─ 2. opennextjs-cloudflare build（Next.js → Worker にビルド）
  ├─ 3. opennextjs-cloudflare deploy（wrangler 経由で Cloudflare にアップロード）
  └─ 4. クリーンアップ → Windows 用 node_modules 復帰
         │
         ▼
  Cloudflare Edge Network（全世界 300+ 拠点）
    │
    ├─ hostme.shumatsumonobu.workers.dev  ← Workers デフォルトURL
    └─ hostme.dev  ← カスタムドメイン（DNS で Worker に紐付け）
         │
         ▼
    ユーザーのブラウザに配信
```

カスタムドメインは Cloudflare の DNS ルーティング。一度設定すれば以降は `npm run cf:deploy` だけで両方の URL に自動反映される。

## デプロイ手順

### 通常デプロイ

```bash
npm run cf:deploy
```

内部処理（`scripts/deploy.sh`）:
1. WSL 内で `node_modules` をクリーンインストール（Linux 用ネイティブバイナリ）
2. WSL 内で `opennextjs-cloudflare build` → `deploy`
3. WSL 内の `node_modules` を削除
4. Windows 用 `node_modules` を再インストール

**前提:**
- WSL（Ubuntu）インストール済み、Node.js/npm 利用可能
- dev server は事前に停止すること
- Cloudflare にログイン済み（`wrangler login`）

### ローカルプレビュー

```bash
npm run cf:preview
```

Workers 環境でのローカル動作確認。deploy と同じ WSL 経由の仕組み。

## カスタムドメイン設定（hostme.dev → Workers）

### 前提

- hostme.dev は Cloudflare Registrar で購入済み
- DNS は Cloudflare が管理（ネームサーバー設定不要）
- hostme ワーカーはデプロイ済み

### 手順

1. **Cloudflare ダッシュボード** → Workers & Pages → `hostme` を選択
2. **Settings** タブ → **Domains & Routes** セクション
3. **Add** → **Custom Domain** を選択
4. `hostme.dev` を入力 → **Add Custom Domain**
5. Cloudflare が自動で DNS レコード（AAAA `100::` プロキシ済み）を作成
6. SSL 証明書が自動プロビジョニングされるまで数分待つ
7. `https://hostme.dev` にアクセスして動作確認

### www サブドメイン（任意）

`www.hostme.dev` → `hostme.dev` にリダイレクトしたい場合:
1. DNS に `www` の CNAME → `hostme.dev` を追加（プロキシ ON）
2. Rules → Redirect Rules で `www.hostme.dev/*` → `https://hostme.dev/$1`（301）

## Cloudflare セキュリティ設定

カスタムドメイン設定後にダッシュボードで有効化:

| 設定 | 場所 | 推奨値 |
|------|------|--------|
| SSL/TLS モード | SSL/TLS → Overview | Full (strict) |
| Always Use HTTPS | SSL/TLS → Edge Certificates | ON |
| Automatic HTTPS Rewrites | SSL/TLS → Edge Certificates | ON |
| Minimum TLS Version | SSL/TLS → Edge Certificates | TLS 1.2 |
| DDoS Protection | Security | 自動有効（Free で十分） |
| Bot Fight Mode | Security → Bots | OFF（Twitterbot 等の OGP 取得をブロックするため） |
| Block AI Bots | Security → Bots | ON（AI 学習クローラーのみブロック） |
| WAF Managed Rules | Security → WAF | Free 枠を有効化 |

## Google Search Console

- 登録済み: https://hostme.dev（URLプレフィックス）
- 所有権確認: HTMLファイル方式（`public/googlecad15cd5bbbeb7a4.html` — 削除不可）
- サイトマップ送信済み: `sitemap.xml`（5ページ検出）

## Cloudflare Web Analytics

1. ダッシュボード → Analytics & Logs → Web Analytics
2. `hostme.dev` のサイトを追加
3. 発行された JS スニペットを `src/app/layout.tsx` に追加（`<Script>` タグ）
4. CSP の `script-src` に Cloudflare Analytics のドメインを追加

## トラブルシューティング

### デプロイ時に `.node` ファイルが削除できない

```
rm: cannot remove 'node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node': Input/output error
```

**原因:** Windows の Node プロセスがファイルを掴んでいる
**対処:** dev server 等の Node プロセスを停止してからリトライ

```bash
# Node プロセスを確認・停止
tasklist | grep node
taskkill //F //PID <PID>
```

### WSL で ast-grep ネイティブバインディングエラー

**原因:** Windows 用 `node_modules` を WSL で使おうとしている
**対処:** `deploy.sh` が自動でクリーンインストールするので、手動で WSL に入って `npm install` した場合に発生。`npm run cf:deploy` を使うこと。

### ビルド後に `npm run build` が見つからない

**原因:** `package.json` の `build` スクリプトは `opennextjs-cloudflare` が内部で使用するため削除不可
**対処:** `build` スクリプトは常に残しておくこと（CLAUDE.md にも記載）
