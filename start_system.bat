@echo off
echo 🚀 Starting Sign Language Detection System...
echo.

echo 📂 Starting Django Backend Server...
start "Django Backend" cmd /k "cd sign_language_detection && python manage.py runserver 8000"

echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo 📂 Starting Next.js Frontend Server...
start "Next.js Frontend" cmd /k "cd sign-language-tool && npm run dev"

echo ⏳ Waiting for frontend to initialize...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 System is starting up!
echo.
echo 📊 Server Status:
echo   - Django Backend: http://localhost:8000
echo   - Next.js Frontend: http://localhost:3000
echo.
echo 👉 Open http://localhost:3000 in your browser to start detecting signs!
echo.
echo ⚠️  Note: It may take a few moments for both servers to fully start.
echo    Check the opened terminal windows for startup progress.
echo.
pause 