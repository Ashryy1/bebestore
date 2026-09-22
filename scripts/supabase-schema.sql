-- ==============================================================================
-- 🧶 BibaStore - Comprehensive Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLES
-- ==============================================================================

-- 2.1 USERS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  readable_id TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_readable_id ON public.users(readable_id);

-- 2.2 CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2.3 PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  images TEXT[] DEFAULT '{}',
  category TEXT,
  colors TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  size_chart_type TEXT CHECK (size_chart_type IN ('table', 'image', NULL)),
  size_chart_image_url TEXT,
  size_chart_sizes JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 5 CHECK (rating >= 0 AND rating <= 5),
  num_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);

-- 2.4 ORDERS (Supports Cash on Delivery & Vodafone Cash / InstaPay)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  user_name TEXT DEFAULT 'Customer',
  user_phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled')),
  shipping_address TEXT,
  shipping_city TEXT,
  payment_method TEXT DEFAULT 'cod' CHECK (payment_method IN ('cod', 'vodafone_cash', 'instapay')),
  payment_receipt_url TEXT,
  deposit_amount NUMERIC DEFAULT 0,
  deposit_status TEXT DEFAULT 'None' CHECK (deposit_status IN ('None', 'Requested', 'Pending', 'Paid', 'Rejected')),
  deposit_screenshot_url TEXT,
  has_unread_update BOOLEAN DEFAULT false,
  is_whatsapp_order BOOLEAN DEFAULT false,
  is_chat_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_phone ON public.orders(user_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 2.5 CUSTOM REQUESTS (Handmade Crochet Orders)
CREATE TABLE IF NOT EXISTS public.custom_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_name TEXT DEFAULT 'Anonymous',
  user_email TEXT,
  user_phone TEXT,
  order_number TEXT UNIQUE,
  description TEXT NOT NULL,
  reference_images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewing', 'Pricing', 'Processing', 'Shipped', 'Completed', 'Returned')),
  admin_quote NUMERIC,
  admin_notes TEXT DEFAULT '',
  timeline JSONB DEFAULT '[]',
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_phone TEXT,
  payment_method TEXT DEFAULT 'cod',
  payment_receipt_url TEXT,
  deposit_amount NUMERIC DEFAULT 0,
  deposit_status TEXT DEFAULT 'None' CHECK (deposit_status IN ('None', 'Requested', 'Pending', 'Paid', 'Rejected')),
  deposit_screenshot_url TEXT,
  has_unread_update BOOLEAN DEFAULT false,
  is_chat_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_custom_requests_user_id ON public.custom_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_requests_order_number ON public.custom_requests(order_number);

-- 2.6 ORDER MESSAGES (Realtime Chat for Orders)
CREATE TABLE IF NOT EXISTS public.order_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  content TEXT,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_messages_order_id ON public.order_messages(order_id);

-- 2.7 SUPPORT MESSAGES (Direct Live Support Chat)
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  content TEXT,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_messages_user_id ON public.support_messages(user_id);

-- 2.8 FINANCE (Income & Expenses)
CREATE TABLE IF NOT EXISTS public.finance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  order_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2.9 PUSH SUBSCRIPTIONS (Web Push Notifications)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_push_subs_user_id ON public.push_subscriptions(user_id);

-- 2.10 STORE SETTINGS (Vodafone Cash, InstaPay, Contact numbers)
CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed initial store settings
INSERT INTO public.store_settings (key, value)
VALUES 
  ('payment_wallets', '{"vodafone_cash": "01000000000", "instapay_handle": "bibastore@instapay", "instructions_ar": "يرجى تحويل المبلغ ثم إرفاق صورة التحويل أو إرسالها عبر الواتساب لتأكيد الطلب فوراً."}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- 3. AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_custom_requests_updated_at ON public.custom_requests;
CREATE TRIGGER trg_custom_requests_updated_at BEFORE UPDATE ON public.custom_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_order_messages_updated_at ON public.order_messages;
CREATE TRIGGER trg_order_messages_updated_at BEFORE UPDATE ON public.order_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_finance_updated_at ON public.finance;
CREATE TRIGGER trg_finance_updated_at BEFORE UPDATE ON public.finance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ==============================================================================
-- 4. REALTIME PUBLICATION
-- Enable Realtime WebSockets on chat & order tables
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- ==============================================================================
-- 5. STORAGE BUCKETS (Run in SQL or create in Supabase Storage dashboard)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('products', 'products', true),
  ('avatars', 'avatars', true),
  ('chat', 'chat', true),
  ('receipts', 'receipts', true),
  ('custom-requests', 'custom-requests', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access policies for image buckets
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public Access Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public Access Chat" ON storage.objects FOR SELECT USING (bucket_id = 'chat');
CREATE POLICY "Public Access Receipts" ON storage.objects FOR SELECT USING (bucket_id = 'receipts');
CREATE POLICY "Public Access Custom Requests" ON storage.objects FOR SELECT USING (bucket_id = 'custom-requests');
