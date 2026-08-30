import { cpSync, copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const out = join(root, '_site');
const branch = process.env.BRANCH || process.env.HEAD || '';
const context = process.env.CONTEXT || '';
const isPrelaunch = branch === 'prelaunch' || context !== 'production';

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const rootFiles = [
  'index.html','editor.html','about.html','privacy.html','terms.html','contact.html','404.html',
  'robots.txt','sitemap.xml'
];
const publicDirs = ['assets','js','ideas','templates'];

for (const file of rootFiles) {
  const src = join(root, file);
  if (!existsSync(src)) throw new Error(`Missing deploy file: ${file}`);
  copyFileSync(src, join(out, file));
}
for (const dir of publicDirs) {
  const src = join(root, dir);
  if (!existsSync(src) || !statSync(src).isDirectory()) throw new Error(`Missing deploy directory: ${dir}`);
  cpSync(src, join(out, dir), { recursive: true });
}

if (isPrelaunch) {
  writeFileSync(join(out, '_headers'), `/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n`, 'utf8');
}

const files = [];
const walk = dir => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p); else files.push(p.slice(out.length + 1));
  }
};
walk(out);
console.log(`Netlify bundle ready: ${files.length} public files${isPrelaunch ? ' (prelaunch noindex)' : ''}.`);
