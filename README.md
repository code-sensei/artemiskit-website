# ArtemisKit website

The static website and Starlight documentation for the open-source AI assurance toolkit by Vorbtech Innovative Solutions.

Canonical URL: `https://artemiskit.vorbtech.com.ng`, hosted on Vercel. Redirect the existing `artemiskit.vercel.app` host to the same paths on the canonical domain after verification. VIS mailboxes remain on the VPS. Domain activation and a Production release require a separate approved cutover; a local build does not activate them.

## Local work

```sh
git submodule update --init --recursive
npm ci
npm run dev
```

## Production build

```sh
npm run check
npm run build
npm run verify
```

Static output is in `dist/`. No database or model credentials are required. The assessment form requires the server-side Resend configuration described in `deploy/README.md`. Documentation search is generated during the production build (Pagefind does not fully run in Astro development mode).

- `brand/ArtemisKit_Brand_System_v3.md`: positioning, visual language, personality, voice, tone and claim rules.
- `deploy/README.md`: Vercel custom-domain cutover, canonical redirect and rollback; optional VPS deployment instructions.
- `deploy/nginx.conf` / `deploy/Caddyfile`: alternatives to integrate into the existing VPS stack after host validation.
- `Dockerfile`: optional static container behind the existing TLS proxy.
- `scripts/verify-site.mjs`: generated-page metadata, H1, local-link and required-output checks.

## Documentation ownership

`src/content/docs/docs` remains the existing `artemiskit-docs` git submodule, pinned to a reviewable commit. Commit/push documentation there before updating the website's gitlink. A recursive checkout reproduces the same content.

To refresh the source-backed workflow and package guides:

```sh
cd src/content/docs/docs
node scripts/sync-core-docs.mjs /absolute/path/to/artemiskit
```

The script reads committed core files, records the exact SHA and remaps known guide links to local docs. Review the diff; manual tutorial pages still need review when product behaviour changes.

## Evidence and publication

Examples are labelled as examples, not measured results. The methodology page contains no invented leaderboard entries. Legal-certification and universal-safety claims are excluded. Toolkit adoption and VIS-led assessments are separate paths. Existing editorial articles remain an archive with their publication dates.

The prepared privacy description covers this static site's code; reconcile actual server/CDN logs and retention before production launch. No SSH, DNS or TLS changes are made by building this repository.

`npm test` exercises the email endpoint with a mock transport and the shared system/light/dark/high-contrast theme controller. No live emails are sent by the tests.
