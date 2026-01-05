import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Testing Supabase connection...\n');
console.log('URL:', supabaseUrl);
console.log('Anon key present:', !!supabaseAnonKey);
console.log('Anon key length:', supabaseAnonKey?.length || 0);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('\n--- Test 1: Basic Connection ---');
    const { data: testData, error: testError } = await supabase
      .from('companies')
      .select('count');
    
    if (testError) {
      console.error('❌ Connection failed:', testError);
      return;
    }
    console.log('✅ Connection successful');

    // Test 2: Count companies
    console.log('\n--- Test 2: Count Companies ---');
    const { count, error: countError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Count failed:', countError);
      return;
    }
    console.log(`✅ Total companies: ${count}`);

    // Test 3: Fetch sample companies
    if (count && count > 0) {
      console.log('\n--- Test 3: Sample Companies ---');
      const { data: companies, error: fetchError } = await supabase
        .from('companies')
        .select('name, domain, ghost_index_score')
        .limit(5);
      
      if (fetchError) {
        console.error('❌ Fetch failed:', fetchError);
        return;
      }
      console.log('✅ Sample companies:');
      companies?.forEach(c => console.log(`  - ${c.name} (${c.domain})`));
    } else {
      console.log('\n⚠️  Database is empty - run seed-companies.sql in Supabase SQL Editor');
    }

    // Test 4: Search functionality
    console.log('\n--- Test 4: Search Test ---');
    const { data: searchResults, error: searchError } = await supabase
      .from('companies')
      .select('*')
      .or('name.ilike.%google%,domain.ilike.%google%')
      .limit(5);
    
    if (searchError) {
      console.error('❌ Search failed:', searchError);
      return;
    }
    console.log(`✅ Search for "google" returned ${searchResults?.length || 0} results`);
    searchResults?.forEach(c => console.log(`  - ${c.name}`));

  } catch (err: any) {
    console.error('❌ Exception:', err?.message || err);
  }
}

testConnection();
