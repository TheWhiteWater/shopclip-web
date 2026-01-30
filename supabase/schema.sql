-- ShopClip Database Schema (Universal)
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ITEMS TABLE (universal - any product)
-- ============================================
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Source identifiers
  platform TEXT NOT NULL DEFAULT 'other', -- facebook, amazon, ebay, trademe, other
  item_id TEXT,                           -- platform-specific ID
  url TEXT NOT NULL,
  
  -- Basic product info
  title TEXT NOT NULL,
  price TEXT,                             -- display price "NZ$25"
  price_value DECIMAL(12,2),              -- numeric for sorting/comparison
  currency TEXT DEFAULT 'NZD',
  stock TEXT,                             -- in_stock, sold, pending
  
  -- Details
  condition TEXT,                         -- New, Used – like new, etc
  description TEXT,
  location TEXT,
  
  -- Media
  image_url TEXT,                         -- primary image
  images JSONB DEFAULT '[]'::jsonb,       -- array of all image URLs
  
  -- Seller info (nullable - not all platforms have this)
  seller_name TEXT,
  seller_rating DECIMAL(2,1),             -- 4.8
  seller_reviews INTEGER,                 -- 55
  seller_badges TEXT,
  seller_joined INTEGER,                  -- year: 2015
  seller_profile_url TEXT,
  
  -- Tracking
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  extracted_at TIMESTAMPTZ,
  
  -- User actions
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  purchased_price DECIMAL(12,2),
  
  -- Constraints
  UNIQUE(user_id, platform, item_id),
  UNIQUE(user_id, url)
);

-- Indexes
CREATE INDEX idx_items_user_saved ON items(user_id, saved_at DESC);
CREATE INDEX idx_items_user_platform ON items(user_id, platform);
CREATE INDEX idx_items_user_favorite ON items(user_id, is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX idx_items_price_value ON items(user_id, price_value);
CREATE INDEX idx_items_location ON items(user_id, location);

-- ============================================
-- COLLECTIONS TABLE (group items)
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#4F46E5',           -- for UI
  icon TEXT DEFAULT '📦',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collections_user ON collections(user_id);

-- ============================================
-- COLLECTION_ITEMS (many-to-many)
-- ============================================
CREATE TABLE IF NOT EXISTS collection_items (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, item_id)
);

-- ============================================
-- PRICE_HISTORY (track changes)
-- ============================================
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  price_value DECIMAL(12,2) NOT NULL,
  price_text TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_item ON price_history(item_id, recorded_at DESC);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Items
CREATE POLICY "Users can view own items" ON items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own items" ON items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own items" ON items FOR DELETE USING (auth.uid() = user_id);

-- Collections
CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON collections FOR DELETE USING (auth.uid() = user_id);

-- Collection Items
CREATE POLICY "Users can view own collection items" ON collection_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own collection items" ON collection_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own collection items" ON collection_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
);

-- Price History
CREATE POLICY "Users can view own price history" ON price_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM items WHERE id = item_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own price history" ON price_history FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM items WHERE id = item_id AND user_id = auth.uid())
);

-- Subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION get_user_item_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM items WHERE user_id = p_user_id AND is_archived = FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION can_add_item(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier TEXT;
  v_count INTEGER;
BEGIN
  SELECT subscription_tier INTO v_tier FROM users WHERE id = p_user_id;
  IF v_tier = 'pro' THEN RETURN TRUE; END IF;
  v_count := get_user_item_count(p_user_id);
  RETURN v_count < 50; -- Free tier: 50 items
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
