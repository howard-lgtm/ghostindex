import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/mailgun';
import { getVerificationConfirmationTemplate } from '@/lib/email-templates';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const verificationCode = searchParams.get('code');

    if (!verificationCode) {
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Invalid Link - GhostIndex</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
              .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 500px; text-align: center; }
              h1 { color: #ef4444; margin: 0 0 20px; }
              p { color: #64748b; line-height: 1.6; margin: 0 0 20px; }
              a { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Invalid Verification Link</h1>
              <p>This verification link is invalid or incomplete.</p>
              <a href="https://getghostindex.com/dashboard">Go to Dashboard</a>
            </div>
          </body>
        </html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const supabase = await createClient();

    // Find report by verification code
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*, companies(name)')
      .eq('verification_code', verificationCode)
      .single();

    if (reportError || !report) {
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Report Not Found - GhostIndex</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
              .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 500px; text-align: center; }
              h1 { color: #ef4444; margin: 0 0 20px; }
              p { color: #64748b; line-height: 1.6; margin: 0 0 20px; }
              a { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Report Not Found</h1>
              <p>We couldn't find a report matching this verification code. It may have already been verified or deleted.</p>
              <a href="https://getghostindex.com/dashboard">Go to Dashboard</a>
            </div>
          </body>
        </html>`,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Check if already verified
    if (report.email_verified) {
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Already Verified - GhostIndex</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
              .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 500px; text-align: center; }
              h1 { color: #10b981; margin: 0 0 20px; }
              p { color: #64748b; line-height: 1.6; margin: 0 0 20px; }
              a { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✅ Already Verified</h1>
              <p>This report has already been verified. Thank you!</p>
              <a href="https://getghostindex.com/dashboard">Go to Dashboard</a>
            </div>
          </body>
        </html>`,
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Update report to verified
    const { error: updateError } = await supabase
      .from('reports')
      .update({
        email_verified: true,
        is_verified: true,
        status: 'approved',
      })
      .eq('id', report.id);

    if (updateError) {
      console.error('Error updating report:', updateError);
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Verification Failed - GhostIndex</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
              .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 500px; text-align: center; }
              h1 { color: #ef4444; margin: 0 0 20px; }
              p { color: #64748b; line-height: 1.6; margin: 0 0 20px; }
              a { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Verification Failed</h1>
              <p>Something went wrong while verifying your report. Please try again or contact support.</p>
              <a href="https://getghostindex.com/dashboard">Go to Dashboard</a>
            </div>
          </body>
        </html>`,
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      report_id: report.id,
      activity_type: 'email_verified',
      notes: 'Report verified via email link',
    });

    // Get user email for confirmation
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(report.user_id);
    const user = userData?.user;

    console.log('User lookup result:', { userId: report.user_id, userFound: !!user, userEmail: user?.email, userError });

    // Send confirmation email
    if (user?.email) {
      try {
        console.log('Attempting to send confirmation email to:', user.email);
        const companyName = (report.companies as any)?.name || 'Unknown Company';
        const confirmationTemplate = getVerificationConfirmationTemplate({
          userName: user.user_metadata?.full_name || user.email.split('@')[0],
          companyName,
          jobTitle: report.job_title || 'a position',
        });

        const result = await sendEmail({
          to: user.email,
          subject: confirmationTemplate.subject,
          html: confirmationTemplate.html,
          text: confirmationTemplate.text,
        });
        
        console.log('Confirmation email send result:', result);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the verification if email fails
      }
    } else {
      console.error('No user email found for confirmation. User ID:', report.user_id);
    }

    // Return success page
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Report Verified! - GhostIndex</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 500px; text-align: center; }
            h1 { color: #10b981; margin: 0 0 20px; font-size: 32px; }
            .icon { font-size: 64px; margin-bottom: 20px; }
            p { color: #64748b; line-height: 1.6; margin: 0 0 20px; }
            .benefits { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: left; }
            .benefits h3 { color: #166534; margin: 0 0 10px; font-size: 16px; }
            .benefits ul { margin: 0; padding-left: 20px; color: #15803d; }
            .benefits li { margin: 5px 0; }
            a { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h1>Report Verified!</h1>
            <p>Your report for <strong>${(report.companies as any)?.name || 'the company'}</strong> has been successfully verified.</p>
            
            <div class="benefits">
              <h3>What happens now:</h3>
              <ul>
                <li>Your report now carries more weight in Ghost Index Scores</li>
                <li>Auto-ghost detection enabled after 30 days of no response</li>
                <li>Your report displays a ✓ Verified badge</li>
                <li>You'll receive a confirmation email shortly</li>
              </ul>
            </div>
            
            <p>Thank you for helping make hiring more transparent!</p>
            <a href="https://getghostindex.com/dashboard">View Your Dashboard</a>
          </div>
        </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Error - GhostIndex</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 500px; text-align: center; }
            h1 { color: #ef4444; margin: 0 0 20px; }
            p { color: #64748b; line-height: 1.6; margin: 0 0 20px; }
            a { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Something Went Wrong</h1>
            <p>An unexpected error occurred. Please try again or contact support.</p>
            <a href="https://getghostindex.com/dashboard">Go to Dashboard</a>
          </div>
        </body>
      </html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}
