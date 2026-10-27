# Assessment email branding

`server/assessment-emails.mjs` owns the shared, dependency-free HTML and plain-text templates. They use the official ArtemisKit PNG wordmark, brand orange, charcoal and warm-white surfaces, inline email styles, a narrow-screen layout and visible request references. The plain-text versions remain usable when HTML or images are unavailable. Templates are versioned with the application rather than duplicated in the Resend dashboard.

## Sender and request flow

`EMAIL_FROM` supplies the verified sender mailbox. The server applies **ArtemisKit by Vorbtech** as its display name, including when the existing setting contains only `artemiskit@vorbtech.com.ng`. A legacy `Name <address>` setting is accepted, but the display name is replaced consistently. `ADMIN_EMAIL` remains the team recipient and becomes the requester acknowledgement’s Reply-To address.

After consent and validation, the endpoint sends the team notification, then the requester acknowledgement. Both copy the maintainer as required; if the requester is already that BCC address, the acknowledgement sends one direct copy instead of duplicating the recipient. The acknowledgement contains the requester’s name and reference, promises a representative will get back to them soon, and explains the next steps. It does not repeat the workflow, risks or access details. No response-time SLA or engagement is promised.

The browser receives success only after Resend accepts both messages. If either message is rejected, times out or has no provider ID, the request stays retryable. Separate, versioned `team` and `acknowledgement` idempotency keys preserve the same payload on an unchanged retry. This avoids resending an accepted team notification if the acknowledgement fails. Resend retains idempotency keys for 24 hours; this is not a durable queue, and provider acceptance does not guarantee inbox delivery. The form’s one-hour session/retry flow remains in place.

The canonical website and default email-link destination is **`https://www.artemiskit.dev`**, including in Preview email. Vercel deployment metadata must not substitute a protected branch alias or the old `artemiskit.vercel.app` host. `EMAIL_SITE_URL` can explicitly override the HTTPS origin for a separate environment, but the normal Production and Preview setting is the canonical host. The website is hosted on Vercel; the sender mailbox remains on the VIS VPS. Verify the canonical domain and public logo after deployment.

The logo defaults separately to the official public `https://www.artemiskit.dev/artemiskit-logo.png`, verified to return `200 image/png` without authentication. The feature-branch image URL redirects to Vercel sign-in, so it must not be used as the email image. `EMAIL_LOGO_URL` can override the logo after a confirmed public asset move. Do not use localhost, a private host or a signed/authenticated asset URL in live email settings. Recipients may still need to allow remote images in their email client. Bump the idempotency-key version when changing template payloads so cached provider requests do not conflict across releases.

Run `npm test` to check routing, BCC, HTML escaping, branding, minimal acknowledgement content, failure handling and retries. For synthetic visual previews, without sending mail:

```sh
node scripts/preview-assessment-emails.mjs /absolute/output-directory
python3 -m http.server 4186 --bind 127.0.0.1 --directory /absolute/output-directory
```

Open `/notification.html` and `/acknowledgement.html` at `http://127.0.0.1:4186`, checking desktop and narrow layouts. Their website links default to the canonical `https://www.artemiskit.dev` host; only the preview image is served locally. Pass a third argument with an approved HTTPS website origin only when deliberately testing another destination. Real Gmail/Outlook rendering still needs an approved live test after deployment.

## Inbox sender picture is separate

An image inside the HTML template does not set the avatar beside the sender in an inbox. The recipient’s mail client controls that picture. A Resend From display name cannot force one.

Read-only DNS checks on 25 October 2026 found `_dmarc.vorbtech.com.ng` set to `p=none`, no `default._bimi.vorbtech.com.ng` TXT record, and MX pointing to `mail.vorbtech.com.ng`. No DNS, account profile, certificate or mail-policy changes were performed.

For Gmail’s verified brand-logo route, Google requires BIMI with a VMC or CMC certificate and enforced DMARC (`p=quarantine` or `p=reject`, at 100%). A VMC requires an eligible trademark; a CMC has its own issuer eligibility checks. Certificate purchase, DNS publication and a DMARC policy change require explicit approval. Audit all legitimate VIS senders before tightening the shared domain’s policy: an unprepared change can affect unrelated VIS email.

Use the existing official icon source at `public/artemiskit-icon.svg` as input for the certificate provider’s SVG Tiny PS preparation and validation. It is not claimed to be BIMI-ready as-is. Do not redraw the mark or publish an unvalidated record. Select a logo scope that leaves other VIS mail correctly branded: the BIMI Group documents per-stream selectors, but client support varies. Evaluate an ArtemisKit selector or a dedicated sending subdomain with the certificate/provider before enabling it; a domain-wide default ArtemisKit logo could otherwise brand unrelated VIS mail. No inactive BIMI-Selector header is added by this change.

If the exact sender address already belongs to a Google Account, its Google profile photo can be set to the official icon as a separate, account-specific step. Google documents that profile pictures can appear in Gmail inboxes and take up to 24 hours to update. This does not establish BIMI or guarantee a logo in other mail clients. Do not change the shared technical account’s picture or create a new Google Account without confirming the intended identity and access.

After the chosen avatar route is configured, verify actual incoming messages in the target clients; a published record alone is not proof that an avatar displays.

Primary sources checked 25 October 2026:

- [Google: Set up BIMI](https://knowledge.workspace.google.com/admin/security/set-up-bimi)
- [Google: Change your Gmail profile picture](https://support.google.com/mail/answer/35529)
- [BIMI Group: sender and ESP FAQs](https://bimigroup.org/faqs-for-senders-esps/)
- [Resend: Idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
