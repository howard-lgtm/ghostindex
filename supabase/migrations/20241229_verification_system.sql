-- Migration: Add verification-first architecture
-- This adds email parsing, activity tracking, and auto-ghost detection

-- Add email verification fields to reports
ALTER TABLE reports ADD COLUMN IF NOT EXISTS email_verification_id TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS application_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS days_since_contact INTEGER GENERATED ALWAYS AS (
  EXTRACT(DAY FROM (NOW() - COALESCE(last_contact_date, application_date)))::INTEGER
) STORED;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS auto_ghosted BOOLEAN DEFAULT FALSE;

-- Create activity_logs table for tracking application lifecycle
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('application_sent', 'confirmation_received', 'interview_scheduled', 'rejection_received', 'ghosted')),
  activity_date TIMESTAMP WITH TIME ZONE NOT NULL,
  email_source TEXT,
  parsed_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_verifications table for Postmark inbound parsing
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  company_domain TEXT NOT NULL,
  email_from TEXT NOT NULL,
  email_subject TEXT,
  email_body TEXT,
  parsed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  raw_email_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_postings table for Ghost Job detection
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  job_url TEXT,
  first_seen_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  days_active INTEGER GENERATED ALWAYS AS (
    EXTRACT(DAY FROM (last_seen_date - first_seen_date))::INTEGER
  ) STORED,
  is_ghost_job BOOLEAN DEFAULT FALSE,
  source_platform TEXT CHECK (source_platform IN ('linkedin', 'indeed', 'glassdoor', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_report_id ON activity_logs(report_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_date ON activity_logs(activity_date);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_company_domain ON email_verifications(company_domain);
CREATE INDEX IF NOT EXISTS idx_email_verifications_status ON email_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_job_postings_company_id ON job_postings(company_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_days_active ON job_postings(days_active);
CREATE INDEX IF NOT EXISTS idx_reports_days_since_contact ON reports(days_since_contact);

-- Enable RLS on new tables
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_logs
CREATE POLICY "Users can view activity logs for their reports"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = activity_logs.report_id 
      AND reports.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for email_verifications
CREATE POLICY "Users can view their own email verifications"
  ON email_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email verifications"
  ON email_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for job_postings
CREATE POLICY "Job postings are viewable by everyone"
  ON job_postings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert job postings"
  ON job_postings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Function to auto-ghost applications after 30 days
CREATE OR REPLACE FUNCTION auto_ghost_stale_applications()
RETURNS void AS $$
BEGIN
  UPDATE reports
  SET 
    auto_ghosted = TRUE,
    status = 'rejected'
  WHERE 
    is_verified = TRUE
    AND auto_ghosted = FALSE
    AND days_since_contact >= 30
    AND status = 'pending';
    
  -- Log the ghosting activity
  INSERT INTO activity_logs (report_id, activity_type, activity_date)
  SELECT 
    id,
    'ghosted',
    NOW()
  FROM reports
  WHERE 
    auto_ghosted = TRUE
    AND NOT EXISTS (
      SELECT 1 FROM activity_logs 
      WHERE activity_logs.report_id = reports.id 
      AND activity_logs.activity_type = 'ghosted'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate Ghost Index Score (0-100)
-- 100 = Instant responses, 0 = Total silence
CREATE OR REPLACE FUNCTION calculate_ghost_index_score(company_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_reports INTEGER;
  ghosted_reports INTEGER;
  avg_response_days DECIMAL;
  score DECIMAL(5,2);
BEGIN
  -- Count total verified reports
  SELECT COUNT(*) INTO total_reports
  FROM reports
  WHERE company_id = company_uuid AND is_verified = TRUE;
  
  -- If no reports, return NULL
  IF total_reports = 0 THEN
    RETURN NULL;
  END IF;
  
  -- Count ghosted reports (auto or manual)
  SELECT COUNT(*) INTO ghosted_reports
  FROM reports
  WHERE company_id = company_uuid 
    AND is_verified = TRUE 
    AND (auto_ghosted = TRUE OR status = 'rejected');
  
  -- Calculate average response time for non-ghosted
  SELECT AVG(days_since_contact) INTO avg_response_days
  FROM reports
  WHERE company_id = company_uuid 
    AND is_verified = TRUE 
    AND auto_ghosted = FALSE
    AND status = 'approved';
  
  -- Calculate score (weighted formula)
  -- Ghost rate: 70% weight
  -- Response time: 30% weight
  score := (
    (1 - (ghosted_reports::DECIMAL / total_reports)) * 70 +
    (CASE 
      WHEN avg_response_days IS NULL THEN 0
      WHEN avg_response_days <= 3 THEN 30
      WHEN avg_response_days <= 7 THEN 20
      WHEN avg_response_days <= 14 THEN 10
      ELSE 0
    END)
  );
  
  RETURN GREATEST(0, LEAST(100, score));
END;
$$ LANGUAGE plpgsql;

-- Function to detect ghost jobs
CREATE OR REPLACE FUNCTION detect_ghost_jobs()
RETURNS void AS $$
BEGIN
  UPDATE job_postings jp
  SET is_ghost_job = TRUE
  FROM companies c
  WHERE 
    jp.company_id = c.id
    AND jp.days_active >= 60
    AND c.ghost_index_score < 30
    AND jp.is_ghost_job = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update company scores when reports change
CREATE OR REPLACE FUNCTION update_company_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE companies
  SET ghost_index_score = calculate_ghost_index_score(NEW.company_id)
  WHERE id = NEW.company_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_company_score
  AFTER INSERT OR UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_company_score();

-- Add triggers for updated_at
CREATE TRIGGER update_activity_logs_updated_at
  BEFORE UPDATE ON activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_verifications_updated_at
  BEFORE UPDATE ON email_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON job_postings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
