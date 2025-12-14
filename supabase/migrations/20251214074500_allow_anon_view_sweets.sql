-- Allow anonymous users to view sweets
DROP POLICY "Anyone can view sweets" ON public.sweets;
CREATE POLICY "Anyone can view sweets"
  ON public.sweets FOR SELECT
  USING (true);