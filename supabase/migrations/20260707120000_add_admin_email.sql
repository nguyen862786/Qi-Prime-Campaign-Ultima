-- ============================================================
-- Thêm quyền Admin cho email nguyen862786@gmail.com
-- 1. Cập nhật hàm trigger handle_new_user() để tự động phân quyền Admin cho email mới
-- 2. Cấp quyền Admin cho tài khoản nguyen862786@gmail.com hiện tại nếu đã đăng ký
-- ============================================================

-- 1. Cập nhật hàm handle_new_user trong schema private
CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));

  -- Phân quyền admin cho cả 2 email hệ thống và email admin mới
  if lower(new.email) = 'qiholding86@gmail.com' or lower(new.email) = 'nguyen862786@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'customer');
  end if;

  return new;
end; $$;

-- 2. Cấp quyền admin cho tài khoản nguyen862786@gmail.com hiện tại (nếu đã tồn tại trong auth.users)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'nguyen862786@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Đảm bảo trạng thái vai trò là admin và không bị đè bởi vai trò customer
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id IN (SELECT id FROM auth.users WHERE lower(email) = 'nguyen862786@gmail.com');

NOTIFY pgrst, 'reload schema';
