-- ============================================
-- NEARMEE DATABASE SCHEMA v1.0
-- Supabase (PostgreSQL)
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('customer', 'merchant');
CREATE TYPE merchant_tier AS ENUM ('free', 'pro', 'business');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE service_status AS ENUM ('active', 'paused', 'deleted');

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    role user_role DEFAULT 'customer',
    city TEXT DEFAULT 'Bayawan City',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MERCHANTS
-- ============================================
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_area TEXT NOT NULL,
    category TEXT NOT NULL,
    bio TEXT,
    tier merchant_tier DEFAULT 'free',
    is_verified BOOLEAN DEFAULT FALSE,
    rating_avg DECIMAL(2,1) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================
-- SERVICES
-- ============================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    price_unit TEXT DEFAULT 'per visit',
    image_url TEXT,
    status service_status DEFAULT 'active',
    is_boosted BOOLEAN DEFAULT FALSE,
    boost_expires_at TIMESTAMPTZ,
    city TEXT NOT NULL DEFAULT 'Bayawan City',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AVAILABILITY
-- ============================================
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    time_slot TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES profiles(id),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    service_id UUID NOT NULL REFERENCES services(id),
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    notes TEXT,
    status booking_status DEFAULT 'pending',
    total_price DECIMAL(10,2),
    customer_rating INTEGER CHECK (customer_rating BETWEEN 1 AND 5),
    customer_review TEXT,
    rated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_city ON services(city);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_merchant ON services(merchant_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_merchant ON bookings(merchant_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_merchants_category ON merchants(category);

-- ============================================
-- FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_merchants_updated_at BEFORE UPDATE ON merchants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update merchant rating when booking is rated
CREATE OR REPLACE FUNCTION update_merchant_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_rating IS NOT NULL AND OLD.customer_rating IS NULL THEN
        UPDATE merchants SET
            rating_avg = (
                SELECT ROUND(AVG(customer_rating)::numeric, 1)
                FROM bookings
                WHERE merchant_id = NEW.merchant_id AND customer_rating IS NOT NULL
            ),
            rating_count = (
                SELECT COUNT(*)
                FROM bookings
                WHERE merchant_id = NEW.merchant_id AND customer_rating IS NOT NULL
            )
        WHERE id = NEW.merchant_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_rated AFTER UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_merchant_rating();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, phone, full_name)
    VALUES (
        NEW.id,
        NEW.phone,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- MERCHANTS
CREATE POLICY "Merchants are viewable by everyone" ON merchants FOR SELECT USING (true);
CREATE POLICY "Users can create own merchant profile" ON merchants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Merchants can update own profile" ON merchants FOR UPDATE USING (auth.uid() = user_id);

-- SERVICES
CREATE POLICY "Active services viewable by everyone" ON services FOR SELECT USING (status = 'active');
CREATE POLICY "Merchants can insert own services" ON services FOR INSERT WITH CHECK (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
);
CREATE POLICY "Merchants can update own services" ON services FOR UPDATE USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
);

-- BOOKINGS
CREATE POLICY "Booking parties can view bookings" ON bookings FOR SELECT USING (
    customer_id = auth.uid() OR
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
);
CREATE POLICY "Customers can create bookings" ON bookings FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Booking parties can update bookings" ON bookings FOR UPDATE USING (
    customer_id = auth.uid() OR
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
);

-- AVAILABILITY
CREATE POLICY "Availability viewable by everyone" ON availability FOR SELECT USING (true);
CREATE POLICY "Merchants can manage availability" ON availability FOR ALL USING (
    service_id IN (
        SELECT s.id FROM services s
        JOIN merchants m ON s.merchant_id = m.id
        WHERE m.user_id = auth.uid()
    )
);
