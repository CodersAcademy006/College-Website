import { Counter, Gauge } from 'prom-client';
import { register } from 'prom-client';

// Create test metrics
const testCounter = new Counter({
  name: 'test_errors_total',
  help: 'Total number of test errors',
  labelNames: ['severity']
});

const testGauge = new Gauge({
  name: 'test_resource_usage',
  help: 'Test resource usage',
  labelNames: ['resource']
});

// Function to simulate high error rate
function simulateHighErrorRate() {
  console.log('Simulating high error rate...');
  for (let i = 0; i < 100; i++) {
    testCounter.inc({ severity: 'critical' });
  }
}

// Function to simulate high resource usage
function simulateHighResourceUsage() {
  console.log('Simulating high resource usage...');
  testGauge.set({ resource: 'cpu' }, 95);
  testGauge.set({ resource: 'memory' }, 90);
}

// Function to simulate service unavailability
function simulateServiceUnavailable() {
  console.log('Simulating service unavailability...');
  testGauge.set({ resource: 'service_health' }, 0);
}

// Function to reset metrics
function resetMetrics() {
  console.log('Resetting metrics...');
  testCounter.reset();
  testGauge.reset();
}

// Main function to run tests
async function runTests() {
  console.log('Starting alert tests...');
  
  // Test 1: High error rate
  simulateHighErrorRate();
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test 2: High resource usage
  simulateHighResourceUsage();
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test 3: Service unavailability
  simulateServiceUnavailable();
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Reset metrics
  resetMetrics();
  
  console.log('Alert tests completed.');
}

// Run tests
runTests().catch(console.error); 