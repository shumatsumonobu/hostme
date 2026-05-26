import type { Lang } from "@/types";

type LpText = {
  heroPrompt: string;
  heroTagline: string;
  heroSubTagline: string;
  heroCta: string;
  heroHint: string;

  stepsCommand: string;
  steps: { title: string; description: string }[];

  servicesCommand: string;
  servicesCount: string;

  demoCommand: string;
  demoFound: string;
  demoSteps: string[];
  demoVideoCaption: string;

  featuresCommand: string;
  features: string[];

  ctaCommand: string;
  ctaHeading: string;
  ctaButton: string;

  footerAbout: string;
};

export const lpText: Record<Lang, LpText> = {
  ja: {
    heroPrompt: "$ hostme",
    heroTagline: "30秒で、最適なホスティングが見つかる。",
    heroSubTagline: "7つの質問に答えるだけ。10サービスを比較、TOP3を提案。",
    heroCta: "[Enter] 診断スタート",
    heroHint: "無料・登録不要",

    stepsCommand: "$ hostme --how-it-works",
    steps: [
      { title: "7つの質問に答える", description: "予算、フレームワーク、トラフィック規模..." },
      { title: "10サービスをスコアリング", description: "回答ごとに各サービスへ 0〜3 点を加算" },
      { title: "TOP3を提案", description: "理由付きであなたに最適なサービスを表示" },
    ],

    servicesCommand: "$ hostme --list-services",
    servicesCount: "10サービス対応",

    demoCommand: "$ hostme analyze --demo",
    demoFound: "✔ デプロイ先が見つかりました！",
    demoSteps: ["応答を解析中...", "10サービスを比較中...", "スコアを計算中..."],
    demoVideoCaption: "▶ 30秒で完結する診断フロー",

    featuresCommand: "$ hostme --features",
    features: [
      "完全無料・登録不要",
      "日本語 / English 対応",
      "30秒で完結",
      "スコアリングロジック完全公開",
      "OGP画像付きでシェア可能",
    ],

    ctaCommand: "$ hostme analyze",
    ctaHeading: "あなたに最適なホスティングを見つけよう",
    ctaButton: "[Enter] 診断スタート",

    footerAbout: "仕組みを見る",
  },
  en: {
    heroPrompt: "$ hostme",
    heroTagline: "Find your ideal hosting in 30 seconds.",
    heroSubTagline: "Answer 7 questions. Compare 10 services. Get your TOP 3.",
    heroCta: "[Enter] Start diagnosis",
    heroHint: "Free, no sign-up required",

    stepsCommand: "$ hostme --how-it-works",
    steps: [
      { title: "Answer 7 questions", description: "Budget, framework, traffic scale..." },
      { title: "Score 10 services", description: "Each answer adds 0-3 points per service" },
      { title: "Get your TOP 3", description: "See your best matches with reasons" },
    ],

    servicesCommand: "$ hostme --list-services",
    servicesCount: "10 services covered",

    demoCommand: "$ hostme analyze --demo",
    demoFound: "✔ Deploy target found!",
    demoSteps: ["analyzing responses...", "comparing 10 services...", "calculating scores..."],
    demoVideoCaption: "▶ 30-second diagnosis flow",

    featuresCommand: "$ hostme --features",
    features: [
      "Completely free, no sign-up",
      "Japanese / English",
      "Done in 30 seconds",
      "Scoring logic fully transparent",
      "Share with OGP image",
    ],

    ctaCommand: "$ hostme analyze",
    ctaHeading: "Find your ideal hosting service",
    ctaButton: "[Enter] Start diagnosis",

    footerAbout: "How it works",
  },
};
