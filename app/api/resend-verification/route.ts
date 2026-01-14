import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get report ID from request
    const { reportId } = await request.json();
    
    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
    }
    
    // Verify report belongs to user and is not already verified
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*, companies(name, domain)')
      .eq('id', reportId)
      .eq('user_id', user.id)
      .single();
    
    if (reportError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    
    if (report.is_verified) {
      return NextResponse.json({ error: 'Report already verified' }, { status: 400 });
    }
    
    // Generate verification code
    const verificationCode = Math.random().toString(36).substring(2, 15);
    
    // Send verification email via Mailgun
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    
    if (!mailgunDomain || !mailgunApiKey) {
      console.error('Mailgun not configured');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }
    
    const mailgunUrl = `https://api.eu.mailgun.net/v3/${mailgunDomain}/messages`;
    
    const formData = new FormData();
    formData.append('from', `GhostIndex <verify@${mailgunDomain}>`);
    formData.append('to', user.email!);
    formData.append('subject', `Verify your report for ${report.companies?.name}`);
    formData.append('text', `
Hi,

Thank you for reporting your experience with ${report.companies?.name}.

To verify your report, please forward your job application confirmation email to:

verify+${verificationCode}@${mailgunDomain}

This helps us maintain the accuracy and trustworthiness of Ghost Index scores.

Why verify?
- Verified reports carry more weight in Ghost Index calculations
- Enables automatic ghosting detection after 30 days
- Helps other job seekers make informed decisions

Questions? Reply to this email.

Best,
The GhostIndex Team

---
Report Details:
Company: ${report.companies?.name}
Job Title: ${report.job_title || 'Not specified'}
Submitted: ${new Date(report.created_at).toLocaleDateString()}
    `);
    formData.append('html', `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .verification-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .verification-email { font-size: 18px; font-weight: bold; color: #667eea; word-break: break-all; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { color: #6b7280; font-size: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Report</h1>
    </div>
    <div class="content">
      <p>Hi,</p>
      <p>Thank you for reporting your experience with <strong>${report.companies?.name}</strong>.</p>
      
      <div class="verification-box">
        <p><strong>To verify your report, forward your job application confirmation email to:</strong></p>
        <p class="verification-email">verify+${verificationCode}@${mailgunDomain}</p>
      </div>
      
      <p><strong>Why verify?</strong></p>
      <ul>
        <li>Verified reports carry more weight in Ghost Index calculations</li>
        <li>Enables automatic ghosting detection after 30 days</li>
        <li>Helps other job seekers make informed decisions</li>
      </ul>
      
      <div class="footer">
        <p><strong>Report Details:</strong></p>
        <p>Company: ${report.companies?.name}<br>
        Job Title: ${report.job_title || 'Not specified'}<br>
        Submitted: ${new Date(report.created_at).toLocaleDateString()}</p>
        
        <p>Questions? Reply to this email.</p>
        <p>Best,<br>The GhostIndex Team</p>
      </div>
    </div>
  </div>
</body>
</html>
    `);
    
    const mailgunResponse = await fetch(mailgunUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString('base64')}`,
      },
      body: formData,
    });
    
    if (!mailgunResponse.ok) {
      const error = await mailgunResponse.text();
      console.error('Mailgun error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    
    // Store verification code in database (optional - for tracking)
    // You could create a verification_codes table if needed
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent',
      email: user.email
    });
    
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
