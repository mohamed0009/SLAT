Write-Host "Pushing to GitHub repository..." -ForegroundColor Green

# Check for git installation
$gitPaths = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\cmd\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe"
)

$gitPath = $null
foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        $gitPath = $path
        break
    }
}

if ($null -eq $gitPath) {
    Write-Host "Git executable not found. Please install Git from https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

Write-Host "Found Git at: $gitPath" -ForegroundColor Green

# Execute Git commands
try {
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
    & $gitPath push -u origin master
    
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "Press any key to continue..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null 