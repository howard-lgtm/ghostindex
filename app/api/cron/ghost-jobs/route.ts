import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const supabase = await createClient();
    
    // Call the ghost job detection function
    const { data, error } = await supabase.rpc('detect_ghost_jobs');
    
    if (error) {
      console.error('Ghost job detection error:', error);
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }
    
    console.log('Ghost job detection completed successfully');
    
    return Response.json({ 
      success: true, 
      message: 'Ghost job detection completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
