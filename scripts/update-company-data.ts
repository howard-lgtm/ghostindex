import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const clearbitApiKey = process.env.CLEARBIT_API_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ClearbitCompany {
  name: string;
  domain: string;
  category?: {
    industry?: string;
  };
  metrics?: {
    employees?: number;
  };
  geo?: {
    city?: string;
    state?: string;
    country?: string;
  };
  description?: string;
  foundedYear?: number;
}

function getEmployeeRange(employees?: number): string | null {
  if (!employees) return null;
  
  if (employees <= 10) return '1-10';
  if (employees <= 50) return '11-50';
  if (employees <= 200) return '51-200';
  if (employees <= 500) return '201-500';
  if (employees <= 1000) return '501-1000';
  if (employees <= 5000) return '1001-5000';
  if (employees <= 10000) return '5001-10000';
  return '10000+';
}

async function enrichCompanyData(domain: string): Promise<Partial<any> | null> {
  if (!clearbitApiKey) {
    console.log(`Skipping enrichment for ${domain} - no Clearbit API key`);
    return null;
  }

  try {
    const response = await fetch(
      `https://company.clearbit.com/v2/companies/find?domain=${domain}`,
      {
        headers: {
          'Authorization': `Bearer ${clearbitApiKey}`
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No data found for ${domain}`);
        return null;
      }
      throw new Error(`Clearbit API error: ${response.status}`);
    }

    const data: ClearbitCompany = await response.json();

    return {
      name: data.name,
      industry: data.category?.industry,
      employee_count_range: getEmployeeRange(data.metrics?.employees),
      headquarters: data.geo?.city && data.geo?.state 
        ? `${data.geo.city}, ${data.geo.state}`
        : null,
      description: data.description,
      founded_year: data.foundedYear,
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Failed to enrich ${domain}:`, error);
    return null;
  }
}

async function updateCompanyData() {
  console.log('Starting company data update...');

  // Get companies that haven't been updated recently (oldest first)
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, domain, name, updated_at')
    .order('updated_at', { ascending: true })
    .limit(50); // Update 50 companies per run

  if (error) {
    console.error('Error fetching companies:', error);
    return;
  }

  if (!companies || companies.length === 0) {
    console.log('No companies to update');
    return;
  }

  console.log(`Found ${companies.length} companies to update`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const company of companies) {
    try {
      console.log(`Processing: ${company.name} (${company.domain})`);

      const enrichedData = await enrichCompanyData(company.domain);

      if (enrichedData) {
        const { error: updateError } = await supabase
          .from('companies')
          .update(enrichedData)
          .eq('id', company.id);

        if (updateError) {
          console.error(`Failed to update ${company.domain}:`, updateError);
          errorCount++;
        } else {
          console.log(`✓ Updated: ${company.name}`);
          successCount++;
        }
      } else {
        skipCount++;
      }

      // Rate limit: 1 request per second to avoid hitting API limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing ${company.domain}:`, error);
      errorCount++;
    }
  }

  console.log('\n=== Update Summary ===');
  console.log(`Total processed: ${companies.length}`);
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Skipped: ${skipCount}`);
  console.log(`Errors: ${errorCount}`);
}

// Run the update
updateCompanyData()
  .then(() => {
    console.log('Company data update completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
