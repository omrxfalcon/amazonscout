-- Run this once in your Supabase SQL editor to bootstrap the schema.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                      SERIAL PRIMARY KEY,
  user_id                 INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT UNIQUE NOT NULL,
  stripe_customer_id      TEXT NOT NULL,
  -- active | canceled | past_due | trialing
  status                  TEXT NOT NULL DEFAULT 'active',
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_products (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
  asin              TEXT NOT NULL,
  title             TEXT,
  price             NUMERIC(10, 2),
  bsr               INTEGER,
  reviews           INTEGER,
  opportunity_score NUMERIC(5, 2),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent a user from saving the same ASIN twice
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_asin ON saved_products (user_id, asin);
