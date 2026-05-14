import { fetchJson } from "./fetchJson";

type RecentSpotifyTrackResponse = {
  title?: string;
  artists?: string;
  album?: string;
  url?: string;
  playedAt?: string;
  isPlaying?: boolean;
};

export type RecentSpotifyTrack = {
  title: string;
  artists: string;
  album?: string;
  url: string;
  playedAt?: string;
  isPlaying?: boolean;
};

function parseRecentSpotifyTrack(
  payload: RecentSpotifyTrackResponse,
): RecentSpotifyTrack {
  if (
    typeof payload.title !== "string" ||
    typeof payload.artists !== "string" ||
    typeof payload.url !== "string"
  ) {
    throw new Error("Spotify response format is invalid");
  }

  return {
    title: payload.title,
    artists: payload.artists,
    album: payload.album,
    url: payload.url,
    playedAt: payload.playedAt,
    isPlaying: payload.isPlaying,
  };
}

export async function getRecentSpotifyTrack(
  signal?: AbortSignal,
): Promise<RecentSpotifyTrack> {
  const payload = await fetchJson<RecentSpotifyTrackResponse>(
    "/api/spotify/recent-track",
    { signal },
  );

  return parseRecentSpotifyTrack(payload);
}
