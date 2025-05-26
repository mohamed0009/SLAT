const http = require('http');

function testServer(port, name) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}`, (res) => {
            console.log(`✅ ${name} server is running on port ${port} (Status: ${res.statusCode})`);
            resolve(true);
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${name} server is NOT running on port ${port}`);
            resolve(false);
        });
        
        req.setTimeout(3000, () => {
            console.log(`⏰ ${name} server timeout on port ${port}`);
            req.destroy();
            resolve(false);
        });
    });
}

async function checkServers() {
    console.log('🔍 Checking server status...\n');
    
    const frontendRunning = await testServer(3000, 'Next.js Frontend');
    const backendRunning = await testServer(8000, 'Django Backend');
    
    console.log('\n📊 Server Status Summary:');
    console.log(`Frontend (Next.js): ${frontendRunning ? '🟢 RUNNING' : '🔴 STOPPED'}`);
    console.log(`Backend (Django): ${backendRunning ? '🟢 RUNNING' : '🔴 STOPPED'}`);
    
    if (frontendRunning && backendRunning) {
        console.log('\n🎉 Both servers are running! System ready for sign language detection.');
        console.log('👉 Open http://localhost:3000 in your browser to start detecting signs!');
    } else if (frontendRunning) {
        console.log('\n⚠️  Frontend is running but backend is offline.');
        console.log('   The system will work in client-only mode with reduced accuracy.');
        console.log('👉 Open http://localhost:3000 to use the system.');
    } else if (backendRunning) {
        console.log('\n⚠️  Backend is running but frontend is offline.');
        console.log('   Please start the Next.js frontend to use the web interface.');
    } else {
        console.log('\n🔴 Both servers are offline. Please start them:');
        console.log('   Frontend: cd sign-language-tool && npm run dev');
        console.log('   Backend: cd sign_language_detection && python manage.py runserver 8000');
    }
}

checkServers(); 