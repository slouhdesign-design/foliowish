# FolioWish

Pre-launch static web app for a free birthday magazine maker.

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Architecture
No build step and no third-party runtime dependencies. Plain HTML, CSS and JavaScript make the first release easy to audit and deploy.

- `index.html` — SEO landing page
- `editor.html` + `js/editor-*.js` — browser magazine studio
- `templates/` — template gallery
- `ideas/` — original editorial guides
- `assets/` — site/editor styles and icon
- `docs/` — product, SEO, AdSense and launch gates

## Product
The first FolioWish maker creates an A4 birthday magazine with guided cover, profile, reasons, gallery, timeline, playlist, letter and back-cover layouts. It includes eight editorial themes, Smart Fill, local photo compression, explicit Save + autosave, project backup/import, undo/redo, a print-safe overlay, Studio Check and browser PDF export.

## Privacy
The pre-launch editor stores the full project locally in IndexedDB with a `localStorage` fallback. Uploaded photos are compressed client-side. No photo-upload API or editor network request is present. Backup downloads a portable JSON project file.

## Quality

```bash
npm run qa
node --check js/editor-data.js
node --check js/editor-render.js
node --check js/editor-actions.js
node --check js/editor.js
```

GitHub Actions runs the same gate on `main` and `prelaunch`.

## Pre-launch lock
`robots.txt` blocks crawling, public pages use `noindex`, and `sitemap.xml` is intentionally empty. Do not unlock until explicit launch approval.

## Repository
Standalone project repository: `slouhdesign-design/foliowish`.

## Planned domain
`foliowish.com` is the preferred future public domain. It is not purchased or connected in this pre-launch repository. See `docs/DOMAIN.md`.

## Monetization order
AdSense is the first monetization target after the site has real public value, a sufficient original-content footprint, policy/legal readiness and genuine traffic signals. Ads are deliberately absent from the pre-launch build and must never obstruct the editor or PDF export.

## Release safety
Public indexing requires both `PUBLIC_ORIGIN` and `ALLOW_PUBLIC_LAUNCH=YES`; use the release scripts only after explicit launch approval.
