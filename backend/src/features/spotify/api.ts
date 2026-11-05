import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_REDIRECT_URI,
} from "../../utils/assertEnv";
import type {
  SpotifyCurrentlyPlayingResponse,
  SpotifyRecentTrackResponse,
  SpotifyTokenResponse,
} from "./types";

const SPOTIFY_ACCOUNTS_BASE_URL = "https://accounts.spotify.com";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
export class SpotifyRequestError extends Error {
  constructor(public readonly operation: string, public readonly status: number, public readonly retryAfterMs = 0) {
    super(`Spotify ${operation} failed with HTTP ${status}`);
  }
}

function checkResponse(response: Response, operation: string): void {
  if (!response.ok) {
    const raw = response.headers.get("retry-after");
    const parsed = raw && /^\d+$/.test(raw.trim()) ? Number(raw) : 0;
    const seconds = Number.isFinite(parsed) && parsed <= 8_000_000_000 ? parsed : 0;
    const dateDelay = raw && !seconds ? Date.parse(raw) - Date.now() : 0;
    throw new SpotifyRequestError(operation, response.status, Math.max(0, seconds * 1000 || dateDelay || 0));
  }
}

const SPOTIFY_SCOPES = [
  "user-read-recently-played",
  "user-read-currently-playing",
].join(" ");

function createSpotifyBasicAuthHeader(): string {
  const credentials = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

export function getSpotifyAuthorizeUrl(): string {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SPOTIFY_SCOPES,
  });

  return `${SPOTIFY_ACCOUNTS_BASE_URL}/authorize?${params.toString()}`;
}

export async function exchangeSpotifyCodeForTokens(
  code: string,
): Promise<SpotifyTokenResponse> {
  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`, {
    signal: AbortSignal.timeout(5000),
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

  checkResponse(response, "token exchange");
  return (await response.json()) as SpotifyTokenResponse;
}

export async function refreshSpotifyAccessToken(): Promise<SpotifyTokenResponse> {
  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`, {
    signal: AbortSignal.timeout(5000),
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

  checkResponse(response, "token refresh");
  const payload = (await response.json()) as SpotifyTokenResponse;
  if (!payload.access_token || !payload.expires_in) {
    throw new SpotifyRequestError("token refresh", 401);
  }
  return payload;

}

export async function getSpotifyRecentlyPlayed(
  accessToken: string,
): Promise<SpotifyRecentTrackResponse> {
  const response = await fetch(
    `${SPOTIFY_API_BASE_URL}/me/player/recently-played?limit=1`,
    {
      signal: AbortSignal.timeout(5000),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  checkResponse(response, "recent track");
  return (await response.json()) as SpotifyRecentTrackResponse;
}

export async function getSpotifyCurrentlyPlaying(
  accessToken: string,
): Promise<SpotifyCurrentlyPlayingResponse | null> {
  const response = await fetch(
    `${SPOTIFY_API_BASE_URL}/me/player/currently-playing`,
    {
      signal: AbortSignal.timeout(5000),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status === 204) {
    return null;
  }

  checkResponse(response, "currently playing");
  return (await response.json()) as SpotifyCurrentlyPlayingResponse;
}
