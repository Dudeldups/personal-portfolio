# Spotify persistent fallback: VPS migration procedure

This is a deployment checklist, not an instruction to deploy now. The production
Compose file is not tracked. Make a protected backup of the actual file, inspect
its service name, image, environment, networking, mounts and runtime UID, and
preserve all existing settings. Never copy or publish its secrets. The examples
below assume the old container uses the PR #2 cache behavior (stale data expires
at TTL + 15 minutes). If the deployed version is unknown or uses different cache
semantics, do not apply the timestamp estimate below; inspect the deployment first.

**Do not stop or remove the old container before checking its API and capturing a
valid snapshot.** If the old process is already gone or the API does not return a
valid track, its RAM cannot be recovered by this procedure. A fresh successful
Spotify response is then required before a persistent fallback can be seeded.

1. While the old container is still running, inspect the response locally inside
   that container. The command below never prints credentials. It writes a private
   candidate file on the host and validates its content. Replace only the container
   name after verifying it with `docker ps`. The command makes one ordinary request
   to the existing local API, which may trigger its normal Spotify refresh.

   ```sh
   OLD_CONTAINER=personal-portfolio
   umask 077
   SEED_FILE="$(mktemp "${TMPDIR:-/tmp}/spotify-seed.XXXXXXXX")"
   if ! docker exec "$OLD_CONTAINER" node -e '
   (async () => {
     const r = await fetch("http://127.0.0.1:4000/api/spotify/recent-track", {signal: AbortSignal.timeout(12000)});
     if (!r.ok) throw Error(`old API status ${r.status}`);
     const x = await r.json();
     const u = new URL(x.url);
     if (typeof x.title !== "string" || !x.title || x.title.length > 500 ||
         typeof x.artists !== "string" || !x.artists || x.artists.length > 500 ||
         u.protocol !== "https:" || u.hostname !== "open.spotify.com" ||
         u.username || u.password || u.port || u.href.length > 2048 || !/^\/track\/[a-zA-Z0-9]+\/?$/.test(u.pathname)) throw Error("invalid track");
     const ttl = Number(process.env.SPOTIFY_CACHE_TTL_MS || 120000);
     if (!Number.isSafeInteger(ttl) || ttl <= 0 || ttl + 910000 >= 86400000) throw Error("TTL cannot establish a safe snapshot age");
     // PR #2 serves cached tracks for at most TTL + 15 minutes. Use an older
     // conservative bound, not the migration time, as the snapshot fetch time.
     const fetchedAt = Date.now() - ttl - 910000;
     const t = { title: x.title, artists: x.artists, url: u.href, isPlaying: false, stale: true };
     if (typeof x.album === "string" && x.album.length > 0 && x.album.length <= 500) t.album = x.album;
     if (typeof x.playedAt === "string" && Number.isFinite(Date.parse(x.playedAt)) && Date.parse(x.playedAt) <= Date.now() + 60000) t.playedAt = x.playedAt;
     if (typeof x.observedAt === "string" && Number.isFinite(Date.parse(x.observedAt)) && Date.parse(x.observedAt) <= fetchedAt) t.observedAt = x.observedAt;
     process.stdout.write(JSON.stringify({ version: 1, fetchedAt, track: t }));
   })().catch(e => { console.error(e.message); process.exitCode = 1; });
   ' > "$SEED_FILE"; then
     rm -f -- "$SEED_FILE"
     echo 'No trustworthy snapshot captured; keep the old container and investigate.' >&2
     unset SEED_FILE
   else
     echo "Candidate saved privately at $SEED_FILE; inspect it locally before continuing."
   fi
   ```

   If the capture failed or `SEED_FILE` is unset, stop here and investigate.
   `fetchedAt` is a conservative lower bound based on PR #2's maximum cache age,
   not a claim that Spotify was contacted at the migration time. The original
   `playedAt` is preserved when supplied. No playback or observation time is invented.
   The 24-hour expiry can therefore occur slightly earlier after migration.

2. Add `SPOTIFY_LAST_KNOWN_FILE: /app/data/spotify-last-known.json` to the existing
   service environment and mount a named volume at `/app/data`. Merge these entries
   with existing environment and mounts; do not replace the production Compose file.
   If the file already defines the volume, use that actual name instead of creating
   another. Render and inspect the merged configuration privately with
   `docker compose config` (its output may contain secrets; do not publish it).

   ```yaml
   # additions to the existing service, preserving its other settings
   environment:
     SPOTIFY_LAST_KNOWN_FILE: /app/data/spotify-last-known.json
   volumes:
     - spotify-last-known:/app/data
   # merge this into the existing top-level volumes mapping
   volumes:
     spotify-last-known:
       name: portfolio-spotify-last-known
   ```

3. Prepare the named volume **before** replacing the old container. The sample
   image runs as root; if production overrides `user:`, use an appropriate UID/GID
   and verify directory/file access rather than weakening permissions. The next
   command refuses to overwrite an existing snapshot. `node:22-alpine` must already
   be locally available or be fetched through the normal deployment process.
   Continue only if `SEED_FILE` is set and the candidate was inspected.

   ```sh
   VOLUME=portfolio-spotify-last-known
   docker volume create "$VOLUME"
   docker run --rm --network none --user 0 \
     --mount "type=volume,source=$VOLUME,target=/data" \
     --mount "type=bind,source=$SEED_FILE,target=/seed,readonly" \
     --entrypoint node node:22-alpine -e '
       const fs = require("fs");
       fs.copyFileSync("/seed", "/data/spotify-last-known.json", fs.constants.COPYFILE_EXCL);
       fs.chmodSync("/data/spotify-last-known.json", 0o600);
     '
   ```

   If a snapshot already exists, the copy fails without replacing it. Inspect its
   age and validity; do not overwrite a potentially newer valid snapshot blindly.
   Remove the private candidate file (`rm -f -- "$SEED_FILE"`) when finished.

4. Review the resolved Compose configuration, the seed and read/write permissions.
   Only then follow the existing, separately authorized deployment procedure to
   recreate the service. Afterwards, verify the mount and API response, and inspect
   sanitized Spotify logs. A saved track is returned as `stale: true` and never as
   currently playing. Do not disrupt production networking to force a failure test.
   The isolated Docker test in the PR exercises 503, 429 and recreation instead.

The snapshot is temporary. The 24-hour limit is this project's choice; Spotify's
terms do not specify that exact duration, so it is not a legal determination. After 24 hours without a successful track refresh it is
no longer served and is removed while the backend runs, or on its next startup if
it was stopped at expiry. See Spotify's [Developer Terms](https://developer.spotify.com/terms).
