/**
 * Test script for cron endpoints
 * Tests all three cron jobs to verify they work correctly
 */

import 'dotenv/config';

const PRODUCTION_URL = 'https://getghostindex.com';
const CRON_SECRET = process.env.CRON_SECRET;

if (!CRON_SECRET) {
  console.error('❌ CRON_SECRET not found in environment variables');
  process.exit(1);
}

interface CronTestResult {
  endpoint: string;
  success: boolean;
  status: number;
  data?: any;
  error?: string;
  duration: number;
}

async function testCronEndpoint(
  endpoint: string,
  description: string
): Promise<CronTestResult> {
  const startTime = Date.now();
  
  console.log(`\n🔄 Testing: ${description}`);
  console.log(`   Endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(`${PRODUCTION_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
      },
    });
    
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success (${response.status}) - ${duration}ms`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
      
      return {
        endpoint,
        success: true,
        status: response.status,
        data,
        duration,
      };
    } else {
      console.log(`❌ Failed (${response.status}) - ${duration}ms`);
      console.log(`   Error:`, JSON.stringify(data, null, 2));
      
      return {
        endpoint,
        success: false,
        status: response.status,
        error: JSON.stringify(data),
        duration,
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ Request failed - ${duration}ms`);
    console.log(`   Error:`, error);
    
    return {
      endpoint,
      success: false,
      status: 0,
      error: String(error),
      duration,
    };
  }
}

async function testUnauthorizedAccess(endpoint: string): Promise<boolean> {
  console.log(`\n🔒 Testing unauthorized access protection for ${endpoint}`);
  
  try {
    const response = await fetch(`${PRODUCTION_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer wrong-secret',
      },
    });
    
    if (response.status === 401) {
      console.log(`✅ Correctly rejected unauthorized request (401)`);
      return true;
    } else {
      console.log(`❌ Security issue: Accepted unauthorized request (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error testing unauthorized access:`, error);
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         GhostIndex Cron Endpoint Testing Suite            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\n📍 Testing against: ${PRODUCTION_URL}`);
  console.log(`🔑 Using CRON_SECRET: ${CRON_SECRET!.substring(0, 8)}...`);
  
  const results: CronTestResult[] = [];
  
  // Test 1: Auto-ghost endpoint
  results.push(
    await testCronEndpoint(
      '/api/cron/auto-ghost',
      'Auto-ghost stale applications'
    )
  );
  
  // Test 2: Update scores endpoint
  results.push(
    await testCronEndpoint(
      '/api/cron/update-scores',
      'Update Ghost Index Scores'
    )
  );
  
  // Test 3: Ghost jobs endpoint
  results.push(
    await testCronEndpoint(
      '/api/cron/ghost-jobs',
      'Detect ghost job postings'
    )
  );
  
  // Test security
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║              Security Tests                                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const securityTests = await Promise.all([
    testUnauthorizedAccess('/api/cron/auto-ghost'),
    testUnauthorizedAccess('/api/cron/update-scores'),
    testUnauthorizedAccess('/api/cron/ghost-jobs'),
  ]);
  
  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    Test Summary                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const successCount = results.filter(r => r.success).length;
  const totalTests = results.length;
  const securityPassed = securityTests.every(t => t);
  
  console.log(`\n📊 Functionality Tests: ${successCount}/${totalTests} passed`);
  console.log(`🔒 Security Tests: ${securityPassed ? 'PASSED' : 'FAILED'}`);
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`   ${icon} ${result.endpoint} (${result.duration}ms)`);
  });
  
  console.log('\n📈 Performance:');
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  console.log(`   Average response time: ${avgDuration.toFixed(0)}ms`);
  
  if (successCount === totalTests && securityPassed) {
    console.log('\n✅ All tests passed! Cron endpoints are working correctly.');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
