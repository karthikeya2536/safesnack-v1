# SafeSnack Electric Pantry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace SafeSnack's entire UI with Electric Pantry while preserving every backend, route, data, auth, checkout, and analytics contract.

**Architecture:** Build one CSS-token design system and small shared UI primitives, then migrate surfaces in dependency order: shell, storefront, commerce, account, operations. Keep Server Components server-side; isolate interactive motion in existing or new client leaves.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 3, native CSS, existing browser tests.

## Global Constraints

- UI-only changes. Do not modify `src/lib`, `src/app/api`, middleware, Supabase, Razorpay, schema, query contracts, analytics names, URLs, or form field names.
- Electric Pantry palette: Frost `#F4F6F3`, Porcelain `#FCFDF9`, Graphite `#171916`, Steel `#626861`, Mist `#DDE2DC`, Raspberry `#E83E62`.
- Outfit display and Manrope body via `next/font`.
- Cards 16px, inputs 12px, interactive controls pill-shaped.
- Motion 180-280ms; complex transitions max 420ms; transform and opacity only.
- Support 375px, 768px, 1024px, 1440px and `prefers-reduced-motion`.
- WCAG AA, visible focus, 44px minimum touch targets.
- No generic gradients, glow, component-library default styling, WebGL, custom cursor, or scroll hijacking.
- Preserve unrelated dirty-worktree changes.

---

### Task 1: Foundation and shared shell

**Files:**
- Create: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/site/Header.tsx`
- Modify: `src/components/site/Footer.tsx`
- Modify: `src/components/ui/FadeIn.tsx`
- Modify: `src/components/ui/PageTransition.tsx`

**Interfaces:**
- Produces semantic tokens and reusable classes consumed by all later tasks.

- [ ] Restore `globals.css`; define tokens, typography, buttons, fields, surfaces, focus, reduced-motion, selection, and responsive shell rules.
- [ ] Align Tailwind colors/fonts to Electric Pantry variables; remove stale Fraunces/Inter mapping.
- [ ] Rebuild header as single-line desktop nav plus accessible mobile menu.
- [ ] Rebuild footer with existing links/contact content.
- [ ] Keep transition components lightweight and reduced-motion safe.
- [ ] Run `npm run build`; expect successful compile.
- [ ] Browser-test header/footer at 375px and 1440px.
- [ ] Commit only task files: `feat: build Electric Pantry foundation`.

### Task 2: Shared commerce components

**Files:**
- Modify: `src/components/ui/ProductCard.tsx`
- Modify: `src/components/ui/ClientImage.tsx`
- Modify: `src/components/ui/VariantPicker.tsx`
- Modify: `src/components/wishlist/WishlistButton.tsx`
- Modify: `src/components/wishlist/RemoveButton.tsx`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/ui/SectionHeading.tsx`

**Interfaces:**
- Consumes foundation tokens.
- Produces shared catalog, recommendation, wishlist, and empty-state presentation.

- [ ] Rebuild ProductCard with image-first hierarchy, tags outside imagery, restrained hover, and branded fallback.
- [ ] Restyle variant, wishlist, and remove controls without changing handlers or props.
- [ ] Add presentational EmptyState and SectionHeading components.
- [ ] Run `npm run build`; expect successful compile.
- [ ] Browser-check card states at mobile/desktop widths.
- [ ] Commit: `feat: redesign shared commerce components`.

