import type { Metadata } from "next";
import { parseLang } from "@/lib/validate";
import { LpContent } from "./LpContent";

type Props = {
  searchParams: Promise<{ l?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { l } = await searchParams;
  const lang = parseLang(l ?? "en");

  const title = lang === "ja"
    ? "hostme — 30秒で最適なホスティングが見つかる"
    : "hostme — Find your ideal hosting in 30 seconds";
  const description = lang === "ja"
    ? "7つの質問に答えるだけ。10サービスを比較してTOP3を提案するターミナル風診断ツール。"
    : "Answer 7 questions. Compare 10 hosting services and get your TOP 3 recommendations.";

  const ogpUrl = `/lp/ogp?l=${lang}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogpUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogpUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function LpPage({ searchParams }: Props) {
  const { l } = await searchParams;
  const lang = parseLang(l ?? "en");
  return <LpContent lang={lang} />;
}
