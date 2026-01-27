import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Public company stock tickers (US exchanges)
const publicCompanyTickers: Record<string, { ticker: string; exchange: string }> = {
  // FAANG/Big Tech
  'meta.com': { ticker: 'META', exchange: 'NASDAQ' },
  'apple.com': { ticker: 'AAPL', exchange: 'NASDAQ' },
  'amazon.com': { ticker: 'AMZN', exchange: 'NASDAQ' },
  'netflix.com': { ticker: 'NFLX', exchange: 'NASDAQ' },
  'google.com': { ticker: 'GOOGL', exchange: 'NASDAQ' },
  'microsoft.com': { ticker: 'MSFT', exchange: 'NASDAQ' },
  'tesla.com': { ticker: 'TSLA', exchange: 'NASDAQ' },
  
  // Tech
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
  
  // Social/Media
  'snap.com': { ticker: 'SNAP', exchange: 'NYSE' },
  'pinterest.com': { ticker: 'PINS', exchange: 'NYSE' },
  'reddit.com': { ticker: 'RDDT', exchange: 'NYSE' },
  'spotify.com': { ticker: 'SPOT', exchange: 'NYSE' },
  
  // Finance
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
  
  // E-commerce/Retail
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
  
  // Gaming
  'ea.com': { ticker: 'EA', exchange: 'NASDAQ' },
  'activisionblizzard.com': { ticker: 'ATVI', exchange: 'NASDAQ' },
  'roblox.com': { ticker: 'RBLX', exchange: 'NYSE' },
  'unity.com': { ticker: 'U', exchange: 'NYSE' },
  'take2games.com': { ticker: 'TTWO', exchange: 'NASDAQ' },
  
  // Transportation
  'lyft.com': { ticker: 'LYFT', exchange: 'NASDAQ' },
  'doordash.com': { ticker: 'DASH', exchange: 'NYSE' },
  
  // Healthcare/Biotech
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
  
  // Automotive
  'ford.com': { ticker: 'F', exchange: 'NYSE' },
  'gm.com': { ticker: 'GM', exchange: 'NYSE' },
  'rivian.com': { ticker: 'RIVN', exchange: 'NASDAQ' },
  'lucidmotors.com': { ticker: 'LCID', exchange: 'NASDAQ' },
  
  // Aerospace/Defense
  'boeing.com': { ticker: 'BA', exchange: 'NYSE' },
  'lockheedmartin.com': { ticker: 'LMT', exchange: 'NYSE' },
  'northropgrumman.com': { ticker: 'NOC', exchange: 'NYSE' },
  'rtx.com': { ticker: 'RTX', exchange: 'NYSE' },
  
  // Telecom
  'verizon.com': { ticker: 'VZ', exchange: 'NYSE' },
  'att.com': { ticker: 'T', exchange: 'NYSE' },
  't-mobile.com': { ticker: 'TMUS', exchange: 'NASDAQ' },
  'comcast.com': { ticker: 'CMCSA', exchange: 'NASDAQ' },
  'charter.com': { ticker: 'CHTR', exchange: 'NASDAQ' },
  
  // Energy
  'exxonmobil.com': { ticker: 'XOM', exchange: 'NYSE' },
  'chevron.com': { ticker: 'CVX', exchange: 'NYSE' },
  
  // Food/Beverage
  'coca-cola.com': { ticker: 'KO', exchange: 'NYSE' },
  'pepsico.com': { ticker: 'PEP', exchange: 'NASDAQ' },
  'starbucks.com': { ticker: 'SBUX', exchange: 'NASDAQ' },
  'mcdonalds.com': { ticker: 'MCD', exchange: 'NYSE' },
  'chipotle.com': { ticker: 'CMG', exchange: 'NYSE' },
  
  // Education
  'coursera.org': { ticker: 'COUR', exchange: 'NYSE' },
  'duolingo.com': { ticker: 'DUOL', exchange: 'NASDAQ' },
  'chegg.com': { ticker: 'CHGG', exchange: 'NYSE' },
  
  // Media/Entertainment
  'disney.com': { ticker: 'DIS', exchange: 'NYSE' },
  'warnerbros.com': { ticker: 'WBD', exchange: 'NASDAQ' },
  'paramount.com': { ticker: 'PARA', exchange: 'NASDAQ' },
  
  // Consulting (public)
  'accenture.com': { ticker: 'ACN', exchange: 'NYSE' },
  'cognizant.com': { ticker: 'CTSH', exchange: 'NASDAQ' },
  'infosys.com': { ticker: 'INFY', exchange: 'NYSE' },
  'wipro.com': { ticker: 'WIT', exchange: 'NYSE' },
  
  // Cloud
  'snowflake.com': { ticker: 'SNOW', exchange: 'NYSE' },
  'palantir.com': { ticker: 'PLTR', exchange: 'NYSE' },
};

