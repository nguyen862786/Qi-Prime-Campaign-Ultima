
-- search_path on touch_updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Restrict EXECUTE on security-definer fns
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
grant  execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;

-- Tighten audit insert: simple rate-limit (no duplicate phone within last 60s)
drop policy if exists "audit_anyone_insert" on public.ib_audit_submissions;
create policy "audit_anyone_insert"
on public.ib_audit_submissions for insert to anon, authenticated
with check (
  length(full_name) between 2 and 120
  and length(phone_zalo) between 6 and 40
  and not exists (
    select 1 from public.ib_audit_submissions s
    where s.phone_zalo = ib_audit_submissions.phone_zalo
      and s.created_at > now() - interval '60 seconds'
  )
);
