@echo off
setlocal enabledelayedexpansion

:: KoalaStore Bot PM2 Management Script for Windows
:: This script provides easy PM2 management for Windows users

echo.
echo  ===================================================
echo  🐨 KOALA STORE BOT - PM2 Management (Windows)
echo  ===================================================
echo.

if "%1"=="" (
    echo  Usage: pm2-windows.bat [command]
    echo.
    echo  Available commands:
    echo    start     - Start the bot with PM2
    echo    stop      - Stop the bot
    echo    restart   - Restart the bot
    echo    reload    - Reload the bot (zero-downtime)
    echo    delete    - Remove bot from PM2
    echo    status    - Show PM2 status
    echo    logs      - Show live logs
    echo    monit     - Open PM2 monitoring
    echo    setup     - Initial setup (install PM2)
    echo    clean     - Clean session and restart
    echo.
    pause
    exit /b 1
)

set command=%1

if "%command%"=="setup" (
    echo 📦 Installing PM2 globally...
    npm install -g pm2
    if !errorlevel! equ 0 (
        echo ✅ PM2 installed successfully
        echo 📁 Creating logs directory...
        if not exist "logs" mkdir logs
        echo ✅ Setup complete!
    ) else (
        echo ❌ Failed to install PM2
    )
    goto end
)

if "%command%"=="start" (
    echo 🚀 Starting KoalaStore Bot with PM2...
    pm2 start ecosystem.config.js
    if !errorlevel! equ 0 (
        echo ✅ Bot started successfully!
        echo 📊 Checking status...
        pm2 status
    ) else (
        echo ❌ Failed to start bot
    )
    goto end
)

if "%command%"=="stop" (
    echo 🛑 Stopping KoalaStore Bot...
    pm2 stop koalastore-bot
    if !errorlevel! equ 0 (
        echo ✅ Bot stopped successfully!
    ) else (
        echo ❌ Failed to stop bot
    )
    goto end
)

if "%command%"=="restart" (
    echo 🔄 Restarting KoalaStore Bot...
    pm2 restart koalastore-bot
    if !errorlevel! equ 0 (
        echo ✅ Bot restarted successfully!
        pm2 status
    ) else (
        echo ❌ Failed to restart bot
    )
    goto end
)

if "%command%"=="reload" (
    echo 🔄 Reloading KoalaStore Bot (zero-downtime)...
    pm2 reload koalastore-bot
    if !errorlevel! equ 0 (
        echo ✅ Bot reloaded successfully!
        pm2 status
    ) else (
        echo ❌ Failed to reload bot
    )
    goto end
)

if "%command%"=="delete" (
    echo 🗑️ Removing KoalaStore Bot from PM2...
    pm2 delete koalastore-bot
    if !errorlevel! equ 0 (
        echo ✅ Bot removed from PM2!
    ) else (
        echo ❌ Failed to remove bot
    )
    goto end
)

if "%command%"=="status" (
    echo 📊 PM2 Status:
    pm2 status
    goto end
)

if "%command%"=="logs" (
    echo 📝 Showing live logs (Ctrl+C to exit):
    pm2 logs koalastore-bot
    goto end
)

if "%command%"=="monit" (
    echo 📊 Opening PM2 monitoring dashboard...
    pm2 monit
    goto end
)

if "%command%"=="clean" (
    echo 🧹 Cleaning session and restarting...
    pm2 stop koalastore-bot
    if exist "sessionn" (
        rmdir /s /q sessionn
        echo ✅ Session cleaned
    )
    pm2 start ecosystem.config.js
    if !errorlevel! equ 0 (
        echo ✅ Bot restarted with clean session!
    ) else (
        echo ❌ Failed to restart bot
    )
    goto end
)

echo ❌ Unknown command: %command%
echo Use 'pm2-windows.bat' without arguments to see available commands.

:end
echo.
pause 