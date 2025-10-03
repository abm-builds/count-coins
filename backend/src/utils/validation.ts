import { z } from 'zod';
import { TransactionType, TransactionCategory, BudgetRule } from '@/types';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Transaction schemas
export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.enum(['NEEDS', 'WANTS', 'SAVINGS']),
  description: z.string().min(1, 'Description is required').max(200, 'Description too long'),
  date: z.string().datetime().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

// Budget schemas
export const createBudgetSchema = z.object({
  rule: z.enum(['FIFTY_THIRTY_TWENTY', 'SIXTY_TWENTY_TWENTY', 'SEVENTY_TWENTY_TEN', 'CUSTOM']),
  customAllocation: z.object({
    needs: z.number().min(0).max(100),
    wants: z.number().min(0).max(100),
    savings: z.number().min(0).max(100),
  }).optional(),
});

export const updateBudgetSchema = createBudgetSchema.partial();

// Goal schemas
export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().min(0).optional(),
  deadline: z.string().optional().refine((val) => {
    if (!val) return true; // Allow empty string
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    return dateRegex.test(val) || datetimeRegex.test(val);
  }, 'Deadline must be a valid date (YYYY-MM-DD) or datetime format'),
});

export const updateGoalSchema = createGoalSchema.partial();

// Query validation schemas
export const paginationSchema = z.object({
  page: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().min(1).optional().default(1)
  ),
  limit: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().min(1).max(100).optional().default(10)
  ),
});

export const transactionQuerySchema = paginationSchema.extend({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.enum(['NEEDS', 'WANTS', 'SAVINGS']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Validation helper functions
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Validation error: ${errorMessage}`);
    }
    throw error;
  }
};

export const validateQuery = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Validation error: ${errorMessage}`);
    }
    throw error;
  }
};