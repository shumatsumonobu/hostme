# マーケティングLP仕様（/lp）

## コンセプト

ターミナル風の世界観を維持しつつ、初見ユーザーに「何ができるか」「どう使うか」を伝えるランディングページ。診断画面に入ったときの違和感をゼロにする。

- ja/en 切り替え対応（`?l=ja` / `?l=en`）
- HN/Product Hunt からの流入先
- ゴール: 「診断スタート」ボタンを押してもらう

## デザイン方針

- ダーク背景 + グリーンテキスト（既存テーマ変数を使用）
- Terminal コンポーネントは使わない（LPは全画面レイアウト）
- セクション間にターミナル風の区切り（`---` や `$` プロンプト）
- フォント: JetBrains Mono（既存と統一）
- アニメーション: スクロール連動のフェードイン（framer-motion）

## ページ構成

### 1. ヒーローセクション

```
$ hostme

> 30秒で、最適なホスティングが見つかる
> Find your ideal hosting in 30 seconds

[Enter] 診断スタート          ← CTA（/diagnose へ遷移）
```

- キャッチコピー（ja/en）
- CTAボタン
- 📸 Nano Banana画像: ヒーロー背景 or 右側にイラスト（ターミナル×サーバーのイメージ）

### 2. 3ステップ説明

```
$ hostme --how-it-works

  [1] 7つの質問に答える     → 予算、フレームワーク、トラフィックなど
  [2] 10サービスをスコアリング → 回答ごとに各サービスへ 0〜3 点を加算
  [3] TOP3を提案            → 理由付きであなたに最適なサービスを表示
```

- ターミナルのコマンド出力風に3ステップを表示
- 各ステップにアイコンまたはミニイラスト（任意）

### 3. 対象サービス一覧

```
$ hostme --list-services

  Vercel Hobby / Vercel Pro / Cloudflare Workers / AWS Amplify
  Firebase App Hosting / Google Cloud Run / Netlify / Render
  Fly.io / Railway
```

- 10サービス名を並べる
- 各サービスのロゴがあれば表示（なければテキストのみ）

### 4. デモセクション

```
$ hostme analyze --demo

  ✔ Deploy target found!
  #1  Cloudflare Workers
      年間¥1,500 / 商用OK / 簡単
      理由: 無料で商用利用OK、帯域無制限

  #2  Netlify       ¥0〜
  #3  Vercel Hobby  ¥0（非商用）
```

- 結果画面のサンプルをターミナル風に表示
- 📸 スクショ: 実際の結果画面（任意、なくてもテキストで代替可）
- 🎥 動画/GIF: 診断フロー30秒の画面収録を埋め込み（任意）

### 5. 特徴セクション

```
$ hostme --features

  > 完全無料・登録不要
  > 日本語 / English 対応
  > 30秒で完結
  > スコアリングロジック完全公開
  > OGP画像付きでシェア可能
```

- 箇条書きで特徴を列挙

### 6. CTAセクション（フッター上）

```
$ hostme analyze

  あなたに最適なホスティングを見つけよう

  [Enter] 診断スタート          ← 2つ目のCTA
```

- ページ下部にもう一度 CTA

### 7. フッター

```
---
hostme v1.0 | GitHub | About | X
```

- GitHub リポジトリリンク
- /about へのリンク（スコアリングロジック公開）
- Xアカウントへのリンク

## 素材

| 素材 | 用途 | 状態 |
|---|---|---|
| デモ動画（ja/en） | デモセクション | 済（`npm run record-demo` で自動生成） |
| OGP画像（ja/en） | SNSシェア時 | 済（`/lp/ogp?l=ja\|en` で自動生成） |

## 技術メモ

- ルート: `/lp?l=ja` / `/lp?l=en`
- 既存の CSS 変数・Tailwind テーマトークンをそのまま使用
- framer-motion でスクロールアニメーション
- Terminal コンポーネントは使わず、セクションごとに独自レイアウト
- レスポンシブ: モバイルファースト
