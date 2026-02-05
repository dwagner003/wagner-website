import { SectionHeading } from '../ui';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Experience {
  title: string;
  company: string;
  period: string;
  highlights: string[];
  tech: string[];
}

const experiences: Experience[] = [
  {
    title: 'Senior Software Engineer',
    company: 'AbsenceSoft',
    period: 'Jun 2024 - Present',
    highlights: [
      'Architecting API layer serving 500+ enterprise clients with 99.9% uptime',
      'Own technical decisions for ONION architecture patterns across 3 product teams',
      'Built real-time monitoring dashboards that reduced incident response time by 60%',
    ],
    tech: ['C#', '.NET', 'Angular', 'DataDog', 'AWS'],
  },
  {
    title: 'Software Engineer',
    company: 'AbsenceSoft',
    period: 'Mar 2021 - Jun 2024',
    highlights: [
      'Shipped 15+ state-specific leave law features with zero compliance defects',
      'Reduced Angular page load times 40% through lazy loading and code splitting',
      'Designed RESTful APIs handling 10K+ daily requests for leave management workflows',
    ],
    tech: ['C#', '.NET', 'Angular', 'JavaScript', 'DataDog'],
  },
  {
    title: 'Integration Engineer',
    company: 'AbsenceSoft',
    period: 'Aug 2020 - Mar 2021',
    highlights: [
      'Built 20+ custom data integrations for enterprise HR systems (Workday, ADP, SAP)',
      'Created integration playbook that cut new hire onboarding time from 4 weeks to 2',
      'Mentored 5 engineers, with 2 promoted to senior roles within 18 months',
    ],
    tech: ['C#', '.NET', 'SQL'],
  },
  {
    title: 'Associate Software Developer',
    company: 'Billtrust',
    period: 'Jun 2018 - Aug 2020',
    highlights: [
      'Delivered invoice automation features used by 2,000+ B2B customers',
      'Reduced payment processing errors 25% through validation improvements',
      'Led intern program resulting in 2 full-time engineering hires',
    ],
    tech: ['C#', '.NET', 'JavaScript'],
  },
];

export function ExperienceSection() {
  const { ref, isVisible } = useIntersectionObserver(0.1);

  return (
    <section id="experience" className="py-24 px-6 bg-[var(--color-bg-secondary)]" ref={ref}>
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
                mb-12
                pl-8 md:pl-0
                transition-all duration-700
                ${isVisible
                  ? 'opacity-100 translate-x-0'
                  : `opacity-0 ${index % 2 === 0 ? '-translate-x-8' : 'translate-x-8'}`}
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
              <div className="bg-[var(--color-bg-card)] backdrop-blur-sm border border-[var(--color-neon-cyan)]/20 rounded-lg p-6 hover:border-[var(--color-neon-cyan)]/50 transition-colors">
                <h3 className="font-mono text-xl text-[var(--color-text-primary)] font-semibold">
                  {exp.title}
                </h3>
                <p className="font-mono text-[var(--color-neon-cyan)] mt-1">
                  {exp.company}
                </p>
                <p className="font-mono text-sm text-[var(--color-text-muted)] mt-1">
                  {exp.period}
                </p>

                <ul className="mt-4 space-y-2">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="text-[var(--color-text-secondary)] text-sm flex items-start gap-2">
                      <span className="text-[var(--color-terminal-green)]">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>

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
