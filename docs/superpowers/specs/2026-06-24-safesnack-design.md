# SafeSnack — Ecommerce Platform Design Spec

- **Date:** 2026-06-24
- **Status:** Draft for approval
- **Source brand:** https://safesnack.in/ (SafeSnacks — "Guilt-Free Snacks", sugar-free / diabetic-friendly / keto, Hyderabad, India, founded 2023)

---

## 1. Goal

Build a premium, calm, trustworthy **health-food ecommerce platform** that sells **SafeSnack Originals** (own, high-margin products) alongside a **curated partner-brand marketplace**. Business goals: increase sales, increase repeat orders, promote SafeSnack Originals, build trust, improve conversion.

This is a multi-phase build. Each phase is independently verifiable. "Production ready" = deployment-ready codebase; going live needs the owner's Razorpay live keys, production Supabase project, email provider key, and hosting.

### Security note (corrects "end-to-end encrypted")
True E2EE does not apply to ecommerce — the server must process orders and payments. The target is **production-grade security**: TLS everywhere, hashed credentials (Supabase Auth), encrypted secrets, RLS-enforced data access, Razorpay signed-webhook verification, input validation, and encryption-at-rest at the database layer.

---

## 2. Architecture

Single **Next.js (App Router) + TypeScript** application serving storefront, all portals, and API. No frontend/backend split at this size.

```
safesnack/
├─ app/
│  ├─ (store)/      → home, /products, /products/[slug], /search, /cart, /checkout, /bundles
│  ├─ (account)/    → customer: orders, tracking, wishlist, reviews, profile, addresses, rewards/referrals
│  ├─ (staff)/      → staff: order queue, fulfillment, low-stock
│  ├─ (admin)/      → admin: products/variants/bundles/brands CRUD, coupons, users/staff, inventory, analytics
│  └─ api/          → route handlers: razorpay order-create, razorpay webhook (signature verify), analytics ingest, email
├─ components/ui/   → design-system primitives
├─ lib/             → supabase clients, auth/role helpers, razorpay, email (resend), validation (zod), pricing
├─ supabase/        → SQL schema, RLS policies, seed
└─ tests/           → vitest (unit) + playwright (e2e)
```

### Stack
- **Framework:** Next.js App Router, TypeScript, Tailwind CSS. Server Components for catalog/SEO/speed; Client Components only for interactivity (cart, filters).
- **Backend:** **Supabase** — PostgreSQL, Supabase Auth, Row-Level Security (RBAC), Storage (product photography), Realtime (live inventory/order status).
- **Payments:** **Razorpay** (test mode now). Order created server-side via Next.js route handler; payment confirmed via **webhook HMAC signature verification**. Secret key never touches the client. RLS alone cannot secure the payment flow — this is why a server route handler is required.
- **Email:** **Resend** (test mode, swappable via `.env`) for transactional order/shipping emails. Supabase Auth handles auth emails.
- **WhatsApp:** **click-to-chat only** — `wa.me` deep links with prefilled order/cart message to the business number. No WhatsApp Business API, no approval blockers.

---

## 3. Visual Design System

Calm, premium, **product-first**. Restraint of Aesop/Notion typography + **appetizing, fresh, healthy** feel (not luxury-skincare, not editorial-magazine). **Products are the design** — real product photography everywhere; no illustrations, abstract graphics, or decorative icons as hero content.

- **Palette (natural):** warm bone `#FAF8F3`, warm charcoal `#1C1B17`, deep forest-green `#2F3D2E`, soft sage `#E7EADF`, muted clay accent `#B5704D`. Large whitespace.
- **Typography:** serif display (**Fraunces** / **Newsreader**) for headings + **Inter** for body.
- **Motion:** subtle fade-ins (opacity + 8px translate), soft hover (border/shadow), gentle image zoom (`scale 1.03`), smooth page transitions — **all ≤300ms, ease-out**, respect `prefers-reduced-motion`. No parallax, WebGL, floating elements, autoplay carousels.
- **SafeSnack Originals get the most visual real estate** across the entire customer journey (home, catalog ranking, product pages, bundles).

Component/layout inspiration sourced from 21st.dev during build, adapted to this palette — never used raw.

---

## 4. Homepage Structure

```
Hero → Trust Bar → Shop By Goal → SafeSnack Originals → Why SafeSnack →
Best Sellers → Healthy Lifestyle → Partner Brands → Reviews → FAQ → CTA
```

