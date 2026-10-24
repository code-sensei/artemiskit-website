import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');const canonical='https://artemiskit.vorbtech.com.ng';const errors=[];let count=0,docs=0;
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.join(dir,d.name)])}
const files=walk(root);const pages=files.filter(p=>p.endsWith('.html'));const redirects=new Set(['results','ai-red-team','ai-security-testing','llm-testing','prompt-injection-testing']);
for(const file of pages){const text=fs.readFileSync(file,'utf8');const relative=path.relative(root,file);const isRedirect=redirects.has(relative.split(path.sep)[0]);
 if(isRedirect)continue;count++;if(relative.startsWith('docs/'))docs++;
 if(!/<title>[^<]+<\/title>/.test(text))errors.push(`${relative}: missing title`);
 if(!/<meta\s+name="description"\s+content="[^"]+"/.test(text))errors.push(`${relative}: missing description`);
 const h1=(text.match(/<h1(?:\s|>)/g)||[]).length;if(h1!==1)errors.push(`${relative}: ${h1} h1 elements`);
 if(relative!=='404.html'&&!text.includes(canonical))errors.push(`${relative}: canonical host absent`);
 for(const match of text.matchAll(/\b(?:href|src)="([^"#]+)"/g)){const link=match[1].replaceAll('&amp;','&');if(!link.startsWith('/')||link.startsWith('//'))continue;
 const pathname=decodeURIComponent(link.split(/[?#]/)[0]);const dest=path.join(root,pathname);if(!fs.existsSync(dest)&&!fs.existsSync(path.join(dest,'index.html')))errors.push(`${relative}: broken local link ${pathname}`);
 }
}
for(const required of ['index.html','docs/index.html','docs/getting-started/index.html','docs/workflows/reports/index.html','pagefind/pagefind.js','robots.txt','sitemap-index.xml','health.txt','llms.txt'])if(!fs.existsSync(path.join(root,required)))errors.push(`missing ${required}`);
if(fs.existsSync(path.join(root,'admin')))errors.push('admin route must not be in static release');
const unique=[...new Set(errors)];if(unique.length){console.error(unique.join('\n'));console.error(`${unique.length} errors across ${count} pages`);process.exit(1)}
console.log(`Verified ${count} HTML pages (${docs} documentation pages): titles, descriptions, H1s, local links/assets and required build files.`);
