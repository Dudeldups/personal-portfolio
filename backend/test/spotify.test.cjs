const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
process.env.GITHUB_ACCESS_TOKEN = 'test';
process.env.SPOTIFY_CLIENT_ID = 'test';
process.env.SPOTIFY_CLIENT_SECRET = 'test';
process.env.SPOTIFY_REFRESH_TOKEN = 'test';
const { createSpotifyCache } = require('../dist/features/spotify/spotifyCache');
const { SpotifyRequestError, getSpotifyRecentlyPlayed, getSpotifyCurrentlyPlaying, refreshSpotifyAccessToken } = require('../dist/features/spotify/api');
const originalNow = Date.now;
const originalFetch = global.fetch;
const originalWarn = console.warn;
afterEach(() => { Date.now = originalNow; global.fetch = originalFetch; console.warn = originalWarn; });
const track = { title: 'Song', artists: 'Artist', url: 'https://open.spotify.com/track/1', isPlaying: true };
const flush = () => new Promise(resolve => setImmediate(resolve));

test('successful requests are cached, deduplicated and stale data is marked until it expires', async () => {
  let now = 100000, calls = 0, resolve;
  Date.now = () => now;
  const cache = createSpotifyCache({ ttlMs: 1000, refreshWaitMs: 10, load: () => { calls++; return new Promise(r => { resolve = r; }); } });
  const a = cache.get(), b = cache.get();
  await flush();
  assert.equal(calls, 1);
  resolve(track);
  const observed = { ...track, observedAt: new Date(now).toISOString() };
  assert.deepEqual(await a, { status: "available", track: observed }); assert.deepEqual(await b, { status: "available", track: observed });
  assert.deepEqual(await cache.get(), { status: "available", track: observed }); assert.equal(calls, 1);
  now += 1001;
  assert.deepEqual(await cache.get(), { status: "available", track: { ...observed, isPlaying: false, stale: true } });
  await flush(); assert.equal(calls, 2);
  now += 15 * 60_000;
  // Previously known tracks remain visible and correctly stale even during long outages.
  assert.equal((await cache.get()).status, "available");
  resolve(track); await flush();
});

test('429 Retry-After blocks requests and logs once per attempt', async () => {
  let now = 100000, calls = 0, logs = 0;
  Date.now = () => now; console.warn = () => logs++;
  const cache = createSpotifyCache({ ttlMs: 1000, load: async () => { calls++; throw new SpotifyRequestError('recent track', 429, 300000); } });
  assert.deepEqual(await cache.get(), { status: "unavailable" });
  for (let i = 0; i < 10; i++) assert.deepEqual(await cache.get(), { status: "unavailable" });
  assert.equal(calls, 1); assert.equal(logs, 1);
  now += 300001; await cache.get(); assert.equal(calls, 2);
});

test('temporary and authorization errors back off and can recover', async () => {
  let now = 100000, calls = 0;
  Date.now = () => now; console.warn = () => {};
  const cache = createSpotifyCache({ ttlMs: 1000, load: async () => { calls++; if (calls === 1) throw new Error('network'); if (calls === 2) throw new SpotifyRequestError('token refresh', 401); return track; } });
  assert.deepEqual(await cache.get(), { status: "unavailable" }); now += 60001;
  assert.deepEqual(await cache.get(), { status: "unavailable" }); now += 60001;
  assert.deepEqual(await cache.get(), { status: "unavailable" }); assert.equal(calls, 2);
  now += 3600000; const restored = await cache.get(); assert.equal(restored.status, 'available'); assert.equal(restored.track.title, track.title); assert.equal(restored.track.isPlaying, true); assert.equal(calls, 3);
});

test('Spotify responses handle success, 204, 429 and token errors without exposing response bodies', async () => {
  global.fetch = async () => new Response(JSON.stringify({ items: [] }), { status: 200 });
  assert.deepEqual(await getSpotifyRecentlyPlayed('token'), { items: [] });
  global.fetch = async () => new Response(null, { status: 204 });
  assert.equal(await getSpotifyCurrentlyPlaying('token'), null);
  global.fetch = async () => new Response('secret', { status: 429, headers: { 'Retry-After': '180' } });
  await assert.rejects(getSpotifyRecentlyPlayed('token'), e => e.status === 429 && e.retryAfterMs === 180000 && !e.message.includes('secret'));
  global.fetch = async () => new Response('{}', { status: 401 });
  await assert.rejects(refreshSpotifyAccessToken(), e => e.status === 401 && e.operation === 'token refresh');
});


