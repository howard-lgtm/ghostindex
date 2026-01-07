import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/mailgun';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, userEmail, userName, companyName, jobTitle, verificationCode } = body;

    // Validate required fields
    if (!reportId || !userEmail || !companyName || !verificationCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send verification email
    const result = await sendVerificationEmail({
      to: userEmail,
      userName,
      companyName,
      jobTitle,
      verificationCode,
      reportId,
    });

    if (!result.success) {
      console.error('Failed to send verification email:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-verification-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
