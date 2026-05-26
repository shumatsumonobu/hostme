// 言語
export type Lang = "ja" | "en";

// リージョン
export type Region = "asia" | "us" | "eu" | "global";

// 質問ID
export type QuestionId = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7";

// 選択肢キー（各質問ごと）
export type OptionKey =
  | "no" | "yes"                          // q1
  | "free" | "5usd" | "20usd"             // q2
  | "easy" | "moderate" | "docker"        // q3
  | "avoid" | "small-ok" | "no-concern"   // q4
  | "nextjs" | "nuxt-vue" | "ssg" | "undecided" // q5
  | "personal" | "medium" | "large"       // q6
  | "aws" | "google" | "cloudflare" | "none";   // q7

// サービスID
export type ServiceId =
  | "vercel-hobby"
  | "vercel-pro"
  | "cloudflare-workers"
  | "aws-amplify"
  | "firebase-app-hosting"
  | "cloud-run"
  | "netlify"
  | "render"
  | "fly-io"
  | "railway";

// サービス表示情報（言語別テキスト）
export type ServiceText = {
  annualCost: string;
  freeRequests: string;
  pros: string[];
  cons: string[];
  migrationDifficulty: string;
  scaleCost: string;
};

// サービス情報
export type Service = {
  id: ServiceId;
  name: string; // サービス名は言語共通
  url: string; // 公式サイトURL
  commercial: boolean;
  examples: string[];
  lastVerified: string;
  text: Record<Lang, ServiceText>;
};

// 質問の選択肢
export type QuestionOption = {
  key: OptionKey;
  label: Record<Lang, string>; // 表示テキスト（言語別）
};

// 質問
export type Question = {
  id: QuestionId;
  text: Record<Lang, string>;
  options: QuestionOption[];
};

// スコアリングマトリクス: question.id → option.key → serviceId → score
export type ScoreMatrix = Record<QuestionId, Partial<Record<OptionKey, Record<ServiceId, number>>>>;

// 理由テンプレート: serviceId → question.id → option.key → 言語別理由文
export type ReasonTemplates = Record<ServiceId, Partial<Record<QuestionId, Partial<Record<OptionKey, Record<Lang, string>>>>>>;

// 理由テンプレートのデフォルト（スコア3が1つもない場合用）
export type DefaultReasons = Record<ServiceId, Record<Lang, string>>;

// リージョンスコアリング: region → serviceId → score
export type RegionScoreMatrix = Record<Region, Record<ServiceId, number>>;

// 診断結果（1サービス分）
export type ServiceResult = {
  service: Service;
  score: number;
  reasons: string[];
};

// 診断結果全体
export type DiagnosisResult = {
  lang: Lang;
  region: Region;
  answers: number[]; // 各質問の選択肢インデックス
  rankings: ServiceResult[];
};
