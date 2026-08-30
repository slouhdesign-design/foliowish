# Current Status

## 2026-08-30
- Repository established as the durable source of truth.
- Active branch: `prelaunch`.
- Deployment: not connected.
- Planned domain: `foliowish.com`.
- Durable Save is present with IndexedDB plus `localStorage` fallback, explicit Save, autosave, backup/import and reload hydration.
- Project validation is now centralized and reused for imported backups, `localStorage` recovery and IndexedDB hydration. Stored/imported photos remain restricted to embedded image data URLs, zoom is range-checked, and backup imports are capped at 50 MB.
- Mobile Studio now has full person/setup fields, page-content editing, theme/page library controls, and project backup/import access instead of preview-only editing.
- Smart Fill now formats birthday ordinals correctly (for example 21ST instead of 21TH) and keeps the Reasons headline consistent with the 18-item layout limit.
- A4 export is hardened with an explicit `@page` rule, exact print-color output, mobile-drawer suppression during print, and a double-animation-frame handoff before opening the browser print dialog.
- `qa.mjs` now guards central safe validation, the backup size cap, mobile editing/backup wiring, ordinal formatting, A4 page sizing and exact print color rules.
- The canonical GitHub Actions workflow was restored after a diagnostic no-Marketplace-actions experiment. Run #62 still failed before any job step was created (`steps = null`), so the remaining CI blocker is outside FolioWish workflow commands/application code and must be resolved in GitHub Actions runner/account/repository execution settings.
- Repository source search found no OpenRouter or Brevo key signatures in the accessible code index.
- Public deployment remains blocked until runtime browser checks at mobile/desktop widths and Chromium PDF output are verified and the owner explicitly approves launch.

Next durable milestone: resolve hosted-runner execution, run the full static gate, then complete browser/mobile/PDF QA and only after that prepare a clean staging preview.

This file is updated at each major milestone so work can resume from GitHub without relying on chat memory or a temporary filesystem.
