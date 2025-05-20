@echo off
echo Pushing to GitHub repository...

:: Check if git exists
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Git is not installed or not in PATH
    exit /b 1
)

:: Set the new remote
git remote set-url origin https://github.com/mohamed0009/SLAT.git

:: Add all files
git add .

:: Commit changes
git commit -m "Initial commit"

:: Push to the repository
git push -u origin master

echo Done!
pause 