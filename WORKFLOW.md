# FolioWish Build Continuity

This repository is the canonical working copy.

## Branch model
- `main`: stable checkpoint only.
- `prelaunch`: all active product work.

## Continuity rule
At the end of every meaningful build stage, commit the complete working state to `prelaunch` before starting the next stage. Never rely on a temporary local workspace as the only copy.

## Deployment rule
No Vercel/deployment connection during active build. Deployment is a separate approval gate after functional, security, mobile, SEO and performance QA.

## Planned domain
`foliowish.com` is the preferred future canonical domain. It is not purchased or connected yet.
