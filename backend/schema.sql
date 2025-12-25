CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.itineraries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  theme TEXT,
  forked_from UUID REFERENCES public.itineraries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  is_public BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE,
  place_name TEXT NOT NULL,
  day INTEGER NOT NULL,
  "order" INTEGER NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  memo TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public itineraries are viewable by everyone" ON public.itineraries FOR SELECT USING (true);
CREATE POLICY "Public itinerary items are viewable by everyone" ON public.itinerary_items FOR SELECT USING (true);

CREATE POLICY "Enable insert for users and service_role" ON public.itineraries FOR INSERT WITH CHECK (
  auth.uid() = user_id OR (select auth.jwt() ->> 'role') = 'service_role'
);

CREATE POLICY "Enable insert items for users and service_role" ON public.itinerary_items FOR INSERT WITH CHECK (
  exists ( select 1 from public.itineraries where id = itinerary_id and user_id = auth.uid() )
  OR (select auth.jwt() ->> 'role') = 'service_role'
);