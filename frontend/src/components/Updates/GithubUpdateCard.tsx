import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiClock, FiGithub } from "react-icons/fi";
import { getLatestGithubCommit } from "../../api/github";
import {
  formatDate,
  getErrorMessage,
  initialState,
  type AsyncState,
  type GitHubCommit,
} from "./utils";

const GithubUpdateCard = () => {
  const { t, i18n } = useTranslation();
  const [latestCommit, setLatestCommit] = useState<AsyncState<GitHubCommit>>(
    () => initialState<GitHubCommit>(),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadGitHubCommit() {
      try {
        const parsedCommit = await getLatestGithubCommit(controller.signal);

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
    <article className="flex h-full flex-col rounded-3xl border border-light/10 bg-dark/50 p-6 shadow-sm shadow-dark-light backdrop-blur-md">
      <div className="flex items-start gap-3">
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

      <div className="mt-6 flex min-h-40 flex-1 flex-col">
        {latestCommit.isLoading ? (
          <p>{t("updates.loading")}</p>
        ) : latestCommit.data ? (
          <div className="flex flex-1 flex-col">
            <p className="text-xl font-bold text-white">
              {latestCommit.data.message}
            </p>
            <p className="mt-3 text-sm text-light/70">
              {latestCommit.data.isPrivate
                ? latestCommit.data.repo
                : `${latestCommit.data.repo} | ${latestCommit.data.sha}`}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-light/70">
              <FiClock className="size-4" />
              <span>
                {formatDate(latestCommit.data.committedAt, i18n.language)}
              </span>
            </div>

            {latestCommit.data.url ? (
              <a
                href={latestCommit.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-8 text-sm font-bold text-accent underline decoration-transparent underline-offset-4 transition hover:decoration-accent"
              >
                {t("updates.github.link")}
              </a>
            ) : (
              <p className="mt-auto pt-8 text-sm font-bold text-light/70">
                {t("updates.github.privateRepo")}
              </p>
            )}
          </div>
        ) : (
          <p>{getErrorMessage(t, latestCommit.error)}</p>
        )}
      </div>
    </article>
  );
};

export default GithubUpdateCard;
