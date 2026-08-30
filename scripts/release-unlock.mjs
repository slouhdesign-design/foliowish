import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, extname, join } from 'node:path';

const root = resolve(process.cwd());
const origin = (process.env.PUBLIC_ORIGIN || '').replace(/\/$/, '');
if (process.env.ALLOW_PUBLIC_LAUNCH !== 'YES') {
  console.error('Refusing to unlock: set ALLOW_PUBLIC_LAUNCH=YES after explicit launch approval.');
  process.exit(1);
}
if (!/^https:\/\/[a-z0-9.-]+$/i.test(origin)) {
  console.error('Refusing to unlock: PUBLIC_ORIGIN must be an https origin such as https://foliowish.com');
  process.exit(1);
}

const htmlFiles = [];
function walk(dir){
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const p = join(dir, name), st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (extname(name).toLowerCase() === '.html') htmlFiles.push(p);
  }
}
walk(root);

const urls = [];
for (const file of htmlFiles) {
  const rel = relative(root, file).replaceAll('\\','/');
  let html = readFileSync(file, 'utf8');
  if (rel !== '404.html' && rel !== 'editor.html') {
    html = html.replace(/<meta name="robots" content="noindex,nofollow,noarchive">/i, '<meta name="robots" content="index,follow">');
    const path = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
    const canonical = `<link rel="canonical" href="${origin}${path}">`;
    if (!/rel="canonical"/i.test(html)) html = html.replace('</head>', canonical + '</head>');
    urls.push(origin + path);
  }
  writeFileSync(file, html, 'utf8');
}
writeFileSync(join(root,'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`, 'utf8');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(join(root,'sitemap.xml'), sitemap, 'utf8');
console.log(`Public indexing unlocked for ${urls.length} pages at ${origin}. Review diff before publishing.`);
