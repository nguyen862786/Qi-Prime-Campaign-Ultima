
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));

  if lower(new.email) = 'qiholding86@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'customer');
  end if;

  return new;
end; $$;

-- If the admin user already exists, promote retroactively
do $$
declare v_id uuid;
begin
  select id into v_id from auth.users where lower(email) = 'qiholding86@gmail.com' limit 1;
  if v_id is not null then
    insert into public.user_roles (user_id, role) values (v_id, 'admin')
    on conflict do nothing;
  end if;
end $$;
