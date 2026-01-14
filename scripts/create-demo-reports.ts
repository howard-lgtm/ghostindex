import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get a random date within the last 60 days
function getRandomDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

// Sample job titles
const jobTitles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
  'UX Designer',
  'Engineering Manager',
  'Technical Lead',
  'Solutions Architect',
  'Machine Learning Engineer',
  'Security Engineer',
  'QA Engineer'
];

// Sample experiences
const experiences = [
  'Applied 45 days ago, no response after initial screening',
  'Completed 3 rounds of interviews, then ghosted',
  'Got to final round, never heard back',
  'Recruiter reached out, then disappeared',
  'Submitted application, automated rejection after 60 days',
  'Phone screen went well, then silence',
  'Technical assessment completed, no follow-up',
  'Hiring manager interview scheduled, then cancelled with no reschedule',
  'Received offer, then company went silent',
  'Multiple follow-ups ignored'
];

async function createDemoReports() {
  console.log('\n=== Creating Demo Reports ===\n');
  
  // Get all companies
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('id, name, domain')
    .limit(30);
  
  if (companiesError || !companies) {
    console.error('Error fetching companies:', companiesError);
    return;
  }
  
  console.log(`Found ${companies.length} companies\n`);
  
  // Create a test user (or use existing)
  const testEmail = 'demo@ghostindex.com';
  let userId: string;
  
  // Try to get existing user
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users.find(u => u.email === testEmail);
  
  if (existingUser) {
    userId = existingUser.id;
    console.log(`Using existing demo user: ${testEmail}`);
  } else {
    // Create demo user
    const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'DemoPassword123!',
      email_confirm: true
    });
    
    if (userError || !newUser.user) {
      console.error('Error creating demo user:', userError);
      return;
    }
    
    userId = newUser.user.id;
    console.log(`Created demo user: ${testEmail}`);
  }
  
  console.log(`\nGenerating 25 demo reports...\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  // Create 25 reports across different companies
  for (let i = 0; i < 25; i++) {
    const company = companies[i % companies.length];
    const daysAgo = Math.floor(Math.random() * 60) + 1; // 1-60 days ago
    const isVerified = Math.random() > 0.3; // 70% verified
    const isAutoGhosted = isVerified && daysAgo > 30 && Math.random() > 0.5; // 50% of old verified reports
    
    const report = {
      user_id: userId,
      company_id: company.id,
      job_title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      is_verified: isVerified,
      status: 'pending',
      created_at: getRandomDate(daysAgo)
    };
    
    try {
      const { error } = await supabase
        .from('reports')
        .insert(report);
      
      if (error) {
        console.error(`Error creating report for ${company.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Created ${isVerified ? 'verified' : 'unverified'} report for ${company.name}${isAutoGhosted ? ' (auto-ghosted)' : ''}`);
        successCount++;
      }
    } catch (err: any) {
      console.error(`Exception creating report:`, err?.message || err);
      errorCount++;
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n=== Demo Report Creation Complete ===');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total: ${successCount + errorCount}`);
  
  // Show summary
  const { count: totalReports } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true });
  
  const { count: verifiedReports } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', true);
  
  const { count: autoGhosted } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('auto_ghosted', true);
  
  console.log('\n=== Database Summary ===');
  console.log(`Total Reports: ${totalReports}`);
  console.log(`Verified Reports: ${verifiedReports}`);
  console.log(`Auto-Ghosted: ${autoGhosted}`);
}

createDemoReports().catch(console.error);
