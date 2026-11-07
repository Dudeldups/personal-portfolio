import { SpotifyRequestError } from "./api";
import { MAX_SNAPSHOT_AGE_MS, type SpotifySnapshot } from "./spotifySnapshot";
import type { SpotifyRecentTrack } from "./types";

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
  refreshWaitMs?: number;
  initialLastKnown?: SpotifySnapshot | null;
  onSuccessfulTrack?: (snapshot: SpotifySnapshot) => void;
};

export function createSpotifyCache({
  ttlMs,
  load,
  refreshWaitMs = DEFAULT_REFRESH_WAIT_MS,
  initialLastKnown = null,
  onSuccessfulTrack,
}: Options) {
  // Fresh response state controls Spotify TTL; lastKnown is a separate,
  // never-live, time-limited fallback that can survive container recreation.
  let entry: { value: SpotifyRecentTrack | null; fetchedAt: number } | null = null;
  let lastKnown: SpotifySnapshot | null = initialLastKnown;
  let inFlight: Promise<void> | null = null;
  let nextAttempt = 0;
  let failures = 0;

  function refresh(): Promise<void> | null {
    if (inFlight) return inFlight;
    if (Date.now() < nextAttempt) return null;

    inFlight = Promise.resolve()
      .then(load)
      .then((value) => {
        const fetchedAt = Date.now();
        const observed = value
          ? { ...value, observedAt: new Date(fetchedAt).toISOString() }
          : null;
        entry = { value: observed, fetchedAt };
        if (observed) {
          lastKnown = {
            track: { ...observed, isPlaying: false, stale: true },
            fetchedAt,
          };
          try {
            onSuccessfulTrack?.(lastKnown);
          } catch {
            // Persistence must never turn a successful Spotify response into a 503.
            console.warn("Spotify last-known snapshot update failed");
          }
        }
        if (failures) console.info("Spotify refresh recovered");
        failures = 0;
        nextAttempt = fetchedAt + Math.min(ttlMs, MAX_SNAPSHOT_AGE_MS);
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
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, Math.max(0, refreshWaitMs));
      void pending.then(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  function availableLastKnown(): SpotifyCacheResult | null {
    if (!lastKnown) return null;
    if (Date.now() - lastKnown.fetchedAt >= MAX_SNAPSHOT_AGE_MS) {
      lastKnown = null;
      return null;
    }
    return {
      status: "available",
      track: { ...lastKnown.track, isPlaying: false, stale: true },
    };
  }

  function currentResult(): SpotifyCacheResult | null {
    if (!entry || Date.now() >= entry.fetchedAt + Math.min(ttlMs, MAX_SNAPSHOT_AGE_MS)) return null;
    if (!entry.value) {
      return availableLastKnown() ?? { status: "empty" };
    }
    return { status: "available", track: entry.value };
  }

  async function get(): Promise<SpotifyCacheResult> {
    const fresh = currentResult();
    if (fresh) return fresh;

    const pending = refresh();
    // Show a known, timestamped snapshot immediately, while the refresh runs.
    // Waiting for Spotify here would cause the exact blank/error first impression
    // that the persistent fallback is designed to avoid.
    const fallback = availableLastKnown();
    if (fallback) return fallback;

    // Before the very first successful fetch there is no factual track to show.
    if (pending) await waitForRefresh(pending);
    return currentResult() ?? availableLastKnown() ?? { status: "unavailable" };
  }

  return { get };
}
