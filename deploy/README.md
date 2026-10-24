# VPS deployment

Canonical host: `artemiskit.vorbtech.com.ng`. Convenience alias: `akit.vorbtech.com.ng`, permanent redirect preserving path and query. These are recommendations; DNS has not been changed by preparing this repository.

The site is static Astro output including Starlight documentation and Pagefind search. No Node process, database, model key or Supabase service is needed at runtime.

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
