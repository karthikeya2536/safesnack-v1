-- auto-create profile on signup
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profile(id) values (new.id); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create function is_staff() returns bool language sql security definer set search_path = public stable as $$
  select exists(select 1 from public.profile where id = auth.uid() and role in ('STAFF','ADMIN')); $$;
create function is_admin() returns bool language sql security definer set search_path = public stable as $$
  select exists(select 1 from public.profile where id = auth.uid() and role = 'ADMIN'); $$;

-- Public-readable catalog tables; writes admin-only.
do $$
declare t text;
begin
  foreach t in array array['brand','category','product','product_image','product_relationship','variant','bundle','bundle_item','delivery_zone','homepage_content'] loop
    execute format('alter table %I enable row level security;', t);
    execute format('create policy %I on %I for select using (true);', t||'_read', t);
    execute format('create policy %I on %I for all using (is_admin()) with check (is_admin());', t||'_admin', t);
  end loop;
end $$;

-- Coupons: readable by all (to validate codes), managed by admin.
alter table coupon enable row level security;
create policy coupon_read on coupon for select using (true);
create policy coupon_admin on coupon for all using (is_admin()) with check (is_admin());

-- Owner-scoped tables.
do $$
declare t text;
begin
  foreach t in array array['address','wishlist_item','notification','reward_point_ledger'] loop
    execute format('alter table %I enable row level security;', t);
    execute format('create policy %I on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid());', t||'_own', t);
  end loop;
end $$;

-- Profile: self read/update; admin all.
alter table profile enable row level security;
create policy profile_self on profile for select using (id = auth.uid() or is_staff());
create policy profile_update on profile for update using (id = auth.uid());
create policy profile_admin on profile for all using (is_admin()) with check (is_admin());

-- Orders: owner reads own; staff/admin read+update all; owner can insert own.
alter table "order" enable row level security;
create policy order_read on "order" for select using (user_id = auth.uid() or is_staff());
create policy order_insert on "order" for insert with check (user_id = auth.uid());
create policy order_staff on "order" for update using (is_staff());

alter table order_item enable row level security;
create policy oi_read on order_item for select using (
  exists(select 1 from "order" o where o.id = order_id and (o.user_id = auth.uid() or is_staff())));
create policy oi_insert on order_item for insert with check (
  exists(select 1 from "order" o where o.id = order_id and o.user_id = auth.uid()));

-- Reviews: public read; owner writes own.
alter table review enable row level security;
create policy review_read on review for select using (true);
create policy review_own on review for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Inventory: staff/admin only.
do $$
declare t text;
begin
  foreach t in array array['batch','inventory_movement'] loop
    execute format('alter table %I enable row level security;', t);
    execute format('create policy %I on %I for all using (is_staff()) with check (is_staff());', t||'_staff', t);
  end loop;
end $$;

-- Analytics + search ingest: anyone may insert; admin reads.
do $$
declare t text;
begin
  foreach t in array array['analytics_event','search_query'] loop
    execute format('alter table %I enable row level security;', t);
    execute format('create policy %I on %I for insert with check (true);', t||'_ins', t);
    execute format('create policy %I on %I for select using (is_admin());', t||'_read', t);
  end loop;
end $$;

-- Referrals: involved users read; admin all.
alter table referral enable row level security;
create policy ref_read on referral for select using (referrer_id = auth.uid() or referee_id = auth.uid() or is_admin());
create policy ref_admin on referral for all using (is_admin()) with check (is_admin());
