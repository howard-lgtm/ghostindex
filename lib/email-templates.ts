// Email templates for Mailgun

interface VerificationEmailParams {
  userName: string;
  companyName: string;
  jobTitle: string;
  verificationCode: string;
  reportId: string;
}

export function getVerificationEmailTemplate({
  userName,
  companyName,
  jobTitle,
  verificationCode,
  reportId,
}: VerificationEmailParams): { subject: string; html: string; text: string } {
  const replyToEmail = `verify+${verificationCode}@mg.getghostindex.com`;
  
  const subject = `Verify your GhostIndex report for ${companyName}`;
  
  const text = `Hi ${userName},

Thanks for reporting your experience with ${companyName} for the ${jobTitle} position.

Your report is now live on GhostIndex! To verify your report and enable auto-ghost detection, simply reply to this email with one of the following:

1. Forward your application confirmation email (just hit reply and forward it)
2. Attach a screenshot of your application confirmation

That's it! Just reply to this email with your proof.

WHY VERIFY?
- Verified reports carry more weight in Ghost Index Scores
- Enables automatic ghosting detection after 30 days
- Helps other job seekers trust the data

Your report is already visible, but verified reports are marked with a ✓ badge and count more toward company scores.

Reply to: ${replyToEmail}

Thanks for helping make hiring more transparent!

- The GhostIndex Team

---
Report Details:
Company: ${companyName}
Position: ${jobTitle}
Report ID: ${reportId}

View your report: https://getghostindex.com/dashboard
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your GhostIndex Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">GhostIndex</h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">Making Hiring Transparent</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 24px; font-weight: 600;">Hi ${userName},</h2>
              
              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                Thanks for reporting your experience with <strong>${companyName}</strong> for the <strong>${jobTitle}</strong> position.
              </p>
              
              <div style="background-color: #f1f5f9; border-left: 4px solid #6366f1; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <p style="margin: 0 0 10px; color: #1e293b; font-size: 16px; font-weight: 600;">✅ Your report is now live!</p>
                <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
                  To verify your report and enable auto-ghost detection, simply <strong>reply to this email</strong> with your proof.
                </p>
              </div>
              
              <h3 style="margin: 30px 0 15px; color: #1e293b; font-size: 18px; font-weight: 600;">How to Verify (Choose One):</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 10px;">
                    <div style="display: flex; align-items: start;">
                      <div style="background-color: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; margin-right: 15px;">1</div>
                      <div>
                        <p style="margin: 0 0 5px; color: #1e293b; font-weight: 600; font-size: 15px;">Forward your confirmation email</p>
                        <p style="margin: 0; color: #64748b; font-size: 14px;">Just hit reply and forward your application confirmation</p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                    <div style="display: flex; align-items: start;">
                      <div style="background-color: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; margin-right: 15px;">2</div>
                      <div>
                        <p style="margin: 0 0 5px; color: #1e293b; font-weight: 600; font-size: 15px;">Attach a screenshot</p>
                        <p style="margin: 0; color: #64748b; font-size: 14px;">Screenshot of your confirmation email or application portal</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 6px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>Why verify?</strong><br>
                  • Verified reports carry more weight in Ghost Index Scores<br>
                  • Enables automatic ghosting detection after 30 days<br>
                  • Helps other job seekers trust the data
                </p>
              </div>
              
              <p style="margin: 30px 0 20px; color: #475569; font-size: 14px; line-height: 1.6;">
                Your report is already visible on GhostIndex, but verified reports are marked with a <span style="color: #10b981; font-weight: 600;">✓ Verified</span> badge and count more toward company scores.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://getghostindex.com/dashboard" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">View Your Dashboard</a>
                  </td>
                </tr>
              </table>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <p style="margin: 20px 0 10px; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                <strong>Report Details:</strong><br>
                Company: ${companyName}<br>
                Position: ${jobTitle}<br>
                Report ID: ${reportId}
              </p>
              
              <p style="margin: 20px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                Thanks for helping make hiring more transparent!<br>
                - The GhostIndex Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 12px;">
                GhostIndex - Exposing Ghosting in Tech Hiring
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                <a href="https://getghostindex.com" style="color: #6366f1; text-decoration: none;">getghostindex.com</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return { subject, html, text };
}

export function getVerificationConfirmationTemplate({
  userName,
  companyName,
  jobTitle,
}: {
  userName: string;
  companyName: string;
  jobTitle: string;
}): { subject: string; html: string; text: string } {
  const subject = `✅ Report Verified - ${companyName}`;
  
  const text = `Hi ${userName},

Great news! Your report for ${companyName} (${jobTitle}) has been verified.

WHAT HAPPENS NEXT:
- Your report now carries full weight in Ghost Index Scores
- Auto-ghost detection is enabled (we'll check after 30 days)
- Other job seekers can trust your verified data

AUTO-GHOST DETECTION:
If you don't hear back from ${companyName} within 30 days, we'll automatically mark your report as "Ghosted" and update their Ghost Index Score.

If you do hear back, you can update your report status anytime in your dashboard.

View your dashboard: https://getghostindex.com/dashboard

Thanks for helping make hiring more transparent!

- The GhostIndex Team
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Verified</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Report Verified!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                Hi ${userName},
              </p>
              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                Great news! Your report for <strong>${companyName}</strong> (${jobTitle}) has been verified.
              </p>
              
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <p style="margin: 0 0 10px; color: #065f46; font-size: 16px; font-weight: 600;">What happens next:</p>
                <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 14px; line-height: 1.8;">
                  <li>Your report now carries full weight in Ghost Index Scores</li>
                  <li>Auto-ghost detection is enabled (we'll check after 30 days)</li>
                  <li>Other job seekers can trust your verified data</li>
                </ul>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <p style="margin: 0 0 10px; color: #92400e; font-size: 16px; font-weight: 600;">⏰ Auto-Ghost Detection</p>
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  If you don't hear back from ${companyName} within 30 days, we'll automatically mark your report as "Ghosted" and update their Ghost Index Score.
                </p>
              </div>
              
              <p style="margin: 30px 0 20px; color: #475569; font-size: 14px; line-height: 1.6;">
                If you do hear back, you can update your report status anytime in your dashboard.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://getghostindex.com/dashboard" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">View Dashboard</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                Thanks for helping make hiring more transparent!<br>
                - The GhostIndex Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                <a href="https://getghostindex.com" style="color: #6366f1; text-decoration: none;">getghostindex.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return { subject, html, text };
}

export function getWelcomeEmailTemplate(userName: string): { subject: string; html: string; text: string } {
  const subject = 'Welcome to GhostIndex';
  
  const text = `Hi ${userName},

Welcome to GhostIndex! 🎉

You've joined a community of job seekers fighting back against ghosting in tech hiring.

WHAT YOU CAN DO:
- Submit reports about companies that ghosted you
- Search the Ghost Index to avoid problematic employers
- Help others by verifying your reports

Your reports help create transparency and hold companies accountable.

Get started: https://getghostindex.com/dashboard

Thanks for joining the movement!

- The GhostIndex Team
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to GhostIndex</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Welcome to GhostIndex! 🎉</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                Hi ${userName},
              </p>
              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                You've joined a community of job seekers fighting back against ghosting in tech hiring.
              </p>
              <p style="margin: 30px 0 20px; color: #1e293b; font-size: 18px; font-weight: 600;">
                What you can do:
              </p>
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #475569; font-size: 16px; line-height: 1.8;">
                <li>Submit reports about companies that ghosted you</li>
                <li>Search the Ghost Index to avoid problematic employers</li>
                <li>Help others by verifying your reports</li>
              </ul>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://getghostindex.com/dashboard" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Get Started</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return { subject, html, text };
}
