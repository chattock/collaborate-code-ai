-- Allow everyone to read admin settings so booking section visibility works for all users
DROP POLICY IF EXISTS "Admins can view admin_settings" ON admin_settings;

CREATE POLICY "Everyone can view admin_settings" 
ON admin_settings 
FOR SELECT 
USING (true);