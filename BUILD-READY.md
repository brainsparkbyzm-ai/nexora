# NEXORA — Build Ready Notes

This package contains the source-level fixes made from the actual build output.

## Fixed

1. `src/app/admin/reviews/page.tsx`
   - The Prisma `tool` selection now includes `name`, `rating`, and `lastReviewedAt`, matching the fields used by the page.

2. `.eslintrc.json`
   - Removed the direct `@typescript-eslint/no-unused-vars` rule reference. The project did not declare/load the corresponding TypeScript ESLint plugin, which caused the same ESLint configuration error across the entire source tree.
   - Kept the existing `react/no-unescaped-entities` override.

3. Next.js security patch
   - Updated `next` and `eslint-config-next` from `14.2.25` to `14.2.35`.

## On the deployment machine

Use Node 20 LTS for this Next 14 / Prisma 5 project if available.

```bash
npm install
npx prisma generate
npm run build
npm run start
```

Set all required production environment variables, especially `DATABASE_URL`, before running the production server.

This source package was reviewed and patched from the supplied project/build output. A full production build could not be independently executed in this sandbox because npm package installation timed out, so the package should not be described as having a sandbox-verified production build until `npm run build` completes on the deployment machine.
