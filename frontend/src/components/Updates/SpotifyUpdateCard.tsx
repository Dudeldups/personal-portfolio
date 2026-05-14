import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiClock, FiMusic } from "react-icons/fi";
import { siteConfig } from "../../config/site";
import {
  formatDate,
  getErrorMessage,
  initialState,
  type AsyncState,
  type SpotifyTrack,
} from "./utils";

const parseSpotifyTrack = (payload: unknown): SpotifyTrack | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("item" in payload) {
    const spotifyPayload = payload as {
      item?: {
        name?: string;
        artists?: { name?: string }[];
        album?: { name?: string };
        external_urls?: { spotify?: string };
      };
      played_at?: string;
      is_playing?: boolean;
    };

    const track = spotifyPayload.item;

    if (
      !track?.name ||
      !track.external_urls?.spotify ||
      !Array.isArray(track.artists)
    ) {
      return null;
    }

    return {
      title: track.name,
      artists: track.artists
        .map((artist) => artist.name)
        .filter(Boolean)
        .join(", "),
      album: track.album?.name,
      url: track.external_urls.spotify,
      playedAt: spotifyPayload.played_at,
      isPlaying: spotifyPayload.is_playing,
    };
  }

  const genericPayload = payload as {
    title?: string;
    name?: string;
    artists?: string | string[];
    artist?: string;
    album?: string;
    url?: string;
    trackUrl?: string;
    playedAt?: string;
    played_at?: string;
    isPlaying?: boolean;
    is_playing?: boolean;
  };

  const title = genericPayload.title ?? genericPayload.name;
  const artists = Array.isArray(genericPayload.artists)
    ? genericPayload.artists.join(", ")
    : (genericPayload.artists ?? genericPayload.artist);
  const url = genericPayload.url ?? genericPayload.trackUrl;

  if (!title || !artists || !url) {
    return null;
  }

  return {
    title,
    artists,
    album: genericPayload.album,
    url,
    playedAt: genericPayload.playedAt ?? genericPayload.played_at,
    isPlaying: genericPayload.isPlaying ?? genericPayload.is_playing,
  };
};

const SpotifyUpdateCard = () => {
  const { t, i18n } = useTranslation();
  const [latestTrack, setLatestTrack] = useState<AsyncState<SpotifyTrack>>(() =>
    initialState<SpotifyTrack>(),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadSpotifyTrack() {
      if (!siteConfig.spotifyRecentTrackEndpoint) {
        setLatestTrack({
          data: null,
          isLoading: false,
          error: "missing-config",
        });
        return;
      }

      try {
        const response = await fetch(siteConfig.spotifyRecentTrackEndpoint, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Spotify request failed with ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const parsedTrack = parseSpotifyTrack(payload);

        if (!parsedTrack) {
          throw new Error("Spotify response format is invalid");
        }

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
    <article className="rounded-3xl border border-light/10 bg-dark/50 p-6 shadow-sm shadow-dark-light backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-light/12 bg-light/10 p-3">
          <FiMusic className="size-5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-accent/80 uppercase">
            {t("updates.spotify.title")}
          </p>
          <h3 className="text-2xl">{t("updates.spotify.subtitle")}</h3>
        </div>
      </div>

      <div className="mt-6 min-h-40">
        {latestTrack.isLoading ? (
          <p>{t("updates.loading")}</p>
        ) : latestTrack.data ? (
          <div className="flex h-full flex-col">
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

            <div className="mt-6 flex items-center gap-2 text-sm text-light/70">
              <FiClock className="size-4" />
              <span>
                {latestTrack.data.isPlaying
                  ? t("updates.spotify.nowPlaying")
                  : latestTrack.data.playedAt
                    ? formatDate(latestTrack.data.playedAt, i18n.language)
                    : t("updates.spotify.recentlyPlayed")}
              </span>
            </div>

            <a
              href={latestTrack.data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto pt-8 text-sm font-bold text-primary underline decoration-transparent underline-offset-4 transition hover:decoration-primary"
            >
              {t("updates.spotify.link")}
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <p>{getErrorMessage(t, latestTrack.error)}</p>
            {siteConfig.spotifyProfileUrl ? (
              <a
                href={siteConfig.spotifyProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-sm font-bold text-primary underline decoration-transparent underline-offset-4 transition hover:decoration-primary"
              >
                {t("updates.spotify.profileLink")}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
};

export default SpotifyUpdateCard;
