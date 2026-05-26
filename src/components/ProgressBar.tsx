"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  /** 0〜100 */
  progress: number;
  width?: number; // ブロック数
};

export function ProgressBar({ progress, width = 20 }: ProgressBarProps) {
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="text-terminal-green">
        {"█".repeat(filled)}
        {"░".repeat(empty)}
      </span>
      <span className="ml-2 text-terminal-green/70">{Math.round(progress)}%</span>
    </motion.div>
  );
}
