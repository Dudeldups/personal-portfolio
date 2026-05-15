import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiClock, FiGithub } from "react-icons/fi";
import { getLatestGithubCommit } from "../../api/github";
import {
  formatRelativeDate,
  getErrorMessage,
  initialState,
  type AsyncState,
  type GitHubCommit,
} from "./utils";

const REFRESH_INTERVAL_MS = 60_000;

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
    const refreshInterval = window.setInterval(() => {
      void loadGitHubCommit();
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(refreshInterval);
      controller.abort();
    };
  }, []);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-light/10 bg-dark/50 p-6 shadow-sm shadow-dark-light backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="rounded-full border border-light/12 bg-light/10 p-3">
          <FiGithub className="size-5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-accent/80 uppercase">
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
            {latestCommit.data.isPrivate ? (
              <div className="mt-auto">
                <p className="text-sm font-bold text-light/70">
                  {t("updates.github.privateRepo")}
                </p>
                <img
                  src="/assets/images/alright_then_keep_your_secrets_meme.webp"
                  alt={t("updates.github.privateRepoImageAlt")}
                  className="mx-auto mt-5 w-full max-w-xs rounded-2xl border border-light/10"
                />
              </div>
            ) : (
              <>
                <p className="text-xl font-bold text-white">
                  {latestCommit.data.message}
                </p>
                <p className="mt-3 text-sm text-light/70">
                  {`${latestCommit.data.repo} | ${latestCommit.data.sha}`}
                </p>

                <footer className="mt-auto pt-8">
                  <div className="flex items-center gap-2 text-sm text-light/70">
                    <FiClock className="size-4" />
                    <time dateTime={latestCommit.data.committedAt}>
                      {formatRelativeDate(
                        latestCommit.data.committedAt,
                        i18n.language,
                        t,
                      )}
                    </time>
                  </div>

                  <a
                    href={latestCommit.data.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex text-sm font-bold text-primary underline decoration-transparent underline-offset-4 transition hover:decoration-primary"
                  >
                    {t("updates.github.link")}
                  </a>
                </footer>
              </>
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
