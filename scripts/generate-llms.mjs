import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';

// Generate from the rendered, public sitemap rather than repository sources: drafts,
// internal files and build-only templates must not enter public AI-readable exports.
const dist = path.resolve('dist');
const origin = 'https://www.artemiskit.dev';
const hiddenTags = new Set(['script', 'style', 'nav', 'button', 'svg', 'noscript', 'iframe']);
const attr = (node, name) => node.attrs?.find((item) => item.name === name)?.value;
const children = (node) => node.childNodes ?? [];
function find(node, predicate) {
  if (predicate(node)) return node;
  for (const child of children(node)) { const found = find(child, predicate); if (found) return found; }
}
function findAll(node, predicate, out = []) {
  if (predicate(node)) out.push(node);
  for (const child of children(node)) findAll(child, predicate, out);
  return out;
}
function text(node) { return node.nodeName === '#text' ? node.value : children(node).map(text).join(''); }
function linkTarget(href, pageUrl) {
  if (!href || /^(javascript|mailto|tel):/i.test(href)) return href ?? '';
  try {
    const u = new URL(href, pageUrl);
    if (['artemiskit.vorbtech.com.ng', 'artemiskit.vercel.app', 'artemiskit.dev'].includes(u.hostname)) u.host = 'www.artemiskit.dev';
    return u.href;
  } catch { return ''; }
}
function markdown(node, pageUrl) {
  if (node.nodeName === '#text') return node.value.replace(/\s+/g, ' ');
  const tag = node.tagName;
  const cls = attr(node, 'class') ?? '';
  if (hiddenTags.has(tag) || attr(node, 'aria-hidden') === 'true' || /(^|\s)(sr-only|visually-hidden)(\s|$)/.test(cls)) return '';
  if (tag === 'pre') {
    const code = find(node, (item) => item.tagName === 'code');
    const codeNode = code ?? node;
    // Expressive Code renders each line as a div without literal newlines.
    // Restore those boundaries so YAML and code examples remain usable.
    const lines = findAll(codeNode, (item) => (attr(item, 'class') ?? '').split(/\s+/).includes('ec-line'));
    const source = lines.length ? lines.map((line) => text(find(line, (item) => (attr(item, 'class') ?? '').split(/\s+/).includes('code')) ?? line)).join('\n') : text(codeNode);
    const language = attr(node, 'data-language') ?? '';
    return `\n\n\`\`\`${language}\n${source.trimEnd()}\n\`\`\`\n\n`;
  }
  if (tag === 'video') {
    const source = find(node, (item) => item.tagName === 'source');
    const url = linkTarget(attr(source ?? node, 'src'), pageUrl);
    return url ? `\n\n[Watch the introduction video](${url})\n\n` : '';
  }
  if (tag === 'img') { const alt = attr(node, 'alt'); return alt ? ` [Image: ${alt}] ` : ''; }
  const inner = children(node).map((child) => markdown(child, pageUrl)).join('');
  const trimmed = inner.trim();
  if (!trimmed) return tag === 'br' ? '\n' : '';
  if (/^h[1-6]$/.test(tag ?? '')) return `\n\n${'#'.repeat(Math.min(Number(tag[1]) + 2, 6))} ${trimmed}\n\n`;
  if (tag === 'a') { const href = linkTarget(attr(node, 'href'), pageUrl); return href ? `[${trimmed}](${href})` : inner; }
  if (tag === 'li') return `\n- ${trimmed}\n`;
  if (tag === 'tr') return `\n${trimmed}\n`;
  if (tag === 'td' || tag === 'th') return `${trimmed} | `;
  if (tag === 'code') return '`' + trimmed.replaceAll('`', "'") + '`';
  if (tag === 'br') return '\n';
  if (['p','section','article','ul','ol','table','blockquote','details','summary'].includes(tag)) return `\n\n${trimmed}\n\n`;
  return inner;
}
function clean(value) { return value.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim(); }
const sitemapFiles = (await readdir(dist)).filter((name) => /^sitemap-\d+\.xml$/.test(name)).sort();
if (!sitemapFiles.length) throw new Error('No generated sitemap found; run Astro build first.');
const locations = new Set();
for (const file of sitemapFiles) {
  const xml = await readFile(path.join(dist, file), 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) locations.add(new URL(match[1].replaceAll('&amp;', '&')).pathname);
}
const pages = [];
for (const pathname of [...locations].sort()) {
  if (!pathname.startsWith('/') || pathname.includes('..')) continue;
  const relative = pathname.replace(/^\/+|\/+$/g, '');
  const filename = path.join(dist, relative, 'index.html');
  let html;
  try { html = await readFile(filename, 'utf8'); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  const doc = parse(html);
  const robots = find(doc, (n) => n.tagName === 'meta' && attr(n, 'name')?.toLowerCase() === 'robots');
  if (/noindex/i.test(attr(robots ?? {}, 'content') ?? '')) continue;
  const titleNode = find(doc, (n) => n.tagName === 'title');
  const descriptionNode = find(doc, (n) => n.tagName === 'meta' && attr(n, 'name')?.toLowerCase() === 'description');
  const main = pathname.startsWith('/docs/') ? find(doc, (n) => (attr(n, 'class') ?? '').split(/\s+/).includes('sl-markdown-content')) : find(doc, (n) => n.tagName === 'main');
  if (!main) continue;
  const title = clean(text(titleNode ?? {})).replace(/\s*[|–—-]\s*ArtemisKit\s*$/i, '') || pathname;
  const description = clean(attr(descriptionNode ?? {}, 'content') ?? '');
  const url = new URL(pathname, origin).href;
  const body = clean(markdown(main, url));
  if (!body) continue;
  pages.push({ pathname, title, description, url, body });
}
const docs = pages.filter((page) => page.pathname.startsWith('/docs/'));
if (!pages.length || !docs.length) throw new Error('No public website or documentation pages found.');
const summary = 'ArtemisKit is an open-source AI evaluation and assurance toolkit by Vorbtech Innovative Solutions. It supports scenario-based tests and evidence inspection. The CLI requires Bun. Results are scoped to the tested scenario and do not certify safety or compliance.';
function index(title, subset, fullUrl) {
  const groups = title.includes('documentation') ? [['Documentation', subset]] : [
    ['Website and product', subset.filter((p) => !p.pathname.startsWith('/docs/') && !p.pathname.startsWith('/blog/'))],
    ['Documentation', subset.filter((p) => p.pathname.startsWith('/docs/'))],
    ['Articles', subset.filter((p) => p.pathname.startsWith('/blog/'))],
  ];
  return `# ${title}\n\n> ${summary}\n\nPages below are generated from the published site. The full-text companion is [available here](${fullUrl}).\n\n` + groups.filter(([, group]) => group.length).map(([name, group]) => `## ${name}\n\n` + group.map((p) => `- [${p.title.replaceAll('[','\\[').replaceAll(']','\\]')}](${p.url})${p.description ? ': ' + p.description.replace(/\s+/g, ' ') : ''}`).join('\n')).join('\n\n') + '\n';
}
function full(title, subset) {
  return `# ${title}\n\n> ${summary}\n\nThis document is generated from the public website at build time. Follow source links for current context, navigation and updates.\n\n` + subset.map((p) => `## ${p.title}\n\nSource: ${p.url}\n\n${p.body}`).join('\n\n---\n\n') + '\n';
}
await mkdir(path.join(dist, 'docs'), { recursive: true });
await Promise.all([
  writeFile(path.join(dist, 'llms.txt'), index('ArtemisKit', pages, origin + '/llms-full.txt')),
  writeFile(path.join(dist, 'llms-full.txt'), full('ArtemisKit — full website and documentation', pages)),
  writeFile(path.join(dist, 'docs', 'llms.txt'), index('ArtemisKit documentation', docs, origin + '/docs/llms-full.txt')),
  writeFile(path.join(dist, 'docs', 'llms-full.txt'), full('ArtemisKit documentation — full text', docs)),
]);
console.log(`Generated AI-readable indexes and full text for ${pages.length} public pages, including ${docs.length} documentation pages.`);
