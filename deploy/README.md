# VPS deployment

Canonical host: `artemiskit.vorbtech.com.ng`. Convenience alias: `akit.vorbtech.com.ng`, permanent redirect preserving path and query. These are recommendations; DNS has not been changed by preparing this repository.

The site is static Astro output including Starlight documentation and Pagefind search. The pages need no database or model credentials. The assessment form additionally requires the server-side request endpoint, Node 24 and the existing VIS Resend key. Serving only dist/ will not activate submissions.

## Build

Use the lockfile and initialise the pinned documentation submodule:

```sh
git submodule update --init --recursive
npm ci
npm run check
npm run build
npm run verify
tar -czf artemiskit-dist.tar.gz -C dist .
```

Keep release artifacts outside the repository. Do not copy `.env`, `.git`, source checkpoints or the whole checkout into the document root. The release includes public files only.

## Prepare the existing VPS

1. Confirm VPS host, SSH user/key, existing reverse proxy (nginx, Caddy, a container proxy or another stack) and who owns DNS.
2. Create A records for both hosts pointing at the correct public IPv4. Create AAAA records only if IPv6 is configured and reachable. Existing proxy/CDN configuration can change certificate and IP handling.
3. Copy the release archive to an isolated location on the VPS. Verify its digest against the local release.
4. Create `/srv/artemiskit/releases/<release-id>/` and extract only the built archive there. Serve it through `/srv/artemiskit/current`, a symlink to the selected release.
5. Integrate the appropriate supplied web configuration with the EXISTING stack. Do not overwrite unrelated virtual hosts or start a competing proxy.
6. Issue a certificate covering both hostnames. For nginx, bootstrap HTTP challenge handling before enabling the TLS configuration; the full supplied example assumes certificates already exist. Caddy can automate certificates when DNS and ports are ready.
7. Validate configuration (`nginx -t`, or `caddy validate` with the actual config path), then reload the existing service.
8. Test root, docs, deep routes, assets, Pagefind, robots, sitemap, `/health.txt`, 404 and the alias redirect over HTTPS. Inspect canonical tags and mixed content.

Use a uniquely named temporary symlink in the same directory and rename it over `current` for atomic cutover on the target Linux filesystem. Record the prior target. Roll back by atomically restoring that target and repeating the health checks. Keep the previous release until verification is complete.

## Container alternative

The included Dockerfile builds the static site and serves it with nginx on container port 80. Use it behind the VPS's existing TLS reverse proxy; do not expose a second service on host 80/443. The build context must contain the checked-out documentation submodule. Runtime secrets are unnecessary.

## Old Vercel address

After the new hostname passes live checks, configure permanent path-preserving redirects from the former Vercel address using its deployment settings. Do not deploy the exact same self-redirecting configuration on both hosts. Update core README/package homepage links in a separate release-aware change after cutover. Do not alter published npm versions or tags.

## Verification limits

Local build and browser checks cannot verify the remote server, DNS ownership, certificates, firewall, proxy stack or a successful production cutover. Record those checks in the live deployment run. The supplied web-server configurations require validation on the actual host.


## Assessment endpoint and Resend

The brief, three-step form, review, consent and receipt stay on the ArtemisKit site. A browser POST to `/api/assessment` reaches the server, which sends a branded HTML/plain-text team notification through Resend to `admin@vorbtech.com.ng`, then a branded acknowledgement to the validated requester. Both BCC `tsowababangida@gmail.com`. Team notification replies go to the requester; acknowledgement replies go to the team. No public GitHub issue or automatic marketing enrolment is created. The browser receives success only after Resend returns accepted IDs for both messages; acceptance does not guarantee final inbox delivery. See [email branding and sender-picture setup](email-branding.md) for template ownership, preview commands and BIMI prerequisites.

The source has no production API key. Reuse the existing VIS Resend key through the deployment's secret/environment settings. Never commit it, prefix it with PUBLIC_, expose it in a browser bundle, or put it in shell arguments. `.env.example` documents the non-secret field names. The verified preview sender mailbox is `artemiskit@vorbtech.com.ng`; the server applies the display name `ArtemisKit by Vorbtech`. Confirm that the active VIS account verifies that domain before a live send.

### VPS service

The static root remains `/srv/artemiskit/current`. Separately deploy `server/` and `src/lib/assessment-schema.mjs` under `/srv/artemiskit/source`, plus `package.json` (`type: module`). No npm runtime dependency is needed by this endpoint.

Create a dedicated unprivileged `artemiskit` service account and a protected environment file at `/etc/artemiskit/assessment.env`, owned by root with mode 0600. Supply the values from `.env.example`, including the real key through your existing secret-management route. Set `ASSESSMENT_TRUST_PROXY=loopback` only with the supplied proxy headers; do not expose port 8787 publicly. The Node process binds to 127.0.0.1. Validate the Node binary path and source path before installing `artemiskit-assessment.service`.

Enable the service through the host's normal systemd administration flow and validate the existing nginx/Caddy configuration before reload. The nginx example includes proxy-level request limiting and a body limit. Caddy users should configure equivalent edge limits as appropriate; the handler also provides bounded process-local rate limiting.

### Existing Vercel preview

`api/assessment.mjs` is a native Node function that imports the same handler. Set `RESEND_API_KEY`, `EMAIL_FROM` and `ADMIN_EMAIL` in the appropriate Vercel environment, then redeploy. `VERCEL_URL` permits the deployment's exact preview origin; add any stable preview aliases explicitly to `ASSESSMENT_ALLOWED_ORIGINS`. Do not allow arbitrary `*.vercel.app` origins. Confirm that the deployed build includes the function and check its GET/POST routes; static Astro build success alone does not verify function deployment.

The rate limiter is process-local, so serverless instances and restarts do not share counters. Use the deployment platform's edge/WAF request limits for global protection. No raw IPs, request contents or provider diagnostics are logged by application code. Infrastructure access logs and mailbox/provider retention still need an agreed production configuration.

### Testing and failures

`npm test` uses an injected email transport; it sends no live mail. It verifies validation, required consent, fixed BCC, permitted origins, bounded bodies, signed/expiring form sessions, retry idempotency and provider failures. It also verifies shared theme behaviour.

For an approved live smoke test, use an explicitly marked synthetic request after configuration, verify the team notification in the VIS inbox, the acknowledgement in the requester inbox, both BCC copies, and the in-page receipt. A missing key returns 503 and no success receipt. Resend rejection/timeouts retain the user's entries on the page. Retrying an unchanged logical request reuses a separate provider idempotency key for each message.

The optional existing Dockerfile serves static pages only. Its reverse proxy must be connected to a separately deployed endpoint before form submissions work. The primary supplied full deployment path is the VPS Node service plus nginx/Caddy.
