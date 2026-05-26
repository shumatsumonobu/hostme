import type { Lang, Region, ServiceResult } from "@/types";

const SITE_URL = "https://hostme.dev";

export function generateShareText(top1: ServiceResult, resultUrl: string, lang: Lang = "ja"): string {
  const text = top1.service.text[lang];

  if (lang === "en") {
    return [
      "$ hostme analyze",
      `✔ Deploy target: ${top1.service.name}`,
      `  ${text.annualCost}, ${top1.service.commercial ? "commercial OK" : "perfect for personal projects"}`,
      "",
      `→ ${resultUrl}`,
    ].join("\n");
  }

  return [
    "$ hostme analyze",
    `✔ Deploy target: ${top1.service.name}`,
    `  ${text.annualCost}で${top1.service.commercial ? "商用利用OK" : "個人開発に最適"}、なるほど`,
    "",
    `→ ${resultUrl}`,
  ].join("\n");
}

export function getResultUrl(answersParam: string, lang: Lang = "ja", region: Region = "global"): string {
  return `${SITE_URL}/result?l=${lang}&r=${region}&a=${answersParam}`;
}
