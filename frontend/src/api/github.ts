import { fetchJson } from "./fetchJson";

type LatestGithubCommitResponse = {
  message?: string;
  repo?: string;
  committedAt?: string;
  sha?: string;
  url?: string | null;
  isPrivate?: boolean;
};

export type LatestGithubCommit = {
  message: string;
  repo: string;
  committedAt: string;
  sha: string;
  url: string | null;
  isPrivate: boolean;
};

function parseLatestGithubCommit(
  payload: LatestGithubCommitResponse,
): LatestGithubCommit {
  if (
    typeof payload.message !== "string" ||
    typeof payload.repo !== "string" ||
    typeof payload.committedAt !== "string" ||
    typeof payload.sha !== "string" ||
    typeof payload.isPrivate !== "boolean"
  ) {
    throw new Error("GitHub response format is invalid");
  }

  return {
    message: payload.message,
    repo: payload.repo,
    committedAt: payload.committedAt,
    sha: payload.sha,
    url: typeof payload.url === "string" ? payload.url : null,
    isPrivate: payload.isPrivate,
  };
}

export async function getLatestGithubCommit(
  signal?: AbortSignal,
): Promise<LatestGithubCommit> {
  const payload = await fetchJson<LatestGithubCommitResponse>(
    "/api/github/latest-commit",
    { signal },
  );

  return parseLatestGithubCommit(payload);
}
