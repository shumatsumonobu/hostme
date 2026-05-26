import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { calculateDiagnosis, getTop3 } from "@/lib/calc";
import { parseAnswers, parseLang, parseRegion, encodeAnswers } from "@/lib/validate";
import { generateShareText, getResultUrl } from "@/lib/share";
import { ResultContent } from "./ResultContent";

type Props = {
  searchParams: Promise<{ a?: string; l?: string; r?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { a, l, r } = await searchParams;
  const answers = parseAnswers(a ?? null);
  if (!answers) return {};

  const lang = parseLang(l ?? null);
  const region = parseRegion(r ?? null);
  const result = calculateDiagnosis(answers, lang, region);
  const top1 = result.rankings[0];
  const text = top1.service.text[lang];
  const param = encodeAnswers(answers);

  const title = lang === "ja"
    ? `${top1.service.name} がおすすめ — hostme`
    : `${top1.service.name} recommended — hostme`;
  const description = lang === "ja"
    ? `あなたにおすすめのホスティング: ${top1.service.name}（${text.annualCost}）`
    : `Recommended hosting: ${top1.service.name} (${text.annualCost})`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/ogp?l=${lang}&r=${region}&a=${param}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/ogp?l=${lang}&r=${region}&a=${param}`],
    },
  };
}

export default async function ResultPage({ searchParams }: Props) {
  const { a, l, r } = await searchParams;
  const lang = parseLang(l ?? null);
  const answers = parseAnswers(a ?? null);
  if (!answers) redirect(`/?l=${lang}`);
  const region = parseRegion(r ?? null);
  const result = calculateDiagnosis(answers, lang, region);
  const top3 = getTop3(result.rankings);
  const param = encodeAnswers(answers);
  const resultUrl = getResultUrl(param, lang, region);
  const shareText = generateShareText(top3[0], resultUrl, lang);

  return <ResultContent top3={top3} shareText={shareText} shareUrl={resultUrl} lang={lang} answersParam={param} region={region} />;
}
