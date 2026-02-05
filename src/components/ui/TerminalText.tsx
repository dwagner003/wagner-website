interface TerminalTextProps {
  command: string;
  output?: string;
  showCursor?: boolean;
}

export function TerminalText({ command, output, showCursor = false }: TerminalTextProps) {
  return (
    <div className="font-mono">
      <div className="flex items-center gap-2">
        <span className="text-[var(--color-terminal-prompt)]">$</span>
        <span className="text-[var(--color-text-primary)]">{command}</span>
        {showCursor && !output && (
          <span className="animate-pulse text-[var(--color-terminal-green)]">_</span>
        )}
      </div>
      {output && (
        <div className="text-[var(--color-terminal-green)] mt-1 ml-4">
          {'>'} {output}
        </div>
      )}
    </div>
  );
}
