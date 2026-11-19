-- =====================================================================
-- ConciousLivin HEALTH ACADEMY — SUPABASE DATABASE SETUP
-- Copy and run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new)
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================
-- 1. USER PROFILES TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'doctor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper used by RLS policies. SECURITY DEFINER avoids recursive policy
-- evaluation against public.profiles (Postgres error 42P17).
CREATE OR REPLACE FUNCTION public.is_doctor()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'doctor'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.is_doctor() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_doctor() TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Doctors can view all profiles" ON public.profiles;
CREATE POLICY "Doctors can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_doctor());

-- Prevent self-service privilege escalation. Only a service-role connection
-- (SQL editor, admin script) may change a profile role.
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS trigger AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'Changing a profile role is not permitted';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS prevent_profile_role_change ON public.profiles;
CREATE TRIGGER prevent_profile_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_change();

-- ===========================
-- 2. HEALTH RESOURCES TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.health_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL CHECK (category IN ('nutrition', 'longevity', 'heart', 'fasting', 'detox', 'mental')),
  is_free BOOLEAN NOT NULL DEFAULT false,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10, 2),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  pages INTEGER DEFAULT 80,
  reading_time TEXT DEFAULT '2 hours',
  cover_image_url TEXT,
  pdf_url TEXT,
  badge TEXT,
  badge_color TEXT DEFAULT 'emerald',
  description TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  table_of_contents TEXT[] DEFAULT '{}',
  full_content JSONB DEFAULT '{}',
  uploaded_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.health_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active resources" ON public.health_resources;
CREATE POLICY "Anyone can read active resources" ON public.health_resources
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Doctors can manage resources" ON public.health_resources;
CREATE POLICY "Doctors can manage resources" ON public.health_resources
  FOR ALL USING (public.is_doctor())
  WITH CHECK (public.is_doctor());

-- Paid book text must not be readable straight from PostgREST/the anon key.
-- The server projects catalogue rows and only returns full_content to buyers.
REVOKE SELECT (full_content) ON public.health_resources FROM anon, authenticated;

-- ===========================
-- 3. DOWNLOAD HISTORY TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.download_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID,
  resource_title TEXT NOT NULL,
  resource_category TEXT NOT NULL,
  cover_image_url TEXT,
  is_free BOOLEAN DEFAULT true,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.download_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own download history" ON public.download_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own download history" ON public.download_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can view all download history" ON public.download_history
  FOR SELECT USING (public.is_doctor());

-- ===========================
-- 4. PURCHASE HISTORY TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]',
  total_paid DECIMAL(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'card',
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Paid purchases are inserted only by the server after PayPal capture verification.
DROP POLICY IF EXISTS "Users can insert own purchases" ON public.purchases;

CREATE POLICY "Doctors can view all purchases" ON public.purchases
  FOR SELECT USING (public.is_doctor());

-- ===========================
-- 4A. PAYPAL PAYMENT DRAFTS
-- ===========================
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('resources', 'consultation')),
  details JSONB NOT NULL DEFAULT '{}',
  amount_usd DECIMAL(10, 2) NOT NULL CHECK (amount_usd > 0),
  paypal_order_id TEXT UNIQUE,
  paypal_capture_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own payment orders" ON public.payment_orders;
CREATE POLICY "Users can view own payment orders" ON public.payment_orders
  FOR SELECT USING (auth.uid() = user_id);

-- ===========================
-- 5. CONSULTATION BOOKINGS TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.consultation_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  package_title TEXT NOT NULL,
  package_price DECIMAL(10, 2) DEFAULT 0,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  primary_concern TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert consultation bookings" ON public.consultation_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Doctors can view all consultation bookings" ON public.consultation_bookings
  FOR SELECT USING (public.is_doctor());

-- Bind paid consultation appointments to the authenticated customer and payment.
ALTER TABLE public.consultation_bookings
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS payment_order_id UUID REFERENCES public.payment_orders(id),
  ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_capture_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS consultation_bookings_payment_order_id_key
  ON public.consultation_bookings(payment_order_id)
  WHERE payment_order_id IS NOT NULL;

DROP POLICY IF EXISTS "Anyone can insert consultation bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can view own consultation bookings" ON public.consultation_bookings;
CREATE POLICY "Users can view own consultation bookings" ON public.consultation_bookings
  FOR SELECT USING (auth.uid() = user_id);

