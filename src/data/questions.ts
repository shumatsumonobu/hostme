import type { Question } from "@/types";

export const questions: Question[] = [
  {
    id: "q1",
    text: { ja: "商用利用する？", en: "Commercial use?" },
    options: [
      { key: "no", label: { ja: "しない", en: "No" } },
      { key: "yes", label: { ja: "する / するかも", en: "Yes / Maybe" } },
    ],
  },
  {
    id: "q2",
    text: { ja: "月額予算は？", en: "Monthly budget?" },
    options: [
      { key: "free", label: { ja: "無料がいい", en: "Free only" } },
      { key: "5usd", label: { ja: "$5程度ならOK", en: "~$5/mo is fine" } },
      { key: "20usd", label: { ja: "$20程度まで出せる", en: "Up to ~$20/mo" } },
    ],
  },
  {
    id: "q3",
    text: { ja: "セットアップの手間は？", en: "Setup complexity?" },
    options: [
      { key: "easy", label: { ja: "とにかく簡単がいい（git pushだけで動く）", en: "As easy as possible (git push to deploy)" } },
      { key: "moderate", label: { ja: "多少の設定は許容", en: "Some config is OK" } },
      { key: "docker", label: { ja: "インフラ得意、Dockerも使える", en: "Infra-savvy, Docker is fine" } },
    ],
  },
  {
    id: "q4",
    text: { ja: "従量課金のリスクは？", en: "Pay-as-you-go risk?" },
    options: [
      { key: "avoid", label: { ja: "絶対避けたい（予測できる料金がいい）", en: "Avoid (predictable billing preferred)" } },
      { key: "small-ok", label: { ja: "少額なら許容", en: "Small amounts OK" } },
      { key: "no-concern", label: { ja: "気にしない", en: "No concern" } },
    ],
  },
  {
    id: "q5",
    text: { ja: "メインで使うフレームワークは？", en: "Main framework?" },
    options: [
      { key: "nextjs", label: { ja: "Next.js", en: "Next.js" } },
      { key: "nuxt-vue", label: { ja: "Nuxt / Vue", en: "Nuxt / Vue" } },
      { key: "ssg", label: { ja: "Astro / その他SSG", en: "Astro / other SSG" } },
      { key: "undecided", label: { ja: "特に決めていない", en: "Not decided yet" } },
    ],
  },
  {
    id: "q6",
    text: { ja: "想定トラフィックは？", en: "Expected traffic?" },
    options: [
      { key: "personal", label: { ja: "個人レベル（月数千PV）", en: "Personal (~1K PV/mo)" } },
      { key: "medium", label: { ja: "中規模（月数万PV）", en: "Medium (~10K PV/mo)" } },
      { key: "large", label: { ja: "大規模（月10万PV以上）", en: "Large (100K+ PV/mo)" } },
    ],
  },
  {
    id: "q7",
    text: { ja: "普段使っているクラウドは？", en: "Current cloud provider?" },
    options: [
      { key: "aws", label: { ja: "AWS", en: "AWS" } },
      { key: "google", label: { ja: "Google Cloud / Firebase", en: "Google Cloud / Firebase" } },
      { key: "cloudflare", label: { ja: "Cloudflare", en: "Cloudflare" } },
      { key: "none", label: { ja: "特にない / これから選ぶ", en: "None / deciding" } },
    ],
  },
];
