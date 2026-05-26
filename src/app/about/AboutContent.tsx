"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@/components/Terminal";
import { TypingText } from "@/components/TypingText";
import { scoreMatrix } from "@/data/scoring";
import { services, serviceIds } from "@/data/services";
import type { Lang, Question, ServiceId } from "@/types";
import type React from "react";

type TypingStep = {
  type: "typing";
  text: string;
  className?: string;
  wrapper?: (children: React.ReactNode) => React.ReactNode;
};

type StaticStep = {
  type: "static";
  render: React.ReactNode;
};

type Step = TypingStep | StaticStep;

type AboutContentProps = {
  lang: Lang;
  questions: Question[];
  answersParam?: string;
  regionParam?: string;
};

function ScoreTable({ question, lang }: { question: Question; lang: Lang }) {
  const isJa = lang === "ja";
  return (
    <div className="overflow-x-auto mb-6">
      <table className="text-xs text-terminal-green/60 w-full">
        <thead>
          <tr className="border-b border-terminal-green/20">
            <th className="text-left py-1 pr-2">
              {isJa ? "サービス" : "Service"}
            </th>
            {question.options.map((opt) => (
              <th key={opt.key} className="text-center py-1 px-1 min-w-[40px]">
                {opt.label[lang].split("（")[0].split("(")[0].slice(0, 10)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {serviceIds.map((sid) => (
            <tr key={sid} className="border-b border-terminal-green/10">
              <td className="py-1 pr-2 whitespace-nowrap">{services[sid].name}</td>
              {question.options.map((opt) => {
                const score = scoreMatrix[question.id]?.[opt.key]?.[sid as ServiceId] ?? 0;
                return (
                  <td
                    key={opt.key}
                    className={`text-center py-1 px-1 ${
                      score === 3
                        ? "text-terminal-green font-bold"
                        : score === 0
                          ? "text-red-400/60"
                          : ""
                    }`}
                  >
                    {score}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepRenderer({
  step,
  onComplete,
}: {
  step: Step;
  onComplete: () => void;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (step.type === "static" && !fired.current) {
      fired.current = true;
      onComplete();
    }
  }, [step.type, onComplete]);

  if (step.type === "static") {
    return <>{step.render}</>;
  }

  const inner = (
    <TypingText
      text={step.text}
      speed={8}
      cursor={false}
      className={step.className}
      onComplete={onComplete}
    />
  );

  return step.wrapper ? <>{step.wrapper(inner)}</> : inner;
}

export function AboutContent({ lang, questions, answersParam, regionParam }: AboutContentProps) {
  const isJa = lang === "ja";
  const resultUrl = answersParam
    ? `/result?l=${lang}&a=${answersParam}${regionParam ? `&r=${regionParam}` : ""}`
    : null;
  const [revealed, setRevealed] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const advance = () => setRevealed((prev) => prev + 1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [revealed]);

  const criteriaItems = isJa
    ? [
        "・ Webアプリ/サイトのホスティングに対応していること",
        "・ 個人開発者が現実的に使える料金体系であること",
        "・ 2026年時点でアクティブにメンテナンスされていること",
        "・ 一定の採用実績があること",
      ]
    : [
        "・ Supports web app/site hosting",
        "・ Affordable pricing for individual developers",
        "・ Actively maintained as of 2026",
        "・ Proven adoption track record",
      ];

  const steps: Step[] = [
    // h1
    {
      type: "typing",
      text: "$ hostme --explain",
      className: "text-terminal-green text-lg",
      wrapper: (c) => <h1 className="mb-6">{c}</h1>,
    },
    // Section 1: Scoring Logic
    {
      type: "typing",
      text: `# ${isJa ? "スコアリングロジック" : "Scoring Logic"}`,
      className: "text-terminal-green",
      wrapper: (c) => <h2 className="mb-3">{c}</h2>,
    },
    {
      type: "typing",
      text: isJa
        ? "7問の回答ごとに各サービスへスコア（0〜3）を加算。合計スコアの上位3サービスを表示します。同点の場合はすべて表示されます。"
        : "Each answer adds a score (0-3) to each service. The top 3 services by total score are shown. Ties are all displayed.",
      className: "text-terminal-green/70 text-sm",
      wrapper: (c) => <p className="mb-4">{c}</p>,
    },
    // Q1〜Q7: each has a heading + table
    ...questions.flatMap((q) => [
      {
        type: "typing" as const,
        text: `${q.id.toUpperCase()}: ${q.text[lang]}`,
        className: "text-terminal-green/80 text-sm",
        wrapper: (c: React.ReactNode) => <h3 className="mb-2">{c}</h3>,
      },
      {
        type: "static" as const,
        render: <ScoreTable key={q.id} question={q} lang={lang} />,
      },
    ]),
    // Section 2: Selection Criteria
    {
      type: "typing",
      text: `# ${isJa ? "対象サービスの選定基準" : "Service Selection Criteria"}`,
      className: "text-terminal-green",
      wrapper: (c) => <h2 className="mb-3 mt-8">{c}</h2>,
    },
    ...criteriaItems.map((item) => ({
      type: "typing" as const,
      text: item,
      className: "text-terminal-green/70 text-sm",
      wrapper: (c: React.ReactNode) => <p className="ml-2 mb-1">{c}</p>,
    })),
    // Section 3: Data Sources
    {
      type: "typing",
      text: `# ${isJa ? "情報ソース" : "Data Sources"}`,
      className: "text-terminal-green",
      wrapper: (c) => <h2 className="mb-3 mt-8">{c}</h2>,
    },
    {
      type: "typing",
      text: isJa
        ? "各サービスの料金・仕様は公式ドキュメントから確認しています。"
        : "Pricing and specs are verified from official documentation.",
      className: "text-terminal-green/70 text-sm",
      wrapper: (c) => <p className="mb-2">{c}</p>,
    },
    {
      type: "static",
      render: (
        <div className="text-terminal-green/60 text-xs space-y-1 ml-2 mb-8">
          {serviceIds.map((sid) => (
            <p key={sid}>
              {services[sid].name} — {isJa ? "最終確認" : "Last verified"}: {services[sid].lastVerified}
            </p>
          ))}
        </div>
      ),
    },
    // Section 4: Feedback
    // TODO: GitHub公開時にコメントアウトを解除
    // {
    //   type: "typing",
    //   text: `# ${isJa ? "フィードバック" : "Feedback"}`,
    //   className: "text-terminal-green",
    //   wrapper: (c) => <h2 className="mb-3">{c}</h2>,
    // },
    // {
    //   type: "typing",
    //   text: isJa ? "情報が古い？サービスを追加してほしい？" : "Outdated info? Want a service added?",
    //   className: "text-terminal-green/70 text-sm",
    //   wrapper: (c) => <p>{c}</p>,
    // },
    // {
    //   type: "static",
    //   render: (
    //     <a
    //       href="https://github.com/shumatsumonobu/hostme/issues"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="text-terminal-green hover:text-white transition-colors text-sm underline block mb-8"
    //     >
    //       → {isJa ? "GitHub Issueで報告する" : "Report on GitHub Issues"}
    //     </a>
    //   ),
    // },
    // Back links
    {
      type: "static",
      render: (
        <div className="mt-8 space-y-2">
          {resultUrl && (
            <a
              href={resultUrl}
              className="block text-terminal-green/50 hover:text-terminal-green transition-colors text-sm"
            >
              ← {isJa ? "結果に戻る" : "Back to result"}
            </a>
          )}
          <a
            href={`/?l=${lang}`}
            className="block text-terminal-green/50 hover:text-terminal-green transition-colors text-sm"
          >
            ← {isJa ? "トップに戻る" : "Back to top"}
          </a>
        </div>
      ),
    },
  ];

  return (
    <Terminal lang={lang}>
      {steps.map((step, i) =>
        i <= revealed ? (
          <StepRenderer
            key={i}
            step={step}
            onComplete={i === revealed ? advance : () => {}}
          />
        ) : null
      )}
      <div ref={bottomRef} />
    </Terminal>
  );
}
