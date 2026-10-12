-- SQL Schema: Digital Media Planning Dashboard MVP
-- Target: Supabase / PostgreSQL

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  product_price NUMERIC DEFAULT 0,
  margin NUMERIC DEFAULT 0, -- Decimal (0.00 to 1.00)
  total_budget NUMERIC NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  business_goal TEXT NOT NULL,
  landing_page_url TEXT,
  campaign_notes TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PLANNING', 'NEEDS_REVIEW', 'READY_TO_PUBLISH', 'COMPLETED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Campaign Phases Table
CREATE TABLE IF NOT EXISTS campaign_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  objective TEXT NOT NULL,
  channel TEXT NOT NULL,
  format TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  dayparting TEXT DEFAULT 'All Day',
  budget NUMERIC NOT NULL DEFAULT 0,
  budget_percentage NUMERIC NOT NULL DEFAULT 0,
  bidding_strategy TEXT NOT NULL,
  target_cpa NUMERIC,
  target_roas NUMERIC,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Campaign Audiences Table
CREATE TABLE IF NOT EXISTS campaign_audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES campaign_phases(id) ON DELETE CASCADE,
  age_min INT DEFAULT 18,
  age_max INT DEFAULT 65,
  gender TEXT DEFAULT 'ALL',
  locations JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  behaviors JSONB DEFAULT '[]'::jsonb,
  keywords JSONB DEFAULT '[]'::jsonb,
  custom_audience TEXT,
  lookalike TEXT,
  retargeting_window TEXT,
  exclusions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Campaign KPIs Table
CREATE TABLE IF NOT EXISTS campaign_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES campaign_phases(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  efficiency_metric TEXT,
  efficiency_value NUMERIC,
  source_type TEXT DEFAULT 'MANUAL',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Media Plan Items Table
CREATE TABLE IF NOT EXISTS media_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES campaign_phases(id) ON DELETE CASCADE,
  channel_format TEXT NOT NULL,
  objective TEXT NOT NULL,
  audience_summary TEXT NOT NULL,
  schedule_summary TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  budget_percentage NUMERIC NOT NULL,
  bidding_summary TEXT NOT NULL,
  kpi_summary TEXT NOT NULL,
  creative_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Campaign Briefs Table
CREATE TABLE IF NOT EXISTS campaign_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID UNIQUE NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  background TEXT,
  audience_insight TEXT,
  main_message TEXT,
  brand_safety TEXT,
  tracking_notes TEXT,
  production_timeline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Campaign Checklist Items Table (15 Checks)
CREATE TABLE IF NOT EXISTS campaign_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  check_key INT NOT NULL,
  label TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_campaign_check UNIQUE (campaign_id, check_key)
);

-- 9. Benchmarks Table
CREATE TABLE IF NOT EXISTS benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  platform TEXT NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
