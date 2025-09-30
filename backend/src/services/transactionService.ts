import { prisma } from '@/config/database';
import { Transaction, TransactionType, TransactionCategory } from '@prisma/client';
import { CreateTransactionRequest, UpdateTransactionRequest } from '@/types';
import { createError } from '@/middleware/errorHandler';

export class TransactionService {
  static async createTransaction(
    userId: string,
    data: CreateTransactionRequest
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        userId,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });

    return transaction;
  }

  static async getTransactions(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      type?: TransactionType;
      category?: TransactionCategory;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
    } = options;

    const where: any = { userId };

    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, total };
  }

  static async getTransactionById(
    userId: string,
    transactionId: string
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw createError('Transaction not found', 404);
    }

    return transaction;
  }

  static async updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionRequest
  ): Promise<Transaction> {
    // Check if transaction exists and belongs to user
    await this.getTransactionById(userId, transactionId);

    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
    });

    return transaction;
  }

  static async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    // Check if transaction exists and belongs to user
    await this.getTransactionById(userId, transactionId);

    await prisma.transaction.delete({
      where: { id: transactionId },
    });
  }

  static async getTransactionStats(userId: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    needsSpent: number;
    wantsSpent: number;
    savingsSpent: number;
  }> {
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

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      needsSpent,
      wantsSpent,
      savingsSpent,
    };
  }
}
