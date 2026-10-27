import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';

const root = path.resolve('dist');
const base = 'https://www.artemiskit.dev';
const attrs = (node) => Object.fromEntries((node.attrs ?? []).map(({name,value}) => [name,value]));
function visit(node, fn) { fn(node); for (const child of node.childNodes ?? []) visit(child, fn); }
const files = (await readdir(root)).filter((name) => /^sitemap-\d+\.xml$/.test(name));
const xml = (await Promise.all(files.map((file) => readFile(path.join(root, file), 'utf8')))).join('\n');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urls.length) throw new Error('Sitemap has no URLs');
let docs = 0;
for (const url of urls) {
  if (!url.startsWith(base + '/')) throw new Error(`Unexpected sitemap host: ${url}`);
  const pathname = new URL(url).pathname;
  const html = await readFile(path.join(root, pathname.replace(/^\/+|\/+$/g, ''), 'index.html'), 'utf8');
  const tags = []; visit(parse(html), (n) => { if (n.tagName) tags.push([n.tagName, attrs(n)]); });
  const canonical = tags.filter(([tag,a]) => tag === 'link' && a.rel === 'canonical').map(([,a]) => a.href);
  if (canonical.length !== 1 || canonical[0] !== url) throw new Error(`Incorrect canonical on ${pathname}: ${canonical}`);
  if (pathname.startsWith('/docs/')) {
    docs++;
    for (const [key, val] of [['property','og:image'],['name','twitter:image']]) {
      const meta = tags.filter(([tag,a]) => tag === 'meta' && a[key] === val).map(([,a]) => a.content);
      if (meta.length !== 1 || meta[0] !== `${base}/og-image.png`) throw new Error(`Missing or duplicate ${val} on ${pathname}`);
    }
  }
}
const robots = await readFile(path.join(root,'robots.txt'),'utf8');
if (!robots.includes(`Sitemap: ${base}/sitemap-index.xml`)) throw new Error('robots.txt sitemap does not use the canonical domain');
const page = await readFile(path.join(root,'docs/getting-started/index.html'),'utf8');
const doc = parse(page); let video, track; const schemas = [];
visit(doc, (node) => {
  const a = attrs(node);
  if (node.tagName === 'video') video = a;
  if (node.tagName === 'track') track = a;
  if (node.tagName === 'script' && a.type === 'application/ld+json') {
    const raw = (node.childNodes ?? []).map((child) => child.value ?? '').join('');
    schemas.push(JSON.parse(raw));
  }
});
if (!video || !Object.hasOwn(video, 'controls') || !video['aria-label']) throw new Error('Video controls or accessible label missing');
if (track?.kind !== 'captions' || track?.src !== '/videos/artemiskit-introduction.en.vtt' || track?.srclang !== 'en') throw new Error('Video captions missing');
const schema = schemas.find((item) => item['@type'] === 'VideoObject');
if (!schema || schema.contentUrl !== `${base}/videos/artemiskit-introduction.mp4` || !schema.thumbnailUrl || !schema.uploadDate) throw new Error('Video structured data incomplete');
const captions = await readFile(path.join(root,'videos/artemiskit-introduction.en.vtt'),'utf8');
if (!captions.startsWith('WEBVTT') || !captions.includes('Discover more at artemiskit.dev.') || captions.includes('artemiskit.vorbtech.com.ng')) throw new Error('Captions contain an incorrect URL');
function seconds(value) { const chunks = value.split(':').map(Number); return chunks.reduce((total, next) => total * 60 + next, 0); }
let previous = 0, count = 0;
for (const match of captions.matchAll(/^(\d{2}:\d{2}(?::\d{2})?\.\d{3}) --> (\d{2}:\d{2}(?::\d{2})?\.\d{3})/gm)) {
  const start = seconds(match[1]), end = seconds(match[2]);
  if (start < previous || end <= start || end > 80.8) throw new Error(`Invalid or overlapping caption: ${match[0]}`);
  previous = end; count++;
}
if (count < 15) throw new Error('Video captions are incomplete');
console.log(`Verified canonical sitemap and metadata for ${urls.length} pages, social images for ${docs} docs pages, and video schema plus ${count} caption cues.`);
