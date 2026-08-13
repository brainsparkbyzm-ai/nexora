# Deploying NEXORA

This project is a standard Next.js 14 (App Router) app with a PostgreSQL
database via Prisma. It can be deployed to any platform that runs Node.js 18+
and can reach a PostgreSQL database. Below are the two most common paths.

## 1. Vercel (recommended)

1. Push this repository to GitHub/GitLab/Bitbucket and import it into Vercel.
2. Provision a PostgreSQL database (Vercel Postgres, Neon, Supabase, or
   Railway all work) and copy its connection string.
3. In Vercel Project Settings → Environment Variables, set every variable
   from `.env.example` (see the "Environment variables" section of
   `README.md`). At minimum: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`,
   `AUTH_SECRET`, `AUTH_COOKIE_NAME`.
4. Set the Vercel build command to:
   ```bash
   npx prisma generate && npx prisma migrate deploy && next build
   ```
   (or keep `next build` as the build command and run `prisma migrate deploy`
   as a one-off from your machine / a CI step — either works).
5. Deploy. On first deploy, run the seed script once from your local machine
   pointed at the production `DATABASE_URL` if you want demo content and an
   initial admin user:
   ```bash
   DATABASE_URL="<production-url>" ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="..." npm run seed
   ```
6. Point your domain's DNS at Vercel and update `NEXT_PUBLIC_SITE_URL` to the
   final production domain (this drives canonical URLs, `sitemap.xml`,
   `robots.txt`, `ads.txt`, and Open Graph tags — see Rule 34/`README.md`).

## 2. Any Node host (Docker, VM, Railway, Render, etc.)

```bash
npm install
npm run build
npx prisma generate
npx prisma migrate deploy
npm run start   # serves on PORT (default 3000)
```

Set the same environment variables from `.env.example` in that host's
environment/secrets manager before starting the app. Put a reverse proxy
(Nginx, Caddy, the platform's own edge) in front of `npm run start` for
TLS termination.

## Object storage (media uploads)

Media uploads (`src/lib/storage.ts`) go to an S3-compatible bucket, not to
the app's local filesystem — required for platforms with ephemeral/no local
disk (Vercel, most containers). Create a bucket (AWS S3, Cloudflare R2,
Backblaze B2, etc.), create an access key scoped to that bucket only, and set
`STORAGE_PROVIDER`, `STORAGE_ENDPOINT`, `STORAGE_REGION`, `STORAGE_BUCKET`,
`STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`, and
`STORAGE_PUBLIC_BASE_URL` accordingly. Make sure the bucket (or a CDN in
front of it) is publicly readable at `STORAGE_PUBLIC_BASE_URL`, since that URL
is what gets embedded directly in article/tool images.

## Database migrations going forward

- Local development: `npx prisma migrate dev --name <change-description>`
  after editing `prisma/schema.prisma`, then commit the generated migration
  folder under `prisma/migrations/`.
- Production: `npx prisma migrate deploy` applies committed migrations; it
  never generates new ones and is safe to run as part of every deploy.

## Post-deploy checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to the real production domain (not
      `localhost`) — required for correct SEO metadata and `ads.txt`.
- [ ] `AUTH_SECRET` is a unique, long, random value in production (never
      reuse the `.env.example` placeholder).
- [ ] At least one admin account exists (`npm run seed`, or create one
      directly in the database) — `/admin` has no self-signup.
- [ ] Ads stay off until you decide to turn them on: `ADS_ENABLED="false"`
      in the environment AND `SiteSettings.adsEnabled = false` in
      `/admin/settings` are both safe, no-ad defaults; both must be turned on
      together to actually serve ads (see "Google AdSense setup" in
      `README.md`).
- [ ] `STORAGE_PUBLIC_BASE_URL` bucket/CDN is publicly reachable — test by
      uploading one image from `/admin/media` and loading its URL directly.
- [ ] Transactional email (`EMAIL_API_KEY`) verified with a real test send
      (newsletter confirmation) before announcing the newsletter publicly.
- [ ] `robots.txt` / `sitemap.xml` load correctly at the production domain
      and reference that domain, not `localhost`.

## What is NOT verified in this sandbox

This project was built and repaired in a sandbox with no outbound network
access, so the following could not be executed here and must be run for real
before you rely on them (see "Verification status" in `README.md` for exact
commands and observed results):

- `npm install` (no registry access)
- `npx prisma generate` / `npx prisma migrate deploy` against a real database
- `next build` (depends on `npm install` having completed)
- An actual AdSense approval or real ad impressions
- Real email/SMS delivery through your chosen provider

Run each of these yourself in an environment with network access before
considering the app production-ready.
