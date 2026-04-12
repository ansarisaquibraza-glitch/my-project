-- ================================================================
-- SMART ROAD DAMAGE REPORTING SYSTEM — Supabase SQL Schema
-- Run this in the Supabase SQL Editor to set up your database
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users Table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Reports Table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  damage_type    VARCHAR(50) NOT NULL CHECK (damage_type IN ('pothole', 'crack', 'flooding', 'collapse', 'other')),
  description    TEXT NOT NULL,
  image_url      TEXT,
  latitude       DECIMAL(10, 8) NOT NULL,
  longitude      DECIMAL(11, 8) NOT NULL,
  address        TEXT,
  status         VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  reporter_name  VARCHAR(100) NOT NULL,
  reporter_email VARCHAR(255) NOT NULL,
  reporter_phone VARCHAR(20),
  admin_notes    TEXT,
  resolved_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes for performance ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_damage_type ON reports(damage_type);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);

-- ── Auto-update updated_at trigger ──────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ── Seed: Default admin user (change password after setup!) ─────
-- Password: Admin@123 (bcrypt hash)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'System Admin',
  'admin@smartroad.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5EvzpXQbQO',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- ── Seed: Sample reports for testing ────────────────────────────
INSERT INTO reports (damage_type, description, latitude, longitude, address, reporter_name, reporter_email, status)
VALUES
  ('pothole', 'Large pothole near the main intersection causing vehicle damage', 19.0760, 72.8777, 'Marine Drive, Mumbai', 'Rahul Sharma', 'rahul@example.com', 'pending'),
  ('crack', 'Multiple cracks spreading across the road surface', 19.0825, 72.8908, 'Bandra West, Mumbai', 'Priya Patel', 'priya@example.com', 'in_progress'),
  ('flooding', 'Road completely flooded after heavy rain, danger to commuters', 19.0596, 72.8295, 'Andheri East, Mumbai', 'Amit Singh', 'amit@example.com', 'resolved'),
  ('collapse', 'Road collapse exposing underground pipes', 19.1136, 72.8697, 'Borivali, Mumbai', 'Neha Gupta', 'neha@example.com', 'pending'),
  ('pothole', 'Deep pothole masked by standing water after monsoon', 19.0176, 72.8562, 'Worli, Mumbai', 'Vijay Kumar', 'vijay@example.com', 'in_progress')
ON CONFLICT DO NOTHING;

-- ================================================================
-- SUPABASE STORAGE SETUP (run via Supabase dashboard or API)
-- ================================================================
-- 1. Go to Storage in your Supabase dashboard
-- 2. Create a new bucket named: road-damage-images
-- 3. Set it to PUBLIC
-- 4. Add the following storage policy:
--
-- Policy name: Allow public uploads
-- Definition: (bucket_id = 'road-damage-images')
-- Operation: INSERT
-- Target roles: anon, authenticated
-- ================================================================
