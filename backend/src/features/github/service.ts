import { GITHUB_CACHE_TTL_MS } from "../../utils/assertEnv";
import { createStaleWhileRevalidateCache } from "../../utils/createStaleWhileRevalidateCache";
import {
  getCurrentGitHubUser,
  getGitHubRepositoryCommits,
  getGitHubUserEvents,
  getGitHubUserRepositories,
} from "./api";
import type {
  GitHubPushEvent,
  GitHubRepo,
  GitHubRepoCommit,
  LatestGitHubCommit,
} from "./types";

const GITHUB_WEB_BASE_URL = "https://github.com";
const MAX_EVENT_PAGES = 5;
const REPOSITORY_SCAN_LIMIT = 25;

function getTimestamp(value: string): number {
  return new Date(value).getTime();
}

function isNewerCommit(
  candidate: LatestGitHubCommit,
  latestCommit: LatestGitHubCommit | null,
): boolean {
  return (
    !latestCommit ||
    getTimestamp(candidate.committedAt) > getTimestamp(latestCommit.committedAt)
  );
}

function isPushEvent(event: GitHubPushEvent): boolean {
  return event.type === "PushEvent";
}

function mapPushEventToLatestCommit(
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
      : `${GITHUB_WEB_BASE_URL}/${repoName}/commit/${matchingCommit.sha}`,
    isPrivate,
  };
}

function mapRepositoryCommitToLatestCommit(
  repo: GitHubRepo,
  commit: GitHubRepoCommit,
): LatestGitHubCommit | null {
  const repoName = repo.full_name;
  const isPrivate = repo.private === true;
  const message = commit.commit?.message?.split("\n")[0];
  const committedAt =
    commit.commit?.author?.date ?? commit.commit?.committer?.date;
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

async function findLatestCommitInEventFeed(
  username: string,
): Promise<LatestGitHubCommit | null> {
  for (let page = 1; page <= MAX_EVENT_PAGES; page += 1) {
    const events = await getGitHubUserEvents(username, page);

    if (events.length === 0) {
      return null;
    }

    const latestCommit = events
      .filter(isPushEvent)
      .map(mapPushEventToLatestCommit)
      .find((commit) => commit !== null);

    if (latestCommit) {
      return latestCommit;
    }
  }

  return null;
}

async function findLatestCommitInRepositories(
  username: string,
): Promise<LatestGitHubCommit | null> {
  const repositories = await getGitHubUserRepositories();

  const candidatePromises = repositories
    .slice(0, REPOSITORY_SCAN_LIMIT)
    .map(async (repo) => {
      const owner = repo.owner?.login;
      const repoName = repo.name;

      if (!owner || !repoName) {
        return null;
      }

      try {
        const commits = await getGitHubRepositoryCommits(
          owner,
          repoName,
          username,
        );
        const [latestRepoCommit] = commits;

        if (!latestRepoCommit) {
          return null;
        }

        return mapRepositoryCommitToLatestCommit(repo, latestRepoCommit);
      } catch (error) {
        console.warn(
          `Skipping repository ${owner}/${repoName} while scanning commits`,
          error,
        );
        return null;
      }
    });

  const candidates = await Promise.all(candidatePromises);

  return candidates.reduce<LatestGitHubCommit | null>(
    (latestCommit, candidate) => {
      if (!candidate || !isNewerCommit(candidate, latestCommit)) {
        return latestCommit;
      }

      return candidate;
    },
    null,
  );
}

async function loadLatestCommit(): Promise<LatestGitHubCommit> {
  const currentUser = await getCurrentGitHubUser();

  if (!currentUser.login) {
    throw new Error("GitHub user response did not include a login");
  }

  const latestCommitFromEvents = await findLatestCommitInEventFeed(
    currentUser.login,
  );
  const latestCommitFromRepositories = await findLatestCommitInRepositories(
    currentUser.login,
  );

  const latestCommit = [latestCommitFromEvents, latestCommitFromRepositories]
    .filter((commit): commit is LatestGitHubCommit => commit !== null)
    .reduce<LatestGitHubCommit | null>((currentLatest, candidate) => {
      if (!isNewerCommit(candidate, currentLatest)) {
        return currentLatest;
      }

      return candidate;
    }, null);

  if (latestCommit) {
    return latestCommit;
  }

  throw new Error(
    'No GitHub commit found. The fallback repository scan needs "Metadata" (read) and "Contents" (read) repository permissions on the fine-grained token.',
  );
}

const latestCommitCache = createStaleWhileRevalidateCache<LatestGitHubCommit>({
  debugLabel: "latest GitHub commit",
  ttlMs: GITHUB_CACHE_TTL_MS,
  load: loadLatestCommit,
});

export function getLatestCommit(): Promise<LatestGitHubCommit> {
  return latestCommitCache.get();
}

latestCommitCache.warm();
