# Frontend dependency audit — 2026-11-06

The table records every advisory returned by the full isolated frontend `npm audit --json` before updates. Severity is the advisory severity; paths show one shortest installed path. “After” gives an installed patched version, not necessarily the first patched release. Audit classifications are dependency metadata, not proof that code is shipped or reachable.

| Package / installed version | Advisory | Severity | Example dependency path | Patched version after update |
| --- | --- | --- | --- | --- |
| `@babel/core` 7.29.0 | [@babel/core: Arbitrary File Read via sourceMappingURL Comment](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8) | low | frontend → eslint-plugin-react-hooks → @babel/core | 7.29.13 |
| `@humanfs/node` 0.16.6 | [humanfs: Recursive copy follows symlinked files and copies data from outside the source tree](https://github.com/advisories/GHSA-p498-v437-472g) | moderate | frontend → eslint → @humanfs/node | 0.16.8 |
| `baseline-browser-mapping` 2.10.29 | [baseline-browser-mapping process termination on invalid input causes denial of service](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) | moderate | frontend → eslint-plugin-react-hooks → @babel/core → @babel/helper-compilation-targets → browserslist → baseline-browser-mapping | 2.11.35 |
| `brace-expansion` 5.0.6 | [brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | high | frontend → eslint → minimatch → brace-expansion | 5.0.12 |
| `brace-expansion` 5.0.6 | [brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash](https://github.com/advisories/GHSA-mh99-v99m-4gvg) | high | frontend → eslint → minimatch → brace-expansion | 5.0.12 |
| `brace-expansion` 5.0.6 | [brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation](https://github.com/advisories/GHSA-rgw5-rvv9-x895) | high | frontend → eslint → minimatch → brace-expansion | 5.0.12 |
| `brace-expansion` 5.0.6 | [brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) | moderate | frontend → eslint → minimatch → brace-expansion | 5.0.12 |
| `brace-expansion` 5.0.6 | [brace-expansion: DoS via uncontrolled recursion on nested brace groups causing stack exhaustion](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | high | frontend → eslint → minimatch → brace-expansion | 5.0.12 |
| `brace-expansion` 5.0.6 | [brace-expansion: DoS via uncontrolled recursion in parseCommaParts causing stack exhaustion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | high | frontend → eslint → minimatch → brace-expansion | 5.0.12 |
| `browserslist` 4.28.2 | [Browserslist: Unbounded memory growth (no cache eviction) via distinct query results, leading to eventual OOM](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) | high | frontend → eslint-plugin-react-hooks → @babel/core → @babel/helper-compilation-targets → browserslist | 4.29.5 |
| `browserslist` 4.28.2 | [Browserslist: Uncaught crash / prototype write via untrusted browserslist-stats.json custom stats (normalizeStats)](https://github.com/advisories/GHSA-73wf-gq98-2v4g) | high | frontend → eslint-plugin-react-hooks → @babel/core → @babel/helper-compilation-targets → browserslist | 4.29.5 |
| `flatted` 3.3.3 | [flatted vulnerable to unbounded recursion DoS in parse() revive phase](https://github.com/advisories/GHSA-25h7-pfq9-p65f) | high | frontend → eslint → file-entry-cache → flat-cache → flatted | 3.4.4 |
| `flatted` 3.3.3 | [Prototype Pollution via parse() in NodeJS flatted](https://github.com/advisories/GHSA-rf6f-7fwh-wjgh) | high | frontend → eslint → file-entry-cache → flat-cache → flatted | 3.4.4 |
| `minimatch` 10.2.5 | [minimatch has potential denial of service via globparts amplification](https://github.com/advisories/GHSA-g3hv-75wg-m249) | moderate | frontend → eslint → minimatch | 11.0.1 (major; not allowed by current parents) |
| `nanoid` 3.3.12 | [nanoid: non-secure generators can loop indefinitely with negative size](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) | high | frontend → vite → postcss → nanoid | 3.3.20 |
| `nanoid` 3.3.12 | [nanoid: custom generators can loop indefinitely when size is zero](https://github.com/advisories/GHSA-2v37-7h3g-55p8) | high | frontend → vite → postcss → nanoid | 3.3.20 |
| `postcss` 8.5.14 | [PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) | moderate | frontend → vite → postcss | 8.5.32 |
| `postcss` 8.5.14 | [PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure](https://github.com/advisories/GHSA-r28c-9q8g-f849) | high | frontend → vite → postcss | 8.5.32 |
| `react-router` 7.15.0 | [React Router: Potential CSRF via PUT/PATCH/DELETE document requests](https://github.com/advisories/GHSA-84g9-w2xq-vcv6) | low | frontend → react-router-dom → react-router | 7.18.5 |
| `react-router` 7.15.0 | [React Router: Open redirect via backslash in <Link> and useNavigate (CVE-2025-68470 bypass)](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) | moderate | frontend → react-router-dom → react-router | 7.18.5 |
| `react-router` 7.15.0 | [React Router: RSCErrorHandler Missing Protocol Validation (XSS)](https://github.com/advisories/GHSA-h8fp-f39c-q6mh) | moderate | frontend → react-router-dom → react-router | 7.18.5 |
| `react-router` 7.15.0 | [React Router: Arbitrary Constructor Injection via deserializeErrors() in React Router SSR Hydration](https://github.com/advisories/GHSA-337j-9hxr-rhxg) | moderate | frontend → react-router-dom → react-router | 7.18.5 |
| `react-router` 7.15.0 | [React Router: Unauthenticated Denial of Service via Inefficient Route Matching](https://github.com/advisories/GHSA-chx6-hx7r-mcp5) | high | frontend → react-router-dom → react-router | 7.18.5 |
| `react-router` 7.15.0 | [React Router: RSC Mode CSRF Bypass Allows Action Execution Before 400 Response](https://github.com/advisories/GHSA-qwww-vcr4-c8h2) | high | frontend → react-router-dom → react-router | 7.18.5 |
| `source-map-js` 1.2.1 | [source-map-js allows event-loop denial of service through indexed source-map section offsets](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | high | frontend → @tailwindcss/vite → @tailwindcss/node → source-map-js | 1.2.2 |
| `vite` 8.0.11 | [launch-editor: NTLMv2 hash disclosure via UNC path handling on Windows](https://github.com/advisories/GHSA-v6wh-96g9-6wx3) | moderate | frontend → vite | 8.3.6 |
| `vite` 8.0.11 | [launch-editor: escapeCmdArgs() omits % escaping on Windows](https://github.com/advisories/GHSA-698v-4r3x-3vcv) | moderate | frontend → vite | 8.3.6 |
| `vite` 8.0.11 | [launch-editor: Editor CLI flag misinterpretation causing arbitrary command execution for some editors](https://github.com/advisories/GHSA-r825-w8mm-5pxw) | moderate | frontend → vite | 8.3.6 |
| `vite` 8.0.11 | [launch-editor: `fs.existsSync()` existence check can be bypassed on Windows](https://github.com/advisories/GHSA-587h-7wmj-h5pm) | high | frontend → vite | 8.3.6 |
| `vite` 8.0.11 | [Vite: Cross origin script execution through Vite custom middleware](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) | low | frontend → vite | 8.3.6 |
| `vite` 8.0.11 | [Vite: Files outside `server.fs.allow` could be served when project paths match system paths on non-Windows machine](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) | moderate | frontend → vite | 8.3.6 |
| `vite` 8.0.11 | [vite: `server.fs.deny` bypass on Windows alternate paths](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) | moderate | frontend → vite | 8.3.6 |
| `zod` 4.4.3 | [Zod can exhaust memory while validating oversized constrained collections](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | high | frontend → eslint-plugin-react-hooks → zod | 4.6.7 |

The remaining entries reported by npm (`@eslint/config-array`, `@eslint/js`, `eslint`, the five affected `@typescript-eslint/*` packages, and `typescript-eslint`) inherit the same minimatch advisory through their dependency trees; these are not independent advisories. The report also includes any direct vulnerable packages in the table above.


## Runtime and exposure

`createBrowserRouter` and `RouterProvider` use React Router Data Mode in a client-rendered Vite application. The repository defines no route loaders or actions, no server-side rendering or hydration, no React Server Components and no Framework Mode server. Express serves static frontend output; frontend build tools are not installed in the production Node runner.

The original React Router 7.15.0 findings are addressed by 7.18.5. The Framework Mode CSRF and manifest route-matching DoS advisories do not apply to Data Mode; the RSC CSRF and RSC error-handler advisories require unstable RSC APIs; the SSR constructor issue requires SSR/hydration. None of those features is used here. The open-redirect advisory can apply to client navigation with attacker-controlled destinations; the code uses fixed links and a fixed redirect, so no such input path was found. This assessment describes the checked application, not all possible uses of the package.

PostCSS, nanoid (as a PostCSS dependency), source-map-js, Vite, Babel, Browserslist, ESLint, Zod and their affected toolchain dependencies execute during build/development, not in the production Express runner. A package's npm `prod` label alone does not imply that it is bundled into the browser. React Router is browser runtime code; the production Express backend has its own lockfile and dependencies.

## Remaining finding

The final full frontend audit reports **10 moderate affected package entries, zero high or critical**. These are one underlying advisory, [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), plus propagated dependencies. `minimatch` 10.2.6 can consume excessive CPU/memory for attacker-supplied glob patterns with optimization level at least 2. The reachable paths found here are local ESLint/TypeScript-ESLint tooling, not the deployed browser or Express backend; exploitation would require untrusted glob patterns to reach the affected tool invocation. The repository's normal lint command operates on project sources/configuration, so an ordinary site visitor has no identified input path. Malicious repository inputs or other tooling uses were not exhaustively proven safe. Version 11.0.1 is patched, but ESLint 10 and TypeScript-ESLint 8 currently require minimatch 10; forcing a transitive major override risks incompatibility. Follow upstream support/backport and reassess.

| Propagated package | Before / after | Via | Status |
| --- | --- | --- | --- |
| `@eslint/config-array` | 0.23.5 / 0.23.5 | frontend → eslint → @eslint/config-array; via `minimatch` | Remaining through minimatch |
| `@eslint/js` | 10.0.1 / 10.0.1 | frontend → @eslint/js; via `eslint` | Remaining through minimatch |
| `@typescript-eslint/eslint-plugin` | 8.59.2 / 8.59.2 | frontend → typescript-eslint → @typescript-eslint/eslint-plugin; via `@typescript-eslint/parser`, `@typescript-eslint/type-utils`, `@typescript-eslint/utils` | Remaining through minimatch |
| `@typescript-eslint/parser` | 8.59.2 / 8.59.2 | frontend → typescript-eslint → @typescript-eslint/parser; via `@typescript-eslint/typescript-estree` | Remaining through minimatch |
| `@typescript-eslint/type-utils` | 8.59.2 / 8.59.2 | frontend → typescript-eslint → @typescript-eslint/eslint-plugin → @typescript-eslint/type-utils; via `@typescript-eslint/typescript-estree`, `@typescript-eslint/utils` | Remaining through minimatch |
| `@typescript-eslint/typescript-estree` | 8.59.2 / 8.59.2 | frontend → typescript-eslint → @typescript-eslint/typescript-estree; via `minimatch` | Remaining through minimatch |
| `@typescript-eslint/utils` | 8.59.2 / 8.59.2 | frontend → typescript-eslint → @typescript-eslint/utils; via `@typescript-eslint/typescript-estree` | Remaining through minimatch |
| `eslint` | 10.3.0 / 10.3.0 | frontend → eslint; via `@eslint/config-array`, `minimatch` | Remaining through minimatch |
| `react-router-dom` | 7.15.0 / 7.18.5 | frontend → react-router-dom; via `react-router` | Resolved through react-router 7.18.5 |
| `typescript-eslint` | 8.59.2 / 8.59.2 | frontend → typescript-eslint; via `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `@typescript-eslint/typescript-estree`, `@typescript-eslint/utils` | Remaining through minimatch |

The isolated frontend and backend production audits each report zero findings. After updating root development dependency `concurrently` to 9.2.5 and its `shell-quote` dependency to 1.12.0, the full root workspace audit reports 11 entries: the 10 minimatch-related entries above and one low development-only [esbuild advisory](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) via `backend → tsx → esbuild` 0.27.7. The esbuild finding requires its Windows `servedir` development server; the project uses Vite for frontend serving and `tsx watch` for the backend, and no esbuild `serve` or `servedir` invocation was found in project scripts. Other invocations or future changes could expose it. esbuild 0.28.1 is patched, but the existing tsx pins the 0.27 line. Neither development finding is installed in the production backend image. Audit results are time-specific.

Raw audit snapshots: [before](frontend-audit-before.json) and [after](frontend-audit-after.json). These are time-specific npm registry results.
