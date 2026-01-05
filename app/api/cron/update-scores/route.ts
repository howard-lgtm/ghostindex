import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const supabase = await createClient();
    
    // Get all companies with verified reports
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name')
      .not('id', 'is', null);
    
    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      return Response.json({ success: false, error: companiesError.message }, { status: 500 });
    }
    
    let updatedCount = 0;
    const errors: string[] = [];
    
    // Recalculate score for each company
    for (const company of companies || []) {
      const { data: score, error: scoreError } = await supabase
        .rpc('calculate_ghost_index_score', { company_uuid: company.id });
      
      if (scoreError) {
        errors.push(`${company.name}: ${scoreError.message}`);
        continue;
      }
      
      // Update company score
      const { error: updateError } = await supabase
        .from('companies')
        .update({ ghost_index_score: score })
        .eq('id', company.id);
      
      if (updateError) {
        errors.push(`${company.name}: ${updateError.message}`);
      } else {
        updatedCount++;
      }
    }
    
    console.log(`Score update completed: ${updatedCount} companies updated`);
    
    return Response.json({ 
      success: true, 
      message: 'Score update completed',
      updated: updatedCount,
      total: companies?.length || 0,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
