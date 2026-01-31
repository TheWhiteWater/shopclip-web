-- Grabbit Database Schema (Universal)
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
-- COLLECTIONS TABLE (group items) — "Packs"
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE,                       -- for public URL: grabbit.app/p/{slug}
  description TEXT,
  color TEXT DEFAULT '#4F46E5',           -- for UI
  icon TEXT DEFAULT '📦',
  cover_image_url TEXT,                   -- for OG preview (auto from first item)

  -- Sharing
  is_public BOOLEAN DEFAULT FALSE,        -- can be viewed without login
  views_count INTEGER DEFAULT 0,          -- social proof
  clones_count INTEGER DEFAULT 0,         -- social proof
  cloned_from_id UUID REFERENCES collections(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ                -- when made public
);

CREATE INDEX idx_collections_user ON collections(user_id);
CREATE INDEX idx_collections_slug ON collections(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_collections_public ON collections(is_public) WHERE is_public = TRUE;

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

-- Collections (own + public)
CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public collections" ON collections FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Users can insert own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON collections FOR DELETE USING (auth.uid() = user_id);

-- Collection Items (own + public)
CREATE POLICY "Users can view own collection items" ON collection_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
);
CREATE POLICY "Anyone can view public collection items" ON collection_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND is_public = TRUE)
);
CREATE POLICY "Users can insert own collection items" ON collection_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own collection items" ON collection_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
);

-- Items (need to view items in public collections)
CREATE POLICY "Anyone can view items in public collections" ON items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM collection_items ci
    JOIN collections c ON ci.collection_id = c.id
    WHERE ci.item_id = items.id AND c.is_public = TRUE
  )
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

-- ============================================
-- COLLECTION HELPER FUNCTIONS
-- ============================================

-- Generate unique slug from name
CREATE OR REPLACE FUNCTION generate_collection_slug(p_name TEXT)
RETURNS TEXT AS $$
DECLARE
  v_slug TEXT;
  v_base_slug TEXT;
  v_counter INTEGER := 0;
BEGIN
  -- Convert to lowercase, replace spaces with hyphens, remove special chars
  v_base_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9\s-]', '', 'g'));
  v_base_slug := regexp_replace(v_base_slug, '\s+', '-', 'g');
  v_base_slug := regexp_replace(v_base_slug, '-+', '-', 'g');
  v_base_slug := trim(both '-' from v_base_slug);

  -- Limit length
  v_base_slug := left(v_base_slug, 50);
  v_slug := v_base_slug;

  -- Check uniqueness, add suffix if needed
  WHILE EXISTS (SELECT 1 FROM collections WHERE slug = v_slug) LOOP
    v_counter := v_counter + 1;
    v_slug := v_base_slug || '-' || v_counter;
  END LOOP;

  RETURN v_slug;
END;
$$ LANGUAGE plpgsql;

-- Get collection total price
CREATE OR REPLACE FUNCTION get_collection_total(p_collection_id UUID)
RETURNS DECIMAL(12,2) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(i.price_value), 0)
    FROM collection_items ci
    JOIN items i ON ci.item_id = i.id
    WHERE ci.collection_id = p_collection_id
      AND i.price_value IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get collection item count
CREATE OR REPLACE FUNCTION get_collection_item_count(p_collection_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM collection_items
    WHERE collection_id = p_collection_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment view count (for public pages)
CREATE OR REPLACE FUNCTION increment_collection_views(p_collection_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE collections
  SET views_count = views_count + 1
  WHERE id = p_collection_id AND is_public = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clone collection to new user
CREATE OR REPLACE FUNCTION clone_collection(p_collection_id UUID, p_new_user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_new_collection_id UUID;
  v_original collections%ROWTYPE;
BEGIN
  -- Get original collection
  SELECT * INTO v_original FROM collections WHERE id = p_collection_id AND is_public = TRUE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Collection not found or not public';
  END IF;

  -- Create new collection
  INSERT INTO collections (user_id, name, description, color, icon, cloned_from_id)
  VALUES (
    p_new_user_id,
    v_original.name || ' (cloned)',
    v_original.description,
    v_original.color,
    v_original.icon,
    p_collection_id
  )
  RETURNING id INTO v_new_collection_id;

  -- Copy items to new user and add to collection
  -- Note: This creates new item records for the cloning user
  INSERT INTO items (user_id, platform, item_id, url, title, price, price_value, currency,
                     condition, description, location, image_url, images)
  SELECT p_new_user_id, i.platform, i.item_id, i.url, i.title, i.price, i.price_value, i.currency,
         i.condition, i.description, i.location, i.image_url, i.images
  FROM collection_items ci
  JOIN items i ON ci.item_id = i.id
  WHERE ci.collection_id = p_collection_id
  ON CONFLICT (user_id, url) DO NOTHING;

  -- Link cloned items to new collection
  INSERT INTO collection_items (collection_id, item_id)
  SELECT v_new_collection_id, new_items.id
  FROM items new_items
  WHERE new_items.user_id = p_new_user_id
    AND new_items.url IN (
      SELECT i.url FROM collection_items ci
      JOIN items i ON ci.item_id = i.id
      WHERE ci.collection_id = p_collection_id
    );

  -- Increment clone count on original
  UPDATE collections SET clones_count = clones_count + 1 WHERE id = p_collection_id;

  RETURN v_new_collection_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
