import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const topCompanies = [
  // FAANG
  { name: 'Meta', domain: 'meta.com', logo: 'https://logo.clearbit.com/meta.com' },
  { name: 'Apple', domain: 'apple.com', logo: 'https://logo.clearbit.com/apple.com' },
  { name: 'Amazon', domain: 'amazon.com', logo: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Netflix', domain: 'netflix.com', logo: 'https://logo.clearbit.com/netflix.com' },
  { name: 'Google', domain: 'google.com', logo: 'https://logo.clearbit.com/google.com' },
  
  // Big Tech
  { name: 'Microsoft', domain: 'microsoft.com', logo: 'https://logo.clearbit.com/microsoft.com' },
  { name: 'Tesla', domain: 'tesla.com', logo: 'https://logo.clearbit.com/tesla.com' },
  { name: 'Uber', domain: 'uber.com', logo: 'https://logo.clearbit.com/uber.com' },
  { name: 'Airbnb', domain: 'airbnb.com', logo: 'https://logo.clearbit.com/airbnb.com' },
  { name: 'Stripe', domain: 'stripe.com', logo: 'https://logo.clearbit.com/stripe.com' },
  { name: 'Salesforce', domain: 'salesforce.com', logo: 'https://logo.clearbit.com/salesforce.com' },
  { name: 'Oracle', domain: 'oracle.com', logo: 'https://logo.clearbit.com/oracle.com' },
  { name: 'Adobe', domain: 'adobe.com', logo: 'https://logo.clearbit.com/adobe.com' },
  { name: 'IBM', domain: 'ibm.com', logo: 'https://logo.clearbit.com/ibm.com' },
  { name: 'Intel', domain: 'intel.com', logo: 'https://logo.clearbit.com/intel.com' },
  { name: 'NVIDIA', domain: 'nvidia.com', logo: 'https://logo.clearbit.com/nvidia.com' },
  { name: 'AMD', domain: 'amd.com', logo: 'https://logo.clearbit.com/amd.com' },
  { name: 'Qualcomm', domain: 'qualcomm.com', logo: 'https://logo.clearbit.com/qualcomm.com' },
  
  // Startups/Unicorns
  { name: 'OpenAI', domain: 'openai.com', logo: 'https://logo.clearbit.com/openai.com' },
  { name: 'Anthropic', domain: 'anthropic.com', logo: 'https://logo.clearbit.com/anthropic.com' },
  { name: 'SpaceX', domain: 'spacex.com', logo: 'https://logo.clearbit.com/spacex.com' },
  { name: 'Coinbase', domain: 'coinbase.com', logo: 'https://logo.clearbit.com/coinbase.com' },
  { name: 'Databricks', domain: 'databricks.com', logo: 'https://logo.clearbit.com/databricks.com' },
  { name: 'Snowflake', domain: 'snowflake.com', logo: 'https://logo.clearbit.com/snowflake.com' },
  { name: 'Palantir', domain: 'palantir.com', logo: 'https://logo.clearbit.com/palantir.com' },
  { name: 'Figma', domain: 'figma.com', logo: 'https://logo.clearbit.com/figma.com' },
  { name: 'Notion', domain: 'notion.so', logo: 'https://logo.clearbit.com/notion.so' },
  { name: 'Canva', domain: 'canva.com', logo: 'https://logo.clearbit.com/canva.com' },
  { name: 'Discord', domain: 'discord.com', logo: 'https://logo.clearbit.com/discord.com' },
  { name: 'Roblox', domain: 'roblox.com', logo: 'https://logo.clearbit.com/roblox.com' },
  
  // Social/Media
  { name: 'Twitter', domain: 'twitter.com', logo: 'https://logo.clearbit.com/twitter.com' },
  { name: 'LinkedIn', domain: 'linkedin.com', logo: 'https://logo.clearbit.com/linkedin.com' },
  { name: 'Snap', domain: 'snap.com', logo: 'https://logo.clearbit.com/snap.com' },
  { name: 'Pinterest', domain: 'pinterest.com', logo: 'https://logo.clearbit.com/pinterest.com' },
  { name: 'Reddit', domain: 'reddit.com', logo: 'https://logo.clearbit.com/reddit.com' },
  { name: 'TikTok', domain: 'tiktok.com', logo: 'https://logo.clearbit.com/tiktok.com' },
  
  // Finance
  { name: 'Goldman Sachs', domain: 'goldmansachs.com', logo: 'https://logo.clearbit.com/goldmansachs.com' },
  { name: 'JPMorgan Chase', domain: 'jpmorganchase.com', logo: 'https://logo.clearbit.com/jpmorganchase.com' },
  { name: 'Morgan Stanley', domain: 'morganstanley.com', logo: 'https://logo.clearbit.com/morganstanley.com' },
  { name: 'Citadel', domain: 'citadel.com', logo: 'https://logo.clearbit.com/citadel.com' },
  { name: 'BlackRock', domain: 'blackrock.com', logo: 'https://logo.clearbit.com/blackrock.com' },
  { name: 'Robinhood', domain: 'robinhood.com', logo: 'https://logo.clearbit.com/robinhood.com' },
  
  // Consulting
  { name: 'McKinsey & Company', domain: 'mckinsey.com', logo: 'https://logo.clearbit.com/mckinsey.com' },
  { name: 'Boston Consulting Group', domain: 'bcg.com', logo: 'https://logo.clearbit.com/bcg.com' },
  { name: 'Bain & Company', domain: 'bain.com', logo: 'https://logo.clearbit.com/bain.com' },
  { name: 'Deloitte', domain: 'deloitte.com', logo: 'https://logo.clearbit.com/deloitte.com' },
  { name: 'Accenture', domain: 'accenture.com', logo: 'https://logo.clearbit.com/accenture.com' },
  
  // E-commerce/Retail
  { name: 'Shopify', domain: 'shopify.com', logo: 'https://logo.clearbit.com/shopify.com' },
  { name: 'eBay', domain: 'ebay.com', logo: 'https://logo.clearbit.com/ebay.com' },
  { name: 'Walmart', domain: 'walmart.com', logo: 'https://logo.clearbit.com/walmart.com' },
  { name: 'Target', domain: 'target.com', logo: 'https://logo.clearbit.com/target.com' },
  
  // Cloud/Infrastructure
  { name: 'Cloudflare', domain: 'cloudflare.com', logo: 'https://logo.clearbit.com/cloudflare.com' },
  { name: 'MongoDB', domain: 'mongodb.com', logo: 'https://logo.clearbit.com/mongodb.com' },
  { name: 'Atlassian', domain: 'atlassian.com', logo: 'https://logo.clearbit.com/atlassian.com' },
  { name: 'GitLab', domain: 'gitlab.com', logo: 'https://logo.clearbit.com/gitlab.com' },
  { name: 'GitHub', domain: 'github.com', logo: 'https://logo.clearbit.com/github.com' },
  { name: 'Vercel', domain: 'vercel.com', logo: 'https://logo.clearbit.com/vercel.com' },
  
  // Gaming
  { name: 'Electronic Arts', domain: 'ea.com', logo: 'https://logo.clearbit.com/ea.com' },
  { name: 'Activision Blizzard', domain: 'activisionblizzard.com', logo: 'https://logo.clearbit.com/activisionblizzard.com' },
  { name: 'Epic Games', domain: 'epicgames.com', logo: 'https://logo.clearbit.com/epicgames.com' },
  { name: 'Riot Games', domain: 'riotgames.com', logo: 'https://logo.clearbit.com/riotgames.com' },
  
  // Transportation
  { name: 'Lyft', domain: 'lyft.com', logo: 'https://logo.clearbit.com/lyft.com' },
  { name: 'DoorDash', domain: 'doordash.com', logo: 'https://logo.clearbit.com/doordash.com' },
  { name: 'Instacart', domain: 'instacart.com', logo: 'https://logo.clearbit.com/instacart.com' },
  
  // Healthcare/Biotech
  { name: 'Moderna', domain: 'modernatx.com', logo: 'https://logo.clearbit.com/modernatx.com' },
  { name: 'Pfizer', domain: 'pfizer.com', logo: 'https://logo.clearbit.com/pfizer.com' },
  { name: 'Johnson & Johnson', domain: 'jnj.com', logo: 'https://logo.clearbit.com/jnj.com' },
  
  // Other Notable
  { name: 'Zoom', domain: 'zoom.us', logo: 'https://logo.clearbit.com/zoom.us' },
  { name: 'Slack', domain: 'slack.com', logo: 'https://logo.clearbit.com/slack.com' },
  { name: 'Dropbox', domain: 'dropbox.com', logo: 'https://logo.clearbit.com/dropbox.com' },
  { name: 'Twilio', domain: 'twilio.com', logo: 'https://logo.clearbit.com/twilio.com' },
  { name: 'Square', domain: 'squareup.com', logo: 'https://logo.clearbit.com/squareup.com' },
  { name: 'PayPal', domain: 'paypal.com', logo: 'https://logo.clearbit.com/paypal.com' },
  
  // More Tech Companies
  { name: 'Cisco', domain: 'cisco.com', logo: 'https://logo.clearbit.com/cisco.com' },
  { name: 'Dell', domain: 'dell.com', logo: 'https://logo.clearbit.com/dell.com' },
  { name: 'HP', domain: 'hp.com', logo: 'https://logo.clearbit.com/hp.com' },
  { name: 'SAP', domain: 'sap.com', logo: 'https://logo.clearbit.com/sap.com' },
  { name: 'VMware', domain: 'vmware.com', logo: 'https://logo.clearbit.com/vmware.com' },
  { name: 'ServiceNow', domain: 'servicenow.com', logo: 'https://logo.clearbit.com/servicenow.com' },
  { name: 'Workday', domain: 'workday.com', logo: 'https://logo.clearbit.com/workday.com' },
  { name: 'Splunk', domain: 'splunk.com', logo: 'https://logo.clearbit.com/splunk.com' },
  { name: 'Okta', domain: 'okta.com', logo: 'https://logo.clearbit.com/okta.com' },
  { name: 'Datadog', domain: 'datadoghq.com', logo: 'https://logo.clearbit.com/datadoghq.com' },
  { name: 'HashiCorp', domain: 'hashicorp.com', logo: 'https://logo.clearbit.com/hashicorp.com' },
  { name: 'Confluent', domain: 'confluent.io', logo: 'https://logo.clearbit.com/confluent.io' },
  { name: 'Elastic', domain: 'elastic.co', logo: 'https://logo.clearbit.com/elastic.co' },
  { name: 'Redis', domain: 'redis.com', logo: 'https://logo.clearbit.com/redis.com' },
  { name: 'Supabase', domain: 'supabase.com', logo: 'https://logo.clearbit.com/supabase.com' },
  { name: 'PlanetScale', domain: 'planetscale.com', logo: 'https://logo.clearbit.com/planetscale.com' },
  { name: 'Netlify', domain: 'netlify.com', logo: 'https://logo.clearbit.com/netlify.com' },
  { name: 'Railway', domain: 'railway.app', logo: 'https://logo.clearbit.com/railway.app' },
  { name: 'Render', domain: 'render.com', logo: 'https://logo.clearbit.com/render.com' },
  { name: 'Fly.io', domain: 'fly.io', logo: 'https://logo.clearbit.com/fly.io' },
  
  // More Startups
  { name: 'Airtable', domain: 'airtable.com', logo: 'https://logo.clearbit.com/airtable.com' },
  { name: 'Miro', domain: 'miro.com', logo: 'https://logo.clearbit.com/miro.com' },
  { name: 'Linear', domain: 'linear.app', logo: 'https://logo.clearbit.com/linear.app' },
  { name: 'Retool', domain: 'retool.com', logo: 'https://logo.clearbit.com/retool.com' },
  { name: 'Webflow', domain: 'webflow.com', logo: 'https://logo.clearbit.com/webflow.com' },
  { name: 'Framer', domain: 'framer.com', logo: 'https://logo.clearbit.com/framer.com' },
  { name: 'Vercel', domain: 'vercel.com', logo: 'https://logo.clearbit.com/vercel.com' },
  { name: 'Plaid', domain: 'plaid.com', logo: 'https://logo.clearbit.com/plaid.com' },
  { name: 'Brex', domain: 'brex.com', logo: 'https://logo.clearbit.com/brex.com' },
  { name: 'Ramp', domain: 'ramp.com', logo: 'https://logo.clearbit.com/ramp.com' },
  { name: 'Mercury', domain: 'mercury.com', logo: 'https://logo.clearbit.com/mercury.com' },
  { name: 'Chime', domain: 'chime.com', logo: 'https://logo.clearbit.com/chime.com' },
  { name: 'Affirm', domain: 'affirm.com', logo: 'https://logo.clearbit.com/affirm.com' },
  { name: 'Klarna', domain: 'klarna.com', logo: 'https://logo.clearbit.com/klarna.com' },
  
  // More Finance
  { name: 'Bank of America', domain: 'bankofamerica.com', logo: 'https://logo.clearbit.com/bankofamerica.com' },
  { name: 'Wells Fargo', domain: 'wellsfargo.com', logo: 'https://logo.clearbit.com/wellsfargo.com' },
  { name: 'Citigroup', domain: 'citigroup.com', logo: 'https://logo.clearbit.com/citigroup.com' },
  { name: 'Charles Schwab', domain: 'schwab.com', logo: 'https://logo.clearbit.com/schwab.com' },
  { name: 'Fidelity', domain: 'fidelity.com', logo: 'https://logo.clearbit.com/fidelity.com' },
  { name: 'Vanguard', domain: 'vanguard.com', logo: 'https://logo.clearbit.com/vanguard.com' },
  { name: 'Two Sigma', domain: 'twosigma.com', logo: 'https://logo.clearbit.com/twosigma.com' },
  { name: 'Jane Street', domain: 'janestreet.com', logo: 'https://logo.clearbit.com/janestreet.com' },
  { name: 'Hudson River Trading', domain: 'hudsonrivertrading.com', logo: 'https://logo.clearbit.com/hudsonrivertrading.com' },
  
  // More Consulting/Professional Services
  { name: 'PwC', domain: 'pwc.com', logo: 'https://logo.clearbit.com/pwc.com' },
  { name: 'EY', domain: 'ey.com', logo: 'https://logo.clearbit.com/ey.com' },
  { name: 'KPMG', domain: 'kpmg.com', logo: 'https://logo.clearbit.com/kpmg.com' },
  { name: 'Capgemini', domain: 'capgemini.com', logo: 'https://logo.clearbit.com/capgemini.com' },
  { name: 'Cognizant', domain: 'cognizant.com', logo: 'https://logo.clearbit.com/cognizant.com' },
  { name: 'Infosys', domain: 'infosys.com', logo: 'https://logo.clearbit.com/infosys.com' },
  { name: 'TCS', domain: 'tcs.com', logo: 'https://logo.clearbit.com/tcs.com' },
  { name: 'Wipro', domain: 'wipro.com', logo: 'https://logo.clearbit.com/wipro.com' },
  
  // More Gaming
  { name: 'Unity', domain: 'unity.com', logo: 'https://logo.clearbit.com/unity.com' },
  { name: 'Valve', domain: 'valvesoftware.com', logo: 'https://logo.clearbit.com/valvesoftware.com' },
  { name: 'Bungie', domain: 'bungie.net', logo: 'https://logo.clearbit.com/bungie.net' },
  { name: 'Ubisoft', domain: 'ubisoft.com', logo: 'https://logo.clearbit.com/ubisoft.com' },
  { name: 'Take-Two Interactive', domain: 'take2games.com', logo: 'https://logo.clearbit.com/take2games.com' },
  { name: 'Zynga', domain: 'zynga.com', logo: 'https://logo.clearbit.com/zynga.com' },
  
  // E-commerce/Retail
  { name: 'Etsy', domain: 'etsy.com', logo: 'https://logo.clearbit.com/etsy.com' },
  { name: 'Wayfair', domain: 'wayfair.com', logo: 'https://logo.clearbit.com/wayfair.com' },
  { name: 'Chewy', domain: 'chewy.com', logo: 'https://logo.clearbit.com/chewy.com' },
  { name: 'Carvana', domain: 'carvana.com', logo: 'https://logo.clearbit.com/carvana.com' },
  { name: 'Zillow', domain: 'zillow.com', logo: 'https://logo.clearbit.com/zillow.com' },
  { name: 'Redfin', domain: 'redfin.com', logo: 'https://logo.clearbit.com/redfin.com' },
  { name: 'Opendoor', domain: 'opendoor.com', logo: 'https://logo.clearbit.com/opendoor.com' },
  
  // Media/Entertainment
  { name: 'Spotify', domain: 'spotify.com', logo: 'https://logo.clearbit.com/spotify.com' },
  { name: 'Hulu', domain: 'hulu.com', logo: 'https://logo.clearbit.com/hulu.com' },
  { name: 'Disney', domain: 'disney.com', logo: 'https://logo.clearbit.com/disney.com' },
  { name: 'Warner Bros', domain: 'warnerbros.com', logo: 'https://logo.clearbit.com/warnerbros.com' },
  { name: 'NBCUniversal', domain: 'nbcuniversal.com', logo: 'https://logo.clearbit.com/nbcuniversal.com' },
  { name: 'Paramount', domain: 'paramount.com', logo: 'https://logo.clearbit.com/paramount.com' },
  { name: 'SoundCloud', domain: 'soundcloud.com', logo: 'https://logo.clearbit.com/soundcloud.com' },
  { name: 'Twitch', domain: 'twitch.tv', logo: 'https://logo.clearbit.com/twitch.tv' },
  { name: 'YouTube', domain: 'youtube.com', logo: 'https://logo.clearbit.com/youtube.com' },
  
  // Healthcare/Biotech
  { name: 'UnitedHealth Group', domain: 'unitedhealthgroup.com', logo: 'https://logo.clearbit.com/unitedhealthgroup.com' },
  { name: 'CVS Health', domain: 'cvshealth.com', logo: 'https://logo.clearbit.com/cvshealth.com' },
  { name: 'Anthem', domain: 'antheminc.com', logo: 'https://logo.clearbit.com/antheminc.com' },
  { name: 'Humana', domain: 'humana.com', logo: 'https://logo.clearbit.com/humana.com' },
  { name: 'Oscar Health', domain: 'hioscar.com', logo: 'https://logo.clearbit.com/hioscar.com' },
  { name: '23andMe', domain: '23andme.com', logo: 'https://logo.clearbit.com/23andme.com' },
  { name: 'Illumina', domain: 'illumina.com', logo: 'https://logo.clearbit.com/illumina.com' },
  { name: 'Regeneron', domain: 'regeneron.com', logo: 'https://logo.clearbit.com/regeneron.com' },
  { name: 'Gilead Sciences', domain: 'gilead.com', logo: 'https://logo.clearbit.com/gilead.com' },
  { name: 'Biogen', domain: 'biogen.com', logo: 'https://logo.clearbit.com/biogen.com' },
  
  // Automotive
  { name: 'Ford', domain: 'ford.com', logo: 'https://logo.clearbit.com/ford.com' },
  { name: 'General Motors', domain: 'gm.com', logo: 'https://logo.clearbit.com/gm.com' },
  { name: 'Rivian', domain: 'rivian.com', logo: 'https://logo.clearbit.com/rivian.com' },
  { name: 'Lucid Motors', domain: 'lucidmotors.com', logo: 'https://logo.clearbit.com/lucidmotors.com' },
  { name: 'Waymo', domain: 'waymo.com', logo: 'https://logo.clearbit.com/waymo.com' },
  { name: 'Cruise', domain: 'getcruise.com', logo: 'https://logo.clearbit.com/getcruise.com' },
  
  // Aerospace/Defense
  { name: 'Boeing', domain: 'boeing.com', logo: 'https://logo.clearbit.com/boeing.com' },
  { name: 'Lockheed Martin', domain: 'lockheedmartin.com', logo: 'https://logo.clearbit.com/lockheedmartin.com' },
  { name: 'Northrop Grumman', domain: 'northropgrumman.com', logo: 'https://logo.clearbit.com/northropgrumman.com' },
  { name: 'Raytheon', domain: 'rtx.com', logo: 'https://logo.clearbit.com/rtx.com' },
  { name: 'Blue Origin', domain: 'blueorigin.com', logo: 'https://logo.clearbit.com/blueorigin.com' },
  
  // Telecom
  { name: 'Verizon', domain: 'verizon.com', logo: 'https://logo.clearbit.com/verizon.com' },
  { name: 'AT&T', domain: 'att.com', logo: 'https://logo.clearbit.com/att.com' },
  { name: 'T-Mobile', domain: 't-mobile.com', logo: 'https://logo.clearbit.com/t-mobile.com' },
  { name: 'Comcast', domain: 'comcast.com', logo: 'https://logo.clearbit.com/comcast.com' },
  { name: 'Charter Communications', domain: 'charter.com', logo: 'https://logo.clearbit.com/charter.com' },
  
  // Energy
  { name: 'ExxonMobil', domain: 'exxonmobil.com', logo: 'https://logo.clearbit.com/exxonmobil.com' },
  { name: 'Chevron', domain: 'chevron.com', logo: 'https://logo.clearbit.com/chevron.com' },
  { name: 'BP', domain: 'bp.com', logo: 'https://logo.clearbit.com/bp.com' },
  { name: 'Shell', domain: 'shell.com', logo: 'https://logo.clearbit.com/shell.com' },
  
  // Food/Beverage
  { name: 'Coca-Cola', domain: 'coca-cola.com', logo: 'https://logo.clearbit.com/coca-cola.com' },
  { name: 'PepsiCo', domain: 'pepsico.com', logo: 'https://logo.clearbit.com/pepsico.com' },
  { name: 'Starbucks', domain: 'starbucks.com', logo: 'https://logo.clearbit.com/starbucks.com' },
  { name: 'McDonald\'s', domain: 'mcdonalds.com', logo: 'https://logo.clearbit.com/mcdonalds.com' },
  { name: 'Chipotle', domain: 'chipotle.com', logo: 'https://logo.clearbit.com/chipotle.com' },
  
  // Education/EdTech
  { name: 'Coursera', domain: 'coursera.org', logo: 'https://logo.clearbit.com/coursera.org' },
  { name: 'Udemy', domain: 'udemy.com', logo: 'https://logo.clearbit.com/udemy.com' },
  { name: 'Duolingo', domain: 'duolingo.com', logo: 'https://logo.clearbit.com/duolingo.com' },
  { name: 'Khan Academy', domain: 'khanacademy.org', logo: 'https://logo.clearbit.com/khanacademy.org' },
  { name: 'Chegg', domain: 'chegg.com', logo: 'https://logo.clearbit.com/chegg.com' },
  
  // Cybersecurity
  { name: 'CrowdStrike', domain: 'crowdstrike.com', logo: 'https://logo.clearbit.com/crowdstrike.com' },
  { name: 'Palo Alto Networks', domain: 'paloaltonetworks.com', logo: 'https://logo.clearbit.com/paloaltonetworks.com' },
  { name: 'Fortinet', domain: 'fortinet.com', logo: 'https://logo.clearbit.com/fortinet.com' },
  { name: 'Zscaler', domain: 'zscaler.com', logo: 'https://logo.clearbit.com/zscaler.com' },
  { name: 'SentinelOne', domain: 'sentinelone.com', logo: 'https://logo.clearbit.com/sentinelone.com' },
];

async function seedCompanies() {
  console.log('Starting company seed...');
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Service key present: ${!!supabaseServiceKey}`);
  
  // Test connection first
  console.log('\nTesting Supabase connection...');
  const { data: testData, error: testError } = await supabase
    .from('companies')
    .select('count')
    .limit(1);
  
  if (testError) {
    console.error('Connection test failed:', testError);
    return;
  }
  
  console.log('✓ Connection successful!\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const company of topCompanies) {
    try {
      const { error } = await supabase
        .from('companies')
        .upsert(company, { onConflict: 'domain' });
      
      if (error) {
        console.error(`Error seeding ${company.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Seeded ${company.name}`);
        successCount++;
      }
    } catch (err: any) {
      console.error(`Exception seeding ${company.name}:`, err?.message || err);
      errorCount++;
    }
  }
  
  console.log('\n=== Seed Complete ===');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total: ${topCompanies.length}`);
}

seedCompanies().catch(console.error);
