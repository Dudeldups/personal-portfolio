const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');

process.env.GITHUB_ACCESS_TOKEN = 'test';
process.env.SPOTIFY_CLIENT_ID = 'test';
process.env.SPOTIFY_CLIENT_SECRET = 'test';
process.env.SPOTIFY_REFRESH_TOKEN = 'test';

const { createSpotifyCache } = require('../dist/features/spotify/spotifyCache');
const { loadSpotifySnapshot, saveSpotifySnapshot } = require('../dist/features/spotify/spotifySnapshot');
const { SpotifyRequestError } = require('../dist/features/spotify/api');
const dirs = [];
afterEach(() => { for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true }); });
const flush = () => new Promise(resolve => setImmediate(resolve));

function file() {
  const dir = mkdtempSync(join(tmpdir(), 'spotify-snapshot-'));
  dirs.push(dir);
  return join(dir, 'data', 'last-track.json');
}

const track = {
  title: 'Example',
  artists: 'Example Artist',
  playedAt: '2026-11-06T19:20:00Z',
  url: 'https://open.spotify.com/track/123abc',
  isPlaying: false,
};

test('a successful refresh persists a snapshot and survives simulated container replacement', async () => {
  const filename = file();
  const initial = createSpotifyCache({
    ttlMs: 120000,
    load: async () => track,
    onSuccessfulTrack: snapshot => saveSpotifySnapshot(filename, snapshot),
  });
  const current = await initial.get();
  assert.equal(current.status, 'available');
  assert.equal(current.track.title, track.title);
  assert.ok(current.track.observedAt);
  const raw = JSON.parse(readFileSync(filename, 'utf8'));
  assert.equal(raw.version, 1);
  assert.equal(raw.track.title, track.title);
  assert.equal(raw.track.isPlaying, false);
  assert.equal(raw.track.stale, true);

  // Simulate the next container booting when Spotify is rate-limited.
  let attempted = 0;
  const recovered = createSpotifyCache({
    ttlMs: 120000,
    initialLastKnown: loadSpotifySnapshot(filename),
    load: async () => { attempted++; throw new SpotifyRequestError('currently playing', 429, 300000); },
  });
  const previousWarn = console.warn;
  console.warn = () => {};
  try {
    const result = await recovered.get();
    assert.equal(result.status, 'available');
    assert.equal(result.track.title, track.title);
    assert.equal(result.track.playedAt, track.playedAt);
    assert.equal(result.track.stale, true);
    assert.equal(result.track.isPlaying, false);
    await flush();
    assert.equal(attempted, 1);
    const fallback = await recovered.get();
    assert.equal(fallback.status, 'available');
    assert.equal(fallback.track.title, track.title);
    assert.equal(attempted, 1);
  } finally {
    console.warn = previousWarn;
  }
});

test('a last-known snapshot remains usable long after normal cache expiry', async () => {
  const filename = file();
  const veryOld = Date.now() - 60 * 60_000;
  saveSpotifySnapshot(filename, { track, fetchedAt: veryOld });
  let resolve;
  const recovered = createSpotifyCache({
    ttlMs: 120000,
    initialLastKnown: loadSpotifySnapshot(filename),
    load: () => new Promise(r => { resolve = r; }),
  });
  const result = await recovered.get();
  assert.equal(result.status, 'available');
  assert.equal(result.track.stale, true);
  assert.equal(result.track.isPlaying, false);
  await flush();
  resolve(null);
  await flush();
});

test('current playback without a playedAt time is persisted with an observation time', async () => {
  const filename = file();
  const cache = createSpotifyCache({
    ttlMs: 120000,
    load: async () => ({ ...track, isPlaying: true, playedAt: undefined }),
    onSuccessfulTrack: snapshot => saveSpotifySnapshot(filename, snapshot),
  });
  const result = await cache.get();
  assert.equal(result.status, 'available');
  assert.equal(result.track.isPlaying, true);
  assert.equal(result.track.playedAt, undefined);
  const snapshot = loadSpotifySnapshot(filename);
  assert.ok(snapshot.track.observedAt);
  assert.equal(snapshot.track.isPlaying, false);
  assert.equal(snapshot.track.playedAt, undefined);
});

