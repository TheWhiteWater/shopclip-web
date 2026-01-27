-- CarScout Database Schema
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ
);

-- ============================================
-- API TOKENS TABLE (hashed tokens for extension)
-- ============================================
CREATE TABLE IF NOT EXISTS api_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL, -- bcrypt hash, never expose
  name TEXT DEFAULT 'Extension Token',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_tokens_user ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_hash ON api_tokens(token_hash);

-- ============================================
-- LISTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL, -- SHA-256 hash from extension
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  year INTEGER,
  mileage INTEGER,
  make TEXT,
  model TEXT,
  location TEXT,
  image_url TEXT,
  platform TEXT NOT NULL DEFAULT 'trademe' CHECK (platform IN ('trademe', 'facebook', 'autotrader', 'carsales')),
  current_price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER,
  price_dropped BOOLEAN DEFAULT FALSE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  notes TEXT,

  UNIQUE(user_id, external_id)
);

CREATE INDEX idx_listings_user_saved ON listings(user_id, saved_at DESC);
CREATE INDEX idx_listings_user_platform ON listings(user_id, platform);
CREATE INDEX idx_listings_price_dropped ON listings(user_id, price_dropped) WHERE price_dropped = TRUE;

-- ============================================
-- PRICE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'sync' CHECK (source IN ('sync', 'manual', 'scrape'))
);

CREATE INDEX idx_price_history_listing ON price_history(listing_id, recorded_at DESC);

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
-- SYNC LOGS TABLE (debugging)
-- ============================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items_synced INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error TEXT
);

CREATE INDEX idx_sync_logs_user ON sync_logs(user_id, started_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- API Tokens policies
CREATE POLICY "Users can view own tokens" ON api_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tokens" ON api_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tokens" ON api_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- Listings policies
CREATE POLICY "Users can view own listings" ON listings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings" ON listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings" ON listings
  FOR DELETE USING (auth.uid() = user_id);

-- Price History policies
CREATE POLICY "Users can view own price history" ON price_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = price_history.listing_id
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own price history" ON price_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = price_history.listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Sync Logs policies
CREATE POLICY "Users can view own sync logs" ON sync_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sync logs" ON sync_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Get user's listing count (for free tier enforcement)
CREATE OR REPLACE FUNCTION get_user_listing_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM listings
    WHERE user_id = p_user_id
    AND is_deleted = FALSE
    AND is_archived = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can add more listings
CREATE OR REPLACE FUNCTION can_add_listing(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier TEXT;
  v_count INTEGER;
BEGIN
  SELECT subscription_tier INTO v_tier FROM users WHERE id = p_user_id;

  IF v_tier = 'pro' THEN
    RETURN TRUE;
  END IF;

  v_count := get_user_listing_count(p_user_id);
  RETURN v_count < 25; -- Free tier limit
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
