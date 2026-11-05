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
  const cache = createSpotifyCache({ ttlMs: 1000, load: () => { calls++; return new Promise(r => { resolve = r; }); } });
  const a = cache.get(), b = cache.get();
  await flush();
  assert.equal(calls, 1);
  resolve(track);
  assert.deepEqual(await a, track); assert.deepEqual(await b, track);
  assert.deepEqual(await cache.get(), track); assert.equal(calls, 1);
  now += 1001;
  assert.deepEqual(await cache.get(), { ...track, isPlaying: false, stale: true });
  await flush(); assert.equal(calls, 2);
  now += 15 * 60_000;
  assert.equal(await cache.get(), null);
  resolve(track); await flush();
});

test('429 Retry-After blocks requests and logs once per attempt', async () => {
  let now = 100000, calls = 0, logs = 0;
  Date.now = () => now; console.warn = () => logs++;
  const cache = createSpotifyCache({ ttlMs: 1000, load: async () => { calls++; throw new SpotifyRequestError('recent track', 429, 300000); } });
  assert.equal(await cache.get(), null);
  for (let i = 0; i < 10; i++) assert.equal(await cache.get(), null);
  assert.equal(calls, 1); assert.equal(logs, 1);
  now += 300001; await cache.get(); assert.equal(calls, 2);
});

test('temporary and authorization errors back off and can recover', async () => {
  let now = 100000, calls = 0;
  Date.now = () => now; console.warn = () => {};
  const cache = createSpotifyCache({ ttlMs: 1000, load: async () => { calls++; if (calls === 1) throw new Error('network'); if (calls === 2) throw new SpotifyRequestError('token refresh', 401); return track; } });
  assert.equal(await cache.get(), null); now += 60001;
  assert.equal(await cache.get(), null); now += 60001;
  assert.equal(await cache.get(), null); assert.equal(calls, 2);
  now += 3600000; assert.deepEqual(await cache.get(), track); assert.equal(calls, 3);
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
