type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

type StaleWhileRevalidateCacheOptions<T> = {
  debugLabel: string;
  ttlMs: number;
  load: () => Promise<T>;
};

export function createStaleWhileRevalidateCache<T>({
  debugLabel,
  ttlMs,
  load,
}: StaleWhileRevalidateCacheOptions<T>) {
  let cache: CacheEntry<T> | null = null;
  let inFlight: Promise<T> | null = null;
  let refreshTimer: NodeJS.Timeout | null = null;

  function writeCache(value: T): T {
    cache = {
      value,
      expiresAt: Date.now() + ttlMs,
    };

    return value;
  }

  function refresh(): Promise<T> {
    if (inFlight) {
      return inFlight;
    }

    inFlight = load()
      .then(writeCache)
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  }

  function refreshInBackground(): void {
    void refresh().catch((error) => {
      console.error(`Failed to refresh ${debugLabel} in background`, error);
    });
  }

  async function get(): Promise<T> {
    const now = Date.now();

    if (cache) {
      if (cache.expiresAt > now) {
        return cache.value;
      }

      refreshInBackground();
      return cache.value;
    }

    if (inFlight) {
      return inFlight;
    }

    return refresh();
  }

  function warm(): void {
    void get().catch((error) => {
      console.error(`Failed to warm ${debugLabel} on startup`, error);
    });
  }

  function startAutoRefresh(intervalMs = ttlMs): void {
    if (refreshTimer) {
      return;
    }

    refreshTimer = setInterval(() => {
      refreshInBackground();
    }, intervalMs);

    refreshTimer.unref?.();
  }

  return {
    get,
    warm,
    startAutoRefresh,
  };
}
