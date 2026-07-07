
-- ===== ENUMS =====
create type public.app_role as enum ('admin','master_ib','customer');
create type public.membership_tier as enum ('free','vip');
create type public.vip_activation_type as enum ('none','paid_subscription','broker_ref_verified');

-- ===== PROFILES =====
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone_zalo text,
  email text unique,
  membership_status public.membership_tier not null default 'free',
  vip_activation_type public.vip_activation_type not null default 'none',
  referred_by_ib_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- ===== USER ROLES =====
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- ===== TRADING ACCOUNTS =====
create table public.trading_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  broker_name text not null,
  mt5_id text,
  capital_size numeric(14,2) default 0,
  is_ref_link_verified boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.trading_accounts to authenticated;
grant all on public.trading_accounts to service_role;
alter table public.trading_accounts enable row level security;

-- ===== IB PROFILES =====
create table public.ib_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  current_team_size integer default 0,
  estimated_monthly_lots numeric(14,2) default 0,
  media_channels text,
  ib_level integer not null default 1 check (ib_level between 1 and 5),
  parent_ib_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.ib_profiles to authenticated;
grant all on public.ib_profiles to service_role;
alter table public.ib_profiles enable row level security;

-- ===== IB AUDIT SUBMISSIONS (lead capture funnel) =====
create table public.ib_audit_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone_zalo text not null,
  media_channel text,
  team_size_bucket text not null, -- 'lt50' | '50_200' | 'gt200'
  monthly_volume_bucket text not null, -- 'lt100' | '100_500' | 'gt500'
  brokers text[] not null default '{}',
  tier text not null default 'standard', -- 'standard' | 'elite'
  source_user_id uuid references auth.users(id) on delete set null,
  notified_admin boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.ib_audit_submissions to anon, authenticated;
grant select, update, delete on public.ib_audit_submissions to authenticated;
grant all on public.ib_audit_submissions to service_role;
alter table public.ib_audit_submissions enable row level security;

-- ===== APP SETTINGS (singleton) =====
create table public.app_settings (
  id integer primary key default 1 check (id = 1),
  system_email text not null default 'partners@qiprime.ai',
  hotline text not null default '+84 000 000 000',
  office_address text not null default 'Qi Legacy HQ — Singapore · Hanoi · Dubai',
  updated_at timestamptz not null default now()
);
insert into public.app_settings (id) values (1) on conflict do nothing;
grant select on public.app_settings to anon, authenticated;
grant update on public.app_settings to authenticated;
grant all on public.app_settings to service_role;
alter table public.app_settings enable row level security;

-- ===== CMS: ASSETS (zones) =====
create table public.cms_assets (
  id uuid primary key default gen_random_uuid(),
  zone text not null,                       -- 'hero_bg' | 'mid_carousel' | 'academy_thumb' | 'event_gallery'
  device text not null default 'all',       -- 'all' | 'desktop' | 'mobile'
  image_url text not null,
  link_url text,
  caption text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.cms_assets to anon, authenticated;
grant insert, update, delete on public.cms_assets to authenticated;
grant all on public.cms_assets to service_role;
alter table public.cms_assets enable row level security;

-- ===== CMS: BANNERS (top bar / sidebar) =====
create table public.cms_banners (
  id uuid primary key default gen_random_uuid(),
  placement text not null,                  -- 'top_bar' | 'sidebar'
  message text,
  link_url text,
  background text default '#b4df51',
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.cms_banners to anon, authenticated;
grant insert, update, delete on public.cms_banners to authenticated;
grant all on public.cms_banners to service_role;
alter table public.cms_banners enable row level security;

-- ===== CMS: SPLASH POPUP (singleton) =====
create table public.cms_popup (
  id integer primary key default 1 check (id = 1),
  desktop_image_url text,
  mobile_image_url text,
  link_url text,
  is_active boolean not null default false,
  cooldown_hours integer not null default 24,
  updated_at timestamptz not null default now()
);
insert into public.cms_popup (id) values (1) on conflict do nothing;
grant select on public.cms_popup to anon, authenticated;
grant update on public.cms_popup to authenticated;
grant all on public.cms_popup to service_role;
alter table public.cms_popup enable row level security;

-- ===== RLS POLICIES =====
-- profiles
create policy "profiles_self_read"   on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_admin_all"   on public.profiles for all   to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- user_roles
create policy "user_roles_self_read" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "user_roles_admin_all" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- trading_accounts
create policy "trading_self_all"  on public.trading_accounts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "trading_admin_all" on public.trading_accounts for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ib_profiles
create policy "ib_self_all"  on public.ib_profiles for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ib_admin_all" on public.ib_profiles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ib_audit_submissions
create policy "audit_anyone_insert" on public.ib_audit_submissions for insert to anon, authenticated with check (true);
create policy "audit_admin_all"     on public.ib_audit_submissions for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- app_settings
create policy "settings_public_read" on public.app_settings for select to anon, authenticated using (true);
create policy "settings_admin_update" on public.app_settings for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- cms_assets
create policy "assets_public_read"  on public.cms_assets for select to anon, authenticated using (is_active = true or public.has_role(auth.uid(),'admin'));
create policy "assets_admin_write"  on public.cms_assets for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- cms_banners
create policy "banners_public_read" on public.cms_banners for select to anon, authenticated using (is_active = true or public.has_role(auth.uid(),'admin'));
create policy "banners_admin_write" on public.cms_banners for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- cms_popup
create policy "popup_public_read"   on public.cms_popup for select to anon, authenticated using (true);
create policy "popup_admin_update"  on public.cms_popup for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ===== AUTO-PROFILE TRIGGER =====
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  insert into public.user_roles (user_id, role) values (new.id, 'customer');
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ===== UPDATED_AT TRIGGER =====
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch    before update on public.profiles    for each row execute function public.touch_updated_at();
create trigger settings_touch    before update on public.app_settings for each row execute function public.touch_updated_at();
create trigger popup_touch       before update on public.cms_popup    for each row execute function public.touch_updated_at();
