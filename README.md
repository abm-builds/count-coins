# Count Coins - Finance Tracker PWA

A comprehensive personal finance management application built with modern web technologies.

## 🏗️ Project Architecture

```
count-coins/
├── frontend/                 # React PWA Frontend
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── contexts/        # State Management
│   │   ├── pages/           # Route Components
│   │   └── ...
│   └── package.json
├── backend/                  # Node.js API Backend
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/      # Request Handlers
│   │   ├── middleware/      # Custom Middleware
│   │   ├── routes/          # API Routes
│   │   ├── services/        # Business Logic
│   │   └── ...
│   ├── prisma/              # Database Schema
│   └── package.json
└── package.json             # Root Workspace
```

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Query** for data fetching
- **Zod** for validation

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Prisma ORM** with **PostgreSQL**
- **JWT** authentication with **bcrypt**
- **Zod** for request validation
- **Rate limiting** and security middleware

### Database
- **PostgreSQL** (Supabase compatible)
- **Prisma** for schema management
- **JWT** for stateless authentication

## 📋 Core Features

### 💰 Transaction Management
- Add income and expenses
- Categorize transactions (Needs, Wants, Savings)
- Transaction history with filtering
- Real-time balance calculation

### 📊 Budget Tracking
- 50/30/20 rule implementation
- Custom budget allocation
- Progress tracking against budget
- Visual budget summaries

### 🎯 Financial Goals
- Set savings goals with deadlines
- Track progress toward goals
- Goal completion statistics
- Flexible goal management

### 🔐 User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- User profile management
- Rate limiting for security

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Setup backend:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your database URL and JWT secret
   npm run db:generate
   npm run db:push
   ```

3. **Start development servers:**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start individually
   npm run dev:backend  # Backend on :3001
   npm run dev          # Frontend on :5173
   ```

### Database Setup

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE count_coins_db;
   ```

2. **Configure environment:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/count_coins_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   ```

3. **Run database migrations:**
   ```bash
   npm run db:push
   ```

## 📡 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 🔐 Authentication Endpoints

#### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  },
  "message": "User created successfully"
}
```

#### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### GET /auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

#### PUT /auth/me
Update user profile.

#### DELETE /auth/me
Delete user account.

### 💰 Transaction Endpoints

#### POST /transactions
Create a new transaction.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 150.50,
  "type": "EXPENSE",
  "category": "NEEDS",
  "description": "Grocery shopping",
  "date": "2024-01-01T00:00:00.000Z"
}
```

#### GET /transactions
Get user transactions with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `type` (optional): Filter by type (INCOME, EXPENSE)
- `category` (optional): Filter by category (NEEDS, WANTS, SAVINGS)
- `startDate` (optional): Filter from date (ISO string)
- `endDate` (optional): Filter to date (ISO string)

#### GET /transactions/stats
Get transaction statistics.

#### GET /transactions/:id
Get specific transaction.

#### PUT /transactions/:id
Update transaction.

#### DELETE /transactions/:id
Delete transaction.

### 📊 Budget Endpoints

#### POST /budget
Create budget with allocation rules.

**Request Body:**
```json
{
  "rule": "FIFTY_THIRTY_TWENTY",
  "needs": 50,
  "wants": 30,
  "savings": 20
}
```

#### GET /budget
Get current budget.

#### PUT /budget
Update budget.

#### DELETE /budget
Delete budget.

#### GET /budget/summary
Get budget summary with progress.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000.00,
    "totalExpenses": 3000.00,
    "balance": 2000.00,
    "needsSpent": 1500.00,
    "wantsSpent": 1000.00,
    "savingsSpent": 500.00,
    "needsBudget": 2500.00,
    "wantsBudget": 1500.00,
    "savingsBudget": 1000.00,
    "needsRemaining": 1000.00,
    "wantsRemaining": 500.00,
    "savingsRemaining": 500.00
  }
}
```

### 🎯 Goals Endpoints

#### POST /goals
Create financial goal.

**Request Body:**
```json
{
  "title": "Emergency Fund",
  "targetAmount": 10000.00,
  "deadline": "2024-12-31T23:59:59.000Z"
}
```

#### GET /goals
Get all user goals.

#### GET /goals/progress
Get goals progress summary.

#### GET /goals/:id
Get specific goal.

#### PUT /goals/:id
Update goal.

#### DELETE /goals/:id
Delete goal.

## 📝 Data Types

### Transaction Types
- `INCOME` - Money coming in
- `EXPENSE` - Money going out

### Transaction Categories
- `NEEDS` - Essential expenses (rent, food, utilities)
- `WANTS` - Non-essential expenses (entertainment, dining out)
- `SAVINGS` - Savings and debt payments

### Budget Rules
- `FIFTY_THIRTY_TWENTY` - 50% needs, 30% wants, 20% savings
- `SIXTY_TWENTY_TWENTY` - 60% needs, 20% wants, 20% savings
- `SEVENTY_TWENTY_TEN` - 70% needs, 20% wants, 10% savings
- `CUSTOM` - User-defined percentages

## 🔒 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent abuse
- **Input Validation** with Zod schemas
- **CORS Protection** with configurable origins
- **Helmet** for security headers
- **Error Handling** without information leakage

## 📊 Database Schema

### Users
- Authentication and profile information
- Secure password storage

### Transactions
- Income and expense tracking
- Category-based organization
- Date and amount tracking

### Budgets
- Budget rule configuration
- Percentage-based allocation
- User-specific budgets

### Goals
- Financial goal setting
- Progress tracking
- Deadline management

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to Render/Heroku/AWS

### Frontend Deployment
1. Build production bundle
2. Deploy to Vercel/Netlify
3. Configure API endpoints

### Environment Variables
```env
# Backend
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=your-frontend-url

# Frontend
VITE_API_URL=your-backend-url
```

## 📈 Performance & Scalability

- **Database Connection Pooling**
- **Efficient Prisma Queries**
- **Rate Limiting**
- **Compression Middleware**
- **Proper Indexing**
- **Stateless API Design**

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Linting
npm run lint:all
```

## ⚠️ Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🔒 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Sensitive Operations**: 20 requests per 15 minutes

Rate limit headers are included in responses:
- `X-RateLimit-Limit` - Request limit
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Reset timestamp

## 🤝 Contributing

1. Follow established architecture patterns
2. Maintain TypeScript strict mode
3. Use ESLint for code quality
4. Write comprehensive tests
5. Update documentation

## 📄 License

This project is private and proprietary.

---

## 🎯 Next Steps

1. **Setup Database**: Configure PostgreSQL and run migrations
2. **Environment Setup**: Configure environment variables
3. **Development**: Start both frontend and backend servers
4. **Testing**: Test API endpoints and frontend functionality
5. **Deployment**: Deploy to production environment

## 📚 Available Scripts

### Root Level
- `npm run dev:full` - Start both frontend and backend
- `npm run dev:backend` - Start backend only
- `npm run dev` - Start frontend only
- `npm run build:all` - Build both frontend and backend
- `npm run install:all` - Install all dependencies
- `npm run lint:all` - Lint both frontend and backend

### Database Scripts
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

For detailed setup instructions, see the individual README files in each directory.