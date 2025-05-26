// Test script to verify MediaPipe error handling
const puppeteer = require('puppeteer');

async function testMediaPipeErrorHandling() {
  console.log('🧪 Testing MediaPipe Error Handling...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Listen for uncaught exceptions
    page.on('pageerror', error => {
      errors.push(`Page Error: ${error.message}`);
    });
    
    console.log('📱 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for the page to load and initialize
    await page.waitForTimeout(5000);
    
    console.log('🔍 Checking for MediaPipe errors...');
    
    // Check if there are any MediaPipe-related errors
    const mediaPipeErrors = errors.filter(error => 
      error.includes('MediaPipe') || 
      error.includes('mediapipe') ||
      error.includes('Failed to initialize')
    );
    
    if (mediaPipeErrors.length === 0) {
      console.log('✅ SUCCESS: No MediaPipe errors detected!');
      console.log('✅ Error handling is working correctly');
    } else {
      console.log('❌ FAILURE: MediaPipe errors still present:');
      mediaPipeErrors.forEach(error => console.log(`   - ${error}`));
    }
    
    // Check if the app is still functional
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check if main components are present
    const hasWebcamFeed = await page.$('.webcam-feed, [data-testid="webcam-feed"]') !== null;
    const hasDetectionDashboard = await page.$('text=Real-Time Detection Dashboard') !== null;
    
    console.log(`📹 Webcam feed present: ${hasWebcamFeed ? '✅' : '❌'}`);
    console.log(`📊 Detection dashboard present: ${hasDetectionDashboard ? '✅' : '❌'}`);
    
    // Check for system notifications
    const notifications = await page.$$eval('[class*="notification"], [class*="toast"]', 
      elements => elements.map(el => el.textContent)
    );
    
    if (notifications.length > 0) {
      console.log('🔔 System notifications:');
      notifications.forEach(notification => console.log(`   - ${notification}`));
    }
    
    console.log('\n📊 Test Summary:');
    console.log(`   Total console errors: ${errors.length}`);
    console.log(`   MediaPipe errors: ${mediaPipeErrors.length}`);
    console.log(`   App functional: ${title.includes('SLAT') ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testMediaPipeErrorHandling().catch(console.error); 