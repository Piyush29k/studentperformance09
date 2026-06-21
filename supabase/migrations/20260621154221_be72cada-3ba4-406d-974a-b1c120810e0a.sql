-- Drop unused SECURITY DEFINER function exposed to authenticated users.
-- get_user_roles is not called from app code; user_roles table is queried directly with RLS.
DROP FUNCTION IF EXISTS public.get_user_roles(uuid);

-- has_role must remain SECURITY DEFINER with EXECUTE for authenticated because
-- it is referenced inside RLS policies (auth.uid()-scoped, read-only role check).
-- Keep it locked down to authenticated only (already revoked from anon/PUBLIC).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
COMMENT ON FUNCTION public.has_role(uuid, public.app_role) IS
  'SECURITY DEFINER role check used inside RLS policies. Must remain executable by authenticated for policies to evaluate.';