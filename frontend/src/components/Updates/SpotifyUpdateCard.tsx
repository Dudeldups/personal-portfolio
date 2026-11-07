import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiClock } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa6";
import { getRecentSpotifyTrack } from "../../api/spotify";
import { startSpotifyPolling } from "./spotifyPolling";
import {
  formatRelativeDate,
  initialState,
  type AsyncState,
  type SpotifyTrack,
} from "./utils";

const SpotifyUpdateCard = () => {
  const { t, i18n } = useTranslation();
  const [latestTrack, setLatestTrack] = useState<AsyncState<SpotifyTrack>>(() =>
    initialState<SpotifyTrack>(),
  );

  useEffect(() => startSpotifyPolling({
    load: getRecentSpotifyTrack,
    onSuccess: (parsedTrack) => setLatestTrack({
      data: parsedTrack,
      isLoading: false,
      error: parsedTrack ? null : "empty",
    }),
    // A temporary backend error must not erase a previously displayed track.
    onError: () => setLatestTrack((previous) => ({
      data: previous.data?.observedAt &&
        Date.now() - Date.parse(previous.data.observedAt) < 24 * 60 * 60_000
        ? { ...previous.data, isPlaying: false, stale: true }
        : null,
      isLoading: false,
      error: "request-failed",
    })),
  }), []);

  const playbackLabel = latestTrack.data
    ? latestTrack.data.stale
      ? latestTrack.data.playedAt
        ? t("updates.spotify.lastKnown") + " · " +
          formatRelativeDate(latestTrack.data.playedAt, i18n.language, t)
        : latestTrack.data.observedAt
          ? t("updates.spotify.lastKnown") + " · " +
            t("updates.spotify.observedAt") + " " +
            formatRelativeDate(latestTrack.data.observedAt, i18n.language, t)
          : t("updates.spotify.lastKnown")
      : latestTrack.data.isPlaying
        ? t("updates.spotify.nowPlaying")
        : latestTrack.data.playedAt
          ? formatRelativeDate(latestTrack.data.playedAt, i18n.language, t)
          : t("updates.spotify.recentlyPlayed")
    : null;

  const TRACK_TRANSITION = {
    duration: 0.35,
    ease: "easeOut",
  } as const;

  const trackMotionKey = latestTrack.data
    ? [
        latestTrack.data.url,
        latestTrack.data.playedAt ?? "now-playing",
        latestTrack.data.isPlaying ? "playing" : "recent",
      ].join(":")
    : "empty";

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
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={trackMotionKey}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={TRACK_TRANSITION}
              >
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
              </motion.div>
            </AnimatePresence>

            <footer className="mt-auto pt-8">
              <div className="flex items-center gap-2 text-sm text-light/70">
                <FiClock className="size-4" />
                {!latestTrack.data.isPlaying &&
                  (latestTrack.data.playedAt || latestTrack.data.observedAt) ? (
                  <time dateTime={latestTrack.data.playedAt ?? latestTrack.data.observedAt}>
                    {playbackLabel}
                  </time>
                ) : (
                  <span>{playbackLabel}</span>
                )}
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
          <p>{t(latestTrack.error === "empty" ? "updates.spotify.empty" : "updates.spotify.unavailable")}</p>
        )}
      </div>
    </article>
  );
};

export default SpotifyUpdateCard;
