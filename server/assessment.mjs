import { createHmac, timingSafeEqual, randomUUID, createHash } from 'node:crypto';
import { fields, emailPattern, validateAssessment } from '../src/lib/assessment-schema.mjs';
import { buildAssessmentEmails, SENDER_NAME, PUBLIC_LOGO_URL } from './assessment-emails.mjs';

export const MAX_BODY_BYTES = 24000;
const BCC = 'tsowababangida@gmail.com';
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const json = (status, data, extra = {}) => new Response(JSON.stringify(data), { status, headers: { ...headers, ...extra } });
const digest = value => createHash('sha256').update(value).digest('hex');
function sign(secret, encoded) { return createHmac('sha256', secret).update(`artemiskit-assessment-v1:${encoded}`).digest('base64url'); }
function encodeToken(secret, payload) { const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url'); return `${encoded}.${sign(secret, encoded)}`; }
function decodeToken(secret, token) {
  if (typeof token !== 'string' || token.length > 1500) return null;
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra) return null;
  const expected = Buffer.from(sign(secret, encoded));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try { return JSON.parse(Buffer.from(encoded, 'base64url').toString()); } catch { return null; }
}
export function createRateLimiter({ maximumEntries = 10000 } = {}) {
  const windows = new Map();
  return (key, now, limit, duration = 15 * 60 * 1000) => {
    for (const [id, entry] of windows) if (entry.expires <= now) windows.delete(id);
    const existing = windows.get(key);
    if (existing) { if (existing.count >= limit) return false; existing.count++; return true; }
    if (windows.size >= maximumEntries) return false;
    windows.set(key, { count: 1, expires: now + duration }); return true;
  };
}
async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw new Error('too_large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid');
  const chunks = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) { await reader.cancel(); throw new Error('too_large'); }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
