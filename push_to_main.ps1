Write-Host "Pushing to GitHub repository..." -ForegroundColor Green

$gitPath = "C:\Program Files\Git\cmd\git.exe"

Write-Host "Found Git at: $gitPath" -ForegroundColor Green

# Execute Git commands
try {
    # Create and checkout main branch
    & $gitPath checkout -b main
    Write-Host "Created and switched to main branch" -ForegroundColor Green
    
    # Set the remote URL
    & $gitPath remote set-url origin https://github.com/mohamed0009/SLAT.git
    Write-Host "Remote URL set to https://github.com/mohamed0009/SLAT.git" -ForegroundColor Green
    
    # Add all files
    & $gitPath add .
    Write-Host "Added all files to staging" -ForegroundColor Green
    
    # Commit changes
    & $gitPath commit -m "Initial commit"
    Write-Host "Committed changes" -ForegroundColor Green
    
    # Push to the repository
    & $gitPath push -u origin main
    
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "Press any key to continue..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null 