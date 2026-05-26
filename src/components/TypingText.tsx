"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type TypingTextProps = {
  text: string;
  speed?: number; // ms per character (overrides auto-speed)
  cursor?: boolean;
  onComplete?: () => void;
  className?: string;
  instant?: boolean; // skip animation entirely
};

function calcSpeed(text: string): number {
  const len = text.length;
  if (len <= 20) return 12;
  if (len <= 50) return 8;
  return 4;
}

// --- TypingSequence: 複数行を順次タイピング ---
export type SequenceLine = {
  text: string;
  speed?: number;
  cursor?: boolean;
  instant?: boolean;
  className?: string;
  /** 行の外側を包むラッパー。children にタイピング中のテキストが渡される */
  wrapper?: (children: React.ReactNode) => React.ReactNode;
};

type TypingSequenceProps = {
  lines: SequenceLine[];
  onComplete?: () => void;
  /** 完了した行のインデックス（外部から監視用） */
  onLineComplete?: (index: number) => void;
};

export function TypingSequence({ lines, onComplete, onLineComplete }: TypingSequenceProps) {
  const [currentLine, setCurrentLine] = useState(0);

  const handleLineComplete = (index: number) => {
    onLineComplete?.(index);
    if (index + 1 < lines.length) {
      setCurrentLine(index + 1);
    } else {
      onComplete?.();
    }
  };

  return (
    <>
      {lines.map((line, i) => {
        if (i > currentLine) return null;
        const typing = (
          <TypingText
            key={i}
            text={line.text}
            speed={line.speed}
            cursor={line.cursor ?? (i === currentLine)}
            className={line.className}
            instant={line.instant || i < currentLine}
            onComplete={() => handleLineComplete(i)}
          />
        );
        return line.wrapper ? <span key={i}>{line.wrapper(typing)}</span> : <span key={i}>{typing}</span>;
      })}
    </>
  );
}

// --- TypingText: 単一行タイピング ---
export function TypingText({
  text,
  speed,
  cursor = true,
  onComplete,
  className = "",
  instant = false,
}: TypingTextProps) {
  const resolvedSpeed = speed ?? calcSpeed(text);
  const [displayedLength, setDisplayedLength] = useState(instant ? text.length : 0);
  const [isComplete, setIsComplete] = useState(instant);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (instant) {
      setDisplayedLength(text.length);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }
    if (displayedLength < text.length) {
      const timer = setTimeout(() => {
        setDisplayedLength((prev) => prev + 1);
      }, resolvedSpeed);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      onCompleteRef.current?.();
    }
  }, [displayedLength, text.length, resolvedSpeed, instant]);

  return (
    <span className={className}>
      {text.slice(0, displayedLength)}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
          className="text-terminal-green"
        >
          █
        </motion.span>
      )}
    </span>
  );
}
