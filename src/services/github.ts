const GITHUB_USERNAME = 'dwagner003';

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export async function fetchGitHubStats(): Promise<GitHubStats> {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
  if (!response.ok) throw new Error('Failed to fetch GitHub stats');
  const data = await response.json();
  return {
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
  };
}

export async function fetchPinnedRepos(): Promise<GitHubRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=4`
  );
  if (!response.ok) throw new Error('Failed to fetch repos');
  return response.json();
}
