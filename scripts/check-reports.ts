import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkReports() {
  console.log('\n=== Checking Reports in Database ===\n');
  
  // Total reports
  const { count: totalReports, error: totalError } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true });
  
  if (totalError) {
    console.error('Error counting reports:', totalError);
    return;
  }
  
  console.log(`Total Reports: ${totalReports || 0}`);
  
  // Verified reports
  const { count: verifiedReports, error: verifiedError } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', true);
  
  console.log(`Verified Reports: ${verifiedReports || 0}`);
  
  // Auto-ghosted reports
  const { count: autoGhosted, error: ghostError } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('auto_ghosted', true);
  
  console.log(`Auto-Ghosted Reports: ${autoGhosted || 0}`);
  
  // Reports by status
  const { data: statusData, error: statusError } = await supabase
    .from('reports')
    .select('status');
  
  if (statusData) {
    const statusCounts = statusData.reduce((acc: any, r: any) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nReports by Status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
  }
  
  // Sample recent reports
  const { data: recentReports, error: recentError } = await supabase
    .from('reports')
    .select('*, companies(name, domain)')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (recentReports && recentReports.length > 0) {
    console.log('\n=== Recent Reports (Last 5) ===');
    recentReports.forEach((r: any) => {
      console.log(`- ${r.companies?.name || 'Unknown'} | Verified: ${r.is_verified} | Status: ${r.status} | Created: ${new Date(r.created_at).toLocaleDateString()}`);
    });
  } else {
    console.log('\n⚠️  No reports found in database');
  }
}

checkReports().catch(console.error);
