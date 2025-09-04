-- Ensure RLS is enabled on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Add admin-only SELECT policy alongside existing service_role read access
DROP POLICY IF EXISTS "Admins can view bookings" ON public.bookings;
CREATE POLICY "Admins can view bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
