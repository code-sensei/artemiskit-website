import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { createAssessmentHandler, MAX_BODY_BYTES } from './assessment.mjs';
import { pathToFileURL } from 'node:url';
export function createNodeAssessmentListener(options = {}) {
  const handle = createAssessmentHandler(options);
  return async (req, res) => {
    const requestHeaders = new Headers();
    for (const [name, value] of Object.entries(req.headers)) if (value !== undefined) requestHeaders.set(name, Array.isArray(value) ? value.join(',') : value);
    let clientId = req.socket.remoteAddress || 'unknown';
    const loopback = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(clientId);
    const trusted = loopback && options.trustProxy === true;
    const protocol = trusted && req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const url = new URL(req.url || '/', `${protocol}://${req.headers.host || 'localhost'}`);
    if (!['/api/assessment', '/api/assessment/'].includes(url.pathname)) { res.writeHead(404); res.end(); return; }
    if (Number(req.headers['content-length']) > MAX_BODY_BYTES) { res.writeHead(413, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify({ error: 'Your request is too long.' })); return; }
    if (trusted) clientId = String(req.headers['x-real-ip'] || clientId);
    try {
      const request = new Request(url, { method: req.method, headers: requestHeaders, ...(req.method === 'POST' ? { body: Readable.toWeb(req), duplex: 'half' } : {}) });
      const response = await handle(request, { clientId });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
    } catch { res.writeHead(400, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify({ error: 'The request could not be read.' })); }
  };
}
export function createAssessmentServer(options = {}) { return createServer(createNodeAssessmentListener(options)); }
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.ASSESSMENT_PORT || 8787);
  createAssessmentServer({ trustProxy: process.env.ASSESSMENT_TRUST_PROXY === 'loopback' }).listen(port, '127.0.0.1', () => console.log(`Assessment endpoint listening on loopback port ${port}`));
}
