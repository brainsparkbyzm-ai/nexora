# NEXORA

NEXORA is a premium AI technology publication, AI tool directory, and
editorial CMS built with Next.js 14 (App Router), TypeScript, Prisma, and
Tailwind CSS.

This README documents setup, environment configuration, deployment, and the
Google AdSense / Search Console readiness process. It also discloses exactly
what could and could not be verified in this environment (see "Verification
status" below) -- this project is **not** claimed to be "fully production
ready" until you have run and reviewed the commands in that section yourself.

## Stack

- Next.js 14 (App Router), React 18, TypeScript (strict mode)
- Prisma + PostgreSQL
- Tailwind CSS
- Session-based auth (`src/lib/auth.ts`, `jose` + `bcryptjs`)
- S3-compatible storage (AWS S3 / Cloudflare R2 / any S3-compatible provider)
- Pluggable transactional email (`src/lib/email.ts`, Resend by default)
- Pluggable analytics (`src/lib/analytics.ts`)
- Google AdSense-ready ad component (`src/components/monetization/AdSlot.tsx`)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in real values, see "Environment variables" below
npx prisma generate
npx prisma migrate deploy   # or `npx prisma migrate dev` for local development
npm run seed                # optional: creates demo content + an admin user (set ADMIN_EMAIL/ADMIN_PASSWORD first)
npm run dev
```

Build and run in production mode:

```bash
npm run build
npm run start
```

## Environment variables

See `.env.example` for the full list with inline documentation. Summary:

**Public (safe for the browser bundle, prefixed `NEXT_PUBLIC_`)**
- `NEXT_PUBLIC_SITE_URL` -- your real production domain (e.g. `https://yourdomain.com`). Used for canonical URLs, `sitemap.xml`, `robots.txt`, `ads.txt`, and Open Graph tags. **Do not leave this as a placeholder in production.**
- `NEXT_PUBLIC_ANALYTICS_ID`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, `NEXT_PUBLIC_ADSENSE_SLOT_*` -- see "Google AdSense setup" below.

**Server-only secrets (never expose to the browser)**
- `DATABASE_URL`, `AUTH_SECRET`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`, `EMAIL_API_KEY`, `RATE_LIMIT_REDIS_URL`.

Generate a strong `AUTH_SECRET` with:

```bash
openssl rand -base64 48
```

## Deployment (Vercel or any Node host)

1. `npm install`
2. Set all environment variables from `.env.example` in your host's dashboard (never commit `.env`).
3. `npx prisma generate`
4. `npx prisma migrate deploy` against your production database.
5. `npm run build`
6. `npm run start` (or let Vercel run build/start automatically).
7. Point your real domain at the deployment and set `NEXT_PUBLIC_SITE_URL` to match it exactly (including `https://`).
8. Confirm HTTPS is active (automatic on Vercel; required for AdSense and for cookies marked `secure` in production).
9. Submit `https://yourdomain.com/sitemap.xml` to Google Search Console (see below).
10. Configure your object storage bucket (S3/R2) and email provider (Resend or your provider of choice) with real credentials.

## Google Search Console readiness

- `src/app/sitemap.ts` generates `/sitemap.xml` from live database content (articles, tools, comparisons, authors, categories) plus static routes.
- `src/app/robots.ts` generates `/robots.txt`, disallows `/admin`, `/api/`, and `/search`, and points to the sitemap.
- Every public page sets a canonical URL and full metadata via `src/lib/seo.ts`'s `buildMetadata`.
- Steps: create a Search Console property for your real domain, verify ownership (DNS or HTML file, per Google's instructions), then submit the sitemap URL. Verification itself must be done by you in the Search Console UI/DNS -- it cannot be fabricated here.

## Google AdSense setup

This project is AdSense-ready but **not** pre-approved -- approval is decided
by Google, not by this codebase, and can take anywhere from a few days to
2-4 weeks. No earnings are promised or guaranteed.

Steps:

1. Create a Google AdSense account.
2. Add your real, live production domain to AdSense.
3. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` to your publisher ID (format `ca-pub-XXXXXXXXXXXXXXXX`).
4. Create ad units in AdSense for whichever placements you want to enable, and set the matching `NEXT_PUBLIC_ADSENSE_SLOT_*` variables in `.env` (see `.env.example`). Any placement left blank stays disabled -- ads are opt-in per placement.
5. Replace the placeholder line in `public/ads.txt` with your real line, e.g. `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`, and deploy so it is reachable at `https://yourdomain.com/ads.txt`.
6. Set `ADS_ENABLED="true"` once you're ready to serve ads.
7. Request review from within AdSense.
8. Wait for Google's review (do not click your own ads or ask others to while pending or after approval -- see Rule 38 / AdSense policies).
9. Ads will begin serving automatically in enabled placements once your account is approved and `ADS_ENABLED="true"`.

Ad placements are conservative by design (homepage feed, article top/middle/bottom, category feed, sidebar) and are never placed over navigation, inside interactive controls, or inside `/admin`.

## Demo/seed content

`prisma/seed.ts` creates demo editorial content and one admin account. The
admin login now comes from environment variables, not hardcoded source:

- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` before running `npm run seed`.
- If you leave them unset, the seed falls back to a **development-only** demo
  login (`admin@nexora.dev` / `NexoraAdmin!2026`) and prints a warning to the
  console. This fallback is for local development only.

**Always set real `ADMIN_EMAIL`/`ADMIN_PASSWORD` values before seeding a
production database, and never commit real credentials to source control,
this README, or any public file.**

## What was changed in this repair pass

See the chat response accompanying this ZIP for the full structured report
(files changed/added, bugs fixed, SEO/AdSense/security improvements, and
manual steps still required). This README intentionally does not duplicate
that report so the two don't drift out of sync.

## Verification status (read before deploying)

This environment has **no outbound network access**, so the following could
not be executed here and must be run by you before deploying:

- `npm install` (no `node_modules`, no fresh `package-lock.json` could be generated)
- `npm run typecheck`
- `npm run build`
- `npm run lint`
- `npx prisma generate` / `npx prisma validate`
- `npm run test`

All fixes in this pass were made by careful manual static review (reading
every changed file's full source, cross-checking function signatures, Prisma
schema fields, and consumer call sites by hand) rather than by an actual
compiler/build run. Please run the commands above yourself immediately after
unzipping, before deploying, and treat any errors they surface as the next
thing to fix. Do not treat this project as "fully production ready" until
you've done so.
