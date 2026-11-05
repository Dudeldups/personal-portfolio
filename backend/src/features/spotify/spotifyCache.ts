import { SpotifyRequestError } from "./api";
import type { SpotifyRecentTrack } from "./types";

// Keep metadata only briefly and never report an expired playback state as live.
const MAX_STALE_MS = 15 * 60_000;
const MAX_BACKOFF_MS = 30 * 60_000;
const AUTH_BACKOFF_MS = 60 * 60_000;

type Options = {
  ttlMs: number;
  load: () => Promise<SpotifyRecentTrack | null>;
};

export function createSpotifyCache({ ttlMs, load }: Options) {
  let entry: { value: SpotifyRecentTrack | null; fetchedAt: number } | null = null;
  let inFlight: Promise<void> | null = null;
  let nextAttempt = 0;
  let failures = 0;

  function refresh(): void {
    if (inFlight || Date.now() < nextAttempt) return;
    inFlight = Promise.resolve().then(load).then((value) => {
      entry = { value, fetchedAt: Date.now() };
      if (failures) console.info("Spotify refresh recovered");
      failures = 0;
      nextAttempt = Date.now() + ttlMs;
    }).catch((error: unknown) => {
      failures++;
      const status = error instanceof SpotifyRequestError ? error.status : 0;
      const auth = status === 401 || status === 403 || (error instanceof SpotifyRequestError && error.operation === "token refresh" && status === 400);
      const backoff = auth ? AUTH_BACKOFF_MS : Math.min(MAX_BACKOFF_MS, 60_000 * 2 ** Math.min(failures - 1, 5));
      const retryAfter = error instanceof SpotifyRequestError ? error.retryAfterMs : 0;
      nextAttempt = Date.now() + Math.max(backoff, retryAfter);
      const kind = status === 429 ? "rate limited" : auth ? "authorization or access failure; check credentials, scopes and quota mode" : "temporary failure";
      // No response bodies, request headers, or credentials are logged.
      console.warn(`Spotify ${kind} (operation=${error instanceof SpotifyRequestError ? error.operation : "network"}, status=${status || "network"}, retryAt=${new Date(nextAttempt).toISOString()}, consecutiveFailures=${failures})`);
    }).finally(() => { inFlight = null; });
  }

  async function get(): Promise<SpotifyRecentTrack | null> {
    const now = Date.now();
    if (!entry || now >= entry.fetchedAt + ttlMs) refresh();
    if (!entry && inFlight) await inFlight;
    if (!entry || now >= entry.fetchedAt + ttlMs + MAX_STALE_MS) {
      if (entry && now >= entry.fetchedAt + ttlMs + MAX_STALE_MS) entry = null;
      return null;
    }
    if (!entry.value) return null;
    return now >= entry.fetchedAt + ttlMs
      ? { ...entry.value, isPlaying: false, stale: true }
      : entry.value;
  }

  return { get };
}