### Task 3: Homepage

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/home/SnackWindow.tsx`
- Create: `src/components/home/IngredientCompare.tsx`
- Create: `src/components/home/FaqAccordion.tsx`

**Interfaces:**
- Consumes existing homepage/product queries unchanged.
- Produces client-only motion leaves with no data mutation.

- [ ] Recompose homepage per spec: hero, trust strip, Originals, ingredient education, dietary discovery, bundles, story, social content, FAQ, closing CTA.
- [ ] Build Snack Window mask reveal with static mobile/reduced-motion fallback.
- [ ] Build accessible ingredient comparison and FAQ interactions.
- [ ] Remove invented metrics, social counts, and unsupported claims.
- [ ] Run `npm run build`.
- [ ] Browser-test 375px and 1440px; verify no overflow and CTA above fold.
- [ ] Commit: `feat: redesign SafeSnack homepage`.

### Task 4: Catalog, search, bundles, product detail

**Files:**
- Modify: `src/app/products/page.tsx`
- Modify: `src/app/products/[slug]/page.tsx`
- Modify: `src/app/search/page.tsx`
- Modify: `src/app/bundles/page.tsx`
- Modify: `src/components/reviews/ReviewForm.tsx`

**Interfaces:**
- Preserve search params, query calls, structured data, tracking calls, variant behavior, cart behavior, reviews, and wishlist behavior.

- [ ] Rebuild catalog heading, filters, active states, responsive grid, and reset empty state.
- [ ] Rebuild product detail gallery, sticky purchase panel, story, reviews, and recommendations.
- [ ] Rebuild search and bundle compositions using shared components.
- [ ] Restyle review form with unchanged request behavior.
- [ ] Run `npm test` and `npm run build`.
- [ ] Browser-smoke `/products`, filtered URLs, one product, `/search`, `/bundles`.
- [ ] Commit: `feat: redesign storefront browsing`.

### Task 5: Cart and checkout

**Files:**
- Modify: `src/app/cart/page.tsx`
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/components/checkout/CheckoutClient.tsx`

**Interfaces:**
- Preserve localStorage cart format, WhatsApp URL, coupon/points behavior, checkout payloads, Razorpay flow, and tracking events.

- [ ] Rebuild cart with responsive lines and sticky summary.
- [ ] Rebuild checkout groups, fields, order summary, loading, disabled, and error states.
- [ ] Audit every input label and touch target.
- [ ] Run `npm test` and `npm run build`.
- [ ] Browser-test empty/populated cart and checkout validation without completing payment.
- [ ] Commit: `feat: redesign cart and checkout`.

### Task 6: Authentication and customer account

**Files:**
- Modify: `src/components/auth/AuthLayout.tsx`
- Modify: `src/components/auth/AuthForm.tsx`
- Modify: `src/components/auth/SignOutButton.tsx`
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/signup/page.tsx`
- Modify: `src/app/account/layout.tsx`
- Modify: all `src/app/account/**/page.tsx`
- Modify: `src/components/account/AddressManager.tsx`
- Modify: `src/components/account/ProfileForm.tsx`

**Interfaces:**
- Preserve auth actions, field names, redirects, role behavior, profile/address mutations, orders, rewards, referrals, and wishlist data.

- [ ] Rebuild auth split layout and form states.
- [ ] Rebuild account navigation and all customer pages.
- [ ] Restyle profile/address controls and empty states.
- [ ] Run `npm test` and `npm run build`.
- [ ] Browser-smoke public auth pages and authenticated account pages when session exists.
- [ ] Commit: `feat: redesign auth and customer account`.

### Task 7: Admin and staff

**Files:**
- Modify: all `src/app/admin/**`
- Modify: all `src/app/staff/**`
- Modify: all `src/components/admin/**`
- Modify: all `src/components/staff/**`

**Interfaces:**
- Preserve role guards, server actions, forms, product fields, CMS fields, order transitions, inventory mutations, and analytics data.

- [ ] Apply compact operational shell with shared tokens.
- [ ] Restyle dashboards, forms, tables, status controls, empty/loading/error states.
- [ ] Keep destructive actions separated and labeled.
- [ ] Run `npm test` and `npm run build`.
- [ ] Browser-smoke admin/staff routes when authorized.
- [ ] Commit: `feat: redesign admin and staff UI`.

### Task 8: Final visual and regression verification

**Files:**
- Modify only UI files needing verified fixes.

**Interfaces:**
- No new interfaces.

- [ ] Run `git diff --name-only`; confirm no backend/API/database/query files changed.
- [ ] Run `npm test`; expect pass.
- [ ] Run `npm run build`; expect pass.
- [ ] Browser-check public routes at 375px, 768px, 1024px, 1440px.
- [ ] Verify keyboard navigation, focus, reduced motion, empty/loading/error/disabled states.
- [ ] Check console errors and horizontal overflow.
- [ ] Compare screenshots against Electric Pantry spec; remove library-default or gratuitous effects.
- [ ] Commit: `fix: complete Electric Pantry visual QA`.
