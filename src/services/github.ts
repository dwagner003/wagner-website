const GITHUB_USERNAME = 'dwagner003';
const CACHE_KEY_STATS = 'github-stats-cache';
const CACHE_KEY_REPOS = 'github-repos-cache';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage may be full or unavailable
  }
}

export async function fetchGitHubStats(): Promise<GitHubStats> {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!response.ok) throw new Error('Failed to fetch GitHub stats');
    const data = await response.json();
    const stats: GitHubStats = {
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
    };
    setCache(CACHE_KEY_STATS, stats);
    return stats;
  } catch (error) {
    const cached = getCache<GitHubStats>(CACHE_KEY_STATS);
    if (cached) return cached;
    throw error;
  }
}

export async function fetchPinnedRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&direction=desc&per_page=4`
    );
    if (!response.ok) throw new Error('Failed to fetch repos');
    const repos: GitHubRepo[] = await response.json();
    setCache(CACHE_KEY_REPOS, repos);
    return repos;
  } catch (error) {
    const cached = getCache<GitHubRepo[]>(CACHE_KEY_REPOS);
    if (cached) return cached;
    throw error;
  }
}
