interface SectionHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({ children, as: Component = 'h2' }: SectionHeadingProps) {
  return (
    <Component className="font-mono text-[var(--color-text-muted)] text-base sm:text-lg mb-6 sm:mb-8">
      <span className="text-[var(--color-neon-cyan)]">//</span> {children}
    </Component>
  );
}
