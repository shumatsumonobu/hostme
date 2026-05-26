# スコアリングマトリクス

各質問の回答ごとに、10サービスへスコア（0〜3）を加算する。合計スコアの上位3サービスを結果として表示。同点のサービスはすべて表示する（TOP3が4件以上になることもある）。

- **3**: 最適（強く推奨）
- **2**: 良い（合っている）
- **1**: 普通（特に利点なし）
- **0**: 非推奨（条件に合わない）

満点: 7問 × 3点 = 21点

## Q1: 商用利用する？

| サービス | しない | する/するかも |
|----------|--------|--------------|
| Vercel Hobby | 3 | 0 |
| Vercel Pro | 0 | 2 |
| Cloudflare Workers | 2 | 3 |
| AWS Amplify | 1 | 2 |
| Firebase App Hosting | 2 | 2 |
| Google Cloud Run | 1 | 2 |
| Netlify | 2 | 2 |
| Render | 2 | 2 |
| Fly.io | 1 | 2 |
| Railway | 1 | 2 |

ポイント: Vercel Hobbyは商用NGのため「する」で0。Cloudflare Workersは無料で商用OKのため3。

## Q2: 月額予算は？

| サービス | 無料がいい | $5程度 | $20程度 |
|----------|-----------|--------|---------|
| Vercel Hobby | 3 | 2 | 1 |
| Vercel Pro | 0 | 0 | 3 |
| Cloudflare Workers | 3 | 3 | 2 |
| AWS Amplify | 1 | 2 | 2 |
| Firebase App Hosting | 2 | 2 | 2 |
| Google Cloud Run | 2 | 2 | 2 |
| Netlify | 3 | 2 | 2 |
| Render | 2 | 2 | 2 |
| Fly.io | 2 | 2 | 2 |
| Railway | 1 | 3 | 2 |

ポイント: Vercel Proは$20/月なので低予算で0。Railwayは$5クレジット付きで$5帯に強い。

## Q3: セットアップの手間は？

| サービス | とにかく簡単 | 多少の設定は許容 | インフラ得意、Docker可 |
|----------|-------------|----------------|---------------------|
| Vercel Hobby | 3 | 2 | 1 |
| Vercel Pro | 3 | 2 | 1 |
| Cloudflare Workers | 2 | 3 | 2 |
| AWS Amplify | 2 | 2 | 2 |
| Firebase App Hosting | 2 | 2 | 1 |
| Google Cloud Run | 0 | 1 | 3 |
| Netlify | 3 | 2 | 1 |
| Render | 2 | 2 | 2 |
| Fly.io | 1 | 2 | 3 |
| Railway | 2 | 2 | 2 |

ポイント: Vercel/Netlifyはgit push deployで最も簡単。Cloud Run/Fly.ioはDocker前提でインフラ得意な人向け。

## Q4: 従量課金のリスクは？

| サービス | 絶対避けたい | 少額なら許容 | 気にしない |
|----------|-------------|-------------|-----------|
| Vercel Hobby | 3 | 2 | 1 |
| Vercel Pro | 2 | 2 | 2 |
| Cloudflare Workers | 3 | 2 | 2 |
| AWS Amplify | 0 | 2 | 3 |
| Firebase App Hosting | 1 | 2 | 3 |
| Google Cloud Run | 1 | 2 | 3 |
| Netlify | 3 | 2 | 1 |
| Render | 2 | 2 | 2 |
| Fly.io | 2 | 2 | 2 |
| Railway | 1 | 3 | 2 |

ポイント: AWS Amplifyは完全従量なので「絶対避けたい」で0。Cloudflare/Vercel Hobby/Netlifyは予測可能な無料枠で3。

## Q5: メインで使うフレームワークは？

| サービス | Next.js | Nuxt/Vue | Astro/SSG | 決めていない |
|----------|---------|----------|-----------|------------|
| Vercel Hobby | 3 | 1 | 2 | 2 |
| Vercel Pro | 3 | 1 | 2 | 2 |
| Cloudflare Workers | 2 | 2 | 3 | 3 |
| AWS Amplify | 2 | 1 | 2 | 1 |
| Firebase App Hosting | 3 | 0 | 0 | 1 |
| Google Cloud Run | 1 | 2 | 1 | 2 |
| Netlify | 2 | 2 | 3 | 2 |
| Render | 1 | 2 | 2 | 2 |
| Fly.io | 1 | 2 | 1 | 2 |
| Railway | 1 | 2 | 1 | 2 |

ポイント: Vercelは Next.js開発元で3。Firebase App HostingはNext.js/Angular専用のためVue/SSGで0。Cloudflare Workersはフレームワーク不問で汎用性が高い。

## Q6: 想定トラフィックは？

