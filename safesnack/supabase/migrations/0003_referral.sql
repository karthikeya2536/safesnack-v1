-- Each user gets a shareable referral code; many referrals can share one code.
alter table referral drop constraint if exists referral_code_key;
alter table profile add column referral_code text unique
  default upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));

-- Capture name from signup metadata + keep referral_code default.
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profile(id, name) values (new.id, new.raw_user_meta_data->>'name');
  return new;
end; $$;

-- Called by a signed-in new user to record who referred them.
create or replace function claim_referral(p_code text) returns void language plpgsql security definer as $$
declare ref_id uuid;
begin
  select id into ref_id from profile where referral_code = p_code;
  if ref_id is null or ref_id = auth.uid() then return; end if;
  if exists (select 1 from referral where referee_id = auth.uid()) then return; end if;
  insert into referral(referrer_id, code, referee_id, status)
  values (ref_id, p_code, auth.uid(), 'PENDING');
end; $$;