test('invalid, corrupted or non-Spotify snapshots cannot become public track links', () => {
  const filename = file();
  assert.equal(loadSpotifySnapshot(filename), null);
  const previousWarn = console.warn;
  console.warn = () => {};
  try {
    mkdirSync(dirname(filename), { recursive: true });
    writeFileSync(filename, '{invalid');
    assert.equal(loadSpotifySnapshot(filename), null);
    saveSpotifySnapshot(filename, {
      track: { ...track, url: 'https://evil.example/track/123' },
      fetchedAt: Date.now(),
    });
    assert.equal(loadSpotifySnapshot(filename), null);
  } finally {
    console.warn = previousWarn;
  }
});

test('expired snapshots are deleted and not served; a recent snapshot is still usable', () => {
  const filename = file();
  mkdirSync(dirname(filename), { recursive: true });
  writeFileSync(filename, JSON.stringify({ version: 1, fetchedAt: Date.now() - 24 * 60 * 60_000, track }));
  assert.equal(loadSpotifySnapshot(filename), null);
  assert.equal(require('node:fs').existsSync(filename), false);
  saveSpotifySnapshot(filename, { track, fetchedAt: Date.now() });
  assert.ok(loadSpotifySnapshot(filename));
});

test('snapshots reject credential-bearing and nonstandard-port URLs and do not serialize extra fields', () => {
  const filename = file();
  const warn = console.warn; console.warn = () => {};
  try {
    for (const url of ['https://user:pass@open.spotify.com/track/123', 'https://open.spotify.com:8443/track/123']) {
      saveSpotifySnapshot(filename, { track: { ...track, url }, fetchedAt: Date.now() });
      assert.equal(loadSpotifySnapshot(filename), null);
    }
    saveSpotifySnapshot(filename, { track: { ...track, secret: 'do-not-save' }, fetchedAt: Date.now() });
    assert.doesNotMatch(readFileSync(filename, 'utf8'), /do-not-save/);
  } finally { console.warn = warn; }
});

test('expired in-memory last-known data does not survive indefinitely', async () => {
  const cache = createSpotifyCache({
    ttlMs: 1000, refreshWaitMs: 1,
    initialLastKnown: { track, fetchedAt: Date.now() - 24 * 60 * 60_000 },
    load: async () => { throw new Error('offline'); },
  });
  const warn = console.warn; console.warn = () => {};
  try { assert.deepEqual(await cache.get(), { status: 'unavailable' }); }
  finally { console.warn = warn; }
});

test('successful empty Spotify response retains a prior track only as stale', async () => {
  const cache = createSpotifyCache({ ttlMs: 1000, initialLastKnown: { track, fetchedAt: Date.now() }, load: async () => null });
  const first = await cache.get(); assert.equal(first.status, 'available'); assert.equal(first.track.stale, true);
  await flush();
  const second = await cache.get(); assert.equal(second.status, 'available'); assert.equal(second.track.stale, true); assert.equal(second.track.isPlaying, false);
});

test('oversized and corrupt snapshot files are ignored', () => {
  const filename = file(); mkdirSync(dirname(filename), { recursive: true });
  const warn = console.warn; console.warn = () => {};
  try { writeFileSync(filename, 'x'.repeat(17000)); assert.equal(loadSpotifySnapshot(filename), null); }
  finally { console.warn = warn; }
});

test('failed writes do not overwrite a previously valid snapshot', () => {
  const filename = file();
  saveSpotifySnapshot(filename, { track, fetchedAt: Date.now() });
  const before = readFileSync(filename, 'utf8');
  const warn = console.warn; console.warn = () => {};
  try { saveSpotifySnapshot(filename, { track: { ...track, url: 'https://invalid.example/track/1' }, fetchedAt: Date.now() }); }
  finally { console.warn = warn; }
  assert.equal(readFileSync(filename, 'utf8'), before);
});
