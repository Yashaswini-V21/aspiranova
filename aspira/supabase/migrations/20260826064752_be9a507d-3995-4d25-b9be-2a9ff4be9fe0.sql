DROP POLICY IF EXISTS "Anyone can read selected regions" ON public.selected_region;
DROP POLICY IF EXISTS "Anyone can create a selected region" ON public.selected_region;
DROP POLICY IF EXISTS "Anyone can update a selected region" ON public.selected_region;

REVOKE ALL ON public.selected_region FROM anon;
REVOKE ALL ON public.selected_region FROM authenticated;
GRANT ALL ON public.selected_region TO service_role;