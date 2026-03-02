import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-mono text-6xl sm:text-8xl font-bold text-[var(--color-neon-cyan)] mb-4">
          404
        </div>
        <div className="font-mono text-sm sm:text-base text-[var(--color-text-muted)] mb-2">
          <span className="text-[var(--color-terminal-prompt)]">$</span> cd /page-not-found
        </div>
        <div className="font-mono text-sm sm:text-base text-red-400 mb-8">
          bash: cd: /page-not-found: No such file or directory
        </div>
        <Link
          to="/"
          className="font-mono text-sm px-6 py-3 border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] rounded hover:bg-[var(--color-neon-cyan)]/10 transition-colors"
        >
          cd ~
        </Link>
      </div>
    </div>
  );
}
