const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.GITHUB_ACCESS_TOKEN = 'test';
process.env.SPOTIFY_CLIENT_ID = 'test';
process.env.SPOTIFY_CLIENT_SECRET = 'test';
process.env.SPOTIFY_REFRESH_TOKEN = 'test';
const router = require('../dist/routes/spotify').default;
const handler = router.stack.find(layer => layer.route?.path === '/recent-track').route.stack[0].handle;

test('invalid Spotify track URLs never become clickable fresh tracks', async t => {
  const originalFetch = global.fetch;
  t.after(() => { global.fetch = originalFetch; });
  const bad = { name: 'Song', artists: [{ name: 'Artist' }], external_urls: { spotify: 'https://user@open.spotify.com/track/123' } };
  global.fetch = async url => {
    if (url.includes('/api/token')) return Response.json({ access_token: 'test', expires_in: 3600 });
    if (url.includes('currently-playing')) return Response.json({ is_playing: true, currently_playing_type: 'track', item: bad });
    return Response.json({ items: [{ track: bad }] });
  };
  let body; let status = 200;
  const res = { status(value) { status = value; return this; }, json(value) { body = value; return this; } };
  await handler({}, res);
  assert.equal(status, 200);
  assert.deepEqual(body, { status: 'empty' });
});
