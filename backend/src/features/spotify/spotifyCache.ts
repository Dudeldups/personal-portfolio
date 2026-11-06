import { SpotifyRequestError } from "./api";
import type { SpotifyRecentTrack } from "./types";

// Cache metadata is short-lived; stale playback must never appear live.
const MAX_STALE_MS = 15 * 60_000;
const MAX_BACKOFF_MS = 30 * 60_000;
const AUTH_BACKOFF_MS = 60 * 60_000;
const DEFAULT_REFRESH_WAIT_MS = 8_000;

export type SpotifyCacheResult =
  | { status: "available"; track: SpotifyRecentTrack }
  | { status: "empty" }
  | { status: "unavailable" };

type Options = {
  ttlMs: number;
  load: () => Promise<SpotifyRecentTrack | null>;
  // Override the bounded wait in tests without waiting eight real seconds.
  refreshWaitMs?: number;
};

export function createSpotifyCache({
  ttlMs,
  load,
  refreshWaitMs = DEFAULT_REFRESH_WAIT_MS,
}: Options) {
  let entry: { value: SpotifyRecentTrack | null; fetchedAt: number } | null = null;
  let inFlight: Promise<void> | null = null;
  let nextAttempt = 0;
  let failures = 0;

  function refresh(): Promise<void> | null {
    if (inFlight) return inFlight;
    if (Date.now() < nextAttempt) return null;

    inFlight = Promise.resolve()
      .then(load)
      .then((value) => {
        entry = { value, fetchedAt: Date.now() };
        if (failures) console.info("Spotify refresh recovered");
        failures = 0;
        nextAttempt = Date.now() + ttlMs;
      })
      .catch((error: unknown) => {
        failures++;
        const status = error instanceof SpotifyRequestError ? error.status : 0;
        const auth =
          status === 401 ||
          status === 403 ||
          (error instanceof SpotifyRequestError &&
            error.operation === "token refresh" &&
            status === 400);
        const backoff = auth
          ? AUTH_BACKOFF_MS
          : Math.min(MAX_BACKOFF_MS, 60_000 * 2 ** Math.min(failures - 1, 5));
        const retryAfter = error instanceof SpotifyRequestError ? error.retryAfterMs : 0;
        nextAttempt = Date.now() + Math.max(backoff, retryAfter);
        const kind = status === 429
          ? "rate limited"
          : auth
            ? "authorization or access failure; check credentials, scopes and quota mode"
            : "temporary failure";
        // Never log request headers, Spotify response bodies or credentials.
        console.warn(
          "Spotify " + kind +
          " (operation=" + (error instanceof SpotifyRequestError ? error.operation : "network") +
          ", status=" + (status || "network") +
          ", retryAt=" + new Date(nextAttempt).toISOString() +
          ", consecutiveFailures=" + failures + ")",
        );
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  }

  async function waitForRefresh(pending: Promise<void>): Promise<void> {
    // A slow Spotify API must not keep a visitor's HTTP request open indefinitely.
    // The late result is still cached for subsequent requests.
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, Math.max(0, refreshWaitMs));
      void pending.then(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  async function get(): Promise<SpotifyCacheResult> {
    const now = Date.now();
    if (!entry || now >= entry.fetchedAt + ttlMs) {
      const pending = refresh();
      if (pending) await waitForRefresh(pending);
    }

    const checkedAt = Date.now();
    if (!entry || checkedAt >= entry.fetchedAt + ttlMs + MAX_STALE_MS) {
      if (entry) entry = null;
      return { status: "unavailable" };
    }
    if (!entry.value) {
      return checkedAt >= entry.fetchedAt + ttlMs
        ? { status: "unavailable" }
        : { status: "empty" };
    }
    return {
      status: "available",
      track: checkedAt >= entry.fetchedAt + ttlMs
        ? { ...entry.value, isPlaying: false, stale: true }
        : entry.value,
    };
  }

  return { get };
}
