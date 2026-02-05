import { useState, useEffect, useMemo } from 'react';

interface TypedLine {
  command: string;
  output: string;
  delay?: number;
}

export function useTypingAnimation(lines: TypedLine[], typingSpeed = 50) {
  const [displayedLines, setDisplayedLines] = useState<{ command: string; output: string; complete: boolean }[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingCommand, setIsTypingCommand] = useState(true);

  // Derive isComplete from state instead of setting it in an effect
  const isComplete = useMemo(() => currentLineIndex >= lines.length, [currentLineIndex, lines.length]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      return;
    }

    const currentLine = lines[currentLineIndex];
    const targetText = isTypingCommand ? currentLine.command : currentLine.output;

    if (currentCharIndex < targetText.length) {
      const timeout = setTimeout(() => {
        if (isTypingCommand) {
          setDisplayedLines((prev) => {
            const updated = [...prev];
            if (!updated[currentLineIndex]) {
              updated[currentLineIndex] = { command: '', output: '', complete: false };
            }
            updated[currentLineIndex].command = targetText.slice(0, currentCharIndex + 1);
            return updated;
          });
        } else {
          setDisplayedLines((prev) => {
            const updated = [...prev];
            updated[currentLineIndex].output = targetText.slice(0, currentCharIndex + 1);
            return updated;
          });
        }
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (isTypingCommand) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLineIndex].output = currentLine.output;
          updated[currentLineIndex].complete = true;
          return updated;
        });
        setIsTypingCommand(false);
        setCurrentCharIndex(0);
      }, 300);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
        setIsTypingCommand(true);
      }, currentLine.delay || 500);

      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, isTypingCommand, lines, typingSpeed]);

  return { displayedLines, isComplete, currentLineIndex };
}
