// Browser requests use our own cached backend; they do not directly poll Spotify.
const POLL_INTERVAL_MS = 30_000;
const RETRY_INTERVAL_MS = 10_000;

type PollingOptions<T> = {
  load: (signal: AbortSignal) => Promise<T>;
  onSuccess: (value: T) => void;
  onError: () => void;
};

export function startSpotifyPolling<T>({ load, onSuccess, onError }: PollingOptions<T>): () => void {
  let disposed = false;
  let timeoutId: number | undefined;
  let currentController: AbortController | null = null;

  function schedule(delay: number) {
    window.clearTimeout(timeoutId);
    if (!disposed && !document.hidden) {
      timeoutId = window.setTimeout(() => void refresh(), delay);
    }
  }

  async function refresh() {
    if (disposed || document.hidden || currentController) return;

    const controller = new AbortController();
    currentController = controller;
    let nextDelay = POLL_INTERVAL_MS;
    try {
      const value = await load(controller.signal);
      if (disposed || controller.signal.aborted) return;
      onSuccess(value);
    } catch {
      if (disposed || controller.signal.aborted) return;
      nextDelay = RETRY_INTERVAL_MS;
      onError();
    } finally {
      if (currentController === controller) currentController = null;
      if (!disposed) schedule(controller.signal.aborted ? 0 : nextDelay);
    }
  }

  function handleVisibilityChange() {
    window.clearTimeout(timeoutId);
    if (document.hidden) {
      currentController?.abort();
    } else if (currentController) {
      schedule(1_000);
    } else {
      void refresh();
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  if (!document.hidden) void refresh();
  return () => {
    disposed = true;
    window.clearTimeout(timeoutId);
    currentController?.abort();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
