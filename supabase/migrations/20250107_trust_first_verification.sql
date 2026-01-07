-- Migration: Trust-First Verification System
-- Adds verification_code for email reply verification
-- Simplifies verification flow - users submit instantly, verify later via email reply

-- Add verification_code to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS verification_code TEXT UNIQUE;

-- Add email_verified flag (separate from is_verified which can be manual)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Add proof_image_url for screenshot storage
ALTER TABLE reports ADD COLUMN IF NOT EXISTS proof_image_url TEXT;

-- Create index for fast verification code lookup
CREATE INDEX IF NOT EXISTS idx_reports_verification_code ON reports(verification_code);

-- Function to generate unique verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := LOWER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM reports WHERE verification_code = code) INTO exists;
    
    -- Exit loop if unique
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate verification code on report creation
CREATE OR REPLACE FUNCTION set_verification_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_code IS NULL THEN
    NEW.verification_code := generate_verification_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_verification_code
  BEFORE INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION set_verification_code();

-- Update email_verifications table to link to verification codes
ALTER TABLE email_verifications ADD COLUMN IF NOT EXISTS verification_code TEXT;
CREATE INDEX IF NOT EXISTS idx_email_verifications_code ON email_verifications(verification_code);

-- Function to verify report via email reply
CREATE OR REPLACE FUNCTION verify_report_by_code(code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  report_exists BOOLEAN;
BEGIN
  -- Check if report exists with this code
  SELECT EXISTS(SELECT 1 FROM reports WHERE verification_code = code) INTO report_exists;
  
  IF NOT report_exists THEN
    RETURN FALSE;
  END IF;
  
  -- Update report to verified
  UPDATE reports
  SET 
    email_verified = TRUE,
    is_verified = TRUE,
    status = 'approved'
  WHERE verification_code = code;
  
  -- Log verification activity
  INSERT INTO activity_logs (report_id, activity_type, activity_date)
  SELECT 
    id,
    'confirmation_received',
    NOW()
  FROM reports
  WHERE verification_code = code;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment explaining the verification flow
COMMENT ON COLUMN reports.verification_code IS 'Unique code for email reply verification. Users reply to verification email with proof, system matches via this code.';
COMMENT ON COLUMN reports.email_verified IS 'True if user verified via email reply with proof (screenshot or forwarded confirmation).';
COMMENT ON COLUMN reports.proof_image_url IS 'URL to uploaded proof image (screenshot of confirmation email or application portal).';
