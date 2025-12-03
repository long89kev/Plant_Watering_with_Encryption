/**
 * Test script for REST API endpoints
 * Run this to test all API endpoints
 * 
 * Usage: node test-api.js
 */

const API_BASE = 'http://localhost:3001/api';

async function testEndpoint(method, endpoint, data = null) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`\n${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`\n❌ Error testing ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing Smart Watering Backend API\n');
  console.log('='.repeat(50));
  
  // Test 1: Health check
  console.log('\n📋 Test 1: Health Check');
  await testEndpoint('GET', '/health');
  
  // Test 2: Get sensors
  console.log('\n📋 Test 2: Get Sensor Data');
  await testEndpoint('GET', '/sensors');
  
  // Test 3: Get status
  console.log('\n📋 Test 3: Get System Status');
  await testEndpoint('GET', '/status');
  
  // Test 4: Get mode
  console.log('\n📋 Test 4: Get Current Mode');
  await testEndpoint('GET', '/mode');
  
  // Test 5: Set mode to manual
  console.log('\n📋 Test 5: Set Mode to Manual');
  await testEndpoint('POST', '/mode', { mode: 'manual' });
  
  // Test 6: Verify mode changed
  console.log('\n📋 Test 6: Verify Mode Changed');
  await testEndpoint('GET', '/mode');
  
  // Test 7: Start pump
  console.log('\n📋 Test 7: Start Pump (10 seconds)');
  await testEndpoint('POST', '/pump/start', { duration: 10 });
  
  // Test 8: Check status (pump should be on)
  console.log('\n📋 Test 8: Check Status (Pump Should Be On)');
  await testEndpoint('GET', '/status');
  
  // Wait 2 seconds
  console.log('\n⏳ Waiting 2 seconds...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 9: Check status again (should show remaining time)
  console.log('\n📋 Test 9: Check Status Again (Remaining Time)');
  await testEndpoint('GET', '/status');
  
  // Test 10: Stop pump
  console.log('\n📋 Test 10: Stop Pump');
  await testEndpoint('POST', '/pump/stop');
  
  // Test 11: Verify pump stopped
  console.log('\n📋 Test 11: Verify Pump Stopped');
  await testEndpoint('GET', '/status');
  
  // Test 12: Try to stop pump again (should fail)
  console.log('\n📋 Test 12: Try to Stop Pump Again (Should Fail)');
  await testEndpoint('POST', '/pump/stop');
  
  // Test 13: Set mode to automatic
  console.log('\n📋 Test 13: Set Mode to Automatic');
  await testEndpoint('POST', '/mode', { mode: 'automatic' });
  
  // Test 14: Invalid mode (should fail)
  console.log('\n📋 Test 14: Try Invalid Mode (Should Fail)');
  await testEndpoint('POST', '/mode', { mode: 'invalid' });
  
  console.log('\n' + '='.repeat(50));
  console.log('\n✅ All tests completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or install node-fetch');
  console.log('Alternatively, use curl commands or Postman to test the API');
  process.exit(1);
}

runTests().catch(console.error);

