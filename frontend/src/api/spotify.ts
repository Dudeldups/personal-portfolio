import { fetchJson } from "./fetchJson";

type RecentSpotifyTrackResponse = {
  status?: "empty";
  title?: string;
  artists?: string;
  album?: string;
  url?: string;
  playedAt?: string;
  observedAt?: string;
  isPlaying?: boolean;
  stale?: boolean;
};

export type RecentSpotifyTrack = {
  title: string;
  artists: string;
  album?: string;
  url: string;
  playedAt?: string;
  observedAt?: string;
  isPlaying?: boolean;
  stale?: boolean;
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
    observedAt: payload.observedAt,
    isPlaying: payload.isPlaying,
    stale: payload.stale,
  };
}

export async function getRecentSpotifyTrack(
  signal?: AbortSignal,
): Promise<RecentSpotifyTrack | null> {
  const payload = await fetchJson<RecentSpotifyTrackResponse>(
    "/api/spotify/recent-track",
    { signal },
  );

  return payload.status === "empty" ? null : parseRecentSpotifyTrack(payload);
}
