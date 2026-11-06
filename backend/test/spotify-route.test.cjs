const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.GITHUB_ACCESS_TOKEN = 'test';
process.env.SPOTIFY_CLIENT_ID = 'test';
process.env.SPOTIFY_CLIENT_SECRET = 'test';
process.env.SPOTIFY_REFRESH_TOKEN = 'test';
process.env.SPOTIFY_CACHE_TTL_MS = '1000';

// Exercise the real Express route without opening a network listener.
const router = require('../dist/routes/spotify').default;
const handler = router.stack.find(layer => layer.route?.path === '/recent-track').route.stack[0].handle;
async function request() {
  const result = { status: 200 };
  const res = {
    status(code) { result.status = code; return this; },
    json(body) { result.body = body; return this; },
  };
  await handler({}, res);
  return result;
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('route distinguishes rate limiting, empty results and tracks; tokens and requests are shared', async t => {
  const originalFetch = global.fetch, originalNow = Date.now, originalWarn = console.warn;
  t.after(() => { global.fetch = originalFetch; Date.now = originalNow; console.warn = originalWarn; });
  let now = 1_000_000, tokenCalls = 0, currentCalls = 0, recentCalls = 0;
  let mode = 'limited';
  Date.now = () => now; console.warn = () => {};
  global.fetch = async url => {
    if (url.includes('/api/token')) {
      tokenCalls++;
      return Response.json({ access_token: `token-${tokenCalls}`, expires_in: 3600 });
    }
    if (url.includes('currently-playing')) {
      currentCalls++;
      if (mode === 'limited') return new Response('', { status: 429, headers: { 'Retry-After': '300' } });
      if (mode === 'playing') return Response.json({ is_playing: true, currently_playing_type: 'track', item: { name: 'Song', artists: [{ name: 'Artist' }], external_urls: { spotify: 'https://open.spotify.com/track/1' } } });
      return new Response(null, { status: 204 });
    }
    recentCalls++;
    return Response.json({ items: [] });
  };
  const [first, concurrent] = await Promise.all([request(), request()]);
  assert.deepEqual(first, { status: 503, body: { message: 'Spotify status temporarily unavailable' } });
  assert.deepEqual(concurrent, first);
  assert.equal(tokenCalls, 1); assert.equal(currentCalls, 1);
  for (let i = 0; i < 5; i++) assert.deepEqual(await request(), first);
  now += 299_999;
  assert.deepEqual(await request(), first); assert.equal(currentCalls, 1);
  now += 1; mode = 'empty';
  assert.deepEqual(await request(), { status: 200, body: { status: 'empty' } });
  assert.equal(recentCalls, 1); assert.equal(tokenCalls, 1);
  assert.deepEqual(await request(), { status: 200, body: { status: 'empty' } });
  assert.equal(recentCalls, 1);
  now += 1001; mode = 'playing';
  // A visitor waits for the quick Spotify refresh, rather than seeing stale 503.
  const playing = await request();
  assert.equal(playing.status, 200); assert.equal(playing.body.title, 'Song');
  assert.equal(playing.body.isPlaying, true); assert.equal(tokenCalls, 1);
  now += 3_600_000;
  await request(); await flush();
  assert.equal(tokenCalls, 2);
});
