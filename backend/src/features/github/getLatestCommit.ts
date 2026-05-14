import { GITHUB_ACCESS_TOKEN } from "../../utils/assertEnv";

type GitHubUserResponse = {
  login?: string;
};

type GitHubEventCommit = {
  sha?: string;
  message?: string;
};

type GitHubPushEvent = {
  type?: string;
  public?: boolean;
  created_at?: string;
  repo?: {
    name?: string;
  };
  payload?: {
    head?: string;
    commits?: GitHubEventCommit[];
  };
};

export type LatestGitHubCommit = {
  message: string;
  repo: string;
  sha: string;
  committedAt: string;
  url: string | null;
  isPrivate: boolean;
};

const GITHUB_API_HEADERS = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: GITHUB_API_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

function isPushEvent(event: GitHubPushEvent): boolean {
  return event.type === "PushEvent";
}

function getLatestCommitFromPushEvent(
  event: GitHubPushEvent,
): LatestGitHubCommit | null {
  const repoName = event.repo?.name;
  const createdAt = event.created_at;
  const headSha = event.payload?.head;
  const commits = event.payload?.commits;

  if (!repoName || !createdAt || !headSha || !Array.isArray(commits)) {
    return null;
  }

  const matchingCommit =
    commits.find((commit) => commit.sha === headSha) ?? commits.at(-1);

  if (!matchingCommit?.sha || !matchingCommit.message) {
    return null;
  }

  const isPrivate = event.public === false;

  return {
    message: matchingCommit.message.split("\n")[0],
    repo: isPrivate ? "Private Repo" : repoName,
    sha: matchingCommit.sha.slice(0, 7),
    committedAt: createdAt,
    url: isPrivate
      ? null
      : `https://github.com/${repoName}/commit/${matchingCommit.sha}`,
    isPrivate,
  };
}

export async function getLatestCommit(): Promise<LatestGitHubCommit> {
  const currentUser = await fetchJson<GitHubUserResponse>(
    "https://api.github.com/user",
  );

  if (!currentUser.login) {
    throw new Error("GitHub user response did not include a login");
  }

  const events = await fetchJson<GitHubPushEvent[]>(
    `https://api.github.com/users/${currentUser.login}/events?per_page=100`,
  );

  const latestCommit = events
    .filter(isPushEvent)
    .map(getLatestCommitFromPushEvent)
    .find((commit) => commit !== null);

  if (!latestCommit) {
    throw new Error("No GitHub push events with commit data found");
  }

  return latestCommit;
}