// Fetch stock quote using Yahoo Finance (free, no API key needed)
async function fetchStockPrice(ticker: string): Promise<{ price: number; change: number; changePercent: number } | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      }
    );
    
    if (!response.ok) {
      console.log(`Failed to fetch ${ticker}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const quote = data.chart?.result?.[0]?.meta;
    
    if (!quote) return null;
    
    const price = quote.regularMarketPrice;
    const previousClose = quote.previousClose || quote.chartPreviousClose;
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    return { price, change, changePercent };
  } catch (error) {
    console.log(`Error fetching ${ticker}:`, error);
    return null;
  }
}

async function analyzeCompanies() {
  console.log('=== GhostIndex Company Analysis ===\n');
  
  // Fetch all companies from database
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, name, domain, ghost_index_score')
    .order('name');
  
  if (error) {
    console.error('Error fetching companies:', error);
    return;
  }
  
  console.log(`Total companies in database: ${companies?.length || 0}\n`);
  
  // Categorize companies
  const publicCompanies: any[] = [];
  const privateCompanies: any[] = [];
  const companiesWithScores: any[] = [];
  const companiesWithoutScores: any[] = [];
  
  for (const company of companies || []) {
    const tickerInfo = publicCompanyTickers[company.domain];
    
    if (tickerInfo) {
      publicCompanies.push({ ...company, ...tickerInfo });
    } else {
      privateCompanies.push(company);
    }
    
    if (company.ghost_index_score !== null) {
      companiesWithScores.push(company);
    } else {
      companiesWithoutScores.push(company);
    }
  }
  
  console.log('=== SUMMARY ===');
  console.log(`Public companies: ${publicCompanies.length}`);
  console.log(`Private companies: ${privateCompanies.length}`);
  console.log(`Companies with ghost scores: ${companiesWithScores.length}`);
  console.log(`Companies without ghost scores: ${companiesWithoutScores.length}`);
  
  console.log('\n=== PUBLIC COMPANIES WITH STOCK DATA ===\n');
  console.log('Fetching live stock prices...\n');
  
  const results: any[] = [];
  
  for (const company of publicCompanies.slice(0, 50)) { // Limit to 50 to avoid rate limits
    const stockData = await fetchStockPrice(company.ticker);
    
    const result = {
      name: company.name,
      domain: company.domain,
      ticker: company.ticker,
      exchange: company.exchange,
      ghostScore: company.ghost_index_score,
      stockPrice: stockData?.price?.toFixed(2) || 'N/A',
      dayChange: stockData ? `${stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)} (${stockData.changePercent >= 0 ? '+' : ''}${stockData.changePercent.toFixed(2)}%)` : 'N/A'
    };
    
    results.push(result);
    
    console.log(`${company.name} (${company.ticker})`);
    console.log(`  Ghost Score: ${company.ghost_index_score ?? 'No data'}`);
    console.log(`  Stock: $${result.stockPrice} ${result.dayChange}`);
    console.log('');
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('\n=== COMPANIES NEEDING GHOST SCORES ===\n');
  console.log(`${companiesWithoutScores.length} companies have no ghost score data.\n`);
  
  // Show top 20 without scores
  console.log('Top 20 public companies without scores:');
  const publicWithoutScores = companiesWithoutScores.filter(c => publicCompanyTickers[c.domain]);
  publicWithoutScores.slice(0, 20).forEach(c => {
    const ticker = publicCompanyTickers[c.domain];
    console.log(`  - ${c.name} (${ticker?.ticker || 'N/A'})`);
  });
  
  return { publicCompanies, privateCompanies, companiesWithScores, companiesWithoutScores, results };
}

analyzeCompanies()
  .then(() => {
    console.log('\n=== Analysis Complete ===');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
