
-- has_role is needed inside RLS policies executed by authenticated users.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, anon;
