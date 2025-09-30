import { prisma } from '@/config/database';
import { Budget, BudgetRule, TransactionType, TransactionCategory } from '@prisma/client';
import { CreateBudgetRequest, BudgetSummary } from '@/types';
import { createError } from '@/middleware/errorHandler';

export class BudgetService {
  static async createBudget(userId: string, data: CreateBudgetRequest): Promise<Budget> {
    // Check if user already has a budget
    const existingBudget = await prisma.budget.findFirst({
      where: { userId },
    });

    if (existingBudget) {
      throw createError('User already has a budget. Update existing budget instead.', 409);
    }

    const budget = await prisma.budget.create({
      data: {
        ...data,
        userId,
      },
    });

    return budget;
  }

  static async getBudget(userId: string): Promise<Budget | null> {
    const budget = await prisma.budget.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return budget;
  }

  static async updateBudget(userId: string, data: CreateBudgetRequest): Promise<Budget> {
    const existingBudget = await this.getBudget(userId);

    if (!existingBudget) {
      throw createError('Budget not found. Create a budget first.', 404);
    }

    const budget = await prisma.budget.update({
      where: { id: existingBudget.id },
      data,
    });

    return budget;
  }

  static async deleteBudget(userId: string): Promise<void> {
    const budget = await this.getBudget(userId);

    if (!budget) {
      throw createError('Budget not found', 404);
    }

    await prisma.budget.delete({
      where: { id: budget.id },
    });
  }

  static async getBudgetSummary(userId: string): Promise<BudgetSummary> {
    const budget = await this.getBudget(userId);
    if (!budget) {
      throw createError('Budget not found. Create a budget first.', 404);
    }

    // Get transaction stats
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const needsSpent = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.category === TransactionCategory.NEEDS)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const wantsSpent = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.category === TransactionCategory.WANTS)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const savingsSpent = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.category === TransactionCategory.SAVINGS)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate budget amounts based on income
    const needsBudget = (totalIncome * budget.needs) / 100;
    const wantsBudget = (totalIncome * budget.wants) / 100;
    const savingsBudget = (totalIncome * budget.savings) / 100;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      needsSpent,
      wantsSpent,
      savingsSpent,
      needsBudget,
      wantsBudget,
      savingsBudget,
      needsRemaining: needsBudget - needsSpent,
      wantsRemaining: wantsBudget - wantsSpent,
      savingsRemaining: savingsBudget - savingsSpent,
    };
  }
}
