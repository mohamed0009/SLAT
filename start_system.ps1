Write-Host "🚀 Starting Sign Language Detection System..." -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if ports are already in use
if (Test-Port 8000) {
    Write-Host "⚠️  Port 8000 is already in use. Django backend may already be running." -ForegroundColor Yellow
} else {
    Write-Host "📂 Starting Django Backend Server..." -ForegroundColor Green
    Start-Process -FilePath "cmd" -ArgumentList "/k", "cd sign_language_detection && python manage.py runserver 8000" -WindowStyle Normal
    Write-Host "✅ Django backend starting on port 8000" -ForegroundColor Green
}

Start-Sleep -Seconds 3

if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use. Next.js frontend may already be running." -ForegroundColor Yellow
} else {
    Write-Host "📂 Starting Next.js Frontend Server..." -ForegroundColor Green
    Start-Process -FilePath "cmd" -ArgumentList "/k", "cd sign-language-tool && npm run dev" -WindowStyle Normal
    Write-Host "✅ Next.js frontend starting on port 3000" -ForegroundColor Green
}

Write-Host ""
Write-Host "⏳ Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "🎉 System startup initiated!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Expected Server URLs:" -ForegroundColor White
Write-Host "   - Django Backend:  http://localhost:8000" -ForegroundColor Gray
Write-Host "   - Next.js Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "👉 Open http://localhost:3000 in your browser to start detecting signs!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Testing server connectivity..." -ForegroundColor Yellow

# Test servers after startup
Start-Sleep -Seconds 5

$frontendRunning = Test-Port 3000
$backendRunning = Test-Port 8000

Write-Host ""
Write-Host "📈 Server Status Check:" -ForegroundColor White
if ($frontendRunning) {
    Write-Host "   ✅ Frontend (Port 3000): RUNNING" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend (Port 3000): NOT RESPONDING" -ForegroundColor Red
}

if ($backendRunning) {
    Write-Host "   ✅ Backend (Port 8000): RUNNING" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend (Port 8000): NOT RESPONDING" -ForegroundColor Red
}

Write-Host ""
if ($frontendRunning -and $backendRunning) {
    Write-Host "🎊 SUCCESS! Both servers are running!" -ForegroundColor Green
    Write-Host "🚀 Your sign language detection system is ready!" -ForegroundColor Cyan
} elseif ($frontendRunning) {
    Write-Host "⚠️  Frontend is running, but backend is offline." -ForegroundColor Yellow
    Write-Host "   The system will work in client-only mode." -ForegroundColor Yellow
} elseif ($backendRunning) {
    Write-Host "⚠️  Backend is running, but frontend is offline." -ForegroundColor Yellow
    Write-Host "   Please check the frontend terminal for errors." -ForegroundColor Yellow
} else {
    Write-Host "❌ Both servers failed to start. Please check the terminal windows for errors." -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor White
Write-Host "   1. Check the opened terminal windows for any error messages" -ForegroundColor Gray
Write-Host "   2. Open http://localhost:3000 in Chrome or Firefox" -ForegroundColor Gray
Write-Host "   3. Allow camera permissions when prompted" -ForegroundColor Gray
Write-Host "   4. Click 'Start Detection' to begin sign language recognition" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 