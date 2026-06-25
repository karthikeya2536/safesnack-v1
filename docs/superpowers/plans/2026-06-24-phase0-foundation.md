# SafeSnack Phase 0 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js + Supabase project skeleton with full DB schema, RLS, seed data, and design tokens — so all later feature phases have a working foundation.

**Architecture:** Single Next.js App Router (TypeScript) app. Supabase (Postgres + Auth + RLS + Storage) as backend. Schema and policies as SQL migrations; seed via SQL. Design tokens in Tailwind config.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (local CLI), Razorpay (later), Resend (later), Vitest, Playwright.

## Global Constraints

- Node 20+, package manager: npm.
- All secrets in `.env.local` (gitignored). Never commit keys.
- Roles: CUSTOMER | STAFF | ADMIN — enforced via Supabase RLS.
- 24 entities per spec §5 (incl. nullable Subscription* placeholders).
- Premium calm design: bone `#FAF8F3`, charcoal `#1C1B17`, forest `#2F3D2E`, sage `#E7EADF`, clay `#B5704D`; Fraunces/Newsreader + Inter; transitions ≤300ms; respect `prefers-reduced-motion`.
- Stock = sum of variant batch quantities; allocation FEFO.
- Spec: `docs/superpowers/specs/2026-06-24-safesnack-design.md`.

---

### Task 1: Scaffold Next.js + Tailwind + tooling

**Files:**
- Create: project root `D:/safe snack/safesnack/` (Next.js app)
- Modify: `tailwind.config.ts`, `package.json`
- Create: `.env.local.example`, `.gitignore`

- [ ] **Step 1: Scaffold app**

Run:
```bash
cd "D:/safe snack" && npx create-next-app@latest safesnack --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --no-turbopack
```
Expected: `safesnack/` created, `npm run build` works.

- [ ] **Step 2: Add deps**

```bash
cd "D:/safe snack/safesnack" && npm i @supabase/supabase-js @supabase/ssr zod && npm i -D vitest @vitejs/plugin-react @playwright/test
```

- [ ] **Step 3: Design tokens** — set Tailwind theme colors + fonts.

In `tailwind.config.ts` `theme.extend`:
```ts
colors: { bone:'#FAF8F3', charcoal:'#1C1B17', forest:'#2F3D2E', sage:'#E7EADF', clay:'#B5704D' },
transitionDuration: { DEFAULT: '300ms' },
fontFamily: { serif:['Fraunces','Newsreader','serif'], sans:['Inter','system-ui','sans-serif'] },
```

- [ ] **Step 4: env example**

`.env.local.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
```
Ensure `.env.local` in `.gitignore`.

- [ ] **Step 5: Verify + commit**

Run: `npm run build` → Expected: success.
```bash
git init && git add -A && git commit -m "chore: scaffold next.js + tailwind tokens"
```

---

### Task 2: Supabase local init + clients

**Files:**
- Create: `supabase/` (via CLI), `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`

- [ ] **Step 1: Init Supabase**

Run:
```bash
cd "D:/safe snack/safesnack" && npx supabase init && npx supabase start
```
Expected: local stack up; prints API URL + anon/service keys → copy into `.env.local`.

- [ ] **Step 2: Browser client** — `src/lib/supabase/client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'
export const createClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
```

- [ ] **Step 3: Server client** — `src/lib/supabase/server.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function createClient() {
  const store = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => store.getAll(), setAll: (c) => c.forEach(({name,value,options}) => store.set(name,value,options)) },
  })
}
```

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "feat: supabase local + clients"
```

---

### Task 3: Database schema migration

**Files:**
- Create: `supabase/migrations/0001_schema.sql`

- [ ] **Step 1: Write schema** — all 24 entities. `supabase/migrations/0001_schema.sql`:
```sql
create type role as enum ('CUSTOMER','STAFF','ADMIN');
create type order_status as enum ('PENDING_PAYMENT','PAID','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','REFUNDED');
create type img_type as enum ('PRIMARY','HOVER','GALLERY','LIFESTYLE','NUTRITION_LABEL','INGREDIENT');
create type rel_type as enum ('RELATED','FREQUENTLY_BOUGHT_TOGETHER');
create type coupon_type as enum ('PERCENT','FLAT');
create type mv_type as enum ('IN','OUT','ADJUST','SALE','EXPIRED');
create type evt_type as enum ('PRODUCT_VIEW','ADD_TO_CART','BEGIN_CHECKOUT','PURCHASE','SEARCH');

