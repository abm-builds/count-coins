#!/bin/bash

# Count Coins Backend Setup Script
echo "🚀 Setting up Count Coins Backend API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database and JWT configuration"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Check if database is accessible
echo "🗄️  Testing database connection..."
if npm run db:push --silent; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection failed. Please check your DATABASE_URL in .env"
    echo "   You can run 'npm run db:push' manually after configuring your database"
fi

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your database URL and JWT secret"
echo "2. Run 'npm run db:push' to sync database schema"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "🔗 API will be available at: http://localhost:3001"
echo "📊 Health check: http://localhost:3001/api/health"
echo ""
echo "📚 For more information, see README.md"
