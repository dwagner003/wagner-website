import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGitHubStats, fetchPinnedRepos } from './github';

describe('github service', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('fetchGitHubStats', () => {
    it('should fetch and return GitHub stats', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            public_repos: 42,
            followers: 100,
            following: 50,
          }),
      });

      const result = await fetchGitHubStats();

      expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/users/dwagner003');
      expect(result).toEqual({
        publicRepos: 42,
        followers: 100,
        following: 50,
      });
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchGitHubStats()).rejects.toThrow('Failed to fetch GitHub stats');
    });
  });

  describe('fetchPinnedRepos', () => {
    it('should fetch and return repos', async () => {
      const mockRepos = [
        {
          name: 'repo1',
          description: 'A cool repo',
          stargazers_count: 10,
          language: 'TypeScript',
          html_url: 'https://github.com/dwagner003/repo1',
        },
        {
          name: 'repo2',
          description: null,
          stargazers_count: 5,
          language: 'JavaScript',
          html_url: 'https://github.com/dwagner003/repo2',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRepos),
      });

      const result = await fetchPinnedRepos();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/users/dwagner003/repos?sort=updated&per_page=4'
      );
      expect(result).toEqual(mockRepos);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchPinnedRepos()).rejects.toThrow('Failed to fetch repos');
    });
  });
});
