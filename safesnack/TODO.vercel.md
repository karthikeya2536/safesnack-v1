# Vercel Deployment Readiness Checklist (SafeSnack)

## Plan-based steps
- [ ] Confirm required environment variables are set in Vercel.
- [ ] Run `npm run build` locally with the same env vars to catch failures early.
- [ ] Connect the repo to Vercel and deploy.
- [ ] Validate key routes after deploy:
  - [ ] `/` (homepage fetch)
  - [ ] `/sitemap.xml`
  - [ ] `/robots.txt` (robots route)
  - [ ] Protected routes (e.g. `/account`) redirect correctly.

## Required Vercel env vars (from code)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Recommended env vars (from code)
- `NEXT_PUBLIC_SITE_URL`

