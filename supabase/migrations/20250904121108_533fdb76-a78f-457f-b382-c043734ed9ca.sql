-- Consolidate bookings SELECT policies into a single clear rule
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop previous overlapping SELECT policies
DROP POLICY IF EXISTS "Admins can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Only service role can view bookings" ON public.bookings;

-- Create unified SELECT policy: only admins or service_role may read
CREATE POLICY "Authorized can view bookings"
ON public.bookings
FOR SELECT
USING ((auth.jwt() ->> 'role' = 'service_role') OR public.has_role(auth.uid(), 'admin'));

-- Keep existing INSERT policy (public can create bookings) unchanged