import { SectionHeading } from '../ui';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { experiences } from '../../data/content';

export function ExperienceSection() {
  const { ref, isVisible } = useIntersectionObserver(0.1);

  return (
    <section
      id="experience"
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[var(--color-bg-secondary)]"
      ref={ref}
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading>experience</SectionHeading>

        <div className="relative">
          {/* Timeline line */}
          <div
            className={`
              absolute left-0 md:left-1/2 top-0 bottom-0 w-px
              bg-gradient-to-b from-[var(--color-neon-cyan)] to-transparent
              transition-all duration-1000
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`
                relative
                md:w-1/2
                ${index % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}
                mb-8 sm:mb-12
                pl-6 sm:pl-8 md:pl-0
                transition-all duration-700
                ${
                  isVisible
                    ? 'opacity-100 translate-x-0'
                    : `opacity-0 ${index % 2 === 0 ? '-translate-x-8' : 'translate-x-8'}`
                }
              `}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Timeline dot */}
              <div
                className={`
                  absolute
                  left-0 md:left-auto
                  ${index % 2 === 0 ? 'md:right-0 md:translate-x-1/2' : 'md:left-0 md:-translate-x-1/2'}
                  top-0
                  w-4 h-4
                  bg-[var(--color-neon-cyan)]
                  rounded-full
                  shadow-[0_0_20px_var(--color-neon-cyan)]
                  -translate-x-1/2 md:translate-x-0
                `}
              />

              {/* Card */}
              <div className="bg-[var(--color-bg-card)] backdrop-blur-sm border border-[var(--color-neon-cyan)]/20 rounded-lg p-4 sm:p-6 hover:border-[var(--color-neon-cyan)]/50 transition-colors">
                <h3 className="font-mono text-base sm:text-lg md:text-xl text-[var(--color-text-primary)] font-semibold">
                  {exp.title}
                </h3>
                <p className="font-mono text-sm sm:text-base text-[var(--color-neon-cyan)] mt-1">
                  {exp.company}
                </p>
                <p className="font-mono text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                  {exp.period}
                </p>

                {exp.highlights.length > 0 && (
                  <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                    {exp.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="text-[var(--color-text-secondary)] text-xs sm:text-sm flex items-start gap-2"
                      >
                        <span className="text-[var(--color-terminal-green)]">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2 py-1 bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
