import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_REDIRECT_URI,
} from "../../utils/assertEnv";
import type {
  SpotifyRecentTrackResponse,
  SpotifyTokenResponse,
} from "./types";

const SPOTIFY_ACCOUNTS_BASE_URL = "https://accounts.spotify.com";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_RECENTLY_PLAYED_SCOPE = "user-read-recently-played";

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

export async function getSpotifyRecentlyPlayed(
  accessToken: string,
): Promise<SpotifyRecentTrackResponse> {
  const response = await fetch(
    `${SPOTIFY_API_BASE_URL}/me/player/recently-played?limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const payload = (await response.json()) as SpotifyRecentTrackResponse;

  if (!response.ok) {
    throw new Error(
      `Spotify recent track request failed with ${response.status}: ${
        payload.error?.message ?? "Unknown error"
      }`,
    );
  }

  return payload;
}
