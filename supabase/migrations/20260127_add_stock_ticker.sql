-- Add stock ticker fields to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS stock_ticker TEXT,
ADD COLUMN IF NOT EXISTS stock_exchange TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Create index for stock ticker lookups
CREATE INDEX IF NOT EXISTS idx_companies_stock_ticker ON companies(stock_ticker);
CREATE INDEX IF NOT EXISTS idx_companies_is_public ON companies(is_public);

-- Update public companies with their stock tickers
UPDATE companies SET stock_ticker = 'META', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'meta.com';
UPDATE companies SET stock_ticker = 'AAPL', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'apple.com';
UPDATE companies SET stock_ticker = 'AMZN', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'amazon.com';
UPDATE companies SET stock_ticker = 'NFLX', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'netflix.com';
UPDATE companies SET stock_ticker = 'GOOGL', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'google.com';
UPDATE companies SET stock_ticker = 'MSFT', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'microsoft.com';
UPDATE companies SET stock_ticker = 'TSLA', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'tesla.com';
UPDATE companies SET stock_ticker = 'UBER', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'uber.com';
UPDATE companies SET stock_ticker = 'ABNB', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'airbnb.com';
UPDATE companies SET stock_ticker = 'CRM', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'salesforce.com';
UPDATE companies SET stock_ticker = 'ORCL', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'oracle.com';
UPDATE companies SET stock_ticker = 'ADBE', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'adobe.com';
UPDATE companies SET stock_ticker = 'IBM', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'ibm.com';
UPDATE companies SET stock_ticker = 'INTC', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'intel.com';
UPDATE companies SET stock_ticker = 'NVDA', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'nvidia.com';
UPDATE companies SET stock_ticker = 'AMD', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'amd.com';
UPDATE companies SET stock_ticker = 'QCOM', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'qualcomm.com';
UPDATE companies SET stock_ticker = 'CSCO', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'cisco.com';
UPDATE companies SET stock_ticker = 'DELL', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'dell.com';
UPDATE companies SET stock_ticker = 'HPQ', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'hp.com';
UPDATE companies SET stock_ticker = 'SAP', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'sap.com';
UPDATE companies SET stock_ticker = 'NOW', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'servicenow.com';
UPDATE companies SET stock_ticker = 'WDAY', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'workday.com';
UPDATE companies SET stock_ticker = 'OKTA', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'okta.com';
UPDATE companies SET stock_ticker = 'DDOG', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'datadoghq.com';
UPDATE companies SET stock_ticker = 'CRWD', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'crowdstrike.com';
UPDATE companies SET stock_ticker = 'PANW', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'paloaltonetworks.com';
UPDATE companies SET stock_ticker = 'FTNT', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'fortinet.com';
UPDATE companies SET stock_ticker = 'ZS', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'zscaler.com';
UPDATE companies SET stock_ticker = 'S', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'sentinelone.com';
UPDATE companies SET stock_ticker = 'NET', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'cloudflare.com';
UPDATE companies SET stock_ticker = 'MDB', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'mongodb.com';
UPDATE companies SET stock_ticker = 'TEAM', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'atlassian.com';
UPDATE companies SET stock_ticker = 'GTLB', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'gitlab.com';
UPDATE companies SET stock_ticker = 'TWLO', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'twilio.com';
UPDATE companies SET stock_ticker = 'ZM', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'zoom.us';
UPDATE companies SET stock_ticker = 'DBX', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'dropbox.com';
UPDATE companies SET stock_ticker = 'HCP', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'hashicorp.com';
UPDATE companies SET stock_ticker = 'CFLT', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'confluent.io';
UPDATE companies SET stock_ticker = 'ESTC', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'elastic.co';
UPDATE companies SET stock_ticker = 'SNAP', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'snap.com';
UPDATE companies SET stock_ticker = 'PINS', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'pinterest.com';
UPDATE companies SET stock_ticker = 'RDDT', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'reddit.com';
UPDATE companies SET stock_ticker = 'SPOT', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'spotify.com';
UPDATE companies SET stock_ticker = 'GS', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'goldmansachs.com';
UPDATE companies SET stock_ticker = 'JPM', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'jpmorganchase.com';
UPDATE companies SET stock_ticker = 'MS', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'morganstanley.com';
UPDATE companies SET stock_ticker = 'BLK', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'blackrock.com';
UPDATE companies SET stock_ticker = 'HOOD', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'robinhood.com';
UPDATE companies SET stock_ticker = 'COIN', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'coinbase.com';
UPDATE companies SET stock_ticker = 'PYPL', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'paypal.com';
UPDATE companies SET stock_ticker = 'SQ', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'squareup.com';
UPDATE companies SET stock_ticker = 'AFRM', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'affirm.com';
UPDATE companies SET stock_ticker = 'BAC', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'bankofamerica.com';
UPDATE companies SET stock_ticker = 'WFC', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'wellsfargo.com';
UPDATE companies SET stock_ticker = 'C', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'citigroup.com';
UPDATE companies SET stock_ticker = 'SCHW', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'schwab.com';
UPDATE companies SET stock_ticker = 'SHOP', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'shopify.com';
UPDATE companies SET stock_ticker = 'EBAY', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'ebay.com';
UPDATE companies SET stock_ticker = 'WMT', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'walmart.com';
UPDATE companies SET stock_ticker = 'TGT', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'target.com';
UPDATE companies SET stock_ticker = 'ETSY', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'etsy.com';
UPDATE companies SET stock_ticker = 'W', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'wayfair.com';
UPDATE companies SET stock_ticker = 'CHWY', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'chewy.com';
UPDATE companies SET stock_ticker = 'CVNA', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'carvana.com';
UPDATE companies SET stock_ticker = 'ZG', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'zillow.com';
UPDATE companies SET stock_ticker = 'RDFN', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'redfin.com';
UPDATE companies SET stock_ticker = 'OPEN', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'opendoor.com';
UPDATE companies SET stock_ticker = 'EA', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'ea.com';
UPDATE companies SET stock_ticker = 'RBLX', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'roblox.com';
UPDATE companies SET stock_ticker = 'U', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'unity.com';
UPDATE companies SET stock_ticker = 'TTWO', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'take2games.com';
UPDATE companies SET stock_ticker = 'LYFT', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'lyft.com';
UPDATE companies SET stock_ticker = 'DASH', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'doordash.com';
UPDATE companies SET stock_ticker = 'MRNA', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'modernatx.com';
UPDATE companies SET stock_ticker = 'PFE', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'pfizer.com';
UPDATE companies SET stock_ticker = 'JNJ', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'jnj.com';
UPDATE companies SET stock_ticker = 'UNH', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'unitedhealthgroup.com';
UPDATE companies SET stock_ticker = 'CVS', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'cvshealth.com';
UPDATE companies SET stock_ticker = 'HUM', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'humana.com';
UPDATE companies SET stock_ticker = 'OSCR', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'hioscar.com';
UPDATE companies SET stock_ticker = 'ME', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = '23andme.com';
UPDATE companies SET stock_ticker = 'ILMN', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'illumina.com';
UPDATE companies SET stock_ticker = 'REGN', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'regeneron.com';
UPDATE companies SET stock_ticker = 'GILD', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'gilead.com';
UPDATE companies SET stock_ticker = 'BIIB', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'biogen.com';
UPDATE companies SET stock_ticker = 'F', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'ford.com';
UPDATE companies SET stock_ticker = 'GM', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'gm.com';
UPDATE companies SET stock_ticker = 'RIVN', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'rivian.com';
UPDATE companies SET stock_ticker = 'LCID', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'lucidmotors.com';
UPDATE companies SET stock_ticker = 'BA', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'boeing.com';
UPDATE companies SET stock_ticker = 'LMT', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'lockheedmartin.com';
UPDATE companies SET stock_ticker = 'NOC', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'northropgrumman.com';
UPDATE companies SET stock_ticker = 'RTX', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'rtx.com';
UPDATE companies SET stock_ticker = 'VZ', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'verizon.com';
UPDATE companies SET stock_ticker = 'T', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'att.com';
UPDATE companies SET stock_ticker = 'TMUS', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 't-mobile.com';
UPDATE companies SET stock_ticker = 'CMCSA', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'comcast.com';
UPDATE companies SET stock_ticker = 'CHTR', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'charter.com';
UPDATE companies SET stock_ticker = 'XOM', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'exxonmobil.com';
UPDATE companies SET stock_ticker = 'CVX', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'chevron.com';
UPDATE companies SET stock_ticker = 'KO', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'coca-cola.com';
UPDATE companies SET stock_ticker = 'PEP', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'pepsico.com';
UPDATE companies SET stock_ticker = 'SBUX', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'starbucks.com';
UPDATE companies SET stock_ticker = 'MCD', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'mcdonalds.com';
UPDATE companies SET stock_ticker = 'CMG', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'chipotle.com';
UPDATE companies SET stock_ticker = 'COUR', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'coursera.org';
UPDATE companies SET stock_ticker = 'DUOL', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'duolingo.com';
UPDATE companies SET stock_ticker = 'CHGG', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'chegg.com';
UPDATE companies SET stock_ticker = 'DIS', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'disney.com';
UPDATE companies SET stock_ticker = 'WBD', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'warnerbros.com';
UPDATE companies SET stock_ticker = 'PARA', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'paramount.com';
UPDATE companies SET stock_ticker = 'ACN', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'accenture.com';
UPDATE companies SET stock_ticker = 'CTSH', stock_exchange = 'NASDAQ', is_public = TRUE WHERE domain = 'cognizant.com';
UPDATE companies SET stock_ticker = 'INFY', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'infosys.com';
UPDATE companies SET stock_ticker = 'WIT', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'wipro.com';
UPDATE companies SET stock_ticker = 'SNOW', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'snowflake.com';
UPDATE companies SET stock_ticker = 'PLTR', stock_exchange = 'NYSE', is_public = TRUE WHERE domain = 'palantir.com';

