import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiClock } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa6";
import { getRecentSpotifyTrack } from "../../api/spotify";
import {
  formatDate,
  getErrorMessage,
  initialState,
  type AsyncState,
  type SpotifyTrack,
} from "./utils";

const SpotifyUpdateCard = () => {
  const { t, i18n } = useTranslation();
  const [latestTrack, setLatestTrack] = useState<AsyncState<SpotifyTrack>>(() =>
    initialState<SpotifyTrack>(),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadSpotifyTrack() {
      try {
        const parsedTrack = await getRecentSpotifyTrack(controller.signal);

        setLatestTrack({
          data: parsedTrack,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setLatestTrack({
          data: null,
          isLoading: false,
          error: "request-failed",
        });
      }
    }

    void loadSpotifyTrack();

    return () => controller.abort();
  }, []);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-light/10 bg-dark/50 p-6 shadow-sm shadow-dark-light backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="rounded-full border border-light/12 bg-light/10 p-3">
          <FaSpotify className="size-5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-accent/80 uppercase">
            {t("updates.spotify.title")}
          </p>
          <h3 className="text-2xl">{t("updates.spotify.subtitle")}</h3>
        </div>
      </div>

      <div className="mt-6 flex min-h-40 flex-1 flex-col">
        {latestTrack.isLoading ? (
          <p>{t("updates.loading")}</p>
        ) : latestTrack.data ? (
          <div className="flex flex-1 flex-col">
            <p className="text-xl font-bold text-white">
              {latestTrack.data.title}
            </p>
            <p className="mt-3 text-base text-light/85">
              {latestTrack.data.artists}
            </p>

            {latestTrack.data.album ? (
              <p className="mt-2 text-sm text-light/70">
                {latestTrack.data.album}
              </p>
            ) : null}

            <footer className="mt-auto pt-8">
              <div className="flex items-center gap-2 text-sm text-light/70">
                <FiClock className="size-4" />
                <time
                  dateTime={
                    latestTrack.data.playedAt ?? new Date().toISOString()
                  }
                >
                  {latestTrack.data.isPlaying
                    ? t("updates.spotify.nowPlaying")
                    : latestTrack.data.playedAt
                      ? formatDate(latestTrack.data.playedAt, i18n.language)
                      : t("updates.spotify.recentlyPlayed")}
                </time>
              </div>

              <a
                href={latestTrack.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex text-sm font-bold text-primary underline decoration-transparent underline-offset-4 transition hover:decoration-primary"
              >
                {t("updates.spotify.link")}
              </a>
            </footer>
          </div>
        ) : (
          <p>{getErrorMessage(t, latestTrack.error)}</p>
        )}
      </div>
    </article>
  );
};

export default SpotifyUpdateCard;
