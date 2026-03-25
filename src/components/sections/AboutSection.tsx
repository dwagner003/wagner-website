import { SectionHeading } from '../ui';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { aboutBio } from '../../data/content';

export function AboutSection() {
  const { ref, isVisible } = useIntersectionObserver(0.2);

  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <SectionHeading>about_me</SectionHeading>

        <div
          className={`
            bg-[var(--color-bg-card)]
            backdrop-blur-sm
            border border-[var(--color-neon-cyan)]/20
            rounded-lg
            p-6 sm:p-8
            transition-all duration-700
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <div className="font-mono text-sm sm:text-base leading-relaxed">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--color-terminal-prompt)]">$</span>
              <span className="text-[var(--color-text-primary)]">cat about.md</span>
            </div>

            <p className="text-[var(--color-neon-cyan)] text-lg sm:text-xl font-semibold mb-4 ml-3 sm:ml-4">
              {aboutBio.greeting}
            </p>

            {aboutBio.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[var(--color-text-secondary)] mb-4 last:mb-0 ml-3 sm:ml-4"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
