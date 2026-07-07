CREATE SCHEMA IF NOT EXISTS app_private;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

REVOKE ALL ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated, service_role;

ALTER POLICY "settings_admin_update" ON public.app_settings
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "assets_admin_write" ON public.cms_assets
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "assets_public_read" ON public.cms_assets
  USING ((is_active = true) OR app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "banners_admin_write" ON public.cms_banners
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "banners_public_read" ON public.cms_banners
  USING ((is_active = true) OR app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "events admin all" ON public.cms_events
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can delete leads" ON public.cms_leads
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can update leads" ON public.cms_leads
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can view leads" ON public.cms_leads
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "lessons admin all" ON public.cms_lessons
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "popup_admin_update" ON public.cms_popup
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "products admin all" ON public.cms_products
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "dev_audit_admin_insert" ON public.dev_audit_log
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role) AND (user_id = auth.uid()));
ALTER POLICY "dev_audit_admin_select" ON public.dev_audit_log
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "audit_admin_all" ON public.ib_audit_submissions
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "ib_admin_all" ON public.ib_profiles
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "profiles_admin_all" ON public.profiles
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "trading_admin_all" ON public.trading_accounts
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "user_roles_admin_all" ON public.user_roles
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "user_roles_block_non_admin_writes" ON public.user_roles
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;