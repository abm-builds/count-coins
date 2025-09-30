import { z } from 'zod';
import { TransactionType, TransactionCategory, BudgetRule } from '@prisma/client';

// Auth validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Transaction validation schemas
export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.nativeEnum(TransactionType),
  category: z.nativeEnum(TransactionCategory),
  description: z.string().min(1, 'Description is required').max(255, 'Description too long'),
  date: z.string().datetime().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

// Budget validation schemas
export const createBudgetSchema = z.object({
  rule: z.nativeEnum(BudgetRule),
  needs: z.number().min(0).max(100).optional(),
  wants: z.number().min(0).max(100).optional(),
  savings: z.number().min(0).max(100).optional(),
}).refine((data) => {
  if (data.rule === BudgetRule.CUSTOM) {
    const total = (data.needs || 0) + (data.wants || 0) + (data.savings || 0);
    return total === 100;
  }
  return true;
}, {
  message: 'Custom budget percentages must total 100%',
});

// Goal validation schemas
export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  targetAmount: z.number().positive('Target amount must be positive'),
  deadline: z.string().datetime().optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  targetAmount: z.number().positive().optional(),
  currentAmount: z.number().min(0).optional(),
  deadline: z.string().datetime().optional(),
});

// Query validation schemas
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
});

export const transactionQuerySchema = paginationSchema.extend({
  type: z.nativeEnum(TransactionType).optional(),
  category: z.nativeEnum(TransactionCategory).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Validation helper functions
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new Error(`Validation error: ${formattedErrors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
};

export const validateQuery = <T>(schema: z.ZodSchema<T>, query: any): T => {
  try {
    return schema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new Error(`Query validation error: ${formattedErrors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
};
