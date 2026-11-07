import { mkdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname } from "node:path";
import type { SpotifyRecentTrack } from "./types";

export type SpotifySnapshot = {
  track: SpotifyRecentTrack;
  fetchedAt: number;
};

const MAX_SNAPSHOT_BYTES = 16_384;
export const MAX_SNAPSHOT_AGE_MS = 24 * 60 * 60_000;

function validText(value: unknown, maxLength = 500): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

function validDate(value: unknown): value is string {
  return typeof value === "string" &&
    Number.isFinite(Date.parse(value)) &&
    value.length <= 64 && Date.parse(value) <= Date.now() + 60_000;
}

export function isSpotifyTrackUrl(value: unknown): value is string {
  if (!validText(value, 2048)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "open.spotify.com" &&
      !url.username && !url.password && !url.port &&
      /^\/track\/[a-zA-Z0-9]+\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}

function normalizeTrack(value: unknown): SpotifyRecentTrack | null {
  if (!value || typeof value !== "object") return null;
  const track = value as Record<string, unknown>;

  if (!validText(track.title) || !validText(track.artists) || !validText(track.url, 2048)) {
    return null;
  }

  if (!isSpotifyTrackUrl(track.url)) return null;

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
  if (!filename) return null;
  try {
    if (statSync(filename).size > MAX_SNAPSHOT_BYTES) throw new Error("snapshot too large");
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
    if (Date.now() - snapshot.fetchedAt >= MAX_SNAPSHOT_AGE_MS) {
      try { unlinkSync(filename); } catch { console.warn("Expired Spotify snapshot could not be removed"); }
      return null;
    }
    return { track, fetchedAt: snapshot.fetchedAt };
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return null;
    console.warn("Spotify last-known snapshot invalid or unreadable; ignoring it");
    return null;
  }
}

export function saveSpotifySnapshot(
  filename: string | undefined,
  snapshot: SpotifySnapshot,
): void {
  if (!filename) return;
  const tempFile = filename + "." + process.pid + "." + randomUUID() + ".tmp";
  try {
    const safeTrack = normalizeTrack(snapshot.track);
    if (!safeTrack || !Number.isFinite(snapshot.fetchedAt) || snapshot.fetchedAt <= 0 ||
        snapshot.fetchedAt > Date.now() + 60_000 || Date.now() - snapshot.fetchedAt >= MAX_SNAPSHOT_AGE_MS) {
      throw new Error("invalid snapshot");
    }
    mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
    // Atomic replacement avoids partially written JSON across process restarts.
    writeFileSync(tempFile, JSON.stringify({
      version: 1,
      fetchedAt: snapshot.fetchedAt,
      track: safeTrack,
    }), { encoding: "utf8", mode: 0o600, flag: "wx" });
    renameSync(tempFile, filename);
  } catch {
    console.warn("Spotify last-known snapshot could not be saved");
    try { unlinkSync(tempFile); } catch { /* may not exist */ }
  }
}