- **Trust Bar:** quick believe-reasons (sugar-free, nutritionist-approved, diabetic-friendly, fast delivery, ratings) — trust-building.
- **Shop By Goal:** Weight Loss / Diabetic-Friendly / Keto / Protein / Kids (maps to dietary tags + bundles).
- **SafeSnack Originals** sits above Partner Brands deliberately.
- **Healthy Lifestyle:** editorial/lifestyle content block (real photography) reinforcing the brand promise.
- **FAQ + CTA:** address objections, drive conversion; FAQ doubles as SEO FAQ schema.
- **Bundles are heavily promoted** throughout (hero, Shop By Goal, dedicated `/bundles`) — primary AOV lever (+20–40%). Named packs: Diabetic Starter, Weight Management, Kids Healthy Snack, Office Snack Box, High Protein.
- **Every homepage block above is admin-editable via the Homepage CMS** (§5) — no code deploy needed.

---

## 5. Data Model (PostgreSQL via Supabase)

| Entity | Key fields / purpose |
|--------|----------------------|
| **Profile** | extends `auth.users`; `role` = CUSTOMER \| STAFF \| ADMIN; name, phone |
| **Address** | user addresses; pincode (drives delivery zone) |
| **Brand** | name, slug, logo, `isHouseBrand` (true = SafeSnack Originals) |
| **Category** | name, slug |
| **Product** | name, slug, description, brandId, categoryId, dietary tags (sugar-free/keto/diabetic/vegan), ingredients, nutrition, `isActive`, rating cache. **Storytelling:** `benefits`, `story`, `featuredIngredients`, `servingSuggestions` (brands sell stories, not SKUs) |
| **ProductImage** | productId, url, `type` = PRIMARY \| HOVER \| GALLERY \| LIFESTYLE \| NUTRITION_LABEL \| INGREDIENT, sortOrder (photography is the product) |
| **ProductRelationship** | productId, relatedProductId, `type` = RELATED \| FREQUENTLY_BOUGHT_TOGETHER (drives AOV) |
| **HomepageContent** | admin-editable CMS: hero title/subtitle/CTA, featured products, featured bundles, banners, lifestyle block — no code deploy |
| **SearchQuery** | query text, resultsCount, userId?, sessionId, ts (merchandising insight) |
| **Variant** | productId, label (50g/100g/200g), price, compareAtPrice, sku |
| **Bundle** | name, slug, description, price, images (e.g. Weight Loss / Diabetic / Protein / Kids packs) |
| **BundleItem** | bundleId, variantId, qty |
| **Coupon** | code, type PERCENT\|FLAT, value, minOrder, maxDiscount, usageLimit, perUserLimit, startsAt, expiresAt, active |
| **RewardPointLedger** | userId, delta, reason, orderId, running balance |
| **Referral** | referrerId, code, refereeId, status, rewardGranted |
| **Batch** | variantId, batchNumber, mfgDate, expiryDate, quantity (food: FEFO) |
| **InventoryMovement** | variantId/batchId, type IN\|OUT\|ADJUST\|SALE\|EXPIRED, qty, ref, staffId, ts (audit trail) |
| **Order** | userId, status, subtotal, discount, deliveryFee, total, couponId, deliveryZoneId, address snapshot, razorpayOrderId, paymentId, paymentStatus, pointsEarned, pointsRedeemed |
| **OrderItem** | orderId, variantId or bundleId, qty, unitPrice, lineTotal, batch allocations |
| **Review** | productId, userId, rating, title, body, `verifiedPurchase`, status |
| **WishlistItem** | userId, productId |
| **DeliveryZone** | pincode/area, deliveryFee, minOrder, etaMinutes (Hyderabad ops) |
| **Notification** | userId, type, title, body, read — in-app + email channel |
| **AnalyticsEvent** | type PRODUCT_VIEW \| ADD_TO_CART \| BEGIN_CHECKOUT \| PURCHASE \| SEARCH, userId?, sessionId, productId?, value?, ts (powers funnel + merchandising; abandoned-cart = BEGIN_CHECKOUT without PURCHASE) |
| **SubscriptionPlan** *(placeholder)* | name, interval (WEEKLY/MONTHLY), price, items — **schema only, nullable, not built now**; eases future snack-box/delivery-plan migration |
| **SubscriptionOrder** *(placeholder)* | planId, userId, nextDeliveryAt, status — **schema only, not built now** |

- **Stock** = sum of a variant's batch quantities; allocation is **FEFO** (first-expiry-first-out).
- **Cart:** client-side (localStorage) reconciled to server on login.
- **Order status:** `PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED`, plus `CANCELLED / REFUNDED`. Drives customer tracking + staff queue.

