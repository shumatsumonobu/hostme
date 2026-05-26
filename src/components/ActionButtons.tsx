"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { TypingText } from "@/components/TypingText";
import type { Lang } from "@/types";
import { uiText } from "@/data/i18n";

type ActionButtonsProps = {
  shareText: string;
  shareUrl: string;
  lang: Lang;
  answersParam?: string;
  region?: string;
};

export function ActionButtons({ shareText, shareUrl, lang, answersParam, region }: ActionButtonsProps) {
  const router = useRouter();
  const t = uiText[lang];

  const handleShare = useCallback(() => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareText, shareUrl]);

  const handleRetry = useCallback(() => {
    router.push(`/?l=${lang}`);
  }, [router, lang]);

  const handleAbout = useCallback(() => {
    const params = new URLSearchParams({ l: lang });
    if (answersParam) params.set("a", answersParam);
    if (region) params.set("r", region);
    router.push(`/about?${params.toString()}`);
  }, [router, lang, answersParam, region]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case "s":
          handleShare();
          break;
        case "r":
          handleRetry();
          break;
        case "?":
          handleAbout();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleShare, handleRetry, handleAbout]);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-4 text-terminal-green">
        <button
          onClick={handleShare}
          className="cursor-pointer hover:text-terminal-green/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green focus:text-terminal-green/60"
        >
          <TypingText text={`[s] ${t.shareOnX}`} cursor={false} speed={12} />
        </button>
        <button
          onClick={handleRetry}
          className="cursor-pointer hover:text-terminal-green/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green focus:text-terminal-green/60"
        >
          <TypingText text={`[r] ${t.tryAgain}`} cursor={false} speed={12} />
        </button>
        <button
          onClick={handleAbout}
          className="cursor-pointer hover:text-terminal-green/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green focus:text-terminal-green/60"
        >
          <TypingText text={`[?] ${t.howItWorks}`} cursor={false} speed={12} />
        </button>
      </div>
      <a
        href="https://x.com/shumatsumonobu"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-xs text-terminal-green/30 hover:text-terminal-green/60 transition-colors"
      >
        @shumatsumonobu
      </a>
    </div>
  );
}