create table profile (id uuid primary key references auth.users on delete cascade, name text, phone text, role role not null default 'CUSTOMER', created_at timestamptz default now());
create table address (id uuid primary key default gen_random_uuid(), user_id uuid references profile(id) on delete cascade, line1 text, line2 text, city text, pincode text, is_default bool default false);
create table brand (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, logo_url text, is_house_brand bool default false);
create table category (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null);
create table product (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, description text, brand_id uuid references brand(id), category_id uuid references category(id), dietary_tags text[] default '{}', ingredients text, nutrition jsonb, benefits text, story text, featured_ingredients text, serving_suggestions text, is_active bool default true, rating numeric default 0, created_at timestamptz default now());
create table product_image (id uuid primary key default gen_random_uuid(), product_id uuid references product(id) on delete cascade, url text not null, type img_type not null, sort_order int default 0);
create table product_relationship (id uuid primary key default gen_random_uuid(), product_id uuid references product(id) on delete cascade, related_product_id uuid references product(id) on delete cascade, type rel_type not null);
create table variant (id uuid primary key default gen_random_uuid(), product_id uuid references product(id) on delete cascade, label text not null, price numeric not null, compare_at_price numeric, sku text unique);
create table bundle (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, description text, price numeric not null, is_active bool default true);
create table bundle_item (id uuid primary key default gen_random_uuid(), bundle_id uuid references bundle(id) on delete cascade, variant_id uuid references variant(id), qty int not null default 1);
create table coupon (id uuid primary key default gen_random_uuid(), code text unique not null, type coupon_type not null, value numeric not null, min_order numeric default 0, max_discount numeric, usage_limit int, per_user_limit int, starts_at timestamptz, expires_at timestamptz, active bool default true);
create table reward_point_ledger (id uuid primary key default gen_random_uuid(), user_id uuid references profile(id) on delete cascade, delta int not null, reason text, order_id uuid, balance int not null, created_at timestamptz default now());
create table referral (id uuid primary key default gen_random_uuid(), referrer_id uuid references profile(id), code text unique not null, referee_id uuid references profile(id), status text default 'PENDING', reward_granted bool default false);
create table batch (id uuid primary key default gen_random_uuid(), variant_id uuid references variant(id) on delete cascade, batch_number text, mfg_date date, expiry_date date, quantity int not null default 0);
create table inventory_movement (id uuid primary key default gen_random_uuid(), variant_id uuid references variant(id), batch_id uuid references batch(id), type mv_type not null, qty int not null, ref text, staff_id uuid references profile(id), created_at timestamptz default now());
create table delivery_zone (id uuid primary key default gen_random_uuid(), area text, pincode text, delivery_fee numeric default 0, min_order numeric default 0, eta_minutes int);
create table "order" (id uuid primary key default gen_random_uuid(), user_id uuid references profile(id), status order_status not null default 'PENDING_PAYMENT', subtotal numeric not null, discount numeric default 0, delivery_fee numeric default 0, total numeric not null, coupon_id uuid references coupon(id), delivery_zone_id uuid references delivery_zone(id), address jsonb, razorpay_order_id text, payment_id text, payment_status text, points_earned int default 0, points_redeemed int default 0, created_at timestamptz default now());
create table order_item (id uuid primary key default gen_random_uuid(), order_id uuid references "order"(id) on delete cascade, variant_id uuid references variant(id), bundle_id uuid references bundle(id), qty int not null, unit_price numeric not null, line_total numeric not null);
create table review (id uuid primary key default gen_random_uuid(), product_id uuid references product(id) on delete cascade, user_id uuid references profile(id), rating int not null check (rating between 1 and 5), title text, body text, verified_purchase bool default false, status text default 'PUBLISHED', created_at timestamptz default now());
create table wishlist_item (id uuid primary key default gen_random_uuid(), user_id uuid references profile(id) on delete cascade, product_id uuid references product(id) on delete cascade, unique(user_id, product_id));
create table notification (id uuid primary key default gen_random_uuid(), user_id uuid references profile(id) on delete cascade, type text, title text, body text, read bool default false, created_at timestamptz default now());
create table analytics_event (id uuid primary key default gen_random_uuid(), type evt_type not null, user_id uuid, session_id text, product_id uuid, value numeric, created_at timestamptz default now());
create table search_query (id uuid primary key default gen_random_uuid(), query text not null, results_count int, user_id uuid, session_id text, created_at timestamptz default now());
create table homepage_content (id int primary key default 1, hero_title text, hero_subtitle text, hero_cta text, featured_product_ids uuid[] default '{}', featured_bundle_ids uuid[] default '{}', banners jsonb default '[]', lifestyle jsonb default '{}', check (id = 1));
-- placeholders (not built now)
create table subscription_plan (id uuid primary key default gen_random_uuid(), name text, interval text, price numeric, items jsonb);
create table subscription_order (id uuid primary key default gen_random_uuid(), plan_id uuid references subscription_plan(id), user_id uuid references profile(id), next_delivery_at timestamptz, status text);
```

- [ ] **Step 2: Apply + verify**

Run: `npx supabase db reset` → Expected: migration applies, no errors.
Run: `npx supabase db diff` → Expected: empty (schema matches).

- [ ] **Step 3: Commit**
```bash
git add supabase/migrations && git commit -m "feat: db schema (24 entities)"
```

---

### Task 4: RLS policies + role trigger

**Files:**
- Create: `supabase/migrations/0002_rls.sql`

- [ ] **Step 1: Write policies** — `0002_rls.sql`:
```sql
-- auto-create profile on signup
create function handle_new_user() returns trigger language plpgsql security definer as $$
begin insert into profile(id) values (new.id); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create function is_staff() returns bool language sql security definer as $$
  select exists(select 1 from profile where id = auth.uid() and role in ('STAFF','ADMIN')); $$;
