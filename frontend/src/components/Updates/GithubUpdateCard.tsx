import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiClock, FiGithub } from "react-icons/fi";
import { siteConfig } from "../../config/site";
import {
  formatDate,
  getErrorMessage,
  initialState,
  type AsyncState,
  type GitHubCommit,
} from "./utils";

const parseGitHubCommit = (payload: unknown): GitHubCommit | null => {
  if (!Array.isArray(payload) || payload.length === 0) {
    return null;
  }

  const [firstCommit] = payload;

  if (
    !firstCommit ||
    typeof firstCommit !== "object" ||
    !("commit" in firstCommit) ||
    !("html_url" in firstCommit) ||
    !("sha" in firstCommit)
  ) {
    return null;
  }

  const commit = firstCommit.commit;

  if (
    !commit ||
    typeof commit !== "object" ||
    !("message" in commit) ||
    !("committer" in commit)
  ) {
    return null;
  }

  const committer = commit.committer;

  if (
    !committer ||
    typeof committer !== "object" ||
    !("date" in committer) ||
    typeof commit.message !== "string" ||
    typeof firstCommit.html_url !== "string" ||
    typeof firstCommit.sha !== "string" ||
    typeof committer.date !== "string"
  ) {
    return null;
  }

  return {
    message: commit.message.split("\n")[0],
    url: firstCommit.html_url,
    repo: `${siteConfig.githubOwner}/${siteConfig.githubRepo}`,
    committedAt: committer.date,
    sha: firstCommit.sha.slice(0, 7),
  };
};

const GithubUpdateCard = () => {
  const { t, i18n } = useTranslation();
  const [latestCommit, setLatestCommit] = useState<AsyncState<GitHubCommit>>(
    () => initialState<GitHubCommit>(),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadGitHubCommit() {
      if (!siteConfig.githubOwner || !siteConfig.githubRepo) {
        setLatestCommit({
          data: null,
          isLoading: false,
          error: "missing-config",
        });
        return;
      }

      try {
        const response = await fetch(
          `https://api.github.com/repos/${siteConfig.githubOwner}/${siteConfig.githubRepo}/commits?per_page=1`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/vnd.github+json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`GitHub request failed with ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const parsedCommit = parseGitHubCommit(payload);

        if (!parsedCommit) {
          throw new Error("GitHub response format is invalid");
        }

        setLatestCommit({
          data: parsedCommit,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setLatestCommit({
          data: null,
          isLoading: false,
          error: "request-failed",
        });
      }
    }

    void loadGitHubCommit();

    return () => controller.abort();
  }, []);

  return (
    <article className="rounded-3xl border border-light/10 bg-dark/50 p-6 shadow-sm shadow-dark-light backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-light/12 bg-light/10 p-3">
          <FiGithub className="size-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-primary/80 uppercase">
            {t("updates.github.title")}
          </p>
          <h3 className="text-2xl">{t("updates.github.subtitle")}</h3>
        </div>
      </div>

      <div className="mt-6 min-h-40">
        {latestCommit.isLoading ? (
          <p>{t("updates.loading")}</p>
        ) : latestCommit.data ? (
          <div className="flex h-full flex-col">
            <p className="text-xl font-bold text-white">
              {latestCommit.data.message}
            </p>
            <p className="mt-3 text-sm text-light/70">
              {latestCommit.data.repo} | {latestCommit.data.sha}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-light/70">
              <FiClock className="size-4" />
              <span>
                {formatDate(latestCommit.data.committedAt, i18n.language)}
              </span>
            </div>

            <a
              href={latestCommit.data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto pt-8 text-sm font-bold text-accent underline decoration-transparent underline-offset-4 transition hover:decoration-accent"
            >
              {t("updates.github.link")}
            </a>
          </div>
        ) : (
          <p>{getErrorMessage(t, latestCommit.error)}</p>
        )}
      </div>
    </article>
  );
};

export default GithubUpdateCard;
