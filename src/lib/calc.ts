import { questions } from "@/data/questions";
import { defaultReasons, reasonTemplates, regionScoreMatrix, scoreMatrix } from "@/data/scoring";
import { services } from "@/data/services";
import type { DiagnosisResult, Lang, Region, ServiceId, ServiceResult } from "@/types";

/**
 * 回答インデックス配列からスコアを計算し、ランキングを返す。
 * 同点のサービスはすべて表示（TOP3が4件以上になることもある）。
 */
export function calculateDiagnosis(
  answers: number[],
  lang: Lang = "ja",
  region: Region = "global",
): DiagnosisResult {
  const scores: Record<ServiceId, number> = {
    "vercel-hobby": 0,
    "vercel-pro": 0,
    "cloudflare-workers": 0,
    "aws-amplify": 0,
    "firebase-app-hosting": 0,
    "cloud-run": 0,
    netlify: 0,
    render: 0,
    "fly-io": 0,
    railway: 0,
  };

  const serviceReasons: Record<ServiceId, string[]> = {
    "vercel-hobby": [],
    "vercel-pro": [],
    "cloudflare-workers": [],
    "aws-amplify": [],
    "firebase-app-hosting": [],
    "cloud-run": [],
    netlify: [],
    render: [],
    "fly-io": [],
    railway: [],
  };

  // 各質問の回答に対してスコアと理由を集計
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const optionIndex = answers[i];
    const option = question.options[optionIndex];
    if (!option) continue;

    const questionScores = scoreMatrix[question.id]?.[option.key];
    if (!questionScores) continue;

    for (const serviceId of Object.keys(scores) as ServiceId[]) {
      const score = questionScores[serviceId] ?? 0;
      scores[serviceId] += score;

      // スコア3の項目は理由テンプレートから理由を取得
      if (score === 3) {
        const reason = reasonTemplates[serviceId]?.[question.id]?.[option.key]?.[lang];
        if (reason) {
          serviceReasons[serviceId].push(reason);
        }
      }
    }
  }

  // リージョンスコア加算
  const regionScores = regionScoreMatrix[region];
  for (const serviceId of Object.keys(scores) as ServiceId[]) {
    scores[serviceId] += regionScores[serviceId] ?? 0;
  }

  // ランキング作成（スコア降順）
  const rankings: ServiceResult[] = (Object.keys(scores) as ServiceId[])
    .map((serviceId) => ({
      service: services[serviceId],
      score: scores[serviceId],
      reasons:
        serviceReasons[serviceId].length > 0
          ? serviceReasons[serviceId]
          : [defaultReasons[serviceId][lang]],
    }))
    .sort((a, b) => b.score - a.score);

  return { lang, region, answers, rankings };
}

/**
 * TOP3を返す（同点の場合は3位と同点のサービスもすべて含む）
 */
export function getTop3(rankings: ServiceResult[]): ServiceResult[] {
  if (rankings.length <= 3) return rankings;

  const thirdPlaceScore = rankings[2].score;
  return rankings.filter(
    (r, i) => i < 3 || r.score === thirdPlaceScore
  );
}
