"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal } from "@/components/Terminal";
import { TypingSequence } from "@/components/TypingText";

export default function NotFound() {
  const [done, setDone] = useState(false);

  return (
    <Terminal>
      <TypingSequence
        lines={[
          {
            text: "$ command not found",
            className: "text-red-400",
            wrapper: (c) => <p className="mb-2">{c}</p>,
          },
          {
            text: "404 — ページが見つかりません / Page not found",
            className: "text-terminal-green/70",
            cursor: false,
            wrapper: (c) => <p className="mb-6">{c}</p>,
          },
        ]}
        onComplete={() => setDone(true)}
      />
      {done && (
        <Link
          href="/"
          className="text-terminal-green hover:text-white transition-colors"
        >
          <TypingSequence lines={[{ text: "[Enter] cd ~", speed: 8, cursor: true }]} />
        </Link>
      )}
    </Terminal>
  );
}
