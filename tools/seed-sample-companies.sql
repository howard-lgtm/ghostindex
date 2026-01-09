-- Sample companies with ghost index scores and metadata for testing
-- Run this in Supabase SQL Editor to populate search results

-- Insert sample companies with full metadata
INSERT INTO companies (
  name, 
  domain, 
  ghost_index_score, 
  stock_symbol, 
  company_type, 
  industry, 
  employee_count_range, 
  founded_year, 
  headquarters,
  description
) VALUES
  ('Apple', 'apple.com', 45.5, 'AAPL', 'public', 'Technology', '10000+', 1976, 'Cupertino, CA', 'Consumer electronics and software company'),
  ('Google', 'google.com', 32.0, 'GOOGL', 'public', 'Technology', '10000+', 1998, 'Mountain View, CA', 'Search engine and cloud services'),
  ('Meta', 'meta.com', 68.5, 'META', 'public', 'Technology', '10000+', 2004, 'Menlo Park, CA', 'Social media and metaverse platform'),
  ('Amazon', 'amazon.com', 52.3, 'AMZN', 'public', 'E-commerce', '10000+', 1994, 'Seattle, WA', 'E-commerce and cloud computing'),
  ('Microsoft', 'microsoft.com', 28.7, 'MSFT', 'public', 'Technology', '10000+', 1975, 'Redmond, WA', 'Software and cloud services'),
  ('Netflix', 'netflix.com', 71.2, 'NFLX', 'public', 'Entertainment', '10000+', 1997, 'Los Gatos, CA', 'Streaming entertainment service'),
  ('Tesla', 'tesla.com', 55.8, 'TSLA', 'public', 'Automotive', '10000+', 2003, 'Austin, TX', 'Electric vehicles and clean energy'),
  ('Uber', 'uber.com', 79.4, 'UBER', 'public', 'Transportation', '10000+', 2009, 'San Francisco, CA', 'Ride-sharing and delivery platform'),
  ('Airbnb', 'airbnb.com', 42.1, 'ABNB', 'public', 'Hospitality', '5001-10000', 2008, 'San Francisco, CA', 'Home rental marketplace'),
  ('Spotify', 'spotify.com', 38.9, 'SPOT', 'public', 'Entertainment', '5001-10000', 2006, 'Stockholm, Sweden', 'Music streaming service'),
  ('Stripe', 'stripe.com', 35.2, NULL, 'private', 'Fintech', '5001-10000', 2010, 'San Francisco, CA', 'Payment processing platform'),
  ('OpenAI', 'openai.com', 48.7, NULL, 'private', 'AI/ML', '501-1000', 2015, 'San Francisco, CA', 'Artificial intelligence research'),
  ('SpaceX', 'spacex.com', 62.3, NULL, 'private', 'Aerospace', '10000+', 2002, 'Hawthorne, CA', 'Space exploration and satellite internet'),
  ('Databricks', 'databricks.com', 41.8, NULL, 'private', 'Technology', '5001-10000', 2013, 'San Francisco, CA', 'Data analytics and AI platform')
ON CONFLICT (domain) 
DO UPDATE SET 
  ghost_index_score = EXCLUDED.ghost_index_score,
  stock_symbol = EXCLUDED.stock_symbol,
  company_type = EXCLUDED.company_type,
  industry = EXCLUDED.industry,
  employee_count_range = EXCLUDED.employee_count_range,
  founded_year = EXCLUDED.founded_year,
  headquarters = EXCLUDED.headquarters,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Note: In production, ghost_index_score should be calculated from verified reports
-- This is sample data for testing the search functionality with rich metadata