---

## 6. Build Order (phased)

| Phase | Delivers |
|-------|----------|
| **0 — Foundation** | Scaffold, Tailwind + design tokens, Supabase schema + RLS policies, seed (brands incl. Originals + partners, ~16 products, variants, bundles, delivery zones, coupons) |
| **1 — Storefront** | Home (Originals-first), catalog, product detail (variants, **storytelling: benefits/story/featured-ingredients/serving-suggestions**, **full photography set**: primary/hover/gallery/lifestyle/nutrition-label/ingredient), **Frequently Bought Together + Related**, bundles (heavily promoted), **search intelligence** (by ingredient / dietary goal / health objective — "high protein", "low sugar", "diabetic", "weight loss", "kids snacks") + filters, **SEO JSON-LD** (Product, Review, FAQ, Organization, Breadcrumb) |
| **2 — Auth** | Supabase Auth, roles, RLS enforcement, customer profile/addresses, referral-code capture on signup |
| **3 — Checkout** | Cart (variants + bundles), coupon apply, delivery zone (pincode → fee/min/ETA), points redeem hook, **Razorpay** (route-handler create + webhook verify), order confirmation, **WhatsApp click-to-chat**, order tracking, points-earn on purchase, order emails |
| **4 — Admin Portal** | Product/variant/bundle/brand CRUD (incl. storytelling fields, image-type uploads, FBT/related links), coupon management, user/staff management, **Homepage CMS** (hero/featured/banners/lifestyle — no code deploy), **analytics dashboard** |
| **5 — Staff Portal** | Order queue, status transitions, fulfillment, low-stock view |
| **6 — Inventory** | Batches (mfg/expiry/batch#), FEFO allocation, InventoryMovement audit, expiry + low-stock alerts |
| **7 — Reviews / Wishlist** | Verified-purchase reviews, rating aggregation, wishlist |
| **8 — Rewards / Referrals / Loyalty** | Points ledger + earning rules, referral codes + rewards, redemption (completes phase-3 hooks) |
| **9 — Polish** | Micro-interactions (≤300ms), WCAG AA, performance (image optimization, RSC), security hardening, full SEO schema sweep, reduced-motion |

**Rationale:** business cannot operate without Admin/Staff/Inventory; it can operate without reviews/rewards — so operations precede engagement features.

**Cross-phase dependencies:** coupons/points are *applied* at checkout (phase 3) but *managed* in admin (phase 4) and their *earning/referral engine* lands in phase 8. Phase 3 builds the apply/redeem hooks; phase 8 fills the engine behind them.

---

## 7. Analytics Dashboard (Admin)

**Business:**
- **Revenue:** daily / weekly / monthly.
- **Customers:** new vs returning.
- **Funnel:** Product View → Add to Cart → Begin Checkout → Purchase (from `AnalyticsEvent`).

**Merchandising** (becomes very valuable after ~6 months):
- Product views, **add-to-cart %**, **conversion %**, **revenue per product**.
- Revenue per category, top / low sellers.
- **Search queries** (from `SearchQuery`) — surfaces demand + gaps.
- **Abandoned carts** (BEGIN_CHECKOUT without PURCHASE).

Substance over decorative charts.

---

## 8. SEO (from day one)

JSON-LD structured data baked into storefront from phase 1: **Product, Review, FAQ, Organization, Breadcrumb** schema. Per-page metadata, sitemap, semantic HTML.

---

## 9. Security & Testing

- **Security:** Supabase Auth (hashed credentials), per-role **RLS** policies, server-side Razorpay secret + **webhook HMAC verification**, **zod** validation on all route handlers/edge functions, rate-limiting on auth, secrets in `.env.local`, Storage bucket policies for images, parameterized queries (no SQL injection), encryption-at-rest at DB layer, TLS in transit.
- **Testing:** **Vitest** units (pricing, coupon calc, points, FEFO allocation, delivery-fee logic). **Playwright** e2e (browse → variant → cart → coupon → checkout → order; admin product CRUD; staff fulfill; inventory batch expiry).

---

## 10. Explicitly Out of Scope (YAGNI for now)

Multi-warehouse, multi-currency, WhatsApp Business API automation, native mobile apps, third-party analytics (GA), blog/articles CMS. **Subscriptions:** nullable schema placeholder only (§5) — tables exist, feature not built now, so future snack-box/delivery-plan migration is painless. Data model leaves room for the rest without rework.
