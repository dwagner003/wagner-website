import { SectionHeading } from '../ui';
import { useGitHubStats, useGitHubRepos } from '../../hooks/useGitHubStats';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export function GitHubSection() {
  const { ref, isVisible } = useIntersectionObserver(0.2);
  const { data: stats, isLoading: statsLoading } = useGitHubStats();
  const { data: repos, isLoading: reposLoading } = useGitHubRepos();

  return (
    <section id="github" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading>github_stats</SectionHeading>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {[
            { label: 'Repositories', value: stats?.publicRepos ?? '--' },
            { label: 'Followers', value: stats?.followers ?? '--' },
            { label: 'Following', value: stats?.following ?? '--' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`
                bg-[var(--color-bg-card)]
                backdrop-blur-sm
                border border-[var(--color-neon-cyan)]/20
                rounded-lg
                p-6
                text-center
                transition-all duration-500
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="font-mono text-4xl text-[var(--color-neon-cyan)] font-bold">
                {statsLoading ? '...' : stat.value}
              </div>
              <div className="font-mono text-sm text-[var(--color-text-muted)] mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reposLoading ? (
            <div className="col-span-2 text-center text-[var(--color-text-muted)]">
              Loading repositories...
            </div>
          ) : (
            repos?.map((repo, index) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  block
                  bg-[var(--color-bg-card)]
                  backdrop-blur-sm
                  border border-[var(--color-neon-cyan)]/20
                  rounded-lg
                  p-6
                  transition-all duration-500
                  hover:border-[var(--color-neon-cyan)]
                  hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[var(--color-text-primary)] font-medium">
                    {repo.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                    <span>★</span>
                    <span className="font-mono text-sm">{repo.stargazers_count}</span>
                  </div>
                </div>
                {repo.description && (
                  <p className="text-[var(--color-text-secondary)] text-sm mt-2 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                {repo.language && (
                  <span className="inline-block font-mono text-xs px-2 py-1 mt-3 bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] rounded">
                    {repo.language}
                  </span>
                )}
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
