-- ========================================================
-- SRR GROCERY DELIVERY APP - SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor
-- ========================================================

-- Enable UUID Extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. USERS & PROFILES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE,
    avatar_url TEXT,
    is_profile_completed BOOLEAN DEFAULT FALSE,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Valued Customer'),
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------
-- 2. ADDRESSES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Home',
    address_line TEXT NOT NULL,
    landmark TEXT,
    city TEXT DEFAULT 'SRR Nagar',
    pincode TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------
-- 3. CATEGORIES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    icon_name TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------
-- 4. PRODUCTS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------
-- 5. BRANDS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brands (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------
-- 6. VARIANTS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.variants (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    brand_id TEXT REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'gram', 'liter', 'ml', 'pcs')),
    quantity TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 100 CHECK (stock >= 0),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------
-- 7. COUPONS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    discount_percentage NUMERIC(5, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount_amount NUMERIC(10, 2) DEFAULT 100,
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------
-- 8. BANNERS TABLE (ANNOUNCEMENTS & OFFERS)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.banners (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    link TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------
-- 9. ORDERS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Debit Card', 'Credit Card', 'Cash on Delivery')),
    payment_status TEXT NOT NULL DEFAULT 'pending',
    status TEXT NOT NULL DEFAULT 'Order Placed' CHECK (status IN ('Order Placed', 'Shopping in Progress', 'On the Way', 'Delivered', 'Cancelled')),
    grocery_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    delivery_charge NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    coupon_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------
-- 10. ORDER ITEMS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_name TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    variant_quantity TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    product_image TEXT
);

-- --------------------------------------------------------
-- 11. DELIVERY SETTINGS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    charge_per_km NUMERIC(10, 2) DEFAULT 10.00,
    min_delivery_charge NUMERIC(10, 2) DEFAULT 40.00,
    max_delivery_radius_km NUMERIC(10, 2) DEFAULT 15.00,
    free_delivery_threshold NUMERIC(10, 2) DEFAULT 499.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- --------------------------------------------------------
-- 12. STORE SETTINGS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    store_name TEXT DEFAULT 'SRR Fresh Grocery Delivery',
    logo_url TEXT,
    contact_number TEXT DEFAULT '+91 98765 43210',
    whatsapp_number TEXT DEFAULT '+91 98765 43210',
    business_address TEXT DEFAULT '123 SRR Main Road, Market Area',
    working_hours TEXT DEFAULT '7:00 AM - 10:00 PM (Everyday)',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Seed initial settings
INSERT INTO public.delivery_settings (id, charge_per_km, min_delivery_charge, max_delivery_radius_km, free_delivery_threshold)
VALUES (1, 10.00, 40.00, 15.00, 499.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.store_settings (id, store_name, contact_number, whatsapp_number, business_address, working_hours)
VALUES (1, 'SRR Fresh Grocery Store', '+91 98765 43210', '+91 98765 43210', '123 SRR Main Road, Market Area', '7:00 AM - 10:00 PM (Daily)')
ON CONFLICT (id) DO NOTHING;

-- Seed Categories (Your 8 exact categories)
INSERT INTO public.categories (id, name, slug, image_url, display_order) VALUES
('cat-1', 'Vegetables', 'vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80', 1),
('cat-2', 'Fruits', 'fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80', 2),
('cat-3', 'Dairy', 'dairy', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80', 3),
('cat-4', 'Groceries', 'groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', 4),
('cat-5', 'Beverages', 'beverages', 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=400&q=80', 5),
('cat-6', 'Bakery', 'bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', 6),
('cat-7', 'Snacks', 'snacks', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=80', 7),
('cat-8', 'Meat (Chicken, Mutton, Fish)', 'meat', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80', 8)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Allow public read variants" ON public.variants FOR SELECT USING (true);
CREATE POLICY "Allow public read banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read delivery_settings" ON public.delivery_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read store_settings" ON public.store_settings FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users create order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies
CREATE POLICY "Admins full access profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access categories" ON public.categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access brands" ON public.brands FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access variants" ON public.variants FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access coupons" ON public.coupons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access banners" ON public.banners FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access orders" ON public.orders FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access delivery_settings" ON public.delivery_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access store_settings" ON public.store_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- --------------------------------------------------------
-- SUPABASE STORAGE BUCKETS
-- --------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('categories', 'categories', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('store', 'store', true) ON CONFLICT (id) DO NOTHING;