create function is_admin() returns bool language sql security definer as $$
  select exists(select 1 from profile where id = auth.uid() and role = 'ADMIN'); $$;

-- public read catalog
alter table product enable row level security;
create policy prod_read on product for select using (true);
create policy prod_admin on product for all using (is_admin()) with check (is_admin());
-- repeat read+admin for brand, category, variant, bundle, bundle_item, product_image, product_relationship, delivery_zone, coupon
-- owner-scoped: address, wishlist_item, notification, reward_point_ledger
alter table wishlist_item enable row level security;
create policy wl_own on wishlist_item for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- orders: owner read, staff/admin manage
alter table "order" enable row level security;
create policy ord_own_read on "order" for select using (user_id = auth.uid() or is_staff());
create policy ord_staff on "order" for update using (is_staff());
-- inventory/batch/movement: staff manage
alter table batch enable row level security;
create policy batch_staff on batch for all using (is_staff()) with check (is_staff());
```
Note: implementer applies the read+admin pattern to every catalog table and owner pattern to every owner-scoped table (listed in comments).

- [ ] **Step 2: Apply + verify**

Run: `npx supabase db reset` → Expected: applies clean.

- [ ] **Step 3: Commit**
```bash
git add supabase/migrations && git commit -m "feat: rls policies + signup trigger"
```

---

### Task 5: Seed data

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: Write seed** — brands (SafeSnack Originals house brand + 2 partners), categories (Cookies, Dark Chocolate, Nuts & Dried Fruits, Chips), ~16 products with storytelling + variants (50g/100g/200g) + batches, 5 named bundles (Diabetic Starter, Weight Management, Kids Healthy Snack, Office Snack Box, High Protein), delivery zones (3 Hyderabad pincodes), 2 coupons, homepage_content row. `supabase/seed.sql`:
```sql
insert into brand(id,name,slug,is_house_brand) values
 ('00000000-0000-0000-0000-000000000001','SafeSnack Originals','safesnack-originals',true),
 ('00000000-0000-0000-0000-000000000002','NutriCo','nutrico',false),
 ('00000000-0000-0000-0000-000000000003','PureBite','purebite',false);
