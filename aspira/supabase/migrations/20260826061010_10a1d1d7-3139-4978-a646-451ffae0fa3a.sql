CREATE TABLE public.selected_region (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL UNIQUE,
  region_key TEXT NOT NULL,
  name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  station_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.selected_region TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.selected_region TO authenticated;
GRANT ALL ON public.selected_region TO service_role;

ALTER TABLE public.selected_region ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read selected regions"
  ON public.selected_region FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create a selected region"
  ON public.selected_region FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update a selected region"
  ON public.selected_region FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.touch_selected_region()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER selected_region_touch
BEFORE UPDATE ON public.selected_region
FOR EACH ROW EXECUTE FUNCTION public.touch_selected_region();