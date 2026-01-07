// Mailgun email sending utilities

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mg.getghostindex.com';
const MAILGUN_REGION = 'eu';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!MAILGUN_API_KEY) {
    console.error('MAILGUN_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const url = `https://api.${MAILGUN_REGION}.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

  const formData = new FormData();
  formData.append('from', `GhostIndex <noreply@${MAILGUN_DOMAIN}>`);
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('html', html);
  formData.append('text', text);
  
  if (replyTo) {
    formData.append('h:Reply-To', replyTo);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mailgun API error:', response.status, errorText);
      return { success: false, error: `Failed to send email: ${response.statusText}` };
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendVerificationEmail({
  to,
  userName,
  companyName,
  jobTitle,
  verificationCode,
  reportId,
}: {
  to: string;
  userName: string;
  companyName: string;
  jobTitle: string;
  verificationCode: string;
  reportId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { getVerificationEmailTemplate } = await import('./email-templates');
  
  const { subject, html, text } = getVerificationEmailTemplate({
    userName,
    companyName,
    jobTitle,
    verificationCode,
    reportId,
  });

  const replyTo = `verify+${verificationCode}@${MAILGUN_DOMAIN}`;

  return sendEmail({ to, subject, html, text, replyTo });
}
