import { GitHubIcon, LinkedInIcon } from '../ui';

export function Footer() {
  return (
    <footer className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 border-t border-[var(--color-neon-cyan)]/10">
      <div className="max-w-6xl mx-auto text-center">
        <div className="font-mono text-sm sm:text-base text-[var(--color-text-muted)] mb-4 sm:mb-6">
          <span className="text-[var(--color-terminal-prompt)]">$</span> echo "Let's connect"
        </div>

        <div className="flex justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <a
            href="https://github.com/dwagner003"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all p-2"
            aria-label="GitHub"
          >
            <GitHubIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>
          <a
            href="https://www.linkedin.com/in/dtwagner55/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all p-2"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>
        </div>

        <div className="font-mono text-xs sm:text-sm text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Devin Wagner | Built with React + TypeScript
        </div>

        <div className="font-mono text-sm sm:text-base text-[var(--color-terminal-prompt)] mt-3 sm:mt-4">
          $ exit<span className="animate-pulse">_</span>
        </div>
      </div>
    </footer>
  );
}