test('successful empty results are cached and become unavailable when stale', async () => {
  let now = 100000, calls = 0;
  Date.now = () => now;
  let resolve;
  const cache = createSpotifyCache({ ttlMs: 1000, refreshWaitMs: 10, load: () => { calls++; return calls === 1 ? Promise.resolve(null) : new Promise(r => { resolve = r; }); } });
  assert.deepEqual(await cache.get(), { status: 'empty' });
  assert.deepEqual(await cache.get(), { status: 'empty' });
  assert.equal(calls, 1);
  now += 1001;
  assert.deepEqual(await cache.get(), { status: 'unavailable' });
  await flush();
  resolve(null); await flush();
  assert.deepEqual(await cache.get(), { status: 'empty' });
});


test('expired cache awaits a quick refresh and shares it across visitors', async () => {
  let now = 100000, calls = 0, finish;
  Date.now = () => now;
  const freshTrack = { ...track, title: 'New song', playedAt: '2026-11-06T18:00:00Z', isPlaying: false };
  const cache = createSpotifyCache({
    ttlMs: 1000,
    load: () => {
      calls++;
      return calls === 1 ? Promise.resolve(track) : new Promise(resolve => { finish = resolve; });
    },
  });
  const firstResult = await cache.get(); assert.equal(firstResult.status, 'available'); assert.equal(firstResult.track.title, track.title);
  now += 1001;
  // A stored track is returned immediately while one shared refresh runs.
  const first = await cache.get(), second = await cache.get();
  assert.equal(first.status, 'available');
  assert.equal(first.track.stale, true);
  assert.deepEqual(second, first);
  await flush();
  assert.equal(calls, 2);
  finish(freshTrack);
  await flush();
  const updated = await cache.get();
  assert.equal(updated.status, 'available');
  assert.equal(updated.track.title, 'New song');
  assert.equal(updated.track.stale, undefined);
  assert.equal(calls, 2);
});

test('bounded wait keeps stale playback timestamp and accepts a late refresh immediately', async () => {
  let now = 100000, calls = 0, finish;
  Date.now = () => now;
  const oldTrack = { ...track, playedAt: '2026-11-06T17:00:00Z' };
  const updated = { ...oldTrack, title: 'Updated song', playedAt: '2026-11-06T18:00:00Z' };
  const cache = createSpotifyCache({
    ttlMs: 1000,
    refreshWaitMs: 10,
    load: () => {
      calls++;
      return calls === 1 ? Promise.resolve(oldTrack) : new Promise(resolve => { finish = resolve; });
    },
  });
  await cache.get();
  now += 1001;
  const lastKnown = await cache.get();
  assert.equal(lastKnown.status, 'available');
  assert.equal(lastKnown.track.playedAt, oldTrack.playedAt);
  assert.equal(lastKnown.track.isPlaying, false);
  assert.equal(lastKnown.track.stale, true);
  assert.equal(calls, 2);
  finish(updated);
  await flush();
  const fresh = await cache.get();
  assert.equal(fresh.status, 'available');
  assert.equal(fresh.track.title, 'Updated song');
  assert.equal(fresh.track.stale, undefined);
  assert.equal(calls, 2);
});

test('429 cooldown returns a timestamped stale fallback without extra upstream attempts', async () => {
  let now = 100000, calls = 0;
  Date.now = () => now;
  console.warn = () => {};
  const oldTrack = { ...track, playedAt: '2026-11-06T17:00:00Z' };
  const cache = createSpotifyCache({
    ttlMs: 1000,
    load: async () => {
      calls++;
      if (calls === 1) return oldTrack;
      throw new SpotifyRequestError('currently playing', 429, 300000);
    },
  });
  await cache.get();
  now += 1001;
  assert.deepEqual(await cache.get(), {
    status: 'available',
    track: { ...oldTrack, isPlaying: false, stale: true },
  });
  for (let i = 0; i < 5; i++) await cache.get();
  assert.equal(calls, 2);
  now += 299999;
  await cache.get();
  assert.equal(calls, 2);
});

test('cold cache times out, shares the pending request and retains its late result', async () => {
  let calls = 0, finish;
  const cache = createSpotifyCache({
    ttlMs: 60000, refreshWaitMs: 10,
    load: () => { calls++; return new Promise(resolve => { finish = resolve; }); },
  });
  const [first, second] = await Promise.all([cache.get(), cache.get()]);
  assert.deepEqual(first, { status: 'unavailable' });
  assert.deepEqual(second, { status: 'unavailable' });
  assert.equal(calls, 1);
  finish(track); await flush();
  const last = await cache.get(); assert.equal(last.status, 'available'); assert.equal(last.track.title, track.title);
  assert.equal(calls, 1);
});
