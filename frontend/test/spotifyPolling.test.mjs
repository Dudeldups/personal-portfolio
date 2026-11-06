import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { startSpotifyPolling } from '../src/components/Updates/spotifyPolling.ts';

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
afterEach(() => { globalThis.window = originalWindow; globalThis.document = originalDocument; });
const flush = () => new Promise(resolve => setImmediate(resolve));
function environment() {
  let id = 0;
  const timers = new Map(), listeners = new Set();
  globalThis.window = {
    setTimeout(fn, delay) { timers.set(++id, { fn, delay }); return id; },
    clearTimeout(key) { timers.delete(key); },
  };
  globalThis.document = {
    hidden: false,
    addEventListener(name, fn) { assert.equal(name, 'visibilitychange'); listeners.add(fn); },
    removeEventListener(name, fn) { listeners.delete(fn); },
  };
  return {
    timers, listeners,
    visible(value) { document.hidden = !value; for (const fn of listeners) fn(); },
    fire(delay) {
      const entry = [...timers].find(([, timer]) => timer.delay === delay);
      assert.ok(entry, `expected ${delay}ms timer`);
      timers.delete(entry[0]); entry[1].fn();
    },
  };
}

test('failure schedules retry and recovers without a manual reload', async () => {
  const env = environment(), updates = [];
  let calls = 0;
  const stop = startSpotifyPolling({
    load: async () => { calls++; if (calls === 1) throw new Error('503'); return 'track'; },
    onSuccess: value => updates.push(value), onError: () => updates.push('error'),
  });
  await flush(); assert.deepEqual(updates, ['error']);
  env.fire(10_000); await flush();
  assert.deepEqual(updates, ['error', 'track']); assert.equal(calls, 2);
  assert.equal([...env.timers.values()][0].delay, 30_000);
  stop(); assert.equal(env.timers.size, 0); assert.equal(env.listeners.size, 0);
});

test('hiding aborts pending requests; showing deduplicates until the aborted request settles', async () => {
  const env = environment(), pending = [], updates = [];
  const stop = startSpotifyPolling({
    load: signal => new Promise((resolve, reject) => pending.push({ signal, resolve, reject })),
    onSuccess: value => updates.push(value), onError: () => updates.push('error'),
  });
  assert.equal(pending.length, 1);
  env.visible(false); assert.equal(pending[0].signal.aborted, true);
  env.visible(true); env.fire(1000); assert.equal(pending.length, 1);
  pending[0].resolve('obsolete'); await flush();
  assert.deepEqual(updates, []); env.fire(0); assert.equal(pending.length, 2);
  pending[1].resolve('fresh'); await flush(); assert.deepEqual(updates, ['fresh']);
  env.visible(false); assert.equal(env.timers.size, 0);
  env.visible(true); assert.equal(pending.length, 3);
  stop(); assert.equal(pending[2].signal.aborted, true);
  pending[2].resolve('after unmount'); await flush();
  assert.deepEqual(updates, ['fresh']); assert.equal(env.timers.size, 0); assert.equal(env.listeners.size, 0);
});

test('initially hidden tabs make no request until visible', async () => {
  const env = environment(); document.hidden = true; let calls = 0;
  const stop = startSpotifyPolling({ load: async () => { calls++; return null; }, onSuccess: () => {}, onError: () => {} });
  assert.equal(calls, 0); env.visible(true); await flush(); assert.equal(calls, 1); stop();
});
