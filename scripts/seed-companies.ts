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