| サービス | 個人レベル | 中規模 | 大規模 |
|----------|-----------|--------|--------|
| Vercel Hobby | 3 | 1 | 0 |
| Vercel Pro | 1 | 2 | 2 |
| Cloudflare Workers | 3 | 3 | 3 |
| AWS Amplify | 1 | 2 | 2 |
| Firebase App Hosting | 2 | 2 | 2 |
| Google Cloud Run | 1 | 2 | 3 |
| Netlify | 3 | 2 | 1 |
| Render | 2 | 2 | 1 |
| Fly.io | 2 | 2 | 2 |
| Railway | 2 | 2 | 1 |

ポイント: Cloudflare Workersは帯域無制限で全トラフィック帯に強い。Vercel Hobbyは大規模で制限超過のため0。

## Q7: 普段使っているクラウドは？

| サービス | AWS | Google/Firebase | Cloudflare | 特にない |
|----------|-----|----------------|------------|---------|
| Vercel Hobby | 1 | 1 | 1 | 2 |
| Vercel Pro | 1 | 1 | 1 | 1 |
| Cloudflare Workers | 1 | 1 | 3 | 2 |
| AWS Amplify | 3 | 0 | 0 | 1 |
| Firebase App Hosting | 0 | 3 | 0 | 2 |
| Google Cloud Run | 0 | 3 | 0 | 1 |
| Netlify | 1 | 1 | 1 | 2 |
| Render | 1 | 1 | 1 | 2 |
| Fly.io | 1 | 1 | 1 | 1 |
| Railway | 1 | 1 | 1 | 2 |

ポイント: 既存クラウドのエコシステムに合わせて加点。「特にない」場合は初心者に優しいサービスを加点。

## 検証: 典型ユーザーでシミュレーション

### ケース1: 商用OK・無料重視（商用OK・無料・簡単・従量NG・Next.js・個人・Cloudflare）

| サービス | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | 合計 |
|----------|----|----|----|----|----|----|-----|------|
| Cloudflare Workers | 3 | 3 | 2 | 3 | 2 | 3 | 3 | **19** |
| Netlify | 2 | 3 | 3 | 3 | 2 | 3 | 1 | **17** |
| Vercel Hobby | 0 | 3 | 3 | 3 | 3 | 3 | 1 | **16** |

→ 1位 Cloudflare Workers（想定通り）
→ Vercel Hobbyは商用NGで0が入り3位に落ちる

### ケース2: Next.js初心者（商用未定・無料・簡単・従量NG・Next.js・個人・なし）

| サービス | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | 合計 |
|----------|----|----|----|----|----|----|-----|------|
| Vercel Hobby | 3 | 3 | 3 | 3 | 3 | 3 | 2 | **20** |
| Netlify | 2 | 3 | 3 | 3 | 2 | 3 | 2 | **18** |
| Cloudflare Workers | 2 | 3 | 2 | 3 | 2 | 3 | 2 | **17** |

→ 1位 Vercel Hobby（非商用のNext.js開発者には最適）

### ケース3: インフラ強者（商用OK・$5・Docker可・気にしない・Vue・大規模・Google）

| サービス | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | 合計 |
|----------|----|----|----|----|----|----|-----|------|
| Google Cloud Run | 2 | 2 | 3 | 3 | 2 | 3 | 3 | **18** |
| Fly.io | 2 | 2 | 3 | 2 | 2 | 2 | 1 | **14** |
| Cloudflare Workers | 3 | 3 | 2 | 2 | 2 | 3 | 1 | **16** |

→ 1位 Google Cloud Run（Docker+GCP経験者に最適）

## 理由テンプレート

ユーザーの回答でスコア3がついた項目のテンプレートを結合して、結果画面の「推奨理由」を生成する。スコア3の項目が1つもない場合は、サービスごとのデフォルト理由を表示する。

### Vercel Hobby

| 質問 | 回答 | テンプレート |
|------|------|------------|
| Q1 | しない | 非商用なら最強の無料プラン |
| Q2 | 無料 | 完全無料、クレジットカード不要 |
| Q3 | 簡単 | git pushだけで即デプロイ、設定ゼロ |
| Q4 | 避けたい | 従量課金なし、完全固定の無料プラン |
| Q5 | Next.js | Next.js開発元による最適化。他フレームワークも対応 |
| Q6 | 個人 | 個人開発の無料枠として十分 |

### Vercel Pro

| 質問 | 回答 | テンプレート |
|------|------|------------|
| Q2 | $20 | $20/月でプロ機能すべて利用可能 |
| Q3 | 簡単 | git pushだけで即デプロイ、設定ゼロ |
| Q5 | Next.js | Next.js開発元による最適化。他フレームワークも対応 |

### Cloudflare Workers

