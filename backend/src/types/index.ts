import { User, Transaction, Budget, Goal, TransactionType, TransactionCategory, BudgetRule } from '@prisma/client';

// Re-export Prisma types
export type { User, Transaction, Budget, Goal, TransactionType, TransactionCategory, BudgetRule };

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name?: string | undefined;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string | undefined;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// Transaction types
export interface CreateTransactionRequest {
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date?: string | undefined;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {}

// Budget types
export interface CreateBudgetRequest {
  rule: BudgetRule;
  needs?: number;
  wants?: number;
  savings?: number;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  needsSpent: number;
  wantsSpent: number;
  savingsSpent: number;
  needsBudget: number;
  wantsBudget: number;
  savingsBudget: number;
  needsRemaining: number;
  wantsRemaining: number;
  savingsRemaining: number;
}

// Goal types
export interface CreateGoalRequest {
  title: string;
  targetAmount: number;
  currentAmount?: number | undefined;
  deadline?: string | undefined;
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  currentAmount?: number | undefined;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}