-- Set is_public = FALSE for known private companies
UPDATE companies SET is_public = FALSE WHERE domain IN (
  'stripe.com', 'openai.com', 'anthropic.com', 'spacex.com', 'databricks.com',
  'figma.com', 'notion.so', 'canva.com', 'discord.com', 'epicgames.com',
  'riotgames.com', 'instacart.com', 'plaid.com', 'brex.com', 'ramp.com',
  'mercury.com', 'chime.com', 'klarna.com', 'citadel.com', 'twosigma.com',
  'janestreet.com', 'hudsonrivertrading.com', 'mckinsey.com', 'bcg.com',
  'bain.com', 'deloitte.com', 'pwc.com', 'ey.com', 'kpmg.com', 'valvesoftware.com',
  'bungie.net', 'blueorigin.com', 'waymo.com', 'getcruise.com', 'vercel.com',
  'supabase.com', 'planetscale.com', 'netlify.com', 'railway.app', 'render.com',
  'fly.io', 'airtable.com', 'miro.com', 'linear.app', 'retool.com', 'webflow.com',
  'framer.com', 'github.com', 'linkedin.com', 'twitter.com', 'tiktok.com',
  'slack.com', 'udemy.com', 'khanacademy.org', 'soundcloud.com', 'twitch.tv',
  'youtube.com', 'hulu.com', 'fidelity.com', 'vanguard.com', 'capgemini.com', 'tcs.com'
);