function configuration(env) {
  const originList = ['https://www.artemiskit.dev', 'https://artemiskit.dev', 'https://artemiskit.vorbtech.com.ng', ...(env.ASSESSMENT_ALLOWED_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean)];
  if (env.VERCEL_URL) originList.push(`https://${env.VERCEL_URL}`);
  const sender = env.EMAIL_FROM || 'artemiskit@vorbtech.com.ng';
  const address = (sender.match(/^[^<>]*<([^<>]+)>$/)?.[1] || sender).trim();
  const from = `${SENDER_NAME} <${address}>`;
  const to = env.ADMIN_EMAIL || 'admin@vorbtech.com.ng';
  if (!env.RESEND_API_KEY || /[\r\n]/.test(sender + to) || !emailPattern.test(address) || !emailPattern.test(to)) return null;
  let siteUrl; let logoUrl;
  try {
    const site = new URL(env.EMAIL_SITE_URL || 'https://www.artemiskit.dev');
    if (site.protocol !== 'https:' || site.username || site.password) return null;
    siteUrl = ['https://artemiskit.vorbtech.com.ng', 'https://artemiskit.dev'].includes(site.origin) ? 'https://www.artemiskit.dev' : site.origin;
    const logo = new URL(env.EMAIL_LOGO_URL || PUBLIC_LOGO_URL);
    if (logo.protocol !== 'https:' || logo.username || logo.password) return null;
    logoUrl = logo.href;
  } catch { return null; }
  return { secret: env.ASSESSMENT_SIGNING_SECRET || env.RESEND_API_KEY, from, to, siteUrl, logoUrl, origins: new Set(originList), key: env.RESEND_API_KEY };
}
export function createAssessmentHandler({ env = process.env, send = fetch, now = Date.now, limit = createRateLimiter() } = {}) {
  return async function handle(request, { clientId = 'unknown' } = {}) {
    if (!['GET', 'POST'].includes(request.method)) return json(405, { error: 'Method not allowed.' }, { Allow: 'GET, POST' });
    const config = configuration(env);
    if (!config) return json(503, { error: 'The request service is not available yet. Your form has not been sent. Please try again later.', code: 'service_unavailable' });
    const origin = request.headers.get('origin');
    const requestOrigin = new URL(request.url).origin;
    const scopeOrigin = origin || requestOrigin;
    if (!config.origins.has(scopeOrigin) || (request.method === 'POST' && !origin)) return json(403, { error: 'Please submit the form from the ArtemisKit website.' });
    const stamp = now();
    const clientHash = createHmac('sha256', config.secret).update(clientId).digest('hex');
    if (!limit(`${request.method}:${clientHash}`, stamp, request.method === 'GET' ? 20 : 6)) return json(429, { error: 'Too many attempts. Please wait 15 minutes before trying again.' }, { 'Retry-After': '900' });
    if (!limit('global', stamp, 500)) return json(429, { error: 'The request service is busy. Please try again later.' }, { 'Retry-After': '900' });
    if (request.method === 'GET') {
      const previous = new URL(request.url).searchParams.get('requestId');
      const id = previous && UUID.test(previous) ? previous : randomUUID();
      return json(200, { token: encodeToken(config.secret, { id, issued: stamp, origin: scopeOrigin }), requestId: id });
    }
    if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return json(415, { error: 'Submit the form as JSON.' });
    let body;
    try { body = await readBody(request); } catch (error) { return json(error.message === 'too_large' ? 413 : 400, { error: error.message === 'too_large' ? 'Your request is too long. Shorten the descriptions and try again.' : 'The request could not be read. Please review the form and retry.' }); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return json(400, { error: 'Enter a valid assessment request.' });
    if (typeof body.website !== 'string' || body.website !== '') return json(422, { error: 'We could not validate this request. Please reload the form and try again.' });
    const token = decodeToken(config.secret, body.token);
    if (!token || !UUID.test(token.id || '') || token.origin !== scopeOrigin || !Number.isFinite(token.issued) || token.issued > stamp + 30000 || stamp - token.issued > 60 * 60 * 1000) return json(409, { error: 'Your form session expired. Please submit again to refresh it; your entries are still here.', code: 'token_expired' });
    if (stamp - token.issued < 2500) return json(429, { error: 'Please take a moment to review the request, then submit again.' }, { 'Retry-After': '3' });
    const allowed = new Set([...fields.map(f => f.name), 'consent', 'website', 'token']);
    if (Object.keys(body).some(key => !allowed.has(key))) return json(422, { error: 'The request contains unsupported fields.' });
    const { value, errors } = validateAssessment(body);
    if (Object.keys(errors).length) return json(422, { error: 'Review the highlighted fields.', errors });
    const hash = digest(JSON.stringify(value));
    const reference = `AK-${token.id.replaceAll('-', '').slice(0, 12).toUpperCase()}-${hash.slice(0, 4).toUpperCase()}`;
    const { notification, acknowledgement } = buildAssessmentEmails({ value, reference, siteUrl: config.siteUrl, logoUrl: config.logoUrl });
    const messages = [
      { purpose: 'team', payload: { from: config.from, to: [config.to], bcc: [BCC], reply_to: value.email, ...notification } },
      { purpose: 'acknowledgement', payload: { from: config.from, to: [value.email], ...(value.email.toLowerCase() === BCC ? {} : { bcc: [BCC] }), reply_to: config.to, ...acknowledgement } },
    ];
    try {
      const signal = AbortSignal.timeout(12000);
      for (const { purpose, payload } of messages) {
        const response = await send('https://api.resend.com/emails', {
          method: 'POST', headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `ak-assessment-v4/${purpose}/${token.id}/${hash}` },
          body: JSON.stringify(payload), signal,
        });
        if (!response.ok) throw new Error('delivery_unconfirmed');
        const delivery = await response.json();
        if (!delivery || typeof delivery.id !== 'string' || !delivery.id) throw new Error('delivery_unconfirmed');
      }
      return json(200, { accepted: true, reference, message: 'Your request and confirmation email were accepted by our email service. A Vorbtech representative will get back to you soon.' });
    } catch {
      return json(502, { error: 'We could not confirm receipt. Please retry this same request. Your entries have been kept on this page.', code: 'delivery_unconfirmed' });
    }
  };
}
