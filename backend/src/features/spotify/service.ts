import { SPOTIFY_CACHE_TTL_MS } from "../../utils/assertEnv";
import { createStaleWhileRevalidateCache } from "../../utils/createStaleWhileRevalidateCache";
import {
  getSpotifyRecentlyPlayed,
  refreshSpotifyAccessToken,
} from "./api";
import type { SpotifyRecentTrack, SpotifyRecentTrackResponse } from "./types";

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

async function loadRecentTrack(): Promise<SpotifyRecentTrack | null> {
  const accessToken = await refreshSpotifyAccessToken();
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
