import { useTypingAnimation } from '../../hooks';

const terminalLines = [
  { command: 'whoami', output: 'Devin Wagner' },
  { command: 'cat role.txt', output: 'Full Stack Software Engineer' },
  { command: 'ls skills/', output: 'C#  .NET  Angular  React  MongoDB  AWS' },
  { command: 'cat status.txt', output: 'Building great software in Denver, CO' },
];

export function HeroSection() {
  const { displayedLines, isComplete, currentLineIndex } = useTypingAnimation(terminalLines, 40);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16 sm:py-0"
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]" />

      {/* Terminal window */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-neon-cyan)]/20 shadow-[0_0_50px_rgba(0,245,255,0.1)] overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-[var(--color-bg-primary)] border-b border-[var(--color-neon-cyan)]/20">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
            <span className="ml-2 sm:ml-4 font-mono text-xs sm:text-sm text-[var(--color-text-muted)]">
              ~/devin-wagner
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed">
            {displayedLines.map((line, index) => (
              <div key={index} className="mb-3 sm:mb-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[var(--color-terminal-prompt)]">$</span>
                  <span className="text-[var(--color-text-primary)]">{line.command}</span>
                  {index === currentLineIndex && !line.complete && (
                    <span className="animate-pulse text-[var(--color-terminal-green)]">_</span>
                  )}
                </div>
                {line.output && (
                  <div className="text-[var(--color-terminal-green)] mt-1 ml-3 sm:ml-4 break-words">
                    {'>'} {line.output}
                  </div>
                )}
              </div>
            ))}
            {isComplete && (
              <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                <span className="text-[var(--color-terminal-prompt)]">$</span>
                <span className="animate-pulse text-[var(--color-terminal-green)]">_</span>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 text-[var(--color-text-muted)] animate-bounce">
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span className="font-mono text-[10px] sm:text-xs">scroll to explore</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
