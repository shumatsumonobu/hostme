"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import type { Lang } from "@/types";

type TerminalProps = {
  children: ReactNode;
  lang?: Lang;
};

export function Terminal({ children, lang }: TerminalProps) {
  useEffect(() => {
    if (lang) document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg border border-terminal-green/20 bg-terminal-bg shadow-2xl shadow-terminal-green/5">
        {/* タイトルバー */}
        <div className="flex items-center gap-2 border-b border-terminal-green/20 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-sm text-terminal-green/50">hostme</span>
        </div>
        {/* コンテンツ */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
