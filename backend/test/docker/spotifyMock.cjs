const fs = require('node:fs');
const file = '/app/data/test-control.json';
const realNow = Date.now;
const get = () => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return { mode: 'ok', offset: 0, calls: 0, title: 'First track' }; } };
const put = value => fs.writeFileSync(file, JSON.stringify(value));
Date.now = () => realNow() + get().offset;
const originalFetch = global.fetch;
global.fetch = async (input, options) => {
  const url = String(input);
  if (url.startsWith('http://127.0.0.1:')) return originalFetch(input, options);
  if (url.includes('api.github.com')) return Response.json({ message: 'mocked' }, { status: 503 });
  if (!url.includes('spotify.com')) throw new Error('Unexpected network request blocked');
  const config = get(); config.calls++; put(config);
  if (url.includes('/api/token')) return Response.json({ access_token: 'test', expires_in: 3600 });
  if (config.mode === '503') return Response.json({}, { status: 503 });
  if (config.mode === '429') return Response.json({}, { status: 429, headers: { 'Retry-After': '90' } });
  if (url.includes('currently-playing')) return new Response(null, { status: 204 });
  return Response.json({ items: [{ played_at: '2026-11-07T10:30:00.000Z', track: { name: config.title, artists: [{ name: 'Mock artist' }], external_urls: { spotify: 'https://open.spotify.com/track/123abc' } } }] });
};
if (require.main === module) {
  const action = process.argv[2];
  if (action === 'set') { const c = get(); c.mode = process.argv[3]; c.offset = Number(process.argv[4]); c.title = process.argv[5] || c.title; put(c); console.log(JSON.stringify(c)); }
  if (action === 'control') console.log(JSON.stringify(get()));
  if (action === 'snapshot') { try { console.log(fs.readFileSync('/app/data/spotify-last-known.json', 'utf8')); } catch { console.log('null'); } }
  if (action === 'request') fetch('http://127.0.0.1:4000/api/spotify/recent-track').then(async r => console.log(JSON.stringify({ status: r.status, body: await r.json() }))).catch(e => { console.error(e.message); process.exitCode = 1; });
}
