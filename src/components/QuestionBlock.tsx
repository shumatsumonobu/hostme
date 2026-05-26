"use client";

import { motion } from "framer-motion";
import { TypingSequence } from "@/components/TypingText";
import type { Lang, Question } from "@/types";

type QuestionBlockProps = {
  question: Question;
  index: number; // 0-based
  total: number;
  lang: Lang;
  onSelect: (optionIndex: number) => void;
};

export function QuestionBlock({
  question,
  index,
  total,
  lang,
  onSelect,
}: QuestionBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="radiogroup"
      aria-label={question.text[lang]}
    >
      <TypingSequence
        lines={[
          {
            text: question.text[lang],
            className: "text-terminal-green",
            wrapper: (c) => (
              <p className="mb-4">
                <span className="text-terminal-green/50">[{index + 1}/{total}]</span>{" "}{c}
              </p>
            ),
          },
          ...question.options.map((option, i) => ({
            text: `[${i + 1}] ${option.label[lang]}`,
            speed: 10,
            cursor: false,
            className: "text-terminal-green/80 group-hover:text-terminal-green group-focus:text-terminal-green transition-colors",
            wrapper: (c: React.ReactNode) => (
              <button
                role="radio"
                aria-checked={false}
                onClick={() => onSelect(i)}
                className="block group cursor-pointer text-left px-3 py-2 rounded transition-colors hover:bg-terminal-green/10 focus:bg-terminal-green/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green"
              >{c}</button>
            ),
          })),
        ]}
      />
    </motion.div>
  );
}
