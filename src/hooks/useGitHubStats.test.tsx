import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGitHubStats, useGitHubRepos } from './useGitHubStats';
import * as githubService from '../services/github';

// Mock the github service
vi.mock('../services/github', () => ({
  fetchGitHubStats: vi.fn(),
  fetchPinnedRepos: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGitHubStats', () => {
  it('should fetch GitHub stats', async () => {
    const mockStats = {
      publicRepos: 42,
      followers: 100,
      following: 50,
    };

    vi.mocked(githubService.fetchGitHubStats).mockResolvedValueOnce(mockStats);

    const { result } = renderHook(() => useGitHubStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockStats);
  });

  it('should handle fetch error', async () => {
    vi.mocked(githubService.fetchGitHubStats).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useGitHubStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('API Error');
  });
});

describe('useGitHubRepos', () => {
  it('should fetch GitHub repos', async () => {
    const mockRepos = [
      {
        name: 'repo1',
        description: 'A repo',
        stargazers_count: 10,
        language: 'TypeScript',
        html_url: 'https://github.com/user/repo1',
      },
    ];

    vi.mocked(githubService.fetchPinnedRepos).mockResolvedValueOnce(mockRepos);

    const { result } = renderHook(() => useGitHubRepos(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockRepos);
  });

  it('should handle fetch error', async () => {
    vi.mocked(githubService.fetchPinnedRepos).mockRejectedValueOnce(new Error('Repo Error'));

    const { result } = renderHook(() => useGitHubRepos(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Repo Error');
  });
});
