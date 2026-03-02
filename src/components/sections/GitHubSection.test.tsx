import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubSection } from './GitHubSection';

const mockUseIntersectionObserver = vi.fn();

vi.mock('../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => mockUseIntersectionObserver(),
}));

const mockUseGitHubStats = vi.fn();
const mockUseGitHubRepos = vi.fn();

vi.mock('../../hooks/useGitHubStats', () => ({
  useGitHubStats: () => mockUseGitHubStats(),
  useGitHubRepos: () => mockUseGitHubRepos(),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('GitHubSection', () => {
  beforeEach(() => {
    mockUseIntersectionObserver.mockReturnValue({
      ref: { current: null },
      isVisible: true,
    });
    mockUseGitHubStats.mockReturnValue({ data: null, isLoading: true });
    mockUseGitHubRepos.mockReturnValue({ data: null, isLoading: true });
  });

  it('should render the section heading', () => {
    render(<GitHubSection />, { wrapper: TestWrapper });
    expect(screen.getByText('github_stats')).toBeInTheDocument();
  });

  it('should show skeleton loading for stats', () => {
    const { container } = render(<GitHubSection />, { wrapper: TestWrapper });
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });

  it('should show skeleton loading for repos', () => {
    const { container } = render(<GitHubSection />, { wrapper: TestWrapper });
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThanOrEqual(4);
  });

  it('should display stats when loaded', () => {
    mockUseGitHubStats.mockReturnValue({
      data: { publicRepos: 25, followers: 10, following: 5 },
      isLoading: false,
    });
    mockUseGitHubRepos.mockReturnValue({ data: [], isLoading: false });

    render(<GitHubSection />, { wrapper: TestWrapper });

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display fallback dashes when stats are null', () => {
    mockUseGitHubStats.mockReturnValue({ data: null, isLoading: false });
    mockUseGitHubRepos.mockReturnValue({ data: [], isLoading: false });

    render(<GitHubSection />, { wrapper: TestWrapper });

    const dashes = screen.getAllByText('--');
    expect(dashes).toHaveLength(3);
  });

  it('should display repos when loaded', () => {
    mockUseGitHubStats.mockReturnValue({
      data: { publicRepos: 2, followers: 0, following: 0 },
      isLoading: false,
    });
    mockUseGitHubRepos.mockReturnValue({
      data: [
        {
          name: 'my-project',
          description: 'A cool project',
          stargazers_count: 42,
          language: 'TypeScript',
          html_url: 'https://github.com/dwagner003/my-project',
        },
        {
          name: 'another-repo',
          description: null,
          stargazers_count: 0,
          language: null,
          html_url: 'https://github.com/dwagner003/another-repo',
        },
      ],
      isLoading: false,
    });

    render(<GitHubSection />, { wrapper: TestWrapper });

    expect(screen.getByText('my-project')).toBeInTheDocument();
    expect(screen.getByText('A cool project')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();

    expect(screen.getByText('another-repo')).toBeInTheDocument();
    // No description or language for second repo
    expect(screen.queryByText('null')).not.toBeInTheDocument();
  });

  it('should link repos to their GitHub URLs', () => {
    mockUseGitHubStats.mockReturnValue({
      data: { publicRepos: 1, followers: 0, following: 0 },
      isLoading: false,
    });
    mockUseGitHubRepos.mockReturnValue({
      data: [
        {
          name: 'test-repo',
          description: 'desc',
          stargazers_count: 1,
          language: 'JS',
          html_url: 'https://github.com/dwagner003/test-repo',
        },
      ],
      isLoading: false,
    });

    render(<GitHubSection />, { wrapper: TestWrapper });

    const link = screen.getByText('test-repo').closest('a');
    expect(link).toHaveAttribute('href', 'https://github.com/dwagner003/test-repo');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should apply hidden styles when not visible', () => {
    mockUseIntersectionObserver.mockReturnValue({
      ref: { current: null },
      isVisible: false,
    });
    mockUseGitHubStats.mockReturnValue({
      data: { publicRepos: 1, followers: 0, following: 0 },
      isLoading: false,
    });
    mockUseGitHubRepos.mockReturnValue({
      data: [
        {
          name: 'hidden-repo',
          description: 'desc',
          stargazers_count: 0,
          language: 'JS',
          html_url: 'https://github.com/dwagner003/hidden-repo',
        },
      ],
      isLoading: false,
    });

    const { container } = render(<GitHubSection />, { wrapper: TestWrapper });
    const hiddenElements = container.querySelectorAll('.opacity-0');
    // Both stat cards and repo cards should have opacity-0
    expect(hiddenElements.length).toBeGreaterThan(3);
  });

  it('should show stat labels when loaded', () => {
    mockUseGitHubStats.mockReturnValue({
      data: { publicRepos: 5, followers: 2, following: 1 },
      isLoading: false,
    });
    mockUseGitHubRepos.mockReturnValue({ data: [], isLoading: false });

    render(<GitHubSection />, { wrapper: TestWrapper });

    expect(screen.getByText('Repositories')).toBeInTheDocument();
    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('should show error message with profile link when stats fail', () => {
    mockUseGitHubStats.mockReturnValue({ data: null, isLoading: false, isError: true });
    mockUseGitHubRepos.mockReturnValue({ data: [], isLoading: false, isError: false });

    render(<GitHubSection />, { wrapper: TestWrapper });

    expect(screen.getByText('Unable to load GitHub stats.')).toBeInTheDocument();
    const profileLink = screen.getByText('View profile on GitHub');
    expect(profileLink).toHaveAttribute('href', 'https://github.com/dwagner003');
  });

  it('should show error message with repos link when repos fail', () => {
    mockUseGitHubStats.mockReturnValue({
      data: { publicRepos: 5, followers: 2, following: 1 },
      isLoading: false,
      isError: false,
    });
    mockUseGitHubRepos.mockReturnValue({ data: null, isLoading: false, isError: true });

    render(<GitHubSection />, { wrapper: TestWrapper });

    expect(screen.getByText('Unable to load repositories.')).toBeInTheDocument();
    const reposLink = screen.getByText('Browse repositories on GitHub');
    expect(reposLink).toHaveAttribute('href', 'https://github.com/dwagner003?tab=repositories');
  });

  it('should show stats numbers instead of dashes when data loads successfully', () => {
    mockUseGitHubStats.mockReturnValue({
      data: { publicRepos: 15, followers: 8, following: 3 },
      isLoading: false,
      isError: false,
    });
    mockUseGitHubRepos.mockReturnValue({ data: [], isLoading: false, isError: false });

    render(<GitHubSection />, { wrapper: TestWrapper });

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('--')).not.toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });
});
