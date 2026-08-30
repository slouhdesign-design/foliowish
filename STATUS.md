# Current Status

## 2026-08-30
- Repository established as the durable source of truth.
- Active branch: `prelaunch`.
- Deployment: not connected.
- Planned domain: `foliowish.com`.
- Durable Save is present with IndexedDB plus `localStorage` fallback, explicit Save, autosave, backup/import and reload hydration.
- Backup import is hardened: project shape is validated before use and imported photo sources are restricted to embedded image data URLs, preventing malformed backups from crashing the Studio or introducing remote image requests.
- `Quality Gate` was rewritten to be self-contained and no longer depends on `actions/checkout` or `actions/setup-node`; it starts with a plain shell runner smoke check.
- Run #55 still failed before any step was created (`steps = null`). This isolates the remaining CI blocker to GitHub Actions runner/account/repository infrastructure rather than FolioWish workflow steps or application code.
- `qa.mjs` now also guards the hardened project-import validator and the embedded-image-only backup rule.
- Repository source search found no OpenRouter or Brevo key signatures in the accessible code index.
- Next durable milestone: restore GitHub-hosted runner execution, then run the complete static gate plus browser/mobile/PDF QA before public launch.

This file is updated at each major milestone so work can resume from GitHub without relying on chat memory or a temporary filesystem.
