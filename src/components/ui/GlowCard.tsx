interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'green' | 'purple';
}

export function GlowCard({ children, className = '', glowColor = 'cyan' }: GlowCardProps) {
  const glowStyles = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] border-[var(--color-neon-cyan)]',
    green: 'hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] border-[var(--color-neon-green)]',
    purple: 'hover:shadow-[0_0_30px_rgba(191,0,255,0.3)] border-[var(--color-neon-purple)]',
  };

  return (
    <div
      className={`
        bg-[var(--color-bg-card)]
        backdrop-blur-sm
        border
        border-opacity-20
        rounded-lg
        p-6
        transition-all
        duration-300
        ${glowStyles[glowColor]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
