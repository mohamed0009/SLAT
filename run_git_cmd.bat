@echo off
start cmd.exe /k "echo Please run the following commands to push to GitHub:^

echo 1. First check if git is installed by running: git --version^

echo 2. If git is not installed, download it from: https://git-scm.com/download/win^

echo 3. After installing git, run these commands:^

echo git remote set-url origin https://github.com/mohamed0009/SLAT.git^

echo git add .^

echo git commit -m 'Initial commit'^

echo git push -u origin master^

echo.^

echo NOTE: You might need to authenticate with GitHub when pushing" 