| 質問 | 回答 | テンプレート |
|------|------|------------|
| Q1 | する | 無料プランのまま商用利用OK |
| Q2 | 無料 | ホスティング代ゼロ、ドメイン代のみ |
| Q2 | $5 | Paid $5/月で無料枠を大幅拡張 |
| Q3 | 設定許容 | wrangler設定のみ、git連携でデプロイ |
| Q4 | 避けたい | 無料枠の上限が明確、予測可能 |
| Q5 | SSG | 静的アセット無制限配信、SSGに最適 |
| Q5 | 決めてない | フレームワーク不問、何でもデプロイ可 |
| Q6 | 個人 | 無料枠で個人開発に十分 |
| Q6 | 中規模 | 帯域無制限、中規模でも追加費用なし |
| Q6 | 大規模 | 帯域無制限、大規模でもスケール可能 |
| Q7 | Cloudflare | ドメイン・DNS・ホスティングを一元管理 |

### AWS Amplify

| 質問 | 回答 | テンプレート |
|------|------|------------|
| Q4 | 気にしない | 従量課金で使った分だけ、スケールに強い |
| Q7 | AWS | 既存のAWS環境とシームレスに統合 |

### Firebase App Hosting

| 質問 | 回答 | テンプレート |
|------|------|------------|
| Q4 | 気にしない | Blazeプランの従量課金でスケールに強い |
| Q5 | Next.js | Next.js/Angularに正式対応、バックエンドはCloud Run |
| Q7 | Google | Firebase/GCPの既存環境と統合 |

### Google Cloud Run

| 質問 | 回答 | テンプレート |
|------|------|------------|
| Q3 | Docker可 | Docker + Cloud Buildで自由度の高い構成 |
| Q4 | 気にしない | 従量課金だが無料枠が太い（月200万リクエスト） |
| Q6 | 大規模 | オートスケールで大規模トラフィックに対応 |
| Q7 | Google | GCPの既存環境・IAMとシームレス統合 |

### Netlify

| 質問 | 回答 | テンプレート |
|------|------|------------|
| Q2 | 無料 | 無料プランで商用利用もOK |
| Q3 | 簡単 | git pushだけで即デプロイ、設定ゼロ |
| Q4 | 避けたい | 無料プランは固定、予測可能な料金体系 |
| Q5 | SSG | 静的サイト配信が得意、SSGに最適 |
| Q6 | 個人 | 無料枠で個人開発に十分 |

### Render

| 質問 | 回答 | テンプレート |
|------|------|------------|
| - | - | （デフォルト）幅広い条件にバランスよく対応するシンプルなPaaS |

### Fly.io

| 質問 | 回答 | テンプレート |
|------|------|------------|
| Q3 | Docker可 | Dockerベースで自由度が高い、エッジ配信対応 |

### Railway

| 質問 | 回答 | テンプレート |
|------|------|------------|
| Q2 | $5 | 月$5のクレジット付き、少額で始められる |
| Q4 | 少額許容 | $5クレジット内なら実質無料 |

## 採用実績

結果画面で「採用例」として表示する。信頼性の高い情報源（公式customer page / case study）から確認済みのもののみ掲載。

| サービス | 採用例 | 情報源 |
|----------|--------|--------|
| Vercel Hobby / Pro | Washington Post, OpenAI, Nintendo | 公式customer page |
| Cloudflare Workers | Shopify (Oxygen), Discord | 公式case study |
| AWS Amplify | Neiman Marcus, Noom | 公式customer page |
| Firebase App Hosting | NYT, Alibaba | Firebase全体（Hosting単体は不明確） |
| Google Cloud Run | Twitch, OLX | 公式case study |
| Netlify | Peloton, Riot Games, Kubernetes公式サイト | 公式customer stories |
| Render | ReadMe, Hodinkee | 公式customer page |
| Fly.io | Supabase | 公式customer page |
| Railway | Intuit, TripAdvisor | 第三者レポート |

※ メンテナンス時に採用例の変更（移行・撤退等）も確認対象とする。

## リージョンスコアリング

ユーザーが選択したリージョン（asia/us/eu/global）に応じて、各サービスにボーナス/ペナルティスコアを加算する。Q1〜Q7の合計スコアにこの値が加算される。

| サービス | asia | us | eu | global |
|----------|------|----|----|--------|
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

ポイント:
- **asia**: Firebase App Hostingは東京なしだがシンガポール(asia-southeast1)追加(2025/10)で+1。Netlifyはアジア圏のエッジ拠点が限定的で0。Renderは日本リージョンなしで-1。Railwayはシンガポールありだが東京なしで0。
- **us**: 全サービスが米国リージョンに強く、全て+2。
- **eu**: Cloudflare/AWS/Cloud Run/Fly.ioはEUリージョン対応で+2。他は+1。
- **global**: Cloudflare Workersはエッジ配信で全リージョン対応のため+3。AWS/Cloud Run/Fly.ioは複数リージョンで+2。
