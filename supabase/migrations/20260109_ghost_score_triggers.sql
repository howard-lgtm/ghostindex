-- Triggers to automatically update Ghost Index Scores when reports change

-- Trigger function to update company score when a report is verified
CREATE OR REPLACE FUNCTION trigger_update_ghost_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the company's ghost index score
  PERFORM update_company_ghost_score(NEW.company_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger when a report is inserted
CREATE TRIGGER report_inserted_update_score
  AFTER INSERT ON reports
  FOR EACH ROW
  WHEN (NEW.is_verified = true AND NEW.status = 'approved')
  EXECUTE FUNCTION trigger_update_ghost_score();

-- Trigger when a report is updated (e.g., verified or status changed)
CREATE TRIGGER report_updated_update_score
  AFTER UPDATE ON reports
  FOR EACH ROW
  WHEN (
    (NEW.is_verified = true AND NEW.status = 'approved') AND
    (OLD.is_verified != NEW.is_verified OR OLD.status != NEW.status)
  )
  EXECUTE FUNCTION trigger_update_ghost_score();

-- Trigger when a report is deleted
CREATE TRIGGER report_deleted_update_score
  AFTER DELETE ON reports
  FOR EACH ROW
  WHEN (OLD.is_verified = true AND OLD.status = 'approved')
  EXECUTE FUNCTION trigger_update_ghost_score();

-- Add comments for documentation
COMMENT ON FUNCTION trigger_update_ghost_score IS 'Trigger function that recalculates company ghost score when reports change';
COMMENT ON TRIGGER report_inserted_update_score ON reports IS 'Recalculates ghost score when a verified report is inserted';
COMMENT ON TRIGGER report_updated_update_score ON reports IS 'Recalculates ghost score when a report is verified or status changes';
COMMENT ON TRIGGER report_deleted_update_score ON reports IS 'Recalculates ghost score when a verified report is deleted';
