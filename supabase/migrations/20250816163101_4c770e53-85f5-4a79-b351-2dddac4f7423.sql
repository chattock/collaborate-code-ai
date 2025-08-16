-- Harden RLS on bookings to prevent public data exposure
-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop any existing permissive SELECT policies
DROP POLICY IF EXISTS "Service role can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow all to view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;

-- Create a strict SELECT policy limited to service_role only
CREATE POLICY "Service role can view bookings only"
ON public.bookings
FOR SELECT
TO service_role
USING (true);

-- Keep existing INSERT openness so the public can create bookings without auth
-- (No change to INSERT policies)
