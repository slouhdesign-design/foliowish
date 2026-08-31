# Current Status

## 2026-08-31
- Repository remains the durable source of truth on branch `prelaunch`; public deployment and the planned `foliowish.com` domain remain disconnected.
- Durable Save is present with IndexedDB plus `localStorage` fallback, explicit Save, autosave, backup/import and reload hydration.
- Project validation is centralized and reused for imported backups, `localStorage` recovery and IndexedDB hydration. Stored/imported photos are restricted to embedded image data URLs, zoom is range-checked, and backup imports are capped at 50 MB.
- Mobile Studio has full person/setup fields, page-content editing, theme/page library controls, and project backup/import access instead of preview-only editing.
- Smart Fill formats birthday ordinals correctly (for example 21ST instead of 21TH) and keeps the Reasons headline consistent with the 18-item layout limit.
- A4 export uses an explicit `@page` A4 portrait rule, exact print-color output, mobile-drawer suppression during print, and a double-animation-frame handoff before the browser print dialog. The 595×842 design canvas scaled by 1.333333 maps closely to A4 at CSS print resolution.
- `qa.mjs` guards central safe validation, the backup size cap, mobile editing/backup wiring, ordinal formatting, A4 page sizing, exact print color rules and Netlify staging configuration.
- Netlify staging is prepared in-repo: `netlify.toml` now requires `npm run qa` before `scripts/netlify-build.mjs`, publishes only `_site`, and applies security headers. The build script copies only public site files/directories; internal `docs/`, `.github/` and `scripts/` content is excluded. Prelaunch/preview builds add `X-Robots-Tag: noindex, nofollow, noarchive`.
- GitHub Actions hosted-runner execution is still blocked. A fresh re-run and the new run #73 on 2026-08-31 both failed before any workflow step was created (`steps = null`). This remains an account/repository runner/billing execution issue rather than an application command failure.
- The current execution environment could not clone the public repository because outbound DNS/network access to github.com is unavailable, so a second independent local execution of `npm run qa` was not possible in this run.
- Runtime browser checks at 360/390/430 and 1280/1440 widths plus a real Chromium PDF export remain unverified until a staging URL/browser runtime is available.
- Public launch remains blocked until those runtime checks pass and the owner explicitly approves launch.

Next durable milestone: connect Netlify to `prelaunch` as a noindex staging preview. Netlify will now run the static Quality Gate itself before building, so staging can proceed even while GitHub-hosted Actions remain unavailable. Then execute the browser/mobile/PDF runtime matrix against the staging URL. Do not switch the production branch or attach the public domain until explicit launch approval.

This file is updated at each major milestone so work can resume from GitHub without relying on chat memory or a temporary filesystem.
