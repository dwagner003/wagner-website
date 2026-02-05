import { useQuery } from '@tanstack/react-query';
import { fetchGitHubStats, fetchPinnedRepos } from '../services/github';

export function useGitHubStats() {
  return useQuery({
    queryKey: ['github-stats'],
    queryFn: fetchGitHubStats,
    staleTime: 1000 * 60 * 60,
  });
}

export function useGitHubRepos() {
  return useQuery({
    queryKey: ['github-repos'],
    queryFn: fetchPinnedRepos,
    staleTime: 1000 * 60 * 60,
  });
}
