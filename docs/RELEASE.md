# Release Procedure

## Pre-launch
The repository stays crawl-blocked with noindex metadata, `robots.txt` Disallow `/`, and an empty sitemap.

## Preview gate
1. Run `npm run qa`.
2. Run `node --check js/editor.js`.
3. Test editor flows on mobile and desktop.
4. Generate a real PDF and inspect every page.
5. Confirm domain ownership, legal contact, privacy/consent and analytics plan.
6. Obtain explicit owner approval for public launch.

## Public unlock
Only after approval:

```bash
PUBLIC_ORIGIN=https://foliowish.com ALLOW_PUBLIC_LAUNCH=YES npm run release:unlock
```

Then run QA in public mode and review the diff before release.

## Emergency re-lock
```bash
npm run release:lock
```

This restores robots blocking, noindex metadata and an empty sitemap.
