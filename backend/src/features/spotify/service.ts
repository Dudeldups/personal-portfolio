import { SPOTIFY_CACHE_TTL_MS } from "../../utils/assertEnv";
import { createStaleWhileRevalidateCache } from "../../utils/createStaleWhileRevalidateCache";
import {
  getSpotifyCurrentlyPlaying,
  getSpotifyRecentlyPlayed,
  refreshSpotifyAccessToken,
} from "./api";
import type {
  SpotifyCurrentlyPlayingResponse,
  SpotifyRecentTrack,
  SpotifyRecentTrackResponse,
} from "./types";

function mapSpotifyRecentTrack(
  payload: SpotifyRecentTrackResponse,
): SpotifyRecentTrack | null {
  const [item] = payload.items ?? [];
  const track = item?.track;

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
    playedAt: item?.played_at,
    isPlaying: false,
  };
}

function mapSpotifyCurrentlyPlayingTrack(
  payload: SpotifyCurrentlyPlayingResponse | null,
): SpotifyRecentTrack | null {
  const track = payload?.item;

  if (
    !payload?.is_playing ||
    payload.currently_playing_type !== "track" ||
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
    isPlaying: true,
  };
}

async function loadRecentTrack(): Promise<SpotifyRecentTrack | null> {
  const accessToken = await refreshSpotifyAccessToken();
  const currentlyPlayingPayload = await getSpotifyCurrentlyPlaying(accessToken);
  const currentlyPlayingTrack =
    mapSpotifyCurrentlyPlayingTrack(currentlyPlayingPayload);

  if (currentlyPlayingTrack) {
    return currentlyPlayingTrack;
  }

  const payload = await getSpotifyRecentlyPlayed(accessToken);

  return mapSpotifyRecentTrack(payload);
}

const recentTrackCache = createStaleWhileRevalidateCache<SpotifyRecentTrack | null>(
  {
    debugLabel: "Spotify recent track",
    ttlMs: SPOTIFY_CACHE_TTL_MS,
    load: loadRecentTrack,
  },
);

export function getSpotifyRecentTrack(): Promise<SpotifyRecentTrack | null> {
  return recentTrackCache.get();
}

recentTrackCache.warm();
