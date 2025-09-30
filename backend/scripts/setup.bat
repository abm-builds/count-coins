@echo off
echo 🚀 Setting up Count Coins Backend API...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v18 or higher) first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please edit .env file with your database and JWT configuration
) else (
    echo ✅ .env file already exists
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run db:generate

REM Check if database is accessible
echo 🗄️  Testing database connection...
npm run db:push >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database connection successful
) else (
    echo ⚠️  Database connection failed. Please check your DATABASE_URL in .env
    echo    You can run 'npm run db:push' manually after configuring your database
)

echo.
echo 🎉 Backend setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your database URL and JWT secret
echo 2. Run 'npm run db:push' to sync database schema
echo 3. Run 'npm run dev' to start the development server
echo.
echo 🔗 API will be available at: http://localhost:3001
echo 📊 Health check: http://localhost:3001/api/health
echo.
echo 📚 For more information, see README.md
pause
