
-- 1) Revoke execute on SECURITY DEFINER helpers from app roles
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- 2) ib_audit_submissions: explicit, least-privilege policies
CREATE POLICY "audit_self_read"
  ON public.ib_audit_submissions
  FOR SELECT TO authenticated
  USING (source_user_id = auth.uid());

-- 3) user_roles: restrictive deny for non-admin writes (defense-in-depth)
CREATE POLICY "user_roles_block_non_admin_writes"
  ON public.user_roles
  AS RESTRICTIVE
  FOR ALL TO anon, authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
