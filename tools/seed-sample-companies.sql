-- Sample companies with ghost index scores for testing
-- Run this in Supabase SQL Editor to populate search results

-- Insert sample companies
INSERT INTO companies (name, domain, ghost_index_score) VALUES
  ('Apple', 'apple.com', 45.5),
  ('Google', 'google.com', 32.0),
  ('Meta', 'meta.com', 68.5),
  ('Amazon', 'amazon.com', 52.3),
  ('Microsoft', 'microsoft.com', 28.7),
  ('Netflix', 'netflix.com', 71.2),
  ('Tesla', 'tesla.com', 55.8),
  ('Uber', 'uber.com', 79.4),
  ('Airbnb', 'airbnb.com', 42.1),
  ('Spotify', 'spotify.com', 38.9)
ON CONFLICT (domain) 
DO UPDATE SET 
  ghost_index_score = EXCLUDED.ghost_index_score,
  updated_at = NOW();

-- Note: In production, ghost_index_score should be calculated from verified reports
-- This is just sample data for testing the search functionality
