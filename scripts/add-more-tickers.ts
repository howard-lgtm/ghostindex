import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Additional public companies and subsidiaries that need tickers
const additionalTickers: Record<string, { ticker: string; exchange: string }> = {
  // Public companies
  'antheminc.com': { ticker: 'ELV', exchange: 'NYSE' },
  'bp.com': { ticker: 'BP', exchange: 'NYSE' },
  'capgemini.com': { ticker: 'CAP', exchange: 'EPA' },
  'nbcuniversal.com': { ticker: 'CMCSA', exchange: 'NASDAQ' },
  'shell.com': { ticker: 'SHEL', exchange: 'NYSE' },
  'tcs.com': { ticker: 'TCS', exchange: 'NSE' },
  'ubisoft.com': { ticker: 'UBI', exchange: 'EPA' },
  
  // Acquired companies - show parent ticker
  'activisionblizzard.com': { ticker: 'MSFT', exchange: 'NASDAQ' },
  'splunk.com': { ticker: 'CSCO', exchange: 'NASDAQ' },
  'vmware.com': { ticker: 'AVGO', exchange: 'NASDAQ' },
  'zynga.com': { ticker: 'TTWO', exchange: 'NASDAQ' },
  
  // Subsidiaries with parent tickers
  'github.com': { ticker: 'MSFT', exchange: 'NASDAQ' },
  'linkedin.com': { ticker: 'MSFT', exchange: 'NASDAQ' },
  'youtube.com': { ticker: 'GOOGL', exchange: 'NASDAQ' },
  'twitch.tv': { ticker: 'AMZN', exchange: 'NASDAQ' },
  'hulu.com': { ticker: 'DIS', exchange: 'NYSE' },
  'slack.com': { ticker: 'CRM', exchange: 'NYSE' },
};

// Private companies - mark as is_public = false
const privateCompanies = [
  'openai.com', 'anthropic.com', 'stripe.com', 'spacex.com', 'databricks.com',
  'figma.com', 'notion.so', 'canva.com', 'discord.com', 'epicgames.com',
  'riotgames.com', 'instacart.com', 'plaid.com', 'brex.com', 'ramp.com',
  'mercury.com', 'chime.com', 'klarna.com', 'citadel.com', 'twosigma.com',
  'janestreet.com', 'hudsonrivertrading.com', 'mckinsey.com', 'bcg.com',
  'bain.com', 'deloitte.com', 'pwc.com', 'ey.com', 'kpmg.com', 'valvesoftware.com',
  'bungie.net', 'blueorigin.com', 'waymo.com', 'getcruise.com', 'vercel.com',
  'supabase.com', 'planetscale.com', 'netlify.com', 'railway.app', 'render.com',
  'fly.io', 'airtable.com', 'miro.com', 'linear.app', 'retool.com', 'webflow.com',
  'framer.com', 'tiktok.com', 'fidelity.com', 'vanguard.com', 'soundcloud.com',
  'udemy.com', 'khanacademy.org', 'automattic.com', 'redis.com', 'scale.com',
];

async function updateTickers() {
  console.log('=== Adding Stock Tickers to Additional Public Companies ===\n');

  let publicCount = 0;
  let privateCount = 0;

  // Add tickers to public companies
  for (const [domain, { ticker, exchange }] of Object.entries(additionalTickers)) {
    const { data, error } = await supabase
      .from('companies')
      .update({ stock_ticker: ticker, stock_exchange: exchange, is_public: true })
      .eq('domain', domain)
      .select('name');

    if (data && data.length > 0) {
      console.log(`✅ ${data[0].name}: $${ticker} (${exchange})`);
      publicCount++;
    } else if (error) {
      console.log(`❌ ${domain}: ${error.message}`);
    }
  }

  console.log(`\n=== Marking Private Companies ===\n`);

  // Mark private companies
  for (const domain of privateCompanies) {
    const { data, error } = await supabase
      .from('companies')
      .update({ is_public: false })
      .eq('domain', domain)
      .select('name');

    if (data && data.length > 0) {
      console.log(`📌 ${data[0].name}: Private`);
      privateCount++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Public companies updated: ${publicCount}`);
  console.log(`Private companies marked: ${privateCount}`);

  // Show final counts
  const { data: publicData } = await supabase
    .from('companies')
    .select('id')
    .eq('is_public', true);

  const { data: tickerData } = await supabase
    .from('companies')
    .select('id')
    .not('stock_ticker', 'is', null);

  console.log(`\nTotal public companies: ${publicData?.length || 0}`);
  console.log(`Total with tickers: ${tickerData?.length || 0}`);
}

updateTickers()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
