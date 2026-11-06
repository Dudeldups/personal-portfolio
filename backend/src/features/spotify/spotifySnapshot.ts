import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { SpotifyRecentTrack } from "./types";

export type SpotifySnapshot = {
  track: SpotifyRecentTrack;
  fetchedAt: number;
};

const MAX_SNAPSHOT_BYTES = 16_384;

function validText(value: unknown, maxLength = 500): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

function validDate(value: unknown): value is string {
  return typeof value === "string" &&
    Number.isFinite(Date.parse(value)) &&
    value.length <= 64;
}

function normalizeTrack(value: unknown): SpotifyRecentTrack | null {
  if (!value || typeof value !== "object") return null;
  const track = value as Record<string, unknown>;

  if (!validText(track.title) || !validText(track.artists) || !validText(track.url, 2048)) {
    return null;
  }

  // Never trust a corrupted or modified snapshot as a clickable arbitrary URL.
  let url: URL;
  try {
    url = new URL(track.url);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" ||
      url.hostname !== "open.spotify.com" ||
      !/^\/track\/[a-zA-Z0-9]+\/?$/.test(url.pathname)) {
    return null;
  }

  return {
    title: track.title,
    artists: track.artists,
    url: track.url,
    ...(validText(track.album) ? { album: track.album } : {}),
    ...(validDate(track.playedAt) ? { playedAt: track.playedAt } : {}),
    ...(validDate(track.observedAt) ? { observedAt: track.observedAt } : {}),
    isPlaying: false,
    stale: true,
  };
}

export function loadSpotifySnapshot(filename: string | undefined): SpotifySnapshot | null {
  if (!filename || !existsSync(filename)) return null;
  try {
    const content = readFileSync(filename, "utf8");
    if (Buffer.byteLength(content, "utf8") > MAX_SNAPSHOT_BYTES) {
      throw new Error("snapshot too large");
    }
    const value: unknown = JSON.parse(content);
    if (!value || typeof value !== "object") throw new Error("invalid snapshot");
    const snapshot = value as Record<string, unknown>;
    const track = normalizeTrack(snapshot.track);
    if (snapshot.version !== 1 ||
        typeof snapshot.fetchedAt !== "number" ||
        !Number.isFinite(snapshot.fetchedAt) ||
        snapshot.fetchedAt <= 0 ||
        snapshot.fetchedAt > Date.now() + 60_000 ||
        !track) {
      throw new Error("invalid snapshot");
    }
    return { track, fetchedAt: snapshot.fetchedAt };
  } catch {
    console.warn("Spotify last-known snapshot invalid or unreadable; ignoring it");
    return null;
  }
}

export function saveSpotifySnapshot(
  filename: string | undefined,
  snapshot: SpotifySnapshot,
): void {
  if (!filename) return;
  const tempFile = filename + "." + process.pid + ".tmp";
  try {
    mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
    // Atomic replacement avoids partially written JSON across process restarts.
    writeFileSync(tempFile, JSON.stringify({
      version: 1,
      fetchedAt: snapshot.fetchedAt,
      track: {
        ...snapshot.track,
        isPlaying: false,
        stale: true,
      },
    }), { encoding: "utf8", mode: 0o600 });
    renameSync(tempFile, filename);
  } catch {
    console.warn("Spotify last-known snapshot could not be saved");
    try { unlinkSync(tempFile); } catch { /* may not exist */ }
  }
}
