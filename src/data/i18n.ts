import type { Lang, Region } from "@/types";

type UIText = {
  // トップ画面
  topPrompt: string;
  topDescription: string;
  topStart: string;
  langSelect: string;
  regionSelect: string;
  // リージョン選択肢
  regions: Record<Region, { label: string; description: string }>;
  // 質問画面
  home: string;
  back: string;
  analyzing: string;
  comparing: string;
  calculating: string;
  // 結果画面
  deployFound: string;
  annualCost: string;
  commercial: string;
  commercialOk: string;
  commercialNo: string;
  migrationDifficulty: string;
  scaleCost: string;
  reason: string;
  // アクションボタン
  shareOnX: string;
  tryAgain: string;
  howItWorks: string;
  // 404
  notFoundMessage: string;
  goHome: string;
};

export const uiText: Record<Lang, UIText> = {
  ja: {
    topPrompt: "$ hostme",
    topDescription: "7つの質問に答えるだけで、最適なホスティング先が見つかる",
    topStart: "診断スタート",
    langSelect: "言語を選択してください",
    regionSelect: "ターゲットリージョンは？",
    regions: {
      asia: { label: "asia", description: "日本/アジア" },
      us: { label: "us", description: "北米" },
      eu: { label: "eu", description: "ヨーロッパ" },
      global: { label: "global", description: "特定なし" },
    },
    home: "← home",
    back: "← back",
    analyzing: "応答を解析中...",
    comparing: "10サービスを比較中...",
    calculating: "スコアを計算中...",
    deployFound: "✔ デプロイ先が見つかりました！",
    annualCost: "年間費用",
    commercial: "商用利用",
    commercialOk: "OK",
    commercialNo: "NG",
    migrationDifficulty: "移行難易度",
    scaleCost: "スケール",
    reason: "理由",
    shareOnX: "Xでシェア",
    tryAgain: "もう一度",
    howItWorks: "仕組みを見る",
    notFoundMessage: "command not found",
    goHome: "cd ~",
  },
  en: {
    topPrompt: "$ hostme",
    topDescription: "Answer 7 questions to find your ideal hosting service",
    topStart: "Start diagnosis",
    langSelect: "Select language",
    regionSelect: "Target region?",
    regions: {
      asia: { label: "asia", description: "Japan / Asia" },
      us: { label: "us", description: "North America" },
      eu: { label: "eu", description: "Europe" },
      global: { label: "global", description: "No preference" },
    },
    home: "← home",
    back: "← back",
    analyzing: "analyzing responses...",
    comparing: "comparing 10 services...",
    calculating: "calculating scores...",
    deployFound: "✔ Deploy target found!",
    annualCost: "Annual cost",
    commercial: "Commercial",
    commercialOk: "OK",
    commercialNo: "No",
    migrationDifficulty: "Migration",
    scaleCost: "Scale",
    reason: "Why",
    shareOnX: "Share on X",
    tryAgain: "Try again",
    howItWorks: "How it works",
    notFoundMessage: "command not found",
    goHome: "cd ~",
  },
};
