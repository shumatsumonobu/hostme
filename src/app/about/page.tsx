import { AboutContent } from "./AboutContent";
import { questions } from "@/data/questions";
import { parseLang } from "@/lib/validate";

type Props = {
  searchParams: Promise<{ l?: string; a?: string; r?: string }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { l } = await searchParams;
  const lang = parseLang(l ?? null);
  return {
    title: lang === "ja" ? "仕組みを見る — hostme" : "How it works — hostme",
    description: lang === "ja"
      ? "hostmeのスコアリングロジック、対象サービスの選定基準、情報ソースを公開しています。"
      : "Scoring logic, service selection criteria, and data sources for hostme.",
  };
}

export default async function AboutPage({ searchParams }: Props) {
  const { l, a, r } = await searchParams;
  const lang = parseLang(l ?? null);

  return <AboutContent lang={lang} questions={questions} answersParam={a} regionParam={r} />;
}
