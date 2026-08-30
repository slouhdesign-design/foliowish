import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, resolve, relative, dirname, normalize } from 'node:path';

const root = resolve(process.cwd());
const failures = [];
const publicMode = process.env.PUBLIC_QA === 'YES';
const required = ['index.html','editor.html','assets/site.css','assets/editor.css','assets/save-fix.css','js/editor-data.js','js/editor-render.js','js/editor-actions.js','js/editor.js','robots.txt','sitemap.xml','privacy.html','terms.html','404.html'];
for (const f of required) if (!existsSync(join(root,f))) failures.push(`Missing required file: ${f}`);

const textExt = new Set(['.html','.css','.js','.mjs','.json','.md','.txt','.xml','.svg','.yml','.yaml']);
const secretPatterns = [
  ['OpenRouter key', /sk-or-v1-[A-Za-z0-9_-]{20,}/g],
  ['GitHub token', /gh[pousr]_[A-Za-z0-9]{30,}/g],
  ['Google API key', /AIza[0-9A-Za-z_-]{30,}/g],
  ['Brevo API key', /xkeysib-[A-Za-z0-9_-]{20,}/g],
  ['Private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g]
];
const htmlFiles=[];
function walk(dir){
  for(const name of readdirSync(dir)){
    if(name==='.git'||name==='node_modules') continue;
    const p=join(dir,name), st=statSync(p);
    if(st.isDirectory()) walk(p);
    else if(textExt.has(extname(name).toLowerCase())){
      const content=readFileSync(p,'utf8');
      for(const [label,re] of secretPatterns){ re.lastIndex=0; if(re.test(content)) failures.push(`${label} appears in ${relative(root,p)}`); }
      if(extname(name)==='.html') htmlFiles.push([p,content]);
    }
  }
}
walk(root);

const robots=existsSync(join(root,'robots.txt'))?readFileSync(join(root,'robots.txt'),'utf8'):'';
const sitemap=existsSync(join(root,'sitemap.xml'))?readFileSync(join(root,'sitemap.xml'),'utf8'):'';
if(!publicMode){
  if(!/Disallow:\s*\//i.test(robots)) failures.push('Pre-launch robots.txt must block all crawling.');
  if(/<url>/i.test(sitemap)) failures.push('Pre-launch sitemap must stay empty.');
} else {
  if(/Disallow:\s*\//i.test(robots)) failures.push('Public robots.txt is still blocking all crawling.');
  if(!/<url>/i.test(sitemap)) failures.push('Public sitemap is empty.');
}

for(const [path,html] of htmlFiles){
  const rel=relative(root,path).replaceAll('\\','/');
  if(!/<title>[^<]+<\/title>/i.test(html)) failures.push(`Missing title: ${rel}`);
  if(!/Content-Security-Policy/i.test(html)) failures.push(`Missing CSP: ${rel}`);
  if(!/name="referrer" content="no-referrer"/i.test(html)) failures.push(`Missing no-referrer policy: ${rel}`);
  if(!publicMode && !/name="robots"[^>]+noindex/i.test(html)) failures.push(`Missing pre-launch noindex: ${rel}`);
  if(publicMode && rel!=='404.html' && rel!=='editor.html' && !/name="robots"[^>]+index,follow/i.test(html)) failures.push(`Public page is not indexable: ${rel}`);
  if(/<script[^>]+src=["']https?:\/\//i.test(html)) failures.push(`External runtime script not allowed: ${rel}`);
  const hrefRe=/href=["']([^"'#?]+)["']/gi; let m;
  while((m=hrefRe.exec(html))){
    const href=m[1];
    if(/^(https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;
    const dest=normalize(join(dirname(path), href));
    if(!existsSync(dest)) failures.push(`Broken internal link in ${rel}: ${href}`);
  }
}

const editorFiles=['js/editor-data.js','js/editor-render.js','js/editor-actions.js','js/editor.js'];
const editor=editorFiles.filter(f=>existsSync(join(root,f))).map(f=>readFileSync(join(root,f),'utf8')).join('\n');
const editorHtml=readFileSync(join(root,'editor.html'),'utf8');
const editorCss=['assets/editor.css','assets/save-fix.css'].map(f=>readFileSync(join(root,f),'utf8')).join('\n');
if(/fetch\s*\(/.test(editor)) failures.push('Editor must not make network fetches in the privacy-first pre-launch build.');
if(!/compressImage/.test(editor)) failures.push('Photo compression function missing.');
if(!/window\.print/.test(editor)) failures.push('PDF/print export flow missing.');
if(!/localStorage/.test(editor)) failures.push('Local storage fallback missing.');
if(!/indexedDB/.test(editor)) failures.push('Durable IndexedDB project storage missing.');
if(!/saveBtn/.test(editor)||!/id="saveBtn"/.test(editorHtml)) failures.push('Explicit Save control or wiring missing.');
if(!/hydrateFromStorage/.test(editor)) failures.push('Reload persistence hydration missing.');
if(!/Smart-fill|smartFill/.test(editor)) failures.push('Smart Fill flow missing.');
if(!/isValidProject/.test(editor)) failures.push('Central project validation missing.');
if(!/safePhoto/.test(editor)||!/\^data:image/.test(editor)) failures.push('Stored/imported photo sources are not restricted to embedded image data URLs.');
if(!/50\*1024\*1024/.test(editor)) failures.push('Backup import size cap missing.');
if(!/id="mobilePageInspector"/.test(editorHtml)||!/id="mobilePersonName"/.test(editorHtml)||!/id="mobileBackupBtn"/.test(editorHtml)) failures.push('Full mobile Studio editing/backup controls are missing.');
if(!/mobilePageInspector/.test(editor)||!/mobilePersonName/.test(editor)) failures.push('Mobile Studio controls are not wired into editor rendering/actions.');
if(!/@page\s*\{[^}]*size\s*:\s*A4\s+portrait/i.test(editorCss)) failures.push('A4 print page sizing rule missing.');
if(!/print-color-adjust\s*:\s*exact/i.test(editorCss)) failures.push('Exact print color output rule missing.');
if(!/ordinal\s*=/.test(editor)||!/ST/.test(editor)||!/ND/.test(editor)||!/RD/.test(editor)) failures.push('Birthday ordinal formatting helper missing.');
for(const src of editorFiles){
  if(!new RegExp(`<script src=["']${src.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`).test(editorHtml)) failures.push(`editor.html is not loading ${src}`);
}

if(failures.length){
  console.error('FOLIOWISH QA FAILED');
  failures.forEach(x=>console.error('- '+x));
  process.exit(1);
}
console.log(`FolioWish QA passed: ${htmlFiles.length} HTML files checked, ${editorFiles.length} studio modules checked, durable Save + central safe validation + mobile editing + A4 print wiring present, ${publicMode?'public':'pre-launch'} mode valid, internal links clean, no obvious secrets or editor network calls found.`);
