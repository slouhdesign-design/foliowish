import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';
const root = resolve(process.cwd());
const htmlFiles=[];
function walk(dir){for(const name of readdirSync(dir)){if(name==='.git'||name==='node_modules')continue;const p=join(dir,name),st=statSync(p);if(st.isDirectory())walk(p);else if(extname(name).toLowerCase()==='.html')htmlFiles.push(p);}}
walk(root);
for(const file of htmlFiles){let html=readFileSync(file,'utf8');html=html.replace(/<meta name="robots" content="index,follow">/gi,'<meta name="robots" content="noindex,nofollow,noarchive">');html=html.replace(/<link rel="canonical" href="[^"]+">/gi,'');writeFileSync(file,html,'utf8');}
writeFileSync(join(root,'robots.txt'),'# FolioWish pre-launch lock\nUser-agent: *\nDisallow: /\n','utf8');
writeFileSync(join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<!-- PRE-LAUNCH: sitemap intentionally empty until public launch approval. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n','utf8');
console.log('FolioWish returned to pre-launch crawl lock.');
