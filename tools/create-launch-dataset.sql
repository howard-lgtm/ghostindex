-- Launch Dataset: Top 50 Tech Companies for Production
-- Run this to populate initial company data for launch
-- Ghost Index Scores will be NULL until users submit verified reports

-- Clear existing sample data (optional - comment out if you want to keep test data)
-- DELETE FROM companies WHERE ghost_index_score IS NOT NULL;

-- Insert production-ready company dataset
INSERT INTO companies (
  name, 
  domain, 
  stock_symbol, 
  company_type, 
  industry, 
  employee_count_range, 
  founded_year, 
  headquarters,
  description
) VALUES
  -- FAANG + Major Tech
  ('Apple', 'apple.com', 'AAPL', 'public', 'Technology', '10000+', 1976, 'Cupertino, CA', 'Consumer electronics and software'),
  ('Meta', 'meta.com', 'META', 'public', 'Technology', '10000+', 2004, 'Menlo Park, CA', 'Social media and metaverse'),
  ('Amazon', 'amazon.com', 'AMZN', 'public', 'E-commerce', '10000+', 1994, 'Seattle, WA', 'E-commerce and cloud computing'),
  ('Netflix', 'netflix.com', 'NFLX', 'public', 'Entertainment', '10000+', 1997, 'Los Gatos, CA', 'Streaming entertainment'),
  ('Google', 'google.com', 'GOOGL', 'public', 'Technology', '10000+', 1998, 'Mountain View, CA', 'Search and cloud services'),
  
  -- Major Tech Companies
  ('Microsoft', 'microsoft.com', 'MSFT', 'public', 'Technology', '10000+', 1975, 'Redmond, WA', 'Software and cloud services'),
  ('Tesla', 'tesla.com', 'TSLA', 'public', 'Automotive', '10000+', 2003, 'Austin, TX', 'Electric vehicles and clean energy'),
  ('Nvidia', 'nvidia.com', 'NVDA', 'public', 'Technology', '10000+', 1993, 'Santa Clara, CA', 'Graphics and AI processors'),
  ('Adobe', 'adobe.com', 'ADBE', 'public', 'Technology', '10000+', 1982, 'San Jose, CA', 'Creative software and marketing'),
  ('Salesforce', 'salesforce.com', 'CRM', 'public', 'Technology', '10000+', 1999, 'San Francisco, CA', 'CRM and cloud software'),
  ('Oracle', 'oracle.com', 'ORCL', 'public', 'Technology', '10000+', 1977, 'Austin, TX', 'Database and enterprise software'),
  ('Intel', 'intel.com', 'INTC', 'public', 'Technology', '10000+', 1968, 'Santa Clara, CA', 'Semiconductor manufacturing'),
  ('IBM', 'ibm.com', 'IBM', 'public', 'Technology', '10000+', 1911, 'Armonk, NY', 'Enterprise technology and consulting'),
  ('Cisco', 'cisco.com', 'CSCO', 'public', 'Technology', '10000+', 1984, 'San Jose, CA', 'Networking and cybersecurity'),
  
  -- Ride-sharing & Delivery
  ('Uber', 'uber.com', 'UBER', 'public', 'Transportation', '10000+', 2009, 'San Francisco, CA', 'Ride-sharing and delivery'),
  ('Lyft', 'lyft.com', 'LYFT', 'public', 'Transportation', '5001-10000', 2012, 'San Francisco, CA', 'Ride-sharing platform'),
  ('DoorDash', 'doordash.com', 'DASH', 'public', 'Food Delivery', '5001-10000', 2013, 'San Francisco, CA', 'Food delivery platform'),
  
  -- Social Media & Communication
  ('Twitter', 'twitter.com', NULL, 'private', 'Technology', '5001-10000', 2006, 'San Francisco, CA', 'Social media platform'),
  ('Snap', 'snap.com', 'SNAP', 'public', 'Technology', '5001-10000', 2011, 'Santa Monica, CA', 'Social media and AR'),
  ('LinkedIn', 'linkedin.com', NULL, 'public', 'Technology', '10000+', 2003, 'Sunnyvale, CA', 'Professional networking'),
  ('Discord', 'discord.com', NULL, 'private', 'Technology', '501-1000', 2015, 'San Francisco, CA', 'Communication platform'),
  ('Slack', 'slack.com', NULL, 'public', 'Technology', '1001-5000', 2013, 'San Francisco, CA', 'Business communication'),
  ('Zoom', 'zoom.us', 'ZM', 'public', 'Technology', '5001-10000', 2011, 'San Jose, CA', 'Video conferencing'),
  
  -- E-commerce & Marketplaces
  ('Shopify', 'shopify.com', 'SHOP', 'public', 'E-commerce', '10000+', 2006, 'Ottawa, Canada', 'E-commerce platform'),
  ('Etsy', 'etsy.com', 'ETSY', 'public', 'E-commerce', '1001-5000', 2005, 'Brooklyn, NY', 'Handmade goods marketplace'),
  ('eBay', 'ebay.com', 'EBAY', 'public', 'E-commerce', '10000+', 1995, 'San Jose, CA', 'Online marketplace'),
  ('Airbnb', 'airbnb.com', 'ABNB', 'public', 'Hospitality', '5001-10000', 2008, 'San Francisco, CA', 'Home rental marketplace'),
  
  -- Fintech
  ('PayPal', 'paypal.com', 'PYPL', 'public', 'Fintech', '10000+', 1998, 'San Jose, CA', 'Digital payments'),
  ('Square', 'squareup.com', 'SQ', 'public', 'Fintech', '5001-10000', 2009, 'San Francisco, CA', 'Payment processing'),
  ('Stripe', 'stripe.com', NULL, 'private', 'Fintech', '5001-10000', 2010, 'San Francisco, CA', 'Payment infrastructure'),
  ('Coinbase', 'coinbase.com', 'COIN', 'public', 'Fintech', '1001-5000', 2012, 'San Francisco, CA', 'Cryptocurrency exchange'),
  ('Robinhood', 'robinhood.com', NULL, 'private', 'Fintech', '1001-5000', 2013, 'Menlo Park, CA', 'Stock trading app'),
  
  -- Cloud & Infrastructure
  ('Snowflake', 'snowflake.com', 'SNOW', 'public', 'Technology', '5001-10000', 2012, 'Bozeman, MT', 'Cloud data platform'),
  ('Databricks', 'databricks.com', NULL, 'private', 'Technology', '5001-10000', 2013, 'San Francisco, CA', 'Data analytics platform'),
  ('MongoDB', 'mongodb.com', 'MDB', 'public', 'Technology', '1001-5000', 2007, 'New York, NY', 'Database platform'),
  ('Atlassian', 'atlassian.com', 'TEAM', 'public', 'Technology', '10000+', 2002, 'Sydney, Australia', 'Collaboration software'),
  ('Twilio', 'twilio.com', 'TWLO', 'public', 'Technology', '5001-10000', 2008, 'San Francisco, CA', 'Communications platform'),
  
  -- Entertainment & Media
  ('Spotify', 'spotify.com', 'SPOT', 'public', 'Entertainment', '5001-10000', 2006, 'Stockholm, Sweden', 'Music streaming'),
  ('Roblox', 'roblox.com', 'RBLX', 'public', 'Gaming', '1001-5000', 2004, 'San Mateo, CA', 'Gaming platform'),
  ('Unity', 'unity.com', 'U', 'public', 'Gaming', '5001-10000', 2004, 'San Francisco, CA', 'Game development platform'),
  
  -- AI & Emerging Tech
  ('OpenAI', 'openai.com', NULL, 'private', 'AI/ML', '501-1000', 2015, 'San Francisco, CA', 'Artificial intelligence research'),
  ('Anthropic', 'anthropic.com', NULL, 'private', 'AI/ML', '201-500', 2021, 'San Francisco, CA', 'AI safety research'),
  ('Scale AI', 'scale.com', NULL, 'private', 'AI/ML', '501-1000', 2016, 'San Francisco, CA', 'AI training data'),
  
  -- Cybersecurity
  ('CrowdStrike', 'crowdstrike.com', 'CRWD', 'public', 'Cybersecurity', '5001-10000', 2011, 'Austin, TX', 'Cloud security'),
  ('Palo Alto Networks', 'paloaltonetworks.com', 'PANW', 'public', 'Cybersecurity', '10000+', 2005, 'Santa Clara, CA', 'Network security'),
  
  -- Consulting & Services
  ('Accenture', 'accenture.com', 'ACN', 'public', 'Consulting', '10000+', 1989, 'Dublin, Ireland', 'Technology consulting'),
  ('Deloitte', 'deloitte.com', NULL, 'private', 'Consulting', '10000+', 1845, 'London, UK', 'Professional services'),
  ('McKinsey', 'mckinsey.com', NULL, 'private', 'Consulting', '10000+', 1926, 'New York, NY', 'Management consulting'),
  
  -- Remote-First Companies
  ('GitLab', 'gitlab.com', 'GTLB', 'public', 'Technology', '1001-5000', 2011, 'San Francisco, CA', 'DevOps platform'),
  ('Automattic', 'automattic.com', NULL, 'private', 'Technology', '1001-5000', 2005, 'San Francisco, CA', 'WordPress and web publishing')

ON CONFLICT (domain) 
DO UPDATE SET 
  name = EXCLUDED.name,
  stock_symbol = EXCLUDED.stock_symbol,
  company_type = EXCLUDED.company_type,
  industry = EXCLUDED.industry,
  employee_count_range = EXCLUDED.employee_count_range,
  founded_year = EXCLUDED.founded_year,
  headquarters = EXCLUDED.headquarters,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Note: ghost_index_score is intentionally NULL
-- Scores will be calculated from user-submitted verified reports
-- This ensures all data is authentic and user-generated

-- Verify import
SELECT 
  COUNT(*) as total_companies,
  COUNT(stock_symbol) as public_companies,
  COUNT(*) - COUNT(stock_symbol) as private_companies,
  COUNT(DISTINCT industry) as industries
FROM companies;
