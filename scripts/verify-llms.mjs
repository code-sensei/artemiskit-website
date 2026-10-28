import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const read = (name) => readFile(new URL(`../dist/${name}`, import.meta.url), 'utf8');

test('AI-readable indexes include public website and docs, with full-text companions', async () => {
  const [site, siteFull, docs, docsFull] = await Promise.all([
    read('llms.txt'), read('llms-full.txt'), read('docs/llms.txt'), read('docs/llms-full.txt'),
  ]);
  assert.match(site, /^# ArtemisKit\n/);
  assert.match(docs, /^# ArtemisKit documentation\n/);
  assert.match(site, /https:\/\/www\.artemiskit\.dev\/llms-full\.txt/);
  assert.match(docs, /https:\/\/www\.artemiskit\.dev\/docs\/llms-full\.txt/);
  const sitemapFiles = (await readdir(new URL('../dist/', import.meta.url))).filter((name) => /^sitemap-\d+\.xml$/.test(name));
  const sitemap = (await Promise.all(sitemapFiles.map(read))).join('\n');
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  assert.ok(paths.length > 0);
  for (const pathname of paths) {
    const expected = `https://www.artemiskit.dev${pathname}`;
    assert.ok(site.includes(`](${expected})`), `Missing website index entry: ${pathname}`);
    if (pathname.startsWith('/docs/')) assert.ok(docs.includes(`](${expected})`), `Missing docs index entry: ${pathname}`);
  }
  assert.match(siteFull, /Source: https:\/\/www\.artemiskit\.dev\/about\//);
  assert.match(docsFull, /Source: https:\/\/www\.artemiskit\.dev\/docs\/getting-started\//);
  assert.match(docsFull, /\[Watch the introduction video\]\(https:\/\/www\.artemiskit\.dev\/videos\/artemiskit-introduction\.mp4\)/);
  assert.match(docsFull, /```yaml\nprovider: openai\nmodel: [^\n]+\n\nproviders:\n  openai:\n    apiKey:/);
  assert.doesNotMatch(docs, /https:\/\/www\.artemiskit\.dev\/blog\//);
});
