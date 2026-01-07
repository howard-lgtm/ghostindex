#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mg.getghostindex.com';
const MAILGUN_REGION = 'eu';

interface DomainStatus {
  domain: {
    name: string;
    state: string;
    is_disabled: boolean;
  };
  sending_dns_records: Array<{
    record_type: string;
    valid: string;
    name: string;
    value: string;
  }>;
  receiving_dns_records: Array<{
    record_type: string;
    valid: string;
    priority: string;
    value: string;
  }>;
}

async function checkMailgunDomainStatus(): Promise<void> {
  if (!MAILGUN_API_KEY) {
    console.error('❌ Error: MAILGUN_API_KEY not found in .env.local');
    process.exit(1);
  }

  const url = `https://api.${MAILGUN_REGION}.mailgun.net/v3/domains/${MAILGUN_DOMAIN}`;
  
  console.log('🔍 Checking Mailgun domain status...\n');
  console.log(`Domain: ${MAILGUN_DOMAIN}`);
  console.log(`Region: ${MAILGUN_REGION.toUpperCase()}`);
  console.log('─'.repeat(60));

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as DomainStatus;

    console.log('\n📊 Domain Status:');
    console.log(`   State: ${data.domain.state}`);
    console.log(`   Disabled: ${data.domain.is_disabled ? '❌ Yes' : '✅ No'}`);

    console.log('\n📤 Sending DNS Records:');
    data.sending_dns_records.forEach((record) => {
      const status = record.valid === 'valid' ? '✅' : '⏳';
      const recordName = record.name || 'N/A';
      console.log(`   ${status} ${record.record_type.padEnd(6)} - ${recordName}`);
      
      if (record.valid !== 'valid') {
        console.log(`      Status: ${record.valid}`);
        console.log(`      Value: ${record.value.substring(0, 50)}...`);
      }
    });

    console.log('\n📥 Receiving DNS Records:');
    data.receiving_dns_records.forEach((record) => {
      const status = record.valid === 'valid' ? '✅' : '⏳';
      console.log(`   ${status} ${record.record_type.padEnd(6)} - Priority ${record.priority} - ${record.value}`);
    });

    const allValid = [
      ...data.sending_dns_records,
      ...data.receiving_dns_records,
    ].every((record) => record.valid === 'valid');

    console.log('\n' + '─'.repeat(60));
    if (allValid) {
      console.log('🎉 All DNS records verified! Email verification is ready.');
    } else {
      console.log('⏳ Some DNS records are still pending verification.');
      console.log('   This can take up to 48 hours for full propagation.');
      console.log('   Run this script again later to check status.');
    }
    console.log('─'.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error checking domain status:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error('   Unknown error occurred');
    }
    process.exit(1);
  }
}

checkMailgunDomainStatus();
