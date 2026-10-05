# SETU — Societal Innovation Collaboration Portal

Demo-grade implementation for SIH Problem Statement 26043.

## What is included

- Citizen sign-in and problem submission
- Local AI triage with 7 transparent stages
- Public problem browser and detail/timeline view
- Government dashboard, moderation queue and AI console
- University/industry organisation workspace
- Marketplace and solution bid submission
- Government bid evaluation and project award
- Project milestone workspace
- JSON-backed persistence with a reset script
- Responsive UI with no paid services or external database required

## Run

Requires Node.js 20+ (Node 24 is supported by the app's dependency set).

```bash
npm install
npm run dev
```

Open http://localhost:3000

If you want to restore the seeded demo data:

```bash
npm run demo:reset
```

Then restart/reload the app.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Citizen | citizen@demo.in | demo123 |
| Government | gov@demo.in | demo123 |
| University | university@demo.in | demo123 |
| Industry | industry@demo.in | demo123 |

## Architecture

Browser → Next.js App Router → API Route Handlers → `lib/db.ts` → JSON persistence

AI layer:

`lib/triage.ts` exposes a provider-shaped local triage implementation using domain lexicons, spam heuristics, priority rules and routing-compatible scores. It is intentionally network-free so the demo works without API keys.

## Scope

This is a runnable MVP/demo, not a production security or compliance implementation. The original plan describes additional WebAuthn, TOTP, Prisma, Gemini, uploads, email, maps, analytics, i18n and accessibility work. Those can be layered onto this working base without changing the main product flows.

## v2 improvements
- Session-aware navbar on every page (role links, active state, unread bell, sign out) and route guards that redirect to login or the role's home.
- Fixed the broken **My Bids** link; added `/org/bids`, `/gov/projects`, `/gov/audit`, `/notifications`, `/about`, `/impact`, plus 404 and loading pages.
- Moderation works (approve / ask for details / reject) and notifies the citizen and logs an audit entry.
- Citizens can corroborate problems; the problems page has search, filters and sorting.
- 3-step submit wizard with a live AI triage preview.
- Bids use the signed-in organisation, block duplicates and are auto-scored; awarding closes other bids and notifies everyone.
- Milestone workflow: organisations start and submit, government verifies; a finished project marks the problem impact-verified.
