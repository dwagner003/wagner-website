import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGitHubStats, fetchPinnedRepos } from './github';

describe('github service', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    localStorage.clear();
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
        'https://api.github.com/users/dwagner003/repos?sort=stars&direction=desc&per_page=4'
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

  describe('localStorage caching', () => {
    it('should cache stats in localStorage on successful fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ public_repos: 10, followers: 5, following: 3 }),
      });

      await fetchGitHubStats();

      const cached = JSON.parse(localStorage.getItem('github-stats-cache')!);
      expect(cached.data).toEqual({ publicRepos: 10, followers: 5, following: 3 });
    });

    it('should return cached stats when API fails', async () => {
      localStorage.setItem(
        'github-stats-cache',
        JSON.stringify({
          data: { publicRepos: 10, followers: 5, following: 3 },
          timestamp: Date.now(),
        })
      );

      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });

      const result = await fetchGitHubStats();
      expect(result).toEqual({ publicRepos: 10, followers: 5, following: 3 });
    });

    it('should return cached repos when API fails', async () => {
      const mockRepos = [
        {
          name: 'cached-repo',
          description: null,
          stargazers_count: 0,
          language: null,
          html_url: 'https://github.com/dwagner003/cached-repo',
        },
      ];
      localStorage.setItem(
        'github-repos-cache',
        JSON.stringify({ data: mockRepos, timestamp: Date.now() })
      );

      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });

      const result = await fetchPinnedRepos();
      expect(result).toEqual(mockRepos);
    });

    it('should throw when API fails and cache is expired', async () => {
      localStorage.setItem(
        'github-stats-cache',
        JSON.stringify({
          data: { publicRepos: 10, followers: 5, following: 3 },
          timestamp: Date.now() - 1000 * 60 * 60 * 25,
        })
      );

      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });

      await expect(fetchGitHubStats()).rejects.toThrow('Failed to fetch GitHub stats');
    });
  });
});
