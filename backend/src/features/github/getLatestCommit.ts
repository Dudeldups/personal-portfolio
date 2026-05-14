import { GITHUB_ACCESS_TOKEN } from "../../utils/assertEnv";

type GitHubUserResponse = {
  login?: string;
};

type GitHubRepo = {
  full_name?: string;
  private?: boolean;
  pushed_at?: string;
  owner?: {
    login?: string;
  };
  name?: string;
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
    const errorText = await response.text();

    throw new Error(
      `GitHub request failed with ${response.status}: ${errorText}`,
    );
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

type GitHubRepoCommit = {
  sha?: string;
  html_url?: string;
  commit?: {
    message?: string;
    author?: {
      date?: string;
    };
    committer?: {
      date?: string;
    };
  };
  author?: {
    login?: string;
  } | null;
  committer?: {
    login?: string;
  } | null;
};

function normalizeRepoCommit(
  repo: GitHubRepo,
  commit: GitHubRepoCommit,
): LatestGitHubCommit | null {
  const repoName = repo.full_name;
  const isPrivate = repo.private === true;
  const message = commit.commit?.message?.split("\n")[0];
  const committedAt = commit.commit?.author?.date ?? commit.commit?.committer?.date;
  const sha = commit.sha;

  if (!repoName || !message || !committedAt || !sha) {
    return null;
  }

  return {
    message,
    repo: isPrivate ? "Private Repo" : repoName,
    sha: sha.slice(0, 7),
    committedAt,
    url: isPrivate ? null : commit.html_url ?? null,
    isPrivate,
  };
}

async function findLatestCommitFromRepositories(
  username: string,
): Promise<LatestGitHubCommit | null> {
  const repositories = await fetchJson<GitHubRepo[]>(
    "https://api.github.com/user/repos?sort=pushed&per_page=100",
  );

  let latestCommit: LatestGitHubCommit | null = null;

  for (const repo of repositories.slice(0, 25)) {
    const owner = repo.owner?.login;
    const repoName = repo.name;

    if (!owner || !repoName) {
      continue;
    }

    try {
      const commits = await fetchJson<GitHubRepoCommit[]>(
        `https://api.github.com/repos/${owner}/${repoName}/commits?author=${username}&per_page=5`,
      );

      const candidate = commits
        .map((commit) => normalizeRepoCommit(repo, commit))
        .find((commit) => commit !== null);

      if (!candidate) {
        continue;
      }

      if (
        !latestCommit ||
        new Date(candidate.committedAt).getTime() >
          new Date(latestCommit.committedAt).getTime()
      ) {
        latestCommit = candidate;
      }
    } catch (error) {
      console.warn(
        `Skipping repository ${owner}/${repoName} while scanning commits`,
        error,
      );
    }
  }

  return latestCommit;
}

export async function getLatestCommit(): Promise<LatestGitHubCommit> {
  const currentUser = await fetchJson<GitHubUserResponse>(
    "https://api.github.com/user",
  );

  if (!currentUser.login) {
    throw new Error("GitHub user response did not include a login");
  }

  for (let page = 1; page <= 5; page += 1) {
    const events = await fetchJson<GitHubPushEvent[]>(
      `https://api.github.com/users/${currentUser.login}/events?per_page=100&page=${page}`,
    );

    if (events.length === 0) {
      break;
    }

    const latestCommit = events
      .filter(isPushEvent)
      .map(getLatestCommitFromPushEvent)
      .find((commit) => commit !== null);

    if (latestCommit) {
      return latestCommit;
    }
  }

  const fallbackCommit = await findLatestCommitFromRepositories(
    currentUser.login,
  );

  if (fallbackCommit) {
    return fallbackCommit;
  }

  throw new Error(
    'No GitHub commit found. The fallback repository scan needs "Metadata" (read) and "Contents" (read) repository permissions on the fine-grained token.',
  );
}
