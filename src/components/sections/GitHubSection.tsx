import { SectionHeading } from '../ui';
import { useGitHubStats, useGitHubRepos } from '../../hooks/useGitHubStats';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { socialLinks } from '../../data/content';

function StatSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 sm:h-10 md:h-12 bg-[var(--color-neon-cyan)]/10 rounded w-16 mx-auto mb-2" />
      <div className="h-3 sm:h-4 bg-[var(--color-text-muted)]/10 rounded w-20 mx-auto" />
    </div>
  );
}

function RepoSkeleton() {
  return (
    <div className="bg-[var(--color-bg-card)] backdrop-blur-sm border border-[var(--color-neon-cyan)]/20 rounded-lg p-4 sm:p-6 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 sm:h-5 bg-[var(--color-text-muted)]/10 rounded w-32" />
        <div className="h-4 bg-[var(--color-text-muted)]/10 rounded w-8" />
      </div>
      <div className="h-3 sm:h-4 bg-[var(--color-text-muted)]/10 rounded w-full mb-2" />
      <div className="h-3 sm:h-4 bg-[var(--color-text-muted)]/10 rounded w-2/3 mb-3" />
      <div className="h-5 bg-[var(--color-neon-cyan)]/5 rounded w-16" />
    </div>
  );
}

export function GitHubSection() {
  const { ref, isVisible } = useIntersectionObserver(0.2);
  const { data: stats, isLoading: statsLoading, isError: statsError } = useGitHubStats();
  const { data: repos, isLoading: reposLoading, isError: reposError } = useGitHubRepos();

  return (
    <section id="github" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading>github_stats</SectionHeading>

        {/* Stats Grid */}
        {statsError ? (
          <div className="text-center mb-8 sm:mb-12">
            <p className="font-mono text-sm text-[var(--color-text-muted)]">
              Unable to load GitHub stats.{' '}
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-neon-cyan)] hover:underline"
              >
                View profile on GitHub
              </a>
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8 sm:mb-12"
            aria-busy={statsLoading}
          >
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
                  p-3 sm:p-4 md:p-6
                  text-center
                  transition-all duration-500
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {statsLoading ? (
                  <StatSkeleton />
                ) : (
                  <>
                    <div className="font-mono text-2xl sm:text-3xl md:text-4xl text-[var(--color-neon-cyan)] font-bold">
                      {stat.value}
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs md:text-sm text-[var(--color-text-muted)] mt-1 sm:mt-2">
                      {stat.label}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" aria-busy={reposLoading}>
          {reposError ? (
            <div className="col-span-2 text-center font-mono text-sm text-[var(--color-text-muted)]">
              Unable to load repositories.{' '}
              <a
                href={`${socialLinks.github}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-neon-cyan)] hover:underline"
              >
                Browse repositories on GitHub
              </a>
            </div>
          ) : reposLoading ? (
            <>
              <RepoSkeleton />
              <RepoSkeleton />
              <RepoSkeleton />
              <RepoSkeleton />
            </>
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
                  p-4 sm:p-6
                  transition-all duration-500
                  hover:border-[var(--color-neon-cyan)]
                  hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm sm:text-base text-[var(--color-text-primary)] font-medium truncate mr-2">
                    {repo.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[var(--color-text-muted)] flex-shrink-0">
                    <span>★</span>
                    <span className="font-mono text-xs sm:text-sm">{repo.stargazers_count}</span>
                  </div>
                </div>
                {repo.description && (
                  <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm mt-2 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                {repo.language && (
                  <span className="inline-block font-mono text-[10px] sm:text-xs px-2 py-1 mt-3 bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] rounded">
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
