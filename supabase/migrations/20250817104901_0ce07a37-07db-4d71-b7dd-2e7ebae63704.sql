-- Secure bookings SELECT access by restricting to service role only
-- 1) Drop the overly-permissive SELECT policy if it exists
DROP POLICY IF EXISTS "Service role can view bookings only" ON public.bookings;

-- 2) Create a strict SELECT policy that only allows requests authenticated with the service_role key
-- This prevents anonymous or regular authenticated users from reading any booking rows
CREATE POLICY "Only service role can view bookings"
ON public.bookings
FOR SELECT
USING ((auth.jwt() ->> 'role') = 'service_role');
