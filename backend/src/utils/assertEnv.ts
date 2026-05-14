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

export const PORT = parsePort(process.env.PORT);
export const GITHUB_ACCESS_TOKEN = assertEnv("GITHUB_ACCESS_TOKEN");
