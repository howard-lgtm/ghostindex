import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Public company stock tickers
const stockTickers: Record<string, { ticker: string; exchange: string }> = {
  'meta.com': { ticker: 'META', exchange: 'NASDAQ' },
  'apple.com': { ticker: 'AAPL', exchange: 'NASDAQ' },
  'amazon.com': { ticker: 'AMZN', exchange: 'NASDAQ' },
  'netflix.com': { ticker: 'NFLX', exchange: 'NASDAQ' },
  'google.com': { ticker: 'GOOGL', exchange: 'NASDAQ' },
  'microsoft.com': { ticker: 'MSFT', exchange: 'NASDAQ' },
  'tesla.com': { ticker: 'TSLA', exchange: 'NASDAQ' },
  'uber.com': { ticker: 'UBER', exchange: 'NYSE' },
  'airbnb.com': { ticker: 'ABNB', exchange: 'NASDAQ' },
  'salesforce.com': { ticker: 'CRM', exchange: 'NYSE' },
  'oracle.com': { ticker: 'ORCL', exchange: 'NYSE' },
  'adobe.com': { ticker: 'ADBE', exchange: 'NASDAQ' },
  'ibm.com': { ticker: 'IBM', exchange: 'NYSE' },
  'intel.com': { ticker: 'INTC', exchange: 'NASDAQ' },
  'nvidia.com': { ticker: 'NVDA', exchange: 'NASDAQ' },
  'amd.com': { ticker: 'AMD', exchange: 'NASDAQ' },
  'qualcomm.com': { ticker: 'QCOM', exchange: 'NASDAQ' },
  'cisco.com': { ticker: 'CSCO', exchange: 'NASDAQ' },
  'dell.com': { ticker: 'DELL', exchange: 'NYSE' },
  'hp.com': { ticker: 'HPQ', exchange: 'NYSE' },
  'sap.com': { ticker: 'SAP', exchange: 'NYSE' },
  'servicenow.com': { ticker: 'NOW', exchange: 'NYSE' },
  'workday.com': { ticker: 'WDAY', exchange: 'NASDAQ' },
  'okta.com': { ticker: 'OKTA', exchange: 'NASDAQ' },
  'datadoghq.com': { ticker: 'DDOG', exchange: 'NASDAQ' },
  'crowdstrike.com': { ticker: 'CRWD', exchange: 'NASDAQ' },
  'paloaltonetworks.com': { ticker: 'PANW', exchange: 'NASDAQ' },
  'fortinet.com': { ticker: 'FTNT', exchange: 'NASDAQ' },
  'zscaler.com': { ticker: 'ZS', exchange: 'NASDAQ' },
  'sentinelone.com': { ticker: 'S', exchange: 'NYSE' },
  'cloudflare.com': { ticker: 'NET', exchange: 'NYSE' },
  'mongodb.com': { ticker: 'MDB', exchange: 'NASDAQ' },
  'atlassian.com': { ticker: 'TEAM', exchange: 'NASDAQ' },
  'gitlab.com': { ticker: 'GTLB', exchange: 'NASDAQ' },
  'twilio.com': { ticker: 'TWLO', exchange: 'NYSE' },
  'zoom.us': { ticker: 'ZM', exchange: 'NASDAQ' },
  'dropbox.com': { ticker: 'DBX', exchange: 'NASDAQ' },
  'hashicorp.com': { ticker: 'HCP', exchange: 'NASDAQ' },
  'confluent.io': { ticker: 'CFLT', exchange: 'NASDAQ' },
  'elastic.co': { ticker: 'ESTC', exchange: 'NYSE' },
  'snap.com': { ticker: 'SNAP', exchange: 'NYSE' },
  'pinterest.com': { ticker: 'PINS', exchange: 'NYSE' },
  'reddit.com': { ticker: 'RDDT', exchange: 'NYSE' },
  'spotify.com': { ticker: 'SPOT', exchange: 'NYSE' },
  'goldmansachs.com': { ticker: 'GS', exchange: 'NYSE' },
  'jpmorganchase.com': { ticker: 'JPM', exchange: 'NYSE' },
  'morganstanley.com': { ticker: 'MS', exchange: 'NYSE' },
  'blackrock.com': { ticker: 'BLK', exchange: 'NYSE' },
  'robinhood.com': { ticker: 'HOOD', exchange: 'NASDAQ' },
  'coinbase.com': { ticker: 'COIN', exchange: 'NASDAQ' },
  'paypal.com': { ticker: 'PYPL', exchange: 'NASDAQ' },
  'squareup.com': { ticker: 'SQ', exchange: 'NYSE' },
  'affirm.com': { ticker: 'AFRM', exchange: 'NASDAQ' },
  'bankofamerica.com': { ticker: 'BAC', exchange: 'NYSE' },
  'wellsfargo.com': { ticker: 'WFC', exchange: 'NYSE' },
  'citigroup.com': { ticker: 'C', exchange: 'NYSE' },
  'schwab.com': { ticker: 'SCHW', exchange: 'NYSE' },
  'shopify.com': { ticker: 'SHOP', exchange: 'NYSE' },
  'ebay.com': { ticker: 'EBAY', exchange: 'NASDAQ' },
  'walmart.com': { ticker: 'WMT', exchange: 'NYSE' },
  'target.com': { ticker: 'TGT', exchange: 'NYSE' },
  'etsy.com': { ticker: 'ETSY', exchange: 'NASDAQ' },
  'wayfair.com': { ticker: 'W', exchange: 'NYSE' },
  'chewy.com': { ticker: 'CHWY', exchange: 'NYSE' },
  'carvana.com': { ticker: 'CVNA', exchange: 'NYSE' },
  'zillow.com': { ticker: 'ZG', exchange: 'NASDAQ' },
  'redfin.com': { ticker: 'RDFN', exchange: 'NASDAQ' },
  'opendoor.com': { ticker: 'OPEN', exchange: 'NASDAQ' },
  'ea.com': { ticker: 'EA', exchange: 'NASDAQ' },
  'roblox.com': { ticker: 'RBLX', exchange: 'NYSE' },
  'unity.com': { ticker: 'U', exchange: 'NYSE' },
  'take2games.com': { ticker: 'TTWO', exchange: 'NASDAQ' },
  'lyft.com': { ticker: 'LYFT', exchange: 'NASDAQ' },
  'doordash.com': { ticker: 'DASH', exchange: 'NYSE' },
  'modernatx.com': { ticker: 'MRNA', exchange: 'NASDAQ' },
  'pfizer.com': { ticker: 'PFE', exchange: 'NYSE' },
  'jnj.com': { ticker: 'JNJ', exchange: 'NYSE' },
  'unitedhealthgroup.com': { ticker: 'UNH', exchange: 'NYSE' },
  'cvshealth.com': { ticker: 'CVS', exchange: 'NYSE' },
  'humana.com': { ticker: 'HUM', exchange: 'NYSE' },
  'hioscar.com': { ticker: 'OSCR', exchange: 'NYSE' },
  '23andme.com': { ticker: 'ME', exchange: 'NASDAQ' },
  'illumina.com': { ticker: 'ILMN', exchange: 'NASDAQ' },
  'regeneron.com': { ticker: 'REGN', exchange: 'NASDAQ' },
  'gilead.com': { ticker: 'GILD', exchange: 'NASDAQ' },
  'biogen.com': { ticker: 'BIIB', exchange: 'NASDAQ' },
  'ford.com': { ticker: 'F', exchange: 'NYSE' },
  'gm.com': { ticker: 'GM', exchange: 'NYSE' },
  'rivian.com': { ticker: 'RIVN', exchange: 'NASDAQ' },
  'lucidmotors.com': { ticker: 'LCID', exchange: 'NASDAQ' },
  'boeing.com': { ticker: 'BA', exchange: 'NYSE' },
  'lockheedmartin.com': { ticker: 'LMT', exchange: 'NYSE' },
  'northropgrumman.com': { ticker: 'NOC', exchange: 'NYSE' },
  'rtx.com': { ticker: 'RTX', exchange: 'NYSE' },
  'verizon.com': { ticker: 'VZ', exchange: 'NYSE' },
  'att.com': { ticker: 'T', exchange: 'NYSE' },
  't-mobile.com': { ticker: 'TMUS', exchange: 'NASDAQ' },
  'comcast.com': { ticker: 'CMCSA', exchange: 'NASDAQ' },
  'charter.com': { ticker: 'CHTR', exchange: 'NASDAQ' },
  'exxonmobil.com': { ticker: 'XOM', exchange: 'NYSE' },
  'chevron.com': { ticker: 'CVX', exchange: 'NYSE' },
  'coca-cola.com': { ticker: 'KO', exchange: 'NYSE' },
  'pepsico.com': { ticker: 'PEP', exchange: 'NASDAQ' },
  'starbucks.com': { ticker: 'SBUX', exchange: 'NASDAQ' },
  'mcdonalds.com': { ticker: 'MCD', exchange: 'NYSE' },
  'chipotle.com': { ticker: 'CMG', exchange: 'NYSE' },
  'coursera.org': { ticker: 'COUR', exchange: 'NYSE' },
  'duolingo.com': { ticker: 'DUOL', exchange: 'NASDAQ' },
  'chegg.com': { ticker: 'CHGG', exchange: 'NYSE' },
  'disney.com': { ticker: 'DIS', exchange: 'NYSE' },
  'warnerbros.com': { ticker: 'WBD', exchange: 'NASDAQ' },
  'paramount.com': { ticker: 'PARA', exchange: 'NASDAQ' },
  'accenture.com': { ticker: 'ACN', exchange: 'NYSE' },
  'cognizant.com': { ticker: 'CTSH', exchange: 'NASDAQ' },
  'infosys.com': { ticker: 'INFY', exchange: 'NYSE' },
  'wipro.com': { ticker: 'WIT', exchange: 'NYSE' },
  'snowflake.com': { ticker: 'SNOW', exchange: 'NYSE' },
  'palantir.com': { ticker: 'PLTR', exchange: 'NYSE' },
};

