import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function approveReports() {
  console.log('\n=== Approving Verified Reports ===\n');
  
  // Get all verified reports with pending status
  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, company_id, companies(name)')
    .eq('is_verified', true)
    .eq('status', 'pending');
  
  if (error || !reports) {
    console.error('Error fetching reports:', error);
    return;
  }
  
  console.log(`Found ${reports.length} verified reports to approve\n`);
  
  let successCount = 0;
  
  for (const report of reports) {
    const { error: updateError } = await supabase
      .from('reports')
      .update({ status: 'approved' })
      .eq('id', report.id);
    
    if (updateError) {
      console.error(`Error approving report for ${report.companies?.name}:`, updateError.message);
    } else {
      console.log(`✓ Approved report for ${report.companies?.name}`);
      successCount++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n=== Complete ===`);
  console.log(`Approved: ${successCount}/${reports.length} reports`);
  
  // Check updated counts
  const { count: approvedCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');
  
  console.log(`\nTotal approved reports: ${approvedCount}`);
}

approveReports().catch(console.error);
