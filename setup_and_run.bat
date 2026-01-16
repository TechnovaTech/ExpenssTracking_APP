@echo off
echo ========================================
echo    EXPENSE TRACKER OTP SETUP GUIDE
echo ========================================
echo.

echo Step 1: Install Backend Dependencies
echo ------------------------------------
cd expenss_trackerAdmin
if not exist node_modules (
    echo Installing npm packages...
    npm install
) else (
    echo Dependencies already installed.
)
echo.

echo Step 2: Check Environment Variables
echo ----------------------------------
if exist .env.local (
    echo ✅ .env.local file found
    echo Email configuration:
    findstr "EMAIL_USER" .env.local
    echo.
) else (
    echo ❌ .env.local file not found!
    echo Please create .env.local with your email configuration.
    pause
    exit /b 1
)

echo Step 3: Start Backend Server
echo -----------------------------
echo Starting Next.js server on http://localhost:3000
echo.
echo ⚠️  IMPORTANT: Keep this window open while testing!
echo ⚠️  The Flutter app needs this server to be running.
echo.
echo Press Ctrl+C to stop the server when done.
echo.
pause
npm run dev