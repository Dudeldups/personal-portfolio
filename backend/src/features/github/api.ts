import { GITHUB_ACCESS_TOKEN } from "../../utils/assertEnv";
import type {
  GitHubPushEvent,
  GitHubRepo,
  GitHubRepoCommit,
  GitHubUserResponse,
} from "./types";

const GITHUB_API_BASE_URL = "https://api.github.com";

const GITHUB_API_HEADERS = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

async function fetchGitHubJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: GITHUB_API_HEADERS,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `GitHub request failed with ${response.status}: ${errorText}`,
    );
  }

  return (await response.json()) as T;
}

export function getCurrentGitHubUser(): Promise<GitHubUserResponse> {
  return fetchGitHubJson<GitHubUserResponse>(`${GITHUB_API_BASE_URL}/user`);
}

export function getGitHubUserEvents(
  username: string,
  page: number,
): Promise<GitHubPushEvent[]> {
  return fetchGitHubJson<GitHubPushEvent[]>(
    `${GITHUB_API_BASE_URL}/users/${username}/events?per_page=100&page=${page}`,
  );
}

export function getGitHubUserRepositories(): Promise<GitHubRepo[]> {
  return fetchGitHubJson<GitHubRepo[]>(
    `${GITHUB_API_BASE_URL}/user/repos?sort=pushed&per_page=100`,
  );
}

export function getGitHubRepositoryCommits(
  owner: string,
  repoName: string,
  username: string,
): Promise<GitHubRepoCommit[]> {
  return fetchGitHubJson<GitHubRepoCommit[]>(
    `${GITHUB_API_BASE_URL}/repos/${owner}/${repoName}/commits?author=${username}&per_page=1`,
  );
}
