-- 1) Create roles enum (idempotent)
DO $$
BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- 2) Create user_roles table (idempotent)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Ensure RLS is enabled on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3) Security definer function to check roles (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 4) Harden admin_settings RLS
-- Make sure RLS is enabled (safe if already enabled)
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive policy if it exists
DROP POLICY IF EXISTS "Allow all access to admin_settings" ON public.admin_settings;

-- Create strict admin-only policies
CREATE POLICY "Admins can view admin_settings"
ON public.admin_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert admin_settings"
ON public.admin_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update admin_settings"
ON public.admin_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete admin_settings"
ON public.admin_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
