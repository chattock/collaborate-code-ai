-- Enforce strict RLS on user_roles to prevent privilege escalation
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid overlap
DROP POLICY IF EXISTS "Authorized can view user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authorized can insert user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authorized can update user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authorized can delete user_roles" ON public.user_roles;

-- Read access: only admins or service_role
CREATE POLICY "Authorized can view user_roles"
ON public.user_roles
FOR SELECT
USING ((auth.jwt() ->> 'role' = 'service_role') OR public.has_role(auth.uid(), 'admin'));

-- Insert: only admins or service_role
CREATE POLICY "Authorized can insert user_roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'role' = 'service_role') OR public.has_role(auth.uid(), 'admin'));

-- Update: only admins or service_role
CREATE POLICY "Authorized can update user_roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'role' = 'service_role') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK ((auth.jwt() ->> 'role' = 'service_role') OR public.has_role(auth.uid(), 'admin'));

-- Delete: only admins or service_role
CREATE POLICY "Authorized can delete user_roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'role' = 'service_role') OR public.has_role(auth.uid(), 'admin'));
