-- Remove public read access to sensitive bookings data
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;

-- (Optional hardening) Allow only service role to read if needed by backend jobs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Service role can view bookings'
  ) THEN
    CREATE POLICY "Service role can view bookings"
    ON public.bookings
    FOR SELECT
    TO service_role
    USING (true);
  END IF;
END $$;