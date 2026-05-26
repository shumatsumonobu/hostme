"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Terminal } from "@/components/Terminal";
import { TypingText } from "@/components/TypingText";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionBlock } from "@/components/QuestionBlock";
import { questions } from "@/data/questions";
import { uiText } from "@/data/i18n";
import { encodeAnswers, parseLang, parseRegion } from "@/lib/validate";

function DiagnoseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = parseLang(searchParams.get("l"));
  const region = parseRegion(searchParams.get("r"));
  const t = uiText[lang];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [history, setHistory] = useState<{ questionIndex: number; answerIndex: number }[]>([]);
  const [phase, setPhase] = useState<"questions" | "loading" | "done">("questions");
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const intervalsRef = useRef<number[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentQ, loadingStep, progress]);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (phase !== "questions") return;

      const newAnswers = [...answers, optionIndex];
      const newHistory = [...history, { questionIndex: currentQ, answerIndex: optionIndex }];

      setAnswers(newAnswers);
      setHistory(newHistory);

      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        startLoading(newAnswers);
      }
    },
    [phase, answers, history, currentQ]
  );

  const handleBack = useCallback(() => {
    if (currentQ <= 0) return;
    setCurrentQ(currentQ - 1);
    setAnswers(answers.slice(0, -1));
    setHistory(history.slice(0, -1));
  }, [currentQ, answers, history]);

  useEffect(() => {
    if (phase !== "questions") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const question = questions[currentQ];
      const num = parseInt(e.key);
      if (num >= 1 && num <= question.options.length) {
        handleSelect(num - 1);
        return;
      }
      if (e.key === "Backspace" && currentQ > 0) {
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, currentQ, handleSelect, handleBack]);

  // タイマーのクリーンアップ
  useEffect(() => {
    return () => {
      for (const id of timersRef.current) clearTimeout(id);
      for (const id of intervalsRef.current) clearInterval(id);
      timersRef.current = [];
      intervalsRef.current = [];
    };
  }, []);

  const startLoading = (finalAnswers: number[]) => {
    setPhase("loading");

    let step = 0;
    const showNextStep = () => {
      if (step < 3) {
        setLoadingStep(step + 1);
        step++;
        timersRef.current.push(window.setTimeout(showNextStep, 500));
      } else {
        let p = 0;
        const progressInterval = window.setInterval(() => {
          p += 5;
          setProgress(p);
          if (p >= 100) {
            clearInterval(progressInterval);
            setPhase("done");
            router.push(`/result?l=${lang}&r=${region}&a=${encodeAnswers(finalAnswers)}`);
          }
        }, 30);
        intervalsRef.current.push(progressInterval);
      }
    };
    timersRef.current.push(window.setTimeout(showNextStep, 300));
  };

  return (
    <Terminal lang={lang}>
      {history.map((entry) => {
        const q = questions[entry.questionIndex];
        const opt = q.options[entry.answerIndex];
        return (
          <div key={entry.questionIndex} className="mb-4 opacity-50">
            <p className="text-terminal-green/50">
              [{entry.questionIndex + 1}/{questions.length}] {q.text[lang]}
            </p>
            <p className="text-terminal-green ml-2">
              → {opt.label[lang]}
            </p>
          </div>
        );
      })}

      {phase === "questions" && (
        <>
          <QuestionBlock
            key={currentQ}
            question={questions[currentQ]}
            index={currentQ}
            total={questions.length}
            lang={lang}
            onSelect={handleSelect}
          />
          {currentQ > 0 ? (
            <button
              onClick={handleBack}
              className="mt-4 text-terminal-green/30 hover:text-terminal-green/60 transition-colors cursor-pointer text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green"
            >
              {t.back}
            </button>
          ) : (
            <button
              onClick={() => router.push(`/?l=${lang}`)}
              className="mt-4 text-terminal-green/30 hover:text-terminal-green/60 transition-colors cursor-pointer text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green"
            >
              {t.home}
            </button>
          )}
        </>
      )}

      {phase === "loading" && (
        <div className="space-y-2">
          {loadingStep >= 1 && (
            <p className="text-terminal-green/70">
              <span className="text-terminal-green/50">&gt;</span>{" "}
              <TypingText text={t.analyzing} cursor={false} />
            </p>
          )}
          {loadingStep >= 2 && (
            <p className="text-terminal-green/70">
              <span className="text-terminal-green/50">&gt;</span>{" "}
              <TypingText text={t.comparing} cursor={false} />
            </p>
          )}
          {loadingStep >= 3 && (
            <p className="text-terminal-green/70">
              <span className="text-terminal-green/50">&gt;</span>{" "}
              <TypingText text={t.calculating} cursor={false} />
            </p>
          )}
          {progress > 0 && <ProgressBar progress={progress} />}
        </div>
      )}

      <div ref={bottomRef} />
    </Terminal>
  );
}

export default function DiagnosePage() {
  return (
    <Suspense fallback={null}>
      <DiagnoseContent />
    </Suspense>
  );
}
