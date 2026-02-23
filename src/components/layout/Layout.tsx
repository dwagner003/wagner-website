import type { ReactNode } from 'react';
import Navbar from './Navbar';
import { useKonamiCode, useTheme } from '../../hooks';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { toggleTheme } = useTheme();
  useKonamiCode(toggleTheme);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
