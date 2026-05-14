import {
  SPOTIFY_CACHE_TTL_MS,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_REDIRECT_URI,
} from "../../utils/assertEnv";

const SPOTIFY_ACCOUNTS_BASE_URL = "https://accounts.spotify.com";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_RECENTLY_PLAYED_SCOPE = "user-read-recently-played";

type SpotifyTokenResponse = {
  access_token?: string;
  token_type?: string;
  scope?: string;
  expires_in?: number;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

type SpotifyRecentTrackResponse = {
  items?: Array<{
    track?: {
      name?: string;
      album?: {
        name?: string;
      };
      artists?: Array<{
        name?: string;
      }>;
      external_urls?: {
        spotify?: string;
      };
    };
    played_at?: string;
  }>;
};

export type SpotifyRecentTrack = {
  title: string;
  artists: string;
  album?: string;
  url: string;
  playedAt?: string;
  isPlaying: false;
};

type SpotifyRecentTrackCache = {
  value: SpotifyRecentTrack | null;
  expiresAt: number;
};

let spotifyRecentTrackCache: SpotifyRecentTrackCache | null = null;
let inFlightRecentTrackRequest: Promise<SpotifyRecentTrack | null> | null = null;

function createSpotifyBasicAuthHeader(): string {
  const credentials = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

export function getSpotifyAuthorizeUrl(): string {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SPOTIFY_RECENTLY_PLAYED_SCOPE,
  });

  return `${SPOTIFY_ACCOUNTS_BASE_URL}/authorize?${params.toString()}`;
}

export async function exchangeSpotifyCodeForTokens(
  code: string,
): Promise<SpotifyTokenResponse> {
  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`, {
    method: "POST",
    headers: {
      Authorization: createSpotifyBasicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
  });

  const payload = (await response.json()) as SpotifyTokenResponse;

  if (!response.ok) {
    throw new Error(
      `Spotify token exchange failed with ${response.status}: ${
        payload.error_description ?? payload.error ?? "Unknown error"
      }`,
    );
  }

  return payload;
}

export async function refreshSpotifyAccessToken(): Promise<string> {
  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`, {
    method: "POST",
    headers: {
      Authorization: createSpotifyBasicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const payload = (await response.json()) as SpotifyTokenResponse;

  if (!response.ok || !payload.access_token) {
    throw new Error(
      `Spotify token refresh failed with ${response.status}: ${
        payload.error_description ?? payload.error ?? "Unknown error"
      }`,
    );
  }

  return payload.access_token;
}

async function fetchSpotifyRecentTrack(): Promise<SpotifyRecentTrack | null> {
  const accessToken = await refreshSpotifyAccessToken();

  const response = await fetch(
    `${SPOTIFY_API_BASE_URL}/me/player/recently-played?limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const payload = (await response.json()) as SpotifyRecentTrackResponse & {
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    throw new Error(
      `Spotify recent track request failed with ${response.status}: ${
        payload.error?.message ?? "Unknown error"
      }`,
    );
  }

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

function cacheSpotifyRecentTrack(
  recentTrack: SpotifyRecentTrack | null,
): SpotifyRecentTrack | null {
  spotifyRecentTrackCache = {
    value: recentTrack,
    expiresAt: Date.now() + SPOTIFY_CACHE_TTL_MS,
  };

  return recentTrack;
}

function startRecentTrackRefresh(): Promise<SpotifyRecentTrack | null> {
  if (inFlightRecentTrackRequest) {
    return inFlightRecentTrackRequest;
  }

  inFlightRecentTrackRequest = fetchSpotifyRecentTrack()
    .then(cacheSpotifyRecentTrack)
    .finally(() => {
      inFlightRecentTrackRequest = null;
    });

  return inFlightRecentTrackRequest;
}

function refreshRecentTrackInBackground(): void {
  void startRecentTrackRefresh().catch((error) => {
    console.error("Failed to refresh Spotify recent track in background", error);
  });
}

export async function getSpotifyRecentTrack(): Promise<SpotifyRecentTrack | null> {
  const now = Date.now();

  if (spotifyRecentTrackCache) {
    if (spotifyRecentTrackCache.expiresAt > now) {
      return spotifyRecentTrackCache.value;
    }

    refreshRecentTrackInBackground();
    return spotifyRecentTrackCache.value;
  }

  if (inFlightRecentTrackRequest) {
    return inFlightRecentTrackRequest;
  }

  return startRecentTrackRefresh();
}

void (async () => {
  try {
    await getSpotifyRecentTrack();
  } catch (error) {
    console.error("Failed to warm Spotify recent track cache on startup", error);
  }
})();
