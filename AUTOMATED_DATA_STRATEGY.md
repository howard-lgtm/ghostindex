# Automated Company Data Update Strategy

## Current Situation
- Company metadata (stock symbols, type, industry, size) is static
- Ghost Index Scores auto-calculate from user reports (already implemented)
- Company logos auto-fetch from Clearbit (already implemented)
- Need automated updates for company metadata

## Data That Needs Updates

### 1. Ghost Index Scores ✅ AUTOMATED
- **Status**: Already automated via triggers
- **Update Method**: Recalculates automatically when reports are verified
- **Frequency**: Real-time (on report verification)

### 2. Company Logos ✅ AUTOMATED
- **Status**: Already automated via Clearbit API
- **Update Method**: Fetches on-demand from Clearbit/Google
- **Frequency**: Real-time (on page load)

### 3. Company Metadata ❌ MANUAL
- **Fields**: stock_symbol, company_type, industry, employee_count_range, headquarters
- **Status**: Currently static, needs automation
- **Update Method**: Needs implementation

## Automated Update Solutions

### Option 1: Clearbit Enrichment API (Recommended)
**Best for**: Comprehensive, accurate data

**Implementation**:
```typescript
// /lib/services/company-enrichment.ts
import { createClient } from '@/lib/supabase/server';

export async function enrichCompanyData(domain: string) {
  const response = await fetch(
    `https://company.clearbit.com/v2/companies/find?domain=${domain}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.CLEARBIT_API_KEY}`
      }
    }
  );
  
  const data = await response.json();
  
  return {
    name: data.name,
    domain: data.domain,
    industry: data.category?.industry,
    employee_count_range: getEmployeeRange(data.metrics?.employees),
    headquarters: `${data.geo?.city}, ${data.geo?.state}`,
    description: data.description,
    founded_year: data.foundedYear
  };
}
```

**Pricing**:
- Free tier: 100 requests/month
- Paid: $99/month for 1,000 requests
- $299/month for 5,000 requests

**Pros**:
- High-quality, verified data
- Includes employee count, industry, location
- Auto-updates when company data changes

**Cons**:
- Costs money
- Rate limits

### Option 2: GitHub Actions Cron Job (Free)
**Best for**: Periodic batch updates

**Implementation**:
```yaml
# .github/workflows/update-company-data.yml
name: Update Company Data
on:
  schedule:
    - cron: '0 2 * * 0' # Weekly on Sunday at 2 AM
  workflow_dispatch: # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run update:company-data
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          CLEARBIT_API_KEY: ${{ secrets.CLEARBIT_API_KEY }}
```

**Script**:
```typescript
// scripts/update-company-data.ts
import { createClient } from '@supabase/supabase-js';

async function updateCompanyData() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Get all companies
  const { data: companies } = await supabase
    .from('companies')
    .select('id, domain')
    .order('updated_at', { ascending: true })
    .limit(50); // Update 50 per run

  for (const company of companies || []) {
    try {
      const enrichedData = await enrichCompanyData(company.domain);
      
      await supabase
        .from('companies')
        .update(enrichedData)
        .eq('id', company.id);
      
      console.log(`Updated: ${company.domain}`);
      
      // Rate limit: 1 request per second
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to update ${company.domain}:`, error);
    }
  }
}

updateCompanyData();
```

**Pros**:
- Free (GitHub Actions)
- Automated on schedule
- Can use free Clearbit tier (100/month)

**Cons**:
- Not real-time
- Weekly updates only

### Option 3: On-Demand Enrichment (Hybrid)
**Best for**: Cost-effective, user-driven updates

**Implementation**:
```typescript
// app/api/enrich-company/route.ts
export async function POST(request: Request) {
  const { companyId } = await request.json();
  
  const supabase = await createClient();
  
  // Get company domain
  const { data: company } = await supabase
    .from('companies')
    .select('domain')
    .eq('id', companyId)
    .single();
  
  // Enrich data
  const enrichedData = await enrichCompanyData(company.domain);
  
  // Update database
  await supabase
    .from('companies')
    .update(enrichedData)
    .eq('id', companyId);
  
  return Response.json({ success: true });
}
```

**Trigger**:
- When user views company detail page
- When user submits first report for company
- Manual "Refresh Data" button

**Pros**:
- Cost-effective (only enriches when needed)
- Real-time updates when triggered
- User-driven

**Cons**:
- Not proactive
- Requires user action

## Recommended Implementation Strategy

### Phase 1: Immediate (This Week)
1. **Run database migrations** for Ghost Index Score calculation
2. **Import initial dataset** of 50 companies with manual data
3. **Deploy current system** with static metadata

### Phase 2: Short-term (Next 2 Weeks)
1. **Implement GitHub Actions cron job**
   - Weekly updates for existing companies
   - Use free Clearbit tier (100 requests/month)
   - Update oldest 50 companies per week

2. **Add on-demand enrichment**
   - Trigger when new company is created from report
   - Enrich metadata immediately

### Phase 3: Long-term (Month 2+)
1. **Upgrade to paid Clearbit** if needed
2. **Increase update frequency** to daily
3. **Add real-time enrichment** for all new companies
4. **Implement data quality monitoring**

## Implementation Priority

### High Priority (Do Now)
- ✅ Ghost Index Score auto-calculation (DONE)
- ✅ Company logo auto-fetching (DONE)
- ⏳ Run database migrations
- ⏳ Import initial company dataset

### Medium Priority (Next Week)
- GitHub Actions cron job for weekly updates
- On-demand enrichment for new companies
- Stock symbol updates from financial API

### Low Priority (Future)
- Real-time enrichment for all companies
- Data quality monitoring
- Automated data validation

## Cost Analysis

### Free Approach
- GitHub Actions: Free
- Clearbit free tier: 100 requests/month
- Manual initial data: Free
- **Total: $0/month**
- **Limitation**: 100 companies updated per month

### Paid Approach
- GitHub Actions: Free
- Clearbit: $99/month (1,000 requests)
- **Total: $99/month**
- **Benefit**: 1,000 companies updated per month

### Recommended: Start Free, Scale Paid
- Launch with free tier
- Monitor usage and growth
- Upgrade when hitting limits
- Add revenue before adding costs

## Next Steps

1. **Immediate**: Run database migrations
2. **Today**: Import 50-company dataset
3. **This Week**: Implement GitHub Actions cron job
4. **Next Week**: Add on-demand enrichment
5. **Monitor**: Track data quality and update frequency

## Success Metrics

- **Week 1**: 50 companies with complete metadata
- **Week 2**: Automated weekly updates running
- **Month 1**: 100+ companies with fresh data
- **Month 3**: Real-time enrichment for new companies
- **Month 6**: 500+ companies with automated updates
