import { SectionHeading } from '../ui';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'cloud';
}

const skills: Skill[] = [
  { name: 'C#', icon: '⌘', category: 'backend' },
  { name: '.NET', icon: '◆', category: 'backend' },
  { name: 'Angular', icon: '△', category: 'frontend' },
  { name: 'React', icon: '⚛', category: 'frontend' },
  { name: 'MongoDB', icon: '◉', category: 'backend' },
  { name: 'NoSQL', icon: '▤', category: 'backend' },
  { name: 'AWS', icon: '☁', category: 'cloud' },
  { name: 'TypeScript', icon: 'TS', category: 'frontend' },
];

export function SkillsSection() {
  const { ref, isVisible } = useIntersectionObserver(0.2);

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading>tech_stack</SectionHeading>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className={`
                group
                bg-[var(--color-bg-card)]
                backdrop-blur-sm
                border border-[var(--color-neon-cyan)]/20
                rounded-lg
                p-6
                text-center
                transition-all
                duration-500
                hover:border-[var(--color-neon-cyan)]
                hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]
                ${isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {skill.icon}
              </div>
              <h3 className="font-mono text-[var(--color-text-primary)] font-medium">
                {skill.name}
              </h3>
              <span className="font-mono text-xs text-[var(--color-text-muted)] mt-2 block">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
