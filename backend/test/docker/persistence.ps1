$ErrorActionPreference = 'Stop'
$volume = 'portfolio-pr3-test-' + [Guid]::NewGuid().ToString('N')
if ($volume -notmatch '^portfolio-pr3-test-[0-9a-f]{32}$') { throw 'Unexpected volume name' }
$mockPath = (Resolve-Path 'backend/test/docker/spotifyMock.cjs').Path
$image = 'personal-portfolio-spotify-persistence-test'
$id = $null
function Start-TestContainer {
  $result = docker run --rm -d --network none --mount "type=volume,source=$volume,target=/app/data" --mount "type=bind,source=$mockPath,target=/tmp/pr3-mock.cjs,readonly" -e NODE_OPTIONS=--require=/tmp/pr3-mock.cjs -e GITHUB_ACCESS_TOKEN=dummy -e SPOTIFY_CLIENT_ID=dummy -e SPOTIFY_CLIENT_SECRET=dummy -e SPOTIFY_REFRESH_TOKEN=dummy -e SPOTIFY_LAST_KNOWN_FILE=/app/data/spotify-last-known.json -e SPOTIFY_CACHE_TTL_MS=1000 $image
  if ($LASTEXITCODE -ne 0) { throw 'container start failed' }
  return $result.Trim()
}
function Call-Mock([string[]] $mockArgs) {
  $result = docker exec -e NODE_OPTIONS= $script:id node /tmp/pr3-mock.cjs @mockArgs
  if ($LASTEXITCODE -ne 0) { throw 'mock call failed' }
  return ($result | ConvertFrom-Json)
}
function Wait-Snapshot([string] $title) {
  for ($i=0; $i -lt 20; $i++) { $s=Call-Mock @('snapshot'); if ($null -ne $s -and $s.track.title -eq $title) { return $s }; Start-Sleep -Milliseconds 200 }
  throw "snapshot not updated: $title"
}
function Assert-Fallback($response,[string] $title) {
  if ($response.status -ne 200 -or $response.body.title -ne $title -or $response.body.stale -ne $true -or $response.body.isPlaying -ne $false -or ([DateTimeOffset]$response.body.playedAt).ToUnixTimeMilliseconds() -ne ([DateTimeOffset]'2026-11-07T10:30:00Z').ToUnixTimeMilliseconds()) { throw "invalid fallback: $($response | ConvertTo-Json -Compress)" }
}
try {
  docker volume create $volume | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'volume create failed' }
  $id = Start-TestContainer
  for ($i=0; $i -lt 20; $i++) { try { $first=Call-Mock @('request'); break } catch { Start-Sleep -Milliseconds 200 } }
  if ($first.status -ne 200 -or $first.body.title -ne 'First track') { docker logs $id; throw "initial track missing: $($first | ConvertTo-Json -Compress)" }
  $snapshot=Wait-Snapshot 'First track'
  if (([DateTimeOffset]$snapshot.track.playedAt).ToUnixTimeMilliseconds() -ne ([DateTimeOffset]'2026-11-07T10:30:00Z').ToUnixTimeMilliseconds()) { throw 'timestamp not persisted' }
  Call-Mock @('set','503','0','First track') | Out-Null
  docker stop $id | Out-Null; $id=$null
  $id = Start-TestContainer
  $timer=[Diagnostics.Stopwatch]::StartNew()
  for ($i=0; $i -lt 20; $i++) { try { $fallback=Call-Mock @('request'); break } catch { Start-Sleep -Milliseconds 200 } }
  $timer.Stop(); Assert-Fallback $fallback 'First track'
  Start-Sleep -Milliseconds 500
  Call-Mock @('set','ok','61000','Second track') | Out-Null
  Call-Mock @('request') | Out-Null
  $snapshot=Wait-Snapshot 'Second track'
  Call-Mock @('set','429','63000','Second track') | Out-Null
  docker stop $id | Out-Null; $id=$null
  $id = Start-TestContainer
  for ($i=0; $i -lt 20; $i++) { try { $limited=Call-Mock @('request'); break } catch { Start-Sleep -Milliseconds 200 } }
  Assert-Fallback $limited 'Second track'
  Start-Sleep -Milliseconds 500
  $countBefore=(Call-Mock @('control')).calls
  1..4 | ForEach-Object { Assert-Fallback (Call-Mock @('request')) 'Second track' }
  Call-Mock @('set','429','142999','Second track') | Out-Null
  Assert-Fallback (Call-Mock @('request')) 'Second track'
  $countAfter=(Call-Mock @('control')).calls
  if ($countBefore -ne $countAfter) { throw "rate limit ignored: $countBefore -> $countAfter" }
  Call-Mock @('set','ok','153001','Third track') | Out-Null
  Call-Mock @('request') | Out-Null
  $final=Wait-Snapshot 'Third track'
  Write-Output "PASS: initial snapshot, 503 recreate fallback ($([Math]::Round($timer.Elapsed.TotalSeconds,2))s), recovery, 429 recreate fallback, Retry-After suppression ($countBefore calls), and refreshed snapshot"
} finally {
  if ($id) { docker stop $id | Out-Null }
  docker volume rm $volume | Out-Null
}
