import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Verify Mailgun signature
    const timestamp = formData.get('timestamp') as string;
    const token = formData.get('token') as string;
    const signature = formData.get('signature') as string;
    
    const encodedToken = crypto
      .createHmac('sha256', process.env.MAILGUN_WEBHOOK_SIGNING_KEY!)
      .update(timestamp + token)
      .digest('hex');
    
    if (signature !== encodedToken) {
      return new Response('Invalid signature', { status: 401 });
    }
    
    // Extract email data
    const from = formData.get('from') as string;
    const subject = formData.get('subject') as string;
    const bodyPlain = formData.get('body-plain') as string;
    const bodyHtml = formData.get('body-html') as string;
    const recipient = formData.get('recipient') as string;
    const sender = formData.get('sender') as string;
    
    // Parse company domain from original sender (in forwarded email body)
    const companyDomain = extractCompanyDomain(bodyPlain || bodyHtml);
    const applicationDate = extractApplicationDate(bodyPlain || bodyHtml);
    const jobTitle = extractJobTitle(subject, bodyPlain || bodyHtml);
    
    if (!companyDomain) {
      return new Response('Could not extract company domain', { status: 400 });
    }
    
    // Get user from sender email
    const supabase = await createClient();
    
    // Find user by email using the users table query
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users.find(u => u.email === sender);
    
    if (!user) {
      return new Response('User not found', { status: 404 });
    }
    
    // Store email verification
    const { data: verification, error: verificationError } = await supabase
      .from('email_verifications')
      .insert({
        user_id: user.id,
        company_domain: companyDomain,
        email_from: from,
        email_subject: subject,
        email_body: bodyPlain || bodyHtml,
        verification_status: 'verified',
        raw_email_json: {
          from,
          subject,
          body: bodyPlain,
          timestamp,
        },
      })
      .select()
      .single();
    
    if (verificationError) {
      console.error('Error storing verification:', verificationError);
      return new Response('Error storing verification', { status: 500 });
    }
    
    // Find or create company
    let { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('domain', companyDomain)
      .single();
    
    if (!company) {
      const { data: newCompany } = await supabase
        .from('companies')
        .insert({
          name: extractCompanyName(companyDomain),
          domain: companyDomain,
          logo: `https://logo.clearbit.com/${companyDomain}`,
        })
        .select()
        .single();
      
      company = newCompany;
    }
    
    if (!company) {
      return new Response('Error creating company', { status: 500 });
    }
    
    // Find existing report or create new one
    const { data: existingReport } = await supabase
      .from('reports')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_id', company.id)
      .eq('job_title', jobTitle || '')
      .single();
    
    if (existingReport) {
      // Update existing report
      await supabase
        .from('reports')
        .update({
          is_verified: true,
          email_verification_id: verification.id,
          application_date: applicationDate,
          last_contact_date: applicationDate,
        })
        .eq('id', existingReport.id);
    } else {
      // Create new report
      await supabase.from('reports').insert({
        user_id: user.id,
        company_id: company.id,
        status: 'pending',
        is_verified: true,
        job_title: jobTitle,
        email_verification_id: verification.id,
        application_date: applicationDate,
        last_contact_date: applicationDate,
      });
    }
    
    return new Response('Email processed successfully', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// Helper functions to extract data from email body
function extractCompanyDomain(body: string): string | null {
  // Look for email addresses in the body
  const emailRegex = /[\w.-]+@([\w-]+\.[\w.-]+)/g;
  const matches = body.matchAll(emailRegex);
  
  for (const match of matches) {
    const domain = match[1].toLowerCase();
    // Skip common email providers
    if (!['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'].includes(domain)) {
      return domain;
    }
  }
  
  return null;
}

function extractApplicationDate(body: string): string | null {
  // Look for date patterns
  const datePatterns = [
    /(?:applied|received|submitted).*?(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(?:applied|received|submitted).*?(\d{4}-\d{2}-\d{2})/i,
    /(?:applied|received|submitted).*?((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
  ];
  
  for (const pattern of datePatterns) {
    const match = body.match(pattern);
    if (match) {
      return new Date(match[1]).toISOString();
    }
  }
  
  // Default to current date if not found
  return new Date().toISOString();
}

function extractJobTitle(subject: string, body: string): string | null {
  // Look for job title in subject
  const subjectPatterns = [
    /application.*?(?:for|to)\s+(.+?)(?:\s+at|\s+position|$)/i,
    /(.+?)\s+(?:application|position)/i,
  ];
  
  for (const pattern of subjectPatterns) {
    const match = subject.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  // Look in body
  const bodyPatterns = [
    /(?:position|role|job):\s*(.+?)(?:\n|at|$)/i,
    /applied.*?(?:for|to)\s+(?:the\s+)?(.+?)\s+(?:position|role)/i,
  ];
  
  for (const pattern of bodyPatterns) {
    const match = body.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

function extractCompanyName(domain: string): string {
  // Simple domain to company name conversion
  const name = domain.split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}
