"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Terminal } from "@/components/Terminal";
import { TypingSequence } from "@/components/TypingText";
import { uiText } from "@/data/i18n";
import type { Lang, Region } from "@/types";

type Step = "intro" | "lang" | "region" | "ready";

const regions: Region[] = ["asia", "us", "eu", "global"];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetLang = (searchParams.get("l") === "ja" || searchParams.get("l") === "en")
    ? searchParams.get("l") as Lang
    : null;

  const skipped = !!presetLang;
  const [step, setStep] = useState<Step>(presetLang ? "region" : "intro");
  const [introReady, setIntroReady] = useState(skipped);
  const [lang, setLang] = useState<Lang | null>(presetLang);
  const [region, setRegion] = useState<Region | null>(null);
  const [langReady, setLangReady] = useState(skipped);
  const [regionReady, setRegionReady] = useState(false);
  const [readyReady, setReadyReady] = useState(false);

  const handleStart = useCallback(() => {
    if (!lang || !region) return;
    router.push(`/diagnose?l=${lang}&r=${region}`);
  }, [router, lang, region]);

  // キーボード入力
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (step === "intro" && introReady && e.key === "Enter") {
        setStep("lang");
        return;
      }

      if (step === "lang" && langReady) {
        if (e.key === "1") { setLang("ja"); setStep("region"); }
        if (e.key === "2") { setLang("en"); setStep("region"); }
        return;
      }

      if (step === "region" && lang && regionReady) {
        const idx = Number(e.key) - 1;
        if (idx >= 0 && idx < regions.length) {
          setRegion(regions[idx]);
          setStep("ready");
        }
        return;
      }

      if (step === "ready" && e.key === "Enter") {
        handleStart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, introReady, langReady, regionReady, lang, handleStart]);

  const t = lang ? uiText[lang] : null;

  return (
    <Terminal lang={lang ?? "ja"}>
      {/* Intro */}
      <div className="mb-8">
        <TypingSequence
          lines={[
            {
              text: "$ hostme",
              speed: 8,
              instant: skipped,
              cursor: false,
              className: "text-terminal-green/50 text-sm",
              wrapper: (c) => <p className="mb-4">{c}</p>,
            },
            {
              text: "7つの質問で、あなたに最適なホスティング先が見つかる",
              speed: 8,
              instant: skipped,
              className: "text-terminal-green text-lg",
              wrapper: (c) => <div className="mb-1"><span className="text-terminal-green/50">&gt; </span>{c}</div>,
            },
            {
              text: "Find your ideal hosting in 7 questions",
              speed: 8,
              instant: skipped,
              cursor: false,
              className: "text-terminal-green/70",
              wrapper: (c) => <div className="mb-4"><span className="text-terminal-green/50">&gt; </span>{c}</div>,
            },
          ]}
          onComplete={() => setIntroReady(true)}
        />
      </div>

      {introReady && step === "intro" && (
        <button
          onClick={() => setStep("lang")}
          className="block cursor-pointer text-left px-3 py-2 rounded transition-colors hover:bg-terminal-green/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green text-terminal-green/80 hover:text-terminal-green"
        >
          <TypingSequence lines={[{ text: "[Enter] Start", speed: 8, cursor: true }]} />
        </button>
      )}

      {/* Lang select */}
      {step !== "intro" && (
        <div className="mb-6">
          <TypingSequence
            lines={[
              {
                text: "$ hostme --lang",
                speed: 8,
                instant: skipped,
                cursor: false,
                className: "text-terminal-green/50 text-sm",
                wrapper: (c) => <p className="mb-3">{c}</p>,
              },
              {
                text: "[1] 日本語",
                speed: 8,
                instant: skipped,
                cursor: false,
                className: "text-terminal-green/80",
                wrapper: (c) => (
                  <button
                    onClick={() => { setLang("ja"); setStep("region"); }}
                    className={`block cursor-pointer text-left px-3 py-2 rounded transition-colors hover:bg-terminal-green/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green ${lang === "ja" ? "bg-terminal-green/10" : ""}`}
                  >{c}</button>
                ),
              },
              {
                text: "[2] English",
                speed: 8,
                instant: skipped,
                cursor: false,
                className: "text-terminal-green/80",
                wrapper: (c) => (
                  <button
                    onClick={() => { setLang("en"); setStep("region"); }}
                    className={`block cursor-pointer text-left px-3 py-2 rounded transition-colors hover:bg-terminal-green/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green ${lang === "en" ? "bg-terminal-green/10" : ""}`}
                  >{c}</button>
                ),
              },
            ]}
            onComplete={() => setLangReady(true)}
          />
        </div>
      )}

      {/* Region select */}
      {(step === "region" || step === "ready") && lang && t && (
        <div className="mb-6">
          <TypingSequence
            lines={[
              {
                text: `$ hostme --lang ${lang} --region`,
                speed: 8,
                cursor: false,
                className: "text-terminal-green/50 text-sm",
                wrapper: (c) => <p className="mb-3">{c}</p>,
              },
              {
                text: t.regionSelect,
                cursor: false,
                className: "text-terminal-green",
                wrapper: (c) => <p className="mb-3">{c}</p>,
              },
              ...regions.map((r, i) => ({
                text: `[${i + 1}] ${t.regions[r].label} (${t.regions[r].description})`,
                speed: 8,
                cursor: false,
                className: "text-terminal-green/80",
                wrapper: (c: React.ReactNode) => (
                  <button
                    onClick={() => { setRegion(r); setStep("ready"); }}
                    className={`block cursor-pointer text-left px-3 py-2 rounded transition-colors hover:bg-terminal-green/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green ${region === r ? "bg-terminal-green/10" : ""}`}
                  >{c}</button>
                ),
              })),
            ]}
            onComplete={() => setRegionReady(true)}
          />
        </div>
      )}

      {/* Ready to start */}
      {step === "ready" && lang && region && t && (
        <div>
          <TypingSequence
            lines={[
              {
                text: `$ hostme --lang ${lang} --region ${region} analyze`,
                speed: 8,
                cursor: false,
                className: "text-terminal-green/50 text-sm",
                wrapper: (c) => <p className="mb-3">{c}</p>,
              },
            ]}
            onComplete={() => setReadyReady(true)}
          />
          {readyReady && (
            <button
              onClick={handleStart}
              className="block cursor-pointer text-left px-3 py-2 rounded transition-colors hover:bg-terminal-green/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green text-terminal-green/80 hover:text-terminal-green"
            >
              <TypingSequence lines={[{ text: `[Enter] ${t.topStart}`, speed: 8, cursor: true }]} />
            </button>
          )}
        </div>
      )}
    </Terminal>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Terminal lang="ja"><p className="text-terminal-green/50">Loading...</p></Terminal>}>
      <HomeContent />
    </Suspense>
  );
}