-- ===========================
-- 6. TRIGGER: auto-create profile on signup
-- ===========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    -- Signup metadata is client-controlled, so the role is always customer.
    -- Promote doctors explicitly with the SQL at the end of this file.
    'customer',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ language plpgsql security definer SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ===========================
-- 7. RPC FUNCTIONS
-- ===========================
CREATE OR REPLACE FUNCTION public.increment_download_count(resource_id UUID)
RETURNS void AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  UPDATE public.health_resources
  SET download_count = download_count + 1
  WHERE id = resource_id AND is_active = true;
END;
$$ language plpgsql security definer SET search_path = public;

REVOKE ALL ON FUNCTION public.increment_download_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_download_count(uuid) TO authenticated, service_role;

-- ===========================
-- 8. STORAGE BUCKETS
-- Run in Supabase Dashboard > Storage, or via these SQL commands:
-- ===========================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('pdfs', 'pdfs', false, 104857600, ARRAY['application/pdf'])
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('thumbnails', 'thumbnails', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  ON CONFLICT (id) DO NOTHING;

-- Storage policies for the private pdfs bucket.
DROP POLICY IF EXISTS "Doctors can upload pdfs" ON storage.objects;
CREATE POLICY "Doctors can upload pdfs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pdfs' AND public.is_doctor());

DROP POLICY IF EXISTS "Public can read free pdfs" ON storage.objects;
CREATE POLICY "Public can read free pdfs" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'pdfs'
    AND EXISTS (
      SELECT 1 FROM public.health_resources
      WHERE is_free = true
        AND is_active = true
        AND pdf_url LIKE '%' || storage.objects.name
    )
  );

DROP POLICY IF EXISTS "Buyers can read purchased pdfs" ON storage.objects;
CREATE POLICY "Buyers can read purchased pdfs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'pdfs'
    AND EXISTS (
      SELECT 1
      FROM public.purchases p
      CROSS JOIN LATERAL jsonb_array_elements(p.items) AS item
      JOIN public.health_resources r ON r.id::text = item->>'resourceId'
      WHERE p.user_id = auth.uid()
        AND p.status = 'completed'
        AND r.is_active = true
        AND r.pdf_url LIKE '%' || storage.objects.name
    )
  );

-- The old blanket rule let any signed-in account sign URLs for every paid PDF.
DROP POLICY IF EXISTS "Authenticated users can read pdfs" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can view thumbnails" ON storage.objects;
CREATE POLICY "Anyone can view thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Doctors can upload thumbnails" ON storage.objects;
CREATE POLICY "Doctors can upload thumbnails" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ===========================
-- 9. USER LIBRARY (CLAIMED BOOKS)
-- ===========================
CREATE TABLE IF NOT EXISTS public.user_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES public.health_resources(id) ON DELETE CASCADE NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  claimed_from TEXT DEFAULT 'website', -- 'website', 'purchase', 'promo'
  last_read_at TIMESTAMPTZ,
  last_read_chapter INTEGER DEFAULT 0,
  reading_progress JSONB DEFAULT '{}', -- {chapter: scroll_position}
  UNIQUE(user_id, resource_id)
);

ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own library" ON public.user_library
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own library items" ON public.user_library
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own library items" ON public.user_library
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can view all libraries" ON public.user_library
  FOR SELECT USING (public.is_doctor());

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_library_user_id ON public.user_library(user_id);
CREATE INDEX IF NOT EXISTS idx_user_library_resource_id ON public.user_library(resource_id);

-- ===========================
-- 10. TO MAKE AN ACCOUNT A DOCTOR:
-- After Dr. Arif registers with his email, run:
-- ===========================
-- UPDATE public.profiles SET role = 'doctor' WHERE email = 'dr.arif@conciouslivin.in';

-- ===========================
-- 11. POST-DEPLOY AUDIT
-- Check for accounts that were promoted through the old client-controlled
-- signup metadata field; demote anything that is not Dr. Arif.
-- ===========================
-- SELECT id, email, role, created_at FROM public.profiles WHERE role = 'doctor';
-- UPDATE public.profiles SET role = 'customer'
--   WHERE role = 'doctor' AND email <> 'dr.arif@conciouslivin.in';