insert into category(id,name,slug) values
 ('10000000-0000-0000-0000-000000000001','Cookies','cookies'),
 ('10000000-0000-0000-0000-000000000002','Dark Chocolate','dark-chocolate'),
 ('10000000-0000-0000-0000-000000000003','Nuts & Dried Fruits','nuts-dried-fruits'),
 ('10000000-0000-0000-0000-000000000004','Chips','chips');
-- example product w/ storytelling
insert into product(id,name,slug,description,brand_id,category_id,dietary_tags,ingredients,benefits,story,featured_ingredients,serving_suggestions)
 values ('20000000-0000-0000-0000-000000000001','Beetroot Chips','beetroot-chips','Crunchy baked beetroot chips.',
 '00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000004',
 '{sugar-free,vegan}','Beetroot, natural seasoning','Rich in fiber. Better alternative to fried chips.',
 'Made from real beetroot slices, slow-baked not fried.','Beetroot, Natural seasoning','Enjoy as an afternoon snack or with hummus.');
insert into variant(product_id,label,price,sku) values
 ('20000000-0000-0000-0000-000000000001','50g',79,'BEET-50'),
 ('20000000-0000-0000-0000-000000000001','100g',149,'BEET-100'),
 ('20000000-0000-0000-0000-000000000001','200g',279,'BEET-200');
-- implementer: add ~15 more products across categories following this pattern, each with 1-3 variants + a batch row.
insert into delivery_zone(area,pincode,delivery_fee,min_order,eta_minutes) values
 ('Gachibowli','500032',29,199,40),('Madhapur','500081',29,199,35),('Banjara Hills','500034',39,249,45);
insert into coupon(code,type,value,min_order,active) values ('WELCOME10','PERCENT',10,199,true),('FLAT50','FLAT',50,499,true);
insert into homepage_content(id,hero_title,hero_subtitle,hero_cta) values
 (1,'Guilt-Free Snacks, Delivered Fast','Sugar-free treats your body will thank you for.','Shop Originals');
```

- [ ] **Step 2: Apply + verify**

Run: `npx supabase db reset` (runs seed) → then `npx supabase db query "select count(*) from product"` → Expected: ≥16.

- [ ] **Step 3: Commit**
```bash
git add supabase/seed.sql && git commit -m "feat: seed brands, products, bundles, zones, coupons"
```

---

### Task 6: Test harness smoke

**Files:**
- Create: `vitest.config.ts`, `tests/unit/pricing.test.ts`, `playwright.config.ts`

- [ ] **Step 1: Failing unit test** — `tests/unit/pricing.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { lineTotal } from '@/lib/pricing'
describe('lineTotal', () => { it('multiplies price by qty', () => { expect(lineTotal(149, 2)).toBe(298) }) })
```

- [ ] **Step 2: Run, expect fail** — `npx vitest run` → Expected: FAIL (`lineTotal` not found).

- [ ] **Step 3: Implement** — `src/lib/pricing.ts`:
```ts
export const lineTotal = (price: number, qty: number) => price * qty
```

- [ ] **Step 4: Run, expect pass** — `npx vitest run` → Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "test: vitest harness + pricing util"
```

---

## Self-Review

- **Spec coverage (Phase 0 scope):** scaffold ✓ (T1), Supabase ✓ (T2), 24-entity schema ✓ (T3), RLS+roles ✓ (T4), seed incl. Originals/products/bundles/zones/coupons/homepage ✓ (T5), test harness ✓ (T6), design tokens ✓ (T1). Later phases (storefront…polish) get their own plans.
- **Placeholders:** seed/RLS use explicit "follow this pattern" notes with a concrete example given — acceptable for repetitive rows; no bare TODOs.
- **Type consistency:** table/column names in schema reused verbatim in seed; `lineTotal` signature consistent.
