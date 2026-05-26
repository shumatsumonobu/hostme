"use client";

import { useState } from "react";
import { Terminal } from "@/components/Terminal";
import { TypingSequence } from "@/components/TypingText";
import type { SequenceLine } from "@/components/TypingText";
import { ActionButtons } from "@/components/ActionButtons";
import { uiText } from "@/data/i18n";
import type { Lang, ServiceResult } from "@/types";

type ResultContentProps = {
  top3: ServiceResult[];
  shareText: string;
  shareUrl: string;
  lang: Lang;
  answersParam: string;
  region: string;
};

export function ResultContent({ top3, shareText, shareUrl, lang, answersParam, region }: ResultContentProps) {
  const t = uiText[lang];
  const [done, setDone] = useState(false);
  const sep = lang === "ja" ? "、" : ", ";

  const lines: SequenceLine[] = [
    {
      text: "$ hostme --explain",
      speed: 3,
      cursor: false,
      className: "text-terminal-green/50 text-sm",
      wrapper: (c) => <p className="mb-4">{c}</p>,
    },
    {
      text: t.deployFound,
      speed: 3,
      cursor: false,
      className: "text-terminal-green",
      wrapper: (c) => <p className="mb-4">{c}</p>,
    },
  ];

  for (let i = 0; i < top3.length; i++) {
    const { service, reasons } = top3[i];
    const text = service.text[lang];
    const rank = i + 1;

    if (rank === 1) {
      lines.push(
        {
          text: "━━━━━━━━━━━━━━━━━━━━━━━━",
          instant: true,
          cursor: false,
          className: "text-terminal-green",
          wrapper: (c) => <p>{c}</p>,
        },
        {
          text: `  #1  ${service.name}`,
          speed: 3,
          cursor: false,
          className: "text-terminal-green text-lg font-bold",
          wrapper: (c) => <p>{c}</p>,
        },
        {
          text: `  → ${service.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}`,
          instant: true,
          cursor: false,
          className: "text-terminal-green/50",
          wrapper: (c) => <p><a href={service.url} target="_blank" rel="noopener noreferrer" className="hover:text-terminal-green underline transition-colors">{c}</a></p>,
        },
        {
          text: "━━━━━━━━━━━━━━━━━━━━━━━━",
          instant: true,
          cursor: false,
          className: "text-terminal-green",
          wrapper: (c) => <p className="mb-2">{c}</p>,
        },
        {
          text: `${t.annualCost}    ${text.annualCost}`,
          speed: 3,
          cursor: false,
          className: "text-terminal-green/80",
          wrapper: (c) => <p className="ml-2">{c}</p>,
        },
        {
          text: `${t.commercial}    ${service.commercial ? t.commercialOk : t.commercialNo}`,
          speed: 3,
          cursor: false,
          className: "text-terminal-green/80",
          wrapper: (c) => <p className="ml-2">{c}</p>,
        },
        {
          text: `${t.migrationDifficulty}  ${text.migrationDifficulty}`,
          speed: 3,
          cursor: false,
          className: "text-terminal-green/80",
          wrapper: (c) => <p className="ml-2">{c}</p>,
        },
        {
          text: `${t.scaleCost}    ${text.scaleCost}`,
          speed: 3,
          cursor: false,
          className: "text-terminal-green/80",
          wrapper: (c) => <p className="ml-2">{c}</p>,
        },
        {
          text: `${t.reason}: ${reasons.join(sep)}`,
          speed: 3,
          cursor: false,
          className: "text-terminal-green/80",
          wrapper: (c) => <p className="ml-2 mt-3 mb-4">{c}</p>,
        },
      );
    } else {
      lines.push(
        {
          text: `  #${rank}  ${service.name}    ${text.annualCost}`,
          speed: 3,
          cursor: false,
          className: "text-terminal-green/70",
          wrapper: (c) => <p>{c}</p>,
        },
        {
          text: `       → ${service.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}`,
          instant: true,
          cursor: false,
          className: "text-terminal-green/40",
          wrapper: (c) => <p><a href={service.url} target="_blank" rel="noopener noreferrer" className="hover:text-terminal-green underline transition-colors">{c}</a></p>,
        },
      );
    }
  }

  return (
    <Terminal lang={lang}>
      <TypingSequence lines={lines} onComplete={() => setDone(true)} />
      {done && (
        <ActionButtons shareText={shareText} shareUrl={shareUrl} lang={lang} answersParam={answersParam} region={region} />
      )}
    </Terminal>
  );
}
