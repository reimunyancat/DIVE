CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Itineraries (여행 일정 메인)
CREATE TABLE IF NOT EXISTS public.itineraries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  theme TEXT,
  forked_from UUID REFERENCES public.itineraries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  is_public BOOLEAN DEFAULT true
);

-- Itinerary Items (일정 상세 장소들)
CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE,
  place_name TEXT NOT NULL,
  day INTEGER NOT NULL,
  "order" INTEGER NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Places (장소 정보 캐싱용)
CREATE TABLE IF NOT EXISTS public.places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  verification_score INTEGER,
  tags TEXT[],
  embedding vector(1536)
);