async function addStockTickers() {
  console.log('=== Adding Stock Tickers to Companies ===\n');

  // First, check if columns exist by trying to select them
  const { data: testData, error: testError } = await supabase
    .from('companies')
    .select('id, domain, stock_ticker')
    .limit(1);

  if (testError && testError.message.includes('stock_ticker')) {
    console.log('❌ stock_ticker column does not exist yet.');
    console.log('Please run this SQL in Supabase Dashboard -> SQL Editor:\n');
    console.log(`
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS stock_ticker TEXT,
ADD COLUMN IF NOT EXISTS stock_exchange TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_companies_stock_ticker ON companies(stock_ticker);
CREATE INDEX IF NOT EXISTS idx_companies_is_public ON companies(is_public);
`);
    return;
  }

  console.log('✅ Columns exist, updating stock tickers...\n');

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const [domain, { ticker, exchange }] of Object.entries(stockTickers)) {
    const { data, error } = await supabase
      .from('companies')
      .update({ 
        stock_ticker: ticker, 
        stock_exchange: exchange,
        is_public: true 
      })
      .eq('domain', domain)
      .select('name');

    if (error) {
      console.log(`❌ Error updating ${domain}: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`✅ ${data[0].name}: ${ticker} (${exchange})`);
      updated++;
    } else {
      skipped++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (not in DB): ${skipped}`);
  
  // Show results
  const { data: publicCompanies } = await supabase
    .from('companies')
    .select('name, domain, stock_ticker, stock_exchange, ghost_index_score')
    .eq('is_public', true)
    .order('name');

  console.log(`\nPublic companies with tickers: ${publicCompanies?.length || 0}`);
}

addStockTickers()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
