# Database Population Strategy for Launch

## Current Situation
- Sample data with 14 companies (testing only)
- Ghost Index Scores are static placeholders
- Company metadata manually entered
- Need real, verified data for production launch

## Launch Data Requirements

### Minimum Viable Dataset
- **50-100 major tech companies** with basic metadata
- **Stock symbols** for all public companies
- **Company type, industry, size** for filtering
- **No Ghost Index Scores initially** (will populate from user reports)

### Data Sources

#### 1. Company Metadata (Automated)
**Clearbit Company API** (Recommended)
- Free tier: 100 requests/month
- Paid: $99/month for 1000 requests
- Returns: name, domain, logo, industry, employee count, location
- API: `https://company.clearbit.com/v2/companies/find?domain=apple.com`

**Alternative: Manual CSV Import**
- Compile list of top tech companies
- Use public data sources (Crunchbase, LinkedIn, Wikipedia)
- Import via SQL script

#### 2. Stock Symbols
**Free APIs:**
- Alpha Vantage (free tier: 25 requests/day)
- Financial Modeling Prep (free tier: 250 requests/day)
- Yahoo Finance (unofficial, no API key needed)

**Manual Approach:**
- Compile from public sources
- S&P 500 tech companies list
- NASDAQ-100 companies

#### 3. Ghost Index Scores
**User-Generated Only**
- Launch with NULL scores
- Display "No Data Yet" in search
- Scores populate as users submit verified reports
- Incentivize early adopters to submit reports

## Implementation Options

### Option A: Automated Data Pipeline (Recommended)
**Pros:**
- Scalable
- Up-to-date data
- Less manual work

**Cons:**
- Requires API keys
- Costs money
- Takes time to build

**Steps:**
1. Create data ingestion script
2. Fetch company data from Clearbit/similar
3. Fetch stock symbols from financial API
4. Populate database via Supabase API
5. Schedule weekly updates

### Option B: Manual CSV Import (Quick Launch)
**Pros:**
- No API costs
- Can launch immediately
- Full control over data

**Cons:**
- Manual work required
- Data becomes stale
- Not scalable

**Steps:**
1. Compile CSV of top 100 companies
2. Add metadata manually
3. Import via SQL script
4. Update periodically

### Option C: Hybrid Approach (Best for Launch)
**Pros:**
- Quick initial launch
- Automated updates later
- Cost-effective

**Cons:**
- Two-phase implementation

**Steps:**
1. **Phase 1 (Launch)**: Manual import of top 50-100 companies
2. **Phase 2 (Post-Launch)**: Build automated pipeline
3. **Ongoing**: User reports generate new companies

## Recommended Launch Strategy

### Week 1: Pre-Launch Data Prep
1. **Compile Top 100 Tech Companies**
   - FAANG + major tech
   - Top startups (unicorns)
   - Major consulting firms
   - Popular remote companies

2. **Gather Metadata**
   - Company name, domain
   - Stock symbol (if public)
   - Company type (public/private)
   - Industry category
   - Employee count range
   - Headquarters location

3. **Create Import Script**
   - CSV → SQL conversion
   - Validation checks
   - Bulk insert

### Week 2: Launch
1. **Import Initial Dataset**
   - Run import script
   - Verify data quality
   - Set all ghost_index_score to NULL

2. **Launch Campaign**
   - Encourage users to submit reports
   - Highlight "Be the first to report" companies
   - Offer incentives for early verified reports

3. **Monitor Growth**
   - Track report submissions
   - Watch score calculations
   - Add companies as requested

### Post-Launch: Continuous Growth
1. **User-Driven Expansion**
   - Users submit reports for new companies
   - Companies auto-created on first report
   - Metadata can be enriched later

2. **Automated Enrichment**
   - Build Clearbit integration
   - Auto-fetch logos, metadata
   - Keep data fresh

3. **Community Contributions**
   - Allow users to suggest metadata updates
   - Crowdsource company information
   - Verify through multiple sources

## Data Schema for Import

### CSV Format
```csv
name,domain,stock_symbol,company_type,industry,employee_count_range,founded_year,headquarters,description
Apple,apple.com,AAPL,public,Technology,10000+,1976,"Cupertino, CA",Consumer electronics and software
Google,google.com,GOOGL,public,Technology,10000+,1998,"Mountain View, CA",Search engine and cloud services
```

### SQL Import Template
```sql
COPY companies (name, domain, stock_symbol, company_type, industry, employee_count_range, founded_year, headquarters, description)
FROM '/path/to/companies.csv'
DELIMITER ','
CSV HEADER;
```

## Data Quality Standards

### Required Fields
- ✅ name
- ✅ domain (unique)

### Optional but Recommended
- stock_symbol (for public companies)
- company_type
- industry
- employee_count_range

### Auto-Generated
- logo (via Clearbit API)
- ghost_index_score (from verified reports)
- created_at, updated_at (timestamps)

## Launch Checklist

- [ ] Compile list of 50-100 target companies
- [ ] Gather metadata for each company
- [ ] Create CSV import file
- [ ] Write SQL import script
- [ ] Test import on staging database
- [ ] Validate data quality
- [ ] Run import on production
- [ ] Verify search results display correctly
- [ ] Set up monitoring for new company submissions
- [ ] Plan automated enrichment pipeline

## Budget Considerations

### Free Approach
- Manual data compilation
- Public data sources
- User-generated content
- **Cost: $0/month**

### Paid Approach
- Clearbit Company API: $99/month
- Financial data API: $0-50/month
- Automated enrichment
- **Cost: ~$150/month**

### Recommended: Start Free, Scale Paid
- Launch with manual data
- Add automation as revenue grows
- User reports are always free

## Next Steps

1. **Immediate**: Create CSV template
2. **This Week**: Compile top 50 companies
3. **Before Launch**: Import initial dataset
4. **Post-Launch**: Monitor and expand
5. **Month 2**: Build automation pipeline

## Success Metrics

- **Launch**: 50-100 companies with metadata
- **Week 1**: 10+ companies with verified reports
- **Month 1**: 25+ companies with Ghost Index Scores
- **Month 3**: 100+ companies with scores
- **Month 6**: 500+ companies in database
