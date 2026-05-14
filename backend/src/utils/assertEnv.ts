import "dotenv/config";

function assertEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parsePort(value: string | undefined): number {
  if (!value) {
    return 4000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
}

function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
  name: string,
): number {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsedValue;
}

export const PORT = parsePort(process.env.PORT);
export const GITHUB_CACHE_TTL_MS = parsePositiveInteger(
  process.env.GITHUB_CACHE_TTL_MS,
  60_000,
  "GITHUB_CACHE_TTL_MS",
);
export const GITHUB_ACCESS_TOKEN = assertEnv("GITHUB_ACCESS_TOKEN");
export const SPOTIFY_CLIENT_ID = assertEnv("SPOTIFY_CLIENT_ID");
export const SPOTIFY_CLIENT_SECRET = assertEnv("SPOTIFY_CLIENT_SECRET");
export const SPOTIFY_REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI?.trim() ||
  `http://127.0.0.1:${PORT}/api/spotify/callback`;
