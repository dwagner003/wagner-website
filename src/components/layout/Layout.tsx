import type { ReactNode } from 'react';
import Navbar from './Navbar';
import { BackToTop } from '../ui';
import { useKonamiCode, useTheme } from '../../hooks';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { toggleTheme } = useTheme();
  useKonamiCode(toggleTheme);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-bg-secondary)] focus:text-[var(--color-neon-cyan)] focus:border focus:border-[var(--color-neon-cyan)] focus:rounded-md focus:font-mono focus:text-sm focus:outline-none"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <BackToTop />
    </div>
  );
}
