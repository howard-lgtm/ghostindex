-- Add company metadata fields for richer search results
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS stock_symbol TEXT,
ADD COLUMN IF NOT EXISTS company_type TEXT CHECK (company_type IN ('public', 'private', 'startup', 'nonprofit')),
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS employee_count_range TEXT CHECK (employee_count_range IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+')),
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS headquarters TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Create index for stock symbol lookups
CREATE INDEX IF NOT EXISTS idx_companies_stock_symbol ON companies(stock_symbol) WHERE stock_symbol IS NOT NULL;

-- Create index for company type filtering
CREATE INDEX IF NOT EXISTS idx_companies_type ON companies(company_type) WHERE company_type IS NOT NULL;

-- Create index for industry filtering
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry) WHERE industry IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN companies.stock_symbol IS 'Stock ticker symbol for public companies (e.g., AAPL, GOOGL)';
COMMENT ON COLUMN companies.company_type IS 'Company classification: public, private, startup, or nonprofit';
COMMENT ON COLUMN companies.industry IS 'Primary industry/sector (e.g., Technology, Finance, Healthcare)';
COMMENT ON COLUMN companies.employee_count_range IS 'Approximate employee count range';
COMMENT ON COLUMN companies.founded_year IS 'Year the company was founded';
COMMENT ON COLUMN companies.headquarters IS 'Primary headquarters location (e.g., Cupertino, CA)';
COMMENT ON COLUMN companies.description IS 'Brief company description';
