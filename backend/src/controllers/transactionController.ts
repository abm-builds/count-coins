import { Request, Response } from 'express';
import { TransactionService } from '@/services/transactionService';
import { validateRequest, validateQuery } from '@/utils/validation';
import { createTransactionSchema, updateTransactionSchema, transactionQuerySchema } from '@/utils/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

export class TransactionController {
  static createTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateRequest(createTransactionSchema, req.body);
    const transaction = await TransactionService.createTransaction(req.user!.id, data);

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully',
    });
  });

  static getTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const query = validateQuery(transactionQuerySchema, req.query);
    const { transactions, total } = await TransactionService.getTransactions(req.user!.id, query as any);

    const totalPages = Math.ceil(total / (Number(query.limit) || 10));

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    });
  });

  static getTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new Error('Transaction ID is required');
    const transaction = await TransactionService.getTransactionById(req.user!.id, id);

    res.json({
      success: true,
      data: transaction,
    });
  });

  static updateTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new Error('Transaction ID is required');
    const data = validateRequest(updateTransactionSchema, req.body);
    const transaction = await TransactionService.updateTransaction(req.user!.id, id, data);

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully',
    });
  });

  static deleteTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new Error('Transaction ID is required');
    await TransactionService.deleteTransaction(req.user!.id, id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  });

  static getStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const stats = await TransactionService.getTransactionStats(req.user!.id);

    res.json({
      success: true,
      data: stats,
    });
  });
}
