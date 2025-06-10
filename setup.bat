@echo off
setlocal enabledelayedexpansion

:: Discord Bot Setup Script (Windows)
:: This script installs dependencies and creates the .env file

echo 🌻 Welcome to the Sunflower Discord Bot Setup!
echo ==============================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%
echo.

:: Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

:: Check if .env file already exists
if exist ".env" (
    echo ⚠️  .env file already exists!
    set /p "overwrite=Do you want to overwrite it? (y/N): "
    if /i not "!overwrite!"=="y" (
        echo Setup cancelled. Your existing .env file was not modified.
        pause
        exit /b 0
    )
)

echo 🔧 Creating .env file...
echo Please provide the following information:
echo.

echo 📋 Discord Bot Configuration
echo ----------------------------

:ask_token
set /p "DISCORD_TOKEN=Discord Bot Token: "
if "!DISCORD_TOKEN!"=="" (
    echo ❌ Discord Bot Token is required!
    goto ask_token
)

:ask_client_id
set /p "CLIENT_ID=Client ID (Application ID): "
if "!CLIENT_ID!"=="" (
    echo ❌ Client ID is required!
    goto ask_client_id
)

set /p "GUILD_ID=Guild ID (Server ID, optional for global commands): "

echo.
echo ⚙️  Bot Configuration
echo --------------------

set /p "PREFIX=Command Prefix [!]: "
if "!PREFIX!"=="" set "PREFIX=!"

set /p "TARGET_PHRASE=Target Phrase to track [verified]: "
if "!TARGET_PHRASE!"=="" set "TARGET_PHRASE=verified"

set /p "TARGET_EMOJI=Target Emoji for reactions [✅]: "
if "!TARGET_EMOJI!"=="" set "TARGET_EMOJI=✅"

set /p "TARGET_CHANNEL_ID=Target Channel ID (optional): "

set /p "TARGET_ROLE_ID=Target Role ID (optional): "

set /p "NEW_NICKNAME=New Nickname for verified members [Verified Member]: "
if "!NEW_NICKNAME!"=="" set "NEW_NICKNAME=Verified Member"

:: Create .env file
(
echo # Discord Bot Configuration
echo DISCORD_TOKEN=!DISCORD_TOKEN!
echo CLIENT_ID=!CLIENT_ID!
echo GUILD_ID=!GUILD_ID!
echo.
echo # Bot Configuration
echo PREFIX=!PREFIX!
echo TARGET_PHRASE=!TARGET_PHRASE!
echo TARGET_EMOJI=!TARGET_EMOJI!
echo TARGET_CHANNEL_ID=!TARGET_CHANNEL_ID!
echo TARGET_ROLE_ID=!TARGET_ROLE_ID!
echo NEW_NICKNAME=!NEW_NICKNAME!
) > .env

echo.
echo ✅ .env file created successfully!
echo.

:: Initialize database
echo 🗄️  Initializing database...
if exist "database\init.js" (
    node database\init.js
    if !errorlevel! equ 0 (
        echo ✅ Database initialized successfully!
    ) else (
        echo ⚠️  Database initialization failed, but continuing...
    )
) else (
    echo ⚠️  Database initialization script not found, skipping...
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Deploy slash commands: npm run deploy
echo 2. Start the bot: npm start
echo.
echo 📝 Configuration saved to .env file
echo 📚 For more information, check the README.md file
echo.
echo 🌻 Happy botting!
echo.
pause
