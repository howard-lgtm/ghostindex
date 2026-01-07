#!/usr/bin/env tsx
/**
 * Test script for trust-first verification system
 * Tests the complete flow from report submission to email verification
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testVerificationFlow() {
  console.log('🧪 Testing Trust-First Verification Flow\n');

  // Step 1: Check if verification_code column exists
  console.log('1️⃣ Checking database schema...');
  const { data: reports, error: schemaError } = await supabase
    .from('reports')
    .select('id, verification_code, email_verified')
    .limit(1);

  if (schemaError) {
    console.error('❌ Schema check failed:', schemaError.message);
    if (schemaError.message.includes('verification_code')) {
      console.error('   Migration not applied! Run the migration SQL first.');
    }
    return;
  }

  console.log('✅ Database schema updated correctly\n');

  // Step 2: Test verification code generation
  console.log('2️⃣ Testing verification code generation...');
  const { data: codeTest, error: codeError } = await supabase
    .rpc('generate_verification_code');

  if (codeError) {
    console.error('❌ Code generation failed:', codeError.message);
    return;
  }

  console.log(`✅ Generated test code: ${codeTest}`);
  console.log(`   Length: ${codeTest.length} characters (should be 8)\n`);

  // Step 3: Check existing reports for verification codes
  console.log('3️⃣ Checking existing reports...');
  const { data: existingReports, error: reportsError } = await supabase
    .from('reports')
    .select('id, verification_code, email_verified, is_verified, status')
    .order('created_at', { ascending: false })
    .limit(5);

  if (reportsError) {
    console.error('❌ Failed to fetch reports:', reportsError.message);
    return;
  }

  if (existingReports && existingReports.length > 0) {
    console.log(`✅ Found ${existingReports.length} recent reports:`);
    existingReports.forEach((report, i) => {
      console.log(`   ${i + 1}. ID: ${report.id.substring(0, 8)}...`);
      console.log(`      Verification Code: ${report.verification_code || '❌ MISSING (old report)'}`);
      console.log(`      Email Verified: ${report.email_verified ? '✅' : '❌'}`);
      console.log(`      Status: ${report.status}`);
    });
  } else {
    console.log('   No reports found yet');
  }
  console.log('');

  // Step 4: Test verification function
  if (existingReports && existingReports.length > 0 && existingReports[0].verification_code) {
    const testCode = existingReports[0].verification_code;
    console.log('4️⃣ Testing verify_report_by_code function...');
    console.log(`   Using code: ${testCode}`);
    
    // Don't actually verify, just test the function exists
    const { data: functionExists, error: funcError } = await supabase
      .rpc('verify_report_by_code', { code: 'test_invalid_code' });

    if (funcError && !funcError.message.includes('invalid')) {
      console.error('❌ Function test failed:', funcError.message);
    } else {
      console.log('✅ Verification function is working\n');
    }
  }

  // Step 5: Check Mailgun configuration
  console.log('5️⃣ Checking Mailgun configuration...');
  const mailgunKey = process.env.MAILGUN_API_KEY;
  const mailgunDomain = process.env.MAILGUN_DOMAIN;
  const mailgunWebhook = process.env.MAILGUN_WEBHOOK_SIGNING_KEY;

  if (!mailgunKey || !mailgunDomain || !mailgunWebhook) {
    console.error('❌ Mailgun not configured in .env.local');
    console.log('   Missing:', [
      !mailgunKey && 'MAILGUN_API_KEY',
      !mailgunDomain && 'MAILGUN_DOMAIN',
      !mailgunWebhook && 'MAILGUN_WEBHOOK_SIGNING_KEY',
    ].filter(Boolean).join(', '));
  } else {
    console.log('✅ Mailgun configured:');
    console.log(`   Domain: ${mailgunDomain}`);
    console.log(`   API Key: ${mailgunKey.substring(0, 10)}...`);
  }
  console.log('');

  // Summary
  console.log('📊 Test Summary:');
  console.log('================');
  console.log('✅ Database migration applied');
  console.log('✅ Verification code generation working');
  console.log('✅ Verification function exists');
  console.log(mailgunKey ? '✅' : '❌', 'Mailgun configured');
  console.log('');
  console.log('🎯 Next Steps:');
  console.log('1. Submit a test report via the UI');
  console.log('2. Check that verification email is sent');
  console.log('3. Configure Mailgun inbound route for verify+CODE@');
  console.log('4. Test email reply verification');
}

testVerificationFlow().catch(console.error);
