import { SPOTIFY_CACHE_TTL_MS } from "../../utils/assertEnv";
import { createSpotifyCache } from "./spotifyCache";
import {
  getSpotifyCurrentlyPlaying,
  getSpotifyRecentlyPlayed,
  refreshSpotifyAccessToken,
  SpotifyRequestError,
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
  const accessToken = await getAccessToken();
  const currentlyPlayingPayload = await getSpotifyCurrentlyPlaying(accessToken);
  const currentlyPlayingTrack =
    mapSpotifyCurrentlyPlayingTrack(currentlyPlayingPayload);

  if (currentlyPlayingTrack) {
    return currentlyPlayingTrack;
  }

  const payload = await getSpotifyRecentlyPlayed(accessToken);

  return mapSpotifyRecentTrack(payload);
}

let token: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (token && token.expiresAt > Date.now()) return token.value;
  const result = await refreshSpotifyAccessToken();
  token = {
    value: result.access_token!,
    expiresAt: Date.now() + Math.max(0, (result.expires_in! - 60) * 1000),
  };
  return token.value;
}

const recentTrackCache = createSpotifyCache({
  ttlMs: SPOTIFY_CACHE_TTL_MS,
  load: async () => {
    try {
      return await loadRecentTrack();
    } catch (error) {
      if (error instanceof SpotifyRequestError && error.status === 401) token = null;
      throw error;
    }
  },
});

export function getSpotifyRecentTrack(): Promise<SpotifyRecentTrack | null> {
  return recentTrackCache.get();
}
