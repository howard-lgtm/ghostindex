#!/usr/bin/env tsx

/**
 * CRON_SECRET Rotation Script
 * 
 * Automates the rotation of the CRON_SECRET used for authenticating cron endpoints.
 * 
 * Prerequisites:
 * - VERCEL_TOKEN environment variable (get from https://vercel.com/account/tokens)
 * - VERCEL_PROJECT_ID environment variable
 * 
 * Usage:
 *   npm run rotate:cron-secret
 * 
 * What it does:
 * 1. Generates a new secure random secret
 * 2. Updates Vercel environment variables via API
 * 3. Triggers a production redeployment
 * 4. Tests all cron endpoints with the new secret
 * 5. Logs the rotation
 */

import { execSync } from 'child_process';
import { writeFileSync, appendFileSync, readFileSync } from 'fs';
import { join } from 'path';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional

interface RotationResult {
  success: boolean;
  newSecret?: string;
  error?: string;
  timestamp: string;
}

async function generateSecret(): Promise<string> {
  console.log('🔐 Generating new CRON_SECRET...');
  const secret = execSync('openssl rand -base64 32').toString().trim();
  console.log('✅ New secret generated');
  return secret;
}

async function updateVercelEnvVar(secret: string): Promise<void> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    throw new Error('Missing VERCEL_TOKEN or VERCEL_PROJECT_ID environment variables');
  }

  console.log('📤 Updating Vercel environment variable...');

  const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env/CRON_SECRET`;
  const headers = {
    'Authorization': `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
  };

  // First, get the existing env var ID
  const getUrl = VERCEL_TEAM_ID 
    ? `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`
    : `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env`;

  const getResponse = await fetch(getUrl, { headers });
  const envVars = await getResponse.json();
  
  const cronSecretVar = envVars.envs?.find((env: any) => env.key === 'CRON_SECRET');
  
  if (!cronSecretVar) {
    throw new Error('CRON_SECRET not found in Vercel environment variables');
  }

  // Update the env var
  const updateUrl = VERCEL_TEAM_ID
    ? `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env/${cronSecretVar.id}?teamId=${VERCEL_TEAM_ID}`
    : `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env/${cronSecretVar.id}`;

  const updateResponse = await fetch(updateUrl, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      value: secret,
      target: ['production', 'preview', 'development'],
    }),
  });

  if (!updateResponse.ok) {
    const error = await updateResponse.text();
    throw new Error(`Failed to update Vercel env var: ${error}`);
  }

  console.log('✅ Vercel environment variable updated');
}

async function triggerRedeployment(): Promise<void> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    throw new Error('Missing VERCEL_TOKEN or VERCEL_PROJECT_ID');
  }

  console.log('🚀 Triggering redeployment...');

  const url = VERCEL_TEAM_ID
    ? `https://api.vercel.com/v13/deployments?teamId=${VERCEL_TEAM_ID}`
    : 'https://api.vercel.com/v13/deployments';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: VERCEL_PROJECT_ID,
      target: 'production',
      gitSource: {
        type: 'github',
        ref: 'main',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to trigger redeployment: ${error}`);
  }

  const deployment = await response.json();
  console.log(`✅ Redeployment triggered: ${deployment.url}`);
  console.log('⏳ Waiting for deployment to complete (this may take 2-3 minutes)...');
  
  // Wait for deployment to be ready
  await new Promise(resolve => setTimeout(resolve, 180000)); // 3 minutes
}

async function testCronEndpoints(secret: string): Promise<boolean> {
  console.log('🧪 Testing cron endpoints with new secret...');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getghostindex.com';
  const endpoints = [
    '/api/cron/auto-ghost',
    '/api/cron/update-scores',
    '/api/cron/ghost-jobs',
  ];

  let allPassed = true;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secret}`,
        },
      });

      if (response.ok) {
        console.log(`  ✅ ${endpoint}: Working`);
      } else {
        console.log(`  ❌ ${endpoint}: Failed (${response.status})`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint}: Error - ${error}`);
      allPassed = false;
    }
  }

  return allPassed;
}

function updateLocalEnv(secret: string): void {
  console.log('📝 Updating .env.local...');
  
  const envPath = join(process.cwd(), '.env.local');
  let envContent = readFileSync(envPath, 'utf-8');
  
  // Replace CRON_SECRET value
  envContent = envContent.replace(
    /CRON_SECRET=.*/,
    `CRON_SECRET=${secret}`
  );
  
  writeFileSync(envPath, envContent);
  console.log('✅ .env.local updated');
}

function logRotation(result: RotationResult): void {
  console.log('📋 Logging rotation...');
  
  const logPath = join(process.cwd(), 'CRON_SECRET_ROTATION.md');
  const logEntry = `| ${result.timestamp} | Automated Script | ${result.success ? '✅ Success' : '❌ Failed'} | ${result.error || 'Rotation completed successfully'} |\n`;
  
  // Read the file and insert the log entry after the header row
  let content = readFileSync(logPath, 'utf-8');
  const headerEnd = content.indexOf('| Feb 26, 2026');
  
  if (headerEnd !== -1) {
    content = content.slice(0, headerEnd) + logEntry + content.slice(headerEnd);
    writeFileSync(logPath, content);
    console.log('✅ Rotation logged');
  } else {
    console.log('⚠️  Could not find log table in CRON_SECRET_ROTATION.md');
  }
}

async function main() {
  console.log('\n🔄 Starting CRON_SECRET rotation...\n');
  
  const timestamp = new Date().toISOString().split('T')[0];
  const result: RotationResult = {
    success: false,
    timestamp,
  };

  try {
    // Step 1: Generate new secret
    const newSecret = await generateSecret();
    result.newSecret = newSecret;

    // Step 2: Update local .env.local
    updateLocalEnv(newSecret);

    // Step 3: Update Vercel environment variable
    await updateVercelEnvVar(newSecret);

    // Step 4: Trigger redeployment
    await triggerRedeployment();

    // Step 5: Test endpoints
    const testsPass = await testCronEndpoints(newSecret);
    
    if (!testsPass) {
      throw new Error('Some cron endpoints failed testing');
    }

    // Step 6: Log rotation
    result.success = true;
    logRotation(result);

    console.log('\n✅ CRON_SECRET rotation completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Verify cron jobs run successfully over the next 24 hours');
    console.log('2. Update calendar reminder for next rotation (90 days)');
    console.log('3. Commit updated .env.local and rotation log to git\n');

  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    logRotation(result);
    
    console.error('\n❌ Rotation failed:', result.error);
    console.error('\nRollback steps:');
    console.error('1. Restore previous CRON_SECRET in Vercel');
    console.error('2. Redeploy');
    console.error('3. Investigate the error\n');
    
    process.exit(1);
  }
}

main